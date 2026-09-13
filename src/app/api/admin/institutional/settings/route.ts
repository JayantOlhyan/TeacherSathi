import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { institutionalSettingsService } from '@/lib/services/institutionalSettingsService';
import { InstitutionalScope, UpsertInstitutionalSettingsSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('school_id');
    const scopeType = searchParams.get('scope_type') as InstitutionalScope | null;
    const scopeId = searchParams.get('scope_id');

    const supabase = createClient();

    // If resolving effective settings for a school:
    if (schoolId) {
      if (!auth.context.canViewScope('SCHOOL', schoolId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const effective = await institutionalSettingsService.resolveSchoolEffectiveSettings(schoolId, supabase);
      return NextResponse.json({ success: true, data: effective });
    }

    if (!scopeType || !scopeId) {
      return NextResponse.json({ error: 'Missing scope_type and scope_id parameters' }, { status: 400 });
    }

    if (!auth.context.canViewScope(scopeType, scopeId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await institutionalSettingsService.getSettingsForScope(scopeType, scopeId, supabase);
    return NextResponse.json({ success: true, data: settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validated = UpsertInstitutionalSettingsSchema.parse(body);

    if (!auth.context.canManageScope(validated.scope_type, validated.scope_id)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to modify settings for this scope' },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const updated = await institutionalSettingsService.upsertSettings(validated, auth.context.userId, supabase);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save settings';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
