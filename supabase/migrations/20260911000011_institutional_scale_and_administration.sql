-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000011_institutional_scale_and_administration.sql
-- Description: Phase 8 Multi-School Institutional Hierarchy, School Networks,
--              Districts, States, Administration Roles, Scoped RLS, Settings & Invitations.
-- =============================================================================

-- 1. EXTEND ROLES ENUMS
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'STATE_ADMIN';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'DISTRICT_ADMIN';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ORG_ADMIN';

ALTER TYPE membership_role ADD VALUE IF NOT EXISTS 'STATE_ADMIN';
ALTER TYPE membership_role ADD VALUE IF NOT EXISTS 'DISTRICT_ADMIN';
ALTER TYPE membership_role ADD VALUE IF NOT EXISTS 'ORG_ADMIN';

-- 2. CREATE NEW ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'institutional_scope') THEN
    CREATE TYPE institutional_scope AS ENUM (
      'STATE',
      'DISTRICT',
      'ORGANIZATION',
      'SCHOOL'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
    CREATE TYPE invitation_status AS ENUM (
      'CREATED',
      'SENT',
      'ACCEPTED',
      'EXPIRED',
      'REVOKED'
    );
  END IF;
END $$;

-- 3. CREATE INSTITUTIONAL HIERARCHY TABLES

-- States (State / Territory jurisdiction)
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50) DEFAULT 'NORTH',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Districts (Administrative sub-units within States)
CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_district_state_code UNIQUE (state_id, code)
);

-- Organizations (School Networks, Chains, Trusts, e.g. KVS, JNV, DAV)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'GOVERNMENT',
  website TEXT,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- State Administrative Memberships
CREATE TABLE IF NOT EXISTS state_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role membership_role NOT NULL DEFAULT 'STATE_ADMIN',
  status member_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_state_member UNIQUE (state_id, profile_id)
);

-- District Administrative Memberships
CREATE TABLE IF NOT EXISTS district_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role membership_role NOT NULL DEFAULT 'DISTRICT_ADMIN',
  status member_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_district_member UNIQUE (district_id, profile_id)
);

-- Organization / School Network Administrative Memberships
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role membership_role NOT NULL DEFAULT 'ORG_ADMIN',
  status member_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_organization_member UNIQUE (organization_id, profile_id)
);

-- 4. EXTEND SCHOOLS TABLE WITH HIERARCHY FOREIGN KEYS
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- 5. INSTITUTIONAL SETTINGS (Cascading policy & feature inheritance)
CREATE TABLE IF NOT EXISTS institutional_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type institutional_scope NOT NULL,
  scope_id UUID NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_institutional_setting UNIQUE (scope_type, scope_id)
);

-- 6. INSTITUTIONAL INVITATIONS (Cryptographic single-use invitations)
CREATE TABLE IF NOT EXISTS institutional_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  target_type institutional_scope NOT NULL,
  target_id UUID NOT NULL,
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  status invitation_status NOT NULL DEFAULT 'CREATED',
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PRE-AGGREGATION DAILY SCHOOL METRICS
CREATE TABLE IF NOT EXISTS daily_school_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_teachers INTEGER NOT NULL DEFAULT 0,
  total_students INTEGER NOT NULL DEFAULT 0,
  active_teachers INTEGER NOT NULL DEFAULT 0,
  active_students INTEGER NOT NULL DEFAULT 0,
  total_assessments INTEGER NOT NULL DEFAULT 0,
  avg_mastery NUMERIC(5,2) DEFAULT NULL,
  open_gaps_count INTEGER NOT NULL DEFAULT 0,
  resource_usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_school_daily_metric UNIQUE (school_id, metric_date)
);

