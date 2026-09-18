# Phase 10: Institutional Threat Model (STRIDE Analysis)

## 1. Actor Profiles & Threat Vectors

TeacherSathi operates in diverse educational environments ranging from urban private institutions to rural government schools. This threat model analyzes potential adversarial actions across 8 distinct actor profiles:

| Actor Profile | Primary Motivation | Threat Surface | Primary STRIDE Category |
| :--- | :--- | :--- | :--- |
| **Student** | Altering grades, obtaining answer keys early, cheating on tests. | Assessment player API, offline local storage, attempt submission. | Tampering, Information Disclosure |
| **Teacher** | Accessing unauthorized school data, unmonitored AI overuse. | Resource creation, class rosters, AI generation routes. | Elevation of Privilege, Abuse |
| **School Admin** | Accessing other institutions' reports, membership manipulation. | School admin endpoints, membership invites, billing controls. | Information Disclosure |
| **District/State Admin** | Unrestricted extraction of sensitive student PII across schools. | Aggregate export APIs, institutional comparison views. | Information Disclosure |
| **External Attacker** | Account takeover, denial of service, database compromise. | Public login endpoints, media upload buckets, API gateway. | Spoofing, Denial of Service |
| **Compromised Device** | Reading offline stored exams or tokens from stolen school tablet. | Mobile SQLite database, secure keystore, sync queue. | Tampering, Information Disclosure |
| **Malicious File** | Stored XSS or server-side resource exhaustion via poisoned SVG/PDF. | Media asset uploads, thumbnail probes, presentation renders. | Tampering, Denial of Service |
| **Privileged Insider** | Modifying platform settings or user records without oversight. | Operator console (`/admin/operations`), database direct access. | Repudiation, Tampering |

---

## 2. STRIDE Analysis & Implemented Mitigations

### Spoofing Identity
- *Threat*: Attacker guesses teacher password or brute-forces 6-digit OTP codes.
- *Mitigation*: 5-strike auth lockout policy in `abuseDetector.ts` (15-minute freeze); rate limit of 5 req/min on `/api/auth` per IP.

### Tampering with Data
- *Threat*: Student intercepts HTTP traffic to submit inflated scores or tamper with offline SQLite attempt scores before syncing.
- *Mitigation*: **Server-authoritative evaluation**. Client never computes scores or grades. Submission packets contain raw answers sealed with SHA-256 hashes. Server independently evaluates every question against authoritative answer keys.

### Repudiation
- *Threat*: Platform operator toggles a feature flag or disables an institution and denies responsibility.
- *Mitigation*: All operator actions require a recorded `operatorReason` and are logged immutably into `operator_audit_logs` with operator ID, IP address, request ID, and timestamp.

### Information Disclosure
- *Threat*: Tenant leak allows Teacher in School A to view student names in School B.
- *Mitigation*: PostgreSQL Row-Level Security (RLS) policies enforce school isolation (`WHERE school_id = auth.school_id()`). Unit and integration tests verify cross-tenant denial.

### Denial of Service
- *Threat*: Malicious student scripts high-frequency autosaves (1,000 req/sec) to exhaust database connections.
- *Mitigation*: Sliding-window rate limiter restricts autosaves to 60 req/min per attempt ID. Statement timeouts kill slow queries after 10s.

### Elevation of Privilege
- *Threat*: Student modifies JWT claims or passes fake `role=SUPER_ADMIN` in payload.
- *Mitigation*: Roles are resolved strictly from signed JWT claims verified against Supabase `profiles` table. Endpoint handlers enforce `is_super_admin()` server-side checks.

---

## 3. Residual Risk Assessment

- **Physical Device Theft**: If a physical school tablet without a lock screen PIN is stolen while an assessment is active, in-progress answers could be viewed.
  - *Residual Risk*: Low. Authoritative grades are stored on server; student cannot modify published results.
- **Upstream AI Hallucination**: AI generating questions with slight pedagogical inaccuracies.
  - *Residual Risk*: Low. Pedagogical validation pipeline and teacher preview/edit controls ensure human-in-the-loop review before publication.
