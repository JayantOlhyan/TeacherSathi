import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { curriculumRepository } from '@/lib/repositories/curriculum';

export async function GET(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chapterId = params.chapterId;
    const chapter = await curriculumRepository.getChapterById(chapterId, supabase);

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Fetch resources associated with this chapter
    const [resourcesRes, questionsRes] = await Promise.all([
      supabase
        .from('resources')
        .select('*')
        .eq('chapter_id', chapterId)
        .in('status', ['READY', 'PUBLISHED'])
        .limit(20),
      supabase
        .from('questions')
        .select('id, concept_id, type, difficulty, marks, question_en, question_hi, options, model_answer_en, model_answer_hi')
        .eq('chapter_id', chapterId)
        .limit(30),
    ]);

    const resources = resourcesRes.data || [];
    const questions = questionsRes.data || [];

    // Categorize resources
    const presentation = resources.find((r) => r.type === 'PRESENTATION') || null;
    const mindmap = resources.find((r) => r.type === 'MIND_MAP') || null;
    const activities = resources.filter((r) => r.type === 'ACTIVITY');
    const lessonPlans = resources.filter((r) => r.type === 'LESSON_PLAN');

    const rawPayload = JSON.stringify({
      chapterId: chapter.id,
      title: chapter.title_en,
      concepts: chapter.concepts || [],
      presentation,
      mindmap,
      activities,
      lessonPlans,
      questions,
    });

    const checksum = crypto.createHash('sha256').update(rawPayload).digest('hex');

    const classPack = {
      packId: `pack-${chapter.id}`,
      chapterId: chapter.id,
      titleEn: chapter.title_en,
      titleHi: chapter.title_hi || chapter.title_en,
      chapterNumber: chapter.chapter_number,
      bookId: chapter.book_id,
      curriculum: {
        concepts: chapter.concepts || [],
      },
      content: {
        presentation,
        mindmap,
        activities,
        lessonPlans,
      },
      quiz: {
        questions,
      },
      metadata: {
        packagedAt: new Date().toISOString(),
        checksum,
        estimatedSizeBytes: Buffer.byteLength(rawPayload, 'utf-8'),
        version: 1,
      },
    };

    return NextResponse.json({
      success: true,
      data: classPack,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
