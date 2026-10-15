"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { 
  CheckSquare, 
  Download, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Tv, 
  Calendar,
  PenTool,
  BarChart3,
  Send,
  Lightbulb,
  ArrowRight,
  PlusCircle,
  MessageCircle,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { setTeachingContext } from "@/lib/context/teachingContext";
import { getChapterResources, type TeachingIntent } from "@/lib/data/chapterResources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourcePreviewModal } from "@/components/resources/ResourcePreviewModal";
import { WhatsAppShareModal } from "@/components/resources/WhatsAppShareModal";
import { PrintWorksheetModal } from "@/components/resources/PrintWorksheetModal";
import type { StoredResourceItem } from "@/lib/services/recentResources";
import { SaathiPanel, SaathiTrigger } from "@/components/saathi";

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

  // Intent filter & preview modal
  const [selectedIntent, setSelectedIntent] = useState<TeachingIntent | "ALL">("ALL");
  const [previewResource, setPreviewResource] = useState<StoredResourceItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Saathi Co-Pilot Panel State (Phase 16)
  const [isSaathiPanelOpen, setIsSaathiPanelOpen] = useState(false);
  const [initialSaathiPrompt, setInitialSaathiPrompt] = useState<string | undefined>(undefined);

  // Track 3 Usability: WhatsApp Share & Print Dialogs
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Sync active chapter into global Teaching Context on mount
  useEffect(() => {
    const chNum = parseInt(chapter.replace(/\D/g, ""), 10) || 1;
    const cleanGrade = grade.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
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

  const classroomLaunchUrl = `/classroom?grade=${grade}&subject=${subject}&chapter=${chapter}&title=${encodeURIComponent(
    chapterDetails.title
  )}&returnUrl=${encodeURIComponent(`/content/${grade}/${subject}/${chapter}`)}`;

  const createResourceUrl = `/dashboard/create?grade=${grade}&subject=${subject}&chapter=${chapter}&returnUrl=${encodeURIComponent(
    `/content/${grade}/${subject}/${chapter}`
  )}`;

  const chapterResources = useMemo(() => {
    return getChapterResources(grade, subject, chapter);
  }, [grade, subject, chapter]);

  const filteredResources = useMemo(() => {
    if (selectedIntent === "ALL") return chapterResources;
    return chapterResources.filter((r) => r.intent === selectedIntent);
  }, [chapterResources, selectedIntent]);

  const contextualPrompts = [
    `5-min recap activity for ${chapterDetails.title}`,
    `Common student misconceptions in ${chapterDetails.title}`,
    `Real-world Indian application of ${chapterDetails.title}`,
    `Bilingual Hindi notes for classroom discussion`,
  ];

  const handleOpenPreview = (item: StoredResourceItem) => {
    setPreviewResource(item);
    setIsPreviewOpen(true);
  };

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
          <SaathiTrigger
            variant="pill"
            onClick={() => {
              setInitialSaathiPrompt(undefined);
              setIsSaathiPanelOpen(true);
            }}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs py-2.5 px-4"
          />
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
      </div>

      {/* CHAPTER RESOURCE HUB: 4 Intent Pillars (Mockup Screen 1) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-black font-serif text-gray-900 tracking-tight">
              Teaching Resources for this Chapter
            </h3>
            <p className="text-xs text-gray-500">
              Curriculum-aligned materials organized around how you prepare, teach, practice, and assess.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsWhatsAppOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Share Chapter Homework / Material on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Share WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPrintOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Print Xerox A4 Worksheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Print Xerox</span>
            </button>
            <Link
              href={createResourceUrl}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all w-fit cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Create Resource
            </Link>
          </div>
        </div>

        {/* 4 Intent Cards Grid (Screen 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Prepare */}
          <div
            onClick={() => setSelectedIntent(selectedIntent === "PREPARE" ? "ALL" : "PREPARE")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedIntent === "PREPARE"
                ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs"
                : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-2xs"
            }`}
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">Prepare</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Lesson plans, teaching notes &amp; concept mind maps
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{chapterResources.filter((r) => r.intent === "PREPARE").length} resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Teach */}
          <div
            onClick={() => setSelectedIntent(selectedIntent === "TEACH" ? "ALL" : "TEACH")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedIntent === "TEACH"
                ? "bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-xs"
                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-2xs"
            }`}
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">Teach</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Smartboard slides, activities, diagrams &amp; videos
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-800">
              <span>{chapterResources.filter((r) => r.intent === "TEACH").length} resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Practice */}
          <div
            onClick={() => setSelectedIntent(selectedIntent === "PRACTICE" ? "ALL" : "PRACTICE")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedIntent === "PRACTICE"
                ? "bg-purple-50 border-purple-600 ring-2 ring-purple-500/20 shadow-xs"
                : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-2xs"
            }`}
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">Practice</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Worksheets, practice questions &amp; question bank
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-800">
              <span>{chapterResources.filter((r) => r.intent === "PRACTICE").length} resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Assess */}
          <div
            onClick={() => setSelectedIntent(selectedIntent === "ASSESS" ? "ALL" : "ASSESS")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedIntent === "ASSESS"
                ? "bg-amber-50 border-amber-600 ring-2 ring-amber-500/20 shadow-xs"
                : "bg-white border-gray-200 hover:border-amber-300 hover:shadow-2xs"
            }`}
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">Assess</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Formative quizzes, exit tickets &amp; test papers
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{chapterResources.filter((r) => r.intent === "ASSESS").length} resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

        {/* Selected Intent Filter Pill Reset */}
        {selectedIntent !== "ALL" && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-gray-500 font-medium">
              Showing resources for <strong>{selectedIntent}</strong>
            </span>
            <button
              onClick={() => setSelectedIntent("ALL")}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Show All ({chapterResources.length})
            </button>
          </div>
        )}

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onPreview={handleOpenPreview}
            />
          ))}
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
              <p className="text-[11px] text-amber-800/80 font-medium">struggling with foundational concepts</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-medium leading-relaxed bg-gray-50 p-3 rounded-xl">
            💡 <strong className="text-gray-700">Teaching Recommendation:</strong> Review the core mechanisms in Slide 2 before initiating the formative quiz.
          </p>
        </div>

        {/* Pillar 5: Contextual Ask Saathi (Phase 16) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Ask Saathi About This Chapter</h3>
              </div>
              <button
                onClick={() => {
                  setInitialSaathiPrompt(undefined);
                  setIsSaathiPanelOpen(true);
                }}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                Open Co-Pilot &rarr;
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-1.5">
              {contextualPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInitialSaathiPrompt(prompt);
                    setIsSaathiPanelOpen(true);
                  }}
                  className="text-[11px] font-medium bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition-all text-left cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed font-medium flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tap any quick prompt chip above or type below to open the Saathi Co-Pilot drawer.</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (saathiQuery.trim()) {
                setInitialSaathiPrompt(saathiQuery);
                setIsSaathiPanelOpen(true);
                setSaathiQuery("");
              }
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
              disabled={!saathiQuery.trim()}
              className="bg-[#14532D] hover:bg-emerald-900 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Interactive Resource Preview Modal */}
      <ResourcePreviewModal
        resource={previewResource}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

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

      {/* Unified Saathi Co-Pilot Panel (Phase 16) */}
      <SaathiPanel
        isOpen={isSaathiPanelOpen}
        onClose={() => setIsSaathiPanelOpen(false)}
        context={{
          grade,
          gradeName: grade.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          subject,
          subjectName: subject.charAt(0).toUpperCase() + subject.slice(1),
          chapter,
          chapterTitle: chapterDetails.title,
          screen: 'workspace',
        }}
        initialPrompt={initialSaathiPrompt}
      />

      {/* Track 3: 1-Tap WhatsApp Share Hub */}
      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        resourceTitle={chapterDetails.title}
        grade={grade}
        subject={subject}
        chapter={chapter}
      />

      {/* Track 3: Print-Ready Xerox A4 Worksheet */}
      <PrintWorksheetModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        title={chapterDetails.title}
        grade={grade}
        subject={subject}
        chapter={chapter}
      />

    </div>
  );
}
