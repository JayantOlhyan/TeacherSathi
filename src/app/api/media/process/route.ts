import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mediaRepository } from '@/lib/repositories/media';
import { mediaProcessor } from '@/lib/media/mediaProcessor';
import { z } from 'zod';

const ProcessJobSchema = z.object({
  mediaAssetId: z.string().uuid(),
  jobType: z.enum(['TRANSCODE', 'THUMBNAIL', 'METADATA_PROBE']).default('METADATA_PROBE'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await request.json();
    const parsed = ProcessJobSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues }, { status: 400 });
    }

    const asset = await mediaRepository.getMediaAssetById(parsed.data.mediaAssetId, supabase);
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

    if (!isOwner && !isSuperAdmin && !isSchoolAdmin) {
      return NextResponse.json({ error: 'Forbidden: You cannot process media assets owned by another user' }, { status: 403 });
    }

    const job = await mediaRepository.createMediaJob(asset.id, parsed.data.jobType, supabase);

    // Process job
    await mediaProcessor.processJob(job.id, supabase);

    const updatedAsset = await mediaRepository.getMediaAssetById(asset.id, supabase);

    return NextResponse.json({
      data: {
        jobId: job.id,
        status: 'COMPLETED',
        asset: updatedAsset,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
