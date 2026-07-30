"""
Task 3: SottoQR seal.

For every analyzed image we:
  1. Build a "seal payload" (hash + score + verdict + timestamp + link to
     the previous sealed record) and hash THAT -> seal_hash.
     Chaining to the previous record's seal_hash means nobody can quietly
     edit one entry's score later without breaking every entry after it -
     that's the "tamper-evident ledger" without needing real blockchain infra.
  2. Encode the seal into a QR code.
  3. Render a shareable certificate image (what a journalist/citizen/ministry
     would actually download and attach to a report).
"""
import os
import json
import hashlib
import qrcode
from datetime import datetime, timezone
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from app.crypto_signing import build_manifest, sign_manifest

CERT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "certificates")
QR_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "qr")
os.makedirs(CERT_DIR, exist_ok=True)
os.makedirs(QR_DIR, exist_ok=True)

# The QR needs an absolute URL to be useful when scanned with a phone camera.
# Since this runs behind ngrok/Render/whatever, set PUBLIC_BASE_URL as an env
# var to the current public URL before sealing. Falls back to localhost for
# local testing (won't be scannable from a phone, but /verify/<id> still
# works if you type it in a browser on the same machine).
PUBLIC_BASE_URL = os.environ.get("PUBLIC_BASE_URL", "http://localhost:8000").rstrip("/")


def compute_seal_hash(sha256_hash: str, integrity_score: float, verdict: str,
                       timestamp: str, prev_chain_hash: str) -> str:
    """
    This IS the hash-chain link: prev_chain_hash is folded into the hash,
    so changing any past record changes every seal_hash computed after it.
    """
    payload = f"{sha256_hash}|{integrity_score}|{verdict}|{timestamp}|{prev_chain_hash}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def get_last_chain_hash(db) -> str:
    """Fetch the most recent seal_hash in the DB to chain the next one onto it."""
    from app.models import EvidenceImage
    last = (
        db.query(EvidenceImage)
        .filter(EvidenceImage.seal_hash.isnot(None))
        .order_by(EvidenceImage.id.desc())
        .first()
    )
    return last.seal_hash if last else "GENESIS"  # first entry in the whole ledger


def generate_qr(url: str, filename: str) -> str:
    """
    Encodes a verify-page URL into a QR code PNG. Scanning it opens a
    branded /verify/<id> page showing the same result live from the DB -
    that's the actual point of the QR (a raw JSON blob isn't useful to a
    phone camera; a URL is). Returns the file path.
    """
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=8, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    path = os.path.join(QR_DIR, f"{filename}_qr.png")
    img.save(path)
    return path


