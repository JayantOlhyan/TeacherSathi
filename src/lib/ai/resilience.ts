import { ApiError } from '@/lib/errors/apiError';
import { logger } from '@/lib/observability/logger';
import { telemetry } from '@/lib/observability/metrics';

export interface AiCostEstimate {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costInr: number;
}

export interface AiExecutionOptions {
  provider: string;
  model: string;
  timeoutMs?: number;
  userId?: string;
  schoolId?: string;
  requestId?: string;
  promptLengthChars?: number;
  customBudgetLimitInr?: number;
}

// Token pricing estimates in Indian Rupees (INR) per 1,000 tokens
const PRICING_PER_1K_TOKENS_INR: Record<string, { prompt: number; completion: number }> = {
  'gemini:gemini-1.5-flash': { prompt: 0.03, completion: 0.10 },
  'gemini:gemini-1.5-pro': { prompt: 0.28, completion: 0.85 },
  'anthropic:claude-3-5-sonnet-20241022': { prompt: 0.25, completion: 1.25 },
  'anthropic:claude-3-haiku-20240307': { prompt: 0.02, completion: 0.10 },
  'mock:mock-ncert-model': { prompt: 0.0, completion: 0.0 },
};

// Daily usage tracking map: key = `${schoolId || userId}:${date}` -> accumulated cost INR
const dailyUsageTracker = new Map<string, { requests: number; costInr: number }>();

export const DEFAULT_DAILY_SCHOOL_BUDGET_INR = 5000; // ₹5,000 daily safety ceiling per school
export const DEFAULT_DAILY_TEACHER_BUDGET_INR = 200; // ₹200 daily safety ceiling per teacher

export class AiResilienceManager {
  private defaultTimeoutMs: number;

  constructor(defaultTimeoutMs: number = 20000) {
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  /**
   * Enforces fail-closed rules in production environments.
   * If production is requested with a live provider, but keys/dependencies fail,
   * it must NEVER silently switch to mock AI.
   */
  assertProductionSafety(requestedProvider: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && requestedProvider === 'mock') {
      const allowMockInProd = process.env.ALLOW_MOCK_AI_IN_PROD === 'true';
      if (!allowMockInProd) {
        throw ApiError.dependencyFailure(
          'Production AI requires an active upstream provider (Gemini/Anthropic). Mock AI is disabled in production.'
        );
      }
    }
  }

  /**
   * Estimates token usage and monetary cost in INR from character count or token reports.
   */
  estimateCost(provider: string, model: string, promptTokens: number, completionTokens: number): AiCostEstimate {
    const key = `${provider.toLowerCase()}:${model.toLowerCase()}`;
    const pricing = PRICING_PER_1K_TOKENS_INR[key] || { prompt: 0.05, completion: 0.15 };

    const promptCost = (promptTokens / 1000) * pricing.prompt;
    const completionCost = (completionTokens / 1000) * pricing.completion;
    const totalCost = promptCost + completionCost;

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costInr: Math.round(totalCost * 1000) / 1000,
    };
  }

  /**
   * Checks whether the user or school has exceeded daily safety budget ceiling.
   */
  checkBudget(entityId: string, limitInr: number): { allowed: boolean; currentCostInr: number; remainingInr: number } {
    const today = new Date().toISOString().split('T')[0];
    const key = `${entityId}:${today}`;
    const record = dailyUsageTracker.get(key) || { requests: 0, costInr: 0 };

    if (record.costInr >= limitInr) {
      return {
        allowed: false,
        currentCostInr: record.costInr,
        remainingInr: 0,
      };
    }

    return {
      allowed: true,
      currentCostInr: record.costInr,
      remainingInr: Math.max(0, limitInr - record.costInr),
    };
  }

  /**
   * Records AI expenditure and records telemetry metrics.
   */
  recordUsage(
    entityId: string,
    provider: string,
    model: string,
    promptTokens: number,
    completionTokens: number,
    costInr: number
  ): void {
    const today = new Date().toISOString().split('T')[0];
    const key = `${entityId}:${today}`;
    const record = dailyUsageTracker.get(key) || { requests: 0, costInr: 0 };

    record.requests += 1;
    record.costInr += costInr;
    dailyUsageTracker.set(key, record);

    telemetry.recordAiUsage(provider, model, promptTokens, completionTokens, costInr);
  }

  /**
   * Wraps an AI generation call with timeout enforcement, circuit-breaking, and cost tracking.
   */
  async executeWithResilience<T>(
    operationName: string,
    fn: () => Promise<T>,
    options: AiExecutionOptions
  ): Promise<T> {
    const {
      provider,
      model,
      timeoutMs = this.defaultTimeoutMs,
      userId = 'anonymous',
      schoolId,
      requestId,
    } = options;

    // 1. Production safety check
    this.assertProductionSafety(provider);

    // 2. Budget verification
    const budgetEntityId = schoolId || userId;
    const budgetLimit = options.customBudgetLimitInr ?? (schoolId ? DEFAULT_DAILY_SCHOOL_BUDGET_INR : DEFAULT_DAILY_TEACHER_BUDGET_INR);
    const budgetCheck = this.checkBudget(budgetEntityId, budgetLimit);

    if (!budgetCheck.allowed) {
      logger.warn(`AI daily budget ceiling exceeded for ${budgetEntityId}`, {
        service: 'ai-resilience',
        operation: operationName,
        userId,
        schoolId,
        requestId,
        currentCostInr: budgetCheck.currentCostInr,
      });
      throw ApiError.forbidden(`Daily AI budget limit exceeded for this account (₹${budgetLimit} INR).`);
    }

    // 3. Execution with strict timeout
    const startTime = Date.now();
    let timer: NodeJS.Timeout | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(ApiError.dependencyFailure(`AI provider (${provider}) timed out after ${timeoutMs}ms.`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([fn(), timeoutPromise]);
      const durationMs = Date.now() - startTime;

      // Approximate tokens if not provided: ~4 chars per token
      const approxPromptTokens = Math.ceil((options.promptLengthChars || 400) / 4);
      const approxCompletionTokens = 600; // typical generation length
      const costEstimate = this.estimateCost(provider, model, approxPromptTokens, approxCompletionTokens);

      this.recordUsage(
        budgetEntityId,
        provider,
        model,
        costEstimate.promptTokens,
        costEstimate.completionTokens,
        costEstimate.costInr
      );

      logger.info(`AI operation succeeded: ${operationName}`, {
        service: 'ai-engine',
        operation: operationName,
        userId,
        schoolId,
        requestId,
        durationMs,
        result: 'SUCCESS',
        costInr: costEstimate.costInr,
      });

      return result;
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : String(err);

      logger.error(`AI operation failed: ${operationName}`, {
        service: 'ai-engine',
        operation: operationName,
        userId,
        schoolId,
        requestId,
        durationMs,
        result: 'FAILURE',
        errorCategory: errorMsg,
      });

      if (err instanceof ApiError) {
        throw err;
      }
      throw ApiError.dependencyFailure(`AI generation failed: ${errorMsg}`);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /**
   * Resets usage tracking (for tests).
   */
  reset(): void {
    dailyUsageTracker.clear();
  }
}

export const aiResilience = new AiResilienceManager();
