import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import { sanitizeSvg } from '@/lib/security/svgSanitizer';

export type StorageBucket = 'teacher-resources' | 'presentation-assets' | 'video-assets' | 'thumbnails';

export const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  // Documents
  'application/pdf',
]);

export const MAX_FILE_SIZES: Record<StorageBucket, number> = {
  'thumbnails': 2 * 1024 * 1024, // 2MB
  'presentation-assets': 10 * 1024 * 1024, // 10MB
  'teacher-resources': 25 * 1024 * 1024, // 25MB
  'video-assets': 100 * 1024 * 1024, // 100MB
};

export const storageService = {
  /**
   * Sanitizes user-supplied path to prevent path traversal and null byte injections.
   */
  sanitizePath(rawPath: string): string {
    // Strip leading slashes, null bytes, and directory traversal sequences
    const sanitized = rawPath
      .replace(/\0/g, '')
      .replace(/(\.\.[\/\\])+/g, '')
      .replace(/^[\/\\]+/, '')
      .replace(/[^a-zA-Z0-9_\-\.\/]/g, '_');

    if (!sanitized || sanitized === '.' || sanitized === '..') {
      throw new Error('Invalid storage path provided');
    }
    return sanitized;
  },

  /**
   * Validates MIME type and size boundaries.
   */
  validateFile(mimeType: string, sizeBytes: number, bucket: StorageBucket): void {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new Error(`Unsupported MIME type: "${mimeType}". Allowed types: images, mp4/webm videos, and PDFs.`);
    }

    const maxAllowed = MAX_FILE_SIZES[bucket];
    if (sizeBytes > maxAllowed) {
      const maxMb = Math.round(maxAllowed / (1024 * 1024));
      throw new Error(`File size (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed for bucket ${bucket} (${maxMb}MB).`);
    }
  },

  /**
   * Strictly validates SVG XML to prevent XSS, script injection, and XXE vulnerabilities.
   */
  validateSvgContent(rawSvg: string): void {
    const result = sanitizeSvg(rawSvg);
    if (!result.isValid || result.threatsDetected.length > 0) {
      throw new Error(`Unsafe SVG content rejected: ${result.threatsDetected.join('; ')}`);
    }
  },

  /**
   * Generates a signed URL for reading a private media asset.
   */
  async getSignedDownloadUrl(
    bucket: StorageBucket,
    filePath: string,
    expiresInSeconds: number = 3600,
    client: SupabaseClient = defaultClient
  ): Promise<string> {
    const cleanPath = this.sanitizePath(filePath);
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(cleanPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${error?.message || 'Unknown error'}`);
    }

    return data.signedUrl;
  },

  /**
   * Generates a signed upload URL for secure client direct uploads.
   */
  async createSignedUploadUrl(
    bucket: StorageBucket,
    filePath: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ signedUrl: string; path: string; token: string }> {
    const cleanPath = this.sanitizePath(filePath);
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUploadUrl(cleanPath);

    if (error || !data) {
      throw new Error(`Failed to create signed upload URL: ${error?.message || 'Unknown error'}`);
    }

    return {
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    };
  },

  /**
   * Direct server upload helper for small assets (thumbnails, exported PDFs).
   */
  async uploadBuffer(
    bucket: StorageBucket,
    filePath: string,
    buffer: Buffer | Uint8Array,
    mimeType: string,
    client: SupabaseClient = defaultClient
  ): Promise<string> {
    const cleanPath = this.sanitizePath(filePath);
    this.validateFile(mimeType, buffer.byteLength, bucket);

    const { error } = await client.storage
      .from(bucket)
      .upload(cleanPath, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload file to storage: ${error.message}`);
    }

    return cleanPath;
  },
};
