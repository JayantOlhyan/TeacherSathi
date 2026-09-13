# TeacherSathi — Subscription State Machine Specification

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Backend Engineers, Systems Architects

---

## 1. Formal State Machine Definition

A school subscription exists in exactly one state $S \in \mathcal{S}$ at any point in time:

$$\mathcal{S} = \{\text{TRIALING}, \text{ACTIVE}, \text{PAST\_DUE}, \text{PAUSED}, \text{CANCELLED}, \text{EXPIRED}\}$$

The state transitions are governed by transition function $\delta(S, E) \to S'$, where $E \in \mathcal{E}$ represents an event:

$$\mathcal{E} = \{\text{CHECKOUT\_COMPLETE}, \text{PAYMENT\_FAILED}, \text{RECOVERY\_PAYMENT}, \text{GRACE\_ELAPSED}, \text{USER\_CANCEL}, \text{PERIOD\_EXPIRED}, \text{REACTIVATION}\}$$

---

## 2. Transition Matrix

| From State ($S$) | Event ($E$) | To State ($S'$) | System Action & Side Effects |
| :--- | :--- | :--- | :--- |
| `TRIALING` | `CHECKOUT_COMPLETE` | `ACTIVE` | Upgrades to selected plan. Clears trial dates. Sets `current_period_end`. |
| `TRIALING` | `PERIOD_EXPIRED` | `EXPIRED` | Falls back to permanent free tier entitlements. |
| `ACTIVE` | `PAYMENT_FAILED` | `PAST_DUE` | Enters 7-day grace period. Blocks AI generation; preserves smartboards & reading. |
| `ACTIVE` | `USER_CANCEL` | `ACTIVE` | Sets `cancel_at_period_end = TRUE`. Entitlements remain active until period end. |
| `ACTIVE` | `PLAN_CHANGE` | `ACTIVE` | Prorated plan swap. Updates `plan_id`. Recomputes school quotas immediately. |
| `PAST_DUE` | `RECOVERY_PAYMENT` | `ACTIVE` | Clears delinquency. Restores full AI generation quotas. |
| `PAST_DUE` | `GRACE_ELAPSED` | `PAUSED` | Drops quotas to free tier limits. Disables smartboard pairings beyond 1. |
| `PAUSED` | `RECOVERY_PAYMENT` | `ACTIVE` | Resumes paid subscription immediately. |
| `PAUSED` | `PERIOD_EXPIRED` | `EXPIRED` | Formally concludes subscription cycle. |
| `CANCELLED` | `REACTIVATION` | `ACTIVE` | Clears cancellation flag; verifies renewal payment. |
| `EXPIRED` | `CHECKOUT_COMPLETE` | `ACTIVE` | Establishes new active subscription cycle. |

---

## 3. Illegal State Transitions & Guards

The billing repository strictly validates transitions:
- Attempting to transition `EXPIRED` $\to$ `PAST_DUE` is prohibited (must undergo new checkout $\to$ `ACTIVE`).
- Direct transition from `TRIALING` $\to$ `PAUSED` without delinquency is rejected.
- Invalid transitions throw a structured domain error:
  ```typescript
  throw new InvalidStateTransitionError(
    `Cannot transition subscription from ${currentStatus} to ${targetStatus}`
  );
  ```

---

## 4. Concurrency & Webhook Race Condition Handling

### The Concurrent Ingestion Challenge
When a user completes payment on the client side via Razorpay:
1. The browser immediately posts to `/api/billing/verify` with payment parameters.
2. Simultaneously, Razorpay's backend dispatches `payment.captured` and `subscription.activated` webhooks to `/api/billing/webhook`.

### Resolution Strategy
1. **Idempotency Keys**: Both routes check `processed_webhook_events` or existing `payment_records`.
2. **Atomic Status Updates**: Status updates utilize atomic conditional SQL:
   ```sql
   UPDATE subscriptions
   SET status = 'ACTIVE',
       updated_at = NOW()
   WHERE id = $1 AND status IN ('TRIALING', 'PAST_DUE', 'PAUSED');
   ```
3. **No-Op Idempotency**: If the subscription is already marked `ACTIVE` with matching `current_period_end`, subsequent verification calls return success (`200 OK`) without repeating side effects or duplicating event log entries.
