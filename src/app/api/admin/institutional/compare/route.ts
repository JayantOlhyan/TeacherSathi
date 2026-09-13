import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { reportingService } from '@/lib/services/reportingService';
import { SchoolComparisonQuerySchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validated = SchoolComparisonQuerySchema.parse(body);

    const supabase = createClient();
    const rows = await reportingService.compareSchools(validated.school_ids, supabase);

    return NextResponse.json({ success: true, data: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid comparison request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
