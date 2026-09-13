# TeacherSathi — School Usage Metering & Quota Tracking

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Backend Developers, DevOps Engineers, School Administrators

---

## 1. Tracked Resource Metrics

TeacherSathi meters four core resource dimensions across each school institution:

| Resource Dimension | Unit of Measurement | Aggregation Scope | Underlying Data Source |
| :--- | :--- | :--- | :--- |
| **Teacher Accounts** | Active Teacher Seats | School-wide | Count of `users` where `school_id = :id AND role = 'TEACHER' AND is_active = TRUE` |
| **AI Generations** | Monthly Generation Requests | School-wide (Calendar Month) | Count of successful records in `ai_generation_metrics` where `school_id = :id AND created_at >= :month_start` |
| **Smartboard Displays**| Concurrently Paired Screens | School-wide | Active count in `classroom_session_devices` with active sessions |
| **Students Enrolled** | Roster Size | School-wide | Count of distinct students enrolled across all `classes` belonging to the school |

---

## 2. Real-Time Metering Queries (`src/lib/repositories/billing.ts`)

### 2.1 Aggregated School Metrics Query

```typescript
export async function getSchoolUsageMetrics(schoolId: string): Promise<SchoolUsageMetrics> {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  // Query 1: Active Teacher Count
  const { count: teacherCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('role', 'TEACHER')
    .eq('is_active', true);

  // Query 2: Monthly AI Generation Volume
  const { count: aiGenerationsCount } = await supabase
    .from('ai_generation_metrics')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .gte('created_at', monthStart)
    .eq('status', 'SUCCESS');

  // Query 3: Active Smartboards
  const { count: activeDisplaysCount } = await supabase
    .from('classroom_session_devices')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('is_active', true);

  // Query 4: Total Student Enrollment
  const { count: studentCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('role', 'STUDENT')
    .eq('is_active', true);

  return {
    teacherCount: teacherCount || 0,
    aiGenerationsThisMonth: aiGenerationsCount || 0,
    activeDisplaysCount: activeDisplaysCount || 0,
    studentCount: studentCount || 0,
  };
}
```

---

## 3. UI Visualization: School Admin Billing Hub

In `src/app/[locale]/dashboard/admin/billing/page.tsx`, resource utilization is presented with color-coded progress bars:
- **Green (Normal)**: Consumption $< 75\%$ of limit.
- **Amber (Approaching Limit)**: Consumption between $75\%$ and $90\%$ of limit.
- **Red (Critical / Maxed)**: Consumption $\ge 90\%$ of limit, with an immediate *Upgrade Plan* prompt.

---

## 4. Quota Enforcement Points

1. **Teacher Invitation / Creation**:
   - Checked in `/api/classes` or teacher invitation routes.
   - If `currentTeachers >= maxTeachers`, rejects creation with `HTTP 403 (Quota Exceeded)`.
2. **AI Content Generation**:
   - Checked in `/api/ai/generate` via `src/lib/ai/pipeline/rateLimiter.ts`.
   - If `monthlyAiCount >= monthlyAiLimit`, generation is blocked.
3. **Smartboard Kiosk Pairing**:
   - Checked in `/api/classroom/pair/consume`.
   - If active paired devices exceed `maxSmartboardPairings`, pairing code redemption is rejected.
