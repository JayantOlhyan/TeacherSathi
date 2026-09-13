import { describe, it, expect } from 'vitest';
import { calculateObservedDifficulty } from '../../src/lib/services/mastery';

describe('Question Observed Difficulty Signal', () => {
  it('Returns INSUFFICIENT_DATA when attempt count is 0', () => {
    expect(calculateObservedDifficulty(0, 0)).toBe('INSUFFICIENT_DATA');
  });

  it('Calculates EASY observed difficulty for accuracy >= 85%', () => {
    // 90/100 = 90%
    expect(calculateObservedDifficulty(100, 90)).toBe('EASY');
    // 17/20 = 85%
    expect(calculateObservedDifficulty(20, 17)).toBe('EASY');
  });

  it('Calculates MODERATE observed difficulty for accuracy 70% to 84.9%', () => {
    // 15/20 = 75%
    expect(calculateObservedDifficulty(20, 15)).toBe('MODERATE');
    // 70/100 = 70%
    expect(calculateObservedDifficulty(100, 70)).toBe('MODERATE');
  });

  it('Calculates DIFFICULT observed difficulty for accuracy 50% to 69.9%', () => {
    // 12/20 = 60%
    expect(calculateObservedDifficulty(20, 12)).toBe('DIFFICULT');
    // 50/100 = 50%
    expect(calculateObservedDifficulty(100, 50)).toBe('DIFFICULT');
  });

  it('Calculates VERY_DIFFICULT observed difficulty for accuracy < 50%', () => {
    // 9/31 = 29.03% (Matching prompt specification Question 18: 31 attempts, 9 correct -> High / Very Difficult)
    expect(calculateObservedDifficulty(31, 9)).toBe('VERY_DIFFICULT');
    // 2/10 = 20%
    expect(calculateObservedDifficulty(10, 2)).toBe('VERY_DIFFICULT');
  });
});
