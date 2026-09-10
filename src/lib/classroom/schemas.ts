import { z } from 'zod';
import { ClassroomEventType } from './types';

// =============================================================================
// CLASSROOM SESSION SCHEMAS
// =============================================================================

export const CreateSessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  schoolId: z.string().uuid().optional().nullable(),
  classId: z.string().uuid().optional().nullable(),
  gradeId: z.string().uuid().optional().nullable(),
  subjectId: z.string().uuid().optional().nullable(),
  bookId: z.string().uuid().optional().nullable(),
  chapterId: z.string().uuid().optional().nullable(),
  activeResourceId: z.string().uuid().optional().nullable(),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

export const ConsumePairingSchema = z.object({
  token: z.string().min(16, 'Pairing token is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  deviceType: z.enum(['TEACHER', 'SMARTBOARD', 'STUDENT', 'OBSERVER']).default('SMARTBOARD'),
  deviceName: z.string().min(1, 'Device name is required').max(100),
  deviceFingerprint: z.string().optional().nullable(),
  role: z.enum(['CONTROLLER', 'DISPLAY', 'PARTICIPANT', 'AUDITOR']).default('DISPLAY'),
});

export type ConsumePairingInput = z.infer<typeof ConsumePairingSchema>;

// =============================================================================
// CLASSROOM EVENT PAYLOAD SCHEMAS
// =============================================================================

export const StartPresentationPayloadSchema = z.object({
  presentationId: z.string().min(1, 'presentationId is required'),
  title: z.string().optional(),
  totalSlides: z.number().int().positive('totalSlides must be positive'),
  slideIndex: z.number().int().nonnegative().default(0),
});

export const SlideNavPayloadSchema = z.object({
  presentationId: z.string().min(1, 'presentationId is required'),
  slideIndex: z.number().int().nonnegative('slideIndex must be non-negative'),
});

export const StartQuizPayloadSchema = z.object({
  quizResourceId: z.string().min(1, 'quizResourceId is required'),
  title: z.string().optional(),
  totalQuestions: z.number().int().positive().optional(),
});

export const EndQuizPayloadSchema = z.object({
  quizResourceId: z.string().optional(),
});

export const PushResourcePayloadSchema = z.object({
  resourceId: z.string().min(1, 'resourceId is required'),
  resourceType: z.string().min(1, 'resourceType is required'),
  title: z.string().min(1, 'title is required'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const StartTimerPayloadSchema = z.object({
  durationSeconds: z.number().int().positive('durationSeconds must be positive'),
  startedAt: z.string().datetime({ message: 'startedAt must be ISO-8601 string' }),
  endsAt: z.string().datetime({ message: 'endsAt must be ISO-8601 string' }),
});

export const StopTimerPayloadSchema = z.object({
  remainingSeconds: z.number().int().nonnegative().default(0),
});

export const LockBoardPayloadSchema = z.object({
  reason: z.string().optional(),
});

export const UnlockBoardPayloadSchema = z.object({
  reason: z.string().optional(),
});

export const WhiteboardUpdatePayloadSchema = z.object({
  elements: z.array(z.unknown()).optional(),
  appState: z.record(z.string(), z.unknown()).optional(),
  delta: z.unknown().optional(),
});

export const ClearWhiteboardPayloadSchema = z.object({
  reason: z.string().optional(),
});

export const SessionLifecyclePayloadSchema = z.object({
  reason: z.string().optional(),
});

export const DeviceStatusPayloadSchema = z.object({
  deviceId: z.string().optional(),
  reason: z.string().optional(),
});

export const EmptyPayloadSchema = z.record(z.string(), z.unknown()).default({});

// =============================================================================
// PAYLOAD DISPATCH VALIDATOR
// =============================================================================

export function validateEventPayload(eventType: ClassroomEventType, payload: unknown): Record<string, unknown> {
  switch (eventType) {
    case 'START_PRESENTATION':
      return StartPresentationPayloadSchema.parse(payload);

    case 'NEXT_SLIDE':
    case 'PREVIOUS_SLIDE':
    case 'GOTO_SLIDE':
      return SlideNavPayloadSchema.parse(payload);

    case 'START_QUIZ':
      return StartQuizPayloadSchema.parse(payload);

    case 'END_QUIZ':
      return EndQuizPayloadSchema.parse(payload);

    case 'PUSH_RESOURCE':
      return PushResourcePayloadSchema.parse(payload);

    case 'START_TIMER':
      return StartTimerPayloadSchema.parse(payload);

    case 'STOP_TIMER':
      return StopTimerPayloadSchema.parse(payload);

    case 'LOCK_BOARD':
      return LockBoardPayloadSchema.parse(payload);

    case 'UNLOCK_BOARD':
      return UnlockBoardPayloadSchema.parse(payload);

    case 'WHITEBOARD_UPDATE':
      return WhiteboardUpdatePayloadSchema.parse(payload);

    case 'CLEAR_WHITEBOARD':
      return ClearWhiteboardPayloadSchema.parse(payload);

    case 'SESSION_STARTED':
    case 'SESSION_PAUSED':
    case 'SESSION_RESUMED':
    case 'SESSION_ENDED':
      return SessionLifecyclePayloadSchema.parse(payload || {});

    case 'DEVICE_CONNECTED':
    case 'DEVICE_DISCONNECTED':
    case 'DEVICE_REVOKED':
      return DeviceStatusPayloadSchema.parse(payload || {});

    default:
      throw new Error(`Unsupported classroom event type: ${eventType}`);
  }
}
