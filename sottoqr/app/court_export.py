"""
court_export.py  —  one-click court-ready Digital Evidence Certificate (ADD-ONLY).

Bundles everything SottoQR already computes for a piece of evidence into a single
professional PDF an investigator or tribunal can file: SHA-256 + pHash, the full
signal-by-signal integrity analysis, the optional AI-image heuristic, the project's
Ed25519 signed manifest + an offline-verifiable QR, and the chain-of-custody timeline.

It reuses the project's own app/crypto_signing.py (same keypair used everywhere else),
so the QR's manifest+signature verify with the SAME public key as your offline verifier.

Body is English (appropriate for court / international use); Bengali strings are rendered
as HarfBuzz-shaped images because ReportLab's built-in fonts don't shape Bengali.
Deps: reportlab + Pillow + qrcode (all light — no browser needed).
"""
from __future__ import annotations
import io, os, json
from datetime import datetime, timezone
from PIL import Image, ImageFont, ImageDraw
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, Image as RLImage, HRFlowable)

from app import crypto_signing

RED = colors.HexColor("#D6001C"); YELLOW = colors.HexColor("#F5B700")
BLACK = colors.HexColor("#0B0B0B"); GREEN = colors.HexColor("#00693E"); GREY = colors.HexColor("#555555")

BN_FONT = os.path.join(os.path.dirname(__file__), "..", "static", "fonts", "NotoSansBengali-Bold.ttf")
_R = ImageFont.Layout.RAQM

SIGNAL_LABELS = [
    ("ela_score", "ELA (Error Level Analysis)"), ("exif_score", "EXIF metadata"),
    ("blur_score", "Blur / sharpness"), ("hist_score", "Histogram"),
    ("block_score", "JPEG blockiness"), ("rotation_score", "Rotation / crop"),
    ("screenshot_score", "Screenshot"),
]


def _bn_image(text, size=22, color=(11, 11, 11)):
    font = ImageFont.truetype(BN_FONT, size, layout_engine=_R)
    d = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    box = d.textbbox((0, 0), text, font=font)
    w, h = box[2] - box[0] + 6, box[3] - box[1] + 6
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((3 - box[0], 3 - box[1]), text, font=font, fill=color + (255,))
    buf = io.BytesIO(); img.save(buf, "PNG"); buf.seek(0)
    return RLImage(buf, width=w * 0.75, height=h * 0.75)


def _status(v):
    v = float(v or 0)
    return ("CLEAN", GREEN) if v < 30 else ("SUSPECT", YELLOW) if v < 60 else ("HIGH RISK", RED)


