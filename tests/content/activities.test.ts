import { describe, it, expect } from 'vitest';
import { contentValidator } from '@/lib/services/contentValidator';
import { 
  TeachingActivityContentSchema, 
  ActivityArchetypeSchema 
} from '@/lib/validations/resources';

describe('Teaching Activities & Pedagogical Archetypes (Section 4, 7)', () => {
  const allArchetypes = [
    'THINK_PAIR_SHARE',
    'JIGSAW',
    'GALLERY_WALK',
    'FOUR_CORNERS',
    'ROLE_PLAY',
    'CONCEPT_ATTAINMENT',
    'FISHBOWL',
    'SOCRATIC_SEMINAR',
    'STATIONS',
    'PEER_INSTRUCTION',
  ] as const;

  it('verifies all 10 pedagogical archetypes pass schema validation', () => {
    allArchetypes.forEach((archetype) => {
      const parsed = ActivityArchetypeSchema.safeParse(archetype);
      expect(parsed.success).toBe(true);

      const activityData = {
        archetype,
        grade_level: 'Grade 8',
        subject: 'Science',
        duration_minutes: 30,
        learning_objectives: ['Understand core concepts'],
        materials_needed: ['Charts', 'Markers'],
        procedure: [
          {
            phase: 'PHASE 1',
            duration_minutes: 10,
            teacher_instruction: 'Explain context and instructions',
            student_action: 'Form groups',
          },
          {
            phase: 'PHASE 2',
            duration_minutes: 20,
            teacher_instruction: 'Guide activity',
            student_action: 'Collaborative analysis',
          },
        ],
      };

      const schemaResult = TeachingActivityContentSchema.safeParse(activityData);
      expect(schemaResult.success).toBe(true);

      const report = contentValidator.validateContent('TEACHING_ACTIVITY', activityData, 'en');
      expect(report.status).toBe('PASSED');
      expect(report.score).toBe(100);
    });
  });

  it('rejects unsupported or arbitrary archetypes', () => {
    const invalidArchetype = ActivityArchetypeSchema.safeParse('UNSUPPORTED_RANDOM_GAME');
    expect(invalidArchetype.success).toBe(false);
  });

  it('warns when total duration exceeds the 45-minute smartboard classroom period', () => {
    const excessiveActivity = {
      archetype: 'JIGSAW' as const,
      grade_level: 'Grade 9',
      subject: 'Social Science',
      duration_minutes: 75, // Exceeds 45-minute lesson limit
      learning_objectives: ['Explore chapter history'],
      procedure: [
        {
          phase: 'ROUND 1',
          duration_minutes: 75,
          teacher_instruction: 'Long continuous task',
          student_action: 'Extended reading',
        },
      ],
    };

    const report = contentValidator.validateContent('TEACHING_ACTIVITY', excessiveActivity, 'en');
    expect(report.warnings.some((w) => w.code === 'EXCESSIVE_DURATION')).toBe(true);
    expect(report.score).toBeLessThan(100);
  });

  it('fails validation if procedure contains zero teacher instructions', () => {
    const emptyProcedure = {
      archetype: 'THINK_PAIR_SHARE' as const,
      grade_level: 'Grade 8',
      subject: 'Science',
      duration_minutes: 15,
      learning_objectives: ['Objectives'],
      procedure: [
        {
          phase: 'PHASE 1',
          duration_minutes: 15,
          teacher_instruction: '', // Missing teacher step
          student_action: 'Sitting',
        },
      ],
    };

    const report = contentValidator.validateContent('TEACHING_ACTIVITY', emptyProcedure, 'en');
    expect(report.status).toBe('FAILED');
    expect(report.errors.some((e) => e.code === 'EMPTY_PROCEDURE_STEP')).toBe(true);
  });
});
