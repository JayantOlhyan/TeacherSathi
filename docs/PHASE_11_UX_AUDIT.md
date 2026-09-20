# TEACHERSATHI — PHASE 11: UX AUDIT & EXPERIENCE BASELINE
**Authoritative Product Experience & Human-Centered Usability Audit**
*Date: September 2026 | Version: 1.0.0 | Status: APPROVED BASELINE*

---

## 1. Executive Summary

TeacherSathi is an educational technology platform engineered to empower Indian government school educators teaching NCERT curricula across Classes 6 to 10. Following the technical hardening and backend completion across Phases 1 through 10 (PostgreSQL schemas, server-authoritative assessment engines, realtime WebSocket classroom synchronization, multi-tenant district governance, and mobile offline engines), **Phase 11 establishes the definitive UX and human experience baseline**.

This audit rigorously evaluates the current state of TeacherSathi across 20 distinct user workflows, 75-inch smartboard interaction paradigms, desktop/laptop teacher workspaces, student exam players, and administrative portals. 

### Key Findings at a Glance
1. **The Core Dual-Mode Paradigm is Missing**: While the system has rich backend services, the user interface currently lacks a crisp operational separation between the **Teacher Workspace** (laptop/tablet planning, preparation, and personalization) and the **75-inch Classroom Mode** (large-format, high-contrast, distraction-free classroom presentation and touch interaction).
2. **Navigation Disconnects & Dead Paths (P0)**: The primary dashboard sidebar contains a broken dead link (`/dashboard/settings` returns 404), links the teacher to public marketing pages (`/resources`) instead of the authenticated Resource Studio (`/dashboard/resources`), and hides the primary curriculum directory (`/content`).
3. **Classroom Standalone Disconnect (P0)**: In `/classroom`, starting a lesson requires a mobile QR handshake. A teacher standing directly at a 75-inch interactive flat panel (IFP) without their smartphone or laptop cannot directly launch chapter slides, quizzes, or tools from an on-board touch panel.
4. **Developer Terminology Exposed to Teachers**: Internal architecture artifacts (e.g., *"Phase 6 Production Engine"*, *"Executing Zod schema & educational validation rules"*, *"PostgreSQL Authoritative Sync Active"*, *"Sequence #1000"*) are displayed directly on teacher-facing analytics, generation, and classroom screens.
5. **Bilingual Implementation Gap**: While the landing page offers bilingual copy, over 90% of authenticated teacher workspace screens, classroom controls, analytics dashboards, and error messages are hardcoded in English, creating cognitive friction in Hindi-medium schools.

---

## 2. Product UX Philosophy

The governing product principle of TeacherSathi is:

> **TEACHERSATHI DOES NOT REPLACE THE TEACHER.**  
> **TeacherSathi is a pedagogical assistant.**  
> **The teacher remains the primary decision-maker in the classroom.**  
> **The product must make the teacher feel MORE capable, not less necessary.**

### UX Tenets:
* **Teacher in the Driver's Seat**: AI never presents to students autonomously; it equips the teacher with structured curriculum slides, interactive prompts, and diagnostic insights.
* **3-Second Comprehension**: An educator entering a room between periods should understand any screen's purpose within 3 seconds.
* **Classroom Distance Readability**: Important presentation content must be legible from 7 to 10 meters away by students in back benches.
* **Touch-First for 75" Smartboards**: Touch targets on interactive displays must be at least 56px–72px to accommodate fingertip and optical stylus inputs with low precision.
* **Graceful Degradation**: Software must operate flawlessly under unstable classroom Wi-Fi and power fluctuations common in Indian tier-2/3 government schools.

---

## 3. User Types Audited

| User Persona | Weight | Context & Hardware | Primary UX Need |
| :--- | :---: | :--- | :--- |
| **A. Teacher (Primary)** | **40%** | Laptop, school PC, or budget Android phone; preparing before class or during free periods | Speed of preparation, zero redundant typing, instant NCERT alignment, confidence in materials. |
| **B. 75" Classroom User** | **25%** | Teacher standing directly in front of a 75-inch interactive touch screen (IFP / Smartboard) | Large touch targets, immediate slide/quiz/whiteboard switching, zero visual clutter, no small menus. |
| **C. Student in Classroom** | **15%** | Viewing the 75-inch screen from 3 to 10 meters away in natural classroom lighting | High visual contrast, large typography, uncluttered layouts, clear visual diagrams. |
| **D. Student (Individual)** | **10%** | Budget mobile device or school computer lab taking assessments | Clear timers, obvious autosave indicators, single-tap answer selection, zero exam anxiety. |
| **E. First-Time Teacher** | **5%** | First session on TeacherSathi, skeptical of complex SaaS software | Immediate "aha" moment in under 60 seconds; no mandatory training or setup required. |
| **F. School Administrator** | **5%** | Desktop browser monitoring school adoption, roster, and compliance | Clear aggregate summaries without invading teacher classroom autonomy. |

