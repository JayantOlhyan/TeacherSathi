# TeacherSathi — Billing Webhook Specifications & Event Ingestion

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Backend Engineers, DevOps Engineers, Security Auditors

---

## 1. Webhook Endpoint Specification

- **Route**: `POST /api/billing/webhook`
- **Authentication**: Cryptographic signature validation via HTTP header (`x-razorpay-signature`).
- **Content-Type**: `application/json` (Raw request payload required for signature calculation).
- **Idempotency**: Strictly guaranteed via `processed_webhook_events` ledger.

---

## 2. Supported Gateway Events & System Actions

| Webhook Event Name | Source Meaning | TeacherSathi Status Mutation | Side Effects & Actions |
| :--- | :--- | :--- | :--- |
| `payment.captured` | Individual invoice/charge captured. | Record inserted in `payment_records` with status `SUCCESS`. | If linked to a pending subscription, activates subscription. |
| `payment.failed` | Charge failed (e.g. card declined). | Record inserted in `payment_records` with status `FAILED`. | Transition subscription to `PAST_DUE`. 7-day grace window begins. |
| `subscription.activated` | First payment confirmed on plan. | `ACTIVE` | Entitlements updated. Admin notification sent. |
| `subscription.charged` | Periodic recurring charge successful. | `ACTIVE` | Extend `current_period_end`. Clear any past-due grace flags. |
| `subscription.halted` | Max retries exceeded; bank rejected. | `PAUSED` | Downgrade school entitlements to free tier limits. |
| `subscription.cancelled` | Sub canceled by provider/admin. | `CANCELLED` | Marks `cancel_at_period_end`. Reverts to free at period end. |
| `subscription.paused` | Merchant/Customer paused sub. | `PAUSED` | Drops quotas to free limits. |
| `subscription.resumed` | Customer resumed paused sub. | `ACTIVE` | Restores plan entitlements immediately. |

---

## 3. Idempotency & Deduplication Engine

Gateways like Razorpay retry webhooks exponentially upon transient network timeouts. Without idempotency, duplicate events could cause double-extending billing periods or recording duplicate ledger entries.

### 3.1 Idempotency Table Schema

```sql
CREATE TABLE processed_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_processed_events_event_id ON processed_webhook_events(event_id);
```

### 3.2 Idempotent Ingestion Algorithm

```text
Incoming Webhook Request
         │
         ▼
Extract Signature Header ('x-razorpay-signature')
         │
         ▼
Verify HMAC-SHA256(RawBody, Secret)
         ├─► Signature Invalid? ────► Return HTTP 400 Bad Request
         │
         ▼
Parse Event JSON: Extract event.id & event.event
         │
         ▼
Check processed_webhook_events WHERE event_id = ?
         ├─► Already Exists? ────────► Return HTTP 200 OK (Skip re-execution)
         │
         ▼
BEGIN TRANSACTION
   1. Insert into processed_webhook_events(event_id, event_type)
   2. Execute state transition on subscriptions table
   3. Insert audit log into subscription_events
   4. If payment, insert into payment_records
COMMIT TRANSACTION
         │
         ▼
Return HTTP 200 { received: true, eventId, eventType }
```

---

## 4. Webhook Security Guarantees

1. **Raw Body Integrity**: Verification is performed on the raw UTF-8 string payload before JSON deserialization to eliminate JSON whitespace discrepancies.
2. **Timing-Safe Digest Verification**: Verification uses timing-safe buffer comparison to defend against timing side-channel exploits.
3. **Fail-Closed on Replay or Corruption**: Malformed payloads or invalid HMAC headers immediately terminate with HTTP 400 without mutating database state.
