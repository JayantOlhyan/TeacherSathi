"use client";

import * as React from "react";
import { Loader2, AlertCircle, Inbox, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export interface StateViewProps {
  type: "loading" | "empty" | "error" | "offline";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function StateView({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: StateViewProps) {
  const [isSlow, setIsSlow] = React.useState(false);

  // 8-second slow connection timeout safeguard (Addressing UX-027)
  React.useEffect(() => {
    if (type === "loading") {
      const timer = setTimeout(() => {
        setIsSlow(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  const defaultTitles = {
    loading: isSlow ? "Connecting to classroom service..." : "Preparing your lesson materials...",
    empty: "No items created yet",
    error: "Unable to complete request",
    offline: "Classroom continuity active",
  };

  const defaultDescriptions = {
    loading: isSlow
      ? "Network speed is lower than usual. Please wait a moment while we load your materials."
      : "TeacherSathi is organizing your NCERT curriculum resources.",
    empty: "Start creating quizzes, lesson plans, or smartboard slide decks to see them here.",
    error: "We could not load this content right now. Please verify your connection and try again.",
    offline: "Your presentation materials are running locally from classroom cache.",
  };

  const finalTitle = title || defaultTitles[type];
  const finalDesc = description || defaultDescriptions[type];

  return (
    <div
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto animate-fadeIn ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
        {type === "loading" ? (
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0F5B38] flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
        ) : type === "empty" ? (
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-150">
            <Inbox className="w-7 h-7" />
          </div>
        ) : type === "error" ? (
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-150">
            <AlertCircle className="w-7 h-7" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <WifiOff className="w-7 h-7" />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug">
          {finalTitle}
        </h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">
          {finalDesc}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button size="sm" onClick={onAction} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
