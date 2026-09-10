# TeacherSathi — Product Scope & Boundaries

> **Status**: Frozen Scope Contract (Phase 0)  
> **Rule**: Strict boundary enforcement. No speculative feature additions.

---

## 1. Production V1 Scope (Must-Have)

The V1 release delivers an audited, robust, database-backed foundation providing daily teaching utility for Indian educators without unnecessary complexity.

### Core Pillars in V1:
1. **Authentication & Identity**:
   - Supabase Auth integration for Email OTP and Google OAuth.
   - Distinct Teacher vs. Student profile records.
   - Protected routes via Next.js Middleware with server-side session validation.
2. **Canonical Curriculum Engine**:
   - Database-backed NCERT syllabus for Classes 6 to 10.
   - Core subjects: Mathematics, Science, Social Science, Hindi, English.
   - Pre-indexed chapters with English and Devanagari Hindi titles/descriptions.
3. **The 3-Pillar Chapter Hub**:
   - **TEACH**: High-contrast 75" Smart Classroom Presentation Mode, Concept Overviews, Video integration (YouTube embed).
   - **ASSESS**: Interactive client-side MCQ Quiz engine, Summative Chapter Test, Question Bank browser.
   - **PLAN**: AI-assisted Lesson Plan and Printable CBSE Worksheet generators.
4. **Smartboard Kiosk Pairing**:
   - Ephemeral 2-minute dynamic QR code display at `/classroom`.
   - Mobile authentication handshake at `/auth/qr-confirm` via Supabase Realtime/WebSockets.
   - Basic mobile remote controls (Class timer, Lock board, End session).
5. **Interactive Classroom Whiteboard**:
   - Embedded `@excalidraw/excalidraw` canvas with Teacher's Toolkit (math formulas, geometry tips).
6. **Classroom Management (Basic)**:
   - Class creation (Grade + Section).
   - Student roster list.
   - Attendance marking.
   - Assignment dispatch and submission tracking.
7. **Bilingual Localization**:
   - Full English and Devanagari Hindi interface and content strings via `next-intl`.

---

## 2. V1.1 Scope (Fast-Follow Iteration)

These features enhance pedagogical depth and school adoption once V1 is stable in production:

1. **AI Presentation Generator**: Automated multi-slide PPTX deck export from chapter notes.
2. **Interactive Concept Mind Maps**: Interactive vector graph nodes for visual exploration on 75" smartboards.
3. **Diagnostic Student Analytics**: Topic mastery breakdown, accuracy percentages, and automated diagnostic reports for parents.
4. **AI Descriptive Evaluation**: Automated grading recommendations for short-answer teacher rubrics.
5. **Student Clicker Device Bluetooth/USB WebHID Driver**: Direct hardware integration for physical student response clickers.

---

## 3. V2 Scope (Long-Term Horizon)

1. **Autonomous Video Generation Pipeline**: Serverless queue rendering custom animated NCERT video lectures.
2. **Multi-School Institutional Intelligence**: District/State-level analytics dashboards for government education departments.
3. **Adaptive Student Learning Engine**: Personalized practice questions adapting to individual learner weaknesses.
4. **Native Mobile Applications**: iOS & Android Flutter/React Native wrappers for push notifications and offline caching.

---

## 4. Explicitly Out of Scope (Strict Exclusions)

To prevent scope creep and bloated architecture, the following features are strictly prohibited from V1 and V1.1:

| Feature Area | Classification | Justification |
| :--- | :--- | :--- |
| **Social Network / Feed** | OUT OF SCOPE | TeacherSathi is a pedagogical productivity tool, not a social media platform. |
| **Teacher Marketplace** | OUT OF SCOPE | Financial transactions between educators complicate tax and legal compliance. |
| **Community Forums** | OUT OF SCOPE | Requires heavy content moderation and deviates from classroom utility. |
| **Native Mobile Apps (V1)** | OUT OF SCOPE | PWA standard meets 100% of offline and install requirements with lower overhead. |
| **Complex Gamification** | OUT OF SCOPE | Virtual coins/avatars distract from NCERT board exam preparation rigor. |
| **AI Avatar/Talking Heads**| OUT OF SCOPE | Compute-intensive, slow on rural 2G/3G networks, and low pedagogical value. |
| **Microservices Architecture**| OUT OF SCOPE | Next.js App Router + Supabase provides all needed modularity without DevOps bloat. |
