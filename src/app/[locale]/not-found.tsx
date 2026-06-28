'use client';

import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function LocaleNotFound() {
  return (
    <div className="min-h-[80vh] bg-[#F7F9F4] text-[#1C2B1C] font-sans antialiased flex flex-col items-center justify-center relative overflow-hidden px-6 py-16 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Ambient background glows */}
      <div className="absolute pointer-events-none inset-0 overflow-hidden z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 blur-3xl" />
        <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-green-500/10 to-emerald-500/5 blur-3xl" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
        {/* Mascot in sleek glowing container */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl transform group-hover:scale-110 transition-transform duration-500" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-[#DCE4D7] shadow-xl flex items-center justify-center p-3 mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Image 
              src="/assets/owl-mascot-green.png" 
              alt="TeacherSathi AI Owl Mascot indicating page not found error on the Indian government school teacher platform" 
              width={128}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#166534] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
          Error 404 • Page Not Found
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B1C] tracking-tight leading-tight sm:leading-tight">
          We couldn&apos;t find the page you&apos;re looking for.
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-base sm:text-lg text-[#5E6C5A] max-w-xl mx-auto leading-relaxed font-normal">
          The page may have been moved, deleted, or perhaps the URL was mistyped. Let&apos;s get you back to your teaching workspace.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#166534] hover:bg-[#15572B] text-white font-bold text-base shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Go to Dashboard
          </Link>
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
