import { describe, it, expect, beforeEach } from 'vitest';
import { featureFlags } from '@/lib/services/featureFlags';

describe('Phase 10 — Hierarchical Feature Flags Engine', () => {
  beforeEach(() => {
    featureFlags.reset();
  });

  it('evaluates platform-wide 100% rollout flags as enabled', async () => {
    const isAiGenieEnabled = await featureFlags.isEnabled('ai_genie_v2');
    expect(isAiGenieEnabled).toBe(true);
  });

  it('disables flags immediately when kill-switch is activated', async () => {
    // 1. Initially enabled
    expect(await featureFlags.isEnabled('ai_genie_v2')).toBe(true);

    // 2. Kill-switch activated
    await featureFlags.setFlag({
      flagKey: 'ai_genie_v2',
      isEnabled: false,
    });

    expect(await featureFlags.isEnabled('ai_genie_v2')).toBe(false);
  });

  it('evaluates explicit target ID whitelists', async () => {
    await featureFlags.setFlag({
      flagKey: 'experimental_descriptive_grading',
      isEnabled: true,
      scope: 'SCHOOL',
      targetIds: ['school_delhi_01', 'school_delhi_02'],
      rolloutPercentage: 0,
    });

    // Whitelisted schools
    expect(
      await featureFlags.isEnabled('experimental_descriptive_grading', {
        entityId: 'school_delhi_01',
      })
    ).toBe(true);

    // Non-whitelisted school
    expect(
      await featureFlags.isEnabled('experimental_descriptive_grading', {
        entityId: 'school_mumbai_05',
      })
    ).toBe(false);
  });

  it('enforces hierarchical scope matching (STATE, DISTRICT, SCHOOL)', async () => {
    await featureFlags.setFlag({
      flagKey: 'state_board_sync',
      isEnabled: true,
      scope: 'STATE',
      targetIds: ['DL', 'HR'], // Delhi and Haryana
      rolloutPercentage: 100,
    });

    // Matching state
    expect(
      await featureFlags.isEnabled('state_board_sync', {
        scope: 'STATE',
        scopeId: 'DL',
      })
    ).toBe(true);

    // Non-matching state
    expect(
      await featureFlags.isEnabled('state_board_sync', {
        scope: 'STATE',
        scopeId: 'KA',
      })
    ).toBe(false);

    // Scope mismatch (school scope trying to match state flag)
    expect(
      await featureFlags.isEnabled('state_board_sync', {
        scope: 'SCHOOL',
        scopeId: 'DL',
      })
    ).toBe(false);
  });

  it('deterministically hashes percentage rollouts', async () => {
    await featureFlags.setFlag({
      flagKey: 'new_smartboard_theme',
      isEnabled: true,
      scope: 'PLATFORM',
      targetIds: [],
      rolloutPercentage: 50, // 50% rollout
    });

    const results: boolean[] = [];
    for (let i = 0; i < 100; i++) {
      const res = await featureFlags.isEnabled('new_smartboard_theme', {
        entityId: `student_user_${i}`,
      });
      results.push(res);
    }

    const enabledCount = results.filter(Boolean).length;
    // For 100 pseudo-random keys with 50% rollout, expect between 30 and 70 enabled
    expect(enabledCount).toBeGreaterThan(25);
    expect(enabledCount).toBeLessThan(75);

    // Deterministic: repeated call for same entity produces same result
    const check1 = await featureFlags.isEnabled('new_smartboard_theme', { entityId: 'student_user_42' });
    const check2 = await featureFlags.isEnabled('new_smartboard_theme', { entityId: 'student_user_42' });
    expect(check1).toBe(check2);
  });
});
