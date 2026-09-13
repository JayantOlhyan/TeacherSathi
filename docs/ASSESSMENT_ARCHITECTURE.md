# TeacherSathi — Academic Assessment Subsystem Architecture

## 1. System Overview
The Academic Assessment Subsystem in TeacherSathi delivers a server-authoritative, multi-tenant evaluation engine for CBSE and NCERT schools. It bridges curriculum-aligned question generation, formative and summative assessment composition, classroom distribution, synchronized student test-taking, automatic objective grading, and class-level pedagogical diagnostics.

The architecture ensures that:
1. **Questions are immutable once assigned**: Assessments snapshot question content into JSONB records (`question_snapshot`) to insulate historic student attempts from future question bank edits.
2. **State and timers are server-authoritative**: Student timers count down against server start times; late answers outside the latency grace window are rejected; and auto-submission is strictly enforced.
3. **Answer keys are protected**: Students never receive correct answer options, model answers, or explanations while an assessment is in-progress.
4. **Data access is bounded by RLS**: Multi-tenant school isolation and role-based class permissions ensure cross-teacher and cross-school data leakage is impossible at the database layer.

---

## 2. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------------------+
|                                       CONTENT LAYER                                           |
|                                                                                               |
|   +-----------------------+     +-----------------------+     +---------------------------+   |
|   |  NCERT Question Bank  |     |  AI Lesson Kit / Quiz |     |  Teacher Custom Question  |   |
|   |  (Grade/Sub/Chap/Top) |     |  (Structured JSON)    |     |  (Authoring UI)           |   |
|   +-----------+-----------+     +-----------+-----------+     +-------------+-------------+   |
+---------------|-----------------------------|-------------------------------|-----------------+
                |                             |                               |
                +----------------------->     v     <-------------------------+
                                  +-----------------------+
                                  |   Draft Assessment    |
                                  | (Type, Marks, Timer)  |
                                  +-----------+-----------+
                                              |
                                     [Publish Assessment]
                                              |
                                              v
                                  +-----------------------+
                                  | Published Assessment  |
                                  | (Locked & Snapshot)   |
                                  +-----------+-----------+
                                              |
                                     [Assign to Class]
                                              |
                                              v
+---------------------------------------------+-------------------------------------------------+
|                                    ASSIGNMENT LAYER                                           |
|                                                                                               |
|   +---------------------------------------------------------------------------------------+   |
|   |  Class Assignment (Class ID, Due Date, Active Date, Max Attempts, Security Policy)    |   |
|   +-----------------------------------------+---------------------------------------------+   |
+---------------------------------------------|-------------------------------------------------+
                                              |
                                     [Student Starts Exam]
                                              |
                                              v
+---------------------------------------------+-------------------------------------------------+
|                                    EXECUTION LAYER                                            |
|                                                                                               |
|   +---------------------------------------------------------------------------------------+   |
|   |  Student Attempt Session                                                              |   |
|   |  - Started at: ISO Server Timestamp                                                   |   |
|   |  - End boundary: started_at + duration_minutes + 60s grace                            |   |
|   |  - Stripped Payload: Questions ONLY (No correct keys / explanations)                  |   |
|   |                                                                                       |   |
|   |     +------------------+         Autosave PATCH            +--------------------+     |   |
|   |     | Student Browser  | --------------------------------> | Server Validation  |     |   |
|   |     | (Timer / Player) | <-------------------------------- | (Debounced Upsert) |     |   |
|   |     +--------+---------+                                   +---------+----------+     |   |
|   +--------------|-------------------------------------------------------|----------------+   |
                   |                                                       |
         [Submit / Timer Expiry]                                           |
                   |                                                       |
                   v                                                       v
