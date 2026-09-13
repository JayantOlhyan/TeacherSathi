import {
  CachedCurriculumItem,
  CachedAssignmentItem,
  CachedAssessmentPackage,
  CachedClassPackItem,
  OfflineAnswerRecord,
  SyncOutboxItem,
  SyncStatus,
} from '../types';
import { CREATE_TABLES_SQL } from './schema';

export interface StorageUsageSummary {
  totalBytes: number;
  classPacksBytes: number;
  assessmentsBytes: number;
  answersCount: number;
  pendingSyncCount: number;
}

export interface SQLiteDriver {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowId: number }>;
  getAllAsync<T>(sql: string, params?: unknown[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: unknown[]): Promise<T | null>;
}

// In-Memory SQLite Fallback for Node.js / Unit Tests
class InMemoryDriver implements SQLiteDriver {
  private tables: Record<string, Map<string, Record<string, unknown>>> = {
    cached_curriculum: new Map(),
    cached_resources: new Map(),
    cached_assignments: new Map(),
    cached_assessments: new Map(),
    cached_class_packs: new Map(),
    offline_answers: new Map(),
    sync_outbox: new Map(),
    local_settings: new Map(),
  };

  async execAsync(_sql: string): Promise<void> {
    // Schema initialized
  }

  async runAsync(sql: string, params: unknown[] = []): Promise<{ changes: number; lastInsertRowId: number }> {
    const trimmed = sql.trim().toUpperCase();

    if (trimmed.startsWith('INSERT') || trimmed.startsWith('REPLACE')) {
      const tableName = sql.match(/INTO\s+([a-zA-Z0-9_]+)/i)?.[1]?.toLowerCase();
      if (tableName && this.tables[tableName]) {
        // Simple mock key resolution
        const id = (params[0] as string) || `id-${Date.now()}-${Math.random()}`;
        this.tables[tableName].set(id, { id, raw: params });
        return { changes: 1, lastInsertRowId: 1 };
      }
    }

    if (trimmed.startsWith('DELETE')) {
      const tableName = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i)?.[1]?.toLowerCase();
      if (tableName && this.tables[tableName]) {
        if (params.length > 0) {
          const target = params[0] as string;
          const toDelete: string[] = [];
          this.tables[tableName].forEach((val, key) => {
            if (key === target || (Array.isArray(val.raw) && val.raw.includes(target))) {
              toDelete.push(key);
            }
          });
          toDelete.forEach((key) => this.tables[tableName].delete(key));
        } else {
          this.tables[tableName].clear();
        }
        return { changes: 1, lastInsertRowId: 0 };
      }
    }

    return { changes: 1, lastInsertRowId: 1 };
  }

  async getAllAsync<T>(sql: string, _params: unknown[] = []): Promise<T[]> {
    const tableName = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i)?.[1]?.toLowerCase();
    if (tableName && this.tables[tableName]) {
      const items: T[] = [];
      this.tables[tableName].forEach((val) => items.push(val as unknown as T));
      return items;
    }
    return [];
  }

  async getFirstAsync<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const tableName = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i)?.[1]?.toLowerCase();
    if (tableName && this.tables[tableName]) {
      if (params.length > 0) {
        const target = params[0] as string;
        let found: T | null = null;
        this.tables[tableName].forEach((val, key) => {
          if (!found && (key === target || (Array.isArray(val.raw) && val.raw.includes(target)))) {
            found = val as unknown as T;
          }
        });
        return found;
      }
      let first: T | null = null;
      this.tables[tableName].forEach((val) => {
        if (!first) first = val as unknown as T;
      });
      return first;
    }
    return null;
  }
}

export class DatabaseManager {
  private driver: SQLiteDriver;
  private initialized = false;

  // In-memory structured stores for high-speed offline access
  private classPacks = new Map<string, CachedClassPackItem>();
  private assessments = new Map<string, CachedAssessmentPackage>();
  private assignments = new Map<string, CachedAssignmentItem>();
  private answers = new Map<string, OfflineAnswerRecord>();
  private outbox = new Map<string, SyncOutboxItem>();
  private curriculum = new Map<string, CachedCurriculumItem>();

