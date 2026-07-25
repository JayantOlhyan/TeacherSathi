"use client";

import React from "react";
import { 
  Home, 
  BookOpen, 
  FileText,
  HelpCircle, 
  Settings, 
  User, 
  ClipboardList,
  Book
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: Home },
  { name: "My Lessons", icon: BookOpen },
  { name: "Resources", icon: FileText },
  { name: "Quizzes", icon: HelpCircle },
  { name: "Worksheets", icon: ClipboardList },
  { name: "Settings", icon: Settings },
];

export function MockSidebar({ activeIndex = 1 }: { activeIndex?: number }) {
  return (
    <aside className="w-[180px] sm:w-[240px] h-full bg-[#166534] flex flex-col z-40 shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <Book className="w-4 h-4 text-[#166534]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base text-white tracking-tight leading-none">TeacherSathi</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-white/10 text-white font-bold" 
                  : "text-emerald-50 opacity-80 font-medium"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-200"}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs sm:text-sm tracking-wide">{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white truncate">Teacher</span>
            <span className="text-[9px] text-emerald-200 truncate">School IFP Mode</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
