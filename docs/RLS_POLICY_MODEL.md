# TeacherSathi — Row Level Security (RLS) Policy Model

> **Status**: Production Reference Document (Phase 1)  
> **Source Migration**: `supabase/migrations/20260911000002_rls_policies.sql`  
> **Enforcement Principle**: Zero trust at client boundary. The database is the authoritative authorization engine.  

---

## 1. Security Architecture Principles

1. **Deny by Default**: Every table containing application or user data has RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
2. **Security Definer Functions**: Role checks and multi-tenant membership checks are executed via `SECURITY DEFINER` helper functions (`is_super_admin()`, `is_school_admin()`, `is_school_member()`, `get_user_school_id()`). This avoids recursive policy lookups and infinite recursion loops.
3. **Tenant Boundary Enforcement**: Users belonging to School A cannot read or write School B's classes, students, devices, sessions, or internal resources.
4. **Pedagogical Asset Ownership**: Private teacher assets (`DRAFT` lesson plans, worksheets) are visible only to their creator; shared assets (`READY`, `USED`) can be accessed by verified school colleagues.
5. **Canonical Protection**: Public users can read published curriculum chapters and questions, but modifications are restricted strictly to platform `SUPER_ADMIN`.
6. **Audit Immutability**: The `audit_logs` table allows `SELECT` solely for `SUPER_ADMIN`, allows `INSERT` from authenticated actors, and unconditionally forbids `UPDATE` and `DELETE` via `USING (false)`.

---

## 2. Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
| :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | Self, same-school members, `SUPER_ADMIN` | Self (on registration), `SUPER_ADMIN` | Self (non-role fields), `SUPER_ADMIN` | `SUPER_ADMIN` only |
| **`schools`** | Same-school members, `SUPER_ADMIN` | `SUPER_ADMIN` | `SCHOOL_ADMIN` of school, `SUPER_ADMIN` | `SUPER_ADMIN` only |
| **`school_members`** | Self, same-school members, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` |
| **`grades`** | Public (active = true), `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`subjects`** | Public (active = true), `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`books`** | Public (active = true), `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`chapters`** | Public (published = true), `SUPER_ADMIN`| `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`concepts`** | Public (all), `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`questions`** | Public (published & active), `SUPER_ADMIN`| `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`question_options`** | Inherited from published question | `SUPER_ADMIN` | `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`question_versions`**| `SUPER_ADMIN` | `SUPER_ADMIN` | Denied | Denied |
| **`classes`** | School Admin, assigned Teacher, enrolled Students, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, assigned Teacher, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` |
| **`class_students`** | Enrolled Student, class Teacher, School Admin, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` |
| **`classroom_devices`**| Same-school members, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SCHOOL_ADMIN`, `SUPER_ADMIN` |
| **`classroom_sessions`**| Session Teacher, Device school members, `SUPER_ADMIN` | Assigned Teacher, Device school members, `SUPER_ADMIN` | Session Teacher, `SCHOOL_ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`remote_actions`** | Session Teacher, Device school members, `SUPER_ADMIN` | Session Teacher, authenticated actor, `SUPER_ADMIN` | Denied | Denied |
| **`resources`** | Owner Teacher, same-school members (if READY/USED), `SUPER_ADMIN` | Authenticated Teacher (`owner_id = auth.uid()`), `SUPER_ADMIN` | Owner Teacher, `SUPER_ADMIN` | Owner Teacher, `SUPER_ADMIN` |
| **`lesson_plans`** | Inherited from resource ownership | Owner Teacher | Owner Teacher | Owner Teacher |
| **`worksheets`** | Inherited from resource ownership | Owner Teacher | Owner Teacher | Owner Teacher |
| **`presentations`** | Inherited from resource ownership | Owner Teacher | Owner Teacher | Owner Teacher |
| **`mind_maps`** | Inherited from resource ownership | Owner Teacher | Owner Teacher | Owner Teacher |
| **`audit_logs`** | `SUPER_ADMIN` only | Authenticated user / System triggers | Denied (`USING (false)`) | Denied (`USING (false)`) |

---

## 3. Automated Validation

All RLS isolation rules are tested via automated Vitest test runs in `tests/database/rls.test.ts`, verifying:
- Cross-tenant blockades (School A $\neq$ School B)
- Student modification prevention on educator resources
- Role escalation prevention on profile update
- Immutable audit log enforcement
