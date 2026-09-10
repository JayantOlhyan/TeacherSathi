# TeacherSathi — Production Gaps Inventory

> **Status**: Frozen Technical Audit (Phase 0)  
> **Purpose**: Definitive checklist of missing production systems required to graduate from MVP Prototype to Production Reality.

---

## 1. Production Gaps by Architectural Layer

### Layer 1: Database & Data Persistence
- [x] **Canonical Database Schema**: Normalized tables for `grades`, `subjects`, `books`, `chapters`, `concepts`, and `questions` created in `supabase/migrations/` and seeded deterministically via `scripts/seed-curriculum.ts`. (Completed in Phase 1)
- [x] **Tenant Isolation & RLS**: Supabase Row Level Security enabled across all 22 application tables with security definer helper functions. (Completed in Phase 1)
- [x] **Migration from `localStorage`**: Replaced business entity persistence in `src/lib/adminStore.ts` with repository layer and audit logging. (Completed in Phase 1)

### Layer 2: Server-Side API Architecture
- [x] **App Router Route Handlers**: Established core server routes under `src/app/api/` (`/api/profile`, `/api/classes`, `/api/curriculum`, `/api/questions`, `/api/resources`, `/api/classroom`). (Completed in Phase 1)
- [x] **Input Validation**: Zod runtime validation schemas established for all domain mutations in `src/lib/validations/`. (Completed in Phase 1)
- [ ] **AI Generation Endpoints** (Queued for Phase 2):
  - `/api/generate/lesson-plan`
  - `/api/generate/worksheet`
  - `/api/generate/quiz`
- [ ] **Payments Webhook** (Queued for Phase 4):
  - `/api/payments/razorpay-webhook`

### Layer 3: Artificial Intelligence Engine
- [ ] **Live LLM Integration**: Missing server-side SDK calls (Google Gemini 1.5 Flash / Claude 3.5 Sonnet). Currently mocked with simulated delays and static strings.
- [ ] **Prompt Engineering & Context Injection**: Missing canonical prompt templates with NCERT chapter metadata injection.
- [ ] **Output Schema Enforcement**: Missing JSON mode and schema validation to ensure generated quizzes contain exactly 4 options and valid answer keys.

### Layer 4: Realtime Classroom Communication
- [ ] **WebSocket Broadcast Handshake**: Need to replace the 1-second `localStorage` polling in [`/classroom`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/classroom/page.tsx) with Supabase Realtime Broadcast channels.
- [ ] **Remote Command Dispatcher**: Need WebSocket listeners on the 75" kiosk display to execute remote actions (`NEXT_SLIDE`, `START_QUIZ`, `LOCK_BOARD`) received from the teacher's phone.

### Layer 5: Asset & Media Storage
- [ ] **Object Storage Bucket**: The Admin Media Library ([`admin/media`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/admin/media/page.tsx)) stores metadata in `localStorage` without actual binary file storage. Need Supabase Storage buckets (`worksheets`, `diagrams`, `media`) with signed URLs.

### Layer 6: Monetization & Billing
- [ ] **Razorpay Standard Checkout SDK**: Need client-side payment popup integration on [`/pricing`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/pricing/page.tsx).
- [ ] **Subscription State Table**: Missing database tables for `subscriptions` and `invoices` to track active Pro teachers and institutional school licenses.
- [ ] **Webhook Signature Verification**: Need cryptographic signature verification for Razorpay payment events.

### Layer 7: Quality Assurance & Automated Testing
- [ ] **Test Runner Framework**: Missing Vitest / Jest configuration.
- [ ] **End-to-End Test Suite**: Missing Playwright tests validating the core user journeys (signup $\rightarrow$ kit generation $\rightarrow$ smartboard pairing $\rightarrow$ quiz scoring).
