import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { masteryService } from '../services/mastery';
import {
  AssessmentCreateSchema,
  AssessmentUpdateSchema,
  AssignmentCreateSchema,
  AnswerSaveSchema,
  BatchAnswersSaveSchema,
  type AssessmentSettings,
  type QuestionSnapshot,
} from '../validations/assessment';

// =============================================================================
// TYPES
// =============================================================================

export interface AssessmentQuestionRecord {
  id: string;
  assessment_id: string;
  question_id: string | null;
  question_order: number;
  section: string;
  marks_override: number | null;
  question_snapshot: QuestionSnapshot;
  created_at: string;
}

export interface AssessmentRecord {
  id: string;
  school_id: string | null;
  teacher_id: string;
  class_id: string | null;
  title: string;
  description: string | null;
  assessment_type: 'MCQ_QUIZ' | 'TEST_PAPER' | 'WORKSHEET' | 'ASSIGNMENT';
  grade_id: string;
  subject_id: string;
  book_id: string | null;
  chapter_id: string | null;
  concept_id: string | null;
  language: 'en' | 'hi' | 'bilingual';
  duration_minutes: number;
  total_marks: number;
  passing_marks: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  instructions: string[];
  settings: AssessmentSettings;
  available_from: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
  questions?: AssessmentQuestionRecord[];
}

export interface AssignmentRecord {
  id: string;
  assessment_id: string;
  class_id: string;
  teacher_id: string;
  school_id: string | null;
  assigned_at: string;
  available_from: string | null;
  due_at: string | null;
  status: 'SCHEDULED' | 'ACTIVE' | 'CLOSED';
  settings_override: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  assessment?: AssessmentRecord;
  class?: {
    id: string;
    name: string;
    section: string;
    grade_id: string;
  };
}

export interface AttemptAnswerRecord {
  id: string;
  attempt_id: string;
  assessment_question_id: string;
  selected_option: 'A' | 'B' | 'C' | 'D' | null;
  text_answer: string | null;
  answer_payload: Record<string, unknown>;
  is_answered: boolean;
  marks_awarded: number | null;
  max_marks: number;
  is_correct: boolean | null;
  grading_status: 'UNGRADED' | 'AUTO_GRADED' | 'MANUAL_REVIEW' | 'GRADED';
  feedback: string | null;
  created_at: string;
  updated_at: string;
  assessment_question?: AssessmentQuestionRecord;
}

