"use client";

import { useState, useEffect } from "react";
import { Download, Sparkles, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  useEffect(() => {
    // Register Service Worker for PWA Offline Caching
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("TeacherSathi PWA SW registered:", registration.scope);
          },
          (err) => {
            console.log("TeacherSathi PWA SW registration failed:", err);
          }
        );
      });
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsPromptVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsPromptVisible(false);
    }
  };

  if (!isPromptVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#14532D] text-white p-3.5 px-5 rounded-full shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-slideDown max-w-sm w-[90%]">
      <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-black text-xs shrink-0">
        <Sparkles className="w-4 h-4 fill-gray-950" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-black text-white leading-tight">Install Teacher Sathi App</p>
        <p className="text-[10px] text-emerald-200">1-Tap 75&quot; Smartboard &amp; Offline Mode</p>
      </div>
      <button
        onClick={handleInstallClick}
        className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs px-3 py-1.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" /> Install
      </button>
      <button
        onClick={() => setIsPromptVisible(false)}
        className="text-emerald-200 hover:text-white p-1 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
