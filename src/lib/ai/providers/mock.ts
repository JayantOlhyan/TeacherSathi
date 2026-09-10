import { BaseAIProvider } from './base';
import type { ChatMessage, GenerationResult, TokenUsage } from '../types';
import type {
  LessonPlan,
  Worksheet,
  Quiz,
  TestPaper,
  Presentation,
  MindMap,
  TeachingActivity,
  SaathiGenieResponse,
} from '../schemas';

export class MockAIProvider extends BaseAIProvider {
  readonly name = 'mock';
  readonly model = 'mock-ai-v1';
  public shouldFail: boolean = false;
  public failCount: number = 0;
  public failureMessage: string = 'Simulated provider error';

  constructor(shouldFail: boolean = false) {
    super();
    this.shouldFail = shouldFail;
  }

  getMockLessonPlan(): LessonPlan {
    return {
      title: 'NCERT Lesson Plan: Light — Reflection & Refraction',
      grade: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 10: Light',
      duration_mins: 45,
      learning_objectives: [
        'Understand the laws of reflection of light',
        'Differentiate between concave and convex spherical mirrors',
        'Calculate focal lengths using ray diagrams',
      ],
      materials: ['Plane mirror', 'Torch light', 'White paper sheet', 'Concave lens model'],
      prior_knowledge: 'Basic propagation of light rays in straight lines from Class 7.',
      introduction: {
        duration_mins: 5,
        hook: 'Observe how a spoon shows both inverted and upright images depending on which side you look into.',
        real_world_application: 'Dentist examination mirrors and car rear-view mirrors use curved glass.',
      },
      teaching_steps: [
        {
          step_number: 1,
          title: 'Laws of Reflection Demonstration',
          duration_mins: 15,
          teacher_actions: 'Shine a laser/torch onto a flat mirror and trace the angle of incidence and reflection on paper.',
          student_actions: 'Measure both angles using protractors and verify angle i = angle r.',
        },
        {
          step_number: 2,
          title: 'Spherical Mirrors Ray Tracing',
          duration_mins: 15,
          teacher_actions: 'Diagram principal axis, pole, focus, and center of curvature on the blackboard.',
          student_actions: 'Draw real vs virtual focal points in their science notebooks.',
        },
      ],
      activities: [
        {
          title: 'Pair Ray Diagram Challenge',
          duration_mins: 10,
          description: 'Students in pairs solve 1 focal length problem for a concave mirror with object at C.',
          grouping: 'pairs',
        },
      ],
      assessment: {
        formative_checks: [
          'What is the relation between radius of curvature R and focal length f?',
          'Why is the convex mirror preferred as a rear-view mirror in vehicles?',
        ],
        exit_ticket: 'State 2 properties of an image formed by a plane mirror on your exit slip.',
      },
      differentiation: {
        support_for_struggling: 'Provide pre-printed ray diagram grid sheets with labeled optical centers.',
        extension_for_advanced: 'Derive mirror equation 1/f = 1/v + 1/u using similar triangles.',
      },
      homework: 'Solve NCERT Chapter 10 in-text questions 1 to 4 on page 168.',
      teacher_notes: 'Keep laser pointers pointed strictly away from student eyes during mirror demos.',
    };
  }

