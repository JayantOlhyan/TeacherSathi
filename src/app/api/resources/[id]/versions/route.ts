import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';

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
    const isOwner = resource.owner_id === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';
    const isSchoolAdmin = userRole === 'SCHOOL_ADMIN' && resource.school_id === profile?.school_id;
    const isPublished = resource.status === 'PUBLISHED';

    if (!isOwner && !isSuperAdmin && !isSchoolAdmin && !isPublished) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const versions = await resourcesRepository.getResourceVersions(id, supabase);

    return NextResponse.json({ data: versions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
