'use client';

import React from 'react';
import { getContextualPrompts, type SaathiContext } from '@/lib/ai/saathiContext';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Clock,
  BookOpen,
  Languages,
  CheckCircle2
} from 'lucide-react';

export interface SaathiPromptChipsProps {
  context: SaathiContext;
  customPrompts?: string[];
  onSelectPrompt: (prompt: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function SaathiPromptChips({
  context,
  customPrompts,
  onSelectPrompt,
  isLoading = false,
  className = '',
}: SaathiPromptChipsProps) {
  const prompts = customPrompts || getContextualPrompts(context);

  const getChipIcon = (prompt: string) => {
    const p = prompt.toLowerCase();
    if (p.includes('activity') || p.includes('5-min')) return <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    if (p.includes('hindi')) return <Languages className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    if (p.includes('concept') || p.includes('explain')) return <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    if (p.includes('question') || p.includes('quiz')) return <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
    if (p.includes('example') || p.includes('tip')) return <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    if (p.includes('remediation') || p.includes('gap')) return <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
    return <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-gray-500">
        <span>Try these prompts:</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => onSelectPrompt(prompt)}
            className="w-full text-left px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-gray-800 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 shadow-2xs active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {getChipIcon(prompt)}
            <span className="flex-1 line-clamp-1">{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default SaathiPromptChips;
