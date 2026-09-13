# TeacherSathi — Phase 9: Mobile Architecture Specification

## 1. Executive Summary & Philosophy
TeacherSathi Mobile is the native companion to the TeacherSathi ecosystem, targeting Android (primary tier) and iOS devices. Designed ground-up for the physical reality of Indian classrooms, it handles intermittent or absent internet connectivity, low-cost hardware (e.g. ₹8,000–₹12,000 Android devices with 3–4GB RAM), and shared school devices.

The architecture strictly adheres to three core tenets:
1. **Server Authority**: The mobile client is an edge operator. The cloud backend remains the single authoritative source of truth for grading, deadlines, academic intelligence/mastery computation, and role-based permissions.
2. **Deterministic Offline Durability**: Any student answer or teacher presentation action taken while offline is immediately committed to local SQLite and queued in a transactional outbox before acknowledgment.
3. **No Leaked Secrets or State**: Hardware-backed keychains (`expo-secure-store`) isolate session credentials, and user data is scrubbed upon session termination to safeguard shared classroom tablets.

---

## 2. Platform Architecture & Stack
```text
+--------------------------------------------------------------------------+
|                       TeacherSathi Mobile (React Native 0.74 + Expo 51)  |
|                                                                          |
|  +---------------------------+   +------------------------------------+  |
|  |     Teacher Experience    |   |         Student Experience         |  |
|  | - Smartboard Remote       |   | - Offline Assessment Player        |  |
|  | - NCERT Class Pack Cache  |   | - Learning Progress & Modules      |  |
|  | - Classroom Event CoPilot |   | - Sync & Submission Status         |  |
|  +---------------------------+   +------------------------------------+  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |                        Navigation & Deep Links                     |  |
|  | RootNavigator -> Role Gate -> (TeacherNavigator | StudentNavigator) |  |
|  +--------------------------------------------------------------------+  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |                     Services & Engine Layer                        |  |
|  | - ClassPackService      - AssessmentEngine     - ClassroomService  |  |
|  | - NotificationService   - AuthService          - TelemetryService  |  |
|  +--------------------------------------------------------------------+  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |                 Offline & Synchronization Subsystem                |  |
|  | - NetworkMonitor (Online/Offline/Syncing/Sync_Error)               |  |
|  | - SyncEngine (Exponential Backoff + Jitter + Outbox Processor)     |  |
|  | - ConflictResolver (Deterministic Matrix: Server vs Client)        |  |
|  +--------------------------------------------------------------------+  |
|                                                                          |
|  +-----------------------------------+  +-----------------------------+  |
|  |   Expo SQLite Local Database      |  |   Expo SecureStore Keychain |  |
|  | (Class Packs, Outbox, Answers)    |  | (JWT Tokens, Session Keys)  |  |
|  +-----------------------------------+  +-----------------------------+  |
+--------------------------------------------------------------------------+
                                    |
                            HTTPS / WSS / REST
                                    v
+--------------------------------------------------------------------------+
|                  TeacherSathi Authoritative Cloud Backend                 |
| (Next.js 14 API Routes, Supabase PostgreSQL, RLS, Realtime Classroom)    |
+--------------------------------------------------------------------------+
```

---

## 3. Technology Choices & Justification
- **React Native 0.74 + Expo SDK 51**: Enables rapid cross-platform deployment to Android and iOS while utilizing the modern New Architecture and direct C++ TurboModules.
- **Expo SQLite**: Provides atomic local relational database transactions with standard SQL support, zero-dependency offline persistence, and low memory overhead on Android Go devices.
- **Expo SecureStore**: Hardware-backed keystore (Android KeyStore / iOS Keychain) ensuring that auth tokens cannot be scraped from app sandbox filesystem backups.
- **NetInfo / NetworkMonitor**: Multi-state connectivity observer that detects offline transitions and initiates transactional flushing immediately upon reconnect.
