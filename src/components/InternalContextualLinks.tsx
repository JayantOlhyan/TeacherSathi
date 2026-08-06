import React from "react";
import { Link } from "@/i18n/routing";
import { BookOpen, Sparkles, FileText, HelpCircle, ArrowRight } from "lucide-react";

interface ContextualLinkProps {
  grade?: string;
  subject?: string;
  chapterTitle?: string;
}

export default function InternalContextualLinks({ grade = "Class 8", subject = "Science" }: ContextualLinkProps) {

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm my-8 space-y-4">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Contextual AI Tools &amp; Related NCERT Resources</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link
          href={`/resources/lesson-plans`}
          className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 group-hover:text-emerald-900">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> AI Lesson Plan Generator
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Generate NEP 2020 competency lesson plans for {subject}.</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-2">
            Open Generator <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href={`/resources/quiz-generator`}
          className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 group-hover:text-emerald-900">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> CBSE Quiz &amp; Worksheet Creator
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Instant printable PDF question papers with answer keys.</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-2">
            Create Test <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href={`/resources/mind-maps`}
          className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 group-hover:text-emerald-900">
              <FileText className="w-3.5 h-3.5 text-teal-600" /> Interactive Bilingual Mind Maps
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Visual Devanagari Hindi &amp; English revision maps for {grade}.</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-2">
            View Mind Maps <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}
