import { describe, it, expect } from 'vitest';
import { 
  CreateResourceInputSchema, 
  UpdateResourceInputSchema, 
  ResourceQuerySchema 
} from '@/lib/validations/resources';

describe('Resource Query & Input Schemas (Section 1, 10)', () => {
  it('parses valid resource creation input', () => {
    const valid = {
      title: 'Class 8 Light & Reflection',
      resource_type: 'PRESENTATION',
      language: 'en',
      content: { slides: [{ type: 'TITLE', title: 'Light' }] },
    };

    const parsed = CreateResourceInputSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects creation without title or resource_type', () => {
    const invalid = {
      language: 'en',
    };

    const parsed = CreateResourceInputSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('coerces and validates query parameters', () => {
    const rawQuery = {
      page: '2',
      limit: '15',
      resource_type: 'MIND_MAP',
      status: 'PUBLISHED',
      search: 'Crop',
      sort_order: 'asc',
    };

    const parsed = ResourceQuerySchema.safeParse(rawQuery);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(2);
      expect(parsed.data.limit).toBe(15);
      expect(parsed.data.resource_type).toBe('MIND_MAP');
      expect(parsed.data.status).toBe('PUBLISHED');
      expect(parsed.data.search).toBe('Crop');
    }
  });

  it('clamps pagination limit to max 100', () => {
    const overflowQuery = {
      page: '1',
      limit: '500',
    };

    const parsed = ResourceQuerySchema.safeParse(overflowQuery);
    expect(parsed.success).toBe(false); // exceeds max 100
  });
});
