import { describe, it, expect } from 'vitest';
import {
  CreateStateSchema,
  CreateDistrictSchema,
  CreateOrganizationSchema,
  SchoolOnboardingSchema,
} from '../../src/lib/validations/institution';

describe('Phase 8 Institutional Hierarchy & Model Integrity', () => {
  describe('Geographical Hierarchy Validations', () => {
    it('Validates state creation with uppercase ISO-style code', () => {
      const validState = {
        name: 'Karnataka',
        code: 'KA',
      };
      const result = CreateStateSchema.safeParse(validState);
      expect(result.success).toBe(true);
    });

    it('Rejects lowercase or malformed state codes', () => {
      const invalidState = {
        name: 'Karnataka',
        code: 'karnataka-state',
      };
      const result = CreateStateSchema.safeParse(invalidState);
      expect(result.success).toBe(false);
    });

    it('Validates district creation linked to a parent state UUID', () => {
      const validDistrict = {
        state_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'Bengaluru Urban',
        code: 'BLR-U',
      };
      const result = CreateDistrictSchema.safeParse(validDistrict);
      expect(result.success).toBe(true);
    });

    it('Rejects district creation without state_id', () => {
      const invalidDistrict = {
        name: 'Bengaluru Urban',
        code: 'BLR-U',
      };
      const result = CreateDistrictSchema.safeParse(invalidDistrict);
      expect(result.success).toBe(false);
    });
  });

  describe('Organization (School Network) Validations', () => {
    it('Validates multi-school organization creation', () => {
      const validOrg = {
        name: 'Kendriya Vidyalaya Sangathan',
        code: 'KVS',
        type: 'GOVERNMENT',
        contact_email: 'admin@kvsangathan.nic.in',
      };
      const result = CreateOrganizationSchema.safeParse(validOrg);
      expect(result.success).toBe(true);
    });
  });

  describe('School Onboarding in Hierarchy', () => {
    it('Allows onboarding a school under State, District, and Organization hierarchy', () => {
      const onboardPayload = {
        name: 'KV Hebbal',
        code: 'KV-HEB',
        state_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        district_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        organization_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        board: 'CBSE',
        state: 'Karnataka',
        city: 'Bengaluru',
        contact_email: 'kv.hebbal@kvs.edu.in',
      };
      const result = SchoolOnboardingSchema.safeParse(onboardPayload);
      expect(result.success).toBe(true);
    });

    it('Allows onboarding an independent school without state, district, or organization IDs', () => {
      const independentSchool = {
        name: 'St. Peter Independent Academy',
        code: 'SPIA-01',
        board: 'ICSE',
        state: 'Himachal Pradesh',
        city: 'Shimla',
        contact_email: 'admin@stpeteracademy.edu.in',
      };
      const result = SchoolOnboardingSchema.safeParse(independentSchool);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.state_id).toBeUndefined();
        expect(result.data.district_id).toBeUndefined();
        expect(result.data.organization_id).toBeUndefined();
      }
    });

    it('Rejects invalid UUID format for state_id or district_id', () => {
      const malformedPayload = {
        name: 'Test School',
        code: 'TST-01',
        board: 'CBSE',
        state: 'Karnataka',
        city: 'Bengaluru',
        contact_email: 'test@school.edu.in',
        state_id: 'invalid-non-uuid-string',
      };
      const result = SchoolOnboardingSchema.safeParse(malformedPayload);
      expect(result.success).toBe(false);
    });
  });
});
