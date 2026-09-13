"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Tv,
  Clock,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Wifi,
  WifiOff,
  Play,
  HelpCircle,
  Lock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { useClassroomRealtime } from "@/lib/classroom/useClassroomRealtime";
import WhiteboardCanvas from "@/components/whiteboard/WhiteboardCanvas";
import { SmartboardSlideViewer } from "@/components/classroom/SmartboardSlideViewer";
import type { PresentationSlide } from "@/lib/validations/resources";

const DEFAULT_PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    type: "TITLE",
    title: "Crop Production and Management",
    subtitle: "NCERT Class 8 Science • Chapter 1",
    body: "Comprehensive Smartboard module covering agricultural practices, soil prep, and modern irrigation.",
  },
  {
    type: "CONTENT",
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
    type: "IMAGE",
    title: "Modern Irrigation: Drip System",
    body: "Water falls drop-by-drop directly at the position of the roots. Ideal for regions with acute water scarcity.",
  },
  {
    type: "DIAGRAM",
    title: "The Nitrogen Cycle in Nature",
    body: "Circulation of atmospheric nitrogen through living organisms and soil chemistry.",
    diagram_code: `Atmospheric Nitrogen (N2)
  ├──> Biological Fixation (Rhizobium in leguminous roots & Cyanobacteria)
  ├──> Lightning Fixation (Nitrates in rainwater)
  ├──> Soil Nitrates & Nitrites (Plant absorption)
  └──> Decomposer Bacteria ──> Denitrifying Bacteria ──> N2 released back`,
  },
  {
    type: "QUESTION",
    title: "Formative Check: Soil Enrichment",
    question_text: "Which of the following organic fertilizers improves both soil texture and water retention capacity?",
    question_options: ["Urea (Synthetic)", "Decomposed Manure", "Ammonium Sulphate", "Potash"],
    correct_option_index: 1,
  },
  {
    type: "ACTIVITY",
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
    type: "SUMMARY",
    title: "Chapter 1 Summary & Revision",
    bullets: [
      "Kharif crops: Sown in rainy season (June–Sept) e.g., Paddy, Maize.",
      "Rabi crops: Grown in winter (Oct–March) e.g., Wheat, Mustard, Gram.",
      "Organic manure is superior to chemical fertilisers for soil sustainability.",
      "Drip irrigation provides maximum water efficiency with zero runoff loss.",
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
  const [activeTab, setActiveTab] = useState<"content" | "whiteboard">("content");
  const [presentationSlides, setPresentationSlides] = useState<PresentationSlide[]>(DEFAULT_PRESENTATION_SLIDES);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or fetch session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const bid = params.get("board_id") || "Board-001";
      setBoardId(bid);

      const existingSessionId = params.get("sessionId") || params.get("session_id");
      if (existingSessionId) {
        setSessionId(existingSessionId);
        setIsInitializing(false);
      } else {
        // Create initial session for this smartboard kiosk
        fetch("/api/classroom/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Grade 8 • Science — Live Smartboard Session",
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
    }
  }, []);

  // Real-time classroom connection
  const { state, connectionStatus, sendCommand } = useClassroomRealtime({
    sessionId,
    deviceName: `Smartboard 75" (${boardId})`,
    role: "DISPLAY",
  });

  // Fetch real presentation slides if a custom presentation is active
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
    } else {
      setPresentationSlides(DEFAULT_PRESENTATION_SLIDES);
    }
  }, [state?.presentation.presentationId]);

  // Request new pairing token from server
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

  // When session enters WAITING or PAIRING, generate token
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

  const progressPercent = (secondsRemaining / 300) * 100;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0D2416] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-300 font-bold text-sm tracking-wide">
            Initializing Smartboard Kiosk Display...
          </p>
        </div>
      </div>
    );
  }

  const isSessionEnded = state?.session.status === "ENDED";
  const isSessionActive = state?.session.status === "ACTIVE" || state?.session.status === "PAUSED";
  const isPairing = !state || state.session.status === "WAITING" || state.session.status === "PAIRING";

  return (
    <div className="min-h-screen bg-[#0B1E13] text-white flex flex-col font-sans select-none overflow-hidden relative">
      
      {/* Reconnection Alert Banner */}
      {connectionStatus !== "connected" && isSessionActive && (
        <div className="bg-amber-500 text-gray-950 px-6 py-2 flex items-center justify-between font-bold text-xs sm:text-sm z-50 shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>
              {connectionStatus === "reconnecting"
                ? "Classroom network interrupted. Reconnecting and syncing state..."
                : "Classroom disconnected. Attempting to restore connection..."}
            </span>
          </div>
          <span className="text-[11px] bg-black/10 px-3 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
            Offline Continuity Guard
          </span>
        </div>
      )}

      {/* Top 75" High-Contrast Smartboard Navbar */}
      <header className="px-8 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black font-serif tracking-wide text-white">
                TeacherSathi Smartboard
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                75&quot; IFP Kiosk
              </span>
            </div>
            <p className="text-xs text-emerald-400/90 font-medium">
              {boardId} • Room 102 • Government Senior Secondary School
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Synchronized Live Timer Pill */}
          {remainingTimerSeconds > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full font-mono text-sm font-black animate-pulse">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(remainingTimerSeconds)}</span>
            </div>
          )}

          {/* Connection Pill */}
          <div className="flex items-center gap-2 bg-black/30 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold">
            {connectionStatus === "connected" ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                <Wifi className="w-4 h-4" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <WifiOff className="w-4 h-4 animate-spin" /> Reconnecting
              </span>
            )}
          </div>

          {/* Device Verification Pill */}
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Auth Verified
          </span>
        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="flex-1 flex flex-col p-6 sm:p-8 relative z-10 w-full overflow-hidden">
        
        {/* State A: SESSION ENDED */}
        {isSessionEnded && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className="w-24 h-24 bg-red-500/20 border border-red-400/30 rounded-3xl flex items-center justify-center text-red-400 mx-auto shadow-2xl">
              <Lock className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-white">
                Classroom Session Concluded
              </h2>
              <p className="text-sm text-emerald-200/80 font-medium">
                The educator has permanently ended this smartboard session. All classroom controls and paired devices have been revoked.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Start New Smartboard Session
            </button>
          </div>
        )}

        {/* State B: WAITING / PAIRING QR CODE */}
        {isPairing && !isSessionEnded && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Real-Time QR Smartboard Pairing
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                Scan with Mobile to Start Teaching
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80 font-medium max-w-md mx-auto">
                Scan this QR code with your phone camera to pair your teacher dashboard directly with this 75&quot; smartboard.
              </p>
            </div>

            {/* High-Contrast 75" TV QR Display Container */}
            <div className="bg-white p-7 rounded-3xl border-4 border-emerald-500 shadow-2xl inline-block relative mx-auto">
              <div className="w-60 h-60 bg-white flex flex-col items-center justify-center relative">
                <QrCode className="w-52 h-52 text-gray-900" />
              </div>

              {/* Session Details Tag */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-gray-900 text-xs font-mono font-bold flex justify-between items-center gap-4">
                <span>Token: {pairingToken ? pairingToken.substring(0, 10) + "..." : "Generating..."}</span>
                <span className="text-emerald-700">{secondsRemaining}s</span>
              </div>
            </div>

            {/* 5-Minute Expiry Countdown Bar */}
            <div className="space-y-2 max-w-md w-full mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> QR Code Expires in {secondsRemaining}s
                </span>
                <button
                  onClick={requestPairingToken}
                  className="flex items-center gap-1 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
                </button>
              </div>

              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Direct Link Alternative */}
            {pairingUrl && (
              <div className="text-xs text-emerald-300/80 font-mono">
                <a
                  href={pairingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors"
                >
                  Click to simulate teacher scan on this browser ↗
                </a>
              </div>
            )}
          </div>
        )}

        {/* State C: ACTIVE CLASSROOM WORKSPACE */}
        {isSessionActive && !isSessionEnded && (
          <div className="flex-1 flex flex-col w-full h-full min-h-0 space-y-4 animate-fadeIn">
            
            {/* Viewport Control Bar */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "content"
                      ? "bg-emerald-500 text-gray-950 font-black shadow-md"
                      : "text-emerald-200 hover:bg-white/10"
                  }`}
                >
                  📖 Live Curriculum Content
                </button>
                <button
                  onClick={() => setActiveTab("whiteboard")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "whiteboard"
                      ? "bg-emerald-500 text-gray-950 font-black shadow-md"
                      : "text-emerald-200 hover:bg-white/10"
                  }`}
                >
                  ✏️ Interactive Whiteboard
                </button>
              </div>

              {/* Status / Teacher Pill */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-emerald-300">
                  {state.session.title}
                </span>
                {state.whiteboard.isLocked && (
                  <span className="bg-red-500/20 text-red-300 border border-red-400/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Board Locked
                  </span>
                )}
              </div>
            </div>

            {/* Main Interactive Display Area (16:9 Aspect Ratio) */}
            <div className="flex-1 bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl min-h-0">
              
              {activeTab === "whiteboard" ? (
                <div className="w-full h-full relative">
                  {state.whiteboard.isLocked ? (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-3">
                      <Lock className="w-12 h-12 text-amber-400" />
                      <h3 className="text-2xl font-black font-serif text-white">Whiteboard Locked</h3>
                      <p className="text-sm text-gray-300 font-medium">
                        The teacher has locked the board for class explanation.
                      </p>
                    </div>
                  ) : null}
                  <WhiteboardCanvas />
                </div>
              ) : (
                <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between overflow-y-auto">
                  
                  {/* Case 1: Active Presentation */}
                  {state.presentation.isActive ? (
                    <div className="space-y-6 max-w-4xl mx-auto w-full">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-2">
                          <Play className="w-4 h-4" /> Live Presentation Mode
                        </span>
                        <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full">
                          Slide {state.presentation.slideIndex + 1} of {state.presentation.totalSlides}
                        </span>
                      </div>

                      {/* Smartboard Polymorphic Slide Viewer */}
                      {(() => {
                        const currentSlideIndex = Math.min(
                          presentationSlides.length - 1,
                          Math.max(0, state.presentation.slideIndex)
                        );
                        const currentSlide = presentationSlides[currentSlideIndex] || presentationSlides[0];

                        return (
                          <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl my-2 min-h-[440px] flex flex-col">
                            <SmartboardSlideViewer
                              slide={currentSlide}
                              slideIndex={currentSlideIndex}
                              totalSlides={presentationSlides.length}
                              presentationTitle={state.presentation.title || "NCERT Concept Overview"}
                            />
                          </div>
                        );
                      })()}

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <button
                          onClick={() =>
                            sendCommand("PREVIOUS_SLIDE", {
                              presentationId: state.presentation.presentationId || "pres-1",
                              slideIndex: Math.max(0, state.presentation.slideIndex - 1),
                            })
                          }
                          disabled={state.presentation.slideIndex === 0}
                          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-sm flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" /> Previous Slide
                        </button>
                        <button
                          onClick={() =>
                            sendCommand("NEXT_SLIDE", {
                              presentationId: state.presentation.presentationId || "pres-1",
                              slideIndex: Math.min(
                                state.presentation.totalSlides - 1,
                                state.presentation.slideIndex + 1
                              ),
                            })
                          }
                          disabled={state.presentation.slideIndex >= state.presentation.totalSlides - 1}
                          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-gray-950 font-black text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg"
                        >
                          Next Slide <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : state.quiz.isActive ? (
                    /* Case 2: Active Quiz */
                    <div className="space-y-6 max-w-3xl mx-auto w-full text-center py-6">
                      <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full border border-amber-400/30">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        Classroom Clicker Quiz Active
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black font-serif text-white">
                        Concept Check: Crop Production
                      </h2>
                      <p className="text-emerald-200 text-base font-medium">
                        Which of the following is a Kharif crop grown during rainy season?
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                        {["A. Wheat (गेहूं)", "B. Paddy / Rice (धान)", "C. Mustard (सरसों)", "D. Gram (चना)"].map(
                          (opt, idx) => (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl bg-white/10 border border-white/20 hover:border-emerald-400 text-white font-bold text-lg transition-all"
                            >
                              {opt}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Case 3: Ready Teaching Workspace Standby */
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 max-w-xl mx-auto">
                      <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400/30 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                        <BookOpen className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black font-serif text-white">
                          Smartboard Ready & Connected
                        </h2>
                        <p className="text-sm text-emerald-200/80 font-medium">
                          Use your teacher control panel on your mobile or laptop to launch presentations, quizzes, worksheets, or digital whiteboard.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() =>
                            sendCommand("START_PRESENTATION", {
                              presentationId: "pres-crop-production",
                              title: "Crop Production & Management — NCERT Class 8",
                              totalSlides: 10,
                              slideIndex: 0,
                            })
                          }
                          className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" /> Launch Sample Presentation
                        </button>
                        <button
                          onClick={() => setActiveTab("whiteboard")}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all border border-white/20 cursor-pointer"
                        >
                          Open Whiteboard
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Footer Instructions & Authoritative Metadata */}
      <footer className="px-8 py-3.5 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/60 font-medium bg-black/40 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Session: <strong className="text-white font-mono">{sessionId || "None"}</strong></span>
          <span>Sequence: <strong className="text-emerald-400 font-mono">#{state?.sequenceNumber || 1000}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span>75&quot; IFP Touch Panel Engine</span>
          <span>PostgreSQL Authoritative Sync Active</span>
        </div>
      </footer>

    </div>
  );
}
