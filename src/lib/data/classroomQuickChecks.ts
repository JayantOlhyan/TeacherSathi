export interface QuickCheckOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  textHi?: string;
  color: 'red' | 'blue' | 'green' | 'orange';
  isCorrect: boolean;
}

export interface QuickCheckItem {
  id: string;
  grade: string;
  subject: string;
  chapter: string;
  chapterTitle: string;
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  questionTextHi?: string;
  icon?: string;
  options: QuickCheckOption[];
  explanation: string;
  explanationHi?: string;
  misconception: {
    diagnosedText: string;
    studentTrapOption: 'A' | 'B' | 'C' | 'D';
    whyStudentsConfuse: string;
  };
  intervention: {
    title: string;
    duration: string;
    steps: string[];
    diagramTitle: string;
    diagramLeft: {
      title: string;
      description: string;
      example: string;
    };
    diagramRight: {
      title: string;
      description: string;
      example: string;
    };
  };
  recheckQuestion: {
    questionText: string;
    questionTextHi?: string;
    options: Array<{
      key: 'A' | 'B' | 'C' | 'D';
      text: string;
      isCorrect: boolean;
    }>;
    improvedCohortCount: number;
    totalCohort: number;
    improvedPercentage: number;
  };
}

/**
 * Curated NCERT Quick Check & Recheck question banks for classroom sessions.
 */
