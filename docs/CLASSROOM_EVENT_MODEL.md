# TeacherSathi — Classroom Event Model (Phase 3)

## 1. Canonical Event Log

The `classroom_events` table forms the authoritative, append-only history for every live classroom session.

```sql
CREATE TABLE classroom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES classroom_sessions(id) ON DELETE CASCADE,
  device_id TEXT REFERENCES classroom_session_devices(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}',
  sequence_number BIGINT NOT NULL,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_session_sequence UNIQUE (session_id, sequence_number)
);
```

## 2. Canonical Event Types (Section 10)

| Event Type | Purpose | Payload Schema |
|---|---|---|
| `SESSION_STARTED` | Marks session live | `{ startedAt: ISOString }` |
| `SESSION_PAUSED` | Halts live interactivity | `{ pausedAt: ISOString }` |
| `SESSION_RESUMED` | Resumes active session | `{ resumedAt: ISOString }` |
| `SESSION_ENDED` | Permanently closes session | `{ endedAt: ISOString }` |
| `DEVICE_CONNECTED` | New device paired | `{ deviceId, deviceName, deviceType }` |
| `DEVICE_DISCONNECTED` | Device disconnected | `{ deviceId, reason? }` |
| `DEVICE_REVOKED` | Teacher revokes device | `{ deviceId, reason? }` |
| `START_PRESENTATION` | Launches slide deck | `{ presentationId, title?, totalSlides, slideIndex: 0 }` |
| `NEXT_SLIDE` | Advances presentation | `{ presentationId, slideIndex: number }` |
| `PREVIOUS_SLIDE` | Moves back in presentation | `{ presentationId, slideIndex: number }` |
| `GOTO_SLIDE` | Jumps to specific slide | `{ presentationId, slideIndex: number }` |
| `START_QUIZ` | Launches formative check | `{ quizResourceId, title?, totalQuestions? }` |
| `END_QUIZ` | Exits active quiz | `{ quizResourceId? }` |
| `PUSH_RESOURCE` | Displays lesson plan/sheet | `{ resourceId, resourceType, title, metadata? }` |
| `START_TIMER` | Starts synchronized countdown | `{ durationSeconds, startedAt: ISO, endsAt: ISO }` |
| `STOP_TIMER` | Stops active timer | `{ remainingSeconds: number }` |
| `LOCK_BOARD` | Freezes smartboard input | `{ reason? }` |
| `UNLOCK_BOARD` | Unfreezes smartboard | `{ reason? }` |
| `WHITEBOARD_UPDATE` | Broadcasts sketch elements | `{ elements?: unknown[], appState?: unknown }` |
| `CLEAR_WHITEBOARD` | Erases digital canvas | `{}` |

## 3. Sequence Number Monotonicity

Every event within a session is assigned a sequence number starting from `1001`, computed atomically via:
```sql
COALESCE(MAX(sequence_number), 0) + 1
```
Clients detect missing events if `receivedSeq > lastSeq + 1` and automatically initiate state recovery.

## 4. Idempotency Guarantees

Every mutation accepts an optional client-generated `idempotency_key` (UUID). If the same request arrives twice (e.g. double-click or network retry), the server returns the existing event record without creating duplicate events or incrementing sequence numbers.
