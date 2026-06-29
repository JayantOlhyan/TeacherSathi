# TeacherSathi

AI-powered EdTech platform for Indian government school teachers.
Live at: https://teacher-sathi.online

## Stack

- **Framework**: Next.js 14 (App Router) — `next@14.2.35`
- **i18n**: next-intl v4 (LOCKED at ^4.11.0 — do NOT upgrade major version)
- **Auth + DB**: Supabase (`@supabase/supabase-js`)
- **Styling**: Tailwind CSS 3, `class-variance-authority`, `tailwind-merge`
- **Payments**: Razorpay (not yet fully integrated)
- **Hosting**: Netlify (via `@netlify/plugin-nextjs`)
- **Language**: TypeScript (strict mode)

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # All routes are locale-wrapped
│   │   ├── page.tsx       # Homepage / landing
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   ├── pricing/       # Pricing page
│   │   ├── dashboard/     # Authenticated dashboard
│   │   │   ├── classes/
│   │   │   ├── whiteboard/
│   │   │   └── create/
│   │   └── content/[grade]/[subject]/[chapter]/
│   ├── layout.tsx         # Root layout (pass-through)
│   └── not-found.tsx      # Global 404
├── components/
│   ├── ui/                # Button, Card (CVA-based)
│   ├── dashboard/         # Header, Sidebar
│   ├── Navbar.tsx
│   └── LanguageToggle.tsx
├── i18n/
│   ├── routing.ts         # defineRouting config (localePrefix: 'never')
│   └── request.ts
├── lib/
│   └── supabase.ts        # Client-side Supabase init
└── middleware.ts           # next-intl middleware
messages/
├── en.json
└── hi.json
```

## i18n (next-intl)

- Locales: `en`, `hi`
- Default: `en`
- `localePrefix: 'never'` — locale is never shown in URLs
- All routes live under `src/app/[locale]/`
- Use `Link`, `useRouter`, `usePathname` from `@/i18n/routing` (NOT from `next/navigation`)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=       # Safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Safe for client (RLS-protected)
```

### SECURITY — NEVER expose these in client-side code:
- `ANTHROPIC_API_KEY`
- `RAZORPAY_KEY_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `YOUTUBE_API_KEY`

These must only be used in server-side API routes (`src/app/api/`), never in files with `"use client"` or imported into client components.

## Conventions

- Use `@/` path alias for imports from `src/`
- Components use named exports (except page/layout which use default)
- Prefer Tailwind utility classes over custom CSS
- Button component supports `asChild` prop via Radix Slot
- All pages under `[locale]/` — never create routes outside this directory

## Phase Tracking

See [docs/phase-tracker.md](docs/phase-tracker.md) for current progress.
