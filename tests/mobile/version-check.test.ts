import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as versionCheckHandler } from '../../src/app/api/mobile/version-check/route';
import { AppVersionCheckResponseSchema } from '../../src/lib/validations/notifications';

describe('Phase 9: Mobile App Version Check & Enforced Upgrade Gates', () => {
  it('should validate AppVersionCheckResponse against Zod schema', () => {
    const validData = {
      status: 'UPDATE_REQUIRED' as const,
      platform: 'android' as const,
      client_version: '0.9.0',
      min_supported_version: '1.0.0',
      latest_version: '1.2.0',
      update_url: 'https://play.google.com/store/apps/details?id=in.teachersathi.app',
      release_notes: 'Critical database synchronization fix',
    };

    const parsed = AppVersionCheckResponseSchema.parse(validData);
    expect(parsed.status).toBe('UPDATE_REQUIRED');
    expect(parsed.min_supported_version).toBe('1.0.0');
  });

  it('should return CURRENT status when client version equals or exceeds min supported', async () => {
    const req = new NextRequest(
      'https://teachersathi.in/api/mobile/version-check?platform=android&version=1.5.0'
    );

    const response = await versionCheckHandler(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('CURRENT');
    expect(json.data.client_version).toBe('1.5.0');
  });

  it('should return UPDATE_REQUIRED status when client version is below min supported', async () => {
    const req = new NextRequest(
      'https://teachersathi.in/api/mobile/version-check?platform=android&version=0.5.0'
    );

    const response = await versionCheckHandler(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('UPDATE_REQUIRED');
    expect(json.data.update_url).toContain('play.google.com');
  });

  it('should return platform-specific update URL for iOS', async () => {
    const req = new NextRequest(
      'https://teachersathi.in/api/mobile/version-check?platform=ios&version=0.8.0'
    );

    const response = await versionCheckHandler(req);
    const json = await response.json();
    expect(json.data.platform).toBe('ios');
    expect(json.data.update_url).toContain('apps.apple.com');
  });
});
