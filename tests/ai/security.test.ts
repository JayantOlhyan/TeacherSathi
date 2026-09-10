import { describe, it, expect, vi } from 'vitest';
import { POST as generatePOST } from '../../src/app/api/ai/generate/route';
import { NextRequest } from 'next/server';

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('AI Generation Security & Authorization Tests', () => {
  it('blocks unauthenticated requests with 401 Unauthorized', async () => {
    (createClient as any).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'Not logged in' } }),
      },
    });

    const req = new NextRequest('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ product_type: 'quiz' }),
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain('Unauthorized');
  });

  it('blocks STUDENT role with 403 Forbidden', async () => {
    (createClient as any).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'student-user-1', email: 'student@school.edu' } },
          error: null,
        }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'student-user-1',
                role: 'STUDENT',
                school_id: 'school-1',
              },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    });

    const req = new NextRequest('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        product_type: 'quiz',
        grade: 'Class 10',
        subject: 'Science',
      }),
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain('Forbidden');
  });

  it('verifies AI API keys are never exposed in generated results or payloads', async () => {
    (createClient as any).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'teacher-user-1', email: 'teacher@school.edu' } },
          error: null,
        }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'teacher-user-1',
                role: 'TEACHER',
                school_id: 'school-1',
              },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: { id: 'res-new-1' }, error: null }),
        };
      }),
    });

    const req = new NextRequest('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        product_type: 'quiz',
        grade: 'Class 10',
        subject: 'Science',
      }),
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    // Verify sensitive keys are NOT in the response
    const stringified = JSON.stringify(json);
    expect(stringified).not.toContain('GEMINI_API_KEY');
    expect(stringified).not.toContain('ANTHROPIC_API_KEY');
    expect(stringified).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
  });
});
