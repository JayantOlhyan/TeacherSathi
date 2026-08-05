"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Smartphone, Clock, ChevronDown, ShieldCheck, Sparkles, X } from "lucide-react";

interface SmartboardQRAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionData: { durationMins: number; className: string }) => void;
}

export default function SmartboardQRAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: SmartboardQRAuthModalProps) {
  const [duration, setDuration] = useState<number>(45);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>("");
  const [scannedStatus, setScannedStatus] = useState<"waiting" | "scanned" | "approved">("waiting");

  useEffect(() => {
    if (!isOpen) return;

    // Generate unique session token
    const token = `ts_qr_${Math.random().toString(36).substring(2, 9)}`;
    setSessionToken(token);
    setScannedStatus("waiting");

    // Simulate mobile QR scan handshake for preview/testing
    const timer = setTimeout(() => {
      setScannedStatus("scanned");
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = () => {
    setScannedStatus("approved");
    setTimeout(() => {
      onSuccess({
        durationMins: duration,
        className: "Class 8 • Science (09:00 - 09:45)",
      });
      onClose();
    }, 1200);
  };

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
            Scan with your smartphone camera to log in instantly without typing passwords on the big screen.
          </p>
        </div>

        {/* Timetable Auto-Recommendation Picker */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Recommended Class Duration
              </span>
            </div>
            <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">
              Timetable Matched
            </span>
          </div>

          <div className="flex items-center justify-between bg-white border border-emerald-200 p-3 rounded-xl">
            <div>
              <p className="text-sm font-black text-gray-900">
                🕒 {duration} Minutes
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Based on Period 2: Class 8 Science (09:00 – 09:45)
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
          {scannedStatus === "waiting" && (
            <div className="space-y-4 text-center">
              {/* High-visibility SVG Mock QR */}
              <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-gray-900 shadow-md mx-auto flex items-center justify-center relative group">
                <QrCode className="w-40 h-40 text-gray-900" />
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold bg-white text-gray-900 px-2 py-1 rounded-md shadow-sm">
                    Token: {sessionToken}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 animate-pulse">
                <Smartphone className="w-4 h-4 text-emerald-600" /> Waiting for teacher scan on mobile...
              </div>
            </div>
          )}

          {scannedStatus === "scanned" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-900">QR Code Scanned!</h4>
                <p className="text-xs text-gray-600">
                  Tap &quot;Approve Login&quot; on your mobile phone to complete authentication.
                </p>
              </div>
              <button
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Simulate Mobile Approval
              </button>
            </div>
          )}

          {scannedStatus === "approved" && (
            <div className="space-y-3 text-center py-6">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-emerald-800">Authentication Confirmed!</h4>
              <p className="text-xs text-gray-500 font-bold">
                Launching {duration}-minute Classroom Session...
              </p>
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-4 font-medium">
          <span className="flex items-center gap-1 text-emerald-800 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Classroom Continuity Protection Active
          </span>
          <span>Auto-locks after session expiration</span>
        </div>

      </div>
    </div>
  );
}
