import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../../supabase/client';
import { NCERT_SYLLABUS } from '../../data/ncertSyllabus';
import type { CurriculumContext } from '../types';

export interface ContextResolutionParams {
  grade?: string;
  grade_id?: string;
  subject?: string;
  subject_id?: string;
  book_id?: string;
  chapter?: string;
  chapter_id?: string;
  chapter_number?: number;
  concept_id?: string;
}

interface DbGrade {
  id: string;
  name: string;
}

interface DbSubject {
  id: string;
  name_en: string;
  name_hi: string;
}

interface DbBook {
  id: string;
  title: string;
  grade_id: string;
  subject_id: string;
  grades: DbGrade | null;
  subjects: DbSubject | null;
}

interface DbConcept {
  id: string;
  name_en: string;
  name_hi: string;
  bloom_level: string;
  learning_outcomes: string[];
}

interface DbQuestion {
  question_en: string;
  question_hi: string | null;
  marks: number;
  question_type: string;
}

interface DbChapterRecord {
  id: string;
  chapter_number: number;
  title_en: string;
  title_hi: string;
  description_en: string | null;
  description_hi: string | null;
  books: DbBook | null;
  concepts: DbConcept[] | null;
}

export async function resolveCurriculumContext(
  params: ContextResolutionParams,
  client: SupabaseClient = defaultClient
): Promise<CurriculumContext> {
  const gradeQuery = (params.grade || params.grade_id || 'Class 10').trim();
  const subjectQuery = (params.subject || params.subject_id || 'Science').trim();
  const chapterQuery = (params.chapter || params.chapter_id || '').trim();

  // Try resolving from Supabase DB first
  try {
    let dbChapter: DbChapterRecord | null = null;

    if (params.chapter_id) {
      const { data } = await client
        .from('chapters')
        .select(`
          id, chapter_number, title_en, title_hi, description_en, description_hi,
          books (
            id, title, grade_id, subject_id,
            grades ( id, name ),
            subjects ( id, name_en, name_hi )
          ),
          concepts ( id, name_en, name_hi, bloom_level, learning_outcomes )
        `)
        .eq('id', params.chapter_id)
        .maybeSingle();
      dbChapter = (data as unknown) as DbChapterRecord | null;
    }

    if (!dbChapter && chapterQuery) {
      const { data } = await client
        .from('chapters')
        .select(`
          id, chapter_number, title_en, title_hi, description_en, description_hi,
          books (
            id, title, grade_id, subject_id,
            grades ( id, name ),
            subjects ( id, name_en, name_hi )
          ),
          concepts ( id, name_en, name_hi, bloom_level, learning_outcomes )
        `)
        .ilike('title_en', `%${chapterQuery}%`)
        .limit(1)
        .maybeSingle();
      dbChapter = (data as unknown) as DbChapterRecord | null;
    }

    if (dbChapter && dbChapter.books) {
      const book = dbChapter.books;
      const grade = book.grades;
      const subject = book.subjects;

      // Fetch sample questions if available
      let sample_questions: Array<{
        text_en: string;
        text_hi: string;
        marks: number;
        question_type: string;
      }> = [];

      try {
        const { data: qData } = await client
          .from('questions')
          .select('question_en, question_hi, marks, question_type')
          .eq('chapter_id', dbChapter.id)
          .limit(3);

        if (qData && qData.length > 0) {
          const typedQuestions = (qData as unknown) as DbQuestion[];
          sample_questions = typedQuestions.map((q) => ({
            text_en: q.question_en,
            text_hi: q.question_hi || q.question_en,
            marks: q.marks || 1,
            question_type: q.question_type || 'MCQ',
          }));
        }
      } catch {
        // Questions lookup optional
      }

      return {
        grade_id: grade?.id || params.grade_id || 'grade-10',
        grade_name: grade?.name || gradeQuery,
        subject_id: subject?.id || params.subject_id || 'subject-science',
        subject_name_en: subject?.name_en || subjectQuery,
        subject_name_hi: subject?.name_hi || subjectQuery,
        book_id: book.id,
        book_title: book.title,
        chapter_id: dbChapter.id,
        chapter_number: dbChapter.chapter_number || params.chapter_number || 1,
        chapter_title_en: dbChapter.title_en,
        chapter_title_hi: dbChapter.title_hi || dbChapter.title_en,
        chapter_description_en: dbChapter.description_en || undefined,
        chapter_description_hi: dbChapter.description_hi || undefined,
        concepts: dbChapter.concepts?.map((c) => ({
          id: c.id,
          name_en: c.name_en,
          name_hi: c.name_hi || c.name_en,
          bloom_level: c.bloom_level,
          learning_outcomes: c.learning_outcomes || [],
        })),
        sample_questions,
      };
    }
  } catch {
    // Database query failed or unavailable, fallback to static NCERT syllabus
  }

  // Authoritative Fallback to Static NCERT Syllabus
  return resolveFromStaticSyllabus(gradeQuery, subjectQuery, chapterQuery);
}

