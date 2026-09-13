import { describe, it, expect } from 'vitest';
import { canManageScope, isAuthorizedForInstitutionAction } from '../../src/lib/services/institutionalAuth';

describe('Phase 8 RBAC & Institutional Capabilities', () => {
  const superAdmin = {
    userId: 'u-super',
    role: 'SUPER_ADMIN' as const,
    schoolId: null,
    states: [],
    districts: [],
    organizations: [],
  };

  const stateAdmin = {
    userId: 'u-state-admin',
    role: 'STATE_ADMIN' as const,
    schoolId: null,
    states: [{ id: 'state-mh', name: 'Maharashtra', code: 'MH', role: 'STATE_ADMIN' }],
    districts: [],
    organizations: [],
  };

  const districtAdmin = {
    userId: 'u-district-admin',
    role: 'DISTRICT_ADMIN' as const,
    schoolId: null,
    states: [],
    districts: [{ id: 'dist-pune', name: 'Pune', code: 'PUN', state_id: 'state-mh', role: 'DISTRICT_ADMIN' }],
    organizations: [],
  };

  const orgAdmin = {
    userId: 'u-org-admin',
    role: 'ORG_ADMIN' as const,
    schoolId: null,
    states: [],
    districts: [],
    organizations: [{ id: 'org-dps', name: 'Delhi Public Schools', code: 'DPS', role: 'ORG_ADMIN' }],
  };

  const schoolAdmin = {
    userId: 'u-school-admin',
    role: 'SCHOOL_ADMIN' as const,
    schoolId: 'school-1',
    states: [],
    districts: [],
    organizations: [],
  };

  const teacher = {
    userId: 'u-teacher',
    role: 'TEACHER' as const,
    schoolId: 'school-1',
    states: [],
    districts: [],
    organizations: [],
  };

  const student = {
    userId: 'u-student',
    role: 'STUDENT' as const,
    schoolId: 'school-1',
    states: [],
    districts: [],
    organizations: [],
  };

  describe('Administrative Scope Management Permissions', () => {
    it('SUPER_ADMIN can manage any state, district, organization, or school', () => {
      expect(canManageScope(superAdmin, 'STATE', 'state-mh')).toBe(true);
      expect(canManageScope(superAdmin, 'STATE', 'state-ka')).toBe(true);
      expect(canManageScope(superAdmin, 'DISTRICT', 'dist-pune')).toBe(true);
      expect(canManageScope(superAdmin, 'ORGANIZATION', 'org-dps')).toBe(true);
      expect(canManageScope(superAdmin, 'SCHOOL', 'school-999')).toBe(true);
    });

    it('STATE_ADMIN can only manage entities within their assigned state', () => {
      expect(canManageScope(stateAdmin, 'STATE', 'state-mh')).toBe(true);
      expect(canManageScope(stateAdmin, 'STATE', 'state-ka')).toBe(false);
      expect(canManageScope(stateAdmin, 'DISTRICT', 'dist-pune')).toBe(false);
      expect(canManageScope(stateAdmin, 'ORGANIZATION', 'org-dps')).toBe(false);
    });

    it('DISTRICT_ADMIN can only manage their assigned district', () => {
      expect(canManageScope(districtAdmin, 'DISTRICT', 'dist-pune')).toBe(true);
      expect(canManageScope(districtAdmin, 'DISTRICT', 'dist-mumbai')).toBe(false);
      expect(canManageScope(districtAdmin, 'STATE', 'state-mh')).toBe(false);
    });

    it('ORG_ADMIN can only manage their assigned organization', () => {
      expect(canManageScope(orgAdmin, 'ORGANIZATION', 'org-dps')).toBe(true);
      expect(canManageScope(orgAdmin, 'ORGANIZATION', 'org-dav')).toBe(false);
      expect(canManageScope(orgAdmin, 'STATE', 'state-mh')).toBe(false);
    });

    it('SCHOOL_ADMIN, TEACHER, STUDENT cannot manage institutional scopes', () => {
      expect(canManageScope(schoolAdmin, 'STATE', 'state-mh')).toBe(false);
      expect(canManageScope(schoolAdmin, 'DISTRICT', 'dist-pune')).toBe(false);
      expect(canManageScope(schoolAdmin, 'ORGANIZATION', 'org-dps')).toBe(false);
      expect(canManageScope(teacher, 'STATE', 'state-mh')).toBe(false);
      expect(canManageScope(student, 'STATE', 'state-mh')).toBe(false);
    });
  });

  describe('Capability Matrix Checks', () => {
    it('Allows STATE_ADMIN to view academic aggregations and create invitations for their scope', () => {
      expect(isAuthorizedForInstitutionAction(stateAdmin.role, 'VIEW_AGGREGATE_METRICS')).toBe(true);
      expect(isAuthorizedForInstitutionAction(stateAdmin.role, 'INVITE_MEMBERS')).toBe(true);
      expect(isAuthorizedForInstitutionAction(stateAdmin.role, 'EXPORT_REPORTS')).toBe(true);
      expect(isAuthorizedForInstitutionAction(stateAdmin.role, 'UPDATE_GOVERNANCE_SETTINGS')).toBe(true);
    });

    it('Allows DISTRICT_ADMIN and ORG_ADMIN appropriate administrative capabilities', () => {
      expect(isAuthorizedForInstitutionAction(districtAdmin.role, 'VIEW_AGGREGATE_METRICS')).toBe(true);
      expect(isAuthorizedForInstitutionAction(districtAdmin.role, 'INVITE_MEMBERS')).toBe(true);
      expect(isAuthorizedForInstitutionAction(orgAdmin.role, 'VIEW_AGGREGATE_METRICS')).toBe(true);
      expect(isAuthorizedForInstitutionAction(orgAdmin.role, 'INVITE_MEMBERS')).toBe(true);
    });

    it('Denies institutional admin capabilities to TEACHER and STUDENT', () => {
      expect(isAuthorizedForInstitutionAction(teacher.role, 'VIEW_AGGREGATE_METRICS')).toBe(false);
      expect(isAuthorizedForInstitutionAction(teacher.role, 'INVITE_MEMBERS')).toBe(false);
      expect(isAuthorizedForInstitutionAction(teacher.role, 'UPDATE_GOVERNANCE_SETTINGS')).toBe(false);

      expect(isAuthorizedForInstitutionAction(student.role, 'VIEW_AGGREGATE_METRICS')).toBe(false);
      expect(isAuthorizedForInstitutionAction(student.role, 'INVITE_MEMBERS')).toBe(false);
      expect(isAuthorizedForInstitutionAction(student.role, 'UPDATE_GOVERNANCE_SETTINGS')).toBe(false);
    });

    it('Prevents modifying canonical NCERT curriculum for all institutional roles', () => {
      // NCERT curriculum is immutable by institutional administrators
      expect(isAuthorizedForInstitutionAction(stateAdmin.role, 'MODIFY_CURRICULUM')).toBe(false);
      expect(isAuthorizedForInstitutionAction(districtAdmin.role, 'MODIFY_CURRICULUM')).toBe(false);
      expect(isAuthorizedForInstitutionAction(orgAdmin.role, 'MODIFY_CURRICULUM')).toBe(false);
      expect(isAuthorizedForInstitutionAction(schoolAdmin.role, 'MODIFY_CURRICULUM')).toBe(false);
    });
  });
});
