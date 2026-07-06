export interface QAQuestion {
  id: string;
  question: string;
  questionHi?: string;
  answer: string;
  answerHi?: string;
  marks: number;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "short" | "long" | "value-based";
  keyPoints?: string[];
}

export interface QAData {
  chapterTitle?: string;
  chapterTitleHi?: string;
  questions: QAQuestion[];
}

// Comprehensive embedded fallback Q&A data for Class 10 Hindi and others
const CLASS_10_HINDI_FALLBACKS: Record<string, QAData> = {
  "chapter-1": {
    chapterTitle: "Bade Bhai Sahab",
    chapterTitleHi: "बड़े भाई साहब",
    questions: [
      {
        id: "q1",
        type: "short",
        marks: 2,
        difficulty: "Easy",
        question: "Why did the narrator's elder brother rebuke him often?",
        questionHi: "लेखक के बड़े भाई साहब उन्हें बार-बार क्यों डाँटते थे?",
        answer: "The elder brother wanted the younger brother to study diligently instead of wasting time playing sports and flying kites, as he felt responsible for his upbringing and academic success.",
        answerHi: "बड़े भाई साहब का मानना था कि पढ़ाई में निरंतर परिश्रम आवश्यक है। छोटा भाई खेलकूद और पतंगबाज़ी में समय नष्ट करता था, इसलिए एक जिम्मेदार बड़े भाई के रूप में वे उसे समझाते और डाँटते थे।",
        keyPoints: [
          "समय का सदुपयोग करने की सीख (Importance of time management)",
          "अध्ययन के प्रति गंभीरता (Seriousness towards studies)",
          "अभिभावक जैसी ज़िम्मेदारी का भाव (Sense of parental responsibility)"
        ]
      },
      {
        id: "q2",
        type: "short",
        marks: 2,
        difficulty: "Medium",
        question: "What was the difference in the studying habits of the two brothers?",
        questionHi: "दोनों भाइयों के अध्ययन की दिनचर्या में क्या मुख्य अंतर था?",
        answer: "The elder brother studied continuously for hours without breaks, memorizing words repetitively, while the younger brother studied very little but with high concentration and spent most of his time playing outside.",
        answerHi: "बड़े भाई साहब दिन-रात किताबें खोले बैठे रहते थे और एक-एक शब्द को बार-बार रटते थे। इसके विपरीत, छोटा भाई पढ़ाई में कम समय देता था, परंतु एकाग्रता से पढ़ने के कारण कक्षा में प्रथम आता था और शेष समय खेलकूद में बिताता था।",
        keyPoints: [
          "कठोर परिश्रम बनाम स्मार्ट और एकाग्र अध्ययन (Hard work vs Focused study)",
          "खेलकूद और पढ़ाई का संतुलन (Balance of play and study)"
        ]
      },
      {
        id: "q3",
        type: "long",
        marks: 5,
        difficulty: "Hard",
        question: "What view does Premchand present regarding textbook knowledge versus practical experience in life through 'Bade Bhai Sahab'?",
        questionHi: "प्रेमचंद ने 'बड़े भाई साहब' कहानी के माध्यम से किताबी ज्ञान और व्यावहारिक अनुभव के विषय में क्या संदेश दिया है?",
        answer: "Through this story, Premchand demonstrates that bookish knowledge alone is insufficient for navigating life. Practical wisdom, understanding, and maturity gained through life experiences are far superior to mere rote learning.",
        answerHi: "प्रेमचंद जी ने स्पष्ट किया है कि केवल किताबी ज्ञान और रटंत विद्या से वास्तविक समझ विकसित नहीं होती। जीवन में व्यावहारिक अनुभव, समझदारी और बड़ों का आदर अधिक महत्वपूर्ण है। बड़े भाई साहब कक्षा में भले ही पीछे रह गए हों, परंतु उनका जीवन का अनुभव और दृष्टिकोण छोटे भाई से कहीं अधिक परिपक्व और वंदनीय था।",
        keyPoints: [
          "रटंत विद्या की निरर्थकता (Futility of rote memorization)",
          "व्यावहारिक अनुभव का महत्व (Supremacy of practical life experience)",
          "बड़ों के प्रति सम्मान का भाव (Respect for elders despite academic scores)"
        ]
      },
      {
        id: "q4",
        type: "value-based",
        marks: 5,
        difficulty: "Medium",
        question: "How did the elder brother sacrifice his own childhood joys for the sake of his younger brother?",
        questionHi: "अपने छोटे भाई के मार्गदर्शन हेतु बड़े भाई साहब ने अपने बाल-मन की इच्छाओं का त्याग किस प्रकार किया?",
        answer: "To set an ideal moral and behavioral model for his younger brother, the elder brother restrained his own desires to play games, participate in fairs, or fly kites, maintaining strict self-discipline.",
        answerHi: "बड़े भाई साहब स्वयं भी खेलना-कूदना और पतंग उड़ाना चाहते थे, परंतु वे जानते थे कि यदि वे स्वयं बेपरवाह होंगे तो छोटे भाई को सही रास्ता नहीं दिखा सकेंगे। इसलिए छोटे भाई के सामने एक आदर्श प्रस्तुत करने हेतु उन्होंने अपने बाल-मन की समस्त इच्छाओं और खुशियों का त्याग कर दिया।",
        keyPoints: [
          "आदर्श प्रस्तुत करने हेतु आत्म-नियंत्रण (Self-restraint to set an example)",
          "त्याग और कर्तव्यनिष्ठा (Sacrifice and dedication towards family)",
          "नैतिक ज़िम्मेदारी का वहन (Shouldering moral responsibility)"
        ]
      }
    ]
  }
};

