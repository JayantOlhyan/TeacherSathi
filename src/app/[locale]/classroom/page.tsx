"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Tv,
  Clock,
  ShieldCheck,
  QrCode,
  Wifi,
  WifiOff,
  Play,
  HelpCircle,
  Lock,
  BookOpen,
  PenTool,
  Sun,
  Moon,
  EyeOff
} from "lucide-react";
import { useClassroomRealtime } from "@/lib/classroom/useClassroomRealtime";
import { SmartboardSlideViewer } from "@/components/classroom/SmartboardSlideViewer";
import { ClassroomTouchBar } from "@/components/ui/ClassroomTouchBar";
import { ClassroomWhiteboard } from "@/components/classroom/ClassroomWhiteboard";
import { ClassroomQuickCheck } from "@/components/classroom/ClassroomQuickCheck";
import { SaathiClassroomDrawer } from "@/components/classroom/SaathiClassroomDrawer";
import { ClassroomResourceDrawer } from "@/components/classroom/ClassroomResourceDrawer";
import { ClassroomTimerModal } from "@/components/classroom/ClassroomTimerModal";
import { ClassroomStudentPicker } from "@/components/classroom/ClassroomStudentPicker";
import { ConfirmDialog } from "@/components/ui/Dialog";
import type { PresentationSlide } from "@/lib/validations/resources";

