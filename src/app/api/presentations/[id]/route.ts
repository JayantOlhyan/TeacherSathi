import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { PresentationContentSchema } from '@/lib/validations/resources';
import { auditRepository } from '@/lib/repositories/audit';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const UpdatePresentationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  grade_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  chapter_id: z.string().uuid().optional(),
  concept_ids: z.array(z.string().uuid()).optional(),
  language: z.string().optional(),
  content: PresentationContentSchema.optional(),
  change_summary: z.string().optional(),
});

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resource = await resourcesRepository.getResourceById(id, supabase);
    if (!resource || resource.resource_type !== 'PRESENTATION') {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }

    return NextResponse.json({ data: resource });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await resourcesRepository.getResourceById(id, supabase);
    if (!existing || existing.resource_type !== 'PRESENTATION') {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    const isOwner = existing.owner_id === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';
    const isSchoolAdmin = userRole === 'SCHOOL_ADMIN' && existing.school_id === profile?.school_id;

    if (!isOwner && !isSuperAdmin && !isSchoolAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = UpdatePresentationSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const updated = await resourcesRepository.updateResource(id, user.id, parsed.data, supabase);

    await auditRepository.logAction(
      'UPDATE_PRESENTATION',
      'RESOURCE',
      id,
      { title: updated.title },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
