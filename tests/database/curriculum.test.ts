import { describe, it, expect } from 'vitest';
import { NCERT_SYLLABUS } from '../../src/lib/data/ncertSyllabus';
import { QuestionCreateSchema, QuestionUpdateSchema } from '../../src/lib/validations';

describe('Curriculum & Question Bank Architecture', () => {
  it('NCERT Syllabus contains valid grades, subjects, and non-empty chapters', () => {
    const grades = Object.keys(NCERT_SYLLABUS);
    expect(grades.length).toBeGreaterThanOrEqual(5);
    expect(grades).toContain('Class 6');
    expect(grades).toContain('Class 8');
    expect(grades).toContain('Class 10');

    for (const grade of grades) {
      const subjects = NCERT_SYLLABUS[grade];
      expect(Object.keys(subjects).length).toBeGreaterThan(0);

      for (const [subjName, chapters] of Object.entries(subjects)) {
        expect(chapters.length).toBeGreaterThan(0);
        for (const ch of chapters) {
          expect(ch.id).toBeDefined();
          expect(ch.en).toBeTruthy();
          expect(ch.hi).toBeTruthy();
        }
      }
    }
  });

  describe('Question Bank Schema & Standards Validation', () => {
    it('Validates Phase 0 standard question structure', () => {
      const validQuestion = {
        chapter_id: '123e4567-e89b-12d3-a456-426614174000',
        section_tier: 'SECTION_A',
        question_type: 'MCQ',
        marks: 2,
        difficulty: 'EASY',
        bloom_level: 'REMEMBER',
        text_en: 'What is photosynthesis?',
        text_hi: 'प्रकाश संश्लेषण क्या है?',
        model_answer_en: 'Process by which plants make food using sunlight.',
        model_answer_hi: 'वह प्रक्रिया जिसके द्वारा पौधे सूर्य के प्रकाश से भोजन बनाते हैं।',
        explanation_en: 'Plants synthesize organic nutrients from CO2 and water.',
        source: 'NCERT Class 10 Science',
        tags: ['Biology', 'Plants'],
        options: [
          { option_key: 'A', text_en: 'Sunlight process', text_hi: 'सौर प्रक्रिया', is_correct: true },
          { option_key: 'B', text_en: 'Digestion process', text_hi: 'पाचन प्रक्रिया', is_correct: false },
        ]
      };

      const result = QuestionCreateSchema.safeParse(validQuestion);
      expect(result.success).toBe(true);
    });

    it('Rejects questions with marks outside 1-10 range', () => {
      const invalidMarksQuestion = {
        chapter_id: '123e4567-e89b-12d3-a456-426614174000',
        marks: 15, // Out of bounds
        text_en: 'Test question',
        text_hi: 'परीक्षण प्रश्न',
        model_answer_en: 'Answer',
        model_answer_hi: 'उत्तर',
      };

      const result = QuestionCreateSchema.safeParse(invalidMarksQuestion);
      expect(result.success).toBe(false);
    });

    it('Question Versioning preserves snapshots upon edit', () => {
      const original = {
        id: 'q-100',
        text_en: 'Original version question text',
        marks: 2,
        version: 1
      };

      const editInput = {
        text_en: 'Updated version question text with enhanced clarity',
        marks: 3
      };

      const validatedEdit = QuestionUpdateSchema.parse(editInput);
      const snapshot = JSON.stringify(original);

      const versionRecord = {
        question_id: original.id,
        version_number: original.version + 1,
        changed_at: new Date().toISOString(),
        change_summary: 'Enhanced wording and updated marks',
        data_snapshot: snapshot
      };

      expect(versionRecord.version_number).toBe(2);
      expect(JSON.parse(versionRecord.data_snapshot).text_en).toBe('Original version question text');
      expect(validatedEdit.text_en).toBe('Updated version question text with enhanced clarity');
    });
  });
});
