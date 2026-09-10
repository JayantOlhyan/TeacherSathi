"use client";

import React, { useState } from "react";
import {
  Tv,
  Play,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  Lock,
  Unlock,
  Trash2,
  LogOut,
  Wifi,
  WifiOff,
  UserX,
} from "lucide-react";
import { useClassroomRealtime } from "@/lib/classroom/useClassroomRealtime";

interface ClassroomControlPanelProps {
  sessionId: string;
  onSessionEnded?: () => void;
}

export default function ClassroomControlPanel({
  sessionId,
  onSessionEnded,
}: ClassroomControlPanelProps) {
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { state, connectionStatus, sendCommand, refreshState } = useClassroomRealtime({
    sessionId,
    deviceName: "Teacher Control Panel",
    role: "CONTROLLER",
  });

  const handleSlideNav = async (direction: "next" | "prev") => {
    if (!state?.presentation.isActive) return;
    const current = state.presentation.slideIndex;
    const total = state.presentation.totalSlides;
    const nextIdx = direction === "next" ? Math.min(total - 1, current + 1) : Math.max(0, current - 1);

    if (nextIdx !== current) {
      await sendCommand("NEXT_SLIDE", {
        presentationId: state.presentation.presentationId || "pres-default",
        slideIndex: nextIdx,
      });
    }
  };

  const handleStartPresentation = async () => {
    setActionLoading(true);
    try {
      await sendCommand("START_PRESENTATION", {
        presentationId: "pres-crop-production",
        title: "Crop Production & Management — NCERT Class 8",
        totalSlides: 10,
        slideIndex: 0,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    setActionLoading(true);
    try {
      await sendCommand("START_QUIZ", {
        quizResourceId: "quiz-crop-101",
        title: "Crop Production Formative Check",
        totalQuestions: 5,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndQuiz = async () => {
    await sendCommand("END_QUIZ", { quizResourceId: state?.quiz.quizResourceId || undefined });
  };

  const handleStartTimer = async (seconds: number) => {
    const now = new Date();
    const endsAt = new Date(now.getTime() + seconds * 1000).toISOString();
    await sendCommand("START_TIMER", {
      durationSeconds: seconds,
      startedAt: now.toISOString(),
      endsAt,
    });
  };

  const handleToggleBoardLock = async () => {
    if (state?.whiteboard.isLocked) {
      await sendCommand("UNLOCK_BOARD", {});
    } else {
      await sendCommand("LOCK_BOARD", { reason: "Teacher lecture in progress" });
    }
  };

  const handleClearWhiteboard = async () => {
    if (confirm("Clear all whiteboard drawings on the smartboard?")) {
      await sendCommand("CLEAR_WHITEBOARD", {});
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (confirm("Revoke this smartboard/device immediately?")) {
      await fetch(`/api/classroom/sessions/${sessionId}/devices/${deviceId}/revoke`, {
        method: "POST",
      });
      await refreshState();
    }
  };

  const handleEndClassroom = async () => {
    try {
      const res = await fetch(`/api/classroom/sessions/${sessionId}/end`, {
        method: "POST",
      });
      if (res.ok) {
        setIsEndingSession(false);
        if (onSessionEnded) onSessionEnded();
      }
    } catch (err) {
      alert("Failed to end classroom session: " + err);
    }
  };

  const smartboardDevice = state?.devices.find((d) => d.device_type === "SMARTBOARD");

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden space-y-6 p-6 sm:p-8 font-sans">
      
      {/* Session Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Live Classroom Session
            </span>
            <span className="text-xs font-mono text-gray-500">#{state?.sequenceNumber || 1000}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-serif text-gray-900 mt-1">
            {state?.session.title || "NCERT Class 8 • Science"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Realtime Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border">
            {connectionStatus === "connected" ? (
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <Wifi className="w-3.5 h-3.5" /> Realtime Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600">
                <WifiOff className="w-3.5 h-3.5" /> Reconnecting
              </span>
            )}
          </div>

          {/* Smartboard Hardware Indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              smartboardDevice && smartboardDevice.status === "CONNECTED"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>
              {smartboardDevice && smartboardDevice.status === "CONNECTED"
                ? "Smartboard Connected"
                : "No Smartboard Paired"}
            </span>
          </div>
        </div>
      </div>

      {/* Control Surface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Presentation Remote Controls */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-700" />
              Presentation Remote Control
            </h3>
            {state?.presentation.isActive && (
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Slide {state.presentation.slideIndex + 1} of {state.presentation.totalSlides}
              </span>
            )}
          </div>

          {state?.presentation.isActive ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-600 font-medium truncate">
                Active: <strong>{state.presentation.title || "Lesson Slides"}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSlideNav("prev")}
                  disabled={state.presentation.slideIndex === 0}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-900 font-bold text-xs border border-gray-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Slide
                </button>
                <button
                  onClick={() => handleSlideNav("next")}
                  disabled={state.presentation.slideIndex >= state.presentation.totalSlides - 1}
                  className="py-3 px-4 rounded-xl bg-[#14532D] hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  Next Slide <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartPresentation}
              disabled={actionLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Play className="w-4 h-4" /> Push & Launch Presentation to Smartboard
            </button>
          )}
        </div>

        {/* Section 2: Quiz Control */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Interactive Classroom Quiz
            </h3>
            {state?.quiz.isActive && (
              <span className="text-xs font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Quiz Active
              </span>
            )}
          </div>

          {state?.quiz.isActive ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-600 font-medium">
                Quiz active on Smartboard: 5-Question Crop Production Check
              </p>
              <button
                onClick={handleEndQuiz}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                End Active Quiz & Return to Lesson
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartQuiz}
              disabled={actionLoading}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <HelpCircle className="w-4 h-4" /> Launch Quiz onto Smartboard
            </button>
          )}
        </div>

        {/* Section 3: Synchronized Timers */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Synchronized Classroom Timer
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Launch countdown timers synced directly to smartboard via server timestamps.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStartTimer(60)}
              className="py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-gray-200 cursor-pointer active:scale-95 transition-all"
            >
              ⏱️ 1 Min
            </button>
            <button
              onClick={() => handleStartTimer(120)}
              className="py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-gray-200 cursor-pointer active:scale-95 transition-all"
            >
              ⏱️ 2 Mins
            </button>
            <button
              onClick={() => handleStartTimer(300)}
              className="py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-gray-200 cursor-pointer active:scale-95 transition-all"
            >
              ⏱️ 5 Mins
            </button>
          </div>
        </div>

        {/* Section 4: Whiteboard & Lock Controls */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-700" />
            Whiteboard & Panel Controls
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleToggleBoardLock}
              className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all border ${
                state?.whiteboard.isLocked
                  ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                  : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
              }`}
            >
              {state?.whiteboard.isLocked ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-600" /> Unlock Board
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-600" /> Lock Smartboard
                </>
              )}
            </button>

            <button
              onClick={handleClearWhiteboard}
              className="py-3 px-3 rounded-xl bg-white hover:bg-red-50 text-red-700 font-bold text-xs border border-gray-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" /> Clear Board
            </button>
          </div>
        </div>

      </div>

      {/* Connected Devices List */}
      <div className="border-t border-gray-100 pt-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Connected Classroom Devices ({state?.devices.length || 0})
        </h4>
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
          {state?.devices && state.devices.length > 0 ? (
            state.devices.map((dev) => (
              <div key={dev.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{dev.device_name}</p>
                    <p className="text-[11px] text-gray-500 font-mono">
                      Type: {dev.device_type} • Role: {dev.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      dev.status === "CONNECTED"
                        ? "bg-emerald-100 text-emerald-800"
                        : dev.status === "REVOKED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {dev.status}
                  </span>

                  {dev.status === "CONNECTED" && dev.device_type !== "TEACHER" && (
                    <button
                      onClick={() => handleRevokeDevice(dev.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Revoke device access"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              No classroom hardware devices paired yet.
            </div>
          )}
        </div>
      </div>

      {/* End Classroom Action Bar */}
      <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium">
          Ready to finish teaching? End the session to archive notes and disconnect displays.
        </p>

        <button
          onClick={() => setIsEndingSession(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" /> End Classroom Session
        </button>
      </div>

      {/* End Session Confirmation Modal */}
      {isEndingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-5 text-gray-900 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 font-serif">End Live Classroom?</h3>
              <p className="text-xs text-gray-600">
                This will permanently disconnect the smartboard and close the live session. Once ended, no further events may be dispatched.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsEndingSession(false)}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEndClassroom}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Yes, End Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
