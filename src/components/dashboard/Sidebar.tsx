"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Home, Activity, Users, BarChart2, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "My Class", href: "/dashboard/classes", icon: Users },
  { name: "Report", href: "/dashboard/reports", icon: BarChart2 },
];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="p-6 mb-6 border-b border-white/10 flex items-center justify-start">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <Image src="/logo-horizontal-on-dark.png" alt="TeacherSathi AI Dashboard Brand Navigation Logo for Indian Educators" width={160} height={36} className="h-9 w-auto object-contain" priority />
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#14532D] shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#14532D] text-white flex-col min-h-screen shrink-0 shadow-xl z-10 relative">
        <SidebarNav />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#14532D] text-white p-2 rounded-lg shadow-lg"
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
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#14532D] text-white flex flex-col z-50 shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 text-white/60 hover:text-white"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarNav />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
