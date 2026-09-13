import { describe, it, expect } from 'vitest';
import type { QuestionSnapshot, AssessmentSettings } from '@/lib/validations/assessment';

interface MockQuestion {
  id: string;
  question_order: number;
  section: string;
  marks_override: number | null;
  question_snapshot: QuestionSnapshot;
}

interface MockAnswer {
  assessment_question_id: string;
  selected_option: 'A' | 'B' | 'C' | 'D' | null;
  text_answer: string | null;
  is_answered: boolean;
}

function simulateGrading(
  questions: MockQuestion[],
  answers: MockAnswer[],
  settings: AssessmentSettings,
  totalMarks: number,
  passingMarks: number | null
) {
  const answerMap = new Map<string, MockAnswer>();
  answers.forEach((a) => answerMap.set(a.assessment_question_id, a));

  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let allAutoGraded = true;

  const questionBreakdown = questions.map((q) => {
    const ans = answerMap.get(q.id);
    const snapshot = q.question_snapshot;
    const maxMarks = q.marks_override ?? snapshot.marks ?? 1;
    const qType = snapshot.question_type || 'MCQ';

    let marksAwarded = 0;
    let isCorrect = false;
    let gradingStatus: 'AUTO_GRADED' | 'MANUAL_REVIEW' = 'AUTO_GRADED';
    let correctOptionKey: string | null = null;

    if (qType === 'MCQ') {
      const correctOpt = snapshot.options?.find((o) => o.is_correct);
      correctOptionKey = correctOpt?.option_key || 'A';

      if (!ans || !ans.is_answered || !ans.selected_option) {
        unansweredCount++;
        marksAwarded = 0;
        isCorrect = false;
      } else if (ans.selected_option === correctOptionKey) {
        correctCount++;
        isCorrect = true;
        marksAwarded = maxMarks;
        totalScore += marksAwarded;
      } else {
        incorrectCount++;
        isCorrect = false;
        if (settings.negative_marking) {
          const deduction = settings.negative_marks_per_question || 0;
          marksAwarded = -deduction;
          totalScore += marksAwarded;
        } else {
          marksAwarded = 0;
        }
      }
    } else {
      allAutoGraded = false;
      gradingStatus = 'MANUAL_REVIEW';
      if (!ans || !ans.is_answered) {
        unansweredCount++;
        marksAwarded = 0;
        isCorrect = false;
      } else {
        marksAwarded = 0;
      }
    }

    return {
      question_order: q.question_order,
      question_id: q.id,
      max_marks: maxMarks,
      marks_awarded: marksAwarded,
      selected_option: ans?.selected_option || null,
      correct_option: correctOptionKey,
      is_correct: isCorrect,
      grading_status: gradingStatus,
    };
  });

  totalScore = Math.max(0, totalScore);
  const percentage = Number(((totalScore / totalMarks) * 100).toFixed(2));
  const isPassed = passingMarks != null ? totalScore >= passingMarks : percentage >= 40;

  return {
    total_marks: totalMarks,
    marks_obtained: totalScore,
    percentage,
    correct_answers: correctCount,
    incorrect_answers: incorrectCount,
    unanswered: unansweredCount,
    is_passed: isPassed,
    all_auto_graded: allAutoGraded,
    question_breakdown: questionBreakdown,
  };
}

