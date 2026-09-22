# TeacherSathi — Phase 17: Classroom Interaction & Assessment UX
# Strict Execution Specification & Architecture Guide

## 1. Executive Summary & Core Principle

In traditional EdTech systems, assessments operate as separate examination portals or detached testing modules that disrupt classroom flow. In **TeacherSathi Phase 17**, formative assessment is designed as an organic, touch-first extension of the teacher's natural delivery rhythm on the 75-inch smartboard display:

$$\text{TEACH} \longrightarrow \text{ASK} \longrightarrow \text{OBSERVE} \longrightarrow \text{ASSESS} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{RESPOND} \longrightarrow \text{CONTINUE TEACHING}$$

Assessment in TeacherSathi answers one essential question:
> **"Do my students understand this concept right now, and what should I do next?"**

The teacher remains completely in control. Saathi acts as a pedagogical co-pilot that highlights cognitive misconceptions and offers short, concrete micro-interventions (2–5 minutes) rather than prescribing rigid automation.

---

## 2. Authoritative 5-Panel Architecture (Reference Specification)

Based on the 5-panel interactive assessment design system (`media_1790114569081.jpg`), the interaction cycle is decomposed into five distinct, sequential stages:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PHASE 17 ASSESSMENT CYCLE                                │
└────────────────────────────────────────────────────────────────────────────────────────┘

  [1. Quick Check Hub]  ──>  [2. 75" Question Display]  ──>  [3. Live Distribution]
    • Start Quick Check        • 2x2 High-Contrast Grid       • Real-Time Bar Charts
    • Use Existing Quiz        • Letter Badges (A/B/C/D)      • 18/24 Responded (75%)
    • Saathi Generator         • 6–10m Back-Row Legibility    • Isolated Teacher Controls
    • Exit Ticket              • Student Accidental Touch Safe • Pause / Increment
                                      │
                                      ▼
  [5. Re-teach & Recheck]  <──  [4. 3-Card Insight & Intervention]
    • Step 1: Visual Comparison   • Column 1: Observed Data (Amber)
    • Step 2: Recheck Question    • Column 2: Saathi Interpretation (Purple)
    • Step 3: Mastery (92%)       • Column 3: Suggested Intervention (Green)
    • [Continue to Next Slide]    • [Use Suggestion] / [Whiteboard] / [Try Another]
```

---

### Panel 1: Quick Check Hub ("Let's check your understanding!")
When the teacher touches the **Quick Check** dock button or activates a formative pause, the Quick Check Hub launches:
1. **Curriculum Badge**: Displays the active NCERT Grade, Subject, and Chapter (e.g., `Class 8 • Science • Chapter 3: Heat & Thermodynamics`).
2. **Four Distinct Launch Modalities**:
   - **Start Quick Check (Primary)**: Directly opens the curated, contextual 1-to-3 question diagnostic check for the current lesson topic.
   - **Use Existing Quiz**: Connects to pre-saved chapter assessments or quizzes generated in the Resource Studio.
   - **Create a Question with Saathi**: Opens the Saathi contextual generator pre-filled with the active slide content to synthesize a question on demand.
   - **Exit Ticket**: Launches a summative 2-minute wrap-up question for end-of-period comprehension checks.

---

### Panel 2: 75-Inch Question Display
Built for 75-inch interactive displays with 6–10 meter back-row readability:
1. **Typography Scale**:
   - Question Title: $\ge 36\text{px}$ (`text-3xl sm:text-5xl md:text-6xl font-black font-serif`).
   - Answer Choices: $\ge 24\text{px}$ (`text-xl sm:text-2xl font-bold`).
   - High-contrast Devanagari font scaling for Hindi medium classrooms.
2. **2x2 High-Contrast Answer Cards**:
   - **Option A (Red)**: Border `border-red-500/40`, background `bg-red-500/10`, badge `bg-red-500 text-white`.
   - **Option B (Blue)**: Border `border-blue-500/40`, background `bg-blue-500/10`, badge `bg-blue-500 text-white`.
   - **Option C (Green)**: Border `border-emerald-500/40`, background `bg-emerald-500/10`, badge `bg-emerald-500 text-white`.
   - **Option D (Orange)**: Border `border-amber-500/40`, background `bg-amber-500/10`, badge `bg-amber-500 text-white`.
   - Card minimum height $\ge 100\text{px}$ with $\ge 56\text{px}$ tactile letter badges.
3. **Strict Teacher Control Isolation**:
   - Accidental student touches on option cards never reveal the correct answer prematurely.
   - Teacher controls are partitioned into a dedicated top/right action bar:
     - `[Pause Responses]` (or `[Resume]`)
     - `[Reveal Answer]` (Intentional teacher action only)
     - `[View Live Distribution]`
     - `[End Quick Check]`

---

### Panel 3: Live Response Distribution
Provides real-time feedback without turning the classroom into a high-stakes test:
1. **Aggregated Participation Header**:
   - e.g., `18 / 24 students responded (75%)`.
   - Visual progress bar showing class submission velocity.
2. **Horizontal Distribution Bar Charts**:
   - Each option displays the student count and percentage:
     - `A (Red): 4 students (22%)`
     - `B (Blue): 10 students (56%)`
     - `C (Green - Correct): 2 students (11%)`
     - `D (Orange): 2 students (11%)`
3. **Dual Response Modality**:
   - **Device Mode**: Automatic aggregation when paired devices or student clickers are connected.
   - **Show-of-Hands Tactile Mode**: Direct on-screen `[+]` and `[-]` counters allowing the teacher to record physical student hand-raises in under 5 seconds.
4. **Pedagogical Action Trigger**:
   - Whenever correct comprehension falls below 70%, TeacherSathi highlights `[View Saathi Insight & Rationale →]` to initiate micro-intervention.

---

### Panel 4: Observed Data → Saathi Insight → Suggested Intervention
A strict 3-column pedagogical architecture that prevents opaque AI recommendations:

| 1. Observed Data (Amber) | 2. Saathi's Interpretation (Purple) | 3. Suggested Intervention (Green) |
| :--- | :--- | :--- |
| **Empirical facts only**<br>• $56\%$ chose Option B<br>• $22\%$ chose Option A<br>• 10 of 18 students selected: *"Boiling happens only at the surface"* | **Cognitive Root Cause**<br>• Students confuse surface evaporation with bulk liquid boiling.<br>• Root cognitive trap: assuming boiling is confined to the surface because bubbles escape upward. | **Actionable Micro-Intervention**<br>• 2–5 minute quick comparison table on the smartboard.<br>• Real-world anchor: drying clothes in the sun vs boiling water in a kettle. |

#### Teacher Action Pathways:
1. `[Use This Suggestion]`: Instantly transitions to Stage 5 with the visual comparison diagram pre-loaded.
2. `[Open Whiteboard]`: Switches to the 75-inch interactive canvas with drawing tools ready.
3. `[Try Another Suggestion]`: Prompts Saathi to offer an alternate real-world analogy (e.g., sweating/perspiration).

---

### Panel 5: Re-teach & Recheck Loop with Mastery Tracking
Closing the formative learning loop in 3 steps:

1. **Step 1: Visual Re-teach Diagram**:
   - Two-column comparative matrix:
     - **Evaporation (Surface)**: Any temperature, surface only, cooling effect, gradual.
     - **Boiling (Bulk)**: Fixed temperature ($100^\circ\text{C}$), throughout bulk liquid, rapid bubbling.
   - Quick action: `[Draw on Whiteboard]` enables freehand annotations over the diagram.
2. **Step 2: Quick Recheck Question**:
   - Formulated to test the exact misconception without repeating the same question text:
     - *"Which of the following can evaporate at room temperature?"*
     - Options: (A) Only seawater, (B) Only hot water, (C) Any liquid with exposed surface [Correct], (D) Only milk.
3. **Step 3: Improved Understanding Celebration**:
   - Live cohort verification: **$22 / 24\text{ students } (92\%)$** correct.
   - Clear mastery indicator: *"Great improvement! Most students now understand the concept."*
   - Direct continuation: `[Continue to Next Slide →]` smoothly returns the teacher to the lesson presentation at the exact next slide.

---

## 3. Implementation Details

### File Structure
- `src/lib/data/classroomQuickChecks.ts`: Curated NCERT question pairs, misconception diagnostics, re-teach comparison matrices, and dynamic chapter fallbacks.
- `src/components/classroom/ClassroomQuickCheck.tsx`: Production component implementing all 5 panels, touch hitboxes, bilingual toggles, and real-time polling counters.
- `src/app/[locale]/classroom/page.tsx`: Embedded within the 75" kiosk viewport (`activeTab === "quiz"`), connected to curriculum context, whiteboard, and Saathi drawer.
- `tests/classroom/classroom-interaction-assessment.test.ts`: Automated Vitest test suite verifying data structures, hitboxes, teacher isolation, percentages, and mastery loops.

### Touch & Accessibility Standards
- **Hitboxes**: All touch cards $\ge 100\text{px}$ tall; tactile action buttons $\ge 56\text{px}$; letter badges $56\times 56\text{px}$.
- **Glaring & Lighting**: Full dual-theme support (Dark high-contrast `#0B131E` for bright digital projectors; daylight anti-glare `#F8FAFC` for high-ambient-light classrooms).
- **Offline Resilience**: Fully operational in offline school networks with local question synthesis and show-of-hands manual counters.

---

## 4. Verification & Automated Test Results

- **Test Suite**: `tests/classroom/classroom-interaction-assessment.test.ts`
- **Total Tests**: 16 dedicated unit & integration tests (100% pass rate).
- **Global Repo Suite**: 397 passing tests across 75 test files.
- **Production Build**: Clean Next.js static and server compilation with 0 TypeScript and 0 ESLint errors.
