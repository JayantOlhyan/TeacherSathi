"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { BookOpen, GraduationCap, Sparkles, Check, ArrowLeft } from "lucide-react";
import SEOAuthorityLinks from "@/components/SEOAuthorityLinks";

export default function NcertPage() {
  const locale = useLocale();
  const isHi = locale === "hi";

  const [activeSubject, setActiveSubject] = useState<string | null>("science");

  const subjects = [
    {
      id: "science",
      title: "Science",
      titleHi: "विज्ञान",
      color: "bg-[#258088]", // Teal
      spineClass: "border-l-[12px] border-[#1b5e64]",
      chapters: [
        { num: "Ch 1", name: "Chemical Reactions & Equations" },
        { num: "Ch 2", name: "Acids, Bases & Salts" },
        { num: "Ch 6", name: "Life Processes" },
        { num: "Ch 10", name: "Light — Reflection & Refraction" }
      ]
    },
    {
      id: "maths",
      title: "Mathematics",
      titleHi: "गणित",
      color: "bg-[#D95B2A]", // Burnt Orange
      spineClass: "border-l-[12px] border-[#a3441f]",
      chapters: [
        { num: "Ch 1", name: "Real Numbers" },
        { num: "Ch 2", name: "Polynomials" },
        { num: "Ch 3", name: "Pair of Linear Equations" },
        { num: "Ch 6", name: "Triangles" }
      ]
    },
    {
      id: "social",
      title: "Social Science",
      titleHi: "सामाजिक विज्ञान",
      color: "bg-[#6A8146]", // Olive
      spineClass: "border-l-[12px] border-[#4d5e32]",
      chapters: [
        { num: "Ch 1", name: "Resources & Development" },
        { num: "Ch 2", name: "Forest & Wildlife Resources" },
        { num: "Ch 3", name: "Water Resources" },
        { num: "Ch 4", name: "Agriculture" }
      ]
    },
    {
      id: "english",
      title: "English Literature",
      titleHi: "अंग्रेज़ी",
      color: "bg-[#1E3A5F]", // Deep Navy
      spineClass: "border-l-[12px] border-[#12243b]",
      chapters: [
        { num: "Ch 1", name: "A Letter to God" },
        { num: "Ch 2", name: "Nelson Mandela: Long Walk to Freedom" },
        { num: "Ch 3", name: "Two Stories about Flying" }
      ]
    },
    {
      id: "hindi",
      title: "Hindi (Kshitij)",
      titleHi: "हिंदी (क्षितिज)",
      color: "bg-[#D97706]", // Amber
      spineClass: "border-l-[12px] border-[#a15804]",
      chapters: [
        { num: "Ch 1", name: "Surdas ke Pad" },
        { num: "Ch 2", name: "Ram-Lakshman-Parashuram Samvad" },
        { num: "Ch 3", name: "Savaiya aur Kavitta" }
      ]
    }
  ];

  const currentSubject = subjects.find(s => s.id === activeSubject) || subjects[0];

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#1C2B1C] font-sans pb-20">
      
      {/* Top Banner */}
      <div className="max-w-[1200px] mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#166534] hover:underline font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> 
          {"Back to Home"}
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-[900px] mx-auto px-4 py-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#166534]/5 border border-[#166534]/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#166534] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" /> Classes 6 - 10 Coverage
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#166534] leading-tight">
          {isHi ? "TeacherSathi NCERT कक्षा 6-10 पाठ्यक्रम हब" : "TeacherSathi NCERT Class 6-10 Syllabus Hub"}
        </h1>
        <p className="text-lg text-[#3C4B3A]/80 max-w-2xl mx-auto leading-relaxed">
          {isHi 
            ? "विज्ञान, गणित, सामाजिक विज्ञान, अंग्रेज़ी और हिंदी के लिए भारतीय सरकारी स्कूलों के शिक्षकों हेतु पूरी तरह से NCERT और CBSE बोर्ड के अनुकूल AI सामग्री प्राप्त करें। 75-इंच स्मार्ट स्क्रीन के लिए विशेष रूप से डिज़ाइन किया गया।"
            : "Access comprehensive TeacherSathi AI lesson plans, mind maps, quizzes, and videos built directly from NCERT textbooks for Indian government school educators. Specially formatted for 75-inch smart classrooms."}
        </p>
      </section>

      {/* Interactive Bookshelf Showcase */}
      <section className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        
        {/* Bookshelf Render */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#EEF2EA] border border-[#DCE4D7] rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1C2B1C] mb-6 text-center lg:text-left">
            {"Interactive Bookshelf (Pick a book) 📚"}
          </h2>
          
          <div className="flex justify-center items-end gap-2 h-[280px] border-b-[14px] border-[#cbd5e1] pb-1 px-4 relative">
            {subjects.map((sub) => {
              const isActive = sub.id === activeSubject;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubject(sub.id)}
                  className={`w-14 sm:w-16 ${sub.color} ${sub.spineClass} hover:-translate-y-4 hover:shadow-md cursor-pointer transition-all duration-300 rounded-t-lg flex items-center justify-center text-white font-extrabold text-sm sm:text-base [writing-mode:vertical-lr] [text-orientation:mixed] py-6 shadow-sm ${
                    isActive ? "-translate-y-5 shadow-lg scale-105 outline outline-3 outline-offset-2 outline-[#166534]" : ""
                  }`}
                  style={{ height: sub.id === "science" ? "92%" : sub.id === "maths" ? "88%" : sub.id === "social" ? "90%" : sub.id === "english" ? "84%" : "86%" }}
                >
                  {sub.title}
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-[#5E6C5A] text-center mt-6 italic">
            {isHi 
              ? "*विषय की विवरण सूची देखने के लिए किसी भी पुस्तक पर क्लिक करें।" 
              : "*Click on any book spine to pull out its chapter and content index."}
          </p>
        </div>

        {/* Dynamic Detail Card */}
        <div className="lg:col-span-6 bg-white border border-[#DCE4D7] rounded-3xl p-8 shadow-card flex flex-col justify-between animate-fadeIn">
          <div>
            <div className="flex items-center gap-3 border-b border-[#DCE4D7] pb-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl ${currentSubject.color} text-white flex items-center justify-center shadow-sm`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1C2B1C]">{currentSubject.title}</h3>
                <span className="text-xs text-[#5E6C5A] uppercase tracking-wider font-semibold">NCERT Class 10 Syllabus</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#166534]">
                {"Featured Chapter Index"}
              </h4>
              
              <div className="space-y-3">
                {currentSubject.chapters.map((ch, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#EEF2EA]/40 border border-[#DCE4D7]/50 rounded-xl hover:bg-[#EEF2EA]/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#166534] bg-[#166534]/10 px-2 py-0.5 rounded">
                        {ch.num}
                      </span>
                      <span className="text-sm font-semibold text-[#1C2B1C]">
                        {ch.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center" title="AI Video Ready">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center" title="AI Quiz Ready">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#DCE4D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-xs text-[#5E6C5A]">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse-slow" />
              {"Bilingual tracks active for all items"}
            </div>
            <Link 
              href="/signup" 
              className="bg-[#16A34A] hover:bg-[#128A3E] text-white text-sm font-bold text-center px-6 py-2.5 rounded-xl shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {"Access For Free"}
            </Link>
          </div>

        </div>

      </section>

      {/* Feature Grid Details */}
      <section className="max-w-[900px] mx-auto px-4 mt-20 space-y-8">
        <h2 className="text-2xl font-black text-center text-[#166534]">
          {"Ready for Classroom Smart Screens"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-[#DCE4D7] rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-base text-[#1C2B1C]">{"15-Foot Legibility"}</h3>
            <p className="text-sm text-[#5E6C5A] leading-relaxed">
              {isHi 
                ? "Plus Jakarta Sans और Mukta फॉन्ट संयोजन के कारण कक्षा में पीछे बैठे छात्रों को भी स्क्रीन साफ दिखती है।"
                : "Big-screen optimized layouts combined with custom robust typography scale cleanly on 75-inch smart screens."}
            </p>
          </div>
          <div className="bg-white border border-[#DCE4D7] rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-base text-[#1C2B1C]">{"Instant Language Swap"}</h3>
            <p className="text-sm text-[#5E6C5A] leading-relaxed">
              {isHi 
                ? "बिना किसी पेज रीलोड के पूरे व्याख्यान, प्रश्नोत्तरी और नोट्स को तुरंत हिंदी से अंग्रेज़ी में बदलें।"
                : "Swap the entire page context, mind map nodes, and video subtitles between Hindi and English instantly."}
            </p>
          </div>
        </div>
      </section>

      <SEOAuthorityLinks />
    </div>
  );
}
