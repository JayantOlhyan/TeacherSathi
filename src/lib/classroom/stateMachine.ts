import { ClassroomSessionStatus } from './types';

export class InvalidStateTransitionError extends Error {
  constructor(public currentStatus: ClassroomSessionStatus, public targetStatus: ClassroomSessionStatus) {
    super(`Invalid classroom session transition from '${currentStatus}' to '${targetStatus}'.`);
    this.name = 'InvalidStateTransitionError';
  }
}

/**
 * Valid transitions according to Section 3:
 * WAITING -> PAIRING, ACTIVE, ENDED
 * PAIRING -> ACTIVE, WAITING, ENDED
 * ACTIVE  -> PAUSED, ENDED
 * PAUSED  -> ACTIVE, ENDED
 * ENDED   -> None (Terminal state)
 */
const VALID_TRANSITIONS: Record<ClassroomSessionStatus, ClassroomSessionStatus[]> = {
  WAITING: ['PAIRING', 'ACTIVE', 'ENDED'],
  PAIRING: ['ACTIVE', 'WAITING', 'ENDED'],
  ACTIVE: ['PAUSED', 'ENDED'],
  PAUSED: ['ACTIVE', 'ENDED'],
  ENDED: [], // Terminal
};

export function isValidSessionTransition(
  current: ClassroomSessionStatus,
  target: ClassroomSessionStatus
): boolean {
  if (current === target) return true; // Idempotent no-op
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

export function assertValidSessionTransition(
  current: ClassroomSessionStatus,
  target: ClassroomSessionStatus
): void {
  if (!isValidSessionTransition(current, target)) {
    throw new InvalidStateTransitionError(current, target);
  }
}
