import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import {
  EvidenceConfidence,
  MasteryStatus,
  GapSeverity,
  ObservedDifficultyTier,
} from '@/lib/validations/analytics';

// =============================================================================
// PURE DETERMINISTIC CALCULATION FUNCTIONS (100% TESTABLE OFFLINE)
// =============================================================================

export interface ConceptEvidenceResponse {
  is_correct: boolean | null;
  marks_awarded?: number | null;
  max_marks?: number | null;
  answered_at: string;
}

export interface ComputedMasteryResult {
  masteryScore: number;
  recentAccuracy: number;
  historicalAccuracy: number;
  confidenceLevel: EvidenceConfidence;
  status: MasteryStatus;
  evidenceCount: number;
  correctCount: number;
  incorrectCount: number;
  explanation: string;
}

/**
 * Calculates empirical observed difficulty based on real student performance.
 * Does NOT alter original teacher-declared difficulty.
 */
export function calculateObservedDifficulty(
  attemptCount: number,
  correctCount: number
): ObservedDifficultyTier {
  if (attemptCount === 0) return 'INSUFFICIENT_DATA';
  const accuracy = (correctCount / attemptCount) * 100;
  if (accuracy >= 85) return 'EASY';
  if (accuracy >= 70) return 'MODERATE';
  if (accuracy >= 50) return 'DIFFICULT';
  return 'VERY_DIFFICULT';
}

/**
 * Evaluates evidence confidence tier based on accumulated response volume.
 */
