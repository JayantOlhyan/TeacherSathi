import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { auditRepository } from '@/lib/repositories/audit';
import { UpdateResourceInputSchema } from '@/lib/validations/resources';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();

    // Authorization check
    const isOwner = resource.owner_id === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';
    const isSchoolAdmin = userRole === 'SCHOOL_ADMIN' && resource.school_id === profile?.school_id;
    const isPublished = resource.status === 'PUBLISHED';

    if (!isOwner && !isSuperAdmin && !isSchoolAdmin && !isPublished) {
      return NextResponse.json({ error: 'Access denied: Resource is not published or belongs to another school' }, { status: 403 });
    }

    // Record OPENED usage
    await resourcesRepository.trackUsage(id, user.id, 'OPENED', {}, supabase);

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
    if (!existing) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
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
      return NextResponse.json({ error: 'Forbidden: You cannot modify resources you do not own' }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = UpdateResourceInputSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const updated = await resourcesRepository.updateResource(id, user.id, parsed.data, supabase);

    await auditRepository.logAction(
      'UPDATE_RESOURCE',
      'RESOURCE',
      id,
      { changes: parsed.data },
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await resourcesRepository.getResourceById(id, supabase);
    if (!existing) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    const isOwner = existing.owner_id === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden: Only the resource owner can delete it' }, { status: 403 });
    }

    await resourcesRepository.deleteResource(id, supabase);

    await auditRepository.logAction(
      'DELETE_RESOURCE',
      'RESOURCE',
      id,
      { title: existing.title },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
