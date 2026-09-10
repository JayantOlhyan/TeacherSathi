import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';

export interface GradeRecord {
  id: string;
  name: string;
  display_order: number;
  academic_year: string;
  is_active: boolean;
}

export interface SubjectRecord {
  id: string;
  name_en: string;
  name_hi: string;
  color: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface BookRecord {
  id: string;
  grade_id: string;
  subject_id: string;
  title: string;
  edition: string;
  academic_year: string;
  pdf_url: string | null;
  is_active: boolean;
}

export interface ChapterRecord {
  id: string;
  book_id: string;
  chapter_number: number;
  slug: string;
  title_en: string;
  title_hi: string;
  description_en: string | null;
  description_hi: string | null;
  study_time: string;
  video_id: string | null;
  publication_status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  display_order: number;
  is_locked: boolean;
}

export interface ConceptRecord {
  id: string;
  chapter_id: string;
  name_en: string;
  name_hi: string;
  bloom_level: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  learning_outcomes: string[];
  display_order: number;
}

export const curriculumRepository = {
  async getGrades(client: SupabaseClient = defaultClient): Promise<GradeRecord[]> {
    try {
      const { data, error } = await client
        .from('grades')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as GradeRecord[];
      }
    } catch {
      // Graceful fallback to static data
    }

    // Static fallback
    return Object.keys(NCERT_SYLLABUS).map((cls, idx) => ({
      id: cls.toLowerCase().replace(/\s+/g, '-'),
      name: cls,
      display_order: idx + 1,
      academic_year: '2026-27',
      is_active: true
    }));
  },

  async getSubjects(client: SupabaseClient = defaultClient): Promise<SubjectRecord[]> {
    try {
      const { data, error } = await client
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as SubjectRecord[];
      }
    } catch {
      // Graceful fallback
    }

    return [
      { id: 'mathematics', name_en: 'Mathematics', name_hi: 'गणित', color: '#3B82F6', icon: 'Calculator', display_order: 1, is_active: true },
      { id: 'science', name_en: 'Science', name_hi: 'विज्ञान', color: '#10B981', icon: 'FlaskConical', display_order: 2, is_active: true },
      { id: 'social-science', name_en: 'Social Science', name_hi: 'सामाजिक विज्ञान', color: '#F59E0B', icon: 'Globe', display_order: 3, is_active: true },
      { id: 'english', name_en: 'English', name_hi: 'अंग्रेजी', color: '#EC4899', icon: 'BookOpen', display_order: 4, is_active: true },
      { id: 'hindi', name_en: 'Hindi', name_hi: 'हिंदी', color: '#EF4444', icon: 'Languages', display_order: 5, is_active: true },
    ];
  },

  async getBooksByGrade(gradeId: string, client: SupabaseClient = defaultClient): Promise<BookRecord[]> {
    try {
      const { data, error } = await client
        .from('books')
        .select('*')
        .eq('grade_id', gradeId)
        .eq('is_active', true);

      if (!error && data) return data as BookRecord[];
    } catch {
      // Fallback
    }

    return [];
  },

  async getChaptersByBook(bookId: string, client: SupabaseClient = defaultClient): Promise<ChapterRecord[]> {
    try {
      const { data, error } = await client
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .eq('publication_status', 'PUBLISHED')
        .order('chapter_number', { ascending: true });

      if (!error && data) return data as ChapterRecord[];
    } catch {
      // Fallback
    }

    return [];
  },

  async getConceptsByChapter(chapterId: string, client: SupabaseClient = defaultClient): Promise<ConceptRecord[]> {
    try {
      const { data, error } = await client
        .from('concepts')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('display_order', { ascending: true });

      if (!error && data) return data as ConceptRecord[];
    } catch {
      // Fallback
    }

    return [];
  }
};
