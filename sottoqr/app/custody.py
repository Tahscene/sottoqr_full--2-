"""
Chain-of-custody logging helper.

Call log_custody_action() at every point evidence is touched: upload,
seal, QR-scan view, link-to-case. This is intentionally a dumb append-only
insert - no update, no delete - because the log itself being tamper-evident
(by construction, not by permission) is the whole point.
"""
from app.models import CustodyLogEntry


def log_custody_action(db, evidence_image_id: int, action: str, actor_role: str | None = None, detail: str | None = None):
    entry = CustodyLogEntry(
        evidence_image_id=evidence_image_id,
        action=action,
        actor_role=actor_role,
        detail=detail,
    )
    db.add(entry)
    db.commit()
    return entry
