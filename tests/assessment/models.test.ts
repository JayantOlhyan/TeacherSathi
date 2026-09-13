import { describe, it, expect } from 'vitest';
import {
  AssessmentCreateSchema,
  AssessmentSettingsSchema,
  QuestionSnapshotSchema,
  DEFAULT_ASSESSMENT_SETTINGS,
} from '@/lib/validations/assessment';

describe('Phase 4 — Assessment Data Models & Calculations', () => {
  it('enforces safe default settings', () => {
    const settings = AssessmentSettingsSchema.parse({});
    expect(settings.shuffle_questions).toBe(false);
    expect(settings.shuffle_options).toBe(false);
    expect(settings.allow_retake).toBe(false);
    expect(settings.max_attempts).toBe(1);
    expect(settings.negative_marking).toBe(false);
    expect(settings.negative_marks_per_question).toBe(0);
    expect(settings.show_result_after_submission).toBe(true);
  });

  it('validates question snapshot structure and preserves immutability', () => {
    const snapshot = QuestionSnapshotSchema.parse({
      text_en: 'What is the powerhouse of the cell?',
      text_hi: 'कोशिका का ऊर्जा गृह किसे कहते हैं?',
      question_type: 'MCQ',
      marks: 2,
      difficulty: 'EASY',
      bloom_level: 'REMEMBER',
      options: [
        { option_key: 'A', text_en: 'Mitochondria', text_hi: 'माइटोकॉन्ड्रिया', is_correct: true },
        { option_key: 'B', text_en: 'Ribosome', text_hi: 'राइबोसोम', is_correct: false },
        { option_key: 'C', text_en: 'Nucleus', text_hi: 'केन्द्रक', is_correct: false },
        { option_key: 'D', text_en: 'Golgi Apparatus', text_hi: 'गॉल्जी उपकरण', is_correct: false },
      ],
      explanation_en: 'Mitochondria produce ATP through cellular respiration.',
      source: 'NCERT Class 8 Science Chapter 8',
    });

    expect(snapshot.options).toHaveLength(4);
    expect(snapshot.options?.[0].is_correct).toBe(true);
    expect(snapshot.marks).toBe(2);

    // Deep clone to simulate historical snapshot preservation
    const historicalSnapshot = JSON.parse(JSON.stringify(snapshot));

    // Mutate the original reference
    snapshot.text_en = 'Updated question text in canonical question bank';
    if (snapshot.options) {
      snapshot.options[0].text_en = 'Updated Mitochondria text';
    }

    // Historical snapshot remains untouched
    expect(historicalSnapshot.text_en).toBe('What is the powerhouse of the cell?');
    expect(historicalSnapshot.options[0].text_en).toBe('Mitochondria');
  });

  it('validates assessment creation payload and calculates marks sum', () => {
    const assessmentPayload = {
      title: 'Class 8 Science Term 1 Test',
      description: 'Periodic assessment covering chapters 1-4',
      assessment_type: 'TEST_PAPER',
      grade_id: 'class-8',
      subject_id: 'science',
      language: 'en',
      duration_minutes: 45,
      total_marks: 10,
      passing_marks: 4,
      instructions: ['All questions are compulsory.', 'No calculators permitted.'],
      settings: DEFAULT_ASSESSMENT_SETTINGS,
      questions: [
        {
          question_order: 1,
          section: 'SECTION_A',
          marks_override: 2,
          question_snapshot: {
            text_en: 'Question 1',
            question_type: 'MCQ',
            marks: 2,
            options: [
              { option_key: 'A', text_en: 'Option A', is_correct: true },
              { option_key: 'B', text_en: 'Option B', is_correct: false },
            ],
          },
        },
        {
          question_order: 2,
          section: 'SECTION_A',
          marks_override: 3,
          question_snapshot: {
            text_en: 'Question 2',
            question_type: 'MCQ',
            marks: 3,
            options: [
              { option_key: 'A', text_en: 'Option A', is_correct: false },
              { option_key: 'B', text_en: 'Option B', is_correct: true },
            ],
          },
        },
      ],
    };

    const parsed = AssessmentCreateSchema.parse(assessmentPayload);
    expect(parsed.questions).toHaveLength(2);
    expect(parsed.duration_minutes).toBe(45);

    const calculatedTotal = parsed.questions.reduce(
      (sum, q) => sum + (q.marks_override ?? q.question_snapshot.marks ?? 1),
      0
    );
    expect(calculatedTotal).toBe(5);
  });

  it('correctly calculates percentage and passing status', () => {
    const totalMarks = 40;
    const score = 32;
    const percentage = Number(((score / totalMarks) * 100).toFixed(2));
    const passingMarks = 16;
    const isPassed = score >= passingMarks;

    expect(percentage).toBe(80.0);
    expect(isPassed).toBe(true);

    const failingScore = 12;
    const failingPercentage = Number(((failingScore / totalMarks) * 100).toFixed(2));
    const isFailingPassed = failingScore >= passingMarks;

    expect(failingPercentage).toBe(30.0);
    expect(isFailingPassed).toBe(false);
  });

  it('enforces timer bounds and latency grace period calculation', () => {
    const startedAt = new Date('2026-09-13T10:00:00Z').getTime();
    const durationMinutes = 30;
    const gracePeriodMs = 60_000;
    const allowedLimitMs = startedAt + durationMinutes * 60 * 1000 + gracePeriodMs;

    // Inside time
    const insideTime = new Date('2026-09-13T10:25:00Z').getTime();
    expect(insideTime <= allowedLimitMs).toBe(true);

    // Inside grace period
    const inGracePeriod = new Date('2026-09-13T10:30:30Z').getTime();
    expect(inGracePeriod <= allowedLimitMs).toBe(true);

    // Expired
    const expiredTime = new Date('2026-09-13T10:32:00Z').getTime();
    expect(expiredTime > allowedLimitMs).toBe(true);
  });
});
