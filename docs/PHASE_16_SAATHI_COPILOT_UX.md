# TeacherSathi — Phase 16: Saathi / Teacher Co-Pilot UX
## Comprehensive UX Architecture & Technical Specification

---

## 1. Executive Summary

Phase 16 focuses exclusively on making **Saathi** feel like a useful, contextual, trustworthy teacher co-pilot across all key product touchpoints:
1. **Teacher Workspace** (Lesson preparation, curriculum exploration)
2. **Resource Creation Studio** (Generating quizzes, worksheets, presentations, activities)
3. **75-Inch Classroom Mode** (Live teaching, in-flight pedagogical prompts, visual analogies)
4. **Diagnostic Analytics Hub** (Learning-gap remediation, empirical data vs pedagogical intervention)
5. **Bilingual Hindi / Hinglish Assistance** (Devanagari and colloquial Romanized support)

Phase 16 executes the interaction architecture defined in the reference specification (`media_1790113642505.jpg`), strictly establishing that:

> **TeacherSathi has one fundamental interaction model:**
> Teacher decides → Saathi understands context → Saathi prepares or suggests → Teacher reviews → Teacher decides whether to use it → TeacherSathi executes.
>
> **Saathi assists the teacher. Saathi NEVER replaces the teacher.**

---

## 2. Core Interaction Model & Teacher Authority Principles

Every interaction with Saathi adheres to six non-negotiable principles:

| Principle | Description | Implementation Guarantee |
|---|---|---|
| **1. Grounded Context** | Saathi automatically inherits active grade, subject, chapter, and slide/gap without asking the teacher to re-explain. | Context resolution in `src/lib/ai/saathiContext.ts` with hierarchical badge chips (`[Class 8] [Science] [Ch 3]`). |
| **2. One-Tap Quick Actions** | Teachers can ask with 1 tap using screen-specific, context-aware prompt chips. | `SaathiPromptChips.tsx` dynamically populates NCERT-tailored prompts. |
| **3. Structured Outputs** | Responses are structured into four clear cognitive blocks: Answer, Why This Helps, Try This, and Teacher Controls. | `SaathiResponseCard.tsx` renders structured rationale rather than endless walls of chat text. |
| **4. Draft Authority** | Consequential outputs (lesson plans, activities, assignments, interventions) are always labeled as **Drafts**. | Prominent provenance banner: *"AI generated draft. Consequential actions require teacher approval."* |
| **5. Non-Obstructive Classroom Drawer** | In 75" Classroom Mode, Saathi opens in a compact side drawer beside the active slide. | `SaathiClassroomDrawer.tsx` keeps the slide 100% visible on the smartboard; whiteboard/slide state is never wiped. |
| **6. Empirical Analytics Separation** | In learning-gap remediation, empirical assessment data is strictly separated from suggested intervention. | Dual-card architecture: Amber card for Observed Data vs Purple card for Suggested Intervention. |

---

## 3. Reference Architecture: The 5 Panels

Phase 16 implements the 5 canonical panels from the reference system:

### Panel 1: Teacher Workspace Contextual Panel (`/content/...`)
- **Location**: Chapter Workspace (`ChapterWorkspaceClient.tsx`).
- **Trigger**: Hero trigger button `Ask Saathi` in workspace top bar or embedded contextual prompt chips.
- **Context Bar**: Hierarchical badges: `[Class 8] [Science] [Ch 3: Synthetic Fibres and Plastics]`.
- **Quick Actions**:
  - *"Explain Synthetic Fibres in simple terms"*
  - *"Give me an everyday village example"*
  - *"Draft a 5-minute student activity"*
  - *"Create 3 quick check questions"*
  - *"Translate this lesson to Hindi"*
- **Result**: Slide-over panel (`SaathiPanel.tsx`) providing structured explanations with `[Use]`, `[Edit Draft]`, `[Translate]`, and `[Try Another Approach]` actions.

### Panel 2: Resource Creation Studio Co-Pilot (`/dashboard/create`)
- **Location**: Resource Studio (`src/app/[locale]/dashboard/create/page.tsx`).
- **Context Inheritance**: Inherits persistent teaching context from `useTeachingContext()`.
- **3-Step Stepper**: `Describe → Generate → Review`.
- **Milestone Transparency**: Explicit visual indicators:
  1. Reading curriculum context
  2. Synthesizing NCERT competencies
  3. Formatting classroom-ready draft
- **Draft Authority Banner**:
  > *"This will be a draft for you to review and edit. You remain the final decision-maker."*
- **Review & Edit Screen**: Full Markdown/Rich preview with inline editing, regeneration controls, and export options before committing to the class.

### Panel 3: 75-Inch Classroom Co-Pilot Drawer (`SaathiClassroomDrawer.tsx`)
- **Location**: Smartboard live presentation (`/classroom`).
- **Trigger**: Dedicated 64px button on `ClassroomTouchBar` labeled `Ask Saathi`.
- **Screen Layout**: Compact side drawer (max 480px) docked beside the active slide:
  - Slide remains 100% visible and interactive.
  - Slide counter and whiteboard drawings are never disrupted.
- **Context Bar**: `[Slide 3 of 12 — Boiling vs Evaporation]`.
- **Pedagogical Assistance**:
  - Quick explanation phrased in simple, accessible language.
  - Why this helps (pedagogical rationale for Indian classrooms).
  - Concrete teacher action: *"Try this: ask the front row..."*
  - Fast touch actions: `[Use Explanation]`, `[Dismiss]`, `[Try Another Approach]`.

