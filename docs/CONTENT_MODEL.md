# TeacherSathi — Content Model & Data Ownership Contract

> **Status**: Frozen Contract (Phase 0)  
> **Rule**: Rigorous separation between platform canonical curriculum and tenant user data.

---

## 1. Canonical Curriculum Hierarchy

All educational content within TeacherSathi adheres strictly to this six-tier canonical hierarchy:

```
Grade (e.g. Class 10)
  ↓
Subject (e.g. Science)
  ↓
Book (e.g. NCERT Science Class 10 — 2026-27 Edition)
  ↓
Chapter (e.g. Chapter 10: Light — Reflection and Refraction)
  ↓
Concept (e.g. Spherical Mirrors & Ray Diagrams)
  ↓
Resource (e.g. Lesson Plan, PPT Slide Deck, Worksheet PDF, Video Lecture)
```

---

## 2. Current Implementation vs. Future Production

| Dimension | Current Implementation (Phase 0) | Future Production Requirement (Phase 1) |
| :--- | :--- | :--- |
| **Storage Engine** | Static TypeScript arrays (`src/lib/data/ncertSyllabus.ts`, `chapters.ts`) + browser `localStorage` in `adminStore.ts`. | Normalized PostgreSQL database hosted on Supabase (`grades`, `subjects`, `books`, `chapters`, `concepts`). |
| **NCERT Edition Tracking** | Implicit / Hardcoded in static arrays; not versioned. | Explicit `edition` and `academic_year` columns on `books` (e.g. `2026-27`). |
| **Content Versioning** | Mock array in `adminStore.ts` (`content_versions`). | Immutable version history snapshots table (`content_versions`) tracking `changed_by`, `changed_at`, and delta. |
| **Admin Modifiability** | Simulated via UI writing to browser `localStorage`. Changes are lost if user clears cache. | Full database CRUD via server actions and API routes with `SUPER_ADMIN` authorization. |
| **Teacher Modifiability** | Teachers cannot alter core chapters; they can only generate custom lesson plans saved to local state. | Teachers have read-only access to canonical syllabus; can fork/create private custom lesson resources. |

---

## 3. Data Ownership Contract

Clear ownership rules govern data privacy, tenant isolation, and intellectual property:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PLATFORM OWNED (Global)                                  │
│    - Canonical NCERT Grades, Subjects, Books, Chapters      │
│    - Canonical Concept Maps & Pre-indexed Questions         │
│    - System Templates, Prompts & Global Announcements       │
└─────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ 2. SCHOOL OWNED (Institutional Tenant)                      │
│    - School Profile, Department Timetables, Room Bindings   │
│    - Registered Smartboard Devices (Board-001, Board-002)   │
│    - Institutional Performance Analytics & Billing Invoices │
└─────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ 3. TEACHER OWNED (User Tenant)                              │
│    - Generated Lesson Plans, Worksheets, Custom Tests       │
│    - Private Lecture Annotations & Whiteboard Files         │
│    - Class Rosters, Attendance Marks & Gradebooks           │
└─────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ 4. STUDENT + CLASS OWNED (Co-owned Submissions)             │
│    - Student Quiz Attempts, Test Submissions & Responses    │
│    - Student Accuracy History & Diagnostic Weakness Flags   │
└─────────────────────────────────────────────────────────────┘
```

### Data Isolation Rules:
1. **Canonical Immutability**: No individual school or teacher can modify canonical NCERT chapter text or baseline learning objectives.
2. **Teacher Portability**: An individual teacher owns their generated lesson plans. If a teacher switches schools, their personal lesson drafts remain tied to their teacher account.
3. **Institutional Retention**: Student attendance records, terminal marks, and class logs remain accessible to the school administration for regulatory compliance under the Indian Education Code.
4. **DPDP Act 2023 Compliance**: Student personal identifying information (PII) is encrypted at rest; student test submissions are accessible only by their enrolled teacher and school administration.
