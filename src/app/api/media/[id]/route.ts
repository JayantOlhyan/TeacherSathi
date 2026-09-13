import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mediaRepository } from '@/lib/repositories/media';
import { storageService, StorageBucket } from '@/lib/media/storageService';
import { auditRepository } from '@/lib/repositories/audit';

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

    const asset = await mediaRepository.getMediaAssetById(id, supabase);
    if (!asset) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    const isOwner = asset.ownerId === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';
    const isSchoolAdmin = userRole === 'SCHOOL_ADMIN' && asset.schoolId === profile?.school_id;

    if (!isOwner && !isSuperAdmin && !isSchoolAdmin && userRole !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    let downloadUrl = asset.sourceUrl || null;
    if (asset.source === 'UPLOADED' && asset.filePath) {
      let bucket: StorageBucket = 'teacher-resources';
      if (asset.mimeType.startsWith('video/')) bucket = 'video-assets';
      else if (asset.mimeType.startsWith('image/')) bucket = 'presentation-assets';

      try {
        downloadUrl = await storageService.getSignedDownloadUrl(bucket, asset.filePath, 3600, supabase);
      } catch (err) {
        console.warn('Could not generate signed URL:', err);
      }
    }

    return NextResponse.json({
      data: {
        ...asset,
        downloadUrl,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const asset = await mediaRepository.getMediaAssetById(id, supabase);
    if (!asset) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    const isOwner = asset.ownerId === user.id;
    const isSuperAdmin = userRole === 'SUPERADMIN';

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden: You cannot delete media owned by someone else' }, { status: 403 });
    }

    await supabase.from('media_assets').delete().eq('id', id);

    await auditRepository.logAction(
      'DELETE_MEDIA',
      'MEDIA',
      id,
      { title: asset.title },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
