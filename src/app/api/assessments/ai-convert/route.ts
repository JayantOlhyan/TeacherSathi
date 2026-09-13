import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assessmentsRepository } from '@/lib/repositories/assessments';
import { auditRepository } from '@/lib/repositories/audit';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const resourceId = body.resource_id;

    if (!resourceId) {
      return NextResponse.json({ error: 'resource_id is required' }, { status: 400 });
    }

    const assessment = await assessmentsRepository.convertAIResourceToAssessment(
      resourceId,
      user.id,
      supabase
    );

    await auditRepository.logAction(
      'CONVERT_AI_RESOURCE_TO_ASSESSMENT',
      'ASSESSMENT',
      assessment.id,
      { source_resource_id: resourceId },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: assessment }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
