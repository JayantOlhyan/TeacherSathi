import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
        { error: 'Forbidden: Only school administrators can access usage metrics.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetSchoolId =
      profile.role === 'SUPER_ADMIN' && searchParams.get('schoolId')
        ? searchParams.get('schoolId')!
        : profile.school_id;

    if (!targetSchoolId) {
      return NextResponse.json({ error: 'School ID required.' }, { status: 400 });
    }

    const [profileData, usage] = await Promise.all([
      entitlementEngine.getSchoolEntitlements(targetSchoolId, supabase),
      entitlementEngine.getSchoolUsage(targetSchoolId, supabase),
    ]);

    const quotas = {
      teachers: {
        current: usage.teachers,
        limit: profileData.entitlements.TEACHER_LIMIT,
        percent: Math.min(100, Math.round((usage.teachers / profileData.entitlements.TEACHER_LIMIT) * 100)),
      },
      students: {
        current: usage.students,
        limit: profileData.entitlements.STUDENT_LIMIT,
        percent: Math.min(100, Math.round((usage.students / profileData.entitlements.STUDENT_LIMIT) * 100)),
      },
      classes: {
        current: usage.classes,
        limit: profileData.entitlements.CLASS_LIMIT,
        percent: Math.min(100, Math.round((usage.classes / profileData.entitlements.CLASS_LIMIT) * 100)),
      },
      smartboards: {
        current: usage.smartboards,
        limit: profileData.entitlements.SMARTBOARD_LIMIT,
        percent: Math.min(100, Math.round((usage.smartboards / profileData.entitlements.SMARTBOARD_LIMIT) * 100)),
      },
      aiGenerations: {
        current: usage.aiGenerations,
        limit: profileData.entitlements.AI_GENERATION_LIMIT,
        percent: Math.min(100, Math.round((usage.aiGenerations / profileData.entitlements.AI_GENERATION_LIMIT) * 100)),
      },
      storageMb: {
        current: usage.storageMb,
        limit: profileData.entitlements.STORAGE_LIMIT_MB,
        percent: Math.min(100, Math.round((usage.storageMb / profileData.entitlements.STORAGE_LIMIT_MB) * 100)),
      },
    };

    return NextResponse.json({
      data: {
        schoolId: targetSchoolId,
        planSlug: profileData.planSlug,
        planName: profileData.planName,
        status: profileData.subscriptionStatus,
        quotas,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
