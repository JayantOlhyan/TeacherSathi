# TeacherSathi — Technical Debt & Architectural Risk Register

> **Status**: Comprehensive Living Audit (Updated through Phase 5)  
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

### TD-10: Automated Test Coverage
- **Severity**: `LOW`
- **Location**: Repository root
- **Status**: **RESOLVED FOR UNIT/INTEGRATION IN PHASES 2, 3, 4, 5, & 6**
- **Resolution**: Configured Vitest runner with 171 automated tests across 31 test files covering AI pipeline, database repositories, RLS policies, classroom state machines, assessment grading/security, mastery calculations, confidence ratings, difficulty analysis, gap state lifecycles, billing entitlements, state transitions, webhooks, data quality, and closed-loop interventions.
- **Remaining Task**: End-to-end Playwright UI test suite scheduled for Phase 7.

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

