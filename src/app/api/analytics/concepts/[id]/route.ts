import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conceptId = params.id;

    // Fetch concept with chapter & questions
    const { data: concept, error: cError } = await supabase
      .from('concepts')
      .select(`
        id,
        name_en,
        name_hi,
        bloom_level,
        learning_outcomes,
        chapter_id,
        chapter:chapters(id, title_en, title_hi)
      `)
      .eq('id', conceptId)
      .single();

    if (cError || !concept) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }

    // Fetch questions mapped to this concept
    const { data: questions } = await supabase
      .from('questions')
      .select('id, marks, difficulty, bloom_level, text_en')
      .eq('concept_id', conceptId);

    const questionIds = (questions || []).map((q) => q.id);

    // Fetch metrics for these questions
    const { data: metrics } = await supabase
      .from('question_metrics')
      .select('*')
      .in('question_id', questionIds);

    const metricsMap = new Map();
    (metrics || []).forEach((m) => metricsMap.set(m.question_id, m));

    const questionsWithMetrics = (questions || []).map((q) => ({
      ...q,
      metrics: metricsMap.get(q.id) || {
        attempt_count: 0,
        correct_count: 0,
        accuracy_rate: 0,
        observed_difficulty: 'INSUFFICIENT_DATA',
      },
    }));

    return NextResponse.json({
      data: {
        concept,
        questions: questionsWithMetrics,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
