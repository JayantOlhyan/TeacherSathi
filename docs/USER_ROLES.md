# TeacherSathi — User Roles Specification

> **Status**: Frozen Contract (Phase 0)  
> **Rule**: Explicit boundary definitions for all system actors.

---

## 1. Role Definitions Overview

TeacherSathi defines four discrete user roles:
1. `SUPER_ADMIN` (Platform Owner / Site Administrator)
2. `SCHOOL_ADMIN` (School Principal / Head of Department)
3. `TEACHER` (Classroom Educator)
4. `STUDENT` (Enrolled Learner)

---

## 2. Detailed Role Specifications

### 1. `SUPER_ADMIN`
- **Definition**: Internal platform operator and content manager.
- **Can See**:
  - Global platform analytics across all schools and individual users.
  - Full canonical NCERT curriculum, question banks, and audit logs.
  - All registered users, roles, and status flags.
  - Raw system errors, generation logs, and AI token consumption.
- **Can Create**:
  - Canonical Grades, Subjects, Books, Chapters, and Concepts.
  - Global question bank entries and pre-indexed assessments.
  - Platform announcements and broadcast alerts.
  - Super admin and school admin user accounts.
- **Can Edit**:
  - Any canonical curriculum content and publication statuses (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
  - Any user's roles, active status, or school binding.
  - Global platform copy and support FAQs.
- **Can Delete**:
  - Deprecated questions, syllabus versions, or announcement banners.
  - Suspended accounts (soft delete).
- **Can Assign**:
  - School admin roles and content reviewer permissions.
- **Can Manage**:
  - AI generation configurations, rate limits, and system audit logs.
- **Cannot Access**:
  - Decrypted user passwords (managed exclusively by Supabase Auth).
  - Private classroom session audio streams or personal notes of teachers outside school audits.

---

### 2. `SCHOOL_ADMIN`
- **Definition**: School Principal, Administrator, or Academic Coordinator managing an institutional subscription.
- **Can See**:
  - School roster (all teachers and students associated with their school ID).
  - Aggregate syllabus completion and period logs across all classes.
  - Institutional license status, renewal dates, and billing invoices.
  - Registered classroom smartboard devices (`Board-001`, `Board-002`).
- **Can Create**:
  - Teacher invitations and student roster accounts for their school.
  - School classes, sections, and subject teacher assignments.
  - Registered classroom smart display IDs.
- **Can Edit**:
  - School profile details and contact information.
  - Teacher class assignments and timetable bindings.
- **Can Delete**:
  - Deactivate student or teacher accounts transferred from the institution.
- **Can Assign**:
  - Teachers to specific grades, sections, and subjects.
  - Smartboards to specific room locations.
- **Can Manage**:
  - School billing, invoices, and institutional device settings.
- **Cannot Access**:
  - Canonical NCERT curriculum editing (read-only for all schools).
  - Other schools' rosters, performance data, or administrative logs.
  - Platform-wide `SUPER_ADMIN` panels (`/admin/*`).

---

### 3. `TEACHER`
- **Definition**: Primary classroom educator delivering daily lessons in school.
- **Can See**:
  - Full canonical NCERT curriculum and pre-indexed question bank.
  - Their assigned classes, rosters, and student attendance logs.
  - Their own generated lesson plans, worksheets, and custom quizzes.
  - Diagnostic student quiz performance for their own classes.
- **Can Create**:
  - AI Lesson Plans, Worksheets, MCQ Quizzes, and Test Papers.
  - Class rosters, sections, and student attendance entries.
  - Whiteboard drawings and classroom lecture notes.
  - Homework assignments.
- **Can Edit**:
  - Their own generated drafts, lesson plans, and assignments.
  - Student attendance and manual test scores.
  - Their educator profile (name, school, bio).
- **Can Delete**:
  - Their own drafts, saved custom kits, and obsolete homework items.
- **Can Assign**:
  - Homework and quizzes to students in their enrolled classes.
- **Can Manage**:
  - Live smartboard sessions via `/classroom` and `/auth/qr-confirm`.
  - Attention silence bell and live class timers.
- **Cannot Access**:
  - Canonical syllabus modifications (cannot edit the core NCERT textbook repository).
  - School-wide billing and administrative settings.
  - Other teachers' private classes unless granted co-teaching access.
  - Super admin panels (`/admin/*`).

---

### 4. `STUDENT`
- **Definition**: Student enrolled in Classes 6 to 10 accessing revision and quiz practice.
- **Can See**:
  - Read-only NCERT chapter summaries, explainer videos, and mind maps.
  - Homework and quizzes assigned by their teachers.
  - Their own test attempts, scores, and accuracy metrics.
- **Can Create**:
  - Quiz submissions, test attempts, and homework uploads.
- **Can Edit**:
  - Their own profile details (display name, avatar).
- **Can Delete**:
  - None.
- **Can Assign**:
  - None.
- **Can Manage**:
  - None.
- **Cannot Access**:
  - Teacher answer keys prior to quiz submission.
  - Lesson plan generation tools or administrative features.
  - Other students' marks, personal data, or class attendance registers.
  - Any administrative route (`/admin/*`, `/dashboard/create`).
