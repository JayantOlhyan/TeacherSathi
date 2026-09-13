# TeacherSathi — Assessment Data Model Specification

## 1. Schema Overview
The Assessment Subsystem database layer is provisioned via `supabase/migrations/20260911000006_assessment_subsystem.sql`. It defines a relational ledger supporting assessment composition, question immutability via snapshots, assignment schedules, student attempt sessions, autosaved answers, and aggregate results.

---

## 2. Enumerations

### 2.1 `assessment_type`
Identifies the pedagogical category and delivery model of the assessment:
* `'MCQ_QUIZ'`: Rapid formative objective checks.
* `'TEST_PAPER'`: High-stakes periodic tests or mock board exams with negative marking options.
* `'WORKSHEET'`: Practice problem sheets for classroom or home reinforcement.
* `'ASSIGNMENT'`: Long-form or structured homework.

### 2.2 `assessment_status`
Represents the authoring lifecycle of an assessment:
* `'DRAFT'`: Editable by the creating teacher; not visible to students.
* `'PUBLISHED'`: Immutable core metadata and question snapshots; available for class assignment.
* `'ARCHIVED'`: Retired from future assignments; historical records remain queryable.

### 2.3 `assignment_status`
Represents the delivery status of a class assignment:
* `'ACTIVE'`: Open for student test taking (subject to start/due timestamps).
* `'CLOSED'`: Assignment window expired; no new attempts permitted.
* `'ARCHIVED'`: Concluded and archived by the instructor.

### 2.4 `attempt_status`
Represents the state machine of a student attempt session:
* `'NOT_STARTED'`: Record initialized but student has not entered exam player.
* `'IN_PROGRESS'`: Student is actively answering questions; timer is running.
* `'SUBMITTED'`: Student completed exam and submitted before timer expiry.
* `'TIMED_OUT'`: Duration expired; automatically closed by the server.
* `'ABANDONED'`: Left incomplete past the assignment window.
* `'EVALUATED'`: Grading complete; ledger finalized.

### 2.5 `answer_grading_status`
Tracks the evaluation state of an individual question answer:
* `'PENDING'`: Answer submitted but not yet evaluated.
* `'CORRECT'`: Graded as correct with full positive marks awarded.
* `'INCORRECT'`: Graded as incorrect; positive marks zeroed and negative deduction applied if configured.
* `'PARTIALLY_CORRECT'`: Partial marks allocated (for multi-select or rubric criteria).
* `'MANUAL_REVIEW'`: Subjective or essay answer requiring teacher evaluation.

---

## 3. Entity-Relationship Model

