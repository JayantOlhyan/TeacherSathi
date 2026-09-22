'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Network,
  ClipboardList,
  Compass,
  CheckCircle2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import type { PresentationSlide } from '@/lib/validations/resources';

export interface ClassroomResourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: PresentationSlide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  chapterTitle?: string;
  theme?: 'dark' | 'light';
}

export function ClassroomResourceDrawer({
  isOpen,
  onClose,
  slides,
  currentSlideIndex,
  onSelectSlide,
  chapterTitle = 'Chapter Resources',
  theme = 'dark',
}: ClassroomResourceDrawerProps) {
  const [activeTab, setActiveTab] = useState<'slides' | 'notes' | 'mindmap'>('slides');

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-label="Chapter Resources & Slide Deck Drawer"
    >
      <div
        className={`w-full max-w-2xl h-full flex flex-col shadow-2xl border-l transition-colors duration-200 animate-slideLeft ${
          isDark
            ? 'bg-[#0B131E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black font-serif tracking-tight">Chapter Resources</h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {chapterTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Resource Drawer"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          className={`px-6 py-3 border-b flex items-center gap-2 overflow-x-auto flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]/50' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={() => setActiveTab('slides')}
            className={`min-h-[48px] px-5 rounded-xl text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'slides'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Slide Deck ({slides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`min-h-[48px] px-5 rounded-xl text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Teacher Lesson Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('mindmap')}
            className={`min-h-[48px] px-5 rounded-xl text-sm font-black flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mindmap'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Mind Map Summary</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === 'slides' && (
            <div className="space-y-3 animate-fadeIn">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Tap any slide to jump directly on smartboard:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {slides.map((s, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectSlide(idx);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all min-h-[64px] cursor-pointer active:scale-98 ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
                          : isDark
                          ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-800'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border ${
                            isActive
                              ? 'bg-white text-emerald-800 border-white'
                              : isDark
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-base line-clamp-1">{s.title}</p>
                          <span className={`text-xs uppercase tracking-wider font-extrabold ${
                            isActive ? 'text-emerald-100' : 'text-emerald-500'
                          }`}>
                            {s.type}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-5 animate-fadeIn">
              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Period 1 Learning Goals</span>
                </div>
                <ul className="space-y-2 text-base font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Differentiate Kharif (monsoon) vs Rabi (winter) crops with examples.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Explain agricultural significance of tilling and soil aeration.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Compare water efficiency of drip vs sprinkler irrigation.</span>
                  </li>
                </ul>
              </div>

              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="text-amber-500 font-black text-xs uppercase tracking-wider">
                  Common Student Misconceptions
                </div>
                <p className={`text-base font-medium leading-relaxed ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
                  Students often assume chemical fertilisers are always better than manure because crops grow faster initially. Emphasize that excess synthetic fertilizers kill earthworms, decrease soil water retention, and cause long-term soil alkalinity.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="space-y-4 animate-fadeIn">
              <div
                className={`p-6 rounded-2xl border space-y-3 font-mono text-sm leading-relaxed ${
                  isDark ? 'bg-slate-900 border-slate-800 text-emerald-300' : 'bg-slate-900 text-emerald-300'
                }`}
              >
                <div className="text-xs font-sans uppercase tracking-wider text-slate-400 font-black pb-2 border-b border-slate-800">
                  Chapter Concept Hierarchy
                </div>
                <pre className="whitespace-pre-wrap font-mono">
{`Crop Production & Management
├── 1. Crop Types
│   ├── Kharif (Rainy: Paddy, Maize, Cotton)
│   └── Rabi (Winter: Wheat, Mustard, Gram)
├── 2. Agricultural Practices
│   ├── Soil Preparation (Tilling & Ploughing)
│   ├── Sowing (Seed selection & depth)
│   ├── Manure & Fertilisers (NPK vs Organic)
│   └── Irrigation (Drip & Sprinkler)
└── 3. Harvesting & Storage
    ├── Threshing & Winnowing
    └── Silos & Granaries`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex items-center justify-end flex-shrink-0 ${
            isDark ? 'border-slate-800 bg-[#080D14]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className="min-h-[58px] sm:min-h-[64px] px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Back to Presentation &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
export default ClassroomResourceDrawer;
