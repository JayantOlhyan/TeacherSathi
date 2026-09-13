import { describe, it, expect } from 'vitest';
import { resourcesRepository } from '@/lib/repositories/resources';

describe('Immutable Resource Versioning & Snapshot Rollback (Section 12, 13)', () => {
  // In-memory mock store
  const resourcesStore: any[] = [];
  const versionsStore: any[] = [];

  const createMockClient = () => {
    return {
      from(table: string) {
        return {
          select(cols?: string, opts?: any) {
            return {
              eq(col: string, val: any) {
                return {
                  eq(col2: string, val2: any) {
                    return {
                      single: async () => {
                        const match = versionsStore.find(
                          (v) => v[col] === val && v[col2] === val2
                        );
                        return { data: match || null, error: match ? null : { message: 'Not found' } };
                      },
                    };
                  },
                  order(ordCol: string, ordOpts: any) {
                    const filtered = versionsStore.filter((v) => v[col] === val);
                    filtered.sort((a, b) => (ordOpts.ascending ? a[ordCol] - b[ordCol] : b[ordCol] - a[ordCol]));
                    return Promise.resolve({ data: filtered, error: null });
                  },
                  maybeSingle: async () => {
                    const match = resourcesStore.find((r) => r[col] === val);
                    return { data: match || null, error: null };
                  },
                  single: async () => {
                    const match = (table === 'resources' ? resourcesStore : versionsStore).find((r) => r[col] === val);
                    return { data: match || null, error: match ? null : { message: 'Not found' } };
                  },
                };
              },
            };
          },
          insert(rows: any[]) {
            return {
              select(cols?: string) {
                return {
                  single: async () => {
                    const newRow = {
                      id: `id_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      ...rows[0],
                    };
                    if (table === 'resources') {
                      resourcesStore.push(newRow);
                    } else if (table === 'resource_versions') {
                      versionsStore.push(newRow);
                    }
                    return { data: newRow, error: null };
                  },
                };
              },
            };
          },
          update(updates: any) {
            return {
              eq(col: string, val: any) {
                return {
                  select(cols?: string) {
                    return {
                      single: async () => {
                        const idx = resourcesStore.findIndex((r) => r[col] === val);
                        if (idx >= 0) {
                          resourcesStore[idx] = { ...resourcesStore[idx], ...updates };
                          return { data: resourcesStore[idx], error: null };
                        }
                        return { data: null, error: { message: 'Not found' } };
                      },
                    };
                  },
                };
              },
            };
          },
        } as any;
      },
    } as any;
  };

  it('creates initial version 1 snapshot on resource creation', async () => {
    const client = createMockClient();

    const resource = await resourcesRepository.createResource(
      'teacher-1',
      'school-1',
      {
        resource_type: 'PRESENTATION',
        title: 'Initial Presentation',
        content: { title: 'Initial Presentation', slides: [{ type: 'TITLE', title: 'Slide 1' }] },
      },
      client
    );

    expect(resource.id).toBeDefined();
    expect(versionsStore.length).toBe(1);
    expect(versionsStore[0].resource_id).toBe(resource.id);
    expect(versionsStore[0].version_number).toBe(1);
    expect(versionsStore[0].snapshot).toBeDefined();
  });

  it('bumps version number when content changes during update', async () => {
    const client = createMockClient();
    const resourceId = resourcesStore[0].id;

    const updated = await resourcesRepository.updateResource(
      resourceId,
      'teacher-1',
      {
        content: { title: 'Revised Presentation', slides: [{ type: 'TITLE', title: 'Slide 1' }, { type: 'CONTENT', title: 'Slide 2' }] },
        change_summary: 'Added content slide',
      },
      client
    );

    expect(updated.title).toBeDefined();
    expect(versionsStore.length).toBe(2);
    expect(versionsStore[1].version_number).toBe(2);
    expect(versionsStore[1].change_summary).toBe('Added content slide');
  });

  it('rolls back to an earlier version while recording a new version snapshot', async () => {
    const client = createMockClient();
    const resourceId = resourcesStore[0].id;

    // Rollback to version 1
    const restored = await resourcesRepository.restoreResourceVersion(
      resourceId,
      1,
      'teacher-1',
      client
    );

    expect(restored).toBeDefined();
    // After rollback, a version 3 snapshot should be created capturing the rollback
    expect(versionsStore.length).toBe(3);
    expect(versionsStore[2].version_number).toBe(3);
    expect(versionsStore[2].change_summary).toContain('Rollback to version 1');
  });
});
