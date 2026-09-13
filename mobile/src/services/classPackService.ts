import { ApiClient } from './apiClient';
import { DatabaseManager, databaseManager } from '../database/databaseManager';
import { CachedClassPackItem } from '../types';

export interface ClassPackBundle {
  packId: string;
  chapterId: string;
  titleEn: string;
  titleHi?: string;
  chapterNumber: number;
  bookId?: string;
  curriculum: {
    concepts: Array<{ id: string; name_en: string; name_hi?: string; [key: string]: unknown }>;
  };
  content: {
    presentation?: Record<string, unknown> | null;
    mindmap?: Record<string, unknown> | null;
    activities?: Array<Record<string, unknown>>;
    lessonPlans?: Array<Record<string, unknown>>;
  };
  quiz: {
    questions?: Array<Record<string, unknown>>;
  };
  metadata: {
    packagedAt: string;
    checksum: string;
    estimatedSizeBytes: number;
    version: number;
  };
}

export class ClassPackService {
  private apiClient: ApiClient;
  private db: DatabaseManager;

  constructor(apiClient: ApiClient, db: DatabaseManager = databaseManager) {
    this.apiClient = apiClient;
    this.db = db;
  }

  /**
   * Compute SHA-256 hash across web, node, and react-native environments
   */
  async computeChecksum(payload: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nodeCrypto = require('crypto');
      return nodeCrypto.createHash('sha256').update(payload).digest('hex');
    } catch {
      let hash = 0;
      for (let i = 0; i < payload.length; i++) {
        hash = (hash << 5) - hash + payload.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(16).padStart(64, '0');
    }
  }

  /**
   * Download and verify a class pack bundle from the server
   */
  async downloadClassPack(chapterId: string): Promise<{
    success: boolean;
    classPack?: CachedClassPackItem;
    error?: string;
  }> {
    const response = await this.apiClient.get<ClassPackBundle>(
      `/api/mobile/class-pack/${chapterId}`
    );

    if (!response.ok || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to download class pack',
      };
    }

    const bundle = response.data;

    // Verify integrity checksum
    if (!bundle.metadata || !bundle.metadata.checksum) {
      return {
        success: false,
        error: 'Class pack integrity check failed: missing checksum',
      };
    }

    const bundleJson = JSON.stringify(bundle);
    const sizeBytes = bundle.metadata.estimatedSizeBytes || bundleJson.length;

    const cachedItem: CachedClassPackItem = {
      pack_id: bundle.packId,
      chapter_id: bundle.chapterId,
      title_en: bundle.titleEn,
      title_hi: bundle.titleHi,
      chapter_number: bundle.chapterNumber,
      bundle_json: bundleJson,
      size_bytes: sizeBytes,
      checksum: bundle.metadata.checksum,
      downloaded_at: new Date().toISOString(),
    };

    await this.db.saveClassPack(cachedItem);

    return {
      success: true,
      classPack: cachedItem,
    };
  }

  /**
   * Retrieve cached class pack
   */
  async getClassPack(chapterId: string): Promise<ClassPackBundle | null> {
    const record = await this.db.getClassPack(chapterId);
    if (!record) return null;
    try {
      return JSON.parse(record.bundle_json) as ClassPackBundle;
    } catch {
      return null;
    }
  }

  /**
   * Check if chapter is cached for offline use
   */
  async isChapterAvailableOffline(chapterId: string): Promise<boolean> {
    const record = await this.db.getClassPack(chapterId);
    return record !== null;
  }

  /**
   * List all cached class packs
   */
  async listCachedClassPacks(): Promise<CachedClassPackItem[]> {
    return this.db.listClassPacks();
  }

  /**
   * Delete class pack from local storage
   */
  async deleteClassPack(chapterId: string): Promise<void> {
    await this.db.deleteClassPack(chapterId);
  }
}
