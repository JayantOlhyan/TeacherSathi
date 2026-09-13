import { describe, it, expect } from 'vitest';
import { conflictResolver } from '../../mobile/src/sync/conflictResolver';

describe('Phase 9: Mobile Conflict Resolution Rules', () => {
  describe('Student Answers Conflict Resolution', () => {
    it('accepts client answer when assessment attempt is active and not finalized', () => {
      const clientAnswer = {
        question_id: 'q1',
        answer: 'Option B',
        client_sequence: 1,
      };
      const serverState = {
        attempt_status: 'IN_PROGRESS',
        is_submitted: false,
      };

      const result = conflictResolver.resolveStudentAnswerConflict(clientAnswer, serverState);
      expect(result.action).toBe('CLIENT_WINS');
      expect(result.resolvedPayload?.answer).toBe('Option B');
    });

    it('enforces SERVER_WINS when attempt has already been submitted or evaluated', () => {
      const clientAnswer = {
        question_id: 'q1',
        answer: 'Option C',
        client_sequence: 2,
      };
      const serverState = {
        attempt_status: 'EVALUATED',
        is_submitted: true,
      };

      const result = conflictResolver.resolveStudentAnswerConflict(clientAnswer, serverState);
      expect(result.action).toBe('SERVER_WINS');
      expect(result.reason).toContain('already been submitted and finalized');
    });
  });

  describe('Teacher Draft Conflict Resolution', () => {
    it('allows CLIENT_WINS fast-forward when base version numbers match', () => {
      const local = { version: 2, content: { title: 'Updated Title' } };
      const server = { version: 2, content: { title: 'Old Title' }, updated_at: '2026-09-13T10:00:00Z' };

      const result = conflictResolver.resolveTeacherDraftConflict(local, server);
      expect(result.action).toBe('CLIENT_WINS');
      expect(result.resolvedPayload?.title).toBe('Updated Title');
    });

    it('preserves work by FORK_LOCAL_COPY when server has a newer version', () => {
      const local = { version: 1, content: { title: 'My Local Edit' } };
      const server = { version: 3, content: { title: 'Colleague Edit' }, updated_at: '2026-09-13T11:00:00Z' };

      const result = conflictResolver.resolveTeacherDraftConflict(local, server);
      expect(result.action).toBe('FORK_LOCAL_COPY');
      expect(result.reason).toContain('preserved as a copy');
    });
  });

  describe('Published Curriculum and Resources', () => {
    it('strictly REJECTS direct client mutation on published educational resources', () => {
      const result = conflictResolver.resolvePublishedResourceConflict();
      expect(result.action).toBe('REJECT_MUTATION');
      expect(result.reason).toContain('cannot be modified directly');
    });
  });

  describe('Classroom Event Sequence Reconciliation', () => {
    it('enforces SERVER_WINS if incoming client sequence is older or already processed', () => {
      const result = conflictResolver.resolveClassroomEventConflict(4, 5);
      expect(result.action).toBe('SERVER_WINS');
    });

    it('accepts CLIENT_WINS when client event sequence is strictly ahead of server', () => {
      const result = conflictResolver.resolveClassroomEventConflict(6, 5);
      expect(result.action).toBe('CLIENT_WINS');
    });
  });
});
