import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'AUTHENTICATION_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'DEPENDENCY_FAILURE'
  | 'INTERNAL_ERROR';

export interface ApiErrorDetails {
  [key: string]: unknown;
}

export interface ApiErrorResponsePayload {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
    details?: ApiErrorDetails;
  };
}

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: ApiErrorDetails;

  constructor(code: ApiErrorCode, message: string, statusCode: number = 500, details?: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static authenticationRequired(message: string = 'Authentication credentials are required', details?: ApiErrorDetails) {
    return new ApiError('AUTHENTICATION_REQUIRED', message, 401, details);
  }

  static forbidden(message: string = 'Access denied for this resource or action', details?: ApiErrorDetails) {
    return new ApiError('FORBIDDEN', message, 403, details);
  }

  static notFound(message: string = 'Requested resource could not be found', details?: ApiErrorDetails) {
    return new ApiError('NOT_FOUND', message, 404, details);
  }

  static validationError(message: string = 'Validation failed for the request payload', details?: ApiErrorDetails) {
    return new ApiError('VALIDATION_ERROR', message, 422, details);
  }

  static rateLimited(message: string = 'Rate limit exceeded. Please retry later.', details?: ApiErrorDetails) {
    return new ApiError('RATE_LIMITED', message, 429, details);
  }

  static conflict(message: string = 'Resource conflict detected', details?: ApiErrorDetails) {
    return new ApiError('CONFLICT', message, 409, details);
  }

  static idempotencyConflict(message: string = 'A concurrent request with the same idempotency key is processing', details?: ApiErrorDetails) {
    return new ApiError('IDEMPOTENCY_CONFLICT', message, 409, details);
  }

  static dependencyFailure(message: string = 'Upstream service or dependency temporarily unavailable', details?: ApiErrorDetails) {
    return new ApiError('DEPENDENCY_FAILURE', message, 503, details);
  }

  static internal(message: string = 'An unexpected internal error occurred', details?: ApiErrorDetails) {
    return new ApiError('INTERNAL_ERROR', message, 500, details);
  }
}

/**
 * Extracts x-request-id or generates a new correlation ID for tracing.
 */
export function getRequestId(request?: Request | Headers | null): string {
  if (request) {
    const headers = 'headers' in request ? request.headers : request;
    const existing = headers.get('x-request-id') || headers.get('x-correlation-id');
    if (existing) return existing.trim();
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `req_${timestamp}_${randomPart}`;
}

/**
 * Builds a standardized JSON error response adhering to Phase 10 specification.
 * In production mode, sensitive internal stack traces or raw errors are scrubbed.
 */
export function createErrorResponse(
  code: ApiErrorCode,
  message: string,
  statusCode: number,
  requestId: string,
  details?: ApiErrorDetails,
  customHeaders?: Record<string, string>
): NextResponse<ApiErrorResponsePayload> {
  const isProd = process.env.NODE_ENV === 'production';
  const safeMessage = (isProd && statusCode >= 500 && code === 'INTERNAL_ERROR')
    ? 'An unexpected error occurred. Please contact support with the request ID.'
    : message;

  const payload: ApiErrorResponsePayload = {
    success: false,
    error: {
      code,
      message: safeMessage,
      requestId,
      ...(details ? { details } : {}),
    },
  };

  const headers = new Headers({
    'Content-Type': 'application/json',
    'x-request-id': requestId,
    ...customHeaders,
  });

  return NextResponse.json(payload, {
    status: statusCode,
    headers,
  });
}

/**
 * Formats any unknown caught error into a standardized NextResponse.
 */
export function formatErrorResponse(
  err: unknown,
  requestId?: string,
  customHeaders?: Record<string, string>
): NextResponse<ApiErrorResponsePayload> {
  const reqId = requestId || getRequestId();

  if (err instanceof ApiError) {
    return createErrorResponse(err.code, err.message, err.statusCode, reqId, err.details, customHeaders);
  }

  if (err instanceof Error) {
    return createErrorResponse('INTERNAL_ERROR', err.message, 500, reqId, undefined, customHeaders);
  }

  return createErrorResponse('INTERNAL_ERROR', 'Unknown system error', 500, reqId, undefined, customHeaders);
}
