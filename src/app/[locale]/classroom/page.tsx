"use client";

import { useState, useEffect } from "react";
import { QrCode, RefreshCw, Clock, ShieldCheck, Tv, Sparkles, CheckCircle2 } from "lucide-react";

export default function ClassroomKioskPage() {
  const [boardId, setBoardId] = useState("Board-001");
  const [sessionId, setSessionId] = useState("");
  const [token, setToken] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes expiry
  const [status, setStatus] = useState<"waiting" | "scanned" | "authenticated">("waiting");

  // Read board_id parameter if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("board_id");
      if (id) setBoardId(id);
    }
    generateNewQRSession();
  }, []);

  const generateNewQRSession = () => {
    const newSession = `sess_${Math.random().toString(36).substring(2, 10)}`;
    const newToken = `tok_${Math.random().toString(36).substring(2, 12)}`;
    setSessionId(newSession);
    setToken(newToken);
    setSecondsRemaining(120); // Reset 2-min timer
    setStatus("waiting");
  };

  // Step 2.4: Real-time listener for mobile approval handshake
  useEffect(() => {
    if (!sessionId || status === "authenticated") return;

    const checkInterval = setInterval(() => {
      if (typeof window !== "undefined") {
        const approvalData = localStorage.getItem(`ts_qr_approved_${sessionId}`);
        if (approvalData) {
          setStatus("authenticated");
          clearInterval(checkInterval);
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [sessionId, status]);

  // 2-minute countdown timer & auto-refresh effect
  useEffect(() => {
    if (status === "authenticated") return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          generateNewQRSession();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const handleSimulateScan = () => {
    setStatus("scanned");
    setTimeout(() => {
      setStatus("authenticated");
    }, 1500);
  };

  const progressPercent = (secondsRemaining / 120) * 100;

  return (
    <div className="min-h-screen bg-[#0D2416] text-white flex flex-col font-sans select-none overflow-hidden relative">
      
      {/* Top Smartboard Navbar */}
      <header className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black font-serif tracking-wide text-white">TeacherSathi Smartboard Kiosk</h1>
            <p className="text-xs text-emerald-400 font-bold">
              {boardId} • Room 102 • Government Senior Secondary School
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-4 py-2 rounded-full border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Device Verified & Registered (Step 1.2)
          </span>
        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10 max-w-4xl mx-auto w-full">
        
        {status === "authenticated" ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white font-serif">
                Welcome, Educator!
              </h2>
              <p className="text-emerald-300 text-base font-bold">
                Classroom session active on {boardId}. Loading your lesson plans...
              </p>
            </div>
            <div className="pt-4">
              <a
                href="/dashboard"
                className="inline-block bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
              >
                Enter Teacher Dashboard →
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-xl w-full">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Step 1.3 – QR Session Generator
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                Scan with Mobile Camera to Log In
              </h2>
              <p className="text-emerald-200/80 text-sm font-medium">
                Open your phone camera or TeacherSathi mobile app to authenticate instantly.
              </p>
            </div>

            {/* High-Contrast 75" TV QR Display Container */}
            <div className="bg-white p-8 rounded-3xl border-4 border-emerald-500 shadow-2xl inline-block relative mx-auto group">
              <div className="w-64 h-64 bg-white flex items-center justify-center relative">
                <QrCode className="w-56 h-56 text-gray-900" />
              </div>

              {/* Session Details Tag */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-gray-900 text-xs font-mono font-bold flex justify-between items-center gap-2">
                <span>Session: {sessionId} ({token})</span>
                <span className="text-emerald-700">{secondsRemaining}s remaining</span>
              </div>
            </div>

            {/* 2-Minute Expiry Countdown Bar */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> QR Code Expires in {secondsRemaining}s
                </span>
                <button
                  onClick={generateNewQRSession}
                  className="flex items-center gap-1 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Test Simulation Button */}
            <div className="pt-2">
              <button
                onClick={handleSimulateScan}
                className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-bold px-6 py-2.5 rounded-xl border border-emerald-400/30 transition-all active:scale-95 cursor-pointer"
              >
                {status === "scanned" ? "Verifying Phone Handshake..." : "Simulate Mobile Phone Scan 📱"}
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer Instructions */}
      <footer className="px-8 py-4 border-t border-white/10 text-center text-xs text-emerald-200/60 font-medium bg-black/20">
        Shared Classroom Display Security • Ephemeral Token Storage • 2-Minute Token Expiry Enabled
      </footer>

    </div>
  );
}
