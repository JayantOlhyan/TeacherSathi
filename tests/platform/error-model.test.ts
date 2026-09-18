import { describe, it, expect } from 'vitest';
import {
  ApiError,
  createErrorResponse,
  formatErrorResponse,
  getRequestId,
} from '@/lib/errors/apiError';

describe('Phase 10 — Standard Global Error Model', () => {
  it('instantiates strongly-typed ApiError variants with appropriate status codes', () => {
    const authErr = ApiError.authenticationRequired('Sign-in required');
    expect(authErr.code).toBe('AUTHENTICATION_REQUIRED');
    expect(authErr.statusCode).toBe(401);

    const forbidErr = ApiError.forbidden('Forbidden action');
    expect(forbidErr.code).toBe('FORBIDDEN');
    expect(forbidErr.statusCode).toBe(403);

    const notFoundErr = ApiError.notFound('Resource missing');
    expect(notFoundErr.code).toBe('NOT_FOUND');
    expect(notFoundErr.statusCode).toBe(404);

    const validErr = ApiError.validationError('Invalid payload', { field: 'email' });
    expect(validErr.code).toBe('VALIDATION_ERROR');
    expect(validErr.statusCode).toBe(422);
    expect(validErr.details).toEqual({ field: 'email' });

    const rateErr = ApiError.rateLimited('Slow down');
    expect(rateErr.code).toBe('RATE_LIMITED');
    expect(rateErr.statusCode).toBe(429);

    const depErr = ApiError.dependencyFailure('Database unreachable');
    expect(depErr.code).toBe('DEPENDENCY_FAILURE');
    expect(depErr.statusCode).toBe(503);
  });

  it('formats errors into standardized JSON payloads containing correlation ID', async () => {
    const reqId = 'req_test_123456';
    const response = createErrorResponse('RATE_LIMITED', 'Rate limit hit', 429, reqId, { retryAfter: 30 });

    expect(response.status).toBe(429);
    expect(response.headers.get('x-request-id')).toBe(reqId);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('RATE_LIMITED');
    expect(body.error.message).toBe('Rate limit hit');
    expect(body.error.requestId).toBe(reqId);
    expect(body.error.details).toEqual({ retryAfter: 30 });
  });

  it('extracts or creates correlation IDs reliably', () => {
    // Generated ID
    const generated = getRequestId();
    expect(generated.startsWith('req_')).toBe(true);

    // Extracted from Request Headers
    const req = new Request('https://teachersathi.in/api/test', {
      headers: { 'x-request-id': 'client_correlation_abc' },
    });
    expect(getRequestId(req)).toBe('client_correlation_abc');
  });

  it('handles unknown caught errors and formats them into safe 500 error responses', async () => {
    const rawError = new Error('Unexpected crash in evaluation logic');
    const response = formatErrorResponse(rawError, 'req_err_999');

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INTERNAL_ERROR');
    expect(body.error.requestId).toBe('req_err_999');
  });
});
