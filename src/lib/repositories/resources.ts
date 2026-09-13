import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  ResourceType,
  ResourceStatus,
  ValidationStatus,
  CreateResourceInput,
  UpdateResourceInput,
  ResourceQuery,
} from '@/lib/validations/resources';
import { contentValidator } from '@/lib/services/contentValidator';

export interface ResourceRecord {
  id: string;
  school_id: string | null;
  owner_id: string;
  grade_id: string | null;
  subject_id: string | null;
  book_id: string | null;
  chapter_id: string | null;
  concept_ids: string[];
  resource_type: ResourceType;
  title: string;
  description: string | null;
  language: string;
  status: ResourceStatus;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  validation_status: ValidationStatus;
  validation_score: number | null;
  validation_errors: Array<Record<string, unknown>>;
  validation_warnings: Array<Record<string, unknown>>;
  validated_at: string | null;
  validated_by: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  owner?: { full_name?: string; email?: string } | null;
}

export interface ResourceVersionRecord {
  id: string;
  resource_id: string;
  version_number: number;
  title: string;
  content: Record<string, unknown>;
  snapshot: Record<string, unknown>;
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ResourceListResult {
  resources: ResourceRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const resourcesRepository = {
  /**
   * Lists resources with filtering, search, sorting, and pagination.
   */
  async getResources(
    params: Partial<ResourceQuery> & { ownerId?: string; schoolId?: string | null; publishedOnly?: boolean },
    client: SupabaseClient = defaultClient
  ): Promise<ResourceListResult> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let query = client
      .from('resources')
      .select('*, owner:profiles!owner_id(full_name, email)', { count: 'exact' });

    // Filter active (non-archived unless specifically querying archived status)
    if (params.status === 'ARCHIVED') {
      query = query.eq('is_archived', true);
    } else {
      query = query.eq('is_archived', false);
      if (params.status) {
        query = query.eq('status', params.status);
      }
    }

    if (params.publishedOnly) {
      query = query.eq('status', 'PUBLISHED');
    }

    if (params.ownerId) {
      query = query.eq('owner_id', params.ownerId);
    }

    if (params.schoolId) {
      query = query.eq('school_id', params.schoolId);
    }

    if (params.resource_type) {
      query = query.eq('resource_type', params.resource_type);
    }

    if (params.grade_id) {
      query = query.eq('grade_id', params.grade_id);
    }

    if (params.subject_id) {
      query = query.eq('subject_id', params.subject_id);
    }

    if (params.chapter_id) {
      query = query.eq('chapter_id', params.chapter_id);
    }

    if (params.language) {
      query = query.eq('language', params.language);
    }

    if (params.search && params.search.trim().length > 0) {
      query = query.ilike('title', `%${params.search.trim()}%`);
    }

    const sortBy = params.sort_by || 'updated_at';
    const sortOrder = params.sort_order === 'asc' ? { ascending: true } : { ascending: false };
    query = query.order(sortBy, sortOrder).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch resources: ${error.message}`);
    }

    const total = count || 0;
    const resources = (data || []).map((row) => this.mapRowToRecord(row));

    return {
      resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  /**
   * Fetches single resource by ID.
   */
  async getResourceById(id: string, client: SupabaseClient = defaultClient): Promise<ResourceRecord | null> {
    const { data, error } = await client
      .from('resources')
      .select('*, owner:profiles!owner_id(full_name, email)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch resource: ${error.message}`);
    }

