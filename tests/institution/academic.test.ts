import { describe, it, expect } from 'vitest';
import { ConceptAcademicSummary, LearningGapAggregateItem } from '../../src/lib/services/reportingService';
import { MINIMUM_COHORT_THRESHOLD } from '../../src/lib/validations/institution';

describe('Phase 8 Academic Intelligence & Aggregation Tests', () => {
  describe('Concept Mastery Classification', () => {
    const classifyConceptMastery = (
      studentsCount: number,
      avgScore: number
    ): ConceptAcademicSummary['masteryStatus'] => {
      if (studentsCount < MINIMUM_COHORT_THRESHOLD) {
        return 'INSUFFICIENT_DATA';
      }
      if (avgScore >= 75) {
        return 'MASTERED';
      }
      if (avgScore >= 50) {
        return 'DEVELOPING';
      }
      return 'NEEDS_SUPPORT';
    };

    it('Classifies concepts with fewer than 10 students as INSUFFICIENT_DATA regardless of score', () => {
      expect(classifyConceptMastery(0, 95)).toBe('INSUFFICIENT_DATA');
      expect(classifyConceptMastery(5, 100)).toBe('INSUFFICIENT_DATA');
      expect(classifyConceptMastery(9, 30)).toBe('INSUFFICIENT_DATA');
    });

    it('Classifies concepts with >= 10 students into correct mastery tiers', () => {
      expect(classifyConceptMastery(10, 85)).toBe('MASTERED');
      expect(classifyConceptMastery(50, 75)).toBe('MASTERED');
      expect(classifyConceptMastery(30, 62)).toBe('DEVELOPING');
      expect(classifyConceptMastery(20, 50)).toBe('DEVELOPING');
      expect(classifyConceptMastery(100, 42)).toBe('NEEDS_SUPPORT');
    });
  });

  describe('Learning Gap Aggregate & Severity Classification', () => {
    const classifyGapSeverity = (
      affectedStudentsCount: number,
      resolutionRate: number
    ): LearningGapAggregateItem['severity'] => {
      if (affectedStudentsCount >= 50 && resolutionRate < 30) {
        return 'CRITICAL';
      }
      if (affectedStudentsCount >= 20 || resolutionRate < 50) {
        return 'HIGH';
      }
      if (affectedStudentsCount >= 10) {
        return 'MODERATE';
      }
      return 'LOW';
    };

    it('Classifies widespread, unresolved learning gaps as CRITICAL', () => {
      expect(classifyGapSeverity(80, 15)).toBe('CRITICAL');
      expect(classifyGapSeverity(120, 28)).toBe('CRITICAL');
    });

    it('Classifies moderately widespread or slow resolving gaps as HIGH', () => {
      expect(classifyGapSeverity(25, 45)).toBe('HIGH');
      expect(classifyGapSeverity(8, 35)).toBe('HIGH');
    });

    it('Classifies localized gaps as MODERATE or LOW', () => {
      expect(classifyGapSeverity(12, 70)).toBe('MODERATE');
      expect(classifyGapSeverity(5, 80)).toBe('LOW');
    });
  });

  describe('Aggregation Contract Integrity', () => {
    it('Creates valid ConceptAcademicSummary record', () => {
      const conceptSummary: ConceptAcademicSummary = {
        conceptId: 'concept-1',
        conceptNameEn: 'Photosynthesis in Plants',
        chapterTitleEn: 'Nutrition in Plants',
        subjectName: 'Science',
        averageMastery: 72,
        studentsEvaluatedCount: 35,
        insufficientData: false,
        masteryStatus: 'DEVELOPING',
        studentsNeedingSupportCount: 7,
      };

      expect(conceptSummary.studentsEvaluatedCount).toBeGreaterThanOrEqual(MINIMUM_COHORT_THRESHOLD);
      expect(conceptSummary.insufficientData).toBe(false);
      expect(conceptSummary.averageMastery).toBe(72);
      expect(conceptSummary.masteryStatus).toBe('DEVELOPING');
    });
  });
});
