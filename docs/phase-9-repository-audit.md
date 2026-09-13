# Phase 9 — Repository Audit & Mobile Integration Blueprint

## 1. Executive Summary

This audit assesses the TeacherSathi codebase (Phases 0 through 8) from the perspective of **native mobile client integration, offline-first execution, low-connectivity resilience, and synchronization guarantees**.

The objective of Phase 9 is to build a native mobile application (`TeacherSathi Mobile`: Teacher App + Student App) targeting Android (primary) and iOS that seamlessly reuses the existing backend APIs, PostgreSQL database, authentication mechanisms, and domain contracts without duplicating server-authoritative logic.

---

## 2. Audit of Existing Subsystems & Mobile Reusability

### 2.1 Authentication & Session Management
- **Existing Web Architecture**: Supabase SSR (`@supabase/ssr`) with cookie-based session tokens handled in `src/middleware.ts`.
- **Mobile Integration Reality**: Mobile clients cannot rely on web browser cookies. Native mobile apps must use Bearer token headers (`Authorization: Bearer <access_token>`) obtained via Supabase Auth client (`@supabase/supabase-js`).
- **Token Security**: Tokens on mobile must be stored using hardware-backed platform keystores (`expo-secure-store` / Android Keystore / iOS Keychain), never plain `AsyncStorage` or unencrypted SQLite.
- **Role Detection**: Reuses `src/app/api/profile/route.ts` which returns `{ data: profile }` containing `role`, `school_id`, and user metadata.

### 2.2 NCERT Canonical Curriculum
- **Existing Architecture**: Normalized PostgreSQL tables `grades`, `subjects`, `books`, `chapters`, `concepts`, and `questions`. Static fallback JSON files exist in `src/lib/data/` for SSG.
- **Mobile Integration Reality**: Canonical NCERT curriculum is immutable. This makes it an ideal candidate for **persistent local caching**. Once downloaded, Grade $\to$ Subject $\to$ Book $\to$ Chapter $\to$ Concept trees can be stored permanently in local SQLite, refreshing only on version bump.

### 2.3 Assessments, Assignments & Attempts
- **Existing API Contracts**:
  - `POST /api/assessments/[id]/attempts`: Authorizes and creates/resumes an attempt (`AssessmentAttemptRecord`). Strips answer keys when attempt is `IN_PROGRESS`.
  - `GET /api/attempts/[id]`: Returns attempt details and masked questions.
  - `PATCH /api/attempts/[id]/answers`: Supports both single answer save and batch save via `{ answers: [{ assessment_question_id, selected_option_key, text_answer, is_answered }] }`. Contains `ON CONFLICT (attempt_id, assessment_question_id)` upsert semantics.
  - `POST /api/attempts/[id]/submit`: Server-authoritative submission and auto-grading with idempotency check (`existingResult`).
  - `GET /api/results/[id]`: Returns final score, question evaluations, and explanations.
- **Mobile Offline Readiness**:
  - The batch answers API (`PATCH /api/attempts/[id]/answers`) and submit API (`POST /api/attempts/[id]/submit`) are **already idempotent**.
  - For offline assessments, the student client downloads the masked assessment package while online, stores it in SQLite, writes local answers to an `offline_answers` transactional table, seals the attempt on submit, and dispatches the batch payload to the server upon reconnection.

### 2.4 Academic Intelligence & Concept Mastery
- **Existing Architecture**: Phase 6 diagnostic mastery engine (`student_concept_mastery`, `learning_gaps`, `interventions`) with 65/35 recency-weighted decay scoring.
- **Mobile Integration Reality**: Mobile clients must **never** calculate mastery or gap status locally. Mobile displays cached mastery bars and gap summaries from `GET /api/analytics/student/[id]` and `GET /api/analytics/class/[id]`.

### 2.5 Resources, Presentations & Smartboard Delivery
- **Existing Architecture**: Phase 7 polymorphic slide decks (7 slide types), concept mind maps, and 10 pedagogical activity archetypes stored in `resources` and `resource_versions`.
- **Mobile Integration Reality**:
  - Presentations and teaching activities are stored as structured JSON.
  - Mobile can download these structured payloads into a **Class Pack** for offline classroom teaching.
  - Teacher mobile device can act as a **Smartboard Remote Controller**, sending sequence-numbered WebSocket commands (`NEXT_SLIDE`, `PREVIOUS_SLIDE`, `START_QUIZ`, `LOCK_BOARD`) to `/classroom` via `/api/classroom/sessions/[id]/events`.

### 2.6 Institutional Administration (Phase 8)
- **Existing Architecture**: High-volume, multi-tier state/district/org dashboards with $N \ge 10$ privacy masking.
- **Mobile Integration Reality**: Heavy multi-school matrices remain on the web application. Mobile exposes a lightweight role-aware portal for school/org admins (Overview KPIs, active schools count, notifications, approvals).

### 2.7 Existing PWA Implementation
- **Existing Architecture**: Basic `public/sw.js` precaching `offline.html` and static logo assets. Explicitly bypasses all `/api/*` routes and Supabase.
- **Mobile Integration Reality**: The PWA does not provide background sync, durable SQLite storage, or push notifications on iOS. A native Expo + React Native application provides genuine offline transactions and platform integration.

---

## 3. Data Schema & Cache Classification

| Category | Entities | Storage Location | Cache Policy | Invalidation / Refresh Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Persistent Static** | NCERT Curriculum (Grades, Subjects, Books, Chapters, Concepts) | SQLite (`cached_curriculum`) | Cache First | Long TTL (30 days) or on app version bump |
| **Downloadable Bundles** | Class Packs (Lesson plans, slides, activities, formative quizzes) | SQLite (`cached_class_packs`) | Explicit Download | User-managed download & selective purge |
| **Authorized Dynamic** | Student Assignments & Masked Assessments | SQLite (`cached_assessments`) | Network First $\to$ Cache Fallback | Refreshes when online; accessible offline if authorized |
| **Transactional Outbox** | Offline Answers & Pending Mutations | SQLite (`offline_answers`, `sync_outbox`) | Local Write First $\to$ Remote Sync | Retained until Server ACK (marked `SYNCED`) |
| **Non-Cacheable / Ephemeral** | Live WebSocket Presence, 5-min QR Pairing Tokens | Memory Only | Never Cached | Discarded on disconnect |
| **Sensitive Auth** | JWT Access & Refresh Tokens | `expo-secure-store` | Hardware Keystore | Cleared immediately on logout |

---

## 4. API Gap Analysis & Required Additions

To support Phase 9 without altering existing web APIs, the following new server capabilities are required:
1. **Push Notifications & Device Registry**:
   - Migration for `notifications` and `mobile_devices` tables.
   - Endpoints: `GET /api/notifications`, `PATCH /api/notifications/[id]/read`, `POST /api/notifications/devices`.
2. **App Version Check**:
   - Endpoint: `GET /api/mobile/version-check` returning minimum supported version and update necessity (`CURRENT`, `UPDATE_RECOMMENDED`, `UPDATE_REQUIRED`).
3. **Class Pack Packaging Endpoint**:
   - Endpoint: `GET /api/mobile/class-pack/[chapterId]` bundling curriculum, approved presentation, activities, and quiz questions into a single portable payload for 1-click download.
