import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { SchoolCreateSchema } from '../validations';

export interface SchoolRecord {
  id: string;
  name: string;
  code: string | null;
  board: 'CBSE' | 'KVS' | 'JNV' | 'STATE_BOARD' | 'ICSE' | 'OTHER';
  state: string;
  city: string;
  address: string | null;
  postal_code: string | null;
  contact_email: string;
  contact_phone: string | null;
  subscription_tier: 'FREE' | 'PRO_SCHOOL' | 'ENTERPRISE';
  is_active: boolean;
  state_id?: string | null;
  district_id?: string | null;
  organization_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const schoolsRepository = {
  async getSchoolById(id: string, client: SupabaseClient = defaultClient): Promise<SchoolRecord | null> {
    const { data, error } = await client
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch school: ${error.message}`);
    }

    return data as SchoolRecord;
  },

  async createSchool(school: Partial<SchoolRecord>, client: SupabaseClient = defaultClient): Promise<SchoolRecord> {
    const validated = SchoolCreateSchema.parse(school);

    const { data, error } = await client
      .from('schools')
      .insert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create school: ${error.message}`);
    }

    return data as SchoolRecord;
  },

  async listSchools(client: SupabaseClient = defaultClient): Promise<SchoolRecord[]> {
    const { data, error } = await client
      .from('schools')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to list schools: ${error.message}`);
    }

    return (data || []) as SchoolRecord[];
  }
};
