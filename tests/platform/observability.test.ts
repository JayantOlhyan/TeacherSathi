import { describe, it, expect, beforeEach } from 'vitest';
import { logger, sanitizeLogData } from '@/lib/observability/logger';
import { telemetry } from '@/lib/observability/metrics';

describe('Phase 10 — Observability & Telemetry', () => {
  beforeEach(() => {
    telemetry.reset();
  });

  it('redacts sensitive PII, passwords, OTPs, and API tokens from log metadata', () => {
    const rawData = {
      username: 'teacher1',
      password: 'SuperSecretPassword123!',
      otp: '654321',
      authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      answers: { q1: 'A', q2: 'B' },
      studentAnswers: ['Option A'],
      safeField: 'Grade 10 Science',
      nested: {
        apiKey: 'sk-ant-api03-secret',
        score: 95,
      },
    };

    const sanitized = sanitizeLogData(rawData);

    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.otp).toBe('[REDACTED]');
    expect(sanitized.authToken).toBe('[REDACTED]');
    expect(sanitized.answers).toBe('[REDACTED]');
    expect(sanitized.studentAnswers).toBe('[REDACTED]');
    expect(sanitized.nested.apiKey).toBe('[REDACTED]');

    // Preserves non-sensitive data
    expect(sanitized.username).toBe('teacher1');
    expect(sanitized.safeField).toBe('Grade 10 Science');
    expect(sanitized.nested.score).toBe(95);
  });

  it('handles circular references gracefully during sanitization without crashing', () => {
    const circularObj: Record<string, unknown> = { name: 'circular test' };
    circularObj.self = circularObj;

    const sanitized = sanitizeLogData(circularObj);
    expect(sanitized.name).toBe('circular test');
    expect(sanitized.self).toBe('[Circular]');
  });

  it('formats structured log entries with timestamp, level, service, and correlation ID', () => {
    const entry = logger.info('Classroom session initiated', {
      service: 'smartboard-service',
      requestId: 'req_obs_123',
      userId: 'user_456',
      durationMs: 42,
      result: 'SUCCESS',
    });

    expect(entry.level).toBe('INFO');
    expect(entry.service).toBe('smartboard-service');
    expect(entry.requestId).toBe('req_obs_123');
    expect(entry.userId).toBe('user_456');
    expect(entry.durationMs).toBe(42);
    expect(entry.result).toBe('SUCCESS');
    expect(entry.timestamp).toBeDefined();
  });

  it('accumulates latency percentiles (p50, p95, p99) accurately in telemetry buffer', () => {
    const route = '/api/assessments/[id]/submit';
    // Record latencies: 10, 20, 30, ..., 100
    for (let i = 1; i <= 10; i++) {
      telemetry.recordLatency(route, i * 10);
    }

    const snapshot = telemetry.getSnapshot();
    const stats = snapshot.latencies[route];

    expect(stats).toBeDefined();
    expect(stats.count).toBe(10);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(100);
    expect(stats.p50).toBe(60);
    expect(stats.p95).toBe(100);
  });

  it('tracks AI token consumption and financial cost estimates', () => {
    telemetry.recordAiUsage('gemini', 'gemini-1.5-flash', 1000, 500, 0.08);
    telemetry.recordAiUsage('gemini', 'gemini-1.5-flash', 2000, 1000, 0.16);

    const snapshot = telemetry.getSnapshot();
    expect(snapshot.aiUsage.totalRequests).toBe(2);
    expect(snapshot.aiUsage.totalPromptTokens).toBe(3000);
    expect(snapshot.aiUsage.totalCompletionTokens).toBe(1500);
    expect(snapshot.aiUsage.totalEstimatedCostInr).toBe(0.24);
  });
});
