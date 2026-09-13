import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { reportingService } from '@/lib/services/reportingService';
import { InstitutionalScope, InstitutionalScopeSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    let scopeType = searchParams.get('scope_type') as InstitutionalScope | null;
    let scopeId = searchParams.get('scope_id');

    // Default to caller's administrative scope if not specified
    if (!scopeType || !scopeId) {
      if (auth.context.isSuperAdmin) {
        // Super Admin can view national / all-states overview or first active state
        const supabase = createClient();
        const { data: firstState } = await supabase.from('states').select('id').eq('is_active', true).limit(1).maybeSingle();
        scopeType = 'STATE';
        scopeId = firstState?.id || '00000000-0000-0000-0000-000000000000';
      } else if (auth.context.scopes.states[0]) {
        scopeType = 'STATE';
        scopeId = auth.context.scopes.states[0].id;
      } else if (auth.context.scopes.districts[0]) {
        scopeType = 'DISTRICT';
        scopeId = auth.context.scopes.districts[0].id;
      } else if (auth.context.scopes.organizations[0]) {
        scopeType = 'ORGANIZATION';
        scopeId = auth.context.scopes.organizations[0].id;
      } else if (auth.context.scopes.schoolId) {
        scopeType = 'SCHOOL';
        scopeId = auth.context.scopes.schoolId;
      } else {
        return NextResponse.json({ error: 'No administrative scope assigned' }, { status: 403 });
      }
    }

    InstitutionalScopeSchema.parse(scopeType);

    if (!scopeId) {
      return NextResponse.json({ error: 'Missing scope_id parameter' }, { status: 400 });
    }

    // Verify scope access
    if (!auth.context.canViewScope(scopeType, scopeId)) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permissions to view this administrative scope' },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const overview = await reportingService.getScopeOverview(scopeType, scopeId, supabase);

    return NextResponse.json({ success: true, data: overview });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate institutional overview';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
