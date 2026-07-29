"""
Shakkhi AI - main FastAPI app.

Layer 1 endpoints (Verification Engine):
  POST /api/verify              - upload an image, run forensics, seal it
  GET  /api/evidence            - list all sealed evidence (paginated)
  GET  /api/evidence/{id}       - one evidence record
  GET  /api/verify-seal/{id}    - independently re-check a seal (what a QR scan hits)

Layer 2 endpoints (Justice Tracker):
  POST  /api/cases                          - create a case
  GET   /api/cases                          - public transparency list (is_public=1 only)
  GET   /api/cases/{id}                     - case detail + linked evidence
  PATCH /api/cases/{id}/status              - update status (Report -> ... -> Final Resolution)
  POST  /api/cases/{id}/link-evidence       - attach a sealed evidence record to a case

Run:
    uvicorn app.main:app --reload
"""
import os
import shutil
import uuid
import json

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import init_db, get_db
from app.models import EvidenceImage, Case, CaseEvidence, CASE_STATUSES, CustodyLogEntry
from app.schemas import (
    EvidenceResult, SealVerifyResult, CaseCreate, CaseStatusUpdate,
    CaseLinkEvidence, CaseOut, CaseDetailOut, CustodyLogOut,
)
from app.forensics import analyze_image
from app.seal import seal_record, verify_seal
from app.custody import log_custody_action

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "uploads")
ELA_DIR = os.path.join(BASE_DIR, "static", "ela")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(ELA_DIR, exist_ok=True)

app = FastAPI(title="SottoQR - Truth Verification & Justice Tracker")

# wide open for hackathon demo purposes - lock this down before any real deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


@app.on_event("startup")
def on_startup():
    init_db()


def _to_evidence_result(rec: EvidenceImage) -> EvidenceResult:
    data = EvidenceResult.model_validate(rec)
    if rec.qr_path:
        data.qr_url = "/static/qr/" + os.path.basename(rec.qr_path)
    if rec.certificate_path:
        data.certificate_url = "/static/certificates/" + os.path.basename(rec.certificate_path)
    if rec.watermarked_path:
        data.watermarked_url = "/static/watermarked/" + os.path.basename(rec.watermarked_path)
    return data


