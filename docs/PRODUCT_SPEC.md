# TeacherSathi — Product Specification

> **Version**: 1.0.0-phase0  
> **Status**: Frozen Architecture Specification  
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
- **100% Free Forever for Individual Teachers**: Zero financial barrier for government school educators.

---

## 2. Target Personas

### Persona 1: Government School Educator (KVS / JNV / State Board)
- **Profile**: Teaches 40–60 students per section; manages 4–6 periods daily; responsible for lesson registers and board exam preparation.
- **Pain Points**: Heavy administrative paperwork; lack of multimedia resources in Hindi; unreliable classroom internet (2G/3G or intermittent Wi-Fi); shared smartboard TVs where typing credentials in front of students is insecure.
- **TeacherSathi Benefit**: Generates ready-to-teach slide decks and printable worksheets in seconds; logs in via smartphone QR scan; exports materials for offline teaching.

### Persona 2: Private CBSE School Educator
- **Profile**: Teaches 35–45 students; required to deliver competency-based education aligned with NEP 2020 and Bloom's Taxonomy; frequent formative tests.
- **Pain Points**: Excessive time spent formatting question papers, finding high-resolution diagrams, and grading homework manually.
- **TeacherSathi Benefit**: Automated summative and formative test papers with tiered difficulty (Easy, Medium, Hard) and complete teacher answer keys.

### Persona 3: School Principal / Management Buyer (B2B)
- **Profile**: Oversees 20–100 teachers across primary, secondary, and senior secondary grades.
- **Pain Points**: Inconsistent lesson quality across classrooms; difficulty tracking syllabus completion; compliance with NEP 2020 and DPDP Act 2023.
- **TeacherSathi Benefit**: Centralized dashboard to track syllabus pacing, standardized lesson kit distribution, and institutional compliance.

### Persona 4: Student (Secondary Grade, Classes 6–10)
- **Profile**: Prepares for CBSE and State Board examinations; benefits from interactive visual revision.
- **Pain Points**: Dense textbook prose; difficulty visualizing physics/chemistry concepts; generic MCQ practice without immediate diagnostic feedback.
- **TeacherSathi Benefit**: High-engagement live classroom quizzes, visual mind maps, and structured solved question banks.

---

## 3. Hardware & Network Constraints

1. **75-inch Classroom Display Optimization**:
   - High-contrast color palette (Forest Green `#0F5B38`, Dark `#062E1E`, High-luminance accents `#15803D`, `#F59E0B`).
   - Minimum body font size of 18px–24px in presentation modes to ensure legibility from the back of a 60-student classroom.
   - Touch-friendly tap targets (minimum 44x44px, ideally 56px+ on kiosk interfaces).
2. **Low-Bandwidth & Offline Tolerance**:
   - Page payload optimization with AVIF/WebP image compression.
   - PWA caching with Service Worker (`public/sw.js`) allowing offline review of pre-loaded chapter packs.
   - Exportability of all slide decks and worksheets to static PDF/PPTX formats for zero-internet playback.
3. **Display-Agnostic Pairing**:
   - Ephemeral 2-minute dynamic QR codes allowing authentication from any smartphone without requiring specialized casting hardware (Chromecast, Miracast).

---

## 4. Architectural Principles

1. **Clean Next.js App Router Architecture**: Server Components for static SEO curriculum hubs; selective Client Components for interactive tools.
2. **Strict Separation of Canonical vs. User Data**: NCERT curriculum is platform-managed and immutable by users; lesson plans and worksheets created by teachers are user-owned.
3. **Deterministic AI Quality Gates**: AI output must pass schema validation, NCERT alignment verification, and bilingual accuracy checks before being saved or presented.
