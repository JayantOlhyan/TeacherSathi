"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { ShieldAlert, Key, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ROLES = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "REVIEWER", "SUPPORT"];

export default function AdminRoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeRole, setActiveRole] = useState("SUPER_ADMIN");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("ts_admin_active_role") || "SUPER_ADMIN";
    setActiveRole(savedRole);
    localStorage.setItem("ts_admin_active_role", savedRole);
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setActiveRole(newRole);
    localStorage.setItem("ts_admin_active_role", newRole);
    router.refresh();
  };

  useEffect(() => {
    const blockedPaths: Record<string, string[]> = {
      SUPPORT: ["/users", "/audit-logs", "/site-content"],
      CONTENT_MANAGER: ["/users", "/audit-logs"],
      REVIEWER: ["/users", "/audit-logs"],
    };
    const blocked = blockedPaths[activeRole] || [];
    setUnauthorized(blocked.some(path => pathname.includes(path)));
  }, [pathname, activeRole]);

  return (
    <div className="space-y-4">
      {/* Simulation Banner & Role Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Admin Workspace Controls</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Enforce and test role-based access rights across the platform.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Key className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Simulated Role</span>
          <select 
            value={activeRole}
            onChange={handleRoleChange}
            className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none cursor-pointer border-0 p-0"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {unauthorized ? (
            <div className="max-w-xl mx-auto my-12 bg-rose-50 border border-rose-200 rounded-xl p-8 text-center shadow-md">
              <ShieldAlert className="w-14 h-14 text-rose-600 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-slate-800 mb-2">Access Unauthorized</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Your simulated role (<span className="font-bold text-rose-600">{activeRole}</span>) is restricted from accessing this administrative sector.
              </p>
              <div className="text-xs text-slate-500 bg-slate-100 p-4 rounded-lg border border-slate-200">
                Please select <span className="text-emerald-600 font-bold">SUPER_ADMIN</span> or <span className="text-emerald-600 font-bold">ADMIN</span> in the switcher above to view this workspace.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {children}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
