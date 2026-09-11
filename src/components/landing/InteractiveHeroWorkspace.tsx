"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  BookOpen, 
  Monitor, 
  Video, 
  Network, 
  HelpCircle, 
  FileCheck2, 
  FileText, 
  CheckCircle2, 
  Play, 
  Pause, 
  Download, 
  LayoutTemplate, 
  Volume2, 
  VolumeX,
  Sparkles, 
  Loader2,
  ChevronDown,
  GraduationCap,
  Maximize2,
  Minimize2,
  Smartphone,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  QrCode,
  PenTool,
  Printer,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// NCERT Mock datasets for interactive selection
const CHAPTER_DATA: Record<string, Record<string, { en: string; hi: string }[]>> = {
  "8": {
    "Science": [
      { en: "Conservation of Plants and Animals", hi: "पौधों एवं जंतुओं का संरक्षण" },
      { en: "Crop Production and Management", hi: "फसल उत्पादन एवं प्रबंध" },
      { en: "Microorganisms: Friend and Foe", hi: "सूक्ष्मजीव: मित्र एवं शत्रु" },
      { en: "Cell - Structure and Functions", hi: "कोशिका - संरचना एवं प्रकार्य" }
    ],
    "Maths": [
      { en: "Rational Numbers", hi: "परिमेय संख्याएँ" },
      { en: "Linear Equations in One Variable", hi: "एक चर वाले रैखिक समीकरण" },
      { en: "Understanding Quadrilaterals", hi: "चतुर्भुजों को समझना" },
      { en: "Data Handling", hi: "आँकड़ों का प्रबंधन" }
    ],
    "Social Science": [
      { en: "Resources and Development", hi: "संसाधन एवं विकास" },
      { en: "The Indian Constitution", hi: "भारतीय संविधान" },
      { en: "Land, Soil, Water Resources", hi: "भूमि, मृदा, जल संसाधन" },
      { en: "Ruling the Countryside", hi: "ग्रामीण क्षेत्र पर शासन चलाना" }
    ],
    "English": [
      { en: "The Best Christmas Present", hi: "क्रिसमस का सर्वश्रेष्ठ उपहार" },
      { en: "The Tsunami", hi: "सुनामी" },
      { en: "Glimpses of the Past", hi: "अतीत की झलकियां" },
      { en: "Macavity: The Mystery Cat", hi: "मैकेविटी: रहस्यमयी बिल्ली" }
    ],
    "Hindi": [
      { en: "Dhvani (Poem)", hi: "ध्वनि (कविता)" },
      { en: "Lakh ki Chudiyan", hi: "लाख की चूड़ियां" },
      { en: "Bus ki Yatra", hi: "बस की यात्रा" },
      { en: "Deewano ki Hasti", hi: "दीवानों की हस्ती" }
    ]
  },
  "9": {
    "Science": [
      { en: "Matter in Our Surroundings", hi: "हमारे आस-पास के पदार्थ" },
      { en: "Is Matter Around Us Pure", hi: "क्या हमारे आस-पास के पदार्थ शुद्ध हैं" },
      { en: "Atoms and Molecules", hi: "परमाणु एवं अणु" },
      { en: "The Fundamental Unit of Life", hi: "जीवन की मौलिक इकाई" }
    ],
    "Maths": [
      { en: "Number Systems", hi: "संख्या पद्धति" },
      { en: "Polynomials", hi: "बहुपद" },
      { en: "Coordinate Geometry", hi: "निर्देशांक ज्यामिति" },
      { en: "Linear Equations", hi: "दो चरों वाले रैखिक समीकरण" }
    ],
    "Social Science": [
      { en: "The French Revolution", hi: "फ्रांसीसी क्रांति" },
      { en: "Socialism in Europe", hi: "यूरोप में समाजवाद" },
      { en: "India - Size and Location", hi: "भारत - आकार और स्थिति" },
      { en: "Physical Features of India", hi: "भारत का भौतिक स्वरूप" }
    ],
    "English": [
      { en: "The Fun They Had", hi: "द फन दे हैड" },
      { en: "The Sound of Music", hi: "द साउंड ऑफ म्यूजिक" },
      { en: "The Little Girl", hi: "द लिटिल गर्ल" },
      { en: "A Truly Beautiful Mind", hi: "अ ट्रूली ब्यूटीफुल माइंड" }
    ],
    "Hindi": [
      { en: "Do Bailon ki Katha", hi: "दो बैलों की कथा" },
      { en: "Lhasa ki Aur", hi: "ल्हासा की ओर" },
      { en: "Upbhoktavad ki Sanskriti", hi: "उपभोक्तावाद की संस्कृति" },
      { en: "Saakhiyan evam Sabad", hi: "साखियाँ एवं सबद" }
    ]
  },
  "10": {
    "Science": [
      { en: "Light - Reflection and Refraction", hi: "प्रकाश - परावर्तन तथा अपवर्तन" },
      { en: "Chemical Reactions and Equations", hi: "रासायनिक अभिक्रियाएं एवं समीकरण" },
      { en: "Acids, Bases and Salts", hi: "अम्ल, क्षारक एवं लवण" },
      { en: "Life Processes", hi: "जैव प्रक्रम" }
    ],
    "Maths": [
      { en: "Real Numbers", hi: "वास्तविक संख्याएँ" },
      { en: "Polynomials", hi: "बहुपद" },
      { en: "Pair of Linear Equations", hi: "दो चरों वाले रैखिक समीकरण युग्म" },
      { en: "Quadratic Equations", hi: "द्विघात समीकरण" }
    ],
    "Social Science": [
      { en: "The Rise of Nationalism in Europe", hi: "यूरोप में राष्ट्रवाद का उदय" },
      { en: "Nationalism in India", hi: "भारत में राष्ट्रवाद" },
      { en: "Resources and Development", hi: "संसाधन एवं विकास" },
      { en: "Power Sharing", hi: "सत्ता की साझेदारी" }
    ],
    "English": [
      { en: "A Letter to God", hi: "अ लेटर टू गॉड" },
      { en: "Nelson Mandela: Long Walk to Freedom", hi: "नेल्सन मंडेला: आज़ादी की लंबी यात्रा" },
      { en: "Two Stories about Flying", hi: "टू स्टोरीज़ अबाउट फ्लाइंग" },
      { en: "From the Diary of Anne Frank", hi: "ऐनी फ्रैंक की डायरी" }
    ],
    "Hindi": [
      { en: "Pad (Surdas)", hi: "पद (सूरदास)" },
      { en: "Ram-Lakshman-Parashuram Samvad", hi: "राम-लक्ष्मण-परशुराम संवाद" },
      { en: "Netaji ka Chashma", hi: "नेताजी का चश्मा" },
      { en: "Balgobin Bhagat", hi: "बालगोबिन भगत" }
    ]
  }
};

