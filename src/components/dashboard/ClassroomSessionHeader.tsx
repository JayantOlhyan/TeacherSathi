"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock, Plus, LogOut, AlertTriangle, Activity } from "lucide-react";
import { activityDetector } from "@/lib/smartActivityDetector";

interface ClassroomSessionHeaderProps {
  initialMinutes?: number;
  classNameTitle?: string;
  onEndSession?: () => void;
}

export default function ClassroomSessionHeader({
  initialMinutes = 45,
  classNameTitle = "Class 8 • Science",
  onEndSession,
}: ClassroomSessionHeaderProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isGracePeriod, setIsGracePeriod] = useState(false);
  const [graceSeconds, setGraceSeconds] = useState(60);
  const [isEnded, setIsEnded] = useState(false);
  const [activityScore, setActivityScore] = useState(95);

  useEffect(() => {
    const unsub = activityDetector.subscribe((score: number) => {
      setActivityScore(score);
    });
    return () => unsub();
  }, []);

  const handleAutoTerminate = useCallback(() => {
    setIsEnded(true);
    setIsGracePeriod(false);
    // Auto-save and clear session
    if (typeof window !== "undefined") {
      localStorage.setItem("sathi_last_autosave", new Date().toISOString());
      if (onEndSession) {
        onEndSession();
      } else {
        window.location.href = "/login";
      }
    }
  }, [onEndSession]);

  // Countdown timer effect
  useEffect(() => {
    if (isEnded) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGracePeriod(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnded]);

  // Grace period timer effect
  useEffect(() => {
    if (!isGracePeriod || isEnded) return;

    const graceTimer = setInterval(() => {
      setGraceSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(graceTimer);
          handleAutoTerminate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(graceTimer);
  }, [isGracePeriod, isEnded, handleAutoTerminate]);

  const addMinutes = (mins: number) => {
    setSecondsRemaining((prev) => prev + mins * 60);
    if (isGracePeriod) {
      setIsGracePeriod(false);
      setGraceSeconds(60);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (isEnded) return null;

  return (
    <>
      {/* Top Session Bar Banner */}
      <div className="w-full bg-[#14532D] text-white px-4 py-2 flex items-center justify-between shadow-md z-30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            📖 {classNameTitle}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-emerald-200 font-semibold bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            <Activity className="w-3.5 h-3.5 text-emerald-300" /> Activity: {activityScore}%
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live Timer Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs sm:text-sm font-bold border transition-colors ${
              secondsRemaining < 300
                ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                : "bg-white/10 border-white/20 text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)} Remaining</span>
          </div>

          {/* Phase 4 Quick Extensions: +10m, +20m, +30m */}
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full border border-white/20">
            <button
              onClick={() => addMinutes(10)}
              className="flex items-center gap-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-95"
              title="Extend class by 10 minutes"
            >
              <Plus className="w-3 h-3" /> 10m
            </button>

            <button
              onClick={() => addMinutes(20)}
              className="flex items-center gap-0.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-95"
              title="Extend class by 20 minutes"
            >
              <Plus className="w-3 h-3" /> 20m
            </button>

            <button
              onClick={() => addMinutes(30)}
              className="flex items-center gap-0.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-95"
              title="Extend class by 30 minutes"
            >
              <Plus className="w-3 h-3" /> 30m
            </button>
          </div>

          {/* End Class Button */}
          <button
            onClick={handleAutoTerminate}
            className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" /> End Class
          </button>
        </div>
      </div>

      {/* 60-Second Grace Period Modal Overlay */}
      {isGracePeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-400 shadow-2xl space-y-6 text-center text-gray-900 relative">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                Classroom Session Ending
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Your scheduled period has completed. Continue teaching on this 75&quot; smartboard?
              </p>
            </div>

            {/* Grace Countdown */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Auto-Save & Lock in
              </span>
              <div className="text-4xl font-mono font-black text-amber-600">
                {graceSeconds}s
              </div>
            </div>

            {/* Extension Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addMinutes(10)}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                +10 Min
              </button>
              <button
                onClick={() => addMinutes(20)}
                className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                +20 Min
              </button>
            </div>

            {/* Terminate Action */}
            <button
              onClick={handleAutoTerminate}
              className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
            >
              End Class Now & Clear Screen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
