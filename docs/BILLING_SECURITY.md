# TeacherSathi — Billing Security & Threat Model

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Security Officers, Compliance Teams, Backend Engineers

---

## 1. Threat Model & Mitigations

| Threat | Attack Vector | Architectural Mitigation in TeacherSathi |
| :--- | :--- | :--- |
| **Unauthorized Plan Escalation** | Tenant attempts to upgrade or modify plan without completing payment. | Server-authoritative verification: Subscriptions are only marked `ACTIVE` after HMAC-SHA256 signature verification or validated gateway webhook receipt. |
| **Tenant Cross-Contamination** | School Admin queries or alters subscriptions belonging to a different institution. | PostgreSQL Row Level Security (RLS) restricts access via `is_school_admin_of(auth.uid(), school_id)`. API routes strictly derive `school_id` from the authenticated user's session profile. |
| **Student / Teacher Tampering** | Authenticated student or teacher accesses billing endpoints to view financial records. | Hardened RLS policies reject non-admin access. API routes verify `role === 'SCHOOL_ADMIN'` or `role === 'SUPERADMIN'` prior to execution. |
| **Webhook Spoofing & Replay** | Attacker sends fake `payment.captured` webhooks to activate free accounts. | Cryptographic HMAC-SHA256 signature checking using `RAZORPAY_WEBHOOK_SECRET`. All events are recorded in `processed_webhook_events` to prevent replay attacks. |
| **Timing Side-Channel Exploits** | Attacker measures verification execution time to guess gateway signatures byte-by-byte. | Signatures are verified using `crypto.timingSafeEqual` over fixed-length buffer representations. |
| **Silent Failures in Production** | Missing production credentials falling back to mock provider. | `RazorpayBillingProvider` strictly fails closed and throws runtime errors in production if keys are missing. |

---

## 2. Role-Based Authorization Matrix

| Endpoint / Resource | Anonymous | Student | Teacher | School Admin | Superadmin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `GET /api/billing/plans` | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| `GET /api/billing/subscription` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `POST /api/billing/checkout` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `POST /api/billing/verify` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `POST /api/billing/change-plan` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `POST /api/billing/cancel` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `GET /api/billing/payments` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `GET /api/billing/usage` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Own School | ✅ All Schools |
| `POST /api/billing/webhook` | 🛡️ HMAC Only | 🛡️ HMAC Only | 🛡️ HMAC Only | 🛡️ HMAC Only | 🛡️ HMAC Only |
| `GET /api/billing/admin/overview` | ❌ Blocked | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Full Access |

---

## 3. Academic Data Safeguard Policy

> [!IMPORTANT]
> **Data Preservation Mandate**: Under no circumstances does the TeacherSathi billing subsystem delete, purge, or alter student records, teacher assessment history, concept mastery evaluations, or classroom logs due to subscription status changes (such as cancellation, expiration, or delinquency).

When a subscription transitions to `PAST_DUE`, `PAUSED`, `CANCELLED`, or `EXPIRED`:
1. All academic entities (`assessments`, `student_concept_mastery`, `learning_gaps`, `classes`, `questions`) remain fully intact in PostgreSQL.
2. The school is gracefully downgraded to the permanent `free` plan's active quotas.
3. Access to historical reports and curriculum materials remains read-enabled for educators and students.
4. Teachers can continue conducting basic live classroom lessons and administering existing assessments without interruption.
