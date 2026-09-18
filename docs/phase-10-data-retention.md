# Phase 10: Data Retention, Archival & Controlled Deletion Policy

## 1. Data Retention Matrix

TeacherSathi distinguishes strictly between **authoritative academic records** (which must be preserved permanently) and **ephemeral operational records** (which are purged automatically):

| Category | Table / Entity | Retention Period | Automatic Action | Legal / Business Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Academic Records** | `assessments`, `assignments` | Indefinite / Active | None (Archived flag available) | Required for institutional curriculum continuity. |
| **Student Grading** | `assessment_attempts`, `assessment_results` | Indefinite / Permanent | None (Immutable) | Official student academic records; cannot be destroyed. |
| **Concept Mastery** | `concept_mastery_history` | 5 Academic Years | Compressed to cold storage after 3 yrs | Longitudinal learning progress and board preparation. |
| **Audit Logs** | `audit_logs`, `operator_audit_logs` | 3 Years | Archived to cold storage | Statutory compliance, forensic security audits. |
| **Ephemeral Pairings** | `classroom_pairings` | 15 Minutes | Automatic purge trigger upon expiry | Single-use QR pairing tokens are useless after session start. |
| **Realtime Events** | `classroom_events` | 90 Days | Archived to parquet/cold storage | Presentation session replay and sync verification. |
| **Media Jobs** | `media_jobs` | 30 Days (Completed) | Purged by daily maintenance job | Temporary processing pipeline ledger. |
| **Dead-Letter Queue** | `job_dead_letters` | 60 Days (Purged status) | Purged automatically | Record of dismissed permanent failures. |
| **Notifications** | `notifications` | 180 Days | Soft-deleted / purged | Ephemeral mobile push announcements. |
| **Inactive Devices** | `mobile_devices` | 180 Days (Inactive) | Marked inactive, tokens revoked | Stale push tokens fail APNs/FCM delivery. |

---

## 2. Controlled User Deletion & Export Workflow

1. **Student Deletion Safeguard**:
   - A student requesting account closure cannot delete attempts or results directly.
   - The profile status is changed to `INACTIVE`.
   - Contact identifiers (email, phone) are scrubbed with `anonymize_student_record(user_id)`.
   - The attempt answers and mastery metrics are retained with an anonymized reference for institutional cohort reporting.
2. **Right to Portability / Data Export**:
   - Students and teachers can trigger a self-service machine-readable export (`GET /api/profile/export`) returning:
     - Profile details
     - Enrolled classes
     - Completed attempts and score transcripts
     - Created resources (for teachers)
   - Dispatched securely in JSON/CSV format signed with temporary download links.
