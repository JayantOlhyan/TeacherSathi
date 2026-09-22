import { SaathiContext } from './saathiContext';

export interface SaathiStructuredResponse {
  answer: string;
  whyThisHelps: string;
  tryThis?: string;
  observedData?: {
    totalStudents: number;
    incorrectCount: number;
    incorrectPercentage: number;
    keyMisconception: string;
  };
  suggestedIntervention?: string;
  actions: Array<'use' | 'edit' | 'save' | 'translate' | 'try_another'>;
  curriculumReference?: string;
  isDraft: boolean;
  language: 'en' | 'hi' | 'bilingual';
}

/**
 * Detects if a prompt string is in Hindi or Hinglish
 */
export function isHindiOrHinglish(text: string): boolean {
  // Check for Devanagari script range
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) return true;

  // Common Hinglish keywords
  const hinglishKeywords = [
    'samjhao', 'kare', 'kaise', 'batao', 'hindi mein', 'kya hai',
    'banao', 'isko', 'isse', 'baccho', 'kaksha', 'karo'
  ];
  const lower = text.toLowerCase();
  return hinglishKeywords.some((kw) => lower.includes(kw));
}

/**
 * Main Saathi query executor. Calls `/api/ai/genie` with context,
 * falling back to curated pedagogical templates when offline or testing.
 */
export async function querySaathi(
  prompt: string,
  context: SaathiContext
): Promise<SaathiStructuredResponse> {
  const isHindiQuery = isHindiOrHinglish(prompt);
  const language = isHindiQuery ? 'hi' : (context.language || 'en');

  // If in analytics learning-gap mode, format specifically with observed vs suggested distinction
  if (context.screen === 'analytics' && context.learningGapId && context.observedData) {
    const obs = context.observedData;
    return {
      answer: `Observed data indicates ${obs.incorrectCount} of ${obs.totalStudents} students (${obs.incorrectPercentage}%) struggle with ${context.conceptName || 'this concept'}.`,
      whyThisHelps: 'Addressing this specific cognitive hurdle prevents downstream deficits in higher-order application topics.',
      tryThis: `Consider a 10-minute remediation session focusing on ${obs.keyMisconception}. Use tactile or visual analogies before re-testing.`,
      observedData: obs,
      suggestedIntervention: `Run a short visual comparison activity comparing ${context.conceptName} with everyday examples. Follow up with a 5-question formative diagnostic check.`,
      actions: ['use', 'edit', 'save', 'try_another'],
      curriculumReference: `${context.gradeName || 'Class 8'} • ${context.subjectName || 'Science'} • ${context.chapterTitle || 'Chapter'}`,
      isDraft: true,
      language: 'en',
    };
  }

  try {
    const res = await fetch('/api/ai/genie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        grade: context.gradeName || context.grade || 'Class 8',
        subject: context.subjectName || context.subject || 'Science',
        chapter: context.chapterTitle || context.chapter || 'Science Chapter',
        language: isHindiQuery ? 'hi' : 'en',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        answer: data.answer || 'Here is the pedagogical explanation prepared for your lesson.',
        whyThisHelps: 'Uses direct language and an age-appropriate cognitive anchor suitable for the curriculum.',
        tryThis: data.actionable_steps?.[0] || 'Ask students to pair up for 2 minutes and summarize this concept in their own words.',
        actions: ['use', 'edit', 'save', 'try_another'],
        curriculumReference: `${context.gradeName || 'Class 8'} • ${context.subjectName || 'Science'} • ${context.chapterTitle || 'Chapter'}`,
        isDraft: true,
        language,
      };
    }
  } catch {
    // Handled by contextual fallback below
  }

  // Graceful offline fallback with rich NCERT contextual answers
  return generateContextualFallback(prompt, context, isHindiQuery);
}

function generateContextualFallback(
  prompt: string,
  context: SaathiContext,
  isHindi: boolean
): SaathiStructuredResponse {
  const topic = context.conceptName || context.slideTitle || context.chapterTitle || 'this topic';

  if (isHindi) {
    return {
      answer: `सरल भाषा में व्याख्या: "${topic}" वह प्रक्रिया है जिसके द्वारा छात्र बुनियादी वैज्ञानिक नियमों को अपने दैनिक जीवन के अनुभवों से जोड़ सकते हैं।`,
      whyThisHelps: 'मातृभाषा और सरल उदाहरणों का उपयोग बच्चों में सीखने की झिझक कम करता है और संप्रत्यय की गहरी समझ बनाता है।',
      tryThis: `छात्रों से कहें: "क्या आपने अपने घर या गांव में ऐसा देखा है? अपने शब्दों में 1 मिनट में बताएं।"`,
      actions: ['use', 'edit', 'save', 'try_another'],
      curriculumReference: `${context.gradeName || 'Class 8'} • ${context.subjectName || 'Science'}`,
      isDraft: true,
      language: 'hi',
    };
  }

  if (prompt.toLowerCase().includes('example') || prompt.toLowerCase().includes('analogy')) {
    return {
      answer: `Real-Life Analogy for ${topic}: Think of this process like water traveling through a sponge or domestic water filter: selective absorption ensures only vital elements pass through while residues are retained.`,
      whyThisHelps: 'Concrete physical models build an intuitive bridge before students tackle abstract textbook definitions.',
      tryThis: `Ask the front row: "If you pour muddy water through a cloth vs fine sand, what happens? How does that mirror this concept?"`,
      actions: ['use', 'edit', 'save', 'try_another'],
      curriculumReference: `${context.gradeName || 'Class 8'} • ${context.subjectName || 'Science'}`,
      isDraft: true,
      language: 'en',
    };
  }

  if (prompt.toLowerCase().includes('activity') || prompt.toLowerCase().includes('5-min')) {
    return {
      answer: `5-Minute Classroom Think-Pair-Share: Give students 60 seconds of silent thinking on ${topic}, 2 minutes to compare ideas with a bench partner, and 2 minutes for 2 pairs to share aloud with the room.`,
      whyThisHelps: 'Engages 100% of students simultaneously rather than only calling on high-performing hand-raisers.',
      tryThis: `Prompt for students: "Write down 1 thing you learned and 1 question you still have about ${topic}."`,
      actions: ['use', 'edit', 'save', 'try_another'],
      curriculumReference: `${context.gradeName || 'Class 8'} • ${context.subjectName || 'Science'}`,
      isDraft: true,
      language: 'en',
    };
  }

  return {
    answer: `Concise Explanation of ${topic}: Break down the core mechanism into two sequential phases: first, the initial trigger; second, the observed outcome in nature or the experiment.`,
    whyThisHelps: 'Reduces working-memory load by presenting a structured step-by-step causal chain.',
    tryThis: `Say: "Notice how step 1 directly causes step 2. Who can tell me what happens if we skip step 1?"`,
    actions: ['use', 'edit', 'save', 'try_another'],
    curriculumReference: `${context.gradeName || 'Class 8'} • ${context.subjectName || 'Science'}`,
    isDraft: true,
    language: 'en',
  };
}
