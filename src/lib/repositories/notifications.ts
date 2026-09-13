import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  NotificationRecord,
  CreateNotificationInput,
  RegisterDeviceInput,
} from '../validations/notifications';

export const notificationsRepository = {
  /**
   * List notifications for a specific user with pagination and optional unread filter.
   */
  async getNotificationsByUser(
    userId: string,
    page = 1,
    limit = 20,
    unreadOnly = false,
    client: SupabaseClient = defaultClient
  ): Promise<{ data: NotificationRecord[]; total: number; unreadCount: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = client
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (unreadOnly) {
      query = query.is('read_at', null);
    }

    const [listResult, unreadResult] = await Promise.all([
      query,
      client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('read_at', null),
    ]);

    if (listResult.error) {
      throw new Error(`Failed to list notifications: ${listResult.error.message}`);
    }

    return {
      data: (listResult.data || []) as NotificationRecord[],
      total: listResult.count || 0,
      unreadCount: unreadResult.count || 0,
    };
  },

  /**
   * Marks a specific notification as read.
   */
  async markAsRead(
    notificationId: string,
    userId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const { error } = await client
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  },

  /**
   * Marks all notifications for a user as read.
   */
  async markAllAsRead(
    userId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const { error } = await client
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);

    if (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  },

  /**
   * Inserts a new notification record.
   */
  async createNotification(
    input: CreateNotificationInput,
    client: SupabaseClient = defaultClient
  ): Promise<NotificationRecord> {
    const { data, error } = await client
      .from('notifications')
      .insert([
        {
          user_id: input.user_id,
          school_id: input.school_id || null,
          type: input.type,
          title: input.title,
          body: input.body,
          data: input.data || {},
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create notification: ${error?.message || 'Unknown error'}`);
    }

    return data as NotificationRecord;
  },

  /**
   * Registers or updates a mobile device session.
   */
  async registerDevice(
    userId: string,
    input: RegisterDeviceInput,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const { error } = await client
      .from('mobile_devices')
      .upsert(
        [
          {
            user_id: userId,
            device_id: input.device_id,
            platform: input.platform,
            push_token: input.push_token || null,
            app_version: input.app_version,
            device_model: input.device_model || null,
            os_version: input.os_version || null,
            is_active: true,
            last_active_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'user_id,device_id' }
      );

    if (error) {
      throw new Error(`Failed to register mobile device: ${error.message}`);
    }
  },

  /**
   * Unregisters a mobile device (e.g. on logout).
   */
  async unregisterDevice(
    deviceId: string,
    userId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const { error } = await client
      .from('mobile_devices')
      .update({ is_active: false, push_token: null })
      .eq('device_id', deviceId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to unregister mobile device: ${error.message}`);
    }
  },
};