interface TeacherPersona {
  name: string;
  role: string;
  school: string;
  avatar: string;
}

const TEACHER_PERSONAS: TeacherPersona[] = [
  { name: "Ananya Sharma", role: "TGT Science", school: "Class 8-A • KVS Delhi", avatar: "AS" },
  { name: "Ramesh Kumar", role: "PGT Mathematics", school: "Class 10-B • Govt Model School", avatar: "RK" },
  { name: "Sunita Devi", role: "TGT Social Science", school: "Class 9-A • PM Shri School", avatar: "SD" }
];

export default function InteractiveHeroWorkspace() {
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeAssetTab, setActiveAssetTab] = useState("Presentation");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Dashboard");
  
  // Interactive Concept Card Selection
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  // Video Player States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLang, setVideoLang] = useState<"bilingual" | "hi" | "en">("bilingual");

  // Tab Loading state
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Quiz States
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Worksheet State
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Modals & OS Controls
  const [isFullscreenPresenter, setIsFullscreenPresenter] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isTouchMode, setIsTouchMode] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [recordTimer] = useState("04:12");
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [activePenTool, setActivePenTool] = useState<"pointer" | "pen" | "highlighter">("pointer");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generation Progress Bar States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const currentClassData = CHAPTER_DATA[selectedClass] || CHAPTER_DATA["8"];
  const availableSubjects = Object.keys(currentClassData);
  const chaptersList = currentClassData[selectedSubject] || currentClassData["Science"] || [];
  const activeChapter = chaptersList[selectedChapterIndex] || chaptersList[0] || {
    en: "Conservation of Plants and Animals",
    hi: "पौधों एवं जंतुओं का संरक्षण"
  };

  const activePersona = TEACHER_PERSONAS[currentPersonaIndex];

  // Show quick toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Video playback scrubber simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVideoPlaying]);

  // Fullscreen keyboard listener (Escape to close, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreenPresenter) return;
      if (e.key === "Escape") setIsFullscreenPresenter(false);
      if (e.key === "ArrowRight") setCurrentSlideIndex((prev) => Math.min(12, prev + 1));
      if (e.key === "ArrowLeft") setCurrentSlideIndex((prev) => Math.max(1, prev - 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenPresenter]);

  const handleClassChange = (c: string) => {
    setSelectedClass(c);
    const newClassData = CHAPTER_DATA[c] || CHAPTER_DATA["8"];
    const firstSub = Object.keys(newClassData)[0];
    setSelectedSubject(firstSub);
    setSelectedChapterIndex(0);
    setCurrentSlideIndex(1);
    setSelectedCardIndex(null);
    setQuizSelectedOption(null);
    setQuizQuestionIndex(0);
    triggerToast(`Class ${c} NCERT syllabus loaded.`);
  };

  const handleSubjectChange = (s: string) => {
    setSelectedSubject(s);
    setSelectedChapterIndex(0);
    setCurrentSlideIndex(1);
    setSelectedCardIndex(null);
    setQuizSelectedOption(null);
    setQuizQuestionIndex(0);
    triggerToast(`${s} chapters updated.`);
  };

  const handleChapterChange = (idx: number) => {
    setSelectedChapterIndex(idx);
    setCurrentSlideIndex(1);
    setSelectedCardIndex(null);
    setQuizSelectedOption(null);
    setQuizQuestionIndex(0);
    triggerToast(`Switched to Chapter ${idx + 1}: ${chaptersList[idx]?.en}`);
  };

  const handleTabSwitch = (tabId: string) => {
    if (tabId === activeAssetTab) return;
    setIsTabLoading(true);
    setActiveAssetTab(tabId);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 180);
  };

  const handleSidebarNav = (name: string) => {
    setActiveSidebarItem(name);
    if (name === "Dashboard") {
      setActiveAssetTab("Presentation");
    } else if (name === "My Lessons") {
      setActiveAssetTab("Presentation");
      triggerToast("Opening Smartboard Presentation Slide Deck");
    } else if (name === "Resources") {
      setActiveAssetTab("MindMap");
      triggerToast("Opening Bilingual NCERT Mind Map");
    } else if (name === "Quizzes") {
      setActiveAssetTab("Quiz");
      triggerToast("Opening Live Student MCQ Poll");
    } else if (name === "Worksheets") {
      setActiveAssetTab("Worksheet");
      triggerToast("Opening CBSE Printable Worksheet Format");
    }
  };

  const handleGenerateKit = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 450);
    setTimeout(() => setGenerationStep(3), 900);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(0);
      setActiveAssetTab("Presentation");
      setCurrentSlideIndex(1);
      triggerToast(`✨ Class ${selectedClass} ${selectedSubject} Kit Generated in 1.4s!`);
    }, 1400);
  };

  // Dynamic Concept Cards based on subject/chapter
  const getDynamicCards = () => {
    if (selectedSubject === "Science") {
      if (activeChapter.en.includes("Conservation")) {
        return [
          { icon: "🌿", title: "1. Biodiversity & Flora", hi: "जैव विविधता एवं वनस्पति", desc: "Endemic species & conservation in Pachmarhi Biosphere Reserve.", detail: "Covers flora (Sal, Teak, Mango) and fauna (Cheetal, Barking Deer, Leopard) strictly protected under Indian Wildlife Act 1972." },
          { icon: "🛡️", title: "2. Protected Habitats", hi: "संरक्षित प्राकृतिक आवास", desc: "National parks, wildlife sanctuaries & strict biosphere zones.", detail: "Differentiates National Parks (Satpura) vs Wildlife Sanctuaries (Bori) with core, buffer, and transition zones." },
          { icon: "📖", title: "3. Red Data Book", hi: "रेड डाटा पुस्तक", desc: "Official registry of endangered animal & plant species.", detail: "Maintained by IUCN. Identifies vulnerable, endangered, and critically threatened species in Indian forests." }
        ];
      }
      if (activeChapter.en.includes("Light")) {
        return [
          { icon: "💡", title: "1. Laws of Reflection", hi: "परावर्तन के नियम", desc: "Angle of incidence equals angle of reflection (i = r).", detail: "Incident ray, reflected ray and normal all lie in the same plane at point of incidence." },
          { icon: "🪞", title: "2. Spherical Mirrors", hi: "गोलीय दर्पण", desc: "Concave (converging) vs Convex (diverging) mirror optics.", detail: "Focal length formula f = R/2, mirror equation 1/v + 1/u = 1/f with Cartesian sign conventions." },
          { icon: "🔍", title: "3. Refractive Index", hi: "अपवर्तनांक", desc: "Snell's law: sin(i) / sin(r) = constant (n21).", detail: "Light bending towards normal when transitioning from rarer to denser optical mediums." }
        ];
      }
      return [
        { icon: "🔬", title: "1. Core Principles", hi: "मूलभूत वैज्ञानिक सिद्धांत", desc: `Fundamental concepts and definitions in ${activeChapter.en}.`, detail: "Aliged with NEP 2020 competency benchmarks and NCERT 2024-25 syllabus." },
        { icon: "🧪", title: "2. Experimental Activity", hi: "प्रायोगिक गतिविधि", desc: "Hands-on classroom touch demonstration with real variables.", detail: "Designed for smartboard step-by-step group experimentation and hypothesis testing." },
        { icon: "🎯", title: "3. Exam Application", hi: "परीक्षा आधारित अनुप्रयोग", desc: "High-yield CBSE questions and diagram labeling practice.", detail: "Formulated to help students score full marks in 3-mark and 5-mark board exam sections." }
      ];
    }
    if (selectedSubject === "Maths") {
      return [
        { icon: "🔢", title: "1. Axioms & Properties", hi: "प्रमुख गणितीय गुणधर्म", desc: `Closure, commutativity, and distributive rules for ${activeChapter.en}.`, detail: "Understanding additive and multiplicative identities with step-by-step fraction examples." },
        { icon: "📐", title: "2. Visual Representation", hi: "संख्या रेखा एवं आरेख", desc: "Plotting values on interactive coordinate and number lines.", detail: "Finding infinite values between two numbers using average and LCM techniques." },
        { icon: "⚡", title: "3. Smartboard Solving", hi: "त्वरित हल तकनीक", desc: "3-step algebraic simplification with touch verification.", detail: "Eliminating common student pitfalls with positive and negative integer signs." }
      ];
    }
    return [
      { icon: "📚", title: "1. Context & Themes", hi: "ऐतिहासिक एवं वैचारिक संदर्भ", desc: `Key historical background and significance of ${activeChapter.en}.`, detail: "Constitutional and socio-economic frameworks explained simply for Indian school students." },
      { icon: "🗺️", title: "2. Spatial & Map Skills", hi: "मानचित्र एवं तथ्यात्मक समझ", desc: "Interactive smartboard map labeling and chronological timelines.", detail: "Highlighting key states, rivers, battle sites, and geographical landmarks." },
      { icon: "✍️", title: "3. Critical Reflection", hi: "समीक्षात्मक सोच एवं अभ्यास", desc: "Competency-based short and long answer questions.", detail: "Encourages analytical discussion on civic duties, governance, and environment." }
    ];
  };

  const dynamicCards = getDynamicCards();

  // Dynamic Quiz Questions
  const getQuizQuestions = () => {
    if (activeChapter.en.includes("Conservation")) {
      return [
        {
          q: "Pachmarhi Biosphere Reserve is primarily located in which Indian state?",
          qHi: "पचमढ़ी जैवमंडल आरक्षित क्षेत्र भारत के किस राज्य में स्थित है?",
          opts: [
            { id: 1, text: "A) Madhya Pradesh (मध्य प्रदेश)", correct: true },
            { id: 2, text: "B) Rajasthan (राजस्थान)", correct: false },
            { id: 3, text: "C) Gujarat (गुजरात)", correct: false },
            { id: 4, text: "D) Uttar Pradesh (उत्तर प्रदेश)", correct: false }
          ],
          exp: "Pachmarhi Biosphere Reserve is located in the Hoshangabad district of Madhya Pradesh and contains Satpura National Park."
        },
        {
          q: "Which book maintains an international record of all endangered animals and plants?",
          qHi: "कौन सी पुस्तक सभी संकटापन्न जीवों और पौधों का अंतरराष्ट्रीय रिकॉर्ड रखती है?",
          opts: [
            { id: 1, text: "A) Green Data Book", correct: false },
            { id: 2, text: "B) Red Data Book (रेड डाटा पुस्तक)", correct: true },
            { id: 3, text: "C) Blue Species Log", correct: false },
            { id: 4, text: "D) Yellow Wildlife Record", correct: false }
          ],
          exp: "The Red Data Book is maintained by IUCN to monitor species facing threat of extinction worldwide."
        }
      ];
    }
    return [
      {
        q: `What is the primary competency tested in NCERT ${activeChapter.en}?`,
        qHi: `${activeChapter.en} में प्रमुख रूप से किस अवधारणा का परीक्षण किया जाता है?`,
        opts: [
          { id: 1, text: "A) Core Definition & Principles (मूल परिभाषा)", correct: true },
          { id: 2, text: "B) Non-NCERT speculation", correct: false },
          { id: 3, text: "C) Historical memorization without logic", correct: false },
          { id: 4, text: "D) Unrelated curriculum", correct: false }
        ],
        exp: `Understanding foundational definitions and practical real-world applications as specified by CBSE Class ${selectedClass}.`
      }
    ];
  };

  const quizQuestions = getQuizQuestions();
  const currentQuizQ = quizQuestions[quizQuestionIndex] || quizQuestions[0];

  const handleQuizSelect = (id: number, isCorrect: boolean) => {
    setQuizSelectedOption(id);
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      triggerToast("✓ Correct Answer! Well done.");
    } else {
      triggerToast("✕ Incorrect. Review explanation below.");
    }
  };

  const progressSteps = [
    "Reading NCERT textbook & NEP 2020 competencies...",
    "Formatting 75-inch 4K Smartboard slide deck...",
    "Compiling bilingual Hindi & Devanagari mind map..."
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFCFA] font-sans text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 relative">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#0F5B38] text-white px-4 py-2 rounded-full text-xs font-black shadow-xl border border-emerald-400 flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Top Smartboard Studio OS Header Bar */}
      <div className="bg-[#0B1E14] px-4 py-2.5 flex items-center justify-between border-b border-[#163826] text-white">
        {/* Left: Smartboard Connection Status */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsTouchMode(!isTouchMode);
              triggerToast(isTouchMode ? "Switched to Stylus / Pen Input Mode" : "Switched to 10-Point Multi-Touch Mode");
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#143B27] hover:bg-[#1A4E34] border border-emerald-500/30 transition-colors cursor-pointer"
            title="Click to toggle touch mode"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-300">
              75&quot; Smartboard Connected &bull; {isTouchMode ? "4K Touch" : "Stylus Pen"}
            </span>
          </button>
        </div>

        {/* Center: Brand Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#122F20] px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold text-emerald-200">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>TeacherSathi AI Interactive Studio</span>
        </div>

        {/* Right: Mobile Paired & Rec Buttons */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-300/80">
          <button
            onClick={() => setIsMobileModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 px-2.5 py-1 rounded-full text-emerald-200 border border-emerald-500/30 cursor-pointer transition-all active:scale-95"
            title="Pair Teacher Phone Remote"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile Paired</span>
          </button>

          <button
            onClick={() => {
              setIsRecording(!isRecording);
              triggerToast(isRecording ? "Classroom Recording Paused" : "Classroom 1080p Recording Started");
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border font-mono text-[9px] cursor-pointer transition-colors ${
              isRecording 
                ? "bg-rose-950/80 border-rose-600/60 text-rose-300" 
                : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-rose-500 animate-pulse" : "bg-slate-500"}`} />
            <span>{isRecording ? `REC ● ${recordTimer}` : "REC PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Body: Left Sidebar + Main Studio Canvas */}
      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Left Smartboard Launcher Sidebar */}
        <div className="hidden sm:flex lg:w-[200px] bg-[#0E281B] text-white flex-col justify-between py-5 px-3 shrink-0 border-r border-[#153D29]">
          <div className="space-y-6">
            {/* Logo Badge */}
            <div className="flex items-center px-1">
              <Image
                src="/logo-horizontal-on-dark.png"
                alt="TeacherSathi AI"
                width={150}
                height={38}
                className="h-7 w-auto object-contain"
                priority
              />
            </div>

            {/* Interactive Navigation Buttons */}
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: LayoutTemplate },
                { name: "My Lessons", icon: BookOpen },
                { name: "Resources", icon: FileText },
                { name: "Quizzes", icon: HelpCircle },
                { name: "Worksheets", icon: FileCheck2 }
              ].map((item) => {
                const isActive = activeSidebarItem === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSidebarNav(item.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer active:scale-95 ${
                      isActive 
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40" 
                        : "text-emerald-200/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-400"}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Teacher Profile / Persona Switcher */}
          <div className="pt-4 border-t border-emerald-900/60 px-1 space-y-1">
            <button
              onClick={() => {
                const nextIdx = (currentPersonaIndex + 1) % TEACHER_PERSONAS.length;
                setCurrentPersonaIndex(nextIdx);
                triggerToast(`Switched educator profile to ${TEACHER_PERSONAS[nextIdx].name}`);
              }}
              className="w-full text-left p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2 group"
              title="Click to switch educator persona"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-800 border border-emerald-500/50 flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-105 transition-transform">
                {activePersona.avatar}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-[11px] font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                  {activePersona.name}
                </p>
                <p className="text-[9px] text-emerald-300 font-semibold truncate">
                  {activePersona.school}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Main Interactive Studio Canvas */}
        <div className="flex-1 bg-white p-4 sm:p-6 flex flex-col justify-between space-y-4">
          
          {/* Top Form Controls: Class, Subject, Chapter Selectors */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Generate Interactive NCERT Kit</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                    Bilingual AI
                  </span>
                </h2>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">
                  Select Class, Subject &amp; Chapter to generate 75&quot; smartboard slides &amp; worksheets in 2 clicks.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant 30s Generation</span>
              </div>
            </div>

            {/* 3 Selectors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Class Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-emerald-700" /> Class
                </label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="8">Class 8 (NCERT)</option>
                    <option value="9">Class 9 (NCERT)</option>
                    <option value="10">Class 10 (NCERT)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Subject Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-emerald-700" /> Subject
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer appearance-none"
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* NCERT Chapter Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-700" /> NCERT Chapter
                </label>
                <div className="relative">
                  <select
                    value={selectedChapterIndex}
                    onChange={(e) => handleChapterChange(Number(e.target.value))}
                    className="w-full h-9 pl-3 pr-8 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer appearance-none"
                  >
                    {chaptersList.map((chap, idx) => (
                      <option key={idx} value={idx}>
                        Ch {idx + 1}: {chap.en}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quick Action Button & Micro-Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-0.5">
              <button
                onClick={handleGenerateKit}
                disabled={isGenerating}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:from-emerald-800 hover:to-emerald-800 active:scale-95 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/40"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating Class {selectedClass} Kit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate 75&quot; Smartboard Kit Now ⚡</span>
                  </>
                )}
              </button>

              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/80">
                ⚡ Works on 2G/3G low-bandwidth &amp; basic mobile/laptop devices
              </span>
            </div>
          </div>

          {/* Multi-step Generation Progress Animation */}
          {isGenerating && (
            <div className="bg-[#0D281B] text-white rounded-xl p-3.5 space-y-2 shadow-lg animate-fadeIn border border-emerald-700/50">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Kit Generation Progress
                </span>
                <span className="text-emerald-200">Step {generationStep} of 3</span>
              </div>
              <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-emerald-800">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-amber-300 h-full transition-all duration-500 ease-out" 
                  style={{ width: `${(generationStep / 3) * 100}%` }}
                />
              </div>
              <p className="text-xs text-emerald-100 font-semibold text-center pt-0.5 animate-pulse">
                {progressSteps[generationStep - 1] || "Finalizing Teaching Pack..."}
              </p>
            </div>
          )}

          {/* Dynamic Smartboard Display Canvas Preview Area */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-3 shadow-inner">
            
            {/* Asset Type Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex flex-wrap gap-1.5" role="tablist">
                {[
                  { id: "Presentation", label: "Presentation", icon: Monitor, badge: "12 Slides" },
                  { id: "Video", label: "Explainer Video", icon: Video, badge: "HD" },
                  { id: "MindMap", label: "Mind Map", icon: Network, badge: "Devanagari" },
                  { id: "Quiz", label: "Quiz", icon: HelpCircle, badge: "Live Poll" },
                  { id: "Worksheet", label: "Worksheet", icon: FileText, badge: "Printable" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeAssetTab === tab.id}
                    onClick={() => handleTabSwitch(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      activeAssetTab === tab.id
                        ? "bg-[#0F5B38] text-white shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <span>75&quot; Native Format</span>
              </div>
            </div>

            {/* Live Interactive Canvas Body */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative min-h-[220px] flex flex-col justify-between">
              {isTabLoading ? (
                <div className="space-y-3 animate-pulse py-8">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto" />
                  <div className="h-6 bg-slate-200 rounded w-2/3 mx-auto" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>
              ) : (
                <>
                  {/* TAB 1: PRESENTATION (Realistic 75" Smartboard Slide) */}
                  {activeAssetTab === "Presentation" && (
                    <div className="space-y-3">
                      {/* Slide Header Info */}
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-emerald-900 border-b border-emerald-50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-md font-extrabold">
                            Class {selectedClass} &bull; {selectedSubject}
                          </span>
                          <span className="text-slate-500 font-semibold">NCERT Curriculum 2024-25</span>
                        </div>
                        <span className="bg-[#0F5B38] text-white px-2 py-0.5 rounded font-mono font-bold">
                          Slide {currentSlideIndex} of 12 &bull; 75&quot; Canvas
                        </span>
                      </div>

                      {/* Bilingual Chapter Title */}
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {activeChapter.en}
                        </h3>
                        <p className="text-xs font-bold text-emerald-800">
                          {activeChapter.hi}
                        </p>
                      </div>

                      {/* 3 Interactive Smartboard Concept Chips with Click to Expand */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {dynamicCards.map((card, idx) => {
                          const isSelected = selectedCardIndex === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedCardIndex(isSelected ? null : idx)}
                              className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer active:scale-98 ${
                                isSelected
                                  ? "bg-emerald-100/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/30"
                                  : "bg-emerald-50/70 hover:bg-emerald-100/60 border-emerald-200/80"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-emerald-950 uppercase tracking-wider">
                                  {card.title}
                                </span>
                                {isSelected && (
                                  <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">
                                    Expanded
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-700 font-medium leading-snug">
                                {card.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Expanded Concept Explanation Card */}
                      {selectedCardIndex !== null && dynamicCards[selectedCardIndex] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-emerald-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-inner border border-emerald-700/60"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-amber-300 text-[11px] flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Teacher Speaking Points &bull; {dynamicCards[selectedCardIndex].hi}</span>
                            </span>
                            <button
                              onClick={() => setSelectedCardIndex(null)}
                              className="text-emerald-300 hover:text-white text-[10px] font-bold p-0.5 cursor-pointer"
                            >
                              Close ✕
                            </button>
                          </div>
                          <p className="text-emerald-100 text-[11px] leading-relaxed">
                            {dynamicCards[selectedCardIndex].detail}
                          </p>
                        </motion.div>
                      )}

                      {/* Smartboard Teacher Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentSlideIndex(Math.max(1, currentSlideIndex - 1))}
                            disabled={currentSlideIndex === 1}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
                            title="Previous Slide"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] font-bold text-slate-600">
                            Slide {currentSlideIndex} / 12
                          </span>
                          <button
                            onClick={() => setCurrentSlideIndex(Math.min(12, currentSlideIndex + 1))}
                            disabled={currentSlideIndex === 12}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
                            title="Next Slide"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsFullscreenPresenter(true)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95 shadow-sm"
                          >
                            <Maximize2 className="w-3 h-3 text-emerald-700" /> Present Fullscreen
                          </button>
                          <button
                            onClick={() => triggerToast(`Exporting NCERT Class ${selectedClass} PPTX Slide Deck...`)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                          >
                            <Download className="w-3 h-3 text-slate-600" /> Export PPTX
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: EXPLAINER VIDEO */}
                  {activeAssetTab === "Video" && (
                    <div className="space-y-3">
                      <div className="relative aspect-video max-h-[160px] w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center text-white border border-slate-800 shadow-inner group">
                        {/* Video Background Poster / Simulation */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-slate-900 to-[#062E1E] opacity-90" />
                        
                        {/* Central Play/Pause Button */}
                        <button
                          onClick={() => {
                            setIsVideoPlaying(!isVideoPlaying);
                            triggerToast(isVideoPlaying ? "Video paused" : "Playing 1080p Smartboard Concept Video");
                          }}
                          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-xl transition-transform active:scale-90 cursor-pointer z-10"
                        >
                          {isVideoPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                        </button>

                        {/* Top Overlay Badges */}
                        <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10">
                          <div className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300">
                            {videoLang === "bilingual" ? "Bilingual (Hindi + English)" : videoLang === "hi" ? "हिंदी ऑडियो" : "English Narration"}
                          </div>
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-1 rounded bg-black/60 hover:bg-black/80 text-white cursor-pointer"
                          >
                            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        </div>

                        {/* Bottom Scrubber Bar */}
                        <div className="absolute bottom-2 left-3 right-3 space-y-1 z-10">
                          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                            <span>{Math.floor((videoProgress / 100) * 270)}s / 270s</span>
                            <span className="flex items-center gap-1">1080p Full HD</span>
                          </div>
                        </div>
                      </div>

                      {/* Video Controls Bar */}
                      <div className="flex flex-wrap justify-between items-center text-xs gap-2 pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-800">
                          3D Animated Concept: {activeChapter.en}
                        </span>
                        
                        {/* Language Switcher */}
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          <span className="text-slate-500">Audio:</span>
                          <button
                            onClick={() => setVideoLang("bilingual")}
                            className={`px-2 py-0.5 rounded ${videoLang === "bilingual" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}
                          >
                            Bilingual
                          </button>
                          <button
                            onClick={() => setVideoLang("hi")}
                            className={`px-2 py-0.5 rounded ${videoLang === "hi" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}
                          >
                            हिन्दी
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MIND MAP */}
                  {activeAssetTab === "MindMap" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">
                          Interactive Concept Tree &bull; Devanagari Hindi + English
                        </span>
                        <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                          Board Exam High-Yield
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900">
                        {activeChapter.en} &bull; {activeChapter.hi}
                      </h4>

                      {/* Interactive Mind Map Tree Nodes */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {dynamicCards.map((node, idx) => (
                          <div 
                            key={idx}
                            onClick={() => triggerToast(`Mind Map Branch: ${node.title}`)}
                            className="p-2.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-xl text-center cursor-pointer transition-all shadow-sm active:scale-95"
                          >
                            <span className="text-lg block mb-0.5">{node.icon}</span>
                            <p className="text-[11px] font-bold text-purple-950">{node.title}</p>
                            <span className="text-[9px] text-purple-700 font-semibold block">{node.hi}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 bg-purple-100/50 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
                        <span className="font-semibold text-[11px]">
                          ⚡ Click any node to open smartboard branch notes or draw student connections.
                        </span>
                        <button
                          onClick={() => triggerToast("Exporting High-Res SVG Mind Map for Smartboard")}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                        >
                          Export Map (SVG)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: QUIZ (Interactive Live Poll) */}
                  {activeAssetTab === "Quiz" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black text-amber-800 uppercase tracking-wider">
                        <span>Classroom MCQ Poll &bull; Question {quizQuestionIndex + 1} of {quizQuestions.length}</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          Score: {quizScore} / {quizQuestions.length}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {currentQuizQ.q}
                      </p>
                      <p className="text-[11px] font-semibold text-emerald-800">
                        {currentQuizQ.qHi}
                      </p>

                      {/* 4 Interactive Clickable Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentQuizQ.opts.map((opt) => {
                          const isSelected = quizSelectedOption === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleQuizSelect(opt.id, opt.correct)}
                              className={`text-left p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-98 ${
                                isSelected
                                  ? opt.correct 
                                    ? "bg-emerald-100 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/30" 
                                    : "bg-rose-100 border-rose-600 text-rose-950 ring-2 ring-rose-500/30"
                                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{opt.text}</span>
                                {isSelected && (
                                  <span className={`text-[10px] font-black ${opt.correct ? "text-emerald-700" : "text-rose-600"}`}>
                                    {opt.correct ? "✓ Correct" : "✕ Incorrect"}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after selection */}
                      {quizSelectedOption !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between"
                        >
                          <span className="font-medium">💡 <strong>Teacher Note:</strong> {currentQuizQ.exp}</span>
                          {quizQuestions.length > 1 && (
                            <button
                              onClick={() => {
                                setQuizSelectedOption(null);
                                setQuizQuestionIndex((prev) => (prev + 1) % quizQuestions.length);
                              }}
                              className="ml-2 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                            >
                              Next Question →
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: WORKSHEET */}
                  {activeAssetTab === "Worksheet" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                          Printable CBSE Format &bull; NEP 2020 Rubrics
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowAnswerKey(!showAnswerKey)}
                            className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
                          >
                            {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{showAnswerKey ? "Hide Solutions" : "Show Solutions"}</span>
                          </button>
                          <button
                            onClick={() => {
                              triggerToast(`Preparing Print PDF for Class ${selectedClass} ${activeChapter.en}...`);
                              window.print();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                          >
                            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-start border-b border-blue-200 pb-1.5">
                          <div>
                            <p className="text-xs font-black text-blue-950">
                              NCERT Class {selectedClass} Worksheet: {activeChapter.en}
                            </p>
                            <p className="text-[10px] text-blue-700 font-semibold">{activeChapter.hi}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-200/70 px-2 py-0.5 rounded">
                            Total Marks: 25 &bull; 40 Mins
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-800 space-y-1">
                          <p><strong>Section A (MCQ):</strong> 5 Questions on Core Concept Definitions (5 Marks)</p>
                          <p><strong>Section B (Short Answer):</strong> 3 Application-based Reasoning Questions (9 Marks)</p>
                          <p><strong>Section C (Case Study):</strong> 1 Smartboard Diagram &amp; Data Interpretation Exercise (11 Marks)</p>
                        </div>

                        {showAnswerKey && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-2 border-t border-blue-200 text-[10px] text-emerald-900 bg-emerald-50 p-2 rounded-lg"
                          >
                            <span className="font-bold block mb-0.5 text-emerald-950">✓ Official CBSE Marking Scheme:</span>
                            Step marking awarded: 1 mark for correct definition, 1 mark for formula/illustration, 1 mark for conclusion.
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Bottom Bar: Trust Indicators & Quick CTA */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>NCERT &amp; NEP 2020 Aligned &bull; 100% Free Forever for Teachers</span>
            </div>
            <a
              href="/signup"
              className="w-full sm:w-auto px-4 py-2 bg-[#0F5B38] hover:bg-[#0C4B2E] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Get Free Class {selectedClass} {selectedSubject} Teaching Kit</span>
            </a>
          </div>

        </div>

      </div>

      {/* 3. Fullscreen 75" Smartboard Presenter Modal */}
      <AnimatePresence>
        {isFullscreenPresenter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] bg-[#061A10] text-white flex flex-col justify-between p-6 overflow-hidden"
          >
            {/* Top Fullscreen Header */}
            <div className="flex justify-between items-center border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-horizontal-on-dark.png"
                  alt="TeacherSathi"
                  width={140}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
                <span className="text-xs font-mono font-bold bg-emerald-900/80 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  75&quot; Smartboard Live Presenter &bull; Slide {currentSlideIndex} / 12
                </span>
              </div>

              {/* Tools: Pointer, Pen, Highlighter */}
              <div className="flex items-center gap-2 bg-emerald-950 px-3 py-1.5 rounded-2xl border border-emerald-700/50">
                <button
                  onClick={() => {
                    setActivePenTool("pointer");
                    triggerToast("Touch Pointer Mode Active");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    activePenTool === "pointer" ? "bg-amber-400 text-slate-950 font-black" : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Pointer
                </button>
                <button
                  onClick={() => {
                    setActivePenTool("pen");
                    triggerToast("Digital Smartboard Pen Active");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    activePenTool === "pen" ? "bg-amber-400 text-slate-950 font-black" : "text-emerald-200 hover:text-white"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" /> Pen
                </button>
                <button
                  onClick={() => {
                    setActivePenTool("highlighter");
                    triggerToast("Highlighter Mode Active");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    activePenTool === "highlighter" ? "bg-amber-400 text-slate-950 font-black" : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Highlight
                </button>
              </div>

              <button
                onClick={() => setIsFullscreenPresenter(false)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Minimize2 className="w-4 h-4" /> Exit Fullscreen (Esc)
              </button>
            </div>

            {/* Central 75" Smartboard Slide Display */}
            <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full py-6">
              <div className="w-full bg-[#0B2618] border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
                <div className="flex justify-between items-center text-xs text-emerald-300 font-bold uppercase tracking-widest border-b border-emerald-800 pb-3">
                  <span>Class {selectedClass} &bull; {selectedSubject} &bull; NCERT</span>
                  <span>Slide {currentSlideIndex} of 12</span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                    {activeChapter.en}
                  </h2>
                  <p className="text-xl font-bold text-amber-300 mt-1">
                    {activeChapter.hi}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {dynamicCards.map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#123A25] border border-emerald-400/30 space-y-2">
                      <span className="text-2xl block">{c.icon}</span>
                      <h4 className="text-base font-black text-white">{c.title}</h4>
                      <p className="text-xs text-emerald-100 leading-relaxed">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Fullscreen Slide Navigation */}
            <div className="flex justify-between items-center border-t border-emerald-800/60 pt-4">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(1, prev - 1))}
                disabled={currentSlideIndex === 1}
                className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Previous Slide
              </button>

              <span className="text-sm font-mono font-bold text-emerald-300">
                Use Arrow Keys &bull; Slide {currentSlideIndex} / 12
              </span>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(12, prev + 1))}
                disabled={currentSlideIndex === 12}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-colors shadow-lg"
              >
                Next Slide <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Mobile Remote Pairing Modal */}
      <AnimatePresence>
        {isMobileModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-[#0B2416] text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-emerald-500/40 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-black text-white">Teacher Mobile Remote</h3>
                </div>
                <button
                  onClick={() => setIsMobileModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-950">
                <div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-slate-900/10 p-2">
                  {/* Simulated High-Tech QR Code */}
                  <div className="w-full h-full bg-emerald-950 rounded-lg flex flex-col items-center justify-center text-emerald-400 p-2 text-center">
                    <QrCode className="w-20 h-20 text-emerald-300" />
                    <span className="text-[10px] font-mono font-bold text-white mt-1">PAIR CODE: TS-8492</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-700 text-center mt-2.5">
                  Scan with any phone camera to control smartboard slides from the back of the classroom.
                </p>
              </div>

              {/* Simulated Mobile Clicker Controls */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Test Simulated Clicker:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setCurrentSlideIndex((prev) => Math.min(12, prev + 1));
                      triggerToast("Remote: Next Slide Triggered");
                    }}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer transition-colors shadow"
                  >
                    Next Slide →
                  </button>
                  <button
                    onClick={() => {
                      triggerToast("🔔 Attention Chime Sent to Classroom Smartboard!");
                    }}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition-colors shadow"
                  >
                    🔔 Attention Bell
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsMobileModalOpen(false)}
                className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300 cursor-pointer transition-colors"
              >
                Close Remote Window
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
