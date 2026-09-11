"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const startProgress = useCallback(() => {
    clearAllTimers();
    setIsVisible(true);
    setIsNavigating(true);
    setProgress(15);

    // Incrementally advance progress
    timerRef.current.push(
      setTimeout(() => setProgress(45), 80),
      setTimeout(() => setProgress(72), 200),
      setTimeout(() => setProgress(88), 450),
      // Fallback timeout in case navigation is cancelled
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(100);
        setTimeout(() => setIsVisible(false), 250);
      }, 4000)
    );
  }, []);

  const completeProgress = useCallback(() => {
    clearAllTimers();
    setProgress(100);
    setIsNavigating(false);
    timerRef.current.push(
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 250)
    );
  }, []);

  // Listen for route changes
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams, completeProgress]);

  // Intercept click on internal links to start progress immediately
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest <a> anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, target="_blank", mailto, tel, hash on current page
      if (
        anchor.target === "_blank" ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // If clicking same page hash or exact same URL, don't start
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl || href === window.location.pathname) {
        return;
      }

      // Trigger navigation loader
      startProgress();
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      clearAllTimers();
    };
  }, [startProgress]);

  if (!isVisible) return null;

  return (
    <>
      {/* Top glowing progress bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[3px] bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(251,191,36,0.9),0_0_4px_rgba(16,185,129,0.9)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 100 ? "180ms" : "250ms",
            opacity: isVisible ? 1 : 0,
          }}
        />
      </div>

      {/* Subtle micro-veil that masks the visual jump during chunk transition */}
      {isNavigating && (
        <div 
          className="fixed inset-0 z-[99990] bg-white/25 backdrop-blur-[1.5px] pointer-events-none animate-fadeIn transition-opacity duration-150"
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default function PageNavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}

