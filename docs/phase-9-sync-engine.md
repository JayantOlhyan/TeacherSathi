# TeacherSathi — Phase 9: Sync Engine & Transactional Outbox

## 1. Overview
The **TeacherSathi Mobile Sync Engine** is an asynchronous, transactional outbox processor built for intermittent network environments. It guarantees:
- **At-least-once delivery** of student answers and classroom commands.
- **Idempotent processing** on the server using client mutation UUIDs.
- **Exponential backoff with jitter** to protect backend APIs from thundering herd spikes during school connectivity restoration.

---

## 2. Transactional Outbox Lifecycle
```text
[User Action: Answer / Submission / Event]
                    |
                    v
    [Commit to Local SQLite DB & Outbox (PENDING)]
                    |
    +---------------+---------------+
    | Online?                       |
    |                               v (Offline)
    v (Yes)             [Stay PENDING in Outbox]
[Process Outbox Queue]              |
    |                               v (Network Reconnected)
    +-------------------> [Auto-Trigger Sync]
                                    |
                    +---------------+---------------+
                    |                               |
                    v (Success 2xx)                 v (Failure 4xx / 5xx)
             [Mark SYNCED]                   [Calculate Backoff + Jitter]
                    |                               |
          [Purge from Outbox]              [Retry until max 5 attempts]
                                                    |
                                                    v (> 5 attempts)
                                              [Mark FAILED]
```

---

## 3. Backoff Algorithm & Formula
When network errors or 5xx server errors occur, the sync engine computes the retry delay using:
$$\text{Delay}(n) = \min\left(\text{InitialDelay} \times \text{Multiplier}^n + \text{Jitter},\, \text{MaxDelay}\right)$$

Where:
- $\text{InitialDelay} = 2{,}000\,\text{ms}$ (2 seconds)
- $\text{Multiplier} = 2$
- $\text{Jitter} = \text{random}(0,\, 500\,\text{ms})$
- $\text{MaxDelay} = 60{,}000\,\text{ms}$ (1 minute)
- $\text{MaxAttempts} = 5$

---

## 4. Idempotency & Replay Prevention
Every sync payload carries:
1. `Idempotency-Key` header with client UUIDv4 (`client_mutation_id`).
2. Deduplication in local outbox: if the student selects Option A and quickly changes to Option B while offline, the local outbox mutates the pending mutation payload rather than spamming multiple entries.
3. Server verification: if a mutation was already processed, the backend responds with `{ success: true, acknowledged: true }` without re-executing grading or double-counting attempt time.
