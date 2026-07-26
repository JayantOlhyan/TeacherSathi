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
    <div className={`relative w-full max-w-6xl mx-auto flex flex-col items-center ${className}`}>
      {/* Container maintaining the Samsung frame's exact aspect ratio */}
      <div className="relative w-full aspect-[16/10.1] shadow-2xl rounded-sm overflow-hidden bg-[#111827]">
        
        {/* Screen Content Container (Positioned precisely within the Samsung bezel bounds) */}
        <div className="absolute top-[4.1%] bottom-[7.5%] left-[1.2%] right-[1.2%] bg-[#F8FAF8] overflow-hidden flex flex-col justify-between z-0">
          {children}
        </div>

        {/* Real Samsung Hardware Frame PNG Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <img 
            src="/samsung-frame.png" 
            alt="Samsung Interactive Display Frame" 
            className="w-full h-full object-fill select-none"
          />
        </div>

      </div>

      {/* External Badges */}
      {showBadges && (
        <div className="mt-4 flex items-center justify-center gap-6 text-[10px] sm:text-[11px] text-brand font-black tracking-widest uppercase opacity-80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> NCERT Core
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-emerald-600" /> 75&quot; Samsung Native UI
          </span>
        </div>
      )}
    </div>
  );
}