  constructor(driver?: SQLiteDriver) {
    this.driver = driver || new InMemoryDriver();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.driver.execAsync(CREATE_TABLES_SQL);
    this.initialized = true;
  }

  // ---------------------------------------------------------------------------
  // CLASS PACKS (OFFLINE BUNDLES)
  // ---------------------------------------------------------------------------

  async saveClassPack(pack: CachedClassPackItem): Promise<void> {
    await this.initialize();
    this.classPacks.set(pack.chapter_id, pack);
    await this.driver.runAsync(
      `INSERT OR REPLACE INTO cached_class_packs 
       (pack_id, chapter_id, title_en, title_hi, chapter_number, bundle_json, size_bytes, checksum, downloaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pack.pack_id,
        pack.chapter_id,
        pack.title_en,
        pack.title_hi,
        pack.chapter_number,
        pack.bundle_json,
        pack.size_bytes,
        pack.checksum,
        pack.downloaded_at,
      ]
    );
  }

  async getClassPack(chapterId: string): Promise<CachedClassPackItem | null> {
    await this.initialize();
    if (this.classPacks.has(chapterId)) {
      return this.classPacks.get(chapterId)!;
    }
    return this.driver.getFirstAsync<CachedClassPackItem>(
      `SELECT * FROM cached_class_packs WHERE chapter_id = ?`,
      [chapterId]
    );
  }

  async listClassPacks(): Promise<CachedClassPackItem[]> {
    await this.initialize();
    const list: CachedClassPackItem[] = [];
    this.classPacks.forEach((pack) => list.push(pack));
    return list;
  }

  async deleteClassPack(chapterId: string): Promise<void> {
    await this.initialize();
    this.classPacks.delete(chapterId);
    await this.driver.runAsync(
      `DELETE FROM cached_class_packs WHERE chapter_id = ?`,
      [chapterId]
    );
  }

  // ---------------------------------------------------------------------------
  // ASSESSMENTS & ASSIGNMENTS
  // ---------------------------------------------------------------------------

  async saveAssessment(assessment: CachedAssessmentPackage): Promise<void> {
    await this.initialize();
    this.assessments.set(assessment.id, assessment);
    await this.driver.runAsync(
      `INSERT OR REPLACE INTO cached_assessments 
       (id, title, duration_minutes, total_marks, passing_marks, package_json, checksum, cached_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assessment.id,
        assessment.title,
        assessment.duration_minutes,
        assessment.total_marks,
        assessment.passing_marks,
        JSON.stringify(assessment),
        assessment.checksum,
        assessment.cached_at,
      ]
    );
  }

  async getAssessment(assessmentId: string): Promise<CachedAssessmentPackage | null> {
    await this.initialize();
    return this.assessments.get(assessmentId) || null;
  }

  async saveAssignment(assignment: CachedAssignmentItem): Promise<void> {
    await this.initialize();
    this.assignments.set(assignment.id, assignment);
  }

  async listAssignments(): Promise<CachedAssignmentItem[]> {
    await this.initialize();
    const list: CachedAssignmentItem[] = [];
    this.assignments.forEach((assignment) => list.push(assignment));
    return list;
  }

  // ---------------------------------------------------------------------------
  // OFFLINE ANSWERS & TRANSACTIONAL OUTBOX
  // ---------------------------------------------------------------------------

