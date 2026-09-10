# TeacherSathi — Technical Debt & Architectural Risk Register

> **Status**: Comprehensive Phase 0 Audit  
> **Rule**: Rigorous, unvarnished documentation of existing technical debt.

---

## 1. Technical Debt Inventory

### TD-01: Browser `localStorage` Utilized as Mock Application Database
- **Severity**: `CRITICAL`
- **Location**: [`src/lib/adminStore.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/lib/adminStore.ts)
- **Status**: **RESOLVED IN PHASE 1**
- **Resolution**: Migrated data models to normalized Supabase PostgreSQL database (`supabase/migrations/`), repository layer (`src/lib/repositories/`), and deterministic curriculum seeder (`scripts/seed-curriculum.ts`).

---

### TD-02: Zero Server-Side API Routes (`src/app/api/*`)
- **Severity**: `CRITICAL`
- **Location**: `src/app/api/`
- **Status**: **RESOLVED IN PHASE 1**
- **Resolution**: Implemented 6 server-side route handlers (`/api/profile`, `/api/classes`, `/api/curriculum`, `/api/questions`, `/api/resources`, `/api/classroom`) with Zod input validation and automated audit logging.

---

### TD-03: Hardcoded Service Account Key in Repository
- **Severity**: `CRITICAL` (Security Alert)
- **Location**: [`docs/credentials/teachersathi-backend-5e85f92836a2.json`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/docs/credentials/teachersathi-backend-5e85f92836a2.json)
- **Status**: **QUARANTINED IN PHASE 1**
- **Resolution**: Verified file was never committed to remote git history; added `docs/credentials/`, `credentials/`, `*.key`, and `*.secret` to `.gitignore`. Formal notification issued to revoke Key ID `5e85f92836a211e678123538df7986d1a7577c7d` manually in Google Cloud Console.

---

### TD-04: Smartboard Kiosk Pairing Uses LocalStorage Polling
- **Severity**: `HIGH`
- **Location**: [`src/app/[locale]/classroom/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/classroom/page.tsx#L32-L47) & [`src/app/[locale]/auth/qr-confirm/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/auth/qr-confirm/page.tsx#L47-L58)
- **Status**: **DATA MODEL ESTABLISHED (Phase 1)**; Realtime Channels queued for **Phase 3**.
- **Resolution**: Database models for `classroom_devices`, `classroom_sessions`, and `remote_actions` created with persistent API endpoints (`/api/classroom`).

---

### TD-05: Client-Only Authorization / Missing Route Guards
- **Severity**: `HIGH`
- **Location**: [`src/middleware.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/middleware.ts) & [`src/components/admin/AdminRoleGuard.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/components/admin/AdminRoleGuard.tsx)
- **Status**: **RESOLVED IN PHASE 1**
- **Resolution**: `src/middleware.ts` now authoritatively inspects Supabase Auth user sessions and protects `/admin/*` and `/dashboard/*`, redirecting unauthenticated requests to `/login`.

---

### TD-06: Simulated AI Engine ("Saathi Genie" & Generation Wizards)
- **Severity**: `HIGH`
- **Location**: [`src/app/[locale]/dashboard/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/dashboard/page.tsx) & [`src/app/[locale]/dashboard/create/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/dashboard/create/page.tsx)
- **Status**: **RESOLVED IN PHASE 2**
- **Resolution**: Replaced simulated `setTimeout` delays and hardcoded substring matching with production AI generation engine (`/api/ai/generate`, `/api/ai/genie`), multi-provider abstraction (`MockAIProvider`, `GeminiProvider`, `AnthropicProvider`), curriculum context injection, Zod schema validation, educational constraint validation, retry self-repair loop, rate limiting, and telemetry persistence.

---

### TD-07: Hardcoded NCERT Curriculum in Static TypeScript Files
- **Severity**: `MEDIUM`
- **Location**: [`src/lib/data/ncertSyllabus.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/lib/data/ncertSyllabus.ts) (773 lines, ~113 KB) & [`src/lib/data/chapters.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/lib/data/chapters.ts)
- **Problem**: The complete syllabus for Class 6 to 10 is hardcoded in a massive static object bundled into the client build.
- **Why It Matters**: Correcting a typo, updating for a new NCERT syllabus edition, or adding supplementary chapters requires editing code and redeploying the entire website.
- **Recommended Solution**: Seed this syllabus data into the canonical PostgreSQL database and fetch via cached Server Components.
- **Phase to Fix**: **Phase 1**

---

### TD-08: Mock Pricing & Payment Checkouts
- **Severity**: `MEDIUM`
- **Location**: [`src/app/[locale]/pricing/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/pricing/page.tsx#L166)
- **Problem**: Clicking *"Upgrade to Pro (₹499/mo)"* triggers a browser `alert("Razorpay Checkout: Opening Pro Educator Plan...")`.
- **Why It Matters**: Users cannot purchase subscriptions, and B2B school license transactions cannot be executed digitally.
- **Recommended Solution**: Integrate Razorpay Standard Checkout SDK and implement server-side payment capture webhooks.
- **Phase to Fix**: **Phase 4**

---

### TD-09: Unused Dependencies in `package.json`
- **Severity**: `LOW`
- **Location**: [`package.json`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/package.json#L15)
- **Problem**: `class-variance-authority` (CVA) is listed as a dependency but unused across the codebase.
- **Why It Matters**: Contributes unnecessary build overhead and dependency auditing noise.
- **Recommended Solution**: Remove unused dependencies during Phase 1 cleanup.
- **Phase to Fix**: **Phase 1**

---

### TD-10: Zero Automated Test Coverage
- **Severity**: `HIGH`
- **Location**: Repository root (No `jest.config.*`, `playwright.config.*`, or `__tests__/` directory)
- **Problem**: The codebase lacks automated unit, integration, or end-to-end tests.
- **Why It Matters**: Any schema migration, middleware update, or component refactor risks silent regression.
- **Recommended Solution**: Install Vitest for unit/integration testing and Playwright for E2E user flows.
- **Phase to Fix**: **Phase 1 & Phase 5**
