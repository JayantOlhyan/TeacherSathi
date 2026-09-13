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
│ PHASE 7: Advanced Content, Media & Video Production Pipeline│
│ Status: COMPLETE                                            │
│ Focus: Slide studio, 75" kiosk viewer, mind maps, exports.  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 8: Scale, School Networks & District/State Admin      │
│ Status: COMPLETE                                            │
│ Focus: Multi-tenant, RLS, N>=10 privacy, cascading settings.│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 9: Native Mobile + Offline / Low-Connectivity Exper. │
│ Status: COMPLETE                                            │
│ Focus: React Native, Expo SQLite, offline packs, sync engine│
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

### Phase 7: Advanced Content, Media & Video Production Pipeline (Completed)
- Production PostgreSQL migration `20260911000010_advanced_content_and_media_pipeline.sql`.
- Enums: `resource_type`, `resource_status`.
- Extended canonical `resources` table with `content` (JSONB), `version`, `validation_score`, `validation_errors`.
- Tables: `resource_versions` (immutable snapshots, rollback), `resource_usage` (audit/telemetry), `media_assets`, `media_jobs`.
- Zod validation schemas for 7 presentation slide types, 10 teaching activity archetypes, mind map graph topologies.
- Deterministic 100-point penalty content validator with 75" smartboard readability bounds ($\le 60$ words, $\le 5$ bullets) and Hindi Devanagari script verification.
- Fail-closed storage service with magic byte inspection (JPEG, PNG, PDF, WebM, MP4), traversal sanitization, and pre-signed URLs.
- Multi-channel export service producing 16:9 widescreen printable HTML/PDF, vector SVG mind maps, and A4 worksheets.
- Complete API layer: `/api/resources/*`, `/api/media/*`, `/api/presentations/*`, `/api/mindmaps/*`, `/api/activities/*`.
- 75" kiosk-ready interactive smartboard presentation viewer (`SmartboardSlideViewer`) integrated into `/classroom`.
- Teacher resource studio: Resource Library (`/dashboard/resources`), Resource Detail & Rollback (`/dashboard/resources/[id]`), Presentation Studio (`.../presentations/[id]/edit`), Mind Map Studio (`.../mindmaps/[id]/edit`), Teaching Activity Studio (`.../activities/[id]/edit`).
- 210 automated unit and integration tests across 40 test files passing with 100% success rate. 0 lint warnings, 0 type errors, clean production build.

### Phase 8: Scale, School Networks & District/State Administration (Completed)
- Production PostgreSQL migration `20260911000011_institutional_scale_and_administration.sql`.
- Enums: `institutional_scope`, `organization_type`, `invitation_status`.
- Roles: `STATE_ADMIN`, `DISTRICT_ADMIN`, `ORG_ADMIN`.
- Tables: `states`, `districts`, `organizations`, `state_members`, `district_members`, `organization_members`, `institutional_settings`, `institutional_invitations`, `daily_school_metrics`.
- Extended `schools` table with `state_id`, `district_id`, `organization_id` foreign keys and performance indexes.
- 6 PostgreSQL Security Definer helper functions (`is_state_admin`, `is_district_admin`, `is_organization_admin`, `is_state_admin_of_school`, `is_district_admin_of_school`, `is_org_admin_of_school`).
- Row-Level Security (RLS) policies guaranteeing multi-tenant isolation and complete privacy for independent standalone schools.
- Strict Student Privacy by Design ($N \ge 10$ minimum cohort sample size masking, protecting students from deductive identification).
- 4-Tier Cascading Governance Resolution engine (`Default` $\leftarrow$ `State` $\leftarrow$ `District` $\leftarrow$ `Organization` $\leftarrow$ `School`).
- Cryptographic single-use administrative invitations (`crypto.randomBytes(32)` tokens, SHA-256 hash storage, automatic expiry).
- 14 REST Route Handlers under `/api/admin/institutional/*` (states, districts, organizations, schools directory & onboarding, scope overview KPIs, academic intelligence, adoption, resources, comparative benchmarking, invitations, settings, report exports).
- Institutional Web Portals: Overview Dashboard (`/admin/institutional`), School Directory (`/admin/institutional/schools`), Academic Hub (`/admin/institutional/academic`), School Comparison Tool (`/admin/institutional/compare`), Invitations Manager (`/admin/institutional/invitations`), Cascading Governance Settings (`/admin/institutional/settings`).
- Navigation sidebar integration with dynamic capability gating.
- 267 automated unit and integration tests across 49 test files passing with 100% success rate. 0 lint warnings, 0 type errors, clean Next.js production build.

### Phase 9: Native Mobile + Offline / Low-Connectivity Experience (Completed)
- Native React Native 0.74 + Expo SDK 51 application workspace (`mobile/`) targeting Android and iOS.
- Production PostgreSQL migration `20260911000012_mobile_offline_and_notifications.sql`:
  - `notification_type` enum (`ASSIGNMENT_NEW`, `ASSIGNMENT_DUE`, `ASSESSMENT_PUBLISHED`, `RESULT_AVAILABLE`, `ANNOUNCEMENT`, `CLASSROOM_INVITE`, `SYNC_ALERT`).
  - `notifications`, `mobile_devices`, and `app_version_configs` tables with RLS and composite indexes.
- 5 Storage Tiers with strict 300MB device storage ceiling enforcement (`PERSISTENT_STATIC`, `DOWNLOADABLE_BUNDLE`, `AUTHORIZED_DYNAMIC`, `TRANSACTIONAL_OUTBOX`, `NON_CACHEABLE`).
- Transactional Outbox Sync Engine (`SyncEngine`) with exponential backoff, random jitter (0–500ms), 5 max attempts, and automatic reconnect dispatch.
- Deterministic Conflict Resolution Matrix (`conflictResolver`) ensuring strict server authority over grading and monotonic classroom event sequencing.
- Offline NCERT Class Pack production pipeline (`/api/mobile/class-pack/[chapterId]`) bundling presentations, mindmaps, lesson plans, and formative quizzes with SHA-256 tamper verification.
- Masked offline assessment player (`AssessmentEngine`) preventing client-side key inspection and enforcing tamper sealing upon submission.
- Smartboard remote controller (`ClassroomService`) with live slide navigation, screen locking, and quick quiz triggers.
- Push & in-app notification subsystem with role-gated deep linking (`NotificationService`).
- Shared school device data hygiene (`authService.logout()`) purging sensitive local answers and outbox queues while preserving public NCERT packs.
- Bilingual English and Hindi localization (`mobile/src/localization/index.ts`).
- 45 automated mobile tests across 11 test files in `tests/mobile/`.
- 312 total automated tests across 60 test files passing with 100% success rate. 0 lint warnings, 0 type errors, clean Next.js production build.

