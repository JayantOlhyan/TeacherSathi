import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { interventionsRepository } from '@/lib/repositories/interventions';
import { UpdateInterventionInputSchema } from '@/lib/validations/analytics';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const intervention = await interventionsRepository.getInterventionById(params.id, supabase);
    if (!intervention) {
      return NextResponse.json({ error: 'Intervention not found' }, { status: 404 });
    }

    return NextResponse.json({ data: intervention });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = UpdateInterventionInputSchema.parse(body);

    const updated = await interventionsRepository.updateIntervention(
      params.id,
      user.id,
      validated,
      supabase
    );

    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
