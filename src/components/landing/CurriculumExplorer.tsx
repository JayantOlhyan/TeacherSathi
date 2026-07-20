"use client";

import React, { useState } from "react";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";
import { 
  BookOpen, 
  ArrowRight, 
  Presentation, 
  Video, 
  Network, 
  HelpCircle, 
  FileCheck2, 
  FileText,
  CheckCircle2
} from "lucide-react";

export default function CurriculumExplorer() {
  const classesList = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const subjectsList = ["Science", "Mathematics", "Social Science", "English", "Hindi"];

  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedChapterId, setSelectedChapterId] = useState<number>(7);

  // Get syllabus for selected class & subject
  const currentSubjectData = NCERT_SYLLABUS[selectedClass]?.[selectedSubject] || [];
  
  // Find selected chapter or fallback to first
  const activeChapter = currentSubjectData.find(c => c.id === selectedChapterId) || currentSubjectData[0] || {
    id: 1,
    en: "Conservation of Plants and Animals",
    descEn: "Understanding ecosystems, biodiversity, and forest conservation.",
  };

  const resourcePills = [
    { label: "Lesson Presentation", icon: Presentation },
    { label: "Explainer Video", icon: Video },
    { label: "Mind Map", icon: Network },
    { label: "Interactive Quiz", icon: HelpCircle },
    { label: "Question Bank", icon: FileCheck2 },
    { label: "Worksheet", icon: FileText },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-brand-border/40 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-surface text-brand-DEFAULT border border-brand-border">
            <BookOpen className="w-3.5 h-3.5" /> Full NCERT Syllabus Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Built Around What You Actually Teach
          </h2>
          <p className="text-base sm:text-lg text-ink-3 font-medium">
            Complete NCERT coverage for Classes 6 to 10 across all major subjects.
          </p>
        </div>

        {/* 2-Step Controls: Select Class & Subject */}
        <div className="space-y-6">
          
          {/* Step 1: Choose Class */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-black uppercase text-ink-4 tracking-wider shrink-0">Step 1: Class</span>
            <div className="flex flex-wrap justify-center gap-2">
              {classesList.map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    const firstSubData = NCERT_SYLLABUS[cls]?.[selectedSubject] || [];
                    if (firstSubData.length > 0) setSelectedChapterId(firstSubData[0].id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
                    selectedClass === cls
                      ? "bg-brand-DEFAULT text-white border-brand-DEFAULT shadow-md shadow-brand-DEFAULT/20"
                      : "bg-brand-surface/50 text-ink-2 border-slate-200 hover:border-brand-border"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Subject */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-black uppercase text-ink-4 tracking-wider shrink-0">Step 2: Subject</span>
            <div className="flex flex-wrap justify-center gap-2">
              {subjectsList.map((subj) => (
                <button
                  key={subj}
                  onClick={() => {
                    setSelectedSubject(subj);
                    const subData = NCERT_SYLLABUS[selectedClass]?.[subj] || [];
                    if (subData.length > 0) setSelectedChapterId(subData[0].id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
                    selectedSubject === subj
                      ? "bg-brand-dark text-amber-300 border-brand-dark shadow-md"
                      : "bg-white text-ink-2 border-slate-200 hover:border-brand-border"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Interactive Explorer Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#F9F8F3] rounded-3xl p-6 sm:p-8 border border-brand-border/70 shadow-sm">
          
          {/* Left: Chapter List selection */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-ink-3">
                {selectedClass} • {selectedSubject} Chapters
              </h4>
              <span className="text-xs text-brand-DEFAULT font-bold">{currentSubjectData.length} Chapters</span>
            </div>

            <div className="max-h-[340px] overflow-y-auto pr-1 space-y-2">
              {currentSubjectData.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-left space-y-1 ${
                    activeChapter.id === chap.id
                      ? "bg-white border-brand-DEFAULT shadow-md shadow-brand-DEFAULT/10"
                      : "bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-brand-DEFAULT">Chapter {chap.id}</span>
                    {activeChapter.id === chap.id && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-brand-dark font-extrabold text-[10px]">Active</span>
                    )}
                  </div>
                  <h5 className="font-bold text-sm text-ink">{chap.en}</h5>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Chapter Teaching Kit Detail */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-surface text-brand-DEFAULT font-extrabold text-xs uppercase">
                  {selectedClass} • {selectedSubject}
                </span>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> NCERT Aligned
                </span>
              </div>
              <h3 className="text-2xl font-black text-ink leading-tight">
                {activeChapter.en}
              </h3>
              <p className="text-xs sm:text-sm text-ink-3 font-medium">
                {activeChapter.descEn || "Complete NCERT chapter resource kit with presentations, mind maps, quizzes, and worksheets."}
              </p>
            </div>

            {/* Available Resources Grid */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h4 className="font-extrabold text-xs text-ink uppercase tracking-wider">Available Resources for this Chapter:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {resourcePills.map((res, idx) => {
                  const Icon = res.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-surface/60 border border-brand-border/40 text-xs font-bold text-ink">
                      <Icon className="w-4 h-4 text-brand-DEFAULT shrink-0" />
                      <span className="truncate">{res.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-ink-4 font-semibold">Ready to present in classroom</span>
              <button 
                onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-DEFAULT hover:bg-brand-600 text-white font-extrabold text-sm shadow-md shadow-brand-DEFAULT/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                Start Teaching This Chapter <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
