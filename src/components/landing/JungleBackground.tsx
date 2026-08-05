"use client";

import React from "react";
import Image from "next/image";

export default function JungleBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-[#E8F3EA] overflow-hidden pointer-events-none">
      {/* Fast CSS Background Layer for Instant FCP */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/60 via-[#E8F3EA] to-[#DFEBE1]" />

      {/* Optimized Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/jungle-bg.webp"
          alt="Jungle Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-50 transition-opacity duration-500"
        />
      </div>

      {/* Global Vignette / Mist Layer for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F3EA]/30 via-transparent to-[#E8F3EA]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(232,243,234,0.4)_100%)] pointer-events-none" />
    </div>
  );
}
