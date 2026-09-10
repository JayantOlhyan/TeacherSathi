import { describe, it, expect, beforeEach } from 'vitest';
import { executeGeneration, AIGenerationError } from '../../src/lib/ai/pipeline/generator';
import { rateLimiter } from '../../src/lib/ai/pipeline/rateLimiter';
import { setAIProvider, MockAIProvider } from '../../src/lib/ai/providers';
import type { GenerationRequest, CurriculumContext } from '../../src/lib/ai/types';
import type {
  LessonPlan,
  Worksheet,
  Quiz,
  TestPaper,
  Presentation,
  MindMap,
  TeachingActivity,
  SaathiGenieResponse,
} from '../../src/lib/ai/schemas';

describe('AI Generation Engine Pipeline', () => {
  const sampleCurriculum: CurriculumContext = {
    grade_id: 'grade-10',
    grade_name: 'Class 10',
    subject_id: 'subject-science',
    subject_name_en: 'Science',
    subject_name_hi: 'विज्ञान',
    book_id: 'book-10-science',
    book_title: 'NCERT Class 10 Science',
    chapter_id: 'ch-10-light',
    chapter_number: 10,
    chapter_title_en: 'Light - Reflection and Refraction',
    chapter_title_hi: 'प्रकाश - परावर्तन तथा अपवर्तन',
    concepts: [
      {
        id: 'c1',
        name_en: 'Laws of Reflection',
        name_hi: 'परावर्तन के नियम',
        bloom_level: 'UNDERSTAND',
        learning_outcomes: ['State the laws of reflection'],
      },
    ],
  };

  const createMockDbClient = (): any => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
            single: async () => ({ data: null, error: null }),
          }),
          maybeSingle: async () => ({ data: null, error: null }),
          single: async () => ({ data: null, error: null }),
        }),
        maybeSingle: async () => ({ data: null, error: null }),
        single: async () => ({ data: null, error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: { id: 'mock-res-123' }, error: null }),
        }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
  });

  let mockDb: any;

  beforeEach(() => {
    rateLimiter.reset();
    setAIProvider(new MockAIProvider());
    mockDb = createMockDbClient();
  });

  it('generates a structured Lesson Plan end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'lesson-plan',
      curriculum: sampleCurriculum,
      difficulty: 'MEDIUM',
      duration_mins: 45,
    };

    const res = await executeGeneration<LessonPlan>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.title).toBeDefined();
    expect(res.data.learning_objectives.length).toBeGreaterThanOrEqual(2);
    expect(res.telemetry.provider).toBe('mock');
    expect(res.resource_id).toBe('mock-res-123');
  });

  it('generates a structured Worksheet end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'worksheet',
      curriculum: sampleCurriculum,
      difficulty: 'MEDIUM',
      quantity: 3,
      total_marks: 10,
    };

    const res = await executeGeneration<Worksheet>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.total_marks).toBe(10);
    expect(res.data.questions.length).toBeGreaterThanOrEqual(3);
  });

  it('generates a structured Quiz end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'quiz',
      curriculum: sampleCurriculum,
      difficulty: 'MEDIUM',
      quantity: 2,
    };

    const res = await executeGeneration<Quiz>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.questions.length).toBeGreaterThanOrEqual(1);
    expect(res.data.questions[0].options.length).toBe(4);
  });

  it('generates a structured Test Paper end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'test-paper',
      curriculum: sampleCurriculum,
      difficulty: 'HARD',
      total_marks: 20,
    };

    const res = await executeGeneration<TestPaper>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.total_marks).toBe(20);
    expect(res.data.sections.length).toBeGreaterThanOrEqual(1);
  });

  it('generates a Smartboard Presentation end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'presentation',
      curriculum: sampleCurriculum,
      slide_count: 4,
    };

    const res = await executeGeneration<Presentation>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.slides.length).toBe(4);
  });

  it('generates a Mind Map end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'mind-map',
      curriculum: sampleCurriculum,
    };

    const res = await executeGeneration<MindMap>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.central_node).toBeDefined();
    expect(res.data.nodes.length).toBeGreaterThanOrEqual(3);
    expect(res.data.edges.length).toBeGreaterThanOrEqual(2);
  });

  it('generates a Teaching Activity end-to-end', async () => {
    const req: GenerationRequest = {
      product_type: 'teaching-activity',
      curriculum: sampleCurriculum,
    };

    const res = await executeGeneration<TeachingActivity>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.step_by_step_procedure.length).toBeGreaterThanOrEqual(2);
  });

  it('generates Saathi Genie pedagogical response', async () => {
    const req: GenerationRequest = {
      product_type: 'saathi-genie',
      curriculum: sampleCurriculum,
      teacher_instructions: 'Give me a 5-minute recap activity',
    };

    const res = await executeGeneration<SaathiGenieResponse>(req, 'test-teacher-1', null, mockDb);
    expect(res.success).toBe(true);
    expect(res.data.pedagogical_answer).toBeDefined();
    expect(res.data.actionable_steps.length).toBeGreaterThanOrEqual(1);
  });

  it('deduplicates repeat requests using idempotency_key', async () => {
    const idempotencyKey = 'idem-req-unique-123';
    const req: GenerationRequest = {
      product_type: 'quiz',
      curriculum: sampleCurriculum,
      idempotency_key: idempotencyKey,
    };

    const res1 = await executeGeneration<Quiz>(req, 'teacher-idem', null, mockDb);
    const res2 = await executeGeneration<Quiz>(req, 'teacher-idem', null, mockDb);

    expect(res1.telemetry.generation_id).toBe(res2.telemetry.generation_id);
  });

  it('enforces server-side rate limiting on rapid requests', async () => {
    const req: GenerationRequest = {
      product_type: 'quiz',
      curriculum: sampleCurriculum,
    };

    const teacherId = 'rapid-clicker-teacher';

    // 5 requests allowed
    for (let i = 0; i < 5; i++) {
      await executeGeneration<Quiz>(req, teacherId, null, mockDb);
    }

    // 6th request should fail with RATE_LIMITED
    await expect(executeGeneration<Quiz>(req, teacherId, null, mockDb)).rejects.toThrowError(
      expect.objectContaining({
        code: 'RATE_LIMITED',
      })
    );
  });

  it('fails with validation error when mock provider simulates corrupted JSON', async () => {
    // Set mock provider to simulate failure
    setAIProvider(new MockAIProvider(true));

    const req: GenerationRequest = {
      product_type: 'quiz',
      curriculum: sampleCurriculum,
    };

    await expect(executeGeneration<Quiz>(req, 'test-teacher-fail', null, mockDb)).rejects.toThrowError(
      AIGenerationError
    );
  });
});
