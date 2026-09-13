# Phase 7 — Storage Security & Access Control Architecture

Educational institutions require absolute isolation of student media, private teacher drafts, and institutional assets. This document outlines the multi-layered security model safeguarding storage in TeacherSathi.

---

## 1. Multi-Layered Ingestion Defense

Every inbound file passes through four mandatory inspection gates before touching storage:

```
[Inbound Request]
        |
        v
[Gate 1: Tenant Authentication & School Context Validation]
   - Asserts caller has active session and valid school_id membership
        |
        v
[Gate 2: Strict File Extension & MIME Whitelist]
   - Rejects unapproved extensions (.exe, .sh, .html, .js, etc.)
   - Validates declared Content-Type against allowed media registry
        |
        v
[Gate 3: Server-Side Magic Byte Authentication]
   - Inspects the leading binary bytes of the actual buffer:
       * JPEG: 0xFF 0xD8 0xFF
       * PNG:  0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
       * PDF:  %PDF- (0x25 0x50 0x44 0x46)
       * WebM: 0x1A 0x45 0xDF 0xA3
       * MP4:  ftyp box (0x66 0x74 0x79 0x70)
   - Discrepancy between declared MIME and magic bytes immediately aborts upload.
        |
        v
[Gate 4: Path Sanitization & Key Isolation]
   - Filenames are replaced with cryptographically secure UUIDv4 identifiers.
   - Storage keys follow strict multi-tenant prefix isolation:
     `{school_id}/{user_id}/{asset_type}/{uuid}.{ext}`
   - Path traversal tokens (`..`, `/`, `\`) are strictly forbidden.
```

---

## 2. Row-Level Security Policies

The `media_assets` and `media_jobs` tables enforce strict isolation:

```sql
-- Teachers can only view media within their school
CREATE POLICY media_assets_select_policy ON media_assets
    FOR SELECT USING (
        school_id = auth.school_id()
        OR is_public = true
    );

-- Users can only delete or mutate their own uploads
CREATE POLICY media_assets_modify_policy ON media_assets
    FOR ALL USING (
        uploader_id = auth.uid()
        AND school_id = auth.school_id()
    );
```

---

## 3. Time-Limited Signed URLs

Private media assets (classroom recordings, proprietary teacher worksheets) are never served through public bucket endpoints:
- Read access requires calling `/api/media/[id]`.
- The server validates tenant permissions and generates a signed URL with a **60-minute expiration window**.
- Replay attacks or unauthorized link sharing outside the school domain fail once the token expires.
