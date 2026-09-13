# TeacherSathi — Academic Analytics Row Level Security (RLS) Specification

## 1. Security Architecture & Helper Functions

All analytical tables introduced in Phase 5 enforce strict PostgreSQL Row Level Security (RLS). To support efficient, secure teacher lookups without cyclical policies or N+1 query overhead, a security-definer helper function was provisioned in `20260911000007_academic_intelligence.sql`.

### 1.1 Helper Function: `is_teacher_of_student`

```sql
CREATE OR REPLACE FUNCTION is_teacher_of_student(p_teacher_id UUID, p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    WHERE cs.student_id = p_student_id
      AND (
        c.teacher_id = p_teacher_id
        OR EXISTS (
          SELECT 1 FROM class_teachers ct
          WHERE ct.class_id = c.id AND ct.teacher_id = p_teacher_id
        )
      )
  );
$$;
```

* **`SECURITY DEFINER`**: Bypasses recursive table-level checks during permission evaluation.
* **`SET search_path = public`**: Prevents search-path hijacking vulnerabilities.
* **`STABLE`**: Enables PostgreSQL query planner to cache results within a single query execution.

---

## 2. Table Policy Specifications

### 2.1 Table: `student_concept_mastery`

| Policy Name | Action | Target Role | Permissive Rule (USING / WITH CHECK) |
| :--- | :--- | :--- | :--- |
| `scm_student_select` | `SELECT` | `authenticated` | `auth.uid() = student_id` |
| `scm_teacher_select` | `SELECT` | `authenticated` | `is_teacher_of_student(auth.uid(), student_id)` |
| `scm_school_admin_select` | `SELECT` | `authenticated` | `EXISTS (SELECT 1 FROM profiles p_stu JOIN profiles p_admin ON p_admin.id = auth.uid() WHERE p_stu.id = student_concept_mastery.student_id AND p_stu.school_id = p_admin.school_id AND p_admin.role = 'school_admin')` |
| `scm_superadmin_all` | `ALL` | `authenticated` | `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')` |
| `scm_service_role_all` | `ALL` | `service_role` | `true` |

---

### 2.2 Table: `concept_mastery_history`

| Policy Name | Action | Target Role | Permissive Rule (USING / WITH CHECK) |
| :--- | :--- | :--- | :--- |
| `cmh_student_select` | `SELECT` | `authenticated` | `auth.uid() = student_id` |
| `cmh_teacher_select` | `SELECT` | `authenticated` | `is_teacher_of_student(auth.uid(), student_id)` |
| `cmh_school_admin_select` | `SELECT` | `authenticated` | `EXISTS (SELECT 1 FROM profiles p_stu JOIN profiles p_admin ON p_admin.id = auth.uid() WHERE p_stu.id = concept_mastery_history.student_id AND p_stu.school_id = p_admin.school_id AND p_admin.role = 'school_admin')` |
| `cmh_superadmin_all` | `ALL` | `authenticated` | `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')` |
| `cmh_service_role_all` | `ALL` | `service_role` | `true` |

---

### 2.3 Table: `learning_gaps`

| Policy Name | Action | Target Role | Permissive Rule (USING / WITH CHECK) |
| :--- | :--- | :--- | :--- |
| `lg_student_select` | `SELECT` | `authenticated` | `auth.uid() = student_id` |
| `lg_teacher_all` | `ALL` | `authenticated` | `is_teacher_of_student(auth.uid(), student_id)` |
| `lg_school_admin_all` | `ALL` | `authenticated` | `EXISTS (SELECT 1 FROM profiles p_stu JOIN profiles p_admin ON p_admin.id = auth.uid() WHERE p_stu.id = learning_gaps.student_id AND p_stu.school_id = p_admin.school_id AND p_admin.role = 'school_admin')` |
| `lg_superadmin_all` | `ALL` | `authenticated` | `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')` |
| `lg_service_role_all` | `ALL` | `service_role` | `true` |

---

### 2.4 Table: `question_metrics`

| Policy Name | Action | Target Role | Permissive Rule (USING / WITH CHECK) |
| :--- | :--- | :--- | :--- |
| `qm_read_authenticated` | `SELECT` | `authenticated` | `true` |
| `qm_service_role_all` | `ALL` | `service_role` | `true` |

---

### 2.5 Table: `interventions`

| Policy Name | Action | Target Role | Permissive Rule (USING / WITH CHECK) |
| :--- | :--- | :--- | :--- |
| `interventions_teacher_all` | `ALL` | `authenticated` | `auth.uid() = teacher_id` |
| `interventions_student_select` | `SELECT` | `authenticated` | `(student_id = auth.uid() OR class_id IN (SELECT class_id FROM class_students WHERE student_id = auth.uid())) AND status = 'ASSIGNED'` |
| `interventions_school_admin_select` | `SELECT` | `authenticated` | `EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'school_admin' AND p.school_id = interventions.school_id)` |
| `interventions_superadmin_all` | `ALL` | `authenticated` | `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')` |
| `interventions_service_role_all` | `ALL` | `service_role` | `true` |

---

## 3. Database Indexes & Query Optimization

To guarantee sub-100ms dashboard queries even with hundreds of thousands of student attempts, the following composite B-tree indexes are active:

```sql
CREATE INDEX idx_scm_student_concept ON student_concept_mastery(student_id, concept_id);
CREATE INDEX idx_scm_concept ON student_concept_mastery(concept_id);
CREATE INDEX idx_cmh_student_concept ON concept_mastery_history(student_id, concept_id, calculated_at DESC);
CREATE INDEX idx_lg_student_status ON learning_gaps(student_id, status);
CREATE INDEX idx_lg_concept ON learning_gaps(concept_id);
CREATE INDEX idx_qm_question ON question_metrics(question_id);

-- Interventions indexes
CREATE INDEX idx_interventions_gap ON interventions(gap_id);
CREATE INDEX idx_interventions_teacher ON interventions(teacher_id);
CREATE INDEX idx_interventions_class ON interventions(class_id);
CREATE INDEX idx_interventions_student ON interventions(student_id);
CREATE INDEX idx_interventions_concept ON interventions(concept_id);
CREATE INDEX idx_interventions_status ON interventions(status);
```
