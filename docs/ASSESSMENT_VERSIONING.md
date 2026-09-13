# TeacherSathi — Assessment Versioning & Snapshot Immutability

## 1. The Immutability Challenge in Education
In an academic platform, assessments and question banks evolve continuously. Teachers refine distractors, fix typos, update diagrams, or align with updated NCERT syllabi. However, historical student attempts and official grade transcripts must remain 100% reproducible and tamper-proof:
* If a question in the master question bank has its correct answer or wording edited next year, a student who took that test today must still be graded and audited against the *exact text and answer key they saw*.
* Changing a question's marks in a master template must never retroactively alter a student's graded percentage or GPA.

To solve this, TeacherSathi implements **Question Snapshot Immutability** and **Assessment Version Locking**.

---

## 2. Snapshot Architecture

When questions are added to an assessment, the system does not simply store a foreign key pointer `question_id`. Instead, it creates an authoritative, immutable snapshot in `assessment_questions.question_snapshot`:

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

### 2.1 Benefits of the Snapshot
1. **Orphan Proof**: If the master question in `questions` is deleted or purged, `question_id` becomes `NULL` (via `ON DELETE SET NULL`), but `question_snapshot` remains completely intact.
2. **Deterministic Grading**: The server grading engine evaluates student answers strictly against `question_snapshot->>'correct_answer'`. Master question bank edits have zero side effects on existing assessments.
3. **Zero Joins for Testing**: Loading an exam for 1,000 concurrent students requires querying only `assessment_questions` rather than performing multi-table joins across `questions`, `question_options`, and `curriculum`.

---

## 3. Assessment Version Locking

### 3.1 Draft State (`status = 'DRAFT'`)
* The teacher has full editorial freedom.
* Questions can be added, reordered, edited, or removed.
* Total marks and duration can be modified.
* No students can view or attempt the assessment.

### 3.2 Published State (`status = 'PUBLISHED'`)
* Calling `POST /api/assessments/:id/publish` locks the assessment.
* The system computes final `total_marks` by summing `assessment_questions.marks`.
* Subsequent attempts to mutate `total_marks`, duration, or question order via `PATCH /api/assessments/:id` are rejected with HTTP 400.
* If a teacher needs to modify an assessment after publishing, the UI prompts them to **"Create New Version"** (cloning the assessment with an incremented `version` counter: `version = parent.version + 1`).

---

## 4. CBSE Regulatory & Audit Compliance

CBSE examination guidelines mandate that:
1. Student answer scripts must be retrievable and verifiable for at least 3 years following examination.
2. The exact question paper presented to the student must be reconstructible.
3. In case of dispute over an ambiguous question, the exact wording and option set presented during the test window must be verifiable.

TeacherSathi guarantees full compliance:
* `assessment_attempts` records the exact `started_at`, `submitted_at`, and student responses.
* `assessment_questions.question_snapshot` records the exact options and phrasing presented.
* `assessment_results` records the deterministic breakdown and grade computation.
* Any administrative audit can replay the evaluation algorithm years later and arrive at the exact same score down to the second decimal place.
