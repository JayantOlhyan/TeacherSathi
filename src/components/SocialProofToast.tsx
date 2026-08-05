"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

const SAMPLE_NOTIFICATIONS = [
  { teacher: "Anita Sharma", location: "Bhopal, Madhya Pradesh", kit: "Class 8 Science Kit" },
  { teacher: "Rajesh Kumar", location: "Patna, Bihar", kit: "Class 10 Maths Quiz" },
  { teacher: "Pooja Verma", location: "Jaipur, Rajasthan", kit: "Class 9 Social Science Mind Map" },
  { teacher: "Suresh Patel", location: "Ahmedabad, Gujarat", kit: "Class 7 Science Presentation" },
  { teacher: "Meenakshi Sundaram", location: "Madurai, Tamil Nadu", kit: "Class 10 English Worksheet" },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast every 12 seconds
    const interval = setInterval(() => {
      setIsVisible(true);
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_NOTIFICATIONS.length);

      // Hide toast after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const current = SAMPLE_NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-24 left-5 sm:bottom-6 sm:left-6 z-40 bg-white border border-emerald-200 rounded-2xl shadow-xl p-3.5 max-w-xs sm:max-w-sm flex items-center gap-3 animate-slideUp text-gray-900">
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
        <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-600" />
      </div>
      <div className="space-y-0.5 text-xs">
        <p className="font-bold text-gray-900 flex items-center gap-1">
          <span>{current.teacher}</span>
          <span className="text-[10px] text-gray-400 font-normal">({current.location})</span>
        </p>
        <p className="text-gray-600 font-medium text-[11px] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
          <span>Generated {current.kit}</span>
        </p>
      </div>
    </div>
  );
}
