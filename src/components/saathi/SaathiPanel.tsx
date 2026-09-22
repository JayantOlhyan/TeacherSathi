'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { SaathiContextBadge } from './SaathiContextBadge';
import { SaathiPromptChips } from './SaathiPromptChips';
import { SaathiResponseCard } from './SaathiResponseCard';
import { querySaathi, type SaathiStructuredResponse } from '@/lib/ai/saathiService';
import type { SaathiContext } from '@/lib/ai/saathiContext';

export interface SaathiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: SaathiContext;
  initialPrompt?: string;
  onApplyResponse?: (response: SaathiStructuredResponse) => void;
  placeholder?: string;
  className?: string;
}

export function SaathiPanel({
  isOpen,
  onClose,
  context,
  initialPrompt,
  onApplyResponse,
  placeholder = 'Type your question...',
  className = '',
}: SaathiPanelProps) {
  const [queryInput, setQueryInput] = useState('');
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [response, setResponse] = useState<SaathiStructuredResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input and handle initialPrompt if provided
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (initialPrompt && !response && !isLoading) {
        handleExecuteQuery(initialPrompt);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Escape key listener to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleExecuteQuery = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setLastUserPrompt(text);

    try {
      const res = await querySaathi(text, context);
      setResponse(res);
      setQueryInput('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Saathi could not complete that request.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslateToggle = () => {
    if (!response) return;
    const targetLang = response.language === 'hi' ? 'en' : 'hi';
    const translationPrompt = targetLang === 'hi'
      ? `Translate this into simple Hindi: ${response.answer}`
      : `Translate this into English: ${response.answer}`;
    handleExecuteQuery(translationPrompt);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-2xs animate-fadeIn"
      role="dialog"
      aria-label="Saathi Teacher Co-Pilot"
    >
      <div
        className={`w-full max-w-md sm:max-w-lg h-full bg-white flex flex-col shadow-2xl border-l border-gray-200 transition-all animate-slideLeft ${className}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3 bg-gradient-to-b from-emerald-50/50 to-white flex-shrink-0">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black font-serif text-gray-900 tracking-tight">
                Saathi Co-Pilot
              </h3>
            </div>

            {/* Hierarchical Context Badges */}
            <SaathiContextBadge context={context} />

            {context.chapterTitle && (
              <p className="text-xs font-bold text-gray-700 line-clamp-1">
                {context.chapterTitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close Saathi Panel"
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          
          {/* Empirical Observed Data card if in analytics / learning-gap mode */}
          {context.observedData && !response && (
            <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/90 text-amber-950 space-y-2 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Observed Data
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Class Assessment
                </span>
              </div>
              <p className="text-xs font-medium text-amber-950 leading-relaxed">
                <strong>{context.observedData.incorrectCount}</strong> of <strong>{context.observedData.totalStudents}</strong> students (<strong>{context.observedData.incorrectPercentage}%</strong>) missed questions regarding <em>{context.observedData.keyMisconception}</em>.
              </p>
            </div>
          )}

          {/* Default Greeting & Contextual Prompts if no conversation yet */}
          {!response && !isLoading && !errorMessage && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
                <p className="font-extrabold text-emerald-950">
                  Hello! I&apos;m Saathi, your teaching assistant.
                </p>
                <p className="text-emerald-900 font-medium">
                  I understand your curriculum context. How can I help you teach or prepare this lesson?
                </p>
              </div>

              {/* Prompt chips */}
              <SaathiPromptChips
                context={context}
                onSelectPrompt={(p) => handleExecuteQuery(p)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* User's Prompt Pill if queried */}
          {lastUserPrompt && (
            <div className="flex justify-end animate-fadeIn">
              <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-2xs">
                {lastUserPrompt}
              </div>
            </div>
          )}

          {/* Loading Milestone State */}
          {isLoading && (
            <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 text-center space-y-3 animate-pulse">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-emerald-900">
                Saathi is reviewing your curriculum context and preparing a response...
              </p>
            </div>
          )}

          {/* Error Recovery State */}
          {errorMessage && (
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Saathi couldn&apos;t complete that request.</span>
              </div>
              <p className="text-rose-900 font-medium">{errorMessage}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleExecuteQuery(lastUserPrompt || 'Explain this simply')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer hover:bg-rose-500"
                >
                  Retry Request
                </button>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-rose-800 font-bold text-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Structured Response Card */}
          {response && !isLoading && (
            <div className="space-y-4 animate-fadeIn">
              <SaathiResponseCard
                response={response}
                onUse={() => {
                  if (onApplyResponse) onApplyResponse(response);
                  onClose();
                }}
                onEdit={() => {
                  setQueryInput(response.answer);
                  inputRef.current?.focus();
                }}
                onTranslate={handleTranslateToggle}
                onTryAnother={() => handleExecuteQuery(`Give me another fresh alternative for: ${lastUserPrompt || 'this'}`)}
              />

              {/* Follow-up Prompt Suggestions */}
              <div className="pt-2">
                <SaathiPromptChips
                  context={context}
                  customPrompts={[
                    'Give me an everyday village example',
                    'Draft a 5-minute student activity',
                    'Create 3 quick check questions',
                  ]}
                  onSelectPrompt={(p) => handleExecuteQuery(p)}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleExecuteQuery(queryInput);
              }
            }}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
          />

          <button
            onClick={() => handleExecuteQuery(queryInput)}
            disabled={!queryInput.trim() || isLoading}
            aria-label="Send to Saathi"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
export default SaathiPanel;
