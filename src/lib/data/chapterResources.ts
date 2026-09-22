import { getChapterDetails } from "./chapters";
import type { StoredResourceItem } from "../services/recentResources";

export type TeachingIntent = "PREPARE" | "TEACH" | "PRACTICE" | "ASSESS";

export interface IntentCategoryMeta {
  intent: TeachingIntent;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  tagline: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export const INTENT_CATEGORIES: Record<TeachingIntent, IntentCategoryMeta> = {
  PREPARE: {
    intent: "PREPARE",
    title: "Prepare",
    titleHi: "तैयारी",
    description: "Lesson plans, teacher notes, curriculum maps & concept breakdowns",
    descriptionHi: "पाठ योजनाएँ, शिक्षक नोट्स, पाठ्यक्रम मानचित्र एवं अवधारणा विवरण",
    tagline: "Structure your teaching before entering class",
    accentColor: "emerald",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
  },
  TEACH: {
    intent: "TEACH",
    title: "Teach",
    titleHi: "अध्यापन",
    description: "75\" Smartboard presentations, classroom activities, diagrams & videos",
    descriptionHi: "75\" स्मार्टबोर्ड प्रस्तुतियाँ, कक्षा गतिविधियाँ, आरेख एवं वीडियो",
    tagline: "Live classroom delivery and engagement tools",
    accentColor: "blue",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
  },
  PRACTICE: {
    intent: "PRACTICE",
    title: "Practice",
    titleHi: "अभ्यास",
    description: "Worksheets, practice questions, bilingual homework & NCERT solutions",
    descriptionHi: "कार्यपत्रक, अभ्यास प्रश्न, द्विभाषी गृहकार्य एवं एनसीईआरटी समाधान",
    tagline: "Reinforce understanding and homework practice",
    accentColor: "purple",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-800",
  },
  ASSESS: {
    intent: "ASSESS",
    title: "Assess",
    titleHi: "मूल्यांकन",
    description: "Formative clicker quizzes, summative test papers & exit tickets",
    descriptionHi: "रचनात्मक क्लिकर क्विज़, योगात्मक प्रश्न पत्र एवं निकास टिकट",
    tagline: "Evaluate mastery and identify student learning gaps",
    accentColor: "amber",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
  },
};

export interface ChapterResourceDetail extends StoredResourceItem {
  verified: boolean;
  contentOverview?: string[];
  learningObjectives?: string[];
  recommendedFor?: string[];
  slides?: Array<{
    title: string;
    subtitle?: string;
    bullets?: string[];
    body?: string;
    diagram?: string;
  }>;
  questions?: Array<{
    question: string;
    options?: string[];
    answer?: string;
    type: "MCQ" | "SHORT" | "LONG";
  }>;
  activitySteps?: Array<{
    phase: string;
    duration: string;
    instruction: string;
    studentAction: string;
  }>;
}

/**
 * Returns canonical resources tailored to a specific Grade, Subject, and Chapter.
 */
export function getChapterResources(
  grade: string,
  subject: string,
  chapter: string
): ChapterResourceDetail[] {
  const details = getChapterDetails(grade, subject, chapter);
  const chNum = parseInt(chapter.replace(/\D/g, ""), 10) || 1;
  const cleanGrade = grade.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const cleanSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
  const chapterTitle = details.title;

  const returnUrl = `/content/${grade}/${subject}/${chapter}`;
  const classroomTeachUrl = `/classroom?grade=${grade}&subject=${subject}&chapter=${chapter}&title=${encodeURIComponent(
    chapterTitle
  )}&returnUrl=${encodeURIComponent(returnUrl)}`;

  return [
    // 1. TEACH: Complete Lesson Slides (Smartboard Deck)
    {
      id: `res-${grade}-${subject}-${chapter}-slides`,
      title: `${chapterTitle} — Complete Slides`,
      description: `Complete 75" high-contrast presentation deck covering ${chapterTitle} with structured conceptual diagrams, bilingual terms, and classroom checkpoints.`,
      intent: "TEACH",
      type: "LESSON_SLIDES",
      typeLabel: "Lesson Slides",
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSubject,
      chapter,
      chapterName: chapterTitle,
      duration: "~30 min",
      itemCount: "12 slides",
      verified: true,
      teachUrl: classroomTeachUrl,
      previewUrl: `/dashboard/resources/res-${grade}-${subject}-${chapter}-slides`,
      learningObjectives: [
        `Understand foundational principles of ${chapterTitle}`,
        "Analyze core scientific or mathematical models through visual diagrams",
        "Connect textbook concepts with daily Indian classroom examples",
      ],
      recommendedFor: [
        "Classroom smartboard teaching",
        "Concept introduction and visual explanation",
        "Whole-class check for understanding",
      ],
      slides: [
        {
          title: chapterTitle,
          subtitle: `NCERT ${cleanGrade} ${cleanSubject} · Chapter ${chNum}`,
          bullets: [
            `Chapter Overview and Core Inquiry: ${chapterTitle}`,
            "Key Learning Goals for Today's Period",
            "Real-world Context and Historical Indian Foundations",
          ],
        },
        {
          title: "Foundational Concepts & Principles",
          subtitle: "Core curriculum definitions and mechanisms",
          bullets: [
            "Essential scientific principles and terminologies",
            "Key differences and structural characteristics",
            "Step-by-step process breakdown with diagrammatic alignment",
          ],
        },
        {
          title: "Classroom Discussion Checkpoint",
          subtitle: "Think-Pair-Share active discussion",
          bullets: [
            "What happens if one variable in this process is altered?",
            "Discuss with your bench partner for 2 minutes",
            "Identify 2 examples observed in your local environment",
          ],
        },
        {
          title: "Summary & Lesson Mastery Takeaway",
          subtitle: "Consolidation of today's learning objectives",
          bullets: [
            "Core concept recall: definitions and formulas",
            "Homework and self-study questions for practice",
            "Preview of next period's extension topic",
          ],
        },
      ],
    },

    // 2. PRACTICE: Chapter Worksheet
    {
      id: `res-${grade}-${subject}-${chapter}-worksheet`,
      title: `${chapterTitle} — Student Worksheet`,
      description: `Bilingual printable worksheet with tiered questions (recall, conceptual, and application) aligned to NCERT exam patterns.`,
      intent: "PRACTICE",
      type: "WORKSHEET",
      typeLabel: "Worksheet",
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSubject,
      chapter,
      chapterName: chapterTitle,
      duration: "~20 min",
      itemCount: "10 questions",
      verified: true,
      teachUrl: `/dashboard/create?type=worksheet&grade=${grade}&subject=${subject}&chapter=${chapter}`,
      previewUrl: `/dashboard/resources/res-${grade}-${subject}-${chapter}-worksheet`,
      learningObjectives: [
        "Self-paced reinforcement of textbook exercises",
        "Practice with structured CBSE/State Board format questions",
        "Bilingual Hindi/English vocabulary reinforcement",
      ],
      recommendedFor: [
        "Independent bench practice",
        "Homework assignment",
        "Remediation for struggling students",
      ],
      questions: [
        {
          question: `Define the primary scientific concept underlying ${chapterTitle}.`,
          type: "SHORT",
          answer: "Comprehensive answer based on NCERT textbook definitions.",
        },
        {
          question: `Differentiate between the key processes discussed in Section 1 and Section 2 of ${chapterTitle}.`,
          type: "LONG",
          answer: "Detailed comparative table with examples.",
        },
        {
          question: `Give two practical real-life examples of this phenomenon in agriculture or daily life.`,
          type: "SHORT",
        },
      ],
    },

    // 3. ASSESS: Quick Check Quiz
    {
      id: `res-${grade}-${subject}-${chapter}-quiz`,
      title: `${chapterTitle} — Formative MCQ Quiz`,
      description: `Rapid 10-question clicker and paper quiz designed to measure student concept mastery and diagnostic misconception flags.`,
      intent: "ASSESS",
      type: "QUIZ",
      typeLabel: "Quiz",
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSubject,
      chapter,
      chapterName: chapterTitle,
      duration: "~15 min",
      itemCount: "10 questions",
      verified: true,
      teachUrl: `/dashboard/assessments/create?type=MCQ_QUIZ&grade=${grade}&subject=${subject}&chapter=${chapter}`,
      previewUrl: `/dashboard/resources/res-${grade}-${subject}-${chapter}-quiz`,
      learningObjectives: [
        "Identify common misconceptions before summative testing",
        "Instant clicker feedback on student understanding",
        "Targeted formative evaluation in the last 15 minutes of class",
      ],
      recommendedFor: [
        "End-of-period exit evaluation",
        "Student clicker polling",
        "Weekly diagnostic test",
      ],
      questions: [
        {
          question: `Which of the following statements is TRUE regarding ${chapterTitle}?`,
          type: "MCQ",
          options: [
            "Option A: Correct NCERT scientific principle",
            "Option B: Common student misconception",
            "Option C: Irrelevant distractor",
            "Option D: Incomplete statement",
          ],
          answer: "Option A: Correct NCERT scientific principle",
        },
        {
          question: `What is the primary factor that regulates the process discussed in Chapter ${chNum}?`,
          type: "MCQ",
          options: ["Factor 1", "Factor 2", "Factor 3", "All of the above"],
          answer: "All of the above",
        },
      ],
    },

    // 4. TEACH: Classroom Activity (Think-Pair-Share / Inquiry)
    {
      id: `res-${grade}-${subject}-${chapter}-activity`,
      title: `${chapterTitle} — Classroom Activity`,
      description: `Structured 25-minute group learning activity utilizing Think-Pair-Share pedagogy to engage every student in active reasoning.`,
      intent: "TEACH",
      type: "ACTIVITY",
      typeLabel: "Activity",
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSubject,
      chapter,
      chapterName: chapterTitle,
      duration: "~25 min",
      itemCount: "Group activity",
      verified: true,
      teachUrl: `/dashboard/create?type=teaching-activity&grade=${grade}&subject=${subject}&chapter=${chapter}`,
      previewUrl: `/dashboard/resources/res-${grade}-${subject}-${chapter}-activity`,
      learningObjectives: [
        "Foster peer collaboration and student-led dialogue",
        "Apply theoretical concepts to hands-on classroom problem solving",
      ],
      recommendedFor: [
        "Interactive group work",
        "Peer-to-peer discussion",
        "Deep conceptual reinforcement",
      ],
      activitySteps: [
        {
          phase: "Think (Individual reflection)",
          duration: "5 min",
          instruction: "Pose the central inquiry question on the smartboard.",
          studentAction: "Students reflect quietly and write down their initial hypothesis.",
        },
        {
          phase: "Pair (Partner exchange)",
          duration: "10 min",
          instruction: "Instruct students to compare reasoning with their bench partner.",
          studentAction: "Discuss agreements, debate discrepancies, and formulate a joint response.",
        },
        {
          phase: "Share (Whole-class plenary)",
          duration: "10 min",
          instruction: "Call on diverse pairs to share insights and summarize on the whiteboard.",
          studentAction: "Present synthesis to peers and resolve lingering questions.",
        },
      ],
    },

    // 5. TEACH: Explanatory Concept Video
    {
      id: `res-${grade}-${subject}-${chapter}-video`,
      title: `Explaining ${chapterTitle} — Concept Video`,
      description: `Short bilingual animated explainer breaking down difficult mechanisms with high visual clarity.`,
      intent: "TEACH",
      type: "VIDEO",
      typeLabel: "Video",
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSubject,
      chapter,
      chapterName: chapterTitle,
      duration: "~8 min",
      itemCount: "HD Video",
      verified: true,
      teachUrl: `/content/${grade}/${subject}/${chapter}/video`,
      previewUrl: `/dashboard/resources/res-${grade}-${subject}-${chapter}-video`,
      recommendedFor: [
        "Smartboard video playback",
        "Visual concept introduction",
        "Bilingual recap",
      ],
    },

    // 6. PREPARE: Key Concepts & Teacher Notes
    {
      id: `res-${grade}-${subject}-${chapter}-notes`,
      title: `${chapterTitle} — Key Concepts & Teaching Notes`,
      description: `Pedagogical briefing document highlighting common student stumbling blocks, suggested pacing, and board questions.`,
      intent: "PREPARE",
      type: "TEACHER_NOTES",
      typeLabel: "Teacher Notes",
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSubject,
      chapter,
      chapterName: chapterTitle,
      duration: "4 pages",
      itemCount: "Full Guide",
      verified: true,
      teachUrl: `/dashboard/create?type=lesson-plan&grade=${grade}&subject=${subject}&chapter=${chapter}`,
      previewUrl: `/dashboard/resources/res-${grade}-${subject}-${chapter}-notes`,
      learningObjectives: [
        "Anticipate student misconceptions before class begins",
        "Access structured timeline and period-by-period pacing roadmap",
      ],
      recommendedFor: [
        "Teacher pre-class preparation",
        "Departmental lesson synchronization",
      ],
    },
  ];
}