---

## 4. Current User Journeys

### Journey Map: The Everyday Educator Lifecycle
```
[1. Discover/Login] ──> [2. Dashboard Workspace] ──> [3. Select Chapter] ──> [4. Prepare Materials]
        │                                                                             │
        ▼                                                                             ▼
[8. Close Interventions] <── [7. Review Diagnostic] <── [6. Run Quiz] <── [5. Launch 75" Smartboard]
```

### Observed Discrepancies in Current Journey
1. **Between Step 2 and Step 3**: The teacher lands on `/dashboard`, but there is no syllabus selector. Clicking "My Lessons" redirects to `/dashboard/classes` (a student roster page), completely bypassing the chapter curriculum tree.
2. **Between Step 4 and Step 5**: In the chapter workspace (`/content/[grade]/[subject]/[chapter]`), clicking "Smart Classroom PPT" opens a 3-slide static modal rather than initializing the live `/classroom` presentation session.
3. **Between Step 5 and Step 6**: The 75" classroom viewer does not show the quiz trigger unless the teacher opens a separate controller tab or mobile phone to press "Launch Quiz".

---

## 5. Navigation Audit

### Information Architecture Map
```
/ (Landing Page - Public)
├── /login & /signup (Auth)
├── /pricing (Public SaaS)
├── /content (Redirects to /content/class-8)
│   ├── /[grade] (Class Content Hub)
│   │   └── /[subject] (Subject Directory)
│   │       └── /[chapter] (Chapter Workspace - Public/SEO layout)
│   │           ├── /video
│   │           ├── /quiz
│   │           └── /test
├── /classroom (75" IFP Kiosk Display)
└── /dashboard (Authenticated Shell with Sidebar & Header)
    ├── /classes (Student Roster & Clicker Pairing — Misnamed "My Lessons")
    ├── /assessments (Teacher Assessment Hub)
    │   ├── /create (Assessment Authoring)
    │   └── /[id]/results (Class Assessment Performance)
    ├── /analytics (Diagnostic Mastery & Intervention Hub)
    ├── /admin/billing (School Admin Billing)
    ├── /resources (Dead link: Sidebar points to public /resources, not /dashboard/resources)
    │   ├── /dashboard/resources (Actual Resource Studio — Hidden from Sidebar)
    │   │   ├── /[id] (Resource Detail)
    │   │   ├── /presentations/[id]/edit (Presentation Studio)
    │   │   └── /mindmaps/[id]/edit (Mind Map Studio)
    ├── /whiteboard (Whiteboard Canvas — Hidden from Sidebar)
    ├── /create (AI Generation Wizard)
    ├── /settings (BROKEN 404 in Sidebar)
    └── /admin/institutional (District Admin Portal in Teacher Sidebar)
```

### Navigation Friction Analysis
* **Confusing Labels**:
  * `"My Lessons"` in `Sidebar.tsx` links to `/dashboard/classes` (which is student roster management, not lesson plans or curriculum).
  * `"Resources"` in `Sidebar.tsx` links to `/resources` (public SEO marketing landing page) instead of `/dashboard/resources` (authenticated studio).
* **Duplicate & Hidden Destinations**:
  * `/dashboard/resources` (Teacher Studio) exists with rich editing capabilities, but is completely absent from the sidebar.
  * `/dashboard/whiteboard` exists with Excalidraw, but has no entry point in the sidebar.
* **Dead Ends & 404s**:
  * Clicking `"Settings"` in `Sidebar.tsx` navigates to `/dashboard/settings`, which returns a 404 Not Found.
* **Misplaced Administrative Clutter**:
  * `"Institutions"` (`/admin/institutional`) and `"Billing"` (`/dashboard/admin/billing`) occupy positions 2 and 5 in the teacher's primary sidebar, cluttering the view of a classroom teacher who has no administrative permissions.

---

## 6. Workflow Audit (Workflows 1 to 20)

### WORKFLOW 1: Landing → Understand TeacherSathi
* **Path**: `/` (Landing Page)
* **Goal**: Teacher understands what TeacherSathi does within 3 seconds.
* **Observations**: Hero banner focuses heavily on SEO keywords ("NCERT AI Lesson Plan Generator & CBSE Worksheet Creator"). The interactive workspace demo (`InteractiveHeroWorkspace`) shows sample cards, but the primary tagline emphasizes automated content generation over classroom teaching assistance.
* **Clarity Rating**: **NEEDS IMPROVEMENT** (Emphasizes generation rather than classroom delivery).

### WORKFLOW 2: Landing → Authentication
* **Path**: `/` → Click "Generate Free NCERT Lesson Kit Now" / "Login" → `/login` or `/signup`
* **Observations**: Three auth options are presented: Mobile OTP, Email/Password, and Google OAuth, plus Smartboard QR. This provides excellent flexibility for Indian teachers who prefer mobile OTP.
* **Clarity Rating**: **GOOD**

