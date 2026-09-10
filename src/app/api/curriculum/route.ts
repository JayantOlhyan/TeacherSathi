import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { curriculumRepository } from '@/lib/repositories/curriculum';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'grades' | 'subjects' | 'books' | 'chapters' | 'concepts'
    const gradeId = searchParams.get('gradeId');
    const bookId = searchParams.get('bookId');
    const chapterId = searchParams.get('chapterId');

    if (type === 'subjects') {
      const subjects = await curriculumRepository.getSubjects(supabase);
      return NextResponse.json({ data: subjects });
    }

    if (type === 'books' && gradeId) {
      const books = await curriculumRepository.getBooksByGrade(gradeId, supabase);
      return NextResponse.json({ data: books });
    }

    if (type === 'chapters' && bookId) {
      const chapters = await curriculumRepository.getChaptersByBook(bookId, supabase);
      return NextResponse.json({ data: chapters });
    }

    if (type === 'concepts' && chapterId) {
      const concepts = await curriculumRepository.getConceptsByChapter(chapterId, supabase);
      return NextResponse.json({ data: concepts });
    }

    // Default: return grades
    const grades = await curriculumRepository.getGrades(supabase);
    return NextResponse.json({ data: grades });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
