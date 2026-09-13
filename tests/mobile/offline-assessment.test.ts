import { describe, it, expect, beforeEach } from 'vitest';
import { AssessmentEngine } from '../../mobile/src/services/assessmentEngine';
import { DatabaseManager } from '../../mobile/src/database/databaseManager';
import { CachedAssessmentPackage } from '../../mobile/src/types';

describe('Phase 9: Mobile Offline Assessment & Tamper Sealing', () => {
  let db: DatabaseManager;
  let engine: AssessmentEngine;

  const samplePackage: CachedAssessmentPackage = {
    id: 'asmt-term-1',
    title: 'Mid-Term Science Assessment',
    duration_minutes: 45,
    total_marks: 30,
    passing_marks: 12,
    questions: [
      {
        id: 'q1',
        assessment_id: 'asmt-term-1',
        question_id: 'raw-q1',
        question_order: 1,
        section: 'A',
        marks: 2,
        question_en: 'Which organism is responsible for curd formation?',
        type: 'SINGLE_CHOICE',
        difficulty: 'EASY',
        options: [
          { option_key: 'A', text_en: 'Rhizobium' },
          { option_key: 'B', text_en: 'Lactobacillus' },
          { option_key: 'C', text_en: 'Yeast' },
        ],
      },
      {
        id: 'q2',
        assessment_id: 'asmt-term-1',
        question_id: 'raw-q2',
        question_order: 2,
        section: 'A',
        marks: 3,
        question_en: 'Explain why sodium is stored in kerosene.',
        type: 'SHORT_ANSWER',
        difficulty: 'MEDIUM',
      },
    ],
    offline_authorized: true,
    checksum: 'checksum-asmt-1',
    cached_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    db = new DatabaseManager();
    await db.initialize();
    engine = new AssessmentEngine(db);
    await engine.cacheAssessmentPackage(samplePackage);
  });

  it('should initialize attempt session and strip server answer keys from questions', async () => {
    const { session, questions } = await engine.startAttemptSession({
      attemptId: 'att-offline-001',
      assessmentId: 'asmt-term-1',
      studentId: 'stu-aarav',
    });

    expect(session.attemptId).toBe('att-offline-001');
    expect(session.durationMinutes).toBe(45);
    expect(session.remainingSeconds).toBe(45 * 60);
    expect(session.isSealed).toBe(false);
    expect(session.totalQuestions).toBe(2);

    // Question masking verification: no answer keys or rubrics exposed
    expect(questions.length).toBe(2);
    expect(questions[0].options?.length).toBe(3);
    expect(questions[0].options?.[0]).toEqual({ key: 'A', text: 'Rhizobium' });
    expect((questions[0] as unknown as Record<string, unknown>).model_answer).toBeUndefined();
    expect((questions[0] as unknown as Record<string, unknown>).correct_option).toBeUndefined();
  });

  it('should record offline answers and update answered questions count', async () => {
    await engine.startAttemptSession({
      attemptId: 'att-offline-002',
      assessmentId: 'asmt-term-1',
      studentId: 'stu-aarav',
    });

    await engine.recordAnswer({
      attemptId: 'att-offline-002',
      questionId: 'q1',
      selectedOptionKey: 'B',
    });

    const session = engine.getSession('att-offline-002');
    expect(session?.answeredQuestionsCount).toBe(1);

    const answers = await db.getAnswersForAttempt('att-offline-002');
    expect(answers.length).toBe(1);
    expect(answers[0].selected_option_key).toBe('B');
  });

  it('should seal attempt submission and reject subsequent answer modifications', async () => {
    await engine.startAttemptSession({
      attemptId: 'att-offline-003',
      assessmentId: 'asmt-term-1',
      studentId: 'stu-aarav',
    });

    await engine.recordAnswer({
      attemptId: 'att-offline-003',
      questionId: 'q1',
      selectedOptionKey: 'B',
    });

    const submitResult = await engine.submitAttempt({
      attemptId: 'att-offline-003',
      timeTakenSeconds: 1200,
    });

    expect(submitResult.sealed).toBe(true);
    expect(submitResult.outboxItem.entity_type).toBe('ATTEMPT_SUBMIT');
    expect(submitResult.outboxItem.endpoint).toBe('/api/attempts/att-offline-003/submit');

    const session = engine.getSession('att-offline-003');
    expect(session?.isSealed).toBe(true);
    expect(session?.sealedAt).toBeDefined();

    // Tamper protection: attempting to alter an answer after sealing must throw
    await expect(
      engine.recordAnswer({
        attemptId: 'att-offline-003',
        questionId: 'q1',
        selectedOptionKey: 'C',
      })
    ).rejects.toThrow('already sealed');

    // Attempting to re-submit must also throw
    await expect(
      engine.submitAttempt({
        attemptId: 'att-offline-003',
        timeTakenSeconds: 1210,
      })
    ).rejects.toThrow('already sealed');
  });
});
