"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartboardFrame from "./SmartboardFrame";
import { MockSidebar } from "./MockSidebar";
import Image from "next/image";
import { CheckCircle2, Play, Settings, Users, Check, Printer, Download } from "lucide-react";

export default function InteractiveFeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      start: "center center",
      end: "+=3000",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.16) setActiveStep(1); // Presentation
        else if (p < 0.33) setActiveStep(2); // Video
        else if (p < 0.50) setActiveStep(3); // Mind Map
        else if (p < 0.66) setActiveStep(4); // Quiz
        else if (p < 0.83) setActiveStep(5); // Question Bank
        else setActiveStep(6); // Worksheet
      },
    });

    return () => st.kill();
  }, []);

  const steps = [
    { num: "01", label: "Presentation" },
    { num: "02", label: "Video" },
    { num: "03", label: "Mind Map" },
    { num: "04", label: "Quiz" },
    { num: "05", label: "Question Bank" },
    { num: "06", label: "Worksheet" }
  ];

  const featuresList = [
    "Lesson Presentation",
    "Explainer Video",
    "Mind Map",
    "Interactive Quiz",
    "Question Bank",
    "Worksheet"
  ];

  return (
    <section className="relative w-full z-20 mb-20 mt-12">
      {/* Pinned Viewport */}
      <div ref={containerRef} className="w-full flex flex-col justify-center max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column (Static) */}
          <div className="lg:col-span-4 z-20">
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-8 sm:p-9 rounded-3xl shadow-[0_16px_40px_-10px_rgba(15,91,56,0.12)] space-y-6">
              <h2 className="text-4xl sm:text-5xl font-black text-[#0A2117] leading-tight tracking-tight">
                One chapter.<br />Everything you need.
              </h2>
              <p className="text-[#1C3829] font-bold text-sm sm:text-base leading-relaxed">
                TeacherSathi turns any NCERT chapter into a complete teaching kit that you can use in your classroom immediately.
              </p>
              
              <div className="space-y-3.5 pt-2">
                {featuresList.map((feature, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                      activeStep === i + 1 ? 'bg-brand/10 border border-brand/20' : ''
                    }`}
                    style={{ opacity: activeStep === i + 1 ? 1 : 0.65 }}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      activeStep === i + 1 ? 'bg-brand text-white shadow-sm' : 'bg-slate-200/80 text-slate-500'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className={`font-extrabold text-sm transition-colors duration-300 ${
                      activeStep === i + 1 ? 'text-[#0A2117]' : 'text-[#2D4A3B]'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-brand/10">
                <span className="text-brand text-lg sm:text-xl font-bold italic font-serif">All resources. One click.</span>
              </div>
            </div>
          </div>

          {/* Right Column (Smartboard + Steps) */}
          <div className="lg:col-span-8 relative z-10 flex items-center h-[500px]">
            <div className="flex-1 h-full flex flex-col justify-center">
              <SmartboardFrame>
                <div className="w-full h-full bg-[#F8FAF8] flex relative overflow-hidden">
                  
                  {/* Mock Sidebar */}
                  <MockSidebar activeIndex={1} />

                  {/* Main Content Area Container */}
                  <div className="flex-1 bg-[#F8FAF8] overflow-hidden relative flex z-10">
                    
                    {/* State 1: Presentation */}
                    <div className={`absolute inset-0 flex transition-opacity duration-300 bg-white ${activeStep === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
                        <div className="text-[10px] font-extrabold text-[#4A5D52] tracking-widest uppercase mb-4">
                          CLASS 8 - SCIENCE
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-[#1A2E20] leading-tight mb-4 tracking-tight">
                          Conservation of<br />Plants and Animals
                        </h2>
                        <p className="text-[#4A5D52] font-medium max-w-sm text-sm">
                          Understanding the importance of conserving our natural world.
                        </p>
                        <div className="mt-8 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand" />
                          <span className="text-xs font-bold text-[#1A2E20]">NCERT Aligned</span>
                        </div>
                      </div>
                      <div className="w-2/5 relative h-full shrink-0">
                        <Image src="/giraffe.jpg" alt="Giraffe" fill className="object-cover object-right" />
                      </div>
                    </div>

                    {/* State 2: Video */}
                    <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 bg-black ${activeStep === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="flex-1 relative">
                        <Image src="/giraffe.jpg" alt="Video Thumbnail" fill className="object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-brand/90 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-2xl hover:scale-105 transition-transform">
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                          </div>
                        </div>
                      </div>
                      {/* Video Controls */}
                      <div className="h-16 bg-slate-900 px-6 flex items-center justify-between border-t border-white/10 shrink-0">
                         <div className="flex items-center gap-4 text-white">
                           <Play className="w-4 h-4 fill-white" />
                           <span className="text-xs font-bold">02:14 / 05:30</span>
                         </div>
                         <div className="flex items-center gap-4 text-white">
                           <Settings className="w-4 h-4" />
                           <div className="w-4 h-3 border-2 border-white rounded-sm" />
                         </div>
                      </div>
                    </div>

                    {/* State 3: Mind Map */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-[#F4F6F2] ${activeStep === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#D2E3D6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <div className="relative z-10 w-full max-w-md h-64 flex flex-col items-center">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                          <path d="M 50% 20% L 20% 70%" stroke="#96C7A0" strokeWidth="2" fill="none" />
                          <path d="M 50% 20% L 50% 70%" stroke="#96C7A0" strokeWidth="2" fill="none" />
                          <path d="M 50% 20% L 80% 70%" stroke="#96C7A0" strokeWidth="2" fill="none" />
                        </svg>
                        <div className="absolute top-[10%] px-6 py-3 bg-brand text-white rounded-xl font-black text-sm shadow-xl shadow-brand/20">
                          Conservation
                        </div>
                        <div className="absolute top-[65%] left-[20%] -translate-x-1/2 px-4 py-2 bg-white text-[#1A2E20] rounded-lg font-bold text-[10px] shadow-md border border-slate-200 text-center">
                          Deforestation Causes
                        </div>
                        <div className="absolute top-[65%] left-[50%] -translate-x-1/2 px-4 py-2 bg-white text-[#1A2E20] rounded-lg font-bold text-[10px] shadow-md border border-slate-200 text-center">
                          Consequences
                        </div>
                        <div className="absolute top-[65%] left-[80%] -translate-x-1/2 px-4 py-2 bg-white text-[#1A2E20] rounded-lg font-bold text-[10px] shadow-md border border-slate-200 text-center">
                          Protected Areas
                        </div>
                      </div>
                    </div>

                    {/* State 4: Quiz */}
                    <div className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-300 bg-slate-50 p-8 sm:p-12 ${activeStep === 4 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">Question 3 of 10</span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 32 Active</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#1A2E20] mb-6 leading-tight">
                        Which of the following is a major cause of deforestation?
                      </h2>
                      <div className="space-y-3">
                        <div className="w-full p-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center">
                          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] mr-3">A</div>
                          Afforestation
                        </div>
                        <div className="w-full p-3 rounded-lg bg-emerald-50 border-2 border-emerald-500 text-xs font-black text-[#1A2E20] flex items-center justify-between shadow-sm">
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] mr-3">B</div>
                            Urbanization
                          </div>
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="w-full p-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center">
                          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] mr-3">C</div>
                          Overgrazing
                        </div>
                      </div>
                    </div>

                    {/* State 5: Question Bank */}
                    <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 bg-slate-100 p-8 ${activeStep === 5 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      <div className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                          <h3 className="font-bold text-[#1A2E20] text-xs">NCERT Question Bank</h3>
                          <button className="px-2 py-1 rounded-md bg-brand-50 text-brand border border-brand-200 text-[10px] font-bold flex items-center gap-1">
                            <Printer className="w-3 h-3" /> Print
                          </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                          <div className="space-y-2">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-black uppercase border border-blue-100">Very Short Answer</span>
                            <p className="text-xs font-bold text-[#1A2E20]">Q1. What is a biosphere reserve?</p>
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-[#4A5D52]">
                              <span className="font-bold text-emerald-700 text-[10px] uppercase block mb-1">Model Answer</span>
                              A biosphere reserve is a large protected area meant for the conservation of wildlife, plant and animal resources, and the traditional life of the tribals.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* State 6: Worksheet */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-slate-200 p-6 ${activeStep === 6 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                       <div className="w-full max-w-sm aspect-[1/1.4] bg-white shadow-xl rounded p-8 relative flex flex-col">
                         <div className="flex justify-between items-end border-b-2 border-[#1A2E20] pb-3 mb-4">
                           <div>
                             <h2 className="text-lg font-black text-[#1A2E20] uppercase tracking-tight">Worksheet</h2>
                           </div>
                           <div className="text-right space-y-1">
                             <div className="text-[8px] text-slate-400">Name: _____________</div>
                             <div className="text-[8px] text-slate-400">Date: ______________</div>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div>
                             <h4 className="text-[10px] font-bold text-[#1A2E20] mb-2">A. Fill in the blanks</h4>
                             <div className="space-y-2 text-[9px] text-slate-600">
                               <div>1. A place where animals are protected is called a ____________.</div>
                               <div>2. Species found only in a particular area is known as ____________.</div>
                             </div>
                           </div>
                         </div>
                         <div className="mt-auto flex justify-center">
                           <button className="px-4 py-2 rounded-full bg-brand text-white font-bold text-[10px] flex items-center gap-2 hover:bg-brand-600 transition-colors">
                             <Download className="w-3 h-3" /> Download PDF
                           </button>
                         </div>
                       </div>
                    </div>

                  </div>
                </div>
              </SmartboardFrame>
            </div>

            {/* Vertical Steps Outside */}
            <div className="hidden xl:flex flex-col justify-center gap-6 ml-10 shrink-0">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-4 transition-all duration-300" style={{ transform: activeStep === i + 1 ? 'translateX(-8px)' : 'translateX(0)' }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter transition-colors duration-300 ${activeStep === i + 1 ? 'bg-brand text-white shadow-[0_4px_15px_-3px_rgba(15,91,56,0.4)]' : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400'}`}>
                    {step.num}
                  </div>
                  <span className={`text-sm font-bold tracking-tight transition-colors duration-300 ${activeStep === i + 1 ? 'text-[#1A2E20]' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
