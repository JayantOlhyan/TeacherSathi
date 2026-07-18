"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { 
  Home, 
  Users, 
  BookOpen, 
  Tv, 
  Sparkles, 
  HelpCircle, 
  Settings, 
  User, 
  GraduationCap, 
  FileText, 
  LayoutGrid, 
  FolderOpen, 
  LineChart, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  BookMarked,
  ShieldAlert
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Classes", href: "/dashboard/classes", icon: Users },
  { name: "NCERT Library", href: "/content", icon: BookOpen },
  { name: "Smart Classroom", href: "/dashboard/whiteboard", icon: Tv },
  { name: "Create with AI", href: "/dashboard/create", icon: Sparkles },
  { name: "Quizzes", href: "/dashboard/classes?tab=quizzes", icon: GraduationCap },
  { name: "Question Bank", href: "/dashboard/create?type=question-bank", icon: BookMarked },
  { name: "Test Papers", href: "/dashboard/create?type=test-paper", icon: FileText },
  { name: "Lesson Plans", href: "/dashboard/create?type=lesson-plan", icon: ClipboardList },
  { name: "Homework", href: "/dashboard/classes?tab=homework", icon: LayoutGrid },
  { name: "Resources", href: "/resources", icon: FolderOpen },
  { name: "Analytics", href: "/dashboard/reports", icon: LineChart },
  { name: "Admin Portal", href: "/admin/dashboard", icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const tabParam = searchParams.get("tab");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar_collapsed");
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar_collapsed", String(newState));
  };

  const renderNavList = () => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        // Safe check using path and params matching
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
          // Exact path matching or starting-with check for non-root paths
          if (item.href === "/dashboard") {
            isActive = pathname === "/dashboard" && !typeParam && !tabParam;
          } else if (item.href === "/dashboard/create") {
            isActive = pathname === "/dashboard/create" && !typeParam && !tabParam;
          } else if (item.href === "/dashboard/classes") {
            isActive = pathname === "/dashboard/classes" && !typeParam && !tabParam;
          } else {
            isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");
          }
        }
        return (
          <Link
            key={item.name}
            href={item.href}
            title={isCollapsed ? item.name : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-white text-[#14532D] shadow-sm font-semibold"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-[#14532D] text-white min-h-screen shrink-0 transition-all duration-350 shadow-xl z-30 relative ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-white/10 flex items-center justify-between`}>
          {!isCollapsed ? (
            <Link href="/" className="hover:opacity-95 transition-opacity">
              <span className="font-extrabold text-lg tracking-wider text-white">TeacherSathi</span>
            </Link>
          ) : (
            <Link href="/" className="hover:opacity-95 transition-opacity flex items-center justify-center shrink-0">
              <Image src="/favicon-white.png" alt="TeacherSathi Logo" width={28} height={28} className="object-contain" />
            </Link>
          )}
          <button 
            onClick={toggleCollapse}
            className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        {renderNavList()}

        {/* Bottom Utility Items */}
        <div className="p-3 border-t border-white/10 space-y-1 bg-[#0F3D22]/40">
          <button 
            onClick={() => {
              if (typeof window !== "undefined") {
                const event = new CustomEvent("open-help");
                window.dispatchEvent(event);
              }
            }}
            title={isCollapsed ? "Help" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
          >
            <HelpCircle className="w-4.5 h-4.5 shrink-0" />
            {!isCollapsed && <span>Help & Support</span>}
          </button>
          
          <button 
            onClick={() => {
              if (typeof window !== "undefined") {
                const event = new CustomEvent("open-settings");
                window.dispatchEvent(event);
              }
            }}
            title={isCollapsed ? "Settings" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
          >
            <Settings className="w-4.5 h-4.5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <div 
            title={isCollapsed ? "User Profile" : undefined}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5"
          >
            <User className="w-4.5 h-4.5 shrink-0 text-white/80" />
            {!isCollapsed && (
              <div className="flex flex-col text-[11px] overflow-hidden">
                <span className="font-bold text-white truncate">Teacher Session</span>
                <span className="text-white/60 truncate">Active</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-[#14532D] text-white p-2.5 rounded-lg shadow-lg hover:bg-[#114022]"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#14532D] text-white flex flex-col z-50 shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-extrabold text-lg tracking-wider text-white">TeacherSathi</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white rounded-lg"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sidebar Nav */}
              {renderNavList()}

              {/* Bottom Items for mobile */}
              <div className="p-3 border-t border-white/10 space-y-1 bg-[#0F3D22]/40">
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-help"));
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
                >
                  <HelpCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>Help & Support</span>
                </button>
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-settings"));
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
                >
                  <Settings className="w-4.5 h-4.5 shrink-0" />
                  <span>Settings</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
