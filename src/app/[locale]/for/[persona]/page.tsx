import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CheckCircle2, ArrowRight, Zap, Star } from "lucide-react";

interface PersonaData {
  title: string;
  badge: string;
  heroHeadline: string;
  heroSubheadline: string;
  benefits: string[];
  testimonials: Array<{ name: string; school: string; quote: string }>;
}

const PERSONAS: Record<string, PersonaData> = {
  "kvs-teachers": {
    title: "TeacherSathi for Kendriya Vidyalaya (KVS) Educators",
    badge: "KVS & NVS Curricular Sync",
    heroHeadline: "Purpose-Built NCERT AI Assistant for KVS Educators",
    heroSubheadline: "Save 10+ hours every week in preparing 75-inch smartboard slide decks, bilingual Devanagari mind maps, and CBSE competency worksheets for Classes 6 to 10.",
    benefits: [
      "100% Sync with KVS Annual Pedagogical Plans & NEP 2020",
      "Native 75-inch Smart Classroom Display Presentation Mode",
      "Bilingual Devanagari Hindi & English Scientific Vocabulary",
      "Instant Printable PDF Worksheets with Teacher Answer Keys",
      "Works on Low-Bandwidth 2G/3G School Networks"
    ],
    testimonials: [
      { name: "Ramesh Kumar (KVS PGT)", school: "Kendriya Vidyalaya No. 1, Jaipur", quote: "TeacherSathi generates my entire 75-inch smartboard lesson kit in 30 seconds. A must-have for all KVS teachers." }
    ]
  },
  "cbse-teachers": {
    title: "TeacherSathi for CBSE School Educators",
    badge: "CBSE & Competency Learning Aligned",
    heroHeadline: "India's #1 CBSE AI Lesson Plan & Quiz Generator",
    heroSubheadline: "Automate competency-based NCERT lesson kits, chapter mind maps, and chapter test papers tailored for CBSE Class 6 to 10 curriculum.",
    benefits: [
      "NEP 2020 Competency-Based Learning Outcome Mapping",
      "CBSE Question Paper Generator by Difficulty (Easy, Medium, Hard)",
      "Instant Slide Deck Export to PPTX & PDF Formats",
      "Real-Time Student Comprehension & Clicker Polls",
      "Zero Setup Required & Works on Any Smart TV or Laptop"
    ],
    testimonials: [
      { name: "Sunita Verma (CBSE TGT)", school: "Government Senior Secondary School, Bhopal", quote: "Creating test papers with answer keys used to take 2 hours. With TeacherSathi, it takes 30 seconds." }
    ]
  },
  "state-board-teachers": {
    title: "TeacherSathi for State Board & Government Educators",
    badge: "State Board & Regional Language Support",
    heroHeadline: "Bilingual NCERT AI Co-Pilot for State Board Teachers",
    heroSubheadline: "Empowering state government school educators in MP, Bihar, Rajasthan, UP, Gujarat, and Tamil Nadu with bilingual lesson kits and offline PDF downloads.",
    benefits: [
      "Bilingual Devanagari Hindi & English Text Output",
      "Optimized for Low-Bandwidth 2G/3G Rural School Connections",
      "Downloadable Offline PDF Packs for Projection",
      "100% Free Forever for Individual Teachers",
      "DPDP Act 2023 Compliant & Audited Data Privacy"
    ],
    testimonials: [
      { name: "Anjali Kumari (State Teacher)", school: "JNV Patna, Bihar", quote: "Finally an AI tool built with accurate Hindi scientific terminology. My students love the interactive mind maps." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { persona: "kvs-teachers" },
    { persona: "cbse-teachers" },
    { persona: "state-board-teachers" },
  ];
}

export async function generateMetadata({ params }: { params: { persona: string } }): Promise<Metadata> {
  const p = PERSONAS[params.persona];
  if (!p) return {};

  return {
    title: `${p.title} | TeacherSathi`,
    description: p.heroSubheadline,
    alternates: {
      canonical: `https://teacher-sathi.online/for/${params.persona}`,
    },
    openGraph: {
      title: p.title,
      description: p.heroSubheadline,
      url: `https://teacher-sathi.online/for/${params.persona}`,
      siteName: 'TeacherSathi',
    },
  };
}

export default function PersonaLandingPage({ params }: { params: { persona: string } }) {
  const p = PERSONAS[params.persona];
  if (!p) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      
      {/* Hero Header */}
      <div className="bg-[#14532D] text-white py-16 px-4 border-b border-emerald-800">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-300 rounded-full text-xs font-extrabold uppercase tracking-wider border border-emerald-700">
            {p.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">{p.heroHeadline}</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">{p.heroSubheadline}</p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-full text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-400"
            >
              <span>Get Free Lesson Kit Now 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-10">
        {/* Benefits Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" /> Why Educators Choose TeacherSathi
          </h2>

          <ul className="space-y-4">
            {p.benefits.map((b, idx) => (
              <li key={idx} className="flex items-center gap-3 text-slate-800 text-sm font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-lg font-serif italic leading-relaxed">&ldquo;{p.testimonials[0].quote}&rdquo;</p>
          <div className="pt-2">
            <p className="font-extrabold text-sm">{p.testimonials[0].name}</p>
            <p className="text-xs text-emerald-200">{p.testimonials[0].school}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
