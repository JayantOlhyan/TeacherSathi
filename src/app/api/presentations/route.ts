import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { PresentationContentSchema } from '@/lib/validations/resources';
import { auditRepository } from '@/lib/repositories/audit';
import { z } from 'zod';

const CreatePresentationSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  grade_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  chapter_id: z.string().uuid().optional(),
  concept_ids: z.array(z.string().uuid()).default([]),
  language: z.string().default('en'),
  content: PresentationContentSchema,
  metadata: z.record(z.string(), z.unknown()).default({}),
});

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
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    const schoolId = profile?.school_id || null;

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const grade_id = url.searchParams.get('grade_id') || undefined;
    const subject_id = url.searchParams.get('subject_id') || undefined;
    const chapter_id = url.searchParams.get('chapter_id') || undefined;

    const result = await resourcesRepository.getResources(
      {
        resource_type: 'PRESENTATION',
        schoolId,
        ownerId: userRole === 'STUDENT' ? undefined : user.id,
        publishedOnly: userRole === 'STUDENT',
        search,
        grade_id,
        subject_id,
        chapter_id,
      },
      supabase
    );

    return NextResponse.json({ data: result.resources, total: result.total });
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    if (userRole === 'STUDENT') {
      return NextResponse.json({ error: 'Students cannot create presentations' }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = CreatePresentationSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const created = await resourcesRepository.createResource(
      user.id,
      profile?.school_id || null,
      {
        ...parsed.data,
        resource_type: 'PRESENTATION',
      },
      supabase
    );

    await auditRepository.logAction(
      'CREATE_PRESENTATION',
      'RESOURCE',
      created.id,
      { title: created.title, slidesCount: parsed.data.content.slides.length },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
