export type ProductType =
  | 'lesson-plan'
  | 'worksheet'
  | 'quiz'
  | 'test-paper'
  | 'presentation'
  | 'mind-map'
  | 'teaching-activity'
  | 'saathi-genie';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type LanguageMode = 'en' | 'hi' | 'bilingual';

export interface CurriculumContext {
  grade_id: string;
  grade_name: string;
  subject_id: string;
  subject_name_en: string;
  subject_name_hi: string;
  book_id?: string;
  book_title?: string;
  chapter_id: string;
  chapter_number: number;
  chapter_title_en: string;
  chapter_title_hi: string;
  chapter_description_en?: string;
  chapter_description_hi?: string;
  concepts?: Array<{
    id: string;
    name_en: string;
    name_hi: string;
    bloom_level: string;
    learning_outcomes: string[];
  }>;
  sample_questions?: Array<{
    text_en: string;
    text_hi: string;
    marks: number;
    question_type: string;
  }>;
}

export interface GenerationRequest {
  product_type: ProductType;
  curriculum: CurriculumContext;
  difficulty?: DifficultyLevel;
  language?: LanguageMode;
  teacher_instructions?: string;
  quantity?: number;
  duration_mins?: number;
  total_marks?: number;
  slide_count?: number;
  idempotency_key?: string;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface GenerationResult<T> {
  data: T;
  raw_text: string;
  provider: string;
  model: string;
  latency_ms: number;
  token_usage: TokenUsage;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  readonly name: string;
  readonly model: string;

  generateStructured<T>(
    prompt: string,
    systemPrompt?: string,
    timeoutMs?: number
  ): Promise<GenerationResult<T>>;

  generateChat(
    messages: ChatMessage[],
    systemPrompt?: string,
    timeoutMs?: number
  ): Promise<{ content: string; token_usage: TokenUsage; latency_ms: number }>;
}
