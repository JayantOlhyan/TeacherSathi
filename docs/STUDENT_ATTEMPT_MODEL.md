# TeacherSathi — Student Attempt Session Model

## 1. Lifecycle State Machine

A student's interaction with an assessment is strictly tracked via an authoritative state machine in `assessment_attempts`.

```
                  +---------------+
                  |  NOT_STARTED  |
                  +-------+-------+
                          |
             Student Launches Assessment
             (POST /api/assessments/:id/attempts)
                          |
                          v
                  +---------------+
        +-------> |  IN_PROGRESS  | <-------+
        |         +-------+-------+         |
        |                 |                 |
  Autosave Answers        |           Browser Reload /
  (PATCH .../answers)     |           Network Recovery
        |                 |                 |
        +-----------------+-----------------+
                          |
             +------------+------------+
             |                         |
    Student Submits             Timer Expires
  (Explicit Submission)       (Timeout Enforced)
             |                         |
             v                         v
     +---------------+         +---------------+
     |   SUBMITTED   |         |   TIMED_OUT   |
     +-------+-------+         +-------+-------+
             |                         |
             +------------+------------+
                          |
                 Automatic Evaluation
                          |
                          v
                  +---------------+
                  |   EVALUATED   |
                  +---------------+
```

---

## 2. State Definitions & Transitions

| State | Allowed Transitions | Trigger / Condition | Permitted Operations |
| :--- | :--- | :--- | :--- |
| `NOT_STARTED` | `IN_PROGRESS` | Student clicks "Start Assessment". Server initializes record. | Initialize attempt record only. |
| `IN_PROGRESS` | `SUBMITTED`, `TIMED_OUT`, `ABANDONED` | Student is answering questions. Timer countdown active. | Read stripped questions, autosave answers via `PATCH`. |
| `SUBMITTED` | `EVALUATED` | Student confirms final submission before timer expires. | Read results (if permitted). Write prohibited. |
| `TIMED_OUT` | `EVALUATED` | Time limit + 60s grace expires. Closed automatically. | Read results. Write prohibited. |
| `ABANDONED` | `EVALUATED` | Assignment due date passes with attempt left open. | Read results. Write prohibited. |
| `EVALUATED` | Terminal state | Grading engine finalized score in `assessment_results`. | Read result summary, answer sheet, review notes. |

---

## 3. Server-Authoritative Timer & Grace Window

### 3.1 Expiration Calculation
Exam duration is managed by the server using PostgreSQL timestamps:

$$\text{Deadline} = \text{started\_at} + (\text{duration\_minutes} \times 60\text{s})$$

* **Client Timer**: Receives `started_at` and `duration_minutes`. Computes remaining seconds on every tick:
  $$\text{Remaining Seconds} = \max(0, \lfloor \text{Deadline} - \text{Current Client Timestamp} \rfloor)$$
* **Server Verification Buffer**:
  To protect students against transient mobile network latency and clock jitter, the server provides a **60-second grace window**:
  $$\text{Cutoff} = \text{Deadline} + 60\text{s}$$

### 3.2 Late Answer Rejection
When `PATCH /api/attempts/:id/answers` is invoked:
1. Server queries `started_at` and `duration_minutes` for the attempt.
2. If $\text{NOW()} > \text{Cutoff}$:
   * The server rejects the answer payload with HTTP 403 / 400: `"Assessment time limit has expired"`.
   * Server triggers `submitAttempt` with `auto_submitted: true`.

---

## 4. Autosave & Crash Recovery Protocol

### 4.1 Debounced Single & Batch Saves
1. When a student chooses an option, the UI immediately marks it locally.
2. An asynchronous, debounced worker dispatches a `PATCH` request to `/api/attempts/:id/answers`:
   ```json
   {
     "assessmentQuestionId": "uuid-here",
     "studentAnswer": "A"
   }
   ```
3. PostgreSQL executes an upsert query:
   ```sql
   INSERT INTO public.attempt_answers (
       attempt_id, assessment_question_id, student_answer, answered_at
   ) VALUES ($1, $2, $3, NOW())
   ON CONFLICT (attempt_id, assessment_question_id)
   DO UPDATE SET student_answer = EXCLUDED.student_answer, updated_at = NOW();
   ```
4. On weak rural networks, a batch endpoint (`batchSaveAnswers`) accepts an array of pending responses, ensuring zero lost answers if the device briefly goes offline.

### 4.2 Seamless Browser Recovery
If the student refreshes the browser, accidentally navigates away, or suffers a device crash:
1. Navigating back to `/[locale]/student/assessments/[id]/attempt` calls `GET /api/attempts/:id`.
2. The server returns:
   * Current attempt status (`IN_PROGRESS`).
   * `started_at` timestamp.
   * Array of previously answered questions and selected choices.
3. The React player re-hydrates all answered questions and resumes the countdown from the exact server deadline without granting extra time.

---

## 5. Retake Enforcement & Max Attempts

Assessments can be configured with `max_attempts` (default: 1):
1. When `POST /api/assessments/:id/attempts` is called:
   * Server counts completed attempts (`status IN ('SUBMITTED', 'TIMED_OUT', 'EVALUATED')`).
   * If `existing_attempts >= max_attempts`, the API returns HTTP 403: `"Maximum attempt limit reached"`.
2. If an unfinished attempt (`status = 'IN_PROGRESS'`) already exists:
   * The server returns the active attempt rather than creating a new one, preventing students from discarding poor attempts mid-stream.
