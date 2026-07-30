# SottoQR — integrated build notes

Your existing app is unchanged in look & behaviour. Four features were added **on top**:

| Feature | Where to see it | Files added |
|---|---|---|
| **Explainable Integrity Score** | verify any image → breakdown appears under the result | `static/js/explainscore.js` (+ 1 `<script>` in index.html) |
| **Court-ready Evidence PDF** | verify result → **⚖️ কোর্ট PDF / Court PDF** button | `app/court_export.py`, route `/api/evidence/{id}/pdf` |
| **National Transparency Dashboard** | nav → **ড্যাশবোর্ড**, or `/command-center` | `static/command-center.html`, route + `/api/dashboard-stats` |
| **National Digital Memorial Wall** | nav → **স্মৃতি প্রাচীর**, or `/memorial` | `static/memorial.html`, route `/memorial` |

Also added: `app/ai_detect.py` (optional AI-image heuristic, shown in the court PDF),
`static/fonts/NotoSansBengali-Bold.ttf` (Bengali shaping for the PDF).

Nothing existing was edited except two additive spots in `templates/index.html`
(two nav links + one script tag) and four new routes appended to `app/main.py`.

## Run
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
# open http://127.0.0.1:8000
```

## Notes
- The dashboard reads `/api/cases` + `/api/dashboard-stats` (live). With an empty DB it
  shows a clearly-labelled DEMO screen so a stage demo is never blank.
- The court PDF uses your own `app/crypto_signing.py` keypair, so its QR/manifest verify
  with the SAME public key as your offline verifier.
- Memorial candles/flowers/tributes persist per-device (localStorage) for the demo; for
  production, add a moderated `/api/tribute` endpoint and store server-side.
- New requirement added: `reportlab` (for the PDF). `qrcode`, `pillow`, `pynacl` you
  already had.
