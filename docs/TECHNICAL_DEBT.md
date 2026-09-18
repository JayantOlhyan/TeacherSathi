# TeacherSathi — Technical Debt & Architectural Risk Register

> **Status**: Comprehensive Living Audit (Updated through Phase 10)  
> **Rule**: Rigorous, unvarnished documentation of existing technical debt.

---

## 1. Technical Debt Inventory

### TD-01: Browser `localStorage` Utilized as Mock Application Database
- **Severity**: `CRITICAL`
- **Location**: `src/lib/adminStore.ts`
- **Status**: **RESOLVED IN PHASE 1**
- **Resolution**: Migrated data models to normalized Supabase PostgreSQL database (`supabase/migrations/`), repository layer (`src/lib/repositories/`), and deterministic curriculum seeder (`scripts/seed-curriculum.ts`).

---

### TD-02: Zero Server-Side API Routes (`src/app/api/*`)
- **Severity**: `CRITICAL`
- **Location**: `src/app/api/`
- **Status**: **RESOLVED IN PHASES 1, 4 & 5**
- **Resolution**: Implemented 33 server-side route handlers covering curriculum, AI generation, classroom real-time events, assessments, assignments, attempts, results, and concept analytics with Zod input validation and automated audit logging.

---

### TD-03: Hardcoded Service Account Key in Repository
- **Severity**: `CRITICAL` (Security Alert)
- **Location**: `docs/credentials/teachersathi-backend-5e85f92836a2.json`
- **Status**: **QUARANTINED IN PHASE 1**
- **Resolution**: Verified file was never committed to remote git history; added `docs/credentials/`, `credentials/`, `*.key`, and `*.secret` to `.gitignore`. Formal notification issued to revoke Key ID `5e85f92836a211e678123538df7986d1a7577c7d` manually in Google Cloud Console.

---

### TD-04: Smartboard Kiosk Pairing Uses LocalStorage Polling
- **Severity**: `HIGH`
- **Location**: `src/app/[locale]/classroom/page.tsx` & `src/app/[locale]/auth/qr-confirm/page.tsx`
- **Status**: **RESOLVED IN PHASE 3**
- **Resolution**: Replaced `setInterval` polling and `localStorage.getItem("ts_qr_approved_*")` with Supabase Realtime broadcast channels (`classroom:session:<id>`), cryptographic 5-minute single-use pairing tokens (`classroom_pairings`), sequence-numbered authoritative events (`classroom_events`), and full remote control over presentations, quizzes, synchronized timers, and digital whiteboard.

---

### TD-05: Client-Only Authorization / Missing Route Guards
- **Severity**: `HIGH`
- **Location**: `src/middleware.ts` & `src/components/admin/AdminRoleGuard.tsx`
- **Status**: **RESOLVED IN PHASE 1**
- **Resolution**: `src/middleware.ts` now authoritatively inspects Supabase Auth user sessions and protects `/admin/*`, `/dashboard/*`, and `/student/*`, redirecting unauthenticated requests to `/login`.

---

### TD-06: Simulated AI Engine ("Saathi Genie" & Generation Wizards)
- **Severity**: `HIGH`
- **Location**: `src/app/[locale]/dashboard/page.tsx` & `src/app/[locale]/dashboard/create/page.tsx`
- **Status**: **RESOLVED IN PHASE 2**
- **Resolution**: Replaced simulated `setTimeout` delays and hardcoded substring matching with production AI generation engine (`/api/ai/generate`, `/api/ai/genie`), multi-provider abstraction (`MockAIProvider`, `GeminiProvider`, `AnthropicProvider`), curriculum context injection, Zod schema validation, educational constraint validation, retry self-repair loop, rate limiting, and telemetry persistence.

---

### TD-07: Hardcoded NCERT Curriculum in Static TypeScript Files
- **Severity**: `MEDIUM`
- **Location**: `src/lib/data/ncertSyllabus.ts` & `src/lib/data/chapters.ts`
- **Status**: **PARTIALLY RESOLVED IN PHASE 1** (Seeded in PostgreSQL; fallback files retained for static SSG generation).
- **Remaining Task**: Refactor remaining static SSG readers to consume database/cached server components in Phase 6.

---

### TD-08: Mock Pricing & Payment Checkouts
- **Severity**: `MEDIUM`
- **Location**: `src/app/[locale]/pricing/page.tsx`
- **Status**: **RESOLVED IN PHASE 5**
- **Resolution**: Implemented full Razorpay standard checkout integration with script loading, mock fallback, timing-safe HMAC-SHA256 verification, 10 `/api/billing/*` routes, School Admin Billing Hub (`/dashboard/admin/billing`), and Superadmin SaaS Operations (`/admin/billing`).

