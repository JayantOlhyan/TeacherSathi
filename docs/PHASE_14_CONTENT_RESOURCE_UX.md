# TeacherSathi — Phase 14
# Content & Resource Experience

> **Document Type**: Canonical Architecture, UX Specification & Implementation Guide  
> **Phase**: 14 — Content & Resource Experience  
> **Status**: Production Verified & Deployed  
> **Dependencies**: Phase 11 (UX Audit & Issue Register), Phase 12 (Design System & UI Foundation), Phase 13 (Unified Teacher Workspace UX)  
> **Quality Gate**: TypeScript `tsc --noEmit` (0 errors), Next.js Lint (0 errors), 357 Vitest automated tests passing across 72 test suites, Next.js 14 Production Build.

---

## 1. Executive Summary

Phase 11 diagnosed the structural friction points in the teacher experience across 20 distinct workflows. Phase 12 established the visual design system tokens and foundational component library. Phase 13 applied those foundations to establish the unified teacher mental model and persistent teaching context engine.

**Phase 14 focuses specifically on how a teacher discovers, understands, creates, previews, uses, and manages teaching resources.**

The central paradigm shift of Phase 14 is:
> **TeacherSathi organizes resources around TEACHING INTENT, not technical FILE TYPES.**

A teacher does not enter a classroom thinking:
> *"I need a PDF, a PPT, and a JSON payload."*

A teacher enters thinking:
> *"I am teaching Class 8 Science Chapter 3 (Reproduction in Animals). What can TeacherSathi give me to teach this well?"*

By structuring the entire resource lifecycle around **Prepare**, **Teach**, **Practice**, and **Assess**, providing instant rich previews before commitment, introducing draft review before classroom use, and preserving teaching context across all boundaries, Phase 14 transforms TeacherSathi from a raw file repository into an intelligent, empowering teaching assistant.

---

## 2. Resource Mental Model & Information Architecture

### 2.1 The Old Model vs. The New Model

| Dimension | Old Model (Pre-Phase 14) | New Model (Phase 14) |
|:---|:---|:---|
| **Primary Organization** | File format / Storage type (Presentation, Mind Map, Video) | **Teaching Intent** (*Prepare, Teach, Practice, Assess*) |
| **Discovery Starting Point** | Generic file library route (`/dashboard/resources`) | **Chapter Workspace** (`/content/[grade]/[subject]/[chapter]`) |
| **Context Awareness** | None. Required selecting Grade, Subject, Chapter repeatedly | **Inherited Context**. Automatically recognized via `useTeachingContext()` |
| **Preview Experience** | Raw technical audit log with JSON snapshot dump | **Interactive Visual Preview** (Slide deck viewer, tabs for pedagogy & standards) |
| **AI Generation Workflow** | Form submission → progress bar → immediate automatic redirect | **Intent selection → customize → teacher-facing progress → Draft Review** |
| **Teacher Authority** | Implied AI finality without prior inspection | **Explicit Teacher Review**: `Regenerate`, `Edit`, `Save`, `Use in Class` |
| **Classroom Transition** | Disconnected; required searching for created file | **1-Click Direct Handoff** into 75" Smartboard Mode with context preserved |

### 2.2 The 4 Canonical Teaching Intent Pillars

```
Teaching Intent Architecture
├── 1. PREPARE   ──> Lesson plans, teacher notes, mind maps, curriculum pacing guides
├── 2. TEACH     ──> 75" Smartboard decks, live activities, concept videos, digital whiteboard
├── 3. PRACTICE  ──> Printable worksheets, question banks, bilingual homework, NCERT solutions
└── 4. ASSESS    ──> Formative clicker quizzes, summative test papers, exit tickets
```

Technical file types (`PRESENTATION`, `WORKSHEET`, `QUIZ`, `VIDEO`, etc.) remain preserved in the underlying database schema as secondary metadata, but are never forced upon the teacher as primary navigation taxonomy.

---

## 3. Chapter-First Resource Experience

When a teacher navigates to any NCERT chapter in the Curriculum Hub (e.g. `/content/class-8/science/chapter-3`):

1. **Chapter Header & Context**:
   - Displays Class, Subject, Chapter number, and bilingual title (`Reproduction in Animals` / `जंतुओं में जनन`).
   - Automatically synchronizes active context into `localStorage` (`teachersathi_teaching_context`).

2. **Teaching Resources for this Chapter**:
   - Displays 4 intent cards showing real, available resource counts:
     - **Prepare** (Lesson plans & teacher notes)
     - **Teach** (Smartboard slides & activities)
     - **Practice** (Worksheets & homework questions)
     - **Assess** (Formative quizzes & test papers)
   - Clicking any intent card filters the resource grid instantly without page reload.

