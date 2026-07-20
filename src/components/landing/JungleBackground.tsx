"use client";

import React from "react";
import Image from "next/image";

export default function JungleBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-[#E8F3EA] overflow-hidden pointer-events-none">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/jungle-bg.jpg"
          alt="Lush Jungle Background"
          fill
          priority
          className="object-cover object-top opacity-60"
        />
      </div>

      {/* Global Vignette / Mist Layer for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F3EA]/30 via-transparent to-[#E8F3EA]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(232,243,234,0.4)_100%)] pointer-events-none" />
    </div>
  );
}
