import { ApiClient } from './apiClient';

export interface TelemetryEvent {
  id: string;
  eventName: string;
  category: 'SYNC' | 'OFFLINE' | 'CLASSROOM' | 'ASSESSMENT' | 'STORAGE' | 'ERROR';
  properties: Record<string, unknown>;
  timestamp: string;
}

export class TelemetryService {
  private apiClient: ApiClient;
  private queue: TelemetryEvent[] = [];
  private maxQueueSize = 100;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Log an event locally (PII-free)
   */
  logEvent(
    eventName: string,
    category: TelemetryEvent['category'],
    properties: Record<string, unknown> = {}
  ): void {
    // Sanitize properties to prevent accidental PII leaks
    const sanitizedProps = { ...properties };
    delete sanitizedProps.password;
    delete sanitizedProps.email;
    delete sanitizedProps.phone;
    delete sanitizedProps.token;

    const event: TelemetryEvent = {
      id: `tel-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      category,
      properties: sanitizedProps,
      timestamp: new Date().toISOString(),
    };

    this.queue.push(event);

    // Keep queue bounded
    if (this.queue.length > this.maxQueueSize) {
      this.queue.splice(0, this.queue.length - this.maxQueueSize);
    }
  }

  /**
   * Flush telemetry queue to server when online
   */
  async flush(): Promise<{ success: boolean; flushedCount: number }> {
    if (this.queue.length === 0) {
      return { success: true, flushedCount: 0 };
    }

    const eventsToFlush = [...this.queue];
    try {
      const response = await this.apiClient.post('/api/telemetry/events', {
        events: eventsToFlush,
      });

      if (response.ok) {
        // Remove flushed events
        this.queue = this.queue.filter((e) => !eventsToFlush.includes(e));
        return { success: true, flushedCount: eventsToFlush.length };
      }
    } catch {
      // Retain events for next sync
    }

    return { success: false, flushedCount: 0 };
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}
