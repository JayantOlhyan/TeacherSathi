# Phase 8 — Institutional Reporting & Aggregation Engine

## 1. Engine Architecture

The institutional reporting engine (`src/lib/services/reportingService.ts`) calculates real-time and pre-aggregated KPIs across arbitrary administrative scopes (`STATE`, `DISTRICT`, `ORGANIZATION`, `SCHOOL`).

```
                                [Scope Request]
                        (Type: DISTRICT, ID: dist-uuid)
                                       |
                                       v
                    [getSchoolIdsForScope(scopeType, id)]
                                       |
                                       v
                 +---------------------+---------------------+
                 |                                           |
                 v                                           v
    [Operational Telemetry]                        [Academic Telemetry]
- Active Schools & Adoption Rate            - Concept Mastery Aggregates
- Teacher & Student Headcounts              - Learning Gap Severity Distribution
- Classrooms & Active Assessments           - Privacy Masking Evaluation (N >= 10)
- Smartboard Launch Events                                   |
                 |                                           |
                 +---------------------+---------------------+
                                       |
                                       v
                        [ScopeOverviewSummary Contract]
```

---

## 2. Metric Formulations

### 2.1 Adoption Rate
Represents the proportion of registered schools actively engaging with the platform:
$$\text{Adoption Rate} = \left( \frac{\text{Active Schools}}{\text{Total Schools}} \right) \times 100$$
Where an *active school* is defined as having at least one active teacher or assessment recorded in the audit period.

### 2.2 Learning Gap Resolution Rate
Measures the effectiveness of pedagogical interventions in resolving diagnosed learning gaps:
$$\text{Gap Resolution Rate} = \left( \frac{\text{Resolved Gaps}}{\text{Total Gaps (Resolved + Open)}} \right) \times 100$$

### 2.3 Scope Overview Contract
Every scope aggregation conforms to `ScopeOverviewSummary`:
* `scopeType`: `'STATE' | 'DISTRICT' | 'ORGANIZATION' | 'SCHOOL'`
* `scopeId`: Target entity UUID
* `scopeName`: Resolved human-readable name
* `totalSchools`, `activeSchools`, `adoptionRate`
* `totalTeachers`, `activeTeachers`
* `totalStudents`, `activeStudents`
* `totalClasses`, `totalAssessments`
* `averageMasteryScore`: Number or `null` (if masked)
* `insufficientData`: Boolean flag indicating sample size $< 10$
* `totalOpenGaps`, `resolvedGapsCount`, `gapResolutionRate`
* `resourceUsageCount`: Total smartboard launches and content views
