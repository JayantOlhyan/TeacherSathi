# Phase 10: Platform Operations Console Architecture & Audit Trails

## 1. Console Access & Role-Based Isolation

The **Platform Operations Console** (`/admin/operations`) is a restricted operational dashboard designed exclusively for internal platform operators and Super Administrators:

- **Strict Access Gating**:
  - Requires `role = 'SUPER_ADMIN'` in authenticated JWT claims.
  - School administrators, teachers, and students are denied access (`403 Forbidden`).
- **Separation of Concerns**:
  - School and district admins manage academic rosters, invitations, and reporting in `/admin/institutional`.
  - Platform operators manage infrastructure health, background queues, and rollout flags in `/admin/operations`.

---

## 2. Console Capabilities & Safe Operational Actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PLATFORM OPERATIONS CONSOLE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ System Health ]        [ Dead-Letter Queue (DLQ) ]    [ Feature Flags ]   │
│                                                                             │
│  - Realtime Uptime        - Inspect Failed Jobs          - Kill-Switch      │
│  - Total API Invocations  - Requeue with Operator Note   - Rollout % (0-100)│
│  - DB Latency & Status    - Permanent Purge with Reason  - Scopes (Tiered)  │
│  - AI Provider Health                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Dead-Letter Recovery**:
   - Operators can review permanently failed media or transcode jobs.
   - Action: **Requeue Job** (POST `/api/admin/operations/jobs`) re-injects the job payload into active background queues.
   - Action: **Purge Job** (DELETE `/api/admin/operations/jobs`) permanently marks the job as PURGED with an explanatory note.
2. **Feature Flags & Rollout Control**:
   - Immediate toggle for experimental features.
   - Percentage rollout slider (e.g. 0% $\to$ 25% $\to$ 50% $\to$ 100%).
   - Scoped targeting (Platform, State, District, School).

---

## 3. Immutable Operator Action Auditing (`operator_audit_logs`)

Every mutating operator action generates an immutable database record:

```sql
INSERT INTO operator_audit_logs (
  operator_id, action, target_type, target_id, reason, request_id, ip_address, result, metadata
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'REQUEUE_DEAD_LETTER',
  'JOB_DEAD_LETTER',
  'dlq_12345678',
  'FFmpeg transcode memory limit patched',
  'req_mu049jwu_jz5w9ix',
  '10.0.4.12',
  'SUCCESS',
  '{"retryCount": 3}'
);
```
