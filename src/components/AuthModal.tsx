"use client";

import { X } from "lucide-react";
import AuthCard from "./auth/AuthCard";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-[clamp(0.5rem,2vw,1rem)] animate-fadeIn">
      <div className="relative w-full max-w-4xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 border border-white/20 rounded-full transition-colors cursor-pointer text-slate-800 hover:text-emerald-700 md:text-white md:hover:text-emerald-400"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <AuthCard initialTab="login" onSuccess={onSuccess} isModal={true} />
      </div>
    </div>
  );
}
