# TeacherSathi — Master Product Contract & Architecture Freeze

> **Document Type**: Master Source of Truth (Phase 0)  
> **Status**: Frozen Architecture Baseline  
> **Author**: Lead Product Architect & Senior Full-Stack Engineer  
> **Date**: September 2026  

---

## 1. Product Definition
**TeacherSathi** is India's dedicated NCERT AI teaching companion and smart classroom co-pilot. Built to run natively in any web browser without proprietary hardware lock-in, TeacherSathi empowers educators to convert any NCERT Class 6–10 textbook chapter into classroom-ready 75-inch smartboard presentations, bilingual mind maps, interactive MCQ quizzes, and print-ready CBSE test worksheets in 30 seconds.

- **Tagline**: *"Teachers ka Superpower | शिक्षकों का सुपरपावर"*
- **Mascot / Assistant**: **Saathi Genie (साथी)** — In-class pedagogical assistant.
- **Guarantee**: 100% Free Forever for Individual Teachers.

---

## 2. Target Users
1. **Government School Educators (KVS / JNV / State Boards)**: 40–60 students per classroom, high administrative load, requiring bilingual Hindi/English materials and low-bandwidth 2G/3G tolerance.
2. **Private CBSE School Educators**: 35–45 students, focused on NEP 2020 competency-based learning outcomes, tiered summative tests, and rapid grading.
3. **School Principals & Institutional Buyers**: Managing 20–100 teachers, requiring standardized lesson pacing, centralized device registers, and GST-compliant invoicing.
4. **Students (Classes 6–10)**: Seeking engaging classroom participation via live clicker quizzes and visual mind maps.

---

## 3. The Four Product Pillars (TEACH / ASSESS / PLAN / MANAGE)

Every feature within TeacherSathi maps cleanly to one of four core pillars:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     1. TEACH    │  │    2. ASSESS    │  │     3. PLAN     │  │    4. MANAGE    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • Smartboard PPT│  │ • MCQ Quizzes   │  │ • Lesson Plans  │  │ • Classes       │
│ • Mind Maps     │  │ • CBSE Tests    │  │ • Worksheets    │  │ • Students      │
│ • Video Lectures│  │ • Question Bank │  │ • Homework Plans│  │ • Attendance    │
│ • Whiteboard    │  │ • Student Polls │  │ • PPT Generation│  │ • Devices (TVs) │
│ • Activities    │  │ • Live Scoring  │  │ • Activity Cards│  │ • Session Logs  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 4. User Roles
- **`SUPER_ADMIN`**: Global platform administrator. Manages canonical curriculum, global questions, users, and audit logs.
- **`SCHOOL_ADMIN`**: Institutional administrator (Principal). Manages school teachers, student rosters, smartboard devices, and billing.
- **`TEACHER`**: Classroom educator. Delivers lessons, generates teaching kits, launches quizzes, and tracks assigned classes.
- **`STUDENT`**: Enrolled learner. Views assigned chapters, takes interactive quizzes, and reviews homework.

---

## 5. Permissions & RBAC Baseline
- **Canonical Curriculum**: Read-only for Teachers and Students. Editable exclusively by `SUPER_ADMIN`.
- **User Kits**: Created, edited, and owned by authoring `TEACHER`.
- **School Assets**: Enrolled students, attendance marks, and devices are managed by `SCHOOL_ADMIN` and assigned `TEACHER`.
- **Strict Server-Side Enforcement**: All permissions must be validated on the server via Supabase JWT claims and PostgreSQL Row Level Security (RLS).

---

## 6. Core User Journeys
1. **Teacher Discovery & Kit Generation**: Lands on `/` $\rightarrow$ tests live studio $\rightarrow$ signs up $\rightarrow$ selects chapter $\rightarrow$ exports 30-second worksheet PDF.
2. **Classroom Kiosk Routine**: Smartboard displays `/classroom` QR $\rightarrow$ teacher scans with phone $\rightarrow$ authorizes on `/auth/qr-confirm` $\rightarrow$ smartboard unlocks $\rightarrow$ phone becomes remote control.
3. **Live Classroom Assessment**: Teacher launches `/quiz` on 75" display $\rightarrow$ class answers $\rightarrow$ instant feedback and explanation reveal $\rightarrow$ accuracy tallied.
4. **Interactive Whiteboard Lecture**: Teacher opens `/dashboard/whiteboard` $\rightarrow$ draws diagrams $\rightarrow$ references math formulas in Teacher's Toolkit.

---

## 7. Curriculum Model
- **Canonical Hierarchy**: Grade $\rightarrow$ Subject $\rightarrow$ Book $\rightarrow$ Chapter $\rightarrow$ Concept $\rightarrow$ Resource.
- **Data Ownership**:
  - Canonical NCERT Syllabus = `PLATFORM OWNED`
  - School Data & Timetables = `SCHOOL OWNED`
  - Teacher Generated Resources = `TEACHER OWNED`
  - Student Quiz Attempts = `STUDENT + CLASS OWNED`

---

## 8. Question Bank Standard
Every canonical chapter must feature a minimum 30-question bank divided into:
- **Section A**: 10 questions $\times$ 2 marks (30–50 words) — Foundational recall.
- **Section B**: 10 questions $\times$ 3 marks (60–80 words) — Analytical & application.
- **Section C**: 10 questions $\times$ 4 marks (100–140 words) — Long answer & diagrammatic.
- **Comprehensive Coverage**: NCERT in-text, exemplar problems, laboratory activities, diagrams, and HOTS.

