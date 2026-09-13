import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { institutionRepository, UserAdministrativeScopes } from '@/lib/repositories/institution';
import { InstitutionalScope } from '@/lib/validations/institution';

export interface InstitutionalAuthContext {
  userId: string;
  role: string;
  scopes: UserAdministrativeScopes;
  isSuperAdmin: boolean;
  canManageScope: (scopeType: InstitutionalScope, scopeId: string) => boolean;
  canViewScope: (scopeType: InstitutionalScope, scopeId: string) => boolean;
}

export type InstitutionalAction =
  | 'VIEW_AGGREGATE_METRICS'
  | 'INVITE_MEMBERS'
  | 'EXPORT_REPORTS'
  | 'UPDATE_GOVERNANCE_SETTINGS'
  | 'MODIFY_CURRICULUM'
  | 'ONBOARD_SCHOOLS';

export function canManageScope(
  userScope: UserAdministrativeScopes,
  scopeType: InstitutionalScope,
  scopeId: string,
  isSuperAdmin = false
): boolean {
  if (isSuperAdmin || userScope.role === 'SUPER_ADMIN') return true;
  if (userScope.role === 'TEACHER' || userScope.role === 'STUDENT') return false;
  if (scopeType === 'STATE') return userScope.states.some((s) => s.id === scopeId);
  if (scopeType === 'DISTRICT') return userScope.districts.some((d) => d.id === scopeId);
  if (scopeType === 'ORGANIZATION') return userScope.organizations.some((o) => o.id === scopeId);
  if (scopeType === 'SCHOOL') return userScope.schoolId === scopeId;
  return false;
}

export function canViewScope(
  userScope: UserAdministrativeScopes,
  scopeType: InstitutionalScope,
  scopeId: string,
  isSuperAdmin = false
): boolean {
  return canManageScope(userScope, scopeType, scopeId, isSuperAdmin);
}

export function isAuthorizedForInstitutionAction(
  role: string,
  action: InstitutionalAction
): boolean {
  // Canonical NCERT curriculum is immutable by institutional administrators
  if (action === 'MODIFY_CURRICULUM') {
    return false;
  }

  if (role === 'SUPER_ADMIN') {
    return true;
  }

  if (['STATE_ADMIN', 'DISTRICT_ADMIN', 'ORG_ADMIN'].includes(role)) {
    return true;
  }

  if (role === 'SCHOOL_ADMIN') {
    return action !== 'UPDATE_GOVERNANCE_SETTINGS' && action !== 'ONBOARD_SCHOOLS';
  }

  return false;
}

/**
 * Authorizes requests to institutional admin endpoints.
 * Returns the institutional auth context or a NextResponse with 401/403.
 */
export async function authenticateInstitutionalAdmin(): Promise<
  { authorized: true; context: InstitutionalAuthContext } | { authorized: false; response: NextResponse }
> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'User profile not found' }, { status: 401 }),
    };
  }

  const allowedRoles = ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'ORG_ADMIN', 'SCHOOL_ADMIN'];
  if (!allowedRoles.includes(profile.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden: Institutional administrative permissions required' },
        { status: 403 }
      ),
    };
  }

  const isSuperAdmin = profile.role === 'SUPER_ADMIN';
  const scopes = await institutionRepository.getUserAdministrativeScopes(user.id, supabase);

  return {
    authorized: true,
    context: {
      userId: user.id,
      role: profile.role,
      scopes,
      isSuperAdmin,
      canManageScope: (scopeType: InstitutionalScope, scopeId: string) =>
        canManageScope(scopes, scopeType, scopeId, isSuperAdmin),
      canViewScope: (scopeType: InstitutionalScope, scopeId: string) =>
        canViewScope(scopes, scopeType, scopeId, isSuperAdmin),
    },
  };
}
