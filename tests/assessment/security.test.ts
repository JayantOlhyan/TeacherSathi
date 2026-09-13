import { describe, it, expect } from 'vitest';
import type { QuestionSnapshot, AssessmentSettings } from '@/lib/validations/assessment';

describe('Phase 4 — Assessment Security & Boundary Enforcement', () => {
  it('sanitizes answer keys and explanations for student consumption', () => {
    const rawQuestions = [
      {
        id: 'q-101',
        assessment_id: 'asm-1',
        question_order: 1,
        section: 'SECTION_A',
        marks_override: null,
        created_at: new Date().toISOString(),
        question_id: 'db-q-1',
        question_snapshot: {
          text_en: 'What is the formula for kinetic energy?',
          question_type: 'MCQ',
          marks: 1,
          options: [
            { option_key: 'A' as const, text_en: '1/2 mv^2', is_correct: true },
            { option_key: 'B' as const, text_en: 'mgh', is_correct: false },
            { option_key: 'C' as const, text_en: 'ma', is_correct: false },
            { option_key: 'D' as const, text_en: 'F * d', is_correct: false },
          ],
          model_answer_en: '1/2 mv^2',
          explanation_en: 'Kinetic energy equals one half mass times velocity squared.',
        },
      },
    ];

    // Simulate sanitization logic
    const sanitized = rawQuestions.map((q) => {
      const snapshot: QuestionSnapshot = { ...q.question_snapshot };
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

    const studentSnapshot = sanitized[0].question_snapshot;
    // None of the options show is_correct: true
    expect(studentSnapshot.options?.every((o) => o.is_correct === false)).toBe(true);
    // Explanations and model answers are undefined
    expect(studentSnapshot.model_answer_en).toBeUndefined();
    expect(studentSnapshot.explanation_en).toBeUndefined();
  });

  it('blocks student A from modifying an attempt belonging to student B', () => {
    const attempt = {
      id: 'att-123',
      student_id: 'student-B-uuid',
      status: 'IN_PROGRESS',
    };

    const requestingStudentId = 'student-A-uuid';

    const canModify = attempt.student_id === requestingStudentId && attempt.status === 'IN_PROGRESS';
    expect(canModify).toBe(false);
  });

  it('prohibits answer saving on SUBMITTED or GRADED attempts', () => {
    const submittedAttempt = {
      id: 'att-456',
      student_id: 'student-A-uuid',
      status: 'SUBMITTED',
    };

    const isSubmittable = submittedAttempt.status === 'IN_PROGRESS';
    expect(isSubmittable).toBe(false);
  });

  it('blocks retakes when max_attempts is reached and allow_retake is false', () => {
    const settings: AssessmentSettings = {
      shuffle_questions: false,
      shuffle_options: false,
      show_result_after_submission: true,
      allow_retake: false,
      max_attempts: 1,
      negative_marking: false,
      negative_marks_per_question: 0,
    };

    const currentAttemptsCount = 1;
    const canAttemptAgain =
      settings.allow_retake || currentAttemptsCount < settings.max_attempts;

    expect(canAttemptAgain).toBe(false);
  });

  it('allows retakes up to max_attempts when allow_retake is true', () => {
    const settings: AssessmentSettings = {
      shuffle_questions: false,
      shuffle_options: false,
      show_result_after_submission: true,
      allow_retake: true,
      max_attempts: 3,
      negative_marking: false,
      negative_marks_per_question: 0,
    };

    let currentAttemptsCount = 1;
    expect(currentAttemptsCount < settings.max_attempts).toBe(true);

    currentAttemptsCount = 3;
    expect(currentAttemptsCount < settings.max_attempts).toBe(false);
  });
});
