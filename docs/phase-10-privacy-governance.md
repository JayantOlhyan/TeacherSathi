# Phase 10: Data Privacy Governance & DPDP Act 2023 Compliance

## 1. Complete Institutional Data Inventory

In accordance with the **Digital Personal Data Protection (DPDP) Act 2023** and educational data governance standards, TeacherSathi categorizes all processed educational data:

| Data Class | Owner | Processing Purpose | Storage Tier | Access Control | Retention Rule | Exportability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Student Profiles** | Student / School | Enrollment, attendance, and roster management. | PostgreSQL (`profiles`, `class_students`) | Student self, assigned Teacher, School Admin. | Academic lifecycle + 5 years. | Yes (Student/Parent request) |
| **Teacher Profiles** | Teacher / School | Staff authentication and instructional management. | PostgreSQL (`profiles`, `school_members`) | Teacher self, School Admin, District Admin. | Active employment + 7 years. | Yes (Teacher request) |
| **Assessment Attempts** | School / Student | Academic evaluation and grading records. | PostgreSQL (`assessment_attempts`, `attempt_answers`) | Student self, evaluating Teacher, School Admin. | Permanent academic record (no arbitrary deletion). | Yes (Official Transcript) |
| **Concept Mastery** | School / District | Pedagogical gap tracking and learning analytics. | PostgreSQL (`student_concept_mastery`, `concept_mastery_history`) | Assigned Teacher, School Admin, Aggregated District Admin. | Academic lifecycle + 3 years. | Yes (Academic Progress Report) |
| **AI Usage Records** | Platform / School | Cost budgeting and prompt quality audits. | PostgreSQL (`ai_usage_logs`) + Telemetry | Platform Operators, School Admin. | 12 months rolling purge. | Aggregated Summary Only |
| **Audit Logs** | Platform / Institution | Legal compliance, fraud prevention, security audits. | PostgreSQL (`audit_logs`, `operator_audit_logs`) | Super Admins, Security Compliance Officers. | 3 years immutable append-only. | Yes (Compliance Export) |
| **Mobile Device Sync** | Mobile User | Push notifications and offline synchronization state. | PostgreSQL (`mobile_devices`, `notifications`) | Authenticated device owner. | Purged upon device unregister or 180 days inactive. | Device metadata only |

---

## 2. Minor Protection & Parental Safeguards

1. **Purpose Limitation**: Student educational data is used exclusively to facilitate personalized teaching, mastery evaluation, and intervention. It is never sold, shared with advertising brokers, or used for behavioral ad targeting.
2. **Authoritative Records Protection**: Students are prohibited from deleting authoritative academic assessment attempts or changing finalized marks through client requests.
3. **Controlled Data Deactivation & Anonymization**: When a student graduates or transfers, their identifying personal data (name, phone, parent contact) can be de-identified and anonymized while preserving statistical academic aggregations for institutional cohort analysis.