  getMockWorksheet(): Worksheet {
    return {
      title: 'Classroom Worksheet: Reflection & Refraction Mechanics',
      grade: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 10: Light',
      difficulty: 'MEDIUM',
      total_marks: 10,
      instructions: [
        'Read every question carefully before writing answers.',
        'Draw clear ray diagrams wherever applicable using a sharp pencil.',
      ],
      questions: [
        {
          question_number: 1,
          question_type: 'MCQ',
          marks: 2,
          text_en: 'The radius of curvature of a spherical mirror is 20 cm. Its focal length is:',
          text_hi: 'एक गोलीय दर्पण की वक्रता त्रिज्या 20 सेमी है। इसकी फोकस दूरी होगी:',
          model_answer_en: 'Option C: 10 cm (f = R / 2)',
          model_answer_hi: 'विकल्प C: 10 सेमी (f = R / 2)',
          options: [
            { key: 'A', text_en: '40 cm', text_hi: '40 सेमी' },
            { key: 'B', text_en: '20 cm', text_hi: '20 सेमी' },
            { key: 'C', text_en: '10 cm', text_hi: '10 सेमी' },
            { key: 'D', text_en: '5 cm', text_hi: '5 सेमी' },
          ],
        },
        {
          question_number: 2,
          question_type: 'SHORT_ANSWER',
          marks: 3,
          text_en: 'State the two laws of reflection of light.',
          text_hi: 'प्रकाश के परावर्तन के दो नियम लिखिए।',
          model_answer_en: '1. The incident ray, the reflected ray and the normal all lie in the same plane. 2. The angle of incidence equals the angle of reflection (i = r).',
          model_answer_hi: '1. आपतित किरण, परावर्तित किरण तथा अभिलंब तीनों एक ही तल में होते हैं। 2. आपतन कोण परावर्तन कोण के बराबर होता है (i = r)।',
        },
        {
          question_number: 3,
          question_type: 'APPLICATION',
          marks: 5,
          text_en: 'An object is placed at a distance of 10 cm from a convex mirror of focal length 15 cm. Find the position and nature of the image.',
          text_hi: '15 सेमी फोकस दूरी के किसी उत्तल दर्पण से कोई बिंब 10 सेमी दूरी पर रखा है। प्रतिबिंब की स्थिति तथा प्रकृति ज्ञात कीजिए।',
          model_answer_en: 'Using 1/f = 1/v + 1/u: 1/15 = 1/v + 1/(-10) => 1/v = 1/15 + 1/10 = 5/30 = 1/6 => v = +6 cm. Image is virtual, erect and formed behind the mirror.',
          model_answer_hi: 'दर्पण सूत्र से: v = +6 सेमी। प्रतिबिंब दर्पण के पीछे आभासी तथा सीधा बनता है।',
        },
      ],
      answer_key: {
        Q1: 'C (10 cm)',
        Q2: 'Law 1: Coplanar rays; Law 2: i = r',
        Q3: 'v = +6 cm, Virtual and erect',
      },
    };
  }

  getMockQuiz(): Quiz {
    return {
      title: 'Quick Clicker Quiz: Light & Reflection Mastery',
      grade: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 10: Light',
      questions: [
        {
          id: 'q1',
          question: 'Which type of mirror is commonly used as a shaving mirror?',
          options: [
            { id: 'A', text: 'Concave mirror', is_correct: true },
            { id: 'B', text: 'Convex mirror', is_correct: false },
            { id: 'C', text: 'Plane mirror', is_correct: false },
            { id: 'D', text: 'Cylindrical mirror', is_correct: false },
          ],
          correct_option_id: 'A',
          explanation: 'Concave mirrors produce an enlarged, erect virtual image when the face is kept between pole and focus.',
          difficulty: 'Easy',
          concept: 'Spherical Mirrors',
        },
        {
          id: 'q2',
          question: 'The refractive index of glass with respect to air is 1.5. The speed of light in glass is:',
          options: [
            { id: 'A', text: '3.0 × 10^8 m/s', is_correct: false },
            { id: 'B', text: '2.0 × 10^8 m/s', is_correct: true },
            { id: 'C', text: '1.5 × 10^8 m/s', is_correct: false },
            { id: 'D', text: '2.5 × 10^8 m/s', is_correct: false },
          ],
          correct_option_id: 'B',
          explanation: 'v = c / n = (3.0 × 10^8 m/s) / 1.5 = 2.0 × 10^8 m/s.',
          difficulty: 'Medium',
          concept: 'Refraction & Snell Law',
        },
      ],
    };
  }

