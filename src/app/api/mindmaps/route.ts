import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { MindMapContentSchema } from '@/lib/validations/resources';
import { auditRepository } from '@/lib/repositories/audit';
import { z } from 'zod';

const CreateMindMapSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  grade_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  chapter_id: z.string().uuid().optional(),
  concept_ids: z.array(z.string().uuid()).default([]),
  language: z.string().default('en'),
  content: MindMapContentSchema,
  metadata: z.record(z.unknown()).default({}),
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

    const result = await resourcesRepository.getResources(
      {
        resource_type: 'MIND_MAP',
        schoolId,
        ownerId: userRole === 'STUDENT' ? undefined : user.id,
        publishedOnly: userRole === 'STUDENT',
        search,
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
      return NextResponse.json({ error: 'Students cannot author mind maps' }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = CreateMindMapSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const created = await resourcesRepository.createResource(
      user.id,
      profile?.school_id || null,
      {
        ...parsed.data,
        resource_type: 'MIND_MAP',
      },
      supabase
    );

    await auditRepository.logAction(
      'CREATE_MIND_MAP',
      'RESOURCE',
      created.id,
      { title: created.title, nodesCount: parsed.data.content.nodes.length },
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
