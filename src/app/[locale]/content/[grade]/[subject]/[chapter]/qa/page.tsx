"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, MessageSquare, Search, Copy, Check, 
  Sparkles, Tv, X, ChevronDown, ChevronUp, Bookmark, 
  Printer, Award, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getQAData, QAData, QAQuestion } from "@/lib/data/qaData";

export default function ShortLongQAPage() {
  const params = useParams();
  const grade = (params.grade as string) || "class-10";
  const subject = (params.subject as string) || "hindi";
  const chapter = (params.chapter as string) || "chapter-1";

  const [qaData, setQaData] = useState<QAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  // Presentation / Smart Screen Mode
  const [isSmartScreenOpen, setIsSmartScreenOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cleanSubject = subject.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      const cleanChapter = chapter.replace("chapter-", "");
      localStorage.setItem("last_sathi_view", window.location.pathname);
      localStorage.setItem("last_sathi_view_title", `Q&A Bank - ${cleanSubject} (Ch. ${cleanChapter})`);

      // Load bookmarks
      const storedBookmarks = localStorage.getItem(`bookmarks_qa_${grade}_${subject}_${chapter}`);
      if (storedBookmarks) {
        setBookmarkedIds(JSON.parse(storedBookmarks));
      }

      getQAData(grade, subject, chapter).then((data) => {
        if (data) {
          setQaData(data);
          // By default, expand first two questions
          if (data.questions.length > 0) {
            setExpandedIds(data.questions.slice(0, 2).map((q) => q.id));
          }
        }
        setLoading(false);
      });
    }
  }, [grade, subject, chapter]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    if (!qaData) return;
    setExpandedIds(qaData.questions.map((q) => q.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem(`bookmarks_qa_${grade}_${subject}_${chapter}`, JSON.stringify(updated));
  };

  const copyAnswer = (q: QAQuestion, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `प्रश्न: ${q.questionHi || q.question}\n\nउत्तर: ${q.answerHi || q.answer}\n\nमुख्य बिंदु:\n${(q.keyPoints || []).map((p) => `• ${p}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredQuestions = (qaData?.questions || []).filter((q) => {
    const matchesFilter = 
      filterType === "all" ? true :
      filterType === "bookmarked" ? bookmarkedIds.includes(q.id) :
      q.type === filterType;

    const matchesSearch = searchQuery.trim() === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.questionHi && q.questionHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.answerHi && q.answerHi.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const cleanSubjectName = subject.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const cleanChapterNum = chapter.replace("chapter-", "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#FAF6ED] to-[#F3EFE6] font-sans pb-24 text-slate-800 relative">
      
      {/* Decorative Classroom Grid Accent */}
      <div className="absolute top-0 left-0 right-0 h-[380px] bg-[linear-gradient(to_right,#e2dfd7_1px,transparent_1px),linear-gradient(to_bottom,#e2dfd7_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-40 pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto pt-10 px-4 relative z-10 print:pt-2 print:px-0">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href={`/content/${grade}/${subject}/${chapter}`}
            className="inline-flex items-center gap-2 bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            Back to Chapter Hub
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Print / Save PDF
            </button>

            <button
              onClick={() => {
                if (filteredQuestions.length > 0) {
                  setCurrentSlideIndex(0);
                  setIsSmartScreenOpen(true);
                }
              }}
              disabled={filteredQuestions.length === 0}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-950/15 transition-all"
            >
              <Tv className="w-4 h-4 text-emerald-300" />
              Classroom Presentation Mode
            </button>
          </div>
        </div>

        {/* Header Banner */}
        <div className="mb-8 bg-white/80 border border-slate-200/70 p-6 sm:p-8 rounded-3xl shadow-sm backdrop-blur-md relative overflow-hidden print:shadow-none print:border-none print:p-0 print:mb-4">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-800/5 rounded-bl-full pointer-events-none" />

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{grade.replace("-", " ")} • {cleanSubjectName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
              {qaData?.chapterTitle || `Chapter ${cleanChapterNum} Question Bank`}
            </h1>
            {qaData?.chapterTitleHi && (
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 font-serif">
                {qaData.chapterTitleHi} — लघु एवं दीर्घ प्रश्नोत्तर
              </h2>
            )}

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium pt-1">
              NCERT curriculum solutions equipped with bilingual answers, marking schemes, and whiteboard teaching points designed specifically for classroom instruction.
            </p>
          </div>
        </div>

        {/* Controls & Search Bar */}
        <div className="bg-white/90 border border-slate-200/80 p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Questions", hi: "सभी प्रश्न" },
              { id: "short", label: "Short Answer", hi: "लघु उत्तरीय (2 अंक)" },
              { id: "long", label: "Long Answer", hi: "दीर्घ उत्तरीय (5 अंक)" },
              { id: "value-based", label: "Value Based", hi: "मूल्यपरक प्रश्न" },
              { id: "bookmarked", label: `Bookmarked (${bookmarkedIds.length})`, hi: "चिह्नित" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  filterType === tab.id
                    ? "bg-emerald-800 text-white shadow-sm shadow-emerald-900/20"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal ${filterType === tab.id ? "text-emerald-200" : "text-slate-400"}`}>
                  ({tab.hi})
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-700 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Global Expand/Collapse actions */}
        <div className="flex justify-between items-center mb-4 px-1 print:hidden">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Showing {filteredQuestions.length} of {qaData?.questions.length || 0} Questions
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={expandAll}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline transition-colors"
            >
              Expand All Answers
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={collapseAll}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 underline transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-600">Loading Question Answers & Classroom Notes...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No matching questions found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or switching the question filter category above.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setFilterType("all"); }}
              className="mt-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedIds.includes(q.id);
              const isBookmarked = bookmarkedIds.includes(q.id);

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden print:border-b print:shadow-none print:mb-6"
                >
                  {/* Question Header Bar */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none bg-slate-50/50 hover:bg-slate-50/90 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-emerald-800 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                          Q{idx + 1} • {q.marks} Marks
                        </span>
                        
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                          q.type === "short" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          q.type === "long" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {q.type === "short" ? "लघु उत्तरीय (Short Answer)" :
                           q.type === "long" ? "दीर्घ उत्तरीय (Long Answer)" :
                           "मूल्यपरक (Value-Based)"}
                        </span>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          q.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700" :
                          q.difficulty === "Medium" ? "bg-amber-50 text-amber-700" :
                          "bg-rose-50 text-rose-700"
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif leading-snug pt-1">
                        {q.questionHi || q.question}
                      </h3>
                      {q.questionHi && q.question && (
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                          ({q.question})
                        </p>
                      )}
                    </div>

                    {/* Action Buttons right */}
                    <div className="flex items-center gap-2 shrink-0 pt-1 print:hidden">
                      <button
                        onClick={(e) => toggleBookmark(q.id, e)}
                        className={`p-2 rounded-xl transition-all ${
                          isBookmarked 
                            ? "bg-amber-100 text-amber-700 scale-105" 
                            : "bg-white border border-slate-200 text-slate-400 hover:text-slate-600"
                        }`}
                        title="Bookmark question"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Model Answer Section */}
                  <AnimatePresence>
                    {(isExpanded || typeof window === "undefined") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-200/80 bg-white p-5 sm:p-6 space-y-5"
                      >
                        {/* Whiteboard Teaching Points Box */}
                        {q.keyPoints && q.keyPoints.length > 0 && (
                          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-5 rounded-2xl shadow-inner space-y-3">
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                              <Sparkles className="w-4 h-4" />
                              <span>बोर्ड पर लिखने हेतु प्रमुख बिंदु (Chalkboard Key Points)</span>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-emerald-100/95">
                              {q.keyPoints.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                                  <span className="text-amber-400 font-bold">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Complete Model Answer */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              आदर्श उत्तर (Model Answer Solution):
                            </span>

                            <button
                              onClick={(e) => copyAnswer(q, e)}
                              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-all print:hidden"
                            >
                              {copiedId === q.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Solution</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl text-slate-800 text-sm sm:text-base leading-relaxed font-serif font-medium space-y-3">
                            <p className="whitespace-pre-line">{q.answerHi || q.answer}</p>
                            {q.answerHi && q.answer && (
                              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 font-sans not-italic font-normal">
                                <span className="font-bold text-slate-700">English Summary: </span>
                                {q.answer}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* 📺 CLASSROOM PRESENTATION SMART SCREEN MODE */}
      <AnimatePresence>
        {isSmartScreenOpen && filteredQuestions.length > 0 && (
          <div className="fixed inset-0 z-50 bg-[#0C1E12] text-emerald-100 flex flex-col p-6 sm:p-10 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#09160d_1px,transparent_1px),linear-gradient(to_bottom,#09160d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 z-0" />

            {/* Top Toolbar */}
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <Tv className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-wide">Q&A CLASSROOM PROJECTION</h4>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    {qaData?.chapterTitleHi || qaData?.chapterTitle} • Question {currentSlideIndex + 1} of {filteredQuestions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-emerald-950 border border-emerald-800 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl">
                  {filteredQuestions[currentSlideIndex].marks} Marks
                </span>
                <button
                  onClick={() => setIsSmartScreenOpen(false)}
                  className="bg-red-900/30 hover:bg-red-950 border border-red-900 text-red-300 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <X className="w-4 h-4" /> Exit Projection
                </button>
              </div>
            </div>

            {/* Slide Content */}
            <div className="flex-1 flex flex-col justify-center items-center py-6 relative z-10 max-w-5xl mx-auto w-full overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full space-y-6 text-left"
                >
                  {/* Question Box */}
                  <div className="bg-emerald-950/70 border border-emerald-800/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                      प्रश्न {currentSlideIndex + 1}:
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
                      {filteredQuestions[currentSlideIndex].questionHi || filteredQuestions[currentSlideIndex].question}
                    </h2>
                  </div>

                  {/* Chalkboard Key Points */}
                  {filteredQuestions[currentSlideIndex].keyPoints && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredQuestions[currentSlideIndex].keyPoints?.map((pt, pIdx) => (
                        <div key={pIdx} className="bg-amber-950/40 border border-amber-800/40 p-4 rounded-2xl flex items-center gap-3">
                          <span className="text-amber-400 font-black text-lg">•</span>
                          <span className="text-sm sm:text-lg font-bold text-amber-100">{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Model Answer Box */}
                  <div className="bg-emerald-900/40 border border-emerald-800/40 p-6 sm:p-8 rounded-3xl space-y-2">
                    <span className="text-xs font-black text-emerald-300 uppercase tracking-widest block">
                      आदर्श उत्तर (Model Answer):
                    </span>
                    <p className="text-lg sm:text-2xl text-emerald-100 font-serif leading-relaxed whitespace-pre-line">
                      {filteredQuestions[currentSlideIndex].answerHi || filteredQuestions[currentSlideIndex].answer}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center border-t border-emerald-900/60 pt-4 relative z-10">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="bg-emerald-900/50 hover:bg-emerald-900 border border-emerald-800/40 text-emerald-200 px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-40"
              >
                Previous Question
              </button>

              <span className="text-sm font-black text-emerald-400">
                {currentSlideIndex + 1} / {filteredQuestions.length}
              </span>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                disabled={currentSlideIndex === filteredQuestions.length - 1}
                className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600/40 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
