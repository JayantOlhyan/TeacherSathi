"use client";

import React from "react";
import { Monitor, CheckCircle2, Usb, Power, Volume2, Volume1, Menu } from "lucide-react";

interface SmartboardFrameProps {
  children: React.ReactNode;
  className?: string;
  showBadges?: boolean;
}

export default function SmartboardFrame({
  children,
  className = "",
  showBadges = true, // We might not need the badge strip at the bottom anymore since the Samsung frame is strict. We'll leave it as an option below the frame.
}: SmartboardFrameProps) {
  return (
    <div className={`relative w-full max-w-6xl mx-auto flex flex-col items-center ${className}`}>
      
      {/* 
        SAMSUNG 75" INTERACTIVE DISPLAY HARDWARE FRAME 
        Strict compliance: Charcoal bezel, sharp corners, specific bottom bezel hardware.
      */}
      <div className="relative w-full bg-[#111827] rounded-sm sm:rounded-md shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.05)_inset] flex flex-col p-2 pb-0 overflow-hidden">
        
        {/* Top/Side Bezels are thin. We just use padding. */}
        
        {/* Inner Screen Display (Strict 16:9, square corners) */}
        <div className="relative w-full bg-[#F8FAF8] aspect-video flex flex-col justify-between overflow-hidden">
          {children}
        </div>

        {/* Bottom Hardware Bezel */}
        <div className="relative w-full h-12 sm:h-16 flex items-center justify-between px-6 z-20 shrink-0 bg-[#111827]">
          
          {/* Left Side Ports / Sensors */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="flex gap-1.5 items-center bg-[#1F2937] px-2 py-1 rounded-[2px] border border-white/5">
              <div className="w-6 h-1.5 rounded-sm bg-[#000000] shadow-inner flex items-center justify-center">
                <div className="w-4 h-[1px] bg-white/20"></div>
              </div>
              <span className="text-[7px] text-white/70 font-bold uppercase tracking-wider hidden sm:inline">Type-C</span>
            </div>
            <div className="flex gap-1.5 items-center bg-[#1F2937] px-2 py-1 rounded-[2px] border border-white/5">
               <div className="w-5 h-2 rounded-sm bg-[#000000] shadow-inner"></div>
               <span className="text-[7px] text-white/70 font-bold uppercase tracking-wider hidden sm:inline">HDMI</span>
            </div>
            <div className="flex gap-1.5 items-center bg-[#1F2937] px-2 py-1 rounded-[2px] border border-white/5">
               <Usb className="w-2.5 h-2.5 text-white/70" />
               <span className="text-[7px] text-white/70 font-bold uppercase tracking-wider hidden sm:inline">Touch</span>
            </div>
          </div>

          {/* Center SAMSUNG Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-white/90 text-xs sm:text-sm font-bold tracking-[0.25em]">SAMSUNG</span>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4 sm:gap-6 opacity-60">
             <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
             <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
             <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
             {/* Power Button */}
             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center relative">
               <Power className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
               <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-red-500 shadow-[0_0_4px_1px_rgba(239,68,68,0.8)]"></div>
             </div>
          </div>
          
        </div>

        {/* Bottom Edge Speaker Grilles */}
        <div className="absolute bottom-0 left-0 w-full h-[6px] flex justify-between px-16 z-10">
          <div className="w-[20%] h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#050505_1px,#050505_2px)] opacity-50"></div>
          <div className="w-[20%] h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#050505_1px,#050505_2px)] opacity-50"></div>
        </div>

      </div>

      {/* External Badges (Below the frame now, so they don't break the realism) */}
      {showBadges && (
        <div className="mt-4 flex items-center justify-center gap-6 text-[10px] sm:text-[11px] text-brand font-black tracking-widest uppercase opacity-80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> NCERT Core
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Monitor className="w-4 h-4" /> 75&quot; Native UI
          </span>
        </div>
      )}
    </div>
  );
}
