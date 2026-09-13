# TeacherSathi — Assessment Security & Integrity Architecture

## 1. Security Objectives
The Assessment Subsystem handles high-stakes examinations and formative assessments across multi-tenant schools. Security architecture enforces:
1. **Answer Key Secrecy**: Absolute prevention of answer key leaks to client runtimes before evaluation.
2. **Clock Tampering Immunity**: Inability of students to extend exam time by manipulating client system clocks.
3. **Multi-Tenant Data Isolation**: Complete partitioning across schools and classes.
4. **Grading Integrity**: All scores and negative deductions computed server-side in trusted environments.
5. **Retake & Attempt Bounds**: Strict enforcement of attempt quotas and start/due windows.

---

## 2. Answer Key Masking & Information Hiding

### 2.1 Stripping Pipeline
When an assessment or active attempt is retrieved by or on behalf of a student:
1. The repository invocation specifies `forStudent: true` (or detects role `STUDENT`).
2. The question serialization layer processes the `question_snapshot` JSONB object:
   * **Stripped**: `correct_answer`, `explanation`, `model_answer`.
   * **Options Array**: In each option object `{ id, text, is_correct }`, the boolean field `is_correct` is deleted before serialization.
3. The sanitized payload delivered over HTTP contains only:
   ```json
   {
     "id": "q1",
     "question_text": "What is the unit of electric current?",
     "options": [
       { "id": "A", "text": "Volt" },
       { "id": "B", "text": "Ampere" },
       { "id": "C", "text": "Ohm" },
       { "id": "D", "text": "Watt" }
     ],
     "marks": 1.0,
     "negative_marks": 0.25
   }
   ```
4. Even if an adversary inspects network payloads or React DevTools state, the answer key does not exist on the client device.

### 2.2 Controlled Reveal
The full answer key and pedagogical explanation are only exposed when:
1. The student's attempt status is `SUBMITTED`, `TIMED_OUT`, or `EVALUATED`.
2. The assessment configuration has `show_result_after_submission: true`.
3. The request is authenticated by the student who took the exam or by their instructor.

---

## 3. Server-Authoritative Timing & Anti-Cheat

### 3.1 Immutable Start Timestamp
* The countdown begins when the server creates the `assessment_attempts` record: `started_at = NOW()`.
* The client receives `started_at` in the initial response.
* Local timer counters merely render remaining duration for UX; they have zero authority over exam acceptance.

### 3.2 Cutoff Enforcement
* When the student submits an answer (`PATCH /api/attempts/:id/answers`), the server validates:
  $$\text{NOW()} \le \text{started\_at} + (\text{duration\_minutes} \times 60\text{s}) + 60\text{s grace}$$
* If this condition fails, the request is rejected with HTTP 403. The server immediately transitions the attempt to `TIMED_OUT` and runs evaluation on all answers received prior to expiration.

---

## 4. Multi-Tenant Isolation & Role Boundaries

### 4.1 Cross-School Isolation
* Every `assessments`, `assignments`, and `assessment_results` row contains a foreign key to `school_id`.
* Database queries explicitly filter by `school_id` from the authenticated user's profile.
* Supabase Row Level Security (RLS) policies block queries from users belonging to a different `school_id`.

### 4.2 Cross-Class & Cross-Student Isolation
* A student can only view assessments assigned to classes they are actively enrolled in (`classes_students` join).
* A student can only view and update their own `assessment_attempts` and `attempt_answers`.
* A teacher can only view results and attempts for assignments they or their school department created.

---

## 5. Defense-in-Depth Summary Matrix

| Threat Vector | Mitigation Strategy | Enforcing Layer |
| :--- | :--- | :--- |
| **Inspect Source for Answer Keys** | Server deletes `is_correct`, `correct_answer`, and `explanation` before transmission. | API / Repository Layer |
| **Tamper with Local Clock** | Server computes deadline using PostgreSQL `started_at` and rejects late packets. | PostgreSQL / API Layer |
| **Repeated Retakes on Low Score** | Server queries count of existing completed attempts against `max_attempts`. | Repository Layer |
| **Injecting Custom Marks** | Marks are computed entirely server-side; client has no mark-setting endpoints. | Database / Repository |
| **Abandoning Test to Get Fresh One** | Server returns active `IN_PROGRESS` attempt if one already exists. | Repository Layer |
| **Modifying Past Questions** | Assessments store immutable JSONB `question_snapshot` at assignment time. | PostgreSQL Schema |
| **Accessing Another Student's Answers** | RLS restricts access to `student_id = auth.uid()`. | Supabase RLS |
