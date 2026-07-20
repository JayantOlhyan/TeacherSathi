"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartboardFrame from "./SmartboardFrame";
import { 
  CheckCircle2, Presentation, Video, Network, 
  HelpCircle, FileCheck2, FileText, Sparkles,
  Users, Download, Play, BookOpen, ChevronRight,
  MonitorPlay, LayoutTemplate, Settings, Share2,
  Printer
} from "lucide-react";

export default function ScrollytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        if (p < 0.12) setActiveStep(1); // Select
        else if (p < 0.24) setActiveStep(2); // Generate
        else if (p < 0.36) setActiveStep(3); // Presentation
        else if (p < 0.48) setActiveStep(4); // Video
        else if (p < 0.60) setActiveStep(5); // Mind Map
        else if (p < 0.72) setActiveStep(6); // Quiz
        else if (p < 0.84) setActiveStep(7); // Question Bank
        else setActiveStep(8); // Worksheet
      },
    });

    return () => st.kill();
  }, []);

  const stepsList = [
    { num: "01", label: "Select Chapter", icon: BookOpen },
    { num: "02", label: "Generate Kit", icon: Sparkles },
    { num: "03", label: "Presentation", icon: Presentation },
    { num: "04", label: "Explainer Video", icon: Video },
    { num: "05", label: "Mind Map", icon: Network },
    { num: "06", label: "Interactive Quiz", icon: HelpCircle },
    { num: "07", label: "Question Bank", icon: FileCheck2 },
    { num: "08", label: "Worksheet", icon: FileText },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-transparent py-20 z-10"
      id="scrollytelling"
    >
      {/* 600vh distance for granular scrubbing across 8 states */}
      <div ref={triggerRef} className="relative min-h-[600vh]">
        
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
          
          <div className="w-full text-center max-w-3xl mx-auto mb-10 mt-10 lg:mt-0">
            <h2 className="text-3xl sm:text-5xl font-black text-ink tracking-tight leading-[1.1] mb-4">
              The entire chapter,<br />
              <span className="text-brand-DEFAULT">ready in seconds.</span>
            </h2>
            <p className="text-sm sm:text-base text-ink-3 font-medium">
              Watch how one NCERT chapter transforms into a complete, interactive classroom experience. Keep scrolling.
            </p>
          </div>

          <div className="w-full grid grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Left Column — Progress Stepper */}
            <div className="hidden lg:block col-span-3 space-y-3 z-10">
              <div className="pl-4 border-l-2 border-brand-border/40 space-y-4 relative">
                
                {/* Animated Progress Line */}
                <div 
                  className="absolute top-0 left-[-2px] w-[2px] bg-brand-DEFAULT origin-top transition-all duration-300 ease-out"
                  style={{ height: `${Math.max(0, scrollProgress * 100)}%` }}
                />

                {stepsList.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = activeStep === stepNum;
                  const isPast = activeStep > stepNum;
                  
                  return (
                    <div
                      key={step.num}
                      className={`flex items-center gap-4 transition-all duration-300 ${
                        isActive 
                          ? "opacity-100 translate-x-1" 
                          : isPast ? "opacity-40" : "opacity-30"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-brand-DEFAULT text-white shadow-lg shadow-brand-DEFAULT/30" : 
                        isPast ? "bg-brand-50 border border-brand-200 text-brand-DEFAULT" :
                        "bg-transparent border border-ink-4/30 text-ink-4"
                      }`}>
                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-brand-DEFAULT" : "text-ink-4"}`}>
                          Step {step.num}
                        </div>
                        <div className={`text-sm font-bold ${isActive ? "text-ink" : "text-ink-3"}`}>
                          {step.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center — The Central Smartboard Anchor */}
            <div className="col-span-12 lg:col-span-9 z-10">
              <SmartboardFrame>
                <div className="relative w-full h-full bg-[#FAFAFA] flex flex-col overflow-hidden font-sans">
                  
                  {/* Fake Browser/App Header */}
                  <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                      </div>
                      <div className="h-6 w-64 bg-slate-100 rounded-md border border-slate-200 flex items-center px-3 text-[10px] text-slate-400 font-medium">
                        <MonitorPlay className="w-3 h-3 mr-2" /> workspace.teachersathi.in
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-DEFAULT flex items-center justify-center font-bold text-xs">
                        T
                      </div>
                    </div>
                  </div>

                  {/* Main Smartboard Content Area - Fading between states */}
                  <div className="flex-1 relative bg-slate-50/50">
                    
                    {/* State 1: Select Chapter (0 - 0.12) */}
                    <div className={`absolute inset-0 p-8 transition-opacity duration-500 flex flex-col items-center justify-center ${activeStep === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05),_0_0_1px_rgba(0,0,0,0.1)] p-8 space-y-8 transform scale-100">
                        <div className="text-center space-y-1.5">
                          <h3 className="text-xl font-black text-ink tracking-tight">New Lesson Kit</h3>
                          <p className="text-xs text-ink-3 font-medium">Configure parameters to generate your resources.</p>
                        </div>
                        
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-ink-4 uppercase tracking-widest pl-1">Class</label>
                            <div className="w-full h-11 rounded-xl border border-slate-200/70 bg-slate-50/50 flex items-center px-4 justify-between cursor-pointer hover:border-slate-300 transition-colors">
                              <span className="text-sm font-bold text-ink-2">Class 8</span>
                              <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-ink-4 uppercase tracking-widest pl-1">Subject</label>
                            <div className="w-full h-11 rounded-xl border border-slate-200/70 bg-slate-50/50 flex items-center px-4 justify-between cursor-pointer hover:border-slate-300 transition-colors">
                              <span className="text-sm font-bold text-ink-2">Science</span>
                              <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-brand-DEFAULT uppercase tracking-widest pl-1">NCERT Chapter</label>
                            <div className="w-full h-12 rounded-xl border border-brand-DEFAULT/30 bg-brand-50/80 flex items-center px-4 justify-between cursor-pointer ring-4 ring-brand-DEFAULT/5">
                              <span className="text-sm font-black text-brand-950">7. Conservation of Plants and Animals</span>
                              <ChevronRight className="w-4 h-4 text-brand-DEFAULT rotate-90" />
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-3.5 rounded-xl bg-brand-DEFAULT hover:bg-brand-600 transition-colors text-white font-extrabold text-sm shadow-[0_8px_20px_-4px_rgba(15,91,56,0.3)] flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4" /> Generate Teaching Kit
                        </button>
                      </div>
                    </div>

                    {/* State 2: Generating (0.12 - 0.24) */}
                    <div className={`absolute inset-0 p-8 transition-opacity duration-500 flex flex-col items-center justify-center ${activeStep === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="text-center space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                          <div className="absolute inset-0 rounded-full border-4 border-brand-DEFAULT border-t-transparent animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-brand-DEFAULT animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-ink">Analyzing NCERT Chapter 7...</h3>
                          <div className="flex flex-col gap-2 items-center text-xs font-bold text-ink-3">
                            <span className="flex items-center gap-2 text-brand-DEFAULT"><CheckCircle2 className="w-3.5 h-3.5" /> Extracting core concepts</span>
                            <span className="flex items-center gap-2 text-brand-DEFAULT"><CheckCircle2 className="w-3.5 h-3.5" /> Drafting presentation slides</span>
                            <span className="flex items-center gap-2 opacity-50"><Sparkles className="w-3.5 h-3.5" /> Generating bilingual quiz</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* State 3: Presentation (0.24 - 0.36) */}
                    <div className={`absolute inset-0 bg-slate-900 transition-opacity duration-500 flex flex-col ${activeStep === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="flex-1 flex p-4 gap-4">
                        {/* Sidebar Thumbnails */}
                        <div className="w-48 hidden sm:flex flex-col gap-3 overflow-hidden">
                          <div className="w-full aspect-video rounded-lg bg-brand-600 border-2 border-brand-400 p-2 shadow-lg shadow-brand-DEFAULT/20">
                            <div className="w-full h-full border border-white/20 rounded flex items-center justify-center text-white/50 text-xs">Slide 1</div>
                          </div>
                          <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 p-2 opacity-60">
                            <div className="w-3/4 h-2 bg-slate-600 rounded mb-2" />
                            <div className="w-full h-1 bg-slate-700 rounded mb-1" />
                            <div className="w-4/5 h-1 bg-slate-700 rounded" />
                          </div>
                          <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 p-2 opacity-60">
                            <div className="w-1/2 h-16 bg-slate-700 rounded float-right ml-2" />
                            <div className="w-2/5 h-2 bg-slate-600 rounded mb-2" />
                            <div className="w-2/5 h-1 bg-slate-700 rounded mb-1" />
                          </div>
                        </div>
                        
                        {/* Main Slide */}
                        <div className="flex-1 bg-gradient-to-br from-[#062E1E] to-[#041F14] rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-12 text-center border border-white/10 shadow-2xl">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-DEFAULT/20 blur-[100px] rounded-full" />
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
                          
                          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                            Chapter 7 • Introduction
                          </span>
                          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                            Conservation of <br/><span className="text-emerald-400">Plants and Animals</span>
                          </h1>
                          <p className="text-emerald-50 max-w-lg text-sm sm:text-base font-medium opacity-80 leading-relaxed">
                            Understanding deforestation, its causes, and how we can protect our biodiversity.
                          </p>
                        </div>
                      </div>
                      <div className="h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-6 px-4">
                        <div className="text-slate-400 text-xs font-bold">1 / 14</div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><ChevronRight className="w-4 h-4 text-white rotate-180" /></div>
                          <div className="w-8 h-8 rounded-full bg-brand-DEFAULT flex items-center justify-center"><ChevronRight className="w-4 h-4 text-white" /></div>
                        </div>
                      </div>
                    </div>

                    {/* State 4: Video (0.36 - 0.48) */}
                    <div className={`absolute inset-0 p-4 transition-opacity duration-500 flex ${activeStep === 4 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="flex-1 bg-black rounded-xl overflow-hidden relative group">
                        {/* Fake Video Content */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-brand-DEFAULT flex items-center justify-center shadow-lg shadow-brand-DEFAULT/50 pl-1">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Premium Video Player Controls */}
                        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end">
                          <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden cursor-pointer">
                            <div className="w-1/3 h-full bg-brand-DEFAULT relative">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-white font-medium text-xs">
                            <div className="flex items-center gap-4">
                              <Play className="w-4 h-4 fill-white" />
                              <span>01:24 / 04:15</span>
                              <div className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/10">Hindi Audio</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Settings className="w-4 h-4" />
                              <div className="w-4 h-4 border-2 border-white rounded-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* State 5: Mind Map (0.48 - 0.60) */}
                    <div className={`absolute inset-0 bg-[#F4F6F2] p-6 transition-opacity duration-500 flex flex-col items-center justify-center overflow-hidden ${activeStep === 5 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      {/* Grid Background */}
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#D2E3D6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      
                      {/* Node Graph */}
                      <div className="relative z-10 w-full max-w-2xl h-64">
                        {/* Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                          <path d="M 50% 20% L 20% 70%" stroke="#96C7A0" strokeWidth="2" fill="none" className="path-draw" />
                          <path d="M 50% 20% L 50% 70%" stroke="#96C7A0" strokeWidth="2" fill="none" className="path-draw" />
                          <path d="M 50% 20% L 80% 70%" stroke="#96C7A0" strokeWidth="2" fill="none" className="path-draw" />
                        </svg>

                        {/* Root Node */}
                        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 px-6 py-3 bg-brand-DEFAULT text-white rounded-xl font-black text-sm shadow-xl shadow-brand-DEFAULT/20 border border-brand-600">
                          Deforestation
                        </div>

                        {/* Child Nodes */}
                        <div className="absolute top-[65%] left-[20%] -translate-x-1/2 px-4 py-2 bg-white text-ink rounded-lg font-bold text-xs shadow-md border border-slate-200 w-32 text-center">
                          Causes (Natural & Man-made)
                        </div>
                        <div className="absolute top-[65%] left-[50%] -translate-x-1/2 px-4 py-2 bg-white text-ink rounded-lg font-bold text-xs shadow-md border border-slate-200 w-32 text-center">
                          Consequences (Droughts, etc)
                        </div>
                        <div className="absolute top-[65%] left-[80%] -translate-x-1/2 px-4 py-2 bg-white text-ink rounded-lg font-bold text-xs shadow-md border border-slate-200 w-32 text-center">
                          Conservation Methods
                        </div>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center font-black text-ink">+</div>
                        <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center font-black text-ink">-</div>
                      </div>
                    </div>

                    {/* State 6: Quiz (0.60 - 0.72) */}
                    <div className={`absolute inset-0 bg-slate-50 p-6 sm:p-10 transition-opacity duration-500 flex flex-col ${activeStep === 6 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                          <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-DEFAULT text-xs font-bold border border-brand-200">Question 3 of 10</span>
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 32 Students Active</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-ink mb-8 leading-tight">
                          Which of the following is a major consequence of deforestation?
                        </h2>

                        <div className="space-y-3">
                          <div className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 text-sm font-bold text-ink-2 flex items-center cursor-pointer hover:border-slate-300 transition-colors">
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs mr-3">A</div>
                            Increase in rainfall
                          </div>
                          
                          {/* Correct Answer State */}
                          <div className="w-full p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-sm font-black text-brand-900 flex items-center justify-between shadow-sm">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs mr-3">B</div>
                              Increase in earth's temperature
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </div>

                          <div className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 text-sm font-bold text-ink-2 flex items-center cursor-pointer">
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs mr-3">C</div>
                            Increase in groundwater level
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* State 7: Question Bank (0.72 - 0.84) */}
                    <div className={`absolute inset-0 bg-slate-100 p-4 sm:p-8 transition-opacity duration-500 ${activeStep === 7 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="w-full h-full max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
                        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50">
                          <h3 className="font-bold text-ink text-sm">NCERT Question Bank & Solutions</h3>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-ink-3 hover:bg-slate-100">Filter</button>
                            <button className="px-3 py-1.5 rounded-md bg-brand-surface text-brand-DEFAULT border border-brand-200 text-xs font-bold flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> Print</button>
                          </div>
                        </div>
                        <div className="flex-1 p-6 overflow-hidden space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-black uppercase border border-blue-100">Very Short Answer • 1 Mark</span>
                            </div>
                            <p className="text-sm font-bold text-ink">Q1. What is a biosphere reserve?</p>
                            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-sm text-ink-2">
                              <span className="font-bold text-emerald-700 text-xs uppercase block mb-1">Model Answer</span>
                              A biosphere reserve is a large protected area meant for the conservation of wildlife, plant and animal resources, and the traditional life of the tribals living in the area.
                            </div>
                          </div>
                          
                          <div className="space-y-2 opacity-50">
                            <div className="flex items-start justify-between">
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-black uppercase border border-amber-100">Short Answer • 2 Marks</span>
                            </div>
                            <p className="text-sm font-bold text-ink">Q2. Name the first Reserve Forest of India.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* State 8: Worksheet (0.84 - 1.0) */}
                    <div className={`absolute inset-0 bg-[#E2E8F0] p-4 sm:p-8 transition-opacity duration-500 flex items-center justify-center ${activeStep === 8 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm p-8 sm:p-12 relative">
                        {/* Fake PDF Header */}
                        <div className="flex justify-between items-end border-b-2 border-ink pb-4 mb-6">
                          <div>
                            <h2 className="text-xl font-black text-ink uppercase tracking-tight">Worksheet</h2>
                            <p className="text-xs font-bold text-ink-3">Ch 7: Conservation of Plants</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-[10px] text-ink-4">Name: _________________</div>
                            <div className="text-[10px] text-ink-4">Date: __________________</div>
                          </div>
                        </div>

                        {/* Content lines */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-ink mb-2">A. Fill in the blanks (1 mark each)</h4>
                            <div className="space-y-4">
                              <div className="text-xs text-ink-2 leading-relaxed">1. A place where animals are protected in their natural habitat is called a ________________.</div>
                              <div className="text-xs text-ink-2 leading-relaxed">2. Species found only in a particular area is known as ________________.</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-ink mb-2">B. True or False (1 mark each)</h4>
                            <div className="space-y-3">
                              <div className="text-xs text-ink-2 flex justify-between">1. Deforestation increases the temperature of the earth. <span className="border border-slate-300 w-8 h-4 inline-block"/></div>
                              <div className="text-xs text-ink-2 flex justify-between">2. Flora refers to the animals found in a particular area. <span className="border border-slate-300 w-8 h-4 inline-block"/></div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Action Button */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                          <button className="px-6 py-3 rounded-full bg-brand-DEFAULT text-white font-extrabold text-sm shadow-xl shadow-brand-DEFAULT/30 flex items-center gap-2 hover:bg-brand-600 transition-colors">
                            <Download className="w-4 h-4" /> Download PDF
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </SmartboardFrame>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
