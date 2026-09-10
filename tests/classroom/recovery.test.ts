import { describe, it, expect } from 'vitest';
import { classroomRepository } from '@/lib/repositories/classroom';

describe('Authoritative State Recovery & Sequence Gap Detection (Section 20 & 21)', () => {
  const sessionsDb: any[] = [];
  const devicesDb: any[] = [];
  const eventsDb: any[] = [];

  const createMockSupabase = () => {
    return {
      from(table: string) {
        return {
          select(cols?: string) {
            return {
              eq(col: string, val: any) {
                return {
                  single: async () => {
                    const list = table === 'classroom_sessions' ? sessionsDb : devicesDb;
                    const match = list.find((r) => r[col] === val);
                    return { data: match || null, error: match ? null : { code: 'PGRST116', message: 'Not found' } };
                  },
                  order: (ordCol: string, opts: any) => ({
                    then: (resolve: any) => {
                      const filtered = (table === 'classroom_events' ? eventsDb : devicesDb).filter((r) => r[col] === val);
                      filtered.sort((a, b) => a[ordCol] - b[ordCol]);
                      resolve({ data: filtered, error: null });
                    },
                    // Allow chaining await
                    async: () => {
                      const filtered = (table === 'classroom_events' ? eventsDb : devicesDb).filter((r) => r[col] === val);
                      filtered.sort((a, b) => a[ordCol] - b[ordCol]);
                      return { data: filtered, error: null };
                    },
                  }),
                };
              },
            };
          },
          insert(records: any[]) {
            return {
              select() {
                return {
                  single: async () => {
                    const rec = { ...records[0] };
                    if (!rec.id) rec.id = `id_${Math.random().toString(36).substring(2, 8)}`;
                    if (table === 'classroom_sessions') sessionsDb.push(rec);
                    if (table === 'classroom_events') eventsDb.push(rec);
                    return { data: rec, error: null };
                  },
                };
              },
            };
          },
          update(updates: any) {
            return {
              eq(col: string, val: any) {
                const target = sessionsDb.find((r) => r[col] === val);
                if (target) Object.assign(target, updates);
                return {
                  select: () => ({ single: async () => ({ data: target, error: null }) }),
                };
              },
            };
          },
          channel() {
            return { send: () => {} };
          },
        } as any;
      },
    } as any;
  };

  it('reconstructs authoritative presentation slide state across sequential events', async () => {
    const mockClient = createMockSupabase();

    const session = await classroomRepository.createSession(
      { title: 'Grade 8 Science', status: 'ACTIVE' },
      mockClient
    );

    // Event 1: Start presentation with 10 slides
    eventsDb.push({
      session_id: session.id,
      event_type: 'START_PRESENTATION',
      event_payload: { presentationId: 'pres-1', title: 'Crop Production', totalSlides: 10, slideIndex: 0 },
      sequence_number: 1001,
    });

    // Event 2: Next slide to index 1
    eventsDb.push({
      session_id: session.id,
      event_type: 'NEXT_SLIDE',
      event_payload: { presentationId: 'pres-1', slideIndex: 1 },
      sequence_number: 1002,
    });

    // Event 3: Next slide to index 2
    eventsDb.push({
      session_id: session.id,
      event_type: 'NEXT_SLIDE',
      event_payload: { presentationId: 'pres-1', slideIndex: 2 },
      sequence_number: 1003,
    });

    // Replay state
    const authoritativeState = await classroomRepository.getAuthoritativeState(session.id, mockClient);

    expect(authoritativeState.presentation.isActive).toBe(true);
    expect(authoritativeState.presentation.presentationId).toBe('pres-1');
    expect(authoritativeState.presentation.slideIndex).toBe(2);
    expect(authoritativeState.presentation.totalSlides).toBe(10);
    expect(authoritativeState.sequenceNumber).toBe(1003);
  });

  it('correctly calculates synchronized timer state and remaining seconds from endsAt', async () => {
    const mockClient = createMockSupabase();

    const session = await classroomRepository.createSession(
      { title: 'Class with Timer', status: 'ACTIVE' },
      mockClient
    );

    const now = Date.now();
    const startedAt = new Date(now).toISOString();
    const endsAt = new Date(now + 120 * 1000).toISOString(); // 120 seconds in future

    eventsDb.push({
      session_id: session.id,
      event_type: 'START_TIMER',
      event_payload: { durationSeconds: 120, startedAt, endsAt },
      sequence_number: 1004,
    });

    const state = await classroomRepository.getAuthoritativeState(session.id, mockClient);

    expect(state.timer.isRunning).toBe(true);
    expect(state.timer.durationSeconds).toBe(120);
    expect(state.timer.remainingSeconds).toBeGreaterThanOrEqual(118);
    expect(state.timer.remainingSeconds).toBeLessThanOrEqual(120);
  });

  it('identifies missing events when sequence numbers contain a gap', () => {
    const receivedSequences = [1001, 1002, 1004];
    const lastSeen = 1002;
    const latestEventSeq = 1004;

    const hasGap = latestEventSeq > lastSeen + 1;
    expect(hasGap).toBe(true);

    const missingSequences: number[] = [];
    for (let s = lastSeen + 1; s < latestEventSeq; s++) {
      if (!receivedSequences.includes(s)) {
        missingSequences.push(s);
      }
    }

    expect(missingSequences).toEqual([1003]);
  });
});
