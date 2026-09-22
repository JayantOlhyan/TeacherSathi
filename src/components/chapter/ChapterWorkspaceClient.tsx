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
  Calendar,
  ArrowUpRight,
  PenTool,
  BarChart3,
  Send,
  Loader2,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { setTeachingContext } from "@/lib/context/teachingContext";

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
  const [saathiQuery, setSaathiQuery] = useState("");
  const [saathiResponse, setSaathiResponse] = useState<string | null>(null);
  const [isSaathiThinking, setIsSaathiThinking] = useState(false);

  // Sync active chapter into global Teaching Context on mount
  useEffect(() => {
    const chNum = parseInt(chapter.replace(/\D/g, "")) || 1;
    const cleanGrade = grade.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
    const cleanSub = subject.charAt(0).toUpperCase() + subject.slice(1);

    setTeachingContext({
      grade,
      gradeName: cleanGrade,
      subject,
      subjectName: cleanSub,
      chapter,
      chapterNumber: chNum,
      chapterTitle: chapterDetails.title,
      chapterTitleHi: chapterDetails.titleHi,
      totalTopics: 7,
      completedTopics: 4,
      currentSlide: 1,
    });
  }, [grade, subject, chapter, chapterDetails]);

  const classroomLaunchUrl = `/classroom?grade=${grade}&subject=${subject}&chapter=${chapter}&title=${encodeURIComponent(chapterDetails.title)}&returnUrl=${encodeURIComponent(`/content/${grade}/${subject}/${chapter}`)}`;

  const handleAskSaathi = async (promptText?: string) => {
    const query = promptText || saathiQuery;
    if (!query.trim()) return;

    setIsSaathiThinking(true);
    setSaathiResponse(null);

    try {
      const res = await fetch("/api/ai/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          grade,
          subject,
          chapter: chapterDetails.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaathiResponse(data.answer || "Here is a pedagogical tip tailored to this chapter.");
      } else {
        setSaathiResponse("Try asking students to pair up for 2 minutes to summarize today's concept in their own words.");
      }
    } catch {
      setSaathiResponse("Focus on active questioning: ask students to identify 2 examples from daily life connected to this concept.");
    } finally {
      setIsSaathiThinking(false);
    }
  };

  const contextualPrompts = [
    `5-min recap activity for ${chapterDetails.title}`,
    `Common student misconceptions in ${chapterDetails.title}`,
    `Real-world Indian application of ${chapterDetails.title}`,
    `Bilingual Hindi notes for classroom discussion`,
  ];

  return (
    <div className="space-y-8 relative">
      
      {/* Primary Action Hero Bar (UX-003, UX-013) */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#15803D] text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wide backdrop-blur-md">
            <Tv className="w-3.5 h-3.5 text-amber-300" />
            75&quot; Smartboard Presentation System
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-snug">
            Ready to Teach in Classroom?
          </h2>
          <p className="text-white/85 text-xs sm:text-sm font-medium leading-relaxed">
            Launch high-contrast slides on your 75&quot; smartboard, connect student clickers, or run interactive concept checks.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <Link
            href={classroomLaunchUrl}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm cursor-pointer whitespace-nowrap"
          >
            <Tv className="w-5 h-5 text-gray-950" />
            Start Class on Smartboard
          </Link>
          <Link
            href="/dashboard/whiteboard"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3.5 rounded-xl transition-all text-xs border border-white/20 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <PenTool className="w-4 h-4 text-emerald-300" />
            Open Whiteboard
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
      </div>

      {/* Grid Pillars: PREPARE, TEACH, ASSESS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: PREPARE */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">1. PREPARE</h3>
                <p className="text-gray-500 text-[11px] font-medium mt-0.5">Lesson structure &amp; materials</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">Ready</span>
            </div>
            
            <div className="space-y-2.5">
              <Link 
                href={`/dashboard/create?type=lesson-plan&grade=${grade}&subject=${subject}&chapter=${chapter}`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">AI Lesson Plan</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Structured teaching roadmap</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <button 
                onClick={() => setIsProModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <BrainCircuit className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Concept Mind Map</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Visual concept breakdown</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </button>

              <Link 
                href={`/dashboard/create?type=worksheet&grade=${grade}&subject=${subject}&chapter=${chapter}`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Printable Worksheet</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bilingual homework file</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <Link 
                href={`/content/${grade}/${subject}/${chapter}/qa`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Question &amp; Answer Bank</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Canonical NCERT solutions</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: TEACH */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">2. TEACH</h3>
                <p className="text-gray-500 text-[11px] font-medium mt-0.5">Classroom delivery tools</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">Live</span>
            </div>
            
            <div className="space-y-2.5">
              <Link 
                href={classroomLaunchUrl}
                className="w-full flex items-center justify-between p-3.5 bg-emerald-50/60 hover:bg-[#EDF7EF] rounded-xl text-left border border-emerald-200 group transition-all cursor-pointer block shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#14532D] text-white rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <Tv className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#14532D] text-xs">Start Smartboard Class</h4>
                    <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">75&quot; TV presentation deck</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#14532D] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                href="/dashboard/whiteboard"
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <PenTool className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Digital Whiteboard</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Interactive stylus drawing &amp; math</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <Link 
                href={`/content/${grade}/${subject}/${chapter}/video`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
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

        {/* Column 3: ASSESS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">3. ASSESS</h3>
                <p className="text-gray-500 text-[11px] font-medium mt-0.5">Formative evaluation tools</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800">Quiz</span>
            </div>

            <div className="space-y-2.5">
              <Link 
                href={`/dashboard/assessments/create?type=MCQ_QUIZ&grade=${grade}&subject=${subject}&chapter=${chapter}`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <CheckSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Create MCQ Quiz</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Clicker formative evaluation</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>

              <Link 
                href={`/dashboard/assessments/create?type=TEST_PAPER&grade=${grade}&subject=${subject}&chapter=${chapter}`}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
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
                href="/dashboard/classes?tab=homework"
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-[#EDF7EF] rounded-xl text-left border border-gray-100 group transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#14532D] border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-xs">Assign Homework</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Post to student class roster</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#14532D] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Pillar 4 & 5: UNDERSTAND (Class Insights UX-017) & ASK SAATHI (UX-022) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pillar 4: Concise Class Insights (UX-017) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-[#14532D]" />
              <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Class Insights</h3>
            </div>
            <Link 
              href={`/dashboard/analytics?grade=${grade}&subject=${subject}`}
              className="text-xs font-bold text-[#14532D] hover:underline inline-flex items-center gap-1"
            >
              Full Analytics Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Concept Mastery</span>
              <div className="text-2xl font-black text-[#14532D]">78%</div>
              <p className="text-[11px] text-emerald-800/80 font-medium">32 students on track</p>
            </div>
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Need Reinforcement</span>
              <div className="text-2xl font-black text-amber-700">6</div>
              <p className="text-[11px] text-amber-800/80 font-medium">struggling with irrigation methods</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-medium leading-relaxed bg-gray-50 p-3 rounded-xl">
            💡 <strong className="text-gray-700">Teaching Recommendation:</strong> Review the difference between drip and sprinkler irrigation before starting formative quizzes.
          </p>
        </div>

        {/* Pillar 5: Contextual Ask Saathi (UX-022) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Ask Saathi About This Chapter</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Contextual Assistant</span>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-1.5">
              {contextualPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSaathiQuery(prompt);
                    handleAskSaathi(prompt);
                  }}
                  className="text-[11px] font-medium bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition-all text-left cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI Response Display */}
            {isSaathiThinking && (
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#14532D]" />
                Saathi is formulating chapter recommendations...
              </div>
            )}

            {saathiResponse && !isSaathiThinking && (
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-gray-800 leading-relaxed font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#14532D] text-[11px]">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Saathi Suggestion:
                </div>
                <p>{saathiResponse}</p>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskSaathi();
            }}
            className="flex gap-2 pt-2"
          >
            <input
              type="text"
              value={saathiQuery}
              onChange={(e) => setSaathiQuery(e.target.value)}
              placeholder={`Ask anything about ${chapterDetails.title}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
            />
            <button
              type="submit"
              disabled={isSaathiThinking || !saathiQuery.trim()}
              className="bg-[#14532D] hover:bg-emerald-900 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
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
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
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
                  <button className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
