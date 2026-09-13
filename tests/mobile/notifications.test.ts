import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationService } from '../../mobile/src/services/notificationService';
import { ApiClient } from '../../mobile/src/services/apiClient';

describe('Phase 9: Mobile Push & In-App Notifications', () => {
  let api: ApiClient;
  let service: NotificationService;

  beforeEach(() => {
    api = new ApiClient('https://mock.teachersathi.in');
    service = new NotificationService(api);
  });

  it('should register device push token with platform metadata', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({
      ok: true,
      status: 201,
      data: { registered: true },
    });

    const success = await service.registerDeviceToken({
      pushToken: 'ExponentPushToken[mock-token-abc]',
      platform: 'ANDROID',
      appVersion: '1.0.0',
      deviceModel: 'Samsung Galaxy A14',
      locale: 'hi',
    });

    expect(success).toBe(true);
    expect(postSpy).toHaveBeenCalledWith('/api/notifications/devices', {
      push_token: 'ExponentPushToken[mock-token-abc]',
      platform: 'ANDROID',
      app_version: '1.0.0',
      device_model: 'Samsung Galaxy A14',
      locale: 'hi',
    });
  });

  it('should unregister device push token upon logout', async () => {
    // First register
    vi.spyOn(api, 'post').mockResolvedValue({ ok: true, status: 201, data: {} });
    await service.registerDeviceToken({
      pushToken: 'token-to-remove',
      platform: 'IOS',
    });

    const deleteSpy = vi.spyOn(api, 'request').mockResolvedValue({
      ok: true,
      status: 200,
      data: { success: true },
    });

    const success = await service.unregisterDeviceToken();
    expect(success).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith('/api/notifications/devices', {
      method: 'DELETE',
      body: { push_token: 'token-to-remove' },
    });
  });

  it('should fetch in-app notifications and accurately return unread count', async () => {
    const mockNotifications = [
      {
        id: 'notif-1',
        type: 'ASSIGNMENT_NEW',
        title: 'New Assignment Posted',
        body: 'Chapter 1 Crop Production Worksheet is now available.',
        data: { assignmentId: 'asgn-1' },
        read_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        type: 'CLASSROOM_INVITE',
        title: 'Classroom Session Started',
        body: 'Join Class 8 Science live Smartboard session.',
        data: { sessionId: 'sess-8' },
        read_at: '2026-09-13T10:00:00Z',
        created_at: new Date().toISOString(),
      },
    ];

    vi.spyOn(api, 'get').mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        notifications: mockNotifications,
        unreadCount: 1,
      },
    });

    const res = await service.fetchNotifications();
    expect(res.notifications.length).toBe(2);
    expect(res.unreadCount).toBe(1);
    expect(res.notifications[0].title).toBe('New Assignment Posted');
  });

  it('should mark single and all notifications as read', async () => {
    const patchSpy = vi.spyOn(api, 'patch').mockResolvedValue({
      ok: true,
      status: 200,
      data: { success: true },
    });

    const singleResult = await service.markAsRead('notif-1');
    expect(singleResult).toBe(true);
    expect(patchSpy).toHaveBeenCalledWith('/api/notifications/notif-1/read');

    const allResult = await service.markAllAsRead();
    expect(allResult).toBe(true);
    expect(patchSpy).toHaveBeenCalledWith('/api/notifications');
  });
});