export async function getQAData(grade: string, subject: string, chapter: string): Promise<QAData | null> {
  try {
    const filename = `${grade}-${subject}-${chapter}.json`.toLowerCase();
    const response = await fetch(`/qa/${filename}`);
    if (response.ok) {
      const data = await response.json();
      return data as QAData;
    }
  } catch (error) {
    console.error("Failed to load Q&A data from public folder:", error);
  }

  // Check fallback dictionary
  const cleanChapter = chapter.toLowerCase();
  if (grade.toLowerCase() === "class-10" && subject.toLowerCase() === "hindi" && CLASS_10_HINDI_FALLBACKS[cleanChapter]) {
    return CLASS_10_HINDI_FALLBACKS[cleanChapter];
  }

  // Generate generic dynamic Q&A fallback so the UI always functions gracefully
  const cleanSubjectName = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanChapterNum = chapter.replace("chapter-", "");

  return {
    chapterTitle: `${cleanSubjectName} Chapter ${cleanChapterNum}`,
    chapterTitleHi: `${cleanSubjectName} अध्याय ${cleanChapterNum}`,
    questions: [
      {
        id: "gen-1",
        type: "short",
        marks: 2,
        difficulty: "Easy",
        question: `Explain the fundamental concepts discussed in Chapter ${cleanChapterNum} of ${cleanSubjectName}.`,
        questionHi: `${cleanSubjectName} के अध्याय ${cleanChapterNum} में वर्णित मुख्य अवधारणाओं को स्पष्ट करें।`,
        answer: `This chapter covers the essential principles, key definitions, and classroom examples aligned with NCERT curriculum guidelines.`,
        answerHi: `यह अध्याय NCERT पाठ्यक्रम के अनुसार महत्वपूर्ण सिद्धांतों, परिभाषाओं और कक्षा में चर्चा योग्य उदाहरणों को विस्तार से प्रस्तुत करता है।`,
        keyPoints: [
          "मुख्य परिभाषा एवं अवधारणा (Key definition & core concept)",
          "दैनिक जीवन में उपयोग (Applications in daily life)",
          "परीक्षा उपयोगी बिंदु (Exam-relevant highlight)"
        ]
      },
      {
        id: "gen-2",
        type: "long",
        marks: 5,
        difficulty: "Medium",
        question: `Discuss the long-term implications and analytical questions associated with Chapter ${cleanChapterNum}.`,
        questionHi: `अध्याय ${cleanChapterNum} से संबंधित विश्लेषणात्मक एवं दीर्घ उत्तरीय प्रश्न पर सविस्तार चर्चा करें।`,
        answer: `Students should analyze the step-by-step reasoning, compare with historical or practical precedents, and formulate structured conclusions.`,
        answerHi: `विद्यार्थियों को तर्कसंगत बिंदुओं का विश्लेषण करते हुए सटीक उत्तर लिखना चाहिए, जिसमें कारण, प्रभाव और मुख्य निष्कर्ष स्पष्ट रूप से शामिल हों।`,
        keyPoints: [
          "क्रमबद्ध विश्लेषण (Step-by-step analytical approach)",
          "कारण एवं प्रभाव का संबंध (Cause and effect relationships)",
          "सटीक निष्कर्ष (Structured concluding statement)"
        ]
      }
    ]
  };
}
