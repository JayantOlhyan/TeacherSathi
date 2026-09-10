# TeacherSathi — Classroom Architecture (Phase 3)

## 1. System Overview

TeacherSathi Phase 3 transitions the live smart classroom system from simulated `localStorage` polling to an authoritative, real-time distributed classroom co-pilot.

```text
Teacher Device (Laptop / Mobile)
   │
   │ Authenticated API requests (HTTPS)
   ▼
TeacherSathi Control Plane (Next.js App Router / Edge API)
   │
   ├── Database Persistence: Supabase PostgreSQL
   │   ├── classroom_sessions
   │   ├── classroom_session_devices
   │   ├── classroom_events (Authoritative monotonically sequenced log)
   │   └── classroom_pairings (SHA-256 hashed ephemeral credentials)
   │
   └── Event Distribution: Supabase Realtime Channels
          │
          │ WebSockets (Broadcast & Presence)
          ▼
Classroom Display & Participant Nodes
   ├── 75" Smartboard IFP Kiosk (Display Mode)
   ├── Teacher Mobile Controller (Remote Control)
   └── Student Clickers / Observers (Participant Mode)
```

## 2. Core Entities & Hierarchy

The canonical entity hierarchy:

```text
School
 └── Teacher
      └── Class
           └── Classroom Session
                ├── Devices (classroom_session_devices)
                ├── Events (classroom_events)
                ├── Active Resource (resources)
                └── Pairing Tokens (classroom_pairings)
```

1. **Classroom Session**: One live teaching period. Holds state (`WAITING`, `PAIRING`, `ACTIVE`, `PAUSED`, `ENDED`), active curriculum chapter, and active resource.
2. **Classroom Session Devices**: Multi-device membership registry. Tracks device type (`TEACHER`, `SMARTBOARD`, `STUDENT`, `OBSERVER`), role (`CONTROLLER`, `DISPLAY`, `PARTICIPANT`), and status (`CONNECTED`, `DISCONNECTED`, `REVOKED`).
3. **Classroom Events**: The authoritative, append-only, sequence-numbered event stream. Every action that affects classroom state is validated and assigned a strictly increasing integer sequence number.
4. **Classroom Pairings**: Ephemeral, single-use, 5-minute cryptographic tokens enabling zero-password pairing of 75" smartboards.

## 3. Distributed Roles & Responsibilities

- **Teacher Device (Controller)**: Authenticates via Supabase Auth session JWT. Issues control commands (`START_PRESENTATION`, `NEXT_SLIDE`, `START_QUIZ`, `START_TIMER`, `LOCK_BOARD`, `END_SESSION`).
- **Smartboard (Display)**: Pairs via single-use QR token. Subscribes to Supabase Realtime channel `classroom:session:<id>`. Displays high-contrast 16:9 curriculum slides, quizzes, timers, and digital whiteboard.
- **Server Control Plane**: Enforces RLS, validates command payloads with Zod schemas, ensures idempotency deduplication, assigns monotonic sequence numbers, writes to PostgreSQL, and broadcasts via Supabase Realtime.