export interface AssessmentAttemptRecord {
  id: string;
  assessment_id: string;
  assignment_id: string | null;
  student_id: string;
  started_at: string;
  submitted_at: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'ABANDONED';
  attempt_number: number;
  score: number | null;
  total_marks: number;
  percentage: number | null;
  time_taken_seconds: number;
  created_at: string;
  updated_at: string;
  answers?: AttemptAnswerRecord[];
  assessment?: AssessmentRecord;
  student?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface QuestionBreakdownItem {
  question_order: number;
  question_id: string;
  question_type: string;
  section: string;
  max_marks: number;
  marks_awarded: number;
  selected_option: string | null;
  correct_option: string | null;
  is_correct: boolean;
  grading_status: string;
  text_en: string;
  explanation_en?: string;
}

export interface AssessmentResultRecord {
  id: string;
  attempt_id: string;
  assessment_id: string;
  student_id: string;
  total_marks: number;
  marks_obtained: number;
  percentage: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  time_taken_seconds: number;
  is_passed: boolean | null;
  submission_type: 'ON_TIME' | 'LATE';
  question_breakdown: QuestionBreakdownItem[];
  created_at: string;
  student?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface AssessmentAnalytics {
  assessment_id: string;
  title: string;
  total_students: number;
  total_attempts: number;
  total_submitted: number;
  average_score: number;
  average_percentage: number;
  highest_score: number;
  lowest_score: number;
  pass_rate_percentage: number;
  students_breakdown: Array<{
    student_id: string;
    student_name: string;
    status: string;
    score: number | null;
    percentage: number | null;
    time_taken_seconds: number;
    submitted_at: string | null;
    submission_type: string;
  }>;
  questions_analytics: Array<{
    question_order: number;
    question_text: string;
    question_type: string;
    section: string;
    max_marks: number;
    attempted_count: number;
    correct_count: number;
    incorrect_count: number;
    accuracy_percentage: number;
    difficulty_signal: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}

// =============================================================================
// REPOSITORY IMPLEMENTATION
// =============================================================================

export const assessmentsRepository = {
  /**
   * Creates a new assessment and snapshots all questions.
   */
  async createAssessment(
    rawPayload: unknown,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentRecord> {
    const validated = AssessmentCreateSchema.parse(rawPayload);
    const { questions, ...assessmentFields } = validated;

    // Calculate sum of marks
    const calculatedTotalMarks = questions.reduce((sum, q) => {
      const qMarks = q.marks_override ?? q.question_snapshot.marks ?? 1;
      return sum + qMarks;
    }, 0);

    const { data: assessment, error: aError } = await client
      .from('assessments')
      .insert([
        {
          ...assessmentFields,
          teacher_id: teacherId,
          total_marks: calculatedTotalMarks || assessmentFields.total_marks,
          status: 'DRAFT',
        },
      ])
      .select()
      .single();

    if (aError || !assessment) {
      throw new Error(`Failed to create assessment: ${aError?.message || 'Unknown error'}`);
    }

    // Insert snapshot questions in deterministic order
    const questionRows = questions.map((q, idx) => ({
      assessment_id: assessment.id,
      question_id: q.question_id || null,
      question_order: idx + 1,
      section: q.section || 'SECTION_A',
      marks_override: q.marks_override || null,
      question_snapshot: q.question_snapshot,
    }));

    const { data: insertedQuestions, error: qError } = await client
      .from('assessment_questions')
      .insert(questionRows)
      .select()
      .order('question_order', { ascending: true });

    if (qError) {
      // Cleanup if question insert fails
      await client.from('assessments').delete().eq('id', assessment.id);
      throw new Error(`Failed to insert assessment questions: ${qError.message}`);
    }

    return {
      ...(assessment as AssessmentRecord),
      questions: (insertedQuestions || []) as AssessmentQuestionRecord[],
    };
  },

  /**
   * Retrieves assessment by ID, optionally sanitizing answer keys for students.
   */
  async getAssessmentById(
    id: string,
    client: SupabaseClient = defaultClient,
    sanitizeForStudent: boolean = false
  ): Promise<AssessmentRecord | null> {
    const { data: assessment, error: aError } = await client
      .from('assessments')
      .select('*, questions:assessment_questions(*)')
      .eq('id', id)
      .single();

    if (aError) {
      if (aError.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch assessment: ${aError.message}`);
    }

    const rec = assessment as AssessmentRecord;

    if (rec.questions) {
      // Sort deterministic
      rec.questions.sort((a, b) => a.question_order - b.question_order);

      if (sanitizeForStudent) {
        // Conceal answers, explanations, and is_correct flags
        rec.questions = rec.questions.map((q) => {
          const snapshot = { ...q.question_snapshot };
          if (snapshot.options) {
            snapshot.options = snapshot.options.map((opt) => ({
              option_key: opt.option_key,
              text_en: opt.text_en,
              text_hi: opt.text_hi,
              is_correct: false, // masked
            }));
          }
          delete snapshot.model_answer_en;
          delete snapshot.model_answer_hi;
          delete snapshot.explanation_en;
          delete snapshot.explanation_hi;

          return {
            ...q,
            question_snapshot: snapshot,
          };
        });
      }
    }

    return rec;
  },

  /**
   * Lists assessments created by a teacher.
   */
  async getAssessmentsByTeacher(
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentRecord[]> {
    const { data, error } = await client
      .from('assessments')
      .select('*, questions:assessment_questions(*)')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch teacher assessments: ${error.message}`);
    }

    return (data || []) as AssessmentRecord[];
  },

  /**
   * Updates a draft assessment.
   * Prohibits mutating questions if attempts exist (Immutability guarantee).
   */
  async updateAssessment(
    id: string,
    rawUpdates: unknown,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentRecord> {
    const validated = AssessmentUpdateSchema.parse(rawUpdates);

    // Verify ownership and check if attempts exist
    const current = await this.getAssessmentById(id, client);
    if (!current) {
      throw new Error('Assessment not found');
    }

    if (current.teacher_id !== teacherId) {
      throw new Error('Unauthorized to update this assessment');
    }

    const { count: attemptCount } = await client
      .from('assessment_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_id', id);

    if (attemptCount && attemptCount > 0 && validated.settings) {
      // Restrict critical setting mutations if attempts exist
      delete (validated.settings as Record<string, unknown>).negative_marking;
      delete (validated.settings as Record<string, unknown>).negative_marks_per_question;
    }

    const { data, error } = await client
      .from('assessments')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, questions:assessment_questions(*)')
      .single();

    if (error) {
      throw new Error(`Failed to update assessment: ${error.message}`);
    }

    return data as AssessmentRecord;
  },

  /**
   * Publishes an assessment, making it assignable.
   */
  async publishAssessment(
    id: string,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentRecord> {
    const current = await this.getAssessmentById(id, client);
    if (!current) {
      throw new Error('Assessment not found');
    }
    if (current.teacher_id !== teacherId) {
      throw new Error('Unauthorized to publish this assessment');
    }

    if (!current.questions || current.questions.length === 0) {
      throw new Error('Cannot publish an assessment with 0 questions');
    }

    const { data, error } = await client
      .from('assessments')
      .update({
        status: 'PUBLISHED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, questions:assessment_questions(*)')
      .single();

    if (error) {
      throw new Error(`Failed to publish assessment: ${error.message}`);
    }

    return data as AssessmentRecord;
  },

  /**
   * Deletes a draft assessment with no attempts.
   */
  async deleteAssessment(
    id: string,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const current = await this.getAssessmentById(id, client);
    if (!current) throw new Error('Assessment not found');
    if (current.teacher_id !== teacherId) throw new Error('Unauthorized');

    const { count } = await client
      .from('assessment_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_id', id);

    if (count && count > 0) {
      throw new Error('Cannot delete assessment that has student attempts. Archive it instead.');
    }

    const { error } = await client.from('assessments').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete assessment: ${error.message}`);
  },

  /**
   * Assigns a published assessment to a class section.
   */
  async assignAssessment(
    rawPayload: unknown,
    teacherId: string,
    schoolId: string | null = null,
    client: SupabaseClient = defaultClient
  ): Promise<AssignmentRecord> {
    const validated = AssignmentCreateSchema.parse(rawPayload);

    // Verify assessment is PUBLISHED
    const assessment = await this.getAssessmentById(validated.assessment_id, client);
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    if (assessment.status !== 'PUBLISHED') {
      throw new Error('Cannot assign an assessment that is not PUBLISHED');
    }

    const { data, error } = await client
      .from('assignments')
      .insert([
        {
          assessment_id: validated.assessment_id,
          class_id: validated.class_id,
          teacher_id: teacherId,
          school_id: schoolId || assessment.school_id,
          available_from: validated.available_from || new Date().toISOString(),
          due_at: validated.due_at || null,
          status: 'ACTIVE',
          settings_override: validated.settings_override || {},
        },
      ])
      .select('*, assessment:assessments(*), class:classes(id, name, section, grade_id)')
      .single();

    if (error) {
      throw new Error(`Failed to assign assessment: ${error.message}`);
    }

    return data as unknown as AssignmentRecord;
  },

  /**
   * Gets assignments assigned to a specific class.
   */
  async getAssignmentsByClass(
    classId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssignmentRecord[]> {
    const { data, error } = await client
      .from('assignments')
      .select('*, assessment:assessments(*)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch class assignments: ${error.message}`);
    }

    return (data || []) as unknown as AssignmentRecord[];
  },

  /**
   * Gets all assignments available to an enrolled student across their classes.
   */
  async getStudentAssignments(
    studentId: string,
    client: SupabaseClient = defaultClient
  ): Promise<
    Array<
      AssignmentRecord & {
        attempt_status: string;
        attempt_id?: string;
        score?: number | null;
        percentage?: number | null;
      }
    >
  > {
    // 1. Get student enrolled class IDs
    const { data: enrollments, error: eError } = await client
      .from('class_students')
      .select('class_id')
      .eq('student_id', studentId)
      .eq('enrollment_status', 'ACTIVE');

    if (eError || !enrollments || enrollments.length === 0) {
      return [];
    }

    const classIds = enrollments.map((e) => e.class_id);

    // 2. Fetch assignments for these classes
    const { data: assignments, error: aError } = await client
      .from('assignments')
      .select('*, assessment:assessments(*), class:classes(id, name, section, grade_id)')
      .in('class_id', classIds)
      .eq('status', 'ACTIVE')
      .order('due_at', { ascending: true });

    if (aError) {
      throw new Error(`Failed to fetch student assignments: ${aError.message}`);
    }

    // 3. Fetch existing attempts for this student
    const assignmentIds = (assignments || []).map((a) => a.id);
    const { data: attempts } = await client
      .from('assessment_attempts')
      .select('*')
      .eq('student_id', studentId)
      .in('assignment_id', assignmentIds);

    const attemptMap = new Map<string, AssessmentAttemptRecord>();
    (attempts || []).forEach((att) => {
      if (att.assignment_id) {
        attemptMap.set(att.assignment_id, att as AssessmentAttemptRecord);
      }
    });

    return (assignments || []).map((asg) => {
      const att = attemptMap.get(asg.id);
      return {
        ...(asg as unknown as AssignmentRecord),
        attempt_status: att ? att.status : 'NOT_STARTED',
        attempt_id: att?.id,
        score: att?.score ?? null,
        percentage: att?.percentage ?? null,
      };
    });
  },

  /**
   * Starts or resumes a student attempt.
   * Enforces max_attempts and timer bounds.
   */
  async startAttempt(
    assessmentId: string,
    assignmentId: string | null,
    studentId: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ attempt: AssessmentAttemptRecord; isNew: boolean }> {
    const assessment = await this.getAssessmentById(assessmentId, client, true);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.status !== 'PUBLISHED') throw new Error('Assessment is not available');

    // Check existing in-progress attempt
    const { data: inProgress } = await client
      .from('assessment_attempts')
      .select('*, answers:attempt_answers(*)')
      .eq('assessment_id', assessmentId)
      .eq('student_id', studentId)
      .eq('status', 'IN_PROGRESS')
      .maybeSingle();

    if (inProgress) {
      // Resume existing attempt
      return {
        attempt: inProgress as AssessmentAttemptRecord,
        isNew: false,
      };
    }

    // Check attempt limits
    const { count: totalAttempts } = await client
      .from('assessment_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_id', assessmentId)
      .eq('student_id', studentId);

    const maxAttempts = assessment.settings.max_attempts || 1;
    const currentAttemptCount = totalAttempts || 0;

    if (currentAttemptCount >= maxAttempts && !assessment.settings.allow_retake) {
      throw new Error(`Maximum attempts (${maxAttempts}) reached for this assessment.`);
    }

    const nextAttemptNumber = currentAttemptCount + 1;

    // Create new attempt
    const { data: newAttempt, error: createError } = await client
      .from('assessment_attempts')
      .insert([
        {
          assessment_id: assessmentId,
          assignment_id: assignmentId || null,
          student_id: studentId,
          attempt_number: nextAttemptNumber,
          total_marks: assessment.total_marks,
          status: 'IN_PROGRESS',
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError || !newAttempt) {
      throw new Error(`Failed to start attempt: ${createError?.message}`);
    }

    // Initialize blank attempt_answers rows for all assessment questions
    if (assessment.questions && assessment.questions.length > 0) {
      const blankAnswers = assessment.questions.map((q) => {
        const maxMarks = q.marks_override ?? q.question_snapshot.marks ?? 1;
        return {
          attempt_id: newAttempt.id,
          assessment_question_id: q.id,
          is_answered: false,
          max_marks: maxMarks,
          grading_status: 'UNGRADED' as const,
        };
      });

      await client.from('attempt_answers').insert(blankAnswers);
    }

    // Fetch complete newly created attempt with answers
    const fullAttempt = await this.getAttemptById(newAttempt.id, studentId, client);
    if (!fullAttempt) throw new Error('Failed to load created attempt');

    return {
      attempt: fullAttempt,
      isNew: true,
    };
  },

  /**
   * Retrieves attempt and current answers.
   */
  async getAttemptById(
    attemptId: string,
    studentId?: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentAttemptRecord | null> {
    let query = client
      .from('assessment_attempts')
      .select('*, answers:attempt_answers(*), assessment:assessments(*, questions:assessment_questions(*))')
      .eq('id', attemptId);

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query.single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch attempt: ${error.message}`);
    }

    const rec = data as unknown as AssessmentAttemptRecord;

    // Mask answers on questions if attempt is still in progress
    if (rec.status === 'IN_PROGRESS' && rec.assessment?.questions) {
      rec.assessment.questions = rec.assessment.questions.map((q) => {
        const snapshot = { ...q.question_snapshot };
        if (snapshot.options) {
          snapshot.options = snapshot.options.map((opt) => ({
            option_key: opt.option_key,
            text_en: opt.text_en,
            text_hi: opt.text_hi,
            is_correct: false,
          }));
        }
        delete snapshot.model_answer_en;
        delete snapshot.model_answer_hi;
        delete snapshot.explanation_en;
        delete snapshot.explanation_hi;

        return { ...q, question_snapshot: snapshot };
      });
    }

    return rec;
  },

  /**
   * Autosaves a single answer during an active attempt.
   */
  async saveAnswer(
    attemptId: string,
    rawAnswer: unknown,
    studentId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AttemptAnswerRecord> {
    const validated = AnswerSaveSchema.parse(rawAnswer);

    // Verify attempt is IN_PROGRESS and belongs to student
    const attempt = await this.getAttemptById(attemptId, studentId, client);
    if (!attempt) throw new Error('Attempt not found');
    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error('Attempt is already finalized; cannot modify answers.');
    }

    // Check timer expiration
    const durationMins = attempt.assessment?.duration_minutes || 30;
    const startedAtMs = new Date(attempt.started_at).getTime();
    const nowMs = Date.now();
    const gracePeriodMs = 60_000; // 1 min grace period for network latency
    const allowedMs = durationMins * 60 * 1000 + gracePeriodMs;

    if (nowMs - startedAtMs > allowedMs) {
      throw new Error('Assessment time limit has expired. Please submit your attempt.');
    }

    const isAnswered = Boolean(validated.selected_option || validated.text_answer?.trim());

    // Upsert into attempt_answers
    const { data, error } = await client
      .from('attempt_answers')
      .upsert(
        [
          {
            attempt_id: attemptId,
            assessment_question_id: validated.assessment_question_id,
            selected_option: validated.selected_option || null,
            text_answer: validated.text_answer || null,
            answer_payload: validated.answer_payload || {},
            is_answered: isAnswered,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'attempt_id,assessment_question_id' }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save answer: ${error.message}`);
    }

    return data as AttemptAnswerRecord;
  },

  /**
   * Batch saves answers (for offline recovery or multi-question autosave).
   */
  async batchSaveAnswers(
    attemptId: string,
    rawPayload: unknown,
    studentId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const validated = BatchAnswersSaveSchema.parse(rawPayload);

    for (const ans of validated.answers) {
      await this.saveAnswer(attemptId, ans, studentId, client);
    }
  },

  /**
   * Authoritative server-side submission & auto-grading.
   * Idempotent: double submits return existing result without duplicate records.
   */
  async submitAttempt(
    attemptId: string,
    studentId: string,
    timeTakenSeconds: number = 0,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentResultRecord> {
    // 1. Check if already submitted / graded (Idempotency)
    const existingResult = await client
      .from('assessment_results')
      .select('*')
      .eq('attempt_id', attemptId)
      .maybeSingle();

    if (existingResult.data) {
      return existingResult.data as AssessmentResultRecord;
    }

    // 2. Fetch full attempt with untruncated assessment snapshot
    const attempt = await this.getAttemptById(attemptId, studentId, client);
    if (!attempt) throw new Error('Attempt not found');
    if (!attempt.assessment) throw new Error('Associated assessment not found');

    const assessment = attempt.assessment;
    const questions = assessment.questions || [];
    const settings = assessment.settings;

    // Fetch saved answers
    const { data: savedAnswers, error: ansError } = await client
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', attemptId);

    if (ansError) {
      throw new Error(`Failed to read attempt answers: ${ansError.message}`);
    }

    const answerMap = new Map<string, AttemptAnswerRecord>();
    (savedAnswers || []).forEach((a) => {
      answerMap.set(a.assessment_question_id, a as AttemptAnswerRecord);
    });

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let allAutoGraded = true;

    const questionBreakdown: QuestionBreakdownItem[] = [];
    const answerUpdates: Array<{
      id: string;
      marks_awarded: number;
      is_correct: boolean;
      grading_status: 'AUTO_GRADED' | 'MANUAL_REVIEW';
    }> = [];

    // 3. Grade each question
    for (const q of questions) {
      const ans = answerMap.get(q.id);
      const snapshot = q.question_snapshot;
      const maxMarks = q.marks_override ?? snapshot.marks ?? 1;
      const qType = snapshot.question_type || 'MCQ';

      let marksAwarded = 0;
      let isCorrect = false;
      let gradingStatus: 'AUTO_GRADED' | 'MANUAL_REVIEW' = 'AUTO_GRADED';
      let correctOptionKey: string | null = null;

      if (qType === 'MCQ') {
        // Find correct option from snapshot
        const correctOpt = snapshot.options?.find((o) => o.is_correct);
        correctOptionKey = correctOpt?.option_key || 'A';

        if (!ans || !ans.is_answered || !ans.selected_option) {
          unansweredCount++;
          marksAwarded = 0;
          isCorrect = false;
        } else if (ans.selected_option === correctOptionKey) {
          correctCount++;
          isCorrect = true;
          marksAwarded = maxMarks;
          totalScore += marksAwarded;
        } else {
          incorrectCount++;
          isCorrect = false;
          if (settings.negative_marking) {
            const deduction = settings.negative_marks_per_question || 0;
            marksAwarded = -deduction;
            totalScore += marksAwarded;
          } else {
            marksAwarded = 0;
          }
        }
      } else {
        // Descriptive / Short / Long answer
        allAutoGraded = false;
        gradingStatus = 'MANUAL_REVIEW';
        if (!ans || !ans.is_answered) {
          unansweredCount++;
          marksAwarded = 0;
          isCorrect = false;
        } else {
          // Awaiting teacher evaluation
          marksAwarded = 0;
        }
      }

      if (ans) {
        answerUpdates.push({
          id: ans.id,
          marks_awarded: marksAwarded,
          is_correct: isCorrect,
          grading_status: gradingStatus,
        });
      }

      questionBreakdown.push({
        question_order: q.question_order,
        question_id: q.id,
        question_type: qType,
        section: q.section,
        max_marks: maxMarks,
        marks_awarded: marksAwarded,
        selected_option: ans?.selected_option || null,
        correct_option: correctOptionKey,
        is_correct: isCorrect,
        grading_status: gradingStatus,
        text_en: snapshot.text_en,
        explanation_en: snapshot.explanation_en,
      });
    }

    // Ensure score does not dip below 0
    totalScore = Math.max(0, totalScore);
    const totalMarks = assessment.total_marks || 1;
    const percentage = Number(((totalScore / totalMarks) * 100).toFixed(2));
    const isPassed =
      assessment.passing_marks != null
        ? totalScore >= assessment.passing_marks
        : percentage >= 40;

    // Check if late
    let submissionType: 'ON_TIME' | 'LATE' = 'ON_TIME';
    if (assessment.due_at && new Date() > new Date(assessment.due_at)) {
      submissionType = 'LATE';
    }

    // 4. Update attempt_answers in database
    for (const u of answerUpdates) {
      await client
        .from('attempt_answers')
        .update({
          marks_awarded: u.marks_awarded,
          is_correct: u.is_correct,
          grading_status: u.grading_status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', u.id);
    }

    // 5. Update assessment_attempts
    const finalAttemptStatus = allAutoGraded ? 'GRADED' : 'SUBMITTED';
    const finalTimeTaken = timeTakenSeconds > 0 ? timeTakenSeconds : attempt.time_taken_seconds || 60;

    const { error: attUpdateErr } = await client
      .from('assessment_attempts')
      .update({
        status: finalAttemptStatus,
        score: totalScore,
        percentage: percentage,
        submitted_at: new Date().toISOString(),
        time_taken_seconds: finalTimeTaken,
        updated_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    if (attUpdateErr) {
      throw new Error(`Failed to update attempt status: ${attUpdateErr.message}`);
    }

    // 6. Create assessment_results
    const { data: result, error: rError } = await client
      .from('assessment_results')
      .insert([
        {
          attempt_id: attemptId,
          assessment_id: assessment.id,
          student_id: studentId,
          total_marks: totalMarks,
          marks_obtained: totalScore,
          percentage: percentage,
          correct_answers: correctCount,
          incorrect_answers: incorrectCount,
          unanswered: unansweredCount,
          time_taken_seconds: finalTimeTaken,
          is_passed: isPassed,
          submission_type: submissionType,
          question_breakdown: questionBreakdown,
        },
      ])
      .select()
      .single();

    if (rError || !result) {
      throw new Error(`Failed to generate assessment result: ${rError?.message}`);
    }

    // 7. Deterministic Mastery Calculation Hook (Phase 5)
    try {
      await masteryService.recomputeForStudent(
        studentId,
        { sourceAssessmentId: assessment.id, sourceAttemptId: attemptId },
        client
      );
    } catch (masteryErr) {
      // Non-blocking: preserve successful attempt submission
      console.error('Non-blocking error computing student mastery:', masteryErr);
    }

    return result as AssessmentResultRecord;
  },

  /**
   * Retrieves student result by attempt ID.
   * If teacher disabled `show_result_after_submission`, masks correct answers and explanations.
   */
  async getStudentResult(
    attemptId: string,
    studentId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentResultRecord | null> {
    const { data, error } = await client
      .from('assessment_results')
      .select('*, assessment:assessments(*)')
      .eq('attempt_id', attemptId)
      .eq('student_id', studentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch result: ${error.message}`);
    }

    const rec = data as unknown as AssessmentResultRecord & {
      assessment?: AssessmentRecord;
    };

    const showResult = rec.assessment?.settings.show_result_after_submission ?? true;

    if (!showResult && rec.assessment?.status !== 'CLOSED') {
      // Mask question breakdown answers
      rec.question_breakdown = rec.question_breakdown.map((q) => ({
        ...q,
        correct_option: null,
        explanation_en: undefined,
      }));
    }

    return rec;
  },

  /**
   * Retrieves aggregated analytics for an assessment for the teacher dashboard.
   */
  async getAssessmentResults(
    assessmentId: string,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentAnalytics> {
    const assessment = await this.getAssessmentById(assessmentId, client);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.teacher_id !== teacherId) throw new Error('Unauthorized');

    // Fetch all attempts and results
    const { data: results, error: rErr } = await client
      .from('assessment_results')
      .select('*, student:profiles!student_id(id, full_name, email)')
      .eq('assessment_id', assessmentId);

    if (rErr) {
      throw new Error(`Failed to fetch results: ${rErr.message}`);
    }

    const resList = (results || []) as unknown as AssessmentResultRecord[];
    const totalSubmitted = resList.length;

    let totalScoreSum = 0;
    let highestScore = 0;
    let lowestScore = totalSubmitted > 0 ? 1000 : 0;
    let passCount = 0;

    resList.forEach((r) => {
      totalScoreSum += r.marks_obtained;
      if (r.marks_obtained > highestScore) highestScore = r.marks_obtained;
      if (r.marks_obtained < lowestScore) lowestScore = r.marks_obtained;
      if (r.is_passed) passCount++;
    });

    if (totalSubmitted === 0) lowestScore = 0;

    const averageScore = totalSubmitted > 0 ? Number((totalScoreSum / totalSubmitted).toFixed(2)) : 0;
    const averagePercentage =
      totalSubmitted > 0 && assessment.total_marks > 0
        ? Number(((averageScore / assessment.total_marks) * 100).toFixed(2))
        : 0;
    const passRate = totalSubmitted > 0 ? Number(((passCount / totalSubmitted) * 100).toFixed(2)) : 0;

    // Build question analytics
    const questions = assessment.questions || [];
    const qAnalytics = questions.map((q) => {
      let attempted = 0;
      let correct = 0;
      let incorrect = 0;

      resList.forEach((r) => {
        const item = r.question_breakdown.find((qb) => qb.question_order === q.question_order);
        if (item) {
          if (item.selected_option) attempted++;
          if (item.is_correct) correct++;
          else if (item.selected_option) incorrect++;
        }
      });

      const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
      let diffSignal: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      if (attempted >= 3) {
        if (accuracy < 40) diffSignal = 'HIGH';
        else if (accuracy < 70) diffSignal = 'MEDIUM';
      }

      return {
        question_order: q.question_order,
        question_text: q.question_snapshot.text_en,
        question_type: q.question_snapshot.question_type,
        section: q.section,
        max_marks: q.marks_override ?? q.question_snapshot.marks ?? 1,
        attempted_count: attempted,
        correct_count: correct,
        incorrect_count: incorrect,
        accuracy_percentage: accuracy,
        difficulty_signal: diffSignal,
      };
    });

    const studentsBreakdown = resList.map((r) => ({
      student_id: r.student_id,
      student_name: r.student?.full_name || 'Student',
      status: 'SUBMITTED',
      score: r.marks_obtained,
      percentage: r.percentage,
      time_taken_seconds: r.time_taken_seconds,
      submitted_at: r.created_at,
      submission_type: r.submission_type,
    }));

    return {
      assessment_id: assessment.id,
      title: assessment.title,
      total_students: totalSubmitted,
      total_attempts: totalSubmitted,
      total_submitted: totalSubmitted,
      average_score: averageScore,
      average_percentage: averagePercentage,
      highest_score: highestScore,
      lowest_score: lowestScore,
      pass_rate_percentage: passRate,
      students_breakdown: studentsBreakdown,
      questions_analytics: qAnalytics,
    };
  },

  /**
   * Converts a Phase 2 AI-generated resource (Quiz, Test Paper, Worksheet) into a Draft Assessment.
   */
  async convertAIResourceToAssessment(
    resourceId: string,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AssessmentRecord> {
    const { data: resource, error: rErr } = await client
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (rErr || !resource) {
      throw new Error(`AI Resource not found: ${rErr?.message}`);
    }

    const metadata = (resource.metadata || {}) as Record<string, unknown>;
    const generatedContent = (metadata.generated_content || {}) as Record<string, unknown>;
    const resType = resource.resource_type;

    let assessmentType: 'MCQ_QUIZ' | 'TEST_PAPER' | 'WORKSHEET' = 'MCQ_QUIZ';
    const questionsPayload: Array<{
      question_order: number;
      section: string;
      marks_override: number;
      question_snapshot: QuestionSnapshot;
    }> = [];

    if (resType === 'QUIZ' || generatedContent.questions) {
      assessmentType = 'MCQ_QUIZ';
      const rawQuestions = (generatedContent.questions as Array<Record<string, unknown>>) || [];

      rawQuestions.forEach((q, idx) => {
        const rawOptions = (q.options as Array<Record<string, unknown>>) || [];
        const options = rawOptions.map((opt) => ({
          option_key: (opt.id || opt.key || 'A') as 'A' | 'B' | 'C' | 'D',
          text_en: String(opt.text || opt.text_en || ''),
          text_hi: String(opt.text_hi || ''),
          is_correct: Boolean(opt.is_correct || opt.id === q.correct_option_id),
        }));

        questionsPayload.push({
          question_order: idx + 1,
          section: 'SECTION_A',
          marks_override: 1,
          question_snapshot: {
            text_en: String(q.question || q.text_en || `Question ${idx + 1}`),
            text_hi: String(q.text_hi || ''),
            question_type: 'MCQ',
            marks: 1,
            difficulty: String(q.difficulty || 'MEDIUM').toUpperCase(),
            bloom_level: 'UNDERSTAND',
            options,
            explanation_en: String(q.explanation || ''),
            source: 'TeacherSathi AI Engine',
            tags: ['AI_GENERATED'],
          },
        });
      });
    }

    const payload = {
      school_id: resource.school_id || null,
      title: `${resource.title} (Assessment Draft)`,
      description: resource.description || 'Draft assessment created from AI generation.',
      assessment_type: assessmentType,
      grade_id: String(metadata.grade || 'class-8'),
      subject_id: String(metadata.subject || 'science').toLowerCase(),
      chapter_id: resource.chapter_id || null,
      language: (metadata.language as 'en' | 'hi' | 'bilingual') || 'en',
      duration_minutes: Number(metadata.duration_mins) || 30,
      total_marks: questionsPayload.length || 10,
      instructions: ['Read every question carefully before selecting an answer.'],
      settings: {
        shuffle_questions: false,
        shuffle_options: false,
        show_result_after_submission: true,
        allow_retake: false,
        max_attempts: 1,
        negative_marking: false,
        negative_marks_per_question: 0,
      },
      questions: questionsPayload,
    };

    return this.createAssessment(payload, teacherId, client);
  },
};
