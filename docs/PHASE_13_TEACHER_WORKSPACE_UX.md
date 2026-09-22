# TeacherSathi — Phase 13
# Unified Teacher Workspace UX & Information Architecture

> **Document Type**: Canonical Architecture & Implementation Specification  
> **Phase**: 13 — Unified Teacher Workspace UX  
> **Status**: Production Verified & Deployed  
> **Dependencies**: Phase 11 (UX Audit & Issue Register), Phase 12 (Design System & UI Foundation)  
> **Verified With**: TypeScript `tsc --noEmit` (0 errors), Next.js Lint (0 errors), 357 Vitest automated tests passing across 72 test suites, Next.js 14 Production Build.

---

## 1. Executive Summary

Phase 11 diagnosed the structural friction points in the teacher experience across 20 distinct workflows. Phase 12 established the visual design system tokens and foundational component library. 

**Phase 13 applies these foundations to rebuild the primary teacher workflow** around the educator's natural mental model:
```
"What class am I teaching?" ──> "What subject?" ──> "Which chapter?" ──> "What am I doing with it?"
                                                                          ├─ 1. Prepare
                                                                          ├─ 2. Teach (Live 75" Smartboard)
                                                                          ├─ 3. Assess (Formative / Summative)
                                                                          ├─ 4. Understand (Class Insights)
                                                                          └─ 5. Ask Saathi (Contextual AI)
```

By introducing a global client-side **Teaching Context State Engine**, removing the mock 3-slide presentation modal in favor of the real 75" Smartboard kiosk engine, eliminating redundant inputs in AI generation and assessment builders, and enabling multi-class support across all dashboards, Phase 13 transforms TeacherSathi from a fragmented collection of disparate tools into a unified, frictionless teaching platform.

---

## 2. Core Architecture: The Teaching Context Model

To eliminate cognitive friction and redundant form inputs across routes, Phase 13 establishes a centralized, lightweight **Teaching Context Engine** (`src/lib/context/teachingContext.ts`).

### 2.1 State Schema
```typescript
export interface TeachingContext {
  classId?: string;          // e.g. "cls-8a"
  grade: string;            // e.g. "class-8"
  gradeName: string;        // e.g. "Class 8"
  section?: string;         // e.g. "A"
  subject: string;          // e.g. "science"
  subjectName: string;      // e.g. "Science"
  chapter: string;          // e.g. "chapter-1"
  chapterNumber?: number;   // e.g. 1
  chapterTitle: string;     // e.g. "Crop Production and Management"
  chapterTitleHi?: string;   // e.g. "फसल उत्पादन एवं प्रबंध"
  totalTopics?: number;     // e.g. 7
  completedTopics?: number; // e.g. 4
  lastAccessedAt: string;   // ISO 8601 Timestamp
  currentSlide?: number;    // e.g. 1
}
```

### 2.2 Cross-Component Synchronization
- **Storage Strategy**: Synchronized into `localStorage` (`teachersathi_teaching_context`) with client-safe SSR guards.
- **Event Bus**: Dispatches `CustomEvent('teachersathi:teaching-context-change')` alongside standard `storage` events, ensuring that whenever a teacher selects a chapter in the Curriculum Hub, the Dashboard hero card, AI Creation studio, Assessment Builder, and Classroom Kiosk update synchronously without page reload.
- **Hook**: `useTeachingContext()` exposes `{ context, updateContext, setContext, isLoaded }` for clean declarative consumption.

---

## 3. Systematic Resolution of Phase 11 Audit Findings

Phase 13 systematically remediates all audit issues targeted in the Phase 13 specification:

