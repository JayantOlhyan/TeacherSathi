import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { schoolsRepository } from '@/lib/repositories/schools';
import { institutionalSettingsService } from '@/lib/services/institutionalSettingsService';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id: schoolId } = await params;
    const supabase = createClient();

    const school = await schoolsRepository.getSchoolById(schoolId, supabase);
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Verify scope access
    let allowed = auth.context.isSuperAdmin;
    if (!allowed && school.state_id && auth.context.canViewScope('STATE', school.state_id)) allowed = true;
    if (!allowed && school.district_id && auth.context.canViewScope('DISTRICT', school.district_id)) allowed = true;
    if (!allowed && school.organization_id && auth.context.canViewScope('ORGANIZATION', school.organization_id)) allowed = true;
    if (!allowed && auth.context.canViewScope('SCHOOL', school.id)) allowed = true;

    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden: Access to this school is restricted' }, { status: 403 });
    }

    const [teachersCount, studentsCount, classesCount, effectiveSettings] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('role', 'TEACHER'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('role', 'STUDENT'),
      supabase.from('classes').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('is_active', true),
      institutionalSettingsService.resolveSchoolEffectiveSettings(schoolId, supabase),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...school,
        teachers_count: teachersCount.count || 0,
        students_count: studentsCount.count || 0,
        classes_count: classesCount.count || 0,
        effective_settings: effectiveSettings,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch school';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id: schoolId } = await params;
    const supabase = createClient();

    const school = await schoolsRepository.getSchoolById(schoolId, supabase);
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Verify manage permission
    let allowed = auth.context.isSuperAdmin;
    if (!allowed && school.state_id && auth.context.canManageScope('STATE', school.state_id)) allowed = true;
    if (!allowed && school.district_id && auth.context.canManageScope('DISTRICT', school.district_id)) allowed = true;
    if (!allowed && school.organization_id && auth.context.canManageScope('ORGANIZATION', school.organization_id)) allowed = true;
    if (!allowed && auth.context.canManageScope('SCHOOL', school.id)) allowed = true;

    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to modify this school' }, { status: 403 });
    }

    const body = await req.json();
    const allowedKeys = ['name', 'code', 'board', 'address', 'postal_code', 'contact_email', 'contact_phone', 'state_id', 'district_id', 'organization_id', 'is_active'];
    const sanitizedUpdates: Record<string, unknown> = {};

    for (const key of allowedKeys) {
      if (key in body) sanitizedUpdates[key] = body[key];
    }

    const { data: updated, error } = await supabase
      .from('schools')
      .update({
        ...sanitizedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update school';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id: schoolId } = await params;
    const supabase = createClient();

    const school = await schoolsRepository.getSchoolById(schoolId, supabase);
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Only Super Admin or State Admin of the school can archive it
    let allowed = auth.context.isSuperAdmin;
    if (!allowed && school.state_id && auth.context.canManageScope('STATE', school.state_id)) allowed = true;

    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden: Only Super Administrators or State Administrators can archive schools' }, { status: 403 });
    }

    const { error } = await supabase
      .from('schools')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', schoolId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: 'School archived successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to archive school';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
