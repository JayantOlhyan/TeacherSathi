-- =============================================================================
-- TEACHERSATHI — PHASE 7: ADVANCED CONTENT, MEDIA & VIDEO PRODUCTION PIPELINE
-- Migration: 20260911000010_advanced_content_and_media_pipeline.sql
-- =============================================================================

-- 1. Extend resource_type enum with Phase 7 standardized types
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'TEACHING_ACTIVITY';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'QUIZ';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'TEST';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'ASSIGNMENT';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'VIDEO';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'IMAGE';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'AUDIO';
ALTER TYPE resource_type ADD VALUE IF NOT EXISTS 'LINK';

-- 2. Extend resource_status enum with PUBLISHED state
ALTER TYPE resource_status ADD VALUE IF NOT EXISTS 'PUBLISHED';

-- 3. Enhance resources table with curriculum provenance and validation tracking
ALTER TABLE resources ADD COLUMN IF NOT EXISTS grade_id UUID REFERENCES grades(id) ON DELETE SET NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS book_id UUID REFERENCES books(id) ON DELETE SET NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS concept_ids UUID[] DEFAULT '{}'::UUID[];
ALTER TABLE resources ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS validation_status TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS validation_score INT DEFAULT NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS validation_errors JSONB NOT NULL DEFAULT '[]'::JSONB;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS validation_warnings JSONB NOT NULL DEFAULT '[]'::JSONB;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. Resource Versions Table (Audit Trails, Snapshots & Rollback)
CREATE TABLE IF NOT EXISTS resource_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  snapshot JSONB NOT NULL DEFAULT '{}'::JSONB,
  change_summary TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_resource_version UNIQUE (resource_id, version_number)
);

-- 5. Resource Usage Tracking Table
CREATE TABLE IF NOT EXISTS resource_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('OPENED', 'PRESENTED', 'ASSIGNED', 'COMPLETED', 'DOWNLOADED')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Media Assets Table
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INT,
  thumbnail_url TEXT,
  source TEXT NOT NULL DEFAULT 'UPLOAD' CHECK (source IN ('UPLOAD', 'EXTERNAL', 'PLATFORM')),
  source_url TEXT,
  file_path TEXT,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  language TEXT NOT NULL DEFAULT 'en',
  curriculum_mapping JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'READY' CHECK (status IN ('UPLOADING', 'PROCESSING', 'READY', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Media Processing Jobs Table (Queue-Backed Media Worker)
CREATE TABLE IF NOT EXISTS media_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('THUMBNAIL', 'TRANSCODE', 'METADATA_PROBE')),
  status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  retry_count INT NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 8. Performance Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_resources_grade_subject ON resources(grade_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_chapter ON resources(chapter_id);
CREATE INDEX IF NOT EXISTS idx_resources_owner_status ON resources(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_school ON resources(school_id);

CREATE INDEX IF NOT EXISTS idx_resource_versions_res ON resource_versions(resource_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_resource_usage_res ON resource_usage(resource_id, action);
CREATE INDEX IF NOT EXISTS idx_resource_usage_user ON resource_usage(user_id);

CREATE INDEX IF NOT EXISTS idx_media_assets_owner ON media_assets(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_media_assets_school ON media_assets(school_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_asset_status ON media_jobs(asset_id, status);

-- =============================================================================
-- 9. Row Level Security (RLS)
-- =============================================================================

ALTER TABLE resource_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_jobs ENABLE ROW LEVEL SECURITY;

-- 9.1 resource_versions RLS Policies
CREATE POLICY rv_teacher_select ON resource_versions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_versions.resource_id
        AND (
          r.owner_id = auth.uid()
          OR r.status = 'PUBLISHED'
        )
    )
  );

CREATE POLICY rv_teacher_insert ON resource_versions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_versions.resource_id
        AND r.owner_id = auth.uid()
    )
  );

CREATE POLICY rv_school_admin_select ON resource_versions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resources r
      JOIN profiles p ON p.id = auth.uid()
      WHERE r.id = resource_versions.resource_id
        AND r.school_id = p.school_id
        AND p.role = 'school_admin'
    )
  );

CREATE POLICY rv_superadmin_all ON resource_versions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY rv_service_role_all ON resource_versions
  FOR ALL TO service_role
  USING (true);

-- 9.2 resource_usage RLS Policies
CREATE POLICY ru_authenticated_insert ON resource_usage
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY ru_teacher_select ON resource_usage
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_usage.resource_id
        AND r.owner_id = auth.uid()
    )
  );

CREATE POLICY ru_superadmin_all ON resource_usage
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY ru_service_role_all ON resource_usage
  FOR ALL TO service_role
  USING (true);

-- 9.3 media_assets RLS Policies
CREATE POLICY ma_owner_all ON media_assets
  FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY ma_school_admin_select ON media_assets
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'school_admin'
        AND p.school_id = media_assets.school_id
    )
  );

CREATE POLICY ma_superadmin_all ON media_assets
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY ma_service_role_all ON media_assets
  FOR ALL TO service_role
  USING (true);

-- 9.4 media_jobs RLS Policies
CREATE POLICY mj_owner_select ON media_jobs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM media_assets ma
      WHERE ma.id = media_jobs.asset_id
        AND ma.owner_id = auth.uid()
    )
  );

CREATE POLICY mj_superadmin_all ON media_jobs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY mj_service_role_all ON media_jobs
  FOR ALL TO service_role
  USING (true);
