"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, Calculator } from "lucide-react";

export default function TimeSavedCalculator() {
  const [classesPerWeek, setClassesPerWeek] = useState<number>(20);
  const [minutesPerLesson, setMinutesPerLesson] = useState<number>(45);

  // Math calculations
  const totalPrepHoursWithoutAI = Math.round((classesPerWeek * minutesPerLesson) / 60);
  const totalPrepHoursWithAI = Math.round((classesPerWeek * 2) / 60); // 2 mins per lesson kit
  const hoursSavedWeekly = Math.max(1, totalPrepHoursWithoutAI - totalPrepHoursWithAI);
  const hoursSavedYearly = hoursSavedWeekly * 40; // 40 academic weeks

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4 sm:px-6">
      <div className="bg-gradient-to-br from-[#14532D] via-[#0F3820] to-[#0A1A12] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-500/30 relative overflow-hidden space-y-8">
        
        {/* Orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-gray-950 shadow-md">
            <Calculator className="w-3.5 h-3.5" /> Interactive Teacher ROI Tool
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
            Calculate How Much Time You Will Save
          </h2>
          <p className="text-sm text-emerald-200 font-medium max-w-xl mx-auto">
            See how TeacherSathi AI automates NCERT slide decks, mind maps, quizzes, and worksheets to give hours back to your weekends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 items-center">
          
          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold text-emerald-100">
                <label htmlFor="classes-slider">Classes Taught Per Week:</label>
                <span className="text-amber-300 text-base font-black">{classesPerWeek} Classes</span>
              </div>
              <input
                id="classes-slider"
                type="range"
                min="5"
                max="40"
                value={classesPerWeek}
                onChange={(e) => setClassesPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold text-emerald-100">
                <label htmlFor="minutes-slider">Manual Prep Time Per Lesson:</label>
                <span className="text-amber-300 text-base font-black">{minutesPerLesson} Minutes</span>
              </div>
              <input
                id="minutes-slider"
                type="range"
                min="15"
                max="90"
                step="5"
                value={minutesPerLesson}
                onChange={(e) => setMinutesPerLesson(Number(e.target.value))}
                className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-emerald-950/80 border border-emerald-400/30 p-6 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Your Calculated Time Saved</span>
              <div className="text-5xl font-black text-amber-400 tracking-tight font-serif">
                {hoursSavedWeekly} Hours <span className="text-xl text-white font-sans font-extrabold">/ week</span>
              </div>
              <p className="text-xs text-emerald-200 font-semibold pt-1">
                = Over <span className="text-amber-300 font-bold">{hoursSavedYearly} hours saved</span> per academic year!
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-center gap-4 text-xs font-extrabold text-emerald-100">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Free Access
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> 30 Sec Generation
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
