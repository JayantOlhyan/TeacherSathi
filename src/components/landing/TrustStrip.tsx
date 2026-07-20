import React from "react";
import { BadgeCheck, MonitorCheck, Languages, ShieldCheck, RefreshCw } from "lucide-react";

export default function TrustStrip() {
  const items = [
    { icon: BadgeCheck, text: "NCERT Alignment", sub: "Verified" },
    { icon: MonitorCheck, text: "Classroom Usability", sub: "Tested" },
    { icon: Languages, text: "Language Clarity", sub: "Reviewed" },
    { icon: ShieldCheck, text: "Content Quality", sub: "Checked" },
    { icon: RefreshCw, text: "Continuously", sub: "Improved" }
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] shadow-sm border border-white flex flex-col xl:flex-row items-center justify-between p-6 px-10 relative z-20">
      
      {/* Left Title */}
      <div className="xl:border-r border-slate-200 xl:pr-10 mb-6 xl:mb-0 shrink-0 text-center xl:text-left">
        <h2 className="text-[#1A2E20] font-black text-xl leading-tight">
          Built with teachers.<br />
          Tested in real classrooms.
        </h2>
      </div>

      {/* Right Items */}
      <div className="flex flex-wrap justify-center xl:justify-end gap-x-12 gap-y-6 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <item.icon className="w-6 h-6 text-[#2C4A35]" strokeWidth={1.5} />
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-black text-[#1A2E20]">{item.text}</div>
              <div className="text-[10px] sm:text-xs font-medium text-[#4A5D52]">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
