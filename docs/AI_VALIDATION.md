# TeacherSathi — AI Educational Validation Engine

## 1. Overview
Validation in TeacherSathi operates on two independent tiers:
1. **Tier 1: Structural Schema Validation** (Syntactic integrity via Zod).
2. **Tier 2: Pedagogical & Educational Rule Validation** (Deterministic educational business logic).

---

## 2. Educational Validation Rules Matrix

### 2.1 Lesson Plan Rules (`validateLessonPlan`)
- **Step Duration Coherence**: The sum of introduction duration, teaching step durations, and activity durations must equal the lesson plan's declared `duration_mins` (tolerance $\pm 5$ mins).
- **Formative Assessment Check**: At least one formative evaluation check is required before concluding the period.

### 2.2 Worksheet Rules (`validateWorksheet`)
- **Marks Arithmetic Equality**: The sum of marks across all questions in the worksheet MUST strictly equal `total_marks`.
- **MCQ Option Requirement**: Any question tagged with `question_type: 'MCQ'` must possess at least 2 (typically 4) choice options. Missing options cause critical validation failure.

### 2.3 Quiz Rules (`validateQuiz`)
- **Single Correct Answer**: Exactly one option in the 4-option array must have `is_correct: true`.
- **Key-Value Integrity**: `correct_option_id` must match the `id` of the option having `is_correct: true`.
- **Option Uniqueness**: No two options in a question may have identical text strings.

### 2.4 Test Paper Rules (`validateTestPaper`)
- **Section & Total Marks Alignment**: Sum of marks across all questions in all sections must equal `total_marks`.
- **Marking Scheme Presence**: Every descriptive question must specify criteria for teacher evaluation.

### 2.5 Smartboard Presentation Rules (`validatePresentation`)
- **Slide Count Match**: `slides.length` must strictly match `slide_count`.
- **75" Smartboard Readability**: Slides must not exceed 50 words per slide across bullet points. Excess words generate a warning.

### 2.6 Mind Map Rules (`validateMindMap`)
- **Graph Referencing**: Every edge (`from`, `to`) must refer to an existing node ID in `nodes` or `central_node`. Dangling edges cause critical validation failure.

### 2.7 Language & Script Rules (`containsDevanagari`)
- **Hindi Validation**: When `language: 'hi'` is requested, the serialized output must match `[\u0900-\u097F]`. Pure Latin-script responses are rejected with `VALIDATION_FAILED`.
