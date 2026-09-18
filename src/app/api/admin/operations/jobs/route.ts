import { NextResponse } from 'next/server';
import { deadLetterQueue, DeadLetterStatus } from '@/lib/jobs/deadLetterQueue';
import { getRequestId, createErrorResponse } from '@/lib/errors/apiError';
import { logger } from '@/lib/observability/logger';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as DeadLetterStatus) || 'DEAD';
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

  try {
    const jobs = await deadLetterQueue.listDeadLetters({ status, limit });
    return NextResponse.json({
      success: true,
      requestId,
      count: jobs.length,
      jobs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to list dead letters';
    return createErrorResponse('INTERNAL_ERROR', message, 500, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const { deadLetterId, operatorNotes } = body;

    if (!deadLetterId) {
      return createErrorResponse('VALIDATION_ERROR', 'deadLetterId is required', 422, requestId);
    }

    const updated = await deadLetterQueue.requeue(deadLetterId, operatorNotes);

    // Record operator audit log
    try {
      await supabase.from('operator_audit_logs').insert({
        operator_id: '00000000-0000-0000-0000-000000000000',
        action: 'REQUEUE_DEAD_LETTER',
        target_type: 'JOB_DEAD_LETTER',
        target_id: deadLetterId,
        reason: operatorNotes || 'Manual operator requeue',
        request_id: requestId,
        result: 'SUCCESS',
        metadata: { originalJobId: updated.originalJobId, jobType: updated.jobType },
      });
    } catch {
      // Ignore if table unavailable in local mock
    }

    logger.info(`Operator requeued dead letter job: ${deadLetterId}`, {
      service: 'operator-console',
      operation: 'requeue_job',
      requestId,
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Job requeued successfully for background processing',
      job: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to requeue job';
    return createErrorResponse('INTERNAL_ERROR', message, 500, requestId);
  }
}

export async function DELETE(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const { deadLetterId, operatorNotes } = body;

    if (!deadLetterId) {
      return createErrorResponse('VALIDATION_ERROR', 'deadLetterId is required', 422, requestId);
    }

    const purged = await deadLetterQueue.purge(deadLetterId, operatorNotes);

    // Record operator audit log
    try {
      await supabase.from('operator_audit_logs').insert({
        operator_id: '00000000-0000-0000-0000-000000000000',
        action: 'PURGE_DEAD_LETTER',
        target_type: 'JOB_DEAD_LETTER',
        target_id: deadLetterId,
        reason: operatorNotes || 'Manual operator purge',
        request_id: requestId,
        result: 'SUCCESS',
        metadata: { originalJobId: purged.originalJobId, jobType: purged.jobType },
      });
    } catch {
      // Ignore in local mock
    }

    logger.info(`Operator purged dead letter job: ${deadLetterId}`, {
      service: 'operator-console',
      operation: 'purge_job',
      requestId,
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Dead letter job purged permanently',
      job: purged,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to purge job';
    return createErrorResponse('INTERNAL_ERROR', message, 500, requestId);
  }
}
