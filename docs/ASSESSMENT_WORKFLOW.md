# TeacherSathi — Academic Assessment Workflow

## 1. End-to-End Workflow Lifecycle

The TeacherSathi Assessment Subsystem models the complete academic lifecycle from curriculum-aligned authoring to student evaluation and pedagogical intervention.

```
       TEACHER WORKFLOW                                      STUDENT WORKFLOW
 +---------------------------+
 |   1. Create Assessment    |
 | - Manual Questions OR     |
 | - AI Kit Conversion       |
 +-------------+-------------+
               |
               v
 +---------------------------+
 |   2. Publish Assessment   |
 | - Total Marks Calculated  |
 | - Snapshots Frozen        |
 +-------------+-------------+
               |
               v
 +---------------------------+
 |   3. Assign to Class      |
 | - Pick Class Cohort       |
 | - Set Due Date / Windows  |
 +-------------+-------------+
               |
               +----------------------------------------+
                                                        |
                                                        v
                                          +---------------------------+
                                          | 4. Discover Assignment    |
                                          | - Due Dates, Max Attempts |
                                          +-------------+-------------+
                                                        |
                                                        v
                                          +---------------------------+
                                          | 5. Start Attempt Session  |
                                          | - Server Validates Window |
                                          | - Masks Correct Keys      |
                                          +-------------+-------------+
                                                        |
                                                        v
                                          +---------------------------+
                                          | 6. Exam Environment       |
                                          | - Real-time Countdown     |
                                          | - Autosaved Answers       |
                                          | - Flag for Review         |
                                          +-------------+-------------+
                                                        |
                                                        v
                                          +---------------------------+
                                          | 7. Submit / Auto-Submit   |
                                          | - Server-Side Evaluation  |
                                          | - Negative Marks Handled  |
                                          +-------------+-------------+
                                                        |
               +----------------------------------------+
               |
               v
 +---------------------------+            +---------------------------+
 | 8. Teacher Analytics      |            | 9. Formative Result View  |
 | - Pass Rate & Averages    |            | - Score & Passing Status  |
 | - Item Difficulty Analysis|            | - Explanations (if shown) |
 +---------------------------+            +---------------------------+
```

---

## 2. Detailed Phase Workflows

### 2.1 Authoring Workflow

#### Path A: Manual Assessment Authoring
1. Teacher navigates to `/[locale]/dashboard/assessments/create`.
2. Sets title, assessment type (`MCQ_QUIZ`, `TEST_PAPER`, `WORKSHEET`, `ASSIGNMENT`), curriculum mapping (`grade_id`, `subject_id`, `chapter_id`, `topic_id`), duration, passing marks, and policy flags (`negative_marking`, `shuffle_questions`, `max_attempts`).
3. Inputs questions manually with 4 options, marks, and explanation.
4. Submits payload to `POST /api/assessments`.
5. Server creates `assessments` record and deep-inserts `assessment_questions` with serialized `question_snapshot` records.

#### Path B: AI Resource Conversion
1. Teacher generates a quiz or lesson plan using the AI Generator.
2. Clicks "Convert to Assessment" in the UI.
3. Client posts to `POST /api/assessments/ai-convert` with `resource_id`.
4. Server parses the AI JSON content, validates schema, calculates total marks, and creates a ready-to-assign `assessments` record and associated question snapshots.

### 2.2 Publishing & Immutability Workflow
1. Teacher reviews draft assessment at `/[locale]/dashboard/assessments`.
2. Calls `POST /api/assessments/[id]/publish`.
3. Server transitions `status` from `'DRAFT'` to `'PUBLISHED'`.
4. Once published, subsequent edits to question text or marks are rejected to preserve data integrity for existing or future attempts.

### 2.3 Assignment Distribution Workflow
1. Teacher triggers assignment dialog from the assessment list or detail page.
2. Specifies target `class_id`, `due_at`, `starts_at`, and optional instructions.
3. Calls `POST /api/assessments/[id]/assign` (or `POST /api/assignments`).
4. Server creates an `assignments` record with status `'ACTIVE'`.
5. The assignment is immediately queryable by all enrolled students in that class.

---

## 3. Student Examination Lifecycle

