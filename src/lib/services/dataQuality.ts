import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import { DataQualityReport } from '@/lib/validations/analytics';

export interface DataQualityIssue {
  type: 'UNMAPPED_QUESTION' | 'INVALID_CHAPTER' | 'ORPHANED_ANSWER' | 'ORPHANED_RESULT';
  entityId: string;
  description: string;
  severity: 'WARNING' | 'ERROR';
}

export interface DetailedDataQualityScan {
  report: DataQualityReport;
  issues: DataQualityIssue[];
}

export const dataQualityService = {
  /**
   * Scans canonical curriculum, question banks, and student assessment tables
   * to identify data-quality anomalies, unmapped items, and orphaned records.
   */
  async scanDataQuality(client: SupabaseClient = defaultClient): Promise<DetailedDataQualityScan> {
    const issues: DataQualityIssue[] = [];

    // 1. Total questions and unmapped questions (missing concept_id)
    const { data: questions, count: totalQuestionsCount } = await client
      .from('questions')
      .select('id, question_text, concept_id, chapter_id', { count: 'exact' });

    const totalQuestions = totalQuestionsCount || 0;
    const questionsList = questions || [];

    let unmappedQuestionsCount = 0;
    let questionsWithMissingChapter = 0;

    questionsList.forEach((q) => {
      if (!q.concept_id) {
        unmappedQuestionsCount++;
        issues.push({
          type: 'UNMAPPED_QUESTION',
          entityId: q.id,
          description: `Question "${(q.question_text || '').slice(0, 50)}..." is missing a canonical concept mapping.`,
          severity: 'WARNING',
        });
      }
      if (!q.chapter_id) {
        questionsWithMissingChapter++;
        issues.push({
          type: 'INVALID_CHAPTER',
          entityId: q.id,
          description: `Question "${(q.question_text || '').slice(0, 50)}..." has no chapter_id associated.`,
          severity: 'ERROR',
        });
      }
    });

    // 2. Orphaned answers (attempt_answers where attempt_id does not exist)
    const { data: orphanedAnswers, count: orphanedAnsCount } = await client
      .from('attempt_answers')
      .select('id, attempt_id', { count: 'exact' })
      .is('attempt_id', null);

    const orphanedAnswersCount = orphanedAnsCount || orphanedAnswers?.length || 0;
    if (orphanedAnswersCount > 0) {
      issues.push({
        type: 'ORPHANED_ANSWER',
        entityId: 'orphaned_answers_batch',
        description: `Found ${orphanedAnswersCount} answer records detached from an active attempt.`,
        severity: 'ERROR',
      });
    }

    // 3. Orphaned results (assessment_results where assessment_id or student_id is null)
    const { data: orphanedResults, count: orphanedResCount } = await client
      .from('assessment_results')
      .select('id', { count: 'exact' })
      .or('assessment_id.is.null,student_id.is.null');

    const orphanedResultsCount = orphanedResCount || orphanedResults?.length || 0;
    if (orphanedResultsCount > 0) {
      issues.push({
        type: 'ORPHANED_RESULT',
        entityId: 'orphaned_results_batch',
        description: `Found ${orphanedResultsCount} result records with missing assessment or student relationship.`,
        severity: 'ERROR',
      });
    }

    // 4. Calculate healthy questions percentage
    const healthyCount = Math.max(0, totalQuestions - unmappedQuestionsCount - questionsWithMissingChapter);
    const healthyPercentage = totalQuestions > 0
      ? Number(((healthyCount / totalQuestions) * 100).toFixed(1))
      : 100;

    const report: DataQualityReport = {
      totalQuestions,
      unmappedQuestionsCount,
      questionsWithMissingChapter,
      orphanedAnswersCount,
      orphanedResultsCount,
      healthyQuestionsPercentage: healthyPercentage,
      scannedAt: new Date().toISOString(),
    };

    return {
      report,
      issues,
    };
  },
};
