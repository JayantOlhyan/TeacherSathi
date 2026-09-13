# TeacherSathi — Phased Production Roadmap

> **Status**: Living Strategic Roadmap  
> **Rule**: Sequential execution. Do NOT jump phases.

---

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 0: Product Contract, Audit & Architecture Freeze     │
│ Status: COMPLETE                                            │
│ Focus: Audit reality, freeze scope, define data models.     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Production Database & PostgreSQL Data Architecture │
│ Status: COMPLETE                                            │
│ Focus: Supabase PostgreSQL schema, RLS, migrate localStorage.│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Server-Side AI Engine & Generation Pipeline        │
│ Status: COMPLETE                                            │
│ Focus: Provider abstraction, curriculum context, Zod schemas│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: Realtime Kiosk Handshake & Smartboard WebSockets   │
│ Status: COMPLETE                                            │
│ Focus: Supabase Realtime Channels, QR pairing, live control.│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: Academic Assessments, Attempts & Grading Ledger    │
│ Status: COMPLETE                                            │
│ Focus: Question snapshotting, timer authority, auto-grading.│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5A: Academic Intelligence & Concept Mastery Engine    │
│ Status: COMPLETE                                            │
│ Focus: Deterministic mastery, 65/35 decay, AI remediation.  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5B: Production SaaS Billing, Plans & Entitlements     │
│ Status: COMPLETE                                            │
│ Focus: Razorpay checkout, webhooks, grace window, RLS.      │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: Academic Intelligence & Closed-Loop Interventions   │
│ Status: COMPLETE                                            │
│ Focus: 65/35 decay, learning gaps, interventions, loop.     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 7: End-to-End Hardening, Cross-Device PWA & Launch    │
│ Status: READY TO EXECUTE (NEXT)                             │
│ Focus: Playwright tests, offline PWA queues, launch prep.   │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Breakdown & Deliverables

### Phase 0: Product Contract, Audit & Architecture Freeze
- Complete repository audit and reality check.
- Verification of typecheck, lint, and build statuses.
- Identification of all mock, static, and partial features.
- Creation of frozen product contracts, user roles, and database specifications.

### Phase 1: Production Database & PostgreSQL Architecture
- Provisioned Supabase PostgreSQL tables and relationships.
- Enabled Row Level Security (RLS) on all tables with tenant-isolation policies.
- Seeded canonical NCERT syllabus data from `src/lib/data/` into database tables.
- Replaced `src/lib/adminStore.ts` `localStorage` calls with Supabase SSR queries.
- Updated Next.js Middleware to verify Supabase Auth sessions on protected routes.

### Phase 2: Server-Side AI Engine & Structured Generation
- Built Next.js App Router API Route Handlers (`/api/ai/generate`, `/api/ai/genie`).
- Connected server-side AI provider with multi-provider abstraction (Gemini / Anthropic / OpenAI fallback).
- Implemented Zod schema validation for AI Lesson Plans, Worksheets, and Quizzes.
- Wired Saathi Genie chat drawer to live pedagogical AI streaming endpoints.

### Phase 3: Realtime Kiosk Handshake & Smartboard WebSockets
- Implemented Supabase Realtime Broadcast & Presence Channels on `/classroom`.
- Replaced interval polling with WebSocket event listeners and state reconciliation.
- Connected mobile remote control actions (`NEXT_SLIDE`, `START_QUIZ`, `LOCK_BOARD`) to live smartboard screen handlers.
- Cryptographic 5-minute single-use QR pairing tokens.

### Phase 4: Academic Assessments, Assignments, Student Attempts & Results
- Production PostgreSQL tables: `assessments`, `assessment_questions`, `assignments`, `assessment_attempts`, `attempt_answers`, `assessment_results`.
- Question Snapshot Immutability (`question_snapshot` JSONB) isolating student records from canonical edits.
- Server-authoritative timer validation with 60s mobile latency grace buffer.
- Answer key masking (`is_correct`, `correct_answer`, `explanation` stripped for student runtimes).
- Idempotent debounced and batch autosave on option selection.
- Automatic objective grading engine with configurable negative marking and score floor clamping.
- Teacher assessment builder, student exam player, result review, and class diagnostic analytics.

