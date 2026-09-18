"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { Download, Sparkles, X, CheckCircle2 } from "lucide-react";

export default function ExitIntentModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Only show on marketing / prospective routes, never interrupt authenticated workspaces or exams
  const hideRoutes = ["/dashboard", "/admin", "/classroom", "/student", "/video", "/test", "/quiz", "/login", "/signup"];
  const shouldHide = hideRoutes.some((route) => pathname === route || pathname?.startsWith(route));

  useEffect(() => {
    if (typeof window === "undefined" || shouldHide) return;

    const isDismissed = sessionStorage.getItem("sathi_exit_intent_dismissed") === "true";
    if (isDismissed) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem("sathi_exit_intent_dismissed", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasTriggered, shouldHide]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sathi_exit_intent_dismissed", "true");
    }
  };

  if (shouldHide || !isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500 shadow-2xl space-y-5 text-gray-900 relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-inner">
          <Sparkles className="w-7 h-7 text-emerald-600 fill-emerald-600" />
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold bg-amber-400 text-gray-950 px-3 py-1 rounded-full uppercase tracking-wider">
            Before You Leave — Free Gift 🎁
          </span>
          <h3 className="text-2xl font-black text-gray-900 font-serif">
            Free NCERT Class 10 Science Revision Bundle!
          </h3>
          <p className="text-xs text-gray-600 font-medium">
            Download our complete 45-page Class 10 Science revision PDF bundle containing mind maps, formulas, and board exam question banks.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1 text-xs font-bold text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free • No Credit Card
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready for 75&quot; Smartboard
          </div>
        </div>

        <button
          onClick={() => {
            alert("Downloading Free NCERT Class 10 Science Revision Kit Bundle PDF!");
            handleClose();
          }}
          className="w-full py-4 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-300" /> Download Free Science Kit Bundle (PDF)
        </button>
      </div>
    </div>
  );
}
