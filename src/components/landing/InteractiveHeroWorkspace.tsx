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
  Loader2
} from "lucide-react";

// Mock datasets for interactive selection
const CHAPTER_DATA: Record<string, Record<string, string[]>> = {
  "8": {
    "Science": ["Conservation of Plants and Animals", "Crop Production and Management", "Microorganisms: Friend and Foe", "Cell - Structure and Functions"],
    "Maths": ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Data Handling"],
    "Social Science": ["Resources and Development", "Land, Soil, Water Resources", "Ruling the Countryside", "The Indian Constitution"],
    "English": ["The Best Christmas Present", "The Tsunami", "Glimpses of the Past", "Macavity: The Mystery Cat"],
    "Hindi": ["ध्वनि (कविता)", "लाख की चूड़ियां", "बस की यात्रा", "दीवानों की हस्ती"]
  },
  "9": {
    "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "The Fundamental Unit of Life"],
    "Maths": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations"],
    "Social Science": ["The French Revolution", "Socialism in Europe", "India - Size and Location", "Physical Features of India"],
    "English": ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind"],
    "Hindi": ["दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति", "साखियाँ एवं सबद"]
  },
  "10": {
    "Science": ["Light - Reflection and Refraction", "Chemical Reactions and Equations", "Acids, Bases and Salts", "Life Processes"],
    "Maths": ["Real Numbers", "Polynomials", "Pair of Linear Equations", "Quadratic Equations"],
    "Social Science": ["The Rise of Nationalism in Europe", "Nationalism in India", "Resources and Development", "Power Sharing"],
    "English": ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank"],
    "Hindi": ["पद (सूरदास)", "राम-लक्ष्मण-परशुराम संवाद", "नेताजी का चश्मा", "बालगोबिन भगत"]
  }
};

