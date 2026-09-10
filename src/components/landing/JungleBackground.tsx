"use client";

import React from "react";

export default function JungleBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-[#F7FAF8] overflow-hidden pointer-events-none">
      {/* Base Subtle Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(247,250,248,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_20%,rgba(245,158,11,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_60%,rgba(15,91,56,0.08),transparent)]" />

      {/* Subtle Smartboard / Graph Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, #0F5B38 0.85px, transparent 0.85px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating Ambient Light Accents */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 w-[600px] h-[400px] bg-amber-400/8 rounded-full blur-3xl" />

      {/* Vignette Edge Shading for Depth & Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAF8]/60 via-transparent to-[#F7FAF8]/90 pointer-events-none" />
    </div>
  );
}
