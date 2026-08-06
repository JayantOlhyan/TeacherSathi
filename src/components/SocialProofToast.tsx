"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Zap } from "lucide-react";

const SAMPLE_NOTIFICATIONS = [
  { teacher: "Anita Sharma (Science TGT)", location: "Bhopal, Madhya Pradesh", kit: "Class 10 Light Mind Map PDF", time: "2 mins ago" },
  { teacher: "Rajesh Kumar (KVS Educator)", location: "Patna, Bihar", kit: "Class 8 Science Worksheet", time: "5 mins ago" },
  { teacher: "Pooja Verma (CBSE Teacher)", location: "Jaipur, Rajasthan", kit: "Class 9 Social Science Smartboard Kit", time: "8 mins ago" },
  { teacher: "Suresh Patel (Maths PGT)", location: "Ahmedabad, Gujarat", kit: "Class 10 Polynomials Test Paper", time: "12 mins ago" },
  { teacher: "Meenakshi Sundaram (PRT)", location: "Madurai, Tamil Nadu", kit: "Class 7 English Interactive Slides", time: "15 mins ago" },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast after 4s initial delay, then rotate every 10s
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

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
  }, []);

  if (!isVisible) return null;

  const current = SAMPLE_NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-24 left-5 sm:bottom-6 sm:left-6 z-40 bg-white border border-emerald-300/80 rounded-2xl shadow-2xl p-3.5 max-w-xs sm:max-w-sm flex items-center gap-3 animate-slideUp text-gray-900 border-l-4 border-l-emerald-600">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-emerald-200">
        <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
      </div>
      <div className="space-y-0.5 text-xs">
        <p className="font-extrabold text-gray-900 flex items-center justify-between gap-1">
          <span>{current.teacher}</span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{current.time}</span>
        </p>
        <p className="text-gray-500 font-medium text-[10px]">{current.location}</p>
        <p className="text-emerald-950 font-bold text-[11px] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
          <span>Generated {current.kit}</span>
        </p>
      </div>
    </div>
  );
}
