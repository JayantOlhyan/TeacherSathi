import * as React from "react";
import { Sparkles, Lightbulb, HelpCircle, ArrowRight } from "lucide-react";

export interface SaathiCalloutProps {
  title?: string;
  tip: string;
  variant?: "tip" | "spark" | "suggestion";
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SaathiCallout({
  title = "Teaching Tip from Saathi",
  tip,
  variant = "tip",
  actionLabel,
  onAction,
  className = "",
}: SaathiCalloutProps) {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        variant === "tip"
          ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-950"
          : variant === "spark"
          ? "bg-amber-50/70 border-amber-200/80 text-amber-950"
          : "bg-blue-50/70 border-blue-200/80 text-blue-950"
      } ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
            variant === "tip"
              ? "bg-emerald-600 text-white"
              : variant === "spark"
              ? "bg-amber-500 text-slate-950"
              : "bg-blue-600 text-white"
          }`}
        >
          {variant === "tip" ? (
            <Lightbulb className="w-5 h-5" />
          ) : variant === "spark" ? (
            <Sparkles className="w-5 h-5" />
          ) : (
            <HelpCircle className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900/80 flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-800 font-bold">
                Assistant
              </span>
            </h4>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-800">
            {tip}
          </p>

          {actionLabel && onAction && (
            <div className="pt-2">
              <button
                onClick={onAction}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0F5B38] hover:underline cursor-pointer"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
