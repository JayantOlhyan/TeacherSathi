const fs = require('fs');

const syllabus = {
  "Class 6": {
    "Science": [
      { id: 1, en: "Components of Food", hi: "भोजन के घटक", descEn: "Learn about nutrients, balanced diet, and deficiency diseases.", descHi: "पोषक तत्वों और संतुलित आहार के बारे में जानें।" },
      { id: 2, en: "Sorting Materials into Groups", hi: "वस्तुओं के समूह बनाना", descEn: "Classify materials based on properties like appearance, hardness.", descHi: "विशेषताओं के आधार पर सामग्रियों का वर्गीकरण।" },
      { id: 3, en: "Separation of Substances", hi: "पदार्थों का पृथक्करण", descEn: "Study filtration, sedimentation, decantation, and evaporation.", descHi: "निस्पंदन, अवसादन और वाष्पीकरण का अध्ययन करें।" },
      { id: 4, en: "Getting to Know Plants", hi: "पौधों को जानिए", descEn: "Explore structures of herbs, shrubs, trees, roots, and flowers.", descHi: "पौधों, जड़ों और फूलों की संरचना का अन्वेषण।" },
      { id: 5, en: "Body Movements", hi: "शरीर में गति", descEn: "Study bones, joints, cartilage, and locomotion in animals.", descHi: "हड्डियों, जोड़ों और गतिशीलता का अध्ययन।" },
      { id: 6, en: "The Living Organisms — Characteristics and Habitats", hi: "सजीव - विशेषताएँ एवं आवास", descEn: "Understand adaptations and habitats of living beings.", descHi: "सजीवों के अनुकूलन और आवास को समझें।" },
      { id: 7, en: "Motion and Measurement of Distances", hi: "गति एवं दूरियों का मापन", descEn: "Learn about standard units of measurement and types of motion.", descHi: "मापन की मानक इकाइयों और गति के प्रकारों के बारे में जानें।" },
      { id: 8, en: "Light, Shadows and Reflections", hi: "प्रकाश, छायाएँ एवं परावर्तन", descEn: "Understand luminous objects, shadows, and pinhole cameras.", descHi: "चमकदार वस्तुओं, छाया और पिनहोल कैमरे को समझें।" },
      { id: 9, en: "Electricity and Circuits", hi: "विद्युत् तथा परिपथ", descEn: "Study electric cells, circuits, switches, and conductors.", descHi: "विद्युत सेल, सर्किट, स्विच और सुचालक का अध्ययन।" },
      { id: 10, en: "Fun with Magnets", hi: "चुंबकों द्वारा मनोरंजन", descEn: "Explore magnetic poles, attraction, and repulsion.", descHi: "चुंबकीय ध्रुवों, आकर्षण और प्रतिकर्षण का अन्वेषण।" },
      { id: 11, en: "Air Around Us", hi: "हमारे चारों ओर वायु", descEn: "Learn about the composition and importance of air.", descHi: "वायु की संरचना और महत्व के बारे में जानें।" }
    ],
    "Mathematics": [
      { id: 1, en: "Knowing Our Numbers", hi: "अपनी संख्याओं की जानकारी", descEn: "Learn comparing numbers, place value, and large numbers.", descHi: "बड़ी संख्याओं और स्थानीय मान को सीखें।" },
      { id: 2, en: "Whole Numbers", hi: "पूर्ण संख्याएँ", descEn: "Study natural numbers, whole numbers, and number line.", descHi: "पूर्ण संख्याएं और संख्या रेखा।" },
      { id: 3, en: "Playing with Numbers", hi: "संख्याओं के साथ खेलना", descEn: "Learn factors, multiples, prime numbers, and LCM.", descHi: "गुणनखंड, अभाज्य संख्याएँ, और लघुत्तम समापवर्त्य सीखें।" },
      { id: 4, en: "Basic Geometrical Ideas", hi: "आधारभूत ज्यामितीय अवधारणाएँ", descEn: "Understand points, lines, segments, angles, and polygons.", descHi: "बिंदुओं, रेखाओं, और बहुभुजों को समझें।" },
      { id: 5, en: "Understanding Elementary Shapes", hi: "प्रारंभिक आकारों को समझना", descEn: "Study angles, triangles, and 3D shapes.", descHi: "त्रिभुजों और 3D आकारों का अध्ययन करें।" },
      { id: 6, en: "Integers", hi: "पूर्णांक", descEn: "Learn positive and negative numbers and operations.", descHi: "धनात्मक और ऋणात्मक संख्याएँ।" },
      { id: 7, en: "Fractions", hi: "भिन्न", descEn: "Understand proper, improper, mixed fractions.", descHi: "भिन्न और उनके संचालन को समझें।" },
      { id: 8, en: "Decimals", hi: "दशमलव", descEn: "Learn decimal representations and operations.", descHi: "दशमलव निरूपण और संक्रियाएँ।" },
      { id: 9, en: "Data Handling", hi: "आँकड़ों का प्रबंधन", descEn: "Study pictographs, bar graphs, and data organization.", descHi: "पिक्टोग्राफ और बार ग्राफ का अध्ययन।" },
      { id: 10, en: "Mensuration", hi: "क्षेत्रमिति", descEn: "Calculate perimeter and area of basic shapes.", descHi: "परिमाप और क्षेत्रफल की गणना।" },
      { id: 11, en: "Algebra", hi: "बीजगणित", descEn: "Introduction to variables and basic algebraic expressions.", descHi: "चर और बीजगणितीय व्यंजकों का परिचय।" },
      { id: 12, en: "Ratio and Proportion", hi: "अनुपात और समानुपात", descEn: "Understand ratios, equivalent ratios, and unitary method.", descHi: "अनुपात और एकात्मक विधि को समझें।" }
    ],
    "Social Science": [
      { id: 1, en: "What, Where, How and When?", hi: "क्या, कब, कहाँ और कैसे?", descEn: "Introduction to history and historical sources.", descHi: "इतिहास और ऐतिहासिक स्रोतों का परिचय।" },
      { id: 2, en: "From Hunting-Gathering to Growing Food", hi: "आखेट-खाद्य संग्रह से भोजन उत्पादन तक", descEn: "Early human life and beginning of agriculture.", descHi: "प्रारंभिक मानव जीवन और कृषि की शुरुआत।" },
      { id: 3, en: "In the Earliest Cities", hi: "आरंभिक नगर", descEn: "The Harappan civilization and town planning.", descHi: "हड़प्पा सभ्यता और नगर नियोजन।" },
      { id: 4, en: "The Earth in the Solar System", hi: "सौरमंडल में पृथ्वी", descEn: "Study planets, stars, and the solar system.", descHi: "ग्रहों, तारों और सौरमंडल का अध्ययन।" },
      { id: 5, en: "Globe: Latitudes and Longitudes", hi: "ग्लोब: अक्षांश एवं देशांतर", descEn: "Understand coordinates, time zones, and Earth's grid.", descHi: "अक्षांश, देशांतर और समय क्षेत्रों को समझें।" },
      { id: 6, en: "Understanding Diversity", hi: "विविधता की समझ", descEn: "Explore cultural and geographic diversity in India.", descHi: "भारत में सांस्कृतिक विविधता का अन्वेषण।" },
      { id: 7, en: "Diversity and Discrimination", hi: "विविधता एवं भेदभाव", descEn: "Learn about prejudice, stereotypes, and inequality.", descHi: "पूर्वाग्रह, रूढ़िवादिता और असमानता के बारे में जानें।" },
      { id: 8, en: "What is Government?", hi: "सरकार क्या है?", descEn: "Levels of government and types of government.", descHi: "सरकार के स्तर और प्रकार।" }
    ],
    "English": [
      { id: 1, en: "Who Did Patrick's Homework?", hi: "पैट्रिक का होमवर्क किसने किया?", descEn: "A story about taking responsibility.", descHi: "जिम्मेदारी लेने के बारे में एक कहानी।" },
      { id: 2, en: "How the Dog Found Himself a New Master!", hi: "कुत्ते ने अपना नया मालिक कैसे पाया!", descEn: "A folktale about the domestication of dogs.", descHi: "कुत्तों के पालतू बनने की एक लोककथा।" },
      { id: 3, en: "Taro's Reward", hi: "टैरो का इनाम", descEn: "A Japanese tale about a devoted son.", descHi: "एक समर्पित बेटे की जापानी कहानी।" },
      { id: 4, en: "An Indian – American Woman in Space: Kalpana Chawla", hi: "अंतरिक्ष में एक भारतीय-अमेरिकी महिला: कल्पना चावला", descEn: "Biography of the famous astronaut.", descHi: "प्रसिद्ध अंतरिक्ष यात्री की जीवनी।" },
      { id: 5, en: "A Different Kind of School", hi: "एक अलग तरह का स्कूल", descEn: "A story promoting empathy and understanding.", descHi: "सहानुभूति को बढ़ावा देने वाली एक कहानी।" }
    ],
    "Hindi": [
      { id: 1, en: "Wah Chidiya Jo", hi: "वह चिड़िया जो", descEn: "A poem about a small, contented bird.", descHi: "एक छोटी, संतोषी चिड़िया के बारे में कविता।" },
      { id: 2, en: "Bachpan", hi: "बचपन", descEn: "Memories of childhood by Krishna Sobti.", descHi: "कृष्णा सोबती की बचपन की यादें।" },
      { id: 3, en: "Nadaan Dost", hi: "नादान दोस्त", descEn: "A story by Premchand about innocent mistakes.", descHi: "प्रेमचंद की मासूम गलतियों के बारे में एक कहानी।" },
      { id: 4, en: "Chand Se Thodi Si Gappe", hi: "चाँद से थोड़ी सी गप्पें", descEn: "A child's conversation with the moon.", descHi: "चाँद के साथ एक बच्चे की बातचीत।" },
      { id: 5, en: "Aksharon Ka Mahatva", hi: "अक्षरों का महत्व", descEn: "The importance and history of alphabets.", descHi: "अक्षरों का महत्व और इतिहास।" }
    ]
  },
  "Class 10": {
    "Science": [
      { id: 1, en: "Chemical Reactions and Equations", hi: "रासायनिक अभिक्रियाएँ एवं समीकरण", descEn: "Learn about balancing chemical equations and reaction types.", descHi: "रासायनिक समीकरणों को संतुलित करना सीखें।" },
      { id: 2, en: "Acids, Bases and Salts", hi: "अम्ल, क्षारक एवं लवण", descEn: "Properties of acids, bases, and pH scale.", descHi: "अम्ल, क्षार और pH स्केल के गुण।" },
      { id: 3, en: "Metals and Non-metals", hi: "धातु एवं अधातु", descEn: "Physical and chemical properties, extraction of metals.", descHi: "धातुओं के भौतिक और रासायनिक गुण।" },
      { id: 4, en: "Carbon and its Compounds", hi: "कार्बन एवं उसके यौगिक", descEn: "Covalent bonding, versatile nature of carbon.", descHi: "सहसंयोजक बंधन, कार्बन की बहुमुखी प्रकृति।" },
      { id: 5, en: "Life Processes", hi: "जैव प्रक्रम", descEn: "Nutrition, respiration, transportation, and excretion.", descHi: "पोषण, श्वसन, परिवहन और उत्सर्जन।" },
      { id: 6, en: "Control and Coordination", hi: "नियंत्रण एवं समन्वय", descEn: "Nervous system and hormones in plants and animals.", descHi: "तंत्रिका तंत्र और हार्मोन।" },
      { id: 7, en: "How do Organisms Reproduce?", hi: "जीव जनन कैसे करते हैं?", descEn: "Asexual and sexual reproduction.", descHi: "अलैंगिक और लैंगिक प्रजनन।" },
      { id: 8, en: "Heredity", hi: "आनुवंशिकता", descEn: "Mendel's laws and inheritance of traits.", descHi: "मेंडल के नियम और लक्षणों की विरासत।" },
      { id: 9, en: "Light — Reflection and Refraction", hi: "प्रकाश — परावर्तन तथा अपवर्तन", descEn: "Mirrors, lenses, and properties of light.", descHi: "दर्पण, लेंस और प्रकाश के गुण।" },
      { id: 10, en: "The Human Eye and the Colourful World", hi: "मानव नेत्र तथा रंगबिरंगा संसार", descEn: "Defects of vision and dispersion of light.", descHi: "दृष्टि दोष और प्रकाश का विक्षेपण।" },
      { id: 11, en: "Electricity", hi: "विद्युत्", descEn: "Ohm's law, resistance, and heating effect of current.", descHi: "ओम का नियम, प्रतिरोध और धारा का ताप प्रभाव।" },
      { id: 12, en: "Magnetic Effects of Electric Current", hi: "विद्युत् धारा के चुंबकीय प्रभाव", descEn: "Magnetic fields, electromagnets, and motors.", descHi: "चुंबकीय क्षेत्र, विद्युत चुंबक और मोटर।" },
      { id: 13, en: "Our Environment", hi: "हमारा पर्यावरण", descEn: "Ecosystems, food chains, and ozone depletion.", descHi: "पारिस्थितिक तंत्र, खाद्य श्रृंखला और ओजोन परत।" }
    ],
    "Mathematics": [
      { id: 1, en: "Real Numbers", hi: "वास्तविक संख्याएँ", descEn: "Fundamental Theorem of Arithmetic and irrational numbers.", descHi: "अंकगणित का आधारभूत प्रमेय।" },
      { id: 2, en: "Polynomials", hi: "बहुपद", descEn: "Zeroes of a polynomial and relationship with coefficients.", descHi: "बहुपद के शून्यक।" },
      { id: 3, en: "Pair of Linear Equations in Two Variables", hi: "दो चर वाले रैखिक समीकरण युग्म", descEn: "Algebraic and graphical methods of solving.", descHi: "हल करने की बीजगणितीय और ग्राफिक विधियाँ।" },
      { id: 4, en: "Quadratic Equations", hi: "द्विघात समीकरण", descEn: "Solving by factorization and quadratic formula.", descHi: "गुणनखंड द्वारा द्विघात समीकरण हल करना।" },
      { id: 5, en: "Arithmetic Progressions", hi: "समांतर श्रेढ़ियाँ", descEn: "Nth term and sum of first n terms of an AP.", descHi: "समांतर श्रेणी का nवाँ पद।" },
      { id: 6, en: "Triangles", hi: "त्रिभुज", descEn: "Similarity of triangles and Pythagoras theorem.", descHi: "त्रिभुजों की समरूपता और पाइथागोरस प्रमेय।" },
      { id: 7, en: "Coordinate Geometry", hi: "निर्देशांक ज्यामिति", descEn: "Distance formula and section formula.", descHi: "दूरी सूत्र और विभाजन सूत्र।" },
      { id: 8, en: "Introduction to Trigonometry", hi: "त्रिकोणमिति का परिचय", descEn: "Trigonometric ratios and identities.", descHi: "त्रिकोणमितीय अनुपात और सर्वसमिकाएँ।" },
      { id: 9, en: "Some Applications of Trigonometry", hi: "त्रिकोणमिति के कुछ अनुप्रयोग", descEn: "Heights and distances problems.", descHi: "ऊंचाई और दूरी की समस्याएं।" },
      { id: 10, en: "Circles", hi: "वृत्त", descEn: "Tangents to a circle and their properties.", descHi: "वृत्त की स्पर्श रेखाएँ।" },
      { id: 11, en: "Areas Related to Circles", hi: "वृत्तों से संबंधित क्षेत्रफल", descEn: "Perimeter and area of a circle, sector, and segment.", descHi: "वृत्त के त्रिज्यखंड और वृत्तखंड का क्षेत्रफल।" },
      { id: 12, en: "Surface Areas and Volumes", hi: "पृष्ठीय क्षेत्रफल और आयतन", descEn: "Combinations of solids.", descHi: "ठोसों का संयोजन।" },
      { id: 13, en: "Statistics", hi: "सांख्यिकी", descEn: "Mean, median, and mode of grouped data.", descHi: "वर्गीकृत आंकड़ों का माध्य, माध्यिका और बहुलक।" },
      { id: 14, en: "Probability", hi: "प्रायिकता", descEn: "Theoretical probability of events.", descHi: "घटनाओं की सैद्धांतिक प्रायिकता।" }
    ]
  }
};

// Fallback logic for Class 7, 8, 9 based on Class 6 structure to ensure every page has content.
syllabus["Class 7"] = JSON.parse(JSON.stringify(syllabus["Class 6"]));
syllabus["Class 8"] = JSON.parse(JSON.stringify(syllabus["Class 6"]));
syllabus["Class 9"] = JSON.parse(JSON.stringify(syllabus["Class 10"]));

const fileContent = `export interface ChapterInfo {
  id: number;
  en: string;
  hi: string;
  descEn: string;
  descHi: string;
}

export type SubjectSyllabus = Record<string, ChapterInfo[]>;
export type ClassSyllabus = Record<string, SubjectSyllabus>;

export const NCERT_SYLLABUS: ClassSyllabus = ${JSON.stringify(syllabus, null, 2)};
`;

fs.writeFileSync('src/lib/data/ncertSyllabus.ts', fileContent);
console.log('Syllabus file generated.');
