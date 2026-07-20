"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  FlaskConical, 
  Calculator, 
  Globe2, 
  BookA, 
  Languages,
  Monitor,
  Network,
  HelpCircle,
  FileCheck2,
  FileText
} from "lucide-react";

export default function CurriculumCoverage() {
  const [activeClass, setActiveClass] = useState("Class 8");
  const [activeSubject, setActiveSubject] = useState("Science");

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  
  const subjects = [
    { name: "Science", icon: FlaskConical, color: "text-emerald-500", activeColor: "bg-[#1A2E20] text-white" },
    { name: "Mathematics", icon: Calculator, color: "text-blue-500", activeColor: "bg-blue-600 text-white" },
    { name: "Social Science", icon: Globe2, color: "text-orange-500", activeColor: "bg-orange-600 text-white" },
    { name: "English", icon: BookA, color: "text-purple-500", activeColor: "bg-purple-600 text-white" },
    { name: "Hindi", icon: Languages, color: "text-rose-500", activeColor: "bg-rose-600 text-white" }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#1A2E20] mb-2 tracking-tight">Built Around What You Actually Teach</h2>
        <p className="text-[#4A5D52] font-semibold text-sm">Complete NCERT coverage for Classes 6 to 10.</p>
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center">
        
        {/* Class Tabs */}
        <div className="flex flex-wrap justify-center gap-1 p-1 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full mb-6 shadow-sm">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setActiveClass(cls)}
              className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeClass === cls 
                  ? "bg-[#1A2E20] text-white shadow-md" 
                  : "text-slate-500 hover:text-[#1A2E20]"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="w-full bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row gap-10 items-center shadow-lg">
          
          {/* Subjects Grid */}
          <div className="flex gap-4 lg:w-1/3 flex-wrap justify-center">
            {subjects.map((sub) => {
              const isActive = activeSubject === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubject(sub.name)}
                  className={`w-[80px] h-[90px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm border ${
                    isActive ? `${sub.activeColor} border-transparent scale-105` : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <sub.icon className={`w-6 h-6 ${isActive ? "text-white" : sub.color}`} />
                  <span className={`text-[9px] font-bold text-center leading-tight ${isActive ? "text-white" : "text-[#4A5D52]"}`}>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* Chapter Detail Card */}
          <div className="flex-1 w-full bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <div className="text-[10px] font-extrabold text-[#4A5D52] tracking-widest uppercase mb-2">
              {activeClass} • {activeSubject}
            </div>
            <h3 className="text-2xl font-black text-[#1A2E20] leading-tight mb-6 tracking-tight">
              Conservation of Plants and Animals
            </h3>

            <p className="text-[10px] font-bold text-[#4A5D52] mb-4">Available Resources</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { label: "Lesson Presentation", icon: Monitor, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
                { label: "Mind Map", icon: Network, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                { label: "Interactive Quiz", icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
                { label: "Question Bank", icon: FileCheck2, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
                { label: "Worksheet", icon: FileText, color: "text-orange-600", bg: "bg-orange-50 border-orange-100" }
              ].map((res, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${res.bg}`}>
                  <res.icon className={`w-3.5 h-3.5 ${res.color}`} />
                  <span className={`text-[10px] font-bold ${res.color}`}>{res.label}</span>
                </div>
              ))}
            </div>

            <button className="px-6 py-3 rounded-xl bg-[#1A2E20] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-DEFAULT transition-colors shadow-md">
              Start Teaching This Chapter <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
