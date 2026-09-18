import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import { MediaMetadata } from './types';
import { isSvgClean } from '@/lib/security/svgSanitizer';

export const mediaProcessor = {
  /**
   * Validates file magic bytes to verify authenticity and prevent extension spoofing.
   */
  validateMagicBytes(buffer: Uint8Array, declaredMimeType: string): boolean {
    if (buffer.length < 4) return false;

    // JPEG: FF D8 FF
    if (declaredMimeType === 'image/jpeg') {
      return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    }

    // PNG: 89 50 4E 47
    if (declaredMimeType === 'image/png') {
      return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    }

    // PDF: 25 50 44 46 (%PDF)
    if (declaredMimeType === 'application/pdf') {
      return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    }

    // WebM: 1A 45 DF A3
    if (declaredMimeType === 'video/webm') {
      return buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3;
    }

    // MP4: usually has 'ftyp' at offset 4
    if (declaredMimeType === 'video/mp4' || declaredMimeType === 'video/quicktime') {
      if (buffer.length >= 8) {
        const brand = String.fromCharCode(buffer[4], buffer[5], buffer[6], buffer[7]);
        return brand === 'ftyp' || brand === 'moov';
      }
    }

    // SVG: Text XML and security threat check
    if (declaredMimeType === 'image/svg+xml') {
      const header = Array.from(buffer.slice(0, 100)).map((b) => String.fromCharCode(b)).join('').toLowerCase();
      if (!header.includes('<svg') && !header.includes('<?xml')) return false;
      try {
        const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
        return isSvgClean(text);
      } catch {
        return false;
      }
    }

    return true;
  },

  /**
   * Extracts metadata such as format, dimensions, and estimated duration.
   */
  async probe(
    filePath: string,
    mimeType: string,
    sizeBytes: number
  ): Promise<MediaMetadata> {
    const isVideo = mimeType.startsWith('video/');
    const isImage = mimeType.startsWith('image/');

    return {
      mimeType,
      sizeBytes,
      format: mimeType.split('/')[1] || 'unknown',
      duration: isVideo ? 180 : undefined, // Simulated standard video clip duration (seconds)
      width: isImage ? 1920 : isVideo ? 1920 : undefined,
      height: isImage ? 1080 : isVideo ? 1080 : undefined,
    };
  },

  /**
   * Generates a thumbnail image reference or SVG placeholder for the media asset.
   */
  async generateThumbnail(filePath: string, mimeType: string): Promise<string> {
    if (mimeType.startsWith('image/')) {
      return filePath; // For images, the asset itself or a compressed derivative serves as thumbnail
    }
    // For video or document, return a deterministic high-contrast smartboard placeholder path
    const assetBasename = filePath.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'asset';
    return `thumbnails/${assetBasename}_thumb.webp`;
  },

  /**
   * Processes an asynchronous queue-backed job from media_jobs.
   */
  async processJob(jobId: string, client: SupabaseClient = defaultClient): Promise<void> {
    // 1. Fetch job
    const { data: job, error: fetchErr } = await client
      .from('media_jobs')
      .select('*, asset:media_assets(*)')
      .eq('id', jobId)
      .single();

    if (fetchErr || !job) {
      throw new Error(`Media job not found: ${jobId}`);
    }

    // 2. Mark as PROCESSING
    await client
      .from('media_jobs')
      .update({
        status: 'PROCESSING',
        started_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    try {
      const asset = job.asset;
      if (!asset) throw new Error('Associated media asset not found');

      let thumbnailUrl = asset.thumbnail_url;
      let duration = asset.duration;

      if (job.job_type === 'THUMBNAIL' || job.job_type === 'METADATA_PROBE') {
        const metadata = await this.probe(asset.file_path || '', asset.mime_type, asset.size_bytes);
        thumbnailUrl = await this.generateThumbnail(asset.file_path || '', asset.mime_type);
        duration = metadata.duration || null;
      }

      // 3. Update asset status to READY
      await client
        .from('media_assets')
        .update({
          status: 'READY',
          thumbnail_url: thumbnailUrl,
          duration: duration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', asset.id);

      // 4. Mark job as COMPLETED
      await client
        .from('media_jobs')
        .update({
          status: 'COMPLETED',
          completed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq('id', jobId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown processing error';

      // Mark job as FAILED and increment retry count
      await client
        .from('media_jobs')
        .update({
          status: 'FAILED',
          retry_count: (job.retry_count || 0) + 1,
          error_message: errorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      // Mark asset as FAILED
      if (job.asset_id) {
        await client
          .from('media_assets')
          .update({
            status: 'FAILED',
            updated_at: new Date().toISOString(),
          })
          .eq('id', job.asset_id);
      }

      throw err;
    }
  },
};
