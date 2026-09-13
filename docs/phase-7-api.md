# Phase 7 — Content & Media REST API Reference

All Phase 7 endpoints require active user authentication with appropriate school role memberships (`TEACHER`, `SCHOOL_ADMIN`, `SUPER_ADMIN`).

---

## 1. Resource Management Endpoints

### `GET /api/resources`
Retrieve a paginated and filtered list of resources.
- **Query Parameters**:
  - `type`: Filter by `PRESENTATION`, `MIND_MAP`, `ACTIVITY`, etc.
  - `status`: Filter by `DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED`.
  - `language`: Filter by language code (e.g., `en`, `hi`).
  - `search`: Full-text search term matching title and description.
  - `limit`: Number of items (default 20, max 100).
  - `offset`: Pagination offset (default 0).
- **Response**: `{ success: true, data: ResourceRecord[], pagination: { total, limit, offset } }`

### `POST /api/resources`
Create a new resource draft.
- **Request Body**:
  ```json
  {
    "title": "Structure of the Atom",
    "description": "NCERT Class 9 Chemistry Presentation",
    "type": "PRESENTATION",
    "language": "en",
    "content": { "slides": [...] }
  }
  ```
- **Response**: `{ success: true, data: ResourceRecord }`

### `GET /api/resources/[id]`
Retrieve a single resource by ID with detailed content. Automatically tracks a `VIEW` action in `resource_usage`.

### `PATCH /api/resources/[id]`
Update an existing resource. If the resource is currently `PUBLISHED`, captures a snapshot in `resource_versions` and increments the version counter.
- **Request Body**: Partial update object (`title`, `content`, `tags`, etc.).

### `DELETE /api/resources/[id]`
Permanently delete a resource. Requires author ownership or school admin privilege.

---

## 2. Validation & Publishing Lifecycle Endpoints

### `POST /api/resources/[id]/validate`
Runs the deterministic quality and readability audit.
- **Response**:
  ```json
  {
    "success": true,
    "score": 95,
    "errors": [],
    "warnings": [
      {
        "code": "WORD_COUNT_HIGH",
        "message": "Slide 3 has 58 words (close to 60-word limit)",
        "severity": "WARNING"
      }
    ]
  }
  ```

### `POST /api/resources/[id]/publish`
Validates and publishes the resource. Fails closed if `score < 75` or critical validation errors are present. Captures an immutable version snapshot.

### `POST /api/resources/[id]/archive`
Transitions resource status to `ARCHIVED`. Archived resources are hidden from active classroom selection.

---

## 3. Version History & Rollback Endpoints

### `GET /api/resources/[id]/versions`
Returns the historical version list from `resource_versions` ordered descending by version number.

### `POST /api/resources/[id]/restore`
Performs a 1-click rollback to a specific historical version.
- **Request Body**: `{ "versionNumber": 2 }`
- **Response**: Restores content, creates version $N+1$, and returns the updated resource.

---

## 4. Multi-Channel Export Endpoints

### `GET|POST /api/resources/[id]/export`
Generates downloadable, print-ready document payloads.
- **Query / Body**: `format`: `"PDF" | "SVG" | "HTML" | "PRINTABLE" | "JSON"`
- **Response**: Returns either raw SVG XML, HTML document with CSS `@media print` styling, or JSON schema.

---

## 5. Media & Asset Endpoints

### `POST /api/media/upload`
Supports multipart file upload or pre-signed upload URL requests.
- **Security Check**: Enforces file size ceiling, MIME whitelist, and magic byte buffer authentication.

### `POST /api/media/process`
Queues an asynchronous media transcoding or thumbnail generation job in `media_jobs`.

### `GET /api/media/[id]`
Generates a time-limited (60-minute) signed download URL for private educational media.

### `DELETE /api/media/[id]`
Deletes the media asset record and removes the binary file from Supabase storage.
