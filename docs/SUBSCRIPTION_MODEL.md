# TeacherSathi — Subscription Model & Lifecycle

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Backend Engineers, Product Managers, Operations Teams

---

## 1. Domain Entities

TeacherSathi structures subscription management around four core relational tables in PostgreSQL:

```text
┌──────────────────────────────────────────────────────────────┐
│                            PLANS                             │
│ id, slug, name, price_inr, interval, entitlements, flags     │
└──────────────────────────────┬───────────────────────────────┘
                               │ 1
                               │
                               │ *
┌──────────────────────────────▼───────────────────────────────┐
│                        SUBSCRIPTIONS                         │
│ id, school_id, plan_id, status, billing_interval,            │
│ current_period_start, current_period_end, cancel_at_period_end│
└──────────────┬───────────────────────────────┬───────────────┘
               │ 1                             │ 1
               │                               │
               │ *                             │ *
┌──────────────▼───────────────┐ ┌─────────────▼───────────────┐
│     SUBSCRIPTION_EVENTS      │ │       PAYMENT_RECORDS       │
│ id, subscription_id, event,  │ │ id, subscription_id,        │
│ previous_status, new_status, │ │ provider_payment_id, amount,│
│ metadata, created_at         │ │ status, currency, method    │
└──────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Subscription Schema & Fields

### `subscriptions` Table
Defined in migration `20260911000008_saas_billing_and_subscriptions.sql`:

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status NOT NULL DEFAULT 'TRIALING',
    billing_interval billing_interval NOT NULL DEFAULT 'YEARLY',
    provider_customer_id VARCHAR(255),
    provider_subscription_id VARCHAR(255),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_school_subscription UNIQUE(school_id)
);
```

### Key Field Semantics
- `school_id`: Unique identifier of the tenant institution. One active subscription per school is enforced via `uq_school_subscription`.
- `plan_id`: Foreign key pointing to the authoritative `plans` definition.
- `status`: Current lifecycle phase represented by `subscription_status` enum.
- `current_period_start` / `current_period_end`: ISO timestamps defining the active billing duration.
- `cancel_at_period_end`: When `TRUE`, indicates that the administrator has initiated cancellation, but the school retains paid entitlements until `current_period_end`.
- `metadata`: Flexible JSONB payload for provider reference IDs, PO numbers, and customized contract notes.

---

## 3. Subscription Status Lifecycle

```text
       ┌──────────────┐
       │   TRIALING   │ (New school onboarding, 14-day trial)
       └──────┬───────┘
              │ Payment Success
              ▼
       ┌──────────────┐
  ┌───>│    ACTIVE    │<────────────────────────┐
  │    └──────┬───────┘                         │
  │           │ Renewal Fails                   │ Payment Captured
  │           ▼                                 │
  │    ┌──────────────┐                         │
  │    │   PAST_DUE   │ (7-Day Grace Period)────┘
  │    └──────┬───────┘
  │           │ Grace Exceeds 7 Days
  │           ▼
  │    ┌──────────────┐
  │    │    PAUSED    │ (Core locked to Free limits)
  │    └──────┬───────┘
  │           │
  │           │ Admin cancels or period finishes
  │           ▼
  │    ┌──────────────┐
  │    │  CANCELLED   │ (Set cancel_at_period_end = true)
  │    └──────┬───────┘
  │           │ Reaches current_period_end
  │           ▼
  │    ┌──────────────┐
  └────┤   EXPIRED    │ (Reverts permanently to Free entitlements)
       └──────────────┘
```

---

## 4. State Transitions & Business Logic

| Current Status | Event / Trigger | Target Status | Entitlement & System Behavior |
| :--- | :--- | :--- | :--- |
| `TRIALING` | Initial Setup | `TRIALING` | Full `school-pro` feature access for 14 days. |
| `TRIALING` | Payment Succeeded | `ACTIVE` | Upgrades to purchased plan entitlements; trial concludes. |
| `ACTIVE` | Renewal Payment Fails | `PAST_DUE` | Enters 7-day grace window. Classroom smartboards and curriculum viewing continue. Cost-bearing AI generation is blocked. |
| `PAST_DUE` | Payment Succeeded within 7 Days | `ACTIVE` | Grace period ends. Full entitlements immediately restored. |
| `PAST_DUE` | 7 Days Expire with No Payment | `PAUSED` | Quotas drop to free tier limits. Only 3 teachers allowed. Smartboards capped at 1. |
| `ACTIVE` | Admin Initiates Cancellation | `ACTIVE` (`cancel_at_period_end: true`) | Paid features remain operational until `current_period_end`. |
| `ACTIVE` (`cancel_at_period_end`) | `current_period_end` Reached | `CANCELLED` / `EXPIRED` | Features automatically drop to permanent free tier. Academic data is 100% preserved. |
| `CANCELLED` / `EXPIRED` | Reactivation / New Checkout | `ACTIVE` | New payment verified; entitlements restored immediately. |

---

## 5. Subscription Events & Audit Logging

Every state transition, checkout, verification, plan swap, or cancellation generates an immutable entry in `subscription_events`:

```sql
CREATE TABLE subscription_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    event_type subscription_event_type NOT NULL,
    previous_status subscription_status,
    new_status subscription_status,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Supported `event_type` values:
- `CREATED`: Initial record insertion.
- `ACTIVATED`: Successful initial payment or trial conversion.
- `RENEWED`: Periodic recurring charge confirmed.
- `PAYMENT_FAILED`: Charge attempt rejected by gateway.
- `PLAN_CHANGED`: Upgrade or downgrade between tiers.
- `CANCELLED`: Admin requested end-of-period termination.
- `PAUSED`: Delinquency grace window elapsed.
- `RESUMED`: Reactivated from paused state.
- `EXPIRED`: Period concluded with no renewal.
