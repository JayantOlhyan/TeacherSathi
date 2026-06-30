export interface ChapterInfo {
  id: number;
  en: string;
  hi: string;
  descEn: string;
  descHi: string;
}

export type SubjectSyllabus = Record<string, ChapterInfo[]>;
export type ClassSyllabus = Record<string, SubjectSyllabus>;

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
      {
        "id": 1,
        "en": "Matribhumi (Poem)",
        "hi": "मातृभूमि (कविता)",
        "descEn": "Poem expressing deep patriotism and reverence for our motherland.",
        "descHi": "मातृभूमि के प्रति अटूट प्रेम और सम्मान प्रकट करने वाली कविता।"
      },
      {
        "id": 2,
        "en": "Gol (Memoir)",
        "hi": "गोल (संस्मरण)",
        "descEn": "Memoir of hockey legend Major Dhyan Chand emphasizing discipline and teamwork.",
        "descHi": "हॉकी के जादूगर मेजर ध्यानचंद का अनुशासन और टीम भावना सिखाने वाला संस्मरण।"
      },
      {
        "id": 3,
        "en": "Pahli Boond (Poem)",
        "hi": "पहली बूँद (कविता)",
        "descEn": "Poem capturing the refreshing joy and beauty of the first summer rain.",
        "descHi": "ग्रीष्म ऋतु के बाद पहली बारिश के आनंद और प्रकृति के सौंदर्य की कविता।"
      },
      {
        "id": 4,
        "en": "Haar Ki Jeet (Story)",
        "hi": "हार की जीत (कहानी)",
        "descEn": "Inspiring moral story by Sudarshan about compassion transforming a hardened heart.",
        "descHi": "सुदर्शन की मार्मिक कहानी जो दर्शाती है कि करुणा पत्थर दिल को भी बदल सकती है।"
      },
      {
        "id": 5,
        "en": "Rahim Ke Dohe",
        "hi": "रहीम के दोहे",
        "descEn": "Timeless couplets of Rahim offering practical wisdom and ethical teachings.",
        "descHi": "जीवन के व्यावहारिक ज्ञान और नैतिक आचरण को सिखाने वाले रहीम के अनमोल दोहे।"
      },
      {
        "id": 6,
        "en": "Meri Maa (Autobiography)",
        "hi": "मेरी माँ (आत्मकथा)",
        "descEn": "Ram Prasad Bismil's heartfelt autobiographical tribute to his mother's inspiration.",
        "descHi": "क्रांतिकारी रामप्रसाद बिस्मिल का अपनी माता के त्याग और प्रेरणा को समर्पित संस्मरण।"
      },
      {
        "id": 7,
        "en": "Jalate Chalo (Poem)",
        "hi": "जलाते चलो (कविता)",
        "descEn": "Poem motivating us to spread hope and optimism even in dark times.",
        "descHi": "अंधकार और कठिनाइयों के बीच आशा और उत्साह का दीप जलाए रखने की प्रेरक कविता।"
      },
      {
        "id": 8,
        "en": "Sattriya Aur Bihu Nritya (Essay)",
        "hi": "सत्रिया और बिहू नृत्य (निबंध)",
        "descEn": "Essay celebrating the traditional classical and folk dance forms of Assam.",
        "descHi": "असम के शास्त्रीय नृत्य 'सत्रिया' और लोक नृत्य 'बिहू' की समृद्ध संस्कृति का निबंध।"
      },
      {
        "id": 9,
        "en": "Maiya Main Nahin Makhan Khayo (Pad)",
        "hi": "मैया मैं नहिं माखन खायो (पद)",
        "descEn": "Surdas's affectionate verses depicting child Krishna's sweet explanation to Yashoda.",
        "descHi": "बाल कृष्ण द्वारा यशोदा माता के समक्ष माखन चोरी पर दी गई मधुर सफाई के सूरदास के पद।"
      },
      {
        "id": 10,
        "en": "Pariksha (Poem)",
        "hi": "परीक्षा (कविता)",
        "descEn": "Reflective poem assessing the real tests of character and perseverance in life.",
        "descHi": "जीवन के संघर्षों, धैर्य और वास्तविक योग्यता को परखने वाली कविता।"
      },
      {
        "id": 11,
        "en": "Chetak Ki Veerta (Poem)",
        "hi": "चेतक की वीरता (कविता)",
        "descEn": "Shyam Narayan Pandey's heroic ballad honoring Maharana Pratap's loyal steed Chetak.",
        "descHi": "महाराणा प्रताप के स्वामिभक्त घोड़े चेतक के साहस और युद्ध कौशल का वीर रस काव्य।"
      },
      {
        "id": 12,
        "en": "Hind Mahasagar Mein Chhota-sa Hindustan (Travelogue)",
        "hi": "हिंद महासागर में छोटा-सा हिंदुस्तान (यात्रा-वृत्तांत)",
        "descEn": "Ramdhari Singh Dinkar's travelogue depicting Indian cultural ties in Mauritius.",
        "descHi": "मॉरीशस में भारतीय संस्कृति की अमिट छाप को दर्शाता रामधारी सिंह 'दिनकर' का यात्रा-वृत्तांत।"
      },
      {
        "id": 13,
        "en": "Ped Ki Baat (Essay)",
        "hi": "पेड़ की बात (निबंध)",
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
      {"id": 1, "en": "Maa, Kah Ek Kahani", "hi": "माँ, कह एक कहानी", "descEn": "A classic poem by Maithili Sharan Gupt.", "descHi": "मैथिलीशरण गुप्त की एक क्लासिक कविता।"},
      {"id": 2, "en": "Teen Buddhiman", "hi": "तीन बुद्धिमान", "descEn": "An interesting tale of three wise individuals.", "descHi": "तीन बुद्धिमान व्यक्तियों की एक दिलचस्प कहानी।"},
      {"id": 3, "en": "Phool Aur Kaanta", "hi": "फूल और काँटा", "descEn": "A poem highlighting the contrasting nature of a flower and a thorn.", "descHi": "फूल और काँटे की विपरीत प्रकृति को उजागर करने वाली कविता।"},
      {"id": 4, "en": "Pani Re Pani", "hi": "पानी रे पानी", "descEn": "An essay on the importance and conservation of water.", "descHi": "जल के महत्व और संरक्षण पर एक निबंध।"},
      {"id": 5, "en": "Nahi Hona Beemar", "hi": "नहीं होना बीमार", "descEn": "A lesson on health and hygiene.", "descHi": "स्वास्थ्य और स्वच्छता पर एक पाठ।"},
      {"id": 6, "en": "Giridhar", "hi": "गिरिधर", "descEn": "Devotional verses dedicated to Lord Krishna.", "descHi": "भगवान कृष्ण को समर्पित भक्ति पद।"},
      {"id": 7, "en": "Varsha-Bahar", "hi": "वर्षा-बहार", "descEn": "A poem describing the beauty of the rainy season.", "descHi": "वर्षा ऋतु के सौंदर्य का वर्णन करने वाली कविता।"},
      {"id": 8, "en": "Birju Maharaj Se Sakshatkar", "hi": "बिरजू महाराज से साक्षात्कार", "descEn": "An interview with the legendary Kathak dancer, Pandit Birju Maharaj.", "descHi": "महान कथक नर्तक पंडित बिरजू महाराज के साथ एक साक्षात्कार।"},
      {"id": 9, "en": "Chidiya", "hi": "चिड़िया", "descEn": "A sweet poem about a little bird.", "descHi": "एक छोटी चिड़िया के बारे में एक प्यारी कविता।"},
      {"id": 10, "en": "Meera Ke Pad", "hi": "मीरा के पद", "descEn": "Devotional songs by the poet-saint Meera Bai.", "descHi": "कवयित्री-संत मीरा बाई के भक्ति गीत।"}
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
    "Science": [
      {
        "id": 1,
        "en": "Chemical Reactions and Equations",
        "hi": "रासायनिक अभिक्रियाएँ एवं समीकरण",
        "descEn": "Learn about balancing chemical equations and reaction types.",
        "descHi": "रासायनिक समीकरणों को संतुलित करना सीखें।"
      },
      {
        "id": 2,
        "en": "Acids, Bases and Salts",
        "hi": "अम्ल, क्षारक एवं लवण",
        "descEn": "Properties of acids, bases, and pH scale.",
        "descHi": "अम्ल, क्षार और pH स्केल के गुण।"
      },
      {
        "id": 3,
        "en": "Metals and Non-metals",
        "hi": "धातु एवं अधातु",
        "descEn": "Physical and chemical properties, extraction of metals.",
        "descHi": "धातुओं के भौतिक और रासायनिक गुण।"
      },
      {
        "id": 4,
        "en": "Carbon and its Compounds",
        "hi": "कार्बन एवं उसके यौगिक",
        "descEn": "Covalent bonding, versatile nature of carbon.",
        "descHi": "सहसंयोजक बंधन, कार्बन की बहुमुखी प्रकृति।"
      },
      {
        "id": 5,
        "en": "Life Processes",
        "hi": "जैव प्रक्रम",
        "descEn": "Nutrition, respiration, transportation, and excretion.",
        "descHi": "पोषण, श्वसन, परिवहन और उत्सर्जन।"
      },
      {
        "id": 6,
        "en": "Control and Coordination",
        "hi": "नियंत्रण एवं समन्वय",
        "descEn": "Nervous system and hormones in plants and animals.",
        "descHi": "तंत्रिका तंत्र और हार्मोन।"
      },
      {
        "id": 7,
        "en": "How do Organisms Reproduce?",
        "hi": "जीव जनन कैसे करते हैं?",
        "descEn": "Asexual and sexual reproduction.",
        "descHi": "अलैंगिक और लैंगिक प्रजनन।"
      },
      {
        "id": 8,
        "en": "Heredity",
        "hi": "आनुवंशिकता",
        "descEn": "Mendel's laws and inheritance of traits.",
        "descHi": "मेंडल के नियम और लक्षणों की विरासत।"
      },
      {
        "id": 9,
        "en": "Light — Reflection and Refraction",
        "hi": "प्रकाश — परावर्तन तथा अपवर्तन",
        "descEn": "Mirrors, lenses, and properties of light.",
        "descHi": "दर्पण, लेंस और प्रकाश के गुण।"
      },
      {
        "id": 10,
        "en": "The Human Eye and the Colourful World",
        "hi": "मानव नेत्र तथा रंगबिरंगा संसार",
        "descEn": "Defects of vision and dispersion of light.",
        "descHi": "दृष्टि दोष और प्रकाश का विक्षेपण।"
      },
      {
        "id": 11,
        "en": "Electricity",
        "hi": "विद्युत्",
        "descEn": "Ohm's law, resistance, and heating effect of current.",
        "descHi": "ओम का नियम, प्रतिरोध और धारा का ताप प्रभाव।"
      },
      {
        "id": 12,
        "en": "Magnetic Effects of Electric Current",
        "hi": "विद्युत् धारा के चुंबकीय प्रभाव",
        "descEn": "Magnetic fields, electromagnets, and motors.",
        "descHi": "चुंबकीय क्षेत्र, विद्युत चुंबक और मोटर।"
      },
      {
        "id": 13,
        "en": "Our Environment",
        "hi": "हमारा पर्यावरण",
        "descEn": "Ecosystems, food chains, and ozone depletion.",
        "descHi": "पारिस्थितिक तंत्र, खाद्य श्रृंखला और ओजोन परत।"
      }
    ],
    "Mathematics": [
      {
        "id": 1,
        "en": "Real Numbers",
        "hi": "वास्तविक संख्याएँ",
        "descEn": "Fundamental Theorem of Arithmetic and irrational numbers.",
        "descHi": "अंकगणित का आधारभूत प्रमेय।"
      },
      {
        "id": 2,
        "en": "Polynomials",
        "hi": "बहुपद",
        "descEn": "Zeroes of a polynomial and relationship with coefficients.",
        "descHi": "बहुपद के शून्यक।"
      },
      {
        "id": 3,
        "en": "Pair of Linear Equations in Two Variables",
        "hi": "दो चर वाले रैखिक समीकरण युग्म",
        "descEn": "Algebraic and graphical methods of solving.",
        "descHi": "हल करने की बीजगणितीय और ग्राफिक विधियाँ।"
      },
      {
        "id": 4,
        "en": "Quadratic Equations",
        "hi": "द्विघात समीकरण",
        "descEn": "Solving by factorization and quadratic formula.",
        "descHi": "गुणनखंड द्वारा द्विघात समीकरण हल करना।"
      },
      {
        "id": 5,
        "en": "Arithmetic Progressions",
        "hi": "समांतर श्रेढ़ियाँ",
        "descEn": "Nth term and sum of first n terms of an AP.",
        "descHi": "समांतर श्रेणी का nवाँ पद।"
      },
      {
        "id": 6,
        "en": "Triangles",
        "hi": "त्रिभुज",
        "descEn": "Similarity of triangles and Pythagoras theorem.",
        "descHi": "त्रिभुजों की समरूपता और पाइथागोरस प्रमेय।"
      },
      {
        "id": 7,
        "en": "Coordinate Geometry",
        "hi": "निर्देशांक ज्यामिति",
        "descEn": "Distance formula and section formula.",
        "descHi": "दूरी सूत्र और विभाजन सूत्र।"
      },
      {
        "id": 8,
        "en": "Introduction to Trigonometry",
        "hi": "त्रिकोणमिति का परिचय",
        "descEn": "Trigonometric ratios and identities.",
        "descHi": "त्रिकोणमितीय अनुपात और सर्वसमिकाएँ।"
      },
      {
        "id": 9,
        "en": "Some Applications of Trigonometry",
        "hi": "त्रिकोणमिति के कुछ अनुप्रयोग",
        "descEn": "Heights and distances problems.",
        "descHi": "ऊंचाई और दूरी की समस्याएं।"
      },
      {
        "id": 10,
        "en": "Circles",
        "hi": "वृत्त",
        "descEn": "Tangents to a circle and their properties.",
        "descHi": "वृत्त की स्पर्श रेखाएँ।"
      },
      {
        "id": 11,
        "en": "Areas Related to Circles",
        "hi": "वृत्तों से संबंधित क्षेत्रफल",
        "descEn": "Perimeter and area of a circle, sector, and segment.",
        "descHi": "वृत्त के त्रिज्यखंड और वृत्तखंड का क्षेत्रफल।"
      },
      {
        "id": 12,
        "en": "Surface Areas and Volumes",
        "hi": "पृष्ठीय क्षेत्रफल और आयतन",
        "descEn": "Combinations of solids.",
        "descHi": "ठोसों का संयोजन।"
      },
      {
        "id": 13,
        "en": "Statistics",
        "hi": "सांख्यिकी",
        "descEn": "Mean, median, and mode of grouped data.",
        "descHi": "वर्गीकृत आंकड़ों का माध्य, माध्यिका और बहुलक।"
      },
      {
        "id": 14,
        "en": "Probability",
        "hi": "प्रायिकता",
        "descEn": "Theoretical probability of events.",
        "descHi": "घटनाओं की सैद्धांतिक प्रायिकता।"
      }
    ]
  },

  "Class 8": {
    "Science": [
      {
        "id": 1,
        "en": "Components of Food",
        "hi": "भोजन के घटक",
        "descEn": "Learn about nutrients, balanced diet, and deficiency diseases.",
        "descHi": "पोषक तत्वों और संतुलित आहार के बारे में जानें।"
      },
      {
        "id": 2,
        "en": "Sorting Materials into Groups",
        "hi": "वस्तुओं के समूह बनाना",
        "descEn": "Classify materials based on properties like appearance, hardness.",
        "descHi": "विशेषताओं के आधार पर सामग्रियों का वर्गीकरण।"
      },
      {
        "id": 3,
        "en": "Separation of Substances",
        "hi": "पदार्थों का पृथक्करण",
        "descEn": "Study filtration, sedimentation, decantation, and evaporation.",
        "descHi": "निस्पंदन, अवसादन और वाष्पीकरण का अध्ययन करें।"
      },
      {
        "id": 4,
        "en": "Getting to Know Plants",
        "hi": "पौधों को जानिए",
        "descEn": "Explore structures of herbs, shrubs, trees, roots, and flowers.",
        "descHi": "पौधों, जड़ों और फूलों की संरचना का अन्वेषण।"
      },
      {
        "id": 5,
        "en": "Body Movements",
        "hi": "शरीर में गति",
        "descEn": "Study bones, joints, cartilage, and locomotion in animals.",
        "descHi": "हड्डियों, जोड़ों और गतिशीलता का अध्ययन।"
      },
      {
        "id": 6,
        "en": "The Living Organisms — Characteristics and Habitats",
        "hi": "सजीव - विशेषताएँ एवं आवास",
        "descEn": "Understand adaptations and habitats of living beings.",
        "descHi": "सजीवों के अनुकूलन और आवास को समझें।"
      },
      {
        "id": 7,
        "en": "Motion and Measurement of Distances",
        "hi": "गति एवं दूरियों का मापन",
        "descEn": "Learn about standard units of measurement and types of motion.",
        "descHi": "मापन की मानक इकाइयों और गति के प्रकारों के बारे में जानें।"
      },
      {
        "id": 8,
        "en": "Light, Shadows and Reflections",
        "hi": "प्रकाश, छायाएँ एवं परावर्तन",
        "descEn": "Understand luminous objects, shadows, and pinhole cameras.",
        "descHi": "चमकदार वस्तुओं, छाया और पिनहोल कैमरे को समझें।"
      },
      {
        "id": 9,
        "en": "Electricity and Circuits",
        "hi": "विद्युत् तथा परिपथ",
        "descEn": "Study electric cells, circuits, switches, and conductors.",
        "descHi": "विद्युत सेल, सर्किट, स्विच और सुचालक का अध्ययन।"
      },
      {
        "id": 10,
        "en": "Fun with Magnets",
        "hi": "चुंबकों द्वारा मनोरंजन",
        "descEn": "Explore magnetic poles, attraction, and repulsion.",
        "descHi": "चुंबकीय ध्रुवों, आकर्षण और प्रतिकर्षण का अन्वेषण।"
      },
      {
        "id": 11,
        "en": "Air Around Us",
        "hi": "हमारे चारों ओर वायु",
        "descEn": "Learn about the composition and importance of air.",
        "descHi": "वायु की संरचना और महत्व के बारे में जानें।"
      }
    ],
    "Mathematics": [
      {
        "id": 1,
        "en": "Knowing Our Numbers",
        "hi": "अपनी संख्याओं की जानकारी",
        "descEn": "Learn comparing numbers, place value, and large numbers.",
        "descHi": "बड़ी संख्याओं और स्थानीय मान को सीखें।"
      },
      {
        "id": 2,
        "en": "Whole Numbers",
        "hi": "पूर्ण संख्याएँ",
        "descEn": "Study natural numbers, whole numbers, and number line.",
        "descHi": "पूर्ण संख्याएं और संख्या रेखा।"
      },
      {
        "id": 3,
        "en": "Playing with Numbers",
        "hi": "संख्याओं के साथ खेलना",
        "descEn": "Learn factors, multiples, prime numbers, and LCM.",
        "descHi": "गुणनखंड, अभाज्य संख्याएँ, और लघुत्तम समापवर्त्य सीखें।"
      },
      {
        "id": 4,
        "en": "Basic Geometrical Ideas",
        "hi": "आधारभूत ज्यामितीय अवधारणाएँ",
        "descEn": "Understand points, lines, segments, angles, and polygons.",
        "descHi": "बिंदुओं, रेखाओं, और बहुभुजों को समझें।"
      },
      {
        "id": 5,
        "en": "Understanding Elementary Shapes",
        "hi": "प्रारंभिक आकारों को समझना",
        "descEn": "Study angles, triangles, and 3D shapes.",
        "descHi": "त्रिभुजों और 3D आकारों का अध्ययन करें।"
      },
      {
        "id": 6,
        "en": "Integers",
        "hi": "पूर्णांक",
        "descEn": "Learn positive and negative numbers and operations.",
        "descHi": "धनात्मक और ऋणात्मक संख्याएँ।"
      },
      {
        "id": 7,
        "en": "Fractions",
        "hi": "भिन्न",
        "descEn": "Understand proper, improper, mixed fractions.",
        "descHi": "भिन्न और उनके संचालन को समझें।"
      },
      {
        "id": 8,
        "en": "Decimals",
        "hi": "दशमलव",
        "descEn": "Learn decimal representations and operations.",
        "descHi": "दशमलव निरूपण और संक्रियाएँ।"
      },
      {
        "id": 9,
        "en": "Data Handling",
        "hi": "आँकड़ों का प्रबंधन",
        "descEn": "Study pictographs, bar graphs, and data organization.",
        "descHi": "पिक्टोग्राफ और बार ग्राफ का अध्ययन।"
      },
      {
        "id": 10,
        "en": "Mensuration",
        "hi": "क्षेत्रमिति",
        "descEn": "Calculate perimeter and area of basic shapes.",
        "descHi": "परिमाप और क्षेत्रफल की गणना।"
      },
      {
        "id": 11,
        "en": "Algebra",
        "hi": "बीजगणित",
        "descEn": "Introduction to variables and basic algebraic expressions.",
        "descHi": "चर और बीजगणितीय व्यंजकों का परिचय।"
      },
      {
        "id": 12,
        "en": "Ratio and Proportion",
        "hi": "अनुपात और समानुपात",
        "descEn": "Understand ratios, equivalent ratios, and unitary method.",
        "descHi": "अनुपात और एकात्मक विधि को समझें।"
      }
    ],
    "Social Science": [
      {
        "id": 1,
        "en": "What, Where, How and When?",
        "hi": "क्या, कब, कहाँ और कैसे?",
        "descEn": "Introduction to history and historical sources.",
        "descHi": "इतिहास और ऐतिहासिक स्रोतों का परिचय।"
      },
      {
        "id": 2,
        "en": "From Hunting-Gathering to Growing Food",
        "hi": "आखेट-खाद्य संग्रह से भोजन उत्पादन तक",
        "descEn": "Early human life and beginning of agriculture.",
        "descHi": "प्रारंभिक मानव जीवन और कृषि की शुरुआत।"
      },
      {
        "id": 3,
        "en": "In the Earliest Cities",
        "hi": "आरंभिक नगर",
        "descEn": "The Harappan civilization and town planning.",
        "descHi": "हड़प्पा सभ्यता और नगर नियोजन।"
      },
      {
        "id": 4,
        "en": "The Earth in the Solar System",
        "hi": "सौरमंडल में पृथ्वी",
        "descEn": "Study planets, stars, and the solar system.",
        "descHi": "ग्रहों, तारों और सौरमंडल का अध्ययन।"
      },
      {
        "id": 5,
        "en": "Globe: Latitudes and Longitudes",
        "hi": "ग्लोब: अक्षांश एवं देशांतर",
        "descEn": "Understand coordinates, time zones, and Earth's grid.",
        "descHi": "अक्षांश, देशांतर और समय क्षेत्रों को समझें।"
      },
      {
        "id": 6,
        "en": "Understanding Diversity",
        "hi": "विविधता की समझ",
        "descEn": "Explore cultural and geographic diversity in India.",
        "descHi": "भारत में सांस्कृतिक विविधता का अन्वेषण।"
      },
      {
        "id": 7,
        "en": "Diversity and Discrimination",
        "hi": "विविधता एवं भेदभाव",
        "descEn": "Learn about prejudice, stereotypes, and inequality.",
        "descHi": "पूर्वाग्रह, रूढ़िवादिता और असमानता के बारे में जानें।"
      },
      {
        "id": 8,
        "en": "What is Government?",
        "hi": "सरकार क्या है?",
        "descEn": "Levels of government and types of government.",
        "descHi": "सरकार के स्तर और प्रकार।"
      }
    ],
    "English": [
      {
        "id": 1,
        "en": "Who Did Patrick's Homework?",
        "hi": "पैट्रिक का होमवर्क किसने किया?",
        "descEn": "A story about taking responsibility.",
        "descHi": "जिम्मेदारी लेने के बारे में एक कहानी।"
      },
      {
        "id": 2,
        "en": "How the Dog Found Himself a New Master!",
        "hi": "कुत्ते ने अपना नया मालिक कैसे पाया!",
        "descEn": "A folktale about the domestication of dogs.",
        "descHi": "कुत्तों के पालतू बनने की एक लोककथा।"
      },
      {
        "id": 3,
        "en": "Taro's Reward",
        "hi": "टैरो का इनाम",
        "descEn": "A Japanese tale about a devoted son.",
        "descHi": "एक समर्पित बेटे की जापानी कहानी।"
      },
      {
        "id": 4,
        "en": "An Indian – American Woman in Space: Kalpana Chawla",
        "hi": "अंतरिक्ष में एक भारतीय-अमेरिकी महिला: कल्पना चावला",
        "descEn": "Biography of the famous astronaut.",
        "descHi": "प्रसिद्ध अंतरिक्ष यात्री की जीवनी।"
      },
      {
        "id": 5,
        "en": "A Different Kind of School",
        "hi": "एक अलग तरह का स्कूल",
        "descEn": "A story promoting empathy and understanding.",
        "descHi": "सहानुभूति को बढ़ावा देने वाली एक कहानी।"
      }
    ],
    "Hindi": [
      {
        "id": 1,
        "en": "Wah Chidiya Jo",
        "hi": "वह चिड़िया जो",
        "descEn": "A poem about a small, contented bird.",
        "descHi": "एक छोटी, संतोषी चिड़िया के बारे में कविता।"
      },
      {
        "id": 2,
        "en": "Bachpan",
        "hi": "बचपन",
        "descEn": "Memories of childhood by Krishna Sobti.",
        "descHi": "कृष्णा सोबती की बचपन की यादें।"
      },
      {
        "id": 3,
        "en": "Nadaan Dost",
        "hi": "नादान दोस्त",
        "descEn": "A story by Premchand about innocent mistakes.",
        "descHi": "प्रेमचंद की मासूम गलतियों के बारे में एक कहानी।"
      },
      {
        "id": 4,
        "en": "Chand Se Thodi Si Gappe",
        "hi": "चाँद से थोड़ी सी गप्पें",
        "descEn": "A child's conversation with the moon.",
        "descHi": "चाँद के साथ एक बच्चे की बातचीत।"
      },
      {
        "id": 5,
        "en": "Aksharon Ka Mahatva",
        "hi": "अक्षरों का महत्व",
        "descEn": "The importance and history of alphabets.",
        "descHi": "अक्षरों का महत्व और इतिहास।"
      }
    ]
  },
  "Class 9": {
    "Science": [
      {
        "id": 1,
        "en": "Chemical Reactions and Equations",
        "hi": "रासायनिक अभिक्रियाएँ एवं समीकरण",
        "descEn": "Learn about balancing chemical equations and reaction types.",
        "descHi": "रासायनिक समीकरणों को संतुलित करना सीखें।"
      },
      {
        "id": 2,
        "en": "Acids, Bases and Salts",
        "hi": "अम्ल, क्षारक एवं लवण",
        "descEn": "Properties of acids, bases, and pH scale.",
        "descHi": "अम्ल, क्षार और pH स्केल के गुण।"
      },
      {
        "id": 3,
        "en": "Metals and Non-metals",
        "hi": "धातु एवं अधातु",
        "descEn": "Physical and chemical properties, extraction of metals.",
        "descHi": "धातुओं के भौतिक और रासायनिक गुण।"
      },
      {
        "id": 4,
        "en": "Carbon and its Compounds",
        "hi": "कार्बन एवं उसके यौगिक",
        "descEn": "Covalent bonding, versatile nature of carbon.",
        "descHi": "सहसंयोजक बंधन, कार्बन की बहुमुखी प्रकृति।"
      },
      {
        "id": 5,
        "en": "Life Processes",
        "hi": "जैव प्रक्रम",
        "descEn": "Nutrition, respiration, transportation, and excretion.",
        "descHi": "पोषण, श्वसन, परिवहन और उत्सर्जन।"
      },
      {
        "id": 6,
        "en": "Control and Coordination",
        "hi": "नियंत्रण एवं समन्वय",
        "descEn": "Nervous system and hormones in plants and animals.",
        "descHi": "तंत्रिका तंत्र और हार्मोन।"
      },
      {
        "id": 7,
        "en": "How do Organisms Reproduce?",
        "hi": "जीव जनन कैसे करते हैं?",
        "descEn": "Asexual and sexual reproduction.",
        "descHi": "अलैंगिक और लैंगिक प्रजनन।"
      },
      {
        "id": 8,
        "en": "Heredity",
        "hi": "आनुवंशिकता",
        "descEn": "Mendel's laws and inheritance of traits.",
        "descHi": "मेंडल के नियम और लक्षणों की विरासत।"
      },
      {
        "id": 9,
        "en": "Light — Reflection and Refraction",
        "hi": "प्रकाश — परावर्तन तथा अपवर्तन",
        "descEn": "Mirrors, lenses, and properties of light.",
        "descHi": "दर्पण, लेंस और प्रकाश के गुण।"
      },
      {
        "id": 10,
        "en": "The Human Eye and the Colourful World",
        "hi": "मानव नेत्र तथा रंगबिरंगा संसार",
        "descEn": "Defects of vision and dispersion of light.",
        "descHi": "दृष्टि दोष और प्रकाश का विक्षेपण।"
      },
      {
        "id": 11,
        "en": "Electricity",
        "hi": "विद्युत्",
        "descEn": "Ohm's law, resistance, and heating effect of current.",
        "descHi": "ओम का नियम, प्रतिरोध और धारा का ताप प्रभाव।"
      },
      {
        "id": 12,
        "en": "Magnetic Effects of Electric Current",
        "hi": "विद्युत् धारा के चुंबकीय प्रभाव",
        "descEn": "Magnetic fields, electromagnets, and motors.",
        "descHi": "चुंबकीय क्षेत्र, विद्युत चुंबक और मोटर।"
      },
      {
        "id": 13,
        "en": "Our Environment",
        "hi": "हमारा पर्यावरण",
        "descEn": "Ecosystems, food chains, and ozone depletion.",
        "descHi": "पारिस्थितिक तंत्र, खाद्य श्रृंखला और ओजोन परत।"
      }
    ],
    "Mathematics": [
      {
        "id": 1,
        "en": "Real Numbers",
        "hi": "वास्तविक संख्याएँ",
        "descEn": "Fundamental Theorem of Arithmetic and irrational numbers.",
        "descHi": "अंकगणित का आधारभूत प्रमेय।"
      },
      {
        "id": 2,
        "en": "Polynomials",
        "hi": "बहुपद",
        "descEn": "Zeroes of a polynomial and relationship with coefficients.",
        "descHi": "बहुपद के शून्यक।"
      },
      {
        "id": 3,
        "en": "Pair of Linear Equations in Two Variables",
        "hi": "दो चर वाले रैखिक समीकरण युग्म",
        "descEn": "Algebraic and graphical methods of solving.",
        "descHi": "हल करने की बीजगणितीय और ग्राफिक विधियाँ।"
      },
      {
        "id": 4,
        "en": "Quadratic Equations",
        "hi": "द्विघात समीकरण",
        "descEn": "Solving by factorization and quadratic formula.",
        "descHi": "गुणनखंड द्वारा द्विघात समीकरण हल करना।"
      },
      {
        "id": 5,
        "en": "Arithmetic Progressions",
        "hi": "समांतर श्रेढ़ियाँ",
        "descEn": "Nth term and sum of first n terms of an AP.",
        "descHi": "समांतर श्रेणी का nवाँ पद।"
      },
      {
        "id": 6,
        "en": "Triangles",
        "hi": "त्रिभुज",
        "descEn": "Similarity of triangles and Pythagoras theorem.",
        "descHi": "त्रिभुजों की समरूपता और पाइथागोरस प्रमेय।"
      },
      {
        "id": 7,
        "en": "Coordinate Geometry",
        "hi": "निर्देशांक ज्यामिति",
        "descEn": "Distance formula and section formula.",
        "descHi": "दूरी सूत्र और विभाजन सूत्र।"
      },
      {
        "id": 8,
        "en": "Introduction to Trigonometry",
        "hi": "त्रिकोणमिति का परिचय",
        "descEn": "Trigonometric ratios and identities.",
        "descHi": "त्रिकोणमितीय अनुपात और सर्वसमिकाएँ।"
      },
      {
        "id": 9,
        "en": "Some Applications of Trigonometry",
        "hi": "त्रिकोणमिति के कुछ अनुप्रयोग",
        "descEn": "Heights and distances problems.",
        "descHi": "ऊंचाई और दूरी की समस्याएं।"
      },
      {
        "id": 10,
        "en": "Circles",
        "hi": "वृत्त",
        "descEn": "Tangents to a circle and their properties.",
        "descHi": "वृत्त की स्पर्श रेखाएँ।"
      },
      {
        "id": 11,
        "en": "Areas Related to Circles",
        "hi": "वृत्तों से संबंधित क्षेत्रफल",
        "descEn": "Perimeter and area of a circle, sector, and segment.",
        "descHi": "वृत्त के त्रिज्यखंड और वृत्तखंड का क्षेत्रफल।"
      },
      {
        "id": 12,
        "en": "Surface Areas and Volumes",
        "hi": "पृष्ठीय क्षेत्रफल और आयतन",
        "descEn": "Combinations of solids.",
        "descHi": "ठोसों का संयोजन।"
      },
      {
        "id": 13,
        "en": "Statistics",
        "hi": "सांख्यिकी",
        "descEn": "Mean, median, and mode of grouped data.",
        "descHi": "वर्गीकृत आंकड़ों का माध्य, माध्यिका और बहुलक।"
      },
      {
        "id": 14,
        "en": "Probability",
        "hi": "प्रायिकता",
        "descEn": "Theoretical probability of events.",
        "descHi": "घटनाओं की सैद्धांतिक प्रायिकता।"
      }
    ]
  }
};
