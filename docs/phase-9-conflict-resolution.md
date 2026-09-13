# TeacherSathi — Phase 9: Conflict Resolution Matrix & Deterministic Rules

## 1. Conflict Philosophy
In a distributed offline mobile application, conflicts arise when:
1. Two edits occur concurrently on different devices.
2. The server finalizes a state (e.g. deadline expires, attempt submitted) while a device was disconnected.
3. Network delays cause commands to arrive out of sequence.

TeacherSathi implements a **Deterministic Conflict Resolution Matrix** with zero arbitrary merging.

---

## 2. Deterministic Conflict Resolution Matrix

| Entity Type | Conflict Scenario | Resolution Rule | Action Taken | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Student Answer** | Attempt is active; client submits answer while server has older/null answer. | `CLIENT_WINS` | Update server answer with client payload. | Active test autosave; student's latest offline input is the intended answer. |
| **Student Answer** | Attempt has already been finalized or evaluated on server (`is_submitted: true`). | `SERVER_WINS` | Reject client answer mutation. | Anti-cheating & deadline integrity: no answers accepted after submission window closes. |
| **Teacher Draft** | Base version matches server version (`v_local == v_server`). | `CLIENT_WINS` | Fast-forward save draft, increment version. | Linear revision path without concurrent collisions. |
| **Teacher Draft** | Server draft version is strictly ahead (`v_server > v_local`). | `FORK_LOCAL_COPY` | Preserve local draft as a private copy, pull latest server version. | Prevents silent overwrite of a colleague's edits while preserving local teacher work. |
| **Published Resource** | Client attempts to edit or overwrite a published NCERT resource directly. | `REJECT_MUTATION` | Hard error returned to client. | Published educational content is immutable; a new version or draft fork must be initiated. |
| **Classroom Event** | Client event sequence $\le$ server event sequence. | `SERVER_WINS` | Drop duplicate or stale event. | Strict monotonic sequencing of live smartboard state. |
| **Classroom Event** | Client event sequence $>$ server event sequence. | `CLIENT_WINS` | Apply event to smartboard display. | Valid next command (e.g. `NEXT_SLIDE`). |
