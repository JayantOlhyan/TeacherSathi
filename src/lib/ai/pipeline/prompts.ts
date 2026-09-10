import type { GenerationRequest, ProductType } from '../types';

export function buildSystemPrompt(productType: ProductType, language: string = 'en'): string {
  const languageInstructions: Record<string, string> = {
    en: 'Respond in professional, grammatically clear Indian English aligned with NCERT standards.',
    hi: 'Respond purely in standard Hindi using clear Devanagari script (e.g., विज्ञान, प्रकाश, विद्युत).',
    bilingual:
      'Respond in natural bilingual Hinglish/Hindi-English: keep core scientific/mathematical technical terms in English (e.g., Photosynthesis, Resistor, Ohm\'s Law) with natural explanations in Hindi (Devanagari script) and English summaries.',
  };

  const baseInstruction = `You are TeacherSathi AI, the Lead Educational Content Architect and Master Indian Pedagogy Expert.
Your purpose is to produce world-class, curriculum-aligned, classroom-ready teaching materials for Indian educators following CBSE and NCERT guidelines.
${languageInstructions[language] || languageInstructions.en}

CRITICAL RULES:
1. Return ONLY a single, valid JSON object strictly conforming to the requested schema.
2. Do NOT output markdown code blocks, backticks (\`\`\`json), or conversational preamble before or after the JSON.
3. Content must be pedagogically rigorous, free of hallucinations, and strictly within the provided curriculum context.
4. Ensure all arithmetic (e.g. durations, marks, counts) is 100% mathematically exact.`;

  return baseInstruction;
}

