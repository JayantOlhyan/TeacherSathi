# TeacherSathi — SaaS Billing & Subscription Architecture

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Full-Stack Engineers, System Architects, Security Auditors  
> **Key Principle**: Academic data must never be deleted due to billing status. Payment processing and feature entitlements are strictly decoupled.

---

## 1. Architectural Philosophy & Principles

TeacherSathi is designed to empower educators across India while providing a sustainable, institutional SaaS commercial engine for private and public schools.

The billing subsystem is guided by five inviolable architectural principles:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                   INVIOLABLE BILLING PRINCIPLES                          │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. Zero Academic Data Loss                                               │
│    Unpaid, past-due, paused, or cancelled subscriptions NEVER destroy or │
│    purge student records, question banks, or curriculum progress.        │
│                                                                          │
│ 2. Payment & Entitlement Decoupling                                      │
│    Payment gateway state (e.g. Razorpay payment ID, subscription ID) is  │
│    distinct from application feature flags and quota limits.             │
│                                                                          │
│ 3. Fail-Closed Security with Safe Degraded State                         │
│    Payment verification fails closed upon error. Missing active          │
│    subscriptions fall back safely to the permanent FREE plan.            │
│                                                                          │
│ 4. 7-Day Grace Window for Operational Continuity                        │
│    Payment lapses enter PAST_DUE with a 7-day grace window: classroom    │
│    smartboard teaching and reading continue; cost-bearing AI is blocked. │
│                                                                          │
│ 5. Multi-Tenant School-Centric Billing Hierarchy                         │
│    SCHOOL ➔ SUBSCRIPTION ➔ PLAN ➔ ENTITLEMENTS ➔ USERS & USAGE          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenant Billing Hierarchy

In TeacherSathi, billing is institutional:
- **Individual Teachers** always enjoy 100% free access to core NCERT curriculum, basic quiz generation, and live classroom tools under the permanent `free` plan.
- **Schools / Institutions** purchase seat-based licenses (`school`, `school-pro`, `enterprise`) that unlock school-wide AI generation quotas, unlimited smartboard pairing, advanced diagnostic analytics, export capabilities, and school admin management.

```text
               ┌───────────────────────┐
               │     ORGANIZATION      │
               │   (School Account)    │
               └───────────┬───────────┘
                           │ 1
                           │
                           │ 1
               ┌───────────▼───────────┐
               │     SUBSCRIPTION      │
               │ (Status, Period, Ren) │
               └───────────┬───────────┘
                           │
                           │ references
                           ▼
               ┌───────────────────────┐
               │         PLAN          │
               │  (Quotas & Features)  │
               └───────────┬───────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │ computes                            │ provisions
        ▼                                     ▼
┌───────────────┐                     ┌───────────────┐
│ ENTITLEMENTS  │                     │ SCHOOL USERS  │
│ Max Teachers  │                     │ Admins        │
│ Monthly AI    │                     │ Teachers      │
│ Smartboards   │                     │ Students      │
│ Diagnostics   │                     └───────────────┘
└───────┬───────┘
        │
        ▼ checks against
┌───────────────┐
│  LIVE USAGE   │
│ Active Seats  │
│ Consumed AI   │
│ Paired Boards │
└───────────────┘
```

---

## 3. Core Component Layout

The billing subsystem resides entirely within well-defined boundaries:

| Layer | Files | Purpose |
| :--- | :--- | :--- |
| **Database Schema** | `supabase/migrations/20260911000008_saas_billing_and_subscriptions.sql` | `plans`, `subscriptions`, `subscription_events`, `payment_records`, `processed_webhook_events` |
| **Domain Types** | `src/lib/billing/types.ts` | Complete TypeScript interfaces for plans, subscriptions, payments, and usage metrics |
| **Validation Layer** | `src/lib/validations/billing.ts` | Strict Zod schemas for checkout, verification, plan switching, and cancellations |
| **Gateway Adapters** | `src/lib/billing/providers/` | Gateway abstraction with Razorpay provider and deterministic mock provider |
| **Entitlement Engine**| `src/lib/billing/entitlements.ts` | Pure deterministic quota calculations, grace period logic, and feature gates |
| **Data Repository** | `src/lib/repositories/billing.ts` | Data access layer with audit logging, usage counters, and webhook idempotency |
| **API Endpoints** | `src/app/api/billing/*` | 10 REST endpoints for plans, subscriptions, checkouts, verification, and webhooks |
| **User Interfaces** | `src/app/[locale]/pricing/page.tsx`<br>`src/app/[locale]/dashboard/admin/billing/page.tsx`<br>`src/app/[locale]/admin/billing/page.tsx` | Public pricing page, School Admin Billing Hub, and Super Admin SaaS Operations |

---

## 4. Payment Flow & Lifecycle Diagram

```text
School Admin                 TeacherSathi Server           Billing Provider (Razorpay)
    │                                │                                │
    │ 1. POST /api/billing/checkout  │                                │
    │───────────────────────────────>│                                │
    │                                │ 2. Create Order / Customer     │
    │                                │───────────────────────────────>│
    │                                │<───────────────────────────────│
    │                                │ 3. Return order_id & key       │
    │<───────────────────────────────│                                │
    │                                                                 │
    │ 4. Opens Standard Checkout UI (Modal / SDK)                     │
    │────────────────────────────────────────────────────────────────>│
    │ 5. Completes Card / UPI Payment                                 │
    │<────────────────────────────────────────────────────────────────│
    │                                                                 │
    │ 6. POST /api/billing/verify                                     │
    │───────────────────────────────>│                                │
    │                                │ 7. HMAC-SHA256 Sig Check       │
    │                                │──┐                             │
    │                                │  │ Timing-safe compare         │
    │                                │<─┘                             │
    │                                │ 8. Update DB to ACTIVE         │
    │                                │ 9. Log subscription_event      │
    │<───────────────────────────────│                                │
    │ 10. Redirect to Billing Hub    │                                │
    │                                │                                │
    │                                │ 11. Async Webhook (payment.captured)
    │                                │<───────────────────────────────│
    │                                │ 12. Idempotency Check & Ledger │
    │                                │───────────────────────────────>│
```

---

## 5. Security & Isolation Summary

1. **Role Separation**:
   - `SUPERADMIN`: Global read/write access across all school subscriptions, revenue metrics, and plan definitions.
   - `SCHOOL_ADMIN`: Read and manage billing exclusively for their associated `school_id`.
   - `TEACHER` / `STUDENT`: 100% blocked from viewing or executing billing mutations via PostgreSQL RLS and server API guards.
2. **Cryptographic Webhook Verification**:
   - Every incoming webhook must carry a valid `x-razorpay-signature` calculated via HMAC-SHA256 using the secret webhook salt.
   - Idempotency table `processed_webhook_events` prevents replay attacks and double-crediting.
3. **Grace Window Safeguard**:
   - When a payment fails (`PAST_DUE`), school teachers are not locked out of their classrooms. A 7-day grace window maintains read and smartboard access while alerting the administrator to update payment details.