// Preset Curricula for Direct Smartboard Selection (UX-004)
const PRESET_CHAPTERS = [
  {
    grade: "Class 8",
    subject: "Science",
    chapter: "Chapter 1",
    title: "Crop Production and Management",
    slides: [
      {
        type: "TITLE" as const,
        title: "Crop Production and Management",
        subtitle: "NCERT Class 8 Science • Chapter 1",
        body: "Comprehensive Smartboard module covering agricultural practices, soil prep, and modern irrigation.",
      },
      {
        type: "CONTENT" as const,
        title: "Key Agricultural Practices",
        subtitle: "Sequential Steps for High-Yield Farming",
        bullets: [
          "Preparation of Soil (Tilling and Ploughing to aerate roots)",
          "Selection and Sowing of high-yielding, clean seeds",
          "Adding Manure and Fertilisers to replenish nitrogen & minerals",
          "Irrigation (Scheduling water delivery according to crop stage)",
          "Weeding and Protection from Pests",
          "Harvesting and Safe Storage in silos/granaries",
        ],
      },
      {
        type: "IMAGE" as const,
        title: "Modern Irrigation: Drip System",
        body: "Water falls drop-by-drop directly at the position of the roots. Ideal for regions with acute water scarcity.",
      },
      {
        type: "DIAGRAM" as const,
        title: "The Nitrogen Cycle in Nature",
        body: "Circulation of atmospheric nitrogen through living organisms and soil chemistry.",
        diagram_code: `Atmospheric Nitrogen (N2)
  ├──> Biological Fixation (Rhizobium in leguminous roots & Cyanobacteria)
  ├──> Lightning Fixation (Nitrates in rainwater)
  ├──> Soil Nitrates & Nitrites (Plant absorption)
  └──> Decomposer Bacteria ──> Denitrifying Bacteria ──> N2 released back`,
      },
      {
        type: "QUESTION" as const,
        title: "Formative Check: Soil Enrichment",
        question_text: "Which of the following organic fertilizers improves both soil texture and water retention capacity?",
        question_options: ["Urea (Synthetic)", "Decomposed Manure", "Ammonium Sulphate", "Potash"],
        correct_option_index: 1,
      },
      {
        type: "ACTIVITY" as const,
        title: "Class Activity: Seed Quality Test",
        activity_prompt: "Place a handful of gram seeds in a beaker of water. Observe and note down why damaged hollow seeds float while healthy seeds sink.",
        bullets: [
          "Take a 250ml glass beaker and fill half with clean water",
          "Drop 20 gram seeds and stir gently",
          "Wait 2 minutes and observe which seeds sink and which float",
          "Discuss with your partner why damaged seeds become lighter",
        ],
      },
      {
        type: "SUMMARY" as const,
        title: "Chapter 1 Summary & Revision",
        bullets: [
          "Kharif crops: Sown in rainy season (June–Sept) e.g., Paddy, Maize.",
          "Rabi crops: Grown in winter (Oct–March) e.g., Wheat, Mustard, Gram.",
          "Organic manure is superior to chemical fertilisers for soil sustainability.",
          "Drip irrigation provides maximum water efficiency with zero runoff loss.",
        ],
      },
    ],
  },
  {
    grade: "Class 6",
    subject: "Science",
    chapter: "Chapter 2",
    title: "Components of Food",
    slides: [
      {
        type: "TITLE" as const,
        title: "Components of Food",
        subtitle: "NCERT Class 6 Science • Chapter 2",
        body: "Nutrients, balanced diet, and deficiency disease prevention for young learners.",
      },
      {
        type: "CONTENT" as const,
        title: "Essential Food Nutrients",
        subtitle: "Major Nutrients Required by Human Body",
        bullets: [
          "Carbohydrates & Fats: Energy-giving foods (Wheat, Rice, Ghee, Oils)",
          "Proteins: Body-building foods for growth and tissue repair (Pulses, Milk, Eggs)",
          "Vitamins & Minerals: Protective nutrients preventing diseases (Fruits, Vegetables)",
          "Dietary Fibre (Roughage): Facilitates healthy digestive peristalsis",
          "Water: Absorbs essential nutrients and flushes out metabolic waste",
        ],
      },
      {
        type: "QUESTION" as const,
        title: "Nutrient Identification",
        question_text: "Which vitamin is synthesized in our body upon exposure to morning sunlight?",
        question_options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
        correct_option_index: 3,
      },
      {
        type: "SUMMARY" as const,
        title: "Balanced Diet Takeaway",
        bullets: [
          "A balanced diet contains adequate proportions of all required nutrients plus roughage and water.",
          "Deficiency of Vitamin C leads to Scurvy with bleeding gums.",
          "Iodine deficiency causes Goitre with swollen thyroid glands.",
        ],
      },
    ],
  },
  {
    grade: "Class 10",
    subject: "Science",
    chapter: "Chapter 1",
    title: "Chemical Reactions and Equations",
    slides: [
      {
        type: "TITLE" as const,
        title: "Chemical Reactions and Equations",
        subtitle: "NCERT Class 10 Science • Chapter 1",
        body: "Balancing equations, types of reactions, and redox processes in daily life.",
      },
      {
        type: "CONTENT" as const,
        title: "Types of Chemical Reactions",
        subtitle: "Fundamental Classification",
        bullets: [
          "Combination Reaction: Two or more reactants combine to form a single product",
          "Decomposition Reaction: Single reactant breaks down to form multiple products",
          "Displacement Reaction: More reactive element displaces less reactive element",
          "Double Displacement: Exchange of ions between two aqueous compounds",
          "Oxidation & Reduction (Redox): Loss and gain of electrons or oxygen",
        ],
      },
      {
        type: "QUESTION" as const,
        title: "Reaction Identification",
        question_text: "What type of reaction occurs when Quicklime (CaO) reacts vigorously with water to form Slaked Lime?",
        question_options: ["Decomposition", "Combination & Exothermic", "Displacement", "Endothermic"],
        correct_option_index: 1,
      },
      {
        type: "SUMMARY" as const,
        title: "Key Revision Takeaways",
        bullets: [
          "Mass is neither created nor destroyed in a chemical reaction (Law of Conservation of Mass).",
          "Corrosion and rancidity are everyday impacts of oxidation.",
          "Antioxidants prevent oxidation of fatty and oily food items.",
        ],
      },
    ],
  },
];

