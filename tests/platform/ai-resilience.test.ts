import { describe, it, expect, beforeEach } from 'vitest';
import { aiResilience } from '@/lib/ai/resilience';
import { ApiError } from '@/lib/errors/apiError';

describe('Phase 10 — AI Provider Resilience & Fail-Closed Guards', () => {
  beforeEach(() => {
    aiResilience.reset();
  });

  it('fails closed in production if mock AI is requested without explicit permission', () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = 'production';

    try {
      expect(() => {
        aiResilience.assertProductionSafety('mock');
      }).toThrowError(/Production AI requires an active upstream provider/);
    } finally {
      (process.env as Record<string, string>).NODE_ENV = originalEnv!;
    }
  });

  it('allows mock AI in development or test environments', () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = 'development';

    try {
      expect(() => {
        aiResilience.assertProductionSafety('mock');
      }).not.toThrow();
    } finally {
      (process.env as Record<string, string>).NODE_ENV = originalEnv!;
    }
  });

  it('calculates token pricing estimates accurately in INR', () => {
    const cost = aiResilience.estimateCost('gemini', 'gemini-1.5-flash', 1000, 1000);
    // 1K prompt @ 0.03 + 1K completion @ 0.10 = 0.13 INR
    expect(cost.promptTokens).toBe(1000);
    expect(cost.completionTokens).toBe(1000);
    expect(cost.costInr).toBe(0.13);
  });

  it('enforces daily safety budgets and blocks execution when ceiling is exceeded', async () => {
    const teacherId = 'teacher_heavy_user';
    const limit = 50; // ₹50 budget

    // Initially within budget
    const initialCheck = aiResilience.checkBudget(teacherId, limit);
    expect(initialCheck.allowed).toBe(true);

    // Record ₹60 of usage
    aiResilience.recordUsage(teacherId, 'gemini', 'gemini-1.5-pro', 100000, 50000, 60);

    // Budget exceeded
    const exceededCheck = aiResilience.checkBudget(teacherId, limit);
    expect(exceededCheck.allowed).toBe(false);
    expect(exceededCheck.currentCostInr).toBe(60);
    expect(exceededCheck.remainingInr).toBe(0);

    // executeWithResilience blocks when over budget
    await expect(
      aiResilience.executeWithResilience(
        'generate_quiz',
        async () => ({ quiz: 'questions' }),
        { provider: 'mock', model: 'mock-ncert-model', userId: teacherId, customBudgetLimitInr: limit }
      )
    ).rejects.toThrowError(/Daily AI budget limit exceeded/);
  });

  it('enforces execution timeout when AI call hangs', async () => {
    const hangingAiCall = () =>
      new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

    await expect(
      aiResilience.executeWithResilience(
        'slow_call',
        hangingAiCall,
        { provider: 'mock', model: 'mock-ncert-model', timeoutMs: 50 }
      )
    ).rejects.toThrowError(/timed out after 50ms/);
  });
});
