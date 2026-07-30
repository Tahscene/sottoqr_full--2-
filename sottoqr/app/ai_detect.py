"""
ai_detect.py  —  experimental AI / synthetic-image heuristic (ADD-ON).

The 2024-26 misinformation threat is AI-generated imagery, so SottoQR should
at least *flag* it. This module returns an `ai_suspicion` score (0-100) plus
readable reasons, computed from three cheap, transparent signals:

  1. spectral high-frequency energy   (diffusion/GAN output often lacks the
     fine sensor-noise high-frequency tail of a real camera photo)
  2. noise-residual uniformity        (real photos carry uneven sensor noise;
     synthetic images tend to be unnaturally smooth / uniform)
  3. channel-saturation extremity     (many AI images are over-"perfect")

IMPORTANT — this is a *heuristic screen*, not a definitive deepfake detector.
It is meant to feed the Integrity Score and mark images for human review.
Production path (see docs/): plug in a trained detector (e.g. a ViT/CNN
classifier or a provider API) behind this same `analyze()` interface.
"""
from __future__ import annotations
import numpy as np
from PIL import Image


def _luma(arr):
    return 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]


def analyze(path: str) -> dict:
    im = Image.open(path).convert("RGB")
    im.thumbnail((768, 768))
    arr = np.asarray(im).astype(np.float32)
    y = _luma(arr)

    # 1) spectral high-frequency energy ratio
    f = np.fft.fftshift(np.fft.fft2(y - y.mean()))
    mag = np.abs(f)
    h, w = mag.shape
    cy, cx = h // 2, w // 2
    yy, xx = np.ogrid[:h, :w]
    r = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2)
    rmax = r.max()
    high = mag[r > 0.35 * rmax].sum()
    total = mag.sum() + 1e-9
    hf_ratio = float(high / total)                       # lower => smoother
    hf_signal = float(np.clip((0.45 - hf_ratio) / 0.45, 0, 1))

    # 2) noise-residual uniformity (blockwise std of a high-pass residual)
    k = np.array([[0, -1, 0], [-1, 4, -1], [0, -1, 0]], dtype=np.float32)
    pad = np.pad(y, 1, mode="reflect")
    res = (k[0, 1] * pad[:-2, 1:-1] + k[1, 0] * pad[1:-1, :-2] +
           k[1, 1] * pad[1:-1, 1:-1] + k[1, 2] * pad[1:-1, 2:] +
           k[2, 1] * pad[2:, 1:-1])
    bs = 32
    stds = [res[i:i + bs, j:j + bs].std()
            for i in range(0, res.shape[0] - bs, bs)
            for j in range(0, res.shape[1] - bs, bs)]
    stds = np.array(stds) if stds else np.array([res.std()])
    # coefficient of variation: low spread of local noise => uniform => suspicious
    cov = float(stds.std() / (stds.mean() + 1e-6))
    uniform_signal = float(np.clip((0.6 - cov) / 0.6, 0, 1))

    # 3) saturation extremity
    mx = arr.max(axis=2); mn = arr.min(axis=2)
    sat = (mx - mn) / (mx + 1e-6)
    sat_extreme = float((sat > 0.9).mean())
    sat_signal = float(np.clip(sat_extreme / 0.15, 0, 1))

    suspicion = int(round(100 * (0.5 * hf_signal + 0.35 * uniform_signal +
                                 0.15 * sat_signal)))
    reasons = []
    if hf_signal > 0.5:
        reasons.append("unusually little high-frequency detail (very smooth)")
    if uniform_signal > 0.5:
        reasons.append("noise pattern is too uniform for a camera sensor")
    if sat_signal > 0.5:
        reasons.append("large regions of extreme saturation")
    if not reasons:
        reasons.append("no strong synthetic markers")

    return {
        "ai_suspicion": suspicion,             # 0 = looks camera-real, 100 = looks synthetic
        "signals": {
            "hf_ratio": round(hf_ratio, 4),
            "noise_cov": round(cov, 4),
            "sat_extreme": round(sat_extreme, 4),
        },
        "reasons": reasons,
        "note": "experimental heuristic screen, not a definitive deepfake detector",
    }


if __name__ == "__main__":
    import sys, tempfile, os
    if len(sys.argv) > 1:
        import json
        print(json.dumps(analyze(sys.argv[1]), indent=2))
    else:
        # direction sanity-check on two synthetic inputs
        d = tempfile.mkdtemp()
        # (a) smooth gradient -> should score HIGHER suspicion
        g = np.tile(np.linspace(0, 255, 512).astype(np.uint8), (512, 1))
        Image.merge("RGB", [Image.fromarray(g)] * 3).save(f"{d}/smooth.png")
        # (b) noisy 'photo-like' -> should score LOWER suspicion
        n = np.random.default_rng(0).integers(0, 256, (512, 512, 3), dtype=np.uint8)
        Image.fromarray(n).save(f"{d}/noisy.png")
        print("smooth gradient :", analyze(f"{d}/smooth.png")["ai_suspicion"])
        print("noisy photo-like:", analyze(f"{d}/noisy.png")["ai_suspicion"])
