# Phase 10: Service Level Objectives (SLO) & Service Level Agreements (SLA)

## 1. Distinction: SLO vs SLA vs Internal Targets

To maintain operational clarity and protect the platform legally during government procurements:
- **Internal Engineering Target**: Operational stretch goals monitored by engineering teams to detect degradation before users notice.
- **Service Level Objective (SLO)**: Measurable reliability targets promised to platform stakeholders.
- **Service Level Agreement (SLA)**: Contractual commitment defining financial or contractual penalties if SLO targets are breached over billing periods.

---

## 2. Platform Service Objectives Table

| Subsystem / Journey | Internal Target | Platform SLO | Contractual Government SLA | Measurement Window |
| :--- | :--- | :--- | :--- | :--- |
| **Core Platform Availability** | $99.95\%$ | $99.9\%$ uptime | $99.5\%$ uptime (excluding scheduled maintenance) | Monthly rolling |
| **NCERT Curriculum Read p95** | $< 150\text{ms}$ | $< 300\text{ms}$ | $< 500\text{ms}$ | 5-minute rolling window |
| **Assessment Autosave p95** | $< 50\text{ms}$ | $< 100\text{ms}$ | $< 300\text{ms}$ | During active exam windows |
| **Assessment Submit Reliability** | $99.99\%$ | $99.9\%$ success | $99.5\%$ success | Monthly rolling |
| **AI Generation Availability** | $99.0\%$ | $98.5\%$ success | Best-effort upstream dependency | Monthly rolling |
| **Mobile Sync Acknowledgment** | $< 1.0\text{s}$ | $< 2.0\text{s}$ | $< 5.0\text{s}$ under normal 3G/4G | Per sync batch |
| **Smartboard Action Latency** | $< 100\text{ms}$ | $< 250\text{ms}$ | $< 500\text{ms}$ | In-session event dispatch |

---

## 3. Error Budget & Burn-Rate Policies

1. **Monthly Error Budget ($99.9\%$ SLO)**:
   - Permissible total downtime / failure budget: **43 minutes and 12 seconds** per calendar month.
2. **Burn-Rate Action Matrix**:
   - **$1\times$ Burn Rate**: Normal operations.
   - **$2\times$ Burn Rate** (Consuming budget in 15 days): Automated notification to platform reliability engineers.
   - **$5\times$ Burn Rate** (Consuming budget in 6 days): PagerDuty SEV-2 alert; feature rollouts frozen.
   - **$14.4\times$ Burn Rate** (Consuming $10\%$ of budget in 5 hours): Immediate SEV-1 incident declared; all non-critical background jobs paused.
