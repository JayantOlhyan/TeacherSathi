import React from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getChapterDetails } from "@/lib/data/chapters";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";
import { ChevronRight, Clock, Download } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import InternalContextualLinks from "@/components/InternalContextualLinks";
import ChapterWorkspaceClient from "@/components/chapter/ChapterWorkspaceClient";

interface ChapterPageParams {
  grade: string;
  subject: string;
  chapter: string;
  locale: string;
}

export async function generateStaticParams() {
  const params: Array<{ grade: string; subject: string; chapter: string }> = [];

  Object.keys(NCERT_SYLLABUS).forEach((className) => {
    const gradeSlug = className.toLowerCase().replace(/\s+/g, '-');
    const subjects = NCERT_SYLLABUS[className];

    Object.keys(subjects).forEach((subjectName) => {
      const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-');
      const chapters = subjects[subjectName];

      chapters.forEach((ch) => {
        params.push({
          grade: gradeSlug,
          subject: subjectSlug,
          chapter: `chapter-${ch.id}`,
        });
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: ChapterPageParams }): Promise<Metadata> {
  const chapterDetails = getChapterDetails(params.grade, params.subject, params.chapter);
  const cleanGrade = params.grade.replace("-", " ").toUpperCase();
  const cleanSubjectName = params.subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanChapterNum = params.chapter.replace("chapter-", "");

  const title = `NCERT ${cleanGrade} ${cleanSubjectName} Ch ${cleanChapterNum}: ${chapterDetails.title} | TeacherSathi`;
  const description = `Free NCERT ${cleanGrade} ${cleanSubjectName} Chapter ${cleanChapterNum} (${chapterDetails.title}) AI lesson plans, mind maps, quizzes, and 75-inch smartboard presentations.`;

  return {
    title,
    description,
    keywords: [
      `ncert ${cleanGrade.toLowerCase()} ${params.subject} chapter ${cleanChapterNum} lesson plan pdf`,
      `${chapterDetails.title.toLowerCase()} class ${cleanGrade} ncert mind map`,
      `teachersathi ncert ${cleanGrade.toLowerCase()} ${params.subject} chapter ${cleanChapterNum}`,
    ],
    alternates: {
      canonical: `https://teacher-sathi.online/content/${params.grade}/${params.subject}/${params.chapter}`,
    },
    openGraph: {
      title,
      description,
      url: `https://teacher-sathi.online/content/${params.grade}/${params.subject}/${params.chapter}`,
      siteName: 'TeacherSathi',
      type: 'article',
    },
  };
}

export default function ChapterHubPage({ params }: { params: ChapterPageParams }) {
  const grade = params.grade || "class-10";
  const subject = params.subject || "science";
  const chapter = params.chapter || "chapter-10";

  const chapterDetails = getChapterDetails(grade, subject, chapter);

  const cleanGrade = grade.replace("-", " ").toUpperCase();
  const cleanSubjectName = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanChapterNum = chapter.replace("chapter-", "");

  const tocItems = [
    { id: "overview", title: "Chapter Overview & Syllabus Context" },
    { id: "interactive-tools", title: "Smartboard & Interactive Tools" },
    { id: "contextual-links", title: "Related AI Generators & Resources" },
    { id: "faq", title: "Frequently Asked Questions & Voice Search" },
  ];

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How to make a question paper for NCERT ${cleanGrade} ${cleanSubjectName} Chapter ${cleanChapterNum}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Use TeacherSathi's AI Assessment generator below to generate a formatted printable CBSE test paper for Chapter ${cleanChapterNum} (${chapterDetails.title}) with answer keys in 30 seconds.`
        }
      },
      {
        "@type": "Question",
        "name": `Where can I get NCERT ${cleanGrade} ${cleanSubjectName} Chapter ${cleanChapterNum} mind maps in Hindi?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `TeacherSathi provides bilingual Devanagari Hindi and English high-resolution mind maps for NCERT ${cleanGrade} ${cleanSubjectName} Chapter ${cleanChapterNum} ready for smartboard presentation.`
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 relative px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Top Breadcrumb Context */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 pt-4">
        <Link href="/content" className="hover:text-gray-600 transition-colors">NCERT Library</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/content/${grade}`} className="hover:text-gray-600 transition-colors">{cleanGrade}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/content/${grade}/${subject}`} className="hover:text-gray-600 transition-colors">{cleanSubjectName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700">Ch {cleanChapterNum}</span>
      </div>

      {/* Chapter Workspace Main Title Card */}
      <div id="overview" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#14532D] tracking-wider bg-green-50 px-2.5 py-0.5 rounded border border-green-100">NCERT Chapter Hub</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 leading-tight">
              Ch {cleanChapterNum}. {chapterDetails.title}
            </h1>
            {chapterDetails.titleHi && (
              <h2 className="text-lg sm:text-xl font-bold text-amber-800 font-serif">
                {chapterDetails.titleHi}
              </h2>
            )}
          </div>
          
          <button className="bg-emerald-50 hover:bg-emerald-100 text-[#14532D] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0">
            <Download className="w-4 h-4" /> Download Chapter Pack
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed max-w-4xl font-medium">
          {chapterDetails.description}
        </p>

        <div className="flex items-center gap-4 pt-2 text-xs font-bold text-gray-500 border-t border-gray-100">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> Estimated Time: {chapterDetails.studyTime || "2 Hours"}</span>
          <span>&bull;</span>
          <span className="text-[#14532D]">Smartboard &amp; Printable PDF Ready</span>
        </div>
      </div>

      {/* Table of Contents Jump Links */}
      <TableOfContents items={tocItems} />

      {/* Interactive Tools Section */}
      <div id="interactive-tools">
        <ChapterWorkspaceClient
          grade={grade}
          subject={subject}
          chapter={chapter}
          chapterDetails={chapterDetails}
        />
      </div>

      {/* Contextual Internal Links Section */}
      <div id="contextual-links">
        <InternalContextualLinks
          grade={cleanGrade}
          subject={cleanSubjectName}
          chapterTitle={chapterDetails.title}
        />
      </div>

      {/* FAQ & Voice Search Section */}
      <div id="faq" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions — {cleanGrade} {cleanSubjectName} Ch {cleanChapterNum}</h3>
        <div className="space-y-3 text-xs sm:text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-800">Q: How to make a question paper for {cleanGrade} {cleanSubjectName} Chapter {cleanChapterNum}?</h4>
            <p className="mt-0.5">A: Click on &quot;Generate Test Paper&quot; above to instantly export a formatted printable CBSE test with answer keys tailored to this chapter.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Q: Are these teaching materials available in Devanagari Hindi?</h4>
            <p className="mt-0.5">A: Yes, all TeacherSathi NCERT slide decks, mind maps, and quiz questions support bilingual Devanagari Hindi and English.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
