# TeacherSathi — Phase 9: Offline Architecture & Storage Policies

## 1. Overview
In rural and semi-urban Indian schools, internet connectivity is characterized by high latency, packet loss, and frequent dropouts ("2G/3G speeds" or zero reception). TeacherSathi is built with an **Offline-First Paradigm** where all core classroom workflows (teaching presentations, taking assessments, marking answers, and smartboard commands) function with 100% reliability offline.

---

## 2. Five Storage Tiers

| Cache Tier | Description | Storage Engine | Eviction / Expiration Policy |
| :--- | :--- | :--- | :--- |
| **PERSISTENT_STATIC** | Canonical NCERT curriculum tree (`Grade` $\to$ `Subject` $\to$ `Book` $\to$ `Chapter` $\to$ `Concept`). | SQLite (`cached_curriculum`) | Immutable; refreshed only on curriculum version increment (TTL: 30 days). |
| **DOWNLOADABLE_BUNDLE** | Complete NCERT Class Packs (Presentations, Mindmaps, Lesson Plans, Formative Quiz). | SQLite (`cached_class_packs`) | User-managed; explicit download/delete. Subject to 200MB sub-budget. |
| **AUTHORIZED_DYNAMIC** | Student enrolled assignments, masked assessment packages, school class roster. | SQLite (`cached_assignments`, `cached_assessments`) | Expired after completion or TTL (14 days). Strict role verification. |
| **TRANSACTIONAL_OUTBOX** | Student answers, sealed assessment submissions, teacher draft revisions, telemetry. | SQLite (`sync_outbox`, `offline_answers`) | Never evicted until acknowledged as `SYNCED` by authoritative server. |
| **NON_CACHEABLE** | Plaintext user passwords, live auth refresh tokens, grading answer keys, school financial data. | Hardware Keychain / Memory Only | Never stored in local SQLite database or filesystem cache. |

---

## 3. Storage Budget & Ceiling Enforcements
To protect budget devices with constrained flash memory:
- **Maximum Total App Storage**: 300 MB
- **Class Packs Partition**: 200 MB
- **Assessments Partition**: 50 MB
- **Temporary Media / Assets**: 50 MB

When device approaches 90% of budget:
1. Temporary media cache is purged automatically.
2. Older completed assessments (>14 days) are purged.
3. Class packs are flagged for manual review via `StorageManagerScreen`.

---

## 4. Shared Device Security & Data Hygiene
Many Indian schools utilize shared classroom tablets rotated across different periods or grades.
- **Biometric / Keychain Pinning**: Auth tokens are held in `expo-secure-store` hardware enclave.
- **Session Termination Purge**: When a user logs out:
  1. `authService.logout()` deletes tokens from SecureStore.
  2. `databaseManager.clearUserDataOnLogout()` clears all recorded `offline_answers`, pending `sync_outbox` items, and private assignment rows.
  3. Class packs (which are public NCERT curriculum) are retained, preventing redundant re-downloads for the next teacher.
