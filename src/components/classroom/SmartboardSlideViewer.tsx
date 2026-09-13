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
  ListChecks, 
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
    <div className="w-full h-full flex flex-col justify-between p-8 sm:p-14 bg-gradient-to-br from-gray-950 via-[#0a1f13] to-[#04130a] text-white select-none">
      {/* Smartboard Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> {presentationTitle}
          </span>
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {slide.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm font-bold text-white bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Slide {slideIndex + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Polymorphic Slide Body */}
      <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 min-h-0 overflow-y-auto">
        {/* Type 1: TITLE SLIDE */}
        {slide.type === 'TITLE' && (
          <div className="text-center space-y-6 max-w-4xl mx-auto py-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-emerald-400/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              NCERT Curriculum Classroom Module
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-serif text-white tracking-tight leading-tight">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-xl sm:text-3xl text-emerald-200 font-medium max-w-3xl mx-auto leading-relaxed">
                {slide.subtitle}
              </p>
            )}
            {slide.body && (
              <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-normal">
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
              <p className="text-lg sm:text-2xl text-emerald-300 font-semibold">
                {slide.subtitle}
              </p>
            )}
            {slide.body && (
              <p className="text-lg sm:text-2xl text-gray-200 font-normal leading-relaxed">
                {slide.body}
              </p>
            )}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="space-y-4 pt-2">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-lg sm:text-2xl text-emerald-100 font-medium leading-relaxed">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-3 flex-shrink-0" />
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
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] relative overflow-hidden">
              {slide.image_url ? (
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="max-h-[360px] w-auto object-contain rounded-2xl shadow-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-emerald-300/60">
                  <ImageIcon className="w-20 h-20" />
                  <p className="text-base sm:text-lg font-medium">Curriculum Visual / Diagram Asset</p>
                </div>
              )}
              {slide.body && (
                <p className="mt-4 text-base sm:text-xl text-center text-emerald-200 max-w-2xl">
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
              <p className="text-lg sm:text-xl text-gray-300">{slide.body}</p>
            )}
            <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 font-mono text-base sm:text-xl text-emerald-300 overflow-x-auto shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs text-emerald-400/70 border-b border-emerald-500/20 pb-2">
                <Code2 className="w-4 h-4" /> Concept Syntax & Diagram Flow
              </div>
              <pre className="whitespace-pre-wrap">{slide.diagram_code || '// Concept relationship flow'}</pre>
            </div>
          </div>
        )}

        {/* Type 5: QUESTION SLIDE */}
        {slide.type === 'QUESTION' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-amber-400/30">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Classroom Clicker Question
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-white leading-snug">
              {slide.question_text || slide.title}
            </h2>
            {slide.question_options && slide.question_options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {slide.question_options.map((option, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-lg sm:text-2xl font-medium text-white flex items-center gap-4 transition-all"
                  >
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-black text-lg flex-shrink-0">
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
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-amber-400/30">
              <Users className="w-4 h-4 text-amber-400" />
              Collaborative Classroom Activity
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white">
              {slide.title}
            </h2>
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-4">
              <p className="text-xl sm:text-3xl font-medium text-amber-100 leading-relaxed">
                {slide.activity_prompt || slide.body}
              </p>
              {slide.bullets && slide.bullets.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                    Instructions for Students:
                  </span>
                  <ul className="space-y-2">
                    {slide.bullets.map((b, i) => (
                      <li key={i} className="text-base sm:text-xl text-amber-200/90 flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                        {b}
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-emerald-400/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Chapter Summary & Key Takeaways
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white">
              {slide.title}
            </h2>
            {slide.bullets && slide.bullets.length > 0 ? (
              <div className="space-y-4 pt-2">
                {slide.bullets.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 text-lg sm:text-2xl text-emerald-100 font-medium"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg sm:text-2xl text-gray-200">{slide.body}</p>
            )}
          </div>
        )}
      </div>

      {/* Smartboard Footer */}
      <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-white/50 flex-shrink-0 font-mono">
        <span>TeacherSathi Smartboard Engine (75" Kiosk Display)</span>
        <span>NCERT Canonical Alignment Guarantee</span>
      </div>
    </div>
  );
}
