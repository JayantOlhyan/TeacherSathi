"use client";

import { useState, useEffect } from "react";
import { Tv, ShieldCheck, CheckCircle2, XCircle, Lock, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function QRConfirmPage() {
  const [sessionId, setSessionId] = useState("sess_89412");
  const [boardId, setBoardId] = useState("Board-004");
  const [roomName, setRoomName] = useState("Room 203 • Science Lab");
  const [schoolName, setSchoolName] = useState("Government Senior Secondary School");
  const [teacherName, setTeacherName] = useState("Teacher");
  
  const [step, setStep] = useState<"confirm" | "verifying" | "connected">("confirm");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sid = params.get("session_id") || params.get("sid");
      const bid = params.get("board_id") || params.get("bid");
      const room = params.get("room");

      if (sid) setSessionId(sid);
      if (bid) setBoardId(bid);
      if (room) setRoomName(room);

      const storedName = localStorage.getItem("last_sathi_teacher_name");
      const storedSchool = localStorage.getItem("last_sathi_school_name");
      if (storedName) setTeacherName(storedName);
      if (storedSchool) setSchoolName(storedSchool);
    }

    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setTeacherName(user.user_metadata.full_name);
      }
    });
  }, []);

  const handleApproveLogin = async () => {
    setStep("verifying");
    setErrorMessage(null);

    // Step 2.3: Backend verification simulation (JWT, Session ID, Teacher, School)
    setTimeout(() => {
      // Broadcast WebSocket approval event
      if (typeof window !== "undefined") {
        localStorage.setItem(`ts_qr_approved_${sessionId}`, JSON.stringify({
          status: "APPROVED",
          teacher: teacherName,
          boardId,
          timestamp: new Date().toISOString(),
        }));
      }
      setStep("connected");
    }, 1500);
  };

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F4] text-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Step 2.2 – Mobile App Receiver Card */}
        {step === "confirm" && (
          <div className="space-y-6 text-center animate-fadeIn">
            
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-inner">
              <Tv className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Step 2.2 – Mobile Login Handshake
              </div>
              <h1 className="text-2xl font-black text-gray-900 font-serif">
                Log In on Smartboard 75&quot;?
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Confirm logging in as <span className="font-bold text-gray-900">{teacherName}</span> for this classroom session.
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

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">School Binding</span>
                <span className="text-xs font-medium text-gray-700 truncate max-w-[180px]">{schoolName}</span>
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
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Continue / Approve
              </button>
            </div>

          </div>
        )}

        {/* Step 2.3 – Verification Progress */}
        {step === "verifying" && (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">Verifying Credentials...</h3>
              <p className="text-xs text-gray-500 font-medium">
                Validating JWT Token • Session {sessionId} • School Binding
              </p>
            </div>
          </div>
        )}

        {/* Phase 7 – Remote Phone Controls */}
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
                <span className="text-xs font-bold text-gray-500 uppercase">Room Location</span>
                <span className="text-xs font-bold text-gray-900">{roomName}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Active Subject</span>
                <span className="text-xs font-bold text-emerald-700">Class 8 • Science</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Remaining Time</span>
                <span className="text-sm font-mono font-black text-amber-600">38:12</span>
              </div>
            </div>

            {/* Phase 7 Remote Action Buttons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Remote Controls
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert("Smartboard period extended by +15 minutes!")}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-600" /> Extend +15m
                </button>

                <button
                  onClick={() => alert("File selector opened! Select PDF/PPT to push to 75\" Smartboard.")}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  📄 Push File
                </button>
              </div>

              {/* Phase 10 Session Transfer Button */}
              <button
                onClick={() => {
                  alert("Session Transfer Initiated! Old Board (Board-004) locked. Ready to scan new classroom QR.");
                  setBoardId("Board-005");
                  setRoomName("Room 305 • Physics Lab");
                  setStep("confirm");
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                🔄 Transfer Session to New Classroom QR
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    alert("Class session ended remotely!");
                    setStep("confirm");
                  }}
                  className="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  End Class
                </button>

                <button
                  onClick={() => {
                    alert("Smartboard immediately locked remotely! Board returned to QR screen.");
                    if (typeof window !== "undefined") {
                      localStorage.setItem(`ts_qr_approved_${sessionId}`, "");
                    }
                    setStep("confirm");
                  }}
                  className="py-3 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Lock className="w-4 h-4" /> Lock Board
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-medium">
              Leaving classroom? Click <strong>Lock Board</strong> to immediately sign out the 75&quot; screen.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