```
+---------------------------------------------------------------------------------------------------+
|                                      CURRICULUM / SCHOOL HIERARCHY                                |
|                                                                                                   |
|   +-------------------+        +--------------------+        +--------------------+               |
|   |      schools      |        |      classes       |        |       users        |               |
|   +---------+---------+        +---------+----------+        +---------+----------+               |
+-------------|----------------------------|-----------------------------|--------------------------+
              |                            |                             |
              | 1:N                        | 1:N                         | 1:N (created_by)
              v                            |                             v
+-------------+----------------------------|-----------------------------+--------------------------+
|                                  ASSESSMENT DEFINITION                                            |
|                                                                                                   |
|   +-------------------------------------------------------------------------------+               |
|   | assessments                                                                   |               |
|   | - id: UUID (PK)                                                               |               |
|   | - school_id: UUID (FK -> schools)                                             |               |
|   | - created_by: UUID (FK -> users)                                              |               |
|   | - title, description, assessment_type, status, version                        |               |
|   | - grade_id, subject_id, chapter_id, topic_id                                  |               |
|   | - total_marks, passing_marks, duration_minutes                                |               |
|   | - negative_marking, negative_mark_value, shuffle_questions, shuffle_options   |               |
|   | - show_result_after_submission, max_attempts                                  |               |
|   +---------------------------------------+---------------------------------------+               |
|                                           | 1:N                                                   |
|                                           v                                                       |
|   +-------------------------------------------------------------------------------+               |
|   | assessment_questions                                                          |               |
|   | - id: UUID (PK)                                                               |               |
|   | - assessment_id: UUID (FK -> assessments ON DELETE CASCADE)                   |               |
|   | - question_id: UUID (FK -> questions ON DELETE SET NULL)                      |               |
|   | - question_snapshot: JSONB (Full immutable copy of question at authoring)     |               |
|   | - sequence_order: INTEGER                                                     |               |
|   | - marks: NUMERIC(5,2)                                                         |               |
|   | - negative_marks: NUMERIC(5,2)                                                |               |
|   +---------------------------------------+---------------------------------------+               |
+-------------------------------------------|-------------------------------------------------------+
                                            |
                                            | 1:N (assessment_id)
                                            v
+-------------------------------------------+-------------------------------------------------------+
|                                    CLASS ASSIGNMENT                                               |
|                                                                                                   |
|   +-------------------------------------------------------------------------------+               |
|   | assignments                                                                   |               |
|   | - id: UUID (PK)                                                               |               |
|   | - assessment_id: UUID (FK -> assessments ON DELETE CASCADE)                   |               |
|   | - class_id: UUID (FK -> classes ON DELETE CASCADE)                            |               |
|   | - assigned_by: UUID (FK -> users)                                             |               |
|   | - school_id: UUID (FK -> schools)                                             |               |
|   | - title, instructions, starts_at, due_at, status                              |               |
|   +---------------------------------------+---------------------------------------+               |
|                                           | 1:N                                                   |
+-------------------------------------------|-------------------------------------------------------+
                                            |
                                            v
+-------------------------------------------+-------------------------------------------------------+
|                                  STUDENT ATTEMPT & LEDGER                                         |
|                                                                                                   |
|   +-------------------------------------------------------------------------------+               |
|   | assessment_attempts                                                           |               |
|   | - id: UUID (PK)                                                               |               |
|   | - assignment_id: UUID (FK -> assignments ON DELETE CASCADE)                   |               |
|   | - assessment_id: UUID (FK -> assessments ON DELETE CASCADE)                   |               |
|   | - student_id: UUID (FK -> users)                                              |               |
|   | - attempt_number: INTEGER                                                     |               |
|   | - status: attempt_status                                                      |               |
|   | - started_at, submitted_at: TIMESTAMPTZ                                       |               |
|   | - time_spent_seconds: INTEGER                                                 |               |
|   | - auto_submitted: BOOLEAN                                                     |               |
|   | - client_metadata: JSONB                                                      |               |
|   +-------------------+-----------------------------------+-----------------------+               |
|                       | 1:N                               | 1:1                                   |
|                       v                                   v                                       |
|   +-----------------------------------+   +-----------------------------------------------+       |
|   | attempt_answers                   |   | assessment_results                            |       |
|   | - id: UUID (PK)                   |   | - id: UUID (PK)                               |       |
|   | - attempt_id: UUID (FK)           |   | - attempt_id: UUID (FK, UNIQUE)               |       |
|   | - assessment_question_id: UUID    |   | - assessment_id, assignment_id, student_id    |       |
|   | - student_answer: TEXT / JSON     |   | - total_questions, attempted_questions        |       |
|   | - marks_awarded: NUMERIC(5,2)     |   | - correct_answers, incorrect_answers          |       |
|   | - grading_status: status          |   | - unattempted_questions                       |       |
|   | - teacher_feedback: TEXT          |   | - score, percentage, is_passed, grade, rank   |       |
|   | - UNIQUE(attempt_id, question_id) |   | - class_average, percentile                   |       |
|   +-----------------------------------+   +-----------------------------------------------+       |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Detailed Table Specifications

### 4.1 `assessments`
Stores the high-level assessment definition, configuration rules, and security flags.

```sql
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type public.assessment_type NOT NULL DEFAULT 'MCQ_QUIZ',
    grade_id VARCHAR(50) NOT NULL,
    subject_id VARCHAR(50) NOT NULL,
    chapter_id VARCHAR(100),
    topic_id VARCHAR(100),
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 0,
    passing_marks NUMERIC(6, 2) NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    negative_marking BOOLEAN NOT NULL DEFAULT FALSE,
    negative_mark_value NUMERIC(4, 2) DEFAULT 0.25,
    shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
    shuffle_options BOOLEAN NOT NULL DEFAULT FALSE,
    show_result_after_submission BOOLEAN NOT NULL DEFAULT TRUE,
    max_attempts INTEGER NOT NULL DEFAULT 1,
    status public.assessment_status NOT NULL DEFAULT 'DRAFT',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.2 `assessment_questions`