### Phase 5A: Academic Intelligence, Concept Mastery & Diagnostic Learning Analytics
- Production PostgreSQL migration `20260911000007_academic_intelligence.sql` with enums, indexes, and RLS.
- Tables: `student_concept_mastery`, `concept_mastery_history`, `learning_gaps`, `question_metrics`.
- Security-definer helper `is_teacher_of_student(p_teacher_id, p_student_id)`.
- Deterministic 65/35 recency-weighted decay scoring formula ($Score = 0.65 \times Recent + 0.35 \times Hist$).
- Multi-tier evidence confidence rating (`INSUFFICIENT_EVIDENCE`, `LOW`, `MEDIUM`, `HIGH`).
- Empirical question observed difficulty calculation and author-discrepancy detection.
- Learning gap lifecycle state machine (`IDENTIFIED`, `INTERVENTION_SCHEDULED`, `REASSESSED`, `RESOLVED`).
- AI 15-minute micro-remediation generator with 5 diagnostic check questions (`InterventionActivitySchema`).
- Dedicated Teacher Diagnostic Hub (`/[locale]/dashboard/analytics`) and Student Learning Journey (`/[locale]/student/progress`).
- Automatic recalculation event hook in `assessmentRepository.submitAttempt`.

### Phase 5B: Production SaaS Billing, Subscription Management, Plans & Entitlements
- Production PostgreSQL migration `20260911000008_saas_billing_and_subscriptions.sql` with enums, indexes, and RLS.
- Tables: `plans`, `subscriptions`, `subscription_events`, `payment_records`, `processed_webhook_events`.
- Security-definer helper `is_school_admin_of(p_user_id, p_school_id)`.
- Seed plans: `free` (₹0), `school` (₹4,999/yr), `school-pro` (₹9,999/yr), `enterprise` (₹29,999/yr).
- BillingProvider abstraction with native `RazorpayBillingProvider` and `MockBillingProvider`.
- Timing-safe HMAC-SHA256 signature verification with byte-length guard using `crypto.timingSafeEqual`.
- Idempotent webhook ingestion with replay protection via `processed_webhook_events`.
- Entitlement engine with 7-day grace window for delinquent accounts (blocking cost-bearing AI, preserving smartboards & reading).
- 10 REST route handlers under `/api/billing/*`.
- Interactive Pricing & Checkout UI (`/pricing`), School Admin Billing Hub (`/dashboard/admin/billing`), and Superadmin SaaS Operations (`/admin/billing`).
- Zero academic data loss guarantee on subscription changes.

### Phase 6: Academic Intelligence, Concept Mastery, Learning Gaps & Closed-Loop Intervention Engine
- Production PostgreSQL migration `20260911000009_academic_interventions_and_intelligence.sql`.
- Enums: `intervention_type`, `intervention_status`, expanded `gap_status` (`IMPROVING`, `INSUFFICIENT_EVIDENCE`).
- Table: `interventions` with RLS policies, teacher draft protection, and B-tree indexes.
- Deterministic 65/35 recency-weighted decay scoring formula ($Score = 0.65 \times Recent + 0.35 \times Hist$).
- Multi-tier evidence confidence engine (`INSUFFICIENT_EVIDENCE`, `LOW`, `MEDIUM`, `HIGH`).
- Learning gap lifecycle: `OPEN` $\to$ `IN_REMEDIATION` $\to$ `IMPROVING` $\to$ `RESOLVED`.
- Closed-loop intervention repository with automated reassessment provisioning (`assessments` + `assignments`).
- Data quality & curriculum audit service (`dataQualityService.scanDataQuality`) detecting unmapped items and orphaned records.
- 6 Analytics APIs and 4 Interventions CRUD APIs with strict Phase 5 SaaS entitlement checks (`diagnostic_analytics`, `ai_remediation`).
- Teacher Diagnostic Matrix (`/dashboard/analytics`) with affected students modal, AI remediation review, and active interventions ledger.
- Student Learning Journey (`/student/progress`) with assigned practice checks and resolved mastery badges.
- 171 automated tests across 31 test files passing with 100% success rate.

### Phase 7: End-to-End Hardening, Cross-Device PWA & Launch Readiness (Next)
- Automated Playwright E2E testing suite covering core user journeys (signup $\rightarrow$ kit gen $\rightarrow$ smartboard pairing $\rightarrow$ assessment $\rightarrow$ concept analytics $\rightarrow$ closed-loop reassessment $\rightarrow$ checkout).
- Institutional Lead Capture API & CRM dispatch integration.
- Offline PWA queue synchronization and service worker background sync.
- Core Web Vitals optimization and 2G/3G network throttle verification.


