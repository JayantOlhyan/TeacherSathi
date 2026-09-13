import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { contentValidator } from '@/lib/services/contentValidator';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resource = await resourcesRepository.getResourceById(id, supabase);
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Run deterministic validation
    const report = contentValidator.validateContent(
      resource.resource_type,
      resource.content,
      resource.language
    );

    // Persist validation report into resource record
    await supabase
      .from('resources')
      .update({
        validation_status: report.status,
        validation_score: report.score,
        validation_errors: report.errors,
        validation_warnings: report.warnings,
        validated_at: report.validated_at,
        validated_by: user.id,
      })
      .eq('id', id);

    return NextResponse.json({ data: report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
