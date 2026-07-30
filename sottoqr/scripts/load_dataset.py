"""
Task 1 (part 2): load the demo dataset (data/july/*.jpg|png + labels_fixed.xlsx)
into the DB so the forensics pipeline has something to run against.

Run from project root:
    python -m scripts.load_dataset
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import openpyxl
from app.database import SessionLocal, init_db
from app.models import EvidenceImage

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "july")
LABELS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "labels_fixed.xlsx")


def load():
    init_db()
    db = SessionLocal()

    wb = openpyxl.load_workbook(LABELS_PATH)
    ws = wb.active

    loaded, skipped = 0, 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        filename, label, manipulation, event, confidence = row[0], row[1], row[2], row[3], row[4]
        filepath = os.path.join(DATA_DIR, filename)

        if not os.path.exists(filepath):
            print(f"  [WARN] missing file, skipping: {filename}")
            skipped += 1
            continue

        existing = db.query(EvidenceImage).filter_by(filename=filename).first()
        if existing:
            skipped += 1
            continue

        record = EvidenceImage(
            filename=filename,
            filepath=filepath,
            true_label=label,
            true_manipulation=manipulation,
            event=event,
        )
        db.add(record)
        loaded += 1

    db.commit()
    total = db.query(EvidenceImage).count()
    db.close()
    print(f"Loaded {loaded} new rows, skipped {skipped}. Total rows in DB: {total}")


if __name__ == "__main__":
    load()
