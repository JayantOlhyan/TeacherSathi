import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { institutionRepository } from '@/lib/repositories/institution';
import { CreateDistrictSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get('state_id') || undefined;

    const supabase = createClient();
    const districts = await institutionRepository.listDistricts(stateId, supabase);
    return NextResponse.json({ success: true, data: districts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch districts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validated = CreateDistrictSchema.parse(body);

    // Verify permission: Super Admin or State Admin of the target state
    if (!auth.context.isSuperAdmin && !auth.context.canManageScope('STATE', validated.state_id)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to create districts in this state' },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const district = await institutionRepository.createDistrict(validated, supabase);
    return NextResponse.json({ success: true, data: district }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid district payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
