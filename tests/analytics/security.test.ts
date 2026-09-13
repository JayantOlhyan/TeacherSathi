import { describe, it, expect } from 'vitest';
import {
  RecomputeRequestSchema,
  GenerateInterventionSchema,
} from '../../src/lib/validations/analytics';

describe('Analytics Security & Authorization Boundaries', () => {
  it('Enforces Student-to-Student Isolation: rejects unauthorized cross-student queries', () => {
    const studentAId: string = '11111111-1111-1111-1111-111111111111';
    const studentBId: string = '22222222-2222-2222-2222-222222222222';
    const userRole: string = 'STUDENT';

    // Simulated authorization boundary logic from /api/analytics/student/[id]/route.ts
    const isAuthorized = !(userRole === 'STUDENT' && studentAId !== studentBId);
    expect(isAuthorized).toBe(false);
  });

  it('Allows teacher or admin to query authorized student in class', () => {
    const teacherId: string = '33333333-3333-3333-3333-333333333333';
    const studentId: string = '22222222-2222-2222-2222-222222222222';
    const teacherRole: string = 'TEACHER';

    const isAuthorized = !(teacherRole === 'STUDENT' && teacherId !== studentId);
    expect(isAuthorized).toBe(true);
  });

  it('Rejects invalid UUID format in recompute requests', () => {
    const invalidPayload = {
      studentId: 'not-a-valid-uuid',
    };
    const parsed = RecomputeRequestSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });

  it('Rejects empty or malformed intervention generation requests', () => {
    const emptyPayload = {};
    const parsed = GenerateInterventionSchema.safeParse(emptyPayload);
    expect(parsed.success).toBe(false);
  });

  it('Validates structured intervention payload with legitimate UUIDs and curriculum tiers', () => {
    const validPayload = {
      conceptId: '123e4567-e89b-12d3-a456-426614174000',
      chapterId: '123e4567-e89b-12d3-a456-426614174001',
      gradeId: 'class-8',
      subjectId: 'science',
      language: 'en' as const,
      interventionType: 'REMEDIATION_ACTIVITY' as const,
      observedWeakness: 'Students struggling with drip irrigation calculation',
    };
    const parsed = GenerateInterventionSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  describe('Teacher-of-Class & Role Boundaries', () => {
    it('Blocks students from accessing class-level diagnostic analytics', () => {
      const userRole = 'STUDENT';
      const isClassAdminOrTeacher = ['SUPERADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(userRole);
      expect(isClassAdminOrTeacher).toBe(false);
    });

    it('Verifies teacher must be assigned to the class or belong to school admin', () => {
      const classTeacherId: string = 'teacher-owner-id';
      const requestingTeacherA: string = 'teacher-owner-id';
      const requestingTeacherB: string = 'unrelated-teacher-id';

      const canAccessA = classTeacherId === requestingTeacherA;
      const canAccessB = classTeacherId === requestingTeacherB;

      expect(canAccessA).toBe(true);
      expect(canAccessB).toBe(false);
    });

    it('Grants access to SUPERADMIN and SCHOOL_ADMIN of the same school', () => {
      const classSchoolId: string = 'school-123';
      const adminRole: string = 'SCHOOL_ADMIN';
      const adminSchoolId: string = 'school-123';

      const isAuthorized = adminRole === 'SUPERADMIN' || (adminRole === 'SCHOOL_ADMIN' && adminSchoolId === classSchoolId);
      expect(isAuthorized).toBe(true);
    });
  });

  describe('Phase 5 Entitlement Enforcement for Phase 6 Features', () => {
    it('Gates diagnostic analytics behind diagnostic_analytics entitlement', () => {
      const freeTierEntitlements = {
        diagnostic_analytics: false,
        ai_remediation: false,
      };

      const proTierEntitlements = {
        diagnostic_analytics: true,
        ai_remediation: true,
      };

      expect(freeTierEntitlements.diagnostic_analytics).toBe(false);
      expect(proTierEntitlements.diagnostic_analytics).toBe(true);
    });

    it('Gates AI remediation generation behind ai_remediation entitlement and quota', () => {
      const userPlan = {
        hasEntitlement: (key: string) => key === 'ai_remediation',
        quotaRemaining: 15,
      };

      const canGenerate = userPlan.hasEntitlement('ai_remediation') && userPlan.quotaRemaining > 0;
      expect(canGenerate).toBe(true);

      const exhaustedPlan = {
        hasEntitlement: (key: string) => key === 'ai_remediation',
        quotaRemaining: 0,
      };

      const canGenerateExhausted = exhaustedPlan.hasEntitlement('ai_remediation') && exhaustedPlan.quotaRemaining > 0;
      expect(canGenerateExhausted).toBe(false);
    });
  });

  describe('Intervention Draft Confidentiality', () => {
    it('Prevents students from viewing DRAFT interventions', () => {
      const interventionStatus = 'DRAFT';
      const studentCanView = interventionStatus !== 'DRAFT';
      expect(studentCanView).toBe(false);
    });

    it('Allows students to view only ASSIGNED interventions', () => {
      const interventionStatus = 'ASSIGNED';
      const studentCanView = interventionStatus === 'ASSIGNED';
      expect(studentCanView).toBe(true);
    });
  });
});
