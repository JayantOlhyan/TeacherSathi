'use client';

import React, { useState } from 'react';
import { PresentationSlide } from '@/lib/validations/resources';
import { 
  HelpCircle, 
  Users, 
  Image as ImageIcon, 
  Code2, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Eye,
  Check
} from 'lucide-react';

export interface SmartboardSlideViewerProps {
  slide: PresentationSlide;
  slideIndex: number;
  totalSlides: number;
  presentationTitle: string;
  theme?: 'dark' | 'light';
  onOptionSelect?: (optionIndex: number) => void;
}

export function SmartboardSlideViewer({
  slide,
  slideIndex,
  totalSlides,
  presentationTitle,
  theme = 'dark',
  onOptionSelect,
}: SmartboardSlideViewerProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const isDark = theme === 'dark';

  const handleOptionClick = (idx: number) => {
    setSelectedOption(idx);
    if (onOptionSelect) onOptionSelect(idx);
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-8 sm:p-12 md:p-14 select-none transition-colors duration-200 ${
        isDark
          ? 'bg-[#0B131E] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* 75" Smartboard Header Bar (Distance-legible identifiers) */}
      <div
        className={`flex items-center justify-between pb-5 border-b flex-shrink-0 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-4 h-4 rounded-full ${
              isDark ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'
            }`}
          />
          <span
            className={`text-base sm:text-lg font-black tracking-wide flex items-center gap-2.5 ${
              isDark ? 'text-emerald-400' : 'text-[#0F5B38]'
            }`}
          >
            <BookOpen className="w-6 h-6" /> {presentationTitle}
          </span>
          <span
            className={`text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider border ${
              isDark
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {slide.type}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`font-mono text-base sm:text-lg font-black px-4 py-1.5 rounded-full border ${
              isDark
                ? 'text-slate-100 bg-slate-800/90 border-slate-700'
                : 'text-slate-900 bg-white border-slate-300 shadow-sm'
            }`}
          >
            Slide {slideIndex + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Polymorphic Slide Body with 6–10m Distance Legibility (UX-009) */}
      <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 min-h-0 overflow-y-auto">
        
        {/* Type 1: TITLE SLIDE */}
        {slide.type === 'TITLE' && (
          <div className="text-center space-y-6 max-w-5xl mx-auto py-8 animate-fadeIn">
            <div
              className={`inline-flex items-center gap-2.5 text-base sm:text-lg font-black px-5 py-2.5 rounded-full border ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-emerald-100 text-[#0F5B38] border-emerald-300'
              }`}
            >
              <Sparkles className="w-5 h-5 text-emerald-500" />
              NCERT Canonical Curriculum Module
            </div>
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-serif tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p
                className={`text-2xl sm:text-3xl md:text-4xl font-bold max-w-4xl mx-auto leading-relaxed ${
                  isDark ? 'text-emerald-300' : 'text-[#0F5B38]'
                }`}
              >
                {slide.subtitle}
              </p>
            )}
            {slide.body && (
              <p
                className={`text-xl sm:text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {slide.body}
              </p>
            )}
          </div>
        )}

        {/* Type 2: CONTENT SLIDE */}
        {slide.type === 'CONTENT' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fadeIn">
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? 'text-emerald-300' : 'text-[#0F5B38]'
                }`}
              >
                {slide.subtitle}
              </p>
            )}
            {slide.body && (
              <p
                className={`text-2xl sm:text-3xl font-medium leading-relaxed ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                {slide.body}
              </p>
            )}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="space-y-5 pt-3">
                {slide.bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-4 text-2xl sm:text-3xl font-medium leading-relaxed ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full mt-3 flex-shrink-0 ${
                        isDark ? 'bg-emerald-400' : 'bg-[#0F5B38]'
                      }`}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Type 3: IMAGE SLIDE */}
        {slide.type === 'IMAGE' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fadeIn">
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title}
            </h2>
            <div
              className={`rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[420px] relative overflow-hidden border ${
                isDark
                  ? 'bg-slate-900/70 border-slate-700/60'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {slide.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="max-h-[400px] w-auto object-contain rounded-2xl shadow-xl"
                />
              ) : (
                <div
                  className={`flex flex-col items-center gap-4 ${
                    isDark ? 'text-emerald-300/70' : 'text-emerald-700'
                  }`}
                >
                  <ImageIcon className="w-28 h-28" />
                  <p className="text-xl sm:text-2xl font-bold">Curriculum Visual / Diagram Asset</p>
                </div>
              )}
              {slide.body && (
                <p
                  className={`mt-6 text-2xl sm:text-3xl text-center max-w-3xl leading-relaxed font-medium ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {slide.body}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Type 4: DIAGRAM / CODE SLIDE */}
        {slide.type === 'DIAGRAM' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fadeIn">
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title}
            </h2>
            {slide.body && (
              <p
                className={`text-2xl sm:text-3xl font-medium leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {slide.body}
              </p>
            )}
            <div
              className={`rounded-2xl p-6 sm:p-8 font-mono text-xl sm:text-2xl overflow-x-auto shadow-2xl border ${
                isDark
                  ? 'bg-[#070C14] border-slate-700/80 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-4 text-base sm:text-lg text-emerald-400/90 border-b border-slate-800 pb-2.5 font-bold">
                <Code2 className="w-6 h-6" /> Concept Syntax & Diagram Flow
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">
                {slide.diagram_code || '// Concept relationship flow'}
              </pre>
            </div>
          </div>
        )}

        {/* Type 5: QUESTION SLIDE (Clicker with Large Tactile Targets >= 72px) */}
        {slide.type === 'QUESTION' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fadeIn">
            <div className="flex items-center justify-between gap-4">
              <div
                className={`inline-flex items-center gap-2 text-base sm:text-lg font-black px-4 py-2 rounded-full border ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-amber-100 text-[#92400E] border-amber-300'
                }`}
              >
                <HelpCircle className="w-6 h-6 text-amber-500" />
                Classroom Concept Check Question
              </div>

              {typeof slide.correct_option_index === 'number' && (
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`min-h-[48px] px-4 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all border cursor-pointer ${
                    showAnswer
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>{showAnswer ? 'Hide Answer' : 'Teacher: Reveal Answer'}</span>
                </button>
              )}
            </div>

            <h2
              className={`text-3xl sm:text-5xl md:text-6xl font-black font-serif leading-snug ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.question_text || slide.title}
            </h2>

            {slide.question_options && slide.question_options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                {slide.question_options.map((option, idx) => {
                  const isCorrect = showAnswer && slide.correct_option_index === idx;
                  const isChosen = selectedOption === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      className={`p-6 sm:p-7 rounded-2xl border text-xl sm:text-2xl font-bold flex items-center gap-5 transition-all min-h-[72px] text-left cursor-pointer active:scale-98 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-400/30 shadow-xl'
                          : isChosen
                          ? isDark
                            ? 'bg-slate-800 text-emerald-300 border-emerald-400 ring-2 ring-emerald-400/40'
                            : 'bg-emerald-50 text-[#0F5B38] border-emerald-400 ring-2 ring-emerald-400/40'
                          : isDark
                          ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-100 border-slate-700 hover:border-emerald-400/50'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-emerald-500 shadow-sm'
                      }`}
                    >
                      <span
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0 border ${
                          isCorrect
                            ? 'bg-white text-emerald-700 border-white'
                            : isDark
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : 'bg-emerald-100 text-[#0F5B38] border-emerald-300'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                      {isCorrect && <Check className="w-8 h-8 text-white flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Type 6: ACTIVITY SLIDE */}
        {slide.type === 'ACTIVITY' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fadeIn">
            <div
              className={`inline-flex items-center gap-2 text-base sm:text-lg font-black px-4 py-2 rounded-full border ${
                isDark
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-amber-100 text-[#92400E] border-amber-300'
              }`}
            >
              <Users className="w-6 h-6 text-amber-500" />
              Collaborative Classroom Activity
            </div>
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl font-black font-serif ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title}
            </h2>
            <div
              className={`rounded-3xl p-6 sm:p-10 space-y-5 border ${
                isDark
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <p
                className={`text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed ${
                  isDark ? 'text-amber-100' : 'text-amber-950'
                }`}
              >
                {slide.activity_prompt || slide.body}
              </p>
              {slide.bullets && slide.bullets.length > 0 && (
                <div className="pt-4 space-y-4">
                  <span
                    className={`text-base sm:text-lg uppercase tracking-wider font-black block ${
                      isDark ? 'text-amber-300' : 'text-[#92400E]'
                    }`}
                  >
                    Instructions for Class:
                  </span>
                  <ul className="space-y-3.5">
                    {slide.bullets.map((b, i) => (
                      <li
                        key={i}
                        className={`text-xl sm:text-2xl flex items-start gap-4 font-medium ${
                          isDark ? 'text-amber-200/95' : 'text-amber-900'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Type 7: SUMMARY SLIDE */}
        {slide.type === 'SUMMARY' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fadeIn">
            <div
              className={`inline-flex items-center gap-2 text-base sm:text-lg font-black px-4 py-2 rounded-full border ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-emerald-100 text-[#0F5B38] border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Chapter Summary & Key Takeaways
            </div>
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl font-black font-serif ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title}
            </h2>
            {slide.bullets && slide.bullets.length > 0 ? (
              <div className="space-y-4 pt-3">
                {slide.bullets.map((point, idx) => (
                  <div
                    key={idx}
                    className={`p-6 sm:p-7 rounded-2xl border flex items-start gap-5 text-2xl sm:text-3xl font-medium min-h-[72px] ${
                      isDark
                        ? 'bg-slate-900/70 border-slate-700/70 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-1" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className={`text-2xl sm:text-3xl leading-relaxed ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {slide.body}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 75" Distance-Readable Smartboard Footer */}
      <div
        className={`pt-5 flex items-center justify-between text-base sm:text-lg border-t flex-shrink-0 font-medium ${
          isDark
            ? 'border-slate-800 text-slate-400'
            : 'border-slate-200 text-slate-600'
        }`}
      >
        <span>TeacherSathi Smartboard (75&quot; Display)</span>
        <span>NCERT Canonical Alignment</span>
      </div>
    </div>
  );
}