def build_evidence_pdf(record: dict, out_path: str, *, custody: list | None = None,
                       ai: dict | None = None) -> str:
    """record = an EvidenceImage row as a dict (id, sha256_hash, *_score, integrity_score,
    verdict, reasons, phash, sealed_at, seal_hash, case_reference?). Returns out_path."""
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    styles = getSampleStyleSheet()
    body = ParagraphStyle("body", parent=styles["Normal"], fontSize=9, leading=13, textColor=colors.HexColor("#222222"))
    small = ParagraphStyle("small", parent=body, fontSize=7.5, textColor=GREY)
    h2 = ParagraphStyle("h2", parent=styles["Heading2"], fontSize=11, textColor=RED, spaceBefore=10, spaceAfter=4)
    mono = ParagraphStyle("mono", parent=body, fontName="Courier", fontSize=8)

    eid = record.get("id", 0)
    ref = record.get("case_reference") or f"EVID-{eid}"
    score = record.get("integrity_score", 0) or 0
    verdict = record.get("verdict", "—")
    sha = record.get("sha256_hash") or "—"
    phash = record.get("phash", "—")
    sealed_at = record.get("sealed_at") or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    seal_hash = record.get("seal_hash") or "—"

    # real signed manifest (project's own Ed25519 keypair) + offline-verifiable QR
    manifest = crypto_signing.build_manifest(
        sha256_hash=sha, integrity_score=float(score), verdict=verdict,
        sealed_at=sealed_at, seal_hash=seal_hash, evidence_id=eid)
    signature = crypto_signing.sign_manifest(manifest)
    pubkey = crypto_signing.get_public_key_b64()
    qr_payload = json.dumps({"m": manifest, "s": signature}, separators=(",", ":"))
    import qrcode
    qbuf = io.BytesIO(); qrcode.make(qr_payload).save(qbuf); qbuf.seek(0)

    doc = SimpleDocTemplate(out_path, pagesize=A4, topMargin=16 * mm, bottomMargin=16 * mm,
                            leftMargin=18 * mm, rightMargin=18 * mm,
                            title=f"SottoQR Evidence Certificate {ref}", author="SottoQR")
    S = []

    hdr = Table([[
        Paragraph('<font color="#D6001C"><b>Sotto</b></font><font color="#0B0B0B"><b>QR</b></font>'
                  '<br/><font size=7 color="#555555">DIGITAL TRUTH · EVIDENCE · JUSTICE</font>', body),
        Paragraph('<para align="right"><b><font size=13>DIGITAL EVIDENCE CERTIFICATE</font></b><br/>'
                  '<font size=8 color="#555555">Tamper-evident · cryptographically sealed</font></para>', body),
    ]], colWidths=[70 * mm, 104 * mm])
    hdr.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    S += [hdr, Spacer(1, 4), HRFlowable(width="100%", thickness=2, color=RED), Spacer(1, 2)]
    S += [_bn_image("ডিজিটাল প্রমাণ সনদ — সত্যQR", size=20, color=(140, 0, 22)), Spacer(1, 8)]

    verdict_col = GREEN if float(score) >= 75 else (YELLOW if float(score) >= 45 else RED)
    ident = Table([
        ["Reference", ref, "Integrity Score", f"{round(float(score))} / 100"],
        ["Sealed (UTC)", sealed_at, "Verdict", verdict],
        ["SHA-256", Paragraph(sha, mono), "pHash", Paragraph(str(phash), mono)],
    ], colWidths=[26 * mm, 74 * mm, 30 * mm, 44 * mm])
    ident.setStyle(TableStyle([
        ("FONT", (0, 0), (-1, -1), "Helvetica", 8.5),
        ("TEXTCOLOR", (0, 0), (0, -1), GREY), ("TEXTCOLOR", (2, 0), (2, -1), GREY),
        ("BACKGROUND", (3, 0), (3, 0), verdict_col), ("TEXTCOLOR", (3, 0), (3, 0), colors.white),
        ("FONTNAME", (3, 0), (3, 0), "Helvetica-Bold"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, colors.HexColor("#DDDDDD")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    S += [ident, Spacer(1, 6)]

    S += [Paragraph("1. Forensic signal analysis", h2)]
    rows = [["Signal", "Suspicion (0-100)", "Status"]]; style_rows = []
    for i, (k, label) in enumerate(SIGNAL_LABELS, start=1):
        v = round(float(record.get(k, 0) or 0), 1); st, col = _status(v)
        rows.append([label, f"{v}", st]); style_rows.append(("TEXTCOLOR", (2, i), (2, i), col))
    tbl = Table(rows, colWidths=[86 * mm, 44 * mm, 44 * mm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLACK), ("TEXTCOLOR", (0, 0), (-1, 0), YELLOW),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F4EC")]),
        ("FONTNAME", (2, 1), (2, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#DDDDDD")),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ] + style_rows))
    S += [tbl]
    if int(record.get("phash_match_flag", 0) or 0) == 1:
        S += [Spacer(1, 3), Paragraph('<font color="#D6001C"><b>Reuse flag:</b> perceptual match to a '
                                      'previously seen image — hard override applied.</font>', body)]

    if ai:
        S += [Paragraph("2. AI / synthetic-image heuristic", h2)]
        S += [Paragraph(f"Suspicion: <b>{ai.get('ai_suspicion','—')}/100</b> — "
                        f"{'; '.join(ai.get('reasons', []))}. <i>{ai.get('note','')}</i>", body)]

    try: reasons = json.loads(record.get("reasons") or "[]")
    except Exception: reasons = []
    if reasons:
        S += [Paragraph("3. Human-readable findings", h2)]
        S += [Paragraph("<br/>".join("• " + str(r) for r in reasons), body)]

    S += [Paragraph("4. Cryptographic seal (Ed25519)", h2)]
    seal_tbl = Table([[
        Paragraph(
            f'<b>Algorithm:</b> Ed25519 · <b>Issuer public key:</b><br/>'
            f'<font face="Courier" size=7>{pubkey}</font><br/><br/>'
            f'<b>Signed manifest:</b><br/><font face="Courier" size=6.5>{json.dumps(manifest, separators=(",",":"))}</font><br/><br/>'
            f'<b>Signature (base64):</b><br/><font face="Courier" size=6.5>{signature}</font><br/><br/>'
            f'<b>Verify offline:</b> scan the QR with the SottoQR offline verifier — no internet, '
            f'no database required. Any change to this certificate fails verification.', small),
        RLImage(qbuf, width=34 * mm, height=34 * mm),
    ]], colWidths=[136 * mm, 38 * mm])
    seal_tbl.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOX", (0, 0), (-1, -1), 0.6, YELLOW),
                                  ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFFDF5")),
                                  ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 8)]))
    S += [seal_tbl]

    if custody:
        S += [Paragraph("5. Chain of custody", h2)]
        crows = [["#", "Action", "Actor", "Timestamp"]]
        for i, c in enumerate(custody, 1):
            crows.append([str(i), c.get("action", "—"), c.get("actor", c.get("by", "—")), c.get("at", c.get("timestamp", "—"))])
        ct = Table(crows, colWidths=[10 * mm, 70 * mm, 46 * mm, 48 * mm])
        ct.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BLACK), ("TEXTCOLOR", (0, 0), (-1, 0), YELLOW),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#DDDDDD")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F4EC")]),
        ]))
        S += [ct]

    S += [Spacer(1, 10), HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#CCCCCC")), Spacer(1, 3)]
    S += [Paragraph(
        f"Generated by SottoQR on {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}. The evidence hash "
        f"is recorded in a tamper-evident hash-chain ledger (seal {seal_hash}). The integrity score is an automated "
        f"forensic estimate, not a legal determination. Any alteration of this document or the sealed image "
        f"invalidates the Ed25519 signature above.", small)]

    doc.build(S)
    return out_path
