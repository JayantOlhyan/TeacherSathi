# TeacherSathi — Product Specification

> **Version**: 1.10.0-phase10  
> **Status**: Verified Production Specification (Through Phase 10)  
> **Target Audience**: Product Architects, Engineering Leads, Full-Stack Developers  

---

## 1. Product Vision & Mission

TeacherSathi is **India's Dedicated NCERT AI Teaching Companion & Smart Classroom Co-Pilot**. 

Conceived by **Jayant Olhyan** for his mother—a government school teacher in India who spent exhaustive hours preparing lesson materials after school hours—TeacherSathi exists to solve the critical problem of resource fragmentation, administrative overhead, and language barriers for Indian school educators.

India has **9.6 million+ school teachers** in government schools (Kendriya Vidyalaya, Jawahar Navodaya Vidyalaya, and State Board schools) and tens of thousands of private CBSE/State Board institutions. While thousands of classrooms have been outfitted with 75-inch smart televisions and interactive flat panels (IFPs), educators lack curriculum-aligned digital software designed for Indian classrooms. Western EdTech tools focus on US Common Core standards, lack Devanagari Hindi support, require expensive recurring subscriptions, and perform poorly on rural 2G/3G connections.

### Core Value Proposition
- **30-Second NCERT Kit Generation**: Converts any chapter from NCERT Class 6 to 10 into classroom-ready 75-inch smartboard slide decks, bilingual mind maps, interactive quizzes, and print-ready CBSE worksheets.
- **Bilingual by Design**: Native Devanagari Hindi and English scientific vocabulary.
- **Hardware-Agnostic 75" Smartboard Integration**: Operates natively in any browser with dynamic QR code authentication, bypassing tedious on-screen password typing.
- **Authoritative Academic Assessments & Grading**: Comprehensive testing platform with server-enforced countdowns, autosave resilience, immutable question snapshots, negative marking, and diagnostic pedagogical analytics.
- **Academic Intelligence & Concept Mastery Engine**: Deterministic 65/35 recency-weighted concept mastery, empirical item difficulty tracking, learning gap diagnosis, and AI-powered 15-minute micro-remediations.
- **100% Free Forever for Individual Teachers**: Zero financial barrier for government school educators.

---

## 2. Target Personas

### Persona 1: Government School Educator (KVS / JNV / State Board)
- **Profile**: Teaches 40–60 students per section; manages 4–6 periods daily; responsible for lesson registers and board exam preparation.
- **Pain Points**: Heavy administrative paperwork; lack of multimedia resources in Hindi; unreliable classroom internet (2G/3G or intermittent Wi-Fi); shared smartboard TVs where typing credentials in front of students is insecure.
- **TeacherSathi Benefit**: Generates ready-to-teach slide decks and printable worksheets in seconds; logs in via smartphone QR scan; exports materials for offline teaching; diagnoses student learning gaps instantly without grading papers late at night.

### Persona 2: Private CBSE School Educator
- **Profile**: Teaches 35–45 students; required to deliver competency-based education aligned with NEP 2020 and Bloom's Taxonomy; frequent formative tests.
- **Pain Points**: Excessive time spent formatting question papers, finding high-resolution diagrams, tracking granular concept mastery, and grading homework manually.
- **TeacherSathi Benefit**: Automated summative and formative test papers with tiered difficulty (Easy, Medium, Hard), negative marking, automatic grading, empirical item error rate diagnostics, and 15-minute AI remediation activity plans.

### Persona 3: School Principal / Management Buyer (B2B)
- **Profile**: Oversees 20–100 teachers across primary, secondary, and senior secondary grades.
- **Pain Points**: Inconsistent lesson quality across classrooms; difficulty tracking syllabus completion and concept deficiencies; compliance with NEP 2020 and DPDP Act 2023.
- **TeacherSathi Benefit**: Centralized dashboard to track syllabus pacing, standardized lesson kit distribution, student assessment performance ledgers, concept mastery distributions across cohorts, and institutional compliance.

### Persona 4: Student (Secondary Grade, Classes 6–10)
- **Profile**: Prepares for CBSE and State Board examinations; benefits from interactive visual revision and clear progress tracking.
- **Pain Points**: Dense textbook prose; difficulty visualizing physics/chemistry concepts; generic MCQ practice without immediate diagnostic feedback; lack of clarity on specific weak areas.
- **TeacherSathi Benefit**: High-engagement live classroom quizzes, visual mind maps, distraction-free assessment portal with autosave, transparent concept mastery progress bars, historical trajectory charts, and targeted practice check items.

