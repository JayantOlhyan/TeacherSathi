# TeacherSathi — Classroom Security & Access Control (Phase 3)

## 1. Privileged Control Plane Invariant

The classroom session is treated as a privileged control plane. No client-supplied claims (`role`, `teacherId`, `deviceId`, `sessionId`) are blindly trusted. Every command route executes server-side validation.

## 2. Threat Mitigations (Section 25)

| Threat | Attack Scenario | Mitigation |
|---|---|---|
| **Cross-Session Attack** | Device in Session A attempts to dispatch commands to Session B | Server verifies `session_id` on both device record and session entity; mismatched commands return HTTP 403. |
| **Cross-School Attack** | User in School A attempts to read/control School B sessions | RLS policies enforce `school_id` membership and `teacher_id = auth.uid()`. |
| **Student Privilege Escalation** | Student device attempts to dispatch `NEXT_SLIDE` or `END_SESSION` | Commands require teacher ownership or `CONTROLLER` role. Student devices join as `PARTICIPANT` and are rejected if sending control events. |
| **Replay & Token Reuse** | Attacker captures previously displayed QR code from big screen | Ephemeral pairing tokens are single-use (`used_at IS NULL`) and expire after 5 minutes. |
| **Duplicate Command Execution** | Network glitch causes rapid multi-clicks on `NEXT_SLIDE` or `START_QUIZ` | Idempotency keys (`idempotency_key TEXT UNIQUE`) cache the initial event result and return the existing record without duplicate execution. |
| **Revoked Device Access** | A smartboard or student device is removed from class by teacher | `classroomRepository.revokeDevice` marks status `REVOKED`. The event pipeline checks device status and immediately halts command processing. |
| **Terminal Session Tampering** | Attacker attempts to resume an `ENDED` class | State machine forbids transitions out of `ENDED`. Commands against ended sessions return HTTP 403. |
