import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dataQualityService } from '@/lib/services/dataQuality';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Only teachers, school admins, and superadmins can inspect data quality
    if (!userProfile || userProfile.role === 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const scan = await dataQualityService.scanDataQuality(supabase);

    return NextResponse.json({ data: scan });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
