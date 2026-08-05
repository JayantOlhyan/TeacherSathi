"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MobileStickyCTA() {
  const pathname = usePathname();

  // Hide sticky CTA on authenticated dashboard, admin, video, and quiz pages
  const hideRoutes = ["/dashboard", "/admin", "/classroom", "/video", "/test", "/quiz", "/login", "/signup"];
  const shouldHide = hideRoutes.some((route) => pathname === route || pathname?.startsWith(route));

  if (shouldHide) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#14532D]/95 backdrop-blur-md border-t border-emerald-500/30 shadow-[0_-8px_20px_rgba(0,0,0,0.25)] animate-slideUp">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 fill-gray-950" />
          </div>
          <div>
            <p className="text-xs font-black text-white leading-tight">Teacher Sathi AI</p>
            <p className="text-[10px] font-medium text-emerald-200/90">Instant NCERT Kit Generator</p>
          </div>
        </div>

        <Link
          href="/signup"
          className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs px-4 py-2.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <span>Try Free 🚀</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