export function classifyConfidence(evidenceCount: number): EvidenceConfidence {
  if (evidenceCount === 0) return 'INSUFFICIENT_EVIDENCE';
  if (evidenceCount <= 2) return 'LOW';
  if (evidenceCount <= 5) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Classifies concept mastery status from deterministic mastery score and evidence count.
 */
export function classifyMasteryStatus(
  masteryScore: number,
  evidenceCount: number
): MasteryStatus {
  if (evidenceCount === 0) return 'INSUFFICIENT_EVIDENCE';
  if (masteryScore < 40) return 'CRITICAL';
  if (masteryScore < 60) return 'DEVELOPING';
  if (masteryScore < 75) return 'APPROACHING';
  if (masteryScore < 90) return 'PROFICIENT';
  return 'STRONG';
}

/**
 * Classifies learning gap severity tier from mastery score.
 */
export function classifyGapSeverity(masteryScore: number): GapSeverity {
  if (masteryScore < 40) return 'CRITICAL';
  if (masteryScore < 60) return 'HIGH';
  if (masteryScore < 75) return 'MODERATE';
  return 'ON_TRACK';
}

/**
 * Core explainable deterministic mastery formula.
 * Combines recent evidence with historical evidence using a 65/35 weighted model.
 */
export function computeConceptMasteryScore(
  responses: ConceptEvidenceResponse[]
): ComputedMasteryResult {
  // Filter only answered responses
  const answered = responses.filter((r) => r.is_correct !== null);
  const evidenceCount = answered.length;

  if (evidenceCount === 0) {
    return {
      masteryScore: 0,
      recentAccuracy: 0,
      historicalAccuracy: 0,
      confidenceLevel: 'INSUFFICIENT_EVIDENCE',
      status: 'INSUFFICIENT_EVIDENCE',
      evidenceCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      explanation: 'No assessment evidence recorded for this concept yet.',
    };
  }

  // Chronological sort: oldest to newest
  const sorted = [...answered].sort(
    (a, b) => new Date(a.answered_at).getTime() - new Date(b.answered_at).getTime()
  );

  const correctCount = sorted.filter((r) => r.is_correct === true).length;
  const incorrectCount = sorted.filter((r) => r.is_correct === false).length;

  if (evidenceCount <= 2) {
    const accuracy = (correctCount / evidenceCount) * 100;
    const roundedAcc = Number(accuracy.toFixed(2));
    const status = classifyMasteryStatus(roundedAcc, evidenceCount);
    return {
      masteryScore: roundedAcc,
      recentAccuracy: roundedAcc,
      historicalAccuracy: roundedAcc,
      confidenceLevel: 'LOW',
      status,
      evidenceCount,
      correctCount,
      incorrectCount,
      explanation: `Based on ${evidenceCount} response(s): ${correctCount} correct, ${incorrectCount} incorrect (${Math.round(roundedAcc)}%). Low confidence due to limited sample size.`,
    };
  }

  // Split into recent window and historical window
  // Recent window: last min(5, ceil(N / 2)) responses
  const recentWindowSize = Math.min(5, Math.ceil(evidenceCount / 2));
  const recentSlice = sorted.slice(sorted.length - recentWindowSize);
  const historicalSlice = sorted.slice(0, sorted.length - recentWindowSize);

  const recentCorrect = recentSlice.filter((r) => r.is_correct === true).length;
  const recentAccuracy = (recentCorrect / recentSlice.length) * 100;

  let historicalAccuracy = recentAccuracy;
  if (historicalSlice.length > 0) {
    const histCorrect = historicalSlice.filter((r) => r.is_correct === true).length;
    historicalAccuracy = (histCorrect / historicalSlice.length) * 100;
  }

  // 65% weight on recent evidence, 35% on historical baseline
  const weightedScore = historicalSlice.length > 0
    ? (0.65 * recentAccuracy) + (0.35 * historicalAccuracy)
    : recentAccuracy;

  const finalScore = Number(Math.max(0, Math.min(100, weightedScore)).toFixed(2));
  const confidenceLevel = classifyConfidence(evidenceCount);
  const status = classifyMasteryStatus(finalScore, evidenceCount);

  const explanation = `Based on ${evidenceCount} responses across assessments: ${correctCount} correct, ${incorrectCount} incorrect. Recent accuracy: ${Math.round(recentAccuracy)}%, historical accuracy: ${Math.round(historicalAccuracy)}%. Computed mastery: ${Math.round(finalScore)}% (${status}).`;

  return {
    masteryScore: finalScore,
    recentAccuracy: Number(recentAccuracy.toFixed(2)),
    historicalAccuracy: Number(historicalAccuracy.toFixed(2)),
    confidenceLevel,
    status,
    evidenceCount,
    correctCount,
    incorrectCount,
    explanation,
  };
}

// =============================================================================
// MASTERY SERVICE (SUPABASE PERSISTENCE & ORCHESTRATION)
// =============================================================================

export interface StudentMasterySyncResult {
  studentId: string;
  conceptsEvaluated: number;
  gapsDetected: number;
  gapsResolved: number;
  unmappedQuestionsCount: number;
}

export const masteryService = {
  /**
   * Authoritative deterministic recalculation of all concept masteries for a student.
   * Pulls raw attempt_answers and generates materialized state in student_concept_mastery,
   * concept_mastery_history, and learning_gaps.
   */
  async recomputeForStudent(
    studentId: string,
    options: { sourceAssessmentId?: string; sourceAttemptId?: string } = {},
    client: SupabaseClient = defaultClient
  ): Promise<StudentMasterySyncResult> {
    // 1. Fetch student school_id and grade
    const { data: profile } = await client
      .from('profiles')
      .select('id, school_id')
      .eq('id', studentId)
      .single();

    const schoolId = profile?.school_id || null;

    // 2. Fetch all student's answers from finalized attempts
    const { data: attempts, error: attError } = await client
      .from('assessment_attempts')
      .select('id, assessment_id, status, started_at, submitted_at')
      .eq('student_id', studentId)
      .in('status', ['SUBMITTED', 'GRADED']);

    if (attError || !attempts || attempts.length === 0) {
      return {
        studentId,
        conceptsEvaluated: 0,
        gapsDetected: 0,
        gapsResolved: 0,
        unmappedQuestionsCount: 0,
      };
    }

    const attemptIds = attempts.map((a) => a.id);
    const assessmentIds = Array.from(new Set(attempts.map((a) => a.assessment_id)));

    // Fetch assessments metadata (grade, subject, chapter, concept)
    const { data: assessmentsList } = await client
      .from('assessments')
      .select('id, grade_id, subject_id, chapter_id, concept_id')
      .in('id', assessmentIds);

    const assessmentMap = new Map<string, { grade_id: string; subject_id: string; chapter_id: string | null; concept_id: string | null }>();
    (assessmentsList || []).forEach((a) => assessmentMap.set(a.id, a));

    // Fetch answers with question snapshots
    const { data: answers, error: ansError } = await client
      .from('attempt_answers')
      .select(`
        id,
        attempt_id,
        assessment_question_id,
        is_answered,
        is_correct,
        marks_awarded,
        max_marks,
        answered_at,
        assessment_question:assessment_questions(
          id,
          question_id,
          question_snapshot
        )
      `)
      .in('attempt_id', attemptIds)
      .eq('is_answered', true);

    if (ansError || !answers) {
      throw new Error(`Failed to load student attempt answers: ${ansError?.message}`);
    }

    // 3. Map question answers to concept_id
    // Question-to-Concept rule: Must have a valid concept. Unmapped questions are strictly excluded.
    const conceptEvidenceMap = new Map<string, ConceptEvidenceResponse[]>();
    const conceptMetadataMap = new Map<string, { chapterId: string; subjectId: string; gradeId: string }>();
    let unmappedQuestionsCount = 0;

    // Collect question IDs to batch query canonical concepts if snapshot lacks it
    const questionIdsToFetch = new Set<string>();
    answers.forEach((ans) => {
      const aq = Array.isArray(ans.assessment_question) ? ans.assessment_question[0] : ans.assessment_question;
      if (aq?.question_id) questionIdsToFetch.add(aq.question_id);
    });

    const canonicalQuestionsMap = new Map<string, { concept_id: string | null; chapter_id: string | null }>();
    if (questionIdsToFetch.size > 0) {
      const { data: canonicalQuestions } = await client
        .from('questions')
        .select('id, concept_id, chapter_id')
        .in('id', Array.from(questionIdsToFetch));

      (canonicalQuestions || []).forEach((q) => canonicalQuestionsMap.set(q.id, q));
    }

    // Fetch concepts for chapters/metadata
    const { data: allConcepts } = await client
      .from('concepts')
      .select('id, chapter_id, chapter:chapters(id, book:books(grade_id, subject_id))');

    const conceptHierarchyMap = new Map<string, { chapterId: string; subjectId: string; gradeId: string }>();
    (allConcepts || []).forEach((c) => {
      const ch = Array.isArray(c.chapter) ? c.chapter[0] : c.chapter;
      const bk = ch && (Array.isArray(ch.book) ? ch.book[0] : ch.book);
      conceptHierarchyMap.set(c.id, {
        chapterId: c.chapter_id,
        subjectId: bk?.subject_id || 'science',
        gradeId: bk?.grade_id || 'class-10',
      });
    });

    for (const ans of answers) {
      const aq = Array.isArray(ans.assessment_question) ? ans.assessment_question[0] : ans.assessment_question;
      const snapshot = aq?.question_snapshot as Record<string, unknown> | undefined;

      // Check hierarchy: snapshot concept -> canonical question concept -> assessment concept
      let conceptId: string | null = (snapshot?.concept_id as string) || null;

      if (!conceptId && aq?.question_id) {
        conceptId = canonicalQuestionsMap.get(aq.question_id)?.concept_id || null;
      }

      if (!conceptId) {
        const attempt = attempts.find((a) => a.id === ans.attempt_id);
        if (attempt) {
          const asst = assessmentMap.get(attempt.assessment_id);
          if (asst?.concept_id) conceptId = asst.concept_id;
        }
      }

      if (!conceptId) {
        // Critical requirement (Section 33): Exclude unmapped questions
        unmappedQuestionsCount++;
        continue;
      }

      const hierarchy = conceptHierarchyMap.get(conceptId);
      const attempt = attempts.find((a) => a.id === ans.attempt_id);
      const asst = attempt ? assessmentMap.get(attempt.assessment_id) : null;

      const chapterId = hierarchy?.chapterId || asst?.chapter_id || '00000000-0000-0000-0000-000000000000';
      const subjectId = hierarchy?.subjectId || asst?.subject_id || 'science';
      const gradeId = hierarchy?.gradeId || asst?.grade_id || 'class-10';

      if (!conceptEvidenceMap.has(conceptId)) {
        conceptEvidenceMap.set(conceptId, []);
        conceptMetadataMap.set(conceptId, { chapterId, subjectId, gradeId });
      }

      conceptEvidenceMap.get(conceptId)!.push({
        is_correct: ans.is_correct,
        marks_awarded: ans.marks_awarded,
        max_marks: ans.max_marks,
        answered_at: ans.answered_at,
      });
    }

    let gapsDetected = 0;
    let gapsResolved = 0;
    const nowIso = new Date().toISOString();

    // 4. Calculate deterministic mastery for each concept
    for (const [conceptId, evidenceList] of Array.from(conceptEvidenceMap.entries())) {
      const computed = computeConceptMasteryScore(evidenceList);
      const meta = conceptMetadataMap.get(conceptId)!;

      const lastAssessedAt = evidenceList.reduce((latest: string, curr: ConceptEvidenceResponse) => {
        return new Date(curr.answered_at) > new Date(latest) ? curr.answered_at : latest;
      }, evidenceList[0].answered_at);

      // Upsert into student_concept_mastery
      await client
        .from('student_concept_mastery')
        .upsert(
          [
            {
              student_id: studentId,
              concept_id: conceptId,
              chapter_id: meta.chapterId,
              subject_id: meta.subjectId,
              grade_id: meta.gradeId,
              school_id: schoolId,
              mastery_score: computed.masteryScore,
              confidence_level: computed.confidenceLevel,
              evidence_count: computed.evidenceCount,
              correct_count: computed.correctCount,
              incorrect_count: computed.incorrectCount,
              unanswered_count: 0,
              recent_accuracy: computed.recentAccuracy,
              historical_accuracy: computed.historicalAccuracy,
              status: computed.status,
              last_assessed_at: lastAssessedAt,
              updated_at: nowIso,
            },
          ],
          { onConflict: 'student_id,concept_id' }
        );

      // Append into concept_mastery_history
      await client.from('concept_mastery_history').insert([
        {
          student_id: studentId,
          concept_id: conceptId,
          mastery_score: computed.masteryScore,
          confidence_level: computed.confidenceLevel,
          evidence_count: computed.evidenceCount,
          source_assessment_id: options.sourceAssessmentId || null,
          source_attempt_id: options.sourceAttemptId || null,
          calculated_at: nowIso,
        },
      ]);

      // 5. Learning Gap Detection (Section 15, 16)
      // Rule: IF mastery < 60% AND evidence >= 3 -> OPEN or IMPROVING
      const { data: existingGap } = await client
        .from('learning_gaps')
        .select('id, status, mastery_score')
        .eq('student_id', studentId)
        .eq('concept_id', conceptId)
        .maybeSingle();

      if (computed.evidenceCount >= 3 && computed.masteryScore < 60) {
        gapsDetected++;
        const severity = classifyGapSeverity(computed.masteryScore);
        const action = `Review concept with targeted 15-minute remediation activity and 5-question practice reassessment.`;
        
        // If gap was in remediation and student improved, mark IMPROVING
        let gapStatus: 'OPEN' | 'IMPROVING' = 'OPEN';
        if (existingGap && existingGap.status === 'IN_REMEDIATION' && computed.masteryScore > Number(existingGap.mastery_score)) {
          gapStatus = 'IMPROVING';
        }

        await client
          .from('learning_gaps')
          .upsert(
            [
              {
                student_id: studentId,
                concept_id: conceptId,
                chapter_id: meta.chapterId,
                subject_id: meta.subjectId,
                grade_id: meta.gradeId,
                school_id: schoolId,
                severity,
                mastery_score: computed.masteryScore,
                confidence_level: computed.confidenceLevel,
                evidence_count: computed.evidenceCount,
                status: gapStatus,
                recommended_action: action,
                updated_at: nowIso,
              },
            ],
            { onConflict: 'student_id,concept_id' }
          );
      } else if (computed.masteryScore >= 75) {
        // Gap resolved if student achieves proficient (>=75%) or strong (>=90%)
        if (existingGap && existingGap.status !== 'RESOLVED') {
          gapsResolved++;
          await client
            .from('learning_gaps')
            .update({
              status: 'RESOLVED',
              severity: 'ON_TRACK',
              mastery_score: computed.masteryScore,
              confidence_level: computed.confidenceLevel,
              evidence_count: computed.evidenceCount,
              resolved_at: nowIso,
              updated_at: nowIso,
            })
            .eq('id', existingGap.id);
        }
      } else if (computed.masteryScore >= 60 && computed.masteryScore < 75) {
        // Approaching proficiency (60-74%) -> Transition active gap to IMPROVING
        if (existingGap && existingGap.status !== 'RESOLVED') {
          await client
            .from('learning_gaps')
            .update({
              status: 'IMPROVING',
              severity: 'MODERATE',
              mastery_score: computed.masteryScore,
              confidence_level: computed.confidenceLevel,
              evidence_count: computed.evidenceCount,
              recommended_action: 'Approaching proficiency. Complete one more practice check to resolve this gap.',
              updated_at: nowIso,
            })
            .eq('id', existingGap.id);
        }
      }
    }

    return {
      studentId,
      conceptsEvaluated: conceptEvidenceMap.size,
      gapsDetected,
      gapsResolved,
      unmappedQuestionsCount,
    };
  },

  /**
   * Recomputes analytics for all students in a class, and updates question metrics.
   */
  async recomputeForClass(
    classId: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ studentsProcessed: number; totalGapsDetected: number }> {
    const { data: enrollments, error } = await client
      .from('class_students')
      .select('student_id')
      .eq('class_id', classId)
      .eq('enrollment_status', 'ACTIVE');

    if (error || !enrollments || enrollments.length === 0) {
      return { studentsProcessed: 0, totalGapsDetected: 0 };
    }

    let totalGaps = 0;
    for (const e of enrollments) {
      const res = await this.recomputeForStudent(e.student_id, {}, client);
      totalGaps += res.gapsDetected;
    }

    return {
      studentsProcessed: enrollments.length,
      totalGapsDetected: totalGaps,
    };
  },

  /**
   * Recalculates empirical observed difficulty for a question based on all attempt answers.
   */
  async updateQuestionObservedDifficulty(
    questionId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const { data: question } = await client
      .from('questions')
      .select('id, difficulty')
      .eq('id', questionId)
      .maybeSingle();

    if (!question) return;

    // Count attempts and correct answers from attempt_answers linked to this question
    const { data: linkedAssessmentQuestions } = await client
      .from('assessment_questions')
      .select('id')
      .eq('question_id', questionId);

    if (!linkedAssessmentQuestions || linkedAssessmentQuestions.length === 0) {
      return;
    }

    const aqIds = linkedAssessmentQuestions.map((aq) => aq.id);

    const { data: answers } = await client
      .from('attempt_answers')
      .select('is_correct')
      .in('assessment_question_id', aqIds)
      .eq('is_answered', true);

    const attemptCount = answers?.length || 0;
    const correctCount = answers?.filter((a) => a.is_correct === true).length || 0;
    const incorrectCount = attemptCount - correctCount;
    const accuracyRate = attemptCount > 0 ? Number(((correctCount / attemptCount) * 100).toFixed(2)) : 0;

    const observedDifficulty = calculateObservedDifficulty(attemptCount, correctCount);

    await client.from('question_metrics').upsert(
      [
        {
          question_id: questionId,
          attempt_count: attemptCount,
          correct_count: correctCount,
          incorrect_count: incorrectCount,
          accuracy_rate: accuracyRate,
          declared_difficulty: question.difficulty || 'MEDIUM',
          observed_difficulty: observedDifficulty,
          last_calculated_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'question_id' }
    );
  },
};
