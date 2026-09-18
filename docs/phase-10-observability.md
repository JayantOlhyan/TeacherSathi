# Phase 10: Observability, Structured Logging & Metrics Architecture

## 1. Machine-Readable Structured JSON Logging

All platform services, background jobs, and API routes log in machine-readable JSON adhering to the standardized schema implemented in `src/lib/observability/logger.ts`:

```json
{
  "timestamp": "2026-09-13T18:00:00.123Z",
  "level": "INFO",
  "message": "Classroom session state transition",
  "service": "smartboard-service",
  "requestId": "req_mu048mob_ekyzqd0",
  "userId": "usr_91234567-89ab-cdef-0123-456789abcdef",
  "tenantId": "sch_10293847-5647-3829-1029-384756473829",
  "operation": "slide_advance",
  "durationMs": 32,
  "result": "SUCCESS",
  "metadata": {
    "sessionId": "sess_class_10a",
    "currentSlideIndex": 4
  }
}
```

---

## 2. PII & Secret Redaction Guardrails

To comply with data privacy regulations (Digital Personal Data Protection Act 2023) and prevent credential leakage into centralized log aggregators (e.g. Datadog, CloudWatch, Loki):

The following keys are **strictly scrubbed** (`[REDACTED]`) at the logging layer:
- Passwords (`password`, `currentPassword`, `newPassword`)
- Tokens (`token`, `authToken`, `accessToken`, `refreshToken`, `pushToken`)
- Authorization headers (`authorization`, `bearer`)
- Secrets & Keys (`secret`, `apiKey`, `serviceKey`, `privateKey`)
- OTPs & PINs (`otp`, `pin`, `pairingCode`)
- Raw student answers (`answers`, `studentAnswers`, `rawAnswers`)
- Cookie payloads (`cookie`, `set-cookie`)

---

## 3. Telemetry & Metrics Instrumentation

The in-memory telemetry buffer (`src/lib/observability/metrics.ts`) aggregates high-frequency operational metrics without burdening persistent storage:

1. **Latency Distributions**:
   - Rolling calculation of `p50`, `p95`, `p99`, `min`, `max`, and `avg` per API endpoint.
   - Enforces Phase 10 performance budgets:
     - API p95 $< 500\text{ms}$
     - Critical writes p95 $< 500\text{ms}$
     - Autosave p95 $< 100\text{ms}$
2. **Error Counters by Code**:
   - `RATE_LIMITED`, `AUTHENTICATION_REQUIRED`, `FORBIDDEN`, `DEPENDENCY_FAILURE`, `INTERNAL_ERROR`.
3. **AI Cost Accounting**:
   - Cumulative prompt tokens, completion tokens, and estimated cost in INR ($\text{₹}$).
   - Per-provider breakdowns (Gemini 1.5 Flash, Gemini 1.5 Pro, Claude 3.5 Sonnet).
4. **Queue Depths**:
   - Media jobs queued / processing.
   - Dead-letter queue depth requiring operator review.

---

## 4. Alerting Thresholds & Operational Response

| Alert Name | Condition | Severity | Immediate Action |
| :--- | :--- | :--- | :--- |
| **API Error Spike** | 5xx error rate $> 2\%$ over 5 min | SEV-1 | Check DB connection pool and upstream status |
| **Database Latency Warning** | DB query p95 $> 300\text{ms}$ for 10 min | SEV-2 | Inspect pg_stat_activity for slow locks or table scans |
| **AI Provider Outage** | AI failure rate $> 10\%$ over 5 min | SEV-2 | Verify API key quota or fail-closed state; notify teachers |
| **DLQ Backlog Warning** | Dead-letter queue depth $> 25$ jobs | SEV-3 | Operator opens `/admin/operations` to review and requeue |
| **Brute-Force Lockout Burst**| $> 50$ locked IPs in 10 min | SEV-2 | Inspect IP blocks; activate Cloudflare bot challenge |
