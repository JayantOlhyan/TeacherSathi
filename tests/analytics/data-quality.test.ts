import { describe, it, expect, vi } from 'vitest';
import { DataQualityReportSchema } from '../../src/lib/validations/analytics';
import { dataQualityService } from '../../src/lib/services/dataQuality';

describe('Phase 6 Data Quality & Curriculum Audit Service', () => {
  describe('Schema Validation', () => {
    it('Validates a compliant DataQualityReport payload', () => {
      const report = {
        totalQuestions: 150,
        unmappedQuestionsCount: 12,
        questionsWithMissingChapter: 3,
        orphanedAnswersCount: 0,
        orphanedResultsCount: 0,
        healthyQuestionsPercentage: 90.0,
        scannedAt: new Date().toISOString(),
      };

      const parsed = DataQualityReportSchema.safeParse(report);
      expect(parsed.success).toBe(true);
    });

    it('Rejects negative counts or percentages out of range [0, 100]', () => {
      const invalidReport = {
        totalQuestions: -5,
        unmappedQuestionsCount: 0,
        questionsWithMissingChapter: 0,
        orphanedAnswersCount: 0,
        orphanedResultsCount: 0,
        healthyQuestionsPercentage: 110.5,
        scannedAt: new Date().toISOString(),
      };

      const parsed = DataQualityReportSchema.safeParse(invalidReport);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Audit Scanning Logic', () => {
    it('Reports 100% health when all questions are mapped and no orphaned records exist', async () => {
      const mockQuestions = [
        { id: 'q1', question_text: 'What is photosynthesis?', concept_id: 'c1', chapter_id: 'ch1' },
        { id: 'q2', question_text: 'Define transpiration.', concept_id: 'c2', chapter_id: 'ch1' },
        { id: 'q3', question_text: 'Explain root absorption.', concept_id: 'c3', chapter_id: 'ch1' },
      ];

      const mockClient = {
        from: vi.fn((table: string) => {
          if (table === 'questions') {
            return {
              select: vi.fn().mockResolvedValue({
                data: mockQuestions,
                count: 3,
                error: null,
              }),
            };
          }
          if (table === 'attempt_answers') {
            return {
              select: vi.fn().mockReturnValue({
                is: vi.fn().mockResolvedValue({
                  data: [],
                  count: 0,
                  error: null,
                }),
              }),
            };
          }
          if (table === 'assessment_results') {
            return {
              select: vi.fn().mockReturnValue({
                or: vi.fn().mockResolvedValue({
                  data: [],
                  count: 0,
                  error: null,
                }),
              }),
            };
          }
          return {};
        }),
      } as any;

      const scan = await dataQualityService.scanDataQuality(mockClient);

      expect(scan.report.totalQuestions).toBe(3);
      expect(scan.report.unmappedQuestionsCount).toBe(0);
      expect(scan.report.questionsWithMissingChapter).toBe(0);
      expect(scan.report.orphanedAnswersCount).toBe(0);
      expect(scan.report.orphanedResultsCount).toBe(0);
      expect(scan.report.healthyQuestionsPercentage).toBe(100);
      expect(scan.issues).toHaveLength(0);
    });

    it('Detects unmapped questions, missing chapters, and orphaned records accurately', async () => {
      const mockQuestions = [
        { id: 'q1', question_text: 'Mapped question', concept_id: 'c1', chapter_id: 'ch1' },
        { id: 'q2', question_text: 'Unmapped concept question', concept_id: null, chapter_id: 'ch1' },
        { id: 'q3', question_text: 'Missing chapter question', concept_id: 'c2', chapter_id: null },
        { id: 'q4', question_text: 'Both missing', concept_id: null, chapter_id: null },
      ];

      const mockClient = {
        from: vi.fn((table: string) => {
          if (table === 'questions') {
            return {
              select: vi.fn().mockResolvedValue({
                data: mockQuestions,
                count: 4,
                error: null,
              }),
            };
          }
          if (table === 'attempt_answers') {
            return {
              select: vi.fn().mockReturnValue({
                is: vi.fn().mockResolvedValue({
                  data: [{ id: 'a1' }, { id: 'a2' }],
                  count: 2,
                  error: null,
                }),
              }),
            };
          }
          if (table === 'assessment_results') {
            return {
              select: vi.fn().mockReturnValue({
                or: vi.fn().mockResolvedValue({
                  data: [{ id: 'r1' }],
                  count: 1,
                  error: null,
                }),
              }),
            };
          }
          return {};
        }),
      } as any;

      const scan = await dataQualityService.scanDataQuality(mockClient);

      expect(scan.report.totalQuestions).toBe(4);
      expect(scan.report.unmappedQuestionsCount).toBe(2);
      expect(scan.report.questionsWithMissingChapter).toBe(2);
      expect(scan.report.orphanedAnswersCount).toBe(2);
      expect(scan.report.orphanedResultsCount).toBe(1);

      // Healthy count: max(0, 4 - 2 - 2) = 0 => 0.0%
      expect(scan.report.healthyQuestionsPercentage).toBe(0);

      const unmappedIssues = scan.issues.filter(i => i.type === 'UNMAPPED_QUESTION');
      expect(unmappedIssues).toHaveLength(2);
      expect(unmappedIssues[0].severity).toBe('WARNING');

      const chapterIssues = scan.issues.filter(i => i.type === 'INVALID_CHAPTER');
      expect(chapterIssues).toHaveLength(2);
      expect(chapterIssues[0].severity).toBe('ERROR');

      const orphanedAnswers = scan.issues.filter(i => i.type === 'ORPHANED_ANSWER');
      expect(orphanedAnswers).toHaveLength(1);
      expect(orphanedAnswers[0].severity).toBe('ERROR');

      const orphanedResults = scan.issues.filter(i => i.type === 'ORPHANED_RESULT');
      expect(orphanedResults).toHaveLength(1);
    });

    it('Safely handles empty database (0 questions) without zero division', async () => {
      const mockClient = {
        from: vi.fn((table: string) => {
          if (table === 'questions') {
            return {
              select: vi.fn().mockResolvedValue({
                data: [],
                count: 0,
                error: null,
              }),
            };
          }
          if (table === 'attempt_answers') {
            return {
              select: vi.fn().mockReturnValue({
                is: vi.fn().mockResolvedValue({
                  data: [],
                  count: 0,
                  error: null,
                }),
              }),
            };
          }
          if (table === 'assessment_results') {
            return {
              select: vi.fn().mockReturnValue({
                or: vi.fn().mockResolvedValue({
                  data: [],
                  count: 0,
                  error: null,
                }),
              }),
            };
          }
          return {};
        }),
      } as any;

      const scan = await dataQualityService.scanDataQuality(mockClient);
      expect(scan.report.totalQuestions).toBe(0);
      expect(scan.report.healthyQuestionsPercentage).toBe(100);
      expect(scan.issues).toHaveLength(0);
    });
  });
});