describe('Phase 4 — Assessment Auto-Grading Engine', () => {
  const sampleQuestions: MockQuestion[] = [
    {
      id: 'q-1',
      question_order: 1,
      section: 'SECTION_A',
      marks_override: 2,
      question_snapshot: {
        text_en: 'What is photosynthesis?',
        question_type: 'MCQ',
        marks: 2,
        options: [
          { option_key: 'A', text_en: 'Solar to chemical energy conversion', is_correct: true },
          { option_key: 'B', text_en: 'Cell division', is_correct: false },
          { option_key: 'C', text_en: 'Digestion', is_correct: false },
          { option_key: 'D', text_en: 'Excretion', is_correct: false },
        ],
      },
    },
    {
      id: 'q-2',
      question_order: 2,
      section: 'SECTION_A',
      marks_override: 2,
      question_snapshot: {
        text_en: 'Which gas is released during photosynthesis?',
        question_type: 'MCQ',
        marks: 2,
        options: [
          { option_key: 'A', text_en: 'Nitrogen', is_correct: false },
          { option_key: 'B', text_en: 'Oxygen', is_correct: true },
          { option_key: 'C', text_en: 'Carbon Dioxide', is_correct: false },
          { option_key: 'D', text_en: 'Argon', is_correct: false },
        ],
      },
    },
    {
      id: 'q-3',
      question_order: 3,
      section: 'SECTION_B',
      marks_override: 3,
      question_snapshot: {
        text_en: 'Explain why leaves appear green.',
        question_type: 'SHORT_ANSWER',
        marks: 3,
        options: [],
      },
    },
  ];

  it('correctly grades 100% correct MCQs with descriptive pending review', () => {
    const answers: MockAnswer[] = [
      { assessment_question_id: 'q-1', selected_option: 'A', text_answer: null, is_answered: true },
      { assessment_question_id: 'q-2', selected_option: 'B', text_answer: null, is_answered: true },
      { assessment_question_id: 'q-3', selected_option: null, text_answer: 'Chlorophyll reflects green light wavelengths.', is_answered: true },
    ];

    const settings: AssessmentSettings = {
      shuffle_questions: false,
      shuffle_options: false,
      show_result_after_submission: true,
      allow_retake: false,
      max_attempts: 1,
      negative_marking: false,
      negative_marks_per_question: 0,
    };

    const result = simulateGrading(sampleQuestions, answers, settings, 7, 3);

    expect(result.marks_obtained).toBe(4); // 2 + 2 = 4 (Q3 is manual review)
    expect(result.correct_answers).toBe(2);
    expect(result.incorrect_answers).toBe(0);
    expect(result.unanswered).toBe(0);
    expect(result.is_passed).toBe(true);
    expect(result.all_auto_graded).toBe(false);

    // Q3 should be MANUAL_REVIEW
    const q3Breakdown = result.question_breakdown.find((b) => b.question_id === 'q-3');
    expect(q3Breakdown?.grading_status).toBe('MANUAL_REVIEW');
    expect(q3Breakdown?.marks_awarded).toBe(0);
  });

  it('applies negative marking accurately when configured', () => {
    const answers: MockAnswer[] = [
      { assessment_question_id: 'q-1', selected_option: 'A', text_answer: null, is_answered: true }, // Correct (+2)
      { assessment_question_id: 'q-2', selected_option: 'C', text_answer: null, is_answered: true }, // Incorrect (-0.5)
      // q-3 left unanswered (0)
    ];

    const settingsWithNegativeMarking: AssessmentSettings = {
      shuffle_questions: false,
      shuffle_options: false,
      show_result_after_submission: true,
      allow_retake: false,
      max_attempts: 1,
      negative_marking: true,
      negative_marks_per_question: 0.5,
    };

    const result = simulateGrading(sampleQuestions, answers, settingsWithNegativeMarking, 7, 3);

    expect(result.marks_obtained).toBe(1.5); // 2 - 0.5 = 1.5
    expect(result.correct_answers).toBe(1);
    expect(result.incorrect_answers).toBe(1);
    expect(result.unanswered).toBe(1);
    expect(result.is_passed).toBe(false);
  });

  it('prevents overall marks from dipping below 0', () => {
    const answers: MockAnswer[] = [
      { assessment_question_id: 'q-1', selected_option: 'B', text_answer: null, is_answered: true }, // Incorrect (-1)
      { assessment_question_id: 'q-2', selected_option: 'A', text_answer: null, is_answered: true }, // Incorrect (-1)
    ];

    const punitiveSettings: AssessmentSettings = {
      shuffle_questions: false,
      shuffle_options: false,
      show_result_after_submission: true,
      allow_retake: false,
      max_attempts: 1,
      negative_marking: true,
      negative_marks_per_question: 2,
    };

    const result = simulateGrading(sampleQuestions, answers, punitiveSettings, 7, 3);

    // Negative deduction would be -4, but total marks must be clamped at >= 0
    expect(result.marks_obtained).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.is_passed).toBe(false);
  });
});
