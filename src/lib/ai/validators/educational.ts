import type {
  LessonPlan,
  Worksheet,
  Quiz,
  TestPaper,
  Presentation,
  MindMap,
} from '../schemas';

export interface ValidationIssue {
  field: string;
  message: string;
  critical: boolean;
}

export interface ValidationReport {
  is_valid: boolean;
  issues: ValidationIssue[];
}

// Check for Devanagari script (Unicode range: \u0900 - \u097F)
export function containsDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// 1. Validate Lesson Plan
export function validateLessonPlan(plan: LessonPlan): ValidationReport {
  const issues: ValidationIssue[] = [];

  const introMins = plan.introduction.duration_mins;
  const stepsMins = plan.teaching_steps.reduce((acc, step) => acc + step.duration_mins, 0);
  const activitiesMins = plan.activities.reduce((acc, act) => acc + act.duration_mins, 0);
  const computedTotal = introMins + stepsMins + activitiesMins;

  if (Math.abs(computedTotal - plan.duration_mins) > 5) {
    issues.push({
      field: 'duration_mins',
      message: `Lesson plan step timings (${computedTotal} mins) do not align with total allocated duration (${plan.duration_mins} mins).`,
      critical: false,
    });
  }

  if (!plan.assessment.formative_checks || plan.assessment.formative_checks.length === 0) {
    issues.push({
      field: 'assessment.formative_checks',
      message: 'Lesson plan must contain at least one formative check question.',
      critical: true,
    });
  }

  return {
    is_valid: issues.filter(i => i.critical).length === 0,
    issues,
  };
}

// 2. Validate Worksheet
export function validateWorksheet(sheet: Worksheet): ValidationReport {
  const issues: ValidationIssue[] = [];

  const computedMarks = sheet.questions.reduce((acc, q) => acc + q.marks, 0);
  if (computedMarks !== sheet.total_marks) {
    issues.push({
      field: 'total_marks',
      message: `Sum of question marks (${computedMarks}) does not match worksheet total_marks (${sheet.total_marks}).`,
      critical: true,
    });
  }

  // Check MCQ questions have options
  sheet.questions.forEach((q, idx) => {
    if (q.question_type === 'MCQ' && (!q.options || q.options.length < 2)) {
      issues.push({
        field: `questions[${idx}].options`,
        message: `Question #${q.question_number} is of type MCQ but lacks valid option choices.`,
        critical: true,
      });
    }
  });

  return {
    is_valid: issues.filter(i => i.critical).length === 0,
    issues,
  };
}

// 3. Validate Quiz
export function validateQuiz(quiz: Quiz): ValidationReport {
  const issues: ValidationIssue[] = [];

  quiz.questions.forEach((q, idx) => {
    const correctOptions = q.options.filter(o => o.is_correct);
    if (correctOptions.length !== 1) {
      issues.push({
        field: `questions[${idx}].options`,
        message: `Question #${idx + 1} must have exactly one option marked is_correct: true (found ${correctOptions.length}).`,
        critical: true,
      });
    }

    if (correctOptions.length === 1 && correctOptions[0].id !== q.correct_option_id) {
      issues.push({
        field: `questions[${idx}].correct_option_id`,
        message: `Mismatch: correct_option_id is '${q.correct_option_id}' but option '${correctOptions[0].id}' is marked is_correct.`,
        critical: true,
      });
    }

    // Check distinct options
    const optionTexts = q.options.map(o => o.text.trim().toLowerCase());
    const uniqueTexts = new Set(optionTexts);
    if (uniqueTexts.size < q.options.length) {
      issues.push({
        field: `questions[${idx}].options`,
        message: `Question #${idx + 1} contains duplicate option text.`,
        critical: true,
      });
    }
  });

  return {
    is_valid: issues.filter(i => i.critical).length === 0,
    issues,
  };
}

// 4. Validate Test Paper
export function validateTestPaper(test: TestPaper): ValidationReport {
  const issues: ValidationIssue[] = [];

  let totalComputedMarks = 0;
  test.sections.forEach((sec, sIdx) => {
    const sectionMarks = sec.questions.reduce((acc, q) => acc + q.marks, 0);
    totalComputedMarks += sectionMarks;

    sec.questions.forEach((q, qIdx) => {
      if (!q.marking_scheme || q.marking_scheme.length === 0) {
        issues.push({
          field: `sections[${sIdx}].questions[${qIdx}].marking_scheme`,
          message: `Question #${q.question_number} must include marking scheme criteria.`,
          critical: false,
        });
      }
    });
  });

  if (totalComputedMarks !== test.total_marks) {
    issues.push({
      field: 'total_marks',
      message: `Total test marks (${totalComputedMarks}) do not match designated total_marks (${test.total_marks}).`,
      critical: true,
    });
  }

  return {
    is_valid: issues.filter(i => i.critical).length === 0,
    issues,
  };
}

// 5. Validate Presentation (75" Display Constraint: max 40 words per slide)
export function validatePresentation(presentation: Presentation): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (presentation.slides.length !== presentation.slide_count) {
    issues.push({
      field: 'slide_count',
      message: `Slide array length (${presentation.slides.length}) does not match slide_count (${presentation.slide_count}).`,
      critical: true,
    });
  }

  presentation.slides.forEach((slide, idx) => {
    const totalWords = slide.bullet_points.join(' ').split(/\s+/).filter(Boolean).length;
    if (totalWords > 50) {
      issues.push({
        field: `slides[${idx}].bullet_points`,
        message: `Slide #${slide.slide_number} has ${totalWords} words (exceeds 75" kiosk display limit of 50 words).`,
        critical: false, // non-critical warning
      });
    }
  });

  return {
    is_valid: issues.filter(i => i.critical).length === 0,
    issues,
  };
}

// 6. Validate Mind Map
export function validateMindMap(mindMap: MindMap): ValidationReport {
  const issues: ValidationIssue[] = [];
  const nodeIds = new Set(mindMap.nodes.map(n => n.id));
  nodeIds.add(mindMap.central_node.id);

  mindMap.edges.forEach((edge, idx) => {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      issues.push({
        field: `edges[${idx}]`,
        message: `Edge connects non-existent node ('${edge.from}' -> '${edge.to}').`,
        critical: true,
      });
    }
  });

  return {
    is_valid: issues.filter(i => i.critical).length === 0,
    issues,
  };
}
