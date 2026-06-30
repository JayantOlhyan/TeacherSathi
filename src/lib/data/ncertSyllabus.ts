interface ChapterInfo {
  id: number;
  en: string;
  hi: string;
  descEn: string;
  descHi: string;
}

type SubjectSyllabus = Record<string, ChapterInfo[]>;
type ClassSyllabus = Record<string, SubjectSyllabus>;

export const NCERT_SYLLABUS: ClassSyllabus = {
  "Class 6": {
    "Mathematics": [
      {
        "id": 1,
        "en": "Patterns in Mathematics",
        "hi": "गणित में पैटर्न",
        "descEn": "Explore visual and numerical patterns around us.",
        "descHi": "हमारे चारों ओर के दृश्य और संख्यात्मक पैटर्न का अन्वेषण करें।"
      },
      {
        "id": 2,
        "en": "Lines and Angles",
        "hi": "रेखाएँ और कोण",
        "descEn": "Understand line segments, rays, intersecting lines, and angle properties.",
        "descHi": "रेखाखंड, किरणें, प्रतिच्छेदी रेखाएँ और कोणों के गुणों को समझें।"
      },
      {
        "id": 3,
        "en": "Number Play",
        "hi": "संख्याओं का खेल",
        "descEn": "Study divisibility rules, factors, prime numbers, and number relationships.",
        "descHi": "विभाज्यता के नियम, गुणनखंड, अभाज्य संख्याएँ और संख्या संबंधों का अध्ययन करें।"
      },
      {
        "id": 4,
        "en": "Data Handling and Presentation",
        "hi": "आँकड़ों का प्रबंधन और प्रस्तुतीकरण",
        "descEn": "Organize, collect, and display data using tally marks and bar graphs.",
        "descHi": "टैली चिह्न और बार ग्राफ का उपयोग करके आँकड़ों का प्रबंधन और प्रस्तुतीकरण।"
      },
      {
        "id": 5,
        "en": "Prime Time",
        "hi": "अभाज्य समय",
        "descEn": "Deep dive into prime and composite numbers, HCF, and LCM concepts.",
        "descHi": "अभाज्य और भाज्य संख्याएँ, महत्तम समापवर्तक और लघुत्तम समापवर्त्य।"
      },
      {
        "id": 6,
        "en": "Perimeter and Area",
        "hi": "परिमाप और क्षेत्रफल",
        "descEn": "Calculate perimeter and area of squares, rectangles, and composite shapes.",
        "descHi": "वर्ग, आयत और संयुक्त आकृतियों के परिमाप और क्षेत्रफल की गणना।"
      },
      {
        "id": 7,
        "en": "Fractions",
        "hi": "भिन्न",
        "descEn": "Learn proper, improper, equivalent fractions, and basic fractional arithmetic.",
        "descHi": "उचित, विषम, समतुल्य भिन्न और भिन्नों की संक्रियाएँ।"
      },
      {
        "id": 8,
        "en": "Playing with Constructions",
        "hi": "रचनाओं के साथ खेलना",
        "descEn": "Geometric constructions of angles, perpendicular lines, and shapes using ruler and compass.",
        "descHi": "पटरी और परकार की सहायता से कोणों, लंब रेखाओं और आकृतियों की ज्यामितीय रचनाएँ।"
      },
      {
        "id": 9,
        "en": "Symmetry",
        "hi": "सममिति",
        "descEn": "Identify line symmetry and rotational symmetry in shapes and nature.",
        "descHi": "आकृतियों और प्रकृति में रैखिक सममिति और घूर्णन सममिति की पहचान।"
      },
      {
        "id": 10,
        "en": "The Other Side of Zero",
        "hi": "शून्य के दूसरी ओर",
        "descEn": "Introduction to negative numbers, integers, and number line representations.",
        "descHi": "ऋणात्मक संख्याओं, पूर्णांकों और संख्या रेखा निरूपण का परिचय।"
      }
    ],
    "Science": [
      {
        "id": 1,
        "en": "The Wonderful World of Science",
        "hi": "विज्ञान की अद्भुत दुनिया",
        "descEn": "Introduction to scientific inquiry, curiosity, and observation methods.",
        "descHi": "वैज्ञानिक जिज्ञासा, अन्वेषण और अवलोकन विधियों का परिचय।"
      },
      {
        "id": 2,
        "en": "Diversity in the Living World",
        "hi": "सजीव जगत में विविधता",
        "descEn": "Explore plant and animal diversity, classification, and habitats.",
        "descHi": "पौधों और जंतुओं की विविधता, वर्गीकरण और आवास का अन्वेषण।"
      },
      {
        "id": 3,
        "en": "Mindful Eating: A Path to a Healthy Body",
        "hi": "सचेत खान-पान: स्वस्थ शरीर का मार्ग",
        "descEn": "Nutrients, balanced diet, healthy eating habits, and physical well-being.",
        "descHi": "पोषक तत्व, संतुलित आहार, स्वस्थ खान-पान की आदतें और शारीरिक स्वास्थ्य।"
      },
      {
        "id": 4,
        "en": "Exploring Magnets",
        "hi": "चुंबकों का अन्वेषण",
        "descEn": "Study magnetic properties, poles, attraction, repulsion, and navigation.",
        "descHi": "चुंबकीय गुणों, ध्रुवों, आकर्षण, प्रतिकर्षण और दिशा निर्धारण का अध्ययन।"
      },
      {
        "id": 5,
        "en": "Measurement of Length and Motion",
        "hi": "लंबाई और गति का मापन",
        "descEn": "Standard units of measurement, measuring devices, and different types of motion.",
        "descHi": "मापन की मानक इकाइयाँ, मापक उपकरण और गति के प्रकार।"
      },
      {
        "id": 6,
        "en": "Materials Around Us",
        "hi": "हमारे आस-पास की सामग्रियाँ",
        "descEn": "Classify objects by properties such as solubility, transparency, hardness, and luster.",
        "descHi": "घुलनशीलता, पारदर्शिता, कठोरता और चमक जैसे गुणों के आधार पर वस्तुओं का वर्गीकरण।"
      },
      {
        "id": 7,
        "en": "Temperature and its Measurement",
        "hi": "तापमान और उसका मापन",
        "descEn": "Heat energy, thermometers, scales, and temperature transfer concepts.",
        "descHi": "ऊष्मीय ऊर्जा, थर्मामीटर, पैमाने और तापमान स्थानांतरण की अवधारणाएँ।"
      },
      {
        "id": 8,
        "en": "A Journey through States of Water",
        "hi": "जल की अवस्थाओं की एक यात्रा",
        "descEn": "Ice, water, water vapor, evaporation, condensation, and the water cycle.",
        "descHi": "बर्फ, जल, जलवाष्प, वाष्पीकरण, संघनन और जल चक्र।"
      },
      {
        "id": 9,
        "en": "Methods of Separation in Everyday Life",
        "hi": "दैनिक जीवन में पृथक्करण की विधियाँ",
        "descEn": "Handpicking, winnowing, filtration, decantation, and evaporation techniques.",
        "descHi": "हस्तचयन, निष्पावन, निस्पंदन, निस्तारण और वाष्पीकरण की तकनीकें।"
      },
      {
        "id": 10,
        "en": "Living Creatures: Exploring their Characteristics",
        "hi": "सजीव प्राणी: उनकी विशेषताओं का अन्वेषण",
        "descEn": "Key traits of living beings including respiration, response to stimuli, and reproduction.",
        "descHi": "श्वसन, उद्दीपन के प्रति अनुक्रिया और प्रजनन सहित सजीवों के मुख्य लक्षण।"
      },
      {
        "id": 11,
        "en": "Nature's Treasures",
        "hi": "प्रकृति के खजाने",
        "descEn": "Natural resources, forests, water reserves, and conservation practices.",
        "descHi": "प्राकृतिक संसाधन, वन, जल भंडार और संरक्षण के उपाय।"
      },
      {
        "id": 12,
        "en": "Beyond Earth",
        "hi": "पृथ्वी के परे",
        "descEn": "Overview of our solar system, celestial bodies, moon phases, and space exploration.",
        "descHi": "हमारे सौरमंडल, खगोलीय पिंडों, चंद्रमा की कलाओं और अंतरिक्ष अन्वेषण का अवलोकन।"
      }
    ],
    "Hindi": [
      {"id": 1, "en": "मातृभूमि (कविता)", "hi": "मातृभूमि (कविता)",
        "descEn": "Poem expressing deep patriotism and reverence for our motherland.",
        "descHi": "मातृभूमि के प्रति अटूट प्रेम और सम्मान प्रकट करने वाली कविता।"
      },
      {"id": 2, "en": "गोल (संस्मरण)", "hi": "गोल (संस्मरण)",
        "descEn": "Memoir of hockey legend Major Dhyan Chand emphasizing discipline and teamwork.",
        "descHi": "हॉकी के जादूगर मेजर ध्यानचंद का अनुशासन और टीम भावना सिखाने वाला संस्मरण।"
      },
      {"id": 3, "en": "पहली बूँद (कविता)", "hi": "पहली बूँद (कविता)",
        "descEn": "Poem capturing the refreshing joy and beauty of the first summer rain.",
        "descHi": "ग्रीष्म ऋतु के बाद पहली बारिश के आनंद और प्रकृति के सौंदर्य की कविता।"
      },
      {"id": 4, "en": "हार की जीत (कहानी)", "hi": "हार की जीत (कहानी)",
        "descEn": "Inspiring moral story by Sudarshan about compassion transforming a hardened heart.",
        "descHi": "सुदर्शन की मार्मिक कहानी जो दर्शाती है कि करुणा पत्थर दिल को भी बदल सकती है।"
      },
      {"id": 5, "en": "रहीम के दोहे", "hi": "रहीम के दोहे",
        "descEn": "Timeless couplets of Rahim offering practical wisdom and ethical teachings.",
        "descHi": "जीवन के व्यावहारिक ज्ञान और नैतिक आचरण को सिखाने वाले रहीम के अनमोल दोहे।"
      },
      {"id": 6, "en": "मेरी माँ (आत्मकथा)", "hi": "मेरी माँ (आत्मकथा)",
        "descEn": "Ram Prasad Bismil's heartfelt autobiographical tribute to his mother's inspiration.",
        "descHi": "क्रांतिकारी रामप्रसाद बिस्मिल का अपनी माता के त्याग और प्रेरणा को समर्पित संस्मरण।"
      },
      {"id": 7, "en": "जलाते चलो (कविता)", "hi": "जलाते चलो (कविता)",
        "descEn": "Poem motivating us to spread hope and optimism even in dark times.",
        "descHi": "अंधकार और कठिनाइयों के बीच आशा और उत्साह का दीप जलाए रखने की प्रेरक कविता।"
      },
      {"id": 8, "en": "सत्रिया और बिहू नृत्य (निबंध)", "hi": "सत्रिया और बिहू नृत्य (निबंध)",
        "descEn": "Essay celebrating the traditional classical and folk dance forms of Assam.",
        "descHi": "असम के शास्त्रीय नृत्य 'सत्रिया' और लोक नृत्य 'बिहू' की समृद्ध संस्कृति का निबंध।"
      },
      {"id": 9, "en": "मैया मैं नहिं माखन खायो (पद)", "hi": "मैया मैं नहिं माखन खायो (पद)",
        "descEn": "Surdas's affectionate verses depicting child Krishna's sweet explanation to Yashoda.",
        "descHi": "बाल कृष्ण द्वारा यशोदा माता के समक्ष माखन चोरी पर दी गई मधुर सफाई के सूरदास के पद।"
      },
      {"id": 10, "en": "परीक्षा (कविता)", "hi": "परीक्षा (कविता)",
        "descEn": "Reflective poem assessing the real tests of character and perseverance in life.",
        "descHi": "जीवन के संघर्षों, धैर्य और वास्तविक योग्यता को परखने वाली कविता।"
      },
      {"id": 11, "en": "चेतक की वीरता (कविता)", "hi": "चेतक की वीरता (कविता)",
        "descEn": "Shyam Narayan Pandey's heroic ballad honoring Maharana Pratap's loyal steed Chetak.",
        "descHi": "महाराणा प्रताप के स्वामिभक्त घोड़े चेतक के साहस और युद्ध कौशल का वीर रस काव्य।"
      },
      {"id": 12, "en": "हिंद महासागर में छोटा-सा हिंदुस्तान (यात्रा-वृत्तांत)", "hi": "हिंद महासागर में छोटा-सा हिंदुस्तान (यात्रा-वृत्तांत)",
        "descEn": "Ramdhari Singh Dinkar's travelogue depicting Indian cultural ties in Mauritius.",
        "descHi": "मॉरीशस में भारतीय संस्कृति की अमिट छाप को दर्शाता रामधारी सिंह 'दिनकर' का यात्रा-वृत्तांत।"
      },
      {"id": 13, "en": "पेड़ की बात (निबंध)", "hi": "पेड़ की बात (निबंध)",
        "descEn": "Jagdish Chandra Bose's classic essay proving life and sensitivity in plants.",
        "descHi": "जगदीश चंद्र बोस का वैज्ञानिक निबंध जो सिद्ध करता है कि वृक्षों में भी जीवन और संवेदना होती है।"
      }
    ],
    "English": [
      {
        "id": 1,
        "en": "A Bottle of Dew",
        "hi": "ओस की एक बोतल",
        "descEn": "Unit 1: Fables and Folk Tales — A clever sage teaches a lazy man that hard work in the fields is the true secret wealth.",
        "descHi": "इकाई 1: एक लोककथा जो सिखाती है कि खेतों में कड़ी मेहनत ही सच्चा धन है।"
      },
      {
        "id": 2,
        "en": "The Raven and the Fox",
        "hi": "कौआ और लोमड़ी",
        "descEn": "Unit 1: Fables and Folk Tales — Classic story illustrating the dangers of falling for false flattery.",
        "descHi": "इकाई 1: झूठी प्रशंसा और चापलूसी के खतरों को दर्शाने वाली क्लासिक कहानी।"
      },
      {
        "id": 3,
        "en": "Rama to the Rescue",
        "hi": "रामा की मदद",
        "descEn": "Unit 1: Fables and Folk Tales — A heartwarming tale of courage, empathy, and coming to the rescue of those in distress.",
        "descHi": "इकाई 1: साहस, सहानुभूति और संकट में फंसे लोगों की मदद करने की कहानी।"
      },
      {
        "id": 4,
        "en": "The Unlikely Best Friends",
        "hi": "असामान्य पक्के दोस्त",
        "descEn": "Unit 2: Friendship — A story celebrating how true friendship bridges differences and brings joy.",
        "descHi": "इकाई 2: सच्ची मित्रता कैसे मतभेदों को मिटाकर खुशी लाती है, इस पर एक कहानी।"
      },
      {
        "id": 5,
        "en": "A Friend's Prayer",
        "hi": "एक दोस्त की प्रार्थना",
        "descEn": "Unit 2: Friendship — Poetic verses highlighting loyalty, mutual support, and kindness between friends.",
        "descHi": "इकाई 2: दोस्तों के बीच वफादारी, समर्थन और दयालुता को दर्शाती कविता।"
      },
      {
        "id": 6,
        "en": "The Chair",
        "hi": "कुर्सी",
        "descEn": "Unit 2: Friendship — A school story emphasizing inclusion, solidarity, and standing by a classmate.",
        "descHi": "इकाई 2: स्कूल में समावेशन और सहपाठी के साथ खड़े होने की प्रेरणादायक कहानी।"
      },
      {
        "id": 7,
        "en": "Neem Baba",
        "hi": "नीम बाबा",
        "descEn": "Unit 3: Nurturing Nature — Discovering the incredible ecological and medicinal benefits of the sacred Neem tree.",
        "descHi": "इकाई 3: पवित्र नीम के पेड़ के अद्भुत पर्यावरणीय और औषधीय लाभों की खोज।"
      },
      {
        "id": 8,
        "en": "What a Bird Thought",
        "hi": "एक पक्षी ने क्या सोचा",
        "descEn": "Unit 3: Nurturing Nature — A charming poem looking at the vast world through a growing nestling's eyes.",
        "descHi": "इकाई 3: एक नन्हे पक्षी की नज़रों से इस विशाल दुनिया को देखने वाली मनमोहक कविता।"
      },
      {
        "id": 9,
        "en": "Spices That Heal Us",
        "hi": "मसाले जो हमें स्वस्थ करते हैं",
        "descEn": "Unit 3: Nurturing Nature — Exploring turmeric, ginger, cloves, and other kitchen spices as natural healing medicine.",
        "descHi": "इकाई 3: हल्दी, अदरक, लौंग और रसोई के अन्य मसालों के प्राकृतिक औषधीय गुणों की खोज।"
      },
      {
        "id": 10,
        "en": "Change of Heart",
        "hi": "हृदय परिवर्तन",
        "descEn": "Unit 4: Sports and Wellness — A sports story demonstrating true sportsmanship, honesty, and moral courage.",
        "descHi": "इकाई 4: खेल भावना, ईमानदारी और नैतिक साहस को दर्शाने वाली कहानी।"
      },
      {
        "id": 11,
        "en": "The Winner",
        "hi": "विजेता",
        "descEn": "Unit 4: Sports and Wellness — A narrative showing that true victory comes from perseverance, ethics, and effort.",
        "descHi": "इकाई 4: यह दर्शाती कहानी कि सच्ची जीत लगन, नैतिकता और निरंतर प्रयास से मिलती है।"
      },
      {
        "id": 12,
        "en": "Yoga – A Way of Life",
        "hi": "योग – जीवन जीने की कला",
        "descEn": "Unit 4: Sports and Wellness — Introduction to yoga postures, breathing exercises, and holistic physical-mental wellness.",
        "descHi": "इकाई 4: योगासनों, प्राणायाम और समग्र शारीरिक-मानसिक स्वास्थ्य का परिचय।"
      },
      {
        "id": 13,
        "en": "Hamara Bharat – Incredible India!",
        "hi": "हमारा भारत – अतुल्य भारत!",
        "descEn": "Unit 5: Culture and Tradition — Celebrating India's breathtaking heritage, cultural diversity, and unity.",
        "descHi": "इकाई 5: भारत की मनमोहक विरासत, सांस्कृतिक विविधता और एकता का उत्सव।"
      },
      {
        "id": 14,
        "en": "The Kites",
        "hi": "पतंगें",
        "descEn": "Unit 5: Culture and Tradition — A joyful poem depicting colorful kites dancing across the sky.",
        "descHi": "इकाई 5: आसमान में लहराती रंग-बिरंगी पतंगों के उल्लास को दर्शाती कविता।"
      },
      {
        "id": 15,
        "en": "Ila Sachani: Embroidering Dreams with Her Feet",
        "hi": "इला सचानी: पैरों से सपने बुनना",
        "descEn": "Unit 5: Culture and Tradition — Inspiring real-life biography of a remarkable artist mastering embroidery with her feet.",
        "descHi": "इकाई 5: अपने पैरों से उत्कृष्ट कसीदाकारी करने वाली अद्भुत कलाकार इला सचानी की प्रेरणादायक जीवनी।"
      },
      {
        "id": 16,
        "en": "National War Memorial",
        "hi": "राष्ट्रीय युद्ध स्मारक",
        "descEn": "Unit 5: Culture and Tradition — Paying tribute to the supreme sacrifice and heroism of soldiers at the National War Memorial.",
        "descHi": "इकाई 5: राष्ट्रीय युद्ध स्मारक पर वीर सैनिकों के सर्वोच्च बलिदान और साहस को श्रद्धांजलि।"
      }
    ],
    "Social Science": [
      {
        "id": 1,
        "en": "Locating Places on the Earth",
        "hi": "पृथ्वी पर स्थानों की स्थिति जानना",
        "descEn": "Theme A: Land and the People — Understand globes, latitudes, longitudes, prime meridian, and coordinates.",
        "descHi": "विषय A: ग्लोब, अक्षांश, देशांतर, प्रधान मध्याह्न रेखा और निर्देशांकों को समझें।"
      },
      {
        "id": 2,
        "en": "Oceans and Continents",
        "hi": "महासागर और महाद्वीप",
        "descEn": "Theme A: Land and the People — Study the vast water bodies, seven continents, and Earth's geographic features.",
        "descHi": "विषय A: विशाल जल निकायों, सात महाद्वीपों और पृथ्वी की भौगोलिक विशेषताओं का अध्ययन।"
      },
      {
        "id": 3,
        "en": "Landforms and Life",
        "hi": "स्थलाकृतियाँ और जीवन",
        "descEn": "Theme A: Land and the People — Mountains, plateaus, river valleys, plains, and human adaptations.",
        "descHi": "विषय A: पर्वत, पठार, नदी घाटियाँ, मैदान और उनके अनुसार मानव जीवन।"
      },
      {
        "id": 4,
        "en": "Timeline and Sources of History",
        "hi": "इतिहास की समय-रेखा और स्रोत",
        "descEn": "Theme B: Tapestry of the Past — Learn about BCE/CE chronology, manuscripts, inscriptions, and archaeology.",
        "descHi": "विषय B: कालक्रम, पांडुलिपियों, शिलालेखों और पुरातत्व के बारे में जानें।"
      },
      {
        "id": 5,
        "en": "India, That is Bharat",
        "hi": "भारत, अर्थात् भारतवर्ष",
        "descEn": "Theme B: Tapestry of the Past — Explore the historical names, geographical boundaries, and identity of Bharat.",
        "descHi": "विषय B: भारतवर्ष के ऐतिहासिक नामों, भौगोलिक सीमाओं और पहचान का अन्वेषण।"
      },
      {
        "id": 6,
        "en": "The Beginnings of Indian Civilisation",
        "hi": "भारतीय सभ्यता का प्रारंभ",
        "descEn": "Theme B: Tapestry of the Past — Study the Sindhu-Sarasvati civilization, advanced architecture, and urban planning.",
        "descHi": "विषय B: सिंधु-सरस्वती सभ्यता, उन्नत वास्तुकला और नगर नियोजन का अध्ययन।"
      },
      {
        "id": 7,
        "en": "India's Cultural Roots",
        "hi": "भारत की सांस्कृतिक जड़ें",
        "descEn": "Theme C: Our Cultural Heritage — Vedas, Upanishads, Shramana traditions (Buddhism & Jainism), and core values.",
        "descHi": "विषय C: वेद, उपनिषद, श्रमण परंपराएँ (बौद्ध और जैन धर्म) और मूल भारतीय मूल्य।"
      },
      {
        "id": 8,
        "en": "Unity in Diversity, or 'Many in the One'",
        "hi": "विविधता में एकता, या 'एक में अनेक'",
        "descEn": "Theme C: Our Cultural Heritage — How festivals, arts, languages, and shared values bind India together.",
        "descHi": "विषय C: कैसे त्योहार, कलाएँ, भाषाएँ और साझे मूल्य भारत को एक सूत्र में पिरोते हैं।"
      },
      {
        "id": 9,
        "en": "Family and Community",
        "hi": "परिवार और समुदाय",
        "descEn": "Theme D: Governance and Democracy — Understanding interdependence, cooperation, family bonds, and community living.",
        "descHi": "विषय D: आपसी निर्भरता, सहयोग, पारिवारिक बंधन और सामुदायिक जीवन को समझना।"
      },
      {
        "id": 10,
        "en": "Grassroots Democracy – Part 1: Governance",
        "hi": "जमीनी स्तर पर लोकतंत्र – भाग 1: शासन",
        "descEn": "Theme D: Governance and Democracy — Introduction to community decision-making, rules, and democratic values.",
        "descHi": "विषय D: सामूहिक निर्णय लेने की प्रक्रिया, नियमों और लोकतांत्रिक मूल्यों का परिचय।"
      },
      {
        "id": 11,
        "en": "Grassroots Democracy – Part 2: Local Government in Rural Areas",
        "hi": "जमीनी स्तर पर लोकतंत्र – भाग 2: ग्रामीण क्षेत्रों में स्थानीय सरकार",
        "descEn": "Theme D: Governance and Democracy — Study Panchayati Raj, Gram Panchayat, Gram Sabha, and rural administration.",
        "descHi": "विषय D: पंचायती राज, ग्राम पंचायत, ग्राम सभा और ग्रामीण प्रशासन का अध्ययन।"
      },
      {
        "id": 12,
        "en": "Grassroots Democracy – Part 3: Local Government in Urban Areas",
        "hi": "जमीनी स्तर पर लोकतंत्र – भाग 3: शहरी क्षेत्रों में स्थानीय सरकार",
        "descEn": "Theme D: Governance and Democracy — Municipal Corporations, Nagar Panchayats, wards, and urban civic services.",
        "descHi": "विषय D: नगर निगम, नगर पालिका, वार्ड और शहरी नागरिक सेवाओं का अध्ययन।"
      },
      {
        "id": 13,
        "en": "The Value of Work",
        "hi": "कार्य का महत्व",
        "descEn": "Theme E: Economic Life Around Us — Recognizing the dignity of labor, care work, and contribution of all occupations.",
        "descHi": "विषय E: श्रम की गरिमा, घरेलू कार्यों के महत्व और सभी व्यवसायों के योगदान को समझना।"
      },
      {
        "id": 14,
        "en": "Economic Activities Around Us",
        "hi": "हमारे आस-पास की आर्थिक गतिविधियाँ",
        "descEn": "Theme E: Economic Life Around Us — Explore farming, craftsmanship, trade, and services in villages and towns.",
        "descHi": "विषय E: गाँवों और शहरों में कृषि, शिल्पकारी, व्यापार और सेवाओं का अन्वेषण।"
      }
    ]
  },
  "Class 7": {
    "Mathematics": [
      {"id": 1, "en": "Large Numbers Around Us", "hi": "हमारे आस-पास की बड़ी संख्याएँ", "descEn": "Understanding large numbers and their applications.", "descHi": "बड़ी संख्याओं और उनके अनुप्रयोगों को समझना।"},
      {"id": 2, "en": "Arithmetic Expressions", "hi": "अंकगणितीय व्यंजक", "descEn": "Working with basic arithmetic expressions.", "descHi": "बुनियादी अंकगणितीय व्यंजकों के साथ कार्य करना।"},
      {"id": 3, "en": "A Peek Beyond the Point", "hi": "बिंदु के पार एक नज़र", "descEn": "Exploring decimals and their properties.", "descHi": "दशमलव और उनके गुणों का अन्वेषण।"},
      {"id": 4, "en": "Expressions using Letter-Numbers", "hi": "अक्षर-संख्याओं का उपयोग करने वाले व्यंजक", "descEn": "Introduction to algebraic expressions.", "descHi": "बीजीय व्यंजकों का परिचय।"},
      {"id": 5, "en": "Parallel and Intersecting Lines", "hi": "समांतर और प्रतिच्छेदी रेखाएँ", "descEn": "Properties of parallel and intersecting lines.", "descHi": "समांतर और प्रतिच्छेदी रेखाओं के गुण।"},
      {"id": 6, "en": "Number Play", "hi": "संख्याओं का खेल", "descEn": "Fun patterns and properties of numbers.", "descHi": "संख्याओं के मज़ेदार पैटर्न और गुण।"},
      {"id": 7, "en": "A Tale of Three Intersecting Lines", "hi": "तीन प्रतिच्छेदी रेखाओं की कहानी", "descEn": "Understanding transversals and intersecting lines.", "descHi": "तिर्यक और प्रतिच्छेदी रेखाओं को समझना।"},
      {"id": 8, "en": "Working with Fractions", "hi": "भिन्नों के साथ कार्य करना", "descEn": "Operations involving fractions.", "descHi": "भिन्नों से जुड़े संचालन।"},
      {"id": 9, "en": "Geometric Twins", "hi": "ज्यामितीय जुड़वां", "descEn": "Understanding symmetry and congruency.", "descHi": "समरूपता और सर्वांगसमता को समझना।"},
      {"id": 10, "en": "Operations with Integers", "hi": "पूर्णांकों के साथ संचालन", "descEn": "Adding, subtracting, multiplying, and dividing integers.", "descHi": "पूर्णांकों को जोड़ना, घटाना, गुणा करना और भाग देना।"},
      {"id": 11, "en": "Finding Common Ground", "hi": "समान आधार खोजना", "descEn": "Exploring HCF, LCM, and common multiples.", "descHi": "HCF, LCM और उभयनिष्ठ गुणजों की खोज।"},
      {"id": 12, "en": "Another Peek Beyond the Point", "hi": "बिंदु के पार एक और नज़र", "descEn": "Advanced concepts in decimals.", "descHi": "दशमलव में उन्नत अवधारणाएँ।"},
      {"id": 13, "en": "Connecting the Dots…", "hi": "बिंदुओं को जोड़ना…", "descEn": "Understanding graphs and coordinates.", "descHi": "ग्राफ़ और निर्देशांक को समझना।"},
      {"id": 14, "en": "Constructions and Tilings", "hi": "रचनाएँ और टाइलिंग", "descEn": "Geometric constructions and patterns.", "descHi": "ज्यामितीय रचनाएँ और पैटर्न।"},
      {"id": 15, "en": "Finding the Unknown", "hi": "अज्ञात की खोज", "descEn": "Solving equations to find unknown values.", "descHi": "अज्ञात मान ज्ञात करने के लिए समीकरणों को हल करना।"}
    ],
    "Science": [
      {"id": 1, "en": "The Ever-Evolving World of Science", "hi": "विज्ञान की निरंतर विकसित होती दुनिया", "descEn": "Introduction to the advancements in science.", "descHi": "विज्ञान में प्रगति का परिचय।"},
      {"id": 2, "en": "Exploring Substances: Acidic, Basic, and Neutral", "hi": "पदार्थों की खोज: अम्लीय, क्षारीय और उदासीन", "descEn": "Understanding different types of chemical substances.", "descHi": "विभिन्न प्रकार के रासायनिक पदार्थों को समझना।"},
      {"id": 3, "en": "Electricity: Circuits and Their Components", "hi": "विद्युत: परिपथ और उनके घटक", "descEn": "Basics of electricity and circuit components.", "descHi": "विद्युत और सर्किट घटकों की मूल बातें।"},
      {"id": 4, "en": "The World of Metals and Non-metals", "hi": "धातुओं और अधातुओं की दुनिया", "descEn": "Properties and uses of metals and non-metals.", "descHi": "धातुओं और अधातुओं के गुण और उपयोग।"},
      {"id": 5, "en": "Changes Around Us: Physical and Chemical", "hi": "हमारे आस-पास के परिवर्तन: भौतिक और रासायनिक", "descEn": "Differentiating physical and chemical changes.", "descHi": "भौतिक और रासायनिक परिवर्तनों में अंतर करना।"},
      {"id": 6, "en": "Adolescence: A Stage of Growth and Change", "hi": "किशोरावस्था: विकास और परिवर्तन का चरण", "descEn": "Understanding human growth and adolescence.", "descHi": "मानव विकास और किशोरावस्था को समझना।"},
      {"id": 7, "en": "Heat Transfer in Nature", "hi": "प्रकृति में ऊष्मा संचरण", "descEn": "How heat moves through conduction, convection, and radiation.", "descHi": "चालन, संवहन और विकिरण के माध्यम से ऊष्मा कैसे चलती है।"},
      {"id": 8, "en": "Measurement of Time and Motion", "hi": "समय और गति का मापन", "descEn": "Measuring time intervals and analyzing motion.", "descHi": "समय अंतराल मापना और गति का विश्लेषण करना।"},
      {"id": 9, "en": "Life Processes in Animals", "hi": "जंतुओं में जीवन प्रक्रियाएँ", "descEn": "Respiration, digestion, and circulation in animals.", "descHi": "जानवरों में श्वसन, पाचन और परिसंचरण।"},
      {"id": 10, "en": "Life Processes in Plants", "hi": "पौधों में जीवन प्रक्रियाएँ", "descEn": "Photosynthesis, transpiration, and transport in plants.", "descHi": "पौधों में प्रकाश संश्लेषण, वाष्पोत्सर्जन और परिवहन।"},
      {"id": 11, "en": "Light: Shadows and Reflections", "hi": "प्रकाश: छाया और परावर्तन", "descEn": "Properties of light and shadow formation.", "descHi": "प्रकाश और छाया निर्माण के गुण।"},
      {"id": 12, "en": "Earth, Moon, and the Sun", "hi": "पृथ्वी, चंद्रमा और सूर्य", "descEn": "Exploring our solar system's key celestial bodies.", "descHi": "हमारे सौर मंडल के प्रमुख खगोलीय पिंडों का अन्वेषण।"}
    ],
    "Hindi": [
      {"id": 1, "en": "माँ, कह एक कहानी", "hi": "माँ, कह एक कहानी", "descEn": "A classic poem by Maithili Sharan Gupt.", "descHi": "मैथिलीशरण गुप्त की एक क्लासिक कविता।"},
      {"id": 2, "en": "तीन बुद्धिमान", "hi": "तीन बुद्धिमान", "descEn": "An interesting tale of three wise individuals.", "descHi": "तीन बुद्धिमान व्यक्तियों की एक दिलचस्प कहानी।"},
      {"id": 3, "en": "फूल और काँटा", "hi": "फूल और काँटा", "descEn": "A poem highlighting the contrasting nature of a flower and a thorn.", "descHi": "फूल और काँटे की विपरीत प्रकृति को उजागर करने वाली कविता।"},
      {"id": 4, "en": "पानी रे पानी", "hi": "पानी रे पानी", "descEn": "An essay on the importance and conservation of water.", "descHi": "जल के महत्व और संरक्षण पर एक निबंध।"},
      {"id": 5, "en": "नहीं होना बीमार", "hi": "नहीं होना बीमार", "descEn": "A lesson on health and hygiene.", "descHi": "स्वास्थ्य और स्वच्छता पर एक पाठ।"},
      {"id": 6, "en": "गिरिधर", "hi": "गिरिधर", "descEn": "Devotional verses dedicated to Lord Krishna.", "descHi": "भगवान कृष्ण को समर्पित भक्ति पद।"},
      {"id": 7, "en": "वर्षा-बहार", "hi": "वर्षा-बहार", "descEn": "A poem describing the beauty of the rainy season.", "descHi": "वर्षा ऋतु के सौंदर्य का वर्णन करने वाली कविता।"},
      {"id": 8, "en": "बिरजू महाराज से साक्षात्कार", "hi": "बिरजू महाराज से साक्षात्कार", "descEn": "An interview with the legendary Kathak dancer, Pandit Birju Maharaj.", "descHi": "महान कथक नर्तक पंडित बिरजू महाराज के साथ एक साक्षात्कार।"},
      {"id": 9, "en": "चिड़िया", "hi": "चिड़िया", "descEn": "A sweet poem about a little bird.", "descHi": "एक छोटी चिड़िया के बारे में एक प्यारी कविता।"},
      {"id": 10, "en": "मीरा के पद", "hi": "मीरा के पद", "descEn": "Devotional songs by the poet-saint Meera Bai.", "descHi": "कवयित्री-संत मीरा बाई के भक्ति गीत।"}
    ],
    "English": [
      {"id": 1, "en": "Try Again", "hi": "फिर से कोशिश करें", "descEn": "Unit 1: Learning Together - A poem encouraging persistence.", "descHi": "इकाई 1: दृढ़ता को प्रोत्साहित करने वाली कविता।"},
      {"id": 2, "en": "Three Days to See", "hi": "देखने के लिए तीन दिन", "descEn": "Unit 1: Learning Together - Helen Keller's powerful essay on appreciating sight.", "descHi": "इकाई 1: दृष्टि की सराहना करने पर हेलेन केलर का शक्तिशाली निबंध।"},
      {"id": 3, "en": "A Funny Man", "hi": "एक मजाकिया आदमी", "descEn": "Unit 1: Learning Together - A humorous story to share a laugh.", "descHi": "इकाई 1: हंसाने वाली एक हास्य कथा।"},
      {"id": 4, "en": "Say the Right Thing", "hi": "सही बात कहें", "descEn": "Unit 2: Wit and Humour - A lesson in communication and tact.", "descHi": "इकाई 2: संचार और व्यवहारकुशलता का एक पाठ।"},
      {"id": 5, "en": "My Brother's Great Invention", "hi": "मेरे भाई का महान आविष्कार", "descEn": "Unit 2: Wit and Humour - An amusing tale of a sibling's creativity.", "descHi": "इकाई 2: एक भाई-बहन की रचनात्मकता की मनोरंजक कहानी।"},
      {"id": 6, "en": "Paper Boats", "hi": "कागज की नावें", "descEn": "Unit 2: Wit and Humour - Rabindranath Tagore's nostalgic poem.", "descHi": "इकाई 2: रवींद्रनाथ टैगोर की पुरानी यादों वाली कविता।"},
      {"id": 7, "en": "North, South, East, West", "hi": "उत्तर, दक्षिण, पूर्व, पश्चिम", "descEn": "Unit 3: Dreams and Discoveries - Exploring the world's directions and wonders.", "descHi": "इकाई 3: दुनिया की दिशाओं और अजूबों की खोज।"},
      {"id": 8, "en": "The Day the River Spoke", "hi": "जिस दिन नदी बोली", "descEn": "Unit 3: Dreams and Discoveries - A fascinating story about nature's voice.", "descHi": "इकाई 3: प्रकृति की आवाज़ के बारे में एक आकर्षक कहानी।"},
      {"id": 9, "en": "Courage", "hi": "साहस", "descEn": "Unit 3: Dreams and Discoveries - A lesson on facing fears.", "descHi": "इकाई 3: डर का सामना करने का एक पाठ।"},
      {"id": 10, "en": "The Tunnel", "hi": "सुरंग", "descEn": "Unit 4: Travel and Adventure - An adventurous journey story.", "descHi": "इकाई 4: एक साहसिक यात्रा की कहानी।"},
      {"id": 11, "en": "Travel", "hi": "यात्रा", "descEn": "Unit 4: Travel and Adventure - A poem about the joys of travelling.", "descHi": "इकाई 4: यात्रा की खुशियों के बारे में एक कविता।"},
      {"id": 12, "en": "Conquering the Summit", "hi": "शिखर पर विजय", "descEn": "Unit 4: Travel and Adventure - A true story of mountaineering achievement.", "descHi": "इकाई 4: पर्वतारोहण उपलब्धि की सच्ची कहानी।"},
      {"id": 13, "en": "A Homage to Our Brave Soldiers", "hi": "हमारे वीर सैनिकों को श्रद्धांजलि", "descEn": "Unit 5: Bravehearts - Honoring the sacrifices of the armed forces.", "descHi": "इकाई 5: सशस्त्र बलों के बलिदान का सम्मान।"},
      {"id": 14, "en": "The Kargil Girl", "hi": "कारगिल गर्ल", "descEn": "Unit 5: Bravehearts - The inspiring story of Gunjan Saxena.", "descHi": "इकाई 5: गुंजन सक्सेना की प्रेरक कहानी।"},
      {"id": 15, "en": "The Mirror", "hi": "दर्पण", "descEn": "Unit 5: Bravehearts - A reflective piece on self-discovery.", "descHi": "इकाई 5: आत्म-खोज पर एक चिंतनशील लेख।"},
      {"id": 16, "en": "The Day We Saved the Forest", "hi": "जिस दिन हमने जंगल को बचाया", "descEn": "Unit 5: Bravehearts (extended text) - A story about environmental conservation.", "descHi": "इकाई 5: पर्यावरण संरक्षण के बारे में एक कहानी।"}
    ],
    "Social Science": [
      {"id": 1, "en": "Geographical Diversity of India", "hi": "भारत की भौगोलिक विविधता", "descEn": "Part I: Exploring India's diverse physical features.", "descHi": "भाग I: भारत की विविध भौतिक विशेषताओं की खोज।"},
      {"id": 2, "en": "Understanding the Weather", "hi": "मौसम को समझना", "descEn": "Part I: Basics of weather and atmospheric conditions.", "descHi": "भाग I: मौसम और वायुमंडलीय स्थितियों की मूल बातें।"},
      {"id": 3, "en": "Climates of India", "hi": "भारत की जलवायु", "descEn": "Part I: Analyzing the different climatic zones in India.", "descHi": "भाग I: भारत में विभिन्न जलवायु क्षेत्रों का विश्लेषण।"},
      {"id": 4, "en": "New Beginnings: Cities and States", "hi": "नई शुरुआत: शहर और राज्य", "descEn": "Part I: The emergence of early urban centers and kingdoms.", "descHi": "भाग I: प्रारंभिक शहरी केंद्रों और राज्यों का उद्भव।"},
      {"id": 5, "en": "The Rise of Empires", "hi": "साम्राज्यों का उदय", "descEn": "Part I: How vast empires were built and governed.", "descHi": "भाग I: विशाल साम्राज्यों का निर्माण और शासन कैसे किया गया।"},
      {"id": 6, "en": "The Age of Reorganisation", "hi": "पुनर्गठन का युग", "descEn": "Part I: Structural changes in ancient societies and administration.", "descHi": "भाग I: प्राचीन समाजों और प्रशासन में संरचनात्मक परिवर्तन।"},
      {"id": 7, "en": "The Gupta Era: An Age of Tireless Creativity", "hi": "गुप्त काल: अथक रचनात्मकता का युग", "descEn": "Part I: The golden age of Indian arts, science, and culture.", "descHi": "भाग I: भारतीय कला, विज्ञान और संस्कृति का स्वर्ण युग।"},
      {"id": 8, "en": "How Land Became Sacred", "hi": "भूमि कैसे पवित्र हो गई", "descEn": "Part I: Understanding the cultural and religious significance of land.", "descHi": "भाग I: भूमि के सांस्कृतिक और धार्मिक महत्व को समझना।"},
      {"id": 9, "en": "From Pilgrimage to Trade, Beyond India", "hi": "तीर्थयात्रा से व्यापार तक, भारत के पार", "descEn": "Part I: India's ancient connections with the rest of the world.", "descHi": "भाग I: शेष विश्व के साथ भारत के प्राचीन संबंध।"},
      {"id": 10, "en": "From the Rulers to the Ruled: Types of Government", "hi": "शासकों से शासित तक: सरकार के प्रकार", "descEn": "Part I: Different forms of government and administrative systems.", "descHi": "भाग I: सरकार और प्रशासनिक प्रणालियों के विभिन्न रूप।"},
      {"id": 11, "en": "The Constitution of India", "hi": "भारत का संविधान", "descEn": "Part I: Introduction to the fundamental principles of the Indian Constitution.", "descHi": "भाग I: भारतीय संविधान के मूल सिद्धांतों का परिचय।"},
      {"id": 12, "en": "From Barter to Money", "hi": "वस्तु विनिमय से मुद्रा तक", "descEn": "Part I: The evolution of trade and the monetary system.", "descHi": "भाग I: व्यापार और मौद्रिक प्रणाली का विकास।"},
      {"id": 13, "en": "The Story of Indian Farming", "hi": "भारतीय कृषि की कहानी", "descEn": "Part II: The history and development of agriculture in India.", "descHi": "भाग II: भारत में कृषि का इतिहास और विकास।"},
      {"id": 14, "en": "India and Her Neighbours", "hi": "भारत और उसके पड़ोसी", "descEn": "Part II: India's geopolitical and cultural relations with neighboring countries.", "descHi": "भाग II: पड़ोसी देशों के साथ भारत के भू-राजनीतिक और सांस्कृतिक संबंध।"},
      {"id": 15, "en": "Empires and Kingdoms: 6th to 10th Centuries", "hi": "साम्राज्य और राज्य: छठी से 10वीं शताब्दी", "descEn": "Part II: Political formations during the early medieval period.", "descHi": "भाग II: प्रारंभिक मध्ययुगीन काल के दौरान राजनीतिक संरचनाएँ।"},
      {"id": 16, "en": "Turning Tides: 11th and 12th Centuries", "hi": "बदलते ज्वार: 11वीं और 12वीं शताब्दी", "descEn": "Part II: Key historical shifts in the 11th and 12th centuries.", "descHi": "भाग II: 11वीं और 12वीं शताब्दी में प्रमुख ऐतिहासिक बदलाव।"},
      {"id": 17, "en": "The Delhi Sultanate", "hi": "दिल्ली सल्तनत", "descEn": "Part II: The establishment and expansion of the Delhi Sultanate.", "descHi": "भाग II: दिल्ली सल्तनत की स्थापना और विस्तार।"},
      {"id": 18, "en": "The Mughal Empire", "hi": "मुगल साम्राज्य", "descEn": "Part II: The history, culture, and architecture of the Mughal era.", "descHi": "भाग II: मुगल काल का इतिहास, संस्कृति और वास्तुकला।"},
      {"id": 19, "en": "Understanding Markets", "hi": "बाज़ारों को समझना", "descEn": "Part II: How local and global markets function.", "descHi": "भाग II: स्थानीय और वैश्विक बाज़ार कैसे काम करते हैं।"},
      {"id": 20, "en": "Media and Democracy", "hi": "मीडिया और लोकतंत्र", "descEn": "Part II: The role of media in shaping public opinion and democracy.", "descHi": "भाग II: जनमत और लोकतंत्र को आकार देने में मीडिया की भूमिका।"}
    ]
  },
  "Class 10": {
    "Mathematics": [
      {"id": 1, "en": "Real Numbers", "hi": "वास्तविक संख्याएँ", "descEn": "Fundamental Theorem of Arithmetic and irrational numbers.", "descHi": "अंकगणित का आधारभूत प्रमेय।"},
      {"id": 2, "en": "Polynomials", "hi": "बहुपद", "descEn": "Zeroes of a polynomial and relationship with coefficients.", "descHi": "बहुपद के शून्यक।"},
      {"id": 3, "en": "Pair of Linear Equations in Two Variables", "hi": "दो चर वाले रैखिक समीकरण युग्म", "descEn": "Algebraic and graphical methods of solving.", "descHi": "हल करने की बीजगणितीय और ग्राफिक विधियाँ।"},
      {"id": 4, "en": "Quadratic Equations", "hi": "द्विघात समीकरण", "descEn": "Solving by factorization and quadratic formula.", "descHi": "गुणनखंड द्वारा द्विघात समीकरण हल करना।"},
      {"id": 5, "en": "Arithmetic Progressions", "hi": "समांतर श्रेढ़ियाँ", "descEn": "Nth term and sum of first n terms of an AP.", "descHi": "समांतर श्रेणी का nवाँ पद।"},
      {"id": 6, "en": "Triangles", "hi": "त्रिभुज", "descEn": "Similarity of triangles and Pythagoras theorem.", "descHi": "त्रिभुजों की समरूपता और पाइथागोरस प्रमेय।"},
      {"id": 7, "en": "Coordinate Geometry", "hi": "निर्देशांक ज्यामिति", "descEn": "Distance formula and section formula.", "descHi": "दूरी सूत्र और विभाजन सूत्र।"},
      {"id": 8, "en": "Introduction to Trigonometry", "hi": "त्रिकोणमिति का परिचय", "descEn": "Trigonometric ratios and identities.", "descHi": "त्रिकोणमितीय अनुपात और सर्वसमिकाएँ।"},
      {"id": 9, "en": "Some Applications of Trigonometry", "hi": "त्रिकोणमिति के कुछ अनुप्रयोग", "descEn": "Heights and distances problems.", "descHi": "ऊंचाई और दूरी की समस्याएं।"},
      {"id": 10, "en": "Circles", "hi": "वृत्त", "descEn": "Tangents to a circle and their properties.", "descHi": "वृत्त की स्पर्श रेखाएँ।"},
      {"id": 11, "en": "Areas Related to Circles", "hi": "वृत्तों से संबंधित क्षेत्रफल", "descEn": "Perimeter and area of a circle, sector, and segment.", "descHi": "वृत्त के त्रिज्यखंड और वृत्तखंड का क्षेत्रफल।"},
      {"id": 12, "en": "Surface Areas and Volumes", "hi": "पृष्ठीय क्षेत्रफल और आयतन", "descEn": "Combinations of solids.", "descHi": "ठोसों का संयोजन।"},
      {"id": 13, "en": "Statistics", "hi": "सांख्यिकी", "descEn": "Mean, median, and mode of grouped data.", "descHi": "वर्गीकृत आंकड़ों का माध्य, माध्यिका और बहुलक।"},
      {"id": 14, "en": "Probability", "hi": "प्रायिकता", "descEn": "Theoretical probability of events.", "descHi": "घटनाओं की सैद्धांतिक प्रायिकता।"}
    ],
    "Science": [
      {"id": 1, "en": "Chemical Reactions and Equations", "hi": "रासायनिक अभिक्रियाएँ एवं समीकरण", "descEn": "Learn about balancing chemical equations and reaction types.", "descHi": "रासायनिक समीकरणों को संतुलित करना सीखें।"},
      {"id": 2, "en": "Acids, Bases and Salts", "hi": "अम्ल, क्षारक एवं लवण", "descEn": "Properties of acids, bases, and pH scale.", "descHi": "अम्ल, क्षार और pH स्केल के गुण।"},
      {"id": 3, "en": "Metals and Non-metals", "hi": "धातु एवं अधातु", "descEn": "Physical and chemical properties, extraction of metals.", "descHi": "धातुओं के भौतिक और रासायनिक गुण।"},
      {"id": 4, "en": "Carbon and Its Compounds", "hi": "कार्बन एवं उसके यौगिक", "descEn": "Covalent bonding, versatile nature of carbon.", "descHi": "सहसंयोजक बंधन, कार्बन की बहुमुखी प्रकृति।"},
      {"id": 5, "en": "Life Processes", "hi": "जैव प्रक्रम", "descEn": "Nutrition, respiration, transportation, and excretion.", "descHi": "पोषण, श्वसन, परिवहन और उत्सर्जन।"},
      {"id": 6, "en": "Control and Coordination", "hi": "नियंत्रण एवं समन्वय", "descEn": "Nervous system and hormones in plants and animals.", "descHi": "तंत्रिका तंत्र और हार्मोन।"},
      {"id": 7, "en": "How Do Organisms Reproduce?", "hi": "जीव जनन कैसे करते हैं?", "descEn": "Asexual and sexual reproduction.", "descHi": "अलैंगिक और लैंगिक प्रजनन।"},
      {"id": 8, "en": "Heredity", "hi": "आनुवंशिकता", "descEn": "Mendel's laws and inheritance of traits.", "descHi": "मेंडल के नियम और लक्षणों की विरासत।"},
      {"id": 9, "en": "Light – Reflection and Refraction", "hi": "प्रकाश — परावर्तन तथा अपवर्तन", "descEn": "Mirrors, lenses, and properties of light.", "descHi": "दर्पण, लेंस और प्रकाश के गुण।"},
      {"id": 10, "en": "The Human Eye and the Colourful World", "hi": "मानव नेत्र तथा रंगबिरंगा संसार", "descEn": "Defects of vision and dispersion of light.", "descHi": "दृष्टि दोष और प्रकाश का विक्षेपण।"},
      {"id": 11, "en": "Electricity", "hi": "विद्युत्", "descEn": "Ohm's law, resistance, and heating effect of current.", "descHi": "ओम का नियम, प्रतिरोध और धारा का ताप प्रभाव।"},
      {"id": 12, "en": "Magnetic Effects of Electric Current", "hi": "विद्युत् धारा के चुंबकीय प्रभाव", "descEn": "Magnetic fields, electromagnets, and motors.", "descHi": "चुंबकीय क्षेत्र, विद्युत चुंबक और मोटर।"},
      {"id": 13, "en": "Our Environment", "hi": "हमारा पर्यावरण", "descEn": "Ecosystems, food chains, and ozone depletion.", "descHi": "पारिस्थितिक तंत्र, खाद्य श्रृंखला और ओजोन परत।"}
    ],
    "Hindi": [
      {"id": 1, "en": "बड़े भाई साहब", "hi": "बड़े भाई साहब", "descEn": "A story by Premchand.", "descHi": "प्रेमचंद की एक कहानी।"},
      {"id": 2, "en": "डायरी का एक पन्ना", "hi": "डायरी का एक पन्ना", "descEn": "An excerpt from Sitaram Seksaria's diary.", "descHi": "सीताराम सेकसरिया की डायरी का एक अंश।"},
      {"id": 3, "en": "तताँरा-वामीरो कथा", "hi": "तताँरा-वामीरो कथा", "descEn": "A folk tale of Andaman.", "descHi": "अंडमान की एक लोककथा।"},
      {"id": 4, "en": "तीसरी कसम के शिल्पकार शैलेंद्र", "hi": "तीसरी कसम के शिल्पकार शैलेंद्र", "descEn": "An essay on lyricist Shailendra.", "descHi": "गीतकार शैलेंद्र पर एक निबंध।"},
      {"id": 5, "en": "अब कहाँ दूसरे के दुख से दुखी होने वाले", "hi": "अब कहाँ दूसरे के दुख से दुखी होने वाले", "descEn": "A thoughtful essay.", "descHi": "एक विचारोत्तेजक निबंध।"},
      {"id": 6, "en": "पतझर में टूटी पत्तियाँ", "hi": "पतझर में टूटी पत्तियाँ", "descEn": "A story about Zen philosophy.", "descHi": "ज़ेन दर्शन के बारे में एक कहानी।"},
      {"id": 7, "en": "कारतूस", "hi": "कारतूस", "descEn": "A one-act play.", "descHi": "एक एकांकी।"},
      {"id": 8, "en": "साखी", "hi": "साखी", "descEn": "Couplets of Kabir.", "descHi": "कबीर की साखी।"},
      {"id": 9, "en": "पद", "hi": "पद", "descEn": "Verses of Meerabai.", "descHi": "मीराबाई के पद।"},
      {"id": 10, "en": "मनुष्यता", "hi": "मनुष्यता", "descEn": "A poem by Maithili Sharan Gupt.", "descHi": "मैथिलीशरण गुप्त की कविता।"},
      {"id": 11, "en": "पर्वत प्रदेश में पावस", "hi": "पर्वत प्रदेश में पावस", "descEn": "A poem by Sumitranandan Pant.", "descHi": "सुमित्रानंदन पंत की एक कविता।"},
      {"id": 12, "en": "तोप", "hi": "तोप", "descEn": "A poem by Viren Dangwal.", "descHi": "वीरेन डंगवाल की एक कविता।"},
      {"id": 13, "en": "कर चले हम फ़िदा", "hi": "कर चले हम फ़िदा", "descEn": "A patriotic poem by Kaifi Azmi.", "descHi": "कैफ़ी आज़मी की एक देशभक्ति कविता।"},
      {"id": 14, "en": "आत्मत्राण", "hi": "आत्मत्राण", "descEn": "A poem by Rabindranath Tagore.", "descHi": "रवींद्रनाथ टैगोर की एक कविता।"}
    ],
    "English": [
      {"id": 1, "en": "A Letter to God", "hi": "भगवान को एक पत्र", "descEn": "First Flight: A story of extreme faith.", "descHi": "अत्यधिक विश्वास की एक कहानी।"},
      {"id": 2, "en": "Nelson Mandela: Long Walk to Freedom", "hi": "नेल्सन मंडेला: आज़ादी की लंबी यात्रा", "descEn": "First Flight: An autobiography excerpt.", "descHi": "एक आत्मकथा का अंश।"},
      {"id": 3, "en": "Two Stories about Flying", "hi": "उड़ान के बारे में दो कहानियाँ", "descEn": "First Flight: Overcoming fear and taking risks.", "descHi": "डर पर काबू पाना और जोखिम उठाना।"},
      {"id": 4, "en": "From the Diary of Anne Frank", "hi": "ऐनी फ्रैंक की डायरी से", "descEn": "First Flight: Insights into Anne Frank's life.", "descHi": "ऐनी फ्रैंक के जीवन की अंतर्दृष्टि।"},
      {"id": 5, "en": "The Hundred Dresses – I", "hi": "सौ पोशाकें - 1", "descEn": "First Flight: A story about a Polish girl.", "descHi": "एक पोलिश लड़की के बारे में कहानी।"},
      {"id": 6, "en": "The Hundred Dresses – II", "hi": "सौ पोशाकें - 2", "descEn": "First Flight: Conclusion of Wanda's story.", "descHi": "वांडा की कहानी का निष्कर्ष।"},
      {"id": 7, "en": "Glimpses of India", "hi": "भारत की झलकियाँ", "descEn": "First Flight: Three travelogues.", "descHi": "तीन यात्रा वृत्तांत।"},
      {"id": 8, "en": "Mijbil the Otter", "hi": "मिजबिल ऊदबिलाव", "descEn": "First Flight: Keeping an otter as a pet.", "descHi": "ऊदबिलाव को पालतू जानवर के रूप में रखना।"},
      {"id": 9, "en": "Madam Rides the Bus", "hi": "मैडम बस की सवारी करती हैं", "descEn": "First Flight: A young girl's first bus ride.", "descHi": "एक युवा लड़की की पहली बस सवारी।"},
      {"id": 10, "en": "The Sermon at Benares", "hi": "बनारस में उपदेश", "descEn": "First Flight: Lord Buddha's first sermon.", "descHi": "भगवान बुद्ध का प्रथम उपदेश।"},
      {"id": 11, "en": "The Proposal", "hi": "प्रस्ताव", "descEn": "First Flight: A Russian one-act play.", "descHi": "एक रूसी एकांकी।"},
      {"id": 12, "en": "A Triumph of Surgery", "hi": "सर्जरी की जीत", "descEn": "Footprints Without Feet: A story of an overfed dog.", "descHi": "ज्यादा खिलाए गए कुत्ते की कहानी।"},
      {"id": 13, "en": "The Thief's Story", "hi": "चोर की कहानी", "descEn": "Footprints Without Feet: A story of transformation.", "descHi": "परिवर्तन की एक कहानी।"},
      {"id": 14, "en": "The Midnight Visitor", "hi": "मध्यरात्रि का आगंतुक", "descEn": "Footprints Without Feet: A spy story.", "descHi": "एक जासूसी कहानी।"},
      {"id": 15, "en": "A Question of Trust", "hi": "विश्वास का सवाल", "descEn": "Footprints Without Feet: A story about a thief.", "descHi": "एक चोर के बारे में कहानी।"},
      {"id": 16, "en": "Footprints Without Feet", "hi": "बिना पैरों के निशान", "descEn": "Footprints Without Feet: An invisible man's tale.", "descHi": "एक अदृश्य आदमी की कहानी।"},
      {"id": 17, "en": "The Making of a Scientist", "hi": "वैज्ञानिक का निर्माण", "descEn": "Footprints Without Feet: Richard Ebright's journey.", "descHi": "रिचर्ड एब्राइट की यात्रा।"},
      {"id": 18, "en": "The Necklace", "hi": "हार", "descEn": "Footprints Without Feet: A story about greed.", "descHi": "लालच के बारे में एक कहानी।"},
      {"id": 19, "en": "Bholi", "hi": "भोली", "descEn": "Footprints Without Feet: A story about a neglected girl.", "descHi": "उपेक्षित लड़की की कहानी।"},
      {"id": 20, "en": "The Book That Saved the Earth", "hi": "वह किताब जिसने पृथ्वी को बचाया", "descEn": "Footprints Without Feet: A science fiction play.", "descHi": "एक विज्ञान कथा नाटक।"}
    ],
    "Social Science": [
      {"id": 1, "en": "The Rise of Nationalism in Europe", "hi": "यूरोप में राष्ट्रवाद का उदय", "descEn": "History: The emergence of modern nation-states in Europe.", "descHi": "इतिहास: यूरोप में आधुनिक राष्ट्र-राज्यों का उदय।"},
      {"id": 2, "en": "Nationalism in India", "hi": "भारत में राष्ट्रवाद", "descEn": "History: The Indian freedom struggle and Mahatma Gandhi.", "descHi": "इतिहास: भारतीय स्वतंत्रता संग्राम और महात्मा गांधी।"},
      {"id": 3, "en": "The Making of a Global World", "hi": "भूमंडलीकृत विश्व का बनना", "descEn": "History: History of globalization and trade.", "descHi": "इतिहास: वैश्वीकरण और व्यापार का इतिहास।"},
      {"id": 4, "en": "The Age of Industrialisation", "hi": "औद्योगीकरण का युग", "descEn": "History: The industrial revolution and its impact.", "descHi": "इतिहास: औद्योगिक क्रांति और उसका प्रभाव।"},
      {"id": 5, "en": "Print Culture and the Modern World", "hi": "मुद्रण संस्कृति और आधुनिक दुनिया", "descEn": "History: Development of print technology.", "descHi": "इतिहास: मुद्रण तकनीक का विकास।"},
      {"id": 6, "en": "Resources and Development", "hi": "संसाधन और विकास", "descEn": "Geography: Types of resources and land use.", "descHi": "भूगोल: संसाधनों के प्रकार और भूमि उपयोग।"},
      {"id": 7, "en": "Forest and Wildlife Resources", "hi": "वन और वन्यजीव संसाधन", "descEn": "Geography: Biodiversity and conservation.", "descHi": "भूगोल: जैव विविधता और संरक्षण।"},
      {"id": 8, "en": "Water Resources", "hi": "जल संसाधन", "descEn": "Geography: Water scarcity and multipurpose projects.", "descHi": "भूगोल: जल की कमी और बहुउद्देशीय परियोजनाएँ।"},
      {"id": 9, "en": "Agriculture", "hi": "कृषि", "descEn": "Geography: Types of farming and major crops.", "descHi": "भूगोल: खेती के प्रकार और प्रमुख फसलें।"},
      {"id": 10, "en": "Minerals and Energy Resources", "hi": "खनिज और ऊर्जा संसाधन", "descEn": "Geography: Distribution and conservation of minerals.", "descHi": "भूगोल: खनिजों का वितरण और संरक्षण।"},
      {"id": 11, "en": "Manufacturing Industries", "hi": "विनिर्माण उद्योग", "descEn": "Geography: Importance and types of manufacturing.", "descHi": "भूगोल: विनिर्माण का महत्व और प्रकार।"},
      {"id": 12, "en": "Lifelines of National Economy", "hi": "राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ", "descEn": "Geography: Transport and communication networks.", "descHi": "भूगोल: परिवहन और संचार नेटवर्क।"},
      {"id": 13, "en": "Power Sharing", "hi": "सत्ता की साझेदारी", "descEn": "Political Science: Importance of sharing power in democracies.", "descHi": "राजनीति विज्ञान: लोकतंत्र में सत्ता साझा करने का महत्व।"},
      {"id": 14, "en": "Federalism", "hi": "संघवाद", "descEn": "Political Science: Features of a federal government.", "descHi": "राजनीति विज्ञान: संघीय सरकार की विशेषताएं।"},
      {"id": 15, "en": "Gender, Religion and Caste", "hi": "लिंग, धर्म और जाति", "descEn": "Political Science: Inequalities in society and politics.", "descHi": "राजनीति विज्ञान: समाज और राजनीति में असमानताएं।"},
      {"id": 16, "en": "Political Parties", "hi": "राजनीतिक दल", "descEn": "Political Science: Role and functions of political parties.", "descHi": "राजनीति विज्ञान: राजनीतिक दलों की भूमिका और कार्य।"},
      {"id": 17, "en": "Outcomes of Democracy", "hi": "लोकतंत्र के परिणाम", "descEn": "Political Science: Evaluating democratic outcomes.", "descHi": "राजनीति विज्ञान: लोकतांत्रिक परिणामों का मूल्यांकन।"},
      {"id": 18, "en": "Development", "hi": "विकास", "descEn": "Economics: Concept of development and its indicators.", "descHi": "अर्थशास्त्र: विकास की अवधारणा और उसके संकेतक।"},
      {"id": 19, "en": "Sectors of the Indian Economy", "hi": "भारतीय अर्थव्यवस्था के क्षेत्रक", "descEn": "Economics: Primary, secondary, and tertiary sectors.", "descHi": "अर्थशास्त्र: प्राथमिक, द्वितीयक और तृतीयक क्षेत्र।"},
      {"id": 20, "en": "Money and Credit", "hi": "मुद्रा और साख", "descEn": "Economics: Formal and informal credit systems.", "descHi": "अर्थशास्त्र: औपचारिक और अनौपचारिक ऋण प्रणाली।"},
      {"id": 21, "en": "Globalisation and the Indian Economy", "hi": "वैश्वीकरण और भारतीय अर्थव्यवस्था", "descEn": "Economics: Impact of globalization on India.", "descHi": "अर्थशास्त्र: भारत पर वैश्वीकरण का प्रभाव।"},
      {"id": 22, "en": "Consumer Rights", "hi": "उपभोक्ता अधिकार", "descEn": "Economics: Protection of consumer interests.", "descHi": "अर्थशास्त्र: उपभोक्ता हितों का संरक्षण।"}
    ]
  },


  "Class 8": {
    "Mathematics": [
      {"id": 1, "en": "A Square and A Cube", "hi": "एक वर्ग और एक घन", "descEn": "Understanding squares, square roots, cubes, and cube roots.", "descHi": "वर्ग, वर्गमूल, घन और घनमूल को समझना।"},
      {"id": 2, "en": "Power Play", "hi": "घातों का खेल", "descEn": "Working with exponents and powers.", "descHi": "घातांक और घात के साथ कार्य करना।"},
      {"id": 3, "en": "A Story of Numbers", "hi": "संख्याओं की कहानी", "descEn": "Exploring properties and history of numbers.", "descHi": "संख्याओं के गुणों और इतिहास की खोज।"},
      {"id": 4, "en": "Quadrilaterals", "hi": "चतुर्भुज", "descEn": "Properties of different types of quadrilaterals.", "descHi": "विभिन्न प्रकार के चतुर्भुजों के गुण।"},
      {"id": 5, "en": "Number Play", "hi": "संख्याओं का खेल", "descEn": "Fun properties and patterns of numbers.", "descHi": "संख्याओं के मज़ेदार गुण और पैटर्न।"},
      {"id": 6, "en": "We Distribute, Yet Things Multiply", "hi": "हम बाँटते हैं, फिर भी चीज़ें गुणा होती हैं", "descEn": "Understanding algebraic expressions and distribution.", "descHi": "बीजीय व्यंजकों और वितरण को समझना।"},
      {"id": 7, "en": "Proportional Reasoning", "hi": "आनुपातिक तर्क", "descEn": "Direct and inverse proportions.", "descHi": "प्रत्यक्ष और व्युत्क्रमानुपाती।"},
      {"id": 8, "en": "Fractions in Disguise", "hi": "भेष में भिन्न", "descEn": "Advanced concepts in fractions and decimals.", "descHi": "भिन्न और दशमलव में उन्नत अवधारणाएँ।"},
      {"id": 9, "en": "The Baudhayana–Pythagoras Theorem", "hi": "बौधायन-पाइथागोरस प्रमेय", "descEn": "Understanding right-angled triangles and the theorem.", "descHi": "समकोण त्रिभुज और प्रमेय को समझना।"},
      {"id": 10, "en": "Playing with Data", "hi": "आँकड़ों के साथ खेलना", "descEn": "Data representation and interpretation.", "descHi": "आँकड़ों का प्रतिनिधित्व और व्याख्या।"},
      {"id": 11, "en": "Building with Bricks", "hi": "ईंटों से निर्माण", "descEn": "Visualising solid shapes and their properties.", "descHi": "ठोस आकृतियों और उनके गुणों की कल्पना करना।"},
      {"id": 12, "en": "Exploring 3D Shapes", "hi": "3D आकारों की खोज", "descEn": "Understanding faces, edges, and vertices of 3D shapes.", "descHi": "3D आकारों के फलक, किनारे और शीर्ष को समझना।"},
      {"id": 13, "en": "Visualising Solids", "hi": "ठोसों का दृश्य चित्रण", "descEn": "Representing 3D objects in 2D.", "descHi": "2D में 3D वस्तुओं का प्रतिनिधित्व करना।"},
      {"id": 14, "en": "Introducing Algebraic Identities", "hi": "बीजीय सर्वसमिकाओं का परिचय", "descEn": "Standard algebraic identities and their applications.", "descHi": "मानक बीजीय सर्वसमिकाएँ और उनके अनुप्रयोग।"},
      {"id": 15, "en": "Chances and Probability", "hi": "संभावना और प्रायिकता", "descEn": "Understanding probability and chance events.", "descHi": "प्रायिकता और संभावित घटनाओं को समझना।"}
    ],
    "Science": [
      {"id": 1, "en": "Exploring the Investigative World of Science", "hi": "विज्ञान की खोजी दुनिया की खोज", "descEn": "Introduction to scientific investigation and methodology.", "descHi": "वैज्ञानिक जाँच और कार्यप्रणाली का परिचय।"},
      {"id": 2, "en": "The Invisible Living World: Beyond Our Naked Eye", "hi": "अदृश्य सजीव दुनिया: हमारी नंगी आँखों से परे", "descEn": "Microorganisms and their roles.", "descHi": "सूक्ष्मजीव और उनकी भूमिकाएँ।"},
      {"id": 3, "en": "Health: The Ultimate Treasure", "hi": "स्वास्थ्य: अंतिम खजाना", "descEn": "Understanding diseases and maintaining good health.", "descHi": "बीमारियों को समझना और अच्छे स्वास्थ्य को बनाए रखना।"},
      {"id": 4, "en": "Electricity: Magnetic and Heating Effects", "hi": "विद्युत: चुंबकीय और उष्मीय प्रभाव", "descEn": "Effects of electric current.", "descHi": "विद्युत धारा के प्रभाव।"},
      {"id": 5, "en": "Exploring Forces", "hi": "बलों की खोज", "descEn": "Understanding different types of forces.", "descHi": "विभिन्न प्रकार के बलों को समझना।"},
      {"id": 6, "en": "Pressure, Winds, Storms, and Cyclones", "hi": "दबाव, हवाएँ, तूफान और चक्रवात", "descEn": "Atmospheric pressure and weather phenomena.", "descHi": "वायुमंडलीय दबाव और मौसम की घटनाएं।"},
      {"id": 7, "en": "Particulate Nature of Matter", "hi": "पदार्थ की कणिका प्रकृति", "descEn": "Understanding atoms, molecules, and states of matter.", "descHi": "परमाणु, अणु और पदार्थ की अवस्थाओं को समझना।"},
      {"id": 8, "en": "Carbon: The Building Block of Life", "hi": "कार्बन: जीवन का निर्माण खंड", "descEn": "Properties and importance of carbon compounds.", "descHi": "कार्बन यौगिकों के गुण और महत्व।"},
      {"id": 9, "en": "Light: Exploring Common Phenomena", "hi": "प्रकाश: सामान्य घटनाओं की खोज", "descEn": "Reflection, refraction, and optical instruments.", "descHi": "परावर्तन, अपवर्तन और ऑप्टिकल उपकरण।"},
      {"id": 10, "en": "Reaching the Age of Adolescence", "hi": "किशोरावस्था की ओर", "descEn": "Physical and emotional changes during puberty.", "descHi": "यौवन के दौरान शारीरिक और भावनात्मक परिवर्तन।"},
      {"id": 11, "en": "Keeping Time with the Skies", "hi": "आसमान के साथ समय का तालमेल", "descEn": "Astronomy and celestial movements.", "descHi": "खगोल विज्ञान और खगोलीय हलचलें।"},
      {"id": 12, "en": "How Nature Works in Harmony", "hi": "प्रकृति सद्भाव में कैसे काम करती है", "descEn": "Ecosystems and environmental balance.", "descHi": "पारिस्थितिक तंत्र और पर्यावरण संतुलन।"},
      {"id": 13, "en": "Our Home: Earth, a Unique Life-Sustaining Planet", "hi": "हमारा घर: पृथ्वी, एक अनूठा जीवन-निर्वाह करने वाला ग्रह", "descEn": "Earth's unique features supporting life.", "descHi": "जीवन का समर्थन करने वाली पृथ्वी की अनूठी विशेषताएं।"}
    ],
    "Hindi": [
      {"id": 1, "en": "लाख की चूड़ियाँ", "hi": "लाख की चूड़ियाँ", "descEn": "A poignant story by Kamtanath.", "descHi": "कामतानाथ की एक मार्मिक कहानी।"},
      {"id": 2, "en": "रेशम की डोरी", "hi": "रेशम की डोरी", "descEn": "A tale highlighting relationships and emotions.", "descHi": "रिश्तों और भावनाओं को उजागर करने वाली कहानी।"},
      {"id": 3, "en": "सच्चा मित्र", "hi": "सच्चा मित्र", "descEn": "A story about true friendship.", "descHi": "सच्ची दोस्ती के बारे में एक कहानी।"},
      {"id": 4, "en": "विज्ञान की दुनिया", "hi": "विज्ञान की दुनिया", "descEn": "An essay on the wonders of science.", "descHi": "विज्ञान के चमत्कारों पर एक निबंध।"},
      {"id": 5, "en": "भारत की खोज", "hi": "भारत की खोज", "descEn": "Excerpts from Discovery of India.", "descHi": "डिस्कवरी ऑफ इंडिया के अंश।"},
      {"id": 6, "en": "कर्मवीर", "hi": "कर्मवीर", "descEn": "A poem celebrating hard work and dedication.", "descHi": "कड़ी मेहनत और समर्पण का जश्न मनाने वाली कविता।"},
      {"id": 7, "en": "प्रकृति का संदेश", "hi": "प्रकृति का संदेश", "descEn": "A poem about the message of nature.", "descHi": "प्रकृति के संदेश के बारे में एक कविता।"},
      {"id": 8, "en": "समय का महत्व", "hi": "समय का महत्व", "descEn": "An essay on the importance of time.", "descHi": "समय के महत्व पर एक निबंध।"},
      {"id": 9, "en": "प्रेरणा", "hi": "प्रेरणा", "descEn": "A lesson providing inspiration.", "descHi": "प्रेरणा देने वाला एक पाठ।"},
      {"id": 10, "en": "नई राहें", "hi": "नई राहें", "descEn": "A story about forging new paths.", "descHi": "नए रास्ते बनाने के बारे में एक कहानी।"}
    ],
    "English": [
      {"id": 1, "en": "The Wit That Won Hearts", "hi": "वह बुद्धि जिसने दिल जीत लिया", "descEn": "Unit 1: Wit and Wisdom - A tale of cleverness.", "descHi": "इकाई 1: चतुराई की एक कहानी।"},
      {"id": 2, "en": "A Concrete Example", "hi": "एक ठोस उदाहरण", "descEn": "Unit 1: Wit and Wisdom - A story demonstrating practical intelligence.", "descHi": "इकाई 1: व्यावहारिक बुद्धिमत्ता प्रदर्शित करने वाली कहानी।"},
      {"id": 3, "en": "Wisdom Paves the Way", "hi": "बुद्धिमत्ता मार्ग प्रशस्त करती है", "descEn": "Unit 1: Wit and Wisdom - How wisdom helps overcome challenges.", "descHi": "इकाई 1: बुद्धिमत्ता चुनौतियों को दूर करने में कैसे मदद करती है।"},
      {"id": 4, "en": "A Tale of Valour: Major Somnath Sharma", "hi": "वीरता की एक कहानी: मेजर सोमनाथ शर्मा", "descEn": "Unit 2: Values and Dispositions - A story of a braveheart.", "descHi": "इकाई 2: एक वीर की कहानी।"},
      {"id": 5, "en": "Somebody's Mother", "hi": "किसी की माँ", "descEn": "Unit 2: Values and Dispositions - A poem about empathy.", "descHi": "इकाई 2: सहानुभूति के बारे में एक कविता।"},
      {"id": 6, "en": "Verghese Kurien – I Too Had a Dream", "hi": "वर्गीज कुरियन - मेरा भी एक सपना था", "descEn": "Unit 2: Values and Dispositions - Biography of the Milkman of India.", "descHi": "इकाई 2: भारत के मिल्कमैन की जीवनी।"},
      {"id": 7, "en": "The Case of the Fifth Word", "hi": "पांचवें शब्द का मामला", "descEn": "Unit 3: Mystery and Magic - A mysterious detective story.", "descHi": "इकाई 3: एक रहस्यमय जासूसी कहानी।"},
      {"id": 8, "en": "The Last Bargain", "hi": "अंतिम सौदा", "descEn": "Unit 3: Mystery and Magic - A poem by Rabindranath Tagore.", "descHi": "इकाई 3: रवींद्रनाथ टैगोर की एक कविता।"},
      {"id": 9, "en": "The Magic Paintbrush", "hi": "जादुई पेंटब्रश", "descEn": "Unit 3: Mystery and Magic - A magical folktale.", "descHi": "इकाई 3: एक जादुई लोककथा।"},
      {"id": 10, "en": "The Cherry Tree", "hi": "चेरी का पेड़", "descEn": "Unit 4: Environment - A story by Ruskin Bond.", "descHi": "इकाई 4: रस्किन बॉन्ड की एक कहानी।"},
      {"id": 11, "en": "Nature's Gift", "hi": "प्रकृति का उपहार", "descEn": "Unit 4: Environment - Appreciating the environment.", "descHi": "इकाई 4: पर्यावरण की सराहना।"},
      {"id": 12, "en": "The Blue Umbrella", "hi": "नीली छतरी", "descEn": "Unit 4: Environment - A heartwarming story about a little girl.", "descHi": "इकाई 4: एक छोटी लड़की के बारे में एक दिल छू लेने वाली कहानी।"},
      {"id": 13, "en": "Feathered Friend", "hi": "पंखों वाला दोस्त", "descEn": "Unit 5: Science and Curiosity - A science fiction story.", "descHi": "इकाई 5: एक विज्ञान कथा।"},
      {"id": 14, "en": "A Journey into Space", "hi": "अंतरिक्ष की यात्रा", "descEn": "Unit 5: Science and Curiosity - Exploring space.", "descHi": "इकाई 5: अंतरिक्ष की खोज।"},
      {"id": 15, "en": "Innovation for Tomorrow", "hi": "कल के लिए नवाचार", "descEn": "Unit 5: Science and Curiosity - The power of invention.", "descHi": "इकाई 5: आविष्कार की शक्ति।"},
      {"id": 16, "en": "The Wonder of Discovery", "hi": "खोज का आश्चर्य", "descEn": "Unit 5: Science and Curiosity - Excitement of scientific discovery.", "descHi": "इकाई 5: वैज्ञानिक खोज का उत्साह।"}
    ],
    "Social Science": [
      {"id": 1, "en": "Natural Resources and Their Use", "hi": "प्राकृतिक संसाधन और उनका उपयोग", "descEn": "Understanding types and conservation of natural resources.", "descHi": "प्राकृतिक संसाधनों के प्रकार और संरक्षण को समझना।"},
      {"id": 2, "en": "Reshaping India's Political Map", "hi": "भारत के राजनीतिक मानचित्र को नया आकार देना", "descEn": "Historical geography and political changes.", "descHi": "ऐतिहासिक भूगोल और राजनीतिक परिवर्तन।"},
      {"id": 3, "en": "The Rise of the Marathas", "hi": "मराठों का उदय", "descEn": "History of the Maratha empire.", "descHi": "मराठा साम्राज्य का इतिहास।"},
      {"id": 4, "en": "The Colonial Era in India", "hi": "भारत में औपनिवेशिक युग", "descEn": "Impact and history of British rule in India.", "descHi": "भारत में ब्रिटिश शासन का प्रभाव और इतिहास।"},
      {"id": 5, "en": "Universal Franchise and India's Electoral System", "hi": "सार्वभौमिक मताधिकार और भारत की चुनाव प्रणाली", "descEn": "Understanding elections and voting rights.", "descHi": "चुनाव और मतदान के अधिकार को समझना।"},
      {"id": 6, "en": "The Parliamentary System: Legislature and Executive", "hi": "संसदीय प्रणाली: विधायिका और कार्यपालिका", "descEn": "Functions of the Parliament and the Executive.", "descHi": "संसद और कार्यपालिका के कार्य।"},
      {"id": 7, "en": "Factors of Production", "hi": "उत्पादन के कारक", "descEn": "Understanding land, labor, capital, and enterprise.", "descHi": "भूमि, श्रम, पूंजी और उद्यम को समझना।"}
    ]
  },
  "Class 9": {
    "Mathematics": [
      {"id": 1, "en": "Number Systems", "hi": "संख्या पद्धति", "descEn": "Understanding rational and irrational numbers.", "descHi": "परिमेय और अपरिमेय संख्याओं को समझना।"},
      {"id": 2, "en": "Polynomials", "hi": "बहुपद", "descEn": "Variables, degrees, and factorization of polynomials.", "descHi": "बहुपदों के चर, घात और गुणनखंड।"},
      {"id": 3, "en": "Coordinate Geometry", "hi": "निर्देशांक ज्यामिति", "descEn": "Cartesian system and plotting points.", "descHi": "कार्तीय प्रणाली और बिंदुओं का आलेखन।"},
      {"id": 4, "en": "Linear Equations in Two Variables", "hi": "दो चरों वाले रैखिक समीकरण", "descEn": "Equations and their graphical representations.", "descHi": "समीकरण और उनके चित्रमय निरूपण।"},
      {"id": 5, "en": "Euclid's Geometry", "hi": "यूक्लिड की ज्यामिति", "descEn": "Introduction to axiomatic geometry.", "descHi": "स्वयंसिद्ध ज्यामिति का परिचय।"},
      {"id": 6, "en": "Lines and Angles", "hi": "रेखाएँ और कोण", "descEn": "Properties of lines and angles.", "descHi": "रेखाओं और कोणों के गुण।"},
      {"id": 7, "en": "Triangles", "hi": "त्रिभुज", "descEn": "Congruence and properties of triangles.", "descHi": "त्रिभुजों की सर्वांगसमता और गुण।"},
      {"id": 8, "en": "Quadrilaterals", "hi": "चतुर्भुज", "descEn": "Types and properties of quadrilaterals.", "descHi": "चतुर्भुजों के प्रकार और गुण।"},
      {"id": 9, "en": "Areas of Parallelograms and Triangles", "hi": "समानांतर चतुर्भुज और त्रिभुजों के क्षेत्रफल", "descEn": "Calculating areas of geometric shapes.", "descHi": "ज्यामितीय आकृतियों के क्षेत्रफल की गणना।"},
      {"id": 10, "en": "Circles", "hi": "वृत्त", "descEn": "Properties of circles and cyclic quadrilaterals.", "descHi": "वृत्तों और चक्रीय चतुर्भुजों के गुण।"},
      {"id": 11, "en": "Constructions", "hi": "रचनाएँ", "descEn": "Basic geometrical constructions.", "descHi": "बुनियादी ज्यामितीय रचनाएँ।"},
      {"id": 12, "en": "Heron's Formula", "hi": "हीरोन का सूत्र", "descEn": "Area of a triangle using Heron's formula.", "descHi": "हीरोन के सूत्र का उपयोग करके त्रिभुज का क्षेत्रफल।"},
      {"id": 13, "en": "Surface Areas and Volumes", "hi": "पृष्ठीय क्षेत्रफल और आयतन", "descEn": "Calculating surface area and volume of 3D shapes.", "descHi": "3D आकारों के पृष्ठीय क्षेत्रफल और आयतन की गणना।"},
      {"id": 14, "en": "Statistics", "hi": "सांख्यिकी", "descEn": "Data collection, presentation, and central tendency.", "descHi": "डेटा संग्रह, प्रस्तुति, और केंद्रीय प्रवृत्ति।"},
      {"id": 15, "en": "Probability", "hi": "प्रायिकता", "descEn": "Experimental approach to probability.", "descHi": "प्रायिकता के लिए प्रायोगिक दृष्टिकोण।"}
    ],
    "Science": [
      {"id": 1, "en": "Matter in Our Surroundings", "hi": "हमारे आस-पास के पदार्थ", "descEn": "Physical nature of matter and its states.", "descHi": "पदार्थ की भौतिक प्रकृति और उसकी अवस्थाएँ।"},
      {"id": 2, "en": "Is Matter Around Us Pure?", "hi": "क्या हमारे आस-पास के पदार्थ शुद्ध हैं?", "descEn": "Mixtures, solutions, and separation techniques.", "descHi": "मिश्रण, विलयन और पृथक्करण तकनीकें।"},
      {"id": 3, "en": "Atoms and Molecules", "hi": "परमाणु एवं अणु", "descEn": "Laws of chemical combination, atoms, and molecules.", "descHi": "रासायनिक संयोजन, परमाणु और अणु के नियम।"},
      {"id": 4, "en": "Structure of the Atom", "hi": "परमाणु की संरचना", "descEn": "Atomic models and subatomic particles.", "descHi": "परमाणु मॉडल और उपपरमाण्विक कण।"},
      {"id": 5, "en": "The Fundamental Unit of Life", "hi": "जीवन की मौलिक इकाई", "descEn": "Cells, cell structure, and functions.", "descHi": "कोशिकाएँ, कोशिका संरचना और कार्य।"},
      {"id": 6, "en": "Tissues", "hi": "ऊतक", "descEn": "Plant and animal tissues.", "descHi": "पादप और जंतु ऊतक।"},
      {"id": 7, "en": "Motion", "hi": "गति", "descEn": "Describing motion, speed, velocity, and acceleration.", "descHi": "गति, चाल, वेग और त्वरण का वर्णन।"},
      {"id": 8, "en": "Force and Laws of Motion", "hi": "बल तथा गति के नियम", "descEn": "Newton's laws of motion and momentum.", "descHi": "न्यूटन के गति के नियम और संवेग।"},
      {"id": 9, "en": "Gravitation", "hi": "गुरुत्वाकर्षण", "descEn": "Universal law of gravitation and free fall.", "descHi": "गुरुत्वाकर्षण का सार्वत्रिक नियम और मुक्त पतन।"},
      {"id": 10, "en": "Work and Energy", "hi": "कार्य तथा ऊर्जा", "descEn": "Concept of work, forms of energy, and power.", "descHi": "कार्य की अवधारणा, ऊर्जा के रूप और शक्ति।"},
      {"id": 11, "en": "Sound", "hi": "ध्वनि", "descEn": "Production, propagation, and reflection of sound.", "descHi": "ध्वनि का उत्पादन, प्रसार और परावर्तन।"},
      {"id": 12, "en": "Improvement in Food Resources", "hi": "खाद्य संसाधनों में सुधार", "descEn": "Crop yields, animal husbandry, and agriculture.", "descHi": "फसल की पैदावार, पशुपालन और कृषि।"}
    ],
    "Hindi": [
      {"id": 1, "en": "दुःख का अधिकार", "hi": "दुःख का अधिकार", "descEn": "A poignant story by Yashpal.", "descHi": "यशपाल की एक मार्मिक कहानी।"},
      {"id": 2, "en": "एवरेस्ट : मेरी शिखर यात्रा", "hi": "एवरेस्ट : मेरी शिखर यात्रा", "descEn": "Bachendri Pal's journey to Everest.", "descHi": "बछेंद्री पाल की एवरेस्ट यात्रा।"},
      {"id": 3, "en": "तुम कब जाओगे, अतिथि", "hi": "तुम कब जाओगे, अतिथि", "descEn": "A satirical essay by Sharad Joshi.", "descHi": "शरद जोशी का व्यंग्यात्मक निबंध।"},
      {"id": 4, "en": "वैज्ञानिक चेतना के वाहक – चंद्रशेखर वेंकट रमन", "hi": "वैज्ञानिक चेतना के वाहक – चंद्रशेखर वेंकट रमन", "descEn": "Biography of C.V. Raman.", "descHi": "सी.वी. रमन की जीवनी।"},
      {"id": 5, "en": "शुक्रतारे के समान", "hi": "शुक्रतारे के समान", "descEn": "An essay on Mahadev Desai.", "descHi": "महादेव देसाई पर एक निबंध।"},
      {"id": 6, "en": "कीचड़ का काव्य", "hi": "कीचड़ का काव्य", "descEn": "An essay by Kaka Kalelkar.", "descHi": "काका कालेलकर का निबंध।"},
      {"id": 7, "en": "रहीम के दोहे", "hi": "रहीम के दोहे", "descEn": "Couplets of Rahim.", "descHi": "रहीम के दोहे।"},
      {"id": 8, "en": "गीत-अगीत", "hi": "गीत-अगीत", "descEn": "A poem by Ramdhari Singh Dinkar.", "descHi": "रामधारी सिंह दिनकर की एक कविता।"},
      {"id": 9, "en": "अग्निपथ", "hi": "अग्निपथ", "descEn": "A motivational poem by Harivansh Rai Bachchan.", "descHi": "हरिवंश राय बच्चन की एक प्रेरक कविता।"},
      {"id": 10, "en": "नए इलाके में / खुशबू रचते हैं हाथ", "hi": "नए इलाके में / खुशबू रचते हैं हाथ", "descEn": "Poems by Arun Kamal.", "descHi": "अरुण कमल की कविताएँ।"},
      {"id": 11, "en": "बच्चे काम पर जा रहे हैं", "hi": "बच्चे काम पर जा रहे हैं", "descEn": "A poem highlighting child labor.", "descHi": "बाल श्रम को उजागर करने वाली एक कविता।"}
    ],
    "English": [
      {"id": 1, "en": "The Fun They Had", "hi": "वे मज़े जो उन्होंने किए", "descEn": "Beehive: A story about future schools.", "descHi": "भविष्य के स्कूलों के बारे में एक कहानी।"},
      {"id": 2, "en": "The Sound of Music", "hi": "संगीत की ध्वनि", "descEn": "Beehive: Inspiring stories of musicians.", "descHi": "संगीतकारों की प्रेरक कहानियाँ।"},
      {"id": 3, "en": "The Little Girl", "hi": "छोटी लड़की", "descEn": "Beehive: A story about a father and daughter.", "descHi": "एक पिता और बेटी के बारे में एक कहानी।"},
      {"id": 4, "en": "A Truly Beautiful Mind", "hi": "एक वास्तव में सुंदर मन", "descEn": "Beehive: Insights into Albert Einstein's life.", "descHi": "अल्बर्ट आइंस्टीन के जीवन में अंतर्दृष्टि।"},
      {"id": 5, "en": "The Snake and the Mirror", "hi": "सांप और आईना", "descEn": "Beehive: A humorous tale by Vaikom Muhammad Basheer.", "descHi": "वाइकोम मुहम्मद बशीर की एक हास्य कथा।"},
      {"id": 6, "en": "My Childhood", "hi": "मेरा बचपन", "descEn": "Beehive: An excerpt from APJ Abdul Kalam's autobiography.", "descHi": "एपीजे अब्दुल कलाम की आत्मकथा का एक अंश।"},
      {"id": 7, "en": "Reach for the Top", "hi": "शिखर पर पहुँचें", "descEn": "Beehive: Stories of Maria Sharapova and Santosh Yadav.", "descHi": "मारिया शारापोवा और संतोष यादव की कहानियाँ।"},
      {"id": 8, "en": "Kathmandu", "hi": "काठमांडू", "descEn": "Beehive: Travelogue by Vikram Seth.", "descHi": "विक्रम सेठ का यात्रा वृत्तांत।"},
      {"id": 9, "en": "If I Were You", "hi": "अगर मैं तुम होता", "descEn": "Beehive: A play by Douglas James.", "descHi": "डगलस जेम्स का एक नाटक।"},
      {"id": 10, "en": "The Lost Child", "hi": "खोया हुआ बच्चा", "descEn": "Moments: A poignant story about a lost child.", "descHi": "खोए हुए बच्चे के बारे में एक मार्मिक कहानी।"},
      {"id": 11, "en": "The Adventures of Toto", "hi": "टोटो के कारनामे", "descEn": "Moments: A story about a mischievous monkey.", "descHi": "एक शरारती बंदर के बारे में एक कहानी।"},
      {"id": 12, "en": "Iswaran the Storyteller", "hi": "ईश्वरन कहानीकार", "descEn": "Moments: A story within a story.", "descHi": "कहानी के भीतर एक कहानी।"},
      {"id": 13, "en": "In the Kingdom of Fools", "hi": "मूर्खों के राज्य में", "descEn": "Moments: A folktale about a foolish kingdom.", "descHi": "एक मूर्ख राज्य के बारे में एक लोककथा।"},
      {"id": 14, "en": "The Happy Prince", "hi": "हैप्पी प्रिंस", "descEn": "Moments: A story by Oscar Wilde.", "descHi": "ऑस्कर वाइल्ड की एक कहानी।"},
      {"id": 15, "en": "Weathering the Storm in Ersama", "hi": "इरसामा में तूफान का सामना", "descEn": "Moments: A story of survival during a cyclone.", "descHi": "चक्रवात के दौरान जीवित रहने की कहानी।"},
      {"id": 16, "en": "The Last Leaf", "hi": "आखिरी पत्ता", "descEn": "Moments: A story about hope and sacrifice.", "descHi": "आशा और बलिदान के बारे में एक कहानी।"},
      {"id": 17, "en": "A House Is Not a Home", "hi": "एक मकान घर नहीं होता", "descEn": "Moments: Adjusting to a new life after a tragedy.", "descHi": "त्रासदी के बाद नए जीवन में समायोजन।"},
      {"id": 18, "en": "The Accidental Tourist", "hi": "आकस्मिक पर्यटक", "descEn": "Moments: A humorous travel essay.", "descHi": "एक हास्य यात्रा निबंध।"},
      {"id": 19, "en": "The Beggar", "hi": "भिखारी", "descEn": "Moments: A story about transformation.", "descHi": "परिवर्तन के बारे में एक कहानी।"}
    ],
    "Social Science": [
      {"id": 1, "en": "India and the World", "hi": "भारत और विश्व", "descEn": "Part A: Understanding India's place globally.", "descHi": "भाग अ: वैश्विक स्तर पर भारत के स्थान को समझना।"},
      {"id": 2, "en": "Tapestry of the Past", "hi": "अतीत की टेपेस्ट्री", "descEn": "Part A: Exploring historical narratives.", "descHi": "भाग अ: ऐतिहासिक आख्यानों की खोज।"},
      {"id": 3, "en": "Our Cultural Heritage and Knowledge Traditions", "hi": "हमारी सांस्कृतिक विरासत और ज्ञान परंपराएं", "descEn": "Part A: Richness of Indian culture and knowledge.", "descHi": "भाग अ: भारतीय संस्कृति और ज्ञान की समृद्धि।"},
      {"id": 4, "en": "Governance and Democracy", "hi": "शासन और लोकतंत्र", "descEn": "Part A: Understanding democratic systems.", "descHi": "भाग अ: लोकतांत्रिक प्रणालियों को समझना।"},
      {"id": 5, "en": "Economic Life Around Us", "hi": "हमारे आसपास का आर्थिक जीवन", "descEn": "Part A: Basic economic activities.", "descHi": "भाग अ: बुनियादी आर्थिक गतिविधियाँ।"},
      {"id": 6, "en": "Understanding Society", "hi": "समाज को समझना", "descEn": "Part A: Societal structures and dynamics.", "descHi": "भाग अ: सामाजिक संरचनाएँ और गतिशीलता।"},
      {"id": 7, "en": "Resources and Sustainable Development", "hi": "संसाधन और सतत विकास", "descEn": "Part A: Managing resources sustainably.", "descHi": "भाग अ: संसाधनों का स्थायी प्रबंधन।"},
      {"id": 8, "en": "India's Diversity", "hi": "भारत की विविधता", "descEn": "Part A: Exploring the diverse nature of India.", "descHi": "भाग अ: भारत की विविध प्रकृति की खोज।"},
      {"id": 9, "en": "Our Environment", "hi": "हमारा पर्यावरण", "descEn": "Part A: Understanding environmental systems.", "descHi": "भाग अ: पर्यावरण प्रणालियों को समझना।"},
      {"id": 10, "en": "Constitutional Values and Citizenship", "hi": "संवैधानिक मूल्य और नागरिकता", "descEn": "Part B: The Constitution and citizens' roles.", "descHi": "भाग ब: संविधान और नागरिकों की भूमिका।"},
      {"id": 11, "en": "Rural and Urban India", "hi": "ग्रामीण और शहरी भारत", "descEn": "Part B: Contrasts and connections.", "descHi": "भाग ब: विरोधाभास और संबंध।"},
      {"id": 12, "en": "Agriculture and Food Security", "hi": "कृषि और खाद्य सुरक्षा", "descEn": "Part B: Ensuring food for all.", "descHi": "भाग ब: सभी के लिए भोजन सुनिश्चित करना।"},
      {"id": 13, "en": "Industry and Services", "hi": "उद्योग और सेवाएँ", "descEn": "Part B: Key sectors of the economy.", "descHi": "भाग ब: अर्थव्यवस्था के प्रमुख क्षेत्र।"},
      {"id": 14, "en": "India in the Contemporary World", "hi": "समकालीन विश्व में भारत", "descEn": "Part B: Modern global relations.", "descHi": "भाग ब: आधुनिक वैश्विक संबंध।"},
      {"id": 15, "en": "Disaster Management and Resilience", "hi": "आपदा प्रबंधन और लचीलापन", "descEn": "Part B: Preparing for and mitigating disasters.", "descHi": "भाग ब: आपदाओं के लिए तैयारी और शमन।"},
      {"id": 16, "en": "Understanding the Economy", "hi": "अर्थव्यवस्था को समझना", "descEn": "Part B: Macroeconomic concepts.", "descHi": "भाग ब: व्यापक आर्थिक अवधारणाएँ।"}
    ]
  }
};
