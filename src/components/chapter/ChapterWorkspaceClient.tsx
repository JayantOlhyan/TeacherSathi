"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  Play, 
  CheckSquare, 
  MessageSquare, 
  Download, 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  X, 
  Sparkles, 
  FileCheck, 
  Tv, 
  RefreshCw,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterWorkspaceClientProps {
  grade: string;
  subject: string;
  chapter: string;
  chapterDetails: {
    title: string;
    titleHi?: string;
    description: string;
    studyTime: string;
  };
}

export default function ChapterWorkspaceClient({
  grade,
  subject,
  chapter,
  chapterDetails,
}: ChapterWorkspaceClientProps) {
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSmartScreenOpen, setIsSmartScreenOpen] = useState(false);
  const [smartSlideIndex, setSmartSlideIndex] = useState(0);
  const [smartTimer, setSmartTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

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

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const smartSlides = [
    {
      title: `Lesson Plan: ${chapterDetails.title}`,
      content: chapterDetails.description,
      tip: "🏫 Smart Screen Tip: Direct student attention to the core concepts displayed on screen."
    },
    {
      title: "Key Learning Outcomes (NEP 2020)",
      content: "1. Understand foundational principles.\n2. Apply concepts in real-world scenarios.\n3. Analyze key problems and solutions.",
      tip: "📝 Smart Screen Tip: Engage students in a 2-minute quick pairing discussion."
    },
    {
      title: "Interactive Class Poll",
      content: `Q: Which statement best describes the primary takeaway from ${chapterDetails.title}? \nA) Core Principle 1 \nB) Core Principle 2 \nC) All of the above`,
      tip: "❓ Smart Screen Tip: Have students raise hands to vote."
    }
  ];

  return (
    <div className="space-y-8 relative">
      {/* Grid Pillars: TEACH, ASSESS, PLAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: TEACH */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-50">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">1. TEACH</h3>
              <p className="text-gray-500 text-[11px] font-medium mt-0.5">Instructional delivery tools</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setIsSmartScreenOpen(true)}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Tv className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Smart Classroom PPT</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Start slides on 75-inch TV</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </button>

              <button 
                onClick={() => setIsProModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <BrainCircuit className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Concept Mind Map</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Visual conceptual outlines</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </button>

              <Link 
                href={`/content/${grade}/${subject}/${chapter}/video`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Play className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Video Resources</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bilingual chapter animations</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: ASSESS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-50">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">2. ASSESS</h3>
              <p className="text-gray-500 text-[11px] font-medium mt-0.5">Student comprehension metrics</p>
            </div>

            <div className="space-y-3">
              <Link 
                href={`/content/${grade}/${subject}/${chapter}/quiz`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <CheckSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Create MCQ Quiz</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bilingual clicker questions</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <Link 
                href={`/content/${grade}/${subject}/${chapter}/test`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Generate Test Paper</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Summative CBSE printable test</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <Link 
                href={`/content/${grade}/${subject}/${chapter}/qa`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Question Bank</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Short &amp; long solved answers</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 3: PLAN */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-50">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">3. PLAN</h3>
              <p className="text-gray-500 text-[11px] font-medium mt-0.5">Curriculum organization logs</p>
            </div>

            <div className="space-y-3">
              <Link 
                href={`/dashboard/create?type=lesson-plan&grade=${grade}&subject=${subject}&chapter=${chapter}`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Create Lesson Plan</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Detailed lecture scheduling</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <Link 
                href={`/dashboard/classes?tab=homework`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Assign Homework</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Post homework to workspace</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <button 
                onClick={() => setIsProModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Generate Worksheet</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bilingual print-ready PDF</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Pro Modal */}
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

      {/* Classroom Smart Screen Overlay */}
      <AnimatePresence>
        {isSmartScreenOpen && (
          <div className="fixed inset-0 z-50 bg-[#0C1E12] text-emerald-100 flex flex-col p-6 sm:p-10 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#09160d_1px,transparent_1px),linear-gradient(to_bottom,#09160d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 z-0" />
            
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <Tv className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-wide">SMART SCREEN DISPLAY MODE</h4>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Optimized for 75-inch Classroom TVs &amp; Projectors</p>
                </div>
              </div>

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

              <button 
                onClick={() => { setIsSmartScreenOpen(false); setTimerActive(false); }}
                className="bg-red-900/30 hover:bg-red-950 border border-red-900 text-red-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <X className="w-4 h-4" /> Exit Smart Mode
              </button>
            </div>

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