  async recordOfflineAnswer(answer: OfflineAnswerRecord): Promise<void> {
    await this.initialize();
    const key = `${answer.attempt_id}_${answer.question_id}`;
    this.answers.set(key, answer);

    // Also queue into Outbox
    const outboxItem: SyncOutboxItem = {
      id: `outbox-${answer.client_mutation_id}`,
      mutation_id: answer.client_mutation_id,
      entity_type: 'ANSWER',
      entity_id: answer.attempt_id,
      endpoint: `/api/attempts/${answer.attempt_id}/answers`,
      http_method: 'PATCH',
      payload: {
        answers: [
          {
            assessment_question_id: answer.question_id,
            selected_option_key: answer.selected_option_key,
            text_answer: answer.text_answer,
            answer_payload: answer.answer_payload || {},
            is_answered: answer.is_answered,
          },
        ],
      },
      attempt_count: 0,
      last_attempt_at: null,
      status: 'PENDING',
      error_message: null,
      created_at: new Date().toISOString(),
    };

    this.outbox.set(outboxItem.mutation_id, outboxItem);
  }

  async getAnswersForAttempt(attemptId: string): Promise<OfflineAnswerRecord[]> {
    await this.initialize();
    const list: OfflineAnswerRecord[] = [];
    this.answers.forEach((a) => {
      if (a.attempt_id === attemptId) list.push(a);
    });
    return list;
  }

  async sealAttemptSubmission(
    attemptId: string,
    timeTakenSeconds: number,
    mutationId: string
  ): Promise<SyncOutboxItem> {
    await this.initialize();

    const outboxItem: SyncOutboxItem = {
      id: `outbox-submit-${mutationId}`,
      mutation_id: mutationId,
      entity_type: 'ATTEMPT_SUBMIT',
      entity_id: attemptId,
      endpoint: `/api/attempts/${attemptId}/submit`,
      http_method: 'POST',
      payload: { time_taken_seconds: timeTakenSeconds },
      attempt_count: 0,
      last_attempt_at: null,
      status: 'PENDING',
      error_message: null,
      created_at: new Date().toISOString(),
    };

    this.outbox.set(outboxItem.mutation_id, outboxItem);
    return outboxItem;
  }

  // ---------------------------------------------------------------------------
  // OUTBOX MANAGEMENT
  // ---------------------------------------------------------------------------

  async getPendingOutboxItems(): Promise<SyncOutboxItem[]> {
    await this.initialize();
    const list: SyncOutboxItem[] = [];
    this.outbox.forEach((item) => {
      if (item.status === 'PENDING' || item.status === 'FAILED') {
        list.push(item);
      }
    });
    return list;
  }

  async updateOutboxStatus(
    mutationId: string,
    status: SyncStatus,
    errorMessage?: string,
    incrementAttempt = false
  ): Promise<void> {
    await this.initialize();
    const item = this.outbox.get(mutationId);
    if (item) {
      item.status = status;
      item.last_attempt_at = new Date().toISOString();
      if (incrementAttempt) {
        item.attempt_count += 1;
      }
      if (errorMessage) item.error_message = errorMessage;
      this.outbox.set(mutationId, item);
    }
  }

  // ---------------------------------------------------------------------------
  // STORAGE AUDIT
  // ---------------------------------------------------------------------------

  async getStorageUsageSummary(): Promise<StorageUsageSummary> {
    await this.initialize();
    let classPacksBytes = 0;
    this.classPacks.forEach((pack) => {
      classPacksBytes += pack.size_bytes || 0;
    });

    let assessmentsBytes = 0;
    this.assessments.forEach((a) => {
      assessmentsBytes += JSON.stringify(a).length * 2; // rough UTF-16 byte estimate
    });

    let pendingSyncCount = 0;
    this.outbox.forEach((item) => {
      if (item.status === 'PENDING' || item.status === 'FAILED') {
        pendingSyncCount += 1;
      }
    });

    return {
      totalBytes: classPacksBytes + assessmentsBytes,
      classPacksBytes,
      assessmentsBytes,
      answersCount: this.answers.size,
      pendingSyncCount,
    };
  }

  async clearUserDataOnLogout(): Promise<void> {
    await this.initialize();
    this.answers.clear();
    this.outbox.clear();
    this.assignments.clear();
  }
}

export const databaseManager = new DatabaseManager();
