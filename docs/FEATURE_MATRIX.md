# TeacherSathi — Actual Implementation Matrix

> **Status**: Frozen Audit (Phase 0)  
> **Rule**: Rigorous technical classification based strictly on active codebase inspection.

---

## Complete Feature & Route Implementation Matrix

| Feature / Subsystem | Route / File Path | Status | Real or Mocked | Backend Data Source | Dependencies | Production Blocker? |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Landing Page & Hero** | `src/app/[locale]/page.tsx` | IMPLEMENTED | Real UI / Simulated Actions | Static JSX + GSAP | `gsap`, `lucide-react` | No |
| **Interactive Studio Preview** | `src/components/landing/InteractiveHeroWorkspace.tsx` | PARTIAL | Simulated Generation | Hardcoded local state | `lucide-react` | No |
| **Time Saved Calculator** | `src/components/landing/TimeSavedCalculator.tsx` | IMPLEMENTED | Real Formula Calculation | Client state | `lucide-react` | No |
| **Bilingual Localization** | `src/i18n/*`, `messages/*.json` | IMPLEMENTED | Real Dictionary Engine | Static JSON (`en.json`, `hi.json`) | `next-intl` | No |
| **User Authentication (Login/Signup)** | `src/app/[locale]/login`, `/signup` | PARTIAL | Real Auth / Missing Role Enforcement | Supabase Auth Client | `@supabase/supabase-js` | **YES** (No server-side role check) |
| **Smartboard 75" Kiosk UI** | `src/app/[locale]/classroom/page.tsx` | PARTIAL | Real UI / Mock Polling | `localStorage` polling (`ts_qr_approved_*`) | `lucide-react` | **YES** (Must be WebSocket/Realtime) |
| **Mobile QR Handshake** | `src/app/[locale]/auth/qr-confirm/page.tsx` | PARTIAL | Real Handshake / Mock Polling | `localStorage` write | `@supabase/supabase-js` | **YES** (Must broadcast via server) |
| **Teacher Dashboard** | `src/app/[locale]/dashboard/page.tsx` | PARTIAL | Real UI / Static Data | Mock state + `localStorage` | `lucide-react`, Web Audio API | **YES** (No database connection) |
| **Classroom Silence Bell** | `src/app/[locale]/dashboard/page.tsx` | IMPLEMENTED | Real Audio Synthesizer | Web Audio API Oscillator | Native Web Audio API | No |
| **Saathi Genie AI Chat** | `src/app/[locale]/dashboard/page.tsx` | MOCKED | Mock Response Engine | Hardcoded `setTimeout` keyword matcher | `lucide-react` | **YES** (No live LLM API) |
| **Interactive Whiteboard** | `src/app/[locale]/dashboard/whiteboard/page.tsx` | IMPLEMENTED | Real Digital Canvas | Client-side memory | `@excalidraw/excalidraw` | No |
| **Chapter Hub (TEACH/ASSESS/PLAN)** | `src/app/[locale]/content/[grade]/[subject]/[chapter]` | PARTIAL | Real Layout / Static Data | `src/lib/data/ncertSyllabus.ts` | `lucide-react`, `framer-motion` | **YES** (Syllabus hardcoded in TS) |
| **Classroom MCQ Quiz Engine** | `src/app/[locale]/content/.../quiz/page.tsx` | IMPLEMENTED | Real Evaluation Engine | Static JSON files (`public/quizzes/*.json`) | `lucide-react` | No (Can run on static JSON) |
| **Classroom Video Player** | `src/app/[locale]/content/.../video/page.tsx` | IMPLEMENTED | Real YouTube Embed | NCERT Syllabus video ID mapping | YouTube IFrame API | No |
| **Summative Chapter Test** | `src/app/[locale]/content/.../test/page.tsx` | PARTIAL | Mocked Question State | Hardcoded question in JSX | `lucide-react` | **YES** (Only 1 question hardcoded) |
| **Textbook QA Bank** | `src/app/[locale]/content/.../qa/page.tsx` | IMPLEMENTED | Real Reader | Static JSON (`public/qa/*.json`) | `lucide-react` | No |
| **Classes & Rosters Manager** | `src/app/[locale]/dashboard/classes/page.tsx` | MOCKED | Mock Persistence | Client state (lost on reload) | `lucide-react` | **YES** (No database storage) |
| **AI Resource Creation Wizard** | `src/app/[locale]/dashboard/create/page.tsx` | MOCKED | Simulated Generation | `setTimeout` generator | `lucide-react` | **YES** (No real AI generation) |
| **Student Diagnostic Reports** | `src/app/[locale]/dashboard/reports/page.tsx` | MOCKED | Mock Charts & Percentages | Hardcoded statistics | `lucide-react` | **YES** (No historical test data) |
| **Registered Smart Displays** | `src/app/[locale]/dashboard/devices/page.tsx` | MOCKED | Mock Device List | Hardcoded mock array | `lucide-react` | **YES** (No device registry in DB) |
| **Admin Dashboard** | `src/app/[locale]/admin/dashboard/page.tsx` | PARTIAL | Real UI / LocalStorage DB | `src/lib/adminStore.ts` (`localStorage`) | `lucide-react` | **YES** (Data lost on cache clear) |
| **Admin Video Generation Pipeline** | `src/app/[locale]/admin/pipeline/page.tsx` | MOCKED | Terminal UI Simulation | Hardcoded jobs array | `lucide-react` | **YES** (No real video rendering) |
| **Admin Question Bank Manager** | `src/app/[locale]/admin/questions/page.tsx` | PARTIAL | LocalStorage CRUD | `src/lib/adminStore.ts` | `lucide-react` | **YES** (Must be PostgreSQL backed) |
| **Admin Media Library** | `src/app/[locale]/admin/media/page.tsx` | PARTIAL | LocalStorage File Metadata | `src/lib/adminStore.ts` | `lucide-react` | **YES** (No S3/Supabase Storage bucket) |
| **Pricing & Checkout** | `src/app/[locale]/pricing/page.tsx` | MOCKED | Mock Checkout Trigger | Client `alert()` dialog | `lucide-react` | **YES** (No Razorpay checkout) |
| **Institutional Lead Capture** | `src/components/InstitutionalLeadModal.tsx` | PARTIAL | Frontend Form / Mock Submit | No API route handler | `lucide-react` | **YES** (Inquiries not sent to CRM/DB) |
| **Support Contact Form** | `src/app/[locale]/support/contact/page.tsx` | PARTIAL | Frontend Form / Mock Submit | `setTimeout` reset | `lucide-react` | **YES** (Messages not saved/emailed) |
| **Programmatic SEO Personas** | `src/app/[locale]/for/[persona]/page.tsx` | IMPLEMENTED | Real Static SSG Routes | Static dictionary | `lucide-react` | No |
| **Programmatic SEO Comparisons** | `src/app/[locale]/compare/[slug]/page.tsx` | IMPLEMENTED | Real Static SSG Routes | Static dictionary | `lucide-react` | No |
| **Progressive Web App (PWA)** | `public/sw.js`, `manifest.webmanifest` | IMPLEMENTED | Real Service Worker | Browser Cache API | Service Worker API | No |
| **Global Security Headers** | `next.config.mjs` | IMPLEMENTED | Real HTTP Headers | Next.js config engine | Native Next.js | No |
| **Server-Side API Routes (`/api/*`)**| `src/app/api/*` | MISSING | None Exist | **Zero API routes implemented** | None | **YES** (Required for backend) |
| **Automated Test Suite** | Repository root | MISSING | No Test Runners | None (No Jest/Cypress/Playwright) | None | **YES** (Must verify regressions) |
