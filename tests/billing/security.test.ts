import { describe, it, expect } from 'vitest';

interface MockProfile {
  id: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT';
  school_id: string | null;
}

function checkBillingAccess(
  profile: MockProfile,
  targetSchoolId: string
): { allowed: boolean; reason?: string } {
  if (profile.role === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  if (profile.role !== 'SCHOOL_ADMIN') {
    return {
      allowed: false,
      reason: 'Forbidden: Only School Administrators may access institutional billing.',
    };
  }

  if (profile.school_id !== targetSchoolId) {
    return {
      allowed: false,
      reason: 'Forbidden: You cannot access or modify billing for another school.',
    };
  }

  return { allowed: true };
}

describe('Phase 5 SaaS Billing: Multi-Tenant Security & Role Isolation', () => {
  const schoolA = '11111111-1111-1111-1111-111111111111';
  const schoolB = '22222222-2222-2222-2222-222222222222';

  it('permits School Admin to access their own school billing', () => {
    const adminA: MockProfile = {
      id: 'usr-admin-a',
      role: 'SCHOOL_ADMIN',
      school_id: schoolA,
    };

    const access = checkBillingAccess(adminA, schoolA);
    expect(access.allowed).toBe(true);
  });

  it('blocks School Admin from accessing another school billing (cross-tenant IDOR prevention)', () => {
    const adminA: MockProfile = {
      id: 'usr-admin-a',
      role: 'SCHOOL_ADMIN',
      school_id: schoolA,
    };

    const access = checkBillingAccess(adminA, schoolB);
    expect(access.allowed).toBe(false);
    expect(access.reason).toContain('cannot access or modify billing for another school');
  });

  it('strictly blocks Teachers from accessing school billing', () => {
    const teacher: MockProfile = {
      id: 'usr-teacher-1',
      role: 'TEACHER',
      school_id: schoolA,
    };

    const access = checkBillingAccess(teacher, schoolA);
    expect(access.allowed).toBe(false);
    expect(access.reason).toContain('Only School Administrators');
  });

  it('strictly blocks Students from accessing school billing', () => {
    const student: MockProfile = {
      id: 'usr-student-1',
      role: 'STUDENT',
      school_id: schoolA,
    };

    const access = checkBillingAccess(student, schoolA);
    expect(access.allowed).toBe(false);
    expect(access.reason).toContain('Only School Administrators');
  });

  it('allows Super Admin global access across any school', () => {
    const superAdmin: MockProfile = {
      id: 'usr-superadmin',
      role: 'SUPER_ADMIN',
      school_id: null,
    };

    expect(checkBillingAccess(superAdmin, schoolA).allowed).toBe(true);
    expect(checkBillingAccess(superAdmin, schoolB).allowed).toBe(true);
  });
});
