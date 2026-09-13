# TeacherSathi — Phase 8 Repository Audit & Institutional Architecture Baseline

> **Audit Date**: 2026-09-13  
> **Auditor**: Principal Systems Architect & Senior Engineer  
> **Scope**: Multi-school tenancy, administrative hierarchy (State → District → Organization → School), role-based access control, RLS policies, aggregate reporting, and institutional intelligence.

---

## 1. Executive Summary

TeacherSathi has completed Phases 0 through 7:
* **Phase 0**: Product foundation, canonical NCERT curriculum structure, system boundaries.
* **Phase 1**: Normalized Supabase PostgreSQL database, schema, authentication, RLS, repositories.
* **Phase 2**: Multi-provider AI generation pipeline, structured schemas, educational validation.
* **Phase 3**: Realtime classroom sessions, cryptographic QR pairing, smartboard WebSocket control.
* **Phase 4**: Assessments, assignments, student attempts, server-authoritative timer, automated grading.
* **Phase 5**: SaaS subscriptions, Razorpay checkout, entitlements, quotas, grace windows.
* **Phase 6**: Deterministic 65/35 concept mastery, learning gaps, closed-loop intervention engine.
* **Phase 7**: Rich educational content authoring, deterministic quality gate, fail-closed media uploads, immutable version snapshots, multi-channel export, and 75" smartboard interactive delivery.

**Phase 8 Objective**:
Extend TeacherSathi into an institutional platform supporting **School Networks (Organizations), Districts, and State-Level Administration** with aggregated operational, academic, and platform intelligence, while strictly preserving canonical curriculum authority, multi-tenant isolation, RLS, and student privacy.

---

## 2. Comprehensive Repository Audit

### 2.1 Existing School & Tenancy Model
* **Current Entity**: `schools` table (`supabase/migrations/20260911000001_initial_schema.sql`).
  - Fields: `id`, `name`, `code`, `board`, `state` (TEXT), `city` (TEXT), `address`, `postal_code`, `contact_email`, `contact_phone`, `subscription_tier`, `is_active`, `created_at`, `updated_at`.
  - *Audit Finding*: `state` and `city` are raw strings. There are no relational foreign keys to `states`, `districts`, or `organizations`.
  - *Audit Finding*: Schools operate in single-tenant isolation. No structure currently models school networks (e.g. KVS, JNV, DAV, or private chains) or district jurisdictions.
  - *Phase 8 Requirement*: Add optional foreign keys `state_id`, `district_id`, and `organization_id` to `schools` with B-tree indexes, allowing both independent schools and networked schools to coexist seamlessly.

### 2.2 Profiles, Users & Administrative Roles
* **Current Entity**: `profiles` table (`supabase/migrations/20260911000001_initial_schema.sql`).
  - Fields: `id`, `email`, `full_name`, `role` (`user_role`), `school_id`, `preferred_language`, `avatar_url`, `phone`, `is_active`.
  - Enum `user_role`: `'SUPER_ADMIN'`, `'SCHOOL_ADMIN'`, `'TEACHER'`, `'STUDENT'`.
  - Enum `membership_role`: `'SCHOOL_ADMIN'`, `'TEACHER'`, `'STUDENT'`.
  - *Audit Finding*: Higher administrative roles (`STATE_ADMIN`, `DISTRICT_ADMIN`, `ORG_ADMIN`) do NOT exist in the database enums or application types.
  - *Phase 8 Requirement*: Extend `user_role` and `membership_role` enums to include `STATE_ADMIN`, `DISTRICT_ADMIN`, `ORG_ADMIN`. Add relational membership tables `state_members`, `district_members`, and `organization_members` for multi-tenant administrative binding.

### 2.3 Classes, Teachers & Students
* **Current Entities**:
  - `classes`: Linked to `school_id` and `teacher_id`.
  - `class_students`: Links `class_id` and `student_id` (`profiles.id`).
  - `school_members`: Maps `profile_id` to `school_id` with `membership_role` and `status`.
  - *Audit Finding*: Well-indexed and strictly isolated by `school_id`. Teachers and students have clear boundaries.