| Audit ID | Issue Description | Root Cause in Phase 11 | Phase 13 Architectural Resolution | Status |
|:---|:---|:---|:---|:---:|
| **UX-002** | Broken Curriculum Discovery | Authenticated dashboard had no direct route to Class → Subject → Chapter | Added "Curriculum" (`/content`) to `Sidebar.tsx` core navigation with `Compass` icon; added "Browse NCERT Curriculum" quick discovery grid (Classes 6–10) to Dashboard | **RESOLVED** |
| **UX-003** | Disconnected Chapter Presentation | `ChapterWorkspaceClient.tsx` opened a fake 3-slide mock modal instead of the real classroom system | Deleted mock slides and inline timer; replaced with primary hero CTA **"Start Class on Smartboard"** targeting `/classroom` with parameters | **RESOLVED** |
| **UX-005** | Resource Navigation Disconnect | Create flow redirected to unauthenticated `/resources` instead of studio | Fixed completion redirect in `dashboard/create/page.tsx` to target `/dashboard/resources` or `returnUrl` | **RESOLVED** |
| **UX-013** | Workspace vs. Classroom Paradigm | No clean bidirectional boundary; classroom session end stranded the teacher | `/classroom` reads `returnUrl`, `grade`, `subject`, `chapter`, and `title`; added "Exit to Workspace" in header and "Return to Chapter Workspace" on session end | **RESOLVED** |
| **UX-016** | Inconsistent Back Paths & Breadcrumbs | Fragmented breadcrumbs (e.g. "NCERT Library" vs "Dashboard") | Standardized strict hierarchical breadcrumb: `Dashboard` &rarr; `Curriculum` &rarr; `Class {N}` &rarr; `{Subject}` &rarr; `Ch {N}` across all content routes | **RESOLVED** |
| **UX-017** | Analytics Cognitive Overload | Overwhelming metrics too early in the teacher workflow | Created concise "Class Insights" card in Chapter Workspace (Mastery %, On-track vs Support count, pedagogical note) with deep link to full analytics | **RESOLVED** |
| **UX-018** | Hardcoded Class Default | Hardcoded Class 10-A assumption across dashboard and classes page | Enabled dynamic multi-class selector across `dashboard/page.tsx` and `dashboard/classes/page.tsx` (Classes 6-A, 7-A, 8-A, 9-B, 10-A) with dual actions (Teach / Roster) | **RESOLVED** |
| **UX-020** | Redundant AI Creation Inputs | Arriving from a chapter re-asked grade, subject, and chapter | In `dashboard/create/page.tsx`, if context is provided via URL params, display an "Active Context" banner and jump directly to Step 3 (Customize Setup); in `assessments/create/page.tsx`, prefill context and title | **RESOLVED** |
| **UX-022** | Chapter Contextual AI Assistance | Genie required manual input of chapter topics and grade | Added 4 one-click contextual prompt chips tailored to active chapter title (Recap activity, Misconceptions, Real-world applications, Hindi notes) | **RESOLVED** |

---

## 4. Chapter Workspace: The 5 Action Pillars

The core Chapter Hub (`/content/[grade]/[subject]/[chapter]`) has been re-architected from an unstructured link list into 5 clearly demarcated, teacher-centric action pillars:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHAPTER WORKSPACE HERO                          │
│  "Start Class on Smartboard" [Primary CTA]   │   "Open Whiteboard"     │
└────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   1. PREPARE     │  │    2. TEACH      │  │    3. ASSESS     │
│ ──────────────── │  │ ──────────────── │  │ ──────────────── │
│ • AI Lesson Plan │  │ • Smartboard Deck│  │ • Create MCQ Quiz│
│ • Concept MindMap│  │ • Whiteboard     │  │ • Test Paper     │
│ • Worksheet PDF  │  │ • Video Resource │  │ • Assign Homework│
│ • Question Bank  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────────────────────────┐  ┌─────────────────────────────┐
│          4. UNDERSTAND               │  │       5. ASK SAATHI         │
│ ──────────────────────────────────── │  │ ─────────────────────────── │
│ • Concept Mastery (78%)              │  │ • 5-min recap activity chip │
│ • 32 On Track / 6 Need Support       │  │ • Misconceptions chip       │
│ • Full Analytics Hub Deep Link       │  │ • Contextual ask query bar  │
└──────────────────────────────────────┘  └─────────────────────────────┘
```

1. **Pillar 1: Prepare**:
   - `AI Lesson Plan`: Direct jump to `/dashboard/create?type=lesson-plan&grade=...&subject=...&chapter=...` with zero redundant inputs.
   - `Concept Mind Map`: Vector outline and visual relationship tree.
   - `Printable Worksheet`: Dual-language PDF generation ready for physical classroom distribution.
   - `Question & Answer Bank`: Solved canonical NCERT questions with grading criteria.
2. **Pillar 2: Teach**:
   - `Start Smartboard Class`: Direct launch of `/classroom` kiosk engine with chapter title, grade, subject, and return URL.
   - `Digital Whiteboard`: Direct jump to `/dashboard/whiteboard` for live mathematical or diagrammatic annotations.
   - `Video Resources`: Bilingual NCERT chapter animations and concept clips.
3. **Pillar 3: Assess**:
   - `Create MCQ Quiz`: Auto-graded objective test configured with active chapter context.
   - `Generate Test Paper`: Summative CBSE exam paper builder with Sections A, B, and C.
   - `Assign Homework`: One-click assignment to the active class section roster.
4. **Pillar 4: Understand (Class Insights)**:
   - Eliminates cognitive overload by presenting only actionable diagnostics: Overall Class Mastery %, count of students on track vs needing reinforcement, and a concise pedagogical intervention tip. Deep-links directly to `/dashboard/analytics`.
5. **Pillar 5: Ask Saathi**:
   - Context-aware pedagogical AI companion equipped with pre-generated prompt chips matching the active chapter (e.g. *"5-min recap activity for Crop Production and Management"*, *"Common student misconceptions in Crop Production and Management"*).

---

## 5. Bidirectional Classroom Kiosk Mode Transition

Phase 13 establishes the operational boundary between **Teacher Workspace** and **Classroom Mode**:

1. **Entering Classroom Mode**:
   - Launch URL format: `/classroom?grade=class-8&subject=science&chapter=chapter-1&title=Crop%20Production%20and%20Management&returnUrl=/content/class-8/science/chapter-1`
   - Kiosk automatically provisions a live smartboard session titled with the active chapter and grade.
   - Initial presentation slide deck title is dynamically set to the chapter title.
2. **During Instruction**:
   - Kiosk operates in 75" high-contrast, low-glare slate mode (`#0B131E`).
   - Header features a direct `← Exit to Workspace` link.
   - Bottom dock (`ClassroomTouchBar`) provides >=64px touch targets and global keyboard arrow listeners.