3. **Standardized Resource Card Grid**:
   - Each card displays:
     - Intent badge (`LESSON SLIDES`, `WORKSHEET`, `QUIZ`, `ACTIVITY`, `VIDEO`, `TEACHER NOTES`).
     - Visual thumbnail preview with hover affordance.
     - Title and description.
     - Duration and item count (`12 slides · ~30 min` or `10 questions · ~20 min`).
     - Curriculum tags (`Class 8`, `Science`, `Ch 3`).
     - Bookmark toggle for saving.
     - Dual action buttons: `[ Preview ]` (opens modal) and `[ Teach / Use / Assign ]`.

4. **Actionable Creation CTA**:
   - Direct `[ + Create New Resource ]` button linking to `/dashboard/create` with pre-filled context parameters (`?grade=class-8&subject=science&chapter=chapter-3`).

---

## 4. Resource Studio Re-Architecture (`/dashboard/resources`)

The Resource Studio is rebuilt around the teacher's immediate workflow:

### 4.1 Inherited Context Banner
If the teacher arrives with an active teaching context in `localStorage` or URL query parameters:
- Displays prominent **"Active Teaching Context"** banner: `Resources for [Chapter Title] — Class 8 · Science · Chapter 3`.
- Offers quick action: `[ Teach This Chapter → ]` or `[ Change Chapter ]`.

### 4.2 Library Navigation Scopes
- **For Current Chapter**: Prioritized default view displaying all materials relevant to the active chapter.
- **Recent Resources**: Automatically records the last 20 opened, previewed, or taught resources in `localStorage` (`teachersathi_recent_resources`) via `recentResources.ts`.
- **Saved Resources**: 1-click bookmarked favorites (`teachersathi_saved_resources`).
- **All Resources**: Comprehensive catalog combining canonical curriculum materials with user-created drafts from `/api/resources`.

### 4.3 Contextual Teacher Search & Filter Pills
- Fast search supporting natural teacher phrases:
  - `"photosynthesis activity"`
  - `"Class 8 quiz"`
  - `"5 minute recap"`
  - `"worksheet"`
- Filter pills: `All`, `Lesson Slides (N)`, `Worksheet (N)`, `Quiz (N)`, `Activity (N)`, `Video (N)`.

---

## 5. Resource Preview Experience

Phase 14 establishes a clear separation between **Preview**, **Edit**, and **Teach**:

- **Preview** (`[ Preview ]`): Inspect content, slides, questions, notes, and curriculum alignment before using or modifying.
- **Edit** (`[ Edit ]`): Modify content, add questions, or change difficulty.
- **Teach** (`[ Use in Class ]` / `[ Start Teaching ]`): Launch high-contrast presentation mode on the 75" classroom smartboard.

### 5.1 Dual Preview Implementation
1. **Interactive Preview Modal (`ResourcePreviewModal.tsx`)**:
   - Accessible from any card in the Resource Studio or Chapter Workspace.
   - Slide deck viewer with slide selector thumbnails on the left, high-contrast active slide in center, and `< Prev / Next >` buttons.
   - Tabs for **Preview Content**, **Pedagogical Details** (recommended classroom scenarios, benefits), and **Curriculum Alignment** (NCERT learning outcomes).
   - Sticky action bar with `[ Save ]`, `[ Share ]`, `[ Edit ]`, `[ Duplicate ]`, and `[ Use in Class ]`.
2. **Dedicated Full Preview Page (`/dashboard/resources/[id]`)**:
   - Upgrades the technical snapshot audit page into a comprehensive inspection suite while preserving Phase 7 version history rollback capabilities.

---

## 6. Intent-Based AI Resource Creation (`/dashboard/create`)

Resource creation begins with teacher intent rather than technical database types:

### 6.1 Step 1: Tell Me What to Create
- Banner: `Current Teaching Context (inherited): Class 8 | Science | Chapter 3 - Reproduction in Animals` `[Change]`.
- 6 Intent Cards:
  1. **Lesson Slides** (*Presentation for classroom*)
  2. **Worksheet** (*Practice questions*)
  3. **Quiz** (*Assessment for students*)
  4. **Activity** (*Engaging classroom activity*)
  5. **Explanation** (*Simplify a concept*)
  6. **Question Bank** (*More practice questions*)
- Optional teacher prompt textarea: `"Describe what you need (optional): e.g. Include real-life examples, keep it simple, add diagrams..."` (0/500 char counter).

### 6.2 Step 2: Customize Setup
- **Difficulty Level**: `Easy`, `Medium`, `Hard`.
- **Content Language**: `English`, `Hindi`, `Bilingual`.
- **Estimated Duration**: `~15 min`, `~30 min`, `~45 min`.
- **Quantity Slider**: Slide deck size (6–18 slides) or Question count (5–20 items).

