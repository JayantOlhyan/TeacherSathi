import { describe, it, expect } from 'vitest';
import {
  ClassCreateSchema,
  StudentEnrollmentSchema,
  ClassroomSessionCreateSchema,
  RemoteActionCreateSchema
} from '../../src/lib/validations';

describe('Classes, Rosters & Classroom Hardware System', () => {
  describe('Classes & Student Enrollment', () => {
    it('Validates institutional class schema', () => {
      const validClass = {
        school_id: '123e4567-e89b-12d3-a456-426614174000',
        grade_id: 'class-10',
        name: 'Class 10-A',
        section: 'A',
        academic_year: '2026-27'
      };

      const result = ClassCreateSchema.safeParse(validClass);
      expect(result.success).toBe(true);
    });

    it('Validates student enrollment into class', () => {
      const enrollment = {
        class_id: '123e4567-e89b-12d3-a456-426614174000',
        student_id: '123e4567-e89b-12d3-a456-426614174001',
        roll_number: '10-A-04',
        enrollment_status: 'ACTIVE'
      };

      const result = StudentEnrollmentSchema.safeParse(enrollment);
      expect(result.success).toBe(true);
    });
  });

  describe('Classroom Hardware & Handshake Sessions', () => {
    it('Validates classroom session lifecycle initiation', () => {
      const sessionData = {
        id: 'sess_98241',
        device_id: 'Board-001',
        session_token_hash: 'hash_5f4dcc3b5aa765d61d8327deb882cf99',
        status: 'WAITING',
        expires_at: new Date(Date.now() + 120 * 1000).toISOString()
      };

      const result = ClassroomSessionCreateSchema.safeParse(sessionData);
      expect(result.success).toBe(true);
    });

    it('Validates remote action event payload', () => {
      const remoteAction = {
        session_id: 'sess_98241',
        action_type: 'NEXT_SLIDE',
        payload: { current_slide: 2, target_slide: 3 }
      };

      const result = RemoteActionCreateSchema.safeParse(remoteAction);
      expect(result.success).toBe(true);
    });
  });
});
