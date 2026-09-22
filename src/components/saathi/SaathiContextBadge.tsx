'use client';

import React from 'react';
import { resolveContextBadges, type SaathiContext } from '@/lib/ai/saathiContext';

export interface SaathiContextBadgeProps {
  context: SaathiContext;
  className?: string;
}

export function SaathiContextBadge({ context, className = '' }: SaathiContextBadgeProps) {
  const badges = resolveContextBadges(context);

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {badges.map((b) => {
        let style = 'bg-blue-50 text-blue-700 border-blue-200';
        if (b.type === 'grade') {
          style = 'bg-emerald-50 text-[#0F5B38] border-emerald-200';
        } else if (b.type === 'subject') {
          style = 'bg-sky-50 text-sky-700 border-sky-200';
        } else if (b.type === 'chapter') {
          style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        } else if (b.type === 'slide') {
          style = 'bg-amber-50 text-amber-800 border-amber-200 font-mono';
        } else if (b.type === 'gap') {
          style = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
        }

        return (
          <span
            key={b.id}
            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border tracking-wide whitespace-nowrap ${style}`}
          >
            {b.label}
          </span>
        );
      })}
    </div>
  );
}
export default SaathiContextBadge;