+------------------+-------------------------------------------------------+--------------------+
|                                    EVALUATION LAYER                                           |
|                                                                                               |
|   +---------------------------------------------------------------------------------------+   |
|   |  Server-Side Grading Engine                                                           |   |
|   |  - Compare student_answer vs question_snapshot.correct_answer                         |   |
|   |  - Award marks or apply negative_marking                                              |   |
|   |  - Flag subjective questions as MANUAL_REVIEW                                         |   |
|   +-----------------------------------------+---------------------------------------------+   |
|                                             |                                                 |
|                                             v                                                 |
|   +---------------------------------------------------------------------------------------+   |
|   |  Result & Analytics Ledger                                                            |   |
|   |  - Score, percentage, passed status, rank, class average, percentile                  |   |
|   |  - Question difficulty diagnostics (Error rates, discrimination index)                |   |
|   +---------------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------------+
```

---

## 3. Subsystem Components & Responsibilities

### 3.1 Next.js Application Layer (`src/app/`)
* **Teacher Assessment Hub (`/[locale]/dashboard/assessments`)**: Management interface for viewing drafts, published assessments, and assignment schedules.
* **Assessment Builder (`/[locale]/dashboard/assessments/create`)**: Multi-step authoring interface supporting manual question entry and AI kit conversion with real-time mark summation and validation.
* **Classroom Diagnostics (`/[locale]/dashboard/assessments/[id]/results`)**: Pedagogical analytics dashboard displaying score distribution histograms, question error rates, and student attempt ledgers.
* **Student Assignment Desk (`/[locale]/student/assignments`)**: Student portal listing pending, in-progress, and submitted assessments with clear deadlines and status tags.
* **Exam Player (`/[locale]/student/assessments/[id]/attempt`)**: High-stakes testing interface with server-synchronized countdown, question navigator, flag-for-review toggles, and continuous autosave.
* **Student Result Viewer (`/[locale]/student/assessments/[id]/result`)**: Formative feedback interface detailing score breakdown, passing status, question-by-question review, and teacher explanations.

### 3.2 Authoritative API Layer (`src/app/api/`)
* `/api/assessments`: Collection endpoint for listing and authoring assessments.
* `/api/assessments/[id]`: Resource management (fetch, update, delete) with immutability guards.
* `/api/assessments/[id]/publish`: Transition assessment from `DRAFT` to `PUBLISHED`.
* `/api/assessments/[id]/assign`: Distribute published assessments to target classes.
* `/api/assessments/[id]/attempts`: Check student eligibility and initiate a new attempt session.
* `/api/assessments/[id]/results`: Aggregate assessment results and item analysis for teachers.
* `/api/assessments/ai-convert`: Convert generated AI lesson kits or quizzes into structured assessments.
* `/api/assignments`: Class assignment feeds for teachers and students.
* `/api/attempts/[id]`: Fetch active attempt session and restore state upon disconnect.
* `/api/attempts/[id]/answers`: Receive autosaved answer payloads with server timer verification.
* `/api/attempts/[id]/submit`: Finalize exam, execute grading engine, and generate ledger entry.
* `/api/results/[id]`: Deliver student result sheet with conditional answer key visibility.

### 3.3 Authoritative Repository Layer (`src/lib/repositories/assessments.ts`)
* Implements atomic database operations using the Supabase server client.
* Enforces role verification, question snapshotting, timer boundaries, and grading rules.
* Masks sensitive answer keys and model answers from student payloads until permitted.

### 3.4 Data Validation Layer (`src/lib/validations/assessment.ts`)
* Type-safe runtime schemas using Zod.
* Enforces bounds on duration, marks, pass thresholds, option counts, and answer payloads.

---

## 4. Assessment Types Supported

| Assessment Type | Description | Target Use Case | Default Duration | Grading Mode |
| :--- | :--- | :--- | :--- | :--- |
| `MCQ_QUIZ` | Formative quick check containing single-select or multiple-choice questions. | Classroom spot checks, end-of-period drills. | 10 - 20 mins | Fully Automatic |
| `TEST_PAPER` | Summative examination covering chapter or unit curriculum with positive and negative marking. | Periodic tests, term examinations, mock boards. | 45 - 180 mins | Automatic (MCQ) + Manual Review |
| `WORKSHEET` | Practice assignment designed for self-paced or collaborative homework. | Home practice, remedial reinforcement. | Untimed or 60 mins | Automatic + Explanatory Feedback |
| `ASSIGNMENT` | Project, essay, or structured response homework. | Extended inquiry, laboratory write-ups. | Multi-day deadline | Manual Teacher Grading |

---

## 5. Resilience & Network Fault Tolerance
1. **Continuous Local & Remote Autosave**:
   * Answers are persisted to React component state immediately upon selection.
   * Debounced API calls sync each response to PostgreSQL in the background.
   * Batch synchronization guarantees that slow or intermittent connections persist all pending choices.
2. **Session Recovery**:
   * If a student closes their tab or loses Wi-Fi connectivity, reopening the attempt route immediately calls `/api/attempts/[id]`.
   * The server restores the exact answer record and calculates remaining duration based on the original `started_at` timestamp.
3. **Grace Window Buffer**:
   * Network latency jitter is absorbed by a 60-second server buffer beyond `started_at + duration_minutes`.
   * Answers submitted within this grace period are safely stored; submissions beyond the buffer are marked as `auto_submitted: true` and closed.
