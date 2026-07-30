"""
Task 2: Layer 1 forensic signal engine.

Three independent signals, each returns a 0-100 "suspicion" score
(0 = looks clean, 100 = strongly suspicious), plus human-readable reasons.
These get combined into one Integrity Score (0-100, where 100 = trustworthy,
so it's inverted from the individual suspicion scores).

Signals:
  1. ELA (Error Level Analysis)   -> catches recompression / local edits / splices
  2. EXIF metadata analysis        -> catches stripped metadata, editing software tags
  3. Perceptual hash (pHash)       -> catches "old photo reused for a new event"
                                       by matching against a known-image registry
"""
import os
import io
import json
import hashlib
import numpy as np
import cv2
from PIL import Image, ImageChops
import imagehash
import exifread

# software tags that indicate deliberate editing (not just phone camera processing)
EDITING_SOFTWARE_SIGNATURES = [
    "photoshop", "gimp", "lightroom", "snapseed", "picsart",
    "canva", "pixlr", "affinity photo",
]

# hamming distance below this = "same image, essentially" -> flags re-used photos
PHASH_MATCH_THRESHOLD = 6


# ---------------------------------------------------------------------------
# Signal 1: ELA
# ---------------------------------------------------------------------------
def compute_ela(image_path: str, quality: int = 90, save_visual: str | None = None):
    """
    Resave the image at a known JPEG quality and diff against the original.
    Regions that were edited/spliced after the original compression show up
    as noticeably brighter in the diff ("error level") than untouched regions.

    Returns:
        ela_suspicion (float 0-100), reason (str or None)
    """
    try:
        original = Image.open(image_path).convert("RGB")
    except Exception as e:
        return 0.0, f"Could not open image for ELA: {e}"

    buffer = io.BytesIO()
    original.save(buffer, "JPEG", quality=quality)
    buffer.seek(0)
    resaved = Image.open(buffer)

    diff = ImageChops.difference(original, resaved)
    extrema = diff.getextrema()  # ((minR,maxR),(minG,maxG),(minB,maxB))
    max_diff = max(ex[1] for ex in extrema)

    # scale amplifies the diff so it's visible - also used for the score
    scale = 255.0 / max_diff if max_diff != 0 else 1.0

    if save_visual:
        amplified = diff.point(lambda p: min(255, int(p * scale)))
        amplified.save(save_visual)

    # Heuristic: images already near a JPEG-quality-90 baseline (i.e. authentic
    # phone photos saved once) have LOW max_diff. Screenshots, re-compressions,
    # and localized edits push max_diff up because parts of the image were
    # saved at a different quality/generation than the rest.
    # Normalize max_diff (0-255 range) into a 0-100 suspicion score.
    ela_suspicion = min(100.0, (max_diff / 120.0) * 100.0)

    reason = None
    if ela_suspicion > 55:
        reason = "High error-level variance detected - image may have been recompressed or locally edited"

    return round(ela_suspicion, 2), reason


# ---------------------------------------------------------------------------
# Signal 2: EXIF
# ---------------------------------------------------------------------------
def check_exif(image_path: str):
    """
    Reads EXIF metadata and flags common tamper/strip signals.

    Returns:
        exif_suspicion (float 0-100), reasons (list of str)
    """
    reasons = []
    suspicion = 0.0

    with open(image_path, "rb") as f:
        tags = exifread.process_file(f, details=False)

    if not tags:
        suspicion += 40
        reasons.append("No EXIF metadata found (stripped or a screenshot/re-save)")
    else:
        software = str(tags.get("Image Software", "")).lower()
        if any(sig in software for sig in EDITING_SOFTWARE_SIGNATURES):
            suspicion += 45
            reasons.append(f"EXIF Software tag indicates editing tool: '{tags.get('Image Software')}'")

        if "EXIF DateTimeOriginal" not in tags and "Image DateTime" not in tags:
            suspicion += 15
            reasons.append("No original capture timestamp in EXIF")

        if "Image Make" not in tags and "Image Model" not in tags:
            suspicion += 10
            reasons.append("No camera make/model in EXIF")

    return round(min(suspicion, 100.0), 2), reasons


# ---------------------------------------------------------------------------
# Signal 3: Blur / sharpness (variance of Laplacian)
# ---------------------------------------------------------------------------
# Real phone photos from a fast-moving protest/news event are rarely
# razor-sharp everywhere, so we don't want to punish moderate softness.
# Only flag images that are clearly, uniformly blurred (post-hoc blur applied
# to hide/obscure detail) which shows up as a very low Laplacian variance.
BLUR_VARIANCE_FLOOR = 15    # below this -> fully suspicious (100)
BLUR_VARIANCE_CEILING = 180  # above this -> not suspicious (0)


def compute_blur_suspicion(image_path: str):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return 0.0, None
    variance = cv2.Laplacian(img, cv2.CV_64F).var()

    if variance >= BLUR_VARIANCE_CEILING:
        suspicion = 0.0
    elif variance <= BLUR_VARIANCE_FLOOR:
        suspicion = 100.0
    else:
        # linear interpolation between floor and ceiling
        suspicion = 100.0 * (BLUR_VARIANCE_CEILING - variance) / (BLUR_VARIANCE_CEILING - BLUR_VARIANCE_FLOOR)

    reason = None
    if suspicion > 60:
        reason = f"Image is unusually soft/blurred (sharpness variance {variance:.1f}) - may be post-processed to obscure detail"

    return round(suspicion, 2), reason