---

## 3. Hardware & Network Constraints

1. **75-inch Classroom Display Optimization**:
   - High-contrast color palette (Forest Green `#0F5B38`, Dark `#062E1E`, High-luminance accents `#15803D`, `#F59E0B`).
   - Minimum body font size of 18px–24px in presentation modes to ensure legibility from the back of a 60-student classroom.
   - Touch-friendly tap targets (minimum 44x44px, ideally 56px+ on kiosk interfaces).
2. **Low-Bandwidth & Offline Tolerance**:
   - Page payload optimization with AVIF/WebP image compression.
   - PWA caching with Service Worker (`public/sw.js`) allowing offline review of pre-loaded chapter packs.
   - Resilient debounced & batch autosave for student assessments absorbing transient 4G/5G drops.
   - Exportability of all slide decks and worksheets to static PDF/PPTX formats for zero-internet playback.
3. **Display-Agnostic Pairing**:
   - Ephemeral 5-minute dynamic cryptographic QR codes allowing secure single-use authentication from any smartphone without requiring specialized casting hardware (Chromecast, Miracast).

---

## 4. Architectural Principles

1. **Clean Next.js App Router Architecture**: Server Components for static SEO curriculum hubs; selective Client Components for interactive tools.
2. **Strict Separation of Canonical vs. User Data**: NCERT curriculum is platform-managed and immutable by users; lesson plans and worksheets created by teachers are user-owned.
3. **Question Snapshot Immutability**: All assigned assessments persist frozen JSONB snapshots of questions and answer keys, insulating historical records from syllabus edits.
4. **Server-Authoritative Evaluation & Timers**: Client clocks and runtimes have zero authority over test deadlines, score calculations, or answer key revelation.
5. **Deterministic Academic Mastery Engine**: Mastery scores, confidence ratings, and gap severities are mathematically computed using authoritative student response data ($65/35$ recency-decay weighting). LLMs are never used to assign academic grades or mastery scores.
6. **Actionable AI Remediation Gates**: AI is strictly employed to generate teacher-reviewable 15-minute micro-lessons and diagnostic check items based on empirically identified conceptual gaps.
7. **Zero Academic Data Loss on Billing Delinquency**: Under no circumstances does subscription status (cancellation, past-due, expired) delete or alter student academic history, assessment results, or curriculum records.
8. **Decoupled Gateway & Entitlement Boundary**: Payment gateway tokens (Razorpay order/payment IDs) are strictly decoupled from school feature flags and quota limits.

---

## 5. Commercial SaaS & Institutional Subscription Model

TeacherSathi operates on a multi-tenant institutional SaaS model with four distinct tiers:

1. **Free Forever (`free`, ₹0)**: Individual teachers receive permanent access to NCERT curriculum, 3 teacher accounts, 50 monthly AI generations, 1 paired smartboard, and 40 students per class.
2. **School Starter (`school`, ₹4,999/year)**: Up to 15 teacher accounts, 500 monthly AI credits, 5 paired displays, PDF/PPTX exports, and diagnostic analytics.
3. **School Pro (`school-pro`, ₹9,999/year)**: Up to 50 teacher accounts, 2,500 monthly AI credits, 20 paired displays, AI-powered remediation plans, 365-day history, and priority support.
4. **Enterprise (`enterprise`, ₹29,999/year)**: Unlimited teacher seats, unlimited AI credits, unlimited smartboards, 10-year data retention, and custom school branding.

All subscriptions are managed via PostgreSQL Row Level Security, HMAC-SHA256 signature-verified checkout flows, 7-day grace windows on delinquent payments, and school-wide quota metering.

---

## 6. Content, Media & Smartboard Delivery Engine (Phase 7)

TeacherSathi provides a multi-tenant educational content authoring and delivery pipeline:

1. **Deterministic Validation Gate**: All educational resources undergo automated scoring (100-pt penalty system) enforcing 75" display readability ($\le 60$ words, $\le 5$ bullets per slide), Devanagari script integrity for Hindi, and graph topology consistency.
2. **Immutable Resource Versioning**: Publishing captures historical snapshots in `resource_versions` with 1-click rollback, guaranteeing zero layout shifts or disruption during active classroom presentations.
3. **Fail-Closed Media Security**: Storage uploads enforce server-side magic byte inspection (JPEG, PNG, PDF, WebM, MP4), path traversal prevention, and 60-minute expiring signed URLs for private educational content.
4. **Smartboard Interactive Kiosk Viewer**: Client-side resilient slide viewer supporting 7 slide archetypes (`TITLE`, `CONTENT`, `IMAGE`, `DIAGRAM`, `QUESTION`, `ACTIVITY`, `SUMMARY`) with Realtime session synchronization.
5. **Multi-Channel Export**: High-fidelity 16:9 widescreen printable slide decks, A4 worksheets, and standalone vector SVG mind maps.

