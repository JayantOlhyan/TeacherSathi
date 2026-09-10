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

  try {
    if (requestedProvider === 'gemini') {
      if (process.env.GEMINI_API_KEY) {
        currentProvider = new GeminiProvider();
        return currentProvider;
      }
      console.warn('[AIProviderFactory] GEMINI_API_KEY missing, falling back to MockAIProvider');
    } else if (requestedProvider === 'anthropic') {
      if (process.env.ANTHROPIC_API_KEY) {
        currentProvider = new AnthropicProvider();
        return currentProvider;
      }
      console.warn('[AIProviderFactory] ANTHROPIC_API_KEY missing, falling back to MockAIProvider');
    }
  } catch (err) {
    console.error('[AIProviderFactory] Failed to initialize requested provider, falling back to Mock:', err);
  }

  // Default fallback is always MockAIProvider for deterministic offline testing and dev
  currentProvider = new MockAIProvider();
  return currentProvider;
}

export function setAIProvider(provider: AIProvider | null): void {
  currentProvider = provider;
}

export { MockAIProvider, GeminiProvider, AnthropicProvider };
