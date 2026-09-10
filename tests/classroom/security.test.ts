import { describe, it, expect } from 'vitest';
import { classroomRepository } from '@/lib/repositories/classroom';
import { hashPairingToken, isTokenExpired } from '@/lib/classroom/pairing';

describe('Classroom Privileged Security & Isolation (Section 25 & 36)', () => {
  // In-memory mock database state
  const sessionsDb: any[] = [];
  const devicesDb: any[] = [];
  const pairingsDb: any[] = [];
  const eventsDb: any[] = [];

  const createMockSupabase = () => {
    return {
      from(table: string) {
        return {
          select(cols?: string) {
            return {
              eq(col: string, val: any) {
                return {
                  eq(col2: string, val2: any) {
                    return {
                      is(col3: string, val3: any) {
                        return {
                          single: async () => {
                            let match = (table === 'classroom_pairings' ? pairingsDb : devicesDb).find(
                              (r) => r[col] === val && r[col2] === val2 && (val3 === null ? r[col3] === null : r[col3] === val3)
                            );
                            return { data: match || null, error: match ? null : { code: 'PGRST116', message: 'Not found' } };
                          },
                        };
                      },
                      single: async () => {
                        let match = (table === 'classroom_events' ? eventsDb : devicesDb).find(
                          (r) => r[col] === val && r[col2] === val2
                        );
                        return { data: match || null, error: match ? null : { code: 'PGRST116', message: 'Not found' } };
                      },
                    };
                  },
                  single: async () => {
                    let match = (table === 'classroom_sessions' ? sessionsDb : devicesDb).find(
                      (r) => r[col] === val
                    );
                    return { data: match || null, error: match ? null : { code: 'PGRST116', message: 'Not found' } };
                  },
                  order(ordCol: string, opts: any) {
                    return {
                      limit: (n: number) => ({
                        single: async () => {
                          const filtered = eventsDb.filter((r) => r[col] === val);
                          if (filtered.length === 0) return { data: null, error: null };
                          filtered.sort((a, b) => b[ordCol] - a[ordCol]);
                          return { data: filtered[0], error: null };
                        },
                      }),
                      range: () => ({}),
                    };
                  },
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
                    if (table === 'classroom_session_devices') devicesDb.push(rec);
                    if (table === 'classroom_pairings') pairingsDb.push(rec);
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
                return {
                  eq(col2?: string, val2?: any) {
                    return {
                      select() {
                        return {
                          single: async () => {
                            const list = table === 'classroom_sessions' ? sessionsDb : table === 'classroom_pairings' ? pairingsDb : devicesDb;
                            const target = list.find((r) => r[col] === val && (!col2 || r[col2] === val2));
                            if (target) Object.assign(target, updates);
                            return { data: target || null, error: null };
                          },
                        };
                      },
                    };
                  },
                  select() {
                    return {
                      single: async () => {
                        const list = table === 'classroom_sessions' ? sessionsDb : devicesDb;
                        const target = list.find((r) => r[col] === val);
                        if (target) Object.assign(target, updates);
                        return { data: target || null, error: null };
                      },
                    };
                  },
                };
              },
            };
          },
          channel() {
            return {
              send: () => {},
            };
          },
        } as any;
      },
    } as any;
  };

  it('rejects commands when classroom session is permanently ENDED', async () => {
    const mockClient = createMockSupabase();

    // 1. Create session and set status to ENDED
    const session = await classroomRepository.createSession(
      {
        title: 'Completed Class',
        status: 'WAITING',
      },
      mockClient
    );
    await classroomRepository.updateSessionStatus(session.id, 'ENDED', mockClient);

    // 2. Attempt to pair device into ENDED session -> Rejected
    const tokenHash = hashPairingToken('some_token');
    await expect(
      classroomRepository.createPairingToken(session.id, tokenHash, new Date().toISOString(), mockClient)
    ).rejects.toThrow('Cannot generate pairing token for an ENDED session.');

    // 3. Attempt to record classroom event into ENDED session -> Rejected
    await expect(
      classroomRepository.recordEvent(
        session.id,
        null,
        'teacher-1',
        'NEXT_SLIDE',
        { presentationId: 'p1', slideIndex: 2 },
        undefined,
        mockClient
      )
    ).rejects.toThrow('Classroom session is ENDED');
  });

  it('immediately blocks revoked devices from executing classroom commands', async () => {
    const mockClient = createMockSupabase();

    const session = await classroomRepository.createSession(
      { title: 'Class 8 Science', status: 'ACTIVE' },
      mockClient
    );

    // Register smartboard device
    const device = {
      id: 'dev-smartboard-1',
      session_id: session.id,
      device_name: 'Smartboard',
      device_type: 'SMARTBOARD',
      status: 'REVOKED', // explicitly revoked
    };
    devicesDb.push(device);

    // Device tries to dispatch an event
    await expect(
      classroomRepository.recordEvent(
        session.id,
        device.id,
        null,
        'NEXT_SLIDE',
        { presentationId: 'p1', slideIndex: 1 },
        undefined,
        mockClient
      )
    ).rejects.toThrow('Revoked devices are prohibited from sending classroom events.');
  });

  it('prevents replay of expired pairing credentials', () => {
    const expiredTokenTimestamp = new Date(Date.now() - 60000).toISOString();
    expect(isTokenExpired(expiredTokenTimestamp)).toBe(true);
  });

  it('enforces command idempotency preventing duplicate event execution', async () => {
    const mockClient = createMockSupabase();

    const session = await classroomRepository.createSession(
      { title: 'Active Class', status: 'ACTIVE' },
      mockClient
    );

    const idempotencyKey = 'unique-click-uuid-999';

    // First execution
    const event1 = await classroomRepository.recordEvent(
      session.id,
      null,
      'teacher-1',
      'NEXT_SLIDE',
      { presentationId: 'pres-1', slideIndex: 3 },
      idempotencyKey,
      mockClient
    );

    expect(event1.sequence_number).toBe(1001);

    // Second execution with identical idempotencyKey
    const event2 = await classroomRepository.recordEvent(
      session.id,
      null,
      'teacher-1',
      'NEXT_SLIDE',
      { presentationId: 'pres-1', slideIndex: 3 },
      idempotencyKey,
      mockClient
    );

    // Should return original event without duplicating or increasing sequence number
    expect(event2.id).toBe(event1.id);
    expect(event2.sequence_number).toBe(1001);
  });
});
