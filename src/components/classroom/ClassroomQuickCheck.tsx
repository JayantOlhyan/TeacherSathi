'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Check,
  CheckCircle2,
  Eye,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BarChart3,
  FileText,
  PlusCircle,
  Ticket,
  Pause,
  Play,
  StopCircle,
  PenTool,
  Lightbulb,
  FlaskConical,
  Users,
  ShieldCheck,
  Minus,
  Plus,
  TrendingUp
} from 'lucide-react';
import { getChapterQuickCheck, type QuickCheckItem } from '@/lib/data/classroomQuickChecks';

export interface ClassroomQuickCheckProps {
  isOpen: boolean;
  isDark?: boolean;
  grade?: string;
  gradeName?: string;
  subject?: string;
  subjectName?: string;
  chapter?: string;
  chapterTitle?: string;
  currentSlideIndex?: number;
  totalStudents?: number;
  onClose: () => void;
  onOpenWhiteboard: () => void;
  onOpenSaathi: (prompt?: string) => void;
  onViewAnalytics?: () => void;
}

export type QuickCheckStage = 'hub' | 'question' | 'distribution' | 'results' | 'reteach';

export function ClassroomQuickCheck({
  isOpen,
  isDark = true,
  grade = 'class-8',
  gradeName = 'Class 8',
  subject = 'science',
  subjectName = 'Science',
  chapter = 'chapter-3',
  chapterTitle = 'Heat & Thermodynamics',
  currentSlideIndex = 0,
  totalStudents = 24,
  onClose,
  onOpenWhiteboard,
  onOpenSaathi,
  onViewAnalytics,
}: ClassroomQuickCheckProps) {
  // Active stage within Quick Check flow
  const [stage, setStage] = useState<QuickCheckStage>('hub');
  const [activeCheck, setActiveCheck] = useState<QuickCheckItem>(() =>
    getChapterQuickCheck(grade, subject, chapter, chapterTitle)
  );

  // Question & student response state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [pollCounts, setPollCounts] = useState<{ [key: number]: number }>({ 0: 4, 1: 10, 2: 2, 3: 2 });
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [isHindi, setIsHindi] = useState<boolean>(false);

  // Stage 5: Re-teach & Recheck state
  const [recheckSelectedOption, setRecheckSelectedOption] = useState<number | null>(null);
  const [isRecheckAnswerRevealed, setIsRecheckAnswerRevealed] = useState<boolean>(false);
  const recheckVotes = { 0: 1, 1: 1, 2: 22, 3: 0 };

  // Sync active check when chapter changes
  useEffect(() => {
    setActiveCheck(getChapterQuickCheck(grade, subject, chapter, chapterTitle));
  }, [grade, subject, chapter, chapterTitle]);

  if (!isOpen) return null;

  // Calculate live voting statistics
  const totalResponses = Object.values(pollCounts).reduce((a, b) => a + b, 0);
  const responsePercentage = Math.min(100, Math.round((totalResponses / Math.max(1, totalStudents)) * 100));

  const recheckTotalResponses = Object.values(recheckVotes).reduce((a, b) => a + b, 0);
  const recheckCorrectPercentage = Math.round(((recheckVotes[2] || 0) / Math.max(1, recheckTotalResponses)) * 100);

  // Keyboard navigation shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'r' || e.key === 'R') {
      setIsAnswerRevealed((prev) => !prev);
    } else if (e.key === 'w' || e.key === 'W') {
      onOpenWhiteboard();
    }
  };

  const getOptionBadgeColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'blue':
        return 'bg-blue-600 text-white';
      case 'green':
        return 'bg-emerald-600 text-white';
      case 'orange':
      default:
        return 'bg-amber-500 text-white';
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 z-40 flex flex-col select-none overflow-hidden animate-fadeIn ${
        isDark ? 'bg-[#0B131E] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
      role="dialog"
      aria-label="Classroom Assessment and Interaction Hub"
    >
      {/* Top Header Bar */}
      <header
        className={`px-8 py-4 border-b flex items-center justify-between flex-shrink-0 ${
          isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {gradeName} • {subjectName} • Ch {activeCheck.chapter.replace(/\D/g, '') || '3'}
          </span>

          {stage !== 'hub' && (
            <span
              className={`text-xs sm:text-sm font-black px-3 py-1 rounded-lg border ${
                stage === 'distribution'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}
            >
              {stage === 'question' && `Question ${activeCheck.questionNumber} of ${activeCheck.totalQuestions}`}
              {stage === 'distribution' && '● Live Response Tracking'}
              {stage === 'results' && 'Quick Check Result'}
              {stage === 'reteach' && 'Re-teach & Recheck'}
            </span>
          )}
        </div>

        {/* Global Controls & Exit */}
        <div className="flex items-center gap-3">
          {/* Bilingual Toggle */}
          <button
            onClick={() => setIsHindi(!isHindi)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
              isHindi
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                : isDark
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isHindi ? 'English' : 'हिंदी'}
          </button>

          {/* Whiteboard Jump */}
          <button
            onClick={onOpenWhiteboard}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
            title="Open Whiteboard (w)"
          >
            <PenTool className="w-3.5 h-3.5 text-emerald-400" />
            <span>Whiteboard</span>
          </button>

          {/* Ask Saathi Jump */}
          <button
            onClick={() => onOpenSaathi(`Explain this concept simply for Class 8: ${activeCheck.questionText}`)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Saathi</span>
          </button>

          {/* Return to Slide View */}
          <button
            onClick={onClose}
            aria-label="Back to Slides"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Return to Lesson Slides"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 w-full overflow-y-auto p-6 sm:p-12 flex flex-col justify-center">
        {/* ========================================================================= */}
        {/* STAGE 1: QUICK CHECK HUB (Panel 1 from Specification)                      */}
        {/* ========================================================================= */}
        {stage === 'hub' && (
          <div className="max-w-5xl mx-auto w-full space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-3">
              <h2 className="text-4xl sm:text-6xl font-black font-serif tracking-tight text-current">
                {isHindi ? 'आइए अपनी समझ की जांच करें!' : "Let's check your understanding!"}
              </h2>
              <p className={`text-xl sm:text-2xl font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isHindi
                  ? 'यह देखने के लिए एक त्वरित प्रश्न कि हमने इस अवधारणा को कितनी अच्छी तरह समझा है।'
                  : 'A quick question to see how well we understand this concept.'}
              </p>
            </div>

            {/* 4 Launch Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Option 1: Start Quick Check */}
              <button
                onClick={() => setStage('question')}
                className="p-8 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center text-center gap-4 group cursor-pointer active:scale-98 min-h-[220px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">
                    {isHindi ? 'त्वरित जांच शुरू करें' : 'Start Quick Check'}
                  </h3>
                  <p className="text-purple-100 font-medium text-sm mt-1">
                    {isHindi ? 'अभी एक प्रश्न पूछें' : 'Ask a question now'}
                  </p>
                </div>
              </button>

              {/* Option 2: Use Existing Quiz */}
              <button
                onClick={() => setStage('question')}
                className={`p-8 rounded-3xl border transition-all flex flex-col items-center justify-center text-center gap-4 group cursor-pointer active:scale-98 min-h-[220px] ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-700 hover:border-blue-400 text-slate-100'
                    : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900 shadow-md'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">
                    {isHindi ? 'मौजूदा क्विज़ का उपयोग करें' : 'Use Existing Quiz'}
                  </h3>
                  <p className={`font-medium text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isHindi ? 'इस अध्याय से 5 प्रश्न' : 'From this chapter'}
                  </p>
                </div>
              </button>

              {/* Option 3: Create a Question with Saathi */}
              <button
                onClick={() => {
                  onOpenSaathi(`Generate a quick 1-question check for: ${activeCheck.chapterTitle}`);
                  setStage('question');
                }}
                className={`p-8 rounded-3xl border transition-all flex flex-col items-center justify-center text-center gap-4 group cursor-pointer active:scale-98 min-h-[220px] ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-700 hover:border-emerald-400 text-slate-100'
                    : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-900 shadow-md'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">
                    {isHindi ? 'एक प्रश्न बनाएं' : 'Create a Question'}
                  </h3>
                  <p className="text-emerald-500 font-bold text-sm mt-1 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>With Saathi</span>
                  </p>
                </div>
              </button>
            </div>

            {/* Bottom Exit Ticket Option & Side Callout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                onClick={() => setStage('question')}
                className={`px-8 py-5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-200'
                    : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800 shadow-xs'
                }`}
              >
                <Ticket className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <p className="font-black text-base">{isHindi ? 'निकास टिकट (Exit Ticket)' : 'Exit Ticket'}</p>
                  <p className="text-xs text-slate-400">
                    {isHindi ? 'आगे बढ़ने से पहले एक त्वरित प्रश्न' : 'One question before we move on'}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-3 text-right">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Small Checks</p>
                  <p className="text-xl font-black font-serif text-current">Big Learning!</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 font-medium">
              Quick, simple, teacher-controlled assessment.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: LARGE STUDENT ANSWER CHOICES (Panel 2 from Specification)        */}
        {/* ========================================================================= */}
        {stage === 'question' && (
          <div className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
            {/* Question Heading with icon */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  Concept Check • {activeCheck.chapterTitle} • Slide {currentSlideIndex + 1}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif leading-tight">
                {isHindi && activeCheck.questionTextHi ? activeCheck.questionTextHi : activeCheck.questionText}
              </h2>
            </div>

            {/* 4 Large Student Answer Choice Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {activeCheck.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isCorrect = isAnswerRevealed && opt.isCorrect;

                return (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-6 sm:p-7 rounded-3xl border text-left flex items-center gap-5 transition-all min-h-[96px] sm:min-h-[112px] cursor-pointer active:scale-98 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-400/40 shadow-xl'
                        : isChosen
                        ? isDark
                          ? 'bg-slate-800 text-emerald-300 border-emerald-400 ring-2 ring-emerald-400/40'
                          : 'bg-emerald-50 text-[#0F5B38] border-emerald-400 ring-2 ring-emerald-400/40'
                        : isDark
                        ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500'
                        : 'bg-white border-slate-300 hover:border-slate-400 shadow-md'
                    }`}
                  >
                    {/* Circle Letter Badge (Red, Blue, Green, Orange) */}
                    <span
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl flex-shrink-0 shadow-xs ${
                        isCorrect
                          ? 'bg-white text-emerald-700'
                          : getOptionBadgeColor(opt.color)
                      }`}
                    >
                      {opt.key}
                    </span>

                    {/* Answer Text */}
                    <span className="text-xl sm:text-2xl font-bold leading-snug flex-1">
                      {isHindi && opt.textHi ? opt.textHi : opt.text}
                    </span>

                    {isCorrect && <Check className="w-8 h-8 text-white flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60">
              <button
                onClick={() => setStage('hub')}
                className={`px-5 py-3 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Check</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border transition-all cursor-pointer ${
                    isAnswerRevealed
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAnswerRevealed ? 'Hide Answer' : 'Teacher: Reveal Answer'}</span>
                </button>

                <button
                  onClick={() => setStage('distribution')}
                  className="px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Live Distribution &rarr;</span>
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 font-medium">
              Big, bold, touch-friendly options for every student.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: LIVE RESPONSE DISTRIBUTION & TEACHER CONTROLS (Panel 3)          */}
        {/* ========================================================================= */}
        {stage === 'distribution' && (
          <div className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
            {/* Header with Live Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Live
                  </span>
                  <span className="text-xs font-bold text-slate-400">Class Response Tracker</span>
                </div>
                <h3 className="text-2xl font-black mt-1">
                  {isHindi && activeCheck.questionTextHi ? activeCheck.questionTextHi : activeCheck.questionText}
                </h3>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Class Cohort</p>
                <p className="text-xl font-black font-mono">{totalStudents} Students</p>
              </div>
            </div>

            {/* Split View: Left (Responses & Distribution) | Right (Teacher Controls) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Response Distribution Bars */}
              <div
                className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border space-y-6 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                {/* Responses Received Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-black">
                    <span>Responses received</span>
                    <span className="font-mono text-base">
                      {totalResponses} / {totalStudents} students ({responsePercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${responsePercentage}%` }}
                    />
                  </div>
                </div>

                {/* 4 Horizontal Response Distribution Bars */}
                <div className="space-y-4 pt-2">
                  {activeCheck.options.map((opt, idx) => {
                    const count = pollCounts[idx] || 0;
                    const pct = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
                    const isCorrect = isAnswerRevealed && opt.isCorrect;

                    return (
                      <div key={opt.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                                isCorrect ? 'bg-emerald-500 text-white' : getOptionBadgeColor(opt.color)
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="line-clamp-1">{opt.text}</span>
                            {isCorrect && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                                Correct
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm">
                              {count} ({pct}%)
                            </span>
                            {/* Teacher live +/- hands adjuster */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  setPollCounts((prev) => ({
                                    ...prev,
                                    [idx]: Math.max(0, (prev[idx] || 0) - 1),
                                  }))
                                }
                                className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  setPollCounts((prev) => ({
                                    ...prev,
                                    [idx]: (prev[idx] || 0) + 1,
                                  }))
                                }
                                className="w-6 h-6 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Distribution Fill Bar */}
                        <div className="w-full h-5 rounded-xl bg-slate-800/80 overflow-hidden flex items-center px-1">
                          <div
                            className={`h-3 rounded-lg transition-all duration-500 ${
                              opt.color === 'red'
                                ? 'bg-red-500'
                                : opt.color === 'blue'
                                ? 'bg-blue-500'
                                : opt.color === 'green'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.max(4, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-2 border-t border-slate-800">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isPaused
                      ? 'Responses paused by teacher.'
                      : totalResponses >= totalStudents
                      ? 'All students in cohort have responded.'
                      : 'Waiting for more student responses...'}
                  </span>
                </div>
              </div>

              {/* Right Column: Dedicated Teacher Controls (Strictly Separated!) */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between gap-6 ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-md'
                }`}
              >
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                    Teacher Controls
                  </h4>

                  <div className="space-y-3">
                    {/* Pause / Resume */}
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className={`w-full py-3.5 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isPaused
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      <span>{isPaused ? 'Resume Responses' : 'Pause Responses'}</span>
                    </button>

                    {/* Reveal Answer Button */}
                    <button
                      onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
                      className={`w-full py-3.5 px-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                        isAnswerRevealed
                          ? 'bg-emerald-600 text-white border border-emerald-400'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                    </button>

                    {/* View Insights & Remediation (Stage 4) */}
                    <button
                      onClick={() => setStage('results')}
                      className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>View Results & Insights</span>
                    </button>

                    {/* End Quick Check */}
                    <button
                      onClick={() => setStage('hub')}
                      className="w-full py-3 px-4 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <StopCircle className="w-4 h-4" />
                      <span>End Quick Check</span>
                    </button>
                  </div>
                </div>

                {/* Helper notice */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 space-y-1">
                  <p className="font-bold text-slate-200">You&apos;re in control.</p>
                  <p>Student interaction is separated from teacher controls. Reveal when you&apos;re ready.</p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 font-medium">
              Understand the class response pattern in seconds.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: OBSERVED DATA → SAATHI INSIGHT → SUGGESTED INTERVENTION (Panel 4) */}
        {/* ========================================================================= */}
        {stage === 'results' && (
          <div className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                  Diagnostic Formative Analysis
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif mt-0.5">
                  {activeCheck.questionText}
                </h3>
              </div>

              <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black">
                Quick Check Result
              </span>
            </div>

            {/* 3 Distinct Column Cards (Strict Separation of Observed vs Insight vs Action) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Observed Data (Amber Card) */}
              <div className="p-6 rounded-3xl border border-amber-400/40 bg-amber-500/10 text-amber-100 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4" />
                    <span>Observed Data (From this class)</span>
                  </div>
                  <ul className="mt-4 space-y-2.5 text-sm font-semibold text-amber-200/90">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span><strong>{totalResponses} of {totalStudents}</strong> students responded ({responsePercentage}%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span><strong>{pollCounts[1] || 10} students (56%)</strong> selected Option B</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>Only <strong>{pollCounts[2] || 2} students (11%)</strong> selected the correct answer (C)</span>
                    </li>
                  </ul>
                </div>
                <p className="text-[11px] text-amber-300/70 font-medium border-t border-amber-400/20 pt-3">
                  Empirical response pattern from this period.
                </p>
              </div>

              {/* Card 2: Saathi's Interpretation (Purple Card) */}
              <div className="p-6 rounded-3xl border border-purple-400/40 bg-purple-500/10 text-purple-100 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" />
                    <span>Saathi&apos;s Interpretation (Possible reason)</span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-purple-200/90 leading-relaxed">
                    {activeCheck.misconception.diagnosedText} They might think evaporation only happens at high temperatures or that boiling is restricted to the surface.
                  </p>
                </div>
                <p className="text-[11px] text-purple-300/70 font-medium border-t border-purple-400/20 pt-3">
                  Pedagogical hypothesis based on common NCERT misconceptions.
                </p>
              </div>

              {/* Card 3: Suggested Intervention (Green Card) */}
              <div className="p-6 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Suggested Intervention (2–5 minutes)</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs font-semibold text-emerald-200/90">
                    {activeCheck.intervention.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-[11px] text-emerald-300/70 font-medium border-t border-emerald-400/20 pt-3">
                  Concrete classroom action to resolve the hurdle.
                </p>
              </div>
            </div>

            {/* Bottom Action Ribbon with Saathi Integration */}
            <div
              className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Ask Saathi</p>
                  <p className="text-xs font-medium text-slate-300">
                    Get another explanation, activity, or follow-up question.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setStage('reteach')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Suggestion</span>
                </button>

                <button
                  onClick={onOpenWhiteboard}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Whiteboard</span>
                </button>

                <button
                  onClick={() => onOpenSaathi(`Suggest another real-world Indian example for ${activeCheck.chapterTitle}`)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Another</span>
                </button>
              </div>
            </div>

            {/* Provenance Tag */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI generated draft. Consequential actions require teacher approval.</span>
              </span>
              <span>From data to understanding to action — with the teacher in control.</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: RE-TEACH AND RECHECK (Panel 5 from Specification)                 */}
        {/* ========================================================================= */}
        {stage === 'reteach' && (
          <div className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  Closing the Classroom Learning Loop
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif mt-0.5">
                  Re-teach & Quick Recheck
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Teach → Check → Understand → Respond → Check Again
              </span>
            </div>

            {/* 3 Sequential Steps (Side-by-side or stacked) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Step 1: Re-teach Visual Comparison */}
              <div
                className={`p-6 rounded-3xl border space-y-4 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-black text-base">Re-teach (2–5 mins)</h4>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-2">
                  <p className="font-black text-blue-300 text-sm">{activeCheck.intervention.diagramTitle}</p>
                  <div className="space-y-2 pt-1 text-slate-300">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <p className="font-bold text-emerald-400">{activeCheck.intervention.diagramLeft.title}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">{activeCheck.intervention.diagramLeft.description}</p>
                      <p className="text-[10px] text-slate-400 italic mt-1">Ex: {activeCheck.intervention.diagramLeft.example}</p>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <p className="font-bold text-amber-400">{activeCheck.intervention.diagramRight.title}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">{activeCheck.intervention.diagramRight.description}</p>
                      <p className="text-[10px] text-slate-400 italic mt-1">Ex: {activeCheck.intervention.diagramRight.example}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenWhiteboard}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Draw this on Whiteboard</span>
                </button>
              </div>

              {/* Step 2: Quick Recheck Question */}
              <div
                className={`p-6 rounded-3xl border space-y-4 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-black text-base">Quick Recheck</h4>
                </div>

                <p className="text-xs font-bold text-slate-200 leading-snug">
                  {activeCheck.recheckQuestion.questionText}
                </p>

                <div className="space-y-1.5">
                  {activeCheck.recheckQuestion.options.map((opt, i) => {
                    const isChosen = recheckSelectedOption === i;
                    const isCorrect = isRecheckAnswerRevealed && opt.isCorrect;

                    return (
                      <button
                        key={opt.key}
                        onClick={() => setRecheckSelectedOption(i)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : isChosen
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-xs font-black">
                          {opt.key}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isCorrect && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setIsRecheckAnswerRevealed(!isRecheckAnswerRevealed)}
                  className="w-full py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isRecheckAnswerRevealed ? 'Hide Recheck Answer' : 'Reveal Recheck Answer'}</span>
                </button>
              </div>

              {/* Step 3: Improved Understanding (Celebration & Continuation) */}
              <div
                className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="font-black text-base">Improved Understanding</h4>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-3">
                    <div className="flex items-center justify-between font-black">
                      <span className="text-emerald-400">Recheck Result</span>
                      <span className="font-mono text-sm text-emerald-300">
                        {recheckCorrectPercentage}% ({activeCheck.recheckQuestion.improvedCohortCount} / {activeCheck.recheckQuestion.totalCohort} students)
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${activeCheck.recheckQuestion.improvedPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-start gap-2 pt-1 text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Great improvement!</p>
                        <p className="text-[11px] text-emerald-300/80">Most students now understand the concept.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <span>Continue to Next Slide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {onViewAnalytics && (
                    <button
                      onClick={onViewAnalytics}
                      className="w-full py-2 text-center text-[11px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      View Full Class Diagnostic Analytics &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 font-medium">
              Check, explain, and check again — a natural part of teaching. Progress Happens in the Classroom.
            </p>
          </div>
        )}
      </main>

      {/* Persistent Bottom Breadcrumb Ribbon */}
      <footer
        className={`px-8 py-3 border-t text-xs font-bold flex items-center justify-between flex-shrink-0 ${
          isDark ? 'border-slate-800 bg-[#080D14] text-slate-400' : 'border-slate-200 bg-white text-slate-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>Teach</span>
          <span>&rarr;</span>
          <span className={stage === 'hub' || stage === 'question' ? 'text-emerald-400 font-black' : ''}>Check</span>
          <span>&rarr;</span>
          <span className={stage === 'distribution' ? 'text-amber-400 font-black' : ''}>Observe</span>
          <span>&rarr;</span>
          <span className={stage === 'results' ? 'text-purple-400 font-black' : ''}>Understand</span>
          <span>&rarr;</span>
          <span className={stage === 'reteach' ? 'text-emerald-400 font-black' : ''}>Respond</span>
          <span>&rarr;</span>
          <span>Continue Teaching</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500">
            Phase 17 • Classroom Interaction & Assessment UX
          </span>
        </div>
      </footer>
    </div>
  );
}
export default ClassroomQuickCheck;
