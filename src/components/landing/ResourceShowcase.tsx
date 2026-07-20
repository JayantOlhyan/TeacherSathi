"use client";

import React, { useState } from "react";
import { 
  Presentation, 
  Video, 
  Network, 
  HelpCircle, 
  FileCheck2, 
  FileText, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

export default function ResourceShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Presentation", icon: Presentation },
    { id: 1, label: "Video", icon: Video },
    { id: 2, label: "Mind Map", icon: Network },
    { id: 3, label: "Quiz", icon: HelpCircle },
    { id: 4, label: "Question Bank", icon: FileCheck2 },
    { id: 5, label: "Worksheet", icon: FileText },
  ];

  return (
    <section id="resources" className="w-full py-16 sm:py-24 bg-[#F6F4EE] px-4 sm:px-6 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Explore Sample Resources
          </h2>
          <p className="text-sm sm:text-base text-ink-3 font-medium">
            See the quality of resources TeacherSathi creates for you.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-x-auto max-w-full gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-brand-DEFAULT text-white shadow-md shadow-brand-DEFAULT/20"
                      : "text-ink-3 hover:text-brand-DEFAULT hover:bg-brand-surface/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Resource Cards Container matching reference image */}
        <div className="relative group">
          
          {/* Scrollable Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            
            {/* Card 1: Presentation Cover */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-3 shadow-card hover:border-brand-DEFAULT transition-all flex flex-col justify-between">
              <div className="aspect-[4/3] rounded-xl bg-emerald-950 p-4 text-white flex flex-col justify-between relative overflow-hidden">
                <span className="text-[10px] font-extrabold uppercase text-emerald-300">CLASS 8 • SCIENCE</span>
                <div>
                  <h4 className="font-black text-sm text-white leading-tight">Conservation of Plants and Animals</h4>
                  <p className="text-[10px] text-emerald-200 mt-1">✓ NCERT Aligned</p>
                </div>
              </div>
              <div className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Cover Title Slide</span>
                <span className="text-brand-DEFAULT text-[11px]">01 Slide</span>
              </div>
            </div>

            {/* Card 2: Why Conservation Matters */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-3 shadow-card hover:border-brand-DEFAULT transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-ink">Why Conservation Matters?</h4>
                <ul className="space-y-1 text-[11px] text-ink-3 font-medium">
                  <li className="flex items-start gap-1"><span className="text-brand-DEFAULT font-bold">•</span> Maintains ecological balance</li>
                  <li className="flex items-start gap-1"><span className="text-brand-DEFAULT font-bold">•</span> Protects biodiversity</li>
                  <li className="flex items-start gap-1"><span className="text-brand-DEFAULT font-bold">•</span> Ensures resources for future generations</li>
                </ul>
              </div>
              <div className="h-16 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-xs font-bold text-brand-DEFAULT">
                🌱 Seedling Conservation
              </div>
            </div>

            {/* Card 3: Food Chain Diagram */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-3 shadow-card hover:border-brand-DEFAULT transition-all flex flex-col justify-between">
              <h4 className="font-extrabold text-xs text-ink">Food Chain in a Forest</h4>
              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-slate-200 space-y-2 text-center">
                <div className="flex items-center justify-between text-[11px] font-bold text-ink">
                  <div>
                    <span className="text-lg">🌿</span>
                    <p className="text-[9px] text-ink-4">Plants (Producers)</p>
                  </div>
                  <span>→</span>
                  <div>
                    <span className="text-lg">🦌</span>
                    <p className="text-[9px] text-ink-4">Deer (Consumers)</p>
                  </div>
                  <span>→</span>
                  <div>
                    <span className="text-lg">🐅</span>
                    <p className="text-[9px] text-ink-4">Tiger (Top Consumer)</p>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-DEFAULT block text-center">Interactive Concept Diagram</span>
            </div>

            {/* Card 4: MCQ Quiz Card */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-2 shadow-card hover:border-brand-DEFAULT transition-all flex flex-col justify-between text-xs">
              <div className="space-y-1.5">
                <p className="font-bold text-ink text-[11px]">Which of the following is a major cause of deforestation?</p>
                <div className="space-y-1 text-[10px]">
                  <div className="p-1.5 rounded bg-slate-50 border">A. Afforestation</div>
                  <div className="p-1.5 rounded bg-emerald-50 border border-emerald-500 text-brand-dark font-extrabold flex justify-between items-center">
                    <span>B. Urbanization</span> <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border">C. Forest fires</div>
                  <div className="p-1.5 rounded bg-slate-50 border">D. Overgrazing</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-DEFAULT">Instant Smartboard Poll</span>
            </div>

            {/* Card 5: Short Answer Questions */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-2 shadow-card hover:border-brand-DEFAULT transition-all flex flex-col justify-between text-xs">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-ink text-[11px]">Short Answer Questions</h4>
                <ol className="space-y-1 text-[10px] text-ink-3 font-medium list-decimal list-inside">
                  <li>What is biodiversity?</li>
                  <li>Why should we conserve our forests?</li>
                  <li>What steps can we take to protect wildlife?</li>
                </ol>
              </div>
              <span className="text-[11px] font-bold text-brand-DEFAULT">NCERT Model Answers Included</span>
            </div>

          </div>

          {/* Bottom Action Link */}
          <div className="pt-4 text-center">
            <a 
              href="#curriculum"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-brand-DEFAULT hover:text-brand-600 transition-colors"
            >
              View all resources <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
