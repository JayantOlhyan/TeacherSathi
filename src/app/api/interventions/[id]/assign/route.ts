import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { interventionsRepository } from '@/lib/repositories/interventions';
import { AssignInterventionInputSchema } from '@/lib/validations/analytics';

export async function POST(
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
    const validated = AssignInterventionInputSchema.parse(body);

    const assigned = await interventionsRepository.assignIntervention(
      params.id,
      user.id,
      validated,
      supabase
    );

    return NextResponse.json({ data: assigned });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
