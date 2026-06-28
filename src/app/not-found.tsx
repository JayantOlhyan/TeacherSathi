'use client';

import './globals.css';
import Image from 'next/image';

export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 — Page Not Found · TeacherSathi</title>
      </head>
      <body className="min-h-screen bg-[#F7F9F4] text-[#1C2B1C] font-sans antialiased flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
        {/* Ambient background glows */}
        <div className="fixed pointer-events-none inset-0 overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-green-500/10 to-emerald-500/5 blur-3xl" />
        </div>

        {/* Minimal Header */}
        <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-[#E2E8DE] bg-white/50 backdrop-blur-md">
          <a href="/en" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <Image src="/assets/owl-mascot-green.png" alt="TeacherSathi AI Official Brand Mascot Logo for Indian CBSE Educators" width={36} height={36} className="w-9 h-9 object-contain" />
            <span className="font-extrabold text-xl tracking-tight text-[#166534]">
              Teacher<span className="text-[#1C2B1C]">Sathi</span>
            </span>
          </a>
          <a 
            href="/en/login" 
            className="text-sm font-bold text-[#166534] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-5 py-2 rounded-full transition-all duration-200"
          >
            Sign In
          </a>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto">
          {/* Mascot in sleek glowing container */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl transform group-hover:scale-110 transition-transform duration-500" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-[#DCE4D7] shadow-xl flex items-center justify-center p-3 mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image 
                src="/assets/owl-mascot-green.png" 
                alt="TeacherSathi AI Owl Mascot indicating 404 global page not found on the Indian school portal" 
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
            <a 
              href="/en/dashboard" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#166534] hover:bg-[#15572B] text-white font-bold text-base shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Go to Dashboard
            </a>
            <a 
              href="/en" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-[#F0F4EC] text-[#1C2B1C] font-bold text-base border border-[#DCE4D7] shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Back to Home
            </a>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="relative z-10 py-6 px-6 sm:px-12 border-t border-[#E2E8DE] bg-white/40 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#5E6C5A]">
          <p>© {new Date().getFullYear()} TeacherSathi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/en/support" className="hover:text-[#166534] transition-colors">Help Center</a>
            <a href="/en/privacy" className="hover:text-[#166534] transition-colors">Privacy</a>
            <a href="/en/terms" className="hover:text-[#166534] transition-colors">Terms</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
