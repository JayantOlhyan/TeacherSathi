# TeacherSathi — Phase 7 Repository Audit & Content Pipeline Baseline

> **Audit Date**: 2026-09-13  
> **Auditor**: Principal Systems Architect  
> **Scope**: Content creation, resource management, media processing, video delivery, and smartboard presentation infrastructure.

---

## 1. Executive Summary

TeacherSathi has completed Phases 0 through 6:
* **Phase 0**: Architecture freeze, curriculum model, user personas.
* **Phase 1**: Normalized Supabase PostgreSQL schema, RLS, repositories.
* **Phase 2**: Multi-provider AI generation pipeline (Gemini / Anthropic), schema validation, educational rules.
* **Phase 3**: Realtime classroom sessions, cryptographic QR pairing, smartboard WebSocket commands.
* **Phase 4**: Production assessments, assignments, student attempts, server-authoritative timer, auto-grading.
* **Phase 5**: SaaS subscriptions, Razorpay checkout, entitlements, quotas, grace windows.
* **Phase 6**: Deterministic 65/35 concept mastery, learning gaps, closed-loop reassessment engine.

Phase 7 now establishes the **Advanced Content, Media & Video Production Pipeline**, closing the authoring and presentation loop:
$$\text{Curriculum} \longrightarrow \text{AI / Teacher Input} \longrightarrow \text{Generation} \longrightarrow \text{Editor} \longrightarrow \text{Validation} \longrightarrow \text{Media Processing} \longrightarrow \text{Storage} \longrightarrow \text{Library} \longrightarrow \text{Smartboard Delivery}$$

---

## 2. Existing Content & Resource Architecture

### 2.1 Database Entities (Phase 1 Baseline)
In `supabase/migrations/20260911000001_initial_schema.sql`:
* `resources`: Generic parent ledger with `owner_id`, `school_id`, `chapter_id`, `resource_type`, `title`, `description`, `status`, `metadata`, `is_archived`.
* `lesson_plans`: Child table with `duration_mins`, `content_json`.
* `worksheets`: Child table with `questions_json`, `answer_key_json`, `pdf_url`.
* `presentations`: Child table with `slide_count`, `slides_json`.
* `mind_maps`: Child table with `nodes_json`.

### 2.2 Enums in Database
* `resource_type`: `'LESSON_PLAN'`, `'WORKSHEET'`, `'PRESENTATION'`, `'MIND_MAP'`, `'DOCUMENT'`.
  * *Audit Finding*: Missing required Phase 7 types: `TEACHING_ACTIVITY`, `QUIZ`, `TEST`, `ASSIGNMENT`, `VIDEO`, `IMAGE`, `AUDIO`, `LINK`.
* `resource_status`: `'DRAFT'`, `'VALIDATING'`, `'READY'`, `'USED'`, `'ARCHIVED'`.
  * *Audit Finding*: Missing required Phase 7 state: `'PUBLISHED'`.

### 2.3 Repository Layer
* `src/lib/repositories/resources.ts`:
  - Implements basic CRUD: `getResourcesByOwner`, `getResourceById`, `createResource`, `updateResourceStatus`, `archiveResource`.
  - *Audit Finding*: Lacks curriculum scoping (`grade_id`, `subject_id`, `book_id`, `concept_ids`), multi-school filtering, pagination, search, versioning, usage tracking, and validation persistence.

---

## 3. Existing AI Generation Pipeline (Phase 2 Baseline)

* `src/lib/ai/schemas/index.ts`:
  - Contains `PresentationSchema`, `PresentationSlideSchema`, `MindMapSchema`, `MindMapNodeSchema`, `MindMapEdgeSchema`, `TeachingActivitySchema`.
  - *Audit Finding*: `PresentationSlideSchema` is flat (bullet points only); lacks polymorphic slide types (`TITLE`, `CONTENT`, `IMAGE`, `DIAGRAM`, `QUESTION`, `ACTIVITY`, `SUMMARY`), speaker notes, and theme/layout tokens required for interactive classroom presentation.
* `src/lib/ai/pipeline/generator.ts` & `orchestrator.ts`:
  - Full structured generation with context injection from canonical NCERT database.
  - Reusable for generating rich presentations, mind maps, and teaching activities without touching the provider layer.

---

## 4. Existing Classroom Delivery Architecture (Phase 3 Baseline)

* `src/lib/classroom/types.ts`:
  - `ClassroomEventType` already supports: `START_PRESENTATION`, `NEXT_SLIDE`, `PREVIOUS_SLIDE`, `GOTO_SLIDE`, `START_QUIZ`, `END_QUIZ`, `PUSH_RESOURCE`, `START_TIMER`, `LOCK_BOARD`, `WHITEBOARD_UPDATE`.
  - `PresentationState`: tracks `presentationId`, `title`, `slideIndex`, `totalSlides`, `isActive`.
