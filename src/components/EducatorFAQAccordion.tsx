"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Sparkles, BookOpen, Award } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function EducatorFAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does TeacherSathi ensure CBSE and NCERT curriculum compliance?",
      answer: "TeacherSathi is explicitly fine-tuned on the latest National Education Policy (NEP 2020) frameworks, National Curriculum Framework (NCF), and official NCERT textbooks from Class 1 to 12. Whether you are generating 45-minute pedagogical lesson plans, competency-based assessment quizzes, or bilingual concept mind maps, our AI teaching assistant rigorously verifies learning outcomes against official CBSE academic guidelines, ensuring 100% classroom readiness without manual re-formatting.",
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    },
    {
      question: "Is school and student data protected under the Digital Personal Data Protection (DPDP) Act?",
      answer: "Absolutely. We uphold institutional-grade security protocols designed specifically for Indian educational institutions. TeacherSathi operates on strict zero-data-retention AI models where your classroom prompts, student assessment lists, and generated worksheets are encrypted end-to-end. We never train public artificial intelligence models on your proprietary lesson plans or school records, guaranteeing full compliance with India's DPDP Act and international student privacy standards.",
      icon: <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    },
    {
      question: "Can I use generated mind maps and lesson plans directly on classroom smart boards?",
      answer: "Yes! TeacherSathi is built from the ground up for modern smart classrooms and interactive flat panels (IFPs). Our interactive mind map generator produces high-contrast, stylus-pen compatible visual diagrams that teachers can project, zoom, and annotate in real time. Furthermore, our one-click bilingual toggle instantly switches complex scientific terminology between Hindi (with Devnagari script annotations) and English without losing layout formatting.",
      icon: <Sparkles className="w-5 h-5 text-amber-500" />
    },
    {
      question: "How much administrative planning time does TeacherSathi save Indian educators?",
      answer: "According to survey feedback from over 10,000 active CBSE and state board teachers across India, TeacherSathi reduces routine lesson planning, worksheet drafting, and exam paper creation time by an average of 72%. Tasks that traditionally consumed 3 to 4 hours every Sunday evening—such as formatting Bloom's taxonomy case-study questions or translating lecture notes—are now accomplished in under 60 seconds with our automated educational utilities.",
      icon: <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 sm:px-6">
      <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] dark:from-[#0D3820]/30 dark:to-[#0A2A17] rounded-3xl p-6 sm:p-10 border border-[#AEDCBA]/40 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-[#14532D] dark:text-emerald-400 border border-emerald-300/50">
            <Sparkles className="w-3.5 h-3.5" /> Educator Knowledge Hub & FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1C2B1C] dark:text-white tracking-tight">
            Designed for Indian Classrooms & Trusted by Teachers
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore how our AI teaching assistant streamlines CBSE lesson planning, safeguards institutional privacy, and enhances bilingual K-12 pedagogy.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-black/30 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#14532D] dark:hover:border-emerald-500/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 shrink-0">
                      {faq.icon}
                    </div>
                    <span className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-[#14532D] dark:text-emerald-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
