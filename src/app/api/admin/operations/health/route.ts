import { NextResponse } from 'next/server';
import { telemetry } from '@/lib/observability/metrics';
import { getRequestId } from '@/lib/errors/apiError';

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const snapshot = telemetry.getSnapshot();

  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  return NextResponse.json(
    {
      success: true,
      requestId,
      system: {
        nodeVersion: process.version,
        uptimeSeconds: snapshot.uptimeSeconds,
        environment: process.env.NODE_ENV || 'development',
        memoryMb: memoryUsage ? {
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        } : null,
      },
      telemetry: snapshot,
    },
    {
      status: 200,
      headers: {
        'x-request-id': requestId,
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
