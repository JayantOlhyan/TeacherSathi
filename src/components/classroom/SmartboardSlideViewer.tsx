'use client';

import React from 'react';
import { PresentationSlide } from '@/lib/validations/resources';
import { 
  HelpCircle, 
  Users, 
  Image as ImageIcon, 
  Code2, 
  CheckCircle2, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

interface SmartboardSlideViewerProps {
  slide: PresentationSlide;
  slideIndex: number;
  totalSlides: number;
  presentationTitle: string;
}

export function SmartboardSlideViewer({
  slide,
  slideIndex,
  totalSlides,
  presentationTitle,
}: SmartboardSlideViewerProps) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0B131E] text-slate-100 select-none">
      {/* Smartboard Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm sm:text-base uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> {presentationTitle}
          </span>
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {slide.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm sm:text-base font-bold text-slate-100 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
            Slide {slideIndex + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Polymorphic Slide Body */}
      <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 min-h-0 overflow-y-auto">
        {/* Type 1: TITLE SLIDE */}
        {slide.type === 'TITLE' && (
          <div className="text-center space-y-6 max-w-4xl mx-auto py-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-sm sm:text-base font-extrabold px-4 py-2 rounded-full border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              NCERT Curriculum Classroom Module
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-serif text-white tracking-tight leading-tight">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-2xl sm:text-3xl text-emerald-300 font-semibold max-w-3xl mx-auto leading-relaxed">
                {slide.subtitle}
              </p>
            )}
            {slide.body && (
              <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {slide.body}
              </p>
            )}
          </div>
        )}

        {/* Type 2: CONTENT SLIDE */}
        {slide.type === 'CONTENT' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-xl sm:text-2xl text-emerald-300 font-semibold">
                {slide.subtitle}
              </p>
            )}
            {slide.body && (
              <p className="text-xl sm:text-2xl text-slate-200 font-normal leading-relaxed">
                {slide.body}
              </p>
            )}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="space-y-5 pt-3">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-xl sm:text-2xl text-slate-100 font-medium leading-relaxed">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 mt-2.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Type 3: IMAGE SLIDE */}
        {slide.type === 'IMAGE' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
              {slide.title}
            </h2>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[400px] relative overflow-hidden">
              {slide.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="max-h-[380px] w-auto object-contain rounded-2xl shadow-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-emerald-300/60">
                  <ImageIcon className="w-24 h-24" />
                  <p className="text-lg sm:text-xl font-medium">Curriculum Visual / Diagram Asset</p>
                </div>
              )}
              {slide.body && (
                <p className="mt-5 text-xl sm:text-2xl text-center text-slate-200 max-w-2xl leading-relaxed">
                  {slide.body}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Type 4: DIAGRAM / CODE SLIDE */}
        {slide.type === 'DIAGRAM' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
              {slide.title}
            </h2>
            {slide.body && (
              <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed">{slide.body}</p>
            )}
            <div className="bg-[#070C14] border border-slate-700/80 rounded-2xl p-6 sm:p-8 font-mono text-lg sm:text-2xl text-emerald-300 overflow-x-auto shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-sm sm:text-base text-emerald-400/80 border-b border-slate-800 pb-2">
                <Code2 className="w-5 h-5" /> Concept Syntax & Diagram Flow
              </div>
              <pre className="whitespace-pre-wrap">{slide.diagram_code || '// Concept relationship flow'}</pre>
            </div>
          </div>
        )}

        {/* Type 5: QUESTION SLIDE */}
        {slide.type === 'QUESTION' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-sm sm:text-base font-extrabold px-4 py-2 rounded-full border border-amber-400/40">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Classroom Clicker Question
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white leading-snug">
              {slide.question_text || slide.title}
            </h2>
            {slide.question_options && slide.question_options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                {slide.question_options.map((option, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-2xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700 text-xl sm:text-2xl font-medium text-slate-100 flex items-center gap-4 transition-all min-h-[64px]"
                  >
                    <span className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black text-xl flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Type 6: ACTIVITY SLIDE */}
        {slide.type === 'ACTIVITY' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-sm sm:text-base font-extrabold px-4 py-2 rounded-full border border-amber-400/40">
              <Users className="w-5 h-5 text-amber-400" />
              Collaborative Classroom Activity
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white">
              {slide.title}
            </h2>
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-5">
              <p className="text-2xl sm:text-4xl font-medium text-amber-100 leading-relaxed">
                {slide.activity_prompt || slide.body}
              </p>
              {slide.bullets && slide.bullets.length > 0 && (
                <div className="pt-3 space-y-3">
                  <span className="text-sm sm:text-base uppercase tracking-wider font-extrabold text-amber-300 block">
                    Instructions for Students:
                  </span>
                  <ul className="space-y-3">
                    {slide.bullets.map((b, i) => (
                      <li key={i} className="text-xl sm:text-2xl text-amber-200/95 flex items-start gap-3.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
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
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-sm sm:text-base font-extrabold px-4 py-2 rounded-full border border-emerald-400/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Chapter Summary & Key Takeaways
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white">
              {slide.title}
            </h2>
            {slide.bullets && slide.bullets.length > 0 ? (
              <div className="space-y-4 pt-3">
                {slide.bullets.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-700/70 flex items-start gap-4 text-xl sm:text-2xl text-slate-100 font-medium"
                  >
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xl sm:text-2xl text-slate-200 leading-relaxed">{slide.body}</p>
            )}
          </div>
        )}
      </div>

      {/* Smartboard Footer */}
      <div className="border-t border-slate-700/60 pt-5 flex items-center justify-between text-sm sm:text-base text-slate-400 flex-shrink-0 font-medium">
        <span>TeacherSathi Smartboard (75&quot; Display)</span>
        <span>NCERT Canonical Alignment</span>
      </div>
    </div>
  );
}
