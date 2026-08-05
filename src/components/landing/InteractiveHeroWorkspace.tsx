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
  Volume2
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

  // Available subjects and chapters calculation
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

  return (
    <div className="flex h-full w-full bg-[#F3F4F6] font-sans text-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 min-h-[580px]">
      
      {/* Smartboard Left Sidebar */}
      <div className="hidden sm:flex w-[190px] bg-[#123524] text-white flex-col py-6 px-4 shrink-0">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-white text-[#123524] flex items-center justify-center font-bold shadow-sm">
            <BookOpen className="w-5 h-5 text-[#123524]" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight leading-none text-white">TeacherSathi</h1>
            <span className="text-[10px] text-emerald-300 font-bold">साथी Genie AI</span>
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

        <div className="pt-4 border-t border-white/10 mt-auto">
          <span className="text-[10px] text-emerald-300/80 font-semibold block px-2">
            75&quot; Display Connected 🟢
          </span>
        </div>
      </div>

      {/* Main Interactive Studio Canvas */}
      <div className="flex-1 bg-white p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Dropdown Form Controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-serif">
                Configure Your Teaching Kit
              </h2>
              <p className="text-gray-500 text-xs font-semibold">
                Select Class, Subject &amp; NCERT Chapter to dynamically generate all assets.
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block border border-emerald-200">
              Interactive Preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-gray-50 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
              >
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-gray-50 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider mb-1">
                NCERT Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-gray-50 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer truncate"
              >
                {availableChapters.map((chap) => (
                  <option key={chap} value={chap}>{chap}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Display Canvas Preview Area */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-slate-50 border border-emerald-100 shadow-inner space-y-4">
          
          {/* Asset Type Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-3">
            {[
              { id: "Presentation", label: "Presentation", icon: Monitor },
              { id: "Video", label: "Explainer Video", icon: Video },
              { id: "MindMap", label: "Mind Map", icon: Network },
              { id: "Quiz", label: "Quiz", icon: HelpCircle },
              { id: "Worksheet", label: "Worksheet", icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAssetTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeAssetTab === tab.id
                    ? "bg-[#14532D] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 min-h-[170px] flex flex-col justify-between relative shadow-sm">
            
            {activeAssetTab === "Presentation" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black text-emerald-800 uppercase tracking-widest">
                  <span>Class {selectedClass} • {selectedSubject}</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded">Slide 1 of 12</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 font-serif">
                  {selectedChapter}
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Key Concept Overview: Explaining core principles, diagrams, and NCERT exam points aligned for 75&quot; smartboard presentation.
                </p>
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-gray-500">
                  <span className="text-emerald-700">🏫 Smartboard Tip: Tap elements to expand diagrams</span>
                  <button
                    onClick={() => alert(`Downloading Slide Deck PPTX for ${selectedChapter}!`)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" /> Export PPTX
                  </button>
                </div>
              </div>
            )}

            {activeAssetTab === "Video" && (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] max-h-[120px] w-full bg-gray-950 rounded-xl overflow-hidden flex items-center justify-center text-white border border-gray-800">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 cursor-pointer z-10"
                  >
                    {isVideoPlaying ? <Pause className="w-5 h-5 fill-gray-950" /> : <Play className="w-5 h-5 fill-gray-950 ml-0.5" />}
                  </button>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-gray-300">
                    <span>{isVideoPlaying ? "01:15" : "00:00"} / 04:30</span>
                    <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> 1080p HD</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-800">
                  Animated 3D Explainer: {selectedChapter}
                </p>
              </div>
            )}

            {activeAssetTab === "MindMap" && (
              <div className="space-y-2">
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Visual Mind Map</span>
                <h3 className="text-base font-black text-gray-900">{selectedChapter} Concept Network</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-lg">Core Definition</span>
                  <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-lg">Key Formulas</span>
                  <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-lg">NCERT Board Questions</span>
                </div>
              </div>
            )}

            {activeAssetTab === "Quiz" && (
              <div className="space-y-2">
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Interactive Classroom Quiz</span>
                <p className="text-xs font-bold text-gray-900">Q: What is the main objective of {selectedChapter}?</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button className="text-left bg-gray-50 hover:bg-emerald-50 text-xs font-semibold p-2 rounded-lg border border-gray-200 hover:border-emerald-300">A) Conservation &amp; Protection</button>
                  <button className="text-left bg-gray-50 hover:bg-emerald-50 text-xs font-semibold p-2 rounded-lg border border-gray-200 hover:border-emerald-300">B) Deforestation</button>
                </div>
              </div>
            )}

            {activeAssetTab === "Worksheet" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Printable Worksheet &amp; Answer Key</span>
                  <button
                    onClick={() => alert(`Downloading Printable PDF Worksheet for ${selectedChapter}!`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF Worksheet
                  </button>
                </div>
                <p className="text-xs font-bold text-gray-900">NCERT Class {selectedClass} Worksheet: {selectedChapter}</p>
                <p className="text-[11px] text-gray-600">Includes 5 MCQs, 3 Short Answer Questions, and 1 Diagram exercise with complete teacher answer key.</p>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Footer Note */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-3 text-[11px] font-bold text-gray-600">
          <span className="flex items-center gap-1 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> NCERT Aligned
          </span>
          <a
            href="/signup"
            className="bg-[#14532D] hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
          >
            <span>Generate Full Kit Now ✨</span>
          </a>
        </div>

      </div>

    </div>
  );
}
