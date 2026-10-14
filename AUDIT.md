# TeacherSathi Baseline Technical Audit

**Audit Date:** October 15, 2026  
**Audited Repository:** `/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final`  
**Auditor:** Automated Engineering Baseline Audit  
**Target Environment:** Local Node.js v20+ / macOS / Netlify Production Deployment (`https://teacher-sathi.online`)

---

## 1. Checks

All checks were executed directly in the repository root environment.

### Summary Table

| Command | Status | Exit Code | Error Count | Warning Count | First 20 Errors |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `npm ci` | **PASS** | 0 | 0 | 8 deprecated package warnings, 27 vulnerabilities | None (0 errors) |
| `npm run typecheck` (`tsc --noEmit`) | **PASS** | 0 | 0 | 0 | None (0 errors) |
| `npm run lint` (`next lint`) | **PASS** | 0 | 0 | 0 | None (0 errors) |
| `npm run test` (`vitest run`) | **PASS** | 0 | 0 | 0 | None (0 errors) |
| `npm run build` (`next build`) | **PASS** | 0 | 0 | 0 | None (0 errors) |

---

### Detailed Check Execution Outputs

#### 1. `npm ci`
- **Result:** PASS
- **Errors:** 0
- **Summary:** Added 697 packages, audited 698 packages in 44 seconds.
- **First 20 errors:** None.
- **Diagnostic output snippet:**
  ```text
  npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory.
  npm warn deprecated glob@7.2.3: Old versions of glob are not supported.
  npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported.
  npm warn deprecated eslint@8.57.1: This version is no longer supported.
  added 697 packages, and audited 698 packages in 44s
  27 vulnerabilities (1 low, 9 moderate, 16 high, 1 critical)
  ```

#### 2. `npm run typecheck` (`tsc --noEmit`)
- **Result:** PASS
- **Errors:** 0
- **First 20 errors:** None (clean compilation, zero TypeScript diagnostics emitted).
- **Execution output:**
  ```text
  > teacher-sathi@0.1.0 typecheck
  > tsc --noEmit
  ```

#### 3. `npm run lint` (`next lint`)
- **Result:** PASS
- **Errors:** 0
- **First 20 errors:** None.
- **Execution output:**
  ```text
  > teacher-sathi@0.1.0 lint
  > next lint

  ✔ No ESLint warnings or errors
  ```

#### 4. `npm run test` (`vitest run`)
- **Result:** PASS
- **Errors:** 0
- **First 20 errors:** None.
- **Test execution statistics:**
  - **Test Files:** 79 passed (79 total)
  - **Tests:** 440 passed (440 total)
  - **Duration:** 2.68s
- **Execution output snippet:**
  ```text
  Test Files  79 passed (79)
  Tests       440 passed (440)
  Start at    00:59:20
  Duration    2.68s (transform 1.90s, setup 0ms, import 6.38s, tests 845ms, environment 9ms)
  ```

#### 5. `npm run build` (`next build`)
- **Result:** PASS
- **Errors:** 0
- **First 20 errors:** None.
- **Build summary:** Compiled Next.js 14.2.35 production bundle successfully. Generated all 75 client/server pages and 80 API route endpoints. First Load JS shared by all chunks: 89.8 kB. Middleware size: 106 kB.

---

## 2. Deployment

### Live Site Verification Details

- **Live URL:** `https://teacher-sathi.online`
- **Hosting Provider:** Netlify (`server: Netlify`, `x-nf-request-id: 01M4XY13W0QG7YJ507ZXF1K6P7`)
- **Live Commit Hash:** `c7ee1b18faeee23d45535ca16b57af56ff3938ae`
- **Live Commit Subject:** `feat(ui): add route filters and session dismissal storage to WhatsApp support widget`
- **Live Commit Timestamp:** `2026-09-18 23:14:49 +0530`

### Comparison Against `main`

| Environment | Commit Hash | Subject | Ahead / Behind |
| :--- | :--- | :--- | :--- |
| **Production (`teacher-sathi.online`)** | `c7ee1b18faeee23d45535ca16b57af56ff3938ae` | `feat(ui): add route filters and session dismissal storage...` | Matches `origin/main` |
| **Remote GitHub (`origin/main`)** | `c7ee1b18faeee23d45535ca16b57af56ff3938ae` | `feat(ui): add route filters and session dismissal storage...` | Base reference |
| **Local Branch (`main`)** | `43927d1a44025154d49263acfb3deaf2873b9fe5` | `feat(phase-18): reliability, accessibility, and exhibition polish` | **Ahead of live by 48 commits** |

**Does it match `main`?**
- **Remote `origin/main`:** **YES.** The deployed live build matches `origin/main` exactly (`c7ee1b18faeee23d45535ca16b57af56ff3938ae`).
- **Local `main`:** **NO.** The local `main` branch is ahead of the live deployment by 48 commits (`43927d1a44025154d49263acfb3deaf2873b9fe5`), covering Phases 11 through 18, which have not been pushed to GitHub or deployed to Netlify.

### Forensic Verification Evidence