  getMockTestPaper(): TestPaper {
    return {
      title: 'CBSE Periodic Test: Light & Optics Assessment',
      grade: 'Class 10',
      subject: 'Science',
      chapters: ['Chapter 10: Light - Reflection and Refraction'],
      duration_mins: 45,
      total_marks: 20,
      general_instructions: [
        'All questions are compulsory.',
        'Marks for each question are indicated against it.',
        'Use of calculators is strictly prohibited.',
      ],
      sections: [
        {
          section_name: 'Section A',
          section_title: 'Multiple Choice & Objective Questions',
          marks_per_question: 1,
          questions: [
            {
              question_number: 1,
              text_en: 'No matter how far you stand from a mirror, your image appears erect. The mirror is likely to be:',
              text_hi: 'चाहे आप कितनी भी दूरी पर खड़े हों, आपका प्रतिबिंब सदैव सीधा प्रतीत होता है। दर्पण संभवतः है:',
              marks: 1,
              question_type: 'MCQ',
              bloom_level: 'UNDERSTAND',
              model_answer: 'Either plane or convex.',
              marking_scheme: ['1 mark for correct identification of plane or convex mirror.'],
            },
            {
              question_number: 2,
              text_en: 'Define optical center of a thin lens.',
              text_hi: 'पतले लेंस के प्रकाशिक केंद्र की परिभाषा दीजिए।',
              marks: 1,
              question_type: 'VSA',
              bloom_level: 'REMEMBER',
              model_answer: 'The central point of the lens through which a ray of light passes undeviated.',
              marking_scheme: ['1 mark for ray passing without deviation.'],
            },
          ],
        },
        {
          section_name: 'Section B',
          section_title: 'Descriptive & Analytical Problems',
          marks_per_question: 6,
          questions: [
            {
              question_number: 3,
              text_en: 'A convex lens forms a real and inverted image of a needle at a distance of 50 cm. Where is the needle placed if image size equals needle size? Also find lens power.',
              text_hi: 'एक उत्तल लेंस 50 सेमी दूरी पर किसी सुई का वास्तविक तथा उल्टा प्रतिबिंब बनाता है। यदि प्रतिबिंब का आकार सुई के बराबर है तो सुई कहाँ स्थित है? लेंस की क्षमता भी ज्ञात कीजिए।',
              marks: 6,
              question_type: 'APPLICATION',
              bloom_level: 'APPLY',
              model_answer: 'Needle placed at 2F1 = -50 cm. Focal length f = +25 cm = +0.25 m. Power P = 1/f = +4 Dioptres.',
              marking_scheme: [
                '2 marks for position u = -50 cm',
                '2 marks for focal length f = +25 cm',
                '2 marks for Power calculation P = +4 D',
              ],
            },
            {
              question_number: 4,
              text_en: 'Explain refraction through a rectangular glass slab with a neat labeled diagram. Prove that the emergent ray is parallel to the incident ray.',
              text_hi: 'एक आयताकार काँच के गुटके से अपवर्तन को स्वच्छ नामांकित चित्र द्वारा समझाइए तथा सिद्ध कीजिए कि निर्गत किरण आपतित किरण के समांतर होती है।',
              marks: 12,
              question_type: 'LONG_ANSWER',
              bloom_level: 'ANALYZE',
              model_answer: 'At surface AB: sin i / sin r1 = n. At surface CD: sin r2 / sin e = 1/n. Since r1 = r2, sin i = sin e => i = e. Lateral displacement occurs.',
              marking_scheme: [
                '4 marks for clean labeled ray diagram',
                '4 marks for Snell Law equations at both interfaces',
                '4 marks for proving i = e and lateral shift explanation',
              ],
            },
          ],
        },
      ],
    };
  }

