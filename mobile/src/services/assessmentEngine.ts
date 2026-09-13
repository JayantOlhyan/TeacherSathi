import { DatabaseManager, databaseManager } from '../database/databaseManager';
import {
  CachedAssessmentPackage,
  MaskedAssessmentQuestion,
  OfflineAnswerRecord,
  SyncOutboxItem,
} from '../types';

export interface AssessmentAttemptSession {
  attemptId: string;
  assessmentId: string;
  studentId: string;
  startedAt: string;
  durationMinutes: number;
  remainingSeconds: number;
  isSealed: boolean;
  sealedAt?: string;
  totalQuestions: number;
  answeredQuestionsCount: number;
}

export class AssessmentEngine {
  private db: DatabaseManager;
  private activeSessions = new Map<string, AssessmentAttemptSession>();

  constructor(db: DatabaseManager = databaseManager) {
    this.db = db;
  }

  /**
   * Start or resume an offline assessment session
   */
  async startAttemptSession(params: {
    attemptId: string;
    assessmentId: string;
    studentId: string;
  }): Promise<{
    session: AssessmentAttemptSession;
    questions: MaskedAssessmentQuestion[];
  }> {
    const assessment = await this.db.getAssessment(params.assessmentId);
    if (!assessment) {
      throw new Error(`Assessment ${params.assessmentId} not found in local cache.`);
    }

    const existingAnswers = await this.db.getAnswersForAttempt(params.attemptId);
    const totalQuestions = assessment.questions.length;

    // Mask questions to prevent client-side answer key inspection
    const maskedQuestions: MaskedAssessmentQuestion[] = assessment.questions.map((q) => ({
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      marks: q.marks,
      question_en: q.question_en,
      question_hi: q.question_hi,
      options: q.options
        ? q.options.map((opt) => ({
            key: opt.option_key,
            text: opt.text_en,
          }))
        : undefined,
    }));

    const session: AssessmentAttemptSession = {
      attemptId: params.attemptId,
      assessmentId: params.assessmentId,
      studentId: params.studentId,
      startedAt: new Date().toISOString(),
      durationMinutes: assessment.duration_minutes,
      remainingSeconds: assessment.duration_minutes * 60,
      isSealed: false,
      totalQuestions,
      answeredQuestionsCount: existingAnswers.filter((a) => a.is_answered).length,
    };

    this.activeSessions.set(params.attemptId, session);

    return { session, questions: maskedQuestions };
  }

  /**
   * Record or update an answer offline
   */
  async recordAnswer(params: {
    attemptId: string;
    questionId: string;
    selectedOptionKey?: string | null;
    textAnswer?: string | null;
    answerPayload?: Record<string, unknown>;
  }): Promise<OfflineAnswerRecord> {
    const session = this.activeSessions.get(params.attemptId);
    if (session && session.isSealed) {
      throw new Error('Cannot record answer: assessment attempt is already sealed and submitted.');
    }

    const mutationId = `mut-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const isAnswered = Boolean(
      (params.selectedOptionKey && params.selectedOptionKey.trim().length > 0) ||
      (params.textAnswer && params.textAnswer.trim().length > 0) ||
      (params.answerPayload && Object.keys(params.answerPayload).length > 0)
    );

    const answerRecord: OfflineAnswerRecord = {
      attempt_id: params.attemptId,
      question_id: params.questionId,
      selected_option_key: params.selectedOptionKey || null,
      text_answer: params.textAnswer || null,
      answer_payload: params.answerPayload,
      is_answered: isAnswered,
      answered_at: new Date().toISOString(),
      client_mutation_id: mutationId,
    };

    await this.db.recordOfflineAnswer(answerRecord);

    if (session) {
      const answers = await this.db.getAnswersForAttempt(params.attemptId);
      session.answeredQuestionsCount = answers.filter((a) => a.is_answered).length;
    }

    return answerRecord;
  }

  /**
   * Seal an assessment attempt and queue for synchronization
   */
  async submitAttempt(params: {
    attemptId: string;
    timeTakenSeconds: number;
  }): Promise<{
    sealed: boolean;
    outboxItem: SyncOutboxItem;
  }> {
    const session = this.activeSessions.get(params.attemptId);
    if (session && session.isSealed) {
      throw new Error('Attempt is already sealed.');
    }

    const submitMutationId = `sub-${params.attemptId}-${Date.now()}`;
    const outboxItem = await this.db.sealAttemptSubmission(
      params.attemptId,
      params.timeTakenSeconds,
      submitMutationId
    );

    if (session) {
      session.isSealed = true;
      session.sealedAt = new Date().toISOString();
    }

    return {
      sealed: true,
      outboxItem,
    };
  }

  /**
   * Get active session or null
   */
  getSession(attemptId: string): AssessmentAttemptSession | null {
    return this.activeSessions.get(attemptId) || null;
  }

  /**
   * Cache an assessment package for offline delivery
   */
  async cacheAssessmentPackage(pkg: CachedAssessmentPackage): Promise<void> {
    await this.db.saveAssessment(pkg);
  }
}
