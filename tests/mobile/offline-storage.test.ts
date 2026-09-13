import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseManager } from '../../mobile/src/database/databaseManager';
import { CachedClassPackItem, CachedAssessmentPackage, OfflineAnswerRecord } from '../../mobile/src/types';

describe('Phase 9: Mobile Offline Storage & SQLite Manager', () => {
  let db: DatabaseManager;

  beforeEach(async () => {
    db = new DatabaseManager();
    await db.initialize();
  });

  it('should initialize local schema and allow saving/retrieving class packs', async () => {
    const samplePack: CachedClassPackItem = {
      pack_id: 'pack-ch-1',
      chapter_id: 'ch-ncert-sci-8-1',
      title_en: 'Crop Production and Management',
      title_hi: 'फसल उत्पादन एवं प्रबंध',
      chapter_number: 1,
      bundle_json: JSON.stringify({ concepts: ['Kharif', 'Rabi'] }),
      size_bytes: 1024 * 50,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      downloaded_at: new Date().toISOString(),
    };

    await db.saveClassPack(samplePack);

    const retrieved = await db.getClassPack('ch-ncert-sci-8-1');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.title_en).toBe('Crop Production and Management');
    expect(retrieved?.chapter_number).toBe(1);

    const allPacks = await db.listClassPacks();
    expect(allPacks.length).toBe(1);

    await db.deleteClassPack('ch-ncert-sci-8-1');
    const afterDelete = await db.getClassPack('ch-ncert-sci-8-1');
    expect(afterDelete).toBeNull();
  });

  it('should save and retrieve cached assessments', async () => {
    const assessment: CachedAssessmentPackage = {
      id: 'asmt-8-sci-1',
      title: 'Periodic Test 1: Crop Production',
      duration_minutes: 30,
      total_marks: 20,
      passing_marks: 8,
      questions: [
        {
          id: 'q1',
          assessment_id: 'asmt-8-sci-1',
          question_id: 'raw-q1',
          question_order: 1,
          section: 'A',
          marks: 2,
          question_en: 'Define Kharif crops with examples.',
          type: 'SHORT_ANSWER',
        },
      ],
      offline_authorized: true,
      checksum: 'abc123hash',
      cached_at: new Date().toISOString(),
    };

    await db.saveAssessment(assessment);

    const retrieved = await db.getAssessment('asmt-8-sci-1');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.title).toBe('Periodic Test 1: Crop Production');
    expect(retrieved?.questions.length).toBe(1);
  });

  it('should record offline answers and simultaneously queue into transactional outbox', async () => {
    const answer: OfflineAnswerRecord = {
      attempt_id: 'att-123',
      question_id: 'q1',
      selected_option_key: 'B',
      text_answer: null,
      is_answered: true,
      answered_at: new Date().toISOString(),
      client_mutation_id: 'mut-uuid-001',
    };

    await db.recordOfflineAnswer(answer);

    const storedAnswers = await db.getAnswersForAttempt('att-123');
    expect(storedAnswers.length).toBe(1);
    expect(storedAnswers[0].selected_option_key).toBe('B');

    const outbox = await db.getPendingOutboxItems();
    expect(outbox.length).toBe(1);
    expect(outbox[0].mutation_id).toBe('mut-uuid-001');
    expect(outbox[0].entity_type).toBe('ANSWER');
    expect(outbox[0].status).toBe('PENDING');
  });

  it('should calculate local storage usage summary accurately', async () => {
    const samplePack: CachedClassPackItem = {
      pack_id: 'pack-ch-2',
      chapter_id: 'ch-2',
      title_en: 'Microorganisms',
      chapter_number: 2,
      bundle_json: '{}',
      size_bytes: 200000,
      checksum: 'hash2',
      downloaded_at: new Date().toISOString(),
    };
    await db.saveClassPack(samplePack);

    await db.recordOfflineAnswer({
      attempt_id: 'att-999',
      question_id: 'q2',
      selected_option_key: 'A',
      is_answered: true,
      client_mutation_id: 'mut-uuid-999',
    });

    const summary = await db.getStorageUsageSummary();
    expect(summary.classPacksBytes).toBe(200000);
    expect(summary.answersCount).toBe(1);
    expect(summary.pendingSyncCount).toBe(1);
  });
});
