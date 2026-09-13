# TeacherSathi — Grading Model & Evaluation Engine

## 1. Overview
The TeacherSathi Grading Engine provides deterministic, server-authoritative scoring for academic assessments. It evaluates objective items instantaneously, manages negative marking rules, isolates subjective submissions for teacher review, and computes classroom-level diagnostic aggregates.

---

## 2. Objective vs. Subjective Evaluation

### 2.1 Objective Questions (`MCQ`, `TRUE_FALSE`, `FILL_BLANKS`)
* **Evaluation Mode**: Fully automated server-side matching against `question_snapshot.correct_answer`.
* **Normalization**: Answers are trimmed and case-folded before string comparison (e.g., `'a'` matches `'A'`).
* **Statuses**:
  * `'CORRECT'`: Match succeeded. Full positive marks awarded (`marks_awarded = question.marks`).
  * `'INCORRECT'`: Match failed. Positive marks zeroed; negative marking applied if active.
  * `'PENDING'`: Unattempted (`student_answer IS NULL`). `marks_awarded = 0.00`.

### 2.2 Subjective Questions (`SHORT_ANSWER`, `LONG_ANSWER`)
* **Evaluation Mode**: Human-in-the-loop manual review.
* **Initial Status**: Marked as `'MANUAL_REVIEW'` upon attempt submission.
* **Score Impact**: Initially awards `0.00` marks until teacher enters rubric-based score.
* **Notification**: Attempt status remains `'SUBMITTED'` (or partial `'EVALUATED'`) until all subjective items are scored.

---

## 3. Scoring Rules & Formulas

### 3.1 Item-Level Marking Formula
For each question $q$ with assigned marks $M_q$, negative mark penalty $N_q$, and student answer $A_s$ compared against answer key $K_q$:

$$\text{Marks}(q) = \begin{cases} M_q, & \text{if } A_s = K_q \\ -N_q, & \text{if } A_s \neq K_q \text{ and } A_s \neq \emptyset \text{ and } \text{negative\_marking} = \text{true} \\ 0.00, & \text{otherwise} \end{cases}$$

### 3.2 Total Score Computation
The raw total score $S_{\text{raw}}$ is the sum of marks awarded across all questions $Q$:

$$S_{\text{raw}} = \sum_{q \in Q} \text{Marks}(q)$$

* **Score Floored at Zero**: To prevent negative composite scores on report cards, the final stored score is clamped:
  $$S = \max(0.00, S_{\text{raw}})$$
* **Total Marks Available**:
  $$M_{\text{total}} = \sum_{q \in Q} M_q$$
* **Percentage**:
  $$P = \begin{cases} \left(\frac{S}{M_{\text{total}}}\right) \times 100, & \text{if } M_{\text{total}} > 0 \\ 0.00, & \text{if } M_{\text{total}} = 0 \end{cases}$$

### 3.3 Passing Status Determination
A student passes the assessment if their final earned score meets or exceeds the configured passing threshold:

$$\text{is\_passed} = (S \ge \text{passing\_marks})$$

---

## 4. Grade Boundaries

Percentage scores are mapped to CBSE-aligned letter grades according to the following ladder:

| Score Percentage ($P$) | Grade | Qualitative Performance |
| :--- | :--- | :--- |
| $90\% \le P \le 100\%$ | **A+** | Outstanding |
| $80\% \le P < 90\%$ | **A** | Excellent |
| $70\% \le P < 80\%$ | **B+** | Very Good |
| $60\% \le P < 70\%$ | **B** | Good |
| $50\% \le P < 60\%$ | **C** | Satisfactory |
| $33\% \le P < 50\%$ | **D** | Marginal Pass |
| $P < 33\%$ | **F** | Needs Remediation |

---

## 5. Classroom Diagnostics & Analytics

When a teacher queries assessment results (`GET /api/assessments/:id/results`), the system computes class-level aggregates.

### 5.1 Cohort Summary
* **Submission Rate**:
  $$\text{Submission Rate} = \frac{\text{Total Submissions}}{\text{Total Assigned Students}} \times 100$$
* **Class Average Score**:
  $$\bar{S} = \frac{1}{N} \sum_{i=1}^N S_i$$
* **Class Average Percentage**:
  $$\bar{P} = \frac{1}{N} \sum_{i=1}^N P_i$$
* **Cohort Pass Rate**:
  $$\text{Pass Rate} = \frac{\sum_{i=1}^N [\text{is\_passed}_i = \text{true}]}{N} \times 100$$

### 5.2 Item Difficulty Index ($P$-Value)
For each question $q$, the difficulty index is the proportion of attempting students who answered correctly:

$$P_q = \frac{\text{Correct Count}_q}{\text{Attempt Count}_q}$$

* **Classification**:
  * $P_q \ge 0.80$: **Easy** — concept well understood.
  * $0.50 \le P_q < 0.80$: **Medium** — standard curriculum mastery.
  * $P_q < 0.50$: **Hard** — highlighted in red as a key candidate for classroom re-teaching.

### 5.3 Error Diagnostics & Common Distractors
* For each MCQ, the repository aggregates student selections across options `A`, `B`, `C`, and `D`.
* If a high percentage of students select a specific incorrect distractor, the teacher dashboard highlights the common misconception and recommends an NCERT remedial module.
