# Phase 8 — Student Privacy by Design ($N \ge 10$) & Data Protection

## 1. Regulatory Context & Privacy Mandate

In educational data aggregation, small sample sizes present a severe risk of **deductive disclosure** (deanonymization). For example:
* If a rural school or small classroom has only 3 students enrolled, and a district dashboard reports an average assessment score of 35% with 2 open learning gaps, an observer can easily infer individual student academic deficiencies.
* In conformity with international and national data protection principles (including India's Digital Personal Data Protection Act / DPDPA and FERPA/COPPA standard practices), TeacherSathi enforces a strict minimum cohort size threshold.

---

## 2. Minimum Cohort Protection Threshold ($N \ge 10$)

TeacherSathi sets `MINIMUM_COHORT_THRESHOLD = 10` across all reporting and analytics pipelines:

```
                      [Evaluate Cohort Size N]
                                  |
               +------------------+------------------+
               |                                     |
           (N < 10)                              (N >= 10)
               |                                     |
               v                                     v
       [Suppress Score]                      [Reveal Metric]
  - score = null                        - score = Math.round(avg)
  - insufficientData = true             - insufficientData = false
  - Label: "Insufficient data"          - Label: "${score}%"
```

---

## 3. Implementation Verification

### 3.1 Overview Dashboards
In `reportingService.getScopeOverview`:
If `totalStudents < MINIMUM_COHORT_THRESHOLD`, `averageMasteryScore` is explicitly returned as `null` with `insufficientData: true`.

### 3.2 Concept Academic Summaries
In `reportingService.getAcademicMetrics`:
Concepts with `studentsEvaluatedCount < 10` have `averageMastery: null`, `masteryStatus: 'INSUFFICIENT_DATA'`, and `insufficientData: true`.

### 3.3 School Comparison Engine
In `reportingService.compareSchools`:
Individual schools with fewer than 10 evaluated students display `"Insufficient data"` in place of their average mastery score.

### 3.4 Report Exports (CSV / JSON)
In `POST /api/admin/institutional/reports/export`:
Rows with suppressed scores write `"Insufficient data"` into the CSV export to prevent leakages through downloadable artifacts.
