"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { Download, Sparkles, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  // Hide on distraction-free classroom presentation and examination pages
  const hideRoutes = ["/classroom", "/video", "/test", "/quiz"];
  const shouldHide = hideRoutes.some((route) => pathname === route || pathname?.startsWith(route));

  useEffect(() => {
    // Check if dismissed previously
    if (typeof window !== "undefined" && localStorage.getItem("sathi_pwa_dismissed") === "true") {
      return;
    }

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
      // Only show if not dismissed
      if (typeof window !== "undefined" && localStorage.getItem("sathi_pwa_dismissed") === "true") {
        return;
      }
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

  const handleDismiss = () => {
    setIsPromptVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("sathi_pwa_dismissed", "true");
    }
  };

  if (shouldHide || !isPromptVisible) return null;

  return (
    <div className="fixed bottom-36 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-40 bg-[#14532D]/95 backdrop-blur-md text-white p-3 px-4 rounded-2xl sm:rounded-full shadow-2xl border border-emerald-400/40 flex items-center gap-3 sm:w-auto max-w-md animate-slideUp">
      <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
        <Sparkles className="w-4 h-4 fill-gray-950" />
      </div>
      <div className="flex-1 min-w-0 text-xs">
        <p className="font-black text-white leading-tight truncate">Install Teacher Sathi App</p>
        <p className="text-[10px] text-emerald-200 truncate">1-Tap 75&quot; Smartboard &amp; Offline Mode</p>
      </div>
      <button
        onClick={handleInstallClick}
        className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs px-3 py-1.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
      >
        <Download className="w-3.5 h-3.5" /> Install
      </button>
      <button
        onClick={handleDismiss}
        className="text-emerald-200 hover:text-white p-1 cursor-pointer shrink-0 transition-colors"
        aria-label="Dismiss app install prompt"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

