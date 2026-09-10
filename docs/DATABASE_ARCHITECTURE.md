# TeacherSathi — Phase 1 Database Architecture

> **Status**: Production Foundation Complete (Phase 1)  
> **Engine**: PostgreSQL 15+ hosted on Supabase  
> **Security Core**: Row Level Security (RLS) Mandatory & Enabled across All Protected Tables  

---

## 1. High-Level Architectural Model

TeacherSathi transitions from prototype client-side `localStorage` persistence to an enterprise multi-tenant PostgreSQL data tier.

```
                   ┌──────────────────────────────────────────────┐
                   │             AUTHENTICATION LAYER             │
                   │               (Supabase Auth)                │
                   └──────────────────────┬───────────────────────┘
                                          │
                                          ▼
                   ┌──────────────────────────────────────────────┐
                   │             PROFILES & TENANCY               │
                   │    profiles ──< school_members >── schools   │
                   └──────────────┬───────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────────────┐
          │                       │                               │
          ▼                       ▼                               ▼
┌───────────────────┐   ┌───────────────────┐           ┌───────────────────┐
│ CANONICAL NCERT   │   │ INSTITUTIONAL     │           │ TEACHER RESOURCES │
│ CURRICULUM        │   │ CLASSES & ROSTER  │           │ & CLASSROOM KIOSK │
├───────────────────┤   ├───────────────────┤           ├───────────────────┤
│ grades            │   │ classes           │           │ resources         │
│ subjects          │   │ class_students    │           │ lesson_plans      │
│ books             │   └───────────────────┘           │ worksheets        │
│ chapters          │                                   │ presentations     │
│ concepts          │                                   │ mind_maps         │
│ questions         │                                   │ classroom_devices │
│ question_options  │                                   │ classroom_sessions│
│ question_versions │                                   │ remote_actions    │
└───────────────────┘                                   │ audit_logs        │
                                                        └───────────────────┘
```

---

## 2. Core Subsystems

### A. Tenancy & User Identity
- **`profiles`**: Tied 1:1 to Supabase `auth.users(id)`. Stores full name, role (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`), language preference, and active status.
- **`schools`**: Tenant organization entity defining board affiliation (`CBSE`, `KVS`, etc.), geographic location, and subscription tier.
- **`school_members`**: Many-to-many relationship enabling users to belong to schools with explicit membership roles and active statuses.

### B. Canonical NCERT Curriculum
- Built strictly according to the NCERT/CBSE national curriculum hierarchy:
  $$\text{Grade} \longrightarrow \text{Subject} \longrightarrow \text{Book} \longrightarrow \text{Chapter} \longrightarrow \text{Concept} \longrightarrow \text{Question}$$
- Preserves academic year versioning (`2026-27`) so historical syllabus data is never overwritten.
- Publicly readable for published content, write-protected to `SUPER_ADMIN`.

### C. Standardized Question Bank & Versioning
- Adheres to the Phase 0 Question Bank Standard:
  - Section A: 10 Questions $\times$ 2 Marks (Core conceptual recall)
  - Section B: 10 Questions $\times$ 3 Marks (Analytical & application)
  - Section C: 10 Questions $\times$ 4 Marks (Long answer & derivations)
- **`question_versions`**: Append-only snapshot ledger that captures the full state of a question before any edit, ensuring past exams and historical student attempts remain auditable.

### D. Institutional Rosters & Classes
- Classes are scoped strictly to a school and assigned teacher.
- Students enroll via `class_students` with roll numbers and enrollment states.

### E. Classroom Kiosk & Hardware Handshake
- **`classroom_devices`**: Represents 75" interactive flat panels (IFPs) installed in school rooms.
- **`classroom_sessions`**: State machine (`WAITING`, `PAIRING`, `ACTIVE`, `PAUSED`, `ENDED`) tracking QR handshakes with ephemeral cryptographic token hashes.
- **`remote_actions`**: Event log of real-time teacher controls (slide changes, quiz launches, period timers).

### F. Teacher Pedagogical Resources
- Generic `resources` parent table with normalized child tables (`lesson_plans`, `worksheets`, `presentations`, `mind_maps`).
- Strict lifecycle states: `DRAFT` $\rightarrow$ `VALIDATING` $\rightarrow$ `READY` $\rightarrow$ `USED` $\rightarrow$ `ARCHIVED`.

### G. Immutable Audit Logs
- Append-only security audit log recording actor, action, entity type, entity ID, metadata, IP address, and user agent.
- Read-only to `SUPER_ADMIN`; write and delete strictly forbidden by RLS.
