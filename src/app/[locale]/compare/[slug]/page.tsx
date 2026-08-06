import React from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Check, X, ArrowRight, Zap, HelpCircle } from "lucide-react";

interface ComparisonData {
  title: string;
  competitorName: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  summary: string;
  featureMatrix: Array<{
    feature: string;
    teacherSathi: boolean | string;
    competitor: boolean | string;
    whyItMatters: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
}

const COMPARISONS: Record<string, ComparisonData> = {
  "teachersathi-vs-chatgpt": {
    title: "TeacherSathi vs ChatGPT for Indian NCERT Teachers",
    competitorName: "ChatGPT",
    metaDescription: "Detailed comparison of TeacherSathi AI vs ChatGPT for Indian school teachers. See why TeacherSathi leads in 75-inch smartboard ready kits and NCERT alignment.",
    heroHeadline: "TeacherSathi AI vs ChatGPT: Built for NCERT Classrooms",
    heroSubheadline: "While ChatGPT is a general-purpose text generator, TeacherSathi is purpose-built for Indian school teachers with 1-click 75-inch smartboard lesson plans, NCERT mapping, and bilingual Hindi output.",
    summary: "Generic AI chatbots require lengthy prompting and produce unformatted text that requires hours of reformatting. TeacherSathi generates ready-to-present smartboard slides, printable PDF worksheets, mind maps, and NCERT-indexed quizzes in 30 seconds.",
    featureMatrix: [
      { feature: "NCERT Class 6–10 Syllabus Pre-Indexed", teacherSathi: true, competitor: false, whyItMatters: "No manual copying of syllabus topics needed." },
      { feature: "75-inch Smartboard Display Ready Slides", teacherSathi: true, competitor: false, whyItMatters: "Displays instantly in large high-contrast fonts for Indian classrooms." },
      { feature: "Bilingual Hindi & English Output", teacherSathi: "Native Devanagari", competitor: "Variable / Literal", whyItMatters: "Accurate Hindi educational terminology for state & CBSE schools." },
      { feature: "Print-Ready CBSE Worksheets & PDFs", teacherSathi: true, competitor: false, whyItMatters: "Export formatted test papers in one click." },
      { feature: "NEP 2020 & Blooms Taxonomy Framework", teacherSathi: true, competitor: "Requires prompt", whyItMatters: "Built-in competency-based learning outcomes." },
      { feature: "100% Free Forever for Individual Teachers", teacherSathi: true, competitor: "Freemium ($20/mo)", whyItMatters: "Zero cost barrier for government school educators." },
    ],
    faqs: [
      { question: "Why use TeacherSathi instead of ChatGPT?", answer: "TeacherSathi has the entire NCERT Class 6-10 syllabus pre-built into its database. You do not need complex prompts—just select your grade, subject, and chapter to get instant smartboard slides and worksheets." },
      { question: "Can TeacherSathi generate question papers like ChatGPT?", answer: "Yes! TeacherSathi generates structured question papers categorized by difficulty (Easy, Medium, Hard) and question types (MCQ, Short Answer, Long Answer) complete with answer keys." },
    ]
  },
  "teachersathi-vs-magicschool-ai": {
    title: "TeacherSathi vs MagicSchool AI for CBSE & State Boards",
    competitorName: "MagicSchool AI",
    metaDescription: "TeacherSathi vs MagicSchool AI comparison. Discover why TeacherSathi is India's top NCERT AI lesson plan generator with 75-inch smartboard and Hindi support.",
    heroHeadline: "TeacherSathi AI vs MagicSchool AI: The Indian EdTech Choice",
    heroSubheadline: "MagicSchool AI focuses on US Common Core standards. TeacherSathi is 100% tailored for NCERT, CBSE, KVS, and Indian State Board teachers.",
    summary: "US-centric platforms lack alignment with NCERT textbook chapters, Devanagari script formatting, and 75-inch smart screen displays common in Indian digital classrooms. TeacherSathi bridges this gap with native Indian curriculum integration.",
    featureMatrix: [
      { feature: "NCERT Textbook Chapter Mapping", teacherSathi: true, competitor: false, whyItMatters: "Directly matches Class 6-10 NCERT chapters." },
      { feature: "Native Devanagari Hindi Support", teacherSathi: true, competitor: "Basic Machine Translation", whyItMatters: "Respects Hindi grammar and subject terminologies." },
      { feature: "75-inch Smart Classroom Display Optimization", teacherSathi: true, competitor: false, whyItMatters: "Optimized for classroom visibility." },
      { feature: "Low-Bandwidth 2G/3G Connectivity Support", teacherSathi: true, competitor: false, whyItMatters: "Reliable performance in rural and semi-urban schools." },
      { feature: "DPDP Act 2023 India Compliance", teacherSathi: true, competitor: "US FERPA Only", whyItMatters: "Complies with Indian data protection laws." },
    ],
    faqs: [
      { question: "How does TeacherSathi differ from MagicSchool AI?", answer: "TeacherSathi is created specifically for Indian classrooms. It integrates all NCERT subjects, supports bilingual Hindi/English teaching, and renders 75-inch smartboard presentations without installation." },
    ]
  },
  "teachersathi-vs-khanmigo": {
    title: "TeacherSathi vs Khanmigo (Khan Academy AI)",
    competitorName: "Khanmigo",
    metaDescription: "Compare TeacherSathi AI and Khanmigo for Indian school teachers. Learn why TeacherSathi offers superior NCERT lesson planning and free teacher tools.",
    heroHeadline: "TeacherSathi AI vs Khanmigo: Purpose-Built NCERT Co-Pilot",
    heroSubheadline: "Khanmigo is an interactive student tutor, whereas TeacherSathi is an automated teacher co-pilot designed to save teachers 10+ hours weekly in lesson preparation.",
    summary: "TeacherSathi empowers teachers to lead engaging classrooms with automated slide decks, mind maps, and CBSE test generators designed for smart screens and print distribution.",
    featureMatrix: [
      { feature: "Teacher-First Lesson Kit Automation", teacherSathi: true, competitor: "Student Tutoring Focus", whyItMatters: "Built specifically for lesson delivery by teachers." },
      { feature: "Instant Smartboard Slide Deck Export", teacherSathi: true, competitor: false, whyItMatters: "Zero prep time before entering the classroom." },
      { feature: "NCERT Hindi & English Content", teacherSathi: true, competitor: "English Primary", whyItMatters: "Fully accessible for bilingual instruction." },
      { feature: "Free Tier for All Teachers", teacherSathi: "100% Free", competitor: "Paid Subscription", whyItMatters: "No financial barrier for government teachers." },
    ],
    faqs: [
      { question: "Is TeacherSathi free for teachers?", answer: "Yes, TeacherSathi is 100% free for individual Indian school teachers across all government and private institutions." },
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "teachersathi-vs-chatgpt" },
    { slug: "teachersathi-vs-magicschool-ai" },
    { slug: "teachersathi-vs-khanmigo" },
  ];
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const comp = COMPARISONS[params.slug] || COMPARISONS["teachersathi-vs-chatgpt"];
  return {
    title: `${comp.title} | TeacherSathi`,
    description: comp.metaDescription,
    alternates: {
      canonical: `https://teacher-sathi.online/compare/${params.slug}`,
    },
    openGraph: {
      title: comp.title,
      description: comp.metaDescription,
      url: `https://teacher-sathi.online/compare/${params.slug}`,
      siteName: "TeacherSathi",
      type: "article",
    },
  };
}

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const comp = COMPARISONS[params.slug] || COMPARISONS["teachersathi-vs-chatgpt"];

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": comp.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      
      {/* Hero Header */}
      <div className="bg-[#14532D] text-white py-16 px-4 border-b border-emerald-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-emerald-800/80 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-700/50">
            Platform Comparison
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">{comp.heroHeadline}</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">{comp.heroSubheadline}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-12">
        {/* Executive Summary Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Key Takeaway
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{comp.summary}</p>
        </div>

        {/* Feature Matrix Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <h2 className="text-lg font-bold">Feature Matrix: TeacherSathi vs {comp.competitorName}</h2>
            <span className="text-xs bg-emerald-500 text-emerald-950 px-2.5 py-1 rounded-full font-bold">NCERT Aligned</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                  <th className="p-4">Capability / Feature</th>
                  <th className="p-4 bg-emerald-50 text-emerald-900">TeacherSathi AI</th>
                  <th className="p-4">{comp.competitorName}</th>
                  <th className="p-4">Why It Matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {comp.featureMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{item.feature}</td>
                    <td className="p-4 bg-emerald-50/60 text-emerald-950 font-bold">
                      {typeof item.teacherSathi === "boolean" ? (
                        item.teacherSathi ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold"><Check className="w-4 h-4 text-emerald-600" /> Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )
                      ) : (
                        item.teacherSathi
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      {typeof item.competitor === "boolean" ? (
                        item.competitor ? (
                          <span className="flex items-center gap-1 text-emerald-700"><Check className="w-4 h-4" /> Yes</span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-500"><X className="w-4 h-4" /> No</span>
                        )
                      ) : (
                        item.competitor
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">{item.whyItMatters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-700" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {comp.faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-4 last:border-none">
                <h3 className="font-bold text-slate-800 text-base mb-1">{faq.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-8 text-center text-white space-y-4 shadow-lg">
          <h3 className="text-2xl font-bold">Ready to Experience 30-Second NCERT AI Lesson Planning?</h3>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">Join 10,000+ Indian teachers using TeacherSathi AI to transform smart classroom teaching today.</p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-950 font-black rounded-full shadow-md hover:bg-emerald-50 transition-all cursor-pointer"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
