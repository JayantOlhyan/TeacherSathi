"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Clock, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2,
  Plus,
  Minus
} from "lucide-react";

export interface ClassroomTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}

const PRESET_DURATIONS = [
  { label: "1 Min", seconds: 60 },
  { label: "2 Min", seconds: 120 },
  { label: "3 Min", seconds: 180 },
  { label: "5 Min", seconds: 300 },
  { label: "10 Min", seconds: 600 },
];

export function ClassroomTimerModal({ isOpen, onClose, theme = "dark" }: ClassroomTimerModalProps) {
  const [totalSeconds, setTotalSeconds] = useState(180); // Default 3 mins
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === "dark";

  // Play gentle attention chime on completion
  const playTimerChime = useCallback(() => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      // 3 ascending notes: C5, E5, G5
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 1.2);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + i * 0.25 + 1.2);
      });
    } catch {
      // AudioContext fallback
    }
  }, [isMuted]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, playTimerChime]);

  const setPreset = (secs: number) => {
    setIsRunning(false);
    setTotalSeconds(secs);
    setTimeLeft(secs);
  };

  const adjustSeconds = (delta: number) => {
    setTimeLeft((prev) => {
      const next = Math.max(10, prev + delta);
      if (!isRunning) setTotalSeconds(next);
      return next;
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  if (!isOpen) return null;

  // Minimized Floating Pill on 75" display (so slides remain visible)
  if (isMinimized) {
    return (
      <div 
        className={`fixed bottom-24 right-8 z-50 p-4 rounded-2xl shadow-2xl border-2 flex items-center gap-4 animate-scaleUp cursor-pointer ${
          isDark 
            ? "bg-[#0F172A] border-emerald-500/60 text-white" 
            : "bg-white border-emerald-600 text-slate-900"
        }`}
        onClick={() => setIsMinimized(false)}
        role="button"
        aria-label="Expand timer"
      >
        <div className={`w-3.5 h-3.5 rounded-full ${isRunning ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
        <span className="font-mono text-2xl font-black">{formattedTime}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRunning(!isRunning);
          }}
          className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(false);
          }}
          className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white"
          aria-label="Maximize timer"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Classroom Activity Countdown Timer"
    >
      <div 
        className={`w-full max-w-xl rounded-3xl border-2 shadow-2xl p-6 sm:p-8 space-y-6 animate-scaleUp ${
          isDark 
            ? "bg-[#0B131E] border-slate-700 text-white" 
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">Classroom Activity Timer</h3>
              <p className="text-xs text-slate-400 font-semibold">समय प्रबंधन • Keep discussions on schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute end chime" : "Mute end chime"}
              className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize to floating corner bar"
              className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Minimize timer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
              aria-label="Close timer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Big Distance-Readable Display (6-10m Legibility) */}
        <div className="text-center py-4 space-y-3">
          <div className="font-mono text-7xl sm:text-8xl font-black tracking-wider text-emerald-400 drop-shadow-md select-none">
            {formattedTime}
          </div>
          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                timeLeft <= 10 ? "bg-red-500 animate-pulse" : "bg-emerald-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Adjustment Buttons (+30s / -30s) */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => adjustSeconds(-30)}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700"
          >
            <Minus className="w-4 h-4" /> 30s
          </button>
          <button
            onClick={() => adjustSeconds(30)}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700"
          >
            <Plus className="w-4 h-4" /> 30s
          </button>
        </div>

        {/* Preset Duration Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {PRESET_DURATIONS.map((preset) => {
            const isSelected = totalSeconds === preset.seconds && !isRunning;
            return (
              <button
                key={preset.label}
                onClick={() => setPreset(preset.seconds)}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md border-emerald-400"
                    : isDark
                    ? "bg-slate-800/70 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Primary Controls (>= 64px Touch Targets) */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`min-h-[64px] rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl cursor-pointer ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400/50"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-white" />
                <span>Start Timer</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="min-h-[64px] rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
