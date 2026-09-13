export const DATABASE_NAME = 'teachersathi_offline.db';

export const SCHEMA_VERSION = 1;

export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS cached_curriculum (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    parent_id TEXT,
    name_en TEXT NOT NULL,
    name_hi TEXT,
    code TEXT,
    metadata TEXT,
    cached_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cached_resources (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    chapter_id TEXT,
    content_json TEXT NOT NULL,
    status TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    cached_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cached_assignments (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    title TEXT NOT NULL,
    due_date TEXT,
    total_marks INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status TEXT NOT NULL,
    cached_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cached_assessments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    package_json TEXT NOT NULL,
    checksum TEXT NOT NULL,
    cached_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cached_class_packs (
    pack_id TEXT PRIMARY KEY,
    chapter_id TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    bundle_json TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    checksum TEXT NOT NULL,
    downloaded_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS offline_answers (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    selected_option_key TEXT,
    text_answer TEXT,
    answer_payload_json TEXT,
    is_answered INTEGER NOT NULL DEFAULT 1,
    client_sequence INTEGER NOT NULL,
    client_mutation_id TEXT NOT NULL UNIQUE,
    timestamp TEXT NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id)
  );

  CREATE TABLE IF NOT EXISTS sync_outbox (
    id TEXT PRIMARY KEY,
    mutation_id TEXT NOT NULL UNIQUE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    http_method TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_attempt_at TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS local_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_offline_answers_sync ON offline_answers(sync_status);
  CREATE INDEX IF NOT EXISTS idx_sync_outbox_status ON sync_outbox(status);
  CREATE INDEX IF NOT EXISTS idx_cached_class_packs_chapter ON cached_class_packs(chapter_id);
`;