---

### TD-09: Unused Dependencies in `package.json`
- **Severity**: `LOW`
- **Location**: `package.json`
- **Status**: **RESOLVED IN PHASE 1**

---

#### TD-10: Automated Test Coverage
- **Severity**: `LOW`
- **Location**: Repository root
- **Status**: **RESOLVED FOR UNIT/INTEGRATION IN PHASES 2, 3, 4, 5, 6, 7 & 8**
- **Resolution**: Configured Vitest runner with 267 automated tests across 49 test files covering AI pipeline, database repositories, RLS policies, classroom state machines, assessment grading/security, mastery calculations, confidence ratings, difficulty analysis, gap state lifecycles, billing entitlements, state transitions, webhooks, data quality, closed-loop interventions, rich content schemas, version snapshots, fail-closed media uploads, multi-channel exports, institutional RBAC, RLS boundary isolation, hierarchy schemas, reporting engines, academic aggregation, student privacy masking, cryptographic invitations, and cascading settings resolution.
- **Remaining Task**: End-to-end Playwright UI test suite scheduled for Phase 9.

---

### TD-11: Hardcoded Mock Question State in Chapter Test
- **Severity**: `HIGH`
- **Location**: `src/app/[locale]/content/[grade]/[subject]/[chapter]/test/page.tsx`
- **Status**: **RESOLVED IN PHASE 4**
- **Resolution**: Replaced single hardcoded JSX question with dynamic curriculum test engine featuring real-time timers, options evaluation, scoring logic, and explanatory review.

---

### TD-12: Disconnected Academic Assessments & Student Results
- **Severity**: `CRITICAL`
- **Location**: Academic assessment lifecycle
- **Status**: **RESOLVED IN PHASE 4**
- **Resolution**: Built full production assessment subsystem: question snapshots, assignments, attempt sessions, autosaved answers, server-authoritative timer, and deterministic grading ledger.

---

### TD-13: Superficial Test Percentages & Lack of Concept Intelligence
- **Severity**: `CRITICAL`
- **Location**: Student & Teacher Analytics
- **Status**: **RESOLVED IN PHASE 5**
- **Resolution**: Implemented atomic concept mastery tracking with 65/35 recency-weighted decay scoring, dynamic confidence tiers (`INSUFFICIENT_EVIDENCE` to `HIGH`), empirical question difficulty calculation, learning gap state machine, AI-generated 15-min remediations, and teacher/student diagnostic hubs.

---

### TD-14: Open-Ended Remediation without Reassessment Loop Closure
- **Severity**: `HIGH`
- **Location**: `src/lib/repositories/interventions.ts`, `src/lib/services/mastery.ts`
- **Status**: **RESOLVED IN PHASE 6**
- **Resolution**: Closed the pedagogical loop by provisioning the `interventions` table, requiring teacher review (`DRAFT` $\to$ `APPROVED`), auto-generating a formal reassessment assessment and assignment (`assessments` + `assignments`), and automatically transitioning learning gaps from `IN_REMEDIATION` to `IMPROVING` (60-74%) and `RESOLVED` ($\ge 75\%$) upon submission of the reassessment.

---

### TD-15: Hardcoded Static Presentations in Smartboard Classroom
- **Severity**: `HIGH`
- **Location**: `src/app/[locale]/classroom/page.tsx`
- **Status**: **RESOLVED IN PHASE 7**
- **Resolution**: Replaced static presentation cards with polymorphic `SmartboardSlideViewer` component supporting 7 slide archetypes (`TITLE`, `CONTENT`, `IMAGE`, `DIAGRAM`, `QUESTION`, `ACTIVITY`, `SUMMARY`), fullscreen kiosk controls, formative question answer reveals, and authoritative Realtime classroom event synchronization.

---

### TD-16: Unvalidated Media Ingestion & Lack of Immutable Content Lineage
- **Severity**: `HIGH`
- **Location**: Storage and content management
- **Status**: **RESOLVED IN PHASE 7**
- **Resolution**: Deployed fail-closed storage service with magic byte inspection (JPEG, PNG, PDF, WebM, MP4), path traversal prevention, and 60-minute signed URLs. Implemented immutable version snapshotting on publish (`resource_versions`) with 1-click rollback, protecting active classroom sessions from live layout shifts.

---

### TD-17: Isolated Single-School Architecture Lacking Institutional Scale
- **Severity**: `CRITICAL`
- **Location**: Multi-school, network, district, and state governance
- **Status**: **RESOLVED IN PHASE 8**
- **Resolution**: Deployed multi-tier relational hierarchy (`states`, `districts`, `organizations`, `schools`), 6 PostgreSQL security definer functions, 12 RLS policies ensuring cross-tenant isolation and independent school privacy, 4-tier cascading settings inheritance, $N \ge 10$ student privacy protection, cryptographic single-use invitation tokens, 14 REST API endpoints, and comprehensive institutional portals.

