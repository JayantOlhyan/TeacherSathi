# TeacherSathi — Classroom Recovery & Fault Tolerance (Phase 3)

## 1. Network Disconnect & Reconnect Flow

Classrooms in Indian schools frequently experience intermittent Wi-Fi drops. TeacherSathi provides state recovery:

```text
Smartboard Display Connected
      │
      ▼ (Wi-Fi Drops)
Realtime WebSocket Disconnected
      │
      ├── UI displays amber warning banner: "Classroom connection lost. Reconnecting..."
      ├── Device remains in paired state locally (device credentials preserved)
      │
      ▼ (Wi-Fi Restored / Browser 'online' event fires)
Realtime WebSocket Reconnected
      │
      ▼ Fetch Authoritative State
GET /api/classroom/sessions/:id/state
      │
      ├── Server reads session, active resource, latest slide, timer, and whiteboard lock
      ├── Server returns AuthoritativeClassroomState snapshot
      │
      ▼ UI Reconciles Directly to Authoritative State
Display updates seamlessly: "Connected" 🟢
```

## 2. Sequence Gap Detection

Clients track the latest processed sequence number:
```ts
if (event.sequence_number > lastSeenSequence + 1 && lastSeenSequence > 0) {
  // Gap detected! Events were lost in transit.
  await fetchAuthoritativeState();
}
```
This guarantees that clients never execute out-of-order mutations or display stale presentations.

## 3. Browser Refresh Recovery

- **Teacher Page Refresh**: Dashboard queries active session state and restores session header and remote controls immediately.
- **Smartboard Refresh**: Smartboard passes `?sessionId=<id>` in URL, reconnects to Supabase Realtime channel, requests authoritative state, and resumes full-screen presentation without forcing a new pairing handshake.