### Panel 4: Diagnostic Analytics & Learning-Gap Workflow (`/dashboard/analytics`)
- **Location**: Class Diagnostic & Intervention Hub (`src/app/[locale]/dashboard/analytics/page.tsx`).
- **Trigger**: `Ask Saathi` button on each learning gap card and concept row in the Atomic Concept Matrix.
- **Context Bar**: `[Class 8] [Science] [Heat & Temperature] [Learning Gap: Boiling vs Evaporation]`.
- **Dual-Card Separation**:
  - **Card 1: Observed Data (Amber Card)**:
    - Empirical evidence badge: *"14 of 38 students (37%) missed questions regarding Boiling vs Evaporation."*
    - Core diagnosed misconception identified from ground-truth quiz attempts.
  - **Card 2: Suggested Intervention (Purple Card)**:
    - 10-minute micro-lesson draft: teacher action, student paired inquiry, and visual smartboard anchor.
    - Reassessment check: 5-question targeted diagnostic check.
  - **Teacher Actions**: `[Approve & Add to Plan]`, `[Edit Draft]`, `[Try Another Approach]`.
  - **Provenance**: *"AI generated draft. Consequential actions require teacher approval."*

### Panel 5: Bilingual Hindi / Hinglish Pedagogical Querying
- **Location**: Global across all Saathi panels and drawers.
- **Language Detection Engine**: `isHindiOrHinglish()` in `src/lib/ai/saathiService.ts`.
  - Automatically identifies Devanagari script (`[\u0900-\u097F]`).
  - Automatically identifies colloquial Romanized Hinglish phrasing (`samjhao`, `kare`, `kaise`, `batao`, `baccho ko`, `kaksha`).
- **Bilingual Rationale**:
  - When asked in Hindi/Hinglish (e.g. *"इसे simple Hindi में समझाओ"*), Saathi answers in simple conversational Hindi (`सरल भाषा में व्याख्या...`).
  - Explains why mother-tongue framing aids concept retention in rural and semi-urban classrooms.
  - Generates culturally resonant analogies (e.g. village water filtration, bicycle tire friction, earthen pot cooling).

---

## 4. Technical Architecture & File Inventory

### 4.1 New Shared AI & UI Infrastructure
- **`src/lib/ai/saathiContext.ts`**:
  - Interface definitions for `SaathiContext` and `ContextBadgeItem`.
  - `resolveContextBadges()`: Generates hierarchical context badges (`Grade → Subject → Chapter → Slide/Gap`).
  - `getContextualPrompts()`: Screen-specific dynamic prompt suggestions tailored to active entities.
- **`src/lib/ai/saathiService.ts`**:
  - `querySaathi()`: Client-side AI client querying `/api/ai/genie`.
  - `isHindiOrHinglish()`: Automated bilingual detection engine.
  - Graceful fallback with rich NCERT-aligned offline templates.
- **`src/components/saathi/SaathiContextBadge.tsx`**: Accessible context badge pill renderer.
- **`src/components/saathi/SaathiPromptChips.tsx`**: One-tap quick prompt chips with horizontal scrolling.
- **`src/components/saathi/SaathiResponseCard.tsx`**: Structured 4-part response card with pedagogical rationale, classroom try-this prompts, draft authority tag, and dual-card analytics styling.
- **`src/components/saathi/SaathiTrigger.tsx`**: Standalone triggers (pill, button, icon) with keyboard and touch accessibility.
- **`src/components/saathi/SaathiPanel.tsx`**: Responsive slide-over drawer for Teacher Workspace and Analytics Hub.
- **`src/components/saathi/index.ts`**: Clean barrel exports.

### 4.2 Screen Integrations
- **`src/components/chapter/ChapterWorkspaceClient.tsx`**:
  - Integrated `SaathiPanel`, header `Ask Saathi` trigger, and prompt chips into lesson planning view.
- **`src/app/[locale]/dashboard/create/page.tsx`**:
  - Aligned 3-step creation flow (`Describe → Generate → Review`).
  - Added milestone progress indicators and draft authority banner.
- **`src/components/classroom/SaathiClassroomDrawer.tsx`**:
  - Compact side-drawer design ensuring 100% smartboard slide visibility.
  - Distance-readable typography (≥20px body, ≥24px headers).
  - Large touch targets (≥48px buttons).
- **`src/app/[locale]/dashboard/analytics/page.tsx`**:
  - Added `Ask Saathi` triggers to header controls, learning gap cards, and concept matrix rows.
  - Integrated `SaathiPanel` with strict Observed Data vs Suggested Intervention dual cards.

---

## 5. Automated Verification & Test Coverage

A dedicated test suite was implemented in `tests/ai/saathi-copilot.test.ts` covering 14 test scenarios:
- **Context Hierarchy Resolution**: Full workspace resolution, 75" slide resolution, analytics gap resolution, and default fallbacks.
- **Contextual Prompt Generation**: Workspace, classroom, creation, and analytics prompt specialization.
- **Bilingual Detection**: Devanagari Hindi, Romanized Hinglish, and English distinction.
- **Response Structuring & Dual-Card Separation**: Verification that `observedData` remains strictly empirical while `suggestedIntervention` contains pedagogical actions.
- **Teacher Authority Guarantees**: Verification that all outputs are marked `isDraft: true` and require explicit teacher approval.

### Test Results
- **Saathi Test Suite**: 14 of 14 passed.
- **Full Suite**: 74 test files, 381 tests passed with 0 regressions.
- **TypeScript Typecheck**: 0 errors (`npx tsc --noEmit` clean).