### WORKFLOW 3: Authentication → Teacher Dashboard
* **Path**: `/login` → Auth success → `/dashboard`
* **Observations**: Dashboard loads with a greeting ("Good day, Teacher! 👋"), a smartboard QR button, a "Create with AI" button, and a mysterious red "Silence Bell" button.
* **Friction**: The top card presents three competing actions of equal visual weight.
* **Clarity Rating**: **NEEDS IMPROVEMENT**

### WORKFLOW 4: Dashboard → Class Selection
* **Path**: `/dashboard` → Click "Manage Classes" or "My Lessons"
* **Observations**: Lands on `/dashboard/classes`. Instead of seeing curriculum or classes to teach, the user sees a roster table with 24 dummy students and an "Export CSV" button.
* **Friction**: Teacher cannot select a grade to teach from here.
* **Clarity Rating**: **PROBLEMATIC**

### WORKFLOW 5: Class → Subject Selection
* **Path**: `/content` → Redirects to `/content/class-8` → Click subject icon (Science, Math, etc.)
* **Observations**: Visually attractive subject cards with colored badges and icons. Subject change expands an accordion/grid below.
* **Clarity Rating**: **GOOD**

### WORKFLOW 6: Subject → Chapter Selection
* **Path**: `/content/class-8` → Select Science → Chapter list appears → Click "Open Chapter"
* **Observations**: Lists all NCERT chapters with English and Hindi titles, chapter numbers, and descriptions. Search bar enables quick filtering.
* **Clarity Rating**: **GOOD**

### WORKFLOW 7: Chapter → Resource Selection
* **Path**: `/content/class-8/science/chapter-1`
* **Observations**: Chapter Hub presents three columns: "TEACH" (Smart Classroom PPT, Concept Mind Map, Video), "ASSESS" (Formative Quiz, Chapter Test, Worksheet), "PLAN" (AI Lesson Plan).
* **Friction**: The page layout is designed like an SEO content page with a Table of Contents sidebar and FAQ schema, rather than an operational teacher workspace.
* **Clarity Rating**: **NEEDS IMPROVEMENT**

### WORKFLOW 8: Resource → Teaching Preparation
* **Path**: Chapter Hub → Click "Smart Classroom PPT"
* **Observations**: Triggers a local modal with 3 generic static slides. Does not load the full presentation from the database, nor does it allow the teacher to edit or review slides before class.
* **Clarity Rating**: **PROBLEMATIC**

### WORKFLOW 9: Teaching → Launch Classroom
* **Path**: Chapter Hub or Dashboard → Navigate to `/classroom`
* **Observations**: Displays a waiting/pairing screen with a 5-minute expiring QR code and countdown bar. Prompts the teacher to scan with their phone.
* **Friction**: If the teacher is already logged in on the smartboard browser, requiring a second device creates unnecessary setup delay during a 40-minute class period.
* **Clarity Rating**: **PROBLEMATIC**

### WORKFLOW 10: Classroom → 75-inch Presentation
* **Path**: `/classroom` (Session Active) → Live Presentation Mode
* **Observations**: Renders slides via `SmartboardSlideViewer`. Titles are large and readable. However, the surrounding UI chrome is dark green and text labels are small.
* **Clarity Rating**: **NEEDS IMPROVEMENT**

### WORKFLOW 11: Teacher Controls → Next / Previous Slide
* **Path**: `/classroom` (on Smartboard) or `/dashboard` (on Controller Panel)
* **Observations**:
  * On `/classroom`: Previous and Next buttons are at the bottom of the slide.
  * On `/dashboard`: Control panel provides Previous / Next slide buttons with slide counter.
* **Friction**: On the 75-inch screen, buttons are standard desktop sized (44px) rather than large tactile targets (64px–80px) suitable for arms-length tapping.
* **Clarity Rating**: **NEEDS IMPROVEMENT**

### WORKFLOW 12: Teacher Controls → Launch Quiz
* **Path**: Controller Panel → Click "Launch Quiz onto Smartboard"
* **Observations**: Instantly updates `/classroom` via Supabase Realtime to display a 4-option formative MCQ.
* **Clarity Rating**: **GOOD** (Technically robust, but missing integrated trigger on smartboard).

### WORKFLOW 13: Teacher Controls → Whiteboard
* **Path**: Controller Panel → Switch Tab to Whiteboard / Lock Board
* **Observations**: Canvas loads Excalidraw. Teacher can draw or lock the board for explanation.
* **Friction**: Excalidraw's default desktop tool palette is too small for touch interaction on an interactive smartboard.
* **Clarity Rating**: **NEEDS IMPROVEMENT**

### WORKFLOW 14: Teacher → Ask Saathi Genie
* **Path**: Dashboard → Click "Ask Saathi Genie" → Chat drawer slides out
* **Observations**: Teacher types prompt (or uses default suggestions). Server streams pedagogical advice aligned with NCERT chapters.
* **Clarity Rating**: **GOOD**

