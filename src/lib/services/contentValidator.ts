import {
  ResourceType,
  ValidationReport,
  ContentValidationError,
  PresentationContent,
  MindMapContent,
  TeachingActivityContent,
} from '@/lib/validations/resources';

export const contentValidator = {
  /**
   * Validates educational content deterministically based on resource type.
   */
  validateContent(
    resourceType: ResourceType,
    content: Record<string, unknown>,
    language: string = 'en'
  ): ValidationReport {
    const errors: ContentValidationError[] = [];
    const warnings: ContentValidationError[] = [];

    switch (resourceType) {
      case 'PRESENTATION':
        this.validatePresentation(content as unknown as PresentationContent, language, errors, warnings);
        break;
      case 'MIND_MAP':
        this.validateMindMap(content as unknown as MindMapContent, errors, warnings);
        break;
      case 'TEACHING_ACTIVITY':
        this.validateTeachingActivity(content as unknown as TeachingActivityContent, errors, warnings);
        break;
      default:
        // Generic content check
        if (!content || Object.keys(content).length === 0) {
          warnings.push({
            rule: 'EMPTY_CONTENT',
            message: 'Resource content payload is empty.',
            severity: 'WARNING',
          });
        }
    }

    // Calculate score [0 - 100]
    const penalty = errors.length * 25 + warnings.length * 10;
    const score = Math.max(0, 100 - penalty);

    let status: 'PASSED' | 'WARNING' | 'FAILED' = 'PASSED';
    if (errors.length > 0 || score < 60) {
      status = 'FAILED';
    } else if (warnings.length > 0) {
      status = 'WARNING';
    }

    const summary = status === 'PASSED'
      ? 'Content passed all pedagogical and smartboard readability checks.'
      : status === 'WARNING'
      ? `Content passed with ${warnings.length} warning(s). Review recommended before classroom delivery.`
      : `Content validation failed with ${errors.length} error(s). Must be resolved before publishing.`;

    return {
      status,
      score,
      errors,
      warnings,
      summary,
      validated_at: new Date().toISOString(),
    };
  },

  /**
   * Validates presentations for 75" smartboard readability, slide types, and language script.
   */
  validatePresentation(
    presentation: PresentationContent,
    language: string,
    errors: ContentValidationError[],
    warnings: ContentValidationError[]
  ): void {
    if (!presentation.slides || presentation.slides.length === 0) {
      errors.push({
        rule: 'NO_SLIDES',
        message: 'Presentation must contain at least one slide.',
        severity: 'ERROR',
      });
      return;
    }

    presentation.slides.forEach((slide, idx) => {
      const slideNum = slide.slide_number || idx + 1;

      // 1. Empty slide check
      const hasContent = Boolean(
        slide.title ||
        slide.body ||
        (slide.bullets && slide.bullets.length > 0) ||
        slide.image_url ||
        slide.diagram_code ||
        slide.question_text ||
        slide.activity_prompt
      );

      if (!hasContent) {
        errors.push({
          rule: 'EMPTY_SLIDE',
          message: `Slide ${slideNum} is empty.`,
          severity: 'ERROR',
          slide_number: slideNum,
        });
      }

      // 2. Word count on slide (Smartboard 75" display legibility)
      const textCorpus = [
        slide.title || '',
        slide.subtitle || '',
        slide.body || '',
        ...(slide.bullets || []),
        slide.question_text || '',
        slide.activity_prompt || '',
      ].join(' ');

      const wordCount = textCorpus.trim().split(/\s+/).filter(Boolean).length;

      if (wordCount > 100) {
        errors.push({
          rule: 'EXCESSIVE_SLIDE_TEXT',
          message: `Slide ${slideNum} contains ${wordCount} words (exceeds maximum readable limit of 100 words).`,
          severity: 'ERROR',
          slide_number: slideNum,
        });
      } else if (wordCount > 60) {
        warnings.push({
          rule: 'SMARTBOARD_OVERCROWDING',
          message: `Slide ${slideNum} contains ${wordCount} words. For 75" classroom displays, keep slides under 60 words.`,
          severity: 'WARNING',
          slide_number: slideNum,
        });
      }

      // 3. Bullet count
      if (slide.bullets && slide.bullets.length > 5) {
        warnings.push({
          rule: 'TOO_MANY_BULLETS',
          message: `Slide ${slideNum} has ${slide.bullets.length} bullet points. Limit to 4-5 points per slide.`,
          severity: 'WARNING',
          slide_number: slideNum,
        });
      }

      // 4. Slide-type specific checks
      if (slide.type === 'QUESTION') {
        if (!slide.question_text) {
          errors.push({
            rule: 'MISSING_QUESTION_TEXT',
            message: `Question slide ${slideNum} must have question text.`,
            severity: 'ERROR',
            slide_number: slideNum,
          });
        }
        if (!slide.question_options || slide.question_options.length !== 4) {
          errors.push({
            rule: 'INVALID_QUESTION_OPTIONS',
            message: `Question slide ${slideNum} must have exactly 4 options.`,
            severity: 'ERROR',
            slide_number: slideNum,
          });
        }
      }

      if (slide.type === 'DIAGRAM') {
        if (!slide.diagram_code && !slide.image_url) {
          warnings.push({
            rule: 'MISSING_DIAGRAM_SPEC',
            message: `Diagram slide ${slideNum} does not contain diagram code or an image URL.`,
            severity: 'WARNING',
            slide_number: slideNum,
          });
        }
      }

      if (slide.type === 'ACTIVITY') {
        if (!slide.activity_prompt && !slide.body) {
          errors.push({
            rule: 'MISSING_ACTIVITY_PROMPT',
            message: `Activity slide ${slideNum} must contain an activity prompt or instructions.`,
            severity: 'ERROR',
            slide_number: slideNum,
          });
        }
      }

      // 5. Language script check
      if (language === 'hi' && textCorpus.length > 10) {
        const hasDevanagari = /[\u0900-\u097F]/.test(textCorpus);
        if (!hasDevanagari) {
          warnings.push({
            rule: 'MISSING_DEVANAGARI_SCRIPT',
            message: `Slide ${slideNum} is set to Hindi but contains no Devanagari script characters.`,
            severity: 'WARNING',
            slide_number: slideNum,
          });
        }
      }
    });
  },

  /**
   * Validates mind-map topology: ensures connected graph, no orphan nodes, valid edge refs.
   */
  validateMindMap(
    mindMap: MindMapContent,
    errors: ContentValidationError[],
    warnings: ContentValidationError[]
  ): void {
    if (!mindMap.nodes || mindMap.nodes.length < 2) {
      errors.push({
        rule: 'INSUFFICIENT_NODES',
        message: 'Mind map must contain at least 2 nodes.',
        severity: 'ERROR',
      });
      return;
    }

    const nodeIds = new Set(mindMap.nodes.map((n) => n.id));
    const connectedNodeIds = new Set<string>();

    if (!mindMap.central_node_id || !nodeIds.has(mindMap.central_node_id)) {
      errors.push({
        rule: 'INVALID_CENTRAL_NODE',
        message: 'Mind map central_node_id is missing or does not match any node in nodes list.',
        severity: 'ERROR',
      });
    } else {
      connectedNodeIds.add(mindMap.central_node_id);
    }

    // Validate edges
    const edges = mindMap.edges || [];
    edges.forEach((edge, idx) => {
      if (!nodeIds.has(edge.source)) {
        errors.push({
          rule: 'DANGLING_EDGE_SOURCE',
          message: `Edge ${idx + 1} source "${edge.source}" does not exist.`,
          severity: 'ERROR',
        });
      } else {
        connectedNodeIds.add(edge.source);
      }

      if (!nodeIds.has(edge.target)) {
        errors.push({
          rule: 'DANGLING_EDGE_TARGET',
          message: `Edge ${idx + 1} target "${edge.target}" does not exist.`,
          severity: 'ERROR',
        });
      } else {
        connectedNodeIds.add(edge.target);
      }

      if (edge.source === edge.target) {
        warnings.push({
          rule: 'SELF_REFERENCING_EDGE',
          message: `Edge ${idx + 1} connects node "${edge.source}" to itself.`,
          severity: 'WARNING',
        });
      }
    });

    // Detect orphan nodes (nodes disconnected from the tree)
    mindMap.nodes.forEach((node) => {
      if (!connectedNodeIds.has(node.id)) {
        warnings.push({
          rule: 'ORPHAN_NODE',
          message: `Node "${node.label}" (ID: ${node.id}) is disconnected from the mind map graph.`,
          severity: 'WARNING',
        });
      }
    });
  },

  /**
   * Validates teaching activities for required pedagogical elements and duration.
   */
  validateTeachingActivity(
    activity: TeachingActivityContent,
    errors: ContentValidationError[],
    warnings: ContentValidationError[]
  ): void {
    if (!activity.title || activity.title.trim().length < 3) {
      errors.push({
        rule: 'INVALID_TITLE',
        message: 'Activity title must be at least 3 characters long.',
        severity: 'ERROR',
      });
    }

    if (!activity.objective || activity.objective.trim().length < 5) {
      errors.push({
        rule: 'MISSING_OBJECTIVE',
        message: 'Activity must specify a clear pedagogical learning objective.',
        severity: 'ERROR',
      });
    }

    if (!activity.teacher_steps || activity.teacher_steps.length === 0) {
      errors.push({
        rule: 'NO_TEACHER_STEPS',
        message: 'Activity must specify at least one step for the teacher.',
        severity: 'ERROR',
      });
    }

    if (activity.duration_mins > 45) {
      warnings.push({
        rule: 'LONG_ACTIVITY_DURATION',
        message: `Activity duration of ${activity.duration_mins} minutes may exceed standard period time.`,
        severity: 'WARNING',
      });
    }
  },
};
