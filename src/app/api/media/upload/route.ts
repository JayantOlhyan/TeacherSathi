import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mediaRepository } from '@/lib/repositories/media';
import { storageService, StorageBucket } from '@/lib/media/storageService';
import { mediaProcessor } from '@/lib/media/mediaProcessor';
import { auditRepository } from '@/lib/repositories/audit';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'TEACHER').toUpperCase();
    if (userRole === 'STUDENT') {
      return NextResponse.json({ error: 'Students cannot upload media assets' }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') || '';

    // Flow 1: Direct Multipart Form Data Upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const title = (formData.get('title') as string) || file?.name || 'Uploaded Asset';
      const description = (formData.get('description') as string) || null;
      const language = (formData.get('language') as string) || 'en';
      const gradeId = (formData.get('grade_id') as string) || undefined;
      const subjectId = (formData.get('subject_id') as string) || undefined;
      const chapterId = (formData.get('chapter_id') as string) || undefined;

      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }

      const mimeType = file.type;
      const sizeBytes = file.size;

      // Select storage bucket based on mime type
      let bucket: StorageBucket = 'teacher-resources';
      if (mimeType.startsWith('video/')) {
        bucket = 'video-assets';
      } else if (mimeType.startsWith('image/')) {
        bucket = 'presentation-assets';
      }

      // Security validations: MIME, size limits, and path traversal
      storageService.validateFile(mimeType, sizeBytes, bucket);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Verify file magic bytes against extension/mime
      const isValidMagic = mediaProcessor.validateMagicBytes(uint8Array, mimeType);
      if (!isValidMagic) {
        return NextResponse.json(
          { error: 'File magic bytes do not match the declared MIME type. Potential spoofing detected.' },
          { status: 422 }
        );
      }

      const cleanFileName = storageService.sanitizePath(file.name);
      const storagePath = `${user.id}/${Date.now()}_${cleanFileName}`;

      await storageService.uploadBuffer(bucket, storagePath, uint8Array, mimeType, supabase);

      // Create database record
      const asset = await mediaRepository.createMediaAsset(
        user.id,
        profile?.school_id || null,
        {
          title,
          description: description || undefined,
          mime_type: mimeType,
          size_bytes: sizeBytes,
          source: 'UPLOADED',
          filePath: storagePath,
          language,
          curriculum_mapping: {
            grade_id: gradeId,
            subject_id: subjectId,
            chapter_id: chapterId,
          },
        },
        supabase
      );

      // Auto-enqueue background metadata/thumbnail job
      const job = await mediaRepository.createMediaJob(asset.id, 'METADATA_PROBE', supabase);
      try {
        await mediaProcessor.processJob(job.id, supabase);
      } catch (jobErr) {
        console.warn('Initial background job deferred or queued:', jobErr);
      }

      const signedUrl = await storageService.getSignedDownloadUrl(bucket, storagePath, 3600, supabase);

      await auditRepository.logAction(
        'UPLOAD_MEDIA',
        'MEDIA',
        asset.id,
        { title: asset.title, mimeType, sizeBytes },
        user.id,
        request.headers.get('x-forwarded-for') || null,
        request.headers.get('user-agent') || null,
        supabase
      );

      return NextResponse.json({ data: asset, downloadUrl: signedUrl }, { status: 201 });
    }

    // Flow 2: Pre-signed Upload URL Request for large files
    const jsonBody = await request.json();
    const { title, mime_type, size_bytes, filename, grade_id, subject_id, chapter_id } = jsonBody;

    if (!title || !mime_type || !size_bytes || !filename) {
      return NextResponse.json(
        { error: 'Missing required parameters: title, mime_type, size_bytes, and filename are required.' },
        { status: 400 }
      );
    }

    let bucket: StorageBucket = 'teacher-resources';
    if (mime_type.startsWith('video/')) {
      bucket = 'video-assets';
    } else if (mime_type.startsWith('image/')) {
      bucket = 'presentation-assets';
    }

    storageService.validateFile(mime_type, Number(size_bytes), bucket);

    const cleanFileName = storageService.sanitizePath(filename);
    const storagePath = `${user.id}/${Date.now()}_${cleanFileName}`;

    const signedUpload = await storageService.createSignedUploadUrl(bucket, storagePath, supabase);

    const asset = await mediaRepository.createMediaAsset(
      user.id,
      profile?.school_id || null,
      {
        title,
        mime_type,
        size_bytes: Number(size_bytes),
        source: 'UPLOADED',
        filePath: storagePath,
        curriculum_mapping: {
          grade_id,
          subject_id,
          chapter_id,
        },
      },
      supabase
    );

    return NextResponse.json({
      data: asset,
      uploadUrl: signedUpload.signedUrl,
      path: signedUpload.path,
      token: signedUpload.token,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
