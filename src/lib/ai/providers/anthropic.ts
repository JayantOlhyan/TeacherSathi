import { BaseAIProvider } from './base';
import type { ChatMessage, GenerationResult, TokenUsage } from '../types';

export class AnthropicProvider extends BaseAIProvider {
  readonly name = 'anthropic';
  readonly model: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey?: string, model: string = 'claude-3-5-sonnet-20241022') {
    super();
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('AnthropicProvider requires a valid ANTHROPIC_API_KEY');
    }
    this.model = model;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
  }

  async generateStructured<T>(
    prompt: string,
    systemPrompt?: string,
    timeoutMs: number = 30000
  ): Promise<GenerationResult<T>> {
    const startTime = Date.now();
    const { signal, cleanup } = this.createAbortSignal(timeoutMs);

    try {
      const system = (systemPrompt || '') + '\n\nIMPORTANT: Your response must be strictly valid JSON without preamble, explanation, or markdown code fences outside the JSON.';

      const body = {
        model: this.model,
        max_tokens: 4096,
        temperature: 0.2,
        system,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      };

      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      const rawText = json.content?.[0]?.text || '';
      const usageMeta = json.usage || {};

      const token_usage: TokenUsage = {
        prompt_tokens: usageMeta.input_tokens || 0,
        completion_tokens: usageMeta.output_tokens || 0,
        total_tokens: (usageMeta.input_tokens || 0) + (usageMeta.output_tokens || 0),
      };

      const extractedJson = this.extractJson(rawText);
      const parsedData = JSON.parse(extractedJson) as T;

      return {
        data: parsedData,
        raw_text: rawText,
        provider: this.name,
        model: this.model,
        latency_ms: Date.now() - startTime,
        token_usage,
      };
    } finally {
      cleanup();
    }
  }

  async generateChat(
    messages: ChatMessage[],
    systemPrompt?: string,
    timeoutMs: number = 20000
  ): Promise<{ content: string; token_usage: TokenUsage; latency_ms: number }> {
    const startTime = Date.now();
    const { signal, cleanup } = this.createAbortSignal(timeoutMs);

    try {
      const formattedMessages = messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const body = {
        model: this.model,
        max_tokens: 2048,
        temperature: 0.7,
        system: systemPrompt,
        messages: formattedMessages,
      };

      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic Chat API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      const rawText = json.content?.[0]?.text || '';
      const usageMeta = json.usage || {};

      const token_usage: TokenUsage = {
        prompt_tokens: usageMeta.input_tokens || 0,
        completion_tokens: usageMeta.output_tokens || 0,
        total_tokens: (usageMeta.input_tokens || 0) + (usageMeta.output_tokens || 0),
      };

      return {
        content: rawText,
        token_usage,
        latency_ms: Date.now() - startTime,
      };
    } finally {
      cleanup();
    }
  }
}
