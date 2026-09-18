# TeacherSathi — Production Gaps Inventory

> **Status**: Living Production Audit (Updated through Phase 10)  
> **Purpose**: Definitive checklist of missing production systems required to graduate from MVP Prototype to Production Reality.

---

## 1. Production Gaps by Architectural Layer

### Layer 1: Database & Data Persistence
- [x] **Canonical Database Schema**: Normalized tables for `grades`, `subjects`, `books`, `chapters`, `concepts`, and `questions` created in `supabase/migrations/` and seeded deterministically via `scripts/seed-curriculum.ts`. (Completed in Phase 1)
- [x] **Tenant Isolation & RLS**: Supabase Row Level Security enabled across all application tables with security definer helper functions (`is_teacher_of_student`, `is_student_in_class`). (Completed in Phases 1, 3, 4, & 5)
- [x] **Migration from `localStorage`**: Replaced business entity persistence in `src/lib/adminStore.ts` with repository layer and audit logging. (Completed in Phase 1)
- [x] **Assessment Subsystem Schema**: Provisioned `assessments`, `assessment_questions`, `assignments`, `assessment_attempts`, `attempt_answers`, and `assessment_results` with performance indexes. (Completed in Phase 4)
- [x] **Academic Intelligence Schema**: Provisioned `student_concept_mastery`, `concept_mastery_history`, `learning_gaps`, and `question_metrics` with composite performance indexes and multi-tenant RLS. (Completed in Phase 5)

### Layer 2: Server-Side API Architecture
- [x] **App Router Route Handlers**: Established core server routes under `src/app/api/` (`/api/profile`, `/api/classes`, `/api/curriculum`, `/api/questions`, `/api/resources`, `/api/classroom`). (Completed in Phase 1)
- [x] **Input Validation**: Zod runtime validation schemas established for all domain mutations in `src/lib/validations/`. (Completed in Phase 1 & 5)
- [x] **AI Generation Endpoints**: Established production generation endpoints `/api/ai/generate` and `/api/ai/genie` with auth, role gating, rate limiting, and telemetry. (Completed in Phase 2)
- [x] **Assessment API Suite**: Built 13 REST API endpoints for assessments, assignments, attempt sessions, autosaved answers, and evaluation results. (Completed in Phase 4)
- [x] **Academic Analytics API Suite**: Built 5 REST API endpoints for class diagnostics, student learning profiles, concept lookups, on-demand recomputation, and AI micro-remediation generation. (Completed in Phase 5)
- [ ] **Payments Webhook** (Queued for Phase 6):
  - `/api/payments/razorpay-webhook`

### Layer 3: Artificial Intelligence Engine
- [x] **Live LLM Integration & Provider Abstraction**: Built provider abstraction with native REST integrations for Google Gemini 1.5 Flash, Anthropic Claude 3.5 Sonnet, and deterministic MockAIProvider for offline testing. (Completed in Phase 2)
- [x] **Prompt Engineering & Context Injection**: Canonical curriculum resolver extracts Grade, Subject, Book, Chapter, Concepts, and Sample Questions from PostgreSQL to inject pedagogical context. (Completed in Phase 2)
- [x] **Output Schema Enforcement & Educational Validation**: Structured JSON mode backed by strict Zod schemas for all 8 products, plus deterministic educational checks (marks sum, durations, Devanagari script, smartboard 50-word limit). (Completed in Phase 2)
- [x] **Simulation Removal**: Eliminated `setTimeout`-based fake generation and hardcoded substring responses in dashboard and creator views. (Completed in Phase 2)
- [x] **AI Resource to Assessment Bridge**: Created `/api/assessments/ai-convert` to transform AI generated quizzes into formal classroom assessments. (Completed in Phase 4)
- [x] **AI Remediation Pipeline**: Created `interventionService.generateRemediation` producing structured 15-min remedial lesson plans with 4-step scripts and 5 diagnostic check items (`InterventionActivitySchema`). (Completed in Phase 5)

### Layer 4: Realtime Classroom Communication
- [x] **WebSocket Broadcast Handshake**: Replaced 1-second `localStorage` polling in `/classroom` and `/auth/qr-confirm` with real Supabase Realtime broadcast and presence channels. (Completed in Phase 3)
- [x] **Remote Command Dispatcher**: WebSocket listeners on the 75" kiosk display and teacher control panel execute remote actions (`NEXT_SLIDE`, `PREVIOUS_SLIDE`, `START_QUIZ`, `END_QUIZ`, `START_TIMER`, `LOCK_BOARD`, `CLEAR_WHITEBOARD`) backed by sequence numbers and PostgreSQL persistence. (Completed in Phase 3)
- [x] **Cryptographic QR Pairing**: 5-minute single-use SHA-256 hashed ephemeral tokens for zero-password smartboard pairing. (Completed in Phase 3)

