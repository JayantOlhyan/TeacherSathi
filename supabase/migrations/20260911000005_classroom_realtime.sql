-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000005_classroom_realtime.sql
-- Description: Real-time classroom sessions, secure multi-device pairings,
-- authoritative sequence-numbered event streaming, and RLS policies.
-- =============================================================================

-- 1. EXTEND CLASSROOM_SESSIONS TABLE
-- Make device_id nullable (session created in WAITING before devices connect)
ALTER TABLE classroom_sessions ALTER COLUMN device_id DROP NOT NULL;

-- Add canonical metadata fields
ALTER TABLE classroom_sessions 
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'NCERT Classroom Session',
  ADD COLUMN IF NOT EXISTS grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active_resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pairing_code_hash TEXT,
  ADD COLUMN IF NOT EXISTS pairing_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2. CLASSROOM SESSION DEVICES TABLE (Multi-device classroom membership)
CREATE TABLE IF NOT EXISTS classroom_session_devices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES classroom_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('TEACHER', 'SMARTBOARD', 'STUDENT', 'OBSERVER')),
  device_name TEXT NOT NULL,
  device_fingerprint_hash TEXT,
  role TEXT NOT NULL DEFAULT 'DISPLAY',
  status TEXT NOT NULL DEFAULT 'CONNECTED' CHECK (status IN ('PENDING', 'CONNECTED', 'DISCONNECTED', 'REVOKED')),
  paired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  disconnected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CLASSROOM PAIRINGS (Ephemeral single-use secure pairing tokens)
CREATE TABLE IF NOT EXISTS classroom_pairings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES classroom_sessions(id) ON DELETE CASCADE,
  pairing_token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. CLASSROOM EVENTS (Authoritative sequence-numbered event log)
CREATE TABLE IF NOT EXISTS classroom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES classroom_sessions(id) ON DELETE CASCADE,
  device_id TEXT REFERENCES classroom_session_devices(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}',
  sequence_number BIGINT NOT NULL,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_session_sequence UNIQUE (session_id, sequence_number)
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_school_status ON classroom_sessions(school_id, status);
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_teacher ON classroom_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_activity ON classroom_sessions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_classroom_session_devices_session ON classroom_session_devices(session_id, status);
CREATE INDEX IF NOT EXISTS idx_classroom_session_devices_user ON classroom_session_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_classroom_pairings_hash ON classroom_pairings(pairing_token_hash);
CREATE INDEX IF NOT EXISTS idx_classroom_pairings_session ON classroom_pairings(session_id);
CREATE INDEX IF NOT EXISTS idx_classroom_events_session_seq ON classroom_events(session_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_classroom_events_idempotency ON classroom_events(idempotency_key);

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE classroom_session_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_pairings ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_events ENABLE ROW LEVEL SECURITY;

-- Classroom Session Devices Policies
CREATE POLICY "session_devices_select_policy" ON classroom_session_devices
  FOR SELECT USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_member(s.school_id)))
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "session_devices_insert_policy" ON classroom_session_devices
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_member(s.school_id)))
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "session_devices_update_policy" ON classroom_session_devices
  FOR UPDATE USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_admin(s.school_id)))
    )
  );

-- Classroom Pairings Policies
CREATE POLICY "pairings_select_policy" ON classroom_pairings
  FOR SELECT USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_admin(s.school_id)))
    )
  );

CREATE POLICY "pairings_insert_policy" ON classroom_pairings
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_admin(s.school_id)))
    )
  );

CREATE POLICY "pairings_update_policy" ON classroom_pairings
  FOR UPDATE USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_admin(s.school_id)))
    )
  );

-- Classroom Events Policies
CREATE POLICY "events_select_policy" ON classroom_events
  FOR SELECT USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR (s.school_id IS NOT NULL AND public.is_school_member(s.school_id)))
    )
  );

CREATE POLICY "events_insert_policy" ON classroom_events
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND s.teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM classroom_session_devices d
      WHERE d.id = device_id
        AND d.session_id = session_id
        AND d.status = 'CONNECTED'
    )
  );
