# Phase 8 — Role-Based Access Control (RBAC) & Institutional Permissions

## 1. Role Taxonomy

TeacherSathi Phase 8 introduces three institutional administrative roles to the system:

| Role | Administrative Scope | Primary Responsibilities |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Platform-Wide | Global tenant governance, infrastructure, root configurations. |
| **`STATE_ADMIN`** | Federal State (`states`) | Statewide school directories, aggregated academic telemetry, state policy presets. |
| **`DISTRICT_ADMIN`** | Education District (`districts`) | Regional oversight, district school onboarding, learning gap identification. |
| **`ORG_ADMIN`** | School Network (`organizations`) | Chain-wide school management, cross-school curriculum alignment, network comparisons. |
| **`SCHOOL_ADMIN`** | Single School (`schools`) | Local teacher/student roster, section management, school-level operational settings. |
| **`TEACHER`** | Classroom / Section (`classes`) | Lesson delivery, smartboard operation, assessments, interventions. |
| **`STUDENT`** | Individual Attempt / Learner | Assessment submissions, self-paced mastery progress. |

---

## 2. Institutional Capability Matrix

The following matrix documents operational capabilities across administrative roles:

| Action / Capability | SUPER_ADMIN | STATE_ADMIN | DISTRICT_ADMIN | ORG_ADMIN | SCHOOL_ADMIN | TEACHER | STUDENT |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Statewide Directory** | Yes | Yes (Own) | No | No | No | No | No |
| **View District Directory** | Yes | Yes (State) | Yes (Own) | No | No | No | No |
| **View Network Directory** | Yes | No | No | Yes (Own) | No | No | No |
| **Onboard New School** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | No | No | No |
| **View Aggregated Overview KPIs** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | Yes (School) | No | No |
| **View Academic Mastery (N $\ge$ 10)** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | Yes (School) | Section | Own |
| **Compare Multiple Schools** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | No | No | No |
| **Issue Cryptographic Invitations** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | Yes (School) | No | No |
| **Update Cascading Settings** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | Yes (School) | No | No |
| **Export Aggregated Reports** | Yes | Yes (State) | Yes (Dist) | Yes (Org) | Yes (School) | No | No |
| **Modify Canonical NCERT Curriculum** | No* | **No** | **No** | **No** | **No** | **No** | **No** |

*\*Note: Canonical NCERT curriculum is platform-owned and immutable across all administrative tiers.*

---

## 3. Programmatic Authorization Service

The authorization engine in `src/lib/services/institutionalAuth.ts` evaluates actor permissions via:
1. `authenticateInstitutionalAdmin()`: Validates authenticated profile and guarantees membership in allowed administrative roles (`SUPER_ADMIN`, `STATE_ADMIN`, `DISTRICT_ADMIN`, `ORG_ADMIN`, `SCHOOL_ADMIN`).
2. `canManageScope(userScope, scopeType, scopeId)`: Enforces that the user is actively assigned to the target State, District, Organization, or School.
3. `isAuthorizedForInstitutionAction(role, action)`: Enforces capability restrictions such as blocking NCERT modifications and preventing teachers/students from accessing aggregate portals.
