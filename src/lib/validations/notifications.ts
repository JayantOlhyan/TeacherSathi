import { z } from 'zod';

export const NotificationTypeSchema = z.enum([
  'ASSIGNMENT_NEW',
  'ASSIGNMENT_DUE',
  'ASSESSMENT_PUBLISHED',
  'RESULT_AVAILABLE',
  'ANNOUNCEMENT',
  'CLASSROOM_INVITE',
  'SYNC_ALERT',
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationRecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  school_id: z.string().uuid().nullable().optional(),
  type: NotificationTypeSchema,
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  data: z.record(z.string(), z.unknown()).default({}),
  read_at: z.string().nullable().optional(),
  created_at: z.string(),
});
export type NotificationRecord = z.infer<typeof NotificationRecordSchema>;

export const CreateNotificationSchema = z.object({
  user_id: z.string().uuid(),
  school_id: z.string().uuid().optional(),
  type: NotificationTypeSchema,
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
});
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

export const RegisterDeviceSchema = z.object({
  device_id: z.string().min(3).max(100),
  platform: z.enum(['android', 'ios']),
  push_token: z.string().optional().nullable(),
  app_version: z.string().min(1).max(50),
  device_model: z.string().max(100).optional(),
  os_version: z.string().max(50).optional(),
});
export type RegisterDeviceInput = z.infer<typeof RegisterDeviceSchema>;

export const AppVersionStatusSchema = z.enum([
  'CURRENT',
  'UPDATE_RECOMMENDED',
  'UPDATE_REQUIRED',
]);
export type AppVersionStatus = z.infer<typeof AppVersionStatusSchema>;

export const AppVersionCheckResponseSchema = z.object({
  status: AppVersionStatusSchema,
  platform: z.enum(['android', 'ios']),
  client_version: z.string(),
  min_supported_version: z.string(),
  latest_version: z.string(),
  update_url: z.string().nullable(),
  release_notes: z.string().nullable(),
});
export type AppVersionCheckResponse = z.infer<typeof AppVersionCheckResponseSchema>;