# ---------------------------------------------------------------------------
# Signal 4: Histogram clipping (brightness / contrast manipulation)
# ---------------------------------------------------------------------------
def compute_histogram_suspicion(image_path: str):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return 0.0, None
    hist = cv2.calcHist([img], [0], None, [256], [0, 256]).flatten()
    total_pixels = img.size

    # fraction of pixels crushed to pure black or blown to pure white -
    # a strong sign of aggressive brightness/contrast adjustment
    clipped_fraction = (hist[0] + hist[255]) / total_pixels

    suspicion = min(100.0, clipped_fraction * 800)  # 12.5% clipping -> 100 suspicion

    reason = None
    if suspicion > 50:
        reason = f"Histogram shows {clipped_fraction*100:.1f}% of pixels clipped at black/white - possible brightness/contrast manipulation"

    return round(suspicion, 2), reason


# ---------------------------------------------------------------------------
# Signal 5: JPEG blockiness (recompression / screenshot artifacts)
# ---------------------------------------------------------------------------
def compute_blockiness_suspicion(image_path: str):
    """
    JPEG compresses in 8x8 blocks, which leaves faint discontinuities at
    block boundaries - stronger after multiple re-saves (screenshot of a
    screenshot, re-uploaded/re-compressed image, etc). We compare pixel
    differences AT 8-pixel-grid boundaries vs differences NOT at boundaries.
    A high ratio = visible blocking = evidence of re-compression.
    """
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return 0.0, None
    img = img.astype(np.float32)
    h, w = img.shape

    col_diffs = np.abs(np.diff(img, axis=1))
    boundary_cols = col_diffs[:, 7::8]
    non_boundary_cols = np.delete(col_diffs, np.arange(7, col_diffs.shape[1], 8), axis=1)

    row_diffs = np.abs(np.diff(img, axis=0))
    boundary_rows = row_diffs[7::8, :]
    non_boundary_rows = np.delete(row_diffs, np.arange(7, row_diffs.shape[0], 8), axis=0)

    boundary_mean = np.concatenate([boundary_cols.flatten(), boundary_rows.flatten()]).mean()
    non_boundary_mean = np.concatenate([non_boundary_cols.flatten(), non_boundary_rows.flatten()]).mean()

    ratio = boundary_mean / (non_boundary_mean + 1e-6)
    # ratio ~1.0 = no visible blocking, >1.3 = noticeable, >1.8 = strong
    suspicion = min(100.0, max(0.0, (ratio - 1.0) * 120))

    reason = None
    if suspicion > 55:
        reason = f"JPEG block-boundary artifacts detected (ratio {ratio:.2f}) - likely re-compressed or a screenshot"

    return round(suspicion, 2), reason


# ---------------------------------------------------------------------------
# Signal 6: Rotation artifact (canvas-fill corner check)
# ---------------------------------------------------------------------------
# Small-angle rotation tools (rotate-and-crop-to-bounding-box) typically leave
# solid-color triangular fill in the corners where there was no original
# pixel data. We sample small corner patches and flag near-uniform color
# blocks - real photo corners (sky, wall, ground) are rarely THIS flat.
def compute_rotation_suspicion(image_path: str):
    img = cv2.imread(image_path)
    if img is None:
        return 0.0, None
    h, w = img.shape[:2]
    patch = max(6, int(min(h, w) * 0.035))

    corners = {
        "top-left": img[0:patch, 0:patch],
        "top-right": img[0:patch, w - patch:w],
        "bottom-left": img[h - patch:h, 0:patch],
        "bottom-right": img[h - patch:h, w - patch:w],
    }

    flat_corners = 0
    for region in corners.values():
        if region.size == 0:
            continue
        std = region.reshape(-1, 3).std(axis=0).mean()
        if std < 4.0:  # near-zero variance = solid fill color
            flat_corners += 1

    suspicion = {0: 0.0, 1: 20.0, 2: 55.0, 3: 80.0, 4: 90.0}[flat_corners]
    reason = None
    if flat_corners >= 2:
        reason = f"{flat_corners} of 4 corners are solid-color blocks - consistent with canvas fill from a rotated/cropped edit"

    return round(suspicion, 2), reason


# ---------------------------------------------------------------------------
# Signal 7: Screenshot detection (common device/screen resolution match)
# ---------------------------------------------------------------------------
COMMON_SCREEN_RESOLUTIONS = {
    (1080, 1920), (1170, 2532), (1179, 2556), (750, 1334), (828, 1792),
    (1284, 2778), (1080, 2340), (1080, 2400), (720, 1600), (1440, 3200),
    (1920, 1080), (1366, 768), (1280, 720), (2560, 1440), (1600, 900),
    (360, 800), (412, 915), (393, 873), (414, 896),
}


