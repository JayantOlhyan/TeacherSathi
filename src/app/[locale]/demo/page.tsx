"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Tv, 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  PenTool, 
  Info,
  TrendingUp,
  FileText,
  School,
  Check
} from "lucide-react";

interface StepMeta {
  id: number;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
}

const STEPS: StepMeta[] = [
  {
    id: 1,
    label: "Teacher Workspace",
    shortLabel: "1. Workspace",
    badge: "Preparation",
    description: "Instant context selection: Class 8 Science • Crop Production and Management."
  },
  {
    id: 2,
    label: "Chapter Workspace",
    shortLabel: "2. Chapter",
    badge: "Curriculum Hub",
    description: "Unified 4-pillar view: Prepare, Teach, Practice, and Assess."
  },
  {
    id: 3,
    label: "75\" Classroom Mode",
    shortLabel: "3. Smartboard",
    badge: "Live Display",
    description: "High-contrast, distance-legible presentation engineered for interactive flat panels."
  },
  {
    id: 4,
    label: "Quick Check Poll",
    shortLabel: "4. Quick Check",
    badge: "Formative Check",
    description: "Teacher triggers a 60-second formative understanding check directly from the touch bar."
  },
  {
    id: 5,
    label: "Live Response Distribution",
    shortLabel: "5. Distribution",
    badge: "Live Data",
    description: "Instant classroom telemetry without stigmatizing individual student struggles."
  },
  {
    id: 6,
    label: "Saathi Pedagogical Diagnostic",
    shortLabel: "6. Co-Pilot",
    badge: "AI Diagnostic",
    description: "Observed data translated into pedagogical insight and actionable reteaching intervention."
  },
  {
    id: 7,
    label: "Mastery Recheck",
    shortLabel: "7. Recheck",
    badge: "Loop Closed",
    description: "Follow-up check verifies student understanding rose from 78% to 92% mastery."
  },
  {
    id: 8,
    label: "Pedagogical Loop Complete",
    shortLabel: "8. Complete",
    badge: "Teacher Empowered",
    description: "The complete cycle: Teacher decides, Saathi assists, students learn."
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [pollSelected, setPollSelected] = useState<string | null>("A");

  // Auto-play timer for exhibition kiosk display
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const handleResetDemo = () => {
    setCurrentStep(1);
    setAutoPlay(false);
    setPollSelected("A");
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white pb-12">
      {/* 1. Prominent Exhibition Mode Banner */}
      <header className="bg-amber-500/10 border-b border-amber-500/30 px-4 sm:px-8 py-3 sticky top-0 z-50 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm tracking-wide text-amber-300 uppercase">
              Demonstration Mode
            </span>
            <span className="hidden sm:inline text-amber-500/60">•</span>
            <span className="text-xs text-amber-200/90 font-medium">
              Simulated Classroom Data • Exhibition Ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            aria-label={autoPlay ? "Pause Auto-Tour" : "Start Auto-Tour"}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              autoPlay
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                : "bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40"
            }`}
          >
            {autoPlay ? "⏸ Pause Auto-Tour" : "▶ Start 60s Tour"}
          </button>

          <button
            onClick={handleResetDemo}
            aria-label="Reset Demo to Beginning"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo</span>
          </button>

          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            Open Real Workspace
          </Link>
        </div>
      </header>

      {/* 2. Interactive Step Navigation Bar */}
      <nav 
        aria-label="Exhibition Stage Stepper"
        className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2 min-w-max">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                aria-current={isActive ? "step" : undefined}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40"
                    : isCompleted
                    ? "bg-slate-800/80 text-emerald-300 border border-emerald-900/60 hover:bg-slate-800"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    isActive
                      ? "bg-white text-emerald-900"
                      : isCompleted
                      ? "bg-emerald-900/60 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Stage Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-8 space-y-6">
        {/* Step Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                Step {currentStep} of {STEPS.length} • {STEPS[currentStep - 1].badge}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 hidden sm:inline">TeacherSathi Core Loop</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {STEPS[currentStep - 1].label}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {STEPS[currentStep - 1].description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              aria-label="Previous Demo Stage"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === STEPS.length}
              aria-label="Next Demo Stage"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{currentStep === STEPS.length ? "Finished" : "Next Stage"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. Interactive Simulation Stage */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 min-h-[460px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* STAGE 1: Teacher Workspace */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-400 flex items-center justify-center font-black">
                    8
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Class 8 Science • Section A</h2>
                    <p className="text-xs text-slate-400">NCERT Curriculum • Academic Year 2026–27</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  Active Context
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Current Chapter</span>
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-extrabold text-white text-sm">Chapter 1: Crop Production & Management</h3>
                  <p className="text-xs text-slate-400">Kharif, Rabi, Soil preparation, Sowing & Irrigation.</p>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Lesson Kit Status</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-extrabold text-white text-sm">100% Prepared</h3>
                  <p className="text-xs text-slate-400">12 Slides • 1 Worksheet • 8 Spot Check Questions ready.</p>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Class Readiness</span>
                    <Tv className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-extrabold text-white text-sm">75&quot; Smartboard Ready</h3>
                  <p className="text-xs text-slate-400">Calibrated for Room 204 • Anti-Glare High-Contrast.</p>
                </div>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-xs text-emerald-200">
                    <strong>Pedagogical Context:</strong> Teacher enters TeacherSathi without configuring databases or servers. Context is locked and ready for immediate teaching.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shrink-0 transition-all cursor-pointer"
                >
                  Enter Chapter Workspace →
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: Chapter Workspace */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Unified Chapter Workspace</h2>
                  <p className="text-xs text-slate-400">Chapter 1: Crop Production & Management</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
                    4-Pillar Model
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400">Pillar 1</span>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Prepare
                  </h3>
                  <p className="text-[11px] text-slate-300">Bilingual Lesson Plan, Teaching objectives, Key terms.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-1.5 ring-2 ring-blue-500/40">
                  <span className="text-[10px] font-black tracking-wider uppercase text-blue-400">Pillar 2 (Active)</span>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-blue-400" /> Teach
                  </h3>
                  <p className="text-[11px] text-slate-300">75&quot; Smartboard Slides & Digital Whiteboard.</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-purple-400">Pillar 3</span>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-400" /> Practice
                  </h3>
                  <p className="text-[11px] text-slate-300">Printable NCERT Worksheets & Mind Maps.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-amber-400">Pillar 4</span>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-amber-400" /> Assess
                  </h3>
                  <p className="text-[11px] text-slate-300">Quick Check polls, Formative mastery analytics.</p>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Ready to teach on the classroom display?</h4>
                  <p className="text-xs text-slate-400">1-touch launch initializes 75&quot; low-glare presentation mode.</p>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Tv className="w-4 h-4" /> Start Class on Smartboard
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: 75" Smartboard Presentation */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-[#0B131E] rounded-2xl border-2 border-emerald-500/30 p-6 sm:p-8 space-y-6 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                    Slide 4 of 12 • Crop Types in India
                  </span>
                  <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded text-slate-300">
                    75&quot; Anti-Glare Mode
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Kharif vs Rabi Crops (खरीफ एवं रबी फसलें)
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                    Crops grown in India are broadly classified based on their monsoon seasonal cycles:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#131F30] border border-[#20334D] space-y-2">
                    <span className="text-xs font-black text-emerald-400 uppercase">🌧 Kharif Crops</span>
                    <h3 className="font-bold text-base text-white">Sown in Rainy Season (June to Sept)</h3>
                    <p className="text-xs text-slate-300">Examples: Paddy, Maize, Soyabean, Groundnut, Cotton.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#131F30] border border-[#20334D] space-y-2">
                    <span className="text-xs font-black text-amber-400 uppercase">❄ Rabi Crops</span>
                    <h3 className="font-bold text-base text-white">Sown in Winter Season (Oct to March)</h3>
                    <p className="text-xs text-slate-300">Examples: Wheat, Gram, Pea, Mustard, Linseed.</p>
                  </div>
                </div>
              </div>

              {/* Classroom Touch Bar (Mock) */}
              <div className="bg-[#080D14] border border-[#1E293B] rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl bg-[#131F30] text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-[#20334D]">
                    <PenTool className="w-4 h-4 text-emerald-400" /> Whiteboard
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ring-2 ring-purple-400/40"
                  >
                    <HelpCircle className="w-4 h-4" /> Start Quick Check
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">Slide 4 / 12</span>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Check Understanding</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: Quick Check Poll */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                  <h2 className="text-base font-bold text-white">Classroom Spot Check • Question 1 of 3</h2>
                </div>
                <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                  Timer: 00:45
                </span>
              </div>

              <div className="bg-[#131F30] p-6 rounded-2xl border border-[#20334D] space-y-3">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  Conceptual Understanding Check
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  Why is paddy (धान) cultivated exclusively during the rainy season in India?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "A", text: "It requires a huge amount of standing water and rainfall.", correct: true },
                  { key: "B", text: "It cannot tolerate temperatures above 15°C.", correct: false },
                  { key: "C", text: "Its seeds only germinate during dry winter air.", correct: false },
                  { key: "D", text: "It requires frost for flowering.", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPollSelected(opt.key)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      pollSelected === opt.key
                        ? "bg-purple-950/60 border-purple-500 text-white ring-2 ring-purple-500/40"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                      pollSelected === opt.key ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {opt.key}
                    </span>
                    <span className="text-xs sm:text-sm font-medium pt-0.5 leading-snug">{opt.text}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400">
                  Students submitting responses via Classroom Clickers / Smartboard inputs.
                </p>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>View Live Responses (18/24)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: Live Response Distribution */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Live Student Response Distribution</h2>
                  <p className="text-xs text-slate-400">18 out of 24 students submitted (75% participation)</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  78% Initial Accuracy
                </span>
              </div>

              <div className="space-y-3.5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Option A (Requires standing water) • Correct Answer
                    </span>
                    <span className="text-white font-mono">14 students (78%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[78%] transition-all duration-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-amber-400">Option B (Cannot tolerate temp above 15°C) • Misconception</span>
                    <span className="text-slate-300 font-mono">3 students (17%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[17%] transition-all duration-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-rose-400">Option C (Only germinates in winter air)</span>
                    <span className="text-slate-300 font-mono">1 student (5%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[5%] transition-all duration-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Option D (Requires frost)</span>
                    <span className="text-slate-500 font-mono">0 students (0%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full w-[0%]" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Individual student names are protected on the public 75&quot; display.</span>
                </div>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Ask Saathi for Diagnostic</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 6: Saathi Pedagogical Diagnostic */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Saathi Pedagogical Co-Pilot Diagnostic</h2>
                </div>
                <span className="text-xs bg-amber-950/60 text-amber-300 border border-amber-800 px-3 py-1 rounded-full font-bold">
                  Classroom Assistant
                </span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">1. Observed Data</span>
                  <p className="text-xs text-slate-200">
                    14 of 18 students answered correctly (78%), but 4 students confused Kharif water requirements with cold season tolerance (Option B).
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">2. Root Cause Interpretation</span>
                  <p className="text-xs text-slate-200">
                    Students are conflating seasonal weather changes (rainy vs winter) with temperature physiology instead of water availability.
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-3 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">3. Recommended 60-Second Intervention</span>
                  <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    &quot;Draw a rapid 2-column contrast on the whiteboard: Kharif = Water Hungry (Paddy standing in water), Rabi = Moderate Water (Wheat winter dew). Then run a quick 30-second recheck.&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Teacher remains in full control of instructional time and execution.
                </span>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Execute Reteach & Verify Mastery</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 7: Mastery Recheck */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Post-Intervention Mastery Recheck</h2>
                  <p className="text-xs text-slate-400">Follow-up check conducted after 60-second whiteboard clarification</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 font-black">
                    +14% Gain
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Before Reteach</span>
                  <div className="text-3xl font-black text-slate-200">78% Mastery</div>
                  <p className="text-xs text-slate-400">14/18 students grasped standing water requirements.</p>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[78%]" />
                  </div>
                </div>

                <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-800/80 space-y-3 ring-2 ring-emerald-500/30">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">After Reteach</span>
                  <div className="text-3xl font-black text-emerald-300">92% Mastery</div>
                  <p className="text-xs text-emerald-200">22/24 students verified full understanding.</p>
                  <div className="h-2.5 w-full bg-emerald-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Misconception resolved in under 2 minutes of instructional time.</span>
                </div>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Complete Loop & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 8: Pedagogical Loop Complete */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in duration-300 text-center max-w-2xl mx-auto py-4">
              <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">The TeacherSathi Loop is Complete</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  &quot;Teacher decides. Saathi assists. Students learn.&quot;
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Demonstrated Capabilities in this Flow:
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant contextual curriculum access without technical friction</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated 75&quot; high-contrast classroom presentation environment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Formative spot-check polls with aggregated, non-stigmatizing telemetry</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Actionable pedagogical AI diagnosis with 60-second reteaching recommendations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Measurable mastery recovery before proceeding to subsequent topics</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetDemo}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Restart Demo Walkthrough</span>
                </button>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <School className="w-4 h-4" />
                  <span>Launch Live Teacher Workspace</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 5. Exhibition Explainer Footer Note */}
        <footer className="text-center text-[11px] text-slate-500 space-y-1">
          <p>TeacherSathi Exhibition System • Built for Indian Classrooms &amp; 75&quot; Smartboards</p>
          <p>Fully compliant with NEP 2020 competency-based formative assessment guidelines.</p>
        </footer>
      </main>
    </div>
  );
}
