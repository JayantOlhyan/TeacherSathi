import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';
import { entitlementEngine } from '@/lib/billing/entitlements';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'SCHOOL_ADMIN' && profile.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only school administrators can access billing data.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetSchoolId =
      profile.role === 'SUPER_ADMIN' && searchParams.get('schoolId')
        ? searchParams.get('schoolId')!
        : profile.school_id;

    if (!targetSchoolId) {
      return NextResponse.json(
        { error: 'School ID required for billing resolution.' },
        { status: 400 }
      );
    }

    const [subscription, entitlementsProfile, usage] = await Promise.all([
      billingRepository.getSubscriptionBySchoolId(targetSchoolId, supabase),
      entitlementEngine.getSchoolEntitlements(targetSchoolId, supabase),
      entitlementEngine.getSchoolUsage(targetSchoolId, supabase),
    ]);

    return NextResponse.json({
      data: {
        subscription,
        entitlements: entitlementsProfile,
        usage,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
