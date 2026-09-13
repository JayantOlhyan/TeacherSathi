import { ApiClient } from './apiClient';
import { MobileNotificationItem } from '../types';

export interface DeepLinkRoute {
  screen:
    | 'ASSIGNMENT_DETAILS'
    | 'ASSESSMENT_PLAYER'
    | 'CLASSROOM_REMOTE'
    | 'CURRICULUM_CHAPTER'
    | 'ATTEMPT_RESULTS'
    | 'NOTIFICATIONS'
    | 'UNKNOWN';
  params: Record<string, string>;
  requiredRole?: 'TEACHER' | 'STUDENT' | 'ANY';
}

export class NotificationService {
  private apiClient: ApiClient;
  private registeredPushToken: string | null = null;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Register push notification device token with backend
   */
  async registerDeviceToken(params: {
    pushToken: string;
    platform: 'ANDROID' | 'IOS' | 'WEB';
    appVersion?: string;
    deviceModel?: string;
    locale?: string;
  }): Promise<boolean> {
    const response = await this.apiClient.post('/api/notifications/devices', {
      push_token: params.pushToken,
      platform: params.platform,
      app_version: params.appVersion || '1.0.0',
      device_model: params.deviceModel,
      locale: params.locale || 'en',
    });

    if (response.ok) {
      this.registeredPushToken = params.pushToken;
      return true;
    }
    return false;
  }

  /**
   * Unregister push token from backend
   */
  async unregisterDeviceToken(): Promise<boolean> {
    if (!this.registeredPushToken) return true;

    const response = await this.apiClient.request('/api/notifications/devices', {
      method: 'DELETE',
      body: { push_token: this.registeredPushToken },
    });

    if (response.ok) {
      this.registeredPushToken = null;
      return true;
    }
    return false;
  }

  /**
   * Fetch in-app notifications
   */
  async fetchNotifications(unreadOnly = false): Promise<{
    notifications: MobileNotificationItem[];
    unreadCount: number;
  }> {
    const endpoint = `/api/notifications${unreadOnly ? '?unreadOnly=true' : ''}`;
    const response = await this.apiClient.get<{
      notifications: MobileNotificationItem[];
      unreadCount: number;
    }>(endpoint);

    if (response.ok && response.data) {
      return {
        notifications: response.data.notifications || [],
        unreadCount: response.data.unreadCount || 0,
      };
    }

    return { notifications: [], unreadCount: 0 };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await this.apiClient.patch(`/api/notifications/${notificationId}/read`);
    return response.ok;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<boolean> {
    const response = await this.apiClient.patch('/api/notifications');
    return response.ok;
  }

  /**
   * Parse deep link URI and enforce role authorization
   */
  parseDeepLink(url: string, userRole?: 'TEACHER' | 'STUDENT' | string): DeepLinkRoute {
    try {
      // Normalize schemes: teacher-sathi:// or https://teachersathi.in/
      let normalized = url.replace(/^teacher-sathi:\/\//i, 'https://teachersathi.in/');
      if (!normalized.startsWith('http')) {
        normalized = `https://teachersathi.in/${normalized.replace(/^\/+/, '')}`;
      }

      const parsedUrl = new URL(normalized);
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      const queryParams: Record<string, string> = {};
      parsedUrl.searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });

      // Match routes
      if (pathParts[0] === 'assignment' && pathParts[1]) {
        return {
          screen: 'ASSIGNMENT_DETAILS',
          params: { assignmentId: pathParts[1], ...queryParams },
          requiredRole: 'ANY',
        };
      }

      if (pathParts[0] === 'assessment' && pathParts[1]) {
        return {
          screen: 'ASSESSMENT_PLAYER',
          params: { assessmentId: pathParts[1], ...queryParams },
          requiredRole: 'ANY',
        };
      }

      if (pathParts[0] === 'classroom' && pathParts[1]) {
        // Classroom remote control is teacher-focused
        return {
          screen: 'CLASSROOM_REMOTE',
          params: { sessionId: pathParts[1], ...queryParams },
          requiredRole: 'TEACHER',
        };
      }

      if (pathParts[0] === 'curriculum' && pathParts[1]) {
        return {
          screen: 'CURRICULUM_CHAPTER',
          params: { chapterId: pathParts[1], ...queryParams },
          requiredRole: 'ANY',
        };
      }

      if (pathParts[0] === 'results' && pathParts[1]) {
        return {
          screen: 'ATTEMPT_RESULTS',
          params: { attemptId: pathParts[1], ...queryParams },
          requiredRole: 'ANY',
        };
      }

      if (pathParts[0] === 'notifications') {
        return {
          screen: 'NOTIFICATIONS',
          params: queryParams,
          requiredRole: 'ANY',
        };
      }

      return { screen: 'UNKNOWN', params: queryParams, requiredRole: 'ANY' };
    } catch {
      return { screen: 'UNKNOWN', params: {}, requiredRole: 'ANY' };
    }
  }

  /**
   * Check if user has permission to navigate to the deep link route
   */
  canAccessRoute(route: DeepLinkRoute, userRole?: string): boolean {
    if (!route.requiredRole || route.requiredRole === 'ANY') return true;
    return route.requiredRole === userRole;
  }
}

import { apiClient } from './apiClient';
export const notificationService = new NotificationService(apiClient);

