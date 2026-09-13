import { describe, it, expect } from 'vitest';
import { storageService, MAX_FILE_SIZES } from '@/lib/media/storageService';
import { mediaProcessor } from '@/lib/media/mediaProcessor';

describe('Media Processing & Storage Security (Section 11, 14, 21)', () => {
  describe('Path Traversal Sanitization', () => {
    it('strips directory traversal sequences and leading slashes', () => {
      const dangerous1 = '../../../../etc/passwd';
      const clean1 = storageService.sanitizePath(dangerous1);
      expect(clean1).not.toContain('..');
      expect(clean1).toBe('etc_passwd');

      const dangerous2 = '/var/root/secret.png';
      const clean2 = storageService.sanitizePath(dangerous2);
      expect(clean2.startsWith('/')).toBe(false);
      expect(clean2).toBe('var_root_secret.png');
    });

    it('removes null bytes and invalid characters', () => {
      const nullByteInjection = 'malicious.pdf\0.jpg';
      const clean = storageService.sanitizePath(nullByteInjection);
      expect(clean).not.toContain('\0');
      expect(clean).toBe('malicious.pdf.jpg');
    });

    it('throws when path evaluates to empty or dots', () => {
      expect(() => storageService.sanitizePath('..')).toThrow('Invalid storage path');
      expect(() => storageService.sanitizePath('')).toThrow('Invalid storage path');
    });
  });

  describe('File Size & MIME Boundaries', () => {
    it('enforces maximum file sizes per bucket', () => {
      // 3MB thumbnail exceeds 2MB limit
      expect(() =>
        storageService.validateFile('image/jpeg', 3 * 1024 * 1024, 'thumbnails')
      ).toThrow('exceeds maximum allowed');

      // 1MB thumbnail passes
      expect(() =>
        storageService.validateFile('image/jpeg', 1 * 1024 * 1024, 'thumbnails')
      ).not.toThrow();

      // 80MB video passes video-assets (100MB limit)
      expect(() =>
        storageService.validateFile('video/mp4', 80 * 1024 * 1024, 'video-assets')
      ).not.toThrow();

      // 120MB video exceeds video-assets limit
      expect(() =>
        storageService.validateFile('video/mp4', 120 * 1024 * 1024, 'video-assets')
      ).toThrow('exceeds maximum allowed');
    });

    it('rejects unsupported or dangerous MIME types', () => {
      expect(() =>
        storageService.validateFile('application/x-sh', 1024, 'teacher-resources')
      ).toThrow('Unsupported MIME type');

      expect(() =>
        storageService.validateFile('application/x-executable', 1024, 'teacher-resources')
      ).toThrow('Unsupported MIME type');
    });
  });

  describe('File Magic Bytes Authentication', () => {
    it('authenticates valid JPEG headers', () => {
      const jpegBuffer = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
      expect(mediaProcessor.validateMagicBytes(jpegBuffer, 'image/jpeg')).toBe(true);

      const fakeJpeg = new Uint8Array([0x89, 0x50, 0x4E, 0x47]); // PNG header labeled as JPEG
      expect(mediaProcessor.validateMagicBytes(fakeJpeg, 'image/jpeg')).toBe(false);
    });

    it('authenticates valid PNG headers', () => {
      const pngBuffer = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      expect(mediaProcessor.validateMagicBytes(pngBuffer, 'image/png')).toBe(true);

      const invalidPng = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
      expect(mediaProcessor.validateMagicBytes(invalidPng, 'image/png')).toBe(false);
    });

    it('authenticates valid PDF headers (%PDF)', () => {
      const pdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35]);
      expect(mediaProcessor.validateMagicBytes(pdfBuffer, 'application/pdf')).toBe(true);

      const fakePdf = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
      expect(mediaProcessor.validateMagicBytes(fakePdf, 'application/pdf')).toBe(false);
    });

    it('authenticates valid WebM video headers', () => {
      const webmBuffer = new Uint8Array([0x1A, 0x45, 0xDF, 0xA3, 0x9F]);
      expect(mediaProcessor.validateMagicBytes(webmBuffer, 'video/webm')).toBe(true);
    });

    it('authenticates valid MP4 headers (ftyp box)', () => {
      // 00 00 00 18 'f' 't' 'y' 'p' 'm' 'p' '4' '2'
      const mp4Buffer = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32]);
      expect(mediaProcessor.validateMagicBytes(mp4Buffer, 'video/mp4')).toBe(true);
    });
  });
});
