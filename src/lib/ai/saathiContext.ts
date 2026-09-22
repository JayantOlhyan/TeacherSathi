export interface SaathiContext {
  grade?: string;
  gradeName?: string;
  subject?: string;
  subjectName?: string;
  chapter?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  resourceId?: string;
  resourceTitle?: string;
  resourceType?: string;
  slideIndex?: number;
  slideTitle?: string;
  learningGapId?: string;
  conceptName?: string;
  observedData?: {
    totalStudents: number;
    incorrectCount: number;
    incorrectPercentage: number;
    keyMisconception: string;
  };
  screen?: 'workspace' | 'creation' | 'classroom' | 'analytics' | 'assessment';
  language?: 'en' | 'hi' | 'bilingual';
}

export interface ContextBadgeItem {
  id: string;
  label: string;
  type: 'grade' | 'subject' | 'chapter' | 'slide' | 'concept' | 'gap';
}

/**
 * Resolves hierarchical context badges for the UI.
 * Order: Class -> Subject -> Chapter -> Resource/Slide/Gap
 */
export function resolveContextBadges(ctx: SaathiContext): ContextBadgeItem[] {
  const badges: ContextBadgeItem[] = [];

  const gradeLabel = ctx.gradeName || (ctx.grade ? ctx.grade.replace('class-', 'Class ') : 'Class 8');
  badges.push({ id: 'grade', label: gradeLabel, type: 'grade' });

  const subjectLabel = ctx.subjectName || (ctx.subject ? ctx.subject.charAt(0).toUpperCase() + ctx.subject.slice(1) : 'Science');
  badges.push({ id: 'subject', label: subjectLabel, type: 'subject' });

  if (ctx.chapterTitle) {
    const chNum = ctx.chapterNumber ? `Ch ${ctx.chapterNumber}` : (ctx.chapter ? ctx.chapter.replace('chapter-', 'Ch ') : 'Chapter');
    badges.push({ id: 'chapter', label: `${chNum}`, type: 'chapter' });
  }

  if (typeof ctx.slideIndex === 'number' && ctx.slideTitle) {
    badges.push({ id: 'slide', label: `Slide ${ctx.slideIndex + 1} - ${ctx.slideTitle}`, type: 'slide' });
  } else if (ctx.learningGapId && ctx.conceptName) {
    badges.push({ id: 'gap', label: `Learning Gap - ${ctx.conceptName}`, type: 'gap' });
  } else if (ctx.conceptName) {
    badges.push({ id: 'concept', label: ctx.conceptName, type: 'concept' });
  }

  return badges;
}

/**
 * Returns contextual quick-prompt suggestions based on current screen & context.
 */
export function getContextualPrompts(ctx: SaathiContext): string[] {
  const topic = ctx.conceptName || ctx.slideTitle || ctx.chapterTitle;

  switch (ctx.screen) {
    case 'classroom':
      return [
        topic ? `Explain "${topic}" in simple words` : 'Explain this in simple words',
        'Give an everyday village analogy',
        'Suggest a quick check question for the class',
        'इसे simple Hindi में समझाओ',
        'Suggest a 2-minute whiteboard sketch',
      ];
    case 'analytics':
      return [
        topic ? `Suggest a 10-minute micro-lesson intervention for ${topic}` : 'Suggest a 10-minute micro-lesson intervention',
        'Diagnose the core student misconception',
        'Generate 5 follow-up check questions',
        'Suggest an everyday demonstration to clarify this concept',
      ];
    case 'creation':
      return [
        topic ? `Create a 10-question formative quiz on ${topic}` : 'Create a 10-question formative quiz',
        'Design a 5-minute hands-on activity',
        'Generate a tiered practice worksheet',
        'Draft a 30-minute structured lesson plan',
      ];
    case 'assessment':
      return [
        'Suggest 5 conceptual questions',
        'Add an everyday application question',
        'Align with Bloom’s taxonomy',
        'Provide a bilingual marking scheme',
      ];
    case 'workspace':
    default:
      return [
        topic ? `Explain ${topic} in simple terms` : 'Explain the key concepts',
        'Give me an everyday village example',
        'Draft a 5-minute student activity',
        'Create 3 quick check questions',
        'Make a 30-minute lesson plan',
        'Translate this lesson to Hindi',
      ];
  }
}
