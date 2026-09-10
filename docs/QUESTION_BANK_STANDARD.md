# TeacherSathi — Question Bank Content Standard

> **Status**: Frozen Standard (Phase 0)  
> **Purpose**: Definitive pedagogical and architectural specification for all assessment items.

---

## 1. TeacherSathi Question Bank Content Standard

Every canonical chapter in the TeacherSathi repository must be supported by a minimum standardized bank of 30 curated questions divided into three distinct pedagogical tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ SECTION A: Short Answer / Core Conceptual Recall                       │
│ 10 Questions × 2 Marks = 20 Marks                                      │
│ Required Answer Length: 30–50 Words                                    │
│ Focus: Foundational definitions, direct formula applications, key laws. │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION B: Analytical & Application Questions                          │
│ 10 Questions × 3 Marks = 30 Marks                                      │
│ Required Answer Length: 60–80 Words                                    │
│ Focus: Cause-and-effect, numerical word problems, comparative tables.   │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION C: Long Answer, Diagrammatic & Evaluative Questions             │
│ 10 Questions × 4 Marks = 40 Marks                                      │
│ Required Answer Length: 100–140 Words                                  │
│ Focus: Multi-step derivations, labeled diagrams, case-based analysis.   │
└────────────────────────────────────────────────────────────────────────┘
```

### Mandatory Curricular Coverage
Questions for every chapter must collectively cover:
1. **Core NCERT Concepts**: Foundational principles and textbook definitions.
2. **Textual Questions & In-Text Exercises**: Official NCERT back-of-chapter questions.
3. **NCERT Laboratory Activities**: Practical experiments, observations, and inferred conclusions.
4. **Important Exemplar Problems**: Multi-step problems requiring mathematical or logical rigor.
5. **Diagrams, Maps & Tables**: Visual interpretation, ray diagrams, anatomical sketches, historical maps.
6. **Literature & Grammatical Elements**: For English and Hindi subjects (themes, poetic devices, character sketches).
7. **Competency-Based Questions (CBSE / NEP 2020)**: Real-life scenario problem solving.
8. **HOTS (Higher Order Thinking Skills)**: Evaluative questions challenging critical reasoning.
9. **Analytical Questions**: Data interpretation and contrasting phenomena.

---

## 2. Technical Data Schema for Questions

Every question item in the database must adhere to the following schema:

```typescript
interface CanonicalQuestion {
  id: string; // UUID
  chapter_id: string; // Foreign key to chapters table
  concept_id?: string; // Foreign key to concepts table
  section_tier: "SECTION_A" | "SECTION_B" | "SECTION_C";
  question_type: "MCQ" | "VERY_SHORT" | "SHORT_ANSWER" | "LONG_ANSWER" | "DIAGRAM" | "CASE_BASED";
  marks: 1 | 2 | 3 | 4 | 5;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  bloom_level: "REMEMBER" | "UNDERSTAND" | "APPLY" | "ANALYZE" | "EVALUATE" | "CREATE";
  
  // Bilingual Content
  text_en: string;
  text_hi: string;
  
  // MCQ Options (if question_type === 'MCQ')
  options?: Array<{
    id: "A" | "B" | "C" | "D";
    text_en: string;
    text_hi: string;
    is_correct: boolean;
  }>;

  // Answer & Marking Scheme
  marking_scheme: {
    expected_word_count: string; // e.g. "60-80 words"
    step_criteria: string[]; // Step marks breakdown
    model_answer_en: string;
    model_answer_hi: string;
  };

  pedagogical_explanation_en: string;
  pedagogical_explanation_hi: string;
  
  source: string; // e.g. "NCERT Class 10 Science Exemplar Page 142"
  tags: string[]; // e.g. ["Ray Diagram", "Convex Mirror", "CBSE 2024"]
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  version: number;
}
```

---

## 3. Current Implementation Audit & Technical Gaps

| Assessment Surface | Current State in Codebase | Technical Gap / Production Risk |
| :--- | :--- | :--- |
| **Interactive Quiz (`/quiz`)** | Fetches static JSON from `public/quizzes/${grade}-${subject}-${chapter}.json`. | **File-system bound**: Adding or correcting a question requires redeploying static JSON files. Not in a database. |
| **Chapter Test (`/test`)** | Single question hardcoded directly into JSX in `src/app/[locale]/content/.../test/page.tsx`. | **Static Mock**: Only 1 question exists in the UI; question matrix 1–25 is visual mock only. |
| **Question Bank (`/qa`)** | Static JSON reader in `public/qa/*.json`. | Read-only; lacks section classification and Bloom's metadata. |
| **Admin Questions (`/admin/questions`)** | CRUD operations stored in browser `localStorage` (`adminStore.ts`). | **High Data Loss Risk**: Admin imports and changes are wiped whenever browser cache is cleared. |
| **Duplication Control** | None currently implemented. | Importing bulk questions risks duplicate entries across chapters. |
| **Section Standards** | Unenforced in existing JSON files (quizzes have 5-10 random MCQs without Section A/B/C division). | Canonical database in Phase 1 must enforce the 10 $\times$ 2m, 10 $\times$ 3m, 10 $\times$ 4m distribution. |
