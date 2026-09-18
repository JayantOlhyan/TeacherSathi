import type { AIProvider } from '../types';
import { MockAIProvider } from './mock';
import { GeminiProvider } from './gemini';
import { AnthropicProvider } from './anthropic';

let currentProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (currentProvider) {
    return currentProvider;
  }

  const requestedProvider = (process.env.AI_PROVIDER || 'mock').toLowerCase().trim();

  const isProd = process.env.NODE_ENV === 'production';

  try {
    if (requestedProvider === 'gemini') {
      if (process.env.GEMINI_API_KEY) {
        currentProvider = new GeminiProvider();
        return currentProvider;
      }
      if (isProd) {
        throw new Error('GEMINI_API_KEY missing in production. Fail-closed: mock fallback disabled.');
      }
      console.warn('[AIProviderFactory] GEMINI_API_KEY missing, falling back to MockAIProvider');
    } else if (requestedProvider === 'anthropic') {
      if (process.env.ANTHROPIC_API_KEY) {
        currentProvider = new AnthropicProvider();
        return currentProvider;
      }
      if (isProd) {
        throw new Error('ANTHROPIC_API_KEY missing in production. Fail-closed: mock fallback disabled.');
      }
      console.warn('[AIProviderFactory] ANTHROPIC_API_KEY missing, falling back to MockAIProvider');
    } else if (isProd && requestedProvider !== 'mock') {
      throw new Error(`Unsupported production AI provider: ${requestedProvider}`);
    }
  } catch (err) {
    if (isProd) {
      console.error('[AIProviderFactory] Production AI initialization failed. Failing closed:', err);
      throw err;
    }
    console.error('[AIProviderFactory] Failed to initialize requested provider, falling back to Mock:', err);
  }

  // In non-production or when mock is explicitly configured, fallback to MockAIProvider
  currentProvider = new MockAIProvider();
  return currentProvider;
}

export function setAIProvider(provider: AIProvider | null): void {
  currentProvider = provider;
}

export { MockAIProvider, GeminiProvider, AnthropicProvider };
