"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  FileText, 
  Menu, 
  X, 
  ClipboardList,
  HelpCircle,
  Settings,
  User,
  Book
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Lessons", href: "/dashboard/classes", icon: BookOpen },
  { name: "Resources", href: "/resources", icon: FileText },
  { name: "Quizzes", href: "/dashboard/classes?tab=quizzes", icon: HelpCircle },
  { name: "Worksheets", href: "/dashboard/create?type=test-paper", icon: ClipboardList },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const tabParam = searchParams.get("tab");

  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavList = () => (
    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      {navItems.map((item) => {
        const isQueryItem = item.href.includes("?");
        let isActive = false;

        if (isQueryItem) {
          const parts = item.href.split("?");
          const path = parts[0];
          const query = parts[1];
          const pathMatches = pathname === path;
          
          if (query.includes("type=")) {
            const expectedType = query.replace("type=", "");
            isActive = pathMatches && typeParam === expectedType;
          } else if (query.includes("tab=")) {
            const expectedTab = query.replace("tab=", "");
            isActive = pathMatches && tabParam === expectedTab;
          }
        } else {
          if (item.href === "/dashboard") {
            isActive = pathname === "/dashboard" && !typeParam && !tabParam;
          } else {
            isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");
          }
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
              isActive 
                ? "bg-white/10 text-white font-bold" 
                : "text-emerald-50 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-emerald-200 group-hover:text-emerald-100"}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-base tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-[#166534] text-white shadow-lg border border-white/10"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-[#0A0D12]/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed lg:static top-0 left-0 h-full bg-[#166534] flex flex-col z-40 shadow-2xl lg:shadow-none transition-all duration-300 w-[280px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Book className="w-5 h-5 text-[#166534]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight">TeacherSathi</span>
              <span className="text-[10px] font-medium text-emerald-200 uppercase tracking-widest">साथी</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        {renderNavList()}

        {/* Bottom Profile / Status */}
        <div className="p-6 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">Teacher</span>
              <span className="text-xs text-emerald-200 truncate">School IFP Mode</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