export function buildPromptForProduct(req: GenerationRequest): { systemPrompt: string; userPrompt: string } {
  const { product_type, curriculum, language = 'en', difficulty = 'MEDIUM', teacher_instructions, quantity } = req;
  const systemPrompt = buildSystemPrompt(product_type, language);

  const contextStr = `
CANONICAL CURRICULUM CONTEXT:
- Grade: ${curriculum.grade_name}
- Subject: ${curriculum.subject_name_en} (${curriculum.subject_name_hi})
- Book: ${curriculum.book_title || 'NCERT Core'}
- Chapter ${curriculum.chapter_number}: ${curriculum.chapter_title_en} (${curriculum.chapter_title_hi})
${curriculum.chapter_description_en ? `- Chapter Overview: ${curriculum.chapter_description_en}` : ''}
${
  curriculum.concepts && curriculum.concepts.length > 0
    ? `- Key Concepts to Target:\n${curriculum.concepts.map((c) => `  * ${c.name_en} (${c.bloom_level}): ${c.learning_outcomes.join(', ')}`).join('\n')}`
    : ''
}
Target Difficulty: ${difficulty}
Language Mode: ${language}
${teacher_instructions ? `Teacher Custom Notes: "${teacher_instructions}"` : ''}
`;

  let productInstructions = '';

  switch (product_type) {
    case 'lesson-plan': {
      const duration = req.duration_mins || 45;
      productInstructions = `
Generate a comprehensive, structured lesson plan for a ${duration}-minute classroom period.
Ensure the sum of 'duration_mins' in introduction, teaching_steps, and activities aligns with ${duration} mins.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapter": string,
  "duration_mins": ${duration},
  "learning_objectives": string[], (at least 2 actionable objectives)
  "materials": string[],
  "prior_knowledge": string,
  "introduction": {
    "duration_mins": 5,
    "hook": string,
    "real_world_application": string
  },
  "teaching_steps": [
    {
      "step_number": number,
      "title": string,
      "duration_mins": number,
      "teacher_actions": string,
      "student_actions": string
    }
  ],
  "activities": [
    {
      "title": string,
      "duration_mins": number,
      "description": string,
      "grouping": "individual" | "pairs" | "groups"
    }
  ],
  "assessment": {
    "formative_checks": string[],
    "exit_ticket": string
  },
  "differentiation": {
    "support_for_struggling": string,
    "extension_for_advanced": string
  },
  "homework": string,
  "teacher_notes": string
}`;
      break;
    }

    case 'worksheet': {
      const qCount = quantity || 4;
      const totalMarks = req.total_marks || 10;
      productInstructions = `
Generate a structured classroom worksheet containing at least ${qCount} questions totaling ${totalMarks} marks.
Ensure the sum of 'marks' in 'questions' EXACTLY equals ${totalMarks}.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapter": string,
  "difficulty": "${difficulty}",
  "total_marks": ${totalMarks},
  "instructions": string[],
  "questions": [
    {
      "question_number": number,
      "question_type": "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER" | "APPLICATION" | "HOTS" | "CASE_BASED" | "ASSERTION_REASON",
      "marks": number,
      "text_en": string,
      "text_hi": string,
      "model_answer_en": string,
      "model_answer_hi": string,
      "options": [ (optional, include if MCQ, exactly 4 items)
        { "key": "A" | "B" | "C" | "D", "text_en": string, "text_hi": string }
      ]
    }
  ],
  "answer_key": {
    "Q1": string,
    "Q2": string
  }
}`;
      break;
    }

    case 'quiz': {
      const qCount = quantity || 4;
      productInstructions = `
Generate a structured interactive multiple-choice quiz with ${qCount} questions.
Each question MUST have exactly 4 options (A, B, C, D) with exactly one having is_correct: true, and correct_option_id matching that option.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapter": string,
  "questions": [
    {
      "id": string,
      "question": string,
      "options": [
        { "id": "A", "text": string, "is_correct": boolean },
        { "id": "B", "text": string, "is_correct": boolean },
        { "id": "C", "text": string, "is_correct": boolean },
        { "id": "D", "text": string, "is_correct": boolean }
      ],
      "correct_option_id": "A" | "B" | "C" | "D",
      "explanation": string,
      "difficulty": "Easy" | "Medium" | "Hard",
      "concept": string
    }
  ]
}`;
      break;
    }

    case 'test-paper': {
      const totalMarks = req.total_marks || 20;
      productInstructions = `
Generate a formal CBSE-aligned examination test paper with structured sections totaling ${totalMarks} marks.
Ensure the sum of marks of all questions in all sections equals 'total_marks'.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapters": ["${curriculum.chapter_title_en}"],
  "duration_mins": 45,
  "total_marks": ${totalMarks},
  "general_instructions": string[],
  "sections": [
    {
      "section_name": "Section A" | "Section B" | "Section C" | "Section D",
      "section_title": string,
      "marks_per_question": number,
      "questions": [
        {
          "question_number": number,
          "text_en": string,
          "text_hi": string,
          "marks": number,
          "question_type": string,
          "bloom_level": string,
          "model_answer": string,
          "marking_scheme": string[]
        }
      ]
    }
  ]
}`;
      break;
    }

    case 'presentation': {
      const slideCount = req.slide_count || 4;
      productInstructions = `
Generate a classroom slide deck for 75" Smartboard display containing ${slideCount} slides.
CRITICAL PEDAGOGY RULE: Smartboard slides must be high visual clarity. Limit bullet_points to under 50 words per slide.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapter": string,
  "slide_count": ${slideCount},
  "slides": [
    {
      "slide_number": number,
      "title": string,
      "subtitle": string,
      "bullet_points": string[], (max 4 bullets, concise)
      "teacher_tip": string,
      "visual_prompt": string,
      "reflection_pause": string
    }
  ]
}`;
      break;
    }

    case 'mind-map': {
      productInstructions = `
Generate a hierarchical, connected concept mind map for the chapter.
Ensure that every edge connects valid node IDs present in 'nodes' or 'central_node'.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapter": string,
  "central_node": {
    "id": "root",
    "label": string
  },
  "nodes": [
    {
      "id": string,
      "label": string,
      "category": "Core" | "Subconcept" | "Application" | "Term",
      "description": string
    }
  ],
  "edges": [
    {
      "from": string,
      "to": string,
      "relationship": string
    }
  ]
}`;
      break;
    }

    case 'teaching-activity': {
      productInstructions = `
Generate an engaging, hands-on classroom teaching activity or laboratory demonstration.

Required JSON Schema:
{
  "title": string,
  "grade": string,
  "subject": string,
  "chapter": string,
  "duration_mins": 20,
  "learning_outcome": string,
  "materials_needed": string[],
  "setup": string,
  "step_by_step_procedure": [
    {
      "step_number": number,
      "action": string,
      "teacher_prompt": string
    }
  ],
  "reflection_questions": string[],
  "safety_guidelines": string
}`;
      break;
    }

    case 'saathi-genie': {
      productInstructions = `
You are Saathi Genie, the instant in-class co-pilot for Indian school teachers.
Provide a quick, practical, highly actionable teaching suggestion or answer tailored strictly to the lesson context.

Required JSON Schema:
{
  "pedagogical_answer": string,
  "actionable_steps": string[],
  "curriculum_reference": {
    "grade": "${curriculum.grade_name}",
    "subject": "${curriculum.subject_name_en}",
    "chapter": "${curriculum.chapter_title_en}"
  },
  "quick_followups": string[]
}`;
      break;
    }
  }

  const userPrompt = `${contextStr}\n${productInstructions}`;

  return { systemPrompt, userPrompt };
}
