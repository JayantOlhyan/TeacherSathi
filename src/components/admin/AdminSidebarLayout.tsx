"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { 
  LayoutDashboard, Layers, BookOpen, Compass, FileText, 
  HelpCircle, Users, Bell, Database, Terminal, ShieldAlert,
  ChevronRight, Menu, X, LogOut, FileCode, Key
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const SIDEBAR_ITEMS = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "Content",
    items: [
      { name: "Classes", href: "/admin/content/classes", icon: Layers },
      { name: "Subjects", href: "/admin/content/subjects", icon: Compass },
      { name: "Books", href: "/admin/content/books", icon: BookOpen },
      { name: "Chapters", href: "/admin/content/chapters", icon: FileText }
    ]
  },
  {
    title: "Question Bank",
    items: [
      { name: "All Questions", href: "/admin/questions", icon: HelpCircle },
      { name: "Bulk Import", href: "/admin/questions/import", icon: FileCode }
    ]
  },
  {
    title: "Resources & Media",
    items: [
      { name: "Media Library", href: "/admin/media", icon: Database }
    ]
  },
  {
    title: "Platform",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Announcements", href: "/admin/announcements", icon: Bell },
      { name: "Site Content", href: "/admin/site-content", icon: HelpCircle }
    ]
  },
  {
    title: "System",
    items: [
      { name: "Audit Logs", href: "/admin/audit-logs", icon: Terminal }
    ]
  }
];

const ROLES = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "REVIEWER", "SUPPORT"];

export default function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeRole, setActiveRole] = useState("SUPER_ADMIN");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState("founder@teachersathi.org");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    // Sync active role to localStorage
    const savedRole = localStorage.getItem("ts_admin_active_role") || "SUPER_ADMIN";
    setActiveRole(savedRole);
    localStorage.setItem("ts_admin_active_role", savedRole);

    // Sync admin email
    const email = localStorage.getItem("last_sathi_teacher_email") || "founder@teachersathi.org";
    setUserEmail(email);

    // Enforce basic admin authentication check
    const isAuth = localStorage.getItem("mock_authenticated") === "true";
    // const userRole = localStorage.getItem("last_sathi_post_type") || "admin";
    
    // In our admin workspace, if not logged in as admin/founder, flag or simulate session
    if (!isAuth) {
      // For developer convenience, auto-sign in admin mock session if not exists
      localStorage.setItem("mock_authenticated", "true");
      localStorage.setItem("last_sathi_teacher_name", "Admin Founder");
      localStorage.setItem("last_sathi_teacher_email", "founder@teachersathi.org");
    }
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setActiveRole(newRole);
    localStorage.setItem("ts_admin_active_role", newRole);
    // Page level check re-trigger
    router.refresh();
  };

  // Simple Page Level Authorization Logic
  useEffect(() => {
    // Check if the current user role permits the current page
    // CONTENT_MANAGER: cannot access Users or Audit Logs
    // SUPPORT: read-only or limited to announcements
    // REVIEWER: read-only except status approval
    if (activeRole === "SUPPORT" && (pathname.includes("/users") || pathname.includes("/audit-logs") || pathname.includes("/site-content"))) {
      setUnauthorized(true);
    } else if (activeRole === "CONTENT_MANAGER" && (pathname.includes("/users") || pathname.includes("/audit-logs"))) {
      setUnauthorized(true);
    } else if (activeRole === "REVIEWER" && (pathname.includes("/users") || pathname.includes("/audit-logs"))) {
      setUnauthorized(true);
    } else {
      setUnauthorized(false);
    }
  }, [pathname, activeRole]);

  return (
    <div className="flex min-h-screen bg-[#080B11] text-slate-200">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-4 right-4 z-50 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg lg:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </AnimatePresence>

      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F1424] border-r border-slate-800/80 flex flex-col justify-between shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Mobile Close button */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-900/30">
                TS
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-white tracking-wide uppercase">TeacherSathi</h1>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Admin Portal</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Simulation Banner */}
          <div className="px-6 py-4 border-b border-slate-800/40 bg-slate-900/40">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Simulated RBAC Role</label>
            <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select 
                value={activeRole}
                onChange={handleRoleChange}
                className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none w-full cursor-pointer"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role} className="bg-[#0F1424] text-slate-200 font-semibold">
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-6">
            {SIDEBAR_ITEMS.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {section.title}
                </span>
                <ul className="space-y-0.5">
                  {section.items.map((item, key) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={key}>
                        <Link 
                          href={item.href}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/5 text-emerald-400 border-l-2 border-emerald-500 pl-2.5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                            <span>{item.name}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{userEmail}</p>
              <p className="text-[10px] text-slate-500 truncate font-semibold uppercase">{activeRole}</p>
            </div>
          </div>
          <Link 
            href="/dashboard" 
            className="w-full mt-2 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Teacher View
          </Link>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Navigation Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0F1424]/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-emerald-400 font-bold capitalize">
                {pathname.split("/").pop()?.replace("-", " ")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Secure Connection
            </span>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-6 overflow-y-auto">
          {unauthorized ? (
            <div className="max-w-xl mx-auto my-12 bg-rose-950/20 border border-rose-900/50 rounded-xl p-8 text-center shadow-lg shadow-rose-950/10">
              <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-xs text-rose-300 leading-relaxed mb-6">
                Your currently simulated role (<span className="font-bold text-white">{activeRole}</span>) does not have authorization to view this section of the TeacherSathi Admin Portal. 
              </p>
              <div className="text-xs text-slate-400 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                Please switch your role using the simulator inside the sidebar to <span className="text-emerald-400 font-bold">SUPER_ADMIN</span> or <span className="text-emerald-400 font-bold">ADMIN</span> to access this interface.
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
