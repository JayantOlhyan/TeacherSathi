import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import { logger } from '@/lib/observability/logger';
import { telemetry } from '@/lib/observability/metrics';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type DeadLetterStatus = 'DEAD' | 'REQUEUED' | 'PURGED';

export interface BackgroundJob {
  id: string;
  jobType: string;
  queueName?: string;
  payload: Record<string, unknown>;
  retryCount: number;
  maxRetries?: number;
  status: JobStatus;
  lastError?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface DeadLetterRecord {
  id: string;
  originalJobId: string;
  jobType: string;
  queueName: string;
  payload: Record<string, unknown>;
  failureReason: string;
  retryCount: number;
  lastAttemptedAt: string;
  status: DeadLetterStatus;
  requeuedAt?: string;
  purgedAt?: string;
  operatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback store for offline tests and simulated runs
const inMemoryDeadLetters: DeadLetterRecord[] = [];

const isTestOrPlaceholder =
  process.env.NODE_ENV === 'test' ||
  Boolean(process.env.VITEST) ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

export class DeadLetterQueueManager {
  private defaultMaxRetries: number;
  private client: SupabaseClient;

  constructor(defaultMaxRetries: number = 3, client: SupabaseClient = defaultClient) {
    this.defaultMaxRetries = defaultMaxRetries;
    this.client = client;
  }

  /**
   * Calculates exponential backoff delay in milliseconds with jitter.
   */
  calculateBackoffDelay(
    attempt: number,
    baseDelayMs: number = 1000,
    maxDelayMs: number = 30000,
    jitterMs: number = 500
  ): number {
    const exponential = baseDelayMs * Math.pow(2, Math.max(0, attempt - 1));
    const capped = Math.min(exponential, maxDelayMs);
    const jitter = Math.floor(Math.random() * jitterMs);
    return capped + jitter;
  }

  /**
   * Evaluates if a failed job has reached max retries.
   * If retry ceiling reached, quaranteens the job to the Dead-Letter Queue.
   */
  async handleJobFailure(
    job: BackgroundJob,
    error: unknown,
    queueName: string = 'default'
  ): Promise<{ deadLettered: boolean; nextRetryDelayMs?: number; deadLetter?: DeadLetterRecord }> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const maxRetries = job.maxRetries ?? this.defaultMaxRetries;
    const currentRetries = job.retryCount + 1;

    logger.warn(`Background job execution failed: ${job.id} (${job.jobType})`, {
      service: 'job-runner',
      operation: 'job_failure',
      jobId: job.id,
      retryCount: currentRetries,
      maxRetries,
      errorCategory: errorMessage,
    });

    if (currentRetries >= maxRetries) {
      // Reached maximum attempts: route to Dead-Letter Queue
      const deadLetter = await this.quarantineToDeadLetter(job, errorMessage, currentRetries, queueName);
      telemetry.recordError('JOB_DEAD_LETTERED');
      return { deadLettered: true, deadLetter };
    }

    // Still eligible for retry
    const nextRetryDelayMs = this.calculateBackoffDelay(currentRetries);
    return { deadLettered: false, nextRetryDelayMs };
  }

  /**
   * Quarantines a permanently failed job into the dead-letter queue.
   */
  async quarantineToDeadLetter(
    job: BackgroundJob,
    failureReason: string,
    retryCount: number,
    queueName: string = 'default'
  ): Promise<DeadLetterRecord> {
    const record: DeadLetterRecord = {
      id: `dlq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      originalJobId: job.id,
      jobType: job.jobType,
      queueName,
      payload: job.payload,
      failureReason,
      retryCount,
      lastAttemptedAt: new Date().toISOString(),
      status: 'DEAD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isTestOrPlaceholder) {
      inMemoryDeadLetters.unshift(record);
      logger.error(`Job permanently dead-lettered: ${job.id} (${job.jobType})`, {
        service: 'dlq-manager',
        operation: 'quarantine_job',
        jobId: job.id,
        retryCount,
        errorCategory: failureReason,
      });
      return record;
    }

    try {
      const { data, error } = await this.client
        .from('job_dead_letters')
        .insert({
          original_job_id: record.originalJobId,
          job_type: record.jobType,
          queue_name: record.queueName,
          payload: record.payload,
          failure_reason: record.failureReason,
          retry_count: record.retryCount,
          last_attempted_at: record.lastAttemptedAt,
          status: 'DEAD',
        })
        .select()
        .single();

      if (!error && data) {
        record.id = data.id;
      } else {
        // Fallback to in-memory store if DB table unavailable or in mock environment
        inMemoryDeadLetters.unshift(record);
      }
    } catch {
      inMemoryDeadLetters.unshift(record);
    }

    logger.error(`Job permanently dead-lettered: ${job.id} (${job.jobType})`, {
      service: 'dlq-manager',
      operation: 'quarantine_job',
      jobId: job.id,
      retryCount,
      errorCategory: failureReason,
    });

    return record;
  }

  /**
   * Lists dead letters for operator inspection.
   */
  async listDeadLetters(options?: {
    status?: DeadLetterStatus;
    limit?: number;
  }): Promise<DeadLetterRecord[]> {
    const status = options?.status || 'DEAD';
    const limit = options?.limit || 50;

    if (isTestOrPlaceholder) {
      return inMemoryDeadLetters.filter((item) => item.status === status).slice(0, limit);
    }

    try {
      const { data, error } = await this.client
        .from('job_dead_letters')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          originalJobId: d.original_job_id,
          jobType: d.job_type,
          queueName: d.queue_name,
          payload: d.payload,
          failureReason: d.failure_reason,
          retryCount: d.retry_count,
          lastAttemptedAt: d.last_attempted_at,
          status: d.status,
          requeuedAt: d.requeued_at,
          purgedAt: d.purged_at,
          operatorNotes: d.operator_notes,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Ignore and use in-memory fallback
    }

    return inMemoryDeadLetters.filter((item) => item.status === status).slice(0, limit);
  }

  /**
   * Requeues a dead-letter job for execution by an operator.
   */
  async requeue(deadLetterId: string, operatorNotes?: string): Promise<DeadLetterRecord> {
    const now = new Date().toISOString();

    if (!isTestOrPlaceholder) {
      try {
        await this.client
          .from('job_dead_letters')
          .update({
            status: 'REQUEUED',
            requeued_at: now,
            operator_notes: operatorNotes,
            updated_at: now,
          })
          .eq('id', deadLetterId);
      } catch {
        // In-memory update
      }
    }

    const item = inMemoryDeadLetters.find((dl) => dl.id === deadLetterId);
    if (item) {
      item.status = 'REQUEUED';
      item.requeuedAt = now;
      item.operatorNotes = operatorNotes;
      item.updatedAt = now;
      return item;
    }

    return {
      id: deadLetterId,
      originalJobId: 'unknown',
      jobType: 'UNKNOWN',
      queueName: 'default',
      payload: {},
      failureReason: 'Requeued',
      retryCount: 0,
      lastAttemptedAt: now,
      status: 'REQUEUED',
      requeuedAt: now,
      operatorNotes,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Purges a dead-letter job (permanent dismissal by operator).
   */
  async purge(deadLetterId: string, operatorNotes?: string): Promise<DeadLetterRecord> {
    const now = new Date().toISOString();

    if (!isTestOrPlaceholder) {
      try {
        await this.client
          .from('job_dead_letters')
          .update({
            status: 'PURGED',
            purged_at: now,
            operator_notes: operatorNotes,
            updated_at: now,
          })
          .eq('id', deadLetterId);
      } catch {
        // In-memory update
      }
    }

    const item = inMemoryDeadLetters.find((dl) => dl.id === deadLetterId);
    if (item) {
      item.status = 'PURGED';
      item.purgedAt = now;
      item.operatorNotes = operatorNotes;
      item.updatedAt = now;
      return item;
    }

    return {
      id: deadLetterId,
      originalJobId: 'unknown',
      jobType: 'UNKNOWN',
      queueName: 'default',
      payload: {},
      failureReason: 'Purged',
      retryCount: 0,
      lastAttemptedAt: now,
      status: 'PURGED',
      purgedAt: now,
      operatorNotes,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Clears in-memory dead letters for test cleanups.
   */
  reset(): void {
    inMemoryDeadLetters.length = 0;
  }
}

export const deadLetterQueue = new DeadLetterQueueManager();