-- 8. INDEXES FOR SCALE
CREATE INDEX IF NOT EXISTS idx_schools_state_id ON schools(state_id);
CREATE INDEX IF NOT EXISTS idx_schools_district_id ON schools(district_id);
CREATE INDEX IF NOT EXISTS idx_schools_organization_id ON schools(organization_id);
CREATE INDEX IF NOT EXISTS idx_districts_state_id ON districts(state_id);
CREATE INDEX IF NOT EXISTS idx_state_members_profile ON state_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_district_members_profile ON district_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_org_members_profile ON organization_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token_hash ON institutional_invitations(token_hash);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON institutional_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_target ON institutional_invitations(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_daily_school_metrics_date ON daily_school_metrics(school_id, metric_date DESC);

-- 9. SECURITY DEFINER HELPER FUNCTIONS

-- State Admin Check
CREATE OR REPLACE FUNCTION public.is_state_admin(check_state_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM state_members
    WHERE profile_id = auth.uid()
      AND state_id = check_state_id
      AND status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- District Admin Check
CREATE OR REPLACE FUNCTION public.is_district_admin(check_district_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM district_members
    WHERE profile_id = auth.uid()
      AND district_id = check_district_id
      AND status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- Organization Admin Check
CREATE OR REPLACE FUNCTION public.is_organization_admin(check_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE profile_id = auth.uid()
      AND organization_id = check_org_id
      AND status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- Check if user is a state admin of the state containing a given school
CREATE OR REPLACE FUNCTION public.is_state_admin_of_school(check_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM schools s
    JOIN state_members sm ON sm.state_id = s.state_id
    WHERE s.id = check_school_id
      AND sm.profile_id = auth.uid()
      AND sm.status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- Check if user is a district admin of the district containing a given school
CREATE OR REPLACE FUNCTION public.is_district_admin_of_school(check_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM schools s
    JOIN district_members dm ON dm.district_id = s.district_id
    WHERE s.id = check_school_id
      AND dm.profile_id = auth.uid()
      AND dm.status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- Check if user is an organization admin of the organization containing a given school
CREATE OR REPLACE FUNCTION public.is_org_admin_of_school(check_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM schools s
    JOIN organization_members om ON om.organization_id = s.organization_id
    WHERE s.id = check_school_id
      AND om.profile_id = auth.uid()
      AND om.status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- 10. ROW LEVEL SECURITY POLICIES

ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_school_metrics ENABLE ROW LEVEL SECURITY;

-- States Policies: Authenticated users can view active states, State Admin or Super Admin can manage
CREATE POLICY "states_select_policy" ON states
  FOR SELECT USING (is_active = true OR public.is_super_admin() OR public.is_state_admin(id));

CREATE POLICY "states_modify_policy" ON states
  FOR ALL USING (public.is_super_admin());

-- Districts Policies: Read by authenticated users in that state, manage by Super Admin or State Admin
CREATE POLICY "districts_select_policy" ON districts
  FOR SELECT USING (is_active = true OR public.is_super_admin() OR public.is_state_admin(state_id) OR public.is_district_admin(id));

CREATE POLICY "districts_modify_policy" ON districts
  FOR ALL USING (public.is_super_admin() OR public.is_state_admin(state_id));

-- Organizations Policies: Read by authenticated members, manage by Super Admin or Org Admin
CREATE POLICY "organizations_select_policy" ON organizations
  FOR SELECT USING (is_active = true OR public.is_super_admin() OR public.is_organization_admin(id));

CREATE POLICY "organizations_modify_policy" ON organizations
  FOR ALL USING (public.is_super_admin() OR public.is_organization_admin(id));

-- Memberships Policies
CREATE POLICY "state_members_select" ON state_members
  FOR SELECT USING (profile_id = auth.uid() OR public.is_state_admin(state_id) OR public.is_super_admin());

CREATE POLICY "state_members_modify" ON state_members
  FOR ALL USING (public.is_super_admin() OR public.is_state_admin(state_id));

CREATE POLICY "district_members_select" ON district_members
  FOR SELECT USING (profile_id = auth.uid() OR public.is_district_admin(district_id) OR public.is_super_admin());

CREATE POLICY "district_members_modify" ON district_members
  FOR ALL USING (public.is_super_admin() OR public.is_district_admin(district_id));

CREATE POLICY "organization_members_select" ON organization_members
  FOR SELECT USING (profile_id = auth.uid() OR public.is_organization_admin(organization_id) OR public.is_super_admin());

CREATE POLICY "organization_members_modify" ON organization_members
  FOR ALL USING (public.is_super_admin() OR public.is_organization_admin(organization_id));

-- Institutional Settings Policies
CREATE POLICY "institutional_settings_select" ON institutional_settings
  FOR SELECT USING (
    public.is_super_admin()
    OR (scope_type = 'STATE' AND public.is_state_admin(scope_id))
    OR (scope_type = 'DISTRICT' AND public.is_district_admin(scope_id))
    OR (scope_type = 'ORGANIZATION' AND public.is_organization_admin(scope_id))
    OR (scope_type = 'SCHOOL' AND public.is_school_admin(scope_id))
  );

CREATE POLICY "institutional_settings_modify" ON institutional_settings
  FOR ALL USING (
    public.is_super_admin()
    OR (scope_type = 'STATE' AND public.is_state_admin(scope_id))
    OR (scope_type = 'DISTRICT' AND public.is_district_admin(scope_id))
    OR (scope_type = 'ORGANIZATION' AND public.is_organization_admin(scope_id))
    OR (scope_type = 'SCHOOL' AND public.is_school_admin(scope_id))
  );

-- Institutional Invitations Policies
CREATE POLICY "institutional_invitations_select" ON institutional_invitations
  FOR SELECT USING (
    public.is_super_admin()
    OR (target_type = 'STATE' AND public.is_state_admin(target_id))
    OR (target_type = 'DISTRICT' AND public.is_district_admin(target_id))
    OR (target_type = 'ORGANIZATION' AND public.is_organization_admin(target_id))
    OR (target_type = 'SCHOOL' AND public.is_school_admin(target_id))
  );

CREATE POLICY "institutional_invitations_modify" ON institutional_invitations
  FOR ALL USING (
    public.is_super_admin()
    OR (target_type = 'STATE' AND public.is_state_admin(target_id))
    OR (target_type = 'DISTRICT' AND public.is_district_admin(target_id))
    OR (target_type = 'ORGANIZATION' AND public.is_organization_admin(target_id))
    OR (target_type = 'SCHOOL' AND public.is_school_admin(target_id))
  );

-- Daily School Metrics Policies
CREATE POLICY "daily_school_metrics_select" ON daily_school_metrics
  FOR SELECT USING (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
    OR public.is_state_admin_of_school(school_id)
    OR public.is_district_admin_of_school(school_id)
    OR public.is_org_admin_of_school(school_id)
  );

-- 11. UPDATE SCHOOLS POLICIES TO INCLUDE INSTITUTIONAL SCOPES
DROP POLICY IF EXISTS "schools_select_policy" ON schools;
CREATE POLICY "schools_select_policy" ON schools
  FOR SELECT USING (
    id = public.get_user_school_id()
    OR public.is_school_member(id)
    OR public.is_state_admin_of_school(id)
    OR public.is_district_admin_of_school(id)
    OR public.is_org_admin_of_school(id)
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "schools_modify_policy" ON schools;
CREATE POLICY "schools_modify_policy" ON schools
  FOR ALL USING (
    public.is_school_admin(id)
    OR public.is_state_admin_of_school(id)
    OR public.is_district_admin_of_school(id)
    OR public.is_org_admin_of_school(id)
    OR public.is_super_admin()
  );
