'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Target,
  Zap,
  Check,
  Send,
  RotateCcw
} from 'lucide-react';
import type { PresentationSlide } from '@/lib/validations/resources';

export interface SaathiClassroomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide?: PresentationSlide;
  slideIndex: number;
  chapterTitle?: string;
  theme?: 'dark' | 'light';
}

export function SaathiClassroomDrawer({
  isOpen,
  onClose,
  currentSlide,
  slideIndex,
  chapterTitle = 'NCERT Science Lesson',
  theme = 'dark',
}: SaathiClassroomDrawerProps) {
  const [activePrompt, setActivePrompt] = useState<string>('explain');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [customResponse, setCustomResponse] = useState<string | null>(null);
  const [usedSuccess, setUsedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const slideTitle = currentSlide?.title || 'Active Slide';

  // Context-specific explanation based on active slide
  const getSlideContent = () => {
    switch (activePrompt) {
      case 'hindi':
        return {
          title: 'सरल हिंदी व्याख्या:',
          explanation: `सरल शब्दों में: ${slideTitle} वह प्रक्रिया है जिसे विद्यार्थी अपने वास्तविक दैनिक अनुभवों से समझ सकते हैं। इसमें जटिल वैज्ञानिक नियमों को घर-गांव के उदाहरणों से जोड़कर सिखाया जाता है।`,
          whyThisHelps: 'Uses simple, familiar vernacular so all students understand the fundamental scientific mechanism.',
          action: 'छात्रों से कहें: "क्या आपने अपने आस-पास ऐसा देखा है? 1 मिनट में अपने सहपाठी को बताएं।"',
        };
      case 'analogy':
        return {
          title: 'Real-Life Classroom Analogy:',
          explanation: `Think of ${slideTitle} like domestic water filtration: small pores allow clean moisture to pass while keeping impurities behind. Selective flow ensures healthy growth.`,
          whyThisHelps: 'Bridges abstract NCERT diagrams with an intuitive, memorable mental model.',
          action: 'Ask students: "Why do we use a sieve for flour or a filter for tea? How does this slide work the same way?"',
        };
      case 'tip':
        return {
          title: 'Teaching Tip for this Slide:',
          explanation: `Do not explain definitions immediately. Point to the central diagram on the 75" screen and ask the back row what visual difference they spot first.`,
          whyThisHelps: 'Engages back-row students and encourages active visual observation before reading text.',
          action: 'Ask roll number 12 in the back row to describe the labeled parts in their own words.',
        };
      case 'explain':
      default:
        return {
          title: "Here's a simpler explanation:",
          explanation: `In simple terms: ${slideTitle} explains the step-by-step mechanism where individual parts interact to produce a balanced natural outcome. When each part functions correctly, healthy growth occurs.`,
          whyThisHelps: 'Uses simple language and a clear mental model suitable for middle school students.',
          action: `Say to class: "Look at the screen: notice how step 1 directly leads to step 2. Who can tell me what happens if step 1 is missed?"`,
        };
    }
  };

  const activeContent = customResponse ? {
    title: "Saathi's response:",
    explanation: customResponse,
    whyThisHelps: 'Tailored answer aligned with NCERT Class 8 curriculum.',
    action: 'Use this explanation to clarify concepts with students.',
  } : getSlideContent();

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    if (customQuery.toLowerCase().includes('hindi') || /[\u0900-\u097F]/.test(customQuery)) {
      setCustomResponse(`सरल हिंदी में: "${customQuery}" का सीधा अर्थ है कि विद्यार्थी इसे सहजता से सीखें। मुख्य विचार यह है कि बुनियादी सिद्धांतों को बिना किसी भ्रम के स्पष्ट किया जाए।`);
    } else {
      setCustomResponse(`Here is a clear classroom explanation for "${customQuery}": Focus on the core scientific principle first, demonstrate with a quick 30-second sketch on the whiteboard, and verify comprehension with an oral question.`);
    }
    setCustomQuery('');
  };

  const handleUseClick = () => {
    setUsedSuccess(true);
    setTimeout(() => {
      setUsedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-2xs animate-fadeIn"
      role="dialog"
      aria-label="Saathi Classroom Pedagogical Assistant"
    >
      {/* Compact 75" Side Drawer (Panel 3 from Design: Keeps Lesson Visible on Left) */}
      <div
        className={`w-full max-w-md sm:max-w-lg h-full flex flex-col shadow-2xl border-l transition-colors duration-200 animate-slideLeft ${
          isDark
            ? 'bg-[#0B131E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header with Context Badges */}
        <div
          className={`p-5 border-b flex items-start justify-between flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-emerald-50/60'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black font-serif tracking-tight">Saathi</h3>
            </div>

            {/* Hierarchical Context Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Class 8
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Science
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {chapterTitle.length > 20 ? `${chapterTitle.slice(0, 18)}...` : chapterTitle}
              </span>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Slide {slideIndex + 1} - {slideTitle}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Saathi Drawer"
            className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Tap Prompt Chips */}
        <div
          className={`px-5 py-3 border-b flex items-center gap-1.5 overflow-x-auto flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]/60' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={() => {
              setCustomResponse(null);
              setActivePrompt('explain');
            }}
            className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activePrompt === 'explain' && !customResponse
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Explain differently
          </button>

          <button
            onClick={() => {
              setCustomResponse(null);
              setActivePrompt('analogy');
            }}
            className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activePrompt === 'analogy' && !customResponse
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Real-life example
          </button>

          <button
            onClick={() => {
              setCustomResponse(null);
              setActivePrompt('tip');
            }}
            className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activePrompt === 'tip' && !customResponse
                ? 'bg-amber-500 text-gray-950 border-amber-300 shadow-sm'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Teaching tip
          </button>

          <button
            onClick={() => {
              setCustomResponse(null);
              setActivePrompt('hindi');
            }}
            className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activePrompt === 'hindi' && !customResponse
                ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Translate to Hindi
          </button>
        </div>

        {/* Structured Response Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeContent.title}</span>
            </div>

            <p className={`text-base font-semibold leading-relaxed ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {activeContent.explanation}
            </p>

            {/* Why this helps */}
            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              isDark ? 'bg-blue-950/20 border-blue-500/30 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-950'
            }`}>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Why this helps:</span>
              </div>
              <p className="font-medium">{activeContent.whyThisHelps}</p>
            </div>

            {/* Try this with students */}
            {activeContent.action && (
              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Action for Teacher:</span>
                </div>
                <p className="font-semibold">{activeContent.action}</p>
              </div>
            )}

            {/* Actions: [Use] [Try Another] */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleUseClick}
                className="min-h-[48px] px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{usedSuccess ? 'Applied!' : 'Use'}</span>
              </button>

              <button
                onClick={() => {
                  setCustomResponse(null);
                  setActivePrompt((prev) => (prev === 'explain' ? 'analogy' : prev === 'analogy' ? 'tip' : 'explain'));
                }}
                className={`min-h-[48px] px-4 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleCustomSubmit}
          className={`p-4 border-t flex items-center gap-2 flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-gray-50'
          }`}
        >
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ask another question..."
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={!customQuery.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
export default SaathiClassroomDrawer;
