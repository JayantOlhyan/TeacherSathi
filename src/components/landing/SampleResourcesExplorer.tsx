"use client";

import React, { useState } from "react";
import { 
  Download, 
  Sparkles, 
  Eye, 
  X, 
  Monitor, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Printer
} from "lucide-react";

export default function SampleResourcesExplorer() {
  const [activeTab, setActiveTab] = useState("Presentation");
  const [previewKit, setPreviewKit] = useState<typeof sampleKits[0] | null>(null);
  
  const tabs = [
    { id: "Presentation", label: "75\" Presentation", icon: Monitor },
    { id: "Video", label: "Explainer Video", icon: Layers },
    { id: "Mind Map", label: "Bilingual Mind Map", icon: Sparkles },
    { id: "Quiz", label: "Quiz Bank", icon: CheckCircle2 },
    { id: "Question Bank", label: "CBSE Question Bank", icon: BookOpen },
    { id: "Worksheet", label: "Printable Worksheet", icon: Printer }
  ];

  const sampleKits = [
    {
      id: "class-10-science",
      title: "Class 10 Science: Light Reflection & Refraction",
      titleHi: "प्रकाश: परावर्तन तथा अपवर्तन",
      grade: "Class 10",
      subject: "Science",
      subjectColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accentBg: "from-emerald-900 via-[#0B3822] to-emerald-950",
      visualDiagram: "Convex & Concave Ray Optics • Focal Point 2F",
      type: "Complete 75\" Smartboard Pack",
      size: "2.4 MB &bull; PDF + PPTX",
      summary: "Includes 12 HD smartboard slides, bilingual Devanagari mind map, 10 MCQ quiz bank with answer keys, and 1 printable worksheet.",
      highlights: [
        "12 HD 75-inch smartboard slides with ray diagrams",
        "Bilingual Hindi & English concept definitions",
        "10 MCQ quiz bank with teacher explanation keys",
        "CBSE A4 printable worksheet with marking rubric"
      ]
    },
    {
      id: "class-8-science",
      title: "Class 8 Science: Cell - Structure & Functions",
      titleHi: "कोशिका: संरचना एवं प्रकार्य",
      grade: "Class 8",
      subject: "Science",
      subjectColor: "bg-teal-50 text-teal-800 border-teal-200",
      accentBg: "from-teal-900 via-[#0C3B34] to-teal-950",
      visualDiagram: "Plant vs Animal Cell 3D Organelles • Nucleus & Plastids",
      type: "NEP 2020 Aligned Kit",
      size: "1.8 MB &bull; PDF + PPTX",
      summary: "Includes plant vs animal cell 3D diagram slides, short/long question bank, and bilingual Hindi notes.",
      highlights: [
        "3D comparative cell structure visual slates",
        "Bilingual Hindi notes on cell organelles",
        "Diagram labeling activity for classroom smartboards",
        "15 Competency-based practice questions"
      ]
    },
    {
      id: "class-9-maths",
      title: "Class 9 Mathematics: Real Numbers & Polynomials",
      titleHi: "वास्तविक संख्याएँ एवं बहुपद",
      grade: "Class 9",
      subject: "Mathematics",
      subjectColor: "bg-blue-50 text-blue-800 border-blue-200",
      accentBg: "from-blue-900 via-[#0B2545] to-slate-950",
      visualDiagram: "√2 on Number Line • Remainder & Factor Theorem",
      type: "CBSE Exam Preparation Kit",
      size: "2.1 MB &bull; PDF + PPTX",
      summary: "Includes step-by-step formula matrices, 15 practice test questions, and smart classroom problem slates.",
      highlights: [
        "Step-by-step proof breakdown for classroom boards",
        "Formula matrix and factorization shortcuts",
        "15 Board-standard practice test questions",
        "Print-ready homework sheets with QR solutions"
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      
      {/* Section Header */}
      <div className="text-center mb-8 space-y-2.5 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Free Instant Downloads &bull; No Sign-up Required
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#132A1C] tracking-tight">
          Explore &amp; Download Sample NCERT Kits
        </h2>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed">
          Test drive our pre-formatted 75-inch smartboard packs, bilingual mind maps, and printable CBSE worksheets.
        </p>
      </div>

      {/* Modern Segmented Tab Bar */}
      <div className="flex flex-wrap justify-center gap-1 p-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-full mb-10 shadow-sm max-w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id 
                ? "bg-[#0F5B38] text-white shadow-md" 
                : "text-slate-600 hover:text-[#0F5B38] hover:bg-slate-100"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3 Downloadable Sample Kit Cards with Visual Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
        {sampleKits.map((kit) => (
          <div 
            key={kit.id} 
            className="group bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Visual Thumbnail Header Mockup */}
            <div className={`relative h-44 bg-gradient-to-br ${kit.accentBg} p-4 text-white flex flex-col justify-between overflow-hidden border-b border-white/10`}>
              {/* Background Geometric Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                  backgroundSize: "16px 16px"
                }}
              />

              {/* Top Badge Row */}
              <div className="relative z-10 flex justify-between items-center">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                  {kit.grade} &bull; {kit.subject}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-black/40 px-2 py-0.5 rounded font-mono">
                  75&quot; Native IFP
                </span>
              </div>

              {/* Center Diagram Graphic Simulation */}
              <div className="relative z-10 my-auto text-center space-y-1">
                <div className="inline-block px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-[11px] font-extrabold text-amber-200 shadow-sm">
                  ⚡ {kit.visualDiagram}
                </div>
                <p className="text-[11px] font-bold text-white/80">
                  {kit.titleHi}
                </p>
              </div>

              {/* Bottom Specs Bar */}
              <div className="relative z-10 flex justify-between items-center text-[10px] font-bold text-white/70 pt-1 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-emerald-400" /> 12 4K Slides
                </span>
                <span dangerouslySetInnerHTML={{ __html: kit.size }} />
              </div>
            </div>

            {/* Card Content & Features */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${kit.subjectColor}`}>
                    {kit.type}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Bilingual
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-[#0F5B38] transition-colors">
                    {kit.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                    {kit.summary}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="space-y-1.5 pt-1">
                  {kit.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setPreviewKit(kit)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" /> Live Preview
                </button>
                <button
                  onClick={() => alert(`Downloading Sample Kit for ${kit.title}!`)}
                  className="flex-1 py-2.5 px-3 bg-[#0F5B38] hover:bg-[#0C4B2E] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Download Pack
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Sample Preview Modal */}
      {previewKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-5 relative shadow-2xl border border-slate-200">
            {/* Close Button */}
            <button 
              onClick={() => setPreviewKit(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  {previewKit.grade} &bull; {previewKit.subject}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  75&quot; Smartboard Sample Pack
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {previewKit.title}
              </h3>
              <p className="text-xs font-bold text-emerald-800">
                {previewKit.titleHi}
              </p>
            </div>

            {/* Mock Smartboard Preview Frame */}
            <div className="bg-[#0B1E14] text-white rounded-2xl p-5 border border-emerald-900 shadow-inner space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-emerald-900 pb-2">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  75&quot; Display Slide Deck Preview
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                  Slide 1 of 12 &bull; 4K UHD
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">
                    Core Teaching Concept
                  </span>
                  <p className="text-xs font-semibold text-white">
                    {previewKit.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <p className="font-bold text-emerald-300">✔ Bilingual Hindi-English</p>
                    <p className="text-slate-300 text-[10px]">Dual language labels for CBSE &amp; State schools</p>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <p className="font-bold text-emerald-300">✔ Teacher Answer Key</p>
                    <p className="text-slate-300 text-[10px]">Instant step-by-step scoring keys for quizzes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-slate-500 font-bold">
                Format: 75&quot; PPTX + Printable PDF (A4)
              </span>
              <div className="flex gap-2.5 w-full sm:w-auto">
                <button 
                  onClick={() => setPreviewKit(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert(`Downloading Complete Pack for ${previewKit.title}!`);
                    setPreviewKit(null);
                  }}
                  className="px-5 py-2.5 bg-[#0F5B38] hover:bg-[#0C4B2E] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" /> Download Complete Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
