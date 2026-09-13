import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SyncEngine } from '../../mobile/src/sync/syncEngine';
import { DatabaseManager } from '../../mobile/src/database/databaseManager';
import { NetworkMonitor } from '../../mobile/src/sync/networkMonitor';
import { OfflineAnswerRecord } from '../../mobile/src/types';

describe('Phase 9: Mobile Sync Engine & Outbox Processor', () => {
  let db: DatabaseManager;
  let network: NetworkMonitor;
  let syncEngine: SyncEngine;

  beforeEach(async () => {
    db = new DatabaseManager();
    await db.initialize();
    network = new NetworkMonitor();
    network.setStatus('ONLINE');
    syncEngine = new SyncEngine(db, network);
  });

  it('should transition outbox items to SYNCED when dispatcher succeeds', async () => {
    const answer: OfflineAnswerRecord = {
      attempt_id: 'att-1',
      question_id: 'q1',
      selected_option_key: 'A',
      is_answered: true,
      client_mutation_id: 'mut-sync-1',
    };
    await db.recordOfflineAnswer(answer);

    // Mock dispatcher returning 200 OK
    const dispatcher = vi.fn().mockResolvedValue({
      success: true,
      statusCode: 200,
      data: { acknowledged: true },
    });
    syncEngine.setDispatcher(dispatcher);

    const result = await syncEngine.processQueue();
    expect(result.processed).toBe(1);
    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(0);
    expect(dispatcher).toHaveBeenCalledTimes(1);

    // After success, pending outbox items should be empty
    const pending = await db.getPendingOutboxItems();
    expect(pending.length).toBe(0);
  });

  it('should mark outbox item as FAILED and increment attempts on network/server error', async () => {
    const answer: OfflineAnswerRecord = {
      attempt_id: 'att-2',
      question_id: 'q2',
      selected_option_key: 'B',
      is_answered: true,
      client_mutation_id: 'mut-fail-1',
    };
    await db.recordOfflineAnswer(answer);

    const dispatcher = vi.fn().mockResolvedValue({
      success: false,
      statusCode: 500,
      error: 'Internal Server Error',
    });
    syncEngine.setDispatcher(dispatcher);

    const result = await syncEngine.processQueue();
    expect(result.processed).toBe(1);
    expect(result.failed).toBe(1);

    const pending = await db.getPendingOutboxItems();
    expect(pending.length).toBe(1);
    expect(pending[0].attempt_count).toBe(1);
    expect(pending[0].status).toBe('FAILED');
    expect(pending[0].error_message).toBe('Internal Server Error');
  });

  it('should calculate exponential backoff with random jitter within expected bounds', () => {
    const delay0 = syncEngine.calculateBackoffMs(0);
    expect(delay0).toBeGreaterThanOrEqual(2000);
    expect(delay0).toBeLessThanOrEqual(2500);

    const delay1 = syncEngine.calculateBackoffMs(1);
    expect(delay1).toBeGreaterThanOrEqual(4000);
    expect(delay1).toBeLessThanOrEqual(4500);

    const delay5 = syncEngine.calculateBackoffMs(5);
    // Capped at MAX_RETRY_DELAY_MS (60,000ms)
    expect(delay5).toBeLessThanOrEqual(60000);
  });

  it('should automatically process outbox when network reconnects to ONLINE', async () => {
    network.setStatus('OFFLINE');

    const answer: OfflineAnswerRecord = {
      attempt_id: 'att-auto',
      question_id: 'q-auto',
      selected_option_key: 'C',
      is_answered: true,
      client_mutation_id: 'mut-auto-1',
    };
    await db.recordOfflineAnswer(answer);

    const dispatcher = vi.fn().mockResolvedValue({ success: true });
    syncEngine.setDispatcher(dispatcher);

    // While offline, manual processQueue aborts
    const offlineResult = await syncEngine.processQueue();
    expect(offlineResult.processed).toBe(0);
    expect(dispatcher).not.toHaveBeenCalled();

    // Reconnecting to online triggers auto-sync
    network.setStatus('ONLINE');

    // Allow event loop tick
    await new Promise((res) => setTimeout(res, 50));
    expect(dispatcher).toHaveBeenCalled();
  });
});
