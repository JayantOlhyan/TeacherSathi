# TeacherSathi — Product Specification

> **Version**: 1.6.0-phase6  
> **Status**: Verified Production Specification (Through Phase 6)  
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

