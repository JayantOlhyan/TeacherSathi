# TeacherSathi — Security Audit & Threat Assessment

> **Status**: Comprehensive Phase 0 Security Review  
> **Classification**: Security Architecture Baseline

---

## 1. Critical Security Findings

### SEC-01: Hardcoded Google Service Account Private Key in Repository
- **Severity**: `CRITICAL`
- **Location**: [`docs/credentials/teachersathi-backend-5e85f92836a2.json`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/docs/credentials/teachersathi-backend-5e85f92836a2.json)
- **Finding**: A valid JSON key file containing `type: "service_account"`, `project_id: "teachersathi-backend"`, and a complete RSA private key is stored directly in git tracking.
- **Threat Vector**: Anyone with read access to the GitHub repository can authenticate to Google Cloud APIs using this identity, potentially incurring compute charges or accessing sensitive resources.
- **Remediation Action Required**:
  1. Revoke the key `5e85f92836a211e678123538df7986d1a7577c7d` immediately in the Google Cloud Console.
  2. Delete `docs/credentials/` from git tracking and git history using BFG Repo-Cleaner or `git filter-branch`.
  3. Ensure `*.json` under credentials directories is in `.gitignore`.

---

### SEC-02: Client-Side Authorization & Unrestricted Admin Routes
- **Severity**: `HIGH`
- **Location**: [`src/middleware.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/middleware.ts) & [`src/app/[locale]/admin/layout.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/admin/layout.tsx)
- **Finding**: Route protection is enforced primarily through client-side React components ([`AdminRoleGuard.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/components/admin/AdminRoleGuard.tsx)) which check mock roles in `localStorage`. Next.js Middleware does NOT check auth tokens.
- **Threat Vector**: A malicious user can disable JavaScript, edit `localStorage.setItem('ts_admin_users', ...)`, or bypass frontend redirects to view administrative UI and metadata.
- **Remediation Action Required**: Implement server-side JWT authentication checks in `src/middleware.ts` using `@supabase/ssr`. Return `403 Forbidden` or redirect unauthorized requests prior to rendering page layouts.

---

### SEC-03: Insecure Cross-Device Token Exchange via LocalStorage
- **Severity**: `HIGH`
- **Location**: [`src/app/[locale]/classroom/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/classroom/page.tsx#L38)
- **Finding**: QR session pairing relies on a predictable key `ts_qr_approved_${sessionId}` in client `localStorage`.
- **Threat Vector**: Any script executing in the browser origin can forge an approval token and bypass physical authentication.
- **Remediation Action Required**: Secure the handshake over signed WebSocket channels with server-side nonce verification and teacher JWT validation.

---

### SEC-04: Missing Rate Limiting on Contact & Auth Endpoints
- **Severity**: `MEDIUM`
- **Location**: [`src/app/[locale]/support/contact/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/support/contact/page.tsx) & [`src/components/InstitutionalLeadModal.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/components/InstitutionalLeadModal.tsx)
- **Finding**: Forms submit without IP-based rate limiting, honeypot fields, or CAPTCHA validation.
- **Threat Vector**: Vulnerable to automated spam flooding and brute-force submission attacks.
- **Remediation Action Required**: Add rate limiting middleware (Upstash Redis or Cloudflare Turnstile) and server-side Zod input sanitization in Phase 1.

---

### SEC-05: Missing Supabase Row Level Security (RLS) Policies
- **Severity**: `HIGH` (Preparation for Phase 1)
- **Location**: Supabase project backend
- **Finding**: Because there are no active PostgreSQL tables, RLS policies are not yet enforced. If tables are created without RLS in Phase 1, any user with the `NEXT_PUBLIC_SUPABASE_ANON_KEY` can read or write all database rows.
- **Remediation Action Required**: All future Phase 1 tables (`profiles`, `classes`, `questions`, `lesson_plans`, etc.) must have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` enabled by default with strict tenant-isolation policies.

---

## 2. Positive Security Implementations Already in Place

The following defensive measures are already verified in the repository:
1. **Strict HTTP Security Headers**: Configured in [`next.config.mjs`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/next.config.mjs#L35-L72):
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HSTS enabled).
   - `X-Frame-Options: SAMEORIGIN` (Clickjacking mitigation).
   - `X-Content-Type-Options: nosniff` (MIME sniffing prevention).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
2. **Safe Supabase Initialization**: [`src/lib/supabase.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/lib/supabase.ts#L6-L17) gracefully disables features if environment variables are absent, preventing runtime application crashes.
3. **No Raw Password Storage**: Passwords are handled exclusively by Supabase Auth via secure one-way salted hashes.
