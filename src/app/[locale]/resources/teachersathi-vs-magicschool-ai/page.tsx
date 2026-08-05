"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ShieldCheck, Monitor, BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

export default function CompetitorComparisonPage() {
  const fullLandscapeMatrix = [
    {
      platform: "MagicSchool AI 🇺🇸",
      targetMarket: "Global K-12 Teachers",
      capability: "80+ AI tools, LMS sync",
      pricing: "Freemium ($13/mo Pro)",
      vulnerability: "Lacks native NCERT 75\" Smart Screen focus."
    },
    {
      platform: "Eduaide.AI 🇺🇸",
      targetMarket: "Global K-12 Teachers",
      capability: "Curriculum design & games",
      pricing: "Freemium ($6/mo Pro)",
      vulnerability: "No bilingual Hindi/English NCERT mapping."
    },
    {
      platform: "Sahayak AI 🇮🇳",
      targetMarket: "Indian Teachers",
      capability: "Multi-grade rural focus",
      pricing: "Free / Open Access",
      vulnerability: "Basic UI; lacks full 6-part Teaching Kit."
    },
    {
      platform: "Khanmigo 🇺🇸",
      targetMarket: "US / Global Educators",
      capability: "Khan Academy integration",
      pricing: "Free for US / Paid",
      vulnerability: "Not structured for Indian State Boards."
    },
    {
      platform: "CrazyGoldFish AI 🇮🇳",
      targetMarket: "Indian CBSE Schools",
      capability: "Minute-by-minute scripts",
      pricing: "Paid B2B SaaS",
      vulnerability: "Expensive B2B sales cycle; non-instant."
    },
    {
      platform: "TeacherSathi 🇮🇳",
      targetMarket: "Indian Govt & CBSE Teachers",
      capability: "NCERT 75\" Smart Screen Kits + 6-Part AI Tools",
      pricing: "100% Free for Individual Teachers",
      vulnerability: "Engineered specifically for Indian Educators!"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 px-4 sm:px-6 font-sans text-gray-900">
      
      {/* Back Link */}
      <Link href="/resources" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950">
        <ArrowLeft className="w-4 h-4" /> Back to Resources Hub
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#14532D] to-[#15803D] text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-black tracking-widest uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          Competitive Intelligence &amp; Industry Benchmark
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
          Teacher Sathi vs Global AI EdTech Platforms
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed">
          Comparing Teacher Sathi against MagicSchool AI, Eduaide, Sahayak, Khanmigo, and CrazyGoldFish. Engineered exclusively for NCERT curriculum, 75-inch smartboard displays, and Indian data privacy standards.
        </p>
      </div>

      {/* Full Competitive Landscape Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-900 font-serif">Competitive Landscape Matrix</h2>
          <p className="text-xs text-gray-600 font-medium">Platform positioning breakdown for Indian educators &amp; school directors.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 border-b border-gray-200 text-xs font-black text-gray-700 uppercase tracking-wider">
                <th className="py-4 px-6">Platform</th>
                <th className="py-4 px-6">Target Market</th>
                <th className="py-4 px-6">Primary Capability</th>
                <th className="py-4 px-6">Pricing Strategy</th>
                <th className="py-4 px-6">Vulnerability vs. Teacher Sathi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-semibold">
              {fullLandscapeMatrix.map((row, idx) => {
                const isTeacherSathi = row.platform.includes("TeacherSathi");
                return (
                  <tr key={idx} className={isTeacherSathi ? "bg-emerald-50/90 font-black border-l-4 border-emerald-600" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-4 px-6 font-extrabold text-gray-900">{row.platform}</td>
                    <td className="py-4 px-6 text-gray-700">{row.targetMarket}</td>
                    <td className="py-4 px-6 text-gray-800">{row.capability}</td>
                    <td className="py-4 px-6 text-gray-900 font-bold">{row.pricing}</td>
                    <td className={`py-4 px-6 ${isTeacherSathi ? "text-emerald-900 font-black" : "text-amber-800"}`}>
                      {row.vulnerability}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Differentiators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Monitor className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900 font-serif">75&quot; Smartboard Optimization</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            While US platforms generate plain text for laptop screens, Teacher Sathi formats presentation slide decks with high-contrast text and zero-delay QR session transfers designed specifically for 75-inch classroom displays.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900 font-serif">Deep NCERT Integration</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Indexed chapter by chapter to NCERT Classes 6 to 10 textbooks for Science, Maths, Social Science, Hindi, and English. No manual prompt engineering required.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900 font-serif">DPDP Act 2023 &amp; 100% Free</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            100% free for individual Indian teachers with zero credit card requirements and full Indian Data Protection Act compliance.
          </p>
        </div>
      </div>

      <EducatorFAQAccordion />
    </div>
  );
}
