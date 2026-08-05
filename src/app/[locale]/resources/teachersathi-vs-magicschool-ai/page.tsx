"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { CheckCircle2, XCircle, ShieldCheck, Monitor, BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

export default function CompetitorComparisonPage() {
  const comparisonMatrix = [
    {
      feature: "NCERT Curriculum Alignment (Classes 6-10)",
      teacherSathi: true,
      magicSchool: false,
      sahayak: "Partial"
    },
    {
      feature: "75\" Smartboard Display Native Formatting",
      teacherSathi: true,
      magicSchool: false,
      sahayak: false
    },
    {
      feature: "Bilingual Generation (Hindi + English + Marathi)",
      teacherSathi: true,
      magicSchool: "English Only",
      sahayak: "Hindi Only"
    },
    {
      feature: "DPDP Act 2023 & Indian Data Privacy",
      teacherSathi: true,
      magicSchool: false,
      sahayak: true
    },
    {
      feature: "100% Free for Individual Teachers",
      teacherSathi: true,
      magicSchool: "Freemium ($12.99/mo)",
      sahayak: true
    },
    {
      feature: "Printable Worksheets with Teacher Answer Keys",
      teacherSathi: true,
      magicSchool: true,
      sahayak: false
    },
    {
      feature: "Zero-Hardware Mobile QR Smartboard Sync",
      teacherSathi: true,
      magicSchool: false,
      sahayak: false
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
          Strategic Brand Comparison
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
          Teacher Sathi vs. US Competitors (MagicSchool AI &amp; Sahayak)
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed">
          Why 10,000+ Indian educators choose Teacher Sathi: engineered exclusively for NCERT curriculum, 75-inch classroom smart displays, and Indian data privacy standards.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-900 font-serif">Feature Breakdown Matrix</h2>
          <p className="text-xs text-gray-600 font-medium">Comparing platform capabilities for Indian government and CBSE school classrooms.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 border-b border-gray-200 text-xs font-black text-gray-700 uppercase tracking-wider">
                <th className="py-4 px-6">Capability / Feature</th>
                <th className="py-4 px-6 text-emerald-900 bg-emerald-100/80">Teacher Sathi 🇮🇳</th>
                <th className="py-4 px-6">MagicSchool AI 🇺🇸</th>
                <th className="py-4 px-6">Sahayak AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-semibold">
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="py-4 px-6 font-bold text-gray-900">{row.feature}</td>
                  <td className="py-4 px-6 bg-emerald-50/60 font-black text-emerald-900">
                    {row.teacherSathi === true ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Yes (Native)
                      </span>
                    ) : (
                      row.teacherSathi
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {row.magicSchool === true ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Yes
                      </span>
                    ) : row.magicSchool === false ? (
                      <span className="inline-flex items-center gap-1 text-rose-500">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    ) : (
                      row.magicSchool
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {row.sahayak === true ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Yes
                      </span>
                    ) : row.sahayak === false ? (
                      <span className="inline-flex items-center gap-1 text-rose-500">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    ) : (
                      row.sahayak
                    )}
                  </td>
                </tr>
              ))}
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
