import { describe, it, expect, beforeEach } from 'vitest';
import { deadLetterQueue, BackgroundJob } from '@/lib/jobs/deadLetterQueue';

describe('Phase 10 — Background Job Reliability & Dead-Letter Queue (DLQ)', () => {
  beforeEach(() => {
    deadLetterQueue.reset();
  });

  it('calculates exponential backoff with ceiling and jitter', () => {
    const delay1 = deadLetterQueue.calculateBackoffDelay(1, 1000, 30000, 0);
    expect(delay1).toBe(1000);

    const delay2 = deadLetterQueue.calculateBackoffDelay(2, 1000, 30000, 0);
    expect(delay2).toBe(2000);

    const delay3 = deadLetterQueue.calculateBackoffDelay(3, 1000, 30000, 0);
    expect(delay3).toBe(4000);

    const delayMax = deadLetterQueue.calculateBackoffDelay(10, 1000, 30000, 0);
    expect(delayMax).toBe(30000); // capped at 30s
  });

  it('allows retries for jobs below the maximum retry threshold', async () => {
    const job: BackgroundJob = {
      id: 'job_transcode_1',
      jobType: 'TRANSCODE',
      payload: { assetId: 'asset_123' },
      retryCount: 0,
      maxRetries: 3,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };

    const outcome = await deadLetterQueue.handleJobFailure(job, new Error('FFmpeg timeout'));
    expect(outcome.deadLettered).toBe(false);
    expect(outcome.nextRetryDelayMs).toBeGreaterThan(0);
    expect(outcome.deadLetter).toBeUndefined();
  });

  it('quarantines jobs to the dead-letter queue when retry ceiling is reached', async () => {
    const job: BackgroundJob = {
      id: 'job_transcode_failed',
      jobType: 'TRANSCODE',
      payload: { assetId: 'asset_broken' },
      retryCount: 2, // 2 previous retries, this failure makes 3
      maxRetries: 3,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };

    const outcome = await deadLetterQueue.handleJobFailure(job, new Error('Corrupt video frame'));
    expect(outcome.deadLettered).toBe(true);
    expect(outcome.deadLetter).toBeDefined();
    expect(outcome.deadLetter?.originalJobId).toBe('job_transcode_failed');
    expect(outcome.deadLetter?.failureReason).toBe('Corrupt video frame');
    expect(outcome.deadLetter?.status).toBe('DEAD');

    // Job is now in DLQ list
    const dlqList = await deadLetterQueue.listDeadLetters({ status: 'DEAD' });
    expect(dlqList.some((item) => item.originalJobId === 'job_transcode_failed')).toBe(true);
  });

  it('allows operators to requeue and purge dead-letter jobs', async () => {
    const job: BackgroundJob = {
      id: 'job_to_requeue',
      jobType: 'MEDIA_PROBE',
      payload: { path: '/media/sample.pdf' },
      retryCount: 3,
      maxRetries: 3,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };

    const { deadLetter } = await deadLetterQueue.handleJobFailure(job, new Error('Out of memory'));
    expect(deadLetter).toBeDefined();

    // 1. Requeue
    const requeued = await deadLetterQueue.requeue(deadLetter!.id, 'Retrying with expanded memory limits');
    expect(requeued.status).toBe('REQUEUED');
    expect(requeued.operatorNotes).toBe('Retrying with expanded memory limits');

    // 2. Purge
    const purged = await deadLetterQueue.purge(deadLetter!.id, 'Permanently dismissed corrupt file');
    expect(purged.status).toBe('PURGED');
    expect(purged.operatorNotes).toBe('Permanently dismissed corrupt file');
  });
});
