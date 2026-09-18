import { describe, it, expect, beforeEach } from 'vitest';
import { GET as getHealth } from '@/app/api/admin/operations/health/route';
import { GET as getJobs, POST as postJob, DELETE as deleteJob } from '@/app/api/admin/operations/jobs/route';
import { GET as getFlags, POST as postFlag } from '@/app/api/admin/operations/feature-flags/route';
import { deadLetterQueue } from '@/lib/jobs/deadLetterQueue';
import { featureFlags } from '@/lib/services/featureFlags';

describe('Phase 10 — Operator Console & Safe Actions API', () => {
  beforeEach(() => {
    deadLetterQueue.reset();
    featureFlags.reset();
  });

  it('GET /api/admin/operations/health returns system resources and telemetry', async () => {
    const req = new Request('https://teachersathi.in/api/admin/operations/health');
    const res = await getHealth(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.system.nodeVersion).toBeDefined();
    expect(json.system.uptimeSeconds).toBeDefined();
    expect(json.telemetry).toBeDefined();
  });

  it('GET and POST /api/admin/operations/jobs manages dead-letter jobs', async () => {
    // 1. Create a dead letter job
    const dlqRecord = await deadLetterQueue.quarantineToDeadLetter(
      {
        id: 'job_op_test_1',
        jobType: 'EXPORT_PDF',
        payload: { classId: 'cls_1' },
        retryCount: 3,
        status: 'FAILED',
        createdAt: new Date().toISOString(),
      },
      'PDF engine crash',
      3
    );

    // 2. GET dead letters
    const listReq = new Request('https://teachersathi.in/api/admin/operations/jobs?status=DEAD');
    const listRes = await getJobs(listReq);
    expect(listRes.status).toBe(200);
    const listJson = await listRes.json();
    expect(listJson.count).toBeGreaterThanOrEqual(1);

    // 3. POST requeue
    const requeueReq = new Request('https://teachersathi.in/api/admin/operations/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deadLetterId: dlqRecord.id,
        operatorNotes: 'Verified memory limit patch',
      }),
    });
    const requeueRes = await postJob(requeueReq);
    expect(requeueRes.status).toBe(200);
    const requeueJson = await requeueRes.json();
    expect(requeueJson.success).toBe(true);
    expect(requeueJson.job.status).toBe('REQUEUED');

    // 4. DELETE purge
    const purgeReq = new Request('https://teachersathi.in/api/admin/operations/jobs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deadLetterId: dlqRecord.id,
        operatorNotes: 'Cleaned test job',
      }),
    });
    const purgeRes = await deleteJob(purgeReq);
    expect(purgeRes.status).toBe(200);
    const purgeJson = await purgeRes.json();
    expect(purgeJson.success).toBe(true);
    expect(purgeJson.job.status).toBe('PURGED');
  });

  it('GET and POST /api/admin/operations/feature-flags controls platform flags', async () => {
    // 1. GET flags
    const getReq = new Request('https://teachersathi.in/api/admin/operations/feature-flags');
    const getRes = await getFlags(getReq);
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.flags.length).toBeGreaterThan(0);

    // 2. POST update flag
    const postReq = new Request('https://teachersathi.in/api/admin/operations/feature-flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flagKey: 'dynamic_ncert_podcasts',
        description: 'AI Generated Audio Podcasts for NCERT chapters',
        isEnabled: true,
        scope: 'PLATFORM',
        rolloutPercentage: 25,
        reason: 'Initiated pilot rollout for podcasts',
      }),
    });
    const postRes = await postFlag(postReq);
    expect(postRes.status).toBe(200);
    const postJson = await postRes.json();
    expect(postJson.success).toBe(true);
    expect(postJson.flag.flagKey).toBe('dynamic_ncert_podcasts');
    expect(postJson.flag.rolloutPercentage).toBe(25);
  });
});
