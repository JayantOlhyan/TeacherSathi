import { NextRequest, NextResponse } from 'next/server';
import { invitationService } from '@/lib/services/invitationService';
import { AcceptInvitationSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: You must be logged in to accept an invitation' }, { status: 401 });
    }

    const body = await req.json();
    const validated = AcceptInvitationSchema.parse(body);

    const result = await invitationService.acceptInvitation(validated.token, user.id, supabase);

    return NextResponse.json({ ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to accept invitation';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