export const CANONICAL_QUICK_CHECKS: Record<string, QuickCheckItem> = {
  // Class 8 Science Ch 3: Heat & Thermodynamics (Featured in Reference Specification)
  'heat-evaporation-boiling': {
    id: 'heat-evaporation-boiling',
    grade: 'class-8',
    subject: 'science',
    chapter: 'chapter-3',
    chapterTitle: 'Heat & Thermodynamics',
    questionNumber: 1,
    totalQuestions: 5,
    questionText: 'What is the main difference between evaporation and boiling?',
    questionTextHi: 'वाष्पीकरण और क्वथन (उबलने) के बीच मुख्य अंतर क्या है?',
    icon: 'FlaskConical',
    options: [
      {
        key: 'A',
        text: 'Evaporation happens only at high temperature.',
        textHi: 'वाष्पीकरण केवल उच्च तापमान पर होता है।',
        color: 'red',
        isCorrect: false,
      },
      {
        key: 'B',
        text: 'Boiling happens only at the surface.',
        textHi: 'क्वथन केवल द्रव की सतह पर होता है।',
        color: 'blue',
        isCorrect: false,
      },
      {
        key: 'C',
        text: 'Evaporation can happen at any temperature.',
        textHi: 'वाष्पीकरण किसी भी तापमान पर हो सकता है।',
        color: 'green',
        isCorrect: true,
      },
      {
        key: 'D',
        text: 'Boiling produces water vapour only.',
        textHi: 'क्वथन से केवल जलवाष्प ही बनती है।',
        color: 'orange',
        isCorrect: false,
      },
    ],
    explanation: 'Evaporation is a surface phenomenon occurring at any temperature below the boiling point. Boiling occurs throughout the bulk of the liquid at a fixed temperature (100°C for water at 1 atm).',
    explanationHi: 'वाष्पीकरण एक सतही प्रक्रिया है जो क्वथनांक से नीचे किसी भी तापमान पर हो सकती है। जबकि क्वथन पूरे द्रव में एक निश्चित तापमान पर होता है।',
    misconception: {
      diagnosedText: 'Most students may be confusing evaporation with boiling.',
      studentTrapOption: 'B',
      whyStudentsConfuse: 'Students mistakenly believe evaporation only happens when water is hot or that boiling is confined to the surface rather than the entire liquid bulk.',
    },
    intervention: {
      title: 'Suggested Intervention',
      duration: '2–5 minutes',
      steps: [
        'Show a simple comparison diagram on the whiteboard',
        'Use a real-life example (e.g., drying clothes vs boiling water in a kettle)',
        'Ask students to discuss in pairs for 1 minute',
        'Try a quick recheck question to verify retention',
      ],
      diagramTitle: 'Evaporation vs Boiling',
      diagramLeft: {
        title: 'Evaporation (Surface)',
        description: 'Occurs at any temperature from the surface only. Slow cooling effect.',
        example: 'Drying wet clothes on a line under a fan or outside.',
      },
      diagramRight: {
        title: 'Boiling (Bulk)',
        description: 'Occurs at a fixed boiling point throughout the liquid with visible steam bubbles.',
        example: 'Water rapidly bubbling in a cooking pot over stove flame.',
      },
    },
    recheckQuestion: {
      questionText: 'Which of the following can evaporate at room temperature?',
      questionTextHi: 'निम्नलिखित में से कौन सा कमरे के सामान्य तापमान पर वाष्पीकृत हो सकता है?',
      options: [
        { key: 'A', text: 'Only seawater', isCorrect: false },
        { key: 'B', text: 'Only hot water', isCorrect: false },
        { key: 'C', text: 'Any liquid with exposed surface', isCorrect: true },
        { key: 'D', text: 'Only milk', isCorrect: false },
      ],
      improvedCohortCount: 22,
      totalCohort: 24,
      improvedPercentage: 92,
    },
  },

  // Class 8 Science Ch 1: Crop Production & Management
  'crop-nitrogen-replenish': {
    id: 'crop-nitrogen-replenish',
    grade: 'class-8',
    subject: 'science',
    chapter: 'chapter-1',
    chapterTitle: 'Crop Production and Management',
    questionNumber: 1,
    totalQuestions: 4,
    questionText: 'Which of the following agricultural practices naturally replenishes soil nitrogen without chemical runoff?',
    questionTextHi: 'निम्नलिखित में से कौन सी कृषि पद्धति बिना रासायनिक अपवाह के प्राकृतिक रूप से मिट्टी में नाइट्रोजन की पूर्ति करती है?',
    icon: 'Sprout',
    options: [
      {
        key: 'A',
        text: 'Continuous synthetic chemical fertilizing',
        textHi: 'लगातार रासायनिक खादों का प्रयोग',
        color: 'red',
        isCorrect: false,
      },
      {
        key: 'B',
        text: 'Crop rotation with leguminous plants',
        textHi: 'फलीदार पौधों के साथ फसल चक्रण',
        color: 'blue',
        isCorrect: true,
      },
      {
        key: 'C',
        text: 'Excessive canal flood irrigation',
        textHi: 'नहर से अत्यधिक जलभराव सिंचाई',
        color: 'green',
        isCorrect: false,
      },
      {
        key: 'D',
        text: 'Deep soil harvesting with heavy combine threshers',
        textHi: 'थ्रेशर से अत्यधिक गहरी कटाई',
        color: 'orange',
        isCorrect: false,
      },
    ],
    explanation: 'Leguminous crops (pulses, beans, peas) harbor Rhizobium bacteria in their root nodules, which biologically fix atmospheric nitrogen into usable nitrates.',
    explanationHi: 'दलहनी फसलों की जड़ों की ग्रंथियों में राइजोबियम जीवाणु पाए जाते हैं, जो वायुमंडलीय नाइट्रोजन को नाइट्रेट में स्थिर कर मिट्टी को उपजाऊ बनाते हैं।',
    misconception: {
      diagnosedText: 'Students confuse synthetic chemical fertilizers with natural biological nitrogen fixation.',
      studentTrapOption: 'A',
      whyStudentsConfuse: 'Students hear "nitrogen fertilizer" in village markets and assume chemicals are the primary natural replenishing method.',
    },
    intervention: {
      title: 'Biological Nitrogen Fixation Anchor',
      duration: '3 minutes',
      steps: [
        'Sketch a legume root nodule on the whiteboard showing Rhizobium bacteria',
        'Ask class: "Why do farmers alternate gram/chana after harvesting wheat?"',
        'Have back row explain the symbiotic relationship in their own words',
        'Run quick follow-up check question',
      ],
      diagramTitle: 'Crop Rotation Cycle',
      diagramLeft: {
        title: 'Cereal Crop (Wheat/Rice)',
        description: 'Consumes high soil nitrates and leaves soil depleted.',
        example: 'Wheat season leaves soil low in nitrogen.',
      },
      diagramRight: {
        title: 'Legume Crop (Pulses/Peas)',
        description: 'Rhizobium bacteria fix nitrogen gas, enriching the soil naturally.',
        example: 'Gram/Chana crop restores nitrogen without cost.',
      },
    },
    recheckQuestion: {
      questionText: 'What organism lives inside legume root nodules to fix nitrogen naturally?',
      questionTextHi: 'नाइट्रोजन स्थिरीकरण के लिए दलहनी पौधों की जड़ों में कौन सा सूक्ष्मजीव रहता है?',
      options: [
        { key: 'A', text: 'Yeast cells', isCorrect: false },
        { key: 'B', text: 'Rhizobium bacteria', isCorrect: true },
        { key: 'C', text: 'Penicillium fungus', isCorrect: false },
        { key: 'D', text: 'Algae filaments', isCorrect: false },
      ],
      improvedCohortCount: 23,
      totalCohort: 24,
      improvedPercentage: 96,
    },
  },
};

