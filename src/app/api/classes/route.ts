import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classesRepository } from '@/lib/repositories/classes';
import { profilesRepository } from '@/lib/repositories/profiles';
import { auditRepository } from '@/lib/repositories/audit';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const teacherId = searchParams.get('teacherId') || (user ? user.id : null);

    if (schoolId) {
      const classes = await classesRepository.getClassesBySchool(schoolId, supabase);
      return NextResponse.json({ data: classes });
    }

    if (teacherId) {
      const classes = await classesRepository.getClassesByTeacher(teacherId, supabase);
      return NextResponse.json({ data: classes });
    }

    return NextResponse.json({ error: 'Missing schoolId or teacherId parameter' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const profile = await profilesRepository.getProfileById(user.id, supabase);

    // If teacher is creating, ensure school_id matches their profile
    const schoolId = body.school_id || profile?.school_id;
    if (!schoolId) {
      return NextResponse.json({ error: 'School ID required' }, { status: 400 });
    }

    const newClass = await classesRepository.createClass({
      ...body,
      school_id: schoolId,
      teacher_id: body.teacher_id || user.id,
    }, supabase);

    await auditRepository.logAction(
      'CREATE_CLASS',
      'CLASS',
      newClass.id,
      { name: newClass.name, grade: newClass.grade_id },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: newClass }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