### WORKFLOW 15: Student Quiz → Submission
* **Path**: `/student/assessments/[id]/attempt`
* **Observations**: Full-screen student exam player with timer countdown, autosave, option radio cards, question navigation grid, and submit confirmation modal.
* **Clarity Rating**: **GOOD**

### WORKFLOW 16: Submission → Instant Grading & Results
* **Path**: `/student/assessments/[id]/result`
* **Observations**: Displays score, percentage, mastery level badge, and itemized review with explanations.
* **Clarity Rating**: **GOOD**

### WORKFLOW 17: Results → Learning Insight
* **Path**: `/dashboard/assessments/[id]/results`
* **Observations**: Class average, pass rate, score distribution, question discrimination index, and common wrong answers.
* **Clarity Rating**: **GOOD**

### WORKFLOW 18: Learning Gap → AI Intervention
* **Path**: `/dashboard/analytics` → Top Gaps → Click "Generate Remediation"
* **Observations**: Generates a 15-minute micro-remediation plan with visual anchors, misconception teardowns, and diagnostic re-check questions.
* **Friction**: Screen is dense with technical badges ("Phase 6 Production Engine", "Evidence Confidence: High").
* **Clarity Rating**: **NEEDS IMPROVEMENT**

### WORKFLOW 19: Teacher Returns to Dashboard
* **Path**: Any view → Click "Dashboard" in sidebar or logo
* **Observations**: Returns to `/dashboard`. Active session remains docked if running.
* **Clarity Rating**: **GOOD**

### WORKFLOW 20: Returning Teacher Starts Another Class
* **Path**: `/dashboard` → Look for quick class switcher
* **Observations**: No quick "Switch Class / Grade" dropdown in the global header. The teacher must re-navigate through the full curriculum tree or classes table.
* **Clarity Rating**: **NEEDS IMPROVEMENT**

---

## 7. Click / Interaction Audit

| Workflow | Current Path | Screens | Clicks | Inputs | Decisions | Friction & Cognitive Hurdles | Recommended Target Phase |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **Start Class 8 Science Presentation** | Dashboard → (Search for syllabus) → Type URL or find landing → Class 8 → Science → Ch 1 → Smart PPT | 4 | 7–9 | 0 | 4 | No direct curriculum selector on Dashboard; chapter Smart PPT opens static modal instead of live kiosk. | **Phase 13 / 15** |
| **Launch 75" Smartboard Presentation** | Dashboard → Smartboard QR Auth → Scan on phone or click test link → /classroom → Start Presentation | 3 | 5 | 0 | 3 | Mandatory pairing screen blocks immediate classroom start if teacher only has the smartboard. | **Phase 15** |
| **Create Formative Assessment** | Dashboard → Create Assessment → Select Grade → Subject → Chapter → Difficulty → Count → Submit | 3 | 8 | 4 | 5 | Multi-step form asks for redundant metadata if launched from chapter; internal technical generation logs shown. | **Phase 14 / 17** |
| **Assign Quiz to Class** | Assessments → Click Assign → Select Class → Set Due Date → Confirm | 2 | 4 | 1 | 2 | Uses native browser `alert()` upon completion; date picker formatting lacks guidance. | **Phase 17** |
| **Trigger 1-Click Remediation** | Dashboard → Analytics → Find Weak Concept → Generate Remediation → Approve Plan → Provision Reassessment | 3 | 6 | 0 | 3 | Deeply buried under dense analytical tables; requires understanding statistical confidence ratings. | **Phase 13 / 16** |

---

## 8. Cognitive Load Audit

### What does the teacher need to remember?
* **Current Software Burden**:
  1. The teacher must remember where the curriculum library is located because it is missing from the sidebar.
  2. The teacher must remember to bring their mobile phone to class to scan the QR code just to control the 75-inch smartboard.
  3. The teacher must remember the difference between `/resources` (marketing), `/dashboard/resources` (editor), and `/content` (chapter hub).
  4. The teacher must decipher technical badges like *"PostgreSQL Authoritative Sync Active"*, *"65/35 Decay Score"*, and *"Sequence #1000"*.

### Choice Overload on Primary Screens
* **Dashboard Header**: Presents "Smartboard 75\" QR Auth", "Create with AI", and "Silence Bell" all at once, followed by 5 brightly colored gradient action cards ("Create Assessment", "Create Quiz", "Create PPT", "Create Test", "Create Lesson Plan"), followed by "Ask Saathi Genie" banner. There is no clear single primary call-to-action (e.g., *"Start Today's Lesson"*).

---

## 9. Visual Hierarchy Audit