### Layer 5: Academic Assessments & Evaluation Engine
- [x] **Question Snapshot Immutability**: JSONB snapshotting in `assessment_questions` isolating historic attempts from master question edits. (Completed in Phase 4)
- [x] **Server-Authoritative Countdown & Anti-Cheat**: Exam timer based on database `started_at` with 60s latency grace buffer and late answer rejection. (Completed in Phase 4)
- [x] **Answer Key Protection**: Sensitive answer keys and explanations stripped from student runtimes until evaluation is published. (Completed in Phase 4)
- [x] **Automated Grading Engine**: Real-time evaluation of MCQ, true/false, and fill-in-blanks with negative marking calculation and zero-floor clamping. (Completed in Phase 4)
- [x] **Continuous Debounced Autosave**: High-reliability answer persistence with conflict resolution (`uq_attempt_question`) and batch recovery. (Completed in Phase 4)
- [x] **Diagnostic Analytics**: Class average, pass rates, score distribution charts, and per-question error rate diagnostics for teachers. (Completed in Phase 4)

### Layer 6: Academic Intelligence, Learning Gaps & Closed-Loop Interventions
- [x] **Deterministic Recency-Decay Model**: 65/35 recent vs historical accuracy formula reflecting student trajectory and learning velocity. (Completed in Phase 5 & 6)
- [x] **Multi-Tier Confidence Engine**: Categorizes evidence confidence (`INSUFFICIENT_EVIDENCE`, `LOW`, `MEDIUM`, `HIGH`) based on attempt volume, assessment diversity, and time spread. (Completed in Phase 5 & 6)
- [x] **Empirical Question Difficulty**: Calculates cohort error rates (`EASY`, `MODERATE`, `DIFFICULT`, `VERY_DIFFICULT`) and flags discrepancies against author-declared difficulty. (Completed in Phase 5 & 6)
- [x] **Learning Gap State Machine**: Automates gap detection, severity grading (`CRITICAL`, `HIGH`, `MODERATE`, `ON_TRACK`), and closed-loop resolution upon reassessment (`OPEN` $\to$ `IN_REMEDIATION` $\to$ `IMPROVING` $\to$ `RESOLVED`). (Completed in Phase 6)
- [x] **Teacher Diagnostic Hub & Cohort Matrix**: Comprehensive class view grouping students into *Needs Urgent Support*, *Developing*, and *Mastery Achieved* with concept matrix and affected students inspection. (Completed in Phase 6)
- [x] **Closed-Loop Interventions Engine**: `interventions` table, teacher-in-the-loop review (`DRAFT` $\to$ `APPROVED` $\to$ `ASSIGNED`), and automated reassessment provisioning (`assessments` + `assignments`). (Completed in Phase 6)
- [x] **Data Quality & Curriculum Audit Service**: `dataQualityService.scanDataQuality` detecting unmapped questions, missing chapters, and orphaned records. (Completed in Phase 6)
- [x] **Student Learning Journey**: Transparent concept mastery bars, subject tabs, focus area cards, historical trajectory curves, and assigned reassessments. (Completed in Phase 6)

### Layer 7: Monetization, Billing & Admin Portals
- [x] **Razorpay Standard Checkout Integration**: Integrated Razorpay Standard Checkout with script loader and mock provider fallback on `/pricing`. (Completed in Phase 5)
- [x] **Subscription & Payment Ledgers**: Provisioned `plans`, `subscriptions`, `subscription_events`, `payment_records`, and `processed_webhook_events` with RLS and 7-day grace window. (Completed in Phase 5)
- [x] **Webhook Signature Verification**: Timing-safe HMAC-SHA256 signature verification with deduplication and idempotency ledger in `/api/billing/webhook`. (Completed in Phase 5)
- [x] **Institutional School Admin Billing Hub**: Provisioned `/dashboard/admin/billing` for principals to monitor quotas, view invoices, upgrade plans, and manage subscriptions. (Completed in Phase 5)
- [x] **Superadmin SaaS Operations**: Provisioned `/admin/billing` with MRR, ARR, and delinquent account alerts. (Completed in Phase 5)

