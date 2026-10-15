"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Languages
} from "lucide-react";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";

export default function HeroSmartboardSurface() {
  const [selectedClass, setSelectedClass] = useState<string>("Class 8");
  const [selectedSubject, setSelectedSubject] = useState<string>("Science");

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const subjects = ["Science", "Mathematics", "Social Science", "Hindi"];

  // Fetch real NCERT chapter data dynamically
  const availableChapters = NCERT_SYLLABUS[selectedClass]?.[selectedSubject] || [];
  const activeChapter = availableChapters[0] || {
    en: "Conservation of Plants and Animals",
    descEn: "Biodiversity, deforestation causes, and biosphere protection.",
  };

  return (
    <div className="w-full bg-[#0A1810] text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] relative overflow-hidden select-none">
      {/* Subtle Background Glow Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 blur-[80px] pointer-events-none rounded-full" />

      {/* Top Bar: Live Classroom Controls */}
      <div className="relative z-10 space-y-4">
        {/* Hardware Status & Language Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide text-emerald-300 uppercase">
              Live Lesson Workspace
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
            <Languages className="w-3.5 h-3.5" /> Bilingual Hindi &amp; English Synced
          </div>
        </div>

        {/* Class and Subject Selectors */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  selectedClass === cls
                    ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  selectedSubject === sub
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Active NCERT Chapter Showcase Card */}
      <div className="relative z-10 my-4 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-colors">
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
            <Image
              src="/giraffe.jpg"
              alt="Chapter Visual"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                NCERT Chapter 7
              </span>
            </div>
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <BookOpen className="w-3 h-3" /> {selectedClass} • {selectedSubject}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {activeChapter.en}
            </h3>
            <p className="text-xs text-slate-300 font-medium line-clamp-2">
              {activeChapter.descEn}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-bold text-emerald-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Slides
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mind Map
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Quiz
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Worksheet
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Ribbon */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Ready in 30 seconds with complete bilingual alignment
        </div>

        <a
          href="#metamorphic-console"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-600/30 cursor-pointer"
        >
          <span>Try Interactive Scrubber</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
