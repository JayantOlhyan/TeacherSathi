export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  service?: string;
  requestId?: string;
  userId?: string;
  tenantId?: string;
  schoolId?: string;
  operation?: string;
  durationMs?: number;
  result?: 'SUCCESS' | 'FAILURE' | 'DEGRADED';
  errorCategory?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  requestId?: string;
  userId?: string;
  tenantId?: string;
  schoolId?: string;
  operation?: string;
  durationMs?: number;
  result?: 'SUCCESS' | 'FAILURE' | 'DEGRADED';
  errorCategory?: string;
  metadata?: Record<string, unknown>;
}

const REDACTED_KEYS = new Set([
  'password',
  'token',
  'accesstoken',
  'refreshtoken',
  'authtoken',
  'authorization',
  'secret',
  'apikey',
  'api_key',
  'servicekey',
  'otp',
  'cookie',
  'set-cookie',
  'rawanswers',
  'studentanswers',
  'answers',
  'privatekey',
  'secretkey',
]);

/**
 * Recursively scrubs sensitive PII, passwords, OTPs, and secrets from logging metadata.
 */
export function sanitizeLogData<T>(input: T, seen = new WeakSet<object>()): T {
  if (input === null || typeof input !== 'object') {
    return input;
  }

  if (seen.has(input as object)) {
    return '[Circular]' as unknown as T;
  }
  seen.add(input as object);

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeLogData(item, seen)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
    if (REDACTED_KEYS.has(normalizedKey)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeLogData(value, seen);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

class StructuredLogger {
  private defaultService: string;

  constructor(defaultService: string = 'teachersathi-core') {
    this.defaultService = defaultService;
  }

  private write(level: LogLevel, message: string, context?: LogContext): LogEntry {
    const {
      service = this.defaultService,
      requestId,
      userId,
      tenantId,
      schoolId,
      operation,
      durationMs,
      result,
      errorCategory,
      ...extraMeta
    } = context || {};

    const sanitizedMeta = Object.keys(extraMeta).length > 0 
      ? sanitizeLogData(extraMeta) 
      : undefined;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service,
      ...(requestId ? { requestId } : {}),
      ...(userId ? { userId } : {}),
      ...(tenantId ? { tenantId } : {}),
      ...(schoolId ? { schoolId } : {}),
      ...(operation ? { operation } : {}),
      ...(typeof durationMs === 'number' ? { durationMs } : {}),
      ...(result ? { result } : {}),
      ...(errorCategory ? { errorCategory } : {}),
      ...(sanitizedMeta ? { metadata: sanitizedMeta } : {}),
    };

    const jsonString = JSON.stringify(entry);

    if (level === 'ERROR') {
      console.error(jsonString);
    } else if (level === 'WARN') {
      console.warn(jsonString);
    } else if (level === 'DEBUG') {
      if (process.env.NODE_ENV !== 'production' || process.env.LOG_LEVEL === 'DEBUG') {
        console.debug(jsonString);
      }
    } else {
      console.log(jsonString);
    }

    return entry;
  }

  info(message: string, context?: LogContext): LogEntry {
    return this.write('INFO', message, context);
  }

  warn(message: string, context?: LogContext): LogEntry {
    return this.write('WARN', message, context);
  }

  error(message: string, context?: LogContext): LogEntry {
    return this.write('ERROR', message, context);
  }

  debug(message: string, context?: LogContext): LogEntry {
    return this.write('DEBUG', message, context);
  }

  withService(service: string): StructuredLogger {
    return new StructuredLogger(service);
  }
}

export const logger = new StructuredLogger();
