import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { institutionRepository } from '@/lib/repositories/institution';
import { CreateOrganizationSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createClient();
    const orgs = await institutionRepository.listOrganizations(supabase);
    return NextResponse.json({ success: true, data: orgs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch organizations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  // Super Admin can create any organization
  if (!auth.context.isSuperAdmin) {
    return NextResponse.json(
      { error: 'Forbidden: Only Super Administrators can register new school networks/organizations' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const validated = CreateOrganizationSchema.parse(body);
    const supabase = createClient();
    const org = await institutionRepository.createOrganization(validated, supabase);
    return NextResponse.json({ success: true, data: org }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid organization payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
