/**
 * @deprecated Phase 3 Decommissioned:
 * Classroom sessions are now persisted authoritatively in PostgreSQL (classroom_sessions)
 * and synchronized in real time via Supabase Realtime channels (src/lib/classroom/useClassroomRealtime.ts).
 * LocalStorage mock session persistence has been completely removed.
 */

export type {
  ClassroomSessionRecord as ClassroomSession,
  ClassroomSessionStatus,
} from './classroom/types';