| Screen | Element | Observed Problem | Why It Matters | Severity | Recommended Direction |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Dashboard** | Top Banner | Three competing buttons ("QR Auth", "Create with AI", "Silence Bell") of equal weight. | Teacher hesitates; no obvious primary action for starting the day's class. | **P1** | Establish a single primary CTA: "Start Today's Class" with secondary utilities docked neatly. |
| **Dashboard** | Silence Bell | Loud red button labeled "Silence Bell" that actually makes synthesizer beep sounds. | Misleading label; confusing purpose for new teachers. | **P2** | Rename to "Attention Chime" or move to classroom utility drawer. |
| **Chapter Hub** | Page Layout | Structured like an SEO article with Table of Contents and FAQ accordion. | Feels like a blog post rather than an operational teaching workspace. | **P1** | Convert into a dedicated Teacher Workspace (as shown in User Reference Images 2 & 4). |
| **Classroom Kiosk** | Top Header | High density of small pills: "75\" IFP Kiosk", "Room 102", "Session ID", "Auth Verified". | Wastes vertical space on hardware metadata rather than maximizing slide presentation area. | **P2** | Collapse technical pills into a subtle indicator; prioritize presentation canvas. |
| **Analytics Hub** | Matrix Tables | Overwhelming volume of data tables, standard deviations, and confidence badges. | Cognitive fatigue; teachers want to know "Who needs help today and what do I teach them?" | **P1** | Introduce progressive disclosure: 3 top priority gaps first, deep statistical matrix in collapsible drawer. |

---

## 10. 75-Inch Classroom Audit (Detailed Hardware Evaluation)

TeacherSathi is designed to run on interactive flat panels (e.g., ViewSonic, BenQ, Promethean, Samsung Flip, MAXHUB) standard in Indian smart classrooms.

### Comparison: Codebase vs. Reference Images
* **Reference Image 1 (`media_1790109695760.jpg`)**:
  * Shows a teacher standing at the board touching a large, clear **"Teacher Controls"** sidebar directly on the 75-inch screen.
  * Controls include: Next Slide (Blue), Previous Slide (Slate), Start Quiz (Purple), Open Whiteboard (Green), Resources (Orange), Ask Saathi (Teal).
  * Includes a contextual **"Teaching Tip from Saathi"** to assist the teacher's lesson flow.
  * *Codebase Reality*: The current `/classroom` kiosk has NO on-screen Teacher Controls drawer! The controls only exist inside `ClassroomControlPanel.tsx` on the desktop `/dashboard`.
* **Reference Images 2, 4, 5 (`media_1790109695767.jpg`, `media_1790109695784.jpg`)**:
  * Shows clear **Dual Workflow**:
    1. **Teacher Workspace (Laptop/Desktop)**: Plan, Prepare, Personalize with 4 core cards (Lesson Slides, Worksheet, Quiz, Mind Map) and "Start Class" button.
    2. **Classroom Mode (75-inch Display)**: Content first, high contrast, clean diagrams, minimal bottom dock ([Menu] [<] [Slide 4/12] [>] [Whiteboard] [Quiz] [Resources] [End Class]).
  * *Codebase Reality*: The current `/content/[grade]/[subject]/[chapter]` page does not mirror the laptop workspace, and `/classroom` lacks the integrated bottom touch bar.

### Viewing Distance & Readability Analysis

| Viewport Resolution | Distance | Element | Current Implementation | Classroom Usability Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **1920 × 1080 (1080p)** | 1.0 m (Teacher) | Slide Navigation Buttons | `px-6 py-3 text-sm` | **NEEDS IMPROVEMENT**: Functional, but easy to miss-tap during energetic teaching. |
| **1920 × 1080 (1080p)** | 6.0 m (Student) | Slide Main Heading | `text-4xl sm:text-6xl font-black` | **GOOD**: High legibility across the room. |
| **1920 × 1080 (1080p)** | 6.0 m (Student) | Slide Body Bullets | `text-lg sm:text-2xl text-emerald-100` | **ACCEPTABLE**: Legible, but contrast against dark green requires maximum display brightness. |
| **1920 × 1080 (1080p)** | 8.0 m (Back Row) | Subtitles & Captions | `text-xs sm:text-sm` (12px–14px) | **PROBLEMATIC**: Completely invisible from the back benches. |
| **3840 × 2160 (4K UHD)** | 1.0 m (Teacher) | Unscaled Touch Controls | Fixed pixel paddings without rem scaling | **PROBLEMATIC**: Controls shrink to miniature sizes on native 4K display drivers. |

### Accidental Touch & Palm Rejection
On large IR touch frames, teachers frequently rest their palm against the glass while gesturing or writing. The current implementation does not disable text selection or context menus globally on touch events, causing accidental text highlighting or browser context popups.

---

## 11. Teacher-Assistant Positioning Audit

TeacherSathi must embody:  
**TEACHER = DECISION MAKER**  
**TEACHERSATHI = ASSISTANT**

