'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface SaathiTriggerProps {
  onClick: () => void;
  label?: string;
  variant?: 'button' | 'pill' | 'chip';
  className?: string;
}

export function SaathiTrigger({
  onClick,
  label = 'Ask Saathi',
  variant = 'button',
  className = '',
}: SaathiTriggerProps) {
  if (variant === 'pill') {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#0F5B38] border border-emerald-200 text-xs font-black transition-all active:scale-95 shadow-2xs cursor-pointer ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'chip') {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Sparkles className="w-3 h-3 text-purple-600" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer ${className}`}
    >
      <Sparkles className="w-4 h-4 text-emerald-200" />
      <span>{label}</span>
    </button>
  );
}
export default SaathiTrigger;
