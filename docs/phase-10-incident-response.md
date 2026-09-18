# Phase 10: Platform Incident Response & Management Procedures

## 1. Severity Levels & Escalation Matrix

| Severity | Definition | Response SLA | Escalation Target |
| :--- | :--- | :--- | :--- |
| **SEV-1** (Critical) | Total platform outage, primary DB down, or failure during state-wide examination window. | $< 15\text{ minutes}$ | Incident Commander, Lead Architect, CTO, Operations On-Call. |
| **SEV-2** (Major) | Substantial degradation: AI provider down, high 5xx error spike ($> 5\%$), or mobile sync failure. | $< 30\text{ minutes}$ | Engineering Lead, SRE On-Call. |
| **SEV-3** (Moderate) | Background job dead-letter backlog, non-critical report export failures, localized slowdown. | $< 2\text{ hours}$ | On-Call Engineer, Platform Developer. |
| **SEV-4** (Low) | Cosmetic UI anomalies, minor translation issues, documentation gaps. | Next Business Day | Product Team Backlog. |

---

## 2. Incident Lifecycle Flow

```
   ┌─────────────┐
   │  DETECTION  │  Monitoring alerts, /api/health probes, error spikes
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   TRIAGE    │  Assign Severity (SEV 1–4), designate Incident Commander
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ CONTAINMENT │  Isolate failure, engage rate limits, activate kill-switches
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │  RECOVERY   │  Standby failover, PITR restore, rollback migration, patch
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │VERIFICATION │  Run health probes, smoke tests, confirm metric normalization
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │COMMUNICATION│  Publish status update to schools and district administrators
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ POST-MORTEM │  Blameless retrospective, root cause analysis, action items
   └─────────────┘
```

---

## 3. Communication Protocol

- **Institutional Status Page**: Real-time status updates broadcast at `status.teachersathi.in`.
- **School Admin Banner**: Direct in-app announcement banner pushed to active teacher and school dashboards.
- **District / State Notification**: Automated SMS/Email alert dispatched to registered institutional nodal officers for any SEV-1 event exceeding 30 minutes.