### Language & Interaction Review
* **Positive Patterns Found**:
  * Saathi Genie chat prompt states: *"नमस्ते! I am Saathi Genie. Ask me anything about NCERT chapters, early literacy, lesson planning..."* — positioned as a helpful companion.
  * Assessment builder requires explicit teacher review before publishing.
  * Interventions generate draft plans that require teacher approval before provisioning.
* **Negative Patterns Flagged**:
  * Marketing copy on Landing Page: *"Teachers ka Superpower. NCERT-Aligned AI Content — Instantly. Stop spending hours making resources."* — slightly skews toward automated replacement of preparation.
  * AI Generation Milestones: *"AI Provider generating structured JSON content... Executing Zod schema rules..."* — sounds like a technical machine rather than an assistant helping a human.
  * Recommended Direction: Ensure all AI copy frames output as suggestions: *"Suggested Lesson Flow"*, *"Classroom Discussion Spark"*, *"Recommended Check"*.

---

## 12. Saathi / AI Assistant UX Audit

* **Drawer Implementation**: The Saathi Genie drawer is fast, accessible, and responsive.
* **Context Awareness**: When opened from `/dashboard`, it defaults to Class 8 Science Chapter 10. It does not dynamically adopt the context of the active chapter if opened from the chapter workspace.
* **Classroom Availability**: Saathi Genie is not directly accessible from the 75-inch smartboard presentation screen (unlike Reference Image 1, where "Ask Saathi" is a primary button on the touch controls).

---

## 13. Error, Empty, and Loading State Audit

| Boundary | Current UX Behavior | User Clarity | Recovery Path |
| :--- | :--- | :---: | :--- |
| **Network Disconnection in Classroom** | Yellow banner: *"Classroom network interrupted. Reconnecting and syncing state..."* | **GOOD** | Automatic reconnection via WebSocket retry loop. |
| **AI Generation Failure** | Red alert card inside creation wizard with error string. | **NEEDS IMPROVEMENT** | Teacher must manually click back and retry the entire wizard. |
| **Empty Class Diagnostics** | Gray panel: *"No assessment evidence recorded yet. Assign assessments to view diagnostics."* | **GOOD** | Clear instruction on what to do next. |
| **Failed Session Handshake** | Kiosk displays infinite spinner if session ID is invalid. | **PROBLEMATIC** | No "Try Again" or "Return to Kiosk Setup" button. |
| **404 Not Found Page** | Custom bilingual 404 page with "Back to Home" button. | **GOOD** | Clean recovery. |

---

## 14. Mobile / Tablet Audit

* **Teacher Mobile Experience**:
  * Login, dashboard overview, and quiz grading work on responsive mobile viewports (375px–414px).
  * Control panel (`ClassroomControlPanel`) works as a mobile remote control for the 75-inch smartboard.
* **Friction Points**:
  * The dashboard header buttons stack vertically on mobile, taking up the entire first fold of the screen.
  * Navigation sidebar drawer closes correctly on item tap, but the top bar logo and user pill overlap on very narrow viewports (<360px).

---

## 15. Bilingual UX Audit (English & Hindi)

* **Coverage Breakdown**:
  * Landing page, Login, Signup, Pricing, Footer: **100% Translated** via `messages/en.json` and `messages/hi.json`.
  * Dashboard, Sidebar, Header: **~15% Translated** (Most labels hardcoded English).
  * 75" Smartboard Presentation Kiosk: **~20% Translated** (Slide titles have Hindi, but all UI chrome is English).
  * Assessment Player & Diagnostic Matrix: **0% Translated** (Entirely hardcoded English).
* **Text Expansion Issues**:
  * Hindi Devanagari text typically requires 15%–25% more horizontal width and slightly greater line-height. Several buttons in the header have fixed widths that clip Hindi strings.

---

## 16. Accessibility Audit (a11y)

* **Color Contrast**:
  * Dark theme smartboard text (`#10B981` on `#0B1E13`) achieves a contrast ratio of 7.2:1 (passes WCAG AAA).
  * Light theme dashboard text (`#14532D` on `#F8FAF8`) achieves 8.4:1 (passes WCAG AAA).
  * Warning badges (`text-amber-300` on white) fail minimum 4.5:1 contrast on some cards.
