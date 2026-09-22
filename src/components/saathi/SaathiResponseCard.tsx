'use client';

import React, { useState } from 'react';
import {
  Target,
  Zap,
  Check,
  Edit3,
  Bookmark,
  Languages,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import type { SaathiStructuredResponse } from '@/lib/ai/saathiService';

export interface SaathiResponseCardProps {
  response: SaathiStructuredResponse;
  onUse?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onTranslate?: () => void;
  onTryAnother?: () => void;
  className?: string;
}

export function SaathiResponseCard({
  response,
  onUse,
  onEdit,
  onSave,
  onTranslate,
  onTryAnother,
  className = '',
}: SaathiResponseCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(response.answer);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveClick = () => {
    setIsSaved(true);
    if (onSave) onSave();
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden space-y-4 p-5 animate-fadeIn ${className}`}>
      
      {/* Analytics Special View: Observed Data vs Suggested Intervention */}
      {response.observedData && (
        <div className="rounded-xl p-4 bg-amber-50 border border-amber-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Observed Data</span>
          </div>
          <p className="text-amber-950 font-medium leading-relaxed">
            {response.observedData.incorrectCount} of {response.observedData.totalStudents} students ({response.observedData.incorrectPercentage}%) answered questions incorrectly, particularly questions regarding {response.observedData.keyMisconception}.
          </p>
        </div>
      )}

      {response.suggestedIntervention && (
        <div className="rounded-xl p-4 bg-purple-50 border border-purple-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Suggested Intervention</span>
          </div>
          <p className="text-purple-950 font-medium leading-relaxed">
            {response.suggestedIntervention}
          </p>
        </div>
      )}

      {/* Main Answer Card */}
      {!response.suggestedIntervention && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Here&apos;s a simpler explanation:</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400">
                {response.language === 'hi' ? 'हिंदी' : 'English'}
              </span>
              <button
                onClick={handleCopy}
                className="text-[10px] text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                title="Copy explanation"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
            {response.answer}
          </p>
        </div>
      )}

      {/* Why This Helps (Pedagogical Rationale) */}
      <div className="rounded-xl p-3.5 bg-blue-50/70 border border-blue-100 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-blue-900">
          <Target className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Why this helps:</span>
        </div>
        <p className="text-blue-950 font-medium leading-relaxed">
          {response.whyThisHelps}
        </p>
      </div>

      {/* Concrete Classroom Action / Phrasing */}
      {response.tryThis && (
        <div className="rounded-xl p-3.5 bg-emerald-50/70 border border-emerald-100 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-900">
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Try this with students:</span>
          </div>
          <p className="text-emerald-950 font-semibold leading-relaxed">
            {response.tryThis}
          </p>
        </div>
      )}

      {/* Teacher Action Controls (Accept, Edit, Save, Translate) */}
      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onUse && (
            <button
              onClick={onUse}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{response.suggestedIntervention ? 'Approve & Add to Plan' : 'Use'}</span>
            </button>
          )}

          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-gray-500" />
              <span>Edit Draft</span>
            </button>
          )}

          {onTranslate && (
            <button
              onClick={onTranslate}
              className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{response.language === 'hi' ? 'Translate to English' : 'Translate to Hindi'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={handleSaveClick}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-all cursor-pointer"
              title="Save to bookmarks"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            </button>
          )}

          {onTryAnother && (
            <button
              onClick={onTryAnother}
              className="px-3 py-2 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Another Approach</span>
            </button>
          )}
        </div>
      </div>

      {/* Provenance and Teacher Authority Tag */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>AI generated draft. Consequential actions require teacher approval.</span>
        </span>
        {isCopied && <span className="text-emerald-600 font-bold">Copied to clipboard</span>}
      </div>

    </div>
  );
}
export default SaathiResponseCard;
