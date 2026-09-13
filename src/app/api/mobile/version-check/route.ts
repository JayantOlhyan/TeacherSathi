import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AppVersionCheckResponse, AppVersionStatus } from '@/lib/validations/notifications';

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map((p) => parseInt(p, 10) || 0);
  const parts2 = v2.split('.').map((p) => parseInt(p, 10) || 0);
  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = (searchParams.get('platform') || 'android').toLowerCase() as 'android' | 'ios';
    const clientVersion = searchParams.get('version') || '1.0.0';

    let config: {
      min_supported_version?: string;
      latest_version?: string;
      update_url?: string;
      release_notes?: string;
    } | null = null;

    try {
      const supabase = createClient();
      const res = await supabase
        .from('app_version_configs')
        .select('*')
        .eq('platform', platform)
        .maybeSingle();
      config = res.data;
    } catch {
      // Safe fallback when database or cookie store is inaccessible
    }

    const minSupported = config?.min_supported_version || '1.0.0';
    const latestVersion = config?.latest_version || '1.0.0';
    const updateUrl = config?.update_url || (platform === 'android'
      ? 'https://play.google.com/store/apps/details?id=in.teachersathi.app'
      : 'https://apps.apple.com/app/teachersathi/id0000000000');
    const releaseNotes = config?.release_notes || 'Stable production release';


    let status: AppVersionStatus = 'CURRENT';

    if (compareVersions(clientVersion, minSupported) < 0) {
      status = 'UPDATE_REQUIRED';
    } else if (compareVersions(clientVersion, latestVersion) < 0) {
      status = 'UPDATE_RECOMMENDED';
    }

    const response: AppVersionCheckResponse = {
      status,
      platform,
      client_version: clientVersion,
      min_supported_version: minSupported,
      latest_version: latestVersion,
      update_url: updateUrl,
      release_notes: releaseNotes,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
