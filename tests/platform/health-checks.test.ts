import { describe, it, expect } from 'vitest';
import { GET as getLive } from '@/app/api/health/live/route';
import { GET as getReady } from '@/app/api/health/ready/route';
import { GET as getHealth } from '@/app/api/health/route';

describe('Phase 10 — Health Check Endpoints', () => {
  it('GET /api/health/live responds with 200 and LIVE status', async () => {
    const response = await getLive();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.status).toBe('LIVE');
    expect(json.service).toBe('teachersathi-core');
    expect(json.timestamp).toBeDefined();
  });

  it('GET /api/health/ready checks system readiness', async () => {
    const response = await getReady();
    // In local mock or connected DB, it returns either 200 or 503 gracefully
    expect([200, 503]).toContain(response.status);

    const json = await response.json();
    expect(['READY', 'NOT_READY']).toContain(json.status);
    expect(json.timestamp).toBeDefined();
  });

  it('GET /api/health returns comprehensive operational health and telemetry', async () => {
    const req = new Request('https://teachersathi.in/api/health', {
      headers: { 'x-request-id': 'health_test_req' },
    });

    const response = await getHealth(req);
    expect([200, 503]).toContain(response.status);

    const json = await response.json();
    expect(['LIVE', 'READY', 'DEGRADED']).toContain(json.status);
    expect(json.requestId).toBe('health_test_req');
    expect(json.dependencies).toBeDefined();
    expect(json.dependencies.database).toBeDefined();
    expect(json.dependencies.aiProvider).toBeDefined();
    expect(json.metrics).toBeDefined();
  });
});
