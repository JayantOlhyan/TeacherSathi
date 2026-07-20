"use client";

import React from "react";
import { 
  ArrowRight, 
  PlayCircle,
  CheckCircle2,
  Heart,
  Monitor,
  Video,
  Network,
  HelpCircle,
  FileCheck2,
  FileText,
  Settings,
  BookOpen,
  LayoutTemplate
} from "lucide-react";
import JungleBackground from "@/components/landing/JungleBackground";
import SmartboardFrame from "@/components/landing/SmartboardFrame";
import TrustStrip from "@/components/landing/TrustStrip";
import HowItWorksSteps from "@/components/landing/HowItWorksSteps";
import TestimonialGrid from "@/components/landing/TestimonialGrid";
import SampleResourcesExplorer from "@/components/landing/SampleResourcesExplorer";
import CurriculumCoverage from "@/components/landing/CurriculumCoverage";
import InteractiveFeaturesSection from "@/components/landing/InteractiveFeaturesSection";
import FooterMission from "@/components/landing/FooterMission";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans text-ink overflow-x-hidden selection:bg-brand-DEFAULT selection:text-white">
      
      {/* 1. Global Background */}
      <JungleBackground />

      <main className="relative flex-1 w-full z-10 pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">

        {/* 2. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[85vh]">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-5 space-y-8 z-20 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAFA]/90 backdrop-blur-md border border-brand-200/50 text-brand-800 font-bold text-[11px] uppercase tracking-widest shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-brand-DEFAULT text-brand-DEFAULT" /> Made for Government School Teachers
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#1A2E20] tracking-tight leading-[1.05]">
                Turn any NCERT chapter into a classroom-ready lesson.
              </h1>
              
              <p className="text-lg text-[#2C4A35] font-semibold leading-relaxed max-w-md">
                Presentations, videos, quizzes, mind maps, question banks and worksheets — built around the chapter you&apos;re actually teaching.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-brand-DEFAULT text-white font-extrabold text-sm shadow-[0_8px_20px_-4px_rgba(15,91,56,0.4)] hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
              >
                Create Your First Lesson <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-950/10 text-brand-950 font-extrabold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                See How It Works <PlayCircle className="w-4 h-4 text-brand-DEFAULT" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-brand-900/10">
              <span className="flex items-center gap-2 text-xs font-bold text-[#1A2E20]"><CheckCircle2 className="w-4 h-4 text-brand-DEFAULT" /> NCERT Aligned</span>
              <span className="flex items-center gap-2 text-xs font-bold text-[#1A2E20]"><BookOpen className="w-4 h-4 text-brand-DEFAULT" /> Hindi & English</span>
              <span className="flex items-center gap-2 text-xs font-bold text-[#1A2E20]"><Monitor className="w-4 h-4 text-brand-DEFAULT" /> No Special Hardware Required</span>
            </div>
          </div>

          {/* Hero Right Smartboard Dashboard */}
          <div className="lg:col-span-7 z-10 relative">
            <SmartboardFrame>
              <div className="flex h-full w-full bg-[#F3F4F6] font-sans text-ink">
                {/* Sidebar */}
                <div className="w-[180px] bg-[#123524] text-white flex flex-col py-6">
                  <div className="px-6 mb-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#123524]" />
                    </div>
                    <div>
                      <h1 className="font-black text-sm tracking-tight leading-none">TeacherSathi</h1>
                      <span className="text-[10px] text-white/70 font-medium">साथी</span>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1 px-3">
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-white/10 rounded-lg text-white font-bold text-xs">
                      <LayoutTemplate className="w-4 h-4" /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs">
                      <BookOpen className="w-4 h-4" /> My Lessons
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs">
                      <FileText className="w-4 h-4" /> Resources
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs">
                      <HelpCircle className="w-4 h-4" /> Quizzes
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs">
                      <FileCheck2 className="w-4 h-4" /> Worksheets
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white font-bold text-xs mt-auto">
                      <Settings className="w-4 h-4" /> Settings
                    </a>
                  </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-l-3xl p-10 flex flex-col">
                  
                  <div className="mb-10">
                    <h2 className="text-2xl font-black text-[#1A2E20] mb-1">Let&apos;s create your teaching kit</h2>
                    <p className="text-[#4A5D52] text-xs font-semibold">Choose your chapter and generate all resources in seconds.</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-6 mb-12">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#1A2E20] uppercase tracking-widest pl-1">Class</label>
                        <div className="h-10 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-3 justify-between">
                          <span className="text-sm font-bold text-[#1A2E20]">8</span>
                          <span className="text-slate-400 text-xs">▼</span>
                        </div>
                      </div>
                      <div className="flex-[1.5] space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#1A2E20] uppercase tracking-widest pl-1">Subject</label>
                        <div className="h-10 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-3 justify-between">
                          <span className="text-sm font-bold text-[#1A2E20]">Science</span>
                          <span className="text-slate-400 text-xs">▼</span>
                        </div>
                      </div>
                      <div className="flex-[3] space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#1A2E20] uppercase tracking-widest pl-1">Chapter</label>
                        <div className="h-10 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-3 justify-between">
                          <span className="text-sm font-bold text-[#1A2E20]">Conservation of Plants and Animals</span>
                          <span className="text-slate-400 text-xs">▼</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full py-3.5 rounded-lg bg-[#156B3A] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md">
                      Generate Teaching Kit <span className="text-xl leading-none -mt-1">✨</span>
                    </button>
                  </div>

                  {/* What you will get */}
                  <div className="mt-auto">
                    <h3 className="text-[11px] font-extrabold text-[#1A2E20] uppercase tracking-widest mb-4">What you will get</h3>
                    
                    <div className="flex justify-between">
                      {/* Icons Row */}
                      {[
                        { label: "Lesson Presentation", icon: Monitor, color: "text-rose-500", bg: "bg-rose-50" },
                        { label: "Explainer Video", icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
                        { label: "Mind Map", icon: Network, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Interactive Quiz", icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50" },
                        { label: "Question Bank", icon: FileCheck2, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Worksheet", icon: FileText, color: "text-orange-500", bg: "bg-orange-50" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-3 w-16">
                          <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shadow-sm border border-slate-100`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <span className="text-[9px] font-bold text-[#4A5D52] leading-tight px-1">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer tags */}
                  <div className="flex justify-between items-center mt-12 pt-4 border-t border-slate-100 text-[10px] font-bold text-[#1A2E20]">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-DEFAULT" /> NCERT Aligned</span>
                    <span className="text-[#4A5D52]">75-inch Smart Screen Ready</span>
                  </div>

                </div>
              </div>
            </SmartboardFrame>
          </div>
        </section>

        {/* 3. Trust Strip */}
        <section className="mb-16 mt-4 relative z-20">
          <TrustStrip />
        </section>

        {/* 4. Features Section (Interactive Scrollytelling) */}
        <InteractiveFeaturesSection />

        {/* 5. How It Works Section */}
        <section className="mb-32 relative z-20">
          <HowItWorksSteps />
        </section>

        {/* 6. Testimonials Section */}
        <section className="mb-32 relative z-20">
          <TestimonialGrid />
        </section>

        {/* 7. Sample Resources Interactive Section */}
        <section className="mb-32 relative z-20">
          <SampleResourcesExplorer />
        </section>

        {/* 8. Curriculum Coverage Section */}
        <section className="mb-32 relative z-20">
          <CurriculumCoverage />
        </section>

      </main>

      <FooterMission />
    </div>
  );
}
