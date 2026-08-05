"use client";

import React from "react";
import { RefreshCw, CheckCircle2, Trash2, ShieldAlert } from "lucide-react";

interface SessionRecoveryModalProps {
  isOpen: boolean;
  onRecover: () => void;
  onDiscard: () => void;
}

export default function SessionRecoveryModal({
  isOpen,
  onRecover,
  onDiscard,
}: SessionRecoveryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-emerald-500 shadow-2xl space-y-6 text-gray-900">
        
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold bg-amber-400 text-gray-950 px-2 py-0.5 rounded uppercase">
              Unsaved Power Interrupt Detected
            </span>
            <h2 className="text-xl font-black text-gray-900">
              Recover Previous Classroom Session?
            </h2>
          </div>
        </div>

        <p className="text-xs text-gray-600 font-medium">
          A previous classroom session was interrupted (e.g., power failure or reboot). We found auto-saved state ready for instant restoration:
        </p>

        {/* Assets to recover grid */}
        <div className="grid grid-cols-2 gap-2 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs font-bold text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Presentation Slide #14</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Whiteboard Vectors</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Class Notes & AI Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Session Timer (22m left)</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onDiscard}
            className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-gray-500" /> Discard & Start Fresh
          </button>

          <button
            onClick={onRecover}
            className="py-3 px-4 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin" /> Recover Session
          </button>
        </div>

      </div>
    </div>
  );
}
