"use client";

import React, { useState } from "react";
import { Download, Sparkles, Eye, X } from "lucide-react";

export default function SampleResourcesExplorer() {
  const [activeTab, setActiveTab] = useState("Presentation");
  const [previewKit, setPreviewKit] = useState<string | null>(null);
  
  const tabs = ["Presentation", "Video", "Mind Map", "Quiz", "Question Bank", "Worksheet"];

  const sampleKits = [
    {
      id: "class-10-science",
      title: "Class 10 Science: Light Reflection & Refraction",
      grade: "Class 10",
      subject: "Science",
      type: "Complete 75\" Smartboard Pack",
      size: "2.4 MB PDF",
      summary: "Includes 12 HD smartboard slides, bilingual Devanagari mind map, 10 MCQ quiz bank with answer keys, and 1 printable worksheet."
    },
    {
      id: "class-8-science",
      title: "Class 8 Science: Cell - Structure & Functions",
      grade: "Class 8",
      subject: "Science",
      type: "NEP 2020 Aligned Kit",
      size: "1.8 MB PDF",
      summary: "Includes plant vs animal cell 3D diagram slides, short/long question bank, and bilingual Hindi notes."
    },
    {
      id: "class-9-maths",
      title: "Class 9 Mathematics: Real Numbers & Polynomials",
      grade: "Class 9",
      subject: "Mathematics",
      type: "CBSE Exam Preparation Kit",
      size: "2.1 MB PDF",
      summary: "Includes step-by-step formula matrices, 15 practice test questions, and smart classroom problem slates."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-8 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
          Free Instant Downloads
        </span>
        <h2 className="text-3xl font-black text-[#1A2E20] tracking-tight">Explore &amp; Download Sample NCERT Kits</h2>
        <p className="text-xs text-slate-600 font-semibold max-w-xl mx-auto">
          Test drive our pre-formatted 75-inch smartboard packs and printable CBSE worksheets before signing up.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl sm:rounded-full mb-8 shadow-sm max-w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 sm:px-6 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === tab 
                ? "bg-[#14532D] text-white shadow-md" 
                : "text-gray-700 hover:text-[#14532D] hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3 Downloadable Sample Kit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
        {sampleKits.map((kit) => (
          <div key={kit.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                  {kit.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{kit.size}</span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">{kit.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{kit.summary}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setPreviewKit(kit.title)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => alert(`Downloading Sample PDF: ${kit.title}`)}
                className="flex-1 py-2.5 px-3 bg-[#14532D] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setPreviewKit(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sample PDF Preview</span>
            </div>

            <h3 className="text-lg font-black text-slate-900">{previewKit}</h3>
            
            <div className="bg-slate-900 text-emerald-300 p-6 rounded-2xl text-xs space-y-3 font-mono border border-slate-800">
              <p className="text-white font-bold text-sm">[Sample Smartboard Slide Output]</p>
              <p>✔ Bilingual Devanagari Hindi &amp; English Typography</p>
              <p>✔ Pre-formatted for 75-inch smart screens</p>
              <p>✔ Includes MCQ Quiz with teacher answer keys</p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button 
                onClick={() => setPreviewKit(null)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert(`Downloading ${previewKit}!`);
                  setPreviewKit(null);
                }}
                className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
