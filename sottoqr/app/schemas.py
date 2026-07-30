"""
Pydantic schemas - what the API accepts and returns.
Kept separate from app/models.py (SQLAlchemy) on purpose: DB shape and API
shape should be free to diverge (e.g. hiding internal fields from responses).
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class EvidenceResult(BaseModel):
    id: int
    filename: str
    integrity_score: Optional[float]
    verdict: Optional[str]
    reasons: Optional[str]  # JSON-encoded list, decode on the frontend
    ela_score: Optional[float]
    exif_score: Optional[float]
    blur_score: Optional[float]
    hist_score: Optional[float]
    block_score: Optional[float]
    rotation_score: Optional[float] = None
    screenshot_score: Optional[float] = None
    uploader_role: Optional[str] = None
    ed25519_signature: Optional[str] = None
    manifest_url: Optional[str] = None
    phash_match_flag: Optional[int]
    sha256_hash: Optional[str]
    seal_hash: Optional[str]
    sealed_at: Optional[str]
    qr_url: Optional[str] = None
    certificate_url: Optional[str] = None
    watermarked_url: Optional[str] = None

    class Config:
        from_attributes = True


class SealVerifyResult(BaseModel):
    filename: str
    valid: bool
    integrity_score: Optional[float]
    verdict: Optional[str]
    seal_hash: Optional[str]


class CaseCreate(BaseModel):
    case_reference: Optional[str] = Field(None, description="Public-safe case number, e.g. SQ-2026-0001. Auto-generated if left blank.")
    location: Optional[str] = None
    incident_summary: Optional[str] = None
    is_public: bool = True


class CaseStatusUpdate(BaseModel):
    status: str = Field(..., description="One of: Report, Investigation, Medical Support, Compensation, Final Resolution")
    status_notes: Optional[str] = None
    updated_by_agency: Optional[str] = Field(None, description="Which authority made this update, e.g. 'Investigation Authority'")


class CaseLinkEvidence(BaseModel):
    evidence_image_id: int


class CaseOut(BaseModel):
    id: int
    case_reference: str
    location: Optional[str]
    incident_summary: Optional[str]
    status: str
    updated_by_agency: Optional[str] = None
    is_public: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseDetailOut(CaseOut):
    linked_evidence: List[EvidenceResult] = []


class CustodyLogOut(BaseModel):
    id: int
    action: str
    actor_role: Optional[str]
    detail: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True
