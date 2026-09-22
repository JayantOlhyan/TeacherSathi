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
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 10: Platform Intelligence, Scale Hardening & Gov Deploy│
│ Status: COMPLETE                                            │
│ Focus: Reliability, DLQ, Rate Limiting, Threat Model, SRE   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 11: UX Audit, Human Experience & Usability Baseline   │
│ Status: COMPLETE                                            │
│ Focus: 20 Workflows, 75" Smartboard, Issue Register, Baseline│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 12: Design System, Visual Consistency & UI Foundation │
│ Status: COMPLETE                                            │
│ Focus: Tokens, UI components, settings, smartboard tokens   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 13: Unified Teacher Workspace UX                      │
│ Status: COMPLETE                                            │
│ Focus: Teaching context, 5 action pillars, 0 redundant input│
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 14: Content & Resource Experience                     │
│ Status: COMPLETE                                            │
│ Focus: Teaching intent, draft review, preview modal, handoff│
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

### Phase 10: Platform Intelligence, Scale Hardening & Government Deployment (Completed)
- Production PostgreSQL migration `20260911000013_platform_hardening_and_dead_letters.sql`:
  - 10 composite performance indexes for point lookups across attempts, answers, mastery, events, and jobs.
  - `job_dead_letters` table for quarantined background jobs with operator requeue/purge controls.
  - `feature_flags` table with hierarchical scopes (`PLATFORM`, `STATE`, `DISTRICT`, `ORGANIZATION`, `SCHOOL`) and percentage rollouts.
  - `operator_audit_logs` table for immutable recording of all administrative interventions.
- Standardized Global Error Model (`src/lib/errors/apiError.ts`) with safe correlation ID propagation (`x-request-id`).
- Centralized sliding-window rate limiter (`src/lib/security/rateLimiter.ts`) protecting 7 critical boundaries (`AUTH`, `AI_GENERATE`, `ATTEMPT_AUTOSAVE`, `ATTEMPT_SUBMIT`, `MEDIA_UPLOAD`, `MOBILE_SYNC`, `ADMIN_ACTIONS`).
- Heuristic abuse protection (`src/lib/security/abuseDetector.ts`): 5-strike progressive auth lockouts and 5-second submission replay guards.
- Strict SVG XML sanitizer (`src/lib/security/svgSanitizer.ts`) blocking stored XSS, script injection, and XXE attacks across media uploads and exports.
- Production AI fail-closed enforcement (`src/lib/ai/resilience.ts` & `src/lib/ai/providers/index.ts`) preventing synthetic mock fallbacks in production, with daily INR budget ceilings.
- Structured machine-readable JSON logging (`src/lib/observability/logger.ts`) with PII and secret scrubbing.
- Telemetry & metrics collector (`src/lib/observability/metrics.ts`) with latency percentiles (p50, p95, p99) and queue tracking.
- System health endpoints: `/api/health`, `/api/health/live`, `/api/health/ready`.
- Platform Operations Console (`/admin/operations`) with live telemetry, DLQ job manager, and feature flag controls.
- 17 government-grade architecture, threat model, SLA, and disaster recovery documents in `docs/`.
- 12 new automated test suites in `tests/platform/` covering rate limiting, abuse, DLQ, AI resilience, SVG security, feature flags, load simulation, and chaos testing.
- **357 total automated tests across 72 test suites passing with 100% success rate**. 0 lint warnings, 0 type errors, clean Next.js production build.
 
### Phase 11: UX Audit, Human Experience & Usability Baseline (Completed)
- Complete human-centered UX and usability audit of TeacherSathi across 20 distinct user workflows.
- Audited all major user types: Teacher (primary), 75-inch Classroom Smartboard User, Student in Classroom, Individual Student, First-time User, and School Administrator.
- Deep 75-inch smartboard analysis evaluating touch target ergonomics (>=64px requirement), viewing distance legibility (1080p, 1440p, 4K UHD), and standalone kiosk usability.
- Compared implementation against reference operational paradigms: Teacher Workspace (Plan • Prepare • Personalize) vs Classroom Mode (Teach • Engage • Assess).
- Core UX principles audit across 14 dimensions (Clarity, Next Action, Minimum Effort, No Redundant Input, Consistency, Feedback, Error Prevention, Error Recovery, Cognitive Load, Teacher Control, Classroom Readability, Touch Usability, Progressive Disclosure, Trust).
- Comprehensive 27-issue structured register (`docs/PHASE_11_ISSUE_REGISTER.md`) with P0/P1/P2/P3 severity classifications.
- Delivery of authoritative 27-section audit specification: `docs/PHASE_11_UX_AUDIT.md`.
- Explicit forward mapping of structural and usability fixes to subsequent Phases 12 through 18.

