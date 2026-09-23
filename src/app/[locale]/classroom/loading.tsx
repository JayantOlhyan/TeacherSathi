import React from 'react';
import { Loader2, Tv, ShieldCheck } from 'lucide-react';

export default function ClassroomLoading() {
  return (
    <div className="w-screen h-screen bg-[#0B131E] text-slate-100 flex flex-col justify-between p-8 sm:p-14 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm font-black">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>75&quot; Smartboard Mode Initializing</span>
        </div>
        <div className="text-slate-400 font-mono text-sm">
          Display Engine Ready
        </div>
      </div>

      {/* Center Distance Loading Presentation (>= 36px heading) */}
      <div className="max-w-2xl mx-auto w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-2xl">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight leading-tight">
          Preparing the classroom...
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
          Loading NCERT presentation slides, touch hitboxes, and Quick Check hub.
        </p>

        {/* Progress skeleton pulse bar */}
        <div className="w-full max-w-md mx-auto h-2.5 rounded-full bg-slate-800 overflow-hidden pt-1">
          <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4" />
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
        <Tv className="w-4 h-4 text-slate-400" />
        <span>Optimized for 75-inch Interactive Touch Displays &amp; Projectors</span>
      </footer>
    </div>
  );
}
