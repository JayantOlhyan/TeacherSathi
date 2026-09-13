# Phase 8 — Academic Aggregation, Mastery & Diagnostic Telemetry

## 1. Overview

Rather than creating separate or duplicated mastery computation logic, Phase 8 builds directly upon the deterministic diagnostic foundation established in **Phase 6** (`student_concept_mastery`, `learning_gaps`, `interventions`).

The Phase 8 academic engine aggregates concept-level mastery and learning gap rates across thousands of students while maintaining strict privacy boundaries.

---

## 2. Concept Mastery Aggregation

For each concept in the canonical NCERT curriculum tree evaluated within the target administrative scope:
1. `studentsEvaluatedCount`: Count of unique students with recorded mastery rows for the concept.
2. `averageMastery`: Mean mastery score across all evaluated students in the scope.
3. `masteryStatus`:
   * **`INSUFFICIENT_DATA`**: If `studentsEvaluatedCount < 10`
   * **`MASTERED`**: If `averageMastery >= 75`
   * **`DEVELOPING`**: If `50 <= averageMastery < 75`
   * **`NEEDS_SUPPORT`**: If `averageMastery < 50`

---

## 3. Learning Gap Severity Aggregation

Aggregated learning gaps (`getLearningGapSummary`) group identified gaps by curriculum concept and compute:
* `affectedSchoolsCount`: Number of unique schools where this gap was detected.
* `affectedStudentsCount`: Number of unique students exhibiting the gap.
* `resolutionRate`: Percentage of instances transitioned to `RESOLVED` status following intervention.
* `severity`:
  * **`CRITICAL`**: $\ge 50$ affected students AND resolution rate $< 30\%$
  * **`HIGH`**: $\ge 20$ affected students OR resolution rate $< 50\%$
  * **`MODERATE`**: $\ge 10$ affected students
  * **`LOW`**: Localized gap ($< 10$ students)

---

## 4. Cross-School Comparative Matrix

The Multi-School Benchmarking tool (`POST /api/admin/institutional/compare`) generates side-by-side matrices across 2 to 10 selected schools:
* School name, board, and city
* Active teacher and enrolled student headcounts
* Classrooms and assessments conducted
* Concept mastery percentage (masked if student cohort $< 10$)
* Total active learning gaps requiring remediation
* Smartboard events and digital content utilization
