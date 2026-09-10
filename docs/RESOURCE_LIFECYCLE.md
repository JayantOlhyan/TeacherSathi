# TeacherSathi — Resource Lifecycle Specification

> **Status**: Frozen Specification (Phase 0)  
> **Purpose**: Standardize the lifecycle states and transitions of all educational materials.

---

## 1. Resource Lifecycle States

Every pedagogical asset (Lesson Plan, Worksheet, Quiz, Presentation, Mind Map, Activity) follows a strict six-stage lifecycle:

```
┌───────────┐       AI / Manual Trigger       ┌───────────┐
│ GENERATE  │ ──────────────────────────────> │   DRAFT   │
└───────────┘                                 └───────────┘
                                                    │
                                                    │ Quality / Schema Validation
                                                    ▼
┌───────────┐         Delivered in Class      ┌───────────┐
│   USED    │ <────────────────────────────── │   READY   │
└───────────┘                                 └───────────┘
      │                                             │
      │ Deprecated / Term End                       │ Superseded
      ▼                                             ▼
┌─────────────────────────────────────────────────────────┐
│                       ARCHIVED                          │
└─────────────────────────────────────────────────────────┘
```

1. **`GENERATE`**:
   - The initial creation trigger (via AI prompt wizard or manual authoring).
   - Temporary state while generation jobs or parsing scripts process.
2. **`DRAFT`**:
   - The asset has been structured but has not passed validation or teacher approval.
   - Visible only to the authoring educator or admin.
3. **`VALIDATE`**:
   - System checks: NCERT chapter mapping, schema completeness, answer key presence, Devanagari script integrity.
4. **`READY`**:
   - Fully vetted, print-ready, and display-ready.
   - Available for classroom projection, export to PDF/PPTX, or assignment to students.
5. **`USED`**:
   - Active in at least one classroom session or distributed as a student assignment.
   - Immutable to prevent historical test records from becoming misaligned with submitted answers.
6. **`ARCHIVED`**:
   - Retired at the conclusion of an academic year or when replaced by a new textbook edition.
   - Preserved for audit compliance and year-over-year reporting.

---

## 2. Standard Resource Operations

| Operation | Trigger / Method | State Permitted | Resulting Action |
| :--- | :--- | :--- | :--- |
| **Edit** | Teacher modifies questions, instructions, or duration. | `DRAFT`, `READY` (Unassigned) | Creates a new version revision. |
| **Regenerate** | Teacher requests fresh AI variations. | `DRAFT` | Overwrites or creates alternate draft variation. |
| **Duplicate** | Teacher clones a proven resource for another section. | `READY`, `USED` | Creates an independent copy in `DRAFT` status. |
| **Reuse** | Teacher schedules an existing resource for next year's batch. | `READY`, `USED`, `ARCHIVED` | Clones metadata and creates a fresh active assignment. |
| **Export** | Teacher downloads PDF or PPTX for offline projection. | `READY`, `USED` | Renders high-resolution printable or presentation deck. |
| **Archive** | Teacher removes outdated lesson from active dashboard. | `READY`, `USED` | Sets status to `ARCHIVED`; removes from active selection menus. |
