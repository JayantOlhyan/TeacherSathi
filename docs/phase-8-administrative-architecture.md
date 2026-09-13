# Phase 8 — Institutional Scale & Administrative Architecture

## 1. System Overview

TeacherSathi Phase 8 evolves the platform from an individual school-centric product to an **institutional scale, multi-tier educational platform**. The system supports governance, academic oversight, and operational telemetry across state departments of education, district administrative bodies, multi-school network chains (e.g., Kendriya Vidyalaya Sangathan, Delhi Public Schools), and independent standalone schools.

```
+-------------------------------------------------------------------------+
|                               STATE TIER                                |
|  - State Department of Education (e.g. Maharashtra, Karnataka)          |
|  - Statewide Academic Benchmarks & Policy Defaults                      |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                              DISTRICT TIER                              |
|  - District Education Officers (DEO / Block Resource Centers)           |
|  - Regional Gap Analysis & Resource Distribution Telemetry              |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        SCHOOL NETWORK TIER (ORG)                        |
|  - Multi-School Organizations (e.g., KVS, JNV, Private Chains)          |
|  - Cross-District Institutional Governance & Shared Content Libraries   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                              SCHOOL TIER                                |
|  - School Principals & Headmasters                                      |
|  - Localized Scheduling, Section Management & Teacher Assignments       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                            CLASSROOM TIER                               |
|  - Teachers, Smartboard Kiosks, Formative Quizzes & NCERT Delivery      |
|  - Student Attempts, Concept Mastery & Targeted Remediation             |
+-------------------------------------------------------------------------+
```

---

## 2. Core Architectural Pillars

### 2.1 Multi-Tenant Orthogonality
Geographical jurisdictions (`State` $\to$ `District`) and administrative affiliations (`Organization` / Network) intersect cleanly at the `School` entity. A school may be:
1. Linked to a State, a District, and an Organization (e.g., KV Hebbal in Bengaluru Urban, Karnataka).
2. Linked only to a State and a District (e.g., a state government school).
3. Linked only to an Organization (e.g., a private school chain operating across borders).
4. Completely standalone and independent (`state_id`, `district_id`, and `organization_id` all `NULL`).

### 2.2 Canonical Curriculum Immutability
Under no circumstances do institutional tiers modify or fork the canonical NCERT curriculum hierarchy:
$$\text{Grade} \longrightarrow \text{Subject} \longrightarrow \text{Book} \longrightarrow \text{Chapter} \longrightarrow \text{Concept}$$
All institutional intelligence and benchmarking map to this immutable curriculum standard, ensuring consistent statewide and national comparators.

### 2.3 Student Privacy by Design ($N \ge 10$)
State and district dashboards aggregate data across hundreds of classrooms. To eliminate the risk of student deanonymization or deductive identification in small cohorts, **any aggregation with fewer than 10 evaluated students strictly masks scores as `null`** and displays `"Insufficient data"`.

### 2.4 Cascading Governance & Settings Resolution
Institutional governance flows downward with localized override capabilities:
$$\text{Platform Defaults} \longleftarrow \text{State} \longleftarrow \text{District} \longleftarrow \text{Organization} \longleftarrow \text{School}$$
Higher tiers enforce minimum standards (e.g., minimum passing thresholds, language defaults), while local schools configure operational specifics within parent boundaries.

### 2.5 Single-Use Cryptographic Onboarding
Administrative invitation tokens are generated using cryptographically secure pseudorandom buffers (`crypto.randomBytes(32)`). Plaintext tokens are delivered only once; only their SHA-256 digests are stored in the database. Tokens strictly enforce single-use consumption and automatic expiry.
