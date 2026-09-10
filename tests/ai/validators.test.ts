import { describe, it, expect } from 'vitest';
import {
  validateLessonPlan,
  validateWorksheet,
  validateQuiz,
  validateTestPaper,
  validatePresentation,
  validateMindMap,
  containsDevanagari,
} from '../../src/lib/ai/validators/educational';
import { MockAIProvider } from '../../src/lib/ai/providers/mock';

describe('Educational & Pedagogical Validators', () => {
  const mock = new MockAIProvider();

  describe('Lesson Plan Educational Rules', () => {
    it('passes for valid step timings and formative checks', () => {
      const plan = mock.getMockLessonPlan();
      const report = validateLessonPlan(plan);
      expect(report.is_valid).toBe(true);
      expect(report.issues.length).toBe(0);
    });

    it('flags non-critical warning when step timings diverge from total duration', () => {
      const plan = mock.getMockLessonPlan();
      // Diverge duration by > 5 mins
      const modifiedPlan = { ...plan, duration_mins: 90 };
      const report = validateLessonPlan(modifiedPlan);
      expect(report.issues.some((i) => i.field === 'duration_mins')).toBe(true);
      // It's non-critical so is_valid remains true
      expect(report.is_valid).toBe(true);
    });

    it('fails when formative checks are missing', () => {
      const plan = mock.getMockLessonPlan();
      const invalidPlan = {
        ...plan,
        assessment: {
          ...plan.assessment,
          formative_checks: [],
        },
      };
      const report = validateLessonPlan(invalidPlan);
      expect(report.is_valid).toBe(false);
      expect(report.issues.some((i) => i.field === 'assessment.formative_checks')).toBe(true);
    });
  });

  describe('Worksheet Educational Rules', () => {
    it('passes when question marks sum equals total_marks', () => {
      const sheet = mock.getMockWorksheet();
      const report = validateWorksheet(sheet);
      expect(report.is_valid).toBe(true);
    });

    it('fails when question marks arithmetic does not match total_marks', () => {
      const sheet = mock.getMockWorksheet();
      const invalidSheet = { ...sheet, total_marks: 99 };
      const report = validateWorksheet(invalidSheet);
      expect(report.is_valid).toBe(false);
      expect(report.issues.some((i) => i.field === 'total_marks')).toBe(true);
    });

    it('fails when an MCQ question lacks options', () => {
      const sheet = mock.getMockWorksheet();
      const invalidSheet = {
        ...sheet,
        questions: [
          {
            ...sheet.questions[0],
            question_type: 'MCQ' as const,
            options: [],
          },
          ...sheet.questions.slice(1),
        ],
      };
      const report = validateWorksheet(invalidSheet);
      expect(report.is_valid).toBe(false);
    });
  });

  describe('Quiz Pedagogical Rules', () => {
    it('passes valid quiz with 1 correct option and no duplicates', () => {
      const quiz = mock.getMockQuiz();
      const report = validateQuiz(quiz);
      expect(report.is_valid).toBe(true);
    });

    it('fails when more than one option is marked is_correct: true', () => {
      const quiz = mock.getMockQuiz();
      const invalidQuiz = {
        ...quiz,
        questions: [
          {
            ...quiz.questions[0],
            options: quiz.questions[0].options.map((o) => ({ ...o, is_correct: true })),
          },
        ],
      };
      const report = validateQuiz(invalidQuiz);
      expect(report.is_valid).toBe(false);
    });

    it('fails when correct_option_id does not match the is_correct option', () => {
      const quiz = mock.getMockQuiz();
      const invalidQuiz = {
        ...quiz,
        questions: [
          {
            ...quiz.questions[0],
            correct_option_id: 'B' as const, // but option A is is_correct
          },
        ],
      };
      const report = validateQuiz(invalidQuiz);
      expect(report.is_valid).toBe(false);
    });

    it('fails when options contain duplicate texts', () => {
      const quiz = mock.getMockQuiz();
      const invalidQuiz = {
        ...quiz,
        questions: [
          {
            ...quiz.questions[0],
            options: [
              { id: 'A' as const, text: 'Same Option', is_correct: true },
              { id: 'B' as const, text: 'Same Option', is_correct: false },
              { id: 'C' as const, text: 'Option C', is_correct: false },
              { id: 'D' as const, text: 'Option D', is_correct: false },
            ],
          },
        ],
      };
      const report = validateQuiz(invalidQuiz);
      expect(report.is_valid).toBe(false);
    });
  });

  describe('Test Paper Marks Math Rules', () => {
    it('passes when total marks equals sum of question marks', () => {
      const test = mock.getMockTestPaper();
      const report = validateTestPaper(test);
      expect(report.is_valid).toBe(true);
    });

    it('fails when total marks does not match section marks', () => {
      const test = mock.getMockTestPaper();
      const invalidTest = { ...test, total_marks: 100 };
      const report = validateTestPaper(invalidTest);
      expect(report.is_valid).toBe(false);
    });
  });

  describe('Smartboard Presentation 75" Rules', () => {
    it('passes slide deck with concise bullet points', () => {
      const pres = mock.getMockPresentation();
      const report = validatePresentation(pres);
      expect(report.is_valid).toBe(true);
    });

    it('flags warning when slide text exceeds 50 words', () => {
      const pres = mock.getMockPresentation();
      const verboseSlide = {
        ...pres.slides[0],
        bullet_points: [
          new Array(60).fill('word').join(' '),
        ],
      };
      const report = validatePresentation({ ...pres, slides: [verboseSlide, ...pres.slides.slice(1)] });
      expect(report.issues.some((i) => i.field.includes('bullet_points'))).toBe(true);
    });
  });

  describe('Mind Map Graph Rules', () => {
    it('passes connected graph with valid node and central node references', () => {
      const mm = mock.getMockMindMap();
      const report = validateMindMap(mm);
      expect(report.is_valid).toBe(true);
    });

    it('fails when edge connects a non-existent node ID', () => {
      const mm = mock.getMockMindMap();
      const invalidMM = {
        ...mm,
        edges: [{ from: 'phantom_node_id', to: 'c1', relationship: 'connects' }],
      };
      const report = validateMindMap(invalidMM);
      expect(report.is_valid).toBe(false);
    });
  });

  describe('Bilingual & Devanagari Language Check', () => {
    it('detects valid Devanagari script', () => {
      expect(containsDevanagari('प्रकाश का अपवर्तन (Refraction of Light)')).toBe(true);
      expect(containsDevanagari('गणित और विज्ञान')).toBe(true);
    });

    it('rejects purely ASCII English text as Hindi', () => {
      expect(containsDevanagari('Pure English text with no devanagari')).toBe(false);
    });
  });
});
