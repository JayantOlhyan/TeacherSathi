import { describe, it, expect } from 'vitest';
import { resourcesRepository } from '@/lib/repositories/resources';
import { contentValidator } from '@/lib/services/contentValidator';

describe('Multi-Tenant Content Isolation & Publishing Gates (Section 13, 16)', () => {
  const resourcesStore: any[] = [];

  const createMockSupabase = (callerRole: string, callerId: string, callerSchoolId: string | null) => {
    return {
      from(table: string) {
        return {
          select(cols?: string, opts?: any) {
            let filtered = [...resourcesStore];

            // RLS Simulation
            if (callerRole === 'STUDENT') {
              filtered = filtered.filter((r) => r.status === 'PUBLISHED');
            } else if (callerRole === 'TEACHER') {
              filtered = filtered.filter((r) => r.owner_id === callerId || (r.school_id === callerSchoolId && r.status === 'PUBLISHED'));
            }

            return {
              eq(col: string, val: any) {
                filtered = filtered.filter((r) => r[col] === val);
                return {
                  maybeSingle: async () => ({ data: filtered[0] || null, error: null }),
                  single: async () => ({ data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } }),
                  order: () => Promise.resolve({ data: filtered, error: null }),
                };
              },
              order: () => ({
                range: () => Promise.resolve({ data: filtered, count: filtered.length, error: null }),
              }),
            };
          },
          insert(rows: any[]) {
            return {
              select: () => ({
                single: async () => {
                  const row = { id: `res_${Date.now()}`, ...rows[0] };
                  resourcesStore.push(row);
                  return { data: row, error: null };
                },
              }),
            };
          },
          update(updates: any) {
            return {
              eq(col: string, val: any) {
                return {
                  select: () => ({
                    single: async () => {
                      const item = resourcesStore.find((r) => r[col] === val);
                      if (item) Object.assign(item, updates);
                      return { data: item, error: item ? null : { message: 'Not found' } };
                    },
                  }),
                };
              },
            };
          },
          delete() {
            return {
              eq(col: string, val: any) {
                const idx = resourcesStore.findIndex((r) => r[col] === val);
                if (idx >= 0) resourcesStore.splice(idx, 1);
                return Promise.resolve({ error: null });
              },
            };
          },
        } as any;
      },
    } as any;
  };

  it('prohibits publishing content that fails deterministic validation', async () => {
    const brokenContent = {
      title: 'Broken Slides',
      slides: [
        {
          type: 'QUESTION' as const,
          title: 'Faulty Question',
          question_text: '', // missing prompt
          question_options: ['Only One'], // missing options
        },
      ],
    };

    const validation = contentValidator.validateContent('PRESENTATION', brokenContent, 'en');
    expect(validation.status).toBe('FAILED');

    // Trying to publish a resource with failed validation must throw
    const client = createMockSupabase('TEACHER', 'teacher-1', 'school-1');
    resourcesStore.push({
      id: 'res-bad-1',
      owner_id: 'teacher-1',
      school_id: 'school-1',
      resource_type: 'PRESENTATION',
      title: 'Broken Slides',
      content: brokenContent,
      language: 'en',
      status: 'DRAFT',
    });

    await expect(
      resourcesRepository.publishResource('res-bad-1', 'teacher-1', client)
    ).rejects.toThrow('Cannot publish invalid content');
  });

  it('permits publishing when validation passes', async () => {
    const goodContent = {
      title: 'Solid Presentation',
      slides: [
        {
          type: 'TITLE' as const,
          title: 'Lesson 1',
          subtitle: 'Introduction',
        },
        {
          type: 'CONTENT' as const,
          title: 'Concepts',
          bullets: ['Point 1', 'Point 2'],
        },
      ],
    };

    const client = createMockSupabase('TEACHER', 'teacher-1', 'school-1');
    resourcesStore.push({
      id: 'res-good-1',
      owner_id: 'teacher-1',
      school_id: 'school-1',
      resource_type: 'PRESENTATION',
      title: 'Solid Presentation',
      content: goodContent,
      language: 'en',
      status: 'DRAFT',
    });

    const published = await resourcesRepository.publishResource('res-good-1', 'teacher-1', client);
    expect(published.status).toBe('PUBLISHED');
  });

  it('enforces student read isolation: students cannot access unpublished drafts', async () => {
    const studentClient = createMockSupabase('STUDENT', 'student-1', 'school-1');

    const result = await resourcesRepository.getResources({ publishedOnly: true }, studentClient);
    const unpub = result.resources.find((r) => r.status === 'DRAFT');
    expect(unpub).toBeUndefined();
  });
});
