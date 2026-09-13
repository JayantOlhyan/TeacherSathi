import { ApiClient } from './apiClient';

export interface ClassroomDeviceState {
  sessionId: string;
  deviceId: string;
  role: 'TEACHER' | 'STUDENT' | 'SMARTBOARD';
  deviceName: string;
  currentSlideIndex: number;
  isBoardLocked: boolean;
  activeQuizId?: string | null;
  isConnected: boolean;
}

export class ClassroomService {
  private apiClient: ApiClient;
  private state: ClassroomDeviceState | null = null;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Pair mobile device with active classroom session / Smartboard
   */
  async pairWithSession(params: {
    sessionId: string;
    token: string;
    deviceName?: string;
    deviceFingerprint?: string;
    role?: 'TEACHER' | 'STUDENT';
  }): Promise<{
    success: boolean;
    state?: ClassroomDeviceState;
    error?: string;
  }> {
    const response = await this.apiClient.post<{
      session: { id: string; [key: string]: unknown };
      device: { id: string; device_type: string; role: string; device_name: string };
    }>('/api/classroom/pair/consume', {
      sessionId: params.sessionId,
      token: params.token,
      deviceType: 'MOBILE',
      deviceName: params.deviceName || 'Teacher Mobile Device',
      deviceFingerprint: params.deviceFingerprint || `mobile-fp-${Date.now()}`,
      role: params.role || 'TEACHER',
    });

    if (!response.ok || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to pair device with session',
      };
    }

    const { session, device } = response.data;

    this.state = {
      sessionId: session.id,
      deviceId: device.id,
      role: (device.role as 'TEACHER' | 'STUDENT') || 'TEACHER',
      deviceName: device.device_name,
      currentSlideIndex: 0,
      isBoardLocked: false,
      activeQuizId: null,
      isConnected: true,
    };

    return {
      success: true,
      state: this.state,
    };
  }

  /**
   * Send arbitrary classroom event
   */
  async sendEvent(
    eventType: string,
    payload: Record<string, unknown> = {}
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!this.state || !this.state.sessionId) {
      return { success: false, error: 'Not paired with any active classroom session.' };
    }

    const idempotencyKey = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const response = await this.apiClient.post(
      `/api/classroom/sessions/${this.state.sessionId}/events`,
      {
        eventType,
        payload,
        deviceId: this.state.deviceId,
        idempotencyKey,
      },
      idempotencyKey
    );

    if (!response.ok) {
      return { success: false, error: response.error || `Failed to send event: ${eventType}` };
    }

    return { success: true };
  }

  // --- Remote Slide Navigation & Smartboard Controls ---

  async nextSlide(): Promise<boolean> {
    if (!this.state) return false;
    const res = await this.sendEvent('SLIDE_CHANGED', {
      slideIndex: this.state.currentSlideIndex + 1,
      direction: 'NEXT',
    });
    if (res.success) {
      this.state.currentSlideIndex += 1;
      return true;
    }
    return false;
  }

  async prevSlide(): Promise<boolean> {
    if (!this.state || this.state.currentSlideIndex <= 0) return false;
    const res = await this.sendEvent('SLIDE_CHANGED', {
      slideIndex: this.state.currentSlideIndex - 1,
      direction: 'PREV',
    });
    if (res.success) {
      this.state.currentSlideIndex -= 1;
      return true;
    }
    return false;
  }

  async goToSlide(slideIndex: number): Promise<boolean> {
    if (!this.state || slideIndex < 0) return false;
    const res = await this.sendEvent('SLIDE_CHANGED', {
      slideIndex,
      direction: 'JUMP',
    });
    if (res.success) {
      this.state.currentSlideIndex = slideIndex;
      return true;
    }
    return false;
  }

  async lockSmartboard(): Promise<boolean> {
    const res = await this.sendEvent('BOARD_LOCKED', { locked: true });
    if (res.success && this.state) {
      this.state.isBoardLocked = true;
      return true;
    }
    return false;
  }

  async unlockSmartboard(): Promise<boolean> {
    const res = await this.sendEvent('BOARD_UNLOCKED', { locked: false });
    if (res.success && this.state) {
      this.state.isBoardLocked = false;
      return true;
    }
    return false;
  }

  async startLiveQuiz(quizId: string): Promise<boolean> {
    const res = await this.sendEvent('QUIZ_STARTED', { quizId });
    if (res.success && this.state) {
      this.state.activeQuizId = quizId;
      return true;
    }
    return false;
  }

  async endLiveQuiz(): Promise<boolean> {
    const res = await this.sendEvent('QUIZ_ENDED', {});
    if (res.success && this.state) {
      this.state.activeQuizId = null;
      return true;
    }
    return false;
  }

  disconnect(): void {
    this.state = null;
  }

  getState(): ClassroomDeviceState | null {
    return this.state;
  }
}
