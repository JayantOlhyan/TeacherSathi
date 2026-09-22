'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Lightbulb,
  Target,
  Zap,
  Languages,
  Compass,
  HelpCircle,
  Copy,
  Check
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
  const [activePromptTab, setActivePromptTab] = useState<'suggestion' | 'hindi' | 'analogy' | 'check'>('suggestion');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Pedagogical suggestion generator based on slide type & topic
  const getSlidePedagogicalContext = () => {
    const title = currentSlide?.title || chapterTitle;

    switch (currentSlide?.type) {
      case 'TITLE':
        return {
          suggestion: 'Engage prior knowledge before introducing technical terminology.',
          why: 'Students anchor new concepts better when connected to their home environment or seasonal experiences.',
          action: 'Ask students: "Who has visited a farm during monsoon vs winter? What differences did you notice in crops?"',
          hindiText: 'पाठ शुरू करने से पहले बच्चों से उनके वास्तविक अनुभव पूछें कि खरीफ (वर्षा) और रबी (सर्दियों) की फसलों में क्या अंतर देखा है।',
          analogy: 'Imagine preparing the ground before laying foundation of a house. Preparing soil is the same foundational step.',
          checkQuestion: 'Which crop season begins in June with the onset of monsoon?',
        };
      case 'QUESTION':
        return {
          suggestion: 'Do not reveal the answer immediately. Conduct a 30-second peer discussion first.',
          why: 'Peer instruction increases active learning and forces students to verbalize scientific reasoning.',
          action: 'Say: "Turn to your partner for 30 seconds and agree on why option B or C is the most accurate."',
          hindiText: 'सीधे उत्तर न बताएं। छात्रों से कहें कि वे अपने बगल वाले सहपाठी से 30 सेकंड बात करें और सही विकल्प का कारण तय करें।',
          analogy: 'Think of soil as a sponge: manure adds tiny organic pockets that hold moisture longer than synthetic salts.',
          checkQuestion: 'Why does excessive chemical fertilizer damage soil microbiology over time?',
        };
      case 'ACTIVITY':
        return {
          suggestion: 'Demonstrate the physical phenomenon live at the teacher desk or call 2 student volunteers.',
          why: 'Observing hollow floating seeds vs sunken viable seeds creates an unforgettable visual anchor.',
          action: 'Call roll number 8 & 14 to inspect the water beaker. Ask them to describe aloud to the class what they see.',
          hindiText: 'दो छात्रों को आगे बुलाकर बीकर में तैरते हुए खोखले बीजों को देखने दें और पूरी कक्षा को जोर से बताने कहें।',
          analogy: 'Like an empty dry bottle floats while a full one sinks, insect-eaten hollow seeds become lighter and float on water.',
          checkQuestion: 'If seeds float on water, does that prove they are damaged or healthy?',
        };
      case 'SUMMARY':
        return {
          suggestion: 'Have students summarize 1 takeaway each without looking at their notebooks.',
          why: 'Active recall strengthens long-term synaptic consolidation far better than passive reading.',
          action: 'Pick 3 students across different rows to each explain one bullet point in their mother tongue.',
          hindiText: 'कक्षा के अलग-अलग कोनों से 3 विद्यार्थियों को खड़ा करें और बिना कॉपी देखे एक-एक मुख्य बिंदु अपनी भाषा में दोहराने को कहें।',
          analogy: 'A summary is like a harvest festival: gathering all the fruits of today’s hard learning into one storehouse.',
          checkQuestion: 'Name two Kharif crops and two Rabi crops without looking at the board.',
        };
      default:
        return {
          suggestion: `Anchor "${title}" with an everyday observation before presenting definitions.`,
          why: 'Reduces cognitive load and bridges NCERT textbook terminology with rural and semi-urban daily reality.',
          action: `Point to the diagram and ask: "Why does the farmer till soil before sowing, rather than after?"`,
          hindiText: `"${title}" को कक्षा में बच्चों के रोज़मर्रा के अनुभवों से जोड़कर सरल भाषा में समझाइए।`,
          analogy: 'Drip irrigation delivers water drop-by-drop like medicine in an IV drip: zero waste, directly where needed.',
          checkQuestion: 'In sandy soils with water shortage, why is drip irrigation far superior to furrow flooding?',
        };
    }
  };

  const context = getSlidePedagogicalContext();

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-label="Saathi Classroom Pedagogical Assistant"
    >
      <div
        className={`w-full max-w-2xl h-full flex flex-col shadow-2xl border-l transition-colors duration-200 animate-slideLeft ${
          isDark
            ? 'bg-[#0B131E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`p-6 border-b flex items-center justify-between flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-serif tracking-tight">Saathi Classroom Co-Pilot</h3>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Pedagogical Assist
                </span>
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Slide {slideIndex + 1} • {currentSlide?.title || chapterTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Saathi Drawer"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Action Prompt Tabs */}
        <div
          className={`px-6 py-3 border-b flex items-center gap-2 overflow-x-auto flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]/50' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={() => setActivePromptTab('suggestion')}
            className={`min-h-[48px] px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activePromptTab === 'suggestion'
                ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Pedagogical Tip</span>
          </button>

          <button
            onClick={() => setActivePromptTab('hindi')}
            className={`min-h-[48px] px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activePromptTab === 'hindi'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>सरल हिंदी</span>
          </button>

          <button
            onClick={() => setActivePromptTab('analogy')}
            className={`min-h-[48px] px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activePromptTab === 'analogy'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Village Analogy</span>
          </button>

          <button
            onClick={() => setActivePromptTab('check')}
            className={`min-h-[48px] px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activePromptTab === 'check'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Oral Question</span>
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          {activePromptTab === 'suggestion' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Card 1: Suggestion */}
              <div
                className={`p-6 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Classroom Suggestion</span>
                </div>
                <p className={`text-xl font-bold leading-relaxed ${isDark ? 'text-amber-100' : 'text-amber-950'}`}>
                  {context.suggestion}
                </p>
              </div>

              {/* Card 2: Why this helps */}
              <div
                className={`p-6 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-blue-950/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2 text-blue-500 font-black text-sm uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Why This Helps Learning</span>
                </div>
                <p className={`text-lg font-medium leading-relaxed ${isDark ? 'text-blue-100' : 'text-blue-950'}`}>
                  {context.why}
                </p>
              </div>

              {/* Card 3: Action for Teacher */}
              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-500 font-black text-sm uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>Action for Teacher (Say This Now)</span>
                  </div>
                  <button
                    onClick={() => handleCopy(context.action)}
                    className="text-xs flex items-center gap-1 font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className={`text-xl font-extrabold leading-relaxed ${isDark ? 'text-emerald-100' : 'text-emerald-950'}`}>
                  &ldquo;{context.action}&rdquo;
                </p>
              </div>
            </div>
          )}

          {activePromptTab === 'hindi' && (
            <div className="space-y-6 animate-fadeIn">
              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-500 font-black text-sm uppercase tracking-wider">
                  <Languages className="w-4 h-4" />
                  <span>सरल हिंदी व्याख्या (Bilingual Explanation)</span>
                </div>
                <p className={`text-2xl font-bold leading-relaxed ${isDark ? 'text-emerald-100' : 'text-emerald-950'}`}>
                  {context.hindiText}
                </p>
                <p className={`text-sm pt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  कक्षा में सहजता बनाए रखने के लिए तकनीकी शब्दों के साथ-साथ इस व्याख्या का उपयोग करें।
                </p>
              </div>
            </div>
          )}

          {activePromptTab === 'analogy' && (
            <div className="space-y-6 animate-fadeIn">
              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-blue-950/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2 text-blue-500 font-black text-sm uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Everyday Ground Reality Analogy</span>
                </div>
                <p className={`text-2xl font-bold leading-relaxed ${isDark ? 'text-blue-100' : 'text-blue-950'}`}>
                  &ldquo;{context.analogy}&rdquo;
                </p>
                <p className={`text-sm pt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Use this mental model to help students retain the principle before memorizing textbook definitions.
                </p>
              </div>
            </div>
          )}

          {activePromptTab === 'check' && (
            <div className="space-y-6 animate-fadeIn">
              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-center gap-2 text-purple-500 font-black text-sm uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Quick 1-Minute Oral Check Question</span>
                </div>
                <p className={`text-2xl font-bold leading-relaxed ${isDark ? 'text-purple-100' : 'text-purple-950'}`}>
                  &ldquo;{context.checkQuestion}&rdquo;
                </p>
                <p className={`text-sm pt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ask the entire class to show thumbs up / down or call a student in the rear row to check distance retention.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Big Dismiss Button (>= 64px) */}
        <div
          className={`p-6 border-t flex items-center justify-between flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            TeacherSathi Pedagogical Shield • Educator Always In Control
          </span>
          <button
            onClick={onClose}
            className="min-h-[58px] sm:min-h-[64px] px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Continue Teaching &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
export default SaathiClassroomDrawer;
