# TeacherSathi — AI Usage Policy & Cost Controls

## 1. Purpose
To ensure sustainable AI API expenditures, protect against accidental request loops, and establish an extensible foundation for future subscription tiers (Phase 3).

---

## 2. Default Quotas & Limits

| Parameter | Default Value | Configuration Variable | Scope |
|-----------|---------------|------------------------|-------|
| Free Tier Monthly Quota | 50 Generations | `AI_MONTHLY_QUOTA_FREE` | Per User / Calendar Month |
| Rapid Rate Limit | 5 requests / 30 seconds | In-memory sliding window | Per User / Client |
| Maximum Questions / Request | 30 questions | Schema constraint | Per Request |
| Maximum Slides / Request | 20 slides | Schema constraint | Per Request |
| Maximum Request Duration | 180 minutes | Schema constraint | Per Request |
| Generation Provider Timeout | 30,000 ms | Provider base controller | Per API Call |
| Self-Repair Retries | 2 retries (3 total attempts) | Generator config | Per Generation Request |
| Idempotency Cache TTL | 300,000 ms (5 minutes) | In-memory cache | Per Unique Key |

---

## 3. Quota Tracking Schema (`ai_usage_tracking`)
- **Primary Key**: `id` (UUID)
- **Dimensions**: `user_id`, `school_id`, `period_month` (e.g., `'2026-09'`)
- **Metrics**: `generation_count`, `monthly_quota`
- **Reset Logic**: Quota tracking resets automatically upon month transition (`period_month`).

---

## 4. Error Responses
- **Rate Limit Exceeded**: Returns HTTP 429 with `code: "RATE_LIMITED"` and retry-after header advice.
- **Quota Exceeded**: Returns HTTP 429 with `code: "QUOTA_EXCEEDED"` indicating current usage vs monthly quota.
