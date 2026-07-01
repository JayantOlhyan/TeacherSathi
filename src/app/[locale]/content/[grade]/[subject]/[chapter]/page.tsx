"use client";

import { useState, useEffect, ComponentType } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { 
  Play, CheckSquare, MessageSquare, Download, Lock, FileText, 
  BrainCircuit, Clock, CheckCircle2, ChevronRight, X, Sparkles, FileCheck, Tv, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChapterDetails } from "@/lib/data/chapters";

interface Resource {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  glowColor: string;
  borderColor: string;
  cta: string;
  ctaHi: string;
  badge?: string;
  locked: boolean;
  href?: string;
}

export default function ChapterHubPage() {
  const params = useParams();
  const grade = (params.grade as string) || "class-10";
  const subject = (params.subject as string) || "science";
  const chapter = (params.chapter as string) || "chapter-10";

  const chapterDetails = getChapterDetails(grade, subject, chapter);

  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSmartScreenOpen, setIsSmartScreenOpen] = useState(false);
  const [smartSlideIndex, setSmartSlideIndex] = useState(0);
  const [smartTimer, setSmartTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Load completed resources from localstorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cleanSubject = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const cleanChapter = chapter.replace("chapter-", "");
      localStorage.setItem("last_sathi_view", window.location.pathname);
      localStorage.setItem("last_sathi_view_title", `${cleanSubject} (Ch. ${cleanChapter})`);

      const stored = localStorage.getItem(`taught_${grade}_${subject}_${chapter}`);
      if (stored) {
        setCompletedResources(JSON.parse(stored));
      }
    }
  }, [grade, subject, chapter]);

  // Smart screen timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timerActive) {
      interval = setInterval(() => {
        setSmartTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const toggleCompleted = (resId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = completedResources.includes(resId)
      ? completedResources.filter((id) => id !== resId)
      : [...completedResources, resId];
    
    setCompletedResources(updated);
    localStorage.setItem(`taught_${grade}_${subject}_${chapter}`, JSON.stringify(updated));
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const cleanSubjectName = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanChapterNum = chapter.replace("chapter-", "");

  const resources: Resource[] = [
    {
      id: "ai-video",
      title: "AI Chapter Video",
      titleHi: "AI अध्याय वीडियो",
      subtitle: "18 mins visual lesson module",
      subtitleHi: "18 मिनट का सचित्र पाठ मॉड्यूल",
      icon: Play,
      iconColor: "text-blue-400",
      glowColor: "from-blue-600/35 to-indigo-600/5",
      borderColor: "border-blue-500/50",
      cta: "Watch Video",
      ctaHi: "वीडियो देखें",
      badge: "18 min",
      locked: false,
      href: `/content/${grade}/${subject}/${chapter}/video`,
    },
    {
      id: "mcq-quiz",
      title: "Quick MCQ Quiz",
      titleHi: "त्वरित MCQ क्विज़",
      subtitle: "30 Questions · Instant feedback",
      subtitleHi: "30 प्रश्न · तत्काल परिणाम",
      icon: CheckSquare,
      iconColor: "text-purple-400",
      glowColor: "from-purple-600/35 to-pink-600/5",
      borderColor: "border-purple-500/50",
      cta: "Take Quiz",
      ctaHi: "क्विज़ शुरू करें",
      locked: false,
      href: `/content/${grade}/${subject}/${chapter}/quiz`,
    },
    {
      id: "qa-bank",
      title: "Short & Long Q&A",
      titleHi: "लघु एवं दीर्घ प्रश्नोत्तर",
      subtitle: "NCERT curriculum solutions",
      subtitleHi: "NCERT पाठ्यक्रम के संपूर्ण हल",
      icon: MessageSquare,
      iconColor: "text-emerald-400",
      glowColor: "from-emerald-600/35 to-teal-600/5",
      borderColor: "border-emerald-500/50",
      cta: "View Q&A",
      ctaHi: "प्रश्नोत्तर देखें",
      locked: false,
    },
    {
      id: "summary-video",
      title: "Summary Video",
      titleHi: "अध्याय सारांश वीडियो",
      subtitle: "5 min quick classroom revision",
      subtitleHi: "5 मिनट त्वरित कक्षा पुनरीक्षण",
      icon: Play,
      iconColor: "text-amber-400",
      glowColor: "from-amber-600/35 to-orange-600/5",
      borderColor: "border-amber-500/50",
      cta: "Watch Summary",
      ctaHi: "सारांश देखें",
      locked: false,
    },
    {
      id: "custom-test",
      title: "Customised Test",
      titleHi: "कस्टम परीक्षा पत्र",
      subtitle: "Generate test papers instantly",
      subtitleHi: "कस्टम टेस्ट पेपर तुरंत बनाएं",
      icon: FileText,
      iconColor: "text-rose-400",
      glowColor: "from-rose-600/35 to-red-600/5",
      borderColor: "border-rose-500/50",
      cta: "Start Test",
      ctaHi: "टेस्ट शुरू करें",
      locked: false,
      href: `/content/${grade}/${subject}/${chapter}/test`,
    },
    {
      id: "mind-map",
      title: "Interactive Mind Map",
      titleHi: "इंटरेक्टिव माइंड मैप",
      subtitle: "Visual concept connections",
      subtitleHi: "सचित्र वैचारिक संबंध चित्र",
      icon: BrainCircuit,
      iconColor: "text-teal-400",
      glowColor: "from-teal-600/35 to-cyan-600/5",
      borderColor: "border-teal-500/50",
      cta: "View Mind Map",
      ctaHi: "माइंड मैप देखें",
      locked: false,
    },
    {
      id: "cheat-sheet",
      title: "Revision Cheat Sheet",
      titleHi: "त्वरित रिवीजन शीट",
      subtitle: "1-page summary chart",
      subtitleHi: "1-पृष्ठ त्वरित रिवीजन चार्ट",
      icon: FileCheck,
      iconColor: "text-pink-400",
      glowColor: "from-pink-600/35 to-rose-600/5",
      borderColor: "border-pink-500/50",
      cta: "Get Cheat Sheet",
      ctaHi: "शीट डाउनलोड करें",
      locked: false,
    },
    {
      id: "pdf-download",
      title: "Full PDF Download",
      titleHi: "संपूर्ण PDF नोट्स",
      subtitle: "Printable chapter materials",
      subtitleHi: "प्रिंट-योग्य संपूर्ण पाठ्य सामग्री",
      icon: Download,
      iconColor: "text-slate-300",
      glowColor: "from-slate-600/35 to-slate-800/5",
      borderColor: "border-slate-500/50",
      cta: "Download PDF",
      ctaHi: "PDF डाउनलोड करें",
      locked: false,
    },
  ];

  // Smart Screen Mock Slides
  const smartSlides = [
    {
      title: "Lesson Plan: Overview of Light",
      content: "Light travels in a straight line. Reflection occurs when light bounces off a polished surface, while Refraction is the bending of light as it passes from one medium to another.",
      tip: "🏫 Smart Screen Tip: Ask students to observe their reflection in a metal scale."
    },
    {
      title: "Key Formula Matrix",
      content: "Mirror Formula: 1/f = 1/v + 1/u \nLens Formula: 1/f = 1/v - 1/u \nMagnification: m = -v/u (mirrors) or m = v/u (lenses)",
      tip: "📝 Smart Screen Tip: Write down the formulas on the classroom whiteboard and do 1 numeric example."
    },
    {
      title: "Interactive Quick Poll",
      content: "Q: Which mirror is used by dentists to see a magnified image of teeth? \nA) Convex Mirror \nB) Concave Mirror \nC) Plane Mirror",
      tip: "❓ Smart Screen Tip: Ask students to raise hands or write A/B/C on their slate boards."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F6F3EB] font-sans pb-24 text-slate-800 relative">
      
      {/* Decorative Top Classroom Grid Accent */}
      <div className="absolute top-0 left-0 right-0 h-[350px] bg-[linear-gradient(to_right,#e2dfd7_1px,transparent_1px),linear-gradient(to_bottom,#e2dfd7_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-40 pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto pt-14 px-4 relative z-10">
        
        {/* Nav Breadcrumbs */}
        <div className="text-xs text-emerald-800 bg-emerald-100/50 border border-emerald-800/10 rounded-lg py-1.5 px-3.5 inline-flex items-center gap-1.5 font-bold mb-8 uppercase tracking-wider shadow-sm">
          <span>{grade.replace("-", " ")}</span>
          <ChevronRight className="w-3 h-3 text-emerald-800/60" />
          <span>{cleanSubjectName}</span>
          <ChevronRight className="w-3 h-3 text-emerald-800/60" />
          <span>Chapter {cleanChapterNum}</span>
        </div>

        {/* Chapter Introduction Banner */}
        <div className="mb-12 bg-white/70 border border-slate-200/50 p-6 sm:p-8 rounded-3xl shadow-sm backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/5 rounded-bl-full pointer-events-none" />
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-serif">
                {chapterDetails.title}
              </h1>
              {chapterDetails.titleHi && (
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mt-1.5 font-serif">
                  {chapterDetails.titleHi}
                </h2>
              )}
            </div>
            
            <p className="text-sm sm:text-base text-slate-600/95 max-w-3xl leading-relaxed font-medium">
              {chapterDetails.description}
            </p>
            

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <div className="flex items-center gap-2 bg-white/90 border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm text-xs font-black text-slate-600 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-700" />
                Total Study Time: {chapterDetails.studyTime}
              </div>
              
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" /> Download Full Pack
              </button>
              
              <button 
                onClick={() => setIsSmartScreenOpen(true)}
                className="bg-white hover:bg-slate-50 border border-emerald-800/20 text-emerald-800 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              >
                <Tv className="w-4 h-4 text-emerald-700" /> Launch Smart Screen Mode
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <div className="space-y-0.5">
              <h3 className="text-xl font-extrabold text-slate-800 font-serif">Chapter Teaching Modules</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select a resource to begin teaching</p>
            </div>
            <span className="text-xs font-black text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
              Taught: {completedResources.length} / {resources.length}
            </span>
          </div>

          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {resources.map((res) => {
              const isCompleted = completedResources.includes(res.id);
              const cardKey = `res-${res.id}`;
              
              return (
                <motion.div
                  key={cardKey}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 20 } }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => res.locked ? setIsProModalOpen(true) : null}
                  className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden group shadow-xl border border-slate-800 flex flex-col justify-between min-h-[195px] cursor-pointer"
                >
                  {/* Ambient Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${res.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none z-0`} />

                  {/* Top Bar (Progress check / locked lock icon) */}
                  <div className="flex justify-between items-center relative z-10">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                      <res.icon className={`w-4 h-4 ${res.iconColor}`} />
                    </div>

                    {res.locked ? (
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> Go Pro
                      </span>
                    ) : (
                      <button 
                        onClick={(e) => toggleCompleted(res.id, e)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? "bg-emerald-500 text-slate-900 scale-105 shadow-md shadow-emerald-500/20" 
                            : "bg-white/10 hover:bg-white/20 text-white/50 border border-white/10"
                        }`}
                        title={isCompleted ? "Mark as Untaught" : "Mark as Taught"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1 mt-4 relative z-10">
                    <h4 className="font-extrabold text-base leading-snug group-hover:text-emerald-300 transition-colors">
                      {res.title}
                    </h4>
                    
                    <p className="text-[10.5px] text-slate-400/90 leading-relaxed line-clamp-2 pt-1 font-medium">
                      {res.subtitle}
                    </p>
                  </div>

                  {/* Interactive Button */}
                  <div className="pt-4 relative z-10">
                    {res.href && !res.locked ? (
                      <Link 
                        href={res.href} 
                        className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold text-center block transition-all"
                      >
                        {res.cta}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => res.locked ? setIsProModalOpen(true) : null}
                        className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all"
                      >
                        {res.locked ? "Unlock Module" : res.cta}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* 🌟 PREMIUM UPGRADE TO PRO MODAL */}
      <AnimatePresence>
        {isProModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <button 
                onClick={() => setIsProModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400/20 border border-amber-400/30 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-100 font-serif">Unlock TeacherSathi Pro</h3>
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Supercharge your teaching companion</p>
                  </div>
                </div>

                <div className="space-y-4 border-y border-slate-800 py-5">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-200">Unlimited Customised Tests</h5>
                      <p className="text-xs text-slate-400 mt-0.5">Generate worksheets matching Easy, Medium, or Hard parameters in 2 seconds.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-200">High-Resolution Concept Maps</h5>
                      <p className="text-xs text-slate-400 mt-0.5">Printable vector files to distribute as classroom revision outlines.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-200">Hindi + English Classroom Slates</h5>
                      <p className="text-xs text-slate-400 mt-0.5">Bilingual quick-review notes designed for direct smartboard mirroring.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Pro Plan</span>
                    <span className="text-2xl font-black text-white">₹499<span className="text-sm font-normal text-slate-400"> / month</span></span>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📺 INTERACTIVE CLASSROOM SMART SCREEN OVERLAY */}
      <AnimatePresence>
        {isSmartScreenOpen && (
          <div className="fixed inset-0 z-50 bg-[#0C1E12] text-emerald-100 flex flex-col p-6 sm:p-10 select-none overflow-hidden">
            {/* Grid Chalkboard Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#09160d_1px,transparent_1px),linear-gradient(to_bottom,#09160d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 z-0" />
            
            {/* Top Toolbar */}
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <Tv className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-wide">SMART SCREEN DISPLAY MODE</h4>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Optimized for Classroom TVs & Projectors</p>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 bg-emerald-950/70 border border-emerald-800/40 rounded-xl py-1.5 px-4 shadow-sm">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Class Timer:</span>
                <span className="text-lg font-black font-mono text-white">{formatTimer(smartTimer)}</span>
                <button 
                  onClick={() => setTimerActive(!timerActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${timerActive ? "bg-red-950 text-red-300 border border-red-900" : "bg-emerald-900 text-emerald-200"}`}
                >
                  {timerActive ? "Pause" : "Start"}
                </button>
                <button 
                  onClick={() => { setSmartTimer(0); setTimerActive(false); }}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Exit Button */}
              <button 
                onClick={() => { setIsSmartScreenOpen(false); setTimerActive(false); }}
                className="bg-red-900/30 hover:bg-red-950 border border-red-900 text-red-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <X className="w-4 h-4" /> Exit Smart Mode
              </button>
            </div>

            {/* Smart Slides Display Area */}
            <div className="flex-1 flex flex-col justify-center items-center py-10 relative z-10 max-w-4xl mx-auto w-full text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={smartSlideIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight leading-tight">
                    {smartSlides[smartSlideIndex].title}
                  </h2>
                  <p className="text-lg sm:text-2xl text-emerald-100/90 leading-relaxed font-medium whitespace-pre-line max-w-3xl mx-auto bg-emerald-950/30 border border-emerald-900/20 p-6 sm:p-8 rounded-3xl shadow-inner">
                    {smartSlides[smartSlideIndex].content}
                  </p>
                  
                  <div className="bg-amber-950/40 border border-amber-900/40 text-amber-200 px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 max-w-2xl mx-auto shadow-sm">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    {smartSlides[smartSlideIndex].tip}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Slider Bar */}
            <div className="flex justify-between items-center border-t border-emerald-900/60 pt-6 relative z-10">
              <button 
                onClick={() => setSmartSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={smartSlideIndex === 0}
                className="bg-emerald-900/50 hover:bg-emerald-900 border border-emerald-800/40 text-emerald-200 px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-40"
              >
                Back Slide
              </button>
              
              <div className="flex gap-2.5">
                {smartSlides.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setSmartSlideIndex(sIdx)}
                    className={`w-3 h-3 rounded-full transition-all ${smartSlideIndex === sIdx ? "bg-emerald-400 scale-125" : "bg-emerald-800/60 hover:bg-emerald-700"}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setSmartSlideIndex((prev) => Math.min(smartSlides.length - 1, prev + 1))}
                disabled={smartSlideIndex === smartSlides.length - 1}
                className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600/40 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-40"
              >
                Next Slide
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
