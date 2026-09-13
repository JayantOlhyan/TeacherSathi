import { describe, it, expect } from 'vitest';
import {
  classifyGapSeverity,
  computeConceptMasteryScore,
  type ConceptEvidenceResponse,
} from '../../src/lib/services/mastery';

describe('Learning Gap Detection & Severity Rules', () => {
  it('Classifies scores below 40% as CRITICAL gap severity', () => {
    expect(classifyGapSeverity(0)).toBe('CRITICAL');
    expect(classifyGapSeverity(25.5)).toBe('CRITICAL');
    expect(classifyGapSeverity(39.99)).toBe('CRITICAL');
  });

  it('Classifies scores from 40% to 59.99% as HIGH gap severity', () => {
    expect(classifyGapSeverity(40.0)).toBe('HIGH');
    expect(classifyGapSeverity(48.0)).toBe('HIGH');
    expect(classifyGapSeverity(59.99)).toBe('HIGH');
  });

  it('Classifies scores from 60% to 74.99% as MODERATE gap severity', () => {
    expect(classifyGapSeverity(60.0)).toBe('MODERATE');
    expect(classifyGapSeverity(68.5)).toBe('MODERATE');
    expect(classifyGapSeverity(74.99)).toBe('MODERATE');
  });

  it('Classifies scores 75% and above as ON_TRACK (No intervention gap)', () => {
    expect(classifyGapSeverity(75.0)).toBe('ON_TRACK');
    expect(classifyGapSeverity(85.0)).toBe('ON_TRACK');
    expect(classifyGapSeverity(100.0)).toBe('ON_TRACK');
  });

  it('Enforces minimum evidence rule: 1 single incorrect answer does not flag HIGH or MEDIUM confidence gap', () => {
    const singleWrong: ConceptEvidenceResponse[] = [
      { is_correct: false, answered_at: '2026-09-01T10:00:00Z' },
    ];
    const res = computeConceptMasteryScore(singleWrong);

    expect(res.evidenceCount).toBe(1);
    expect(res.confidenceLevel).toBe('LOW'); // Insufficient evidence to justify definitive intervention
    expect(res.masteryScore).toBe(0);
  });
});
