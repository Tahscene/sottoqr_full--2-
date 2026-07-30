# Shakkhi AI - Task 1, 2, 3 (Layer 1 Verification Engine)

## Setup
1. `pip install -r requirements.txt` (or `pip install -r requirements.txt --break-system-packages` on some systems)
2. Put your dataset images in `data/july/` (img0001.jpg ... img0030.jpg/png)
3. `data/labels_fixed.xlsx` is already here (extension mismatches from the original labels.xlsx already fixed)

## Run in order
```
python -m scripts.load_dataset     # Task 1: loads images + labels into shakkhi.db
python -m scripts.test_pipeline    # Task 2: runs ELA + EXIF + blur + histogram + blockiness, prints score separation
python -m scripts.seal_all         # Task 3: generates seal hash + QR + certificate for every analyzed image, verifies the hash chain
```

Outputs land in `static/ela/`, `static/qr/`, `static/certificates/`.

## Known limitation (be upfront about this in the demo)
Current signals: ELA, EXIF, blur/sharpness, histogram clipping, JPEG blockiness,
rotation canvas-fill check, screenshot resolution match.

Reliably separate: Blur, Crop, Brightness Change.
Partially improved: Screenshot (one heuristic added, catches exact-resolution
screen dumps, but a screenshot that's been resized no longer matches).
Still NOT reliably caught: Rotation, Photoshop Edit, JPEG Compression, Contrast
Change. For Rotation specifically: we added a corner-uniformity check that
catches rotate-and-expand edits (solid-color triangular fill in the corners),
but this specific 30-image test set's "Rotation" fakes appear to have been
generated as in-place rotate-and-crop with no canvas fill, so that signal
doesn't trigger on them - it's a real, valid forensic technique, it just
doesn't happen to match how this particular sample set was built. Be honest
about that distinction if a judge asks rather than implying it's fully solved.

Present the score as decision-support with a visible reasons list, not as a
100%-accurate binary classifier - that's both more honest and a stronger pitch.

### Adding a pretrained forgery-detection model (not included, needs your own setup)
This sandbox that built this project has no network access to huggingface.co,
so a pretrained CNN signal could not be integrated and tested here. A real
option to add in Colab (which does have internet access):

```python
# pip install -q huggingface_hub tensorflow
from huggingface_hub import hf_hub_download
import tensorflow as tf

model_path = hf_hub_download(repo_id="kumaran-0188/image_forgery_detector", filename="model.h5")
# or whatever the actual weights filename is listed as on the model's Files tab
cnn_model = tf.keras.models.load_model(model_path)

def compute_cnn_suspicion(image_path):
    from PIL import Image
    import numpy as np
    img = Image.open(image_path).convert("RGB").resize((224, 224))
    arr = np.expand_dims(np.array(img) / 255.0, axis=0)
    pred = cnn_model.predict(arr, verbose=0)[0]
    # check the model card for which index means "fake" vs "real" and the
    # expected preprocessing (this is a starting point, not verified working)
    return float(pred[0]) * 100, None
```
Wrap the call in try/except so a missing/failed model download degrades to
weight 0 instead of crashing the whole pipeline. Test this yourself in Colab
before demoing it live - it has not been run or verified in this project.

## Files
- app/database.py   - SQLAlchemy engine/session
- app/models.py      - EvidenceImage table (Layer 1 fields)
- app/forensics.py   - all 7 forensic signals + combine_signals -> Integrity Score
- app/seal.py        - SHA-256 seal, hash-chain ledger, QR generation, certificate rendering
- scripts/load_dataset.py, test_pipeline.py, seal_all.py - run in that order

## Task 4 & 5 - FastAPI backend (Layer 1 + Layer 2)

Run the server:
```
uvicorn app.main:app --reload
```
Interactive API docs auto-generated at: http://localhost:8000/docs

### Layer 1 (Verification Engine)
- `POST /api/verify` - upload a jpg/png, get back Integrity Score + verdict + reasons + QR + certificate
- `GET /api/evidence` - list all sealed evidence
- `GET /api/evidence/{id}` - one record
- `GET /api/verify-seal/{id}` - re-verify a seal independently (what scanning the QR should hit)

### Layer 2 (Justice Tracker)
- `POST /api/cases` - create a case (case_reference, location, incident_summary, is_public)
- `GET /api/cases` - public transparency feed (only is_public=1 cases)
- `GET /api/cases/{id}` - case detail + all linked evidence
- `PATCH /api/cases/{id}/status` - move status: Report -> Investigation -> Medical Support -> Compensation -> Final Resolution
- `POST /api/cases/{id}/link-evidence` - attach a sealed evidence record to a case

Tested end to end (all 13 endpoint checks passing) with a real image from the dataset.

Note: victim name/NID/phone are deliberately NOT stored on the Case model - that
kind of PII needs a properly access-controlled system, not a hackathon demo DB.
Use `case_reference` as the public-safe lookup identifier.

### Next: Colab can't run a persistent web server well (no public URL by default).
For the live demo, either:
  - run this locally / on a normal VM and demo directly, or
  - in Colab, use `ngrok` or Colab's built-in port forwarding to expose port 8000, or
  - skip the server entirely for judges and just run the frontend against a
    deployed version (Render/Railway free tier deploys FastAPI directly from this repo).

## Frontend (July-uprising themed)

Full web UI now lives at `templates/index.html` + `static/css/style.css` + `static/js/main.js`.
Run the server and open the root URL - the frontend IS the homepage now:
```
uvicorn app.main:app --reload
```
Then open http://localhost:8000/ (not /docs - that's still there for the raw API).

- Bilingual (বাংলা / English) toggle, top right nav - text lives in `static/js/main.js` in the `I18N` object.
  To add another language for international judges: add one more key (e.g. `hi:`, `ar:`) to every entry in `I18N`
  and add a matching button in the `.lang-switch` div in `templates/index.html`.
- Logo/icon: `static/img/logo.jpg` (from your 4th uploaded image), used as favicon + nav brand mark + footer mark.
- Hero posters: `static/img/poster-red.jpg` and `static/img/poster-longmarch.jpg`, shown "taped" at an angle either side of the headline.
- Verify section calls `POST /api/verify` live and renders the Integrity Score, verdict, reasons, and certificate/QR links.
- Justice Tracker section calls `GET /api/cases` live - create a case via `/docs` or curl to see it appear.

Tested end-to-end with Playwright: real image upload -> live score -> certificate link, in both languages, desktop and mobile widths, no horizontal overflow.

## Update: Admin dashboard, public reporting, branded QR verify page

- `/admin` : create cases, update status, publish/unpublish pending reports, link evidence to cases. No more raw API calls needed for daily use.
- Public "Report an Incident" form on the homepage (Justice Tracker section) posts a case with `is_public=false` - it sits in admin's pending queue until someone clicks "Public" to approve it. This is the missing link between citizen reports and government review.
- QR codes on certificates now encode a real URL (`{PUBLIC_BASE_URL}/verify/<id>`), not raw JSON - scanning one opens a branded page that re-checks the seal live against the DB.
  Set the `PUBLIC_BASE_URL` environment variable to your current ngrok/deployed URL before sealing new evidence, e.g.:
  ```python
  import os
  os.environ["PUBLIC_BASE_URL"] = "https://your-ngrok-url.ngrok-free.app"
  ```
  Run this in Colab BEFORE starting uvicorn, so newly-sealed certificates point at the right place. (Already-sealed certificates keep whatever URL they were sealed with - reseal via `/api/verify` again if the tunnel URL changed.)
- Certificate design now matches the site's own dark red/yellow/black identity with a faint fist watermark, instead of the generic white template.

## Data persistence note

Everything (cases, evidence, seals) lives in `sottoqr.db` (SQLite) on disk while the server runs.
Colab's disk is wiped when the runtime disconnects - export the DB file before ending a session if you want to keep demo data:
```python
from google.colab import files
files.download("sottoqr.db")
```

## Chain of Custody (ICT-pivot addition)

New `custody_log` table - append-only, one row per action on a piece of evidence:
Uploaded -> Verified -> Viewed (every QR scan / /verify/{id} visit) -> Linked to Case.
Each row records WHO in terms of ROLE only (Journalist/Witness/Investigator/Admin/Public/Public via QR),
never a name - so the accountability trail doesn't cost anyone their safety.

- `GET /api/evidence/{id}/custody-log` - full timeline as JSON
- `/verify/{id}` page (what the QR code opens) now renders this timeline live
- Certificate now shows "SUBMITTED BY (ROLE)" and a "Chain of Custody Verified" badge
- Watermark now shows the fist icon + a small score/short-hash line (stroke-outlined text, no background box)
- Upload form has a role selector (Journalist/Witness/Investigator/Public) - sent as
  `?uploader_role=...` query param on `POST /api/verify`

Note: CNN/pretrained model signal was tried and then dropped per your call - GPU inference
adds real deployment risk for a hackathon demo, and the heuristic signals already cover most
of the dataset's manipulation types. This is documented as an honest limitation, not hidden.

## July Interactive Calendar, Timeline, Archive, About Us

Added from the team's own hand-built feature file, integrated into the existing
site (same dark red/yellow/black identity, same I18N pattern). New sections:

- **Timeline** (`#timeline`) - horizontal drag-to-scroll, one card per day, 1 to 36 July 2024
- **Archive** (`#archive`) - searchable/filterable verified-event cards (only days with
  a location + source show up here, drawn from the same JULY data array)
- **About Us** (`#about`) - Meherun Ritu (Team Lead, ULAB), Tahsin Shuborna (AUST),
  Shahriar Hossain Arafat (AUST)
- **Interactive Calendar** - "জুলাই ক্যালেন্ডার" button in the nav opens a modal grid
  (1 to 36 July), click any date for a detail popup with prev/next day navigation

All event data lives in the `JULY` array near the bottom of `static/js/main.js` -
edit the `bn`/`en` text objects per day to adjust wording, tag (`protest` / `attack` /
`turning` / `killing` / `fall`), or add `loc_bn`/`loc_en`/`src` to make a day show up
in the Archive section too.

Tested end to end with Playwright: no console/page errors, drag-scroll confirmed
working, calendar modal + day detail modal open/close and navigate correctly.
