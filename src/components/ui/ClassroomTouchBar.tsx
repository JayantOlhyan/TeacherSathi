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
  Minimize2,
  Sun,
  Moon,
  Clock,
  Users,
  Languages,
  EyeOff
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
  onOpenTimer?: () => void;
  onOpenStudentPicker?: () => void;
  onEndClass?: () => void;
  onToggleTheme?: () => void;
  onToggleHindi?: () => void;
  onToggleBlackout?: () => void;
  isQuizActive?: boolean;
  isWhiteboardActive?: boolean;
  isHindiMode?: boolean;
  isBlackoutActive?: boolean;
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
  onOpenTimer,
  onOpenStudentPicker,
  onEndClass,
  onToggleTheme,
  onToggleHindi,
  onToggleBlackout,
  isQuizActive = false,
  isWhiteboardActive = false,
  isHindiMode = false,
  isBlackoutActive = false,
  theme = "dark",
  className = "",
}: ClassroomTouchBarProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Sync state with native browser fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Global Hardware Clicker & Keyboard Navigation (UX-025 & Classroom Kiosk)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Next Slide (Standard Clicker & Arrows)
      if (e.key === "ArrowRight" || e.key === "Space" || e.key === "PageDown") {
        e.preventDefault();
        onNextSlide();
      } 
      // Previous Slide (Standard Clicker & Arrows)
      else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        onPrevSlide();
      }
      // Blank/Blackout Screen (Clicker 'B' or '.' button)
      else if ((e.key === "b" || e.key === "B" || e.key === ".") && onToggleBlackout) {
        e.preventDefault();
        onToggleBlackout();
      }
      // Toggle Whiteboard (Key W)
      else if ((e.key === "w" || e.key === "W") && onOpenWhiteboard) {
        e.preventDefault();
        onOpenWhiteboard();
      }
      // Toggle Activity Timer (Key T)
      else if ((e.key === "t" || e.key === "T") && onOpenTimer) {
        e.preventDefault();
        onOpenTimer();
      }
      // Pick Random Student (Key S)
      else if ((e.key === "s" || e.key === "S") && onOpenStudentPicker) {
        e.preventDefault();
        onOpenStudentPicker();
      }
      // Toggle Quiz (Key Q)
      else if ((e.key === "q" || e.key === "Q") && onStartQuiz) {
        e.preventDefault();
        onStartQuiz();
      }
      // Toggle Hindi/Vernacular (Key H)
      else if ((e.key === "h" || e.key === "H") && onToggleHindi) {
        e.preventDefault();
        onToggleHindi();
      }
      // Toggle Fullscreen (Key F)
      else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onNextSlide, 
    onPrevSlide, 
    onToggleBlackout, 
    onOpenWhiteboard, 
    onOpenTimer, 
    onOpenStudentPicker, 
    onStartQuiz, 
    onToggleHindi, 
    toggleFullscreen
  ]);

  const isDark = theme === "dark";

  return (
    <nav
      aria-label="Classroom Smartboard Controls"
      className={`w-full flex-shrink-0 flex items-center justify-between px-6 sm:px-10 py-3.5 border-t select-none transition-colors duration-200 z-30 ${
        isDark
          ? "bg-[#080D14] border-[#1E293B] text-slate-100"
          : "bg-white border-slate-200 text-slate-900 shadow-xl"
      } ${className}`}
    >
      {/* Left: Secondary Tools (Whiteboard, Quiz, Resources, Saathi) — All >= 64px (UX-011) */}
      <div className="flex items-center gap-3">
        {onOpenWhiteboard && (
          <button
            onClick={onOpenWhiteboard}
            aria-label="Open Interactive Whiteboard"
            className={`min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              isWhiteboardActive
                ? "bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/30"
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
            aria-label="View Lesson Resources"
            className={`min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              !isWhiteboardActive && !isQuizActive
                ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30"
                : isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-blue-300 border-[#20334D]"
                : "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
            }`}
          >
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="hidden sm:inline">Resources</span>
          </button>
        )}

        {onStartQuiz && (
          <button
            onClick={onStartQuiz}
            aria-label="Start Quick Check Quiz"
            className={`min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              isQuizActive
                ? "bg-purple-600 text-white border-purple-400 shadow-md ring-2 ring-purple-400/30"
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
            aria-label="Ask Saathi Co-Pilot"
            className={`min-h-[64px] px-5 sm:px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 border cursor-pointer ${
              isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-amber-300 border-[#20334D]"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline">Ask Saathi</span>
          </button>
        )}

        {onOpenTimer && (
          <button
            onClick={onOpenTimer}
            aria-label="Open Activity Countdown Timer"
            className={`min-h-[64px] px-4 sm:px-5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 border cursor-pointer ${
              isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-amber-300 border-[#20334D]"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
            }`}
          >
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="hidden lg:inline">Timer</span>
          </button>
        )}

        {onOpenStudentPicker && (
          <button
            onClick={onOpenStudentPicker}
            aria-label="Pick Random Student"
            className={`min-h-[64px] px-4 sm:px-5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 border cursor-pointer ${
              isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-indigo-300 border-[#20334D]"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200"
            }`}
          >
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="hidden lg:inline">Call Student</span>
          </button>
        )}
      </div>

      {/* Center: Slide Navigation (Primary Tactile Target >= 64px) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevSlide}
          disabled={currentSlide <= 1}
          aria-label="Previous Slide"
          className={`min-h-[64px] min-w-[64px] px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
            isDark
              ? "bg-[#1E293B] hover:bg-[#334155] text-white border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="hidden md:inline text-base">Prev</span>
        </button>

        <div className="text-center px-3">
          <span className="font-mono text-lg sm:text-2xl font-black tracking-wider block">
            Slide {currentSlide} / {totalSlides}
          </span>
        </div>

        <button
          onClick={onNextSlide}
          disabled={currentSlide >= totalSlides}
          aria-label="Next Slide"
          className="min-h-[64px] min-w-[64px] px-8 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-2 border-emerald-400/50 shadow-xl disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-base sm:text-lg"
        >
          <span>Next</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Right: Theme Toggle, Language Flip, Fullscreen & End Class */}
      <div className="flex items-center gap-3">
        {onToggleHindi && (
          <button
            onClick={onToggleHindi}
            title={isHindiMode ? "Switch to English" : "Switch to Hindi (हिंदी)"}
            aria-label={isHindiMode ? "Switch to English" : "Switch to Hindi"}
            className={`min-h-[64px] px-4 rounded-2xl flex items-center justify-center gap-1.5 border transition-all active:scale-95 cursor-pointer font-bold ${
              isHindiMode
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black"
                : isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-slate-200 border-[#20334D]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            }`}
          >
            <Languages className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-extrabold">{isHindiMode ? "हिंदी" : "EN"}</span>
          </button>
        )}

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to High-Contrast Light Mode" : "Switch to Anti-Glare Dark Mode"}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`min-h-[64px] min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-amber-400 border-[#20334D]"
                : "bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300"
            }`}
          >
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        )}

        {onToggleBlackout && (
          <button
            onClick={onToggleBlackout}
            title={isBlackoutActive ? "Resume Screen (Clicker 'B')" : "Pause Screen / Blackout (Clicker 'B')"}
            aria-label={isBlackoutActive ? "Resume Screen" : "Pause Screen"}
            className={`min-h-[64px] min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              isBlackoutActive
                ? "bg-amber-600 text-white border-amber-400 shadow-lg ring-2 ring-amber-400/30"
                : isDark
                ? "bg-[#131F30] hover:bg-[#1E2D44] text-slate-300 border-[#20334D]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            <EyeOff className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Presentation"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Presentation"}
          className={`min-h-[64px] min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
            isDark
              ? "bg-[#131F30] hover:bg-[#1E2D44] text-slate-300 border-[#20334D]"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
        </button>

        {onEndClass && (
          <button
            onClick={onEndClass}
            aria-label="End Classroom Session"
            className="min-h-[64px] px-6 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border border-red-400/40 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">End Class</span>
          </button>
        )}
      </div>
    </nav>
  );
}
