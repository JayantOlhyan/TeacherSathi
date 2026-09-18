# Phase 10: Chaos Engineering & Graceful Degradation Testing

## 1. Chaos Injection Scenarios & Verification

TeacherSathi is engineered to gracefully degrade rather than crash catastrophically when secondary dependencies fail:

| Fault Injected | Target Component | Injected Failure Mechanism | Platform Behavior | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **AI Provider Outage** | Google Gemini / Anthropic | Simulated HTTP 503 gateway timeout. | AI features return structured user-safe error; core curriculum, teaching, and assessments remain **100% operational**. | PASS (`chaos-degradation.test.ts`) |
| **Storage S3 Degraded** | Supabase Storage Buckets | Simulated upload failure. | Existing cached assets serve via CDN; upload buttons show retry banner. | PASS |
| **Realtime WSS Drop** | Smartboard WebSocket | Dropped WebSocket connection. | Client switches seamlessly to periodic HTTP sequence sync without losing slide position. | PASS |
| **Queue Worker Crash** | Background Job Runner | Unhandled process kill during transcode. | Uncompleted job picked up by another worker or routed to Dead-Letter Queue after 3 attempts. | PASS (`job-dlq.test.ts`) |
| **Mobile Network Loss** | Native Mobile App | Full offline network disconnect. | Attempts saved transactionally in local SQLite; zero data loss; auto-syncs on reconnect. | PASS (`chaos-degradation.test.ts`) |

---

## 2. Key Takeaway: Independent Failure Domains

The system does not couple core curriculum viewing or classroom presentation display to AI availability. If external LLMs experience rate-limiting or outages, classroom teaching proceeds uninterrupted using canonical NCERT textbooks and teacher-prepared lesson slides.
