import { describe, it, expect } from 'vitest';
import {
  resolveContextBadges,
  getContextualPrompts,
  type SaathiContext,
} from '../../src/lib/ai/saathiContext';
import {
  isHindiOrHinglish,
  querySaathi,
} from '../../src/lib/ai/saathiService';

describe('Phase 16 — Saathi / Teacher Co-Pilot UX', () => {
  describe('Context Hierarchy Resolution (resolveContextBadges)', () => {
    it('resolves full context hierarchy for workspace: Class -> Subject -> Chapter', () => {
      const context: SaathiContext = {
        grade: 'class-8',
        gradeName: 'Class 8',
        subject: 'science',
        subjectName: 'Science',
        chapter: 'chapter-3',
        chapterTitle: 'Heat and Temperature',
        chapterNumber: 3,
        screen: 'workspace',
      };

      const badges = resolveContextBadges(context);
      expect(badges).toHaveLength(3);
      expect(badges[0]).toEqual({ id: 'grade', label: 'Class 8', type: 'grade' });
      expect(badges[1]).toEqual({ id: 'subject', label: 'Science', type: 'subject' });
      expect(badges[2]).toEqual({ id: 'chapter', label: 'Ch 3', type: 'chapter' });
    });

    it('resolves active slide context hierarchy for 75" Classroom Mode', () => {
      const context: SaathiContext = {
        gradeName: 'Class 8',
        subjectName: 'Science',
        chapterTitle: 'Heat',
        chapterNumber: 3,
        slideIndex: 1,
        slideTitle: 'Conduction & Thermal Equilibrium',
        screen: 'classroom',
      };

      const badges = resolveContextBadges(context);
      expect(badges).toHaveLength(4);
      expect(badges[3]).toEqual({
        id: 'slide',
        label: 'Slide 2 - Conduction & Thermal Equilibrium',
        type: 'slide',
      });
    });

    it('resolves learning gap context hierarchy for Analytics Hub', () => {
      const context: SaathiContext = {
        gradeName: 'Class 8',
        subjectName: 'Science',
        chapterTitle: 'Heat',
        chapterNumber: 3,
        learningGapId: 'gap-boiling-evaporation',
        conceptName: 'Boiling vs Evaporation',
        screen: 'analytics',
        observedData: {
          totalStudents: 38,
          incorrectCount: 14,
          incorrectPercentage: 37,
          keyMisconception: 'Boiling vs Evaporation',
        },
      };

      const badges = resolveContextBadges(context);
      expect(badges).toHaveLength(4);
      expect(badges[3]).toEqual({
        id: 'gap',
        label: 'Learning Gap - Boiling vs Evaporation',
        type: 'gap',
      });
    });

    it('provides sensible fallbacks when identifiers are omitted', () => {
      const emptyContext: SaathiContext = {};
      const badges = resolveContextBadges(emptyContext);

      expect(badges).toHaveLength(2);
      expect(badges[0].label).toBe('Class 8');
      expect(badges[1].label).toBe('Science');
    });
  });

  describe('Context-Driven Quick Action Prompts (getContextualPrompts)', () => {
    it('returns workspace-specific preparation prompts', () => {
      const context: SaathiContext = {
        screen: 'workspace',
        conceptName: 'Photosynthesis',
      };
      const prompts = getContextualPrompts(context);

      expect(prompts).toBeDefined();
      expect(prompts.length).toBeGreaterThanOrEqual(4);
      expect(prompts.some((p) => p.includes('Photosynthesis'))).toBe(true);
      expect(prompts.some((p) => p.includes('Hindi'))).toBe(true);
    });

    it('returns 75" classroom-specific live teaching prompts', () => {
      const context: SaathiContext = {
        screen: 'classroom',
        slideTitle: 'Latent Heat of Vaporisation',
      };
      const prompts = getContextualPrompts(context);

      expect(prompts).toBeDefined();
      expect(prompts.some((p) => p.includes('simple words') || p.includes('analogy'))).toBe(true);
      expect(prompts.some((p) => p.includes('quick check question') || p.includes('check questions'))).toBe(true);
    });

    it('returns diagnostic analytics prompts for learning gaps', () => {
      const context: SaathiContext = {
        screen: 'analytics',
        conceptName: 'Thermal Expansion',
      };
      const prompts = getContextualPrompts(context);

      expect(prompts).toBeDefined();
      expect(prompts.some((p) => p.includes('10-minute micro-lesson') || p.includes('intervention'))).toBe(true);
      expect(prompts.some((p) => p.includes('misconception'))).toBe(true);
    });

    it('returns creation prompts for Resource Studio', () => {
      const context: SaathiContext = {
        screen: 'creation',
        chapterTitle: 'Light',
      };
      const prompts = getContextualPrompts(context);

      expect(prompts).toBeDefined();
      expect(prompts.some((p) => p.includes('lesson plan') || p.includes('activity'))).toBe(true);
    });
  });

  describe('Bilingual Hindi / Hinglish Query Detection (isHindiOrHinglish)', () => {
    it('detects Devanagari Hindi text', () => {
      expect(isHindiOrHinglish('इसे हिंदी में समझाओ')).toBe(true);
      expect(isHindiOrHinglish('बच्चों को क्या उदाहरण दें?')).toBe(true);
      expect(isHindiOrHinglish('कक्षा ८ विज्ञान')).toBe(true);
    });

    it('detects colloquial Romanized Hinglish phrasing', () => {
      expect(isHindiOrHinglish('baccho ko kaise samjhao')).toBe(true);
      expect(isHindiOrHinglish('isko simple hindi mein batao')).toBe(true);
      expect(isHindiOrHinglish('ek aasan activity banao')).toBe(true);
      expect(isHindiOrHinglish('iska matlab kya hai')).toBe(true);
    });

    it('returns false for pure English pedagogical questions', () => {
      expect(isHindiOrHinglish('Explain this simply in 2 sentences')).toBe(false);
      expect(isHindiOrHinglish('Give me an everyday village analogy')).toBe(false);
      expect(isHindiOrHinglish('Draft 3 formative assessment questions for slide 2')).toBe(false);
    });
  });

  describe('Saathi Query & Response Structuring (querySaathi)', () => {
    it('strictly separates Observed Data from Suggested Intervention for learning gaps', async () => {
      const analyticsContext: SaathiContext = {
        gradeName: 'Class 8',
        subjectName: 'Science',
        chapterTitle: 'Heat',
        learningGapId: 'gap-evap-101',
        conceptName: 'Boiling vs Evaporation',
        screen: 'analytics',
        observedData: {
          totalStudents: 38,
          incorrectCount: 14,
          incorrectPercentage: 37,
          keyMisconception: 'Confusion between surface evaporation and bulk boiling point',
        },
      };

      const result = await querySaathi('Suggest a micro-lesson intervention', analyticsContext);

      // Verify Observed Data preservation
      expect(result.observedData).toBeDefined();
      expect(result.observedData?.totalStudents).toBe(38);
      expect(result.observedData?.incorrectCount).toBe(14);
      expect(result.observedData?.incorrectPercentage).toBe(37);

      // Verify Suggested Intervention generation
      expect(result.suggestedIntervention).toBeDefined();
      expect(typeof result.suggestedIntervention).toBe('string');
      expect(result.suggestedIntervention?.length).toBeGreaterThan(10);

      // Verify pedagogical rationale & concrete teacher action
      expect(result.whyThisHelps).toBeDefined();
      expect(result.tryThis).toBeDefined();

      // Verify Teacher Authority: all outputs are drafts requiring teacher confirmation
      expect(result.isDraft).toBe(true);
      expect(result.actions).toContain('use');
      expect(result.actions).toContain('edit');
      expect(result.actions).toContain('try_another');
    });

    it('returns structured bilingual Hindi response when requested', async () => {
      const hindiContext: SaathiContext = {
        gradeName: 'Class 8',
        subjectName: 'Science',
        chapterTitle: 'प्रकाश (Light)',
        conceptName: 'परावर्तन (Reflection)',
        screen: 'workspace',
      };

      const result = await querySaathi('इसे हिंदी में समझाओ', hindiContext);

      expect(result.language).toBe('hi');
      expect(result.answer).toBeDefined();
      expect(result.whyThisHelps).toBeDefined();
      expect(result.tryThis).toBeDefined();
      expect(result.isDraft).toBe(true);
    });

    it('always preserves Teacher Authority and provides edit/use/save actions', async () => {
      const context: SaathiContext = {
        gradeName: 'Class 9',
        subjectName: 'Science',
        chapterTitle: 'Motion',
        screen: 'workspace',
      };

      const result = await querySaathi('Give me an everyday analogy for acceleration', context);

      expect(result.isDraft).toBe(true);
      expect(result.actions).toContain('use');
      expect(result.actions).toContain('edit');
      expect(result.curriculumReference).toContain('Class 9');
    });
  });
});
