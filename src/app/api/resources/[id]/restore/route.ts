import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { auditRepository } from '@/lib/repositories/audit';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const RestoreVersionSchema = z.object({
  versionNumber: z.number().int().positive(),
});

export async function POST(request: NextRequest, context: RouteContext) {
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
      return NextResponse.json({ error: 'Forbidden: You cannot restore versions of this resource' }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = RestoreVersionSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload: versionNumber is required and must be a positive integer', details: parsed.error.issues }, { status: 400 });
    }

    const restored = await resourcesRepository.restoreResourceVersion(
      id,
      parsed.data.versionNumber,
      user.id,
      supabase
    );

    await auditRepository.logAction(
      'RESTORE_RESOURCE_VERSION',
      'RESOURCE',
      id,
      { versionNumber: parsed.data.versionNumber },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: restored });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
