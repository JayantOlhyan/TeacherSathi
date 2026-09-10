export type ClassroomSessionStatus = 'WAITING' | 'PAIRING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export type ClassroomDeviceType = 'TEACHER' | 'SMARTBOARD' | 'STUDENT' | 'OBSERVER';

export type ClassroomDeviceRole = 'CONTROLLER' | 'DISPLAY' | 'PARTICIPANT' | 'AUDITOR';

export type ClassroomDeviceStatus = 'PENDING' | 'CONNECTED' | 'DISCONNECTED' | 'REVOKED';

export type ClassroomEventType =
  | 'SESSION_STARTED'
  | 'SESSION_PAUSED'
  | 'SESSION_RESUMED'
  | 'SESSION_ENDED'
  | 'DEVICE_CONNECTED'
  | 'DEVICE_DISCONNECTED'
  | 'DEVICE_REVOKED'
  | 'START_PRESENTATION'
  | 'NEXT_SLIDE'
  | 'PREVIOUS_SLIDE'
  | 'GOTO_SLIDE'
  | 'START_QUIZ'
  | 'END_QUIZ'
  | 'PUSH_RESOURCE'
  | 'START_TIMER'
  | 'STOP_TIMER'
  | 'LOCK_BOARD'
  | 'UNLOCK_BOARD'
  | 'WHITEBOARD_UPDATE'
  | 'CLEAR_WHITEBOARD';

export interface ClassroomSessionRecord {
  id: string;
  school_id: string | null;
  class_id: string | null;
  teacher_id: string | null;
  title: string;
  grade_id: string | null;
  subject_id: string | null;
  book_id: string | null;
  chapter_id: string | null;
  active_resource_id: string | null;
  status: ClassroomSessionStatus;
  pairing_code_hash: string | null;
  pairing_expires_at: string | null;
  started_at: string | null;
  paused_at: string | null;
  ended_at: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  device_id?: string | null;
  session_token_hash?: string;
  expires_at?: string;
}

export interface ClassroomSessionDeviceRecord {
  id: string;
  session_id: string;
  user_id: string | null;
  device_type: ClassroomDeviceType;
  device_name: string;
  device_fingerprint_hash: string | null;
  role: ClassroomDeviceRole;
  status: ClassroomDeviceStatus;
  paired_at: string;
  last_seen_at: string;
  disconnected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassroomEventRecord {
  id: string;
  session_id: string;
  device_id: string | null;
  actor_user_id: string | null;
  event_type: ClassroomEventType;
  event_payload: Record<string, unknown>;
  sequence_number: number;
  idempotency_key: string | null;
  created_at: string;
}

export interface ClassroomPairingRecord {
  id: string;
  session_id: string;
  pairing_token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface PresentationState {
  presentationId: string | null;
  title?: string;
  slideIndex: number;
  totalSlides: number;
  isActive: boolean;
}

export interface QuizState {
  quizResourceId: string | null;
  isActive: boolean;
  totalQuestions?: number;
}

export interface TimerState {
  isRunning: boolean;
  durationSeconds: number;
  startedAt: string | null;
  endsAt: string | null;
  remainingSeconds: number;
}

export interface WhiteboardState {
  isLocked: boolean;
  sceneData?: unknown;
  lastUpdatedBy?: string | null;
}

export interface AuthoritativeClassroomState {
  session: ClassroomSessionRecord;
  devices: ClassroomSessionDeviceRecord[];
  activeResourceId: string | null;
  presentation: PresentationState;
  quiz: QuizState;
  timer: TimerState;
  whiteboard: WhiteboardState;
  sequenceNumber: number;
  lastActivityAt: string;
}
