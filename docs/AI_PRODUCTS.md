# TeacherSathi — AI Product Contract & Quality Pipeline

> **Status**: Frozen Contract (Phase 0)  
> **Rule**: TeacherSathi AI is NOT a generic conversational chatbot. It is a structured educational generation engine.

---

## 1. The Core AI Quality Principle

> **Fundamental Rule**:  
> **"AI output is not automatically considered publishable TeacherSathi content."**  
> All generated artifacts must pass deterministic validation checks before being saved, presented on smartboards, or distributed to students.

---

## 2. Standard Generation Pipeline

Every AI generation follows a strict six-stage lifecycle:

```
INPUT
  ↓
CONTEXT
  ↓
GENERATION
  ↓
VALIDATION
  ↓
OUTPUT
  ↓
STORAGE
```

### Context Injection Matrix
Every prompt to the LLM must be injected with structured curricular metadata:
1. **Grade / Class**: (Class 6, 7, 8, 9, 10)
2. **Subject**: (Mathematics, Science, Social Science, Hindi, English)
3. **Book Title & Edition**: (e.g. *NCERT Curiosity Science 2026-27*)
4. **Chapter Number & Title**: (e.g. *Chapter 10: Light — Reflection and Refraction*)
5. **Target Concept**: (e.g. *Spherical Mirrors & Mirror Formula*)
6. **Language Mode**: (`en` English, `hi` Devanagari Hindi, or `bilingual` English terms + Hindi explanations)
7. **Pedagogical Alignment**: NEP 2020 competency outcomes + Bloom's Taxonomy level (Remembering, Understanding, Applying, Analyzing, Evaluating)
8. **Teacher Constraints**: Custom duration, student count, special instructions

---

## 3. Initial AI Products Specification

### 1. AI Lesson Plan
- **Input**: Grade, Subject, Chapter, Period Duration (e.g. 45 min), Learning Objectives.
- **Context**: NCERT syllabus summary, previous chapter prerequisites, pedagogical guidelines.
- **Generation**: Formats lesson into:
  - Period hook / Real-world engagement (5 min)
  - Core conceptual explanation (20 min)
  - Guided student activity / Smartboard exercise (15 min)
  - Formative wrap-up / Homework prompt (5 min)
- **Validation**: Verifies total minutes = requested duration; verifies at least one formative check question exists.
- **Output**: Formatted interactive lesson card + Printable PDF export.
- **Storage**: Saved to `lesson_plans` table associated with `teacher_id`.

### 2. AI Worksheet
- **Input**: Grade, Subject, Chapter, Difficulty distribution, Question count (e.g. 10 MCQs, 5 Short Answer, 1 Diagram).
- **Context**: NCERT textbook in-text exercises and exemplar problems.
- **Generation**: Printable worksheet layout containing school branding header, student name/date fields, graded sections, and a detachable Teacher Answer Key.
- **Validation**: Schema validation ensuring every question includes a verified correct answer and marking scheme.
- **Output**: High-contrast A4 print-ready PDF and editable web preview.
- **Storage**: Saved to `worksheets` table.

### 3. AI Quiz (Interactive Classroom Clicker / Poll)
- **Input**: Grade, Subject, Chapter, Number of MCQs (typically 5–10).
- **Context**: Key concepts and common Indian student misconceptions.
- **Generation**: Strict JSON structure: `{ id, question, options: [{ id, text, is_correct }], explanation, difficulty }`.
- **Validation**:
  - Exactly 4 distinct options per question.
  - Exactly 1 option marked `is_correct: true`.
  - Non-empty pedagogical explanation in target language.
- **Output**: Interactive clicker slides with live score tracking.
- **Storage**: Saved to `quizzes` and `quiz_questions`.

### 4. AI Test Paper (Summative CBSE Assessment)
- **Input**: Grade, Subject, Chapters covered, Total Marks (25, 40, or 80 marks), Duration.
- **Context**: CBSE Board Blueprint and Question Bank Standard (Section A 2m, Section B 3m, Section C 4m).
- **Generation**: Full CBSE-compliant test paper with marks breakdown, general instructions, Section A/B/C division, and complete solution key with step-marking criteria.
- **Validation**: Sum of question marks must exactly match Total Marks requested.
- **Output**: Formal examination PDF ready for photocopying.
- **Storage**: Saved to `tests` and `test_questions`.

### 5. AI Presentation (75" Smartboard Slide Deck)
- **Input**: Grade, Subject, Chapter, Slide count (8–15 slides).
- **Context**: Visual diagrams, key definitions, and student reflection pauses.
- **Generation**: Structured slide objects: `{ slide_number, title, bullet_points (max 4 per slide), teacher_tip, visual_prompt }`.
- **Validation**: High-contrast text constraint (no text blocks exceeding 40 words per slide to guarantee 75" display legibility).
- **Output**: Fullscreen slide player + PPTX download.
- **Storage**: Saved to `presentations`.

### 6. AI Concept Mind Map
- **Input**: Grade, Subject, Chapter.
- **Context**: Conceptual hierarchy and cross-topic links.
- **Generation**: Node-edge JSON graph: `{ nodes: [{ id, label, category }], edges: [{ from, to, relationship }] }`.
- **Validation**: Acyclic graph check; must contain central chapter node and 3–5 primary concept clusters.
- **Output**: High-resolution vector visual diagram.
- **Storage**: Saved to `mind_maps`.

### 7. AI Teaching Activity
- **Input**: Grade, Subject, Chapter, Available classroom resources (e.g. blackboard only, paper cups, ruler).
- **Context**: Hands-on NCERT activity guidelines and low-cost teaching aids (TLM).
- **Generation**: Step-by-step physical classroom exercise engaging pairs of students without digital hardware requirements.
- **Validation**: Safety guidelines check.
- **Output**: Actionable 5–10 minute activity card.

### 8. Saathi Genie (In-Class AI Assistant)
- **Input**: Natural language query from teacher (e.g. *"Give me an example of refraction using everyday objects"*).
- **Context**: Active class, subject, and current period timer.
- **Generation**: Concise, conversational pedagogical advice formatted with bulleted actionable steps.
- **Validation**: Filters queries to educational and pedagogical scopes only; rejects out-of-domain prompts.
- **Output**: Drawer chat message.
- **Storage**: Saved to temporary session message log.

---

## 4. AI Quality & Guardrail Checklist

```
           [Raw LLM Generation]
                     │
                     ▼
          1. Schema Validation (Zod / JSON Schema)
                     │ (Fail -> Regenerate)
                     ▼
          2. NCERT Syllabus Alignment Check
                     │ (Fail -> Reject / Flag)
                     ▼
          3. Language & Devanagari Terminology Check
                     │ (Ensure no corrupted Unicode or literal English transliterations)
                     ▼
          4. Duplicate Detection (Embedding Distance vs. Existing Question Bank)
                     │
                     ▼
          5. Educational Quality Gate (Blooms Taxonomy / NEP 2020 Compliance)
                     │
                     ▼
             [Approved & Saved]
```
