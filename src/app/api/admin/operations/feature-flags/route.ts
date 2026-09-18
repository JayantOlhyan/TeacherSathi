import { NextResponse } from 'next/server';
import { featureFlags } from '@/lib/services/featureFlags';
import { getRequestId, createErrorResponse } from '@/lib/errors/apiError';
import { logger } from '@/lib/observability/logger';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const flags = await featureFlags.listFlags();
    return NextResponse.json({
      success: true,
      requestId,
      count: flags.length,
      flags,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve feature flags';
    return createErrorResponse('INTERNAL_ERROR', message, 500, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const { flagKey, description, isEnabled, scope, targetIds, rolloutPercentage, reason } = body;

    if (!flagKey) {
      return createErrorResponse('VALIDATION_ERROR', 'flagKey is required', 422, requestId);
    }

    const updated = await featureFlags.setFlag({
      flagKey,
      description,
      isEnabled,
      scope,
      targetIds,
      rolloutPercentage,
    });

    // Record operator audit log
    try {
      await supabase.from('operator_audit_logs').insert({
        operator_id: '00000000-0000-0000-0000-000000000000',
        action: 'UPDATE_FEATURE_FLAG',
        target_type: 'FEATURE_FLAG',
        target_id: flagKey,
        reason: reason || 'Operator updated feature flag configuration',
        request_id: requestId,
        result: 'SUCCESS',
        metadata: {
          isEnabled: updated.isEnabled,
          scope: updated.scope,
          rolloutPercentage: updated.rolloutPercentage,
        },
      });
    } catch {
      // Ignore in local test/mock
    }

    logger.info(`Operator updated feature flag: ${flagKey}`, {
      service: 'operator-console',
      operation: 'update_feature_flag',
      requestId,
      flagKey,
      isEnabled: updated.isEnabled,
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: `Feature flag "${flagKey}" updated successfully`,
      flag: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update feature flag';
    return createErrorResponse('INTERNAL_ERROR', message, 500, requestId);
  }
}
