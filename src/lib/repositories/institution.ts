import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  CreateStateInput,
  StateRecord,
  CreateDistrictInput,
  DistrictRecord,
  CreateOrganizationInput,
  OrganizationRecord,
  SchoolOnboardingInput,
  SchoolDirectoryQuery,
} from '../validations/institution';
import { SchoolRecord } from './schools';

export interface EnrichedSchoolRecord extends SchoolRecord {
  state_name?: string;
  district_name?: string;
  organization_name?: string;
  teachers_count?: number;
  students_count?: number;
  classes_count?: number;
}

export interface UserAdministrativeScopes {
  userId: string;
  role: string;
  states: Array<{ id: string; name: string; code: string; role: string }>;
  districts: Array<{ id: string; name: string; code: string; state_id: string; role: string }>;
  organizations: Array<{ id: string; name: string; code: string; role: string }>;
  schoolId: string | null;
}

export const institutionRepository = {
  // ===========================================================================
  // 1. STATES
  // ===========================================================================

  async listStates(includeInactive = false, client: SupabaseClient = defaultClient): Promise<StateRecord[]> {
    let query = client.from('states').select('*').order('name', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list states: ${error.message}`);
    return (data || []) as StateRecord[];
  },

  async getStateById(id: string, client: SupabaseClient = defaultClient): Promise<StateRecord | null> {
    const { data, error } = await client.from('states').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Failed to fetch state: ${error.message}`);
    return data as StateRecord | null;
  },

  async getStateByCode(code: string, client: SupabaseClient = defaultClient): Promise<StateRecord | null> {
    const { data, error } = await client.from('states').select('*').eq('code', code.toUpperCase()).maybeSingle();
    if (error) throw new Error(`Failed to fetch state by code: ${error.message}`);
    return data as StateRecord | null;
  },

  async createState(input: CreateStateInput, client: SupabaseClient = defaultClient): Promise<StateRecord> {
    const { data, error } = await client
      .from('states')
      .insert([{ ...input, code: input.code.toUpperCase() }])
      .select()
      .single();
    if (error) throw new Error(`Failed to create state: ${error.message}`);
    return data as StateRecord;
  },

  async updateState(id: string, updates: Partial<CreateStateInput>, client: SupabaseClient = defaultClient): Promise<StateRecord> {
    const { data, error } = await client
      .from('states')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update state: ${error.message}`);
    return data as StateRecord;
  },

  // ===========================================================================
  // 2. DISTRICTS
  // ===========================================================================

  async listDistricts(stateId?: string, client: SupabaseClient = defaultClient): Promise<DistrictRecord[]> {
    let query = client
      .from('districts')
      .select('*, state:states(name)')
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (stateId) {
      query = query.eq('state_id', stateId);
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list districts: ${error.message}`);
    return (data || []).map((d: { state?: { name?: string }; [key: string]: unknown }) => ({
      ...d,
      state_name: d.state?.name,
    })) as DistrictRecord[];
  },

  async getDistrictById(id: string, client: SupabaseClient = defaultClient): Promise<DistrictRecord | null> {
    const { data, error } = await client
      .from('districts')
      .select('*, state:states(name)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`Failed to fetch district: ${error.message}`);
    if (!data) return null;
    return {
      ...data,
      state_name: data.state?.name,
    } as DistrictRecord;
  },

  async createDistrict(input: CreateDistrictInput, client: SupabaseClient = defaultClient): Promise<DistrictRecord> {
    const { data, error } = await client
      .from('districts')
      .insert([{ ...input, code: input.code.toUpperCase() }])
      .select()
      .single();
    if (error) throw new Error(`Failed to create district: ${error.message}`);
    return data as DistrictRecord;
  },

  async updateDistrict(id: string, updates: Partial<CreateDistrictInput>, client: SupabaseClient = defaultClient): Promise<DistrictRecord> {
    const { data, error } = await client
      .from('districts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update district: ${error.message}`);
    return data as DistrictRecord;
  },

  // ===========================================================================
  // 3. ORGANIZATIONS (School Networks)
  // ===========================================================================

  async listOrganizations(client: SupabaseClient = defaultClient): Promise<OrganizationRecord[]> {
    const { data, error } = await client
      .from('organizations')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (error) throw new Error(`Failed to list organizations: ${error.message}`);
    return (data || []) as OrganizationRecord[];
  },

  async getOrganizationById(id: string, client: SupabaseClient = defaultClient): Promise<OrganizationRecord | null> {
    const { data, error } = await client.from('organizations').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Failed to fetch organization: ${error.message}`);
    return data as OrganizationRecord | null;
  },

  async createOrganization(input: CreateOrganizationInput, client: SupabaseClient = defaultClient): Promise<OrganizationRecord> {
    const { data, error } = await client
      .from('organizations')
      .insert([{ ...input, code: input.code.toUpperCase() }])
      .select()
      .single();
    if (error) throw new Error(`Failed to create organization: ${error.message}`);
    return data as OrganizationRecord;
  },

  async updateOrganization(id: string, updates: Partial<CreateOrganizationInput>, client: SupabaseClient = defaultClient): Promise<OrganizationRecord> {
    const { data, error } = await client
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update organization: ${error.message}`);
    return data as OrganizationRecord;
  },

  // ===========================================================================
  // 4. SCHOOL DIRECTORY & ONBOARDING
  // ===========================================================================

  async querySchoolDirectory(
    query: SchoolDirectoryQuery,
    userScope?: { role: string; stateId?: string; districtId?: string; orgId?: string; schoolId?: string },
    client: SupabaseClient = defaultClient
  ): Promise<{ data: EnrichedSchoolRecord[]; total: number; page: number; limit: number }> {
    let dbQuery = client.from('schools').select(
      '*, state_ref:states(name), district_ref:districts(name), org_ref:organizations(name)',
      { count: 'exact' }
    );

    // Apply jurisdictional security scoping
    if (userScope) {
      if (userScope.role === 'STATE_ADMIN' && userScope.stateId) {
        dbQuery = dbQuery.eq('state_id', userScope.stateId);
      } else if (userScope.role === 'DISTRICT_ADMIN' && userScope.districtId) {
        dbQuery = dbQuery.eq('district_id', userScope.districtId);
      } else if (userScope.role === 'ORG_ADMIN' && userScope.orgId) {
        dbQuery = dbQuery.eq('organization_id', userScope.orgId);
      } else if (userScope.role === 'SCHOOL_ADMIN' && userScope.schoolId) {
        dbQuery = dbQuery.eq('id', userScope.schoolId);
      }
    }

    // Apply search filters
    if (query.search) {
      dbQuery = dbQuery.or(`name.ilike.%${query.search}%,code.ilike.%${query.search}%,city.ilike.%${query.search}%`);
    }
    if (query.state_id) dbQuery = dbQuery.eq('state_id', query.state_id);
    if (query.district_id) dbQuery = dbQuery.eq('district_id', query.district_id);
    if (query.organization_id) dbQuery = dbQuery.eq('organization_id', query.organization_id);
    if (query.board) dbQuery = dbQuery.eq('board', query.board);
    if (query.status === 'ACTIVE') dbQuery = dbQuery.eq('is_active', true);
    if (query.status === 'INACTIVE') dbQuery = dbQuery.eq('is_active', false);

    // Sorting
    const sortField = query.sort_by === 'created_at' ? 'created_at' : 'name';
    dbQuery = dbQuery.order(sortField, { ascending: query.sort_order === 'asc' });

    // Pagination
    const offset = (query.page - 1) * query.limit;
    dbQuery = dbQuery.range(offset, offset + query.limit - 1);

    const { data, count, error } = await dbQuery;
    if (error) throw new Error(`Failed to query school directory: ${error.message}`);

    const schools = (data || []) as Array<{
      state_ref?: { name?: string };
      district_ref?: { name?: string };
      org_ref?: { name?: string };
      [key: string]: unknown;
    }>;

    const schoolIds = schools.map((s) => s.id as string);

    // Batch count teachers and students for retrieved schools
    const countsMap: Record<string, { teachers: number; students: number; classes: number }> = {};
    for (const sid of schoolIds) {
      countsMap[sid] = { teachers: 0, students: 0, classes: 0 };
    }

    if (schoolIds.length > 0) {
      const [teachersRes, studentsRes, classesRes] = await Promise.all([
        client.from('profiles').select('school_id').in('school_id', schoolIds).eq('role', 'TEACHER'),
        client.from('profiles').select('school_id').in('school_id', schoolIds).eq('role', 'STUDENT'),
        client.from('classes').select('school_id').in('school_id', schoolIds).eq('is_active', true),
      ]);

      (teachersRes.data || []).forEach((row: { school_id: string }) => {
        if (countsMap[row.school_id]) countsMap[row.school_id].teachers++;
      });
      (studentsRes.data || []).forEach((row: { school_id: string }) => {
        if (countsMap[row.school_id]) countsMap[row.school_id].students++;
      });
      (classesRes.data || []).forEach((row: { school_id: string }) => {
        if (countsMap[row.school_id]) countsMap[row.school_id].classes++;
      });
    }

    const enriched: EnrichedSchoolRecord[] = schools.map((s) => ({
      ...s,
      state_name: s.state_ref?.name || (s.state as string),
      district_name: s.district_ref?.name || undefined,
      organization_name: s.org_ref?.name || undefined,
      teachers_count: countsMap[s.id as string]?.teachers || 0,
      students_count: countsMap[s.id as string]?.students || 0,
      classes_count: countsMap[s.id as string]?.classes || 0,
    })) as EnrichedSchoolRecord[];

    return {
      data: enriched,
      total: count || 0,
      page: query.page,
      limit: query.limit,
    };
  },

  async onboardSchool(
    input: SchoolOnboardingInput,
    invitedByProfileId?: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ school: SchoolRecord; invitationId?: string }> {
    const { data: school, error: schoolError } = await client
      .from('schools')
      .insert([
        {
          name: input.name,
          code: input.code.toUpperCase(),
          board: input.board,
          state: input.state,
          city: input.city,
          address: input.address || null,
          postal_code: input.postal_code || null,
          contact_email: input.contact_email,
          contact_phone: input.contact_phone || null,
          state_id: input.state_id || null,
          district_id: input.district_id || null,
          organization_id: input.organization_id || null,
          subscription_tier: input.subscription_tier,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (schoolError) throw new Error(`Failed to onboard school: ${schoolError.message}`);

    let invitationId: string | undefined;

    // If an initial admin email is provided, create an institutional invitation
    if (input.admin_email) {
      const crypto = await import('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data: inv, error: invError } = await client
        .from('institutional_invitations')
        .insert([
          {
            email: input.admin_email,
            role: 'SCHOOL_ADMIN',
            target_type: 'SCHOOL',
            target_id: school.id,
            invited_by: invitedByProfileId || null,
            token_hash: tokenHash,
            status: 'CREATED',
            expires_at: expiresAt.toISOString(),
          },
        ])
        .select('id')
        .maybeSingle();

      if (!invError && inv) {
        invitationId = inv.id;
      }
    }

    return { school: school as SchoolRecord, invitationId };
  },

  async updateSchoolHierarchy(
    schoolId: string,
    hierarchy: { state_id?: string | null; district_id?: string | null; organization_id?: string | null },
    client: SupabaseClient = defaultClient
  ): Promise<SchoolRecord> {
    const { data, error } = await client
      .from('schools')
      .update({
        ...hierarchy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update school hierarchy: ${error.message}`);
    return data as SchoolRecord;
  },

  // ===========================================================================
  // 5. MEMBERSHIPS & JURISDICTIONS
  // ===========================================================================

  async getUserAdministrativeScopes(
    profileId: string,
    client: SupabaseClient = defaultClient
  ): Promise<UserAdministrativeScopes> {
    const { data: profile } = await client
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', profileId)
      .single();

    if (!profile) {
      throw new Error(`Profile not found for ID: ${profileId}`);
    }

    const [stateMembers, districtMembers, orgMembers] = await Promise.all([
      client.from('state_members').select('state_id, role, state:states(name, code)').eq('profile_id', profileId).eq('status', 'ACTIVE'),
      client.from('district_members').select('district_id, role, district:districts(name, code, state_id)').eq('profile_id', profileId).eq('status', 'ACTIVE'),
      client.from('organization_members').select('organization_id, role, organization:organizations(name, code)').eq('profile_id', profileId).eq('status', 'ACTIVE'),
    ]);

    interface StateMemberRow {
      state_id: string;
      role: string;
      state?: { name?: string; code?: string } | null;
    }
    interface DistrictMemberRow {
      district_id: string;
      role: string;
      district?: { name?: string; code?: string; state_id?: string } | null;
    }
    interface OrgMemberRow {
      organization_id: string;
      role: string;
      organization?: { name?: string; code?: string } | null;
    }

    const stateRows = (stateMembers.data || []) as unknown as StateMemberRow[];
    const districtRows = (districtMembers.data || []) as unknown as DistrictMemberRow[];
    const orgRows = (orgMembers.data || []) as unknown as OrgMemberRow[];

    return {
      userId: profileId,
      role: profile.role,
      schoolId: profile.school_id,
      states: stateRows.map((sm) => ({
        id: sm.state_id,
        name: sm.state?.name || '',
        code: sm.state?.code || '',
        role: sm.role,
      })),
      districts: districtRows.map((dm) => ({
        id: dm.district_id,
        name: dm.district?.name || '',
        code: dm.district?.code || '',
        state_id: dm.district?.state_id || '',
        role: dm.role,
      })),
      organizations: orgRows.map((om) => ({
        id: om.organization_id,
        name: om.organization?.name || '',
        code: om.organization?.code || '',
        role: om.role,
      })),
    };
  },

  async addStateMember(stateId: string, profileId: string, role = 'STATE_ADMIN', client: SupabaseClient = defaultClient) {
    const { data, error } = await client
      .from('state_members')
      .upsert([{ state_id: stateId, profile_id: profileId, role, status: 'ACTIVE' }])
      .select()
      .single();
    if (error) throw new Error(`Failed to add state member: ${error.message}`);
    return data;
  },

  async addDistrictMember(districtId: string, profileId: string, role = 'DISTRICT_ADMIN', client: SupabaseClient = defaultClient) {
    const { data, error } = await client
      .from('district_members')
      .upsert([{ district_id: districtId, profile_id: profileId, role, status: 'ACTIVE' }])
      .select()
      .single();
    if (error) throw new Error(`Failed to add district member: ${error.message}`);
    return data;
  },

  async addOrganizationMember(orgId: string, profileId: string, role = 'ORG_ADMIN', client: SupabaseClient = defaultClient) {
    const { data, error } = await client
      .from('organization_members')
      .upsert([{ organization_id: orgId, profile_id: profileId, role, status: 'ACTIVE' }])
      .select()
      .single();
    if (error) throw new Error(`Failed to add organization member: ${error.message}`);
    return data;
  },
};
