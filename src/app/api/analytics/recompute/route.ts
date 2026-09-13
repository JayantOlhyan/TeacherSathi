import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyticsRepository } from '@/lib/repositories/analytics';
import { RecomputeRequestSchema } from '@/lib/validations/analytics';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = RecomputeRequestSchema.parse(body);

    if (validated.classId) {
      const result = await analyticsRepository.recomputeClass(validated.classId, supabase);
      return NextResponse.json({
        message: 'Class analytics recomputed successfully',
        data: result,
      });
    }

    const targetStudentId = validated.studentId || user.id;
    const result = await analyticsRepository.recomputeStudent(targetStudentId, supabase);

    return NextResponse.json({
      message: 'Student analytics recomputed successfully',
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