---

## 9. AI Products Specification
1. **AI Lesson Plan**: 45-minute structured pedagogical plan with engagement hook, guided practice, and formative exit checks.
2. **AI Worksheet**: Print-ready CBSE worksheet with school header, graded sections, and detachable answer key.
3. **AI Quiz**: 5–10 MCQ interactive clicker cards with 4 options, 1 verified correct answer, and bilingual explanations.
4. **AI Test Paper**: Formal examination paper adhering to CBSE blueprints with step-marking criteria.
5. **AI Presentation**: 8–15 high-contrast 75" display cards (max 40 words per card).
6. **AI Concept Mind Map**: Visual node-edge concept hierarchy.
7. **AI Teaching Activity**: Low-cost hands-on classroom exercise.
8. **Saathi Genie**: In-class pedagogical assistant for immediate teaching sparks.

---

## 10. Smartboard Classroom Model
- **Lifecycle**: `WAITING` (2-min expiring QR) $\rightarrow$ `PAIRING` (Phone scanned) $\rightarrow$ `ACTIVE` (Screen unlocked) $\rightarrow$ `PAUSED` $\rightarrow$ `ENDED`.
- **Target Realtime Protocol**: Supabase Realtime WebSocket broadcast channels replacing temporary client `localStorage` polling.
- **Remote Events**: `START_PRESENTATION`, `NEXT_SLIDE`, `PREVIOUS_SLIDE`, `START_QUIZ`, `END_QUIZ`, `PUSH_RESOURCE`, `START_TIMER`, `LOCK_BOARD`, `END_SESSION`.

---

## 11. Resource Lifecycle
- **States**: `GENERATE` $\rightarrow$ `DRAFT` $\rightarrow$ `VALIDATE` $\rightarrow$ `READY` $\rightarrow$ `USED` $\rightarrow$ `ARCHIVED`.
- **Standard Operations**: Edit, Regenerate, Duplicate, Reuse, Export (PDF/PPTX), Archive.

---

## 12. Localization Standards
- **English**: Clean, NCERT-standard Indian English.
- **Hindi**: Native Devanagari script using the Mukta typography token.
- **Bilingual Hybrid**: Scientific terminology remains recognized (e.g. *माइटोकॉन्ड्रिया (Mitochondria)*), avoiding unreadable literal machine translations.
- **Prefixless Routing**: Clean URLs without `/en/` or `/hi/` segments, managed by `next-intl` and cookies.

---

## 13. Production V1 Scope (Must-Have)
- Supabase Auth (Email OTP + Google OAuth).
- Normalized PostgreSQL database for curriculum and user kits.
- 3-Pillar Chapter Hub (TEACH, ASSESS, PLAN).
- Interactive MCQ Quiz engine & YouTube video player.
- Excalidraw Whiteboard with Teacher's Toolkit.
- Smartboard Kiosk QR handshake.
- Basic class management & attendance.
- Full English and Hindi bilingual interface.

---

## 14. V1.1 Scope (Fast-Follow)
- Automated AI PPTX export.
- Interactive vector concept mind maps.
- Student diagnostic mastery analytics.
- AI descriptive answer grading assistance.

---

## 15. V2 Scope (Long-Term)
- Autonomous serverless video rendering queue.
- District/State department education dashboards.
- Adaptive student practice engine.
- Native mobile applications.

---

## 16. Out-of-Scope Features
- Social feeds, community forums, teacher marketplaces, AI talking avatars, complex gamification coins/badges, and microservice architectures.

---

## 17. Technical Constraints
- **Framework**: Next.js 14.2 App Router (React 18, TypeScript 5).
- **Styling**: Tailwind CSS with `#0F5B38` forest green tokens.
- **Hardware**: Must render legibly from 25 feet away on a 75" display (min 18px body font).
- **Network**: Service worker caching and AVIF/WebP assets to support 2G/3G connectivity.

---

## 18. Security Requirements
- All database tables protected by Row Level Security (RLS).
- Next.js Middleware enforcing server-side session tokens on `/admin/*` and `/dashboard/*`.
- Immediate revocation and scrubbing of hardcoded Google Service Account private key in `docs/credentials/`.
- Zero client-side storage of sensitive access tokens.

---

## 19. Production Readiness Requirements
- Implementation of Next.js Route Handlers (`src/app/api/`) with Zod input validation.
- Live integration with Google Gemini / Anthropic Claude for AI generation.
- Realtime WebSocket broadcast for smartboard kiosk pairing.
- Automated Vitest and Playwright test suites.

---

## 20. Phased Roadmap
- **Phase 0**: Product Contract & Architecture Freeze (Current — COMPLETE)
- **Phase 1**: Production Database & PostgreSQL Data Architecture (READY TO EXECUTE)
- **Phase 2**: Server-Side AI Engine & Structured Generation Pipeline
- **Phase 3**: Realtime Kiosk Handshake & Smartboard WebSockets
- **Phase 4**: Payments (Razorpay), RBAC & School Management
- **Phase 5**: Hardening, Security Remediation & End-to-End Testing
