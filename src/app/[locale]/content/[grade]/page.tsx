"use client";

import { useState, useMemo } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Lock, BookOpen, Search, LayoutGrid, CheckCircle2, ChevronRight, Compass, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  id: number;
  titleEn: string;
  titleHi: string;
  isLocked: boolean;
  descriptionEn?: string;
  descriptionHi?: string;
  resources: {
    video?: boolean;
    quiz?: boolean;
    mindmap?: boolean;
    lessonPlan?: boolean;
  };
}

interface SubjectData {
  name: string;
  hiName: string;
  color: string; // Gradient source
  textColor: string;
  borderColor: string;
  shadowColor: string;
  chapters: Chapter[];
}

// Complete bilingual NCERT metadata for Classes 6-10
const CONTENT_DATABASE: Record<string, SubjectData[]> = {
  "Class 8": [
    {
      name: "Science",
      hiName: "विज्ञान",
      color: "from-teal-600 to-emerald-700",
      textColor: "text-teal-600",
      borderColor: "border-teal-700/30",
      shadowColor: "shadow-teal-900/30",
      chapters: [
        {
          id: 1,
          titleEn: "Crop Production & Management",
          titleHi: "फसल उत्पादन एवं प्रबंध",
          isLocked: false,
          descriptionEn: "Learn about agricultural practices, sowing, irrigation, and harvesting methods.",
          descriptionHi: "कृषि पद्धतियों, बुवाई, सिंचाई और कटाई के तरीकों के बारे में जानें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 2,
          titleEn: "Microorganisms: Friend & Foe",
          titleHi: "सूक्ष्मजीव: मित्र एवं शत्रु",
          isLocked: false,
          descriptionEn: "Explore the invisible world of microbes, their benefits, and harmful effects.",
          descriptionHi: "सूक्ष्मजीवों की अदृश्य दुनिया, उनके लाभ और हानिकारक प्रभावों का पता लगाएं।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 3,
          titleEn: "Coal & Petroleum",
          titleHi: "कोयला और पेट्रोलियम",
          isLocked: false,
          descriptionEn: "Study exhaustible natural resources, fossil fuels, and their conservation.",
          descriptionHi: "समाप्त होने वाले प्राकृतिक संसाधनों, जीवाश्म ईंधन और उनके संरक्षण का अध्ययन करें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 4,
          titleEn: "Combustion & Flame",
          titleHi: "दहन और ज्वाला",
          isLocked: false,
          descriptionEn: "Understand chemical processes of burning, structure of flames, and fuels.",
          descriptionHi: "जलने की रासायनिक प्रक्रियाओं, ज्वाला की संरचना और ईंधनों को समझें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 5,
          titleEn: "Conservation of Plants & Animals",
          titleHi: "पौधे एवं जंतुओं का संरक्षण",
          isLocked: false,
          descriptionEn: "Explore biodiversity hotspots, wildlife sanctuaries, and deforestation impacts.",
          descriptionHi: "जैव विविधता, वन्यजीव अभ्यारण्य और वनों की कटाई के प्रभावों का अन्वेषण करें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 6,
          titleEn: "Reproduction in Animals",
          titleHi: "जंतुओं में जनन",
          isLocked: false,
          descriptionEn: "Study modes of animal reproduction, fertilization, and developmental stages.",
          descriptionHi: "जंतुओं में जनन की विधियों, निषेचन और विकास के चरणों का अध्ययन करें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 7,
          titleEn: "Reaching the Age of Adolescence",
          titleHi: "किशोरावस्था की ओर",
          isLocked: false,
          descriptionEn: "Understand physical changes, hormones, and reproductive health in teens.",
          descriptionHi: "किशोरों में शारीरिक परिवर्तन, हार्मोन और जनन स्वास्थ्य को समझें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 8,
          titleEn: "Force & Pressure",
          titleHi: "बल तथा दाब",
          isLocked: false,
          descriptionEn: "Explore types of forces, atmospheric pressure, and contact actions.",
          descriptionHi: "बलों के प्रकार, वायुमंडलीय दाब और संपर्क क्रियाओं का पता लगाएं।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 9,
          titleEn: "Friction",
          titleHi: "घर्षण",
          isLocked: false,
          descriptionEn: "Understand factors affecting friction, its advantages, and reduction techniques.",
          descriptionHi: "घर्षण को प्रभावित करने वाले कारकों, इसके लाभों और कम करने की तकनीकों को समझें।",
          resources: { video: false, quiz: false, mindmap: true, lessonPlan: false }
        },
        {
          id: 10,
          titleEn: "Sound",
          titleHi: "ध्वनि",
          isLocked: false,
          descriptionEn: "Learn how sound is produced, propagated, and heard by the human ear.",
          descriptionHi: "जानें कि ध्वनि कैसे उत्पन्न होती है, कैसे फैलती है और मानव कान द्वारा कैसे सुनी जाती है।",
          resources: { video: false, quiz: false, mindmap: false, lessonPlan: false }
        },
        {
          id: 11,
          titleEn: "Chemical Effects of Electric Current",
          titleHi: "विद्युत धारा के रासायनिक प्रभाव",
          isLocked: false,
          descriptionEn: "Explore conduction in liquids and the process of electroplating.",
          descriptionHi: "तरल पदार्थों में विद्युत चालन और इलेक्ट्रोप्लेटिंग की प्रक्रिया का अन्वेषण करें।",
          resources: { video: false, quiz: false, mindmap: false, lessonPlan: false }
        },
        {
          id: 12,
          titleEn: "Some Natural Phenomena",
          titleHi: "कुछ प्राकृतिक परिघटनाएँ",
          isLocked: false,
          descriptionEn: "Study natural events like lightning, static charges, and earthquakes.",
          descriptionHi: "बिजली, स्थैतिक आवेश और भूकंप जैसी प्राकृतिक घटनाओं का अध्ययन करें।",
          resources: { video: false, quiz: false, mindmap: false, lessonPlan: false }
        }
      ]
    },
    {
      name: "Mathematics",
      hiName: "गणित",
      color: "from-rose-600 to-amber-700",
      textColor: "text-rose-600",
      borderColor: "border-rose-700/30",
      shadowColor: "shadow-rose-900/30",
      chapters: [
        {
          id: 1,
          titleEn: "Rational Numbers",
          titleHi: "परिमेय संख्याएँ",
          isLocked: false,
          descriptionEn: "Understand properties of rational numbers, representation on number lines.",
          descriptionHi: "परिमेय संख्याओं के गुणों, संख्या रेखा पर उनके निरूपण को समझें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 2,
          titleEn: "Linear Equations in One Variable",
          titleHi: "एक चर वाले रैखिक समीकरण",
          isLocked: false,
          descriptionEn: "Solve equations with linear expressions on one or both sides.",
          descriptionHi: "एक या दोनों पक्षों में रैखिक व्यंजकों वाले समीकरणों को हल करें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 3,
          titleEn: "Understanding Quadrilaterals",
          titleHi: "चतुर्भुजों को समझना",
          isLocked: false,
          descriptionEn: "Explore polygons, types of quadrilaterals like parallelograms.",
          descriptionHi: "बहुभुजों, समांतर चतुर्भुज जैसे चतुर्भुजों के प्रकारों का अन्वेषण करें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 4,
          titleEn: "Data Handling",
          titleHi: "आँकड़ों का प्रबंधन",
          isLocked: false,
          descriptionEn: "Organize data using bar graphs, pie charts, and simple probability.",
          descriptionHi: "बार ग्राफ, पाई चार्ट और सरल प्रायिकता का उपयोग करके डेटा व्यवस्थित करें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 5,
          titleEn: "Squares and Square Roots",
          titleHi: "वर्ग और वर्गमूल",
          isLocked: false,
          descriptionEn: "Learn square numbers, properties, and methods to find square roots.",
          descriptionHi: "वर्ग संख्याएं, उनके गुण और वर्गमूल ज्ञात करने की विधियां सीखें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 6,
          titleEn: "Cubes and Cube Roots",
          titleHi: "घन और घनमूल",
          isLocked: false,
          descriptionEn: "Understand cube numbers and prime factorization for cube roots.",
          descriptionHi: "घन संख्याओं और घनमूल के लिए अभाज्य गुणनखंडन को समझें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 7,
          titleEn: "Comparing Quantities",
          titleHi: "राशियों की तुलना",
          isLocked: false,
          descriptionEn: "Learn ratios, percentages, discounts, profit/loss, and compound interest.",
          descriptionHi: "अनुपात, प्रतिशत, बट्टा, लाभ/हानि और चक्रवृद्धि ब्याज सीखें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 8,
          titleEn: "Algebraic Expressions & Identities",
          titleHi: "बीजीय व्यंजक और सर्वसमिकाएँ",
          isLocked: false,
          descriptionEn: "Understand terms, factors, coefficients, and standard algebraic identities.",
          descriptionHi: "पदों, गुणनखंडों, गुणांकों और मानक बीजीय सर्वसमिकाओं को समझें।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 9,
          titleEn: "Mensuration",
          titleHi: "क्षेत्रमिति",
          isLocked: false,
          descriptionEn: "Calculate area and volume of trapeziums, cuboids, cylinders, and prisms.",
          descriptionHi: "समलंब, घनाभ, बेलन और प्रिज्म के क्षेत्रफल और आयतन की गणना करें।",
          resources: { video: false, quiz: false, mindmap: true, lessonPlan: false }
        },
        {
          id: 10,
          titleEn: "Exponents and Powers",
          titleHi: "घातांक और घात",
          isLocked: false,
          descriptionEn: "Apply laws of exponents for negative powers and scientific notations.",
          descriptionHi: "ऋणात्मक घातों और वैज्ञानिक संकेतनों के लिए घातांक के नियमों को लागू करें।",
          resources: { video: false, quiz: false, mindmap: false, lessonPlan: false }
        }
      ]
    },
    {
      name: "Social Science",
      hiName: "सामाजिक विज्ञान",
      color: "from-amber-600 to-yellow-800",
      textColor: "text-amber-600",
      borderColor: "border-amber-700/30",
      shadowColor: "shadow-amber-900/30",
      chapters: [
        {
          id: 1,
          titleEn: "How, When and Where",
          titleHi: "कैसे, कब और कहाँ",
          isLocked: false,
          descriptionEn: "Introduction to historical timelines, periodization, and administrative records.",
          descriptionHi: "ऐतिहासिक समय-सीमाओं, काल-विभाजन और प्रशासनिक अभिलेखों का परिचय।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 2,
          titleEn: "From Trade to Territory",
          titleHi: "व्यापार से साम्राज्य तक",
          isLocked: false,
          descriptionEn: "How the East India Company established its ruling power in India.",
          descriptionHi: "ईस्ट इंडिया कंपनी ने भारत में अपनी सत्ता कैसे स्थापित की।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 3,
          titleEn: "Ruling the Countryside",
          titleHi: "ग्रामीण क्षेत्र पर शासन चलाना",
          isLocked: false,
          descriptionEn: "Land revenue systems, permanent settlements, and indigo cultivation struggles.",
          descriptionHi: "भू-राजस्व प्रणालियाँ, स्थायी बंदोबस्त और नील की खेती के संघर्ष।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 4,
          titleEn: "Tribals, Dikus & Golden Age",
          titleHi: "आदिवासी, दीकु और स्वर्ण युग",
          isLocked: false,
          descriptionEn: "Study tribal lifestyles, forest laws, and Birsa Munda's rebellion.",
          descriptionHi: "आदिवासी जीवन शैली, वन कानूनों और बिरसा मुंडा के विद्रोह का अध्ययन।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 5,
          titleEn: "When People Rebel: 1857",
          titleHi: "जब जनता बगावत करती है: 1857",
          isLocked: false,
          descriptionEn: "Causes, main events, and consequences of the Great Revolt of 1857.",
          descriptionHi: "1857 के महान विद्रोह के कारण, प्रमुख घटनाएँ और परिणाम।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 6,
          titleEn: "Civilising the Native, Educating Nation",
          titleHi: "देशी जनता को सभ्य बनाना, राष्ट्र को शिक्षित करना",
          isLocked: false,
          descriptionEn: "British policies on education, orientalists, and Mahatma Gandhi's views.",
          descriptionHi: "शिक्षा पर ब्रिटिश नीतियां, प्राच्यवादी और महात्मा गांधी के विचार।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 7,
          titleEn: "Women, Caste and Reform",
          titleHi: "महिलाएँ, जाति एवं सुधार",
          isLocked: false,
          descriptionEn: "Sati abolition, widow remarriage, caste discrimination, and social reformers.",
          descriptionHi: "सती प्रथा उन्मूलन, विधवा पुनर्विवाह, जातिगत भेदभाव और समाज सुधारक।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 8,
          titleEn: "The Making of National Movement",
          titleHi: "राष्ट्रीय आंदोलन का संघटन",
          isLocked: false,
          descriptionEn: "Rise of nationalism, role of Congress, Rowlatt Satyagraha, and Independence.",
          descriptionHi: "राष्ट्रवाद का उदय, कांग्रेस की भूमिका, रॉलेट सत्याग्रह और स्वतंत्रता।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        }
      ]
    },
    {
      name: "English",
      hiName: "अंग्रेज़ी",
      color: "from-blue-600 to-indigo-800",
      textColor: "text-blue-600",
      borderColor: "border-blue-700/30",
      shadowColor: "shadow-blue-900/30",
      chapters: [
        {
          id: 1,
          titleEn: "The Best Christmas Present in the World",
          titleHi: "दुनिया का सबसे अच्छा क्रिसमस उपहार",
          isLocked: false,
          descriptionEn: "A touching story about a war-time letter discovered in an old desk.",
          descriptionHi: "एक पुराने डेस्क में मिले युद्धकालीन पत्र के बारे में एक मार्मिक कहानी।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 2,
          titleEn: "The Tsunami",
          titleHi: "सुनामी",
          isLocked: false,
          descriptionEn: "Real stories of survival and courage during the devastating 2004 tsunami.",
          descriptionHi: "2004 की विनाशकारी सुनामी के दौरान जीवित रहने और साहस की वास्तविक कहानियाँ।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 3,
          titleEn: "Glimpses of the Past",
          titleHi: "अतीत की झलकियाँ",
          isLocked: false,
          descriptionEn: "A pictorial history of the events that led to the First War of Independence in 1857.",
          descriptionHi: "1857 में स्वतंत्रता के पहले युद्ध की ओर ले जाने वाली घटनाओं का एक सचित्र इतिहास।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 4,
          titleEn: "Bepin Choudhury's Lapse of Memory",
          titleHi: "बिपिन चौधरी की याददाश्त का जाना",
          isLocked: false,
          descriptionEn: "A humorous and suspenseful tale of a man tricked into believing he lost his memory.",
          descriptionHi: "एक आदमी की मजाकिया और रहस्यमयी कहानी जिसे यह विश्वास दिलाया गया कि वह अपनी याददाश्त खो चुका है।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 5,
          titleEn: "The Summit Within",
          titleHi: "भीतर का शिखर",
          isLocked: false,
          descriptionEn: "Major H.P.S. Ahluwalia shares his experiences of climbing Mount Everest and the inner summit.",
          descriptionHi: "मेजर एच.पी.एस. अहलूवालिया ने माउंट एवरेस्ट पर चढ़ने और आंतरिक शिखर के अपने अनुभवों को साझा किया।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 6,
          titleEn: "This is Jody's Fawn",
          titleHi: "यह जोडी का शावक है",
          isLocked: false,
          descriptionEn: "A heartwarming story of a young boy's determination to save and raise an orphaned fawn.",
          descriptionHi: "एक युवा लड़के के अनाथ हिरन के बच्चे को बचाने और पालने के दृढ़ संकल्प की एक दिल छू लेने वाली कहानी।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 7,
          titleEn: "A Visit to Cambridge",
          titleHi: "कैंब्रिज की एक यात्रा",
          isLocked: false,
          descriptionEn: "An inspiring conversation between Stephen Hawking and Firdaus Kanga on life and disabilities.",
          descriptionHi: "स्टीफन हॉकिंग और फिरदौस कांगा के बीच जीवन और विकलांगता पर एक प्रेरणादायक बातचीत।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 8,
          titleEn: "A Short Monsoon Diary",
          titleHi: "मानसून की एक संक्षिप्त डायरी",
          isLocked: false,
          descriptionEn: "Extracts from Ruskin Bond's diary reflecting on nature's beauty during the monsoon.",
          descriptionHi: "मानसून के दौरान प्रकृति की सुंदरता को दर्शाते हुए रस्किन बॉन्ड की डायरी के अंश।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        }
      ]
    },
    {
      name: "Hindi",
      hiName: "हिंदी",
      color: "from-orange-600 to-amber-700",
      textColor: "text-orange-600",
      borderColor: "border-orange-700/30",
      shadowColor: "shadow-orange-900/30",
      chapters: [
        {
          id: 1,
          titleEn: "Dhwani",
          titleHi: "ध्वनि (कविता)",
          isLocked: false,
          descriptionEn: "A beautiful poem about spring, hope, and youthfulness by Suryakant Tripathi 'Nirala'.",
          descriptionHi: "सूर्यकांत त्रिपाठी 'निराला' द्वारा वसंत, आशा और यौवन के बारे में एक सुंदर कविता।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 2,
          titleEn: "Lakh ki Chudiyan",
          titleHi: "लाख की चूड़ियाँ",
          isLocked: false,
          descriptionEn: "A touching story about traditional lacquer craftsmen displaced by industrialization.",
          descriptionHi: "औद्योगीकरण के कारण विस्थापित हुए पारंपरिक लाख के शिल्पकारों के बारे में एक मार्मिक कहानी।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 3,
          titleEn: "Bus ki Yatra",
          titleHi: "बस की यात्रा",
          isLocked: false,
          descriptionEn: "A satirical essay on the poor state of public transport in rural India.",
          descriptionHi: "ग्रामीण भारत में सार्वजनिक परिवहन की खराब स्थिति पर एक व्यंग्यात्मक निबंध।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 4,
          titleEn: "Deewanon ki Hasti",
          titleHi: "दीवानों की हस्ती",
          isLocked: false,
          descriptionEn: "A poem Celebrating freedom, selflessness, and the joyful spirit of life.",
          descriptionHi: "स्वतंत्रता, निस्वार्थता और जीवन की आनंदमय भावना का जश्न मनाने वाली कविता।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 5,
          titleEn: "Chithiyon ki Anokhi Duniya",
          titleHi: "चिट्ठियों की अनूठी दुनिया",
          isLocked: false,
          descriptionEn: "Explore the historic and cultural importance of letters in human communication.",
          descriptionHi: "मानव संचार में पत्रों के ऐतिहासिक और सांस्कृतिक महत्व का पता लगाएं।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 6,
          titleEn: "Bhagwan ke Dakiye",
          titleHi: "भगवान के डाकिये",
          isLocked: false,
          descriptionEn: "Ramdhari Singh 'Dinkar' describes birds and clouds as messengers of peace and unity.",
          descriptionHi: "रामधारी सिंह 'दिनकर' ने पक्षियों और बादलों को शांति और एकता के दूत के रूप में वर्णित किया है।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 7,
          titleEn: "Kya Nirash Hua Jaye",
          titleHi: "क्या निराश हुआ जाए",
          isLocked: false,
          descriptionEn: "An essay exploring optimism, moral values, and hope in modern society.",
          descriptionHi: "आधुनिक समाज में आशावाद, नैतिक मूल्यों और उम्मीदों की खोज करने वाला एक निबंध।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        },
        {
          id: 8,
          titleEn: "Yeh Sabse Kathin Samay Nahi",
          titleHi: "यह सबसे कठिन समय नहीं",
          isLocked: false,
          descriptionEn: "Jaya Jadauni's hopeful poem reminding us that challenges are only temporary.",
          descriptionHi: "जया जादवानी की आशावादी कविता जो हमें याद दिलाती है कि चुनौतियाँ केवल अस्थायी हैं।",
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        }
      ]
    }
  ]
};

// Autogenerate matching mocks for other classes to prevent blank pages
const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SUBJECTS_CONFIG = [
  { name: "Science", hiName: "विज्ञान", color: "from-teal-600 to-emerald-700", textColor: "text-teal-600", borderColor: "border-teal-700/30", shadowColor: "shadow-teal-900/30" },
  { name: "Mathematics", hiName: "गणित", color: "from-rose-600 to-amber-700", textColor: "text-rose-600", borderColor: "border-rose-700/30", shadowColor: "shadow-rose-900/30" },
  { name: "Social Science", hiName: "सामाजिक विज्ञान", color: "from-amber-600 to-yellow-800", textColor: "text-amber-600", borderColor: "border-amber-700/30", shadowColor: "shadow-amber-900/30" },
  { name: "English", hiName: "अंग्रेज़ी", color: "from-blue-600 to-indigo-800", textColor: "text-blue-600", borderColor: "border-blue-700/30", shadowColor: "shadow-blue-900/30" },
  { name: "Hindi", hiName: "हिंदी", color: "from-orange-600 to-amber-700", textColor: "text-orange-600", borderColor: "border-orange-700/30", shadowColor: "shadow-orange-900/30" }
];

const MOCK_CHAPTERS_INFO: Record<string, Array<{ en: string; hi: string; descEn: string; descHi: string }>> = {
  "Science": [
    { en: "Food: Where does it come from?", hi: "भोजन: यह कहाँ से आता है?", descEn: "Understand sources of food, plant parts, and animal products.", descHi: "भोजन के स्रोतों, पौधों के भागों और पशु उत्पादों को समझें।" },
    { en: "Components of Food", hi: "भोजन के घटक", descEn: "Learn about nutrients, balanced diet, and deficiency diseases.", descHi: "पोषक तत्वों, संतुलित आहार और कमी से होने वाले रोगों के बारे में जानें।" },
    { en: "Fibre to Fabric", hi: "तंतु से वस्त्र तक", descEn: "Understand natural and synthetic fibres, spinning, and weaving.", descHi: "प्राकृतिक और सिंथेटिक फाइबर, कताई और बुनाई को समझें।" },
    { en: "Sorting Materials into Groups", hi: "वस्तुओं के समूह बनाना", descEn: "Classify materials based on properties like appearance, hardness.", descHi: "दिखावट, कठोरता जैसी विशेषताओं के आधार पर सामग्रियों का वर्गीकरण।" },
    { en: "Separation of Substances", hi: "पदार्थों का पृथक्करण", descEn: "Study filtration, sedimentation, decantation, and evaporation.", descHi: "निस्पंदन, अवसादन, निस्तारण और वाष्पीकरण का अध्ययन करें।" },
    { en: "Changes Around Us", hi: "हमारे चारों ओर के परिवर्तन", descEn: "Understand reversible and irreversible changes in daily life.", descHi: "दैनिक जीवन में प्रतिवर्ती और अप्रतिवर्ती परिवर्तनों को समझें।" },
    { en: "Getting to Know Plants", hi: "पौधों को जानिए", descEn: "Explore structures of herbs, shrubs, trees, roots, and flowers.", descHi: "जड़ी-बूटियों, झाड़ियों, पेड़ों, जड़ों और फूलों की संरचना का अन्वेषण।" },
    { en: "Body Movements", hi: "शरीर में गति", descEn: "Study bones, joints, cartilage, and locomotion in animals.", descHi: "जंतुओं में हड्डियों, जोड़ों, उपास्थि और गतिशीलता का अध्ययन।" }
  ],
  "Mathematics": [
    { en: "Knowing Our Numbers", hi: "अपनी संख्याओं की जानकारी", descEn: "Learn comparing numbers, place value, and large numbers.", descHi: "संख्याओं की तुलना, स्थानीय मान और बड़ी संख्याओं को सीखें।" },
    { en: "Whole Numbers", hi: "पूर्ण संख्याएँ", descEn: "Study natural numbers, whole numbers, and number line operations.", descHi: "प्राकृतिक संख्याएं, पूर्ण संख्याएं और संख्या रेखा संक्रियाएं।" },
    { en: "Playing with Numbers", hi: "संख्याओं के साथ खेलना", descEn: "Learn factors, multiples, prime numbers, HCF, and LCM.", descHi: "गुणनखंड, गुणज, अभाज्य संख्याएँ, महत्तम समापवर्तक और लघुत्तम समापवर्त्य सीखें।" },
    { en: "Basic Geometrical Ideas", hi: "आधारभूत ज्यामितीय अवधारणाएँ", descEn: "Understand points, lines, segments, angles, and polygons.", descHi: "बिंदुओं, रेखाओं, रेखाखंडों, कोणों और बहुभुजों को समझें।" },
    { en: "Understanding Elementary Shapes", hi: "प्रारंभिक आकारों को समझना", descEn: "Study angles, triangles, quadrilaterals, and 3D shapes.", descHi: "कोणों, त्रिभुजों, चतुर्भुजों और 3D आकारों का अध्ययन करें।" },
    { en: "Integers", hi: "पूर्णांक", descEn: "Learn positive and negative numbers, operations, and ordering.", descHi: "धनात्मक और ऋणात्मक संख्याएँ, संक्रियाएँ और उनका क्रम सीखें।" },
    { en: "Fractions", hi: "भिन्न", descEn: "Understand proper, improper, mixed fractions, and operations.", descHi: "उचित, अनुचित, मिश्रित भिन्नों और उनके संचालन को समझें।" },
    { en: "Decimals", hi: "दशमलव", descEn: "Learn decimal representations, place value, and addition/subtraction.", descHi: "दशमलव निरूपण, स्थानीय मान और जोड़/घटाव सीखें।" }
  ],
  "Social Science": [
    { en: "An Introduction: How, When and Where", hi: "इतिहास: कब, कहाँ और कैसे", descEn: "Study the importance of dates and historical sources.", descHi: "तिथियों और ऐतिहासिक स्रोतों के महत्व का अध्ययन करें।" },
    { en: "On the Trail of the Earliest People", hi: "आखेट-खाद्य संग्रह से भोजन उत्पादन तक", descEn: "Explore paleolithic hunters, gatherers, and early agriculture.", descHi: "पुरापाषाणकालीन शिकारियों, संग्रहकर्ताओं और प्रारंभिक कृषि का अन्वेषण।" },
    { en: "From Gathering to Growing Food", hi: "भोजन: संग्रह से उत्पादन तक", descEn: "Understand domestication of animals and crop production.", descHi: "पशुओं के पालतू बनाने और फसल उत्पादन की शुरुआत को समझें।" },
    { en: "In the Earliest Cities", hi: "आरंभिक नगर", descEn: "Study Harappan civilization, town planning, and architecture.", descHi: "हड़प्पा सभ्यता, नगर नियोजन और वास्तुकला का अध्ययन।" },
    { en: "What Books and Burials Tell Us", hi: "क्या बताती हैं हमें किताबें और कब्रें", descEn: "Learn about Rigveda, megaliths, and early social structures.", descHi: "Rigveda, megaliths और प्रारंभिक सामाजिक संरचनाओं के बारे में जानें।" },
    { en: "Kingdoms, Kings and an Early Republic", hi: "राज्य, राजा और एक प्राचीन गणराज्य", descEn: "Explore Janapadas, Mahajanapadas, and the Magadha empire.", descHi: "जनपदों, महाजनपदों और मगध साम्राज्य का अन्वेषण करें।" },
    { en: "New Questions and Ideas", hi: "नए प्रश्न नए विचार", descEn: "Understand teachings of Buddha, Upanishads, and Mahavira.", descHi: "बुद्ध, उपनिषदों और महावीर की शिक्षाओं को समझें।" },
    { en: "Ashoka, The Emperor Who Gave Up War", hi: "अशोक: एक अनोखा सम्राट जिसने युद्ध का त्याग किया", descEn: "Study Ashoka's Dhamma, Mauryan administration, and Kalinga war.", descHi: "अशोक के धम्म, मौर्य प्रशासन और कलिंग युद्ध का अध्ययन करें।" }
  ],
  "English": [
    { en: "A Letter to God", hi: "भगवान के नाम पत्र", descEn: "A story about a farmer's absolute faith in God.", descHi: "ईश्वर में एक किसान के अटूट विश्वास की कहानी।" },
    { en: "Long Walk to Freedom", hi: "आज़ादी की लंबी यात्रा", descEn: "Nelson Mandela's journey against apartheid in South Africa.", descHi: "दक्षिण अफ्रीका में रंगभेद के खिलाफ नेल्सन मंडेला की यात्रा।" },
    { en: "Two Stories about Flying", hi: "उड़ने के बारे में दो कहानियाँ", descEn: "Inspiring tales of overcoming fear and taking flight.", descHi: "डर पर काबू पाने और उड़ान भरने की प्रेरणादायक कहानियाँ।" },
    { en: "From the Diary of Anne Frank", hi: "ऐन फ्रैंक की डायरी से", descEn: "Excerpts from Anne Frank's diary describing life in hiding.", descHi: "छिपे रहने के दौरान जीवन का वर्णन करने वाली ऐन फ्रैंक की डायरी के अंश।" },
    { en: "The Hundred Dresses", hi: "सौ पोशाकें", descEn: "A story exploring judgment, bullying, and acceptance.", descHi: "पूर्वाग्रह, डराने-धमकाने और स्वीकार्यता की खोज करने वाली कहानी।" },
    { en: "Glimpses of India", hi: "भारत की झलकियाँ", descEn: "Explore the rich cultures of Goa, Coorg, and Assam.", descHi: "गोवा, कूर्ग और असम की समृद्ध संस्कृतियों का अन्वेषण करें।" },
    { en: "Madam Rides the Bus", hi: "मैडम बस की सवारी करती हैं", descEn: "A young girl's adventurous first bus ride to the town.", descHi: "एक छोटी लड़की की शहर के लिए पहली रोमांचक बस यात्रा।" },
    { en: "The Sermon at Benares", hi: "बनारस में उपदेश", descEn: "Gautama Buddha's teachings on suffering and acceptance.", descHi: "दुख और स्वीकार्यता पर गौतम बुद्ध की शिक्षाएं।" }
  ],
  "Hindi": [
    { en: "Surdas ke Pad", hi: "सूरदास के पद", descEn: "Poetic verses expressing devotion to Lord Krishna.", descHi: "भगवान कृष्ण के प्रति भक्ति व्यक्त करने वाले काव्यात्मक पद।" },
    { en: "Lakh ki Chudiyan", hi: "लाख की चूड़ियाँ", descEn: "A story on traditional craftsmen in a changing economic landscape.", descHi: "बदलते आर्थिक परिदृश्य में पारंपरिक शिल्पकारों पर एक कहानी।" },
    { en: "Bus ki Yatra", hi: "बस की यात्रा", descEn: "A humorous commentary on public transportation systems.", descHi: "सार्वजनिक परिवहन व्यवस्था पर एक व्यंग्यपूर्ण टिप्पणी।" },
    { en: "Do Bailon ki Katha", hi: "दो बैलों की कथा", descEn: "Premchand's tale illustrating loyalty, freedom, and friendship.", descHi: "वफादारी, स्वतंत्रता और मित्रता को दर्शाती प्रेमचंद की कहानी।" },
    { en: "Lhasa ki Aur", hi: "ल्हासा की ओर", descEn: "Rahul Sankrityayan's travelogue detailing a journey to Tibet.", descHi: "तिब्बत की यात्रा का विवरण देने वाला राहुल सांकृत्यायन का यात्रा वृत्तांत।" },
    { en: "Premchand ke Phate Joote", hi: "प्रेमचंद के फटे जूते", descEn: "Harishankar Parsai's satirical look at simplicity and integrity.", descHi: "सादगी और ईमानदारी पर हरिशंकर परसाई का व्यंग्यपूर्ण दृष्टिकोण।" },
    { en: "Mere Bachpan ke Din", hi: "मेरे बचपन के दिन", descEn: "Mahadevi Varma's memories of childhood, school, and friendships.", descHi: "महादेवी वर्मा के बचपन, स्कूल और दोस्ती की यादें।" },
    { en: "Savaiya", hi: "सवैये", descEn: "Beautiful devotional verses by Raskhan dedicated to Krishna.", descHi: "कृष्ण को समर्पित रसखान के सुंदर भक्ति पद।" }
  ]
};

// Fill in the rest of the database dynamically
CLASSES.forEach((cls) => {
  if (!CONTENT_DATABASE[cls]) {
    CONTENT_DATABASE[cls] = SUBJECTS_CONFIG.map((subj) => {
      const defaultInfo = MOCK_CHAPTERS_INFO[subj.name] || [];
      const chapters = Array.from({ length: 12 }, (_, idx) => {
        const info = defaultInfo[idx % defaultInfo.length];
        const chNum = idx + 1;
        return {
          id: chNum,
          titleEn: info ? `${info.en}` : `Chapter ${chNum}`,
          titleHi: info ? `${info.hi}` : `अध्याय ${chNum}`,
          isLocked: false,
          descriptionEn: info ? info.descEn : `NCERT standard syllabus chapter resources for class curriculum.`,
          descriptionHi: info ? info.descHi : `कक्षा पाठ्यक्रम के लिए NCERT मानक पाठ्यक्रम अध्याय संसाधन।`,
          resources: {
            video: true,
            quiz: true,
            mindmap: true,
            lessonPlan: true
          }
        };
      });

      return {
        ...subj,
        chapters
      };
    });
  }
});

export default function ClassContentPage({ params }: { params: { grade: string } }) {
  const router = useRouter();
  
  // Format class from URL e.g. "class-8" -> "Class 8"
  const rawGrade = params?.grade || "class-8";
  const formattedGrade = rawGrade.replace("class-", "Class ");
  const activeClass = CLASSES.includes(formattedGrade) ? formattedGrade : "Class 8";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"shelf" | "grid">("shelf");
  const [shakingBook, setShakingBook] = useState<string | null>(null);
  const [hoveredBook, setHoveredBook] = useState<{
    key: string;
    titleEn: string;
    titleHi: string;
    id: number;
    isLocked: boolean;
    descriptionEn?: string;
    descriptionHi?: string;
    resources: {
      video?: boolean;
      quiz?: boolean;
      mindmap?: boolean;
      lessonPlan?: boolean;
    };
    x: number;
    y: number;
  } | null>(null);

  const handleClassChange = (cls: string) => {
    const gradeSlug = cls.toLowerCase().replace(" ", "-");
    router.push(`/content/${gradeSlug}`);
    setSearchQuery("");
  };

  // Filtered dataset
  const filteredSubjects = useMemo(() => {
    const subjects = CONTENT_DATABASE[activeClass] || [];
    return subjects
      .map((subject) => {
        const filteredChapters = subject.chapters.filter((ch) => {
          const matchQuery =
            ch.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ch.titleHi.includes(searchQuery) ||
            ch.id.toString() === searchQuery;
          return matchQuery;
        });

        return { ...subject, chapters: filteredChapters };
      })
      .filter((subject) => {
        if (selectedSubject && subject.name !== selectedSubject) return false;
        return subject.chapters.length > 0;
      });
  }, [activeClass, searchQuery, selectedSubject]);

  const handleLockedClick = (bookKey: string) => {
    setShakingBook(bookKey);
    setTimeout(() => setShakingBook(null), 600);
  };

  const handleMouseEnter = (e: React.MouseEvent, book: Chapter, bookKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById("content-library-root");
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - containerRect.left;
      const y = rect.top - containerRect.top;
      setHoveredBook({
        key: bookKey,
        titleEn: book.titleEn,
        titleHi: book.titleHi,
        id: book.id,
        isLocked: book.isLocked,
        descriptionEn: book.descriptionEn,
        descriptionHi: book.descriptionHi,
        resources: book.resources,
        x,
        y
      });
    }
  };

  // Randomize styling for realistic layout
  const getBookStyle = (id: number, index: number, isLocked: boolean) => {
    const heights = ["h-28", "h-[7.25rem]", "h-32", "h-[8.25rem]"];
    const leanings = [
      "rotate-0",
      "rotate-1",
      "-rotate-1",
      "rotate-2",
      "-rotate-2"
    ];
    
    // Locked books have a flatter look, unlocked has organic variety
    const bookHeight = isLocked ? "h-[7rem]" : heights[(id + index) % heights.length];
    const leanAngle = isLocked ? "rotate-0" : leanings[(id * index) % leanings.length];

    return { bookHeight, leanAngle };
  };

  return (
    <div id="content-library-root" className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F6F3EB] font-sans pb-28 text-slate-800 relative">
      
      {/* Dynamic Classroom Header */}
      <div className="relative overflow-hidden py-16 bg-[#14532D] text-white border-b border-emerald-800/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f3d21_1px,transparent_1px),linear-gradient(to_bottom,#0f3d21_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 uppercase tracking-wider backdrop-blur-md"
          >
            <Compass className="w-3.5 h-3.5" /> NCERT Syllabus Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-5xl font-black tracking-tight font-serif"
          >
            NCERT Content Library
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-emerald-100/80 max-w-2xl mx-auto text-base md:text-lg font-medium"
          >
            Access NCERT-aligned interactive digital resources, ready-to-teach AI lesson plans, slides, and class quizzes instantly.
          </motion.p>
          
          {/* Class Selectors */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {CLASSES.map((cls) => {
              const isSelected = activeClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => handleClassChange(cls)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden ${
                    isSelected 
                      ? "bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-400/20 scale-105" 
                      : "bg-emerald-900/40 text-emerald-200 border border-emerald-800/40 hover:bg-emerald-800/60 hover:text-white"
                  }`}
                >
                  {cls}
                  {isSelected && (
                    <motion.div 
                      layoutId="activeClassHighlight"
                      className="absolute inset-0 bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Controls */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white/80 border border-slate-200/60 rounded-2xl p-5 shadow-sm backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Subject Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === null
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              All Subjects
            </button>
            {SUBJECTS_CONFIG.map((subj) => (
              <button
                key={subj.name}
                onClick={() => setSelectedSubject(subj.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedSubject === subj.name
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                {subj.name}
              </button>
            ))}
          </div>

          {/* Search bar & View Toggle */}
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all outline-none"
              />
            </div>
            
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/20">
              <button
                onClick={() => setViewMode("shelf")}
                className={`p-2 rounded-lg transition-all ${viewMode === "shelf" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                title="Shelf View"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty States */}
        {filteredSubjects.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Info className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-700">No Chapters Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">We couldn&apos;t find any chapters matching your query. Try adjusting your filters.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedSubject(null); }} className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold">Clear Filters</button>
          </div>
        )}

        {/* Tactile Shelf View */}
        {viewMode === "shelf" && (
          <div className="space-y-16 mt-12">
            {filteredSubjects.map((subject, sIdx) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sIdx * 0.1 }}
                className="flex flex-col gap-4 relative"
              >
                {/* Subject Title Board */}
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${subject.color}`} />
                      <h2 className="text-2xl font-bold font-serif tracking-tight text-slate-800">{subject.name}</h2>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {subject.chapters.length} Chapters
                  </span>
                </div>

                {/* Bookshelf Component */}
                <div className="relative pt-6 pb-2 w-full bg-slate-900/5 rounded-2xl p-4 overflow-x-auto select-none border border-slate-200/30">
                  <div className="flex gap-[3px] items-end px-6 pb-2.5 min-w-max">
                    {subject.chapters.map((book, bIdx) => {
                      const bookKey = `${subject.name}-${book.id}`;
                      const isShaking = shakingBook === bookKey;
                      const { bookHeight, leanAngle } = getBookStyle(book.id, bIdx, book.isLocked);

                      return (
                        <div key={book.id} className="relative z-10">
                          {/* Book Spine */}
                          {book.isLocked ? (
                            <div
                              onClick={() => handleLockedClick(bookKey)}
                              onMouseEnter={(e) => handleMouseEnter(e, book, bookKey)}
                              onMouseLeave={() => setHoveredBook(null)}
                              className={`
                                w-[3.25rem] ${bookHeight} rounded-sm relative flex flex-col justify-between py-2 px-1 border border-black/10 shadow-sm cursor-pointer select-none origin-bottom
                                bg-slate-300 text-slate-600 opacity-60 hover:opacity-85 hover:scale-[1.03] transition-all duration-300
                              `}
                              style={{
                                transform: isShaking ? "rotate(10deg)" : "rotate(0deg)",
                              }}
                            >
                              <span className="text-[9px] font-bold text-center block">
                                {book.id.toString().padStart(2, '0')}
                              </span>
                              <div className="flex-1 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 opacity-60" />
                              </div>
                            </div>
                          ) : (
                            <Link href={`/content/class-8/${subject.name.toLowerCase()}/chapter-${book.id}`}>
                              <motion.div
                                onMouseEnter={(e) => handleMouseEnter(e, book, bookKey)}
                                onMouseLeave={() => setHoveredBook(null)}
                                whileHover={{ 
                                  y: -14, 
                                  scale: 1.06, 
                                  rotate: 0,
                                  boxShadow: "0 10px 18px -4px rgba(0,0,0,0.15)"
                                }}
                                className={`
                                  w-[3.5rem] ${bookHeight} ${leanAngle} rounded-l-md rounded-r relative flex flex-col justify-between py-2 px-1 shadow-md border-y border-r border-black/15 cursor-pointer origin-bottom select-none bg-gradient-to-r ${subject.color} hover:brightness-105
                                `}
                              >
                                {/* Curvature Highlight overlay */}
                                <div className="absolute inset-y-0 left-0 w-[5px] bg-white/20 blur-[0.5px] rounded-l-md" />
                                <div className="absolute inset-y-0 right-0 w-[4px] bg-black/10 blur-[0.5px]" />

                                {/* Chapter Number Tag */}
                                <div className="text-[9px] font-black text-center text-white/90 bg-black/15 py-0.5 rounded mx-1 shadow-inner border border-white/5 uppercase">
                                  {book.id.toString().padStart(2, '0')}
                                </div>
                                
                                <div className="flex-1 flex items-center justify-center pt-2">
                                  <div className="w-full text-center truncate text-[8px] font-black tracking-wider uppercase text-white/80 transform -rotate-90 select-none">
                                    {book.titleEn.split(" ")[0]}
                                  </div>
                                </div>

                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 self-center shadow-sm border border-black/20" />
                              </motion.div>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Wood Shelf Panel */}
                  <div className="relative w-full h-5 bg-gradient-to-b from-[#A06A42] via-[#85532E] to-[#603A1F] rounded-t-sm rounded-b-md shadow-2xl border-t border-[#C79169]/30 flex items-center justify-between px-6">
                    <div className="w-4 h-1.5 bg-black/20 rounded-full" />
                    <div className="flex-1 h-[2px] bg-[#603A1F]/30 mx-4" />
                    <div className="w-4 h-1.5 bg-black/20 rounded-full" />
                  </div>
                  {/* Under shelf shadow */}
                  <div className="absolute left-2 right-2 -bottom-2 h-2.5 bg-black/15 blur-[2.5px] rounded-full z-0" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sleek Grid List View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {filteredSubjects.map((subject) =>
              subject.chapters.map((book) => {
                const bookKey = `${subject.name}-${book.id}`;
                const isShaking = shakingBook === bookKey;

                return (
                  <motion.div
                    key={bookKey}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {book.isLocked ? (
                      <div
                        onClick={() => handleLockedClick(bookKey)}
                        className={`bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden transition-all shadow-sm cursor-pointer hover:border-slate-300 ${
                          isShaking ? "animate-shake" : ""
                        }`}
                        style={{
                          animation: isShaking ? "shake 0.5s" : "none"
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs`}>
                            {book.id.toString().padStart(2, '0')}
                          </span>
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-rose-100">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        </div>
                        <div className="mt-4 space-y-1">
                          <h4 className="font-bold text-slate-700 leading-snug">{book.titleEn}</h4>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/content/class-8/${subject.name.toLowerCase()}/chapter-${book.id}`}>
                        <div className="bg-white border border-slate-200 hover:border-emerald-700/40 rounded-2xl p-5 relative overflow-hidden transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between h-full min-h-[175px]">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${subject.color} text-white font-bold text-xs shadow-sm`}>
                                {book.id.toString().padStart(2, '0')}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100/50">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-800 group-hover:text-emerald-800 transition-colors leading-snug">{book.titleEn}</h4>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>{subject.name}</span>
                            <span className="text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                              Teach Now <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Absolute Portal Tooltip */}
      <AnimatePresence>
        {hoveredBook && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[9999] w-72 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 pointer-events-none"
            style={{
              left: hoveredBook.x,
              top: hoveredBook.y - 12,
              transform: "translate(-50%, -100%)"
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/50">
                  Chapter {hoveredBook.id.toString().padStart(2, '0')}
                </span>
                {hoveredBook.isLocked ? (
                  <span className="text-[10px] font-bold text-rose-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-900/30" /> Ready
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-100 leading-snug">{hoveredBook.titleEn}</h4>
              </div>
              
              {hoveredBook.descriptionEn && (
                <p className="text-[10.5px] text-slate-300/90 leading-relaxed border-t border-slate-800/80 pt-2">
                  {hoveredBook.descriptionEn}
                </p>
              )}

              {/* Available Resources Preview */}
              <div className="flex gap-1.5 pt-2 border-t border-slate-800/50 mt-2">
                {Object.entries(hoveredBook.resources).map(([type, available]) => (
                  <span 
                    key={type} 
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      available ? "bg-emerald-900/30 text-emerald-300 border border-emerald-900/20" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {type === "mindmap" ? "🧠 map" : type === "lessonPlan" ? "📝 plan" : type === "quiz" ? "❓ quiz" : "🎥 video"}
                  </span>
                ))}
              </div>
            </div>
            {/* Tooltip triangle arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS for Shaking Animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

    </div>
  );
}
