# TeacherSathi — AI Generation Pipeline

## 1. Pipeline Lifecycle Stages

Every generation follows an immutable 10-stage pipeline orchestrated by `executeGeneration` in `src/lib/ai/pipeline/generator.ts`:

```text
[1. Rate Limit] -> [2. Quota Check] -> [3. Idempotency Check]
        |
[4. Telemetry Pending] -> [5. Prompt Build] -> [6. AI Provider]
        |
[7. Zod Schema] -> [8. Educational Rules] -> [9. Persistence]
        |
[10. Idempotency Cache & Quota Increment]
```

---

## 2. Detailed Pipeline Steps

### Step 1: Rate Limiting
- **Enforcer**: `rateLimiter.checkRateLimit`
- **Rule**: Max 5 requests per 30-second rolling window per user.
- **Action on Violation**: Throws `AIGenerationError('RATE_LIMITED')` (HTTP 429).

### Step 2: Usage / Entitlement Check
- **Enforcer**: `rateLimiter.checkMonthlyQuota`
- **Rule**: Compares user monthly count against `monthly_quota` in `ai_usage_tracking`.
- **Action on Violation**: Throws `AIGenerationError('QUOTA_EXCEEDED')` (HTTP 429).

### Step 3: Idempotency Deduplication
- **Enforcer**: `rateLimiter.checkIdempotency`
- **Rule**: If client supplies `idempotency_key` and a cached result exists within 5-minute TTL, the cached result is returned instantly without hitting the AI provider.

### Step 4: Telemetry Registration
- **Table**: `ai_generations`
- **Status**: Recorded with `status: 'GENERATING'`, `provider`, `model`, input context metadata, and start timestamp.

### Step 5: Canonical Curriculum Resolution & Prompt Construction
- **Modules**: `src/lib/ai/pipeline/context.ts` & `src/lib/ai/pipeline/prompts.ts`
- **Operation**: Resolves canonical Grade, Subject, Chapter, Concepts, and Sample Questions. Generates a strict pedagogical prompt with target JSON schema.

### Step 6: Provider Invocation & Self-Repair Retry Loop
- **Maximum Retries**: 2 retries (up to 3 attempts total).
- **Self-Repair**: When Zod validation or educational rules fail on attempt $N$, the pipeline appends the exact error diagnostics to the prompt and retries.
- **Action on Total Failure**: Updates `ai_generations` status to `FAILED` and throws `AIGenerationError('VALIDATION_FAILED')`.

### Step 7: Schema Validation
- **Module**: `src/lib/ai/schemas/index.ts`
- **Operation**: Parses JSON with Zod schemas. Strips extraneous fields, verifies data types, enforces array min/max lengths and required properties.

### Step 8: Educational Validation
- **Module**: `src/lib/ai/validators/educational.ts`
- **Operation**: Deterministic algorithmic validation:
  - Duration arithmetic
  - Marks sum matching
  - Exactly 4 options and 1 correct answer for quizzes
  - Kiosk readability (<50 words/slide)
  - Connected graph verification for mind maps
  - Devanagari script presence for Hindi requests.

### Step 9: Database Persistence
- **Table**: `resources`
- **Status**: Sets initial status to `'READY'` (or `'DRAFT'`), links chapter ID, owner ID, school ID, resource type, and full metadata payload.

### Step 10: Finalization & Quota Recording
- **Table**: `ai_usage_tracking`
- **Operation**: Increments monthly usage count, completes `ai_generations` telemetry record with token usage and latency, caches result in idempotency cache.
