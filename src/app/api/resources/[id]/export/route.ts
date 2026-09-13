import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourcesRepository } from '@/lib/repositories/resources';
import { exportService } from '@/lib/export/exportService';
import { PresentationContent, MindMapContent } from '@/lib/validations/resources';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resource = await resourcesRepository.getResourceById(id, supabase);
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    const isOwner = resource.owner_id === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';
    const isSchoolAdmin = userRole === 'SCHOOL_ADMIN' && resource.school_id === profile?.school_id;
    const isPublished = resource.status === 'PUBLISHED';

    if (!isOwner && !isSuperAdmin && !isSchoolAdmin && !isPublished) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const url = new URL(request.url);
    const format = (url.searchParams.get('format') || 'html').toLowerCase();

    // Track export / download usage
    await resourcesRepository.trackUsage(id, user.id, 'DOWNLOADED', { format }, supabase);

    if (format === 'svg' && resource.resource_type === 'MIND_MAP') {
      const result = exportService.exportMindMapToSvg(resource.content as unknown as MindMapContent);
      return new NextResponse(result.svg, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(resource.title)}.svg"`,
        },
      });
    }

    if ((format === 'pdf' || format === 'html') && resource.resource_type === 'PRESENTATION') {
      const result = exportService.exportPresentationToPdf(resource.content as unknown as PresentationContent);
      return new NextResponse(result.html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': format === 'pdf' ? `inline; filename="${encodeURIComponent(resource.title)}.html"` : 'inline',
        },
      });
    }

    if (format === 'printable') {
      const result = exportService.exportResourceToPrintable(resource);
      return new NextResponse(result.html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Default: JSON export
    return NextResponse.json({
      id: resource.id,
      title: resource.title,
      resource_type: resource.resource_type,
      language: resource.language,
      content: resource.content,
      metadata: resource.metadata,
      exported_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