### 2.4 Assessments, Assignments & Results (Phase 4 Baseline)
* **Current Entities**:
  - `assessments`: Bound to `school_id` and `teacher_id`.
  - `assignments`: Bound to `class_id` and `assessment_id`.
  - `student_attempts`: Tracks student-level submission, timing, and raw answers.
  - `assessment_results`: Authoritative score, percentage, and formative feedback.
  - *Audit Finding*: All assessment records are bound to `school_id`. No district/state aggregations exist yet.

### 2.5 Academic Intelligence & Mastery (Phase 6 Baseline)
* **Current Entities**:
  - `student_concept_mastery`: Computed using deterministic 65/35 recency-decay formula.
  - `learning_gaps`: State machine (`OPEN` → `IN_REMEDIATION` → `IMPROVING` → `RESOLVED`).
  - `interventions`: Teacher-in-the-loop review and reassessment coupling.
  - *Audit Finding*: Analytics queries in `src/lib/repositories/analytics.ts` aggregate at the `class_id` level (`getClassMastery`). There are no school-level, district-level, organization-level, or state-level aggregation functions.
  - *Phase 8 Requirement*: Build hierarchical aggregation pipelines that compute school, district, organization, and state mastery summaries based on underlying authoritative evidence, with minimum cohort threshold protection ($\ge 10$ students).

### 2.6 Content & Media Pipeline (Phase 7 Baseline)
* **Current Entities**:
  - `resources`: Extended with `school_id`, `author_id`, `type`, `status`, `version`, `content` (JSONB), `validation_score`.
  - `resource_versions`: Immutable snapshots with 1-click rollback.
  - `resource_usage`: Telemetry logging (`VIEW`, `PRESENT`, `EXPORT`).
  - `media_assets` & `media_jobs`: Server-side magic-byte validation and traversal protection.
  - *Audit Finding*: Resource distribution analytics only track raw row counts. Phase 8 needs aggregate metrics on resource adoption and curriculum coverage across schools and districts.

### 2.7 Billing & Entitlements (Phase 5 Baseline)
* **Current Entities**:
  - `plans`, `subscriptions`, `payment_records`, `processed_webhook_events`.
  - Helper function: `is_school_admin_of(user_id, school_id)`.
  - Entitlement engine: `hasEntitlement(schoolId, 'diagnostic_analytics')`.
  - *Audit Finding*: Billing is strictly school-centric. Network-level billing or enterprise pooled quotas need to integrate cleanly without altering the existing single-school billing flow.

