"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  ArrowRight, 
  PlayCircle,
  CheckCircle2,
  Heart,
  Monitor,
  BookOpen,
  Star
} from "lucide-react";
import JungleBackground from "@/components/landing/JungleBackground";
import SmartboardFrame from "@/components/landing/SmartboardFrame";
import InteractiveHeroWorkspace from "@/components/landing/InteractiveHeroWorkspace";
import TrustStrip from "@/components/landing/TrustStrip";
import HowItWorksSteps from "@/components/landing/HowItWorksSteps";
import TestimonialGrid from "@/components/landing/TestimonialGrid";
import SampleResourcesExplorer from "@/components/landing/SampleResourcesExplorer";
import CurriculumCoverage from "@/components/landing/CurriculumCoverage";
import InteractiveFeaturesSection from "@/components/landing/InteractiveFeaturesSection";
import FooterMission from "@/components/landing/FooterMission";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

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
              <Heart className="w-3.5 h-3.5 fill-brand text-brand" /> 🇮🇳 Empowering India&apos;s Government School Teachers with NEP 2020 Aligned AI
            </div>

            <div className="space-y-6">
              <h1 className="hero-element text-4xl sm:text-5xl md:text-6xl font-black text-[#1A2E20] tracking-tighter leading-[1.08]">
                Convert Any NCERT Chapter into an Interactive Smart Board Kit in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F5B38] to-[#1a935b]">30 Seconds</span>
              </h1>
              
              <p className="hero-element text-base sm:text-lg text-[#2C4A35] font-semibold leading-relaxed max-w-lg">
                Instantly generate complete bilingual teaching kits—slide decks, HD videos, interactive quizzes, and print-ready worksheets—customized to your syllabus.
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
              <InteractiveHeroWorkspace />
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
