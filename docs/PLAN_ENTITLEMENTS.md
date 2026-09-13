# TeacherSathi — Plans, Quotas & Entitlements Specification

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Product Managers, Backend Developers, Support Engineers

---

## 1. Canonical Plan Tiering

TeacherSathi defines four canonical tiers in the `plans` table:

| Plan Attribute | Free (`free`) | School Starter (`school`) | School Pro (`school-pro`) | Enterprise (`enterprise`) |
| :--- | :--- | :--- | :--- | :--- |
| **Target** | Individual Teachers | Small Schools (K–5) | Standard Schools (K–10/12) | Large Chains & Networks |
| **Annual Price (INR)** | **₹0** (Free Forever) | **₹4,999 / year** | **₹9,999 / year** | **₹29,999 / year** |
| **Monthly Equivalent**| ₹0 | ₹499 / mo | ₹999 / mo | ₹2,999 / mo |
| **Teacher Seats** | 3 accounts | 15 accounts | 50 accounts | Unlimited (-1) |
| **AI Generations / Mo**| 50 credits | 500 credits | 2,500 credits | Unlimited (-1) |
| **Active Smartboards** | 1 paired display | 5 paired displays | 20 paired displays | Unlimited (-1) |
| **Max Students / Class**| 40 students | 60 students | 100 students | Unlimited (-1) |
| **Assessment History** | 30 days | 180 days | 365 days (1 Year) | 3650 days (10 Years) |

---

## 2. Feature Flags Matrix

Each plan stores a structured JSONB object of boolean feature flags:

```json
{
  "smartboard_pairing": true,
  "diagnostic_analytics": false,
  "ai_remediation": false,
  "export_pdf_pptx": false,
  "priority_support": false,
  "custom_branding": false,
  "unlimited_assessments": false
}
```

### Plan Feature Entitlements Breakdown

| Feature Flag | `free` | `school` | `school-pro` | `enterprise` | Description |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `smartboard_pairing` | ✅ (1) | ✅ (5) | ✅ (20) | ✅ (Unlimited) | Remote QR pairing to 75" classroom smartboard TVs. |
| `diagnostic_analytics`| ❌ | ✅ | ✅ | ✅ | Cohort concept mastery matrix and student learning profiles. |
| `ai_remediation` | ❌ | ❌ | ✅ | ✅ | Automated 15-minute remedial lesson plans and diagnostic check items. |
| `export_pdf_pptx` | ❌ | ✅ | ✅ | ✅ | Exporting slide decks and printable assessment worksheets. |
| `priority_support` | ❌ | ❌ | ✅ | ✅ | Dedicated WhatsApp and email support within 2 hours. |
| `custom_branding` | ❌ | ❌ | ❌ | ✅ | School logo and header watermark on printed worksheets and smartboard decks. |
| `unlimited_assessments`| ❌ | ✅ | ✅ | ✅ | Creation of summative and formative tests beyond 10/month. |

---

## 3. Entitlement Engine (`src/lib/billing/entitlements.ts`)

Feature enforcement is strictly performed server-side via pure, deterministic utility functions in `src/lib/billing/entitlements.ts`.

### 3.1 Quota & Entitlement Computation Flow

```text
Input: schoolId
   │
   ▼
Fetch active subscription from DB via billingRepository
   │
   ├─► No subscription found?
   │   └─► Return FREE plan entitlements (Fallback)
   │
   ├─► Subscription is ACTIVE or TRIALING?
   │   └─► Return plan's entitlements & feature flags
   │
   ├─► Subscription is PAST_DUE?
   │   ├─► Within 7-day grace window?
   │   │   └─► Allow core features; BLOCK cost-bearing AI generations
   │   └─► Grace window exceeded?
   │       └─► Return FREE plan entitlements
   │
   └─► Subscription is PAUSED, CANCELLED, or EXPIRED?
       └─► Return FREE plan entitlements
```

### 3.2 Key Methods

- **`getSchoolEntitlements(schoolId: string)`**: Returns the active `SchoolEntitlement` object containing `maxTeachers`, `monthlyAiGenerations`, `maxSmartboardPairings`, and all boolean flags.
- **`canUseFeature(schoolId: string, featureKey: string)`**: Evaluates whether a given feature is enabled for the school based on plan flags and grace period status.
- **`checkLimit(schoolId: string, quotaKey: string, currentUsage: number)`**: Returns `{ allowed: boolean, remaining: number, limit: number }` for capacity checks (e.g. inviting a new teacher or pairing a display).
- **`getRemainingQuota(schoolId: string, quotaKey: string)`**: Calculates available headroom by contrasting plan limit against live consumption metrics.

---

## 4. Integration with the AI Generation Engine

When any teacher initiates an AI generation via `/api/ai/generate`:

```typescript
// src/lib/ai/pipeline/rateLimiter.ts
const entitlement = await entitlementEngine.getSchoolEntitlements(schoolId);
const currentUsage = await billingRepository.getSchoolAiUsageThisMonth(schoolId);

if (entitlement.monthlyAiGenerations !== -1 && currentUsage >= entitlement.monthlyAiGenerations) {
  throw new MonthlyQuotaExceededError(
    `School monthly AI generation quota of ${entitlement.monthlyAiGenerations} reached. Upgrade plan to continue.`
  );
}
```

This prevents resource exhaustion while ensuring multi-seat quota aggregation across all teachers belonging to the same school.
