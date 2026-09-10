import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { QuestionCreateSchema, QuestionUpdateSchema } from '../validations';

export interface QuestionOptionRecord {
  id: string;
  question_id: string;
  option_key: 'A' | 'B' | 'C' | 'D';
  text_en: string;
  text_hi: string;
  is_correct: boolean;
}

export interface QuestionRecord {
  id: string;
  chapter_id: string;
  concept_id: string | null;
  section_tier: 'SECTION_A' | 'SECTION_B' | 'SECTION_C';
  question_type: string;
  marks: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  bloom_level: string;
  text_en: string;
  text_hi: string;
  model_answer_en: string;
  model_answer_hi: string;
  explanation_en: string | null;
  explanation_hi: string | null;
  source: string;
  tags: string[];
  is_verified: boolean;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  is_archived: boolean;
  options?: QuestionOptionRecord[];
  created_at: string;
  updated_at: string;
}

export const questionsRepository = {
  async getQuestionsByChapter(
    chapterId: string,
    sectionTier?: 'SECTION_A' | 'SECTION_B' | 'SECTION_C',
    client: SupabaseClient = defaultClient
  ): Promise<QuestionRecord[]> {
    let query = client
      .from('questions')
      .select('*, options:question_options(*)')
      .eq('chapter_id', chapterId)
      .eq('status', 'PUBLISHED')
      .eq('is_archived', false);

    if (sectionTier) {
      query = query.eq('section_tier', sectionTier);
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    return (data || []) as QuestionRecord[];
  },

  async getQuestionById(id: string, client: SupabaseClient = defaultClient): Promise<QuestionRecord | null> {
    const { data, error } = await client
      .from('questions')
      .select('*, options:question_options(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch question: ${error.message}`);
    }

    return data as QuestionRecord;
  },

  async createQuestion(
    questionData: unknown,
    client: SupabaseClient = defaultClient
  ): Promise<QuestionRecord> {
    const validated = QuestionCreateSchema.parse(questionData);
    const { options, ...questionFields } = validated;

    const { data: newQuestion, error: qError } = await client
      .from('questions')
      .insert([questionFields])
      .select()
      .single();

    if (qError || !newQuestion) {
      throw new Error(`Failed to create question: ${qError?.message}`);
    }

    if (options && options.length > 0) {
      const optionRows = options.map((opt) => ({
        question_id: newQuestion.id,
        option_key: opt.option_key,
        text_en: opt.text_en,
        text_hi: opt.text_hi,
        is_correct: opt.is_correct,
      }));

      const { error: optError } = await client.from('question_options').insert(optionRows);
      if (optError) {
        console.warn(`Failed to insert question options: ${optError.message}`);
      }
    }

    return newQuestion as QuestionRecord;
  },

  async updateQuestion(
    id: string,
    updates: unknown,
    changedByUserId?: string,
    changeSummary: string = 'Updated question content',
    client: SupabaseClient = defaultClient
  ): Promise<QuestionRecord> {
    const validated = QuestionUpdateSchema.parse(updates);

    // 1. Fetch current snapshot for version audit
    const current = await this.getQuestionById(id, client);
    if (current) {
      // Get highest version number
      const { count } = await client
        .from('question_versions')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', id);

      const nextVersion = (count || 0) + 1;

      await client.from('question_versions').insert([
        {
          question_id: id,
          version_number: nextVersion,
          changed_by: changedByUserId || null,
          change_summary: changeSummary,
          data_snapshot: current,
        },
      ]);
    }

    const questionFields = { ...validated };
    delete questionFields.options;

    const { data: updated, error } = await client
      .from('questions')
      .update({
        ...questionFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update question: ${error.message}`);
    }

    return updated as QuestionRecord;
  },

  async archiveQuestion(id: string, client: SupabaseClient = defaultClient): Promise<void> {
    const { error } = await client
      .from('questions')
      .update({ is_archived: true, status: 'ARCHIVED', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to archive question: ${error.message}`);
    }
  },
};
