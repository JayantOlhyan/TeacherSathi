import React from "react";
import { BadgeCheck, MonitorCheck, ShieldCheck, Award, Users } from "lucide-react";

export default function TrustStrip() {
  const boards = [
    { name: "CBSE", label: "Central Board" },
    { name: "KVS", label: "Kendriya Vidyalaya" },
    { name: "NVS", label: "Navodaya Vidyalaya" },
    { name: "MP Board", label: "State Board" },
    { name: "UP Board", label: "State Board" },
    { name: "Bihar Board", label: "State Board" },
  ];

  const trustBadges = [
    { icon: BadgeCheck, title: "100% NCERT Aligned", desc: "Classes 6 to 10" },
    { icon: MonitorCheck, title: "75\" Smart Board Ready", desc: "Native Display Kits" },
    { icon: Users, title: "10,000+ Active Teachers", desc: "Across 28 States" },
    { icon: ShieldCheck, title: "DPDP Act 2023", desc: "Data Compliant" },
    { icon: Award, title: "NEP 2020 Framework", desc: "Competency Based" },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6 relative z-20">
      {/* Top Strip: School Boards Logos / Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">Verified School Boards</span>
          <h2 className="text-sm font-black text-slate-800">Designed for CBSE, KVS, NVS &amp; All Indian State Boards</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {boards.map((b) => (
            <span
              key={b.name}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200/80 text-slate-700 hover:text-emerald-900 font-extrabold text-xs transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {b.name}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Strip: Key Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {trustBadges.map((badge, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50/60 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <badge.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 leading-snug">{badge.title}</h3>
              <p className="text-[10px] font-bold text-emerald-700">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
