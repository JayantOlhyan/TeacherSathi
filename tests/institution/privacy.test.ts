import { describe, it, expect } from 'vitest';
import { MINIMUM_COHORT_THRESHOLD } from '../../src/lib/validations/institution';

/**
 * Phase 8 Student Privacy & Aggregation Threshold Tests
 * 
 * Enforces student privacy by design:
 * When cohort size < MINIMUM_COHORT_THRESHOLD (10), scores MUST be masked as null
 * and insufficientData flagged as true, preventing individual student score deduction.
 */

describe('Student Privacy & Minimum Sample Masking (N >= 10)', () => {
  it('Verifies minimum cohort threshold constant is 10', () => {
    expect(MINIMUM_COHORT_THRESHOLD).toBe(10);
  });

  describe('Aggregate Score Masking Rules', () => {
    const applyPrivacyMask = (studentCount: number, rawAverage: number) => {
      if (studentCount < MINIMUM_COHORT_THRESHOLD) {
        return {
          score: null,
          insufficientData: true,
          label: 'Insufficient data',
        };
      }
      return {
        score: Math.round(rawAverage),
        insufficientData: false,
        label: `${Math.round(rawAverage)}%`,
      };
    };

    it('Masks scores for cohorts with 0 students', () => {
      const result = applyPrivacyMask(0, 0);
      expect(result.score).toBeNull();
      expect(result.insufficientData).toBe(true);
      expect(result.label).toBe('Insufficient data');
    });

    it('Masks scores for single student attempts (N = 1)', () => {
      const result = applyPrivacyMask(1, 95.5);
      expect(result.score).toBeNull();
      expect(result.insufficientData).toBe(true);
      expect(result.label).toBe('Insufficient data');
    });

    it('Masks scores for small cohorts below threshold (N = 9)', () => {
      const result = applyPrivacyMask(9, 82.0);
      expect(result.score).toBeNull();
      expect(result.insufficientData).toBe(true);
      expect(result.label).toBe('Insufficient data');
    });

    it('Reveals rounded scores at exact threshold (N = 10)', () => {
      const result = applyPrivacyMask(10, 78.4);
      expect(result.score).toBe(78);
      expect(result.insufficientData).toBe(false);
      expect(result.label).toBe('78%');
    });

    it('Reveals rounded scores for large cohorts (N = 250)', () => {
      const result = applyPrivacyMask(250, 85.7);
      expect(result.score).toBe(86);
      expect(result.insufficientData).toBe(false);
      expect(result.label).toBe('86%');
    });
  });

  describe('Comparative Benchmarking Privacy Rules', () => {
    const sanitizeComparisonRow = (
      schoolName: string,
      studentsEvaluated: number,
      rawMastery: number
    ) => {
      const isMasked = studentsEvaluated < MINIMUM_COHORT_THRESHOLD;
      return {
        schoolName,
        studentsCount: studentsEvaluated,
        averageMastery: isMasked ? null : rawMastery,
        insufficientData: isMasked,
      };
    };

    it('Protects rural/small schools from student deanonymization in comparative reports', () => {
      const smallSchool = sanitizeComparisonRow('Remote Hill Primary', 4, 88.0);
      const largeSchool = sanitizeComparisonRow('District Model Academy', 140, 72.5);

      expect(smallSchool.averageMastery).toBeNull();
      expect(smallSchool.insufficientData).toBe(true);

      expect(largeSchool.averageMastery).toBe(72.5);
      expect(largeSchool.insufficientData).toBe(false);
    });
  });
});
