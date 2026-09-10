"use client";

import React, { useState, useEffect, useCallback } from "react";
import { QrCode, Smartphone, Clock, ChevronDown, ShieldCheck, Sparkles, X, ExternalLink } from "lucide-react";
import { useClassroomRealtime } from "@/lib/classroom/useClassroomRealtime";

interface SmartboardQRAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionData: { sessionId: string; durationMins: number; className: string }) => void;
}

export default function SmartboardQRAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: SmartboardQRAuthModalProps) {
  const [duration, setDuration] = useState<number>(45);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [pairingUrl, setPairingUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const initSessionAndToken = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Create a live session
      const sRes = await fetch("/api/classroom/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Class 8 • Science (${duration} Mins)`,
        }),
      });
      const sJson = await sRes.json();
      if (!sRes.ok) throw new Error(sJson.error || "Failed to create session");
      const newSid = sJson.data.id;
      setSessionId(newSid);

      // 2. Generate 5-min pairing token
      const pRes = await fetch(`/api/classroom/sessions/${newSid}/pair`, {
        method: "POST",
      });
      const pJson = await pRes.json();
      if (!pRes.ok) throw new Error(pJson.error || "Failed to generate pairing token");

      setSessionToken(pJson.data.token);
      setPairingUrl(pJson.data.pairingUrl);
    } catch (err) {
      console.error("Pairing initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [duration]);

  useEffect(() => {
    if (isOpen) {
      initSessionAndToken();
    } else {
      setSessionId("");
      setSessionToken("");
      setPairingUrl("");
    }
  }, [isOpen, initSessionAndToken]);

  // Real-time listener for smartboard connection
  const { state } = useClassroomRealtime({
    sessionId,
    deviceName: "Teacher Dashboard Modal",
    role: "CONTROLLER",
  });

  const isConnected = state?.session.status === "ACTIVE";

  useEffect(() => {
    if (isConnected && sessionId) {
      const timer = setTimeout(() => {
        onSuccess({
          sessionId,
          durationMins: duration,
          className: "Class 8 • Science (09:00 - 09:45)",
        });
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, sessionId, duration, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-xl w-full border border-gray-200 shadow-2xl relative space-y-6 text-gray-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Classroom Smartboard 75&quot; One-Tap Auth
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-serif">
            Scan to Start Class Session
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-sm mx-auto">
            Scan with your smartphone camera or open kiosk to pair instantly without typing passwords on the big screen.
          </p>
        </div>

        {/* Timetable Auto-Recommendation Picker */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Class Duration
              </span>
            </div>
            <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">
              Period 2
            </span>
          </div>

          <div className="flex items-center justify-between bg-white border border-emerald-200 p-3 rounded-xl">
            <div>
              <p className="text-sm font-black text-gray-900">
                🕒 {duration} Minutes
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Class 8 Science (09:00 – 09:45)
              </p>
            </div>

            {/* Change Duration Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                Change Duration <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-xs font-bold text-gray-700">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDuration(mins);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-800 transition-colors ${
                        duration === mins ? "text-emerald-700 bg-emerald-50/50" : ""
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 relative">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-gray-600">Generating Secure 5-Minute Pairing Token...</p>
            </div>
          ) : isConnected ? (
            <div className="space-y-3 text-center py-6 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-emerald-800">Smartboard Connected!</h4>
              <p className="text-xs text-gray-500 font-bold">
                Launching {duration}-minute Classroom Session...
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              {/* High-visibility SVG QR Container */}
              <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-gray-900 shadow-md mx-auto flex items-center justify-center relative group">
                <QrCode className="w-40 h-40 text-gray-900" />
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold bg-white text-gray-900 px-2 py-1 rounded-md shadow-sm">
                    Token: {sessionToken.substring(0, 10)}...
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 animate-pulse">
                <Smartphone className="w-4 h-4 text-emerald-600" /> Waiting for smartboard/mobile scan...
              </div>

              {/* Direct Link to Launch Kiosk for Testing */}
              {sessionId && (
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`/classroom?sessionId=${sessionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Launch 75&quot; Smartboard Display Window ↗
                  </a>
                  {pairingUrl && (
                    <a
                      href={pairingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-gray-500 underline hover:text-gray-800"
                    >
                      Open Mobile Pairing Confirmation Link
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-4 font-medium">
          <span className="flex items-center gap-1 text-emerald-800 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Single-Use Token Security
          </span>
          <span>Expires in 5 minutes</span>
        </div>

      </div>
    </div>
  );
}
