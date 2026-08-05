"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
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
  LayoutTemplate,
  Star
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
  const heroRef = useRef<HTMLDivElement>(null);
  const smartboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const ctx = gsap.context(() => {
      // Hero text entrance
      gsap.fromTo(".hero-element", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );

      // Smartboard UI staggered entrance
      gsap.fromTo(".sb-animate",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)", delay: 0.6 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-ink overflow-x-hidden selection:bg-brand selection:text-white">
      
      {/* 1. Global Background */}
      <JungleBackground />

      <main className="relative flex-1 w-full z-10 pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">

        {/* 2. Hero Section */}
        <section ref={heroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[85vh]">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-5 space-y-8 z-20 relative">
            <div className="hero-element inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFAFA]/90 backdrop-blur-md border border-brand-200/60 text-brand-900 font-extrabold text-[11px] uppercase tracking-widest shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-brand text-brand" /> Made for Government School Teachers • Saves 12 Hours Weekly
            </div>

            <div className="space-y-6">
              <h1 className="hero-element text-4xl sm:text-5xl md:text-6xl font-black text-[#1A2E20] tracking-tighter leading-[1.08]">
                Turn Any NCERT Chapter into a Classroom-Ready Lesson in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F5B38] to-[#1a935b]">30 Seconds</span>
              </h1>
              
              <p className="hero-element text-base sm:text-lg text-[#2C4A35] font-semibold leading-relaxed max-w-lg">
                India&apos;s #1 NCERT AI Lesson Plan Generator &amp; CBSE Worksheet Creator. Generate 75-inch smartboard presentations, explainer videos, mind maps, quizzes, and printable worksheets in seconds.
              </p>
            </div>

            <div className="hero-element space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href="/signup"
                  className="group relative w-full sm:w-auto px-7 py-4 rounded-full bg-brand text-white font-black text-sm shadow-[0_8px_25px_-5px_rgba(15,91,56,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(15,91,56,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                  <span className="relative z-10">Generate Free NCERT Lesson Kit Now 🚀</span> 
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a 
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/80 backdrop-blur-md border border-brand-950/10 text-brand-950 font-extrabold text-sm hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  See How It Works <PlayCircle className="w-4 h-4 text-brand" />
                </a>
              </div>

              {/* Trust Statement */}
              <p className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 pl-2 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                100% Free for Individual Teachers — No Credit Card Required
              </p>
            </div>

            {/* Social Proof Avatars */}
            <div className="hero-element flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-black text-[10px] shadow-sm z-30">AR</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-black text-[10px] shadow-sm z-20">SK</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-black text-[10px] shadow-sm z-10">MJ</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-50 flex items-center justify-center text-brand font-black text-[10px] shadow-sm z-0">+9k</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs font-bold text-[#2C4A35]">Joined by 10,000+ Teachers across CBSE &amp; KVS</span>
              </div>
            </div>

            {/* Hardware Compatibility Micro-copy */}
            <div className="hero-element flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-brand-900/10 text-xs font-bold text-[#1A2E20]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand" /> NCERT &amp; NEP 2020 Aligned</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-brand" /> Bilingual (Hindi &amp; English)</span>
              <span className="flex items-center gap-1.5 bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-full border border-emerald-300/60">
                <Monitor className="w-3.5 h-3.5 text-emerald-700" /> Works natively on any 75-inch Smart Screen, Laptop, or Mobile device
              </span>
            </div>
          </div>

          {/* Hero Right Smartboard Dashboard */}
          <div className="lg:col-span-7 z-10 relative">
            <SmartboardFrame>
              <div ref={smartboardRef} className="flex h-full w-full bg-[#F3F4F6] font-sans text-ink">
                {/* Sidebar */}
                <div className="sb-animate w-[180px] bg-[#123524] text-white flex flex-col py-6">
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
                  
                  <div className="sb-animate mb-10">
                    <h2 className="text-2xl font-black text-[#1A2E20] mb-1">Let&apos;s create your teaching kit</h2>
                    <p className="text-[#4A5D52] text-xs font-semibold">Choose your chapter and generate all resources in seconds.</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-6 mb-12">
                    <div className="flex gap-4">
                      <div className="sb-animate flex-1 space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#1A2E20] uppercase tracking-widest pl-1">Class</label>
                        <div className="h-10 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-3 justify-between">
                          <span className="text-sm font-bold text-[#1A2E20]">8</span>
                          <span className="text-slate-400 text-xs">▼</span>
                        </div>
                      </div>
                      <div className="sb-animate flex-[1.5] space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#1A2E20] uppercase tracking-widest pl-1">Subject</label>
                        <div className="h-10 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-3 justify-between">
                          <span className="text-sm font-bold text-[#1A2E20]">Science</span>
                          <span className="text-slate-400 text-xs">▼</span>
                        </div>
                      </div>
                      <div className="sb-animate flex-[3] space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#1A2E20] uppercase tracking-widest pl-1">Chapter</label>
                        <div className="h-10 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-3 justify-between">
                          <span className="text-sm font-bold text-[#1A2E20]">Conservation of Plants and Animals</span>
                          <span className="text-slate-400 text-xs">▼</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="sb-animate w-full py-3.5 rounded-lg bg-[#156B3A] text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_15px_-3px_rgba(21,107,58,0.4)] hover:bg-[#125c31] transition-colors">
                      Generate Teaching Kit <span className="text-xl leading-none -mt-1">✨</span>
                    </button>
                  </div>

                  {/* What you will get */}
                  <div className="mt-auto">
                    <h3 className="sb-animate text-[11px] font-extrabold text-[#1A2E20] uppercase tracking-widest mb-4">What you will get</h3>
                    
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
                        <div key={i} className="sb-animate flex flex-col items-center text-center gap-3 w-16">
                          <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shadow-sm border border-slate-100 transition-transform hover:scale-110 hover:-translate-y-1`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <span className="text-[9px] font-bold text-[#4A5D52] leading-tight px-1">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer tags */}
                  <div className="sb-animate flex justify-between items-center mt-12 pt-4 border-t border-slate-100 text-[10px] font-bold text-[#1A2E20]">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" /> NCERT Aligned</span>
                    <span className="text-[#4A5D52]">75-inch Smart Screen Ready</span>
                  </div>

                </div>
              </div>
            </SmartboardFrame>
          </div>
        </section>

        {/* 3. Trust Strip */}
        <section id="about" className="mb-16 mt-4 relative z-20">
          <TrustStrip />
        </section>

        {/* 4. Features Section (Interactive Scrollytelling) */}
        <div id="features">
          <InteractiveFeaturesSection />
        </div>

        {/* 5. How It Works Section */}
        <section id="how-it-works" className="mb-32 relative z-20">
          <HowItWorksSteps />
        </section>

        {/* 6. Testimonials Section */}
        <section id="teacher-tested" className="mb-32 relative z-20">
          <TestimonialGrid />
        </section>

        {/* 7. Sample Resources Interactive Section */}
        <section id="resources" className="mb-32 relative z-20">
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
