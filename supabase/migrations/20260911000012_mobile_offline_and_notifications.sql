-- TeacherSathi Phase 9: Native Mobile, Offline Experience & Notifications
-- Migration: 20260911000012_mobile_offline_and_notifications.sql

-- 1. NOTIFICATION TYPE ENUM
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM (
      'ASSIGNMENT_NEW',
      'ASSIGNMENT_DUE',
      'ASSESSMENT_PUBLISHED',
      'RESULT_AVAILABLE',
      'ANNOUNCEMENT',
      'CLASSROOM_INVITE',
      'SYNC_ALERT'
    );
  END IF;
END $$;

-- 2. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, read_at) 
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_created 
  ON public.notifications(user_id, created_at DESC);

-- 3. MOBILE DEVICES TABLE
CREATE TABLE IF NOT EXISTS public.mobile_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_id VARCHAR(100) NOT NULL,
  platform VARCHAR(20) NOT NULL, -- 'android' | 'ios'
  push_token TEXT,
  app_version VARCHAR(50) NOT NULL,
  device_model VARCHAR(100),
  os_version VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_device UNIQUE (user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_mobile_devices_user 
  ON public.mobile_devices(user_id);

CREATE INDEX IF NOT EXISTS idx_mobile_devices_token 
  ON public.mobile_devices(push_token) 
  WHERE push_token IS NOT NULL;

-- 4. APP VERSION MANAGEMENT TABLE
CREATE TABLE IF NOT EXISTS public.app_version_configs (
  platform VARCHAR(20) PRIMARY KEY, -- 'android', 'ios'
  min_supported_version VARCHAR(50) NOT NULL,
  latest_version VARCHAR(50) NOT NULL,
  update_url VARCHAR(255),
  release_notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.app_version_configs (platform, min_supported_version, latest_version, update_url, release_notes)
VALUES 
  ('android', '1.0.0', '1.0.0', 'https://play.google.com/store/apps/details?id=in.teachersathi.app', 'TeacherSathi Mobile v1.0.0 for Android'),
  ('ios', '1.0.0', '1.0.0', 'https://apps.apple.com/app/teachersathi/id0000000000', 'TeacherSathi Mobile v1.0.0 for iOS')
ON CONFLICT (platform) DO NOTHING;

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_version_configs ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "notifications_insert_policy" ON public.notifications
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_super_admin() OR auth.uid() IS NOT NULL);

-- Mobile Devices Policies
CREATE POLICY "mobile_devices_select_own" ON public.mobile_devices
  FOR SELECT USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "mobile_devices_manage_own" ON public.mobile_devices
  FOR ALL USING (user_id = auth.uid() OR public.is_super_admin());

-- App Version Configs Policies (Publicly readable by authenticated mobile clients)
CREATE POLICY "app_version_configs_select" ON public.app_version_configs
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "app_version_configs_manage" ON public.app_version_configs
  FOR ALL USING (public.is_super_admin());
