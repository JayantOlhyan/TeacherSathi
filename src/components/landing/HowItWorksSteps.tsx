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
      num: "01",
      title: "Choose",
      desc: "Select your class, subject and NCERT chapter.",
      icon: BookOpen,
      offset: "translate-y-0"
    },
    {
      num: "02",
      title: "Generate",
      desc: "Instantly create all types of teaching resources.",
      icon: Sparkles,
      offset: "translate-y-12"
    },
    {
      num: "03",
      title: "Review & Edit",
      desc: "Customize content to match your teaching style.",
      icon: Edit3,
      offset: "translate-y-0"
    },
    {
      num: "04",
      title: "Teach",
      desc: "Open on smart screen, engage, assess, and track results.",
      icon: MonitorPlay,
      offset: "translate-y-12"
    }
  ];

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center relative z-20 py-12">
      <div className="text-center mb-24 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-black text-[#1A2E20] mb-4 tracking-tight">
          How TeacherSathi Works
        </h2>
        <p className="text-[#4A5D52] font-semibold text-lg max-w-md mx-auto">
          From selecting a chapter to delivering an unforgettable lesson in minutes.
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
              className={`step-card bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 p-8 flex flex-col relative group transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_-15px_rgba(15,91,56,0.3)] shadow-lg shadow-brand-900/5 lg:${step.offset}`}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-full"></div>
              
              <div className="flex justify-between items-start mb-8">
                <span className="text-5xl font-black text-[#1A2E20]/10 tracking-tighter group-hover:text-brand-DEFAULT/20 transition-colors duration-500">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                  <step.icon className="w-6 h-6 text-brand-DEFAULT" />
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="font-black text-[#1A2E20] text-xl mb-3 tracking-tight group-hover:text-brand-DEFAULT transition-colors">
                  {step.title}
                </h3>
                <p className="text-[#4A5D52] text-sm font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