---

### TD-18: Online-Only Mobile Dependency & Unreliable Classroom Connectivity
- **Severity**: `CRITICAL`
- **Location**: Mobile experience and low-connectivity rural/semi-urban Indian classrooms
- **Status**: **RESOLVED IN PHASE 9**
- **Resolution**: Built native React Native 0.74 + Expo SDK 51 mobile client (`mobile/`) with 5 SQLite storage tiers, transactional outbox sync engine with jittered exponential backoff (2–60s), deterministic conflict resolution matrix, downloadable NCERT Class Packs with SHA-256 tamper verification, masked offline assessment player, smartboard mobile remote co-pilot, hardware keychain session security, and shared device data wipe. Verified with 11 automated test suites (45 tests) bringing total repository test count to 312 tests passing 100%.

---

### TD-19: Unindexed High-Frequency Query Paths & Large Scale Degradation
- **Severity**: `HIGH`
- **Location**: Database layer (`assessment_attempts`, `attempt_answers`, `student_concept_mastery`, `learning_gaps`, `classroom_events`)
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Deployed 10 composite B-tree performance indexes in `supabase/migrations/20260911000013_platform_hardening_and_dead_letters.sql` optimized for 10M+ assessments and 100M+ events. Configured 8s statement timeout budget and PgBouncer transaction-mode connection pooling.

---

### TD-20: Missing Centralized Multi-Tier Rate Limiting & Abuse Protection
- **Severity**: `HIGH`
- **Location**: API gateway and mutation endpoints
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Implemented in-memory sliding-window log rate limiter with 7 distinct boundaries (`AUTH`, `AI_GENERATE`, `ATTEMPT_AUTOSAVE`, `ATTEMPT_SUBMIT`, `MEDIA_UPLOAD`, `MOBILE_SYNC`, `ADMIN_ACTIONS`). Added heuristic abuse detector with 5-strike auth lockout (15-min freeze) and 5-second duplicate submission replay guard.

---

### TD-21: Silent AI Mock Fallback in Production & Unmetered Cost Ceilings
- **Severity**: `HIGH`
- **Location**: `src/lib/ai/providers/index.ts`, `src/lib/ai/resilience.ts`
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Enforced fail-closed policy (`assertProductionSafety()`) throwing hard 503 errors rather than silently generating mock AI completions when API keys are missing in production. Implemented daily INR spending caps per school (₹5,000) and teacher (₹200) with timeout guards.

---

### TD-22: Background Job Failures Lacking Dead-Letter Queue (DLQ)
- **Severity**: `HIGH`
- **Location**: Background pipelines (sync processing, media transcode, bulk report generation)
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Created `src/lib/jobs/deadLetterQueue.ts` providing standard job lifecycle, jittered exponential backoff (1s base, 2x factor), 3-retry bounds, and quarantine table `job_dead_letters` with full operator requeue and purge controls.

---

### TD-23: Unsanitized SVG XML Uploads & XSS/XXE Vulnerability
- **Severity**: `HIGH`
- **Location**: Storage ingestion and media processing (`src/lib/security/svgSanitizer.ts`)
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Built strict SVG XML sanitizer stripping `<script>`, `<foreignObject>`, inline `on*` event handlers, `javascript:` URIs, and `<!ENTITY>` external definitions before storage ingestion or client rendering.

---

### TD-24: Unstructured Console Logging & PII Exposure Risk
- **Severity**: `MEDIUM`
- **Location**: `src/lib/observability/logger.ts`, `src/lib/observability/metrics.ts`
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Implemented structured JSON logging with recursive PII scrubbing (redacting Aadhaar, 10-digit Indian phone numbers, emails, passwords, auth tokens, and API keys) and circular reference protection. Built in-memory telemetry metrics buffer tracking p50/p95/p99 latency percentiles and error distributions.

---

### TD-25: Monolithic Releases Lacking Hierarchical Feature Flags & Kill-Switches
- **Severity**: `HIGH`
- **Location**: Platform deployment and feature activation
- **Status**: **RESOLVED IN PHASE 10**
- **Resolution**: Built hierarchical feature flag engine (`src/lib/services/featureFlags.ts`) supporting scoping across `PLATFORM` $\to$ `STATE` $\to$ `DISTRICT` $\to$ `ORGANIZATION` $\to$ `SCHOOL`, deterministic percentage rollout hashing, explicit target whitelists, and emergency instant kill-switches. Provisioned Platform Operations Console (`/admin/operations`) with full audit logging.
