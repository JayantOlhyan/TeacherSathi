import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyticsRepository } from '@/lib/repositories/analytics';
import { interventionsRepository } from '@/lib/repositories/interventions';

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

    const targetStudentId = params.id;

    // 1. Fetch requesting user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 403 });
    }

    // 2. Fetch target student profile
    const { data: targetProfile, error: targetError } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', targetStudentId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // 3. Strict Authorization (Section 36 & 42)
    if (userProfile.role === 'STUDENT') {
      if (user.id !== targetStudentId) {
        return NextResponse.json(
          { error: 'Forbidden: Students cannot access other students academic profiles.' },
          { status: 403 }
        );
      }
    } else if (userProfile.role === 'TEACHER') {
      // Verify teacher teaches this student in an active class
      const { data: teachesStudent } = await supabase
        .from('class_students')
        .select('id, class:classes!inner(id, teacher_id)')
        .eq('student_id', targetStudentId)
        .eq('classes.teacher_id', user.id)
        .eq('enrollment_status', 'ACTIVE')
        .limit(1);

      if (!teachesStudent || teachesStudent.length === 0) {
        return NextResponse.json(
          { error: 'Forbidden: You do not teach this student.' },
          { status: 403 }
        );
      }
    } else if (userProfile.role === 'SCHOOL_ADMIN') {
      if (targetProfile.school_id && userProfile.school_id && targetProfile.school_id !== userProfile.school_id) {
        return NextResponse.json(
          { error: 'Forbidden: Student belongs to another school institution.' },
          { status: 403 }
        );
      }
    } else if (userProfile.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId') || undefined;
    const subjectId = searchParams.get('subjectId') || undefined;

    const profile = await analyticsRepository.getStudentMasteryProfile(
      targetStudentId,
      { subjectId, chapterId },
      supabase
    );

    // Fetch assigned interventions for student
    const interventions = await interventionsRepository.getInterventionsByStudent(
      targetStudentId,
      supabase
    );

    return NextResponse.json({
      data: {
        ...profile,
        interventions,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
