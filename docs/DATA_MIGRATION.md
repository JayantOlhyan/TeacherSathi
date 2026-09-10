# TeacherSathi — Data Migration Specification & Report

> **Status**: Verified & Deterministic (Phase 1)  
> **Source File**: `src/lib/data/ncertSyllabus.ts` (773 lines, ~113 KB)  
> **Target Seed File**: `supabase/seed/01_curriculum_seed.sql` (1.1 MB)  
> **Script**: `scripts/seed-curriculum.ts`  

---

## 1. Migration Process Overview

The legacy prototype stored the entire NCERT syllabus inside a large static TypeScript dictionary (`NCERT_SYLLABUS` in `src/lib/data/ncertSyllabus.ts`). Phase 1 engineered an automated, deterministic seeder that converts this static dictionary into normalized relational records:

1. **Grades Extraction**: Generates canonical slugs (`class-6`, `class-7`, `class-8`, `class-9`, `class-10`) with academic year bindings (`2026-27`).
2. **Subjects Normalization**: Maps distinct subjects across all grades, attaching standard subject theme colors, bilingual titles, and icons.
3. **Books Generation**: Creates Grade $\times$ Subject textbook editions (`2026 Edition`).
4. **Chapters Parsing**: Normalizes chapter numbers, English/Hindi titles, chapter descriptions, and YouTube video fallback references.
5. **Concepts Synthesis**: Generates foundational pedagogical concepts per chapter mapped to Bloom's taxonomy levels (`UNDERSTAND`, `APPLY`).
6. **Assessment Questions Bootstrapping**: Generates standard MCQ assessment questions with option sets for question bank readiness.

---

## 2. Curriculum Migration Report

The migration script was executed and validated with the following results:

```text
========================================
CURRICULUM MIGRATION REPORT
========================================
Grades:                5
Subjects:              5 (Mathematics, Science, Hindi, English, Social Science)
Books:                 25
Chapters:              345
Concepts:              690
Assessment Questions:  345
----------------------------------------
Duplicates:            0
Invalid records:       0
Missing relationships: 0
Failed records:        0
========================================
Seed SQL generated successfully at: supabase/seed/01_curriculum_seed.sql
```

---

## 3. Idempotency & Conflict Handling

All SQL statements in `supabase/seed/01_curriculum_seed.sql` are wrapped in a single database transaction (`BEGIN; ... COMMIT;`) and utilize `ON CONFLICT` clauses:

- `grades`: `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name...`
- `subjects`: `ON CONFLICT (id) DO UPDATE SET name_en = EXCLUDED.name_en...`
- `books`: `ON CONFLICT (grade_id, subject_id, academic_year) DO UPDATE SET title = EXCLUDED.title...`
- `chapters`: `ON CONFLICT (book_id, chapter_number) DO UPDATE SET title_en = EXCLUDED.title_en...`
- `question_options`: `ON CONFLICT (question_id, option_key) DO NOTHING...`

This ensures that the seeding process can be run repeatedly against staging or production instances without generating duplicates or corrupting existing relationships.
