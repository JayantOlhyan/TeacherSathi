import React from "react";
import { BadgeCheck, MonitorCheck, ShieldCheck, Lock, Award } from "lucide-react";

export default function TrustStrip() {
  const items = [
    { icon: BadgeCheck, text: "CBSE & NCERT Core", sub: "Class 6-10 Aligned" },
    { icon: Award, text: "KVS & NVS Ready", sub: "100% Curriculum Sync" },
    { icon: MonitorCheck, text: "75\" Smart Screen", sub: "Native Displays" },
    { icon: ShieldCheck, text: "DPDP Act 2023", sub: "Compliant & Audited" },
    { icon: Lock, text: "256-Bit Encrypted", sub: "Zero-Trust Protected" }
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] shadow-md border border-gray-200 flex flex-col xl:flex-row items-center justify-between p-6 px-10 relative z-20">
      
      {/* Left Title */}
      <div className="xl:border-r border-slate-200 xl:pr-10 mb-6 xl:mb-0 shrink-0 text-center xl:text-left">
        <h2 className="text-[#1A2E20] font-black text-xl leading-tight font-serif">
          Trusted across CBSE, KVS &amp;<br />
          State Board Schools
        </h2>
      </div>

      {/* Right Items */}
      <div className="flex flex-wrap justify-center xl:justify-end gap-x-10 gap-y-6 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#1A2E20]">{item.text}</div>
              <div className="text-[11px] font-bold text-emerald-700">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
