# TeacherSathi — AI Security Architecture

## 1. Threat Model & Mitigations

### 1.1 Credential Leakage Prevention
- **Threat**: Accidental exposure of AI provider keys in client-side bundles or browser local storage.
- **Mitigation**:
  - `GEMINI_API_KEY` and `ANTHROPIC_API_KEY` are only referenced in server-side files under `src/lib/ai/providers/`.
  - Keys do NOT use the `NEXT_PUBLIC_` prefix, preventing Next.js from inlining them into static assets.
  - Zero browser components directly make requests to external LLM endpoints.

### 1.2 Resource Hijacking & Impersonation
- **Threat**: Malicious actor specifies another teacher's `owner_id` or another school's `school_id` in generation payload.
- **Mitigation**:
  - The generation API route (`src/app/api/ai/generate/route.ts`) derives `user.id` and `profile.school_id` strictly from the server-validated JWT session.
  - Any client-submitted ownership parameters are discarded.

### 1.3 Privilege Escalation
- **Threat**: Student accounts invoking teacher-only generative endpoints.
- **Mitigation**:
  - `profilesRepository.getProfileById` checks `role === 'STUDENT'`.
  - Violations are immediately blocked with HTTP 403 Forbidden.

### 1.4 Rate & Abuse Attacks
- **Threat**: Scripted rapid generation exhausting API quotas or overwhelming server.
- **Mitigation**:
  - In-memory rate limiting rejects requests exceeding 5 calls per 30 seconds per user.
  - Database-backed monthly quota limits overall usage.
  - Idempotency caching prevents duplicate requests on double-clicks or network retries.

### 1.5 Prompt Injection & Data Exfiltration
- **Threat**: Teacher prompt overrides pedagogical safety constraints or extracts system secrets.
- **Mitigation**:
  - System instructions are isolated in system prompts (`systemPrompt`).
  - Teacher instructions are quarantined within the structured JSON schema instruction envelope.
  - Models are explicitly configured to output strictly valid JSON conforming to the schema, rejecting conversational deviations.
