# Phase 10: Disaster Recovery Strategy, PITR & Failure Playbooks

## 1. Recovery Objectives (RPO & RTO)

| Metric | Target | Technical Mechanism |
| :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | $\le 15\text{ minutes}$ | Continuous Write-Ahead Log (WAL) archiving + 24-hour incremental snapshots in Supabase PostgreSQL. |
| **Recovery Time Objective (RTO)** | $\le 2\text{ hours}$ | Automated Multi-AZ failover + automated PITR deployment playbooks. |

---

## 2. Backup Architecture

1. **Daily Full Physical Backups**:
   - Snapshot taken daily at 02:00 IST (low classroom usage period).
   - Encrypted at rest (AES-256) and replicated across geographically separated cloud storage regions.
2. **Continuous Point-in-Time Recovery (PITR)**:
   - PostgreSQL WAL files streamed every 60 seconds to encrypted object storage.
   - Enables restoring database state to any specific minute within the preceding 30 days.
3. **Weekly Backup Restoration Verification**:
   - Automated weekly job restores the latest snapshot into an isolated staging environment and runs the full test suite (`npm test`) to verify table integrity.

---

## 3. Incident Recovery Playbooks

### Playbook A: Primary Database Outage
1. **Detection**: `/api/health` reports status `DEGRADED`, database `DOWN`. PagerDuty SEV-1 triggered.
2. **Containment**: Traffic is held at edge; clients receive user-safe `503 Service Unavailable` with `x-request-id`.
3. **Recovery**:
   - Trigger Supabase / cloud provider automatic standby failover.
   - If standby fails, initiate PITR restoration to the timestamp 2 minutes prior to failure.
4. **Verification**: Verify `/api/health/ready` returns 200 OK. Run smoke query on `schools` and `assessments`.
5. **Post-Mortem**: Publish root-cause analysis within 24 hours.

### Playbook B: Upstream AI Provider Outage (Gemini / Anthropic)
1. **Detection**: Telemetry error code `DEPENDENCY_FAILURE` exceeds 10% on AI endpoints.
2. **Behavior**: System **fails closed** on generation requests with descriptive user feedback (`"AI generation is temporarily degraded"`).
3. **Resilience**: The core teaching platform, NCERT curriculum textbooks, smartboards, offline packs, and assessment players **remain 100% functional**.

### Playbook C: Bad Database Migration Rollback
1. All migrations in `supabase/migrations/` are required to be non-destructive (adding columns as nullable or with defaults, creating indexes concurrently).
2. If a migration introduces a locking regression:
   - Operators query active locks: `SELECT pid, query, state, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle';`
   - Terminate offending PID: `SELECT pg_terminate_backend(pid);`
   - Revert schema changes using the corresponding rollback script.

### Playbook D: Credential / Secret Compromise
1. Rotate Supabase `service_role` and `anon` keys via Supabase Console.
2. Deploy updated environment variables to hosting runtime with zero-downtime rolling restart.
3. Invalidate active client sessions by incrementing JWT token version or forcing global session expiration.
