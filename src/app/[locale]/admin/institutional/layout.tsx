"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { 
  Building2, 
  School, 
  GraduationCap, 
  BarChart3, 
  GitCompare, 
  Mail, 
  Settings, 
  ArrowLeft,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { name: "Overview", href: "/admin/institutional", icon: BarChart3 },
  { name: "School Directory", href: "/admin/institutional/schools", icon: School },
  { name: "Academic Intelligence", href: "/admin/institutional/academic", icon: GraduationCap },
  { name: "School Comparison", href: "/admin/institutional/compare", icon: GitCompare },
  { name: "Invitations", href: "/admin/institutional/invitations", icon: Mail },
  { name: "Institutional Settings", href: "/admin/institutional/settings", icon: Settings },
];

export default function InstitutionalAdminLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-xs font-semibold mr-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif font-black text-sm text-gray-900 leading-none">
                Institutional Administration
              </h1>
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                State • District • School Network Operations
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Scoped RLS Active
          </span>
        </div>
      </header>

      {/* Main Content Area with Navigation Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside
          className={`w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 md:block ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin/institutional" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
