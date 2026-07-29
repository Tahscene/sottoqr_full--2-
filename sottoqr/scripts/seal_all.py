"""
Task 3 (validation): seal every already-analyzed image (run test_pipeline.py
first), then independently re-verify every seal in the chain.

Run from project root:
    python -m scripts.seal_all
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import EvidenceImage
from app.seal import seal_record, verify_seal


def run():
    db = SessionLocal()
    records = (
        db.query(EvidenceImage)
        .filter(EvidenceImage.integrity_score.isnot(None))
        .order_by(EvidenceImage.id)
        .all()
    )

    for rec in records:
        seal_record(db, rec)
        db.commit()
        print(f"Sealed {rec.filename:14} score={rec.integrity_score:5.1f}  seal={rec.seal_hash[:16]}...")

    print("\n--- verifying every seal independently ---")
    all_valid = True
    for rec in records:
        valid = verify_seal(rec)
        all_valid &= valid
        print(f"{rec.filename:14} valid={valid}")

    print(f"\nAll {len(records)} seals valid: {all_valid}")

    # tamper test: prove the chain actually catches an edit
    print("\n--- tamper test: silently editing one record's score ---")
    target = records[5]
    original_score = target.integrity_score
    target.integrity_score = 99.9  # simulate someone editing the DB directly
    print(f"Changed {target.filename} score from {original_score} to 99.9 (bypassing seal_record)")
    print(f"verify_seal now returns: {verify_seal(target)}  <- should be False")

    db.rollback()  # don't actually save the tampered value
    db.close()


if __name__ == "__main__":
    run()
