# TeacherSathi — Supabase Integration Architecture

> **Status**: Production Reference Document (Phase 1)  
> **Package Dependencies**: `@supabase/ssr` (v0.12.7), `@supabase/supabase-js` (v2.105.3)  
> **Framework Context**: Next.js 14 App Router  

---

## 1. Client Architecture Overview

TeacherSathi implements the official `@supabase/ssr` architecture, strictly separating browser-side and server-side execution contexts:

```
                      ┌────────────────────────────────────────┐
                      │          HTTP REQUEST INCOMING         │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          src/middleware.ts             │
                      │       (updateSession in Edge)          │
                      └───────────────────┬────────────────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     │                                         │
                     ▼                                         ▼
┌────────────────────────────────────────┐    ┌────────────────────────────────────────┐
│         SERVER-SIDE CONTEXT            │    │         BROWSER-SIDE CONTEXT           │
│      src/lib/supabase/server.ts        │    │       src/lib/supabase/client.ts       │
├────────────────────────────────────────┤    ├────────────────────────────────────────┤
│ • Server Components                    │    │ • Interactive Client Components        │
│ • Server Actions                       │    │ • Real-time display listeners          │
│ • API Route Handlers (/api/*)          │    │ • Uses createBrowserClient             │
│ • Uses createServerClient & cookies()  │    │ • Read-only session via public Anon key│
└────────────────────────────────────────┘    └────────────────────────────────────────┘
```

---

## 2. Component Directory

### A. Browser Client (`src/lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```
* **Scope**: Client components (`"use client"`), interactive modals, and client-side listeners.
* **Security**: Uses exclusively `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Restricted entirely by database RLS.

### B. Server Client (`src/lib/supabase/server.ts`)
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { ... },
        remove(name: string, options: CookieOptions) { ... },
      },
    }
  );
}
```
* **Scope**: Server Components, API routes (`/api/*`), and Server Actions.
* **Security**: Evaluates cookies authoritatively; automatically binds the authenticated user's JWT to PostgreSQL session `auth.uid()`.

### C. Middleware Session Refresh (`src/lib/supabase/middleware.ts`)
* **Scope**: Next.js Edge runtime in `src/middleware.ts`.
* **Purpose**: Refreshes expired auth tokens transparently and sets updated cookies on both the request and response before protected routes execute.

### D. Server Admin Client (`src/lib/supabase/admin.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```
* **Scope**: Server-only privileged execution (system maintenance, asynchronous background tasks, and unconstrained audit logging).
* **Rule**: Never imported or bundled in client-side code.

---

## 3. Migration Source of Truth

All database changes are managed in version-controlled SQL files:

```text
supabase/
├── config.toml
├── migrations/
│   ├── 20260911000001_initial_schema.sql
│   ├── 20260911000002_rls_policies.sql
│   └── 20260911000003_indexes_and_triggers.sql
└── seed/
    └── 01_curriculum_seed.sql
```
No manual, untracked changes in Supabase Studio are permitted.
