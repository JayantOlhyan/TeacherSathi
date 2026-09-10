# TeacherSathi — Realtime Architecture (Phase 3)

## 1. Overview

TeacherSathi uses **Supabase Realtime** backed by PostgreSQL. The system enforces an authoritative-server pattern: PostgreSQL is the single source of truth, and Supabase Realtime acts as the delivery and distribution mechanism.

```text
Client Action
   │
   ▼
Server API Route (POST /api/classroom/sessions/:id/events)
   │
   ├── 1. Authentication & Authorization Check
   ├── 2. Zod Payload Validation
   ├── 3. Session State Machine Verification
   ├── 4. Device Revocation Check
   ├── 5. Idempotency Key Deduplication
   ├── 6. Monotonic Sequence Number Assignment (COALESCE(MAX, 0) + 1)
   ├── 7. PostgreSQL Persistence (classroom_events)
   ├── 8. Authoritative Session Mutation (active_resource_id, last_activity_at)
   │
   ▼
Supabase Realtime Broadcast
   │
   ▼ (WebSocket)
Channel: classroom:session:<sessionId>
   ├── Smartboard 75" Kiosk (Applies slide change / quiz / timer)
   ├── Teacher Mobile Controller (Displays confirmation)
   └── Presence State (Online / offline heartbeats)
```

## 2. Channel Conventions

- **Channel Name**: `classroom:session:<sessionId>`
- **Event Name**: `classroom_event`
- **Payload**: Full `ClassroomEventRecord` with `sequence_number`, `event_type`, `event_payload`, `timestamp`.

## 3. Presence Tracking

Each device joining the channel tracks its presence payload:
```ts
{
  deviceId: string,
  deviceName: string,
  role: 'CONTROLLER' | 'DISPLAY' | 'PARTICIPANT',
  onlineAt: string (ISO-8601)
}
```

The teacher's dashboard displays real-time connection status for each paired device without polling.

## 4. Sequence Gap Detection & Reconnect

If a client detects `receivedSequence > lastSeenSequence + 1`:
1. Client identifies that events were missed during temporary network drops.
2. Client issues a single `GET /api/classroom/sessions/:id/state` request.
3. Server returns full authoritative snapshot (`presentation`, `quiz`, `timer`, `whiteboard`).
4. Client reconciles local UI without blindly replaying invalid historical mutations.
