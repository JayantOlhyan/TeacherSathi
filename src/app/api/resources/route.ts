import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { auditRepository } from '@/lib/repositories/audit';
import { CreateResourceInputSchema, ResourceQuerySchema } from '@/lib/validations/resources';

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
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const parsedQuery = ResourceQuerySchema.safeParse(rawParams);

    if (!parsedQuery.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: parsedQuery.error.issues }, { status: 400 });
    }

    const query = parsedQuery.data;

    let result;
    if (userRole === 'STUDENT') {
      // Students can only browse published resources
      result = await resourcesRepository.getResources({
        ...query,
        schoolId,
        publishedOnly: true,
      }, supabase);
    } else if (userRole === 'SCHOOL_ADMIN') {
      // School admins see all school resources
      result = await resourcesRepository.getResources({
        ...query,
        schoolId,
      }, supabase);
    } else {
      // Teachers see their own resources or published school resources
      result = await resourcesRepository.getResources({
        ...query,
        ownerId: user.id,
      }, supabase);
    }

    return NextResponse.json({
      data: result.resources,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
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
      return NextResponse.json({ error: 'Students cannot author educational resources' }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = CreateResourceInputSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const newResource = await resourcesRepository.createResource(
      user.id,
      profile?.school_id || null,
      parsed.data,
      supabase
    );

    await auditRepository.logAction(
      'CREATE_RESOURCE',
      'RESOURCE',
      newResource.id,
      { title: newResource.title, type: newResource.resource_type },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: newResource }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
