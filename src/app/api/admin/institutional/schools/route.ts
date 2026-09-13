import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { institutionRepository } from '@/lib/repositories/institution';
import { SchoolDirectoryQuerySchema, SchoolOnboardingSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const parsedQuery = SchoolDirectoryQuerySchema.parse({
      search: searchParams.get('search') || undefined,
      state_id: searchParams.get('state_id') || undefined,
      district_id: searchParams.get('district_id') || undefined,
      organization_id: searchParams.get('organization_id') || undefined,
      board: searchParams.get('board') || undefined,
      status: searchParams.get('status') || 'ALL',
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      sort_by: searchParams.get('sort_by') || 'name',
      sort_order: searchParams.get('sort_order') || 'asc',
    });

    const userScope = {
      role: auth.context.role,
      stateId: auth.context.scopes.states[0]?.id,
      districtId: auth.context.scopes.districts[0]?.id,
      orgId: auth.context.scopes.organizations[0]?.id,
      schoolId: auth.context.scopes.schoolId || undefined,
    };

    const supabase = createClient();
    const result = await institutionRepository.querySchoolDirectory(
      parsedQuery,
      auth.context.isSuperAdmin ? undefined : userScope,
      supabase
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query school directory';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validated = SchoolOnboardingSchema.parse(body);

    // Permission check:
    // Can onboard if Super Admin, or State Admin for that state, or District Admin for that district, or Org Admin for that org
    let allowed = auth.context.isSuperAdmin;
    if (!allowed && validated.state_id && auth.context.canManageScope('STATE', validated.state_id)) {
      allowed = true;
    }
    if (!allowed && validated.district_id && auth.context.canManageScope('DISTRICT', validated.district_id)) {
      allowed = true;
    }
    if (!allowed && validated.organization_id && auth.context.canManageScope('ORGANIZATION', validated.organization_id)) {
      allowed = true;
    }

    if (!allowed) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to onboard schools in this jurisdiction' },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const result = await institutionRepository.onboardSchool(validated, auth.context.userId, supabase);

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid school onboarding payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