### Layer 8: Quality Assurance & Automated Testing
- [x] **Test Runner Framework**: Configured Vitest test runner with path alias support (`vitest.config.mts`) and 100% offline mock execution. (Completed in Phase 2)
- [x] **Comprehensive Test Suites**: 49 test files with 267 unit, schema, validator, pipeline, security, database, pairing, state machine, grading, mastery, confidence, difficulty, billing, webhook, data quality, content authoring, versioning, media upload, export, institutional RBAC, RLS, hierarchy, reporting, academic aggregation, privacy, and invitation tests passing with 100% success rate. (Completed in Phase 8)
- [ ] **End-to-End Test Suite**: Future Playwright tests validating the core user journeys (signup $\rightarrow$ kit generation $\rightarrow$ smartboard pairing $\rightarrow$ assessment scoring $\rightarrow$ concept mastery update $\rightarrow$ closed-loop reassessment $\rightarrow$ institutional governance). (Queued for Phase 9)

### Layer 9: Rich Content, Media & Smartboard Delivery Pipeline
- [x] **Extended Resource Repository**: Extended canonical `resources` schema with `content` (JSONB), `version`, `validation_score`, `validation_errors` plus `resource_versions`, `resource_usage`, `media_assets`, `media_jobs`. (Completed in Phase 7)
- [x] **Deterministic Readability & Quality Gate**: 100-point penalty system enforcing 75" smartboard readability bounds ($\le 60$ words, $\le 5$ bullets) and Hindi Devanagari script integrity. (Completed in Phase 7)
- [x] **Fail-Closed Media Security**: Pre-signed uploads, path traversal sanitization, server-side magic byte inspection (JPEG, PNG, PDF, WebM, MP4), and 60-min signed URLs. (Completed in Phase 7)
- [x] **Immutable Version Snapshots & 1-Click Rollback**: Zero-disruption snapshots on publish and active classroom presentation binding. (Completed in Phase 7)
- [x] **Smartboard Kiosk Slide Viewer**: Polymorphic 7-archetype slide renderer with answer reveals, timers, and Realtime event synchronization. (Completed in Phase 7)
- [x] **Teacher Resource Studio**: Multi-filter library, detailed scorecard view, interactive presentation editor, vector mind map canvas, and 10-archetype activity planner. (Completed in Phase 7)
- [x] **Multi-Channel Export Engine**: 16:9 widescreen printable slide decks, A4 worksheets, and vector SVG mind maps. (Completed in Phase 7)

### Layer 10: Scale, School Networks & Institutional Administration
- [x] **Multi-Tier Relational Model**: Provisioned `states`, `districts`, `organizations`, and membership tables linking orthogonally to `schools`. (Completed in Phase 8)
- [x] **Strict Tenant Isolation & Security Definers**: 6 PostgreSQL security definer functions and 12 RLS policies ensuring isolation across states, districts, and networks while preserving independent school privacy. (Completed in Phase 8)
- [x] **Student Privacy by Design ($N \ge 10$)**: Minimum sample masking across all institutional summaries and exports, preventing individual student deanonymization. (Completed in Phase 8)
- [x] **Cascading Governance Engine**: 4-tier inheritance engine (`Default` $\leftarrow$ `State` $\leftarrow$ `District` $\leftarrow$ `Organization` $\leftarrow$ `School`) resolving effective settings. (Completed in Phase 8)
- [x] **Cryptographic Member Invitations**: Single-use high-entropy tokens (`crypto.randomBytes(32)`), SHA-256 hash storage, automatic expiry, and role provisioning. (Completed in Phase 8)
- [x] **14 Institutional REST API Endpoints**: Directory, onboarding, overview KPIs, academic intelligence, adoption, resources, comparison, invitations, settings, and reports export. (Completed in Phase 8)
- [x] **Institutional Web Portals**: Scope-aware overview dashboard, paginated school directory, academic hub, 2-10 school comparative matrix, invitations manager, and governance settings editor. (Completed in Phase 8)

### Layer 11: Native Mobile, Offline Experience & Low-Connectivity Classrooms
- [x] **Native Mobile Workspace**: Built dedicated React Native 0.74 + Expo SDK 51 application targeting Android (primary) and iOS. (Completed in Phase 9)
- [x] **5-Tier Local Storage System**: Implemented SQLite-backed storage model separating static curriculum, class pack bundles, dynamic assessments, and outbox mutations with strict 300MB budget. (Completed in Phase 9)
- [x] **Transactional Outbox Sync Engine**: Durable local queue with jittered exponential backoff (2s–60s), 5 retry bounds, and auto-dispatch upon reconnection. (Completed in Phase 9)
- [x] **Deterministic Conflict Resolution Matrix**: Standardized resolution rules giving client authority on active student answers and server authority on final submissions, published curriculum, and classroom sequence. (Completed in Phase 9)
- [x] **NCERT Offline Class Packs**: Complete chapter bundles (slides, mindmaps, activities, diagnostic quizzes) with SHA-256 tamper verification. (Completed in Phase 9)
- [x] **Masked Offline Assessment Player**: Client-side countdown timer, question answer-key masking, and tamper-resistant sealed attempt submissions. (Completed in Phase 9)
- [x] **Smartboard Mobile Remote Co-Pilot**: Pairing code / session consumer with slide forward/backward navigation and screen lock toggling. (Completed in Phase 9)
- [x] **Push Notifications & Deep Link Routing**: Device token registration, unregister on logout, and role-authorized URI scheme (`teacher-sathi://`). (Completed in Phase 9)
- [x] **Shared School Device Hygiene**: Hardware SecureStore session storage and instant user data wipe on logout. (Completed in Phase 9)
- [x] **Mobile Automated Test Coverage**: 11 test suites (45 tests) in `tests/mobile/`, bringing total repository test count to 312 tests (60 files) with 100% passing rate. (Completed in Phase 9)
- [ ] **End-to-End Test Suite**: Future Playwright tests validating the core mobile-to-web flows. (Queued)

