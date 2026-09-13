import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { invitationService } from '@/lib/services/invitationService';
import { CreateInvitationSchema, InstitutionalScope } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get('target_type') as InstitutionalScope | null;
    const targetId = searchParams.get('target_id') || undefined;

    const supabase = createClient();
    const list = await invitationService.listInvitations(targetType || undefined, targetId, supabase);
    return NextResponse.json({ success: true, data: list });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to list invitations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validated = CreateInvitationSchema.parse(body);

    if (!auth.context.canManageScope(validated.target_type, validated.target_id)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to invite administrators to this entity' },
        { status: 403 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const supabase = createClient();
    const result = await invitationService.createInvitation(
      validated,
      auth.context.userId,
      baseUrl,
      supabase
    );

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid invitation payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing invitation ID' }, { status: 400 });
    }

    const supabase = createClient();
    await invitationService.revokeInvitation(id, supabase);
    return NextResponse.json({ success: true, message: 'Invitation revoked successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to revoke invitation';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