def compute_screenshot_suspicion(image_path: str):
    try:
        img = Image.open(image_path)
        w, h = img.size
    except Exception:
        return 0.0, None

    dims = (w, h)
    dims_flipped = (h, w)
    exact_match = dims in COMMON_SCREEN_RESOLUTIONS or dims_flipped in COMMON_SCREEN_RESOLUTIONS

    suspicion = 0.0
    reason = None
    if exact_match:
        suspicion = 70.0
        reason = f"Image dimensions ({w}x{h}) exactly match a common phone/monitor screen resolution - likely a screenshot"

    return round(suspicion, 2), reason


# ---------------------------------------------------------------------------
# Signal 10: Perceptual hash / reuse detection
# ---------------------------------------------------------------------------
def compute_phash(image_path: str) -> str:
    return str(imagehash.phash(Image.open(image_path)))


def check_phash_reuse(new_hash: str, registry: dict):
    """
    registry: {filename: phash_str} of previously-sealed/known images.
    Returns (is_reused: bool, matched_filename: str or None, distance: int or None)
    """
    new_h = imagehash.hex_to_hash(new_hash)
    best_match, best_dist = None, None
    for fname, h in registry.items():
        dist = new_h - imagehash.hex_to_hash(h)
        if best_dist is None or dist < best_dist:
            best_dist, best_match = dist, fname
    if best_dist is not None and best_dist <= PHASH_MATCH_THRESHOLD:
        return True, best_match, best_dist
    return False, None, best_dist


# ---------------------------------------------------------------------------
# Combine everything into one Integrity Score
# ---------------------------------------------------------------------------
# weights - phash reuse is a hard override (if it's a known re-used image,
# trust drops sharply regardless of the weighted score below).
# EXIF is kept but at low weight: in THIS demo dataset almost every image
# (real and fake alike) is missing camera EXIF, so it barely separates the
# classes here - but in the real world "no EXIF at all" is still a
# legitimate red flag worth a small contribution, not a dominant one.
W_ELA = 0.12
W_EXIF = 0.12
W_BLUR = 0.18
W_HIST = 0.15
W_BLOCK = 0.18
W_ROTATION = 0.13
W_SCREENSHOT = 0.12


def sha256_of_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def analyze_image(image_path: str, phash_registry: dict | None = None, save_ela_visual: str | None = None):
    """
    Runs all 3 signals and returns a combined result dict.
    phash_registry: optional dict of {filename: phash} to check reuse against.
    """
    ela_suspicion, ela_reason = compute_ela(image_path, save_visual=save_ela_visual)
    exif_suspicion, exif_reasons = check_exif(image_path)
    blur_suspicion, blur_reason = compute_blur_suspicion(image_path)
    hist_suspicion, hist_reason = compute_histogram_suspicion(image_path)
    block_suspicion, block_reason = compute_blockiness_suspicion(image_path)
    rotation_suspicion, rotation_reason = compute_rotation_suspicion(image_path)
    screenshot_suspicion, screenshot_reason = compute_screenshot_suspicion(image_path)
    phash = compute_phash(image_path)
    file_hash = sha256_of_file(image_path)

    reasons = []
    if ela_reason:
        reasons.append(ela_reason)
    reasons.extend(exif_reasons)
    if blur_reason:
        reasons.append(blur_reason)
    if hist_reason:
        reasons.append(hist_reason)
    if block_reason:
        reasons.append(block_reason)
    if rotation_reason:
        reasons.append(rotation_reason)
    if screenshot_reason:
        reasons.append(screenshot_reason)

    combined_suspicion = (
        (ela_suspicion * W_ELA)
        + (exif_suspicion * W_EXIF)
        + (blur_suspicion * W_BLUR)
        + (hist_suspicion * W_HIST)
        + (block_suspicion * W_BLOCK)
        + (rotation_suspicion * W_ROTATION)
        + (screenshot_suspicion * W_SCREENSHOT)
    )

    reuse_flag = False
    if phash_registry:
        is_reused, matched, dist = check_phash_reuse(phash, phash_registry)
        if is_reused:
            reuse_flag = True
            combined_suspicion = max(combined_suspicion, 85)  # hard override
            reasons.append(f"Perceptual match to previously seen image '{matched}' (hamming distance {dist}) - possible reused/old photo")

    integrity_score = round(max(0.0, 100.0 - combined_suspicion), 2)

    if reuse_flag:
        verdict = "Flagged: Reused Image"
    elif integrity_score >= 75:
        verdict = "Verified Authentic"
    elif integrity_score >= 45:
        verdict = "Needs Review"
    else:
        verdict = "Likely Manipulated"

    return {
        "sha256_hash": file_hash,
        "phash": phash,
        "ela_score": ela_suspicion,
        "exif_score": exif_suspicion,
        "blur_score": blur_suspicion,
        "hist_score": hist_suspicion,
        "block_score": block_suspicion,
        "rotation_score": rotation_suspicion,
        "screenshot_score": screenshot_suspicion,
        "phash_match_flag": 1 if reuse_flag else 0,
        "integrity_score": integrity_score,
        "verdict": verdict,
        "reasons": json.dumps(reasons, ensure_ascii=False),
    }
