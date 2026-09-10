"use client";

import React from "react";
import { Monitor, CheckCircle2, Sparkles, Wifi, PenTool } from "lucide-react";

interface SmartboardFrameProps {
  children: React.ReactNode;
  className?: string;
  showBadges?: boolean;
}

export default function SmartboardFrame({
  children,
  className = "",
  showBadges = true,
}: SmartboardFrameProps) {
  return (
    <div className={`relative w-full max-w-6xl mx-auto flex flex-col items-center ${className}`}>
      {/* 75-inch Smartboard Hardware Bezel */}
      <div className="relative w-full rounded-2xl bg-[#0E1713] p-2 sm:p-3.5 shadow-[0_25px_70px_-15px_rgba(6,46,30,0.35),0_0_0_1px_rgba(255,255,255,0.08)] border border-[#1B2B23] transition-all duration-300">
        
        {/* Top Bezel: Camera & Ambient Sensors Bar */}
        <div className="relative w-full flex items-center justify-between px-3 py-1.5 mb-1.5 select-none">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-400/90 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              75&quot; IFP Active
            </span>
          </div>

          {/* Centered Camera & Microphone Array */}
          <div className="flex items-center gap-1.5 bg-[#14231B] px-3 py-0.5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-black/80 border border-emerald-500/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#050D09] border border-emerald-400/40 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-emerald-400/80" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-black/80 border border-emerald-500/30" />
          </div>

          <div className="flex items-center gap-3 text-[10px] text-emerald-300/70 font-semibold">
            <span className="hidden sm:inline-flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-400" /> 4K Ultra-HD
            </span>
            <span className="inline-flex items-center gap-1">
              <PenTool className="w-3 h-3 text-amber-400" /> Dual Touch Pen
            </span>
          </div>
        </div>

        {/* Screen Content Container with Clean Internal Border */}
        <div className="relative w-full rounded-xl overflow-hidden bg-white shadow-inner">
          {children}
        </div>

        {/* Bottom Hardware Bezel Bar */}
        <div className="mt-2 pt-1 flex items-center justify-between px-4 text-[9px] text-emerald-200/60 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span>TeacherSathi Smartboard OS 3.2</span>
          </div>
          <div className="text-center font-black tracking-widest uppercase text-[10px] text-emerald-400/80">
            TEACHERSATHI 75&quot; PRO
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold">
              Stylus Docked 🖊️
            </span>
          </div>
        </div>

      </div>

      {/* External Badges */}
      {showBadges && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-brand-900 font-extrabold tracking-wide uppercase opacity-90">
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-200/70 shadow-sm text-emerald-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> NCERT Core 2024-25
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-200/70 shadow-sm text-emerald-900">
            <Monitor className="w-3.5 h-3.5 text-emerald-600" /> 75&quot; Smartboard Native
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-200/70 shadow-sm text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Instant AI Lesson Kits
          </span>
        </div>
      )}
    </div>
  );
}
