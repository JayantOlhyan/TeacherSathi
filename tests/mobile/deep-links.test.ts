import { describe, it, expect } from 'vitest';
import { NotificationService } from '../../mobile/src/services/notificationService';
import { ApiClient } from '../../mobile/src/services/apiClient';

describe('Phase 9: Mobile Deep Linking & Authorization Gates', () => {
  const service = new NotificationService(new ApiClient('https://mock.teachersathi.in'));

  it('should parse custom scheme teacher-sathi:// URLs accurately', () => {
    const route = service.parseDeepLink('teacher-sathi://assignment/asgn-crop-8');
    expect(route.screen).toBe('ASSIGNMENT_DETAILS');
    expect(route.params.assignmentId).toBe('asgn-crop-8');
    expect(route.requiredRole).toBe('ANY');
  });

  it('should parse classroom remote URL and attach query parameters', () => {
    const route = service.parseDeepLink(
      'teacher-sathi://classroom/session-live-01?token=XY78ZT'
    );
    expect(route.screen).toBe('CLASSROOM_REMOTE');
    expect(route.params.sessionId).toBe('session-live-01');
    expect(route.params.token).toBe('XY78ZT');
    expect(route.requiredRole).toBe('TEACHER');
  });

  it('should parse https universal links identically to native scheme', () => {
    const route = service.parseDeepLink('https://teachersathi.in/assessment/asmt-periodic-1');
    expect(route.screen).toBe('ASSESSMENT_PLAYER');
    expect(route.params.assessmentId).toBe('asmt-periodic-1');
  });

  it('should gate restricted routes according to user roles', () => {
    const teacherRoute = service.parseDeepLink('teacher-sathi://classroom/sess-123');

    // Teacher can access classroom remote
    expect(service.canAccessRoute(teacherRoute, 'TEACHER')).toBe(true);

    // Student cannot access classroom remote
    expect(service.canAccessRoute(teacherRoute, 'STUDENT')).toBe(false);

    // General route accessible by all
    const studentRoute = service.parseDeepLink('teacher-sathi://assignment/asgn-123');
    expect(service.canAccessRoute(studentRoute, 'STUDENT')).toBe(true);
    expect(service.canAccessRoute(studentRoute, 'TEACHER')).toBe(true);
  });

  it('should return UNKNOWN route gracefully for unrecognized paths', () => {
    const route = service.parseDeepLink('teacher-sathi://unknown/path/here');
    expect(route.screen).toBe('UNKNOWN');
  });
});
