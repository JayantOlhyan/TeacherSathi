import crypto from 'crypto';

export const PAIRING_TOKEN_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a cryptographically random, high-entropy pairing token.
 * Output: 64-character hex string.
 */
export function generatePairingToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Compute SHA-256 hash of a pairing token.
 * Raw tokens are never stored in the database or logged in plaintext.
 */
export function hashPairingToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Checks whether a given expiration ISO string or Date is expired.
 */
export function isTokenExpired(expiresAt: string | Date): boolean {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt).getTime() : expiresAt.getTime();
  return Date.now() > expiry;
}

/**
 * Generates an authoritative QR pairing URL containing the ephemeral single-use token.
 */
export function createPairingUrl(origin: string, token: string, sessionId: string): string {
  const url = new URL('/auth/qr-confirm', origin || 'http://localhost:3000');
  url.searchParams.set('token', token);
  url.searchParams.set('session_id', sessionId);
  return url.toString();
}