  getMockPresentation(): Presentation {
    return {
      title: 'Smartboard Presentation: Principles of Optics',
      grade: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 10: Light',
      slide_count: 4,
      slides: [
        {
          slide_number: 1,
          title: 'What is Light Reflection?',
          subtitle: 'The bouncing back of rays',
          bullet_points: [
            'Light travels in straight lines in uniform media',
            'Smooth surfaces reflect light regularly',
            'Angle of incidence always equals angle of reflection',
          ],
          teacher_tip: 'Ask students to look into their spoon or phone screen before explaining.',
          visual_prompt: 'High-contrast 4K diagram showing incident ray, normal, and reflected ray on mirror.',
          reflection_pause: 'Why cannot we see our reflection clearly on a wooden desk?',
        },
        {
          slide_number: 2,
          title: 'Spherical Mirrors: Concave vs Convex',
          subtitle: 'Curved reflecting surfaces',
          bullet_points: [
            'Concave curves inward like a hollow sphere',
            'Convex curves outward like a ball surface',
            'Concave converges light; convex diverges light',
          ],
          teacher_tip: 'Hold up a convex spoon back to show wide field of view.',
          visual_prompt: 'Side-by-side comparison cross-sections of concave and convex silvered glass.',
        },
        {
          slide_number: 3,
          title: 'Mirror Formula & Sign Convention',
          subtitle: 'Cartesian Coordinate Rules',
          bullet_points: [
            'Pole (P) is taken as the origin (0,0)',
            'Distances left of pole are negative (-u)',
            'Mirror formula: 1/f = 1/v + 1/u',
          ],
          teacher_tip: 'Emphasize that concave mirror focal length is always negative.',
          visual_prompt: 'Cartesian coordinate axis overlaid on a concave mirror principal axis.',
        },
        {
          slide_number: 4,
          title: 'Refraction & Snell\'s Law',
          subtitle: 'Light bending across boundaries',
          bullet_points: [
            'Speed changes when passing into denser media',
            'Ray bends toward normal in glass/water',
            'Ratio sin i / sin r is constant (Refractive index n)',
          ],
          teacher_tip: 'Demonstrate a pencil in a half-full water glass appearing broken.',
          visual_prompt: 'Laser beam passing from air into acrylic block showing clear angle shift.',
        },
      ],
    };
  }

  getMockMindMap(): MindMap {
    return {
      title: 'Concept Mind Map: Optics & Reflection',
      grade: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 10: Light',
      central_node: { id: 'light-optics', label: 'Light: Reflection & Refraction' },
      nodes: [
        { id: 'n1', label: 'Reflection of Light', category: 'Core', description: 'Bouncing back of light in the same medium' },
        { id: 'n2', label: 'Spherical Mirrors', category: 'Subconcept', description: 'Concave and convex curved reflecting mirrors' },
        { id: 'n3', label: 'Mirror Formula', category: 'Application', description: '1/v + 1/u = 1/f with Cartesian sign convention' },
        { id: 'n4', label: 'Refraction of Light', category: 'Core', description: 'Bending of light across optical densities' },
      ],
      edges: [
        { from: 'light-optics', to: 'n1', relationship: 'encompasses' },
        { from: 'n1', to: 'n2', relationship: 'applies to' },
        { from: 'n2', to: 'n3', relationship: 'calculated using' },
        { from: 'light-optics', to: 'n4', relationship: 'encompasses' },
      ],
    };
  }

  getMockTeachingActivity(): TeachingActivity {
    return {
      title: '5-Minute Hands-on: Spoon Optics Reflection',
      grade: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 10: Light',
      duration_mins: 10,
      learning_outcome: 'Students discover the difference between concave and convex reflections using everyday items.',
      materials_needed: ['Clean stainless steel tablespoons', 'Pencils'],
      setup: 'Arrange students in pairs with one spoon per pair.',
      step_by_step_procedure: [
        {
          step_number: 1,
          action: 'Ask students to look into the inner curved surface of the spoon.',
          teacher_prompt: 'Is your face upright or inverted? Slowly move the spoon closer to your eye!',
        },
        {
          step_number: 2,
          action: 'Now flip the spoon to look at the outer bulge.',
          teacher_prompt: 'What changed? Can you make the image flip upside down on this side?',
        },
      ],
      reflection_questions: [
        'Which side acts like a concave mirror and which acts like a convex mirror?',
        'Why does the image flip when you bring the inner surface very close?',
      ],
      safety_guidelines: 'Ensure students do not poke eyes with spoon handles.',
    };
  }