### Phase 12: Design System, Visual Consistency & UI Foundation (Completed)
- Canonical Design System Specification deliverable: `docs/PHASE_12_DESIGN_SYSTEM.md`.
- **Design System Tokens & Architecture**: Semantic color system, 4px grid spacing, consistent border radii scale, elevation levels, and strict iconography standards in `tailwind.config.ts` and `src/app/globals.css`.
- **Foundational Component Inventory**:
  - `src/components/ui/Button.tsx`: Accessible variants, loading states, and 75" classroom sizes (>=64px touch target).
  - `src/components/ui/Card.tsx`: Standardized container with uniform padding and semantic variants (`default`, `interactive`, `lesson`, `resource`, `assessment`, `recommendation`, `classroom`).
  - `src/components/ui/Badge.tsx`: Semantic status badges (`brand`, `success`, `warning`, `danger`, `info`, `classroom`).
  - `src/components/ui/Input.tsx`: Accessible inputs with labels, helper text, error states, and Hindi font line-height normalization.
  - `src/components/ui/Dialog.tsx`: Non-blocking `ConfirmDialog` and `AlertDialog` replacing browser `window.confirm()` and `alert()`.
  - `src/components/ui/Toast.tsx`: Non-intrusive toast notification provider and `useToast` hook.
  - `src/components/ui/ClassroomTouchBar.tsx`: 75" Smartboard tactile dock with >=64px touch targets and global keyboard arrow listeners.
  - `src/components/ui/SaathiCallout.tsx`: Assistant tip callout box enforcing Teacher = Decision Maker, Saathi = Assistant.
  - `src/components/ui/StateView.tsx`: Standardized empty/loading/error/offline state presentation with 8s slow connection timeout handling.
- **Audit Findings Resolved**:
  - **UX-001**: Created `/dashboard/settings` route with user profile, school UDISE, theme, and language preferences.
  - **UX-005**: Fixed broken Sidebar links for Question Bank and Worksheets to point to `/dashboard/resources`.
  - **UX-006**: Role-gated Institutions and Billing navigation links for school administrators only.
  - **UX-008**: Cleaned internal technical jargon across creation milestones, smartboard footers, and analytics.
  - **UX-009**: Upgraded `SmartboardSlideViewer.tsx` to 75" distance-legible typography scale (captions >= 20px, body >= 28px, headings >= 44px).
  - **UX-010**: Replaced blocking native `window.confirm()` and `alert()` in assessments, resources, and devices screens.
  - **UX-011**: Standardized 64px tactile touch targets for classroom controls in `ClassroomTouchBar`.
  - **UX-012**: Replaced "Silence Bell" with gentle "Attention Chime" and pedagogical tooltips.
  - **UX-019**: Added Whiteboard to dashboard navigation.
  - **UX-021**: Replaced reflective green-black glare gradient with low-glare slate tokens (`#0B131E`).
  - **UX-023**: Standardized border radii to `rounded-xl` across dashboard cards.
  - **UX-024**: Standardized icon stroke width to 2 across navigation.
  - **UX-025**: Integrated global keyboard arrow navigation for smartboard slides.
  - **UX-027**: Added 8-second slow connection timeout handling and pedagogical error recovery in `StateView`.
- **Quality & Verification**: 0 TypeScript errors, 0 ESLint errors, all 357 Vitest automated tests passing across 72 test suites, clean Next.js production build.

