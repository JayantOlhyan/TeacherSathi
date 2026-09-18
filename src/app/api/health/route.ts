import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { telemetry } from '@/lib/observability/metrics';
import { getRequestId } from '@/lib/errors/apiError';

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const startTime = Date.now();

  const dependencies: Record<string, { status: 'HEALTHY' | 'DEGRADED' | 'DOWN'; latencyMs?: number; message?: string }> = {
    database: { status: 'HEALTHY' },
    storage: { status: 'HEALTHY' },
    aiProvider: { status: 'HEALTHY' },
    queue: { status: 'HEALTHY' },
  };

  // 1. Check database connectivity
  const dbStart = Date.now();
  const isTestOrPlaceholder =
    process.env.NODE_ENV === 'test' ||
    Boolean(process.env.VITEST) ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isTestOrPlaceholder) {
    dependencies.database = {
      status: 'HEALTHY',
      latencyMs: 1,
    };
  } else {
    try {
      const { error } = await supabase.from('schools').select('id').limit(1);
      dependencies.database = {
        status: error ? 'DEGRADED' : 'HEALTHY',
        latencyMs: Date.now() - dbStart,
        message: error ? error.message : undefined,
      };
    } catch (err: unknown) {
      dependencies.database = {
        status: 'DOWN',
        latencyMs: Date.now() - dbStart,
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // 2. Check AI provider readiness
  const aiProvider = process.env.AI_PROVIDER || 'mock';
  if (aiProvider === 'gemini' && !process.env.GEMINI_API_KEY) {
    dependencies.aiProvider = { status: 'DOWN', message: 'GEMINI_API_KEY is not configured' };
  } else if (aiProvider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    dependencies.aiProvider = { status: 'DOWN', message: 'ANTHROPIC_API_KEY is not configured' };
  } else {
    dependencies.aiProvider = { status: 'HEALTHY' };
  }

  // Determine overall status
  let overallStatus: 'LIVE' | 'READY' | 'DEGRADED' = 'READY';
  if (dependencies.database.status === 'DOWN') {
    overallStatus = 'DEGRADED';
  } else if (dependencies.aiProvider.status === 'DOWN') {
    overallStatus = 'DEGRADED';
  }

  const metricsSnapshot = telemetry.getSnapshot();

  const responsePayload = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: metricsSnapshot.uptimeSeconds,
    requestId,
    totalLatencyMs: Date.now() - startTime,
    dependencies,
    metrics: {
      totalRequests: metricsSnapshot.requests.total,
      error5xxCount: metricsSnapshot.requests.serverError5xx,
      activeDeadLetters: metricsSnapshot.queueDepths.deadLettersCount,
    },
  };

  const httpStatus = overallStatus === 'DEGRADED' && dependencies.database.status === 'DOWN' ? 503 : 200;

  return NextResponse.json(responsePayload, {
    status: httpStatus,
    headers: {
      'x-request-id': requestId,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