/**
 * Retrieves or dynamically generates a classroom Quick Check item tailored to the active chapter.
 */
export function getChapterQuickCheck(
  grade: string,
  subject: string,
  chapter: string,
  chapterTitle?: string
): QuickCheckItem {
  // Check for pre-seeded canonical check
  if (chapter.includes('3') || (chapterTitle && chapterTitle.toLowerCase().includes('heat'))) {
    return CANONICAL_QUICK_CHECKS['heat-evaporation-boiling'];
  }
  if (chapter.includes('1') || (chapterTitle && chapterTitle.toLowerCase().includes('crop'))) {
    return CANONICAL_QUICK_CHECKS['crop-nitrogen-replenish'];
  }

  // Dynamic fallback aligned with curriculum
  const title = chapterTitle || 'Curriculum Concept Check';
  const cleanGrade = grade.replace('class-', 'Class ');
  const cleanSubject = subject.charAt(0).toUpperCase() + subject.slice(1);

  return {
    id: `quick-check-${grade}-${subject}-${chapter}`,
    grade,
    subject,
    chapter,
    chapterTitle: title,
    questionNumber: 1,
    totalQuestions: 3,
    questionText: `What is the core scientific principle demonstrated in ${title}?`,
    questionTextHi: `${title} में प्रतिपादित मुख्य वैज्ञानिक नियम क्या है?`,
    icon: 'Lightbulb',
    options: [
      {
        key: 'A',
        text: 'The process operates in reverse under atmospheric pressure.',
        textHi: 'प्रक्रिया वायुमंडलीय दबाव में उल्टी चलती है।',
        color: 'red',
        isCorrect: false,
      },
      {
        key: 'B',
        text: 'Energy and matter are conserved throughout the reaction.',
        textHi: 'प्रक्रिया के दौरान ऊर्जा और द्रव्यमान संरक्षित रहते हैं।',
        color: 'blue',
        isCorrect: true,
      },
      {
        key: 'C',
        text: 'Only synthetic materials can undergo this transformation.',
        textHi: 'केवल कृत्रिम पदार्थ ही इस परिवर्तन से गुजर सकते हैं।',
        color: 'green',
        isCorrect: false,
      },
      {
        key: 'D',
        text: 'External heat is required for all natural processes.',
        textHi: 'सभी प्राकृतिक प्रक्रियाओं के लिए बाहरी ऊष्मा अनिवार्य है।',
        color: 'orange',
        isCorrect: false,
      },
    ],
    explanation: `In ${cleanGrade} ${cleanSubject}, this topic emphasizes fundamental conservation laws and observable classroom phenomena.`,
    misconception: {
      diagnosedText: `Students frequently confuse reversible physical transformations with permanent chemical changes in ${title}.`,
      studentTrapOption: 'C',
      whyStudentsConfuse: 'Students assume macroscopic observations apply universally to microscopic mechanisms.',
    },
    intervention: {
      title: 'Targeted Remediation Strategy',
      duration: '3–5 minutes',
      steps: [
        'Draw a two-column comparison on the whiteboard',
        'Provide a familiar everyday Indian household example',
        'Have students restate the key rule to their seatmate',
        'Verify with a 1-question check',
      ],
      diagramTitle: `${title} Mechanism`,
      diagramLeft: {
        title: 'Initial Condition',
        description: 'Observable physical properties before intervention.',
        example: 'Starting raw materials or baseline temperature.',
      },
      diagramRight: {
        title: 'Transformed State',
        description: 'Resulting state preserving mass and energy.',
        example: 'Transformed product with predictable properties.',
      },
    },
    recheckQuestion: {
      questionText: `Which of the following best confirms understanding of ${title}?`,
      options: [
        { key: 'A', text: 'Memorizing the formula without examples', isCorrect: false },
        { key: 'B', text: 'Applying the rule to a new everyday situation', isCorrect: true },
        { key: 'C', text: 'Assuming the rule changes every season', isCorrect: false },
        { key: 'D', text: 'Ignoring energy conservation', isCorrect: false },
      ],
      improvedCohortCount: 22,
      totalCohort: 24,
      improvedPercentage: 92,
    },
  };
}
