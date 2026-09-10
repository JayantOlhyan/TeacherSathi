# TeacherSathi — Phased Production Roadmap

> **Status**: Frozen Strategic Roadmap (Phase 0)  
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
│ PHASE 4: Payments (Razorpay), RBAC & Institutional B2B      │
│ Status: READY TO EXECUTE                                    │
│ Focus: Razorpay checkout, webhooks, principal dashboard.    │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: Hardening, Security Remediation & E2E Testing      │
│ Status: QUEUED                                              │
│ Focus: Secret cleanup, Playwright tests, load testing.      │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Breakdown & Deliverables

### Phase 0: Product Contract, Audit & Architecture Freeze (Current)
- Complete repository audit and reality check.
- Verification of typecheck, lint, and build statuses.
- Identification of all mock, static, and partial features.
- Creation of frozen product contracts, user roles, and database specifications.

### Phase 1: Production Database & PostgreSQL Architecture
- Provision Supabase PostgreSQL tables according to [`PHASE_1_DATABASE_REQUIREMENTS.md`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/docs/PHASE_1_DATABASE_REQUIREMENTS.md).
- Enable Row Level Security (RLS) on all tables with tenant-isolation policies.
- Seed canonical NCERT syllabus data from `src/lib/data/` into database tables.
- Replace `src/lib/adminStore.ts` `localStorage` calls with Supabase SSR queries.
- Update Next.js Middleware to verify Supabase Auth sessions on protected routes.

### Phase 2: Server-Side AI Engine & Structured Generation
- Build Next.js App Router API Route Handlers (`src/app/api/generate/*`).
- Connect server-side AI provider (Google Gemini 1.5 Flash / Claude 3.5 Sonnet).
- Implement Zod schema validation for AI Lesson Plans, Worksheets, and Quizzes.
- Wire Saathi Genie chat drawer to live pedagogical AI streaming endpoints.

### Phase 3: Realtime Kiosk Handshake & Smartboard WebSockets
- Implement Supabase Realtime Broadcast Channels on `/classroom`.
- Replace 1-second `localStorage` polling with WebSocket event listeners.
- Connect mobile remote control actions (`NEXT_SLIDE`, `START_QUIZ`, `LOCK_BOARD`) to live smartboard screen handlers.

### Phase 4: Payments, RBAC & Institutional School Management
- Integrate Razorpay Standard Checkout SDK for Teacher Pro (₹499/mo).
- Implement Razorpay webhook handler with signature verification.
- Build School Admin management portal for bulk teacher licensing and device management.

### Phase 5: Hardening, Security Remediation & End-to-End Testing
- Revoke committed service account private key in Google Cloud and scrub git history.
- Set up automated Playwright E2E testing suite covering core user journeys.
- Conduct Core Web Vitals optimization and 2G/3G network throttle verification.
