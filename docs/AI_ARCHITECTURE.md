# TeacherSathi — AI Generation Architecture

## 1. Executive Summary
TeacherSathi Phase 2 establishes a production-grade, curriculum-aware AI generation engine.
The system departs fundamentally from naive "prompt-to-text" wrappers by enforcing strict pedagogical context resolution from canonical PostgreSQL tables, Zod schema validation, educational constraint checking (e.g. marks arithmetic, time balance, smartboard readability), server-side telemetry, rate limiting, and resource lifecycle persistence.

---

## 2. Core Architectural Philosophy
1. **Curriculum Authority**: The PostgreSQL database and canonical NCERT syllabus are the authoritative source of truth. The LLM does not hallucinate syllabus concepts.
2. **Strict Structured Output**: Generative models must output validated JSON matching predefined Zod schemas. Freeform markdown is never stored as primary business content.
3. **Deterministic Logic for Deterministic Rules**: Marks arithmetic, option count validation, question numbering, time sums, rate limits, and ownership are executed in TypeScript code, never delegated to probabilistic model outputs.
4. **Resilience & Graceful Degradation**: Dual-attempt self-repair loops, bounded timeouts, idempotency caching, and an offline mock provider ensure high availability.

---

## 3. System Architecture Diagram

```text
               +-------------------------------------------+
               |         Teacher Request (Web UI)          |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |         Next.js Route Handlers            |
               |      POST /api/ai/generate & /genie       |
               +-------------------------------------------+
                                     |
               +---------------------+---------------------+
               | 1. Authentication Check (Supabase Auth)   |
               | 2. Role Authorization (Teachers Only)     |
               | 3. Rate Limit Check (5 req / 30 sec)      |
               | 4. Monthly Quota Check (ai_usage_tracking)|
               | 5. Idempotency Cache Lookup               |
               +---------------------+---------------------+
                                     |
                                     v
               +-------------------------------------------+
               |     Curriculum Context Resolver           |
               |   (Canonical Chapter, Concepts & Qs)      |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |          Prompt Construction              |
               |   (Pedagogical Instructions + Schema)     |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |        AI Provider Abstraction            |
               |  (MockProvider | Gemini | Anthropic)      |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |          AI Output Processing             |
               |     1. JSON Fence Extraction              |
               |     2. Zod Schema Validation              |
               |     3. Educational Pedagogical Checks     |
               |     4. Script & Language Verification     |
               |     5. Self-Repair Retry Loop (Max 2)     |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |             Persistence Layer             |
               |  - resources (Status: READY / DRAFT)      |
               |  - ai_generations (Telemetry & Latency)   |
               |  - ai_usage_tracking (Quota increment)    |
               |  - audit_logs (Action tracking)           |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |     Structured Teacher Resource Payload   |
               +-------------------------------------------+
```

---

## 4. Supported AI Products

| # | Product Name | Backend ID | Schema Definition | Target Medium |
|---|--------------|------------|-------------------|---------------|
| 1 | AI Lesson Plan | `lesson-plan` | `LessonPlanSchema` | 45-min Period Teaching Plan |
| 2 | AI Worksheet | `worksheet` | `WorksheetSchema` | Print & Homework PDF |
| 3 | AI Quiz | `quiz` | `QuizSchema` | Interactive Clicker / Live Class |
| 4 | AI Test Paper | `test-paper` | `TestPaperSchema` | Formal CBSE Summative Exam |
| 5 | AI Presentation | `presentation` | `PresentationSchema` | 75" Smartboard Display (<50 words/slide) |
| 6 | AI Mind Map | `mind-map` | `MindMapSchema` | Hierarchical Concept Tree |
| 7 | AI Teaching Activity | `teaching-activity` | `TeachingActivitySchema` | Hands-on Demonstration / Lab |
| 8 | Saathi Genie | `saathi-genie` | `SaathiGenieResponseSchema` | In-Class Co-pilot Assistant |

---

## 5. Security Guardrails
- **Zero Client Credential Leakage**: All AI keys (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`) are resolved exclusively on the server runtime.
- **Role Enforcement**: Student accounts are strictly barred with HTTP 403 Forbidden.
- **Server-Derived Ownership**: The `owner_id` is assigned from authenticated server session (`user.id`), preventing impersonation.
- **Quota Safeguards**: Configurable monthly caps per educator prevent budget runaway.
