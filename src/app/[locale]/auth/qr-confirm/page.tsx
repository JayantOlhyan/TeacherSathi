"use client";

import { useState, useEffect } from "react";
import { Tv, ShieldCheck, CheckCircle2, XCircle, Lock, Plus, Play, HelpCircle, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function QRConfirmPage() {
  const [sessionId, setSessionId] = useState("");
  const [token, setToken] = useState("");
  const [boardId, setBoardId] = useState("Board-001");
  const [roomName, setRoomName] = useState("Room 102 • Smart Classroom");
  const [schoolName] = useState("Government Senior Secondary School");
  const [teacherName, setTeacherName] = useState("Teacher");
  
  const [step, setStep] = useState<"confirm" | "verifying" | "connected">("confirm");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sid = params.get("session_id") || params.get("sid") || "";
      const tok = params.get("token") || "";
      const bid = params.get("board_id") || params.get("bid") || "Board-001";
      const room = params.get("room");

      if (sid) setSessionId(sid);
      if (tok) setToken(tok);
      if (bid) setBoardId(bid);
      if (room) setRoomName(room);
    }

    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setTeacherName(user.user_metadata.full_name);
      }
    });
  }, []);

  const handleApproveLogin = async () => {
    if (!token || !sessionId) {
      setErrorMessage("Missing pairing token or session ID in URL parameters.");
      return;
    }

    setStep("verifying");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/classroom/pair/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          sessionId,
          deviceType: "SMARTBOARD",
          deviceName: `Classroom Smartboard 75" (${boardId})`,
          role: "DISPLAY",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to pair smartboard with classroom session");
      }

      setStep("connected");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Pairing verification failed";
      setErrorMessage(msg);
      setStep("confirm");
    }
  };

  const handleSendCommand = async (eventType: string, payload: Record<string, unknown> = {}) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/classroom/sessions/${sessionId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          payload,
          idempotencyKey: `mobile_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Command error: ${err.error || res.statusText}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch command";
      alert(msg);
    }
  };

  const handleEndClass = async () => {
    if (!confirm("Are you sure you want to end this live classroom session permanently?")) return;
    if (!sessionId) return;

    try {
      const res = await fetch(`/api/classroom/sessions/${sessionId}/end`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Class session permanently ended.");
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to end session";
      alert(msg);
    }
  };

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F4] text-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Step 1 – Mobile Pairing Confirmation */}
        {step === "confirm" && (
          <div className="space-y-6 text-center animate-fadeIn">
            
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-inner">
              <Tv className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Smartboard Pairing Handshake
              </div>
              <h1 className="text-2xl font-black text-gray-900 font-serif">
                Pair with 75&quot; Smartboard?
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Authorize this display for <span className="font-bold text-gray-900">{teacherName}</span> using single-use cryptographic token.
              </p>
            </div>

            {/* Smartboard Hardware Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Device ID</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {boardId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Room Location</span>
                <span className="text-xs font-bold text-gray-900">{roomName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">School Binding</span>
                <span className="text-xs font-medium text-gray-700 truncate max-w-[180px]">{schoolName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Session Ref</span>
                <span className="text-xs font-mono text-gray-600 truncate max-w-[180px]">{sessionId || "Pending"}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="py-3.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-gray-500" /> Cancel
              </button>

              <button
                onClick={handleApproveLogin}
                className="py-3.5 px-4 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Pair & Launch
              </button>
            </div>

          </div>
        )}

        {/* Step 2 – Cryptographic Verification Progress */}
        {step === "verifying" && (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">Validating Cryptographic Pair...</h3>
              <p className="text-xs text-gray-500 font-medium">
                Checking Single-Use Expiration • SHA-256 Hashing • Registering Device
              </p>
            </div>
          </div>
        )}

        {/* Step 3 – Live Mobile Classroom Remote Controls */}
        {step === "connected" && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-300">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              Connected to 75&quot; Smartboard 🟢
            </div>

            {/* Current Session Summary Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Board ID</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {boardId}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Active Class</span>
                <span className="text-xs font-bold text-emerald-700">Class 8 • Science</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Session Status</span>
                <span className="text-xs font-mono font-bold text-emerald-800">ACTIVE</span>
              </div>
            </div>

            {/* Real-time Remote Action Buttons */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Live Classroom Controls
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleSendCommand("START_PRESENTATION", {
                      presentationId: "pres-crop-production",
                      title: "NCERT Class 8 Science — Chapter 1",
                      totalSlides: 12,
                      slideIndex: 0,
                    })
                  }
                  className="py-3 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 text-emerald-600" /> Start Slides
                </button>

                <button
                  onClick={() =>
                    handleSendCommand("START_QUIZ", {
                      quizResourceId: "quiz-crop-1",
                      title: "Class 8 Science Quiz",
                      totalQuestions: 5,
                    })
                  }
                  className="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" /> Start Quiz
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const duration = 60;
                    const now = new Date();
                    const endsAt = new Date(now.getTime() + duration * 1000).toISOString();
                    handleSendCommand("START_TIMER", {
                      durationSeconds: duration,
                      startedAt: now.toISOString(),
                      endsAt,
                    });
                  }}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-600" /> 60s Timer
                </button>

                <button
                  onClick={() => handleSendCommand("LOCK_BOARD", { reason: "Teacher explanation" })}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Lock className="w-4 h-4 text-amber-600" /> Lock Board
                </button>
              </div>

              <button
                onClick={handleEndClass}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <LogOut className="w-4 h-4" /> End Classroom Session
              </button>
            </div>

            <p className="text-[11px] text-gray-400 font-medium">
              Commands are sequence-numbered and cryptographically authorized by TeacherSathi.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