    return data ? this.mapRowToRecord(data) : null;
  },

  /**
   * Creates a new educational resource draft and validates content.
   */
  async createResource(
    ownerId: string,
    schoolId: string | null,
    input: CreateResourceInput,
    client: SupabaseClient = defaultClient
  ): Promise<ResourceRecord> {
    // Run initial deterministic validation
    const validation = contentValidator.validateContent(
      input.resource_type,
      input.content || {},
      input.language || 'en'
    );

    const { data, error } = await client
      .from('resources')
      .insert([
        {
          owner_id: ownerId,
          school_id: schoolId,
          grade_id: input.grade_id || null,
          subject_id: input.subject_id || null,
          book_id: input.book_id || null,
          chapter_id: input.chapter_id || null,
          concept_ids: input.concept_ids || [],
          resource_type: input.resource_type,
          title: input.title,
          description: input.description || null,
          language: input.language || 'en',
          content: input.content || {},
          metadata: input.metadata || {},
          status: input.status || 'DRAFT',
          validation_status: validation.status,
          validation_score: validation.score,
          validation_errors: validation.errors,
          validation_warnings: validation.warnings,
          validated_at: validation.validated_at,
          validated_by: ownerId,
        },
      ])
      .select('*, owner:profiles!owner_id(full_name, email)')
      .single();

    if (error || !data) {
      throw new Error(`Failed to create resource: ${error?.message || 'Unknown database error'}`);
    }

    const resource = this.mapRowToRecord(data);

    // Create initial version 1 snapshot
    await this.createVersion(resource.id, 1, resource.title, resource.content, 'Initial version created', ownerId, client);

    return resource;
  },

  /**
   * Updates an existing resource and creates an incremental version if content changes.
   */
  async updateResource(
    id: string,
    userId: string,
    input: UpdateResourceInput,
    client: SupabaseClient = defaultClient
  ): Promise<ResourceRecord> {
    const existing = await this.getResourceById(id, client);
    if (!existing) {
      throw new Error(`Resource not found: ${id}`);
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updated_by: userId,
    };

    if (input.title !== undefined) updatePayload.title = input.title;
    if (input.description !== undefined) updatePayload.description = input.description;
    if (input.grade_id !== undefined) updatePayload.grade_id = input.grade_id;
    if (input.subject_id !== undefined) updatePayload.subject_id = input.subject_id;
    if (input.book_id !== undefined) updatePayload.book_id = input.book_id;
    if (input.chapter_id !== undefined) updatePayload.chapter_id = input.chapter_id;
    if (input.concept_ids !== undefined) updatePayload.concept_ids = input.concept_ids;
    if (input.language !== undefined) updatePayload.language = input.language;
    if (input.metadata !== undefined) updatePayload.metadata = input.metadata;

    let contentChanged = false;
    if (input.content !== undefined) {
      updatePayload.content = input.content;
      contentChanged = true;

      // Re-run validation on new content
      const validation = contentValidator.validateContent(
        existing.resource_type,
        input.content,
        input.language || existing.language
      );
      updatePayload.validation_status = validation.status;
      updatePayload.validation_score = validation.score;
      updatePayload.validation_errors = validation.errors;
      updatePayload.validation_warnings = validation.warnings;
      updatePayload.validated_at = validation.validated_at;
      updatePayload.validated_by = userId;
    }

    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }

    const { data, error } = await client
      .from('resources')
      .update(updatePayload)
      .eq('id', id)
      .select('*, owner:profiles!owner_id(full_name, email)')
      .single();

    if (error || !data) {
      throw new Error(`Failed to update resource: ${error?.message || 'Unknown database error'}`);
    }

    const updated = this.mapRowToRecord(data);

    // If content changed, create incremental version
    if (contentChanged) {
      const versions = await this.getResourceVersions(id, client);
      const nextVersionNum = (versions[0]?.version_number || 1) + 1;
      await this.createVersion(
        id,
        nextVersionNum,
        updated.title,
        updated.content,
        input.change_summary || `Updated version ${nextVersionNum}`,
        userId,
        client
      );
    }

    return updated;
  },

  /**
   * Publishes a resource and generates an immutable snapshot.
   */
  async publishResource(
    id: string,
    userId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ResourceRecord> {
    const resource = await this.getResourceById(id, client);
    if (!resource) {
      throw new Error(`Resource not found: ${id}`);
    }

    // Must pass validation (no fatal errors)
    const validation = contentValidator.validateContent(
      resource.resource_type,
      resource.content,
      resource.language
    );

    if (validation.status === 'FAILED') {
      throw new Error(`Cannot publish invalid content: ${validation.summary}`);
    }

    const { data, error } = await client
      .from('resources')
      .update({
        status: 'PUBLISHED',
        validation_status: validation.status,
        validation_score: validation.score,
        validation_errors: validation.errors,
        validation_warnings: validation.warnings,
        validated_at: validation.validated_at,
        validated_by: userId,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq('id', id)
      .select('*, owner:profiles!owner_id(full_name, email)')
      .single();

    if (error || !data) {
      throw new Error(`Failed to publish resource: ${error?.message || 'Unknown error'}`);
    }

    const published = this.mapRowToRecord(data);

    // Create published snapshot version
    const versions = await this.getResourceVersions(id, client);
    const nextVer = (versions[0]?.version_number || 1) + 1;
    await this.createVersion(id, nextVer, published.title, published.content, 'Published version snapshot', userId, client);

    return published;
  },

  /**
   * Archives a resource.
   */
  async archiveResource(id: string, client: SupabaseClient = defaultClient): Promise<void> {
    const { error } = await client
      .from('resources')
      .update({
        status: 'ARCHIVED',
        is_archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to archive resource: ${error.message}`);
    }
  },

  /**
   * Deletes a resource.
   */
  async deleteResource(id: string, client: SupabaseClient = defaultClient): Promise<void> {
    const { error } = await client
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete resource: ${error.message}`);
    }
  },

  /**
   * Version management: creates an immutable snapshot record.
   */
  async createVersion(
    resourceId: string,
    versionNumber: number,
    title: string,
    content: Record<string, unknown>,
    changeSummary: string,
    userId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ResourceVersionRecord> {
    const { data, error } = await client
      .from('resource_versions')
      .insert([
        {
          resource_id: resourceId,
          version_number: versionNumber,
          title,
          content,
          snapshot: { title, content, version: versionNumber, saved_at: new Date().toISOString() },
          change_summary: changeSummary,
          created_by: userId,
        },
      ])
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(`Failed to create version: ${error?.message}`);
    }

    return {
      id: data.id,
      resource_id: data.resource_id,
      version_number: data.version_number,
      title: data.title,
      content: data.content,
      snapshot: data.snapshot,
      change_summary: data.change_summary,
      created_by: data.created_by,
      created_at: data.created_at,
    };
  },

  /**
   * Lists version history for a resource.
   */
  async getResourceVersions(
    resourceId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ResourceVersionRecord[]> {
    const { data, error } = await client
      .from('resource_versions')
      .select('*')
      .eq('resource_id', resourceId)
      .order('version_number', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch resource versions: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      resource_id: row.resource_id,
      version_number: row.version_number,
      title: row.title,
      content: row.content,
      snapshot: row.snapshot,
      change_summary: row.change_summary,
      created_by: row.created_by,
      created_at: row.created_at,
    }));
  },

  /**
   * Rolls back a resource to a prior version.
   */
  async restoreResourceVersion(
    resourceId: string,
    versionNumber: number,
    userId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ResourceRecord> {
    const { data: version, error: vErr } = await client
      .from('resource_versions')
      .select('*')
      .eq('resource_id', resourceId)
      .eq('version_number', versionNumber)
      .single();

    if (vErr || !version) {
      throw new Error(`Version ${versionNumber} not found for resource ${resourceId}`);
    }

    return this.updateResource(
      resourceId,
      userId,
      {
        title: version.title,
        content: version.content,
        change_summary: `Rollback to version ${versionNumber}`,
      },
      client
    );
  },

  /**
   * Tracks resource usage (e.g. presentation launched, downloaded).
   */
  async trackUsage(
    resourceId: string,
    userId: string | null,
    action: 'OPENED' | 'PRESENTED' | 'ASSIGNED' | 'COMPLETED' | 'DOWNLOADED',
    metadata: Record<string, unknown> = {},
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    await client
      .from('resource_usage')
      .insert([
        {
          resource_id: resourceId,
          user_id: userId,
          action,
          metadata,
        },
      ]);
  },

  /**
   * Internal mapper from database row to typed ResourceRecord.
   */
  mapRowToRecord(row: Record<string, unknown>): ResourceRecord {
    const owner = row.owner as { full_name?: string; email?: string } | undefined;

    return {
      id: row.id as string,
      school_id: (row.school_id as string) || null,
      owner_id: row.owner_id as string,
      grade_id: (row.grade_id as string) || null,
      subject_id: (row.subject_id as string) || null,
      book_id: (row.book_id as string) || null,
      chapter_id: (row.chapter_id as string) || null,
      concept_ids: (row.concept_ids as string[]) || [],
      resource_type: row.resource_type as ResourceType,
      title: row.title as string,
      description: (row.description as string) || null,
      language: (row.language as string) || 'en',
      status: row.status as ResourceStatus,
      content: (row.content as Record<string, unknown>) || {},
      metadata: (row.metadata as Record<string, unknown>) || {},
      validation_status: (row.validation_status as ValidationStatus) || 'PENDING',
      validation_score: row.validation_score !== undefined && row.validation_score !== null ? Number(row.validation_score) : null,
      validation_errors: (row.validation_errors as Array<Record<string, unknown>>) || [],
      validation_warnings: (row.validation_warnings as Array<Record<string, unknown>>) || [],
      validated_at: (row.validated_at as string) || null,
      validated_by: (row.validated_by as string) || null,
      is_archived: Boolean(row.is_archived),
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      owner: owner ? { full_name: owner.full_name, email: owner.email } : null,
    };
  },
};
