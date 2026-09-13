# TeacherSathi — Production Gaps Inventory

> **Status**: Living Production Audit (Updated through Phase 5)  
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
- [x] **Comprehensive Test Suites**: 31 test files with 171 unit, schema, validator, pipeline, security, database, pairing, state machine, grading, mastery, confidence, difficulty, billing, webhook, data quality, and closed-loop intervention tests passing with 100% success rate. (Completed in Phase 6)
- [ ] **End-to-End Test Suite**: Future Playwright tests validating the core user journeys (signup $\rightarrow$ kit generation $\rightarrow$ smartboard pairing $\rightarrow$ assessment scoring $\rightarrow$ concept mastery update $\rightarrow$ closed-loop reassessment). (Queued for Phase 7)
