import { describe, it, expect } from 'vitest';
import { classifyConfidence } from '../../src/lib/services/mastery';

describe('Evidence Confidence Threshold Rules', () => {
  it('0 responses yields INSUFFICIENT_EVIDENCE', () => {
    expect(classifyConfidence(0)).toBe('INSUFFICIENT_EVIDENCE');
  });

  it('1 to 2 responses yields LOW confidence', () => {
    expect(classifyConfidence(1)).toBe('LOW');
    expect(classifyConfidence(2)).toBe('LOW');
  });

  it('3 to 5 responses yields MEDIUM confidence', () => {
    expect(classifyConfidence(3)).toBe('MEDIUM');
    expect(classifyConfidence(4)).toBe('MEDIUM');
    expect(classifyConfidence(5)).toBe('MEDIUM');
  });

  it('6 or more responses yields HIGH confidence', () => {
    expect(classifyConfidence(6)).toBe('HIGH');
    expect(classifyConfidence(12)).toBe('HIGH');
    expect(classifyConfidence(50)).toBe('HIGH');
  });
});
