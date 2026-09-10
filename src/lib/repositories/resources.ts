import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { ResourceCreateSchema } from '../validations';

export interface ResourceRecord {
  id: string;
  school_id: string | null;
  owner_id: string;
  chapter_id: string | null;
  resource_type: 'LESSON_PLAN' | 'WORKSHEET' | 'PRESENTATION' | 'MIND_MAP' | 'DOCUMENT';
  title: string;
  description: string | null;
  status: 'DRAFT' | 'VALIDATING' | 'READY' | 'USED' | 'ARCHIVED';
  metadata: Record<string, unknown>;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export const resourcesRepository = {
  async getResourcesByOwner(
    ownerId: string,
    resourceType?: 'LESSON_PLAN' | 'WORKSHEET' | 'PRESENTATION' | 'MIND_MAP' | 'DOCUMENT',
    client: SupabaseClient = defaultClient
  ): Promise<ResourceRecord[]> {
    let query = client
      .from('resources')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_archived', false);

    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      throw new Error(`Failed to fetch resources: ${error.message}`);
    }

    return (data || []) as ResourceRecord[];
  },

  async getResourceById(id: string, client: SupabaseClient = defaultClient): Promise<ResourceRecord | null> {
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch resource: ${error.message}`);
    }

    return data as ResourceRecord;
  },

  async createResource(resourceData: unknown, client: SupabaseClient = defaultClient): Promise<ResourceRecord> {
    const validated = ResourceCreateSchema.parse(resourceData);

    const { data, error } = await client
      .from('resources')
      .insert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create resource: ${error.message}`);
    }

    return data as ResourceRecord;
  },

  async updateResourceStatus(
    id: string,
    status: 'DRAFT' | 'VALIDATING' | 'READY' | 'USED' | 'ARCHIVED',
    client: SupabaseClient = defaultClient
  ): Promise<ResourceRecord> {
    const { data, error } = await client
      .from('resources')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update resource status: ${error.message}`);
    }

    return data as ResourceRecord;
  },

  async archiveResource(id: string, client: SupabaseClient = defaultClient): Promise<void> {
    const { error } = await client
      .from('resources')
      .update({
        status: 'ARCHIVED',
        is_archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to archive resource: ${error.message}`);
    }
  }
};
