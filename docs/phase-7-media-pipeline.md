# Phase 7 — Media & Video Processing Pipeline

This document describes the fail-closed ingestion, processing, and delivery architecture for educational media assets.

---

## 1. Supported Media Types & Ceilings

| Asset Type | Supported MIME Types | Max Upload Size | Dedicated Bucket |
|:---|:---|:---|:---|
| **Image** | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | 10 MB | `educational-images` |
| **Video** | `video/mp4`, `video/webm`, `video/quicktime` | 100 MB | `educational-videos` |
| **Audio** | `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp4` | 25 MB | `educational-audio` |
| **Document** | `application/pdf` | 20 MB | `educational-documents` |

---

## 2. Ingestion & Security Lifecycle

```
[Teacher Client]
       |
       | 1. Request Pre-Signed Upload URL (or direct POST to /api/media/upload)
       v
[Next.js API Route / Storage Service]
       | 2. Multi-tenant Tenant Isolation Check (School/User Auth)
       | 3. Path Traversal & File Sanitization (UUID generation)
       | 4. Content-Type and Magic Byte Authentication (JPEG, PNG, PDF, WebM, MP4)
       | 5. Bucket Quota & File Size Check
       v
[Supabase Storage Bucket]
       |
       v
[PostgreSQL `media_assets` & `media_jobs`]
       | Record media metadata (dimensions, duration, byte size)
       | Queue background thumbnail or transcode job
       v
[Worker Processor]
       | Generates smartboard poster frame (1280x720)
       | Updates status from PENDING -> PROCESSING -> COMPLETED
```

---

## 3. Asynchronous Job Processing (`media_jobs`)

For high-resolution images, videos, and PDFs, processing occurs asynchronously:
- **`media_jobs` Table**:
  - `job_type`: `THUMBNAIL_GENERATION`, `VIDEO_TRANSCODE`, `AUDIO_NORMALIZE`, `PDF_SPLIT`.
  - `status`: `PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `COMPLETED` or `FAILED`.
  - `progress`: 0 to 100 percentage integer.
  - `error_message`: Stack trace or failure reason upon retry exhaustion.
- **Fail-Safe Fallbacks**: If a video transcode fails, the system provides standard HTML5 fallback playback for the original file while logging detailed error metrics for admin resolution.