### Phase 13: Unified Teacher Workspace UX (Completed)
- Canonical Architecture Deliverable: `docs/PHASE_13_TEACHER_WORKSPACE_UX.md`.
- **Global Teaching Context Engine** (`src/lib/context/teachingContext.ts`): Client-safe synchronous context management with localStorage persistence and custom event bus syncing Dashboard, Chapter Workspace, AI Studio, and Classroom Mode.
- **Audit Findings Systematically Resolved**:
  - **UX-002**: Fixed broken curriculum discovery by adding "Curriculum" (`/content`) to `Sidebar.tsx` core navigation and creating a 5-class quick explorer grid on the Dashboard.
  - **UX-003**: Completely eliminated the fake 3-slide mock modal in `ChapterWorkspaceClient.tsx`; promoted a primary tactile hero action **"Start Class on Smartboard"** targeting the real 75" `/classroom` system.
  - **UX-005**: Standardized creation completion redirect to target `/dashboard/resources` or `returnUrl`.
  - **UX-013**: Established the Teacher Workspace vs. Classroom Mode paradigm with bidirectional context transfer, `returnUrl` preservation, an `← Exit to Workspace` header link, and a `Return to Chapter Workspace` button upon session conclusion.
  - **UX-016**: Standardized strict hierarchical breadcrumbs across all curriculum routes (`Dashboard` → `Curriculum` → `Class {N}` → `{Subject}` → `Ch {N}`).
  - **UX-017**: Eliminated analytics cognitive overload in the Chapter Workspace with a concise "Class Insights" card (Mastery %, on-track vs support counts, pedagogical tip) and deep-link to full analytics.
  - **UX-018**: Removed the hardcoded Class 10-A assumption across `dashboard/page.tsx` and `dashboard/classes/page.tsx`, enabling seamless switching across Classes 6-A, 7-A, 8-A, 9-B, and 10-A with dual actions ("Teach / Curriculum" & "Roster / Code").
  - **UX-020**: Eliminated redundant form inputs in `/dashboard/create` and `/dashboard/assessments/create` by inheriting active context from URL parameters, showing an "Active Context" banner, and skipping redundant class/subject selection steps.
  - **UX-022**: Contextualized Saathi AI assistance with 4 chapter-specific prompt chips (recap activity, misconceptions, Indian applications, Hindi notes).
- **Chapter Workspace 5 Action Pillars**: Restructured into Prepare, Teach, Assess, Understand, and Ask Saathi.
- **Quality & Verification**: 0 TypeScript errors (`tsc --noEmit`), 0 ESLint errors, all 357 Vitest automated tests passing across 72 test suites, clean Next.js production build.

### Phase 14: Content & Resource Experience (Completed)
- Canonical Architecture Deliverable: `docs/PHASE_14_CONTENT_RESOURCE_UX.md`.
- **Teaching Intent Model Over File Types**: Reorganized resources into **Prepare**, **Teach**, **Practice**, and **Assess** across Chapter Workspace, Resource Studio, and AI Creation Studio. Technical file types (`PRESENTATION`, `WORKSHEET`, `QUIZ`) relegated to secondary metadata.
- **Canonical Chapter Resources Engine** (`src/lib/data/chapterResources.ts`): High-contrast NCERT-aligned slide decks, tiered printable worksheets, formative clicker quizzes, and think-pair-share classroom activities.
- **Standardized UI Foundation**:
  - `src/components/resources/ResourceCard.tsx`: Standardized card displaying purpose, duration, slide/question count, curriculum tags, bookmark save toggle, and dual actions (`Preview` / `Teach`).
  - `src/components/resources/ResourcePreviewModal.tsx`: Instant interactive modal preview with slide carousel, `< Prev / Next >` controls, tabs for pedagogy & standards, and direct `Use in Class` handoff.
  - `src/lib/services/recentResources.ts`: Client-safe localStorage service for Recent & Saved resources with reactive custom DOM event synchronization.
- **Resource Studio Re-Architecture** (`src/app/[locale]/dashboard/resources/page.tsx`):
  - Active Teaching Context hero banner inheriting Class, Subject, and Chapter without re-selection.
  - 4 library navigation tabs: *For Current Chapter*, *Recent Resources*, *Saved*, and *All Resources*.
  - Natural teacher query search and category filter pills (`All`, `Lesson Slides`, `Worksheet`, `Quiz`, `Activity`, `Video`).
- **Full Resource Inspection Page** (`src/app/[locale]/dashboard/resources/[id]/page.tsx`): Upgraded technical snapshot page into full visual preview with tabs for Preview, Pedagogical Details, NCERT Alignment, and Version History audit rollback.
- **Intent-Based AI Studio & Review-Before-Use Flow** (`src/app/[locale]/dashboard/create/page.tsx`):
  - Step 1: Tell me what to create (6 intent tiles + inherited context banner).
  - Step 2: Customize Setup (difficulty, language, duration, item count).
  - Step 3: Teacher-facing progress milestones (replacing pipeline jargon).
  - Step 4: Review Your Resource (live draft preview with `Regenerate`, `Edit`, `Save to Resources`, and `Use in Class`).
- **Audit Findings Systematically Resolved**:
  - **UX-003**: Connected chapter presentations directly to the real 75" `/classroom` system.
  - **UX-005**: Fixed creation redirects and preserved bidirectional `returnUrl` navigation.
  - **UX-015**: Created client-side Recent & Saved resources state ledger.
  - **UX-020**: Implemented zero redundant inputs across all resource generation and preview flows.
- **Quality & Verification**: 0 TypeScript errors (`tsc --noEmit`), 0 ESLint errors, all 357 Vitest automated tests passing across 72 test suites, clean Next.js production build.

