"""
Offline SottoQR manifest verifier.

This is the actual answer to "what happens if the internet is shut down
during a crisis, like it was in July 2024?" - a journalist, investigator,
or court can verify evidence integrity using ONLY:
  1. a downloaded manifest.json (from GET /api/evidence/{id}/manifest)
  2. this script
  3. Python + pynacl

No server connection, no database, no internet required at verification
time. Only the ONE-TIME download of the manifest needs connectivity
(or it can be handed over on a USB drive / printed as a QR code).

Usage:
    python scripts/verify_offline.py manifest.json
"""
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.crypto_signing import verify_manifest


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/verify_offline.py <manifest.json>")
        sys.exit(1)

    path = sys.argv[1]
    with open(path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    manifest = payload["manifest"]
    signature = payload["signature_base64"]
    public_key = payload["public_key_base64"]

    valid = verify_manifest(manifest, signature, public_key)

    print("=" * 50)
    print("SottoQR Offline Verification")
    print("=" * 50)
    print(f"Evidence ID:      {manifest['evidence_id']}")
    print(f"SHA-256:          {manifest['sha256']}")
    print(f"Integrity Score:  {manifest['integrity_score']}")
    print(f"Verdict:          {manifest['verdict']}")
    print(f"Sealed At (UTC):  {manifest['sealed_at']}")
    print("-" * 50)
    if valid:
        print("RESULT: SIGNATURE VALID")
        print("This manifest has not been altered since it was signed.")
    else:
        print("RESULT: SIGNATURE INVALID")
        print("This manifest does NOT match the signature. Do not trust it.")
    print("=" * 50)
    sys.exit(0 if valid else 1)


if __name__ == "__main__":
    main()
