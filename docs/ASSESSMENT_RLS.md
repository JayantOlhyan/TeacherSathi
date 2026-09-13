# TeacherSathi — Assessment Row Level Security (RLS) Model

## 1. Overview
The Assessment Subsystem applies Supabase Row Level Security (RLS) across all six subsystem tables. RLS guarantees multi-tenant partitioning, prevents unauthorized assessment viewing, and isolates student attempts at the PostgreSQL kernel level.

---

## 2. Security Helper Functions

Defined in migration `supabase/migrations/20260911000006_assessment_subsystem.sql`:

```sql
-- Helper to verify whether a student is enrolled in a specific class
CREATE OR REPLACE FUNCTION public.is_student_in_class(p_class_id UUID, p_student_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.classes_students
        WHERE class_id = p_class_id AND student_id = p_student_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. Table-by-Table RLS Policies

### 3.1 `assessments`
* **Admins & School Staff**: Full access to view, create, and modify assessments in their school.
* **Teachers**:
  * Can view all published assessments within their school or authored by them.
  * Can create, update, and delete their own draft assessments.
  * Cannot modify assessments authored by other teachers or locked assessments.
* **Students**:
  * Can view an assessment if and only if it has `status = 'PUBLISHED'` and is linked to an active assignment assigned to a class the student belongs to.
* **Parents**:
  * Read-only view for assessments taken by their linked children.

### 3.2 `assessment_questions`
* **Admins & Teachers**:
  * Select, insert, update, delete for questions belonging to assessments they own or administer.
* **Students**:
  * Select only for questions belonging to an assessment assigned to their class, mediated through the stripped serialization pipeline.

### 3.3 `assignments`
* **Teachers & Admins**:
  * Insert/Update/Delete for assignments created within their assigned school/classes.
  * Select assignments for their school cohort.
* **Students**:
  * Select assignments where `class_id` matches a class they are enrolled in via `is_student_in_class(class_id, auth.uid())` and `status != 'ARCHIVED'`.

### 3.4 `assessment_attempts`
* **Students**:
  * `INSERT`: Can create an attempt if they are the authenticated user (`student_id = auth.uid()`) and are enrolled in the target assignment's class.
  * `SELECT`: Can view their own attempts (`student_id = auth.uid()`).
  * `UPDATE`: Can update an attempt if `student_id = auth.uid()` and current `status = 'IN_PROGRESS'`.
* **Teachers**:
  * `SELECT`: Can view all attempts for assignments they created or classes they teach.
  * `UPDATE`: Can update attempt status (e.g. for manual score adjustments or re-opening an attempt).

### 3.5 `attempt_answers`
* **Students**:
  * `INSERT` & `UPDATE`: Can save or change their own answers as long as the parent attempt belongs to them (`attempt.student_id = auth.uid()`) and the attempt status is `'IN_PROGRESS'`.
  * `SELECT`: Can view their own answers.
* **Teachers**:
  * `SELECT`: Can view all answers for students in their assigned classes.
  * `UPDATE`: Can update `marks_awarded`, `grading_status`, and `teacher_feedback` for subjective grading.

### 3.6 `assessment_results`
* **Students**:
  * `SELECT`: Can view their own result record (`student_id = auth.uid()`) provided the assessment allows viewing results (`show_result_after_submission = true` or teacher has published results).
* **Teachers & School Admins**:
  * `SELECT`: Can view results for all students who took assessments assigned by the school.
* **System Service Role**:
  * Full read/write for transactional grading and calculation workers.

---

## 4. Policy Matrix

| Table | Operation | Role: Student | Role: Teacher | Role: School Admin |
| :--- | :--- | :--- | :--- | :--- |
| `assessments` | `SELECT` | Assigned to student's class | Own or School Published | All in School |
| `assessments` | `INSERT` / `UPDATE` | Prohibited | Own drafts | All in School |
| `assignments` | `SELECT` | Enrolled classes only | Own classes / School | All in School |
| `assignments` | `INSERT` / `UPDATE` | Prohibited | Own classes | All in School |
| `assessment_attempts` | `INSERT` | Own attempt (enrolled) | Prohibited | Prohibited |
| `assessment_attempts` | `SELECT` | Own attempts | Assigned classes | All in School |
| `assessment_attempts` | `UPDATE` | Own (`IN_PROGRESS` only) | Override / Regrade | All in School |
| `attempt_answers` | `INSERT` / `UPDATE` | Own (`IN_PROGRESS` only) | Grade / Review | Override |
| `attempt_answers` | `SELECT` | Own answers | Assigned classes | All in School |
| `assessment_results` | `SELECT` | Own result (if released) | Class cohorts | All in School |
