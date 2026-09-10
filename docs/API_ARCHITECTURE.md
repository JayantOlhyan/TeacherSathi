# TeacherSathi — API Architecture Specification

> **Status**: Production Reference Document (Phase 1)  
> **Framework**: Next.js 14 App Router (`src/app/api/`)  
> **Data Access Layer**: `src/lib/repositories/`  
> **Input Validation**: Zod (`src/lib/validations/`)  

---

## 1. Architectural Design Principles

1. **Server Authority**: The browser client is never trusted to supply its own role, school affiliation, or resource ownership. The user identity is extracted authoritatively from the Supabase session cookie (`supabase.auth.getUser()`).
2. **Repository Abstraction**: Route handlers do not construct ad-hoc SQL strings or raw table queries; all data operations delegate to domain repositories.
3. **Zod Runtime Validation**: All inbound payloads are validated against strict Zod schemas before database execution.
4. **Audit Trail Automation**: All mutating operations (`POST`, `PATCH`, `DELETE`) automatically write an entry to `audit_logs` tracking the actor ID, action name, entity ID, and client IP/user agent.

---

## 2. API Endpoints Directory

### 1. `/api/profile`
* **File**: `src/app/api/profile/route.ts`
* **Methods**:
  - `GET`: Returns the authenticated user's profile.
    - Response: `{ data: ProfileRecord }`
    - Status Codes: `200`, `401`, `404`, `500`
  - `PATCH`: Updates the user's name, avatar, phone, or language preference.
    - Body: `{ full_name?, avatar_url?, phone?, preferred_language? }`
    - Response: `{ data: UpdatedProfileRecord }`
    - Status Codes: `200`, `400`, `401`, `500`

---

### 2. `/api/classes`
* **File**: `src/app/api/classes/route.ts`
* **Methods**:
  - `GET`: Lists classes scoped by query parameter:
    - Query Parameters: `?schoolId=...` or `?teacherId=...`
    - Response: `{ data: ClassRecord[] }`
    - Status Codes: `200`, `400`, `500`
  - `POST`: Creates a new institutional section:
    - Body: `{ grade_id, name, section, academic_year, school_id? }`
    - Response: `{ data: ClassRecord }` (Status `201`)
    - Status Codes: `201`, `400`, `401`, `500`

---

### 3. `/api/curriculum`
* **File**: `src/app/api/curriculum/route.ts`
* **Methods**:
  - `GET`: Retrieves canonical NCERT curriculum hierarchy:
    - Query Parameters:
      - `type=subjects` $\rightarrow$ Lists all active subjects.
      - `type=books&gradeId=...` $\rightarrow$ Lists books for a grade.
      - `type=chapters&bookId=...` $\rightarrow$ Lists published chapters.
      - `type=concepts&chapterId=...` $\rightarrow$ Lists concepts in a chapter.
      - Default $\rightarrow$ Lists all grades.
    - Response: `{ data: Array<Grade | Subject | Book | Chapter | Concept> }`
    - Status Codes: `200`, `500`

---

### 4. `/api/questions`
* **File**: `src/app/api/questions/route.ts`
* **Methods**:
  - `GET`: Retrieves verified assessment items:
    - Query Parameters: `?chapterId=...&sectionTier=SECTION_A|SECTION_B|SECTION_C` or `?id=...`
    - Response: `{ data: QuestionRecord[] | QuestionRecord }`
    - Status Codes: `200`, `400`, `404`, `500`
  - `POST`: Creates a new question with option choices:
    - Body: Validated against `QuestionCreateSchema`.
    - Response: `{ data: QuestionRecord }` (Status `201`)
    - Status Codes: `201`, `400`, `401`, `500`
  - `PATCH`: Modifies question content and automatically saves a snapshot to `question_versions`:
    - Body: `{ id, change_summary, ...updates }`
    - Response: `{ data: UpdatedQuestionRecord }`
    - Status Codes: `200`, `400`, `401`, `500`

---

### 5. `/api/resources`
* **File**: `src/app/api/resources/route.ts`
* **Methods**:
  - `GET`: Returns resources owned by authenticated educator:
    - Query Parameters: `?type=LESSON_PLAN|WORKSHEET|PRESENTATION|MIND_MAP`
    - Response: `{ data: ResourceRecord[] }`
    - Status Codes: `200`, `401`, `500`
  - `POST`: Creates a pedagogical resource in `DRAFT` status:
    - Body: Validated against `ResourceCreateSchema`.
    - Response: `{ data: ResourceRecord }` (Status `201`)
  - `PATCH`: Transitions lifecycle state (`DRAFT` $\rightarrow$ `VALIDATING` $\rightarrow$ `READY` $\rightarrow$ `USED` $\rightarrow$ `ARCHIVED`):
    - Body: `{ id, status }`
    - Response: `{ data: ResourceRecord }`
  - `DELETE`: Archives resource (`status = 'ARCHIVED', is_archived = true`):
    - Query Parameters: `?id=...`
    - Response: `{ success: true }`

---

### 6. `/api/classroom`
* **File**: `src/app/api/classroom/route.ts`
* **Methods**:
  - `GET`: Polls device online state or active kiosk session status:
    - Query Parameters: `?sessionId=...` or `?deviceId=...`
    - Response: `{ data: ClassroomSessionRecord | ClassroomDeviceRecord }`
    - Status Codes: `200`, `400`, `404`, `500`
  - `POST`: Processes pairing handshakes and remote commands:
    - Actions:
      - `action: "CREATE_SESSION"` $\rightarrow$ Initializes new session token hash on kiosk display.
      - `action: "UPDATE_STATUS"` $\rightarrow$ Approves mobile QR handshake (`ACTIVE`).
      - `action: "REMOTE_ACTION"` $\rightarrow$ Records presentation navigation or quiz dispatch.
    - Status Codes: `200`, `201`, `400`, `500`
