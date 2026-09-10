import { describe, it, expect } from 'vitest';
import {
  isValidSessionTransition,
  assertValidSessionTransition,
  InvalidStateTransitionError,
} from '@/lib/classroom/stateMachine';
import { ClassroomSessionStatus } from '@/lib/classroom/types';

describe('Classroom Session State Machine (Section 3)', () => {
  it('allows valid forward lifecycle transitions', () => {
    // WAITING -> PAIRING
    expect(isValidSessionTransition('WAITING', 'PAIRING')).toBe(true);
    expect(() => assertValidSessionTransition('WAITING', 'PAIRING')).not.toThrow();

    // PAIRING -> ACTIVE
    expect(isValidSessionTransition('PAIRING', 'ACTIVE')).toBe(true);
    expect(() => assertValidSessionTransition('PAIRING', 'ACTIVE')).not.toThrow();

    // ACTIVE -> PAUSED
    expect(isValidSessionTransition('ACTIVE', 'PAUSED')).toBe(true);
    expect(() => assertValidSessionTransition('ACTIVE', 'PAUSED')).not.toThrow();

    // PAUSED -> ACTIVE (Resume)
    expect(isValidSessionTransition('PAUSED', 'ACTIVE')).toBe(true);
    expect(() => assertValidSessionTransition('PAUSED', 'ACTIVE')).not.toThrow();

    // ACTIVE -> ENDED
    expect(isValidSessionTransition('ACTIVE', 'ENDED')).toBe(true);
    expect(() => assertValidSessionTransition('ACTIVE', 'ENDED')).not.toThrow();

    // PAUSED -> ENDED
    expect(isValidSessionTransition('PAUSED', 'ENDED')).toBe(true);
    expect(() => assertValidSessionTransition('PAUSED', 'ENDED')).not.toThrow();

    // WAITING -> ENDED (Cancelled before start)
    expect(isValidSessionTransition('WAITING', 'ENDED')).toBe(true);
    expect(() => assertValidSessionTransition('WAITING', 'ENDED')).not.toThrow();
  });

  it('allows idempotent transitions to the same status', () => {
    const statuses: ClassroomSessionStatus[] = ['WAITING', 'PAIRING', 'ACTIVE', 'PAUSED', 'ENDED'];
    for (const status of statuses) {
      expect(isValidSessionTransition(status, status)).toBe(true);
      expect(() => assertValidSessionTransition(status, status)).not.toThrow();
    }
  });

  it('rejects invalid state transitions with InvalidStateTransitionError', () => {
    // WAITING cannot jump directly to PAUSED
    expect(isValidSessionTransition('WAITING', 'PAUSED')).toBe(false);
    expect(() => assertValidSessionTransition('WAITING', 'PAUSED')).toThrow(InvalidStateTransitionError);

    // PAIRING cannot jump directly to PAUSED
    expect(isValidSessionTransition('PAIRING', 'PAUSED')).toBe(false);
    expect(() => assertValidSessionTransition('PAIRING', 'PAUSED')).toThrow(InvalidStateTransitionError);
  });

  it('strictly enforces ENDED as a permanent terminal state', () => {
    // ENDED cannot return to ACTIVE
    expect(isValidSessionTransition('ENDED', 'ACTIVE')).toBe(false);
    expect(() => assertValidSessionTransition('ENDED', 'ACTIVE')).toThrow(InvalidStateTransitionError);

    // ENDED cannot return to PAUSED
    expect(isValidSessionTransition('ENDED', 'PAUSED')).toBe(false);
    expect(() => assertValidSessionTransition('ENDED', 'PAUSED')).toThrow(InvalidStateTransitionError);

    // ENDED cannot return to PAIRING or WAITING
    expect(isValidSessionTransition('ENDED', 'PAIRING')).toBe(false);
    expect(isValidSessionTransition('ENDED', 'WAITING')).toBe(false);
    expect(() => assertValidSessionTransition('ENDED', 'WAITING')).toThrow(InvalidStateTransitionError);
  });
});
