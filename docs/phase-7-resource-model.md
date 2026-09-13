# Phase 7 — Resource Data Model & Versioning Specification

This document details the PostgreSQL schema, relational architecture, and JSON content models for educational resources in TeacherSathi.

---

## 1. Relational Database Schema

### 1.1 Canonical `resources` Extension

The canonical `resources` table is extended to support comprehensive educational asset authoring and version control:

```sql
CREATE TYPE resource_type AS ENUM (
    'PRESENTATION', 
    'MIND_MAP', 
    'ACTIVITY', 
    'WORKSHEET', 
    'LESSON_PLAN', 
    'DIAGRAM', 
    'AUDIO_EXPLANATION', 
    'VIDEO_SNIPPET'
);

CREATE TYPE resource_status AS ENUM (
    'DRAFT', 
    'REVIEW', 
    'PUBLISHED', 
    'ARCHIVED'
);

-- Core columns added to resources:
ALTER TABLE resources
    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS type resource_type NOT NULL DEFAULT 'PRESENTATION',
    ADD COLUMN IF NOT EXISTS status resource_status NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS language VARCHAR(10) NOT NULL DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS validation_score INTEGER DEFAULT 100,
    ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb;
```

### 1.2 Immutable `resource_versions` Table

Every publish or major update captures a historical snapshot to guarantee classroom auditability:

```sql
CREATE TABLE resource_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    changelog TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_resource_version UNIQUE(resource_id, version_number)
);
```

### 1.3 Audit & Telemetry `resource_usage` Table

Tracks classroom presentation launches, student impressions, and downloads:

```sql
CREATE TABLE resource_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'VIEW', 'PRESENT', 'EXPORT_PDF', 'EXPORT_SVG'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 2. Structured JSON Content Models

### 2.1 Presentation Model (`PRESENTATION`)
```typescript
interface PresentationContent {
  slides: PresentationSlide[];
  theme?: "LIGHT" | "DARK" | "NCERT_CLASSIC";
  aspectRatio?: "16:9" | "4:3";
}

interface PresentationSlide {
  id: string;
  type: "TITLE" | "CONTENT" | "IMAGE" | "DIAGRAM" | "QUESTION" | "ACTIVITY" | "SUMMARY";
  title: string;
  body?: string;
  bullets?: string[];
  notes?: string;               // Teacher private speaker notes
  mediaAssetId?: string;        // UUID of media asset
  questionConfig?: {
    questionText: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  };
  activityConfig?: {
    instructions: string;
    durationMinutes: number;
    groupSize?: string;
  };
  durationSeconds?: number;
}
```

### 2.2 Mind Map Model (`MIND_MAP`)
```typescript
interface MindMapContent {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  centralIdea: string;
  layout?: "RADIAL" | "TREE" | "FORCE";
}

interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  x?: number;
  y?: number;
  color?: string;
  isCentral?: boolean;
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
```

### 2.3 Teaching Activity Model (`ACTIVITY`)
```typescript
type ActivityArchetype =
  | "THINK_PAIR_SHARE"
  | "JIGSAW"
  | "FISHBOWL"
  | "SOCRATIC_SEMINAR"
  | "ROLE_PLAY"
  | "GALLERY_WALK"
  | "FOUR_CORNERS"
  | "CONCEPT_ATTAINMENT"
  | "PEER_INSTRUCTION"
  | "STATION_ROTATION";

interface TeachingActivityContent {
  archetype: ActivityArchetype;
  learningOutcomes: string[];
  materialsRequired?: string[];
  totalDurationMinutes: number;
  phases: Array<{
    name: string;
    durationMinutes: number;
    teacherInstructions: string;
    studentActions: string;
  }>;
  assessmentRubric?: Array<{
    criterion: string;
    exceeds: string;
    meets: string;
    needsImprovement: string;
  }>;
}
```
