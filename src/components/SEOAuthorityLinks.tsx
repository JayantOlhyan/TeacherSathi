"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ExternalLink, BookOpen, Sparkles, Award, ShieldCheck, ArrowRight } from "lucide-react";

export default function SEOAuthorityLinks() {
  return (
    <section aria-labelledby="authority-resources-heading" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-8 border-t border-gray-200 dark:border-white/10">
      <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] dark:from-[#0D3820]/40 dark:to-[#0A2A17] rounded-3xl p-6 sm:p-10 border border-[#AEDCBA]/40 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Internal Linking: Related AI Teaching Tools */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#14532D] dark:text-emerald-400 font-extrabold text-lg sm:text-xl">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <h2 id="authority-resources-heading">Explore Related AI Teaching Tools</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Supercharge your classroom productivity with TeacherSathi&apos;s interconnected suite of NCERT & CBSE aligned AI utilities designed specifically for Indian educators.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/resources/lesson-plans"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#14532D] dark:hover:border-emerald-500 transition-all shadow-2xs hover:shadow-md"
              >
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-[#14532D] dark:group-hover:text-emerald-400">AI Lesson Plans</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/resources/ncert"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#14532D] dark:hover:border-emerald-500 transition-all shadow-2xs hover:shadow-md"
              >
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-[#14532D] dark:group-hover:text-emerald-400">NCERT Solutions</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/resources/mind-maps"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#14532D] dark:hover:border-emerald-500 transition-all shadow-2xs hover:shadow-md"
              >
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-[#14532D] dark:group-hover:text-emerald-400">Interactive Mind Maps</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/resources/quiz-generator"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#14532D] dark:hover:border-emerald-500 transition-all shadow-2xs hover:shadow-md"
              >
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-[#14532D] dark:group-hover:text-emerald-400">Quiz Generator</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/content/class-10"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#14532D] dark:hover:border-emerald-500 transition-all shadow-2xs hover:shadow-md"
              >
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-[#14532D] dark:group-hover:text-emerald-400">Class 10 Content Hub</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/dashboard/classes"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#14532D] dark:hover:border-emerald-500 transition-all shadow-2xs hover:shadow-md"
              >
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-[#14532D] dark:group-hover:text-emerald-400">Smart Classroom CRM</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Outbound Authority Links: Government & Educational Portals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#14532D] dark:text-emerald-400 font-extrabold text-lg sm:text-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h2>Official Education Authority Portals</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              TeacherSathi strictly aligns its academic frameworks with national educational benchmarks. Access credible curriculum standards and reference material directly from government authority bodies:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <li>
                <a
                  href="https://ncert.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all shadow-2xs hover:shadow-md"
                >
                  <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" /> NCERT Official
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://cbseacademic.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all shadow-2xs hover:shadow-md"
                >
                  <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-500" /> CBSE Academic
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://diksha.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all shadow-2xs hover:shadow-md"
                >
                  <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> DIKSHA Portal
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.education.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all shadow-2xs hover:shadow-md"
                >
                  <span className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Ministry of Ed.
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
