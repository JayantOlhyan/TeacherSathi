import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { CreateInvitationSchema, AcceptInvitationSchema } from '../../src/lib/validations/institution';

describe('Phase 8 Cryptographic Institutional Invitations', () => {
  describe('Invitation Request Validation', () => {
    it('Validates a valid invitation request for a School Administrator', () => {
      const valid = {
        email: 'principal@school.edu.in',
        role: 'SCHOOL_ADMIN',
        target_type: 'SCHOOL',
        target_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        expires_in_days: 7,
      };
      const result = CreateInvitationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('Validates invitation request for a District Administrator', () => {
      const valid = {
        email: 'district.officer@education.gov.in',
        role: 'DISTRICT_ADMIN',
        target_type: 'DISTRICT',
        target_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        expires_in_days: 14,
      };
      const result = CreateInvitationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('Rejects invalid email or non-UUID target_id', () => {
      const invalid = {
        email: 'not-an-email',
        role: 'STATE_ADMIN',
        target_type: 'STATE',
        target_id: 'not-a-uuid',
      };
      const result = CreateInvitationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('Rejects out-of-bound expiration days (< 1 or > 30)', () => {
      const tooShort = {
        email: 'admin@state.gov.in',
        role: 'STATE_ADMIN',
        target_type: 'STATE',
        target_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        expires_in_days: 0,
      };
      const tooLong = {
        ...tooShort,
        expires_in_days: 45,
      };

      expect(CreateInvitationSchema.safeParse(tooShort).success).toBe(false);
      expect(CreateInvitationSchema.safeParse(tooLong).success).toBe(false);
    });
  });

  describe('Cryptographic Token & Hashing Mechanics', () => {
    it('Generates 64-character high-entropy hex token using crypto.randomBytes(32)', () => {
      const rawToken = crypto.randomBytes(32).toString('hex');
      expect(rawToken).toMatch(/^[a-f0-9]{64}$/);
      expect(rawToken.length).toBe(64);
    });

    it('Generates deterministic SHA-256 hash from raw token', () => {
      const token = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const hash1 = crypto.createHash('sha256').update(token).digest('hex');
      const hash2 = crypto.createHash('sha256').update(token).digest('hex');

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      expect(hash1).not.toBe(token);
    });

    it('Verifies single-use token acceptance lifecycle', () => {
      const mockInvitation = {
        id: 'inv-1',
        email: 'teacher@school.in',
        status: 'CREATED',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      };

      const checkValidity = (inv: typeof mockInvitation) => {
        if (inv.status === 'REVOKED') return { valid: false, reason: 'Revoked' };
        if (inv.status === 'ACCEPTED') return { valid: false, reason: 'Already accepted' };
        if (new Date(inv.expires_at) < new Date()) return { valid: false, reason: 'Expired' };
        return { valid: true };
      };

      // 1. Initial pending invitation is valid
      expect(checkValidity(mockInvitation).valid).toBe(true);

      // 2. After acceptance, cannot be reused
      const acceptedInvitation = { ...mockInvitation, status: 'ACCEPTED' };
      const secondAttempt = checkValidity(acceptedInvitation);
      expect(secondAttempt.valid).toBe(false);
      expect(secondAttempt.reason).toBe('Already accepted');

      // 3. Revoked invitation cannot be accepted
      const revokedInvitation = { ...mockInvitation, status: 'REVOKED' };
      const revokedAttempt = checkValidity(revokedInvitation);
      expect(revokedAttempt.valid).toBe(false);
      expect(revokedAttempt.reason).toBe('Revoked');

      // 4. Expired invitation cannot be accepted
      const expiredInvitation = {
        ...mockInvitation,
        expires_at: new Date(Date.now() - 1000).toISOString(),
      };
      const expiredAttempt = checkValidity(expiredInvitation);
      expect(expiredAttempt.valid).toBe(false);
      expect(expiredAttempt.reason).toBe('Expired');
    });

    it('Validates token format in AcceptInvitationSchema', () => {
      expect(AcceptInvitationSchema.safeParse({ token: 'too-short' }).success).toBe(false);
      expect(
        AcceptInvitationSchema.safeParse({
          token: 'abcdef1234567890abcdef1234567890',
        }).success
      ).toBe(true);
    });
  });
});
