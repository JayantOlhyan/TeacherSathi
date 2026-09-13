import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { institutionRepository } from '@/lib/repositories/institution';
import { CreateStateSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createClient();
    const states = await institutionRepository.listStates(false, supabase);
    return NextResponse.json({ success: true, data: states });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch states';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  if (!auth.context.isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden: Only Super Administrators can create states' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = CreateStateSchema.parse(body);
    const supabase = createClient();
    const state = await institutionRepository.createState(validated, supabase);
    return NextResponse.json({ success: true, data: state }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid state payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