* `src/app/[locale]/classroom/page.tsx`:
  - 75" Smartboard kiosk interface connects to Supabase Realtime channel.
  - *Audit Finding*: When `presentation.isActive` is true, the smartboard renders a mock text box: `"Slide X content actively synchronized with teacher device"`. It currently lacks the rich slide renderer for actual presentation slide models.
* `src/components/classroom/ClassroomControlPanel.tsx`:
  - Teacher remote control dispatches slide navigation events.
  - *Audit Finding*: Dispatches dummy `presentationId: "pres-crop-production"`. Must be wired to real presentation resource IDs and slide count.

---

## 5. Existing Storage & Media Infrastructure

* **Supabase Storage**:
  - *Audit Finding*: Zero buckets configured. No storage migrations or policies exist.
  - *Requirement*: Provision `teacher-resources`, `presentation-assets`, `video-assets`, `thumbnails` with strict RLS and authenticated signed URL access.
* **Video Components**:
  - `src/app/[locale]/content/.../video/page.tsx`: Simple embedded YouTube iframe with static video IDs from `ncertSyllabus.ts`.
  - *Audit Finding*: No teacher video upload pipeline, no video metadata management, no media processing queue.

---

## 6. Gap Analysis & Missing Infrastructure for Phase 7

| Area | Current State | Phase 7 Requirement | Gap Severity |
| :--- | :--- | :--- | :---: |
| **Resource Types** | 5 types in enum | 12 standardized types | `HIGH` |
| **Resource Lifecycle** | 5 states | 6 states (add `PUBLISHED`) + validation results | `HIGH` |
| **Versioning** | None | `resource_versions` table + rollback | `HIGH` |
| **Content Snapshots** | None | Immutable snapshots on classroom start | `HIGH` |
| **Presentation Model** | Flat bullets schema | Structured polymorphic slide types (`TITLE`, `CONTENT`, `IMAGE`, `DIAGRAM`, `QUESTION`, `ACTIVITY`, `SUMMARY`) + notes | `CRITICAL` |
| **Presentation Editor** | None | Full teacher editor (reorder, edit, preview, notes, autosave) | `CRITICAL` |
| **Smartboard Renderer** | Placeholder text | Full 75" high-contrast slide renderer for all slide types | `CRITICAL` |
| **Mind Map Engine** | Static SVG preview | Interactive editor (pan, zoom, add/link nodes) + graph validator | `HIGH` |
| **Activity Engine** | AI schema only | 10 activity types, step-by-step procedures, builder UI | `HIGH` |
| **Media Processing** | None | Upload API, MIME/size validation, `MediaProcessor` abstraction, job queue | `CRITICAL` |
| **Storage Buckets & RLS**| None | 4 private buckets + path validation + signed URLs | `CRITICAL` |
| **Resource Library** | Generic landing cards | Full management portal (search, filter, sort, publish, archive) | `HIGH` |
| **Export Engine** | None | `ExportService` abstraction (PDF / Print view) | `MEDIUM` |
| **Usage Tracking** | None | `resource_usage` table | `MEDIUM` |

---

## 7. Reusable Assets & Anti-Patterns to Avoid

### Reusable Assets
1. **Canonical NCERT Curriculum**: `curriculum_grades`, `curriculum_subjects`, `curriculum_books`, `curriculum_chapters`, `curriculum_concepts`. Provenance must be maintained.
2. **Phase 2 AI Pipeline**: `orchestrator.ts`, `promptBuilder.ts`, `rateLimiter.ts`, retry self-repair loop.
3. **Phase 3 Classroom Realtime**: `useClassroomRealtime.ts`, `classroom_events`, `ClassroomControlPanel.tsx`.
4. **Phase 5 Entitlement Helper**: `checkFeatureAccess` for media quotas and export entitlements.

### Anti-Patterns Strictly Forbidden
1. **No Duplicate Resource System**: Do not create a separate `teacher_materials` or parallel table. Extend and standardize the canonical `resources` hierarchy.
2. **No Unvalidated AI Publication**: AI generation must output `DRAFT` resources. Direct publishing is prohibited.
3. **No Unsanitized File Uploads**: Client-provided MIME types and filenames must never be trusted without server-side validation.
4. **No In-Place Mutation of Live Presentations**: When a presentation is active on a smartboard, it must read from an immutable snapshot.
5. **No Fake Export Success**: Exporters must be functional or cleanly document their limitations.
