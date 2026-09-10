"use client";

import React, { useState } from "react";
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
  Sparkles, 
  Loader2,
  ChevronDown,
  GraduationCap,
  Maximize2,
  Smartphone,
  Layers,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

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
      { en: "Land, Soil, Water Resources", hi: "भूमि, मृदा, जल संसाधन" },
      { en: "Ruling the Countryside", hi: "ग्रामीण क्षेत्र पर शासन चलाना" },
      { en: "The Indian Constitution", hi: "भारतीय संविधान" }
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

export default function InteractiveHeroWorkspace() {
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeAssetTab, setActiveAssetTab] = useState("Presentation");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

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

  const handleClassChange = (c: string) => {
    setSelectedClass(c);
    const newClassData = CHAPTER_DATA[c] || CHAPTER_DATA["8"];
    const firstSub = Object.keys(newClassData)[0];
    setSelectedSubject(firstSub);
    setSelectedChapterIndex(0);
    setCurrentSlideIndex(1);
  };

  const handleSubjectChange = (s: string) => {
    setSelectedSubject(s);
    setSelectedChapterIndex(0);
    setCurrentSlideIndex(1);
  };

  const handleTabSwitch = (tabId: string) => {
    if (tabId === activeAssetTab) return;
    setIsTabLoading(true);
    setActiveAssetTab(tabId);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 200);
  };

  const handleGenerateKit = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 500);
    setTimeout(() => setGenerationStep(3), 1000);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(0);
      setActiveAssetTab("Presentation");
      setCurrentSlideIndex(1);
    }, 1500);
  };

  const progressSteps = [
    "Reading NCERT textbook & NEP 2020 competencies...",
    "Formatting 75-inch 4K Smartboard slide deck...",
    "Compiling bilingual Hindi & Devanagari mind map..."
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFCFA] font-sans text-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200/80">
      
      {/* 1. Top Smartboard Studio OS Header Bar */}
      <div className="bg-[#0B1E14] px-4 py-2.5 flex items-center justify-between border-b border-[#163826] text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-300">
            75&quot; Smartboard Connected &bull; 4K Touch
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-[#122F20] px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold text-emerald-200">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>TeacherSathi AI Interactive Studio</span>
        </div>

        <div className="flex items-center gap-2.5 text-[10px] font-bold text-emerald-300/80">
          <span className="hidden sm:inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full text-emerald-200">
            <Smartphone className="w-3 h-3 text-emerald-400" /> Mobile Paired
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded text-emerald-400 font-mono text-[9px]">
            REC ● 1080p
          </span>
        </div>
      </div>

      {/* 2. Workspace Body: Left Sidebar + Main Studio Canvas */}
      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Left Smartboard Launcher Sidebar */}
        <div className="hidden sm:flex lg:w-[195px] bg-[#0E281B] text-white flex-col justify-between py-5 px-3 shrink-0 border-r border-[#153D29]">
          <div className="space-y-6">
            {/* Logo Badge */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                <BookOpen className="w-4 h-4 text-[#0A2215]" />
              </div>
              <div>
                <h1 className="font-black text-xs tracking-tight text-white leading-tight">TeacherSathi</h1>
                <span className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider">Genie AI Studio</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: LayoutTemplate, active: true },
                { name: "My Lessons", icon: BookOpen, active: false },
                { name: "Resources", icon: FileText, active: false },
                { name: "Quizzes", icon: HelpCircle, active: false },
                { name: "Worksheets", icon: FileCheck2, active: false }
              ].map((item) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    item.active 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40" 
                      : "text-emerald-200/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 ${item.active ? "text-white" : "text-emerald-400"}`} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Teacher Profile / School Mode Pill */}
          <div className="pt-4 border-t border-emerald-900/60 px-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-800 border border-emerald-500/50 flex items-center justify-center text-[10px] font-bold text-white">
                AS
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate">Ananya Sharma</p>
                <p className="text-[9px] text-emerald-300 font-semibold truncate">Class 8-A &bull; KVS</p>
              </div>
            </div>
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
                    onChange={(e) => {
                      setSelectedChapterIndex(Number(e.target.value));
                      setCurrentSlideIndex(1);
                    }}
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
                  { id: "Quiz", label: "Quiz", icon: HelpCircle, badge: "10 MCQ" },
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
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative min-h-[195px] flex flex-col justify-between">
              {isTabLoading ? (
                <div className="space-y-3 animate-pulse py-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
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

                      {/* 3 Interactive Smartboard Concept Chips */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                          <span className="text-[10px] font-black text-emerald-900 block uppercase tracking-wider">
                            🌿 1. Biodiversity &amp; Flora
                          </span>
                          <p className="text-[11px] text-slate-700 font-medium leading-snug">
                            Endemic species &amp; conservation in Pachmarhi Biosphere Reserve.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                          <span className="text-[10px] font-black text-emerald-900 block uppercase tracking-wider">
                            🛡️ 2. Protected Habitats
                          </span>
                          <p className="text-[11px] text-slate-700 font-medium leading-snug">
                            National parks, sanctuaries &amp; strict wildlife protection acts.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                          <span className="text-[10px] font-black text-emerald-900 block uppercase tracking-wider">
                            📖 3. Red Data Book
                          </span>
                          <p className="text-[11px] text-slate-700 font-medium leading-snug">
                            Official registry of endangered animal &amp; plant species.
                          </p>
                        </div>
                      </div>

                      {/* Smartboard Teacher Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentSlideIndex(Math.max(1, currentSlideIndex - 1))}
                            disabled={currentSlideIndex === 1}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] font-bold text-slate-600">
                            Slide {currentSlideIndex} / 12
                          </span>
                          <button
                            onClick={() => setCurrentSlideIndex(Math.min(12, currentSlideIndex + 1))}
                            disabled={currentSlideIndex === 12}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`Launching 75" Fullscreen Presenter for ${activeChapter.en}!`)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Maximize2 className="w-3 h-3 text-emerald-700" /> Present Fullscreen
                          </button>
                          <button
                            onClick={() => alert(`Exporting PPTX for ${activeChapter.en}!`)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download className="w-3 h-3 text-slate-600" /> Export PPTX
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: EXPLAINER VIDEO */}
                  {activeAssetTab === "Video" && (
                    <div className="space-y-2.5">
                      <div className="relative aspect-video max-h-[140px] w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center text-white border border-slate-800">
                        <button
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 cursor-pointer z-10"
                        >
                          {isVideoPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                        </button>
                        <div className="absolute top-2 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300">
                          Bilingual Hindi &amp; English Narration
                        </div>
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-slate-300">
                          <span>{isVideoPlaying ? "01:15" : "00:00"} / 04:30</span>
                          <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> 1080p Full HD</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">
                          3D Animated Concept: {activeChapter.en}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          CBSE Smart Classroom Ready
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MIND MAP */}
                  {activeAssetTab === "MindMap" && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">
                          Interactive Concept Tree &bull; Devanagari Hindi + English
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">Board Exam High-Yield</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{activeChapter.en} &bull; माइंड मैप</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg text-center">
                          <p className="text-[10px] font-bold text-purple-900">1. Deforestation Causes</p>
                          <span className="text-[9px] text-purple-700">वनोन्मूलन के कारण</span>
                        </div>
                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg text-center">
                          <p className="text-[10px] font-bold text-purple-900">2. Biosphere Reserves</p>
                          <span className="text-[9px] text-purple-700">जैवमंडल आरक्षित क्षेत्र</span>
                        </div>
                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg text-center">
                          <p className="text-[10px] font-bold text-purple-900">3. Reforestation Rules</p>
                          <span className="text-[9px] text-purple-700">पुनर्वनरोपण नियम</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: QUIZ */}
                  {activeAssetTab === "Quiz" && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-black text-amber-800 uppercase tracking-wider">
                        <span>Classroom MCQ Poll &bull; Question 1 of 10</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Instant Response</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        Q: Pachmarhi Biosphere Reserve is primarily located in which Indian state?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 1, text: "A) Madhya Pradesh (मध्य प्रदेश)", correct: true },
                          { id: 2, text: "B) Rajasthan (राजस्थान)", correct: false },
                          { id: 3, text: "C) Gujarat (गुजरात)", correct: false },
                          { id: 4, text: "D) Uttar Pradesh (उत्तर प्रदेश)", correct: false },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setQuizSelectedOption(opt.id)}
                            className={`text-left p-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              quizSelectedOption === opt.id
                                ? opt.correct 
                                  ? "bg-emerald-100 border-emerald-500 text-emerald-950" 
                                  : "bg-rose-100 border-rose-500 text-rose-950"
                                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                            }`}
                          >
                            <span>{opt.text}</span>
                            {quizSelectedOption === opt.id && opt.correct && (
                              <span className="ml-1 text-emerald-700 text-[10px] font-black">✓ Correct</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: WORKSHEET */}
                  {activeAssetTab === "Worksheet" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                          Printable CBSE Format &bull; With Answer Key &amp; Rubric
                        </span>
                        <button
                          onClick={() => alert(`Downloading Printable PDF Worksheet for ${activeChapter.en}!`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-900">
                        NCERT Class {selectedClass} Worksheet: {activeChapter.en}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        Includes 10 Section A MCQs, 5 Section B Short Answer Questions, 2 Diagram Identification exercises, and complete solution scheme for teachers.
                      </p>
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
              className="w-full sm:w-auto px-4 py-2 bg-[#0F5B38] hover:bg-[#0C4B2E] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Get Free Class {selectedClass} {selectedSubject} Teaching Kit</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
