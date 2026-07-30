"""
Task 2 (validation): run the forensics pipeline on all 30 labeled images,
save results to DB, and print how well the Integrity Score separates
Authentic vs Fake - so you can see if the scoring formula needs tuning
BEFORE you're demoing live in front of judges.

Run from project root:
    python -m scripts.test_pipeline
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import EvidenceImage
from app.forensics import analyze_image

ELA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "ela")
os.makedirs(ELA_DIR, exist_ok=True)


def run():
    db = SessionLocal()
    records = db.query(EvidenceImage).all()

    results = []
    for rec in records:
        ela_visual_path = os.path.join(ELA_DIR, f"{rec.filename}_ela.png")
        result = analyze_image(rec.filepath, save_ela_visual=ela_visual_path)

        rec.sha256_hash = result["sha256_hash"]
        rec.phash = result["phash"]
        rec.ela_score = result["ela_score"]
        rec.exif_score = result["exif_score"]
        rec.blur_score = result["blur_score"]
        rec.hist_score = result["hist_score"]
        rec.block_score = result["block_score"]
        rec.rotation_score = result["rotation_score"]
        rec.screenshot_score = result["screenshot_score"]
        rec.phash_match_flag = result["phash_match_flag"]
        rec.integrity_score = result["integrity_score"]
        rec.verdict = result["verdict"]
        rec.reasons = result["reasons"]

        results.append((rec.filename, rec.true_label, result["integrity_score"], result["verdict"]))

    db.commit()
    db.close()

    # --- report ---
    print(f"{'filename':14} {'true_label':10} {'score':>6}  verdict")
    print("-" * 60)
    for fname, true_label, score, verdict in sorted(results, key=lambda r: r[2]):
        print(f"{fname:14} {true_label:10} {score:6.1f}  {verdict}")

    auth_scores = [s for f, l, s, v in results if l == "Authentic"]
    fake_scores = [s for f, l, s, v in results if l == "Fake"]

    print("\n--- separation check ---")
    print(f"Authentic: min={min(auth_scores):.1f} max={max(auth_scores):.1f} avg={sum(auth_scores)/len(auth_scores):.1f}")
    print(f"Fake:      min={min(fake_scores):.1f} max={max(fake_scores):.1f} avg={sum(fake_scores)/len(fake_scores):.1f}")

    # simple accuracy at threshold 60
    threshold = 60
    correct = 0
    for f, l, s, v in results:
        pred = "Authentic" if s >= threshold else "Fake"
        if pred == l:
            correct += 1
    print(f"\nAccuracy at threshold={threshold}: {correct}/{len(results)} = {100*correct/len(results):.1f}%")


if __name__ == "__main__":
    run()
