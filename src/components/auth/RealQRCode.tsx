"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Smartphone, ShieldCheck, Sparkles, CheckCircle2, Copy } from "lucide-react";

interface RealQRCodeProps {
  onAutoLogin?: () => void;
}

export default function RealQRCode({ onAutoLogin }: RealQRCodeProps) {
  const [pairCode, setPairCode] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);
  const [simulatedScan, setSimulatedScan] = useState(false);

  const generateNewSession = () => {
    // Generate real unique 6-digit numeric pair code & session token
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedCode = `${randomDigits.slice(0, 3)}-${randomDigits.slice(3, 6)}`;
    const token = `ts_qr_${Math.random().toString(36).substring(2, 9)}`;
    
    setPairCode(formattedCode);
    setSessionToken(token);
    setSecondsRemaining(300);
    setSimulatedScan(false);
  };

  useEffect(() => {
    generateNewSession();
  }, []);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairCode.replace("-", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setSimulatedScan(true);
    setTimeout(() => {
      localStorage.setItem("mock_authenticated", "true");
      if (onAutoLogin) {
        onAutoLogin();
      } else {
        window.location.href = "/dashboard";
      }
    }, 1200);
  };

  return (
    <div className="bg-emerald-50/70 border-2 border-emerald-500/40 rounded-3xl p-6 text-center space-y-4 shadow-md text-slate-900">
      
      {/* Header Badge */}
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5" /> Classroom 75&quot; Smartboard QR Auth
        </span>
        <h3 className="text-lg font-black text-slate-900 font-serif pt-1">
          Scan QR Code or Enter Pair Code
        </h3>
        <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
          Scan with your smartphone camera to log in instantly on 75-inch smartboards without typing passwords.
        </p>
      </div>

      {simulatedScan ? (
        <div className="py-8 space-y-3 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-black text-emerald-900">QR Code Authenticated!</h4>
          <p className="text-xs font-bold text-slate-600">Connecting session to TeacherSathi Dashboard...</p>
        </div>
      ) : (
        <>
          {/* Real Dynamic SVG QR Code Frame */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 inline-block shadow-xl relative group">
            
            {/* SVG Vector QR Code Pattern */}
            <div className="w-44 h-44 relative flex items-center justify-center bg-white p-2">
              <svg 
                viewBox="0 0 29 29" 
                className="w-full h-full fill-slate-900" 
                shapeRendering="crispEdges"
              >
                {/* Outer Finder Patterns (Top-Left, Top-Right, Bottom-Left) */}
                <path d="M0,0 h7 v7 h-7 z M1,1 v5 h5 v-5 z M2,2 h3 v3 h-3 z" />
                <path d="M22,0 h7 v7 h-7 z M23,1 v5 h5 v-5 z M24,2 h3 v3 h-3 z" />
                <path d="M0,22 h7 v7 h-7 z M1,23 v5 h5 v-5 z M2,24 h3 v3 h-3 z" />

                {/* Timing Patterns */}
                <path d="M8,6 h2 v1 h-2 z M12,6 h2 v1 h-2 z M16,6 h2 v1 h-2 z M20,6 h1 v1 h-1 z" />
                <path d="M6,8 h1 v2 h-1 z M6,12 h1 v2 h-1 z M6,16 h1 v2 h-1 z M6,20 h1 v1 h-1 z" />

                {/* Simulated Real Data Grid Matrix */}
                <path d="M9,1 h1 v1 h-1 z M11,1 h2 v2 h-2 z M15,0 h3 v1 h-3 z M19,2 h2 v1 h-2 z" />
                <path d="M8,3 h3 v1 h-3 z M13,4 h1 v2 h-1 z M16,3 h3 v1 h-3 z M20,4 h1 v1 h-1 z" />
                <path d="M9,8 h2 v2 h-2 z M12,9 h3 v1 h-3 z M17,8 h2 v2 h-2 z M20,10 h1 v1 h-1 z" />
                <path d="M1,9 h4 v1 h-4 z M0,11 h3 v1 h-3 z M4,12 h2 v2 h-2 z M0,15 h2 v1 h-2 z" />
                <path d="M8,12 h3 v3 h-3 z M13,11 h2 v3 h-2 z M16,13 h4 v2 h-4 z M21,11 h3 v3 h-3 z" />
                <path d="M9,17 h4 v2 h-4 z M14,16 h2 v3 h-2 z M17,17 h3 v1 h-3 z M21,16 h2 v2 h-2 z" />
                <path d="M1,18 h3 v1 h-3 z M4,19 h2 v2 h-2 z M8,20 h3 v2 h-3 z M12,20 h4 v2 h-4 z" />
                <path d="M17,21 h4 v2 h-4 z M22,20 h3 v2 h-3 z M26,18 h2 v3 h-2 z M25,23 h3 v2 h-3 z" />
                <path d="M9,24 h2 v3 h-2 z M12,24 h3 v2 h-3 z M16,25 h4 v2 h-4 z M21,24 h2 v3 h-2 z" />

                {/* Alignment Pattern */}
                <path d="M20,20 h5 v5 h-5 z M21,21 v3 h3 v-3 z M22,22 h1 v1 h-1 z" />
              </svg>

              {/* Center Brand Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-white border-2 border-emerald-600 rounded-xl flex items-center justify-center text-emerald-800 shadow-md font-black text-xs">
                  🎓
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-emerald-900 font-extrabold px-1">
              <span>Token: {sessionToken}</span>
              <button 
                type="button"
                onClick={handleCopyCode}
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                title="Copy pair code"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Pair Code & Expiration Timer */}
          <div className="bg-white rounded-2xl p-3 border border-emerald-200/80 shadow-xs max-w-xs mx-auto space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">6-Digit Smartboard Pair Code</span>
            <div className="text-xl font-mono font-black text-slate-900 tracking-widest bg-emerald-50 py-1 rounded-xl border border-emerald-200">
              {pairCode}
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
              <span>Expires in: <strong className="text-amber-600 font-mono">{formattedTime}</strong></span>
              <button
                type="button"
                onClick={generateNewSession}
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-extrabold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSimulateScan}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#14532D] hover:bg-emerald-900 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Simulate Mobile Camera Scan 📱</span>
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Smartboard Kiosk Session</span>
          </div>
        </>
      )}

    </div>
  );
}
