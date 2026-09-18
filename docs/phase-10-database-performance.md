# Phase 10: Database Performance, Indexing Strategy & Scale Audit

## 1. High-Frequency Query Audit

At large institutional scale (10,000 schools, 100,000 teachers, 1,000,000 students, 10M+ assessment attempts, 100M+ events), unindexed queries result in high CPU saturation, connection starvation, and query timeouts.

### Audit Findings & Composite Index Remediation (Migration `20260911000013`)

| Query Pattern / Operation | Target Table | Previous Scan Type | New Composite Index | Expected Latency (10M Rows) |
| :--- | :--- | :--- | :--- | :--- |
| **Autosave Answer Lookup** | `attempt_answers` | Index Scan on `attempt_id` + filter `question_id` | `(attempt_id, question_id)` | $< 5\text{ms}$ |
| **Student Attempt Status** | `assessment_attempts` | Seq Scan / Partial Index Filter | `(student_id, assessment_id, status)` | $< 4\text{ms}$ |
| **Result Lookups by Student** | `assessment_results` | Seq Scan on student filter | `(student_id, assessment_id)` | $< 5\text{ms}$ |
| **School/Grade Subject Mastery** | `student_concept_mastery` | Multi-index bitmap heap scan | `(school_id, subject_id, grade_id)` | $< 15\text{ms}$ |
| **Student Chapter Mastery** | `student_concept_mastery` | Seq Scan on chapter filter | `(student_id, chapter_id)` | $< 6\text{ms}$ |
| **Severity-Sorted Learning Gaps** | `learning_gaps` | Filter + In-memory Sort | `(school_id, severity, status)` | $< 8\text{ms}$ |
| **Classroom Log Replay** | `classroom_events` | Backward index scan on created_at | `(session_id, created_at DESC)` | $< 10\text{ms}$ |
| **Audit Log Compliance Inspection**| `audit_logs` | Table scan on actor filter | `(actor_id, created_at DESC)` | $< 12\text{ms}$ |
| **Job Queue Priority Poller** | `media_jobs` | Seq scan over completed jobs | `(status, created_at ASC)` | $< 3\text{ms}$ |
| **Unread Notification Badge** | `notifications` | Scan on user_id + filter read_at | `(user_id, read_at) WHERE read_at IS NULL` | $< 2\text{ms}$ |

---

## 2. Connection Management & Pooling Configuration

To prevent connection storms and database exhaustion during concurrent school morning hours (e.g. 9:00 AM IST school start across 10,000 schools):

1. **Supabase / PgBouncer Transaction Pooling**:
   - Connection Pool Mode: `transaction` (port `6543`).
   - Default Pool Size: `50` per replica.
   - Max Client Connections: `10,000`.
   - Idle Transaction Timeout: `15s` (`SET idle_in_transaction_session_timeout = '15000'`).
   - Statement Timeout: `10s` (`SET statement_timeout = '10000'`) to prevent rogue runaway analytical queries from locking tables.
2. **Read-Write Splitting**:
   - Primary DB: Mutating transactions (attempts, submissions, grading, pairings, media status).
   - Read Replicas: High-volume read queries (NCERT textbook reading, dashboard reports, district aggregation).

---

## 3. Transactional Boundaries & Atomicity

Operations requiring absolute database atomicity are executed within strict transactional boundaries:

1. **Assessment Submission**:
   - Update `assessment_attempts.status = 'SUBMITTED'`.
   - Calculate total score & persist in `assessment_results`.
   - Update Bayesian mastery scores in `student_concept_mastery`.
   - Insert history audit entry in `concept_mastery_history`.
   - All 4 operations execute in a single ACID transaction block (`BEGIN ... COMMIT`).
2. **Offline Outbox Replay**:
   - Deduplicate mutation ID against `client_mutation_id`.
   - Insert or update answers for that attempt.
   - Acknowledge sync status.

---

## 4. Partitioning Roadmap (Scale > 100M Rows)

When events and attempts cross 100M rows:
1. **`classroom_events` Partitioning**: Range-partitioned by `created_at` monthly (`classroom_events_2026_09`, etc.).
2. **`attempt_answers` Partitioning**: List-partitioned by academic quarter or hash-partitioned across 16 shards by `attempt_id`.
