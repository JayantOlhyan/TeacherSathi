"use client";

import React from "react";
import { Heart, ShieldCheck, BookOpen, Monitor } from "lucide-react";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

export default function AboutUsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 px-4 sm:px-6 font-sans text-gray-900">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#14532D] to-[#15803D] text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-black tracking-widest uppercase backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          Empowering Indian Educators
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
          Built for Government School Teachers & NCERT Curriculum
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
          Teacher Sathi was designed with a single mission: to reduce lesson preparation time from 3 hours to 30 seconds for over 10,000+ Indian educators teaching in CBSE, Kendriya Vidyalaya (KVS), Jawahar Navodaya (JNV), and State Board classrooms.
        </p>
      </div>

      {/* Core Pedagogical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900 font-serif">100% NCERT & NEP 2020 Aligned</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Every lesson plan, mind map, interactive presentation, and quiz question is indexed directly to NCERT Class 6 to 10 textbook chapters.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Monitor className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900 font-serif">75&quot; Smartboard Native</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Designed specifically for 75-inch interactive displays (Samsung, Smart, ViewSonic) with high-contrast text and zero-delay QR code session management.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900 font-serif">DPDP Act 2023 Compliant</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Built with strict data privacy and zero-trust security architecture ensuring student and teacher data remains 100% safe and encrypted.
          </p>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <div className="text-3xl font-black text-emerald-800 font-serif">10,000+</div>
          <div className="text-xs font-bold text-emerald-700 uppercase mt-1">Active Educators</div>
        </div>
        <div>
          <div className="text-3xl font-black text-emerald-800 font-serif">250+</div>
          <div className="text-xs font-bold text-emerald-700 uppercase mt-1">NCERT Chapters</div>
        </div>
        <div>
          <div className="text-3xl font-black text-emerald-800 font-serif">500,000+</div>
          <div className="text-xs font-bold text-emerald-700 uppercase mt-1">Kits Generated</div>
        </div>
        <div>
          <div className="text-3xl font-black text-emerald-800 font-serif">100%</div>
          <div className="text-xs font-bold text-emerald-700 uppercase mt-1">Free for Individual Teachers</div>
        </div>
      </div>

      <EducatorFAQAccordion />
    </div>
  );
}
