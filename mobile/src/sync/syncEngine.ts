import { DatabaseManager, databaseManager } from '../database/databaseManager';
import { NetworkMonitor, networkMonitor } from './networkMonitor';
import { SyncConfig } from '../constants/cachePolicies';
import { SyncOutboxItem, SyncStatus } from '../types';

export type SyncDispatcher = (item: SyncOutboxItem) => Promise<{ success: boolean; statusCode?: number; data?: unknown; error?: string }>;

export interface SyncEngineStatus {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  lastError: string | null;
}

export type SyncStatusListener = (status: SyncEngineStatus) => void;

export class SyncEngine {
  private db: DatabaseManager;
  private network: NetworkMonitor;
  private dispatcher: SyncDispatcher | null = null;
  private isProcessing = false;
  private lastSyncAt: string | null = null;
  private lastError: string | null = null;
  private listeners: Set<SyncStatusListener> = new Set();

  constructor(db: DatabaseManager = databaseManager, network: NetworkMonitor = networkMonitor) {
    this.db = db;
    this.network = network;

    // Auto-trigger sync on reconnection
    this.network.addListener((status) => {
      if (status === 'ONLINE' && !this.isProcessing) {
        this.processQueue();
      }
    });
  }

  setDispatcher(dispatcher: SyncDispatcher): void {
    this.dispatcher = dispatcher;
  }

  calculateBackoffMs(attemptCount: number): number {
    const base = SyncConfig.INITIAL_RETRY_DELAY_MS * Math.pow(SyncConfig.BACKOFF_MULTIPLIER, attemptCount);
    const jitter = Math.floor(Math.random() * 500); // 0-500ms random jitter
    return Math.min(base + jitter, SyncConfig.MAX_RETRY_DELAY_MS);
  }

  async getStatus(): Promise<SyncEngineStatus> {
    const pendingItems = await this.db.getPendingOutboxItems();
    return {
      isSyncing: this.isProcessing,
      pendingCount: pendingItems.length,
      lastSyncAt: this.lastSyncAt,
      lastError: this.lastError,
    };
  }

  addListener(listener: SyncStatusListener): () => void {
    this.listeners.add(listener);
    this.getStatus().then((s) => listener(s));
    return () => this.listeners.delete(listener);
  }

  private async notifyListeners(): Promise<void> {
    const status = await this.getStatus();
    this.listeners.forEach((l) => {
      try {
        l(status);
      } catch {
        // Suppress listener error
      }
    });
  }

  async processOutbox(): Promise<{ processed: number; succeeded: number; failed: number }> {
    return this.processQueue();
  }

  /**
   * Main sync processing loop.
   */
  async processQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    if (this.isProcessing || !this.network.isOnline()) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    this.isProcessing = true;
    this.network.setStatus('SYNCING');
    await this.notifyListeners();

    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    try {
      const items = await this.db.getPendingOutboxItems();

      for (const item of items) {
        // Abort if network dropped mid-sync
        if (!this.network.isOnline()) break;

        // Skip if max retries exceeded
        if (item.attempt_count >= SyncConfig.MAX_RETRY_ATTEMPTS) {
          await this.db.updateOutboxStatus(item.mutation_id, 'FAILED', 'Max retry attempts exceeded');
          failed++;
          continue;
        }

        processed++;
        await this.db.updateOutboxStatus(item.mutation_id, 'SYNCING', undefined, false);

        try {
          if (!this.dispatcher) {
            // Default mock success if no external dispatcher bound
            await this.db.updateOutboxStatus(item.mutation_id, 'SYNCED', undefined, true);
            succeeded++;
            continue;
          }

          const result = await this.dispatcher(item);

          if (result.success) {
            await this.db.updateOutboxStatus(item.mutation_id, 'SYNCED', undefined, true);
            succeeded++;
          } else {
            const isConflict = result.statusCode === 409;
            const newStatus: SyncStatus = isConflict ? 'CONFLICT' : 'FAILED';
            await this.db.updateOutboxStatus(item.mutation_id, newStatus, result.error || 'Sync request rejected', true);
            failed++;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown sync network error';
          await this.db.updateOutboxStatus(item.mutation_id, 'FAILED', message, true);
          failed++;
        }
      }

      this.lastSyncAt = new Date().toISOString();
      if (failed > 0) {
        this.lastError = `${failed} items failed to sync`;
        this.network.setStatus('SYNC_ERROR');
      } else {
        this.lastError = null;
        this.network.setStatus('ONLINE');
      }
    } finally {
      this.isProcessing = false;
      await this.notifyListeners();
    }

    return { processed, succeeded, failed };
  }
}

export const syncEngine = new SyncEngine();
