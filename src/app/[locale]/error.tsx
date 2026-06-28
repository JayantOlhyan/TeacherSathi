'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-[#F7F9F4] text-[#1C2B1C] font-sans antialiased flex flex-col items-center justify-center relative overflow-hidden px-6 py-16 selection:bg-red-100 selection:text-red-900">
      {/* Ambient background glows */}
      <div className="absolute pointer-events-none inset-0 overflow-hidden z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-red-500/10 to-amber-500/5 blur-3xl" />
        <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/5 blur-3xl" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
        {/* Mascot in sleek glowing container */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-500/15 rounded-full blur-xl transform group-hover:scale-110 transition-transform duration-500" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-[#DCE4D7] shadow-xl flex items-center justify-center p-3 mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <Image 
              src="/assets/owl-mascot-green.png" 
              alt="TeacherSathi AI Owl Mascot indicating a system error on the Indian government school teacher platform" 
              width={128}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          Error 500 • Server Glitch
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B1C] tracking-tight leading-tight sm:leading-tight">
          Oops! Our servers are taking a quick break.
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-base sm:text-lg text-[#5E6C5A] max-w-xl mx-auto leading-relaxed font-normal">
          We encountered an unexpected technical hiccup. Our engineering team has been notified and is fixing the wires right now!
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#166534] hover:bg-[#15572B] text-white font-bold text-base shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Try Again
          </button>
          <Link 
            href="/" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-[#F0F4EC] text-[#1C2B1C] font-bold text-base border border-[#DCE4D7] shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
