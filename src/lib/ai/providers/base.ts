import type { AIProvider, ChatMessage, GenerationResult, TokenUsage } from '../types';

export abstract class BaseAIProvider implements AIProvider {
  abstract readonly name: string;
  abstract readonly model: string;

  protected extractJson(text: string): string {
    let clean = text.trim();
    // Remove markdown code blocks if present
    if (clean.startsWith('```')) {
      const firstNewline = clean.indexOf('\n');
      const lastFence = clean.lastIndexOf('```');
      if (firstNewline !== -1 && lastFence > firstNewline) {
        clean = clean.substring(firstNewline + 1, lastFence).trim();
      }
    }

    // Locate the first { or [ and last } or ]
    const firstBrace = clean.indexOf('{');
    const firstBracket = clean.indexOf('[');
    let startIdx = 0;

    if (firstBrace !== -1 && firstBracket !== -1) {
      startIdx = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
      startIdx = firstBrace;
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
    }

    const lastBrace = clean.lastIndexOf('}');
    const lastBracket = clean.lastIndexOf(']');
    const endIdx = Math.max(lastBrace, lastBracket);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      return clean.substring(startIdx, endIdx + 1);
    }

    return clean;
  }

  protected createAbortSignal(timeoutMs: number = 30000): { signal: AbortSignal; cleanup: () => void } {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    return {
      signal: controller.signal,
      cleanup: () => clearTimeout(timer),
    };
  }

  abstract generateStructured<T>(
    prompt: string,
    systemPrompt?: string,
    timeoutMs?: number
  ): Promise<GenerationResult<T>>;

  abstract generateChat(
    messages: ChatMessage[],
    systemPrompt?: string,
    timeoutMs?: number
  ): Promise<{ content: string; token_usage: TokenUsage; latency_ms: number }>;
}
