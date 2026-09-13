export interface MediaMetadata {
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
  sizeBytes: number;
  mimeType: string;
}

export interface MediaProcessingJob {
  id: string;
  assetId: string;
  jobType: 'THUMBNAIL' | 'TRANSCODE' | 'METADATA_PROBE';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  retryCount: number;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface MediaAssetRecord {
  id: string;
  schoolId: string | null;
  ownerId: string;
  title: string;
  description: string | null;
  duration: number | null;
  thumbnailUrl: string | null;
  source: 'UPLOAD' | 'EXTERNAL' | 'PLATFORM';
  sourceUrl: string | null;
  filePath: string | null;
  mimeType: string;
  sizeBytes: number;
  language: string;
  curriculumMapping: Record<string, unknown>;
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}