### 3.1 Discovery & Eligibility
1. Student navigates to `/[locale]/student/assignments`.
2. Client queries `GET /api/assignments`.
3. The server checks student class enrollments via `classes_students` and returns assigned tasks categorized into:
   * **Pending / Due Soon**: Not yet attempted or in progress.
   * **Completed**: Submitted with results.
4. When student clicks "Start Assessment", client issues `POST /api/assessments/[id]/attempts`.
5. The server enforces security checks:
   * Verify current timestamp >= `starts_at`.
   * Verify current timestamp <= `due_at` (unless teacher permits late submissions).
   * Verify existing attempt count < `max_attempts`.
   * If an active `'IN_PROGRESS'` attempt already exists, returns that session rather than creating duplicate sessions.
6. Returns `attempt` object and stripped question list (without `is_correct`, `model_answer`, or `explanation`).

### 3.2 Live Exam Environment
1. Student enters the exam player at `/[locale]/student/assessments/[id]/attempt`.
2. Client calculates remaining seconds: `Math.max(0, (started_at + duration_minutes * 60) - now())`.
3. Student selects option:
   * Answer immediately updates local React state.
   * Debounced background call issues `PATCH /api/attempts/[id]/answers`.
   * Server validates that current timestamp <= `started_at + duration_minutes + 60s grace`.
   * Server upserts row in `attempt_answers` with `uq_attempt_question`.
4. Question Navigator displays visual cues:
   * **Green**: Answered
   * **Yellow**: Flagged for review
   * **Gray**: Unattempted
   * **Blue ring**: Current active question

### 3.3 Finalization & Submission
1. **Manual Submission**:
   * Student clicks "Submit Assessment".
   * Modal shows summary: attempted vs unattempted vs flagged.
   * Confirmation calls `POST /api/attempts/[id]/submit`.
2. **Auto-Submission on Timer Expiry**:
   * When local countdown reaches `00:00`, UI automatically triggers `POST /api/attempts/[id]/submit` with `{ auto_submitted: true }`.
   * If client disconnects before submitting, server marks late submissions as `TIMED_OUT` and runs evaluation.

---

## 4. Evaluation & Results Workflow

### 4.1 Server-Authoritative Grading
1. `submitAttempt` repository method executes inside a transaction.
2. Updates `assessment_attempts`:
   * `status = 'SUBMITTED'`
   * `submitted_at = NOW()`
   * `time_spent_seconds = EXTRACT(EPOCH FROM (submitted_at - started_at))`
3. Iterates over all `assessment_questions` for the assessment:
   * Compares `attempt_answers.student_answer` against `question_snapshot.correct_answer`.
   * Correct: Marks awarded = `question.marks`, `grading_status = 'CORRECT'`.
   * Incorrect: Marks awarded = `negative_marking ? -negative_marks : 0`, `grading_status = 'INCORRECT'`.
   * Unattempted: Marks awarded = `0`, `grading_status = 'PENDING'`.
   * Subjective: `grading_status = 'MANUAL_REVIEW'`.
4. Writes entry to `assessment_results`:
   * `score`: Sum of marks awarded (floored at 0 if negative).
   * `percentage`: `(score / total_marks) * 100`.
   * `is_passed`: `score >= passing_marks`.
   * `grade`: Letter grade computed from percentage (`A+` to `F`).
5. Updates `assessment_attempts.status = 'EVALUATED'`.

### 4.2 Formative Feedback Display
1. Student is redirected to `/[locale]/student/assessments/[id]/result`.
2. If `show_result_after_submission` is enabled, question review renders:
   * Student's selected option.
   * Correct option.
   * Detailed explanation and NCERT curriculum link.
3. If disabled (summative / board simulation), only confirmation of submission is shown until instructor releases results.

### 4.3 Teacher Pedagogical Review & Diagnostics
1. Teacher visits `/[locale]/dashboard/assessments/[id]/results`.
2. Class Summary Cards:
   * Submission Rate: `% of assigned students who submitted`.
   * Class Average Score & Percentage.
   * Pass Rate.
3. Item Analysis & Difficulty Diagnostics:
   * Identifies questions with error rates > 50% as "High Difficulty / Needs Classroom Review".
   * Flags topics where misconceptions are clustered.
4. Student Attempt Ledger:
   * Sortable table of all students with score, time spent, auto-submit flag, and link to individual response sheet.
