import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';

export async function GET() {
  try {
    const supabase = createClient();
    const plans = await billingRepository.getPlans(supabase);

    return NextResponse.json({ data: plans });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
