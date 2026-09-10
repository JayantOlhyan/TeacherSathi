import { describe, it, expect } from 'vitest';
import { validateEventPayload } from '@/lib/classroom/schemas';
import { ClassroomEventType } from '@/lib/classroom/types';

describe('Classroom Event Contract & Zod Validation (Section 10 & 11)', () => {
  it('validates START_PRESENTATION payloads', () => {
    const valid = {
      presentationId: 'pres-123',
      title: 'Crop Production',
      totalSlides: 12,
      slideIndex: 0,
    };
    const result = validateEventPayload('START_PRESENTATION', valid);
    expect(result.presentationId).toBe('pres-123');
    expect(result.totalSlides).toBe(12);

    // Negative slides rejected
    expect(() =>
      validateEventPayload('START_PRESENTATION', {
        presentationId: 'pres-123',
        totalSlides: -1,
      })
    ).toThrow();
  });

  it('validates NEXT_SLIDE, PREVIOUS_SLIDE, GOTO_SLIDE navigation payloads', () => {
    const validNav = {
      presentationId: 'pres-123',
      slideIndex: 4,
    };
    expect(validateEventPayload('NEXT_SLIDE', validNav).slideIndex).toBe(4);
    expect(validateEventPayload('PREVIOUS_SLIDE', validNav).slideIndex).toBe(4);
    expect(validateEventPayload('GOTO_SLIDE', validNav).slideIndex).toBe(4);

    // Negative slideIndex rejected
    expect(() =>
      validateEventPayload('NEXT_SLIDE', {
        presentationId: 'pres-123',
        slideIndex: -1,
      })
    ).toThrow();
  });

  it('validates START_QUIZ and END_QUIZ payloads', () => {
    const validQuiz = {
      quizResourceId: 'quiz-science-ch1',
      title: 'Weekly Check',
      totalQuestions: 5,
    };
    const res = validateEventPayload('START_QUIZ', validQuiz);
    expect(res.quizResourceId).toBe('quiz-science-ch1');

    // Missing quizResourceId rejected
    expect(() => validateEventPayload('START_QUIZ', {})).toThrow();

    // END_QUIZ allows optional quizResourceId
    expect(() => validateEventPayload('END_QUIZ', {})).not.toThrow();
    expect(validateEventPayload('END_QUIZ', { quizResourceId: 'quiz-1' }).quizResourceId).toBe('quiz-1');
  });

  it('validates PUSH_RESOURCE payloads', () => {
    const validResource = {
      resourceId: 'res-456',
      resourceType: 'WORKSHEET',
      title: 'Chapter 1 Practice Worksheet',
      metadata: { difficulty: 'EASY' },
    };
    const res = validateEventPayload('PUSH_RESOURCE', validResource);
    expect(res.resourceId).toBe('res-456');
    expect(res.resourceType).toBe('WORKSHEET');

    // Missing title rejected
    expect(() =>
      validateEventPayload('PUSH_RESOURCE', {
        resourceId: 'res-456',
        resourceType: 'WORKSHEET',
      })
    ).toThrow();
  });

  it('validates START_TIMER and STOP_TIMER payloads', () => {
    const now = new Date();
    const ends = new Date(now.getTime() + 60000);
    const validTimer = {
      durationSeconds: 60,
      startedAt: now.toISOString(),
      endsAt: ends.toISOString(),
    };
    const res = validateEventPayload('START_TIMER', validTimer);
    expect(res.durationSeconds).toBe(60);

    // Non-ISO string rejected
    expect(() =>
      validateEventPayload('START_TIMER', {
        durationSeconds: 60,
        startedAt: 'not-a-date',
        endsAt: 'not-a-date',
      })
    ).toThrow();

    // STOP_TIMER accepts remainingSeconds
    expect(validateEventPayload('STOP_TIMER', { remainingSeconds: 15 }).remainingSeconds).toBe(15);
  });

  it('validates WHITEBOARD_UPDATE, CLEAR_WHITEBOARD, LOCK_BOARD, UNLOCK_BOARD', () => {
    const validBoardUpdate = {
      elements: [{ type: 'rectangle', id: 'elem-1' }],
      appState: { zoom: 1 },
    };
    const res = validateEventPayload('WHITEBOARD_UPDATE', validBoardUpdate);
    expect(res.elements).toHaveLength(1);

    expect(validateEventPayload('LOCK_BOARD', { reason: 'Teacher mode' }).reason).toBe('Teacher mode');
    expect(() => validateEventPayload('UNLOCK_BOARD', {})).not.toThrow();
    expect(() => validateEventPayload('CLEAR_WHITEBOARD', {})).not.toThrow();
  });

  it('rejects unsupported event types', () => {
    expect(() =>
      validateEventPayload('INVALID_UNKNOWN_EVENT' as ClassroomEventType, {})
    ).toThrow('Unsupported classroom event type');
  });
});
