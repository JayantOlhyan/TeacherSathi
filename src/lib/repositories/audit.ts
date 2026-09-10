import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';

export interface AuditLogRecord {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const auditRepository = {
  async logAction(
    action: string,
    entityType: string,
    entityId: string,
    metadata: Record<string, unknown> = {},
    actorId?: string | null,
    ipAddress?: string | null,
    userAgent?: string | null,
    client: SupabaseClient = defaultClient
  ): Promise<AuditLogRecord | null> {
    try {
      const { data, error } = await client
        .from('audit_logs')
        .insert([
          {
            actor_id: actorId || null,
            action,
            entity_type: entityType,
            entity_id: entityId,
            metadata,
            ip_address: ipAddress || null,
            user_agent: userAgent || null,
          }
        ])
        .select()
        .single();

      if (!error && data) {
        return data as AuditLogRecord;
      }
    } catch {
      // Don't crash critical path if audit logging fails
    }

    return null;
  },

  async getAuditLogs(
    limit: number = 50,
    offset: number = 0,
    client: SupabaseClient = defaultClient
  ): Promise<AuditLogRecord[]> {
    const { data, error } = await client
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch audit logs: ${error.message}`);
    }

    return (data || []) as AuditLogRecord[];
  }
};
