# TeacherSathi — QR Pairing Security (Phase 3)

## 1. Zero-Password Classroom Hardware Pairing

Typing passwords on 75" touch panels in front of a class of 40 students exposes teacher credentials to shoulder-surfing. TeacherSathi solves this with an ephemeral cryptographic pairing handshake.

```text
Teacher Device
   │
   ▼ POST /api/classroom/sessions/:id/pair
Generate Random Token (crypto.randomBytes(32))
   │
   ├── Store SHA-256 Hash in classroom_pairings
   ├── Set 5-minute expiration (expires_at = now() + 5 mins)
   ├── Status = WAITING / PAIRING
   │
   ▼ Return raw token only in QR payload
QR contains: https://teachersathi.in/auth/qr-confirm?token=<token>&session_id=<sessionId>
   │
   ▼ Smartboard Scans QR or Opens Receiver URL
POST /api/classroom/pair/consume
   │
   ├── Hash raw token with SHA-256
   ├── Match active pairing WHERE pairing_token_hash = hash AND used_at IS NULL
   ├── Check expires_at > now()
   ├── Mark used_at = now() (Single-use enforcement)
   ├── Register device in classroom_session_devices (status = CONNECTED)
   └── Transition session to ACTIVE
```

## 2. Security Invariants

1. **High Entropy**: 32-byte cryptographically random hex strings (256 bits of entropy).
2. **Never Stored in Plaintext**: Raw tokens are strictly held in memory during request lifecycle and never written to PostgreSQL tables or server logs.
3. **Single-Use Enforcement**: The pairing record is marked with `used_at = now()` atomically during consumption. Subsequent attempts are rejected with HTTP 401.
4. **Short 5-Minute Lifetime**: Tokens expire automatically after 300 seconds. Expired tokens are rejected.
5. **Session Scoped**: Tokens are tied to exactly one `session_id`. Tokens cannot be reused across multiple sessions.
6. **No Account Credential Leakage**: The pairing token grants authorization *only* for device display participation in that specific session. It grants zero access to teacher profile, billing, or general system administration.
