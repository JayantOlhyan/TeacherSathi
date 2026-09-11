"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function StartupSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Initializing TeacherSathi AI...");

  useEffect(() => {
    // Check if splash was already shown in this tab session
    const hasSeenSplash = typeof window !== "undefined" && sessionStorage.getItem("ts_startup_splash_seen");
    
    // If already seen in this session, keep display brief (350ms) to still smooth out hydration jitter
    const displayDuration = hasSeenSplash ? 350 : 850;

    // Progress bar animation simulation
    const p1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Connecting NCERT & CBSE Curriculum...");
    }, displayDuration * 0.25);

    const p2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Configuring Smartboard Co-Pilot...");
    }, displayDuration * 0.6);

    const p3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Ready!");
    }, displayDuration * 0.85);

    // Fade out and unmount
    const endTimer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem("ts_startup_splash_seen", "true");
      } catch {
        // Ignore sessionStorage restrictions if private browsing
      }
    }, displayDuration);

    // Absolute fallback safety to ensure it NEVER stays stuck
    const safetyTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1600);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(endTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ts-startup-splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.03, 
            filter: "blur(8px)",
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#041F14] text-white selection:bg-none pointer-events-auto"
          aria-hidden="true"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.18)_0%,rgba(4,31,20,0.98)_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Mascot Icon Container with Glow Ring */}
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative mb-6"
            >
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-500/20 via-amber-400/20 to-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#062E1E] to-[#0A3D28] border-2 border-emerald-400/30 p-2.5 shadow-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/assets/owl-green-v2.png"
                  alt="TeacherSathi AI Mascot"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              </div>
            </motion.div>

            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
              className="mb-2"
            >
              <Image
                src="/logo-horizontal-on-dark.png"
                alt="TeacherSathi AI"
                width={180}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain mx-auto"
                priority
              />
            </motion.div>

            {/* Subtitle / Microcopy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[11px] sm:text-xs text-emerald-200/90 font-medium tracking-wide mb-6"
            >
              भारत का समर्पित NCERT AI साथी
            </motion.p>

            {/* Progress Bar Container */}
            <div className="w-56 sm:w-64 h-1.5 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-800/40 p-[1px] relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 rounded-full"
                initial={{ width: "10%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
              />
            </div>

            {/* Status text */}
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] text-emerald-300/80 font-mono mt-3 h-4"
            >
              {statusText}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
