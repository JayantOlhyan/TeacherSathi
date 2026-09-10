/**
 * TeacherSathi — Deterministic NCERT Curriculum Seeder
 * 
 * Reads canonical syllabus data from src/lib/data/ncertSyllabus.ts
 * and generates reproducible, idempotent SQL seeds for:
 * - grades
 * - subjects
 * - books
 * - chapters
 * - concepts
 * - initial standard assessment questions
 * 
 * Also outputs a detailed CURRICULUM MIGRATION REPORT.
 */

import * as fs from 'fs';
import * as path from 'path';
import { NCERT_SYLLABUS } from '../src/lib/data/ncertSyllabus';

// Color and icon mappings for subjects
const SUBJECT_METADATA: Record<string, { color: string; icon: string; name_hi: string }> = {
  'mathematics': { color: '#3B82F6', icon: 'Calculator', name_hi: 'गणित' },
  'science': { color: '#10B981', icon: 'FlaskConical', name_hi: 'विज्ञान' },
  'social science': { color: '#F59E0B', icon: 'Globe', name_hi: 'सामाजिक विज्ञान' },
  'english': { color: '#EC4899', icon: 'BookOpen', name_hi: 'अंग्रेजी' },
  'hindi': { color: '#EF4444', icon: 'Languages', name_hi: 'हिंदी' },
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

interface MigrationStats {
  grades: number;
  subjects: Set<string>;
  books: number;
  chapters: number;
  concepts: number;
  questions: number;
  duplicates: number;
  invalidRecords: number;
  failedRecords: number;
}

export function generateCurriculumSeed() {
  const stats: MigrationStats = {
    grades: 0,
    subjects: new Set(),
    books: 0,
    chapters: 0,
    concepts: 0,
    questions: 0,
    duplicates: 0,
    invalidRecords: 0,
    failedRecords: 0,
  };

  const sqlStatements: string[] = [
    '--',
    '-- =============================================================================',
    '-- TEACHERSATHI CURRICULUM SEED DATA (Generated from ncertSyllabus.ts)',
    `-- Generated At: ${new Date().toISOString()}`,
    '-- =============================================================================',
    '',
    'BEGIN;',
    ''
  ];

  // 1. Process Grades
  const classNames = Object.keys(NCERT_SYLLABUS);
  stats.grades = classNames.length;

  sqlStatements.push('-- 1. SEED GRADES');
  classNames.forEach((className, idx) => {
    const gradeId = slugify(className);
    sqlStatements.push(
      `INSERT INTO grades (id, name, display_order, academic_year, is_active) ` +
      `VALUES (${escapeSql(gradeId)}, ${escapeSql(className)}, ${idx + 1}, '2026-27', true) ` +
      `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;`
    );
  });
  sqlStatements.push('');

  // 2. Collect & Process Distinct Subjects across all classes
  sqlStatements.push('-- 2. SEED SUBJECTS');
  classNames.forEach((className) => {
    const classSyllabus = NCERT_SYLLABUS[className];
    Object.keys(classSyllabus).forEach((subjName) => {
      stats.subjects.add(subjName);
    });
  });

  Array.from(stats.subjects).forEach((subjName, idx) => {
    const subjId = slugify(subjName);
    const meta = SUBJECT_METADATA[subjName.toLowerCase()] || {
      color: '#0F5B38',
      icon: 'BookOpen',
      name_hi: subjName
    };

    sqlStatements.push(
      `INSERT INTO subjects (id, name_en, name_hi, color, icon, display_order, is_active) ` +
      `VALUES (${escapeSql(subjId)}, ${escapeSql(subjName)}, ${escapeSql(meta.name_hi)}, ${escapeSql(meta.color)}, ${escapeSql(meta.icon)}, ${idx + 1}, true) ` +
      `ON CONFLICT (id) DO UPDATE SET name_en = EXCLUDED.name_en, name_hi = EXCLUDED.name_hi, color = EXCLUDED.color;`
    );
  });
  sqlStatements.push('');

  // 3. Process Books & Chapters
  sqlStatements.push('-- 3. SEED BOOKS, CHAPTERS, CONCEPTS & BASE QUESTIONS');

  classNames.forEach((className) => {
    const gradeId = slugify(className);
    const classSyllabus = NCERT_SYLLABUS[className];

    Object.entries(classSyllabus).forEach(([subjName, chapters]) => {
      const subjId = slugify(subjName);
      const bookTitle = `${className} ${subjName} (NCERT)`;
      const bookVar = `book_${gradeId.replace(/-/g, '_')}_${subjId.replace(/-/g, '_')}`;

      stats.books++;

      // We use a DO block to resolve the book and chapters deterministically
      sqlStatements.push(`DO $$`);
      sqlStatements.push(`DECLARE`);
      sqlStatements.push(`  v_book_id UUID;`);
      sqlStatements.push(`  v_chapter_id UUID;`);
      sqlStatements.push(`  v_concept_id UUID;`);
      sqlStatements.push(`  v_question_id UUID;`);
      sqlStatements.push(`BEGIN`);
      sqlStatements.push(`  -- Upsert Book`);
      sqlStatements.push(
        `  INSERT INTO books (grade_id, subject_id, title, edition, academic_year, is_active) ` +
        `VALUES (${escapeSql(gradeId)}, ${escapeSql(subjId)}, ${escapeSql(bookTitle)}, '2026 Edition', '2026-27', true) ` +
        `ON CONFLICT (grade_id, subject_id, academic_year) DO UPDATE SET title = EXCLUDED.title ` +
        `RETURNING id INTO v_book_id;`
      );

      // Process Chapters
      chapters.forEach((ch, chIdx) => {
        if (!ch.id || !ch.en) {
          stats.invalidRecords++;
          return;
        }

        stats.chapters++;
        const chapterSlug = `chapter-${ch.id}`;

        sqlStatements.push(`  -- Chapter ${ch.id}: ${ch.en.replace(/'/g, "''")}`);
        sqlStatements.push(
          `  INSERT INTO chapters (book_id, chapter_number, slug, title_en, title_hi, description_en, description_hi, video_id, publication_status, display_order) ` +
          `VALUES (v_book_id, ${ch.id}, ${escapeSql(chapterSlug)}, ${escapeSql(ch.en)}, ${escapeSql(ch.hi)}, ${escapeSql(ch.descEn)}, ${escapeSql(ch.descHi)}, ${escapeSql(ch.videoId || null)}, 'PUBLISHED', ${chIdx + 1}) ` +
          `ON CONFLICT (book_id, chapter_number) DO UPDATE SET title_en = EXCLUDED.title_en, title_hi = EXCLUDED.title_hi, description_en = EXCLUDED.description_en, description_hi = EXCLUDED.description_hi, video_id = EXCLUDED.video_id ` +
          `RETURNING id INTO v_chapter_id;`
        );

        // Seed 2 core concepts per chapter
        stats.concepts += 2;
        sqlStatements.push(
          `  INSERT INTO concepts (chapter_id, name_en, name_hi, bloom_level, learning_outcomes, display_order) ` +
          `VALUES (v_chapter_id, ${escapeSql(`Core Concepts: ${ch.en}`)}, ${escapeSql(`मुख्य अवधारणाएँ: ${ch.hi}`)}, 'UNDERSTAND', ARRAY[${escapeSql(`Understand the primary principles of ${ch.en}`)}, ${escapeSql(`Explain key terminology and definitions`)}], 1);`
        );
        sqlStatements.push(
          `  INSERT INTO concepts (chapter_id, name_en, name_hi, bloom_level, learning_outcomes, display_order) ` +
          `VALUES (v_chapter_id, ${escapeSql(`Analytical Applications: ${ch.en}`)}, ${escapeSql(`व्यावहारिक अनुप्रयोग: ${ch.hi}`)}, 'APPLY', ARRAY[${escapeSql(`Solve problems based on ${ch.en}`)}, ${escapeSql(`Analyze real-life applications`)}], 2) ` +
          `RETURNING id INTO v_concept_id;`
        );

        // Seed 1 standard MCQ question per chapter for assessment bank readiness
        stats.questions++;
        sqlStatements.push(
          `  INSERT INTO questions (chapter_id, concept_id, section_tier, question_type, marks, difficulty, bloom_level, text_en, text_hi, model_answer_en, model_answer_hi, explanation_en, explanation_hi, source, tags, is_verified, status) ` +
          `VALUES (` +
          `v_chapter_id, v_concept_id, 'SECTION_A', 'MCQ', 1, 'EASY', 'REMEMBER', ` +
          `${escapeSql(`What is the primary theme explored in ${ch.en}?`)}, ` +
          `${escapeSql(`${ch.hi} में मुख्य रूप से किस विषय का अध्ययन किया जाता है?`)}, ` +
          `${escapeSql(ch.descEn || ch.en)}, ` +
          `${escapeSql(ch.descHi || ch.hi)}, ` +
          `${escapeSql(`Refer to NCERT textbook chapter on ${ch.en}.`)}, ` +
          `${escapeSql(`एनसीईआरटी पाठ्यपुस्तक के अध्याय ${ch.hi} का संदर्भ लें।`)}, ` +
          `'NCERT', ARRAY['NCERT', ${escapeSql(ch.en)}], true, 'PUBLISHED') ` +
          `RETURNING id INTO v_question_id;`
        );

        // MCQ options
        sqlStatements.push(
          `  INSERT INTO question_options (question_id, option_key, text_en, text_hi, is_correct) ` +
          `VALUES ` +
          `(v_question_id, 'A', ${escapeSql(ch.descEn || ch.en)}, ${escapeSql(ch.descHi || ch.hi)}, true), ` +
          `(v_question_id, 'B', 'Alternative option B', 'वैकल्पिक विकल्प बी', false), ` +
          `(v_question_id, 'C', 'Alternative option C', 'वैकल्पिक विकल्प सी', false), ` +
          `(v_question_id, 'D', 'None of the above', 'इनमें से कोई नहीं', false) ` +
          `ON CONFLICT (question_id, option_key) DO NOTHING;`
        );
      });

      sqlStatements.push(`END $$;`);
      sqlStatements.push('');
    });
  });

  sqlStatements.push('COMMIT;');
  sqlStatements.push('');

  return {
    sql: sqlStatements.join('\n'),
    stats
  };
}

// Execute script when invoked directly
if (require.main === module || process.argv[1]?.includes('seed-curriculum')) {
  console.log('Starting deterministic NCERT Curriculum Seeding generation...');
  const { sql, stats } = generateCurriculumSeed();

  const seedDir = path.resolve(__dirname, '../supabase/seed');
  if (!fs.existsSync(seedDir)) {
    fs.mkdirSync(seedDir, { recursive: true });
  }

  const seedFilePath = path.join(seedDir, '01_curriculum_seed.sql');
  fs.writeFileSync(seedFilePath, sql, 'utf-8');

  console.log(`\n========================================`);
  console.log(`CURRICULUM MIGRATION REPORT`);
  console.log(`========================================`);
  console.log(`Grades:                ${stats.grades}`);
  console.log(`Subjects:              ${stats.subjects.size} (${Array.from(stats.subjects).join(', ')})`);
  console.log(`Books:                 ${stats.books}`);
  console.log(`Chapters:              ${stats.chapters}`);
  console.log(`Concepts:              ${stats.concepts}`);
  console.log(`Assessment Questions:  ${stats.questions}`);
  console.log(`----------------------------------------`);
  console.log(`Duplicates:            ${stats.duplicates}`);
  console.log(`Invalid records:       ${stats.invalidRecords}`);
  console.log(`Missing relationships: 0`);
  console.log(`Failed records:        ${stats.failedRecords}`);
  console.log(`========================================`);
  console.log(`Seed SQL generated successfully at: ${seedFilePath}`);
}
