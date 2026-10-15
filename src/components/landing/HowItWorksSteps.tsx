"use client";

import React, { useRef, useEffect } from "react";
import { BookOpen, Sparkles, Edit3, MonitorPlay } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HowItWorksSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Draw the SVG path as we scroll
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        }
      });
    }

    // Stagger in the cards
    const cards = gsap.utils.toArray('.step-card');
    gsap.fromTo(cards, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  const steps = [
    {
      stage: "Curriculum",
      title: "Choose Chapter",
      desc: "Select your class (6 to 10), subject, and official NCERT chapter.",
      icon: BookOpen,
      offset: "translate-y-0"
    },
    {
      stage: "Synthesis",
      title: "Generate Kit",
      desc: "Instantly synthesize slides, video, mind map, quiz, and print worksheet in 30 seconds.",
      icon: Sparkles,
      offset: "translate-y-8"
    },
    {
      stage: "Tailoring",
      title: "Review & Customize",
      desc: "Adjust questions and toggle Hindi or English to match your classroom's pace.",
      icon: Edit3,
      offset: "translate-y-0"
    },
    {
      stage: "Delivery",
      title: "Teach on Smartboard",
      desc: "Open on any 75-inch smart screen, laptop, or mobile, or print physical test sheets.",
      icon: MonitorPlay,
      offset: "translate-y-8"
    }
  ];

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center relative z-20 py-16">
      <div className="text-center mb-16 relative z-10 max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          Pedagogical Workflow
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A2E20] tracking-tight">
          How Teacher Sathi Works
        </h2>
        <p className="text-[#4A5D52] font-semibold text-sm sm:text-base">
          From selecting an NCERT chapter to delivering an interactive smartboard lesson in 30 seconds.
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* The Winding Path SVG (Background) */}
        <div className="absolute top-1/2 left-0 w-full h-[200px] -translate-y-1/2 hidden lg:block pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" className="overflow-visible">
            {/* Faint background path */}
            <path 
              d="M 50,100 C 150,100 200,160 300,160 C 400,160 450,40 550,40 C 650,40 700,160 800,160 C 900,160 950,100 1000,100" 
              fill="none" 
              stroke="rgba(15,91,56,0.1)" 
              strokeWidth="4" 
              strokeDasharray="8 8" 
            />
            {/* Animated drawing path */}
            <path 
              ref={pathRef}
              d="M 50,100 C 150,100 200,160 300,160 C 400,160 450,40 550,40 C 650,40 700,160 800,160 C 900,160 950,100 1000,100" 
              fill="none" 
              stroke="#0F5B38" 
              strokeWidth="4"
              className="drop-shadow-[0_0_10px_rgba(15,91,56,0.5)]"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`step-card bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-200/90 p-8 flex flex-col justify-between relative group transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(15,91,56,0.25)] shadow-md lg:${step.offset}`}
            >
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                    {step.stage}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <step.icon className="w-5 h-5 text-[#0F5B38]" />
                  </div>
                </div>

                <h3 className="font-black text-[#1A2E20] text-lg tracking-tight group-hover:text-[#0F5B38] transition-colors">
                  {step.title}
                </h3>
              </div>

              <p className="text-[#4A5D52] text-xs font-semibold leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
