"""
Real cryptographic signing (Ed25519), additive to the existing SHA-256 seal.

Why this matters: the SHA-256 "seal_hash" chain proves internal consistency
(nobody quietly edited a past record) but it's self-referential - only
useful if you trust THIS server's database. A real Ed25519 signature means
ANYONE holding the public key can verify a piece of evidence is untouched
using nothing but that key and the evidence's signed manifest - no server,
no database, no internet required. That's what makes offline verification
(e.g. during an internet shutdown) possible at all.

This does not replace seal.py's hash-chain - it sits alongside it. Both are
stored on the EvidenceImage record.
"""
import os
import json
import base64
from nacl.signing import SigningKey, VerifyKey
from nacl.encoding import Base64Encoder
from nacl.exceptions import BadSignatureError

KEY_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "keys")
PRIVATE_KEY_PATH = os.path.join(KEY_DIR, "sottoqr_ed25519_private.key")
PUBLIC_KEY_PATH = os.path.join(KEY_DIR, "sottoqr_ed25519_public.key")


def _ensure_keypair():
    """
    Generates a signing keypair on first run and persists it. In a real
    government deployment this key would live in an HSM or at minimum a
    properly access-controlled secret store, not a plain file - flagged
    here rather than glossed over.
    """
    os.makedirs(KEY_DIR, exist_ok=True)
    if os.path.exists(PRIVATE_KEY_PATH) and os.path.exists(PUBLIC_KEY_PATH):
        return
    signing_key = SigningKey.generate()
    with open(PRIVATE_KEY_PATH, "wb") as f:
        f.write(signing_key.encode(encoder=Base64Encoder))
    with open(PUBLIC_KEY_PATH, "wb") as f:
        f.write(signing_key.verify_key.encode(encoder=Base64Encoder))


def get_signing_key() -> SigningKey:
    _ensure_keypair()
    with open(PRIVATE_KEY_PATH, "rb") as f:
        return SigningKey(f.read(), encoder=Base64Encoder)


def get_public_key_b64() -> str:
    _ensure_keypair()
    with open(PUBLIC_KEY_PATH, "rb") as f:
        return f.read().decode("ascii")


def build_manifest(sha256_hash: str, integrity_score: float, verdict: str,
                    sealed_at: str, seal_hash: str, evidence_id: int) -> dict:
    """The exact payload that gets signed. Order matters for reproducibility,
    so this is the single source of truth both signing and verifying use."""
    return {
        "evidence_id": evidence_id,
        "sha256": sha256_hash,
        "integrity_score": integrity_score,
        "verdict": verdict,
        "sealed_at": sealed_at,
        "seal_hash": seal_hash,
    }


def sign_manifest(manifest: dict) -> str:
    """Returns a base64 Ed25519 signature over the canonical JSON of the manifest."""
    signing_key = get_signing_key()
    payload_bytes = json.dumps(manifest, sort_keys=True, separators=(",", ":")).encode("utf-8")
    signed = signing_key.sign(payload_bytes)
    return base64.b64encode(signed.signature).decode("ascii")


def verify_manifest(manifest: dict, signature_b64: str, public_key_b64: str) -> bool:
    """
    Fully offline: given a manifest, its signature, and the public key
    (no server, no DB, no internet), returns whether the signature is valid.
    This is what a standalone offline verifier (see scripts/verify_offline.py)
    calls.
    """
    try:
        verify_key = VerifyKey(public_key_b64.encode("ascii"), encoder=Base64Encoder)
        payload_bytes = json.dumps(manifest, sort_keys=True, separators=(",", ":")).encode("utf-8")
        verify_key.verify(payload_bytes, base64.b64decode(signature_b64))
        return True
    except (BadSignatureError, Exception):
        return False
