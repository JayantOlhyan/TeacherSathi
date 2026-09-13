import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClassPackService, ClassPackBundle } from '../../mobile/src/services/classPackService';
import { DatabaseManager } from '../../mobile/src/database/databaseManager';
import { ApiClient } from '../../mobile/src/services/apiClient';

describe('Phase 9: NCERT Offline Class Pack Management', () => {
  let db: DatabaseManager;
  let api: ApiClient;
  let classPackService: ClassPackService;

  const validBundle: ClassPackBundle = {
    packId: 'pack-sci-8-1',
    chapterId: 'ch-ncert-sci-8-1',
    titleEn: 'Crop Production and Management',
    titleHi: 'फसल उत्पादन एवं प्रबंध',
    chapterNumber: 1,
    bookId: 'book-ncert-sci-8',
    curriculum: {
      concepts: [{ id: 'c1', name_en: 'Agricultural Practices' }],
    },
    content: {
      presentation: { slides: [{ title: 'Introduction to Crops' }] },
      mindmap: { nodes: [{ label: 'Crops' }] },
      activities: [{ title: 'Seed Germination Observation' }],
      lessonPlans: [{ title: 'Day 1 Lesson Plan' }],
    },
    quiz: {
      questions: [
        {
          id: 'q1',
          type: 'SINGLE_CHOICE',
          question_en: 'Which is a Rabi crop?',
          options: [{ key: 'A', text: 'Wheat' }],
        },
      ],
    },
    metadata: {
      packagedAt: new Date().toISOString(),
      checksum: 'valid-sha256-hash-001',
      estimatedSizeBytes: 1024 * 120,
      version: 1,
    },
  };

  beforeEach(async () => {
    db = new DatabaseManager();
    await db.initialize();
    api = new ApiClient('https://mock.teachersathi.in');
    classPackService = new ClassPackService(api, db);
  });

  it('should compute SHA-256 checksum deterministically across platforms', async () => {
    const payload = 'NCERT-Class-8-Science-Chapter-1';
    const hash1 = await classPackService.computeChecksum(payload);
    const hash2 = await classPackService.computeChecksum(payload);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // hex string length for sha256
  });

  it('should download, verify, and persist class pack bundle in local storage', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      ok: true,
      status: 200,
      data: validBundle,
    });

    const result = await classPackService.downloadClassPack('ch-ncert-sci-8-1');
    expect(result.success).toBe(true);
    expect(result.classPack).toBeDefined();
    expect(result.classPack?.chapter_id).toBe('ch-ncert-sci-8-1');
    expect(result.classPack?.checksum).toBe('valid-sha256-hash-001');

    const isAvailable = await classPackService.isChapterAvailableOffline('ch-ncert-sci-8-1');
    expect(isAvailable).toBe(true);

    const retrievedBundle = await classPackService.getClassPack('ch-ncert-sci-8-1');
    expect(retrievedBundle).not.toBeNull();
    expect(retrievedBundle?.titleEn).toBe('Crop Production and Management');
    expect(retrievedBundle?.content.presentation).toBeDefined();
    expect(retrievedBundle?.quiz.questions?.length).toBe(1);
  });

  it('should reject class pack if checksum metadata is missing', async () => {
    const invalidBundle = {
      ...validBundle,
      metadata: { ...validBundle.metadata, checksum: '' },
    };

    vi.spyOn(api, 'get').mockResolvedValue({
      ok: true,
      status: 200,
      data: invalidBundle,
    });

    const result = await classPackService.downloadClassPack('ch-ncert-sci-8-1');
    expect(result.success).toBe(false);
    expect(result.error).toContain('integrity check failed');
  });

  it('should delete cached class pack and update offline availability', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      ok: true,
      status: 200,
      data: validBundle,
    });

    await classPackService.downloadClassPack('ch-ncert-sci-8-1');
    expect(await classPackService.isChapterAvailableOffline('ch-ncert-sci-8-1')).toBe(true);

    await classPackService.deleteClassPack('ch-ncert-sci-8-1');
    expect(await classPackService.isChapterAvailableOffline('ch-ncert-sci-8-1')).toBe(false);
    expect(await classPackService.getClassPack('ch-ncert-sci-8-1')).toBeNull();
  });
});