* **Touch Target Sizing**:
  * Standard buttons on desktop are 38px–42px (below the recommended 48px touch minimum for mobile and 64px minimum for 75" smartboards).
* **Keyboard Navigation**:
  * Form inputs on `/login` and `/dashboard/create` have visible focus rings.
  * Slide viewer in `/classroom` does not listen to arrow keys unless the button is explicitly focused.

---

## 17. Perceived Performance Audit

* **Transitions**: Page transitions are fast with zero layout shift on static routes.
* **AI Generation Wait Time**: Takes 8–15 seconds to synthesize full lesson plans or worksheets. The multi-step milestone ticker ("Resolving curriculum...", "Generating JSON...") helps reduce perceived wait time, but needs pedagogical rather than technical wording.
* **Classroom Sync**: WebSocket state sync between controller and 75" smartboard operates in <100ms, creating an instantaneous, delightful remote-control sensation.

---

## 18. Competitive UX References

| Dimension | Observed in TeacherSathi | External Benchmark (Nearpod / ClassPoint / Google Classroom) |
| :--- | :--- | :--- |
| **Presentation Mode** | Dual route (`/classroom` vs `/dashboard`), requiring separate pairing. | Seamless single-click "Start Presentation" directly from lesson plan view. |
| **In-Class Controls** | Split between mobile remote and bottom buttons. | Floating, dockable toolbar on the interactive whiteboard with large icons. |
| **Whiteboard Access** | Standalone tool or separate tab in classroom. | One-tap overlay whiteboard that draws directly over current slides. |
| **Formative Quizzing** | Triggered via remote control; shows 4 options on screen. | Visual live bar chart showing anonymous student participation in real time. |

---

## 19. P0 Issues (Critical Task Blockers)

1. **UX-001 (P0)**: Dead Link 404 in Dashboard Sidebar (`/dashboard/settings`).
2. **UX-002 (P0)**: Broken Curriculum Discovery from Dashboard (No path to NCERT chapters from main sidebar).
3. **UX-003 (P0)**: Disconnected Chapter Smart PPT (Opens 3-slide mock modal instead of live classroom kiosk).
4. **UX-004 (P0)**: Smartboard Standalone Usability Failure (Kiosk requires phone QR pairing; no on-board start).
5. **UX-005 (P0)**: Resource Library Navigation Disconnect (Sidebar links to public marketing page `/resources` instead of `/dashboard/resources`).

---

## 20. P1 Issues (High Friction)

6. **UX-006 (P1)**: Institutional Admin & Billing Clutter in Primary Teacher Sidebar.
7. **UX-007 (P1)**: Missing Hindi Localization in Core Product Experiences.
8. **UX-008 (P1)**: Technical / Developer Jargon Exposed to Educators.
9. **UX-009 (P1)**: Classroom Distance Legibility Gap on 75" Displays (Subtext < 16px).
10. **UX-010 (P1)**: Disruptive Native Browser `alert()` and `confirm()` Dialogs.
11. **UX-011 (P1)**: Whiteboard Touch Targets & Classroom Usability.
12. **UX-012 (P1)**: Confusing "Silence Bell" Label and Synthesizer Sound.
13. **UX-013 (P1)**: Absence of Dual-Screen "Teacher Workspace vs Classroom Mode" Paradigm.
14. **UX-014 (P1)**: No Student-Facing Back Navigation in Assessment Player.

---

## 21. P2 Issues (Medium Consistency & Usability)

15. **UX-015 (P2)**: Misleading Mock Content Mixed with Real DB Records on Dashboard.
16. **UX-016 (P2)**: Inconsistent Back Paths & Missing Breadcrumbs in Studios.
17. **UX-017 (P2)**: Cognitive Overload on Analytics Dashboard.
18. **UX-018 (P2)**: Hardcoded Class 10A Default on Classes Page.
19. **UX-019 (P2)**: Hidden Whiteboard in Dashboard Navigation.
20. **UX-020 (P2)**: Redundant Input on AI Creation Wizard.
21. **UX-021 (P2)**: Contrast and Glare Issues with Dark Background on 75" Kiosk.
22. **UX-022 (P2)**: Mobile Navigation Overflow and Header Stacking.

---

## 22. P3 Issues (Low Polish)

23. **UX-023 (P3)**: Inconsistent Button Border Radii across views.
24. **UX-024 (P3)**: Inconsistent Icon Stroke Widths.
25. **UX-025 (P3)**: Missing Global Keyboard Arrow Navigation for Smartboard Slides.
26. **UX-026 (P3)**: Redundant Role Toggle on Login Screen.
27. **UX-027 (P3)**: Sub-optimal Loading Skeleton Timers.

---

## 23. Quick Wins (Low-Effort, High-Impact Improvements)

1. **Fix Sidebar Links**: Repoint `"Resources"` to `/dashboard/resources`, add `"Whiteboard"` to sidebar, and hook `"Settings"` to open the existing profile modal.
2. **Rename "Silence Bell"**: Change label to "Attention Chime" with a clear bell chime audio icon.
3. **Hide Admin Items for Regular Teachers**: Conditionally hide "Institutions" and "Billing" unless user has `ADMIN` role.
4. **Bind Arrow Keys on Kiosk**: Add window event listeners for ArrowLeft / ArrowRight to advance slides without clicking.
5. **Clean Generation Milestones**: Replace technical Zod schema messages with encouraging pedagogical copy ("Preparing curriculum notes...", "Formatting classroom quiz...").

---

## 24. Structural Problems

1. **Information Architecture Split**: The application is currently split between public SEO routes (`/content/[grade]/[subject]/[chapter]`) and authenticated dashboard routes (`/dashboard/*`). Educators preparing a lesson need a unified **Teacher Workspace**.
2. **Classroom Display Isolation**: The 75" smartboard interface (`/classroom`) assumes it is only a dumb display controlled by a phone. In real government schools, teachers often only have the smartboard PC and must be able to drive the class entirely from the touch screen.

---

## 25. Recommended Phase 12–18 Work Mapping

| Phase | Title | Core UX Scope Addressed |
| :--- | :--- | :--- |
| **Phase 12** | **Design System & Visual Consistency** | Standardize button hierarchy, border radii, color contrast, typography tokens, touch-target standards (64px minimum for smartboard), and Devanagari Hindi font rendering. |
| **Phase 13** | **Teacher Workspace** | Unify Dashboard, Classes, and Chapter Hub into a cohesive "Plan • Prepare • Personalize" workspace (as shown in User Reference Images 2 & 4). Clean sidebar navigation. |
| **Phase 14** | **Resource Experience & Studio** | Connect Chapter Workspace directly to Resource Studio. Eliminate static mock modals; enable direct editing, PDF/HTML exports, and presentation launching. |
| **Phase 15** | **75-Inch Smartboard Classroom** | Build the native 75" Touch Control Panel (as shown in User Reference Image 1) directly into `/classroom`. Implement minimal bottom dock, high-contrast light/dark themes, and quick on-board start. |
| **Phase 16** | **Saathi Pedagogical Assistant** | Embed contextual "Teaching Tips from Saathi" into smartboard slides and lesson plans. Frame Saathi as a supportive co-teacher rather than automated AI. |
| **Phase 17** | **Assessment & Diagnostic Intelligence** | Simplify teacher assessment creation, replace browser alerts with modern toast modals, and streamline the diagnostic gap matrix into actionable teaching steps. |
| **Phase 18** | **Reliability, Accessibility & Exhibition Polish** | Implement full bilingual localization across 100% of routes, a11y focus states, palm rejection, and kiosk exhibition lock for live smartboard demos. |

---

## 26. Evidence & Reference Visualizations

### Audit Evidence from User Reference Images
1. **Reference Image 1 (`media_1790109695760.jpg`)**:
   * *Observed Pattern*: Large-format touch controls docked on the right side of the 75-inch smartboard (Next Slide, Previous Slide, Start Quiz, Open Whiteboard, Resources, Ask Saathi).
   * *Target UX*: Teachers standing at the board must have immediate tactile access to primary lesson controls without looking down at a laptop or phone.
2. **Reference Images 2, 4, 5 (`media_1790109695767.jpg`, `media_1790109695784.jpg`)**:
   * *Observed Pattern*: Dual workflow comparison:
     * **Top**: Laptop screen running "Teacher Workspace: Plan. Prepare. Personalise."
     * **Bottom**: 75-inch Smartboard in "Classroom Mode: Teach. Engage. Assess."
   * *Target UX*: Clear mental model separation between preparation on desktop and presentation in classroom.

---

## 27. Final UX Baseline Matrix

| Dimension | Rating | Baseline Findings & Context |
| :--- | :---: | :--- |
| **Discoverability** | **NEEDS IMPROVEMENT** | Core curriculum and resource studios exist but are obscured by misplaced admin links and broken sidebar paths. |
| **Task Efficiency** | **NEEDS IMPROVEMENT** | Launching a live classroom presentation requires too many intermediate steps and cross-device handshakes. |
| **Navigation Clarity** | **PROBLEMATIC** | Presence of dead link (`/dashboard/settings`), mislabeled items ("My Lessons" → student roster), and missing syllabus paths. |
| **Visual Hierarchy** | **NEEDS IMPROVEMENT** | Competing buttons on dashboard header; high data density on analytics screens without progressive disclosure. |
| **Classroom Usability (75")**| **PROBLEMATIC** | Kiosk cannot be operated standalone from the touch screen without a paired controller; controls lack 64px touch targets. |
| **Teacher Control** | **GOOD** | AI generations require teacher review; assessments require teacher publishing; teacher maintains final pedagogical authority. |
| **Error Recovery** | **NEEDS IMPROVEMENT** | Realtime reconnection banner is excellent, but AI and form errors use disruptive native browser `alert()` popups. |
| **Accessibility** | **NEEDS IMPROVEMENT** | High contrast on slide titles, but subtext fails classroom-distance legibility; buttons lack consistent minimum touch bounds. |
| **Consistency** | **NEEDS IMPROVEMENT** | Inconsistent border radii, varying button styles, and disparate layouts between public chapter pages and authenticated dashboard. |
| **Perceived Performance** | **GOOD** | Fast page loads, instant WebSocket classroom updates (<100ms), and informative milestone animations during AI creation. |

---
*End of Phase 11 UX Audit Specification.*
