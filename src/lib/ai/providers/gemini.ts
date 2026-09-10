import { BaseAIProvider } from './base';
import type { ChatMessage, GenerationResult, TokenUsage } from '../types';

export class GeminiProvider extends BaseAIProvider {
  readonly name = 'gemini';
  readonly model: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey?: string, model: string = 'gemini-1.5-flash') {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GeminiProvider requires a valid GEMINI_API_KEY');
    }
    this.model = model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async generateStructured<T>(
    prompt: string,
    systemPrompt?: string,
    timeoutMs: number = 30000
  ): Promise<GenerationResult<T>> {
    const startTime = Date.now();
    const { signal, cleanup } = this.createAbortSignal(timeoutMs);

    try {
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}\n\nYou must respond strictly with valid JSON conforming to the requested schema. Do not include markdown commentary.` }],
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood. I will provide strictly valid JSON.' }],
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });

      const body = {
        contents,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const usageMeta = json.usageMetadata || {};

      const token_usage: TokenUsage = {
        prompt_tokens: usageMeta.promptTokenCount || 0,
        completion_tokens: usageMeta.candidatesTokenCount || 0,
        total_tokens: usageMeta.totalTokenCount || 0,
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
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }],
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood.' }],
        });
      }

      for (const msg of messages) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }

      const body = {
        contents,
        generationConfig: {
          temperature: 0.7,
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini Chat API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const usageMeta = json.usageMetadata || {};

      const token_usage: TokenUsage = {
        prompt_tokens: usageMeta.promptTokenCount || 0,
        completion_tokens: usageMeta.candidatesTokenCount || 0,
        total_tokens: usageMeta.totalTokenCount || 0,
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