---

## 7. Institutional Scale, School Networks & District/State Administration (Phase 8)

TeacherSathi supports comprehensive institutional governance across public and private educational hierarchies:

1. **Multi-Tier Jurisdictional Hierarchy**: Orthogonal integration of State (`states`), District (`districts`), School Network (`organizations`), and School (`schools`) layers.
2. **PostgreSQL Security Definers & RLS**: 6 security definer functions guarantee data isolation between administrative entities, with full isolation for independent schools.
3. **Student Privacy by Design ($N \ge 10$)**: Mandatory minimum cohort threshold ($N \ge 10$) suppressing scores in small cohorts to prevent deductive student deanonymization.
4. **Cascading Governance**: 4-tier inheritance engine resolving operational defaults and policies (`Default` $\longleftarrow$ `State` $\longleftarrow$ `District` $\longleftarrow$ `Organization` $\longleftarrow$ `School`).
5. **Single-Use Cryptographic Invitations**: High-entropy administrative invite tokens (`crypto.randomBytes(32)`) with SHA-256 hash storage and automated role provisioning.
6. **Institutional Portals**: Dedicated portals for Overview KPIs, School Directory & Onboarding, Academic Intelligence, Multi-School Comparative Benchmarking, Invitations, and Cascading Settings.

---

## 8. Native Mobile & Offline Low-Connectivity Classrooms (Phase 9)

TeacherSathi extends the institutional teaching platform directly into teachers' and students' hands via a native mobile application (`mobile/`):

1. **Native Client Architecture**: Engineered on React Native 0.74 and Expo SDK 51, targeting Android (primary tier) and iOS devices with hardware-accelerated layouts, 60fps animations, and $\ge 48\text{px}$ touch targets.
2. **5-Tier Offline Storage System**: SQLite storage architecture separating static NCERT curriculum (`cached_curriculum`), downloadable class packs (`cached_class_packs`), dynamic assignments/assessments (`cached_assignments`, `cached_assessments`), transactional mutations (`sync_outbox`, `offline_answers`), and hardware-only secure storage (`expo-secure-store`). Strict 300MB storage ceiling protects low-spec devices.
3. **Durable Transactional Outbox Sync Engine**: Guaranteed at-least-once synchronization with exponential backoff, random jitter (0–500ms), 5 retry bounds, and auto-dispatch upon connection restoration.
4. **Deterministic Conflict Resolution Matrix**: Clear rule hierarchy giving client authority on active student answers and server authority on final submissions, published curriculum, and classroom sequence.
5. **NCERT Offline Class Packs**: Complete single-download chapter bundles (presentations, mindmaps, lesson plans, formative quizzes) with SHA-256 tamper verification for 100% offline classroom teaching.
6. **Masked Offline Assessment Engine**: Client-side countdown timer, question answer-key masking, and tamper-resistant sealed attempt submissions.
7. **Smartboard Mobile Remote Co-Pilot**: Pairing code / session consumer with slide forward/backward navigation and screen lock toggling.
8. **Push Notifications & Deep Link Routing**: Device token registration, unregister on logout, and role-authorized URI scheme (`teacher-sathi://`).
9. **Shared School Device Data Hygiene**: Hardware SecureStore session storage and instant user data wipe on logout.

---

## 9. Platform Intelligence, Scale Hardening & Government Deployment (Phase 10)

Phase 10 transforms TeacherSathi into an operationally resilient, observable, secure, and performant institutional platform ready for state and national government-scale deployments:

1. **High-Performance Capacity Architecture**:
   - Engineered and modeled for baseline scale: **10,000 schools**, **100,000 teachers**, **1,000,000 students**, **10,000,000+ assessments**, and **100,000,000+ telemetry/audit events**.
   - Deployed 10 composite B-tree indexes across high-traffic tables (`assessment_attempts`, `attempt_answers`, `student_concept_mastery`, `learning_gaps`, `classroom_events`, `job_dead_letters`).
   - Strict 8-second database statement timeout budget and PgBouncer transaction-mode connection pooling (100–250 pooled backend connections serving thousands of client requests).