### Layer 12: Platform Intelligence, Scale Hardening & Government Deployment
- [x] **Database Scale Audit & Composite Indexing**: Deployed 10 composite performance indexes across high-traffic tables (`assessment_attempts`, `attempt_answers`, `student_concept_mastery`, `learning_gaps`, `classroom_events`, `job_dead_letters`). Added connection pooling guidance and 8s statement timeouts. (Completed in Phase 10)
- [x] **Global Standardized Error Model**: Provisioned `ApiError` class, `createErrorResponse()`, correlation IDs (`x-request-id`) propagation across client/server/database, and structured RFC-compliant JSON responses. (Completed in Phase 10)
- [x] **Centralized Multi-Tier Rate Limiting**: Built in-memory sliding-window log limiter with 7 distinct boundaries (`AUTH`, `AI_GENERATE`, `ATTEMPT_AUTOSAVE`, `ATTEMPT_SUBMIT`, `MEDIA_UPLOAD`, `MOBILE_SYNC`, `ADMIN_ACTIONS`) returning standard `RateLimit-*` and `Retry-After` headers. (Completed in Phase 10)
- [x] **Heuristic Abuse & Replay Protection**: Provisioned automated 5-strike auth lockout (15-min freeze) and 5-second duplicate submission replay guard. (Completed in Phase 10)
- [x] **Strict SVG XML Sanitizer**: Built anti-XSS and anti-XXE sanitizer stripping `<script>`, `<foreignObject>`, inline `on*` event handlers, `javascript:` URIs, and `<!ENTITY>` declarations before asset ingestion or rendering. (Completed in Phase 10)
- [x] **Background Job Dead-Letter Queue (DLQ)**: Built reliable job lifecycle engine with jittered exponential backoff, max retry bounds (3 attempts), automatic quarantine to `job_dead_letters`, and operator retry/purge management. (Completed in Phase 10)
- [x] **Production AI Resilience & Fail-Closed Guard**: Hardened AI provider factory to fail closed in production (disabling mock fallbacks), enforced strict timeout bounds, and implemented INR budget ceilings per school (₹5,000/day) and teacher (₹200/day). (Completed in Phase 10)
- [x] **Structured JSON Logging with PII Scrubbing**: Deployed `logger.ts` producing machine-readable JSON with recursive redaction of Aadhaar numbers, phone numbers, email addresses, passwords, tokens, and API keys. (Completed in Phase 10)
- [x] **Platform Telemetry & Metrics Buffer**: Deployed in-memory telemetry buffer tracking request latency percentiles (p50, p95, p99), error counters, DLQ depth, and cumulative AI costs in INR. (Completed in Phase 10)
- [x] **Tri-State Health Check Probes**: Deployed `/api/health` (deep dependency probe), `/api/health/live` (Kubernetes liveness probe), and `/api/health/ready` (Kubernetes readiness probe). (Completed in Phase 10)
- [x] **Hierarchical Feature Flags Engine**: Built multi-tier flag evaluation (`PLATFORM` $\to$ `STATE` $\to$ `DISTRICT` $\to$ `ORGANIZATION` $\to$ `SCHOOL`) with deterministic percentage hashing, target ID overrides, and emergency instant kill-switches. (Completed in Phase 10)
- [x] **Platform Operations Console**: Built admin interface (`/admin/operations`) and supporting APIs for real-time telemetry inspection, DLQ quarantine management, and feature flag controls with audit logging. (Completed in Phase 10)
- [x] **Platform Hardening Test Suites**: 12 dedicated automated test suites (45 tests) in `tests/platform/`, bringing total repository test count to 357 tests (72 test suites) passing with 100% success rate. (Completed in Phase 10)
