# Phase 10: Complete System Audit & Architectural Readiness Report

## Executive Summary

This comprehensive system audit evaluates the **TeacherSathi platform across Phases 0 through 9** to establish production scale-hardening, security posture, data governance, and operational resilience for large-scale institutional and government school deployments.

TeacherSathi is an NCERT-focused AI Teaching Companion and Smart Classroom Co-Pilot spanning:
- Canonical NCERT Curriculum (Grades 1–12, Science, Mathematics, Social Sciences, Languages)
- Realtime interactive smartboard pairing and synchronized classroom streaming
- Multi-tier assessment generation, student attempts, and auto/manual grading
- Continuous academic intelligence, learning-gap detection, and intervention loops
- Rich media pipelines (presentations, mind maps, worksheets, audio, video)
- Institutional multi-tenancy (Schools, Organizations, Districts, States)
- Native mobile applications with offline-first local SQLite sync and outbox queues

---

## 1. Architecture Map

```
                     ┌─────────────────────────────────────────────────────────┐
                     │                     Clients Layer                       │
                     │  - Web Client (Next.js 14 App Router, Tailwind, Framer)  │
                     │  - Smartboard Display (Kiosk Mode, Fullscreen Canvas)    │
                     │  - Mobile App (Expo SDK 51, React Native, SQLite)       │
                     └────────────────────────────┬────────────────────────────┘
                                                  │ HTTPS / WSS
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │            Edge / Ingress & Security Boundary           │
                     │  - Next.js Middleware (Auth Session, Route Gating)      │
                     │  - Centralized Sliding-Window Rate Limiter (7 Policies) │
                     │  - Abuse Detector (OTP / Credential / Replay Guards)    │
                     │  - Global Error Envelope & Correlation ID Injector      │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │                  Next.js 14 API Layer                   │
                     │  - /api/auth, /api/curriculum, /api/classes             │
                     │  - /api/classroom/sessions (State, Events, Remote)      │
                     │  - /api/assessments, /api/assignments, /api/attempts    │
                     │  - /api/analytics (Mastery, Gaps, Interventions)        │
                     │  - /api/media (Upload, Process, Signed URLs)            │
                     │  - /api/mobile (Class-Pack Bundles, Version Check)      │
                     │  - /api/admin/operations (Health, DLQ, Feature Flags)   │
                     └───────────────┬──────────────────────────┬──────────────┘
                                     │                          │
                 ┌───────────────────┴───────┐                  │
                 ▼                           ▼                  ▼
┌─────────────────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│        AI Resilience Tier       │ │ Background Jobs  │ │ Storage Services │
│ - Provider: Gemini / Anthropic  │ │ - Media Jobs     │ │ - Private Buckets│
│ - Fail-Closed Guard in Prod     │ │ - Retry Ceiling  │ │ - SVG Sanitizer  │
│ - Token Budgeting & Telemetry   │ │ - Dead-Letter Q  │ │ - Signed URLs    │
└────────────────┬────────────────┘ └────────┬─────────┘ └────────┬─────────┘
                 │                           │                    │
                 └───────────────────┬───────┴────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    Authoritative Persistence Layer                           │
│  - Supabase PostgreSQL (13 Migrations, 40+ Relational Tables)                │
│  - PostgreSQL Row-Level Security (RLS) across all tenant scopes              │
│  - High-Frequency Composite Indexes for 10M+ rows queries                    │
│  - Triggers: updated_at, auth profile creation, audit logs                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dependency Map

| Subsystem | Upstream / Dependency | Role / Impact | Failure Mode | Phase 10 Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Supabase Auth / PostgreSQL | Identity token issuance, profile lookups | Auth down $\to$ Read-only cached curriculum | Local mobile sessions, JWT grace periods |
| **Relational DB** | PostgreSQL 15 | Canonical source of truth for all records | DB down $\to$ System unavailable | Connection pooling, composite indexes, read replicas |
| **AI Generation** | Google Gemini / Anthropic API | Lesson plans, quiz questions, remediation | AI provider outage $\to$ Generation fails | **Fail-closed** with 503; canonical NCERT remains intact |
| **File Storage** | Supabase Storage (S3 API) | Media assets, worksheets, thumbnails | Storage degraded $\to$ Uploads blocked | Strict SVG sanitization, signed URLs, CDN caching |
| **Realtime** | Supabase Realtime (WebSockets) | Smartboard remote actions and event log | WSS drops $\to$ Display disconnects | Sequence-numbered polling & smart auto-reconnect |
| **Mobile Sync** | Next.js API + Local SQLite | Offline attempts and student practice | Server disconnected $\to$ Local queue | Outbox queue, idempotency mutation IDs, merge rules |

---

## 3. Critical System Paths

1. **Classroom Teaching Path**:
   Teacher selects NCERT Chapter $\to$ Loads Presentation $\to$ Pairs Smartboard via QR $\to$ Dispatches Slide Actions $\to$ Logged in `classroom_events` (Sequence numbered).
2. **Assessment Execution Path**:
   Teacher assigns Quiz $\to$ Student opens attempt $\to$ Periodic autosave (`/api/attempts/[id]/answers`) $\to$ Submission packet sealed $\to$ Authoritative auto-grading $\to$ Results & Concept Mastery recomputed.
3. **Academic Intelligence Path**:
   Attempt scores finalized $\to$ Evaluated against Bayesian mastery threshold (75%) $\to$ Learning gaps generated/resolved $\to$ Remediation intervention generated.
4. **Offline Mobile Synchronization Path**:
   Student completes test offline $\to$ Transactionally stored in SQLite $\to$ Reconnect detected $\to$ Outbox dispatches idempotent mutation $\to$ Server validates and grades authoritative attempt.

---

## 4. Single Points of Failure (SPOFs)

1. **PostgreSQL Primary Instance**: A hardware outage on the primary database disables all write operations.
   - *Mitigation*: Enable Multi-AZ deployment, automated Point-in-Time Recovery (PITR), and read replicas for analytical queries.
2. **External AI Provider Rate Limits**: Upstream provider throttling halts AI creation.
   - *Mitigation*: Daily spending and request rate ceilings, user quotas, fail-closed error handling with descriptive user messages.
3. **Smartboard WebSocket Server Saturation**: Thousands of classrooms broadcasting high-frequency remote actions.
   - *Mitigation*: Micro-batched sequence event streaming, client debouncing (100ms), and fallback to HTTP sequence sync.

---

## 5. Performance Bottlenecks & Audit Findings

| Identified Bottleneck | Historical Cause | Phase 10 Remediation |
| :--- | :--- | :--- |
| **Attempt Autosave Scan** | Table scan on `attempt_answers` by `attempt_id` | Added composite index `(attempt_id, question_id)` |
| **State/District Mastery Rollup** | Scans over `student_concept_mastery` across schools | Added composite index `(school_id, subject_id, grade_id)` |
| **Queue Polling Latency** | Full scan on `media_jobs` without status sorting | Added composite index `(status, created_at ASC)` |
| **Classroom Event Recovery** | Unordered scan on `classroom_events` during reconnect | Added composite index `(session_id, created_at DESC)` |
| **Abuse & Scraping Spikes** | Unprotected endpoints without burst limits | Centralized sliding-window rate limiting on all public routes |

---

## 6. Security Risks & Remediations

1. **Malicious SVG Uploads (Stored XSS / XXE)**:
   - *Risk*: Malicious teachers or compromised accounts uploading SVG images with embedded JavaScript or entity expansion.
   - *Remediation*: Strict SVG sanitizer stripping `<script>`, `<foreignObject>`, inline `on*` event handlers, and XML entity definitions.
2. **Silent AI Mock Fallback in Production**:
   - *Risk*: A misconfigured production environment generating fake mock content for real student exams.
   - *Remediation*: Fail-closed check: `assertProductionSafety()` blocks mock AI when `NODE_ENV === 'production'`.
3. **Rapid Submission Replay**:
   - *Risk*: Network replays creating duplicate attempt results.
   - *Remediation*: Idempotency mutation checks and submission replay detection window.

---

## 7. Recommended Remediation Implementation Order

1. **Database Migration `20260911000013`**: Deploy composite indexes and DLQ tables.
2. **Centralized Error & Correlation ID System**: Instrument all requests with `x-request-id`.
3. **Multi-Tier Rate Limiting & Abuse Detection**: Guard auth, AI, assessment, and sync boundaries.
4. **AI Fail-Closed & Cost Budgeting**: Prevent synthetic mock pollution and runaway API spending.
5. **Background Job DLQ & Health Checks**: Deploy `/api/health` probes and operator requeue API.
6. **Operator Console**: Provide platform administrators with visibility and control tools.
7. **Load, Chaos, and Consistency Verification**: Rigorously test under synthetic load.
