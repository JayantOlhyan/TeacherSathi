import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import {
  MediaUploadInput,
  MediaJobType,
  MediaJobStatus,
} from '@/lib/validations/resources';
import { MediaAssetRecord, MediaProcessingJob } from '@/lib/media/types';

export const mediaRepository = {
  /**
   * Creates a new media asset record in UPLOADING or READY status.
   */
  async createMediaAsset(
    ownerId: string,
    schoolId: string | null,
    input: MediaUploadInput & { filePath?: string },
    client: SupabaseClient = defaultClient
  ): Promise<MediaAssetRecord> {
    const isExternal = input.source === 'EXTERNAL';

    const { data, error } = await client
      .from('media_assets')
      .insert([
        {
          owner_id: ownerId,
          school_id: schoolId,
          title: input.title,
          description: input.description || null,
          mime_type: input.mime_type,
          size_bytes: input.size_bytes,
          source: input.source,
          source_url: input.source_url || null,
          file_path: input.filePath || null,
          language: input.language || 'en',
          curriculum_mapping: input.curriculum_mapping || {},
          status: isExternal ? 'READY' : 'UPLOADING',
        },
      ])
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(`Failed to create media asset: ${error?.message || 'Database error'}`);
    }

    return this.mapRowToRecord(data);
  },

  /**
   * Fetches single media asset by ID.
   */
  async getMediaAssetById(id: string, client: SupabaseClient = defaultClient): Promise<MediaAssetRecord | null> {
    const { data, error } = await client
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch media asset: ${error.message}`);
    }

    return data ? this.mapRowToRecord(data) : null;
  },

  /**
   * Lists media assets for an owner or school.
   */
  async listMediaAssets(
    options: { ownerId?: string; schoolId?: string | null; mimePrefix?: string },
    client: SupabaseClient = defaultClient
  ): Promise<MediaAssetRecord[]> {
    let query = client.from('media_assets').select('*');

    if (options.ownerId) {
      query = query.eq('owner_id', options.ownerId);
    }
    if (options.schoolId) {
      query = query.eq('school_id', options.schoolId);
    }
    if (options.mimePrefix) {
      query = query.like('mime_type', `${options.mimePrefix}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      throw new Error(`Failed to list media assets: ${error.message}`);
    }

    return (data || []).map((row) => this.mapRowToRecord(row));
  },

  /**
   * Creates an asynchronous media processing job.
   */
  async createMediaJob(
    assetId: string,
    jobType: MediaJobType,
    client: SupabaseClient = defaultClient
  ): Promise<MediaProcessingJob> {
    const { data, error } = await client
      .from('media_jobs')
      .insert([
        {
          asset_id: assetId,
          job_type: jobType,
          status: 'QUEUED',
        },
      ])
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(`Failed to create media job: ${error?.message}`);
    }

    return {
      id: data.id,
      assetId: data.asset_id,
      jobType: data.job_type,
      status: data.status,
      retryCount: data.retry_count || 0,
      errorMessage: data.error_message,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      createdAt: data.created_at,
    };
  },

  /**
   * Updates status of a media job.
   */
  async updateMediaJobStatus(
    jobId: string,
    status: MediaJobStatus,
    errorMessage?: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const updatePayload: Record<string, unknown> = {
      status,
      error_message: errorMessage || null,
    };
    if (status === 'PROCESSING') {
      updatePayload.started_at = new Date().toISOString();
    } else if (status === 'COMPLETED' || status === 'FAILED') {
      updatePayload.completed_at = new Date().toISOString();
    }

    const { error } = await client
      .from('media_jobs')
      .update(updatePayload)
      .eq('id', jobId);

    if (error) {
      throw new Error(`Failed to update media job status: ${error.message}`);
    }
  },

  /**
   * Deletes a media asset record.
   */
  async deleteMediaAsset(id: string, client: SupabaseClient = defaultClient): Promise<void> {
    const { error } = await client
      .from('media_assets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete media asset: ${error.message}`);
    }
  },

  /**
   * Maps raw database row to MediaAssetRecord.
   */
  mapRowToRecord(row: Record<string, unknown>): MediaAssetRecord {
    return {
      id: row.id as string,
      schoolId: (row.school_id as string) || null,
      ownerId: row.owner_id as string,
      title: row.title as string,
      description: (row.description as string) || null,
      duration: row.duration !== undefined && row.duration !== null ? Number(row.duration) : null,
      thumbnailUrl: (row.thumbnail_url as string) || null,
      source: row.source as 'UPLOAD' | 'EXTERNAL' | 'PLATFORM',
      sourceUrl: (row.source_url as string) || null,
      filePath: (row.file_path as string) || null,
      mimeType: row.mime_type as string,
      sizeBytes: Number(row.size_bytes || 0),
      language: (row.language as string) || 'en',
      curriculumMapping: (row.curriculum_mapping as Record<string, unknown>) || {},
      status: row.status as 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED',
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  },
};
