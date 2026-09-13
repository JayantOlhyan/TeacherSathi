import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyticsRepository } from '@/lib/repositories/analytics';
import { entitlementEngine } from '@/lib/billing/entitlements';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = params.id;

    // 1. Fetch user role and school
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 403 });
    }

    if (userProfile.role === 'STUDENT') {
      return NextResponse.json(
        { error: 'Forbidden: Students cannot access class diagnostics' },
        { status: 403 }
      );
    }

    // 2. Fetch class context
    const { data: classRecord, error: classError } = await supabase
      .from('classes')
      .select('id, teacher_id, school_id')
      .eq('id', classId)
      .single();

    if (classError || !classRecord) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // 3. Authorization check (Section 36)
    if (userProfile.role === 'TEACHER') {
      if (classRecord.teacher_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden: You are not authorized to view diagnostics for this class.' },
          { status: 403 }
        );
      }
    } else if (userProfile.role === 'SCHOOL_ADMIN') {
      if (classRecord.school_id && userProfile.school_id && classRecord.school_id !== userProfile.school_id) {
        return NextResponse.json(
          { error: 'Forbidden: Class belongs to another school institution.' },
          { status: 403 }
        );
      }
    } else if (userProfile.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Billing Entitlement Check (Section 39)
    const schoolId = classRecord.school_id || userProfile.school_id;
    if (schoolId && userProfile.role !== 'SUPERADMIN') {
      const canAccess = await entitlementEngine.canUseFeature(schoolId, 'diagnostic_analytics');
      if (!canAccess) {
        return NextResponse.json(
          {
            error: 'Class-wide diagnostic intelligence requires an active School subscription.',
            code: 'ENTITLEMENT_REQUIRED',
          },
          { status: 403 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId') || undefined;
    const subjectId = searchParams.get('subjectId') || undefined;

    const report = await analyticsRepository.getClassMastery(
      classId,
      { chapterId, subjectId },
      supabase
    );

    return NextResponse.json({ data: report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
