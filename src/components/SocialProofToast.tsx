"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { CheckCircle2, Zap, X } from "lucide-react";

const SAMPLE_NOTIFICATIONS = [
  { teacher: "Anita Sharma (Science TGT)", location: "Bhopal, Madhya Pradesh", kit: "Class 10 Light Mind Map PDF", time: "2 mins ago" },
  { teacher: "Rajesh Kumar (KVS Educator)", location: "Patna, Bihar", kit: "Class 8 Science Worksheet", time: "5 mins ago" },
  { teacher: "Pooja Verma (CBSE Teacher)", location: "Jaipur, Rajasthan", kit: "Class 9 Social Science Smartboard Kit", time: "8 mins ago" },
  { teacher: "Suresh Patel (Maths PGT)", location: "Ahmedabad, Gujarat", kit: "Class 10 Polynomials Test Paper", time: "12 mins ago" },
  { teacher: "Meenakshi Sundaram (PRT)", location: "Madurai, Tamil Nadu", kit: "Class 7 English Interactive Slides", time: "15 mins ago" },
];

export default function SocialProofToast() {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Hide on authenticated dashboard, admin, classroom, student and exam views
  const hideRoutes = [
    "/dashboard",
    "/admin",
    "/classroom",
    "/student",
    "/video",
    "/test",
    "/quiz",
    "/login",
    "/signup"
  ];
  const shouldHide = hideRoutes.some((route) => pathname === route || pathname?.startsWith(route));

  // Check dismissal state in session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("sathi_social_proof_dismissed") === "true";
      if (dismissed) setIsDismissed(true);
    }
  }, []);

  // Listen for scroll on marketing pages to prevent overlapping hero CTAs & trust badges
  useEffect(() => {
    if (typeof window === "undefined" || shouldHide) return;

    const handleScroll = () => {
      if (window.scrollY > 350) {
        setHasScrolled(true);
      }
    };

    if (window.scrollY > 350) {
      setHasScrolled(true);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldHide]);

  useEffect(() => {
    if (shouldHide || isDismissed || !hasScrolled) return;

    // Show toast after initial delay once scrolled, then rotate every 11s
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const interval = setInterval(() => {
      setIsVisible(true);
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_NOTIFICATIONS.length);

      setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [shouldHide, isDismissed, hasScrolled]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sathi_social_proof_dismissed", "true");
    }
  };

  if (shouldHide || isDismissed || !hasScrolled || !isVisible) return null;

  const current = SAMPLE_NOTIFICATIONS[currentIndex];

  return (
    <div className="hidden sm:flex fixed bottom-6 left-6 z-30 bg-white/95 backdrop-blur-md border border-emerald-300/80 rounded-2xl shadow-2xl p-3.5 max-w-sm items-center gap-3 animate-slideUp text-gray-900 border-l-4 border-l-emerald-600 transition-all">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-emerald-200">
        <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
      </div>
      <div className="space-y-0.5 text-xs flex-1 min-w-0">
        <p className="font-extrabold text-gray-900 flex items-center justify-between gap-1">
          <span className="truncate">{current.teacher}</span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">{current.time}</span>
        </p>
        <p className="text-gray-500 font-medium text-[10px] truncate">{current.location}</p>
        <p className="text-emerald-950 font-bold text-[11px] flex items-center gap-1 truncate">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 inline" />
          <span className="truncate">Generated {current.kit}</span>
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-5 cursor-pointer transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

