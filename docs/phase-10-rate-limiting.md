# Phase 10: Multi-Tier Rate Limiting & Abuse Protection

## 1. Centralized Policy Architecture

TeacherSathi implements a multi-tier sliding-window rate limiting engine (`src/lib/security/rateLimiter.ts`). Rather than applying a single monolithic rate limit across the platform, distinct limits are tailored to sensitive boundaries:

| Boundary Key | Max Requests | Window (Seconds) | Identity Dimension | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`AUTH`** | 5 | 60s | Client IP | Prevents credential stuffing, OTP brute force, and token enumeration. |
| **`AI_GENERATE`** | 10 | 60s | Teacher / User ID | Protects upstream API quotas and enforces institutional cost budgets. |
| **`ATTEMPT_AUTOSAVE`** | 60 | 60s | Student Attempt ID | Allows high-frequency 1s autosaves per student without DB saturation. |
| **`ATTEMPT_SUBMIT`** | 3 | 60s | Student Attempt ID | Prevents accidental double-clicks and rapid replay submissions. |
| **`MEDIA_UPLOAD`** | 10 | 60s | Teacher ID | Mitigates storage denial-of-service and S3 bandwidth exhaustion. |
| **`MOBILE_SYNC`** | 30 | 60s | Mobile Device ID | Restricts outbox mutation bursts during reconnection storms. |
| **`ADMIN_ACTIONS`** | 20 | 60s | Operator ID | Throttle administrative role elevations, bulk exports, and invitations. |
| **`DEFAULT`** | 60 | 60s | Client IP | Default safety net for general API endpoints. |

---

## 2. Response Headers & Error Payload

When an incoming request violates the sliding window limit, the server immediately terminates the request and responds with **HTTP 429 Too Many Requests**:

### Standard Headers
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
x-request-id: req_mu049jwu_jz5w9ix
Retry-After: 42
```

### JSON Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Please retry later.",
    "requestId": "req_mu049jwu_jz5w9ix",
    "details": {
      "retryAfterSeconds": 42
    }
  }
}
```

---

## 3. Abuse Protection Heuristics (`abuseDetector.ts`)

In addition to rate limiting, the platform runs active heuristic detection:
1. **5-Strike Auth Lockout**:
   - 5 consecutive failed logins or incorrect OTP codes trigger a **15-minute progressive lockout** on the actor IP/email.
   - Prevents credential enumeration across school staff accounts.
2. **5-Second Submission Replay Detection**:
   - SHA-256 hash of submitted answer packets is memoized per attempt.
   - If an identical payload is posted within 5 seconds, it is flagged as a network replay and safely deduplicated without creating duplicate result rows.
