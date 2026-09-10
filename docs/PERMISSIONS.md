# TeacherSathi — Permissions & RBAC Matrix

> **Status**: Frozen Contract (Phase 0)  
> **Rule**: Technical authorization baseline for future server-side Row Level Security (RLS) enforcement.

---

## 1. Permissions Matrix by Entity

| Entity / Resource | Action | SUPER_ADMIN | SCHOOL_ADMIN | TEACHER | STUDENT |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Canonical Curriculum** (Grades, Subjects, Books, Chapters) | Read | ✅ | ✅ | ✅ | ✅ |
| | Create/Update | ✅ | ❌ | ❌ | ❌ |
| | Delete/Archive | ✅ | ❌ | ❌ | ❌ |
| **Global Question Bank** | Read (Questions) | ✅ | ✅ | ✅ | ✅ |
| | Read (Answer Keys) | ✅ | ✅ | ✅ | ❌ (Pre-submit) |
| | Create/Update | ✅ | ❌ | ❌ | ❌ |
| **Teacher Generated Kits** (Lesson Plans, Worksheets) | Read Own | ✅ | ✅ (School) | ✅ | ❌ |
| | Create/Update Own | ✅ | ❌ | ✅ | ❌ |
| | Delete Own | ✅ | ❌ | ✅ | ❌ |
| **Classroom & Rosters** | Read School/Class | ✅ | ✅ (School) | ✅ (Assigned) | ❌ |
| | Create/Update Class | ✅ | ✅ (School) | ✅ (Individual) | ❌ |
| | Manage Students | ✅ | ✅ (School) | ✅ (Assigned) | ❌ |
| **Attendance & Marks** | Read Records | ✅ | ✅ (School) | ✅ (Assigned) | ✅ (Own Only) |
| | Mark Attendance | ✅ | ✅ | ✅ (Assigned) | ❌ |
| **Smartboard Kiosk Pairing** | Generate QR | ✅ | ✅ | ✅ | ❌ |
| | Approve Remote Session | ✅ | ✅ | ✅ | ❌ |
| | Remote Controls (Lock/End)| ✅ | ✅ | ✅ | ❌ |
| **Quiz & Test Attempts** | Submit Attempt | ❌ | ❌ | ❌ | ✅ |
| | Grade Attempt | ✅ | ❌ | ✅ | ❌ |
| **Billing & Invoices** | Read/Pay Invoices | ✅ | ✅ (School) | ✅ (Personal) | ❌ |
| **System Audit Logs** | View Global Logs | ✅ | ❌ | ❌ | ❌ |

---

## 2. Enforcement Rules for Production (Phase 1)

1. **Server-Side Authorization**:
   - The current implementation stores `roles: string[]` on `adminStore.ts` in browser `localStorage`. In Phase 1, all permissions must be checked on the server via Supabase JWT claims (`auth.jwt() -> app_metadata.role`) and database Row Level Security (RLS).
2. **Path Route Guards**:
   - Next.js Middleware must strictly intercept:
     - `/admin/*` $\rightarrow$ Requires `SUPER_ADMIN`
     - `/dashboard/*` $\rightarrow$ Requires `TEACHER` or `SCHOOL_ADMIN` or `SUPER_ADMIN`
     - `/student/*` $\rightarrow$ Requires `STUDENT`
3. **No Frontend-Only Concealment**:
   - Hiding a button in the UI does NOT constitute security. All Next.js Server Actions and Route Handlers must validate caller identity and role.
