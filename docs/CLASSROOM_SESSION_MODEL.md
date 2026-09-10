# TeacherSathi — Classroom Session Model (Phase 3)

## 1. Database Schema

The `classroom_sessions` table represents one live teaching period in an Indian government school or CBSE-affiliated classroom.

### Schema Definition
```sql
CREATE TABLE classroom_sessions (
  id TEXT PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'NCERT Classroom Session',
  grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  active_resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  status session_status NOT NULL DEFAULT 'WAITING',
  pairing_code_hash TEXT,
  pairing_expires_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 2. Session Lifecycle State Machine

Valid transitions enforced server-side:

```text
       ┌──────────┐
       │ WAITING  │
       └────┬─────┘
            │
            ├───────────────┐
            ▼               │
       ┌──────────┐         │
       │ PAIRING  │         │
       └────┬─────┘         │
            │               │
            ├─────────┐     │
            ▼         │     │
       ┌──────────┐   │     │
  ┌───►│  ACTIVE  │   │     │
  │    └────┬─────┘   │     │
  │         │         │     │
  │         ├─────────┼─────┤
  │         ▼         │     │
  │    ┌──────────┐   │     │
  └───-│  PAUSED  │   │     │
       └────┬─────┘   │     │
            │         │     │
            ▼         ▼     ▼
       ┌────────────────────┐
       │       ENDED        │ (Terminal)
       └────────────────────┘
```

### State Semantics

- **WAITING**: Session record created in database; hardware smartboard not yet paired.
- **PAIRING**: Teacher generates a temporary 5-minute single-use pairing QR token.
- **ACTIVE**: At least one authorized smartboard display is connected; live instruction underway.
- **PAUSED**: Teacher temporarily halts classroom interactivity (e.g. for explanation or recess).
- **ENDED**: Terminal state. Pairing tokens invalidated; active devices disconnected; all subsequent commands strictly rejected. Cannot transition back to ACTIVE.

## 3. Session Expiry & Abandonment Protection

- Sessions track `last_activity_at`.
- Conservative 4-hour hard cutoff prevents abandoned sessions from remaining open overnight without prematurely cutting off a teacher explaining a difficult topic.
