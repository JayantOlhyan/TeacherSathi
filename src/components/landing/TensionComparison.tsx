"use client";

import React from "react";
import { Clock, AlertTriangle, Sparkles, CheckCircle2, Zap, FileSpreadsheet } from "lucide-react";

export default function TensionComparison() {
  const manualPains = [
    {
      title: "14.5 Hours Lost Weekly",
      detail: "Evenings and Sundays spent manually drafting lesson notes, typing question papers, and formatting PPT slides.",
    },
    {
      title: "Fragmented Tool Scramble",
      detail: "Juggling 5 different browser tabs: YouTube clips, Wikipedia summaries, NCERT textbook PDFs, and Word docs.",
    },
    {
      title: "Hindi Translation Friction",
      detail: "Searching for accurate Devanagari pedagogical terms and manually re-typing complex bilingual diagrams.",
    },
    {
      title: "Format Incompatibility",
      detail: "Slides looking blurry on 75-inch smartboards or failing to format properly for single-page printouts.",
    },
  ];

  const aiBenefits = [
    {
      title: "30-Second Complete Kit",
      detail: "All 6 classroom assets (slides, video, mind map, quiz, question bank, worksheet) synthesized instantly.",
    },
    {
      title: "100% NCERT & NEP 2020 Aligned",
      detail: "Strict adherence to official CBSE curriculum guidelines, learning outcomes, and Bloom's taxonomy levels.",
    },
    {
      title: "Seamless Bilingual Parity",
      detail: "Simultaneous English and pure Devanagari Hindi output with zero translation errors.",
    },
    {
      title: "Native 75-Inch Smartboard Fidelity",
      detail: "4K high-contrast typography and low-glare dark/light modes engineered specifically for school IFP screens.",
    },
  ];

  return (
    <section className="relative w-full z-20 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          The Teaching Reality in India
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A2E20] tracking-tight leading-tight">
          Teaching is your passion.<br />
          <span className="text-[#0F5B38]">Manual lesson prep shouldn&apos;t steal your weekends.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#425B4C] font-semibold max-w-xl mx-auto">
          Compare the traditional late-night preparation grind with instant, verified NCERT AI pedagogical synthesis.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: The Manual Burden */}
        <div className="lg:col-span-6 rounded-3xl bg-white/90 border border-rose-200/80 p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(225,29,72,0.08)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div className="flex items-center gap-2 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-black uppercase tracking-wider">The Manual Prep Burden</span>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Avg 3 Hours / Chapter
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {manualPains.map((pain, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl bg-rose-50/50 border border-rose-100/80">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-[#1A2E20]">{pain.title}</h3>
                    <p className="text-xs font-medium text-[#425B4C] leading-relaxed">{pain.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-slate-500" /> 14.5 hours unpaid weekly overtime
            </span>
            <span className="text-rose-700 font-black">High Teacher Fatigue</span>
          </div>
        </div>

        {/* Right: The Teacher Sathi Way */}
        <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#0F5B38] via-[#0C4B2E] to-[#062E1E] text-white p-6 sm:p-8 shadow-[0_20px_50px_-10px_rgba(15,91,56,0.35)] border border-emerald-400/30 flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider">Teacher Sathi Synthesis</span>
              </div>
              <span className="text-xs font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-md shadow-sm">
                30 Seconds / Chapter
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {aiBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white">{benefit.title}</h3>
                    <p className="text-xs font-medium text-emerald-100/80 leading-relaxed">{benefit.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between text-xs font-bold text-emerald-200 relative z-10">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Instant ready-to-teach package
            </span>
            <span className="text-amber-300 font-black">100% Free Forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}
