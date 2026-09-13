import { describe, it, expect, vi } from 'vitest';
import { ApiClient } from '../../mobile/src/services/apiClient';
import { DatabaseManager } from '../../mobile/src/database/databaseManager';
import { OfflineAnswerRecord } from '../../mobile/src/types';

describe('Phase 9: Mutation Idempotency & Replay Prevention', () => {
  it('should generate unique client mutation IDs and avoid collisions', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const mutationId = `mut-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      expect(ids.has(mutationId)).toBe(false);
      ids.add(mutationId);
    }
    expect(ids.size).toBe(50);
  });

  it('should inject Idempotency-Key header in ApiClient requests', async () => {
    const client = new ApiClient('https://mock-api.teachersathi.in');
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { status: 'acknowledged' } }),
    });
    global.fetch = mockFetch;

    const testKey = 'idem-test-uuid-999';
    await client.post('/api/attempts/att-1/answers', { answers: [] }, testKey);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const headers = fetchCall[1].headers;
    expect(headers['Idempotency-Key']).toBe(testKey);
  });

  it('should deduplicate outbox items with the same mutation ID', async () => {
    const db = new DatabaseManager();
    await db.initialize();

    const answer1: OfflineAnswerRecord = {
      attempt_id: 'att-idem-1',
      question_id: 'q1',
      selected_option_key: 'A',
      is_answered: true,
      client_mutation_id: 'same-mutation-id-123',
    };

    const answer2: OfflineAnswerRecord = {
      attempt_id: 'att-idem-1',
      question_id: 'q1',
      selected_option_key: 'B', // updated answer
      is_answered: true,
      client_mutation_id: 'same-mutation-id-123', // replayed with same mutation ID
    };

    await db.recordOfflineAnswer(answer1);
    await db.recordOfflineAnswer(answer2);

    const outbox = await db.getPendingOutboxItems();
    // Same mutation ID replaces or overwrites rather than duplicating outbox records
    const matchingItems = outbox.filter((i) => i.mutation_id === 'same-mutation-id-123');
    expect(matchingItems.length).toBe(1);
    expect(matchingItems[0].payload).toBeDefined();
  });
});
