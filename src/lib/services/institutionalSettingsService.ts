import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  InstitutionalScope,
  InstitutionalSettingsValues,
  UpsertInstitutionalSettingsInput,
  MINIMUM_COHORT_THRESHOLD,
} from '../validations/institution';

export const DEFAULT_INSTITUTIONAL_SETTINGS: InstitutionalSettingsValues = {
  default_language: 'en',
  enabled_features: [
    'ai_generation',
    'smartboard',
    'assessments',
    'remediation',
    'analytics',
  ],
  ai_availability: 'UNRESTRICTED',
  minimum_passing_percentage: 40,
  mastery_threshold_percentage: 75,
  minimum_cohort_size: MINIMUM_COHORT_THRESHOLD,
  allow_cross_school_resources: false,
  curriculum_standards: ['NCERT_2024'],
};

export const institutionalSettingsService = {
  /**
   * Get settings for a specific scope entity without inheritance.
   */
  async getSettingsForScope(
    scopeType: InstitutionalScope,
    scopeId: string,
    client: SupabaseClient = defaultClient
  ): Promise<InstitutionalSettingsValues | null> {
    const { data, error } = await client
      .from('institutional_settings')
      .select('settings')
      .eq('scope_type', scopeType)
      .eq('scope_id', scopeId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      ...DEFAULT_INSTITUTIONAL_SETTINGS,
      ...(data.settings as Partial<InstitutionalSettingsValues>),
    };
  },

  /**
   * Upsert settings for a specific scope.
   */
  async upsertSettings(
    input: UpsertInstitutionalSettingsInput,
    updatedByProfileId?: string,
    client: SupabaseClient = defaultClient
  ): Promise<InstitutionalSettingsValues> {
    const { data: existing } = await client
      .from('institutional_settings')
      .select('settings')
      .eq('scope_type', input.scope_type)
      .eq('scope_id', input.scope_id)
      .maybeSingle();

    const mergedSettings = {
      ...DEFAULT_INSTITUTIONAL_SETTINGS,
      ...((existing?.settings as Partial<InstitutionalSettingsValues>) || {}),
      ...input.settings,
    };

    const { error } = await client
      .from('institutional_settings')
      .upsert(
        [
          {
            scope_type: input.scope_type,
            scope_id: input.scope_id,
            settings: mergedSettings,
            updated_by: updatedByProfileId || null,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'scope_type,scope_id' }
      );

    if (error) throw new Error(`Failed to save institutional settings: ${error.message}`);
    return mergedSettings;
  },

  /**
   * Resolves effective institutional settings for a school by walking up the hierarchy:
   * Defaults -> State -> District -> Organization -> School.
   */
  async resolveSchoolEffectiveSettings(
    schoolId: string,
    client: SupabaseClient = defaultClient
  ): Promise<InstitutionalSettingsValues> {
    const { data: school, error: schoolError } = await client
      .from('schools')
      .select('id, state_id, district_id, organization_id')
      .eq('id', schoolId)
      .maybeSingle();

    if (schoolError || !school) {
      return DEFAULT_INSTITUTIONAL_SETTINGS;
    }

    // Build hierarchy query targets
    const queries: Array<{ type: InstitutionalScope; id: string }> = [];
    if (school.state_id) queries.push({ type: 'STATE', id: school.state_id });
    if (school.district_id) queries.push({ type: 'DISTRICT', id: school.district_id });
    if (school.organization_id) queries.push({ type: 'ORGANIZATION', id: school.organization_id });
    queries.push({ type: 'SCHOOL', id: schoolId });

    const settingsRows = await Promise.all(
      queries.map(async (q) => {
        const { data } = await client
          .from('institutional_settings')
          .select('settings')
          .eq('scope_type', q.type)
          .eq('scope_id', q.id)
          .maybeSingle();
        return (data?.settings as Partial<InstitutionalSettingsValues>) || {};
      })
    );

    // Cascading merge in order: State -> District -> Organization -> School
    let resolved = { ...DEFAULT_INSTITUTIONAL_SETTINGS };
    for (const row of settingsRows) {
      resolved = {
        ...resolved,
        ...row,
        enabled_features: row.enabled_features ?? resolved.enabled_features,
        curriculum_standards: row.curriculum_standards ?? resolved.curriculum_standards,
      };
    }

    return resolved;
  },
};
