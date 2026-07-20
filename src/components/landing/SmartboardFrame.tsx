"use client";

import React from "react";
import { Monitor, CheckCircle2 } from "lucide-react";

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
    <div className={`relative w-full max-w-6xl mx-auto group ${className}`}>
      {/* Outer Premium Hardware Frame */}
      <div className="relative rounded-[28px] sm:rounded-[40px] bg-gradient-to-b from-[#1E2328] to-[#0A0D12] p-[12px] sm:p-[20px] shadow-[0_32px_80px_-16px_rgba(6,46,30,0.4),_0_0_0_1px_rgba(255,255,255,0.05)_inset]">
        
        {/* Subtle Metallic Bezel Inner Ring */}
        <div className="absolute inset-0 rounded-[28px] sm:rounded-[40px] border border-white/10 pointer-events-none z-10" />
        
        {/* Top Bezel Accessories: Camera array and ambient light sensor */}
        <div className="absolute top-1 sm:top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          <div className="w-1.5 h-1.5 rounded-full bg-[#05070A] shadow-inner" />
          <div className="w-12 sm:w-16 h-3 sm:h-4 rounded-full bg-[#05070A] border border-white/5 flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0A0D12] border border-[#1A1F26] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-emerald-500 shadow-[0_0_4px_1px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#05070A] shadow-inner" />
        </div>

        {/* Inner Screen Display (The actual content) */}
        <div className="relative w-full rounded-[16px] sm:rounded-[24px] bg-[#FFFFFF] overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-between shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] z-20 transition-transform duration-700 ease-out group-hover:scale-[1.002]">
          
          {/* Subtle Screen Glare / Reflection */}
          <div className="absolute top-0 left-0 w-[150%] h-[150%] -rotate-45 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-50 -translate-y-[80%] -translate-x-[20%]" />
          
          {children}
        </div>

        {/* Bottom Hardware Bezel Branding */}
        <div className="mt-3 flex items-center justify-between px-6 text-[10px] sm:text-[11px] text-[#8A96A8] font-semibold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] inline-block" />
            <span className="opacity-80">TeacherSathi IFP</span>
          </div>
          {showBadges && (
            <div className="flex items-center gap-4 opacity-70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NCERT Core
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-emerald-500" /> 75" Native
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Premium Stand / Wall Mount Shadow */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-32 bg-brand-950/10 blur-[60px] rounded-[100%] pointer-events-none -z-10" />
    </div>
  );
}