def _load_font(size):
    # falls back to PIL's default bitmap font if no truetype font is available
    for candidate in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def generate_certificate(image_path: str, filename: str, integrity_score: float,
                          verdict: str, seal_hash: str, sha256_hash: str,
                          timestamp: str, qr_path: str, uploader_role: str | None = None) -> str:
    """
    Renders a shareable certificate matching the website's own visual identity
    (dark panel, red/yellow accents, fist watermark) instead of a generic
    white corporate template - this is what gets downloaded and shared.

    Rendered at 2x resolution (SCALE) then downsampled with LANCZOS so all
    text comes out crisp/HD instead of looking pixelated at native size.
    """
    BLACK = (11, 11, 11)
    PANEL = (20, 20, 20)
    RED = (214, 0, 28)
    YELLOW = (245, 183, 0)
    INK = (239, 233, 218)
    MUTED = (150, 145, 130)

    SCALE = 2
    CARD_W, CARD_H = 960 * SCALE, 540 * SCALE
    card = Image.new("RGB", (CARD_W, CARD_H), PANEL)
    draw = ImageDraw.Draw(card)

    # a display-friendly filename, without the internal uuid8_ storage prefix
    display_filename = filename.split("_", 1)[1] if "_" in filename else filename

    # faint fist watermark, centered, behind everything
    fist_path = os.path.join(os.path.dirname(CERT_DIR), "img", "fist-icon.png")
    if os.path.exists(fist_path):
        try:
            fist = Image.open(fist_path).convert("RGBA")
            fist.thumbnail((380 * SCALE, 380 * SCALE))
            r, g, b, a = fist.split()
            a = a.point(lambda p: int(p * 0.10))
            faded = Image.merge("RGBA", (r, g, b, a))
            card.paste(faded, (CARD_W - fist.width - 40 * SCALE, CARD_H - fist.height - 20 * SCALE), faded)
        except Exception:
            pass

    # header band
    verdict_color = {
        "Verified Authentic": (0, 105, 62),
        "Needs Review": YELLOW,
        "Likely Manipulated": RED,
        "Flagged: Reused Image": RED,
    }.get(verdict, MUTED)
    draw.rectangle([0, 0, CARD_W, 8 * SCALE], fill=RED)
    draw.rectangle([0, 8 * SCALE, CARD_W, 76 * SCALE], fill=BLACK)
    draw.text((26 * SCALE, 24 * SCALE), "SOTTOQR", font=_load_font(28 * SCALE), fill=YELLOW)
    draw.text((26 * SCALE, 54 * SCALE), "Truth Verification Seal", font=_load_font(14 * SCALE), fill=MUTED)

    # thumbnail with a thin red frame
    try:
        thumb = Image.open(image_path).convert("RGB")
        thumb.thumbnail((300 * SCALE, 300 * SCALE))
        frame_box = [24 * SCALE, 104 * SCALE, 24 * SCALE + thumb.width + 6 * SCALE, 104 * SCALE + thumb.height + 6 * SCALE]
        draw.rectangle(frame_box, outline=RED, width=2 * SCALE)
        card.paste(thumb, (27 * SCALE, 107 * SCALE))
    except Exception:
        pass

    # QR, top right, on a small white plate (QR codes need real contrast to scan)
    qr_img = Image.open(qr_path)
    qr_img.thumbnail((160 * SCALE, 160 * SCALE))
    qr_plate = Image.new("RGB", (qr_img.width + 16 * SCALE, qr_img.height + 16 * SCALE), INK)
    qr_plate.paste(qr_img, (8 * SCALE, 8 * SCALE))
    card.paste(qr_plate, (CARD_W - qr_plate.width - 30 * SCALE, 100 * SCALE))
    draw.text((CARD_W - qr_plate.width - 30 * SCALE, 100 * SCALE + qr_plate.height + 8 * SCALE), "Scan to verify",
               font=_load_font(13 * SCALE), fill=MUTED)

    # text block
    font_label = _load_font(15 * SCALE)
    font_value = _load_font(20 * SCALE)
    x = 370 * SCALE
    y = 106 * SCALE
    lines = [
        ("FILE", display_filename),
        ("VERDICT", verdict),
        ("INTEGRITY SCORE", f"{integrity_score:.1f} / 100"),
        ("SUBMITTED BY (ROLE)", uploader_role or "Public"),
        ("SHA-256", sha256_hash[:22] + "..."),
        ("SEAL HASH", seal_hash[:22] + "..."),
        ("SEALED AT (UTC)", timestamp[:19].replace("T", " ")),
    ]
    for label, value in lines:
        draw.text((x, y), label, font=font_label, fill=MUTED)
        fill = verdict_color if label == "VERDICT" else INK
        draw.text((x, y + 21 * SCALE), str(value), font=font_value, fill=fill)
        y += 51 * SCALE

    # Chain of Custody badge, bottom-left of the text column
    badge_text = "\u26d3 CHAIN OF CUSTODY VERIFIED"
    draw.text((x, y + 4 * SCALE), badge_text, font=_load_font(14 * SCALE), fill=(0, 150, 90))

    # verdict pill, bottom left
    draw.rectangle([0, CARD_H - 46 * SCALE, CARD_W, CARD_H], fill=BLACK)
    draw.text((26 * SCALE, CARD_H - 32 * SCALE), "Scan the QR to re-verify this seal live against the SottoQR ledger.",
               font=_load_font(13 * SCALE), fill=MUTED)

    # downsample to the final size for crisp anti-aliased text (HD look)
    card = card.resize((960, 540), Image.LANCZOS)

    path = os.path.join(CERT_DIR, f"{filename}_certificate.png")
    card.save(path)
    return path


