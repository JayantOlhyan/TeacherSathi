import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { ClassroomDeviceSchema, ClassroomSessionCreateSchema, RemoteActionCreateSchema } from '../validations';

export interface ClassroomDeviceRecord {
  id: string;
  school_id: string;
  name: string;
  device_code: string | null;
  location: string;
  device_fingerprint: string | null;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassroomSessionRecord {
  id: string;
  device_id: string;
  teacher_id: string | null;
  class_id: string | null;
  chapter_id: string | null;
  session_token_hash: string;
  status: 'WAITING' | 'PAIRING' | 'ACTIVE' | 'PAUSED' | 'ENDED';
  expires_at: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RemoteActionRecord {
  id: string;
  session_id: string;
  actor_id: string | null;
  action_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export const classroomRepository = {
  async getDeviceById(id: string, client: SupabaseClient = defaultClient): Promise<ClassroomDeviceRecord | null> {
    const { data, error } = await client
      .from('classroom_devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch classroom device: ${error.message}`);
    }

    return data as ClassroomDeviceRecord;
  },

  async registerDevice(deviceData: unknown, client: SupabaseClient = defaultClient): Promise<ClassroomDeviceRecord> {
    const validated = ClassroomDeviceSchema.parse(deviceData);

    const { data, error } = await client
      .from('classroom_devices')
      .upsert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to register device: ${error.message}`);
    }

    return data as ClassroomDeviceRecord;
  },

  async createSession(sessionData: unknown, client: SupabaseClient = defaultClient): Promise<ClassroomSessionRecord> {
    const validated = ClassroomSessionCreateSchema.parse(sessionData);

    const { data, error } = await client
      .from('classroom_sessions')
      .insert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create classroom session: ${error.message}`);
    }

    return data as ClassroomSessionRecord;
  },

  async getSessionById(sessionId: string, client: SupabaseClient = defaultClient): Promise<ClassroomSessionRecord | null> {
    const { data, error } = await client
      .from('classroom_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch classroom session: ${error.message}`);
    }

    return data as ClassroomSessionRecord;
  },

  async updateSessionStatus(
    sessionId: string,
    status: 'WAITING' | 'PAIRING' | 'ACTIVE' | 'PAUSED' | 'ENDED',
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionRecord> {
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'ACTIVE') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'ENDED') {
      updates.ended_at = new Date().toISOString();
    }

    const { data, error } = await client
      .from('classroom_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update session status: ${error.message}`);
    }

    return data as ClassroomSessionRecord;
  },

  async recordRemoteAction(actionData: unknown, client: SupabaseClient = defaultClient): Promise<RemoteActionRecord> {
    const validated = RemoteActionCreateSchema.parse(actionData);

    const { data, error } = await client
      .from('remote_actions')
      .insert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record remote action: ${error.message}`);
    }

    return data as RemoteActionRecord;
  },

  async getRemoteActions(sessionId: string, client: SupabaseClient = defaultClient): Promise<RemoteActionRecord[]> {
    const { data, error } = await client
      .from('remote_actions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch remote actions: ${error.message}`);
    }

    return (data || []) as RemoteActionRecord[];
  }
};
