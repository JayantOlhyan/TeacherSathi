# Phase 8 — Query Performance, Indexing & Pre-Aggregation

## 1. Indexing Strategy

To support multi-tier institutional queries across thousands of schools and millions of student mastery records, the following composite and partial indexes are provisioned in `20260911000011_institutional_scale_and_administration.sql`:

### 1.1 `schools` Table
* `idx_schools_state_id` ON `schools(state_id)`
* `idx_schools_district_id` ON `schools(district_id)`
* `idx_schools_organization_id` ON `schools(organization_id)`

### 1.2 Administrative Memberships
* `idx_districts_state_id` ON `districts(state_id)`
* `idx_state_members_profile` ON `state_members(profile_id)`
* `idx_district_members_profile` ON `district_members(profile_id)`
* `idx_org_members_profile` ON `organization_members(profile_id)`

### 1.3 Settings & Invitations
* `idx_institutional_settings_lookup` ON `institutional_settings(scope_type, scope_id)`
* `idx_institutional_invitations_token_hash` ON `institutional_invitations(token_hash)`
* `idx_institutional_invitations_target` ON `institutional_invitations(target_type, target_id)`

---

## 2. Pre-Aggregation: `daily_school_metrics`

To prevent high-overhead table scans across the transactional database during state or district dashboard queries, the system includes `daily_school_metrics`:

```sql
CREATE TABLE IF NOT EXISTS public.daily_school_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  active_teachers_count INTEGER DEFAULT 0,
  active_students_count INTEGER DEFAULT 0,
  assessments_count INTEGER DEFAULT 0,
  smartboard_events_count INTEGER DEFAULT 0,
  average_mastery NUMERIC(5,2),
  open_gaps_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_daily_school_metric UNIQUE (school_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_school_metrics_lookup 
  ON public.daily_school_metrics(school_id, metric_date);
```

---

## 3. Query Optimization Best Practices

1. **Count Exact with Head Only**:
   Where possible, count queries use `{ count: 'exact', head: true }` to avoid transporting record payloads across network boundaries.
2. **Parallel Promise Resolution**:
   Scope aggregations execute operational subqueries (`teachers`, `students`, `classes`, `assessments`, `mastery`, `gaps`, `resources`) concurrently via `Promise.all`.
3. **Bounded Comparison Sets**:
   School comparison queries restrict payloads to $2 \le N \le 10$ schools, bounding calculation latency to $< 250\text{ms}$.
