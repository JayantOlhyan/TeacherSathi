import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';
import { auditRepository } from '@/lib/repositories/audit';
import { CreateSessionSchema } from '@/lib/classroom/schemas';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const validated = CreateSessionSchema.parse(body);

    const session = await classroomRepository.createSession({
      title: validated.title,
      school_id: validated.schoolId,
      class_id: validated.classId,
      teacher_id: user?.id || null,
      grade_id: validated.gradeId,
      subject_id: validated.subjectId,
      book_id: validated.bookId,
      chapter_id: validated.chapterId,
      active_resource_id: validated.activeResourceId,
      status: 'WAITING',
    }, supabase);

    await auditRepository.logAction(
      'SESSION_CREATED',
      'classroom_session',
      session.id,
      { title: session.title, classId: session.class_id },
      user?.id,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      supabase
    );

    return NextResponse.json({ data: session }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create classroom session';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    let query = supabase.from('classroom_sessions').select('*');

    if (user) {
      query = query.or(`teacher_id.eq.${user.id},school_id.eq.${schoolId || '00000000-0000-0000-0000-000000000000'}`);
    } else if (schoolId) {
      query = query.eq('school_id', schoolId);
    }

    query = query.order('created_at', { ascending: false }).limit(20);

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch sessions';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
