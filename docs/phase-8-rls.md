# Phase 8 — Row-Level Security (RLS) & Cross-Tenant Data Isolation

## 1. Security Architecture

TeacherSathi strictly enforces multi-tenant boundary isolation at the database level using PostgreSQL Row-Level Security (RLS). Phase 8 extends RLS with security definer functions that compute jurisdictional membership dynamically.

---

## 2. Security Definer Helper Functions

To maintain high query performance without redundant subquery joins, migration `20260911000011_institutional_scale_and_administration.sql` provides:

### 2.1 Direct Scope Checks
* `public.is_state_admin(check_state_id UUID) RETURNS BOOLEAN`:
  Checks active membership in `state_members` where `profile_id = auth.uid()` or `public.is_super_admin()`.
* `public.is_district_admin(check_district_id UUID) RETURNS BOOLEAN`:
  Checks active membership in `district_members` where `profile_id = auth.uid()` or `public.is_super_admin()`.
* `public.is_organization_admin(check_org_id UUID) RETURNS BOOLEAN`:
  Checks active membership in `organization_members` where `profile_id = auth.uid()` or `public.is_super_admin()`.

### 2.2 Cascaded School Membership Checks
* `public.is_state_admin_of_school(check_school_id UUID) RETURNS BOOLEAN`:
  Verifies that `schools.state_id` matches an active state where `auth.uid()` holds `STATE_ADMIN`.
* `public.is_district_admin_of_school(check_school_id UUID) RETURNS BOOLEAN`:
  Verifies that `schools.district_id` matches an active district where `auth.uid()` holds `DISTRICT_ADMIN`.
* `public.is_org_admin_of_school(check_school_id UUID) RETURNS BOOLEAN`:
  Verifies that `schools.organization_id` matches an active organization where `auth.uid()` holds `ORG_ADMIN`.

---

## 3. Core Table Policies

### 3.1 `schools` Table Policy
```sql
CREATE POLICY "schools_select_policy" ON schools
  FOR SELECT USING (
    id = public.get_user_school_id()
    OR public.is_school_member(id)
    OR public.is_state_admin_of_school(id)
    OR public.is_district_admin_of_school(id)
    OR public.is_org_admin_of_school(id)
    OR public.is_super_admin()
  );
```

### 3.2 `institutional_settings` Policy
```sql
CREATE POLICY "institutional_settings_select" ON institutional_settings
  FOR SELECT USING (
    public.is_super_admin()
    OR (scope_type = 'STATE' AND public.is_state_admin(scope_id))
    OR (scope_type = 'DISTRICT' AND public.is_district_admin(scope_id))
    OR (scope_type = 'ORGANIZATION' AND public.is_organization_admin(scope_id))
    OR (scope_type = 'SCHOOL' AND public.is_school_admin(scope_id))
  );
```

### 3.3 `daily_school_metrics` Policy
```sql
CREATE POLICY "daily_school_metrics_select" ON daily_school_metrics
  FOR SELECT USING (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
    OR public.is_state_admin_of_school(school_id)
    OR public.is_district_admin_of_school(school_id)
    OR public.is_org_admin_of_school(school_id)
  );
```

---

## 4. Complete Isolation of Independent Schools

Independent standalone schools have `state_id IS NULL`, `district_id IS NULL`, and `organization_id IS NULL`. As a consequence of the security definer functions, no state, district, or network administrator can view or modify independent school data. Only the school's own authenticated members and platform super administrators have access.
