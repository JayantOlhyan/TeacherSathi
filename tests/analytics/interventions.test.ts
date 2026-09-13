import { describe, it, expect, vi } from 'vitest';
import {
  CreateInterventionInputSchema,
  UpdateInterventionInputSchema,
  AssignInterventionInputSchema,
  InterventionItemSchema,
} from '../../src/lib/validations/analytics';
import { interventionsRepository } from '../../src/lib/repositories/interventions';

describe('Phase 6 Academic Interventions Lifecycle & Validation', () => {
  const teacherId = '11111111-1111-4111-8111-111111111111';
  const schoolId = '22222222-2222-4222-8222-222222222222';
  const conceptId = '33333333-3333-4333-8333-333333333333';
  const chapterId = '44444444-4444-4444-8444-444444444444';
  const classId = '55555555-5555-4555-8555-555555555555';
  const studentId = '66666666-6666-4666-8666-666666666666';
  const gapId = '77777777-7777-4777-8777-777777777777';
  const itemId = '99999999-9999-4999-8999-999999999999';

  describe('Validation Schemas', () => {
    it('Validates a complete CreateInterventionInput payload', () => {
      const payload = {
        gapId,
        conceptId,
        chapterId,
        classId,
        studentId,
        title: 'Targeted Remediation: Drip Irrigation',
        type: 'REMEDIATION_PLAN' as const,
        content: {
          concept_name: 'Drip Irrigation',
          duration_mins: 15,
        },
      };

      const parsed = CreateInterventionInputSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
    });

    it('Rejects invalid intervention type', () => {
      const payload = {
        conceptId,
        title: 'Invalid Intervention',
        type: 'INVALID_TYPE',
        content: {},
      };

      const parsed = CreateInterventionInputSchema.safeParse(payload);
      expect(parsed.success).toBe(false);
    });

    it('Validates AssignInterventionInput payload', () => {
      const payload = {
        classId,
        studentId,
        dueDate: '2026-09-30T23:59:59Z',
        timeLimitMinutes: 15,
      };

      const parsed = AssignInterventionInputSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
    });

    it('Validates structured InterventionItem', () => {
      const item = {
        id: itemId,
        gapId,
        teacherId,
        schoolId,
        conceptId,
        conceptNameEn: 'Drip Irrigation',
        chapterId,
        chapterTitleEn: 'Crop Production',
        classId,
        className: 'Class 8-A',
        studentId: null,
        studentName: undefined,
        title: 'Remediation Plan for Drip Irrigation',
        type: 'REMEDIATION_PLAN' as const,
        resourceId: null,
        content: { duration_mins: 15 },
        status: 'DRAFT' as const,
        assignmentId: null,
        reassessmentAssessmentId: null,
        createdAt: '2026-09-13T10:00:00Z',
        updatedAt: '2026-09-13T10:00:00Z',
      };

      const parsed = InterventionItemSchema.safeParse(item);
      expect(parsed.success).toBe(true);
    });

    it('Validates UpdateInterventionInput payload', () => {
      const payload = {
        title: 'Updated Remediation Plan Title',
        content: { duration_mins: 20 },
        status: 'APPROVED' as const,
      };

      const parsed = UpdateInterventionInputSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
    });
  });

  describe('Repository Lifecycle Operations', () => {
    it('Creates an intervention draft with DRAFT status', async () => {
      const mockInsertedRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        gap_id: gapId,
        teacher_id: teacherId,
        school_id: schoolId,
        concept_id: conceptId,
        chapter_id: chapterId,
        class_id: classId,
        student_id: null,
        title: 'Remediation Draft',
        type: 'REMEDIATION_PLAN',
        resource_id: null,
        content: { steps: [] },
        status: 'DRAFT',
        assignment_id: null,
        reassessment_assessment_id: null,
        created_at: '2026-09-13T12:00:00Z',
        updated_at: '2026-09-13T12:00:00Z',
        concept: { name_en: 'Drip Irrigation' },
        chapter: { title_en: 'Crop Production' },
        class: { name: 'Class 8', section: 'A' },
        student: null,
      };

      const mockClient = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockInsertedRow, error: null }),
            }),
          }),
        }),
      } as any;

      const result = await interventionsRepository.createInterventionDraft(
        teacherId,
        schoolId,
        {
          gapId,
          conceptId,
          chapterId,
          classId,
          title: 'Remediation Draft',
          type: 'REMEDIATION_PLAN',
          content: { steps: [] },
        },
        mockClient
      );

      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.status).toBe('DRAFT');
      expect(result.conceptNameEn).toBe('Drip Irrigation');
      expect(result.className).toBe('Class 8 (A)');
    });

    it('Approves an intervention draft transitioning status to APPROVED', async () => {
      const mockUpdatedRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        gap_id: gapId,
        teacher_id: teacherId,
        school_id: schoolId,
        concept_id: conceptId,
        chapter_id: chapterId,
        class_id: classId,
        student_id: null,
        title: 'Remediation Draft',
        type: 'REMEDIATION_PLAN',
        resource_id: null,
        content: { steps: [] },
        status: 'APPROVED',
        assignment_id: null,
        reassessment_assessment_id: null,
        created_at: '2026-09-13T12:00:00Z',
        updated_at: '2026-09-13T12:05:00Z',
        concept: { name_en: 'Drip Irrigation' },
        chapter: { title_en: 'Crop Production' },
        class: { name: 'Class 8', section: 'A' },
        student: null,
      };

      const mockClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockUpdatedRow, error: null }),
                }),
              }),
            }),
          }),
        }),
      } as any;

      const result = await interventionsRepository.approveIntervention('123e4567-e89b-12d3-a456-426614174000', teacherId, mockClient);
      expect(result.status).toBe('APPROVED');
    });

    it('Assigns an intervention: creates reassessment assessment, assignment, and updates gap to IN_REMEDIATION', async () => {
      const invId = '123e4567-e89b-12d3-a456-426614174000';
      const asmtId = '222e4567-e89b-12d3-a456-426614174000';
      const assignId = '333e4567-e89b-12d3-a456-426614174000';

      const mockExisting = {
        id: invId,
        gap_id: gapId,
        teacher_id: teacherId,
        school_id: schoolId,
        concept_id: conceptId,
        chapter_id: chapterId,
        class_id: classId,
        student_id: studentId,
        title: 'Remediation: Drip Irrigation',
        type: 'REMEDIATION_PLAN',
        resource_id: null,
        content: {
          practice_questions: [
            {
              question_number: 1,
              question_text: 'What is drip irrigation?',
              options: ['A method', 'A soil', 'A rock', 'A fertilizer'],
              correct_answer: 'A method',
              explanation: 'It delivers water drops.',
            },
          ],
        },
        status: 'APPROVED',
        assignment_id: null,
        reassessment_assessment_id: null,
        created_at: '2026-09-13T12:00:00Z',
        updated_at: '2026-09-13T12:05:00Z',
      };

      const mockAssignedRow = {
        ...mockExisting,
        status: 'ASSIGNED',
        assignment_id: assignId,
        reassessment_assessment_id: asmtId,
        concept: { name_en: 'Drip Irrigation' },
        chapter: { title_en: 'Crop Production' },
        class: { name: 'Class 8', section: 'A' },
        student: { full_name: 'Aarav Patel' },
      };

      const mockClient = {
        from: vi.fn((table: string) => {
          if (table === 'interventions') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: mockExisting, error: null }),
                }),
              }),
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: mockAssignedRow, error: null }),
                  }),
                }),
              }),
            };
          }
          if (table === 'classes') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: classId, name: 'Class 8-A', grade_id: 'class-8' },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === 'assessments') {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: asmtId, title: 'Reassessment' },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === 'assessment_questions') {
            return {
              insert: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
          }
          if (table === 'assignments') {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: assignId },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === 'learning_gaps') {
            return {
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            };
          }
          return {};
        }),
      } as any;

      const result = await interventionsRepository.assignIntervention(
        invId,
        teacherId,
        {
          classId,
          studentId,
          dueDate: '2026-09-30T12:00:00Z',
          timeLimitMinutes: 15,
        },
        mockClient
      );

      expect(result.status).toBe('ASSIGNED');
      expect(result.assignmentId).toBe(assignId);
      expect(result.reassessmentAssessmentId).toBe(asmtId);
      expect(result.studentName).toBe('Aarav Patel');
    });
  });
});
