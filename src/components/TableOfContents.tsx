"use client";

import React, { useState } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-emerald-950/5 border border-emerald-800/20 rounded-2xl p-4 my-6 select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer font-bold text-xs uppercase tracking-wider text-emerald-900"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4 text-emerald-700" /> Table of Contents &bull; Quick Jump Navigation
        </span>
        <button aria-label="Toggle Table of Contents">
          {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-emerald-700" />}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-3 space-y-1.5 pt-3 border-t border-emerald-800/10 text-xs font-semibold">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1.5 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
