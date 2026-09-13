import { describe, it, expect } from 'vitest';
import {
  computeConceptMasteryScore,
  classifyGapSeverity,
  type ConceptEvidenceResponse,
} from '../../src/lib/services/mastery';
import { interventionService } from '../../src/lib/services/interventions';

describe('Phase 5 Academic Intelligence & Reassessment Loop Integration', () => {
  it('Executes the complete diagnostic loop: Attempt -> Gap Detected -> Remediation -> Reassessment -> Mastery Improvement', async () => {
    // 1. Initial State: Student completes initial assessment on "Irrigation"
    // Answered 4 questions: 1 correct, 3 incorrect (25% initial accuracy)
    const initialAttemptEvidence: ConceptEvidenceResponse[] = [
      { is_correct: false, answered_at: '2026-09-01T10:00:00Z' },
      { is_correct: false, answered_at: '2026-09-01T10:02:00Z' },
      { is_correct: true, answered_at: '2026-09-01T10:04:00Z' },
      { is_correct: false, answered_at: '2026-09-01T10:06:00Z' },
    ];

    const initialMastery = computeConceptMasteryScore(initialAttemptEvidence);

    // Initial evaluation verifies low score and triggers gap
    expect(initialMastery.evidenceCount).toBe(4);
    expect(initialMastery.correctCount).toBe(1);
    expect(initialMastery.incorrectCount).toBe(3);
    expect(initialMastery.confidenceLevel).toBe('MEDIUM');
    expect(initialMastery.masteryScore).toBeLessThan(40);
    expect(initialMastery.status).toBe('CRITICAL');

    // 2. Gap Detection: System flags gap requiring intervention
    const gapSeverity = classifyGapSeverity(initialMastery.masteryScore);
    expect(gapSeverity).toBe('CRITICAL');

    // 3. Teacher launches 1-click AI Remediation Generation
    const mockConceptId = '123e4567-e89b-12d3-a456-426614174000';
    const mockClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: {
                id: mockConceptId,
                name_en: 'Methods of Irrigation',
                chapter: { title_en: 'Crop Production and Management' },
              },
            }),
          }),
        }),
      }),
    } as any;

    const intervention = await interventionService.generateRemediation({
      conceptId: mockConceptId,
      gradeId: 'class-8',
      subjectId: 'science',
      language: 'en',
      observedWeakness: 'Irrigation mastery: 25% (Critical gap detected)',
    }, mockClient);

    expect(intervention).toBeDefined();
    expect(intervention.duration_mins).toBe(15);
    expect(intervention.remediation_steps.length).toBeGreaterThanOrEqual(2);
    expect(intervention.visual_anchor).toBeTruthy();
    expect(intervention.practice_questions.length).toBe(5);

    // 4. Student receives targeted 5-question practice reassessment
    // Student answers 4 out of 5 questions correctly (80% accuracy on reassessment)
    const reassessmentResponses: ConceptEvidenceResponse[] = [
      { is_correct: true, answered_at: '2026-09-02T11:00:00Z' },
      { is_correct: true, answered_at: '2026-09-02T11:02:00Z' },
      { is_correct: false, answered_at: '2026-09-02T11:04:00Z' },
      { is_correct: true, answered_at: '2026-09-02T11:06:00Z' },
      { is_correct: true, answered_at: '2026-09-02T11:08:00Z' },
    ];

    // 5. Total accumulated evidence now contains both attempts
    const accumulatedEvidence = [...initialAttemptEvidence, ...reassessmentResponses];
    const postRemediationMastery = computeConceptMasteryScore(accumulatedEvidence);

    // 6. Recalculation verifies mastery surge and confidence elevation
    expect(postRemediationMastery.evidenceCount).toBe(9);
    expect(postRemediationMastery.confidenceLevel).toBe('HIGH');
    // Recent 5 responses had 4/5 = 80%. Historical 4 responses had 1/4 = 25%.
    // Weighted score = 0.65 * 80 + 0.35 * 25 = 52.0 + 8.75 = 60.75%
    expect(postRemediationMastery.masteryScore).toBeGreaterThan(60);
    expect(postRemediationMastery.status).toBe('APPROACHING');
    expect(postRemediationMastery.masteryScore).toBeGreaterThan(initialMastery.masteryScore);

    // Gap severity reduces from CRITICAL (<40%) to MODERATE
    const updatedSeverity = classifyGapSeverity(postRemediationMastery.masteryScore);
    expect(updatedSeverity).toBe('MODERATE');
  });

  it('Closes the pedagogical loop completely: Reassessment mastery >= 75% resolves learning gap', () => {
    // Initial struggling performance: 1/5 correct = 20%
    const initialEvidence: ConceptEvidenceResponse[] = [
      { is_correct: false, answered_at: '2026-09-01T09:00:00Z' },
      { is_correct: false, answered_at: '2026-09-01T09:02:00Z' },
      { is_correct: false, answered_at: '2026-09-01T09:04:00Z' },
      { is_correct: false, answered_at: '2026-09-01T09:06:00Z' },
      { is_correct: true, answered_at: '2026-09-01T09:08:00Z' },
    ];

    const initial = computeConceptMasteryScore(initialEvidence);
    expect(initial.masteryScore).toBe(21.67);
    expect(initial.status).toBe('CRITICAL');
    expect(classifyGapSeverity(initial.masteryScore)).toBe('CRITICAL');

    // Intervention assigned and completed -> Student takes 5-question reassessment and scores 5/5 (100%)
    const reassessmentEvidence: ConceptEvidenceResponse[] = [
      { is_correct: true, answered_at: '2026-09-03T10:00:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:02:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:04:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:06:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:08:00Z' },
    ];

    // Combined timeline
    const allEvidence = [...initialEvidence, ...reassessmentEvidence];
    const postReassessment = computeConceptMasteryScore(allEvidence);

    // Recent 5 (all reassessment) = 100%. Historical 5 (initial) = 20%.
    // Deterministic 65/35 formula: 0.65 * 100 + 0.35 * 20 = 65 + 7 = 72%
    // If student takes 2 additional practice questions correctly:
    const furtherPracticeEvidence: ConceptEvidenceResponse[] = [
      { is_correct: true, answered_at: '2026-09-03T10:10:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:12:00Z' },
    ];

    const finalEvidence = [...allEvidence, ...furtherPracticeEvidence];
    const finalMastery = computeConceptMasteryScore(finalEvidence);

    // Recent 5 are all correct (100%).
    // Historical 7: 1 correct from initial + 2 correct from reassessment = 3/7 = 42.86%
    // Score: 0.65 * 100 + 0.35 * 42.86 = 65 + 15.0 = 80.0%
    expect(finalMastery.masteryScore).toBeGreaterThanOrEqual(75);
    expect(finalMastery.status).toBe('PROFICIENT');
    expect(classifyGapSeverity(finalMastery.masteryScore)).toBe('ON_TRACK');
  });
});