2. **Global Standardized Error Model**:
   - Strongly typed `ApiError` class with standard machine-readable codes (`UNAUTHORIZED`, `RATE_LIMIT_EXCEEDED`, `SERVICE_DEGRADED`, etc.).
   - Standardized `x-request-id` correlation IDs propagated end-to-end across mobile clients, web browsers, API route handlers, background tasks, and database queries for instant distributed tracing.
3. **Centralized Multi-Tier Rate Limiting & Abuse Protection**:
   - Sliding-window log rate limiter managing 7 distinct system boundaries:
     - `AUTH`: 5 requests / 60 seconds (prevents credential stuffing)
     - `AI_GENERATE`: 10 requests / 60 seconds (prevents LLM quota exhaustion)
     - `ATTEMPT_AUTOSAVE`: 60 requests / 60 seconds (accommodates high-frequency student test autosaves)
     - `ATTEMPT_SUBMIT`: 3 requests / 60 seconds (prevents duplicate submission races)
     - `MEDIA_UPLOAD`: 10 requests / 60 seconds (prevents bandwidth saturation)
     - `MOBILE_SYNC`: 30 requests / 60 seconds (supports bursts of offline outbox syncs)
     - `ADMIN_ACTIONS`: 20 requests / 60 seconds (protects institutional bulk mutations)
   - Heuristic abuse guards: 5 consecutive failed login attempts trigger an automatic 15-minute lockout; identical submission attempts within 5 seconds are blocked as replays.
4. **Strict SVG XML Sanitizer**:
   - Multi-stage XML parser and sanitizer stripping malicious `<script>`, `<foreignObject>`, inline `on*` event handlers, `javascript:` protocol links, and XXE `<!ENTITY>` declarations before asset ingestion or rendering.
5. **Background Job Dead-Letter Queue (DLQ)**:
   - Resilient background task lifecycle with jittered exponential backoff (1s base, 2x multiplier, random jitter) and max 3 retry attempts.
   - Automatically quarantines persistently failing tasks to `job_dead_letters` table.
   - Provides operator inspection, manual requeueing, and bulk purge capabilities via `/admin/operations`.
6. **Production AI Resilience & Fail-Closed Safety**:
   - Hard fail-closed policy (`assertProductionSafety()`) throwing explicit 503 Service Unavailable errors rather than silently generating mock answers in production when credentials are missing or revoked.
   - Daily spending ceilings in INR: ₹5,000/day per school and ₹200/day per teacher.
   - Hard timeout enforcement (15s per generation) preventing thread pool hanging.
7. **Structured Machine-Readable Observability**:
   - High-throughput JSON logging (`logger.ts`) with recursive PII/secret redaction for Aadhaar numbers, Indian mobile numbers, email addresses, passwords, Bearer tokens, and API keys.
   - In-memory telemetry buffer tracking request latency percentiles ($p_{50}$, $p_{95}$, $p_{99}$), error rate distributions, DLQ depth, and cumulative AI expenditure in INR.
8. **Container Health Check Probes**:
   - `/api/health`: Comprehensive system probe returning deep subsystem health (`LIVE`, `READY`, `DEGRADED`) across PostgreSQL, AI providers, media storage, and DLQ.
   - `/api/health/live`: Lightweight container liveness probe (200 OK, `LIVE`).
   - `/api/health/ready`: Traffic ingress readiness probe testing live database connectivity.
9. **Hierarchical Feature Flags & Emergency Kill-Switches**:
   - 5-tier hierarchical scoping (`PLATFORM` $\to$ `STATE` $\to$ `DISTRICT` $\to$ `ORGANIZATION` $\to$ `SCHOOL`).
   - Deterministic SHA-256 percentage rollout hashing (0–100%) and explicit entity target whitelists.
   - Global emergency kill-switch capability for immediate feature disabling without redeployment.
10. **Platform Operations Console (`/admin/operations`)**:
    - Dedicated web console for SREs and platform administrators featuring real-time health scorecards, subsystem status cards, DLQ inspection with 1-click retry and purge, and live feature flag toggles with immutable operator audit logging.
11. **Data Governance Aligned with DPDP Act 2023 & Disaster Recovery**:
    - Rigorous student data privacy governance with authoritative permanence for academic records (attempts, grades, certificates never deleted on subscription expiration).
    - Clear retention schedules for ephemeral logs (30 days), dead letters (14 days), and raw telemetry (90 days).
    - Disaster recovery architecture targeting **RPO $\le 15$ minutes** and **RTO $\le 2$ hours** via continuous PostgreSQL WAL streaming and daily physical base snapshots.


