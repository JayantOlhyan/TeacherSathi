import { describe, it, expect } from 'vitest';
import {
  generatePairingToken,
  hashPairingToken,
  isTokenExpired,
  createPairingUrl,
  PAIRING_TOKEN_LIFETIME_MS,
} from '@/lib/classroom/pairing';

describe('QR Pairing & Cryptographic Handshake (Section 6 & 7)', () => {
  it('generates high-entropy 64-character hex tokens', () => {
    const token1 = generatePairingToken();
    const token2 = generatePairingToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).toMatch(/^[0-9a-f]{64}$/);
    expect(token1).not.toBe(token2);
  });

  it('computes deterministic SHA-256 hash without exposing raw secrets', () => {
    const rawToken = '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a';
    const hash1 = hashPairingToken(rawToken);
    const hash2 = hashPairingToken(rawToken);

    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(rawToken);
  });

  it('correctly detects token expiration against the 5-minute cutoff', () => {
    const futureTime = new Date(Date.now() + PAIRING_TOKEN_LIFETIME_MS).toISOString();
    expect(isTokenExpired(futureTime)).toBe(false);

    const pastTime = new Date(Date.now() - 1000).toISOString();
    expect(isTokenExpired(pastTime)).toBe(true);

    const farPastTime = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(isTokenExpired(farPastTime)).toBe(true);
  });

  it('generates valid QR pairing URLs without exposing database internals', () => {
    const token = generatePairingToken();
    const sessionId = 'sess_89412';
    const url = createPairingUrl('https://teachersathi.in', token, sessionId);

    const parsed = new URL(url);
    expect(parsed.origin).toBe('https://teachersathi.in');
    expect(parsed.pathname).toBe('/auth/qr-confirm');
    expect(parsed.searchParams.get('token')).toBe(token);
    expect(parsed.searchParams.get('session_id')).toBe(sessionId);
  });
});
