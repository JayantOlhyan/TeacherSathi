import { describe, it, expect } from 'vitest';
import { ScopeOverviewSummary, SchoolComparisonRow } from '../../src/lib/services/reportingService';
import { MINIMUM_COHORT_THRESHOLD } from '../../src/lib/validations/institution';

describe('Phase 8 Institutional Reporting & Aggregation Engine', () => {
  describe('Adoption & Resolution Rate Calculations', () => {
    it('Calculates adoption rate as percentage of active schools', () => {
      const calculateAdoptionRate = (total: number, active: number) => {
        if (total === 0) return 0;
        return Math.round((active / total) * 100);
      };

      expect(calculateAdoptionRate(0, 0)).toBe(0);
      expect(calculateAdoptionRate(10, 5)).toBe(50);
      expect(calculateAdoptionRate(30, 27)).toBe(90);
      expect(calculateAdoptionRate(3, 1)).toBe(33);
    });

    it('Calculates gap resolution rate as percentage of resolved learning gaps', () => {
      const calculateGapResolutionRate = (total: number, resolved: number) => {
        if (total === 0) return 100; // No open or past gaps, perfect health
        return Math.round((resolved / total) * 100);
      };

      expect(calculateGapResolutionRate(0, 0)).toBe(100);
      expect(calculateGapResolutionRate(50, 25)).toBe(50);
      expect(calculateGapResolutionRate(100, 80)).toBe(80);
    });
  });

  describe('Scope Overview Aggregate Contract', () => {
    it('Creates valid ScopeOverviewSummary structure with masked mastery when sample < 10', () => {
      const summary: ScopeOverviewSummary = {
        scopeType: 'DISTRICT',
        scopeId: 'dist-pune',
        scopeName: 'Pune District',
        totalSchools: 5,
        activeSchools: 4,
        totalTeachers: 28,
        activeTeachers: 22,
        totalStudents: 8, // < MINIMUM_COHORT_THRESHOLD
        activeStudents: 6,
        totalClasses: 12,
        totalAssessments: 14,
        averageMasteryScore: null, // Masked
        insufficientData: true,
        totalOpenGaps: 3,
        resolvedGapsCount: 9,
        gapResolutionRate: 75,
        resourceUsageCount: 42,
        adoptionRate: 80,
      };

      expect(summary.totalStudents).toBeLessThan(MINIMUM_COHORT_THRESHOLD);
      expect(summary.averageMasteryScore).toBeNull();
      expect(summary.insufficientData).toBe(true);
      expect(summary.adoptionRate).toBe(80);
      expect(summary.gapResolutionRate).toBe(75);
    });

    it('Calculates average mastery correctly when sample >= 10', () => {
      const totalEvaluatedStudents = 45;
      const totalScoreSum = 3600;
      const averageMasteryScore = totalEvaluatedStudents >= MINIMUM_COHORT_THRESHOLD
        ? Math.round(totalScoreSum / totalEvaluatedStudents)
        : null;

      expect(averageMasteryScore).toBe(80);
    });
  });

  describe('Multi-School Comparison Structure', () => {
    it('Builds comparative metrics rows across selected schools', () => {
      const row1: SchoolComparisonRow = {
        schoolId: 'sch-1',
        schoolName: 'Govt High School Model 1',
        schoolCode: 'GHS-01',
        board: 'CBSE',
        city: 'Pune',
        teachersCount: 15,
        studentsCount: 300,
        classesCount: 10,
        assessmentsCount: 25,
        averageMastery: 78,
        insufficientData: false,
        openGapsCount: 4,
        resourceUsageCount: 88,
      };

      const row2: SchoolComparisonRow = {
        schoolId: 'sch-2',
        schoolName: 'Govt High School Model 2',
        schoolCode: 'GHS-02',
        board: 'CBSE',
        city: 'Pune',
        teachersCount: 8,
        studentsCount: 6, // Below threshold
        classesCount: 2,
        assessmentsCount: 4,
        averageMastery: null,
        insufficientData: true,
        openGapsCount: 1,
        resourceUsageCount: 12,
      };

      expect(row1.averageMastery).toBe(78);
      expect(row1.insufficientData).toBe(false);
      expect(row2.averageMastery).toBeNull();
      expect(row2.insufficientData).toBe(true);
    });
  });
});