### 2.8 Audit Logging Infrastructure
* **Current Entity**: `audit_logs` (`supabase/migrations/20260911000001_initial_schema.sql`).
  - Fields: `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `metadata`, `ip_address`, `user_agent`, `created_at`.
  - Immutability: Enforced via RLS (`SELECT` for `SUPER_ADMIN`, `INSERT` allowed, `UPDATE`/`DELETE` prohibited).
  - *Audit Finding*: `auditRepository.logAction` handles logging, but currently lacks structured administrative scope tracking (`state_id`, `district_id`, `organization_id`).

### 2.9 Row Level Security (RLS) & Security Definer Helpers
* **Current Helpers** in `supabase/migrations/20260911000002_rls_policies.sql`:
  - `is_super_admin()`
  - `is_school_admin(check_school_id)`
  - `is_school_member(check_school_id)`
  - `get_user_school_id()`
  - `is_school_admin_of(p_user_id, p_school_id)` (in migration 000008)
  - *Audit Finding*: There are no RLS helper functions for:
    - `is_state_admin(check_state_id)`
    - `is_district_admin(check_district_id)`
    - `is_organization_admin(check_org_id)`
  - *Phase 8 Requirement*: Implement `SECURITY DEFINER` helpers for administrative scopes to enable fast, recursion-free RLS checks across states, districts, and organizations.

### 2.10 Navigation & Admin UI Architecture
* **Current Navigation**:
  - `Sidebar.tsx` has static links for `/dashboard`, `/dashboard/assessments`, `/dashboard/analytics`, `/dashboard/admin/billing`, `/dashboard/classes`, `/resources`.
  - `src/app/[locale]/admin/`: Superadmin portal with `/admin/billing`, `/admin/users`, `/admin/content/*`, `/admin/audit-logs`.
  - *Audit Finding*: No unified institutional administration navigation for State Admins, District Admins, and Organization Admins.
  - *Phase 8 Requirement*: Build dedicated Institutional Administration routes and dashboards:
    - `/admin/institutional/overview`
    - `/admin/institutional/states` & `[id]`
    - `/admin/institutional/districts` & `[id]`
    - `/admin/institutional/organizations` & `[id]`
    - `/admin/institutional/schools` & `[id]`
    - `/admin/institutional/reports`
    - `/admin/institutional/settings`
    - `/admin/institutional/invitations`

---

## 3. Existing vs Missing Architecture Matrix

| Capability / Entity | Existing Status | Phase 8 Action Required |
|:---|:---|:---|
| `states` Table | Missing | Create `states` table (code, name, region, is_active) |
| `districts` Table | Missing | Create `districts` table (state_id FK, name, code) |
| `organizations` Table | Missing | Create `organizations` table (name, code, type, contact) |
| `state_members` Table | Missing | Create with RLS (`profile_id`, `state_id`, `role`) |
| `district_members` Table | Missing | Create with RLS (`profile_id`, `district_id`, `role`) |
| `organization_members` Table | Missing | Create with RLS (`profile_id`, `organization_id`, `role`) |
| `schools` Hierarchy FKs | Missing | Add `state_id`, `district_id`, `organization_id` to `schools` |
| `institutional_settings` | Missing | Create scoped settings table with inheritance |
| `institutional_invitations` | Missing | Create cryptographic single-use invitation system |
| Administrative RLS Helpers | Missing | Implement `is_state_admin`, `is_district_admin`, `is_org_admin` |
| State/District Aggregations | Missing | Implement `reportingService` with minimum cohort threshold ($\ge 10$) |
| Institutional Dashboards | Missing | Build State, District, Organization, and School Network dashboards |
| Export Infrastructure | Partial (Resource only) | Add scoped CSV/PDF exports for institutional reports |
| Canonical NCERT Curriculum | Fully Preserved | Strictly read-only; never modified by institutional admin |
| Phase 6 Mastery Engine | Fully Preserved | Direct reuse; no duplicate mastery formula |
| Phase 5 SaaS Entitlements | Fully Preserved | Respect institutional feature flags and limits |

---

## 4. Architectural Decisions & Boundary Commitments

1. **Non-Breaking Extension**:
   Existing single schools, teacher workflows, student progress views, and classroom pairings will continue operating without disruption. Schools with `NULL` for `state_id`, `district_id`, or `organization_id` remain valid independent schools.

2. **Server-Authoritative Authorization Chain**:
   $$\text{Authenticated User} \longrightarrow \text{Role} \longrightarrow \text{Administrative Scope} \longrightarrow \text{Tenant Boundary} \longrightarrow \text{Permission}$$
   No client-only checks or hidden-button security.

3. **Student Privacy by Design (Minimum Sample Protection)**:
   State and District dashboards only display aggregated statistical metrics. Minimum cohort size threshold ($N = 10$) prevents deanonymizing individual student performance. Drill-down to personal student records is strictly restricted to authorized school-level personnel.

4. **Zero Duplicate Mastery Logic**:
   All academic performance metrics will aggregate from Phase 6 `student_concept_mastery` and `attempt_answers` records.

5. **Exclusions**:
   No ERP, fee management, biometric attendance, AI avatars, video generation models, or data warehouse migration. Phase 8 strictly delivers institutional administration and aggregate intelligence.
