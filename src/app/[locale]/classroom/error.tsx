'use client';

import React, { useEffect } from 'react';
import { RotateCcw, ArrowLeft, Tv, ShieldCheck } from 'lucide-react';

export default function ClassroomError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Classroom session error:', error);
  }, [error]);

  const handleReturnToChapter = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl') || '/dashboard';
      window.location.href = returnUrl;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0B131E] text-slate-100 flex flex-col justify-between p-8 sm:p-14 select-none">
      {/* Top Status Banner */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm font-black">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>75&quot; Smartboard Recovery Mode</span>
        </div>
        <div className="text-slate-400 font-mono text-sm">
          Classroom State Protected
        </div>
      </div>

      {/* Center Message - Distance Legible (>= 36px heading) */}
      <div className="max-w-3xl mx-auto w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mx-auto shadow-2xl">
          <Tv className="w-10 h-10" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight leading-tight">
          Your classroom session couldn&apos;t be restored.
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          The presentation slide progress, Quick Check data, and whiteboard states are safely backed up. Tap below to reconnect the display or return to your lesson plan.
        </p>

        {/* 75" Touch-Friendly Action Buttons (>= 64px height) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto min-h-[64px] px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Restore Classroom Session</span>
          </button>

          <button
            onClick={handleReturnToChapter}
            className="w-full sm:w-auto min-h-[64px] px-8 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Chapter Workspace</span>
          </button>
        </div>
      </div>

      {/* Footer Guidance */}
      <footer className="text-center text-xs text-slate-500 font-medium">
        TeacherSathi Smartboard Continuity Engine • Safe Failover Active
      </footer>
    </div>
  );
}