function resolveFromStaticSyllabus(
  gradeQuery: string,
  subjectQuery: string,
  chapterQuery: string
): CurriculumContext {
  // Normalize Grade Key (e.g., "10", "Class 10", "Grade 10")
  const matchedGradeKey =
    Object.keys(NCERT_SYLLABUS).find(
      (k) => k.toLowerCase() === gradeQuery.toLowerCase() || k.replace('Class ', '') === gradeQuery
    ) || 'Class 10';

  const classSyllabus = NCERT_SYLLABUS[matchedGradeKey] || NCERT_SYLLABUS['Class 10'];

  // Normalize Subject Key (e.g., "science", "Science")
  const matchedSubjectKey =
    Object.keys(classSyllabus).find((k) => k.toLowerCase() === subjectQuery.toLowerCase()) ||
    Object.keys(classSyllabus)[0] ||
    'Science';

  const chapters = classSyllabus[matchedSubjectKey] || [];

  // Match Chapter
  let matchedChapter = chapters[0];
  if (chapterQuery) {
    const found = chapters.find(
      (c) =>
        c.en.toLowerCase().includes(chapterQuery.toLowerCase()) ||
        c.hi.toLowerCase().includes(chapterQuery.toLowerCase()) ||
        String(c.id) === chapterQuery
    );
    if (found) {
      matchedChapter = found;
    }
  }

  const subjectNamesHi: Record<string, string> = {
    Mathematics: 'गणित',
    Science: 'विज्ञान',
    'Social Science': 'सामाजिक विज्ञान',
    English: 'अंग्रेजी',
    Hindi: 'हिंदी',
  };

  const subjectNameHi = subjectNamesHi[matchedSubjectKey] || matchedSubjectKey;
  const gradeSlug = matchedGradeKey.toLowerCase().replace(/\s+/g, '-');
  const subjectSlug = matchedSubjectKey.toLowerCase().replace(/\s+/g, '-');
  const chapterId = `ch-${gradeSlug}-${subjectSlug}-${matchedChapter ? matchedChapter.id : 1}`;

  return {
    grade_id: `grade-${gradeSlug}`,
    grade_name: matchedGradeKey,
    subject_id: `subject-${subjectSlug}`,
    subject_name_en: matchedSubjectKey,
    subject_name_hi: subjectNameHi,
    book_id: `book-${gradeSlug}-${subjectSlug}`,
    book_title: `NCERT ${matchedGradeKey} ${matchedSubjectKey}`,
    chapter_id: chapterId,
    chapter_number: matchedChapter ? matchedChapter.id : 1,
    chapter_title_en: matchedChapter ? matchedChapter.en : 'Introduction',
    chapter_title_hi: matchedChapter ? matchedChapter.hi : 'परिचय',
    chapter_description_en: matchedChapter ? matchedChapter.descEn : undefined,
    chapter_description_hi: matchedChapter ? matchedChapter.descHi : undefined,
    concepts: [
      {
        id: `${chapterId}-c1`,
        name_en: `Fundamental principles of ${matchedChapter ? matchedChapter.en : 'Topic'}`,
        name_hi: `${matchedChapter ? matchedChapter.hi : 'विषय'} के मूलभूत सिद्धांत`,
        bloom_level: 'UNDERSTAND',
        learning_outcomes: ['Understand key definitions', 'Identify core components'],
      },
      {
        id: `${chapterId}-c2`,
        name_en: `Applications and Problem Solving in ${matchedChapter ? matchedChapter.en : 'Topic'}`,
        name_hi: `${matchedChapter ? matchedChapter.hi : 'विषय'} के अनुप्रयोग और समस्या समाधान`,
        bloom_level: 'APPLY',
        learning_outcomes: ['Solve numerical and conceptual problems', 'Relate to real life'],
      },
    ],
    sample_questions: [],
  };
}
