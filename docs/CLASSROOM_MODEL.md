# TeacherSathi — Smartboard Classroom Model & Remote Handshake

> **Status**: Frozen Architecture Contract (Phase 0)  
> **Purpose**: Technical specification for 75" smartboard kiosk pairing and mobile remote events.

---

## 1. Classroom Session Lifecycle

Every smartboard display interaction progresses through five well-defined states:

```
┌───────────┐       Scan QR        ┌───────────┐       Approve        ┌───────────┐
│  WAITING  │ ───────────────────> │  PAIRING  │ ───────────────────> │  ACTIVE   │
└───────────┘                      └───────────┘                      └───────────┘
      ▲                                                                     │
      │                                                                     │ Standby /
      │                               Time Out / End                        │ Recess
      │ ────────────────────────────────────────────────────────────        ▼
      │                                                            ┌───────────┐
      └─────────────────────────────────────────────────────────── │  PAUSED   │
                                                                   └───────────┘
```

1. **`WAITING`**:
   - The 75" display at `/classroom` renders an ephemeral, high-contrast QR code with a 120-second countdown timer.
   - Generates unique pair: `sessionId` (e.g. `sess_89412`) and `token` (e.g. `tok_39fj20`).
   - If timer reaches 0, the session token auto-invalidates and refreshes with a new cryptographic hash.
2. **`PAIRING`**:
   - The teacher scans the QR code with their mobile phone camera, opening `/auth/qr-confirm`.
   - The phone loads device details (`Board-001`, `Room 102`, `Government Senior Secondary School`).
   - The teacher is prompted to verify and tap **"Continue / Approve"**.
3. **`ACTIVE`**:
   - The smart screen receives approval, transitions to the educator's presentation dashboard, and starts the period timer.
   - The teacher's mobile phone converts into an active remote control interface.
4. **`PAUSED`**:
   - Temporary privacy mode (e.g. teacher is grading or stepping out for recess). Screen displays school crest and standby clock.
5. **`ENDED`**:
   - Session terminates automatically at period end or when teacher taps **"Lock Board"**. All temporary tokens are purged from memory, and the display returns to `WAITING`.

---

## 2. Current Implementation vs. Target Production Architecture

### Current Implementation (Audited Reality)
- **Kiosk (`/classroom`)**:
  - File: [`src/app/[locale]/classroom/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/classroom/page.tsx#L32-L47)
  - Uses a client-side `setInterval` polling every 1000ms:
    ```typescript
    const approvalData = localStorage.getItem(`ts_qr_approved_${sessionId}`);
    ```
  - **Limitation**: `localStorage` is scoped to a single browser instance. This pairing **only works if the smartboard and the phone are running inside the exact same browser profile** (or during a simulated test). It fails across physically separate devices.
- **Handshake (`/auth/qr-confirm`)**:
  - File: [`src/app/[locale]/auth/qr-confirm/page.tsx`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/app/%5Blocale%5D/auth/qr-confirm/page.tsx#L47-L58)
  - Writes `{ status: "APPROVED", teacher, boardId }` to `localStorage.setItem('ts_qr_approved_' + sessionId, ...)` after a simulated 1500ms delay.

### Target Production Architecture (Phase 3 Specification)
- **Supabase Realtime Broadcast Channels**:
  - Kiosk subscribes to channel: `supabase.channel('board:' + sessionId)`.
  - When the teacher approves on mobile, a secure Next.js Server Action verifies the teacher's JWT and broadcasts an authorized `SESSION_APPROVED` event over WebSockets:
    ```
    Mobile Phone (Teacher JWT) 
        → POST /api/classroom/pair 
        → Supabase Realtime Broadcast 
        → 75" Smartboard Screen (Instant Unlock)
    ```
  - Eliminates polling completely and works across any two physical devices on different networks.

---

## 3. Classroom Remote Control Events Specification

Once paired (`ACTIVE`), the teacher's smartphone transmits remote commands to the smartboard:

| Remote Action Event | Payload | Smartboard Action on 75" Screen |
| :--- | :--- | :--- |
| `START_PRESENTATION` | `{ chapterId, slideIndex: 0 }` | Enters fullscreen smart classroom presentation mode. |
| `NEXT_SLIDE` | `{ currentSlide }` | Advances presentation to next pedagogical card. |
| `PREVIOUS_SLIDE` | `{ currentSlide }` | Reverts presentation to previous card. |
| `START_QUIZ` | `{ quizId }` | Launches interactive clicker question overlay. |
| `END_QUIZ` | `{ quizId }` | Hides quiz overlay and shows accuracy scoreboard. |
| `PUSH_RESOURCE` | `{ fileUrl, mimeType }` | Renders teacher's uploaded PDF/worksheet directly on screen. |
| `START_TIMER` | `{ durationSeconds }` | Displays countdown timer for timed student group exercises. |
| `LOCK_BOARD` | `{ sessionId }` | Immediately returns smartboard to the QR Kiosk screen (`WAITING`). |
| `END_SESSION` | `{ sessionId, periodDuration }`| Finalizes session log, logs attendance, and signs out. |
