import { describe, it, expect } from 'vitest';
import {
  computeConceptMasteryScore,
  type ConceptEvidenceResponse,
} from '../../src/lib/services/mastery';

describe('Deterministic Mastery Recomputation & Idempotency', () => {
  it('Running calculation twice on identical data produces the exact same output (Idempotency)', () => {
    const responses: ConceptEvidenceResponse[] = [
      { is_correct: true, answered_at: '2026-09-01T10:00:00Z' },
      { is_correct: false, answered_at: '2026-09-02T10:00:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:00:00Z' },
      { is_correct: false, answered_at: '2026-09-04T10:00:00Z' },
      { is_correct: true, answered_at: '2026-09-05T10:00:00Z' },
    ];

    const run1 = computeConceptMasteryScore(responses);
    const run2 = computeConceptMasteryScore(responses);

    expect(run1.masteryScore).toBe(run2.masteryScore);
    expect(run1.confidenceLevel).toBe(run2.confidenceLevel);
    expect(run1.status).toBe(run2.status);
    expect(run1.recentAccuracy).toBe(run2.recentAccuracy);
    expect(run1.historicalAccuracy).toBe(run2.historicalAccuracy);
    expect(run1.explanation).toBe(run2.explanation);
  });

  it('Is order-invariant regarding input array shuffling (deterministic chronological sort)', () => {
    const responsesChronological: ConceptEvidenceResponse[] = [
      { is_correct: false, answered_at: '2026-09-01T10:00:00Z' },
      { is_correct: false, answered_at: '2026-09-02T10:00:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:00:00Z' },
      { is_correct: true, answered_at: '2026-09-04T10:00:00Z' },
    ];

    const responsesShuffled: ConceptEvidenceResponse[] = [
      { is_correct: true, answered_at: '2026-09-04T10:00:00Z' },
      { is_correct: false, answered_at: '2026-09-01T10:00:00Z' },
      { is_correct: true, answered_at: '2026-09-03T10:00:00Z' },
      { is_correct: false, answered_at: '2026-09-02T10:00:00Z' },
    ];

    const runOrdered = computeConceptMasteryScore(responsesChronological);
    const runShuffled = computeConceptMasteryScore(responsesShuffled);

    expect(runOrdered.masteryScore).toBe(runShuffled.masteryScore);
    expect(runOrdered.recentAccuracy).toBe(runShuffled.recentAccuracy);
    expect(runOrdered.historicalAccuracy).toBe(runShuffled.historicalAccuracy);
  });

  it('Filters out unanswered questions (is_correct === null) from evidence base', () => {
    const responsesWithUnanswered: ConceptEvidenceResponse[] = [
      { is_correct: true, answered_at: '2026-09-01T10:00:00Z' },
      { is_correct: null, answered_at: '2026-09-02T10:00:00Z' }, // Unanswered
      { is_correct: true, answered_at: '2026-09-03T10:00:00Z' },
    ];

    const result = computeConceptMasteryScore(responsesWithUnanswered);
    expect(result.evidenceCount).toBe(2);
    expect(result.masteryScore).toBe(100);
  });
});
