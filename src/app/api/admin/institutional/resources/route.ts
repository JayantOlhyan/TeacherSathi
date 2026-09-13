import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { reportingService } from '@/lib/services/reportingService';
import { InstitutionalScope, InstitutionalScopeSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const scopeType = (searchParams.get('scope_type') || 'STATE') as InstitutionalScope;
    let scopeId = searchParams.get('scope_id');

    if (!scopeId) {
      if (auth.context.isSuperAdmin) {
        const supabase = createClient();
        const { data: firstState } = await supabase.from('states').select('id').eq('is_active', true).limit(1).maybeSingle();
        scopeId = firstState?.id || '00000000-0000-0000-0000-000000000000';
      } else {
        scopeId = auth.context.scopes.states[0]?.id || auth.context.scopes.districts[0]?.id || auth.context.scopes.organizations[0]?.id || auth.context.scopes.schoolId || '';
      }
    }

    InstitutionalScopeSchema.parse(scopeType);

    if (!scopeId) {
      return NextResponse.json({ error: 'Missing scope_id parameter' }, { status: 400 });
    }

    if (!auth.context.canViewScope(scopeType, scopeId)) {
      return NextResponse.json({ error: 'Forbidden: Scope access restricted' }, { status: 403 });
    }

    const supabase = createClient();
    const schoolIds = await reportingService.getSchoolIdsForScope(scopeType, scopeId, supabase);

    if (schoolIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalResourcesCreated: 0,
          totalResourceUsageEvents: 0,
          byType: {},
          popularChapters: [],
        },
      });
    }

    const [resourcesRes, usageRes] = await Promise.all([
      supabase.from('resources').select('type, chapter_id, chapter:chapters(title_en)').in('school_id', schoolIds),
      supabase.from('resource_usage').select('action').in('school_id', schoolIds),
    ]);

    const resources = resourcesRes.data || [];
    const usages = usageRes.data || [];

    const byType: Record<string, number> = {};
    const chapterUsage: Record<string, { title: string; count: number }> = {};

    for (const r of resources) {
      const t = r.type || 'OTHER';
      byType[t] = (byType[t] || 0) + 1;

      if (r.chapter_id) {
        const cTitle = (r.chapter as { title_en?: string })?.title_en || 'Chapter';
        if (!chapterUsage[r.chapter_id]) {
          chapterUsage[r.chapter_id] = { title: cTitle, count: 0 };
        }
        chapterUsage[r.chapter_id].count++;
      }
    }

    const popularChapters = Object.values(chapterUsage)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        totalResourcesCreated: resources.length,
        totalResourceUsageEvents: usages.length,
        byType,
        popularChapters,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch resource metrics';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
