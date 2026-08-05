"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function SampleResourcesExplorer() {
  const [activeTab, setActiveTab] = useState("Presentation");
  
  const tabs = ["Presentation", "Video", "Mind Map", "Quiz", "Question Bank", "Worksheet"];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-[#1A2E20] mb-2 tracking-tight">Explore Sample Resources</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-1 p-1 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full mb-10 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === tab 
                ? "bg-[#1A2E20] text-white shadow-md" 
                : "text-slate-500 hover:text-[#1A2E20]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-7xl mb-8">
        
        {/* Card 1: Slide */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:-translate-y-1 transition-transform">
          <div className="text-[9px] font-extrabold text-[#4A5D52] tracking-widest uppercase mb-4">
            Slide 04
          </div>
          <h3 className="text-lg font-black text-[#1A2E20] leading-tight mb-4 tracking-tight">
            Why Conservation<br/>Matters?
          </h3>
          <ul className="text-[10px] text-[#4A5D52] font-semibold space-y-3 pl-3 list-disc">
            <li>Maintain ecological balance</li>
            <li>Protect biodiversity</li>
            <li>Ensure resources for future generations</li>
          </ul>
        </div>

        {/* Card 2: Food Chain */}
        <div className="bg-[#FAFAFA] rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
          <h3 className="text-sm font-black text-[#1A2E20] mb-6">Food Chain in a Forest</h3>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 mb-2 border border-emerald-200" />
              <div className="text-[8px] font-bold text-[#4A5D52]">Plants<br/>(Producers)</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 mb-2 border border-amber-200" />
              <div className="text-[8px] font-bold text-[#4A5D52]">Deer<br/>(Consumers)</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 mb-2 border border-orange-200" />
              <div className="text-[8px] font-bold text-[#4A5D52]">Tiger<br/>(Top Consumers)</div>
            </div>
          </div>
        </div>

        {/* Card 3: Quiz */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:-translate-y-1 transition-transform">
          <h3 className="text-xs font-black text-[#1A2E20] leading-tight mb-4">
            Which of the following is a major cause of deforestation?
          </h3>
          <div className="space-y-2">
            <div className="text-[9px] font-semibold text-slate-500 py-1.5 px-2">A. Afforestation</div>
            <div className="text-[9px] font-bold text-emerald-800 py-1.5 px-2 bg-emerald-50 border border-emerald-200 rounded flex justify-between items-center">
              B. Urbanization <Check className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="text-[9px] font-semibold text-slate-500 py-1.5 px-2">C. Forest fires</div>
            <div className="text-[9px] font-semibold text-slate-500 py-1.5 px-2">D. Overgrazing</div>
          </div>
        </div>

        {/* Card 4: Short Answer */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:-translate-y-1 transition-transform">
          <h3 className="text-xs font-black text-[#1A2E20] leading-tight mb-4">
            Short Answer Question
          </h3>
          <ol className="text-[10px] text-[#4A5D52] font-semibold space-y-4 list-decimal pl-3">
            <li>What is biodiversity?</li>
            <li>Why should we conserve our forests?</li>
            <li>What steps can we take to protect wildlife?</li>
          </ol>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => alert("Downloading Sample NCERT Class 8 Science Complete Kit PDF!")}
          className="bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>Download Free Class 8 Science Kit (PDF) 📥</span>
        </button>
        <button
          onClick={() => alert("Downloading Sample NCERT Class 10 Maths Revision Kit PDF!")}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs px-6 py-3 rounded-full border border-emerald-300 transition-all cursor-pointer"
        >
          <span>Download Free Class 10 Maths Kit (PDF) 📥</span>
        </button>
      </div>
    </div>
  );
}
