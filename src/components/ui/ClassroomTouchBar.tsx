"use client";

import * as React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  PenTool, 
  FileText, 
  Sparkles, 
  LogOut,
  Maximize2,
  Minimize2
} from "lucide-react";

export interface ClassroomTouchBarProps {
  currentSlide: number;
  totalSlides: number;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onStartQuiz?: () => void;
  onOpenWhiteboard?: () => void;
  onOpenResources?: () => void;
  onAskSaathi?: () => void;
  onEndClass?: () => void;
  isQuizActive?: boolean;
  isWhiteboardActive?: boolean;
  theme?: "dark" | "light";
  className?: string;
}

export function ClassroomTouchBar({
  currentSlide,
  totalSlides,
  onNextSlide,
  onPrevSlide,
  onStartQuiz,
  onOpenWhiteboard,
  onOpenResources,
  onAskSaathi,
  onEndClass,
  isQuizActive = false,
  isWhiteboardActive = false,
  theme = "dark",
  className = "",
}: ClassroomTouchBarProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Global Keyboard Navigation (Addressing UX-025)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "Space" || e.key === "PageDown") {
        e.preventDefault();
        onNextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        onPrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextSlide, onPrevSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const isDark = theme === "dark";

  return (
    <nav
      aria-label="Classroom Smartboard Controls"
      className={`w-full flex-shrink-0 flex items-center justify-between px-6 sm:px-10 py-3.5 border-t select-none transition-colors duration-200 ${
        isDark
          ? "bg-[#080D14] border-[#1E293B] text-slate-100"
          : "bg-white border-slate-200 text-slate-900 shadow-lg"
      } ${className}`}
    >
      {/* Left: Secondary Tools (Whiteboard, Quiz, Resources) */}
      <div className="flex items-center gap-3">
        {onOpenWhiteboard && (
          <button
            onClick={onOpenWhiteboard}
            className={`min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              isWhiteboardActive
                ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                : isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-emerald-300 border-[#20334D]"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
          >
            <PenTool className="w-5 h-5 text-emerald-400" />
            <span className="hidden sm:inline">Whiteboard</span>
          </button>
        )}

        {onOpenResources && (
          <button
            onClick={onOpenResources}
            className={`min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              !isWhiteboardActive && !isQuizActive
                ? "bg-blue-600 text-white border-blue-400 shadow-md"
                : isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-blue-300 border-[#20334D]"
                : "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
            }`}
          >
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="hidden sm:inline">Slides</span>
          </button>
        )}

        {onStartQuiz && (
          <button
            onClick={onStartQuiz}
            className={`min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              isQuizActive
                ? "bg-purple-600 text-white border-purple-400 shadow-md"
                : isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-purple-300 border-[#20334D]"
                : "bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200"
            }`}
          >
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span className="hidden sm:inline">Quiz</span>
          </button>
        )}

        {onAskSaathi && (
          <button
            onClick={onAskSaathi}
            className={`min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-amber-300 border-[#20334D]"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline">Ask Saathi</span>
          </button>
        )}
      </div>

      {/* Center: Slide Navigation (Primary Tactile Target >= 64px) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevSlide}
          disabled={currentSlide <= 1}
          aria-label="Previous Slide"
          className={`min-h-[56px] sm:min-h-[64px] min-w-[56px] sm:min-w-[64px] px-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
            isDark
              ? "bg-[#1E293B] hover:bg-[#334155] text-white border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="hidden md:inline text-base">Prev</span>
        </button>

        <div className="text-center px-2">
          <span className="font-mono text-base sm:text-xl font-black tracking-wider block">
            Slide {currentSlide} / {totalSlides}
          </span>
        </div>

        <button
          onClick={onNextSlide}
          disabled={currentSlide >= totalSlides}
          aria-label="Next Slide"
          className="min-h-[56px] sm:min-h-[64px] min-w-[56px] sm:min-w-[64px] px-6 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-2 border-emerald-400/50 shadow-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-base sm:text-lg"
        >
          <span>Next</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Right: Fullscreen & End Class */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Presentation"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Presentation"}
          className={`min-h-[56px] sm:min-h-[64px] min-w-[56px] sm:min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
            isDark
              ? "bg-[#131F30] hover:bg-[#1E2D44] text-slate-300 border-[#20334D]"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        {onEndClass && (
          <button
            onClick={onEndClass}
            className="min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 bg-red-600/90 hover:bg-red-500 active:bg-red-700 text-white border border-red-400/30 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">End Class</span>
          </button>
        )}
      </div>
    </nav>
  );
}
