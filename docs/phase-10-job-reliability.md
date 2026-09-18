# Phase 10: Background Job Reliability, Retry Policies & Dead-Letter Queue (DLQ)

## 1. Asynchronous Job Subsystems

TeacherSathi runs background tasks across 5 key workflows:
1. **Media Transcoding & Probe**: Video duration calculation, webp thumbnail generation.
2. **AI Question Bank & Lesson Plan Generation**: Large multivariable prompts.
3. **Assessment Grading & Analytics Recompute**: Bayesian concept mastery recalculation.
4. **Institutional Export & PDF Generation**: Large district-level CSV/PDF reports.
5. **Mobile Sync Dispatch**: Batched offline submission ingest.

---

## 2. Standardized Job Lifecycle & Retry Bounds

```
                ┌──────────────┐
                │    QUEUED    │
                └──────┬───────┘
                       │ Worker picks job
                       ▼
                ┌──────────────┐
       ┌───────►│  PROCESSING  │
       │        └──────┬───────┘
       │               │
       │    Success?   ├───────────────► ┌─────────────┐
       │               │                 │  COMPLETED  │
       │    Failure    ▼                 └─────────────┘
       │        ┌──────────────┐
       │        │    FAILED    │
       │        └──────┬───────┘
       │               │
       │ Attempts < 3? │ Attempts >= 3?
       │               │
       └───────────────┤                 ┌───────────────────┐
      Backoff Delay    └────────────────►│ DEAD-LETTER QUEUE │
    (Exponential +                       │(job_dead_letters) │
        Jitter)                          └─────────┬─────────┘
                                                   │
                                          Operator Inspection
                                                   │
                                     ┌─────────────┴─────────────┐
                                     ▼                           ▼
                             ┌───────────────┐           ┌───────────────┐
                             │ REQUEUE (DLQ) │           │  PURGE (DLQ)  │
                             └───────────────┘           └───────────────┘
```

### Jittered Exponential Backoff Formula
$$\text{Delay}(n) = \min\left(\text{maxDelay}, \text{baseDelay} \times 2^{n-1}\right) + \text{random}(0, \text{jitter})$$

- $\text{baseDelay} = 1000\text{ms}$
- $\text{maxDelay} = 30000\text{ms}$
- $\text{jitter} = 500\text{ms}$
- $\text{maxRetries} = 3$ attempts

---

## 3. Dead-Letter Quarantine (`job_dead_letters`)

When a job fails 3 consecutive times:
1. It is moved out of active job tables to prevent queue blocking.
2. An entry is created in `job_dead_letters` recording:
   - `original_job_id`, `job_type`, `queue_name`, `payload`, `failure_reason`, `retry_count`, `last_attempted_at`.
3. An alert is emitted to the telemetry collector and Operator Console.

---

## 4. Operator Runbook: Resolving Dead-Letter Jobs

1. Open `/admin/operations` and select the **Dead-Letter Queue** tab.
2. Review the `Failure Reason` (e.g., `503 Upstream AI Timeout`, `Memory Limit Exceeded`).
3. If transient (e.g. upstream recovered), click **Requeue** and provide an operator reason.
4. If invalid or corrupt payload (e.g. malformed file), click **Purge** to permanently dismiss it.
5. All actions are logged immutably to `operator_audit_logs`.
