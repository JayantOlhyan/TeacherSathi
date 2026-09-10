import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { ProfileUpdateSchema } from '../validations';

export interface ProfileRecord {
  id: string;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT';
  school_id: string | null;
  preferred_language: string;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const profilesRepository = {
  async getProfileById(id: string, client: SupabaseClient = defaultClient): Promise<ProfileRecord | null> {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data as ProfileRecord;
  },

  async updateProfile(id: string, updates: Partial<ProfileRecord>, client: SupabaseClient = defaultClient): Promise<ProfileRecord> {
    const validated = ProfileUpdateSchema.parse(updates);

    const { data, error } = await client
      .from('profiles')
      .update({
        ...validated,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data as ProfileRecord;
  },

  async listProfilesBySchool(schoolId: string, client: SupabaseClient = defaultClient): Promise<ProfileRecord[]> {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('school_id', schoolId)
      .order('full_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to list school profiles: ${error.message}`);
    }

    return (data || []) as ProfileRecord[];
  }
};
