"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  Users, BookOpen, Layers, HelpCircle, FileText, Bell, 
  Terminal, ShieldCheck, Activity, Plus, ArrowRight, Play, Database
} from "lucide-react";
import { adminStore, Class, Subject, Chapter, Question, AuditLog } from "@/lib/adminStore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSubjects: 0,
    totalBooks: 0,
    totalChapters: 0,
    totalQuestions: 0,
    totalMedia: 0,
    totalVideos: 0,
    totalAnnouncements: 0,
    totalUsers: 0
  });

  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Load counts from local state manager
    setStats({
      totalClasses: adminStore.getClasses().filter(c => !c.is_archived).length,
      totalSubjects: adminStore.getSubjects().filter(s => !s.is_archived).length,
      totalBooks: adminStore.getBooks().filter(b => !b.is_archived).length,
      totalChapters: adminStore.getChapters().length,
      totalQuestions: adminStore.getQuestions().filter(q => !q.is_archived).length,
      totalMedia: adminStore.getMediaAssets().length,
      totalVideos: adminStore.getVideos().length,
      totalAnnouncements: adminStore.getAnnouncements().filter(a => a.status !== "ARCHIVED").length,
      totalUsers: adminStore.getUsers().length
    });

    setRecentLogs(adminStore.getAuditLogs().slice(0, 5));
  }, []);

  const cardData = [
    { title: "Classes", value: stats.totalClasses, href: "/admin/content/classes", color: "from-blue-600 to-indigo-600", icon: Layers },
    { title: "Subjects", value: stats.totalSubjects, href: "/admin/content/subjects", color: "from-teal-600 to-emerald-600", icon: BookOpen },
    { title: "Chapters", value: stats.totalChapters, href: "/admin/content/chapters", color: "from-purple-600 to-pink-600", icon: FileText },
    { title: "Questions", value: stats.totalQuestions, href: "/admin/questions", color: "from-amber-600 to-orange-600", icon: HelpCircle },
    { title: "Media Library", value: stats.totalMedia, href: "/admin/media", color: "from-cyan-600 to-sky-600", icon: Database },
    { title: "Administrators", value: stats.totalUsers, href: "/admin/users", color: "from-rose-600 to-red-600", icon: Users }
  ];

  const quickActions = [
    { title: "Add Chapter", desc: "Create a new NCERT chapter node", href: "/admin/content/chapters", color: "hover:border-purple-500/50" },
    { title: "Add Question", desc: "Create a single test question", href: "/admin/questions", color: "hover:border-amber-500/50" },
    { title: "Bulk Import", desc: "Upload CSV/JSON question sheets", href: "/admin/questions/import", color: "hover:border-emerald-500/50" },
    { title: "New Announcement", desc: "Broadcast banner to classrooms", href: "/admin/announcements", color: "hover:border-sky-500/50" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-xl border border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Operations Dashboard Overview</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic content control panels, user permissions simulation, and NCERT curriculum engine.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-950 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Superuser Session Verified
          </span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {cardData.map((card, idx) => (
          <Link 
            key={idx} 
            href={card.href}
            className="bg-[#0F1424] hover:bg-[#141C33] border border-slate-800/80 rounded-xl p-5 block transition-all hover:scale-[1.02] hover:border-slate-700/60 shadow-lg shadow-slate-950/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${card.color} text-white`}>
                <card.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-100">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-6 shadow-lg shadow-slate-950/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-emerald-400" /> Quick Administrative Actions
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {quickActions.map((action, idx) => (
              <Link 
                key={idx} 
                href={action.href}
                className={`bg-slate-900/35 border border-slate-800/60 p-3.5 rounded-xl flex items-center justify-between transition-all ${action.color} group`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Platform Operations / Audit log */}
        <div className="lg:col-span-2 bg-[#0F1424] border border-slate-800/80 rounded-xl p-6 shadow-lg shadow-slate-950/10 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> Recent Operations Ledger
            </h3>
            <Link href="/admin/audit-logs" className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
              Audit Logs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold">
                  <th className="pb-3.5 font-semibold">User</th>
                  <th className="pb-3.5 font-semibold">Action</th>
                  <th className="pb-3.5 font-semibold">Target Entity</th>
                  <th className="pb-3.5 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/20">
                    <td className="py-3 font-semibold text-slate-300 max-w-[150px] truncate">{log.admin_email}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 font-semibold font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-medium font-mono">{log.entity_type} ({log.entity_id})</td>
                    <td className="py-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
