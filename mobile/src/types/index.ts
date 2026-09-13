export type MobileUserRole =
  | 'TEACHER'
  | 'STUDENT'
  | 'SCHOOL_ADMIN'
  | 'ORG_ADMIN'
  | 'DISTRICT_ADMIN'
  | 'STATE_ADMIN'
  | 'SUPER_ADMIN';

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';

export type NetworkConnectivityStatus = 'ONLINE' | 'SYNCING' | 'OFFLINE' | 'SYNC_ERROR';

export interface MobileUserProfile {
  id: string;
  email: string;
  full_name: string;
  role: MobileUserRole;
  school_id: string | null;
  avatar_url?: string | null;
}

export interface CachedCurriculumItem {
  id: string;
  type: 'GRADE' | 'SUBJECT' | 'BOOK' | 'CHAPTER' | 'CONCEPT';
  parent_id: string | null;
  name_en: string;
  name_hi?: string;
  code?: string;
  metadata?: Record<string, unknown>;
  cached_at: string;
}

export interface CachedResourceItem {
  id: string;
  type: string;
  title: string;
  chapter_id: string;
  content: Record<string, unknown>;
  status: string;
  version: number;
  cached_at: string;
}

export interface CachedAssignmentItem {
  id: string;
  assessment_id: string;
  class_id: string;
  title: string;
  due_date: string | null;
  total_marks: number;
  duration_minutes: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  cached_at: string;
}

export interface CachedAssessmentQuestion {
  id: string;
  assessment_id: string;
  question_id: string | null;
  question_order: number;
  section: string;
  marks: number;
  question_en: string;
  question_hi?: string;
  type: string;
  difficulty?: string;
  options?: Array<{
    option_key: string;
    text_en: string;
    text_hi?: string;
  }>;
}

export interface MaskedAssessmentQuestion {
  id: string;
  type: string;
  difficulty?: string;
  marks: number;
  question_en: string;
  question_hi?: string;
  options?: Array<{
    key: string;
    text: string;
  }>;
}

export interface CachedAssessmentPackage {
  id: string;
  title: string;
  instructions?: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  questions: CachedAssessmentQuestion[];
  offline_authorized: boolean;
  checksum: string;
  cached_at: string;
}

export interface OfflineAnswerRecord {
  id?: string;
  attempt_id: string;
  question_id: string;
  selected_option_key?: string | null;
  text_answer?: string | null;
  answer_payload?: Record<string, unknown>;
  is_answered: boolean;
  client_sequence?: number;
  client_mutation_id: string;
  timestamp?: string;
  answered_at?: string;
  sync_status?: SyncStatus;
}

export interface SyncOutboxItem {
  id: string;
  mutation_id: string;
  entity_type: 'ANSWER' | 'ATTEMPT_SUBMIT' | 'CLASSROOM_EVENT' | 'TEACHER_DRAFT';
  entity_id: string;
  endpoint: string;
  http_method: 'POST' | 'PATCH' | 'PUT';
  payload: Record<string, unknown>;
  attempt_count: number;
  last_attempt_at: string | null;
  status: SyncStatus;
  error_message?: string | null;
  created_at: string;
}

export interface CachedClassPackItem {
  pack_id: string;
  chapter_id: string;
  title_en: string;
  title_hi?: string;
  chapter_number: number;
  bundle_json: string; // JSON serialized ClassPack data
  size_bytes: number;
  checksum: string;
  downloaded_at: string;
}

export interface MobileNotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  read_at: string | null;
  is_read?: boolean;
  created_at: string;
}

export interface AppVersionCheckResponse {
  status: 'CURRENT' | 'UPDATE_RECOMMENDED' | 'UPDATE_REQUIRED';
  minSupportedVersion: string;
  latestVersion: string;
  updateUrl?: string;
  changelogUrl?: string;
  criticalSecurityPatch: boolean;
}