1. **JavaScript Bundle Inspection:**  
   Downloading live bundle chunk `https://teacher-sathi.online/_next/static/chunks/app/%5Blocale%5D/layout-71b0d651a404dfae.js` reveals the exact string:  
   `sessionStorage.setItem("sathi_support_tooltip_dismissed","true")`  
   Git history inspection confirms this string was introduced specifically in commit `c7ee1b1`.
2. **CSS Bundle Inspection:**  
   Downloading live stylesheets `553ecdfd4f2a09b8.css` and `2c9a50946e9be2ec.css` reveals 7 occurrences of `.smartboard-dark` and **zero** occurrences of `.classroom-theme-dark` or `.touch-target-classroom`.  
   Git history proves that commit `1a0c051` (3 commits after `c7ee1b1`) removed `.smartboard-dark` and introduced `.classroom-theme-dark`. Therefore, production is running `c7ee1b1` and no commit at or after `1a0c051`.

---

## 3. Mock vs Real: Route Architecture Analysis (`src/app/[locale]`)

Every route under `src/app/[locale]` (75 routes total) was inspected for its data source and multi-device persistence:

| Route | Data Source | Persists Across Devices |
| :--- | :--- | :--- |
| `/[subjectHub]` | Static content / seed files (`NCERT_SYLLABUS`) | No (Static read-only) |
| `/about` | Static content / seed files | No (Static read-only) |
| `/admin` | Client redirect to `/admin/dashboard` | No |
| `/admin/announcements` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/audit-logs` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/billing` | API route (`/api/billing/admin/overview`) + fallback | No (Unreachable Supabase DB) |
| `/admin/content/books` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/content/chapters` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/content/chapters/[chapterId]` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/content/classes` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/content/subjects` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/dashboard` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/institutional` | API route (`/api/admin/institutional/overview`) + fallback | No (Unreachable Supabase DB) |
| `/admin/institutional/academic` | API route (`/api/admin/institutional/academic`) + fallback | No (Unreachable Supabase DB) |
| `/admin/institutional/compare` | API route (`/api/admin/institutional/compare`) + fallback | No (Unreachable Supabase DB) |
| `/admin/institutional/invitations` | API route (`/api/admin/institutional/invitations`) + fallback | No (Unreachable Supabase DB) |
| `/admin/institutional/schools` | API route (`/api/admin/institutional/schools`) + fallback | No (Unreachable Supabase DB) |
| `/admin/institutional/settings` | API route (`/api/admin/institutional/settings`) + fallback | No (Unreachable Supabase DB) |
| `/admin/media` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/operations` | API routes (`/api/admin/operations/*`) + fallback | No (Unreachable Supabase DB) |
| `/admin/pipeline` | `adminStore` / static mock | No (`sessionStorage` only) |
| `/admin/questions` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/questions/import` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/site-content` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/admin/users` | `adminStore` (`sessionStorage` & in-memory cache) | No (`sessionStorage` only) |
| `/auth/qr-confirm` | API route (`/api/classroom/sessions/[id]/pair`) | No (Local state / offline DB) |
| `/classroom` | API routes (`/api/classroom/sessions/*`) + localStorage | No (Local state / offline DB) |
| `/compare/[slug]` | Static seed content / marketing matrix | No (Static read-only) |
| `/content` | Static seed files (`ncertSyllabus.ts`, `chapters.ts`) | No (Static read-only) |
| `/content/[grade]` | Static seed files (`ncertSyllabus.ts`, `chapters.ts`) | No (Static read-only) |
| `/content/[grade]/[subject]` | Static seed files (`ncertSyllabus.ts`, `chapters.ts`) | No (Static read-only) |
| `/content/[grade]/[subject]/[chapter]` | Static seed files (`ncertSyllabus.ts`, `chapters.ts`) | No (Static read-only) |
| `/content/[grade]/[subject]/[chapter]/qa` | Static seed / hardcoded Q&A | No (Static read-only) |
| `/content/[grade]/[subject]/[chapter]/quiz` | Static JSON files (`/quizzes/*.json`) + React state | No (Component state only) |
| `/content/[grade]/[subject]/[chapter]/test` | Static seed + React state | No (Component state only) |
| `/content/[grade]/[subject]/[chapter]/video` | Static seed / embedded YouTube references | No (Static read-only) |
| `/dashboard` | Static mock classes + `useTeachingContext` (localStorage) | No (Local browser storage) |
| `/dashboard/activity` | Client state / mock activity log | No (Local state only) |
| `/dashboard/admin/billing` | Static pricing UI + Razorpay client SDK | No (Unreachable Supabase DB) |
| `/dashboard/analytics` | API routes (`/api/analytics/*`) + static fallback | No (Unreachable Supabase DB) |
| `/dashboard/assessments` | API route (`/api/assessments`) + mock fallback | No (Unreachable Supabase DB) |
| `/dashboard/assessments/[id]/results` | API route (`/api/assessments/[id]/results`) | No (Unreachable Supabase DB) |
| `/dashboard/assessments/create` | API route (`/api/assessments`, `/api/questions`) | No (Unreachable Supabase DB) |
| `/dashboard/classes` | API route (`/api/classes`) + local mock state | No (Unreachable Supabase DB) |
| `/dashboard/create` | API routes (`/api/ai/generate`, `/api/resources`) | No (Unreachable Supabase DB) |
| `/dashboard/devices` | Client state / mock paired devices list | No (Component state only) |
| `/dashboard/profile` | Supabase read with mock profile fallback | No (Local storage only) |
| `/dashboard/reports` | API route (`/api/analytics/*`) + static fallback | No (Unreachable Supabase DB) |
| `/dashboard/resources` | API route (`/api/resources`) + static chapter resources | No (Unreachable Supabase DB) |
| `/dashboard/resources/[id]` | API route (`/api/resources/[id]`) + fallback | No (Unreachable Supabase DB) |
| `/dashboard/resources/activities/[id]/edit` | API route (`/api/activities/[id]`) + mock fallback | No (Unreachable Supabase DB) |
| `/dashboard/resources/mindmaps/[id]/edit` | API route (`/api/mindmaps/[id]`) + mock fallback | No (Unreachable Supabase DB) |
| `/dashboard/resources/presentations/[id]/edit` | API route (`/api/presentations/[id]`) + mock fallback | No (Unreachable Supabase DB) |
| `/dashboard/settings` | Client component state / local preferences | No (Local storage only) |
| `/dashboard/whiteboard` | Excalidraw canvas + local component state | No (In-memory canvas only) |
| `/demo` | Static interactive guided tour | No (Static read-only) |
| `/for/[persona]` | Static landing page variant | No (Static read-only) |
| `/forgot-password` | Supabase Auth API call | No (Unreachable Supabase DB) |
| `/login` | Supabase Auth with automatic fallback to localStorage | No (Client cookie / localStorage) |
| `/page` (`/`) | Static landing page with interactive widgets | No (Static read-only) |
| `/pricing` | Static pricing tier tables | No (Static read-only) |
| `/privacy` | Static legal text | No (Static read-only) |
| `/resources` | `adminStore` (`sessionStorage`) | No (`sessionStorage` only) |
| `/resources/lesson-plans` | Static SEO landing page | No (Static read-only) |
| `/resources/mind-maps` | Static SEO landing page | No (Static read-only) |
| `/resources/ncert` | Static SEO landing page | No (Static read-only) |
| `/resources/quiz-generator` | Static SEO landing page | No (Static read-only) |
| `/resources/teachersathi-vs-magicschool-ai` | Static SEO comparison matrix | No (Static read-only) |
| `/signup` | Supabase Auth with automatic fallback to localStorage | No (Client cookie / localStorage) |
| `/student/assessments/[id]/attempt` | API route (`/api/assessments/[id]/attempts`, `/api/attempts/*`) | No (Unreachable Supabase DB) |
| `/student/assessments/[id]/result` | API route (`/api/results/[id]`) | No (Unreachable Supabase DB) |
| `/student/assignments` | API route (`/api/assignments`) | No (Unreachable Supabase DB) |
| `/student/progress` | API route (`/api/analytics/student/[id]`) | No (Unreachable Supabase DB) |
| `/support` | Static support hub | No (Static read-only) |
| `/support/contact` | Static contact FAQ and WhatsApp link | No (Static read-only) |
| `/support/sitemap` | Static links collection | No (Static read-only) |
| `/terms` | Static legal text | No (Static read-only) |

---

## 4. API Routes Audit (`src/app/api`)

Every route handler under `src/app/api` (80 endpoints total) was audited:

| Endpoint | Methods | Purpose / Description | Server Auth Check | Called by UI |
| :--- | :--- | :--- | :--- | :--- |
| `/api/activities/[id]` | GET, PATCH | Fetch or update specific classroom learning activity | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/resources/activities/[id]/edit`) |
| `/api/activities` | GET, POST | List and create interactive pedagogical activities | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/resources/activities/[id]/edit`) |
| `/api/admin/institutional/academic` | GET | Retrieve and manage institutional academic metrics | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional/academic`) |
| `/api/admin/institutional/adoption` | GET | Track adoption rates across schools and districts | Yes (`authenticateInstitutionalAdmin()`) | No |
| `/api/admin/institutional/compare` | POST | Benchmark performance across institutions and cohorts | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional/compare`) |
| `/api/admin/institutional/districts` | GET, POST | List and configure institutional district entities | Yes (`authenticateInstitutionalAdmin()`) | No |
| `/api/admin/institutional/invitations/accept` | POST | Accept pending institutional onboarding invitations | Yes (`supabase.auth.getUser()`) | No |
| `/api/admin/institutional/invitations` | GET, POST, DELETE | Generate and track institutional administrator invitations | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional/invitations`) |
| `/api/admin/institutional/organizations` | GET, POST | List and register educational management organizations | Yes (`authenticateInstitutionalAdmin()`) | No |
| `/api/admin/institutional/overview` | GET | Aggregate high-level KPI dashboard metrics for institutions | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional`) |
| `/api/admin/institutional/reports/export` | POST | Export aggregated compliance and performance reports | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional`) |
| `/api/admin/institutional/resources` | GET | Manage curriculum distribution across institution schools | Yes (`authenticateInstitutionalAdmin()`) | No |
| `/api/admin/institutional/schools/[id]` | GET, PATCH, DELETE | Retrieve, update, or remove specific school registration | Yes (`authenticateInstitutionalAdmin()`) | No |
| `/api/admin/institutional/schools` | GET, POST | List and register schools with UDISE code tracking | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional/schools`, `compare`) |
| `/api/admin/institutional/settings` | GET, PUT | Manage institutional governance and academic settings | Yes (`authenticateInstitutionalAdmin()`) | Yes (`admin/institutional/settings`) |
| `/api/admin/institutional/states` | GET, POST | List and configure state-level education authorities | Yes (`authenticateInstitutionalAdmin()`) | No |
| `/api/admin/operations/feature-flags` | GET, POST | Query and update system feature flags and rollouts | **No** (Unauthenticated) | Yes (`admin/operations`) |
| `/api/admin/operations/health` | GET | Detailed health probe of background services and telemetry | **No** (Unauthenticated) | No |
| `/api/admin/operations/jobs` | GET, POST, DELETE | Monitor queue jobs, retries, and dead letter records | **No** (Unauthenticated) | Yes (`admin/operations`) |
| `/api/ai/generate` | POST | Generate lesson plans, worksheets, and mind maps via AI | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/create`) |
| `/api/ai/genie` | POST | Process teacher assistant chat prompts and pedagogical advice | Yes (`supabase.auth.getUser()`) | Yes (`dashboard`, `saathiService`) |
| `/api/analytics/class/[id]` | GET | Fetch class-level mastery summaries and student distributions | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/analytics`, `dashboard`) |
| `/api/analytics/concepts/[id]` | GET | Analyze concept mastery progression and misconception trends | Yes (`supabase.auth.getUser()`) | No |
| `/api/analytics/data-quality` | GET | Verify assessment telemetry integrity and anomaly scores | Yes (`supabase.auth.getUser()`) | No |
| `/api/analytics/interventions/generate` | POST | Generate targeted remediation plans for learning gaps | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/analytics`) |
| `/api/analytics/recompute` | POST | Trigger background recalculation of student concept mastery | Yes (`supabase.auth.getUser()`) | No |
| `/api/analytics/student/[id]` | GET | Retrieve student-specific concept mastery and gap profile | Yes (`supabase.auth.getUser()`) | Yes (`student/progress`) |
| `/api/assessments/[id]/assign` | POST | Assign an assessment to classes, sections, or students | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments`) |
| `/api/assessments/[id]/attempts` | GET, POST | Start or retrieve student attempts for an assessment | Yes (`supabase.auth.getUser()`) | Yes (`student/assessments/[id]/attempt`) |
| `/api/assessments/[id]/publish` | POST | Transition assessment from draft to published status | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments`) |
| `/api/assessments/[id]/results` | GET | Aggregate attempt results and question-by-question metrics | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments/[id]/results`) |
| `/api/assessments/[id]` | GET, PUT, DELETE | Fetch, update, or delete a specific assessment | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments/[id]`) |
| `/api/assessments/ai-convert` | POST | Parse unstructured question text into structured questions | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments/create`) |
| `/api/assessments` | GET, POST | List and create formative assessments, quizzes, and tests | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments`) |
| `/api/assignments/[id]` | GET, PATCH | Fetch or update assignment settings and deadlines | Yes (`supabase.auth.getUser()`) | Yes (`student/assignments`) |
| `/api/assignments` | GET, POST | List and create student homework/classwork assignments | Yes (`supabase.auth.getUser()`) | Yes (`student/assignments`) |
| `/api/attempts/[id]/answers` | POST | Autosave student answer selections during an attempt | Yes (`supabase.auth.getUser()`) | Yes (`student/assessments/[id]/attempt`) |
| `/api/attempts/[id]/submit` | POST | Submit attempt for automated scoring and gap computation | Yes (`supabase.auth.getUser()`) | Yes (`student/assessments/[id]/attempt`) |
| `/api/attempts/[id]` | GET | Retrieve attempt details, remaining time, and questions | Yes (`supabase.auth.getUser()`) | Yes (`student/assessments/[id]/attempt`) |
| `/api/billing/admin/overview` | GET | Retrieve platform revenue, MRR, and subscriber metrics | Yes (`supabase.auth.getUser()`) | Yes (`admin/billing`) |
| `/api/billing/cancel` | POST | Cancel subscription at end of billing cycle | Yes (`supabase.auth.getUser()`) | No |
| `/api/billing/change-plan` | POST | Change school subscription plan tier | Yes (`supabase.auth.getUser()`) | No |
| `/api/billing/checkout` | POST | Create Razorpay payment order for subscription | Yes (`supabase.auth.getUser()`) | Yes (`pricing`, `dashboard/admin/billing`) |
| `/api/billing/payments` | GET | List transaction records and invoice receipts | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/admin/billing`) |
| `/api/billing/plans` | GET | List available public subscription plans | **No** (Public endpoint) | Yes (`pricing`, `dashboard/admin/billing`) |
| `/api/billing/subscription` | GET | Retrieve current active subscription and entitlements | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/admin/billing`) |
| `/api/billing/usage` | GET | Track resource generation against plan quota limits | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/admin/billing`) |
| `/api/billing/verify` | POST | Verify cryptographic signature of Razorpay payment | Yes (`supabase.auth.getUser()`) | Yes (`pricing`, `dashboard/admin/billing`) |
| `/api/billing/webhook` | POST | Handle asynchronous webhook notifications from Razorpay | **Yes** (HMAC Signature verification) | No (Called by Razorpay servers) |
| `/api/classes` | GET, POST | List and create teacher classroom sections and rosters | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/classes`, `dashboard/page`) |
| `/api/classroom/pair/consume` | POST | Exchange a 6-digit pairing code for session auth token | **No** (Code verification only) | Yes (`classroom`, `auth/qr-confirm`) |
| `/api/classroom` | GET, POST | Manage classroom device associations and active status | Yes (`supabase.auth.getUser()`) | Yes (`classroom`) |
| `/api/classroom/sessions/[id]/devices/[deviceId]/revoke` | POST | Disconnect a paired device from classroom session | Yes (`supabase.auth.getUser()`) | No |
| `/api/classroom/sessions/[id]/devices` | GET | List all active paired devices in a classroom session | Yes (`supabase.auth.getUser()`) | Yes (`classroom`) |
| `/api/classroom/sessions/[id]/end` | POST | End active classroom session and archive telemetry | Yes (`supabase.auth.getUser()`) | Yes (`classroom`) |
| `/api/classroom/sessions/[id]/events` | POST | Broadcast slide transitions and clicker events | Yes (`supabase.auth.getUser()`) | Yes (`classroom`) |
| `/api/classroom/sessions/[id]/pair` | POST | Generate pairing code and QR code for session | Yes (`supabase.auth.getUser()`) | Yes (`classroom`, `dashboard/page`) |
| `/api/classroom/sessions/[id]/pause` | POST | Pause active presentation and freeze client screens | Yes (`supabase.auth.getUser()`) | No |
| `/api/classroom/sessions/[id]/resume` | POST | Resume paused presentation on smartboard | Yes (`supabase.auth.getUser()`) | No |
| `/api/classroom/sessions/[id]/start` | POST | Initialize and start classroom presentation session | Yes (`supabase.auth.getUser()`) | No |
| `/api/classroom/sessions/[id]/state` | GET | Poll or stream active slide index and presentation state | **No** (Unauthenticated poll) | No |
| `/api/classroom/sessions/[id]` | GET | Retrieve metadata of a specific classroom session | Yes (`supabase.auth.getUser()`) | Yes (`classroom`, `auth/qr-confirm`) |
| `/api/classroom/sessions` | GET, POST | List recent sessions or start a new smartboard session | Yes (`supabase.auth.getUser()`) | Yes (`classroom`, `dashboard/page`) |
| `/api/curriculum` | GET | Provide NCERT curriculum hierarchy for grades and subjects | **No** (Public NCERT syllabus) | Yes (`dashboard/assessments/create`, `analytics`) |
| `/api/health/live` | GET | Liveness probe for container orchestrator (200 OK) | **No** (Public health probe) | No |
| `/api/health/ready` | GET | Readiness probe verifying DB connectivity and caches | **No** (Public health probe) | No |
| `/api/health` | GET | Basic health check reporting timestamp and uptime | **No** (Public health probe) | Yes (`admin/operations`) |
| `/api/interventions/[id]/approve` | POST | Approve an AI-recommended pedagogical intervention | Yes (`supabase.auth.getUser()`) | No |
| `/api/interventions/[id]/assign` | POST | Assign remedial learning material to students with gaps | Yes (`supabase.auth.getUser()`) | No |
| `/api/interventions/[id]` | GET, PUT | Retrieve or update specific learning gap intervention | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/analytics`) |
| `/api/interventions` | GET, POST | List learning gap interventions across classes | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/analytics`) |
| `/api/media/[id]` | GET, DELETE | Retrieve or delete uploaded media asset | Yes (`supabase.auth.getUser()`) | No |
| `/api/media/process` | POST | Queue media optimization and thumbnail generation | Yes (`supabase.auth.getUser()`) | No |
| `/api/media/upload` | POST | Generate secure pre-signed URL for direct cloud upload | Yes (`supabase.auth.getUser()`) | No |
| `/api/mindmaps/[id]` | GET, PATCH | Fetch or update interactive mind map nodes and edges | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/resources/mindmaps/[id]/edit`) |
| `/api/mindmaps` | GET, POST | List and create visual NCERT chapter mind maps | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/resources/mindmaps/[id]/edit`) |
| `/api/mobile/class-pack/[chapterId]` | GET | Generate compressed offline sync package for mobile | Yes (`supabase.auth.getUser()`) | No |
| `/api/mobile/version-check` | GET | Enforce mobile app minimum version requirements | **No** (Public client check) | No |
| `/api/notifications/[id]/read` | PATCH | Mark an individual teacher notification as read | Yes (`supabase.auth.getUser()`) | No |
| `/api/notifications/devices` | POST, DELETE | Register mobile device FCM push tokens | Yes (`supabase.auth.getUser()`) | No |
| `/api/notifications` | GET, POST, PATCH | List unread alerts and broadcast notifications | Yes (`supabase.auth.getUser()`) | No |
| `/api/presentations/[id]` | GET, PATCH | Fetch or save slide deck data for smartboard viewer | Yes (`supabase.auth.getUser()`) | Yes (`classroom`, `dashboard/resources/...`) |
| `/api/presentations` | GET, POST | List and create 75-inch smartboard presentations | Yes (`supabase.auth.getUser()`) | Yes (`classroom`, `dashboard/resources/...`) |
| `/api/profile` | GET, PATCH | Fetch and update teacher profile details and preferences | Yes (`supabase.auth.getUser()`) | Yes (`student/progress`) |
| `/api/questions` | GET, POST, PATCH | Query NCERT question repository and create questions | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/assessments/create`) |
| `/api/resources/[id]/archive` | POST | Archive curriculum resource | Yes (`supabase.auth.getUser()`) | No |
| `/api/resources/[id]/export` | GET | Export formatted lesson plan or worksheet as PDF | Yes (`supabase.auth.getUser()`) | No |
| `/api/resources/[id]/publish` | POST | Publish resource for school-wide or public access | Yes (`supabase.auth.getUser()`) | No |
| `/api/resources/[id]/restore` | POST | Restore archived resource back to active library | Yes (`supabase.auth.getUser()`) | No |
| `/api/resources/[id]/validate` | POST | Execute automated pedagogy and curriculum rubric check | Yes (`supabase.auth.getUser()`) | No |
| `/api/resources/[id]/versions` | GET | Retrieve immutable snapshot version history of resource | Yes (`supabase.auth.getUser()`) | No |
| `/api/resources/[id]` | GET, PATCH, DELETE | Fetch, update, or delete lesson plan/worksheet resource | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/resources/[id]`) |
| `/api/resources` | GET, POST | List and create educational resources with search/filters | Yes (`supabase.auth.getUser()`) | Yes (`dashboard/resources`, `dashboard/create`) |
| `/api/results/[id]` | GET | Fetch graded assessment result with score breakdown | Yes (`supabase.auth.getUser()`) | Yes (`student/assessments/[id]/result`) |

---

## 5. Supabase & Database Layer Audit

### Sequential List of Migrations and Tables Created

All 13 migrations in `supabase/migrations/` were audited:

| # | Migration File | Tables Created |
| :--- | :--- | :--- |
| 1 | `20260911000001_initial_schema.sql` | `schools`, `profiles`, `school_members`, `grades`, `subjects`, `books`, `chapters`, `concepts`, `questions`, `question_options`, `question_versions`, `classes`, `class_students`, `classroom_devices`, `classroom_sessions`, `remote_actions`, `resources`, `lesson_plans`, `worksheets`, `presentations`, `mind_maps`, `audit_logs` (22 tables) |
| 2 | `20260911000002_rls_policies.sql` | *(No tables)* Enables RLS on all 22 tables; creates helper functions (`get_user_school_id`, `is_school_admin`, `is_teacher`, `is_student`) and security policies. |
| 3 | `20260911000003_indexes_and_triggers.sql` | *(No tables)* Creates performance indexes, gin full-text search indexes, and `updated_at` triggers. |
| 4 | `20260911000004_ai_generation_engine.sql` | `ai_generations`, `ai_usage_tracking` |
| 5 | `20260911000005_classroom_realtime.sql` | `classroom_session_devices`, `classroom_pairings`, `classroom_events` |
| 6 | `20260911000006_assessment_subsystem.sql` | `assessments`, `assessment_questions`, `assignments`, `assessment_attempts`, `attempt_answers`, `assessment_results` |
| 7 | `20260911000007_academic_intelligence.sql` | `student_concept_mastery`, `concept_mastery_history`, `learning_gaps`, `question_metrics` |
| 8 | `20260911000008_saas_billing_and_subscriptions.sql` | `plans`, `subscriptions`, `subscription_events`, `payment_records`, `processed_webhook_events` |
| 9 | `20260911000009_academic_interventions_and_intelligence.sql` | `interventions` |
| 10 | `20260911000010_advanced_content_and_media_pipeline.sql` | `resource_versions`, `resource_usage`, `media_assets`, `media_jobs` |
| 11 | `20260911000011_institutional_scale_and_administration.sql` | `states`, `districts`, `organizations`, `state_members`, `district_members`, `organization_members`, `institutional_settings`, `institutional_invitations`, `daily_school_metrics` |
| 12 | `20260911000012_mobile_offline_and_notifications.sql` | `notifications`, `mobile_devices`, `app_version_configs` |
| 13 | `20260911000013_platform_hardening_and_dead_letters.sql` | `job_dead_letters`, `feature_flags`, `operator_audit_logs` |

---

### Broken Schema Dependencies & Foreign Key Errors

1. **Missing Target Table `ai_resources`:**  
   In Migration 9 (`20260911000009_academic_interventions_and_intelligence.sql`), line 49 defines:  
   ```sql
   resource_id UUID REFERENCES ai_resources(id) ON DELETE SET NULL
   ```  
   **Fact:** The table `ai_resources` is **never created anywhere** in any migration file (the core content table is named `resources`, not `ai_resources`). Running migration 9 on a clean PostgreSQL instance throws:  
   `ERROR: relation "ai_resources" does not exist`.

2. **Incompatible Column Type Mismatch in Migration 10:**  
   In Migration 10 (`20260911000010_advanced_content_and_media_pipeline.sql`), lines 20–21 execute:  
   ```sql
   ALTER TABLE resources ADD COLUMN IF NOT EXISTS grade_id UUID REFERENCES grades(id) ON DELETE SET NULL;
   ALTER TABLE resources ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL;
   ```  
   **Fact:** In Migration 1 (`20260911000001_initial_schema.sql`), `grades.id` and `subjects.id` are defined as `TEXT PRIMARY KEY` (e.g., `'class-10'`, `'science'`). Adding a `UUID` column that references a `TEXT` column causes PostgreSQL to abort with:  
   `ERROR: foreign key constraint cannot be implemented: key columns "grade_id" and "id" are of incompatible types: uuid and text`.

---

### Database Reachability & Migration Status

**Status:** **couldn't verify** which migrations have been applied.

**Reason:**  
1. **Unresolvable Remote Host:** The configured endpoint in `.env.local` is `NEXT_PUBLIC_SUPABASE_URL=https://dmxhxnukjsfrjlbjkwhj.supabase.co`. Performing DNS queries (`nslookup`, `host`, `ping`) on `dmxhxnukjsfrjlbjkwhj.supabase.co` returns `NXDOMAIN` (nonexistent domain). The Supabase project either expired, was deleted, or never existed.
2. **Missing Secrets & Direct Database Credentials:** Neither `DATABASE_URL` nor `SUPABASE_SERVICE_ROLE_KEY` is defined in `.env.local` or environment variables. Only a public anon key is present.
3. **No Local Database Runtime:** The local machine has neither `supabase` CLI nor `docker` installed/running (`supabase not found`, `docker not found`).

---

## 6. Authentication Flow Audit

### Sign-In Flow Trace (OTP, Google, Email)

#### 1. Google OAuth Flow
1. User clicks **"Continue with Google"** on `/login` or `/signup`.
2. The click invokes `handleGoogleLogin()` in `src/app/[locale]/login/page.tsx`:
   - It attempts: `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: ... } })`.
   - Because `dmxhxnukjsfrjlbjkwhj.supabase.co` is unreachable (`NXDOMAIN`), the call fails or times out immediately.
   - The catch block intercepts the failure:
     ```typescript
     if (error) {
       handleSuccessfulAuth("Google Educator");
     }
     ```
   - `handleSuccessfulAuth()` executes:
     ```typescript
     localStorage.setItem("mock_authenticated", "true");
     document.cookie = "ts_auth=true; path=/; max-age=2592000; SameSite=Lax";
     document.cookie = "mock_authenticated=true; path=/; max-age=2592000; SameSite=Lax";
     window.location.href = redirectTo; // default "/dashboard"
     ```
3. The user is redirected to `/dashboard` with mock credentials stored only in their local browser.

#### 2. WhatsApp / SMS OTP Flow
1. User inputs a 10-digit mobile number and submits.
2. `handleSendOtp()` executes:
   - Attempts `supabase.auth.signInWithOtp({ phone: formattedPhone, options: { channel: "whatsapp" } })`.
   - Fails due to unreachable Supabase endpoint.
   - Catch block swallows the error and unconditionally sets `setOtpSent(true)`.
3. User is shown the 6-digit OTP verification screen.
4. User enters **any code** (even `0000`) and submits.
5. `handleVerifyOtp()` executes:
   - Attempts `supabase.auth.verifyOtp(...)`.
   - Returns error or throws exception.
   - Catch / error block swallows the failure:
     ```typescript
     if (error) {
       handleSuccessfulAuth(`Teacher (+91 ${phone.slice(-4)})`);
     }
     ```
6. The user is redirected to `/dashboard` with mock auth cookies set.

#### 3. Email / Password Flow
1. User inputs email and password and submits.
2. `handleEmailLogin()` executes:
   - Does **not** make any network request or call Supabase at all.
   - Executes `setTimeout(() => handleSuccessfulAuth(), 900)`.
3. The user is redirected to `/dashboard` after a 900ms simulated delay.

---

### Local Execution Assessment: Does It Work Locally?

- **Real Supabase Authentication:** **NO.** Fails because `dmxhxnukjsfrjlbjkwhj.supabase.co` does not resolve via DNS (`NXDOMAIN`). No real Supabase session or JWT is ever issued.
- **Simulated / Mock Authentication:** **YES.** The client-side UI falls back to setting `localStorage.getItem("mock_authenticated")` and writing unauthenticated cookies `ts_auth=true` and `mock_authenticated=true`.

---

### Route Protection: Middleware vs Server-Side Checks

#### 1. Next.js Edge Middleware (`src/middleware.ts`)
- **Protected Paths:** Inspects only URLs starting with `/admin` or `/dashboard`.
- **Bypass Vulnerability:** Middleware checks:
  ```typescript
  const hasCookieAuth = request.cookies.get('ts_auth')?.value === 'true' || 
                        request.cookies.get('mock_authenticated')?.value === 'true';
  const hasActiveSession = !!user || hasCookieAuth;
  const devBypass = request.cookies.get('ts_dev_auth')?.value === 'true';

  if (!hasActiveSession && !devBypass) {
    return NextResponse.redirect(loginUrl);
  }
  ```
  Any request containing `Cookie: ts_auth=true` or `Cookie: mock_authenticated=true` or `Cookie: ts_dev_auth=true` bypasses middleware without verifying a cryptographic signature or Supabase session.
- **Unguarded Routes:** The following sensitive or interactive paths are **completely omitted** from middleware route matching and have zero middleware guards:
  - `/classroom` (live smartboard presentation & clicker controls)
  - `/student/*` (student assignments, assessments, and progress records)
  - `/content/*` (NCERT chapter workspace, quizzes, and tests)

#### 2. Server-Side Route Guarding
- **Page Components:** The dashboard and admin pages (`src/app/[locale]/dashboard/page.tsx`, `src/app/[locale]/admin/dashboard/page.tsx`) are marked `"use client"`. They have **no server-side authentication wrappers** or server-side session checks.
- **API Routes:** Nearly all API routes (`/api/*`) independently execute `await supabase.auth.getUser()`. Because the mock user possesses no valid Supabase JWT and the Supabase host is unreachable, **all authenticated API routes reject mock requests with `HTTP 401 Unauthorized`**.

---

## 7. Golden Path: End-to-End Walkthrough

**Scenario Tested:** Can a teacher sign in, open a chapter, run a quiz, and have the result saved in Supabase and still visible after a reload on a different browser?

| Step | Action | Execution Details | Status | Result / Breaking Point |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Teacher Signs In** | User visits `/login`, chooses OTP or Google. Enters phone number. | **PASS (Mock)** / **FAIL (Real)** | **Breaks for real authentication.** Supabase host is `NXDOMAIN`. Frontend catches error and falls back to setting local cookies (`ts_auth=true`) and `localStorage` on the local browser. No user record or session exists in Supabase. |
| **2** | **Open Chapter** | User navigates to `/content/class-10/science/chapter-1`. | **PASS** | Page renders successfully via Static Site Generation (SSG) reading local seed files (`NCERT_SYLLABUS` and `getChapterDetails`). |
| **3** | **Run Quiz** | User navigates to `/content/class-10/science/chapter-1/quiz`. | **PASS** | Quiz page loads questions from static public JSON (`/quizzes/class-10-science-chapter-1.json`). Interactive quiz runs in local component state (`useState`). |
| **4** | **Save Result in Supabase** | User completes final question and clicks **"Finish Quiz"**. | **TOTAL FAILURE** | **Breaks completely:**<br>1. In `src/app/[locale]/content/[grade]/[subject]/[chapter]/quiz/page.tsx`, lines 222–228, clicking "Finish Quiz" simply invokes `handleQuit()`.<br>2. `handleQuit()` displays: `window.confirm("Are you sure you want to quit this quiz? Your current score will not be saved.")` and redirects back to `/content/...`.<br>3. The quick quiz component contains **zero code to call Supabase or any API route**.<br>4. Even on the formal assessment player (`/student/assessments/[id]/attempt`), calls to `/api/assessments/[id]/attempts` fail with `401 Unauthorized` because mock users have no Supabase session and the database host is unreachable. |
| **5** | **Reload on Different Browser** | User opens the site in an incognito window or separate browser and checks dashboard or chapter. | **TOTAL FAILURE** | **Breaks completely:** Zero quiz records, attempt entries, or scores were written to Supabase or any remote database. The second browser has no session, no quiz scores, and no state. |

---

## 8. Summary of Critical Vulnerabilities & Architectural Debt

1. **Unreachable Supabase Project:**  
   `.env.local` references `https://dmxhxnukjsfrjlbjkwhj.supabase.co` which produces `NXDOMAIN`. The application cannot talk to any real database in its current configuration.
2. **Mock Fallback Illusion:**  
   When Supabase fails, the client UI catches exceptions and writes `mock_authenticated` cookies. This allows browsing the UI locally, but causes every real backend API route (`/api/*`) to reject requests with `401 Unauthorized`.
3. **Broken Database Migrations:**  
   - Migration 9 references `ai_resources`, which is never created in any migration.
   - Migration 10 adds `grade_id UUID` and `subject_id UUID` foreign keys referencing `grades(id)` and `subjects(id)`, which are `TEXT PRIMARY KEY` columns.
4. **`adminStore` Persistence Trap:**  
   All content changes, classes, chapters, and questions in the admin panel are stored in browser `sessionStorage` and an in-memory cache. Closing the tab or switching devices wipes all admin edits.
5. **No Quiz Result Persistence:**  
   The NCERT interactive chapter quiz (`/content/.../quiz`) stores score purely in React `useState` and explicitly prompts the teacher that scores will not be saved upon finishing.
6. **Live Production Discrepancy:**  
   The deployed site on Netlify is 48 commits behind local `main` (`c7ee1b1` vs `43927d1`). None of the Phase 11–18 enhancements (design system, co-pilot UX, classroom 5-panel layout) are live on `teacher-sathi.online`.
