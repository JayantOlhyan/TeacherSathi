# TeacherSathi — AI Provider Architecture

## 1. Provider Abstraction Overview
To prevent vendor lock-in and enable seamless offline CI testing, TeacherSathi implements a unified provider interface:

```typescript
export interface AIProvider {
  readonly name: string;
  readonly model: string;

  generateStructured<T>(
    prompt: string,
    systemPrompt?: string,
    timeoutMs?: number
  ): Promise<GenerationResult<T>>;

  generateChat(
    messages: ChatMessage[],
    systemPrompt?: string,
    timeoutMs?: number
  ): Promise<{ content: string; token_usage: TokenUsage; latency_ms: number }>;
}
```

---

## 2. Base Provider Capabilities (`BaseAIProvider`)
All providers inherit from `BaseAIProvider` (`src/lib/ai/providers/base.ts`), which provides:
1. **Robust JSON Extraction (`extractJson`)**:
   - Strips leading/trailing markdown code fences (````json ... ````).
   - Locates balanced bounding delimiters `{ ... }` or `[ ... ]`.
   - Protects against conversational preamble or trailing model commentary.
2. **Bounded Execution (`createAbortSignal`)**:
   - Enforces default 30,000 ms timeout signals on outbound fetch requests.
   - Prevents stranded background promises or hanging connections.

---

## 3. Implemented Providers

### 3.1 Mock AI Provider (`MockAIProvider`)
- **Location**: `src/lib/ai/providers/mock.ts`
- **Default Model**: `mock-ai-v1`
- **Purpose**: Offline development, deterministic automated unit & pipeline testing, CI environments.
- **Key Features**:
  - Zero external network dependencies.
  - Returns 100% valid schema and educational payloads for all 8 products.
  - Supports error injection via `shouldFail` flag for testing retry and failure pathways.

### 3.2 Google Gemini Provider (`GeminiProvider`)
- **Location**: `src/lib/ai/providers/gemini.ts`
- **Default Model**: `gemini-1.5-flash`
- **Protocol**: Direct REST via HTTPS `generateContent`.
- **Key Features**:
  - Leverages native `responseMimeType: "application/json"`.
  - Captures usage metadata (`promptTokenCount`, `candidatesTokenCount`).
  - Low latency for Indian school connectivity profiles.

### 3.3 Anthropic Claude Provider (`AnthropicProvider`)
- **Location**: `src/lib/ai/providers/anthropic.ts`
- **Default Model**: `claude-3-5-sonnet-20241022`
- **Protocol**: Direct REST via HTTPS `messages` endpoint.
- **Key Features**:
  - High pedagogical fidelity for complex multi-section CBSE test papers.
  - Strict system prompt JSON envelope enforcement.
  - Token tracking via input/output token counters.

---

## 4. Provider Factory & Dependency Injection (`getAIProvider`)
- **Location**: `src/lib/ai/providers/index.ts`
- **Resolution Priority**:
  1. If `AI_PROVIDER=gemini` and `GEMINI_API_KEY` is present -> `GeminiProvider`.
  2. If `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` is present -> `AnthropicProvider`.
  3. Default / Fallback -> `MockAIProvider`.
- **Runtime Override (`setAIProvider`)**: Allows unit tests to inject custom mock instances at runtime.
