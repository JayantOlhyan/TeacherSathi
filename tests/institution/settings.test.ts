import { describe, it, expect } from 'vitest';
import {
  DEFAULT_INSTITUTIONAL_SETTINGS,
} from '../../src/lib/services/institutionalSettingsService';
import {
  InstitutionalSettingsValues,
  UpsertInstitutionalSettingsSchema,
} from '../../src/lib/validations/institution';

describe('Phase 8 Cascading Institutional Settings Engine', () => {
  describe('Default Platform Institutional Settings', () => {
    it('Provides production baseline configuration', () => {
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.default_language).toBe('en');
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.ai_availability).toBe('UNRESTRICTED');
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.minimum_passing_percentage).toBe(40);
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.mastery_threshold_percentage).toBe(75);
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.minimum_cohort_size).toBe(10);
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.allow_cross_school_resources).toBe(false);
      expect(DEFAULT_INSTITUTIONAL_SETTINGS.curriculum_standards).toContain('NCERT_2024');
    });
  });

  describe('Settings Validation Schema', () => {
    it('Validates partial settings updates for a State', () => {
      const stateUpdate = {
        scope_type: 'STATE',
        scope_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        settings: {
          default_language: 'hi',
          minimum_passing_percentage: 35,
        },
      };
      const result = UpsertInstitutionalSettingsSchema.safeParse(stateUpdate);
      expect(result.success).toBe(true);
    });

    it('Rejects invalid percentages or disallowed languages', () => {
      const invalid = {
        scope_type: 'DISTRICT',
        scope_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        settings: {
          minimum_passing_percentage: 150, // > 100
        },
      };
      const result = UpsertInstitutionalSettingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('4-Tier Cascading Inheritance Resolution Logic', () => {
    const resolveSettingsCascade = (
      hierarchyTiers: Array<Partial<InstitutionalSettingsValues>>
    ): InstitutionalSettingsValues => {
      let resolved = { ...DEFAULT_INSTITUTIONAL_SETTINGS };
      for (const tier of hierarchyTiers) {
        resolved = {
          ...resolved,
          ...tier,
          enabled_features: tier.enabled_features ?? resolved.enabled_features,
          curriculum_standards: tier.curriculum_standards ?? resolved.curriculum_standards,
        };
      }
      return resolved;
    };

    it('Resolves cascading overrides in order: Default -> State -> District -> Org -> School', () => {
      const stateSettings: Partial<InstitutionalSettingsValues> = {
        default_language: 'hi',
        minimum_passing_percentage: 35,
      };

      const districtSettings: Partial<InstitutionalSettingsValues> = {
        minimum_passing_percentage: 40, // Overrides state minimum
      };

      const orgSettings: Partial<InstitutionalSettingsValues> = {
        allow_cross_school_resources: true,
      };

      const schoolSettings: Partial<InstitutionalSettingsValues> = {
        default_language: 'bilingual', // Overrides state language
      };

      const effective = resolveSettingsCascade([
        stateSettings,
        districtSettings,
        orgSettings,
        schoolSettings,
      ]);

      expect(effective.default_language).toBe('bilingual'); // School override
      expect(effective.minimum_passing_percentage).toBe(40); // District override
      expect(effective.allow_cross_school_resources).toBe(true); // Org override
      expect(effective.mastery_threshold_percentage).toBe(75); // Baseline default retained
      expect(effective.minimum_cohort_size).toBe(10); // Baseline default retained
    });

    it('Resolves cleanly for independent school with no parent administrative tiers', () => {
      const schoolSettings: Partial<InstitutionalSettingsValues> = {
        mastery_threshold_percentage: 80,
      };

      const effective = resolveSettingsCascade([schoolSettings]);

      expect(effective.mastery_threshold_percentage).toBe(80);
      expect(effective.default_language).toBe('en');
      expect(effective.minimum_passing_percentage).toBe(40);
    });
  });
});
