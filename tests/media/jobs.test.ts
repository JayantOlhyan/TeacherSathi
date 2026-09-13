import { describe, it, expect } from 'vitest';
import { mediaProcessor } from '@/lib/media/mediaProcessor';

describe('Media Processing Queue & Job State Machine (Section 11)', () => {
  it('probes media assets and derives format and dimensions', async () => {
    const videoProbe = await mediaProcessor.probe('videos/soil_prep.mp4', 'video/mp4', 45 * 1024 * 1024);
    expect(videoProbe.format).toBe('mp4');
    expect(videoProbe.duration).toBe(180);
    expect(videoProbe.width).toBe(1920);
    expect(videoProbe.height).toBe(1080);

    const imageProbe = await mediaProcessor.probe('images/cell.png', 'image/png', 500 * 1024);
    expect(imageProbe.format).toBe('png');
    expect(imageProbe.duration).toBeUndefined();
    expect(imageProbe.width).toBe(1920);
  });

  it('generates high-contrast thumbnail paths for smartboard display', async () => {
    const imgThumb = await mediaProcessor.generateThumbnail('images/plant.jpg', 'image/jpeg');
    expect(imgThumb).toBe('images/plant.jpg');

    const vidThumb = await mediaProcessor.generateThumbnail('videos/irrigation.mp4', 'video/mp4');
    expect(vidThumb).toContain('thumbnails/');
    expect(vidThumb.endsWith('.webp')).toBe(true);
  });

  it('transitions job from QUEUED to COMPLETED and updates asset record', async () => {
    const mockJobs: any[] = [
      {
        id: 'job-1',
        asset_id: 'asset-1',
        job_type: 'METADATA_PROBE',
        status: 'QUEUED',
        retry_count: 0,
        asset: {
          id: 'asset-1',
          file_path: 'videos/crops.mp4',
          mime_type: 'video/mp4',
          size_bytes: 10 * 1024 * 1024,
          status: 'UPLOADING',
        },
      },
    ];
    const mockAssets: any[] = [mockJobs[0].asset];

    const mockClient = {
      from(table: string) {
        return {
          select(cols?: string) {
            return {
              eq(col: string, val: any) {
                return {
                  single: async () => {
                    const match = (table === 'media_jobs' ? mockJobs : mockAssets).find((r) => r[col] === val);
                    return { data: match || null, error: match ? null : { message: 'Not found' } };
                  },
                };
              },
            };
          },
          update(updates: any) {
            return {
              eq(col: string, val: any) {
                const target = (table === 'media_jobs' ? mockJobs : mockAssets).find((r) => r[col] === val);
                if (target) Object.assign(target, updates);
                return Promise.resolve({ error: null });
              },
            };
          },
        } as any;
      },
    } as any;

    await mediaProcessor.processJob('job-1', mockClient);

    expect(mockJobs[0].status).toBe('COMPLETED');
    expect(mockAssets[0].status).toBe('READY');
    expect(mockAssets[0].thumbnail_url).toBeDefined();
  });
});
