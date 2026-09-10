import { describe, it, expect } from 'vitest';
import {
  LessonPlanSchema,
  WorksheetSchema,
  QuizSchema,
  TestPaperSchema,
  PresentationSchema,
  MindMapSchema,
  TeachingActivitySchema,
  SaathiGenieResponseSchema,
} from '../../src/lib/ai/schemas';
import { MockAIProvider } from '../../src/lib/ai/providers/mock';

describe('AI Structured Output Schemas (Zod)', () => {
  const mock = new MockAIProvider();

  it('validates a complete LessonPlan schema', () => {
    const plan = mock.getMockLessonPlan();
    const result = LessonPlanSchema.safeParse(plan);
    expect(result.success).toBe(true);
  });

  it('rejects LessonPlan with duration outside bounds', () => {
    const plan = mock.getMockLessonPlan();
    const invalidPlan = { ...plan, duration_mins: 300 }; // max 120
    const result = LessonPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });

  it('validates a complete Worksheet schema', () => {
    const sheet = mock.getMockWorksheet();
    const result = WorksheetSchema.safeParse(sheet);
    expect(result.success).toBe(true);
  });

  it('rejects Worksheet with fewer than 3 questions', () => {
    const sheet = mock.getMockWorksheet();
    const invalidSheet = { ...sheet, questions: sheet.questions.slice(0, 1) };
    const result = WorksheetSchema.safeParse(invalidSheet);
    expect(result.success).toBe(false);
  });

  it('validates a complete Quiz schema', () => {
    const quiz = mock.getMockQuiz();
    const result = QuizSchema.safeParse(quiz);
    expect(result.success).toBe(true);
  });

  it('rejects Quiz question with missing options', () => {
    const quiz = mock.getMockQuiz();
    const invalidQuiz = {
      ...quiz,
      questions: [
        {
          ...quiz.questions[0],
          options: quiz.questions[0].options.slice(0, 2), // needs 4 options
        },
      ],
    };
    const result = QuizSchema.safeParse(invalidQuiz);
    expect(result.success).toBe(false);
  });

  it('validates a complete TestPaper schema', () => {
    const testPaper = mock.getMockTestPaper();
    const result = TestPaperSchema.safeParse(testPaper);
    expect(result.success).toBe(true);
  });

  it('rejects TestPaper with invalid duration', () => {
    const testPaper = mock.getMockTestPaper();
    const invalidTest = { ...testPaper, duration_mins: 5 }; // min 15
    const result = TestPaperSchema.safeParse(invalidTest);
    expect(result.success).toBe(false);
  });

  it('validates a complete Presentation schema', () => {
    const pres = mock.getMockPresentation();
    const result = PresentationSchema.safeParse(pres);
    expect(result.success).toBe(true);
  });

  it('rejects Presentation with fewer than 4 slides', () => {
    const pres = mock.getMockPresentation();
    const invalidPres = { ...pres, slide_count: 2, slides: pres.slides.slice(0, 2) };
    const result = PresentationSchema.safeParse(invalidPres);
    expect(result.success).toBe(false);
  });

  it('validates a complete MindMap schema', () => {
    const mm = mock.getMockMindMap();
    const result = MindMapSchema.safeParse(mm);
    expect(result.success).toBe(true);
  });

  it('validates a complete TeachingActivity schema', () => {
    const act = mock.getMockTeachingActivity();
    const result = TeachingActivitySchema.safeParse(act);
    expect(result.success).toBe(true);
  });

  it('validates a complete SaathiGenie response schema', () => {
    const genie = mock.getMockSaathiGenie();
    const result = SaathiGenieResponseSchema.safeParse(genie);
    expect(result.success).toBe(true);
  });
});