### 6.3 Step 3: Teacher-Facing Generation Progress
Replaces engineering pipeline terminology (`PROMPT_SYNTHESIS`, `JSON_SCHEMA_VALIDATE`, `DB_SYNC`) with teacher-friendly progress milestones:
1. *"Understanding your chapter and NCERT learning goals..."*
2. *"Planning the pedagogical flow and classroom objectives..."*
3. *"Creating classroom-ready content with Saathi AI..."*
4. *"Verifying educational accuracy and difficulty balance..."*
5. *"Draft ready for your teacher review!"*

### 6.4 Step 4: Review Your Resource (Review-Before-Use Workflow)
Never assumes AI-generated content is automatically final. The teacher reviews the draft:
- Header: *"Review Your Resource — Saathi has created a draft for you. Review, edit if needed, and then save or use it."*
- Notice: *"Generated by Saathi — You can edit, regenerate, or make changes."*
- Interactive draft preview (slide outline, live slide deck, question list).
- Resource summary card: Slide count, key diagrams, discussion questions, NCERT alignment, estimated teaching time.
- Next steps checklist.
- Decision action buttons:
  - `[ Regenerate ]`
  - `[ Edit Request ]`
  - `[ Save to Resources ]`
  - `[ Use in Class (Smartboard Mode) ]`

---

## 7. Bidirectional Classroom Handoff

```
Chapter Workspace ──(1-click)──> Resource Preview ──(Use in Class)──> 75" Smartboard Mode
       ▲                                                                      │
       │                                                                      │
       └───────────────────(← Exit to Workspace)─────────────────────────────┘
```

When a teacher launches a resource into the classroom:
- Parameters preserved: `grade=class-8&subject=science&chapter=chapter-3&title=...&returnUrl=...`.
- Session state correctly initializes with dynamic chapter title and slide 1 content.
- Exiting classroom mode returns the teacher directly to the Chapter Workspace or Resource Studio without losing state.

---

## 8. Resolution of Phase 11 Audit Findings

| Audit ID | Issue Description | Root Cause in Phase 11 | Phase 14 Architectural Resolution | Status |
|:---|:---|:---|:---|:---:|
| **UX-003** | Disconnected Chapter Presentation | Fake 3-slide mock modal isolated from real classroom | Integrated real `getChapterResources` and `ResourceCard` into Chapter Workspace, deep-linking directly to `/classroom` | **RESOLVED** |
| **UX-005** | Resource Navigation Disconnect | Create flow redirected to unauthenticated `/resources` | Fixed routing to `/dashboard/resources`, added draft review step, and preserved `returnUrl` | **RESOLVED** |
| **UX-015** | Missing Recent/Saved State | No way for teachers to resume previously opened teaching material | Created `recentResources.ts` tracking recent and saved resources in `localStorage` with reactive custom event bus | **RESOLVED** |
| **UX-020** | Redundant AI Creation Inputs | Generator asked for Grade/Subject/Chapter even when launched from chapter | Added inherited context detection in `/dashboard/create`, pre-populating all curriculum inputs and displaying context banner | **RESOLVED** |

---

## 9. Verification & Quality Assurance

### Automated Testing Matrix
- **TypeScript (`tsc --noEmit`)**: **0 errors**
- **Next.js ESLint**: **0 errors**
- **Vitest Automated Tests**: **All 357 tests passing across 72 test suites**
- **Production Build (`npm run build`)**: **Build succeeded** (exit code 0)

### Manual UX Journey Matrix
- **Journey A (Discover)**: Chapter Workspace → 4 Intent Pillars → Filtered resource grid verified.
- **Journey B (Preview)**: Click `[ Preview ]` → Interactive modal with slide carousel and tabs verified.
- **Journey C (Teach)**: Click `[ Use in Class ]` → Instant transition to `/classroom` with parameters verified.
- **Journey D (Create & Review)**: Intent selection → customize → teacher-facing progress → Step 4 draft review verified.
- **Journey E (Context)**: Inherited context banner displayed consistently across studio and creation flows.
- **Journey F (Recent & Saved)**: Previewing updates recent tab; clicking bookmark updates saved tab.
- **Journey G (Search & Filters)**: Searching "worksheet" or "photosynthesis" filters cards accurately.
- **Journey H (Mobile & Responsive)**: Fluid card grid, scrollable filter pills, and touch targets verified.
- **Journey I (Bilingual Support)**: Devanagari Hindi text and English render cleanly without overflow.

---

## 10. Recommended Next Phase: Phase 15

With Phase 14 complete, TeacherSathi has established a unified teacher workspace and an intent-driven content & resource engine.

**Recommendation for Phase 15**:
> **Phase 15 — Assessment, Grading & Diagnostic Feedback UX**
> Focus on closing the evaluation loop: student assessment taking, instant grading workflows, clicker response visualization, misconception diagnostic insights, and student report card generation.
