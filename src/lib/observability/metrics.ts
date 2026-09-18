export interface LatencyStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface AiUsageMetrics {
  totalRequests: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalEstimatedCostInr: number;
  byProvider: Record<string, { requests: number; tokens: number; costInr: number }>;
}

export interface SystemMetricsReport {
  timestamp: string;
  uptimeSeconds: number;
  requests: {
    total: number;
    success2xx: number;
    clientError4xx: number;
    serverError5xx: number;
  };
  latencies: Record<string, LatencyStats>;
  errorsByCode: Record<string, number>;
  aiUsage: AiUsageMetrics;
  queueDepths: {
    mediaJobsQueued: number;
    deadLettersCount: number;
  };
}

class TelemetryCollector {
  private startTime = Date.now();
  private totalRequests = 0;
  private success2xx = 0;
  private clientError4xx = 0;
  private serverError5xx = 0;

  private routeDurations = new Map<string, number[]>();
  private errorsByCode = new Map<string, number>();

  private aiUsage: AiUsageMetrics = {
    totalRequests: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalEstimatedCostInr: 0,
    byProvider: {},
  };

  private activeQueueDepths = {
    mediaJobsQueued: 0,
    deadLettersCount: 0,
  };

  recordRequest(status: number): void {
    this.totalRequests++;
    if (status >= 200 && status < 300) this.success2xx++;
    else if (status >= 400 && status < 500) this.clientError4xx++;
    else if (status >= 500) this.serverError5xx++;
  }

  recordLatency(route: string, durationMs: number): void {
    if (!this.routeDurations.has(route)) {
      this.routeDurations.set(route, []);
    }
    const samples = this.routeDurations.get(route)!;
    samples.push(durationMs);
    // Keep max 1000 rolling samples per route to constrain memory
    if (samples.length > 1000) {
      samples.shift();
    }
  }

  recordError(code: string): void {
    const current = this.errorsByCode.get(code) || 0;
    this.errorsByCode.set(code, current + 1);
  }

  recordAiUsage(
    provider: string,
    model: string,
    promptTokens: number,
    completionTokens: number,
    estimatedCostInr: number
  ): void {
    this.aiUsage.totalRequests++;
    this.aiUsage.totalPromptTokens += promptTokens;
    this.aiUsage.totalCompletionTokens += completionTokens;
    this.aiUsage.totalEstimatedCostInr += estimatedCostInr;

    const key = `${provider}:${model}`;
    if (!this.aiUsage.byProvider[key]) {
      this.aiUsage.byProvider[key] = { requests: 0, tokens: 0, costInr: 0 };
    }
    const current = this.aiUsage.byProvider[key];
    current.requests++;
    current.tokens += promptTokens + completionTokens;
    current.costInr += estimatedCostInr;
  }

  setQueueDepths(mediaQueued: number, deadLetters: number): void {
    this.activeQueueDepths.mediaJobsQueued = mediaQueued;
    this.activeQueueDepths.deadLettersCount = deadLetters;
  }

  private calculatePercentiles(samples: number[]): LatencyStats {
    if (!samples || samples.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((acc, val) => acc + val, 0);

    const getP = (p: number) => {
      const idx = Math.min(Math.floor((p / 100) * count), count - 1);
      return sorted[idx];
    };

    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: Math.round((sum / count) * 100) / 100,
      p50: getP(50),
      p95: getP(95),
      p99: getP(99),
    };
  }

  getSnapshot(): SystemMetricsReport {
    const latencies: Record<string, LatencyStats> = {};
    this.routeDurations.forEach((samples, route) => {
      latencies[route] = this.calculatePercentiles(samples);
    });

    const errors: Record<string, number> = {};
    this.errorsByCode.forEach((count, code) => {
      errors[code] = count;
    });

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      requests: {
        total: this.totalRequests,
        success2xx: this.success2xx,
        clientError4xx: this.clientError4xx,
        serverError5xx: this.serverError5xx,
      },
      latencies,
      errorsByCode: errors,
      aiUsage: {
        ...this.aiUsage,
        totalEstimatedCostInr: Math.round(this.aiUsage.totalEstimatedCostInr * 100) / 100,
      },
      queueDepths: { ...this.activeQueueDepths },
    };
  }

  reset(): void {
    this.totalRequests = 0;
    this.success2xx = 0;
    this.clientError4xx = 0;
    this.serverError5xx = 0;
    this.routeDurations.clear();
    this.errorsByCode.clear();
    this.aiUsage = {
      totalRequests: 0,
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalEstimatedCostInr: 0,
      byProvider: {},
    };
    this.activeQueueDepths = {
      mediaJobsQueued: 0,
      deadLettersCount: 0,
    };
  }
}

export const telemetry = new TelemetryCollector();
