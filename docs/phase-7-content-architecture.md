# Phase 7 — Content & Media Architecture

TeacherSathi is an NCERT-focused AI Teaching Companion and Smart Classroom Co-Pilot. Phase 7 implements the production educational content, media, and presentation pipeline, bridging curriculum-aligned authoring to interactive smartboard delivery.

---

## 1. High-Level Pipeline Architecture

The Phase 7 pipeline establishes a deterministic, multi-tenant lifecycle from initial drafting to classroom execution:

```
+-----------------------------------------------------------------------------------+
| 1. Authoring & Generation Layer                                                   |
|    - Teacher Manual Authoring                                                     |
|    - AI Co-Pilot Generation (Draft Status Only)                                    |
|    - Canonical NCERT Chapter/Topic Association                                    |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 2. Deterministic Quality & Readability Gate                                       |
|    - Content Scoring (0-100 penalty system, threshold >= 75)                      |
|    - Smartboard Readability (Max 60 words, max 5 bullets for 75" display)        |
|    - Bilingual Script Verification (Devanagari Unicode ranges for Hindi)          |
|    - Graph Topology Validation (Orphan and self-loop detection for mind maps)     |
|    - Pedagogical Duration Check (Teacher-led timing consistency)                  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 3. Multi-Tenant Resource Repository & Version Control                             |
|    - Canonical `resources` table (extended schema)                                |
|    - Immutable `resource_versions` snapshot on publish/major update               |
|    - 1-Click Rollback with complete lineage                                       |
|    - Multi-tenant school/user isolation via Row-Level Security                    |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 4. Fail-Closed Media Asset Pipeline                                               |
|    - Pre-signed Uploads & Magic Byte MIME Verification                            |
|    - Traversal-Proof Storage Keys (`{schoolId}/{userId}/{type}/{uuid}.ext`)       |
|    - Asynchronous Transcoding & Thumbnail Jobs (`media_jobs`)                    |
|    - Time-Limited Signed Read URLs                                                |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 5. Multi-Channel Export & Classroom Delivery                                      |
|    - Print-Ready 16:9 PDF Slides & A4 Worksheets                                  |
|    - Scalable Vector Graphics (SVG) Mind Maps                                     |
|    - Live 75" Smartboard Interactive Viewer (`SmartboardSlideViewer`)             |
|    - Synchronized with Realtime Classroom Session Events                          |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Principles

1. **AI Output Is Strictly Draft**:
   AI-generated presentations, mind maps, or activities are always created with `status = 'DRAFT'`. Content cannot be presented in active classrooms or distributed to students without explicit teacher review and publication.

2. **Deterministic Validation Gate**:
   Publishing triggers an automated content audit. If critical validation errors exist (or the score is below 75), the publish operation fails closed with detailed remediation suggestions.

3. **Immutable Presentation Snapshots**:
   When a resource is published or updated, an immutable snapshot is recorded in `resource_versions`. Live classroom sessions lock to a specific version number, ensuring content does not morph mid-lesson.

4. **Multi-Tenant Security Guarantee**:
   All database operations enforce tenant isolation via Supabase RLS. Resources belong to specific users within schools; public resources are read-only across schools; private drafts cannot be viewed or edited outside tenant boundaries.

5. **Offline-First & Smartboard Resilience**:
   Smartboard presentation payloads are lightweight JSON documents renderable entirely client-side without continuous cloud roundtrips. In the event of temporary internet dropouts, the slide viewer maintains full interactivity.