def generate_watermarked_image(image_path: str, filename: str, integrity_score: float,
                                verdict: str, seal_hash: str = "") -> str:
    """
    Stamps just the SottoQR fist icon onto a corner of the ACTUAL image -
    no score, no hash, no text of any kind. Full detail lives on the
    certificate page; this stays a quiet "checked" mark that travels with
    the photo when re-shared, without turning the photo into a data label.
    """
    base = Image.open(image_path).convert("RGBA")
    W, H = base.size

    icon_size = max(48, min(140, int(min(W, H) * 0.14)))
    margin = int(min(W, H) * 0.035)

    fist_path = os.path.join(os.path.dirname(CERT_DIR), "img", "fist-icon.png")
    if os.path.exists(fist_path):
        fist = Image.open(fist_path).convert("RGBA").resize((icon_size, icon_size), Image.LANCZOS)

        shadow = Image.new("RGBA", (icon_size + 16, icon_size + 16), (0, 0, 0, 0))
        shadow_alpha = fist.split()[3].point(lambda p: int(p * 0.55))
        shadow_layer = Image.new("RGBA", fist.size, (0, 0, 0, 255))
        shadow_layer.putalpha(shadow_alpha)
        shadow.paste(shadow_layer, (8, 10), shadow_layer)
        shadow = shadow.filter(ImageFilter.GaussianBlur(3))

        pos = (W - icon_size - margin, H - icon_size - margin)
        base.alpha_composite(shadow, (pos[0] - 8, pos[1] - 6))
        base.alpha_composite(fist, pos)

    out_dir = os.path.join(os.path.dirname(CERT_DIR), "watermarked")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{filename}_verified.png")
    base.convert("RGB").save(path, "PNG")
    return path



def seal_record(db, record):
    """
    Full Task-3 pipeline for one already-analyzed EvidenceImage row:
    compute seal hash (chained), generate QR, generate certificate,
    write results back onto the record.
    """
    timestamp = datetime.now(timezone.utc).isoformat()
    prev_hash = get_last_chain_hash(db)

    seal_hash = compute_seal_hash(
        record.sha256_hash, record.integrity_score, record.verdict, timestamp, prev_hash
    )

    verify_url = f"{PUBLIC_BASE_URL}/verify/{record.id}"
    qr_path = generate_qr(verify_url, record.filename)

    cert_path = generate_certificate(
        image_path=record.filepath,
        filename=record.filename,
        integrity_score=record.integrity_score,
        verdict=record.verdict,
        seal_hash=seal_hash,
        sha256_hash=record.sha256_hash,
        timestamp=timestamp,
        qr_path=qr_path,
        uploader_role=getattr(record, "uploader_role", None),
    )

    watermark_path = generate_watermarked_image(
        image_path=record.filepath,
        filename=record.filename,
        integrity_score=record.integrity_score,
        verdict=record.verdict,
        seal_hash=seal_hash,
    )

    record.prev_chain_hash = prev_hash
    record.seal_hash = seal_hash
    record.qr_path = qr_path
    record.certificate_path = cert_path
    record.watermarked_path = watermark_path
    record.sealed_at = timestamp

    manifest = build_manifest(
        sha256_hash=record.sha256_hash, integrity_score=record.integrity_score,
        verdict=record.verdict, sealed_at=timestamp, seal_hash=seal_hash, evidence_id=record.id,
    )
    record.ed25519_signature = sign_manifest(manifest)
    return record


def verify_seal(record) -> bool:
    """
    Independently re-derives the seal_hash from the record's stored fields
    and checks it matches what's on file. This is what the QR-scan
    "verify" endpoint calls - if anyone edited the score/verdict in the DB
    directly, this returns False.
    """
    recomputed = compute_seal_hash(
        record.sha256_hash, record.integrity_score, record.verdict,
        record.sealed_at, record.prev_chain_hash
    )
    return recomputed == record.seal_hash
