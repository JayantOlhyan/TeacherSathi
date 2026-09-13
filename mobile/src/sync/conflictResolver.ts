export type ConflictResolutionAction =
  | 'SERVER_WINS'
  | 'CLIENT_WINS'
  | 'MERGE'
  | 'FORK_LOCAL_COPY'
  | 'REJECT_MUTATION';

export interface ConflictResolutionResult {
  action: ConflictResolutionAction;
  resolvedPayload?: Record<string, unknown>;
  reason: string;
}

export const conflictResolver = {
  /**
   * Resolves conflicts for student answers and submissions.
   */
  resolveStudentAnswerConflict(
    clientAnswer: { question_id: string; answer: unknown; client_sequence: number },
    serverState: { attempt_status: string; is_submitted: boolean; existing_answer?: unknown }
  ): ConflictResolutionResult {
    // 1. If attempt is already submitted and evaluated on server, server wins
    if (serverState.is_submitted || serverState.attempt_status === 'EVALUATED') {
      return {
        action: 'SERVER_WINS',
        reason: 'Attempt has already been submitted and finalized on the server',
      };
    }

    // 2. If attempt is active, client mutation is accepted (latest client answer wins)
    return {
      action: 'CLIENT_WINS',
      resolvedPayload: { question_id: clientAnswer.question_id, answer: clientAnswer.answer },
      reason: 'Active attempt in-progress; applying client answer autosave',
    };
  },

  /**
   * Resolves conflicts for teacher lesson plans / resource drafts.
   */
  resolveTeacherDraftConflict(
    localDraft: { version: number; content: Record<string, unknown> },
    serverDraft: { version: number; content: Record<string, unknown>; updated_at: string }
  ): ConflictResolutionResult {
    // 1. Fast-forward merge if version matches
    if (localDraft.version === serverDraft.version) {
      return {
        action: 'CLIENT_WINS',
        resolvedPayload: localDraft.content,
        reason: 'Base versions match; applying fast-forward save',
      };
    }

    // 2. Divergent edits: Server is ahead
    if (serverDraft.version > localDraft.version) {
      return {
        action: 'FORK_LOCAL_COPY',
        reason: 'Server version is newer. Local draft preserved as a copy to prevent accidental overwrite.',
      };
    }

    return {
      action: 'SERVER_WINS',
      reason: 'Server version retained',
    };
  },

  /**
   * Published educational resources are immutable and cannot be silently overwritten.
   */
  resolvePublishedResourceConflict(): ConflictResolutionResult {
    return {
      action: 'REJECT_MUTATION',
      reason: 'Published educational content cannot be modified directly. Must create a new version.',
    };
  },

  /**
   * Classroom event sequence reconciliation.
   */
  resolveClassroomEventConflict(
    clientSequence: number,
    serverSequence: number
  ): ConflictResolutionResult {
    if (clientSequence <= serverSequence) {
      return {
        action: 'SERVER_WINS',
        reason: 'Classroom event already processed by server or superseded by newer event',
      };
    }

    return {
      action: 'CLIENT_WINS',
      reason: 'Newer classroom event accepted',
    };
  },
};
