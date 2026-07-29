"""
Core DB models for Layer 1 (Verification Engine).
Layer 2 (Justice Tracker) models come later - not needed for the first 3 tasks.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.database import Base


class EvidenceImage(Base):
    """
    One row per uploaded/seeded image.
    Ground-truth `label`/`manipulation` columns exist ONLY because we have a
    labeled demo dataset to validate the scoring formula against - in
    production these stay NULL until a human reviewer confirms something.
    """
    __tablename__ = "evidence_images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True, nullable=False)
    filepath = Column(String, nullable=False)

    # ground truth from labels_fixed.xlsx - for pipeline testing/tuning only
    true_label = Column(String, nullable=True)          # "Authentic" / "Fake"
    true_manipulation = Column(String, nullable=True)   # "Blur", "Crop", etc.
    event = Column(String, nullable=True)

    # forensic signal outputs
    sha256_hash = Column(String, nullable=True)
    phash = Column(String, nullable=True)
    ela_score = Column(Float, nullable=True)
    exif_score = Column(Float, nullable=True)
    blur_score = Column(Float, nullable=True)
    hist_score = Column(Float, nullable=True)
    block_score = Column(Float, nullable=True)
    rotation_score = Column(Float, nullable=True)
    screenshot_score = Column(Float, nullable=True)
    phash_match_flag = Column(Integer, default=0)  # 1 if matches another image in registry

    # who submitted this - ROLE only, never a name/ID, so chain-of-custody
    # accountability doesn't come at the cost of witness/journalist safety
    uploader_role = Column(String, nullable=True)  # "Journalist" / "Witness" / "Investigator" / "Public"

    # final verdict
    integrity_score = Column(Float, nullable=True)   # 0-100, higher = more trustworthy
    verdict = Column(String, nullable=True)           # "Verified Authentic" / "Likely Manipulated" / "Needs Review"
    reasons = Column(Text, nullable=True)              # JSON-encoded list of human-readable reasons

    # seal (added properly in Task 3, columns reserved now)
    seal_hash = Column(String, nullable=True)
    prev_chain_hash = Column(String, nullable=True)
    qr_path = Column(String, nullable=True)
    certificate_path = Column(String, nullable=True)
    watermarked_path = Column(String, nullable=True)  # PNG copy of the image with a verified badge stamped on it
    sealed_at = Column(String, nullable=True)  # ISO timestamp string, stored so the seal_hash can be independently re-verified

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Layer 2: Justice Tracker
# ---------------------------------------------------------------------------
CASE_STATUSES = ["Report", "Investigation", "Medical Support", "Compensation", "Final Resolution"]


class Case(Base):
    """
    A victim case. We deliberately do NOT store victim name/NID/phone here -
    that data belongs in a properly access-controlled system, not a hackathon
    demo DB. `case_reference` is a public-safe identifier (e.g. a case number)
    that a victim/family can use to check status without exposing identity
    on the public transparency portal.
    """
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_reference = Column(String, unique=True, index=True, nullable=False)  # e.g. "SQ-2026-0001"
    location = Column(String, nullable=True)
    incident_summary = Column(Text, nullable=True)
    status = Column(String, default="Report", nullable=False)  # one of CASE_STATUSES
    status_notes = Column(Text, nullable=True)   # internal notes, admin-only in the API layer
    updated_by_agency = Column(String, nullable=True)  # e.g. "Investigation Authority", "Dhaka Medical College Hospital"
    is_public = Column(Integer, default=1)  # 1 = shown on public transparency portal

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class CaseEvidence(Base):
    """Link table: which sealed evidence images support which case."""
    __tablename__ = "case_evidence"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, nullable=False, index=True)
    evidence_image_id = Column(Integer, nullable=False, index=True)
    linked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Chain of Custody
# ---------------------------------------------------------------------------
CUSTODY_ACTIONS = ["Uploaded", "Verified", "Viewed", "Linked to Case", "Re-verified"]


class CustodyLogEntry(Base):
    """
    Append-only log: every time evidence is touched, one row gets added here.
    This is the actual proof behind "nobody quietly altered this evidence
    after upload" - a judge, prosecutor, or defense lawyer can see the full
    history, not just the current state. Never delete or edit rows here.
    """
    __tablename__ = "custody_log"

    id = Column(Integer, primary_key=True, index=True)
    evidence_image_id = Column(Integer, nullable=False, index=True)
    action = Column(String, nullable=False)   # one of CUSTODY_ACTIONS
    actor_role = Column(String, nullable=True)  # "Journalist" / "Investigator" / "Admin" / "Public" - never a name
    detail = Column(String, nullable=True)     # short free-text, e.g. "linked to case SQ-2026-0001"
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