# ---------------------------------------------------------------------------
# Layer 1: Verification Engine
# ---------------------------------------------------------------------------
@app.post("/api/verify", response_model=EvidenceResult)
async def verify_image(file: UploadFile = File(...), uploader_role: str = "Public", db: Session = Depends(get_db)):
    """
    The core demo endpoint: upload an image -> get back an Integrity Score,
    verdict, reasons, and a sealed certificate + QR code.
    uploader_role is a ROLE only (Journalist/Witness/Investigator/Public),
    never a name - it feeds the chain-of-custody log.
    """
    allowed_ext = {".jpg", ".jpeg", ".png"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_ext:
        raise HTTPException(400, f"Unsupported file type '{ext}'. Use jpg/jpeg/png.")

    # unique filename so re-uploads of the same name don't collide
    safe_filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, safe_filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    ela_visual_path = os.path.join(ELA_DIR, f"{safe_filename}_ela.png")
    result = analyze_image(filepath, save_ela_visual=ela_visual_path)

    record = EvidenceImage(
        filename=safe_filename,
        filepath=filepath,
        sha256_hash=result["sha256_hash"],
        phash=result["phash"],
        ela_score=result["ela_score"],
        exif_score=result["exif_score"],
        blur_score=result["blur_score"],
        hist_score=result["hist_score"],
        block_score=result["block_score"],
        rotation_score=result.get("rotation_score"),
        screenshot_score=result.get("screenshot_score"),
        phash_match_flag=result["phash_match_flag"],
        integrity_score=result["integrity_score"],
        verdict=result["verdict"],
        reasons=result["reasons"],
        uploader_role=uploader_role,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    log_custody_action(db, record.id, "Uploaded", actor_role=uploader_role)

    seal_record(db, record)
    db.commit()
    db.refresh(record)
    log_custody_action(db, record.id, "Verified", actor_role=uploader_role,
                        detail=f"Integrity Score {record.integrity_score:.1f}, verdict: {record.verdict}")

    return _to_evidence_result(record)


@app.get("/api/evidence", response_model=list[EvidenceResult])
def list_evidence(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(EvidenceImage).order_by(EvidenceImage.id.desc()).offset(skip).limit(limit).all()
    return [_to_evidence_result(r) for r in records]


@app.get("/api/evidence/{evidence_id}", response_model=EvidenceResult)
def get_evidence(evidence_id: int, db: Session = Depends(get_db)):
    rec = db.query(EvidenceImage).filter(EvidenceImage.id == evidence_id).first()
    if not rec:
        raise HTTPException(404, "Evidence not found")
    return _to_evidence_result(rec)


@app.get("/api/evidence/{evidence_id}/custody-log", response_model=list[CustodyLogOut])
def get_custody_log(evidence_id: int, db: Session = Depends(get_db)):
    """Full chain-of-custody history for one piece of evidence, oldest first."""
    return (
        db.query(CustodyLogEntry)
        .filter(CustodyLogEntry.evidence_image_id == evidence_id)
        .order_by(CustodyLogEntry.timestamp.asc())
        .all()
    )


@app.get("/api/verify-seal/{evidence_id}", response_model=SealVerifyResult)
def verify_seal_endpoint(evidence_id: int, db: Session = Depends(get_db)):
    """This is what scanning a certificate's QR code should hit."""
    rec = db.query(EvidenceImage).filter(EvidenceImage.id == evidence_id).first()
    if not rec:
        raise HTTPException(404, "Evidence not found")
    if not rec.seal_hash:
        raise HTTPException(400, "Evidence has not been sealed yet")
    valid = verify_seal(rec)
    return SealVerifyResult(
        filename=rec.filename, valid=valid,
        integrity_score=rec.integrity_score, verdict=rec.verdict, seal_hash=rec.seal_hash,
    )


# ---------------------------------------------------------------------------
# Layer 2: Justice Tracker
# ---------------------------------------------------------------------------
@app.post("/api/cases", response_model=CaseOut)
def create_case(payload: CaseCreate, db: Session = Depends(get_db)):
    existing = db.query(Case).filter(Case.case_reference == payload.case_reference).first()
    if existing:
        raise HTTPException(400, f"Case reference '{payload.case_reference}' already exists")

    case = Case(
        case_reference=payload.case_reference,
        location=payload.location,
        incident_summary=payload.incident_summary,
        is_public=1 if payload.is_public else 0,
        status="Report",
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    return case


@app.get("/api/cases", response_model=list[CaseOut])
def list_public_cases(db: Session = Depends(get_db)):
    """Public Transparency Portal feed - only cases marked is_public=1."""
    return db.query(Case).filter(Case.is_public == 1).order_by(Case.updated_at.desc()).all()


@app.get("/api/admin/cases", response_model=list[CaseOut])
def list_all_cases(db: Session = Depends(get_db)):
    """Admin view - ALL cases including ones pending review (is_public=0)."""
    return db.query(Case).order_by(Case.updated_at.desc()).all()


@app.patch("/api/cases/{case_id}/visibility", response_model=CaseOut)
def set_case_visibility(case_id: int, is_public: bool, db: Session = Depends(get_db)):
    """Admin approves a pending public report, or unpublishes one."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(404, "Case not found")
    case.is_public = 1 if is_public else 0
    db.commit()
    db.refresh(case)
    return case


@app.get("/api/cases/{case_id}", response_model=CaseDetailOut)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(404, "Case not found")

    links = db.query(CaseEvidence).filter(CaseEvidence.case_id == case_id).all()
    evidence_ids = [l.evidence_image_id for l in links]
    evidence_records = db.query(EvidenceImage).filter(EvidenceImage.id.in_(evidence_ids)).all() if evidence_ids else []

    detail = CaseDetailOut.model_validate(case)
    detail.linked_evidence = [_to_evidence_result(r) for r in evidence_records]
    return detail


@app.patch("/api/cases/{case_id}/status", response_model=CaseOut)
def update_case_status(case_id: int, payload: CaseStatusUpdate, db: Session = Depends(get_db)):
    if payload.status not in CASE_STATUSES:
        raise HTTPException(400, f"Status must be one of {CASE_STATUSES}")

    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(404, "Case not found")

    case.status = payload.status
    if payload.status_notes is not None:
        case.status_notes = payload.status_notes
    if payload.updated_by_agency is not None:
        case.updated_by_agency = payload.updated_by_agency
    db.commit()
    db.refresh(case)
    return case


@app.post("/api/cases/{case_id}/link-evidence", response_model=CaseDetailOut)
def link_evidence(case_id: int, payload: CaseLinkEvidence, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(404, "Case not found")

    evidence = db.query(EvidenceImage).filter(EvidenceImage.id == payload.evidence_image_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")

    already = db.query(CaseEvidence).filter(
        CaseEvidence.case_id == case_id,
        CaseEvidence.evidence_image_id == payload.evidence_image_id,
    ).first()
    if not already:
        db.add(CaseEvidence(case_id=case_id, evidence_image_id=payload.evidence_image_id))
        db.commit()
        log_custody_action(db, payload.evidence_image_id, "Linked to Case", actor_role="Admin",
                            detail=f"linked to case {case.case_reference}")

    return get_case(case_id, db)


@app.get("/verify/{evidence_id}")
def verify_page(evidence_id: int, request: Request, db: Session = Depends(get_db)):
    """This is what the QR code on every certificate points to."""
    rec = db.query(EvidenceImage).filter(EvidenceImage.id == evidence_id).first()
    seal_valid = verify_seal(rec) if rec and rec.seal_hash else False
    custody_log = []
    if rec:
        log_custody_action(db, rec.id, "Viewed", actor_role="Public", detail="QR scan / verify page view")
        custody_log = (
            db.query(CustodyLogEntry)
            .filter(CustodyLogEntry.evidence_image_id == rec.id)
            .order_by(CustodyLogEntry.timestamp.asc())
            .all()
        )
    return templates.TemplateResponse("verify_result.html", {
        "request": request, "evidence": rec, "seal_valid": seal_valid, "custody_log": custody_log,
    })


@app.get("/admin")
def admin_page(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})


@app.get("/")
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/info")
def api_info():
    return {
        "name": "SottoQR",
        "docs": "/docs",
        "layers": ["Layer 1: /api/verify, /api/evidence", "Layer 2: /api/cases"],
    }
