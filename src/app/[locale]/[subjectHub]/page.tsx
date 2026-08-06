import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";
import { BookOpen, ArrowRight, HelpCircle } from "lucide-react";

interface HubParams {
  subjectHub: string;
  locale: string;
}

// Helper to parse slugs like 'ncert-class-8-science'
function parseSubjectHubSlug(slug: string) {
  const match = slug.match(/^ncert-class-(\d+)-(.+)$/i);
  if (!match) return null;
  const gradeNum = match[1]; // e.g. "8"
  const subjectSlug = match[2].toLowerCase(); // e.g. "science" or "social-science"

  const className = `Class ${gradeNum}`;
  const ncertClass = NCERT_SYLLABUS[className];
  if (!ncertClass) return null;

  const matchedSubjectKey = Object.keys(ncertClass).find(
    k => k.toLowerCase().replace(/[-\s]/g, "") === subjectSlug.replace(/[-\s]/g, "")
  );

  if (!matchedSubjectKey) return null;

  return {
    className,
    gradeNum,
    subjectName: matchedSubjectKey,
    subjectSlug,
    chapters: ncertClass[matchedSubjectKey],
  };
}

export async function generateStaticParams() {
  const params: Array<{ subjectHub: string }> = [];

  Object.keys(NCERT_SYLLABUS).forEach(className => {
    const gradeNum = className.replace(/Class\s*/i, '');
    const subjects = NCERT_SYLLABUS[className];

    Object.keys(subjects).forEach(subjectName => {
      const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-');
      params.push({ subjectHub: `ncert-class-${gradeNum}-${subjectSlug}` });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: HubParams }): Promise<Metadata> {
  const info = parseSubjectHubSlug(params.subjectHub);
  if (!info) return {};

  const title = `NCERT ${info.className} ${info.subjectName} AI Lesson Plans & Worksheets | TeacherSathi`;
  const description = `Free NCERT ${info.className} ${info.subjectName} AI lesson plans, mind maps, quizzes, and 75-inch smartboard presentations for all chapters. Built for Indian teachers.`;

  return {
    title,
    description,
    keywords: [
      `ncert ${info.className.toLowerCase()} ${info.subjectSlug} lesson plan pdf`,
      `class ${info.gradeNum} ${info.subjectSlug} ncert mind map`,
      `cbse class ${info.gradeNum} ${info.subjectSlug} question paper generator`,
      `teachersathi ncert class ${info.gradeNum} ${info.subjectSlug}`,
    ],
    alternates: {
      canonical: `https://teacher-sathi.online/${params.subjectHub}`,
    },
    openGraph: {
      title,
      description,
      url: `https://teacher-sathi.online/${params.subjectHub}`,
      siteName: 'TeacherSathi',
      type: 'article',
    },
  };
}

export default function SubjectHubPage({ params }: { params: HubParams }) {
  const info = parseSubjectHubSlug(params.subjectHub);
  if (!info) {
    notFound();
  }

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do I generate an NCERT ${info.className} ${info.subjectName} question paper?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Select any chapter from NCERT ${info.className} ${info.subjectName} listed below and click 'Generate Quiz'. TeacherSathi creates printable PDF question papers with answer keys in 30 seconds.`
        }
      },
      {
        "@type": "Question",
        "name": `Are NCERT ${info.className} ${info.subjectName} lesson kits aligned with NEP 2020?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, all ${info.className} ${info.subjectName} slide decks and mind maps adhere to NEP 2020 competency-based learning outcomes.`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Header Banner */}
      <div className="bg-[#14532D] text-white py-14 px-4 border-b border-emerald-800">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span>NCERT Curriculum Hub</span> &bull; <span>{info.className}</span> &bull; <span>{info.subjectName}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
            NCERT {info.className} {info.subjectName} AI Teaching Kit &amp; Lesson Plans
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            Complete chapter repository for NCERT {info.className} {info.subjectName}. Access 75-inch smartboard presentations, bilingual mind maps, printable worksheets, and automated quizzes for every chapter.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-10">
        {/* Chapters Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-700" /> NCERT {info.className} {info.subjectName} Chapters ({info.chapters.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {info.chapters.map((ch) => (
              <div key={ch.id} className="bg-white border border-slate-200 hover:border-emerald-600/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                    {ch.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Smartboard Ready
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{ch.en}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{ch.hi}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{ch.descEn}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Chapter {ch.id}</span>
                  <Link
                    href={`/content/class-${info.gradeNum}/${info.subjectSlug}/chapter-${ch.id}`}
                    className="text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
                  >
                    Open Teaching Kit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Search FAQ Section (Targeting Item 20) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" /> Frequently Asked Questions ({info.className} {info.subjectName})
          </h2>

          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">How to make a question paper for {info.className} {info.subjectName}?</h3>
              <p className="text-xs text-slate-600 mt-1">Select any chapter from the list above, click on &quot;Quiz Generator&quot;, and choose your desired difficulty. Your printable PDF question paper with answer keys will be ready in 30 seconds.</p>
            </div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Can I present these {info.subjectName} mind maps on a 75-inch smartboard?</h3>
              <p className="text-xs text-slate-600 mt-1">Yes, all TeacherSathi mind maps and slide decks are rendered in high-contrast Devanagari Hindi and English typography optimized specifically for 75-inch smart classroom screens.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