export default function ClassroomKioskPage() {
  const [boardId, setBoardId] = useState("Board-001");
  const [sessionId, setSessionId] = useState("");
  const [pairingToken, setPairingToken] = useState("");
  const [pairingUrl, setPairingUrl] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Navigation & In-Class Tabs (UX-011, UX-013)
  const [activeTab, setActiveTab] = useState<"content" | "whiteboard" | "quiz">("content");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentationSlides, setPresentationSlides] = useState<PresentationSlide[]>(PRESET_CHAPTERS[0].slides);
  const [returnUrl, setReturnUrl] = useState("/dashboard");
  const [sessionTitle, setSessionTitle] = useState("Grade 8 • Science — Live Smartboard Session");
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Standalone Start Flag (UX-004: Direct classroom entry without phone)
  const [isStandaloneActive, setIsStandaloneActive] = useState(false);
  const [isPairingPanelOpen, setIsPairingPanelOpen] = useState(false);

  // Anti-Glare / Daylight Theme State (UX-021)
  const [classroomTheme, setClassroomTheme] = useState<"dark" | "light">("dark");

  // Drawers & Modals
  const [isSaathiDrawerOpen, setIsSaathiDrawerOpen] = useState(false);
  const [isResourceDrawerOpen, setIsResourceDrawerOpen] = useState(false);
  const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [isHindiMode, setIsHindiMode] = useState(false);
  const [isBlackoutActive, setIsBlackoutActive] = useState(false);

  // Curriculum Context for Slides, Quick Checks & Resources (Phase 17)
  const [curriculumContext, setCurriculumContext] = useState({
    grade: "class-8",
    gradeName: "Class 8",
    subject: "science",
    subjectName: "Science",
    chapter: "chapter-1",
    title: "Crop Production and Management",
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or fetch session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const bid = params.get("board_id") || "Board-001";
      setBoardId(bid);

      const ret = params.get("returnUrl") || "/dashboard";
      setReturnUrl(ret);

      const titleParam = params.get("title");
      const gradeParam = params.get("grade");
      const subjectParam = params.get("subject");
      const chapterParam = params.get("chapter");

      let computedTitle = "Grade 8 • Science — Live Smartboard Session";
      if (titleParam || gradeParam || subjectParam) {
        const cleanGrade = gradeParam ? gradeParam.replace("class-", "Class ") : "Class 8";
        const cleanSub = subjectParam ? subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1) : "Science";
        computedTitle = `${cleanGrade ? cleanGrade + " • " : ""}${cleanSub ? cleanSub + " — " : ""}${titleParam || PRESET_CHAPTERS[0].title}`;
        setSessionTitle(computedTitle);

        setCurriculumContext({
          grade: gradeParam || "class-8",
          gradeName: cleanGrade,
          subject: subjectParam || "science",
          subjectName: cleanSub,
          chapter: chapterParam || "chapter-1",
          title: titleParam || PRESET_CHAPTERS[0].title,
        });

        if (titleParam) {
          setPresentationSlides((prev) => {
            const updated = [...prev];
            if (updated[0]) {
              updated[0] = {
                ...updated[0],
                title: titleParam,
                subtitle: `NCERT ${cleanGrade} ${cleanSub}`,
              };
            }
            return updated;
          });
        }
      }

      const existingSessionId = params.get("sessionId") || params.get("session_id");
      if (existingSessionId) {
        setSessionId(existingSessionId);
        setIsInitializing(false);
      } else {
        fetch("/api/classroom/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: computedTitle,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.data?.id) {
              setSessionId(json.data.id);
            }
            setIsInitializing(false);
          })
          .catch(() => {
            setIsInitializing(false);
          });
      }

      // Phase 18 Resilience: Restore in-class progress on accidental refresh
      try {
        const savedSlide = sessionStorage.getItem("ts_classroom_slide");
        if (savedSlide !== null) {
          const parsed = parseInt(savedSlide, 10);
          if (!isNaN(parsed) && parsed >= 0) {
            setCurrentSlideIndex(parsed);
          }
        }
        const savedTab = sessionStorage.getItem("ts_classroom_tab");
        if (savedTab === "content" || savedTab === "whiteboard" || savedTab === "quiz") {
          setActiveTab(savedTab as "content" | "whiteboard" | "quiz");
        }
        const savedStandalone = sessionStorage.getItem("ts_classroom_standalone");
        if (savedStandalone === "true") {
          setIsStandaloneActive(true);
        }
      } catch {
        // Handled safely in private browsing
      }
    }
  }, []);

  // Phase 18 Resilience: Persist state continuously
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("ts_classroom_slide", String(currentSlideIndex));
      } catch {
        // Safe failover
      }
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("ts_classroom_tab", activeTab);
      } catch {
        // Safe failover
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== "undefined" && isStandaloneActive) {
      try {
        sessionStorage.setItem("ts_classroom_standalone", "true");
      } catch {
        // Safe failover
      }
    }
  }, [isStandaloneActive]);

  // Real-time classroom connection
  const { state, connectionStatus, sendCommand } = useClassroomRealtime({
    sessionId,
    deviceName: `Smartboard 75" (${boardId})`,
    role: "DISPLAY",
  });

  // Fetch real presentation slides if custom presentation is loaded
  useEffect(() => {
    const pid = state?.presentation.presentationId;
    if (pid && pid !== "pres-crop-production" && pid !== "pres-default" && pid !== "pres-1") {
      fetch(`/api/presentations/${pid}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data?.content?.slides?.length) {
            setPresentationSlides(json.data.content.slides);
          }
        })
        .catch(() => {});
    }
  }, [state?.presentation.presentationId]);

  // Request new pairing token from server (optional)
  const requestPairingToken = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/classroom/sessions/${sessionId}/pair`, {
        method: "POST",
      });
      if (res.ok) {
        const json = await res.json();
        setPairingToken(json.data.token);
        setPairingUrl(json.data.pairingUrl);
        setSecondsRemaining(json.data.expiresInSeconds || 300);
      }
    } catch {
      // Handled silently
    }
  }, [sessionId]);

  // Generate pairing token on mount or request
  useEffect(() => {
    if (sessionId && (!state || state.session.status === "WAITING" || state.session.status === "PAIRING")) {
      requestPairingToken();
    }
  }, [sessionId, state, requestPairingToken]);

  // 5-minute countdown timer for pairing QR code
  useEffect(() => {
    if (state && state.session.status !== "WAITING" && state.session.status !== "PAIRING") {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          requestPairingToken();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [state, requestPairingToken]);

  // Synchronized countdown timer calculation
  const [remainingTimerSeconds, setRemainingTimerSeconds] = useState(0);

  useEffect(() => {
    if (!state?.timer.isRunning || !state.timer.endsAt) {
      setRemainingTimerSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const endsAtMs = new Date(state.timer.endsAt!).getTime();
      const diffSecs = Math.max(0, Math.ceil((endsAtMs - Date.now()) / 1000));
      setRemainingTimerSeconds(diffSecs);
    }, 500);

    return () => clearInterval(interval);
  }, [state?.timer.isRunning, state?.timer.endsAt]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Sync slide index from state if real-time state is active
  useEffect(() => {
    if (state?.presentation.isActive && typeof state.presentation.slideIndex === "number") {
      setCurrentSlideIndex(state.presentation.slideIndex);
    }
  }, [state?.presentation.isActive, state?.presentation.slideIndex]);

  // Global Slide Navigation Handlers (UX-025)
  const handleNextSlide = useCallback(() => {
    const total = presentationSlides.length;
    const nextIdx = Math.min(total - 1, currentSlideIndex + 1);
    setCurrentSlideIndex(nextIdx);

    if (sessionId && state?.presentation.isActive) {
      sendCommand("NEXT_SLIDE", {
        presentationId: state?.presentation.presentationId || "pres-1",
        slideIndex: nextIdx,
      });
    }
  }, [currentSlideIndex, presentationSlides.length, sessionId, state?.presentation.isActive, state?.presentation.presentationId, sendCommand]);

  const handlePrevSlide = useCallback(() => {
    const prevIdx = Math.max(0, currentSlideIndex - 1);
    setCurrentSlideIndex(prevIdx);

    if (sessionId && state?.presentation.isActive) {
      sendCommand("PREVIOUS_SLIDE", {
        presentationId: state?.presentation.presentationId || "pres-1",
        slideIndex: prevIdx,
      });
    }
  }, [currentSlideIndex, sessionId, state?.presentation.isActive, state?.presentation.presentationId, sendCommand]);

  // Global Keyboard Shortcuts (Addressing UX-025 for remote clickers & podium keyboards)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === "Escape") {
        setIsSaathiDrawerOpen(false);
        setIsResourceDrawerOpen(false);
      } else if (e.key === "w" || e.key === "W") {
        setActiveTab((prev) => (prev === "whiteboard" ? "content" : "whiteboard"));
      } else if (e.key === "q" || e.key === "Q") {
        setActiveTab((prev) => (prev === "quiz" ? "content" : "quiz"));
      } else if (e.key === "s" || e.key === "S") {
        setIsSaathiDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextSlide, handlePrevSlide]);

  // Direct Standalone Start on 75" Display (UX-004 Blocker Fix)
  const handleStartOnDisplay = async () => {
    setIsStandaloneActive(true);
    if (sessionId) {
      try {
        await fetch(`/api/classroom/sessions/${sessionId}/start`, { method: "POST" });
        await sendCommand("START_PRESENTATION", {
          presentationId: "pres-standalone",
          title: sessionTitle,
          totalSlides: presentationSlides.length,
          slideIndex: 0,
        });
      } catch {
        // Handled gracefully in offline/mock mode
      }
    }
  };

  // Preset Chapter Switching directly on smartboard
  const handleSelectPresetChapter = (presetIdx: number) => {
    const preset = PRESET_CHAPTERS[presetIdx];
    if (!preset) return;
    setActivePresetIndex(presetIdx);
    setSessionTitle(`${preset.grade} • ${preset.subject} — ${preset.title}`);
    setPresentationSlides(preset.slides);
    setCurrentSlideIndex(0);
    setCurriculumContext({
      grade: preset.grade.toLowerCase().replace(" ", "-"),
      gradeName: preset.grade,
      subject: preset.subject.toLowerCase(),
      subjectName: preset.subject,
      chapter: preset.chapter.toLowerCase().replace(" ", "-"),
      title: preset.title,
    });
  };

  // Safe End Classroom with Confirmation Dialog (UX-013 & Phase 18 cleanup)
  const handleConfirmEndSession = async () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("ts_classroom_slide");
        sessionStorage.removeItem("ts_classroom_tab");
        sessionStorage.removeItem("ts_classroom_standalone");
      } catch {
        // Safe failover
      }
    }
    if (sessionId) {
      try {
        await fetch(`/api/classroom/sessions/${sessionId}/end`, { method: "POST" });
        await sendCommand("SESSION_ENDED", {});
      } catch {
        // Handled silently
      }
    }
    setIsConfirmEndOpen(false);
    window.location.href = returnUrl;
  };

  const isSessionEnded = state?.session.status === "ENDED";
  const isSessionActive = isStandaloneActive || state?.session.status === "ACTIVE" || state?.session.status === "PAUSED";
  const isPairing = !isSessionActive && (!state || state.session.status === "WAITING" || state.session.status === "PAIRING");

  const isDark = classroomTheme === "dark";

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0B131E] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-300 font-black text-base tracking-wide">
            Initializing 75&quot; Smartboard Display...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans select-none overflow-hidden relative transition-colors duration-200 ${
        isDark ? "bg-[#0B131E] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Reconnection Alert Banner */}
      {connectionStatus !== "connected" && isSessionActive && (
        <div className="bg-amber-500 text-gray-950 px-6 py-2 flex items-center justify-between font-bold text-xs sm:text-sm z-50 shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>
              {connectionStatus === "reconnecting"
                ? "Classroom network interrupted. Reconnecting and syncing state..."
                : "Classroom offline. Standalone presentation & whiteboard active..."}
            </span>
          </div>
          <span className="text-[11px] bg-black/10 px-3 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
            Continuous Teaching Guard
          </span>
        </div>
      )}

      {/* Top 75" High-Contrast Smartboard Navbar (UX-009, UX-021) */}
      <header
        className={`px-8 py-3.5 border-b flex items-center justify-between flex-shrink-0 transition-colors duration-200 ${
          isDark
            ? "bg-[#080D14]/95 border-slate-800 backdrop-blur-md"
            : "bg-white/95 border-slate-200 shadow-sm backdrop-blur-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-inner ${
              isDark
                ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-400"
                : "bg-emerald-100 border border-emerald-300 text-[#0F5B38]"
            }`}
          >
            <Tv className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black font-serif tracking-wide">
                TeacherSathi Smartboard
              </h1>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                    : "bg-emerald-100 text-[#0F5B38] border-emerald-300"
                }`}
              >
                75&quot; IFP Kiosk
              </span>
            </div>
            <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {boardId} • Room 102 • {sessionTitle}
            </p>
          </div>
        </div>

        {/* In-Class Mode Switcher (Visible when teaching) */}
        {isSessionActive && (
          <div className="hidden md:flex items-center gap-2 bg-black/10 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab("content")}
              className={`min-h-[48px] px-5 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "content"
                  ? "bg-emerald-600 text-white shadow-md"
                  : isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Slides</span>
            </button>

            <button
              onClick={() => setActiveTab("whiteboard")}
              className={`min-h-[48px] px-5 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "whiteboard"
                  ? "bg-emerald-600 text-white shadow-md"
                  : isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Whiteboard</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`min-h-[48px] px-5 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-purple-600 text-white shadow-md"
                  : isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Clicker Quiz</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Synchronized Live Timer Pill */}
          {remainingTimerSeconds > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full font-mono text-sm font-black animate-pulse">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(remainingTimerSeconds)}</span>
            </div>
          )}

          {/* Theme Switcher Button (UX-021) */}
          <button
            onClick={() => setClassroomTheme(isDark ? "light" : "dark")}
            title={isDark ? "Switch to High-Contrast Daylight Mode" : "Switch to Anti-Glare Dark Mode"}
            aria-label="Toggle Theme"
            className={`min-h-[48px] min-w-[48px] rounded-xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? "bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700"
                : "bg-white text-indigo-600 border-slate-200 hover:bg-slate-100 shadow-sm"
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Connection Pill */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
              isDark ? "bg-black/30 border-white/10" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {connectionStatus === "connected" ? (
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <Wifi className="w-4 h-4" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-500">
                <WifiOff className="w-4 h-4" /> Standalone Ready
              </span>
            )}
          </div>

          {/* Safe Exit to Workspace Button (UX-013) */}
          <button
            onClick={() => setIsConfirmEndOpen(true)}
            className={`min-h-[48px] px-4 rounded-xl border text-xs sm:text-sm font-black transition-colors cursor-pointer ${
              isDark
                ? "text-slate-300 hover:text-white border-slate-700 hover:bg-white/10"
                : "text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100"
            }`}
          >
            &larr; Exit to Workspace
          </button>
        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative z-10 w-full overflow-hidden min-h-0">
        
        {/* STATE A: SESSION ENDED */}
        {isSessionEnded && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className="w-24 h-24 bg-red-500/20 border border-red-400/30 rounded-3xl flex items-center justify-center text-red-400 mx-auto shadow-2xl">
              <Lock className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black font-serif">
                Classroom Session Concluded
              </h2>
              <p className={`text-base font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                The educator has concluded this smartboard session. All classroom controls and paired devices have been revoked.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={returnUrl}
                className="min-h-[64px] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base px-8 rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center"
              >
                Return to Chapter Workspace
              </a>
              <button
                onClick={() => window.location.reload()}
                className="min-h-[64px] bg-slate-800 hover:bg-slate-700 text-white font-bold text-base px-6 rounded-2xl transition-all border border-slate-700 active:scale-95 cursor-pointer"
              >
                Start New Session
              </button>
            </div>
          </div>
        )}

        {/* STATE B: STANDALONE START SCREEN (UX-004: ZERO MANDATORY PHONE REQUIREMENT) */}
        {isPairing && !isSessionEnded && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full space-y-6 animate-fadeIn py-4">
            
            {/* Context Badge */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-black px-4 py-1.5 rounded-full border ${
                isDark
                  ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                  : "bg-emerald-100 border-emerald-300 text-[#0F5B38]"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              75&quot; Interactive Flat Panel Ready
            </div>

            {/* Main Standalone Headline */}
            <div className="text-center space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black font-serif tracking-tight">
                Start Lesson on this Display
              </h2>
              <p className={`text-lg font-medium max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Tap below to immediately launch the curriculum presentation and digital whiteboard directly on this 75&quot; screen. No phone or second device required.
              </p>
            </div>

            {/* Loaded Chapter Card & Quick Presets */}
            <div
              className={`w-full p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
                isDark ? "bg-[#131F30] border-[#20334D]" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <span className={`text-xs uppercase tracking-wider font-extrabold block ${
                    isDark ? "text-emerald-400" : "text-[#0F5B38]"
                  }`}>
                    Active Curriculum Unit
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-serif mt-1">
                    {sessionTitle}
                  </h3>
                  <p className={`text-sm mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {presentationSlides.length} Interactive Slides • Whiteboard Ready • Formative Checks Included
                  </p>
                </div>

                {/* Primary Standalone Start Button (>= 64px, Prominent Action) */}
                <button
                  onClick={handleStartOnDisplay}
                  className="min-h-[64px] px-8 sm:px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-lg sm:text-xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer border-2 border-emerald-400/50"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Start Teaching Now &rarr;</span>
                </button>
              </div>

              {/* Quick Preset Selector */}
              <div className="space-y-3">
                <span className={`text-xs uppercase tracking-wider font-extrabold block ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Or Select Another NCERT Chapter:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESET_CHAPTERS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPresetChapter(idx)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        activePresetIndex === idx
                          ? "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/40 shadow-md"
                          : isDark
                          ? "bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-slate-700"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      <span className={`text-xs font-black uppercase block ${
                        activePresetIndex === idx ? "text-emerald-100" : "text-emerald-500"
                      }`}>
                        {preset.grade} • {preset.subject}
                      </span>
                      <p className="font-bold text-base mt-1 line-clamp-1">{preset.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Collapsible Phone Pairing Section (UX-004: Never a blocker!) */}
            <div className="w-full text-center pt-2">
              <button
                onClick={() => setIsPairingPanelOpen(!isPairingPanelOpen)}
                className={`text-sm font-bold inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-500" />
                <span>{isPairingPanelOpen ? "Hide Mobile Remote Pairing" : "Pair Teacher Mobile Remote (Optional)"}</span>
              </button>

              {isPairingPanelOpen && (
                <div
                  className={`mt-4 p-6 rounded-3xl border max-w-md mx-auto space-y-4 shadow-xl animate-fadeIn ${
                    isDark ? "bg-[#131F30] border-[#20334D]" : "bg-white border-slate-200"
                  }`}
                >
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Want to walk around the room? Scan this QR code on your phone to turn it into a wireless clicker:
                  </p>
                  <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 inline-block">
                    <QrCode className="w-44 h-44 text-gray-900" />
                  </div>
                  <div className="text-xs font-mono font-bold flex justify-between items-center text-slate-400">
                    <span>Token: {pairingToken ? pairingToken.substring(0, 10) + "..." : "Active"}</span>
                    <span className="text-emerald-500 font-sans">{secondsRemaining}s</span>
                  </div>
                  {pairingUrl && (
                    <div className="pt-1">
                      <a
                        href={pairingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-500 underline hover:text-emerald-400 block"
                      >
                        Open Mobile Controller Link ↗
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* STATE C: ACTIVE CLASSROOM WORKSPACE (Slides, Whiteboard, Quiz, Resources) */}
        {isSessionActive && !isSessionEnded && (
          <div className="flex-1 flex flex-col w-full h-full min-h-0 relative shadow-2xl rounded-3xl overflow-hidden border border-white/10">
            
            {/* VIEWPORT MODE 1: SLIDES (Smartboard Polymorphic Slide Deck) */}
            {activeTab === "content" && (
              <div className="flex-1 w-full h-full min-h-0 flex flex-col">
                <SmartboardSlideViewer
                  slide={presentationSlides[currentSlideIndex] || presentationSlides[0]}
                  slideIndex={currentSlideIndex}
                  totalSlides={presentationSlides.length}
                  presentationTitle={sessionTitle}
                  theme={classroomTheme}
                  isHindiMode={isHindiMode}
                />
              </div>
            )}

            {/* VIEWPORT MODE 2: INTERACTIVE WHITEBOARD (ClassroomWhiteboard with DOM state preservation) */}
            <div className={`flex-1 w-full h-full min-h-0 flex flex-col relative ${activeTab === "whiteboard" ? "" : "hidden"}`}>
              <ClassroomWhiteboard initialTheme={classroomTheme} />
            </div>

            {/* VIEWPORT MODE 3: CLASSROOM INTERACTION & QUICK CHECK HUB (Phase 17) */}
            {activeTab === "quiz" && (
              <ClassroomQuickCheck
                isOpen={true}
                isDark={isDark}
                grade={curriculumContext.grade}
                gradeName={curriculumContext.gradeName}
                subject={curriculumContext.subject}
                subjectName={curriculumContext.subjectName}
                chapter={curriculumContext.chapter}
                chapterTitle={curriculumContext.title}
                currentSlideIndex={currentSlideIndex}
                totalStudents={24}
                onClose={() => setActiveTab("content")}
                onOpenWhiteboard={() => setActiveTab("whiteboard")}
                onOpenSaathi={() => {
                  setIsSaathiDrawerOpen(true);
                }}
                onViewAnalytics={() => {
                  window.location.href = `/dashboard/analytics?grade=${curriculumContext.grade}&subject=${curriculumContext.subject}&chapter=${curriculumContext.chapter}`;
                }}
              />
            )}

            {/* Clicker & Focus Blackout / Screen Pause Overlay */}
            {isBlackoutActive && (
              <div
                onClick={() => setIsBlackoutActive(false)}
                className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none animate-fadeIn"
                role="region"
                aria-label="Screen paused for teacher discussion. Tap to resume."
              >
                <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-6 shadow-2xl">
                  <EyeOff className="w-10 h-10" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif text-white tracking-tight mb-4">
                  {isHindiMode ? "शिक्षक पर ध्यान केंद्रित करें" : "Focus on Teacher"}
                </h2>
                <p className="text-lg sm:text-2xl text-slate-300 font-medium max-w-2xl mb-8">
                  {isHindiMode
                    ? "प्रस्तुति स्क्रीन को चर्चा के लिए अस्थायी रूप से रोका गया है।"
                    : "Presentation display is paused for active classroom discussion."}
                </p>
                <div className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-xl transition-all">
                  <span>{isHindiMode ? "स्पर्श करके पुनः प्रारंभ करें (Key 'B')" : "Tap Anywhere to Resume (Key 'B')"}</span>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 75" Smartboard Tactile Bottom Dock (UX-011, UX-025) */}
      {isSessionActive && (
        <ClassroomTouchBar
          currentSlide={currentSlideIndex + 1}
          totalSlides={presentationSlides.length}
          onNextSlide={handleNextSlide}
          onPrevSlide={handlePrevSlide}
          onOpenWhiteboard={() => setActiveTab(activeTab === "whiteboard" ? "content" : "whiteboard")}
          onOpenResources={() => setIsResourceDrawerOpen(true)}
          onStartQuiz={() => setActiveTab(activeTab === "quiz" ? "content" : "quiz")}
          onAskSaathi={() => setIsSaathiDrawerOpen(true)}
          onOpenTimer={() => setIsTimerModalOpen(true)}
          onOpenStudentPicker={() => setIsStudentPickerOpen(true)}
          onToggleTheme={() => setClassroomTheme(isDark ? "light" : "dark")}
          onToggleHindi={() => setIsHindiMode((prev) => !prev)}
          onToggleBlackout={() => setIsBlackoutActive((prev) => !prev)}
          isHindiMode={isHindiMode}
          isBlackoutActive={isBlackoutActive}
          isQuizActive={activeTab === "quiz"}
          isWhiteboardActive={activeTab === "whiteboard"}
          onEndClass={() => setIsConfirmEndOpen(true)}
          theme={classroomTheme}
        />
      )}

      {/* Standby Status Footer (UX-008) */}
      {!isSessionActive && (
        <footer
          className={`px-8 py-3.5 border-t flex items-center justify-between text-xs sm:text-sm font-semibold flex-shrink-0 transition-colors duration-200 ${
            isDark ? "border-slate-800 bg-[#080D14] text-slate-400" : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          <div className="flex items-center gap-4">
            <span>Display: <strong className={isDark ? "text-slate-200" : "text-slate-900"}>{boardId}</strong></span>
            <span>Status: <strong className="text-emerald-500">{isSessionEnded ? "Class Concluded" : "Standalone Ready"}</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span>TeacherSathi Smartboard</span>
            <span>NCERT Canonical Alignment</span>
          </div>
        </footer>
      )}

      {/* Saathi Pedagogical Assistant Slide-Over Drawer */}
      <SaathiClassroomDrawer
        isOpen={isSaathiDrawerOpen}
        onClose={() => setIsSaathiDrawerOpen(false)}
        currentSlide={presentationSlides[currentSlideIndex]}
        slideIndex={currentSlideIndex}
        chapterTitle={sessionTitle}
        theme={classroomTheme}
      />

      {/* Quick Chapter Resource & Slide Navigator Drawer */}
      <ClassroomResourceDrawer
        isOpen={isResourceDrawerOpen}
        onClose={() => setIsResourceDrawerOpen(false)}
        slides={presentationSlides}
        currentSlideIndex={currentSlideIndex}
        onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
        chapterTitle={sessionTitle}
        theme={classroomTheme}
      />

      {/* Interactive Activity Countdown Timer (UX-026) */}
      <ClassroomTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        theme={classroomTheme}
      />

      {/* Random Student Caller Modal (UX-027) */}
      <ClassroomStudentPicker
        isOpen={isStudentPickerOpen}
        onClose={() => setIsStudentPickerOpen(false)}
        theme={classroomTheme}
      />

      {/* Safe End Classroom Session Confirm Dialog (UX-013) */}
      <ConfirmDialog
        isOpen={isConfirmEndOpen}
        title="Conclude Classroom Session?"
        description="This will end the active 75-inch smartboard session and safely return you to the Chapter Workspace. Any active drawings and teaching progress have been saved."
        confirmLabel="Conclude Session"
        cancelLabel="Continue Teaching"
        variant="danger"
        onConfirm={handleConfirmEndSession}
        onCancel={() => setIsConfirmEndOpen(false)}
      />

    </div>
  );
}