export default function InteractiveHeroWorkspace() {
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedChapter, setSelectedChapter] = useState("Conservation of Plants and Animals");
  const [activeAssetTab, setActiveAssetTab] = useState("Presentation");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Generation Progress Bar States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const availableSubjects = Object.keys(CHAPTER_DATA[selectedClass] || CHAPTER_DATA["8"]);
  const availableChapters = (CHAPTER_DATA[selectedClass] && CHAPTER_DATA[selectedClass][selectedSubject]) || CHAPTER_DATA["8"]["Science"];

  const handleClassChange = (c: string) => {
    setSelectedClass(c);
    const firstSub = Object.keys(CHAPTER_DATA[c])[0];
    setSelectedSubject(firstSub);
    setSelectedChapter(CHAPTER_DATA[c][firstSub][0]);
  };

  const handleSubjectChange = (s: string) => {
    setSelectedSubject(s);
    if (CHAPTER_DATA[selectedClass] && CHAPTER_DATA[selectedClass][s]) {
      setSelectedChapter(CHAPTER_DATA[selectedClass][s][0]);
    }
  };

  const handleTabSwitch = (tabId: string) => {
    if (tabId === activeAssetTab) return;
    setIsTabLoading(true);
    setActiveAssetTab(tabId);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 250);
  };

  const handleGenerateKit = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 600);
    setTimeout(() => setGenerationStep(3), 1200);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(0);
      setActiveAssetTab("Presentation");
    }, 1800);
  };

  const progressSteps = [
    "Reading NCERT Chapter Data...",
    "Building 75-inch Smartboard Slides...",
    "Compiling Bilingual Hindi Output..."
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#F3F4F6] font-sans text-slate-900 rounded-3xl overflow-hidden shadow-elevation-xl border border-slate-300 min-h-[580px]">
      
      {/* Top macOS-style Window Control Bar */}
      <div className="bg-[#0B2519] px-4 py-2.5 flex items-center justify-between border-b border-emerald-950">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer" />
        </div>
        <div className="text-[11px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          TeacherSathi AI Interactive Studio
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-emerald-400/80">
          <span>75&quot; Display Connected 🟢</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Smartboard Left Sidebar */}
        <div className="hidden sm:flex w-[190px] bg-[#123524] text-white flex-col py-6 px-4 shrink-0">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-white text-[#123524] flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5 text-[#123524]" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight leading-none text-white">TeacherSathi</h1>
              <span className="text-[10px] text-emerald-300 font-bold">Genie AI</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/15 rounded-xl text-white font-bold text-xs shadow-inner">
              <LayoutTemplate className="w-4 h-4 text-emerald-400" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs transition-colors">
              <BookOpen className="w-4 h-4" /> My Lessons
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs transition-colors">
              <FileText className="w-4 h-4" /> Resources
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs transition-colors">
              <HelpCircle className="w-4 h-4" /> Quizzes
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs transition-colors">
              <FileCheck2 className="w-4 h-4" /> Worksheets
            </button>
          </nav>
        </div>

        {/* Main Interactive Studio Canvas */}
        <div className="flex-1 bg-white p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Dropdown Form Controls */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  Generate Interactive NCERT Kit
                </h2>
                <p className="text-slate-600 text-xs font-semibold">
                  Select Class, Subject &amp; Chapter to generate 75&quot; smartboard slides &amp; worksheets in 2 clicks.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block border border-emerald-200">
                Instant AI Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                >
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  NCERT Chapter
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer truncate"
                >
                  {availableChapters.map((chap) => (
                    <option key={chap} value={chap}>{chap}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Generate Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <button
                onClick={handleGenerateKit}
                disabled={isGenerating}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Generating Class {selectedClass} Kit...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Generate 75&quot; Smartboard Kit Now ⚡
                  </>
                )}
              </button>

              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ⚡ Works on 2G/3G low-bandwidth &amp; basic mobile/laptop devices
              </span>
            </div>
          </div>

          {/* Multi-step Generation Progress Bar */}
          {isGenerating && (
            <div className="my-4 bg-emerald-900 text-white rounded-2xl p-4 space-y-2 shadow-lg animate-fadeIn">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-300 uppercase tracking-wider text-[10px]">AI Kit Generation Progress</span>
                <span>Step {generationStep} of 3</span>
              </div>
              <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-500 ease-out" 
                  style={{ width: `${(generationStep / 3) * 100}%` }}
                />
              </div>
              <p className="text-xs text-emerald-100 font-semibold text-center pt-1 animate-pulse">
                {progressSteps[generationStep - 1] || "Finalizing Teaching Pack..."}
              </p>
            </div>
          )}

          {/* Dynamic Display Canvas Preview Area */}
          <div 
            className="my-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-slate-50 border border-emerald-100 shadow-inner space-y-4"
            aria-live="polite"
            aria-busy={isGenerating || isTabLoading}
          >
            
            {/* Asset Type Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3" role="tablist" aria-label="NCERT Asset Previews">
              {[
                { id: "Presentation", label: "Presentation", icon: Monitor },
                { id: "Video", label: "Explainer Video", icon: Video },
                { id: "MindMap", label: "Mind Map", icon: Network },
                { id: "Quiz", label: "Quiz", icon: HelpCircle },
                { id: "Worksheet", label: "Worksheet", icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeAssetTab === tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    activeAssetTab === tab.id
                      ? "bg-[#14532D] text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Display & Skeleton Loading State */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 min-h-[170px] flex flex-col justify-between relative shadow-sm">
              
              {isTabLoading ? (
                <div className="space-y-3 animate-pulse py-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3 skeleton-block" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 skeleton-block" />
                  <div className="h-4 bg-slate-200 rounded w-full skeleton-block" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 skeleton-block" />
                </div>
              ) : (
                <>
                  {activeAssetTab === "Presentation" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-emerald-900 uppercase tracking-widest">
                        <span>Class {selectedClass} • {selectedSubject}</span>
                        <span className="bg-emerald-100 px-2 py-0.5 rounded">Slide 1 of 12 &bull; Smartboard 75&quot;</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 font-serif">
                        {selectedChapter}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        Key Concept Overview: Core principles, bilingual Hindi/English diagrams, and NCERT board exam points rendered for 75&quot; classroom display.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs font-bold text-slate-500">
                        <span className="text-emerald-800">🏫 Smartboard Tip: Tap elements to expand diagrams</span>
                        <button
                          onClick={() => alert(`Exporting PPTX for ${selectedChapter}!`)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-700" /> Export PPTX
                        </button>
                      </div>
                    </div>
                  )}

                  {activeAssetTab === "Video" && (
                    <div className="space-y-3">
                      <div className="relative aspect-video max-h-[130px] w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center text-white border border-slate-800">
                        <button
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 cursor-pointer z-10"
                        >
                          {isVideoPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                        </button>
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-slate-300">
                          <span>{isVideoPlaying ? "01:15" : "00:00"} / 04:30</span>
                          <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> 1080p HD</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Animated Explainer: {selectedChapter}
                      </p>
                    </div>
                  )}

                  {activeAssetTab === "MindMap" && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Visual Mind Map</span>
                      <h3 className="text-base font-black text-slate-900">{selectedChapter} Concept Network</h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-lg">Core Definition</span>
                        <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-lg">Key Formulas</span>
                        <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-lg">Board Exam Topics</span>
                      </div>
                    </div>
                  )}

                  {activeAssetTab === "Quiz" && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Interactive Classroom Quiz</span>
                      <p className="text-xs font-bold text-slate-900">Q: What is the main objective of {selectedChapter}?</p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button className="text-left bg-slate-50 hover:bg-emerald-50 text-xs font-semibold p-2 rounded-lg border border-slate-200 hover:border-emerald-300">A) Conservation &amp; Protection</button>
                        <button className="text-left bg-slate-50 hover:bg-emerald-50 text-xs font-semibold p-2 rounded-lg border border-slate-200 hover:border-emerald-300">B) Deforestation</button>
                      </div>
                    </div>
                  )}

                  {activeAssetTab === "Worksheet" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Printable PDF &amp; Answer Key</span>
                        <button
                          onClick={() => alert(`Downloading Printable PDF Worksheet for ${selectedChapter}!`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-900">NCERT Class {selectedClass} Worksheet: {selectedChapter}</p>
                      <p className="text-[11px] text-slate-600">Includes 5 MCQs, 3 Short Answer Questions, and 1 Diagram exercise with complete answer key.</p>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>

          {/* Bottom Footer Note */}
          <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1 text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> NCERT Aligned
            </span>
            <a
              href="/signup"
              className="bg-[#14532D] hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <span>✨ Get Free Class {selectedClass} {selectedSubject} Teaching Kit</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