3. **Concluding Session**:
   - When the session is ended (via touch bar or remote teacher control), the kiosk transitions to the Session Concluded state.
   - Instead of stranding the user on a blank screen, it provides a primary tactile button: **"Return to Chapter Workspace"** targeting `returnUrl`.

---

## 6. End-to-End User Journeys (A through H)

| Journey | User Scenario | Verified Flow |
|:---|:---|:---|
| **Journey A** | First-time Teacher discovering curriculum | Sidebar &rarr; Click "Curriculum" (`/content`) &rarr; Select Class 8 &rarr; Select Science &rarr; Pick Chapter 1 &rarr; Land in Chapter Workspace |
| **Journey B** | Returning Teacher resuming yesterday's lesson | Dashboard &rarr; View "Continue Teaching" hero card &rarr; Click "Start Class" (direct 75" smartboard) or "Workspace" &rarr; Immediately in context |
| **Journey C** | Preparing tomorrow's lesson plan | Chapter Workspace &rarr; Click "AI Lesson Plan" &rarr; Lands in `/dashboard/create` with Class 8 Science Chapter 1 prefilled in Step 3 banner &rarr; Click "Generate Now" &rarr; Redirected to `/dashboard/resources` |
| **Journey D** | Creating a chapter formative assessment | Chapter Workspace &rarr; Click "Create MCQ Quiz" &rarr; Lands in `/dashboard/assessments/create` with Class 8, Science, Ch 1, and MCQ pre-selected &rarr; Select questions &rarr; Save & Assign |
| **Journey E** | Teaching on 75-inch Classroom Display | Chapter Workspace &rarr; Click "Start Class on Smartboard" &rarr; Kiosk loads with synchronized session and slides &rarr; Advance slides via 64px touch targets or keyboard |
| **Journey F** | Instant pedagogical support during planning | Chapter Workspace &rarr; Click chip *"Common student misconceptions in Crop Production"* &rarr; Inline Saathi response generated in seconds |
| **Journey G** | Concluding class and returning to desk | Smartboard &rarr; Tap "End Class" &rarr; Kiosk displays "Session Concluded" with "Return to Chapter Workspace" button &rarr; Direct 1-click return to workspace |
| **Journey H** | Mobile viewport teacher navigation | Mobile hamburger drawer opens smoothly &rarr; All touch targets >= 44px on mobile &rarr; Class selector scrolls horizontally without breaking layout |

---

## 7. Verification & Production Quality Metrics

The implementation of Phase 13 underwent strict verification:

- **TypeScript Compilation**: `npm run typecheck` &rarr; `tsc --noEmit` exited with **0 errors**.
- **ESLint Code Quality**: `npm run lint` &rarr; Next.js ESLint exited with **0 errors**.
- **Automated Test Suite**: `npm test` &rarr; **All 357 tests across 72 test suites passed with 100% success rate**.
- **Production Compilation**: `npm run build` &rarr; Next.js 14 production bundle generated successfully with 0 errors.

---

## 8. Forward Integration: Phase 14 Roadmap

With the foundational Teacher Workspace UX unified in Phase 13, TeacherSathi is now primed for **Phase 14 — Student Experience, Live Interaction & Classroom Feedback**:
- Live student web portal (`/student`) and hardware clicker response ingestion.
- Instant live polling visualizations on the 75-inch smartboard.
- Peer-to-peer pairing activities initiated from the Chapter Workspace.
- Student formative progress tracking reflected directly back into the Chapter Workspace's Class Insights pillar.
