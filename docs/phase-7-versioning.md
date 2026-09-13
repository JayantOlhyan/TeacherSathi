# Phase 7 — Resource Versioning & Rollback Architecture

Educational content undergoes iterative refinement throughout an academic term. The TeacherSathi Versioning Engine guarantees lesson integrity, prevents mid-class disruptions, and provides seamless 1-click rollback.

---

## 1. Lifecycle & Versioning Trigger

Resources advance through four states:
`DRAFT` $\longrightarrow$ `REVIEW` $\longrightarrow$ `PUBLISHED` $\longrightarrow$ `ARCHIVED`

### When is a New Version Snapshot Captured?
1. **Initial Publish**: Transition from `DRAFT` to `PUBLISHED` generates `version 1`.
2. **Post-Publish Updates**: Any update made to a currently `PUBLISHED` resource increments `version` ($v \rightarrow v+1$) and writes an immutable row to `resource_versions`.
3. **Manual Snapshot**: Teachers can trigger an explicit checkpoint with a descriptive changelog message.

```
[Active Resource: Version N]
          |
          +---> [User Edits Content & Hits Save / Publish]
          |
          v
[1. Snapshot Saved to resource_versions (version = N)]
          |
[2. Active Resource version incremented to N+1]
          |
[3. Active Resource updated with new content & score]
```

---

## 2. Immutable Classroom Binding

When a teacher launches a smartboard session or assigns a resource to a class:
- The session captures the **exact version number** (`resource_version: 2`).
- If another teacher or admin subsequently updates the canonical resource, the active classroom session continues reading the captured immutable version payload.
- This eliminates real-time rendering race conditions and unexpected slide shifts during live instruction.

---

## 3. 1-Click Rollback Mechanism

If an edit introduces an error or undesirable layout change:
1. The teacher navigates to the **History & Details** tab (`/dashboard/resources/[id]`).
2. The UI lists all historical versions with timestamps, author attribution, and changelog notes.
3. Clicking **Rollback to vK** calls `POST /api/resources/[id]/restore`:
   - Retrieves the target version content from `resource_versions`.
   - Increments the resource's current version counter ($N \rightarrow N+1$).
   - Commits the restored content as the new active version, preserving an unbroken historical lineage.