Represents an ordered question in an assessment. Stores an immutable JSON snapshot of the question at authoring time to insulate student attempts from downstream question bank edits.

```sql
CREATE TABLE public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    question_snapshot JSONB NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    marks NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    negative_marks NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Question Snapshot JSON Schema
```json
{
  "id": "uuid",
  "question_type": "MCQ | TRUE_FALSE | FILL_BLANKS | SHORT_ANSWER | LONG_ANSWER",
  "question_text": "string",
  "options": [
    { "id": "A", "text": "Option 1", "is_correct": true },
    { "id": "B", "text": "Option 2", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "Explanation string",
  "difficulty": "EASY | MEDIUM | HARD",
  "taxonomy": "REMEMBER | UNDERSTAND | APPLY | ANALYZE | EVALUATE | CREATE"
}
```

### 4.3 `assignments`
Links an assessment to a target classroom cohort with due dates and delivery instructions.

```sql
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    due_at TIMESTAMPTZ,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    status public.assignment_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.4 `assessment_attempts`
Manages the lifecycle of a student's examination session.

```sql
CREATE TABLE public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    status public.attempt_status NOT NULL DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    auto_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    client_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.5 `attempt_answers`
Stores each response submitted by the student, with debounced autosave updates and grading status.

```sql
CREATE TABLE public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    assessment_question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    marks_awarded NUMERIC(5, 2) DEFAULT 0.00,
    grading_status public.answer_grading_status NOT NULL DEFAULT 'PENDING',
    teacher_feedback TEXT,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, assessment_question_id)
);
```

### 4.6 `assessment_results`
Permanent ledger of the final evaluation of an attempt, storing objective counts, computed marks, and class-level relative metrics.

```sql
CREATE TABLE public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL UNIQUE REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL DEFAULT 0,
    attempted_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    unattempted_questions INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    is_passed BOOLEAN NOT NULL DEFAULT FALSE,
    grade VARCHAR(10),
    rank INTEGER,
    class_average NUMERIC(5, 2),
    percentile NUMERIC(5, 2),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 5. Performance Indexes

```sql
CREATE INDEX idx_assessments_school_status ON public.assessments (school_id, status);
CREATE INDEX idx_assessments_curriculum ON public.assessments (grade_id, subject_id, chapter_id);
CREATE INDEX idx_assessments_created_by ON public.assessments (created_by);

CREATE INDEX idx_assessment_questions_assessment ON public.assessment_questions (assessment_id, sequence_order);

CREATE INDEX idx_assignments_class_status ON public.assignments (class_id, status);
CREATE INDEX idx_assignments_assessment ON public.assignments (assessment_id);

CREATE INDEX idx_attempts_student_assignment ON public.assessment_attempts (student_id, assignment_id);
CREATE INDEX idx_attempts_assessment ON public.assessment_attempts (assessment_id);
CREATE INDEX idx_attempts_status ON public.assessment_attempts (status);

CREATE INDEX idx_attempt_answers_attempt ON public.attempt_answers (attempt_id);

CREATE INDEX idx_assessment_results_assessment ON public.assessment_results (assessment_id);
CREATE INDEX idx_assessment_results_assignment ON public.assessment_results (assignment_id);
CREATE INDEX idx_assessment_results_student ON public.assessment_results (student_id);
```