  getMockSaathiGenie(): SaathiGenieResponse {
    return {
      pedagogical_answer: 'To teach Chapter 10 Light effectively to Class 10 students, start with a 5-minute inquiry hook using household mirrors, followed by ray tracing on the smartboard.',
      actionable_steps: [
        'Demonstrate real vs virtual image on a sheet of paper using a concave shaving mirror.',
        'Emphasize the Cartesian sign convention (distances measured to the left of the pole are negative).',
        'Run a 3-question formative clicker quiz before concluding the period.',
      ],
      curriculum_reference: {
        grade: 'Class 10',
        subject: 'Science',
        chapter: 'Chapter 10: Light — Reflection and Refraction',
      },
      quick_followups: [
        'Generate a 5-minute recap activity for concave mirrors',
        'Create a 10-mark practice worksheet for this chapter',
        'Give me an analogy to explain refraction index',
      ],
    };
  }

  async generateStructured<T>(prompt: string): Promise<GenerationResult<T>> {
    const startTime = Date.now();

    if (this.shouldFail) {
      if (this.failCount > 0) {
        this.failCount--;
      } else {
        throw new Error(this.failureMessage);
      }
    }

    const lowerPrompt = prompt.toLowerCase();
    let data: unknown;

    if (lowerPrompt.includes('saathi-genie') || lowerPrompt.includes('saathi genie') || lowerPrompt.includes('pedagogical_answer')) {
      data = this.getMockSaathiGenie();
    } else if (lowerPrompt.includes('lesson plan') || lowerPrompt.includes('lesson-plan')) {
      data = this.getMockLessonPlan();
    } else if (lowerPrompt.includes('worksheet')) {
      data = this.getMockWorksheet();
    } else if (lowerPrompt.includes('quiz')) {
      data = this.getMockQuiz();
    } else if (lowerPrompt.includes('test-paper') || lowerPrompt.includes('test paper')) {
      data = this.getMockTestPaper();
    } else if (lowerPrompt.includes('presentation') || lowerPrompt.includes('slide')) {
      data = this.getMockPresentation();
    } else if (lowerPrompt.includes('mind map') || lowerPrompt.includes('mind-map')) {
      data = this.getMockMindMap();
    } else if (lowerPrompt.includes('teaching activity') || lowerPrompt.includes('teaching-activity') || lowerPrompt.includes('step_by_step_procedure')) {
      data = this.getMockTeachingActivity();
    } else {
      data = this.getMockSaathiGenie();
    }

    const latency = Date.now() - startTime;
    return {
      data: data as T,
      raw_text: JSON.stringify(data),
      provider: this.name,
      model: this.model,
      latency_ms: latency,
      token_usage: {
        prompt_tokens: 150,
        completion_tokens: 450,
        total_tokens: 600,
      },
    };
  }

  async generateChat(
    messages: ChatMessage[]
  ): Promise<{ content: string; token_usage: TokenUsage; latency_ms: number }> {
    const startTime = Date.now();
    const lastMessage = messages[messages.length - 1]?.content || '';

    let reply = `Saathi Genie Pedagogical Assistant: Regarding "${lastMessage.slice(0, 40)}...", I recommend grounding this with an everyday NCERT activity.`;
    if (lastMessage.toLowerCase().includes('recap')) {
      reply = `Here is a 5-minute recap activity:\n1. Pair reflection check (2 min)\n2. Quick concept quiz (3 min)`;
    }

    return {
      content: reply,
      token_usage: { prompt_tokens: 80, completion_tokens: 120, total_tokens: 200 },
      latency_ms: Date.now() - startTime,
    };
  }
}
