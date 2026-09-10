"use client";

import React, { useState } from "react";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";
import { 
  ArrowRight, 
  FlaskConical, 
  Calculator, 
  Globe2, 
  BookA, 
  Languages, 
  Monitor, 
  Network, 
  HelpCircle, 
  FileCheck2, 
  FileText,
  Sparkles,
  BookOpen,
  Download,
  Video,
  ChevronRight
} from "lucide-react";

export default function CurriculumCoverage() {
  const [activeClass, setActiveClass] = useState("Class 8");
  const [activeSubject, setActiveSubject] = useState("Science");
  const [selectedChapterId, setSelectedChapterId] = useState<number>(7);

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  
  const subjects = [
    { name: "Science", icon: FlaskConical, color: "text-emerald-600", activeBg: "bg-emerald-700 text-white" },
    { name: "Mathematics", icon: Calculator, color: "text-blue-600", activeBg: "bg-blue-700 text-white" },
    { name: "Social Science", icon: Globe2, color: "text-amber-600", activeBg: "bg-amber-700 text-white" },
    { name: "English", icon: BookA, color: "text-purple-600", activeBg: "bg-purple-700 text-white" },
    { name: "Hindi", icon: Languages, color: "text-rose-600", activeBg: "bg-rose-700 text-white" }
  ];

  // Retrieve chapters from authentic NCERT Syllabus
  const currentSubjectChapters = NCERT_SYLLABUS[activeClass]?.[activeSubject] || [];
  
  // Find current chapter or fallback to first
  const activeChapter = currentSubjectChapters.find(c => c.id === selectedChapterId) || currentSubjectChapters[0] || {
    id: 1,
    en: "Conservation of Plants and Animals",
    hi: "पौधों एवं जंतुओं का संरक्षण",
    descEn: "Understanding ecosystems, biodiversity, and forest conservation.",
    descHi: "पारिस्थितिकी तंत्र, जैव विविधता और वन संरक्षण को समझना।"
  };

  const handleClassSelect = (cls: string) => {
    setActiveClass(cls);
    const available = NCERT_SYLLABUS[cls]?.[activeSubject] || [];
    if (available.length > 0) {
      setSelectedChapterId(available[0].id);
    }
  };

  const handleSubjectSelect = (subName: string) => {
    setActiveSubject(subName);
    const available = NCERT_SYLLABUS[activeClass]?.[subName] || [];
    if (available.length > 0) {
      setSelectedChapterId(available[0].id);
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      
      {/* Section Header */}
      <div className="text-center mb-10 space-y-2 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300/60 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> Full NCERT Curriculum 2024-25
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#132A1C] tracking-tight">
          Built Around What You Actually Teach
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
          Complete bilingual coverage for Classes 6 to 10 across all CBSE &amp; State Board textbooks.
        </p>
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center space-y-6">
        
        {/* Step 1: Class Selection Segmented Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-full shadow-sm">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => handleClassSelect(cls)}
              className={`px-5 sm:px-7 py-2 rounded-xl sm:rounded-full text-xs font-black transition-all cursor-pointer ${
                activeClass === cls 
                  ? "bg-[#0F5B38] text-white shadow-md shadow-emerald-900/20" 
                  : "text-slate-600 hover:text-[#0F5B38] hover:bg-slate-100"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Step 2: Subject Selector Cards */}
        <div className="flex flex-wrap justify-center gap-2.5 w-full">
          {subjects.map((sub) => {
            const isActive = activeSubject === sub.name;
            const chapterCount = (NCERT_SYLLABUS[activeClass]?.[sub.name] || []).length;

            return (
              <button
                key={sub.name}
                onClick={() => handleSubjectSelect(sub.name)}
                className={`px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-xs border cursor-pointer ${
                  isActive 
                    ? `${sub.activeBg} border-transparent shadow-md scale-[1.02]` 
                    : "bg-white/95 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                <sub.icon className={`w-4 h-4 ${isActive ? "text-white" : sub.color}`} />
                <div className="text-left">
                  <span className={`text-xs font-black block leading-tight ${isActive ? "text-white" : "text-slate-900"}`}>
                    {sub.name}
                  </span>
                  <span className={`text-[10px] font-bold ${isActive ? "text-white/80" : "text-slate-500"}`}>
                    {chapterCount} Chapters
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step 3: Interactive Chapter Explorer (2-Column Balanced Layout) */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Chapters Navigation List */}
          <div className="lg:col-span-4 flex flex-col space-y-2 border-b lg:border-b-0 lg:border-r border-slate-200/80 pb-6 lg:pb-0 lg:pr-6">
            <div className="flex justify-between items-center pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                NCERT Chapters
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {currentSubjectChapters.length} Total
              </span>
            </div>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {currentSubjectChapters.map((chap) => {
                const isSelected = (activeChapter.id === chap.id);

                return (
                  <button
                    key={chap.id}
                    onClick={() => setSelectedChapterId(chap.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                      isSelected
                        ? "bg-[#0F5B38] text-white border-[#0F5B38] shadow-sm"
                        : "bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200/80 hover:border-emerald-300"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          Ch {chap.id}
                        </span>
                        <span className="truncate font-black">{chap.en}</span>
                      </div>
                      <span className={`text-[10px] block truncate mt-0.5 ${
                        isSelected ? "text-emerald-100" : "text-emerald-800 font-semibold"
                      }`}>
                        {chap.hi}
                      </span>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Rich Chapter Spotlight Card */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            {/* Chapter Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-black text-emerald-900 bg-emerald-100/90 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeClass} &bull; {activeSubject} &bull; Chapter {activeChapter.id}
                </span>
                <span className="text-[10px] font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  ★ NEP 2020 Competency Aligned
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activeChapter.en}
                </h3>
                <p className="text-sm font-bold text-emerald-800 mt-0.5">
                  {activeChapter.hi}
                </p>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-2xl">
                {activeChapter.descEn} {activeChapter.descHi && `(${activeChapter.descHi})`}
              </p>
            </div>

            {/* Generated Resource Suite Cards */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                Instant Generated Assets in This Kit
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs">
                    <Monitor className="w-4 h-4 text-emerald-700" />
                    <span>75&quot; Presentation</span>
                  </div>
                  <p className="text-[11px] text-slate-600">12 4K interactive smartboard slides with diagrams</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-900 font-black text-xs">
                    <Network className="w-4 h-4 text-purple-700" />
                    <span>Concept Mind Map</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Bilingual Hindi-English concept connection tree</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>Classroom Quiz</span>
                  </div>
                  <p className="text-[11px] text-slate-600">15 MCQs with instant teacher answer keys</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs">
                    <FileCheck2 className="w-4 h-4 text-blue-700" />
                    <span>CBSE Question Bank</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Competency-based short, long &amp; HOTS questions</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-900 font-black text-xs">
                    <FileText className="w-4 h-4 text-rose-700" />
                    <span>Printable Worksheet</span>
                  </div>
                  <p className="text-[11px] text-slate-600">A4 printable student homework sheet + rubric</p>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-900 font-black text-xs">
                    <Video className="w-4 h-4 text-teal-700" />
                    <span>Animated Video</span>
                  </div>
                  <p className="text-[11px] text-slate-600">1080p explainer video with bilingual voiceover</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="/signup"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F5B38] hover:bg-[#0C4B2E] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start Teaching {activeChapter.en}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => alert(`Downloading full teaching kit for ${activeChapter.en}!`)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Download Sample Deck (PPTX)</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
