"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function WhatsAppChatWidget() {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappUrl = "https://wa.me/919667344125?text=Hello%20Teacher%20Sathi%20Team%2C%20I%20need%20assistance%20with%20creating%20NCERT%20lesson%20kits.";

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Desktop Teaser Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-start gap-2.5 bg-white text-slate-900 p-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-slate-200/90 max-w-[260px] animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 font-bold text-xs">
            👩‍🏫
          </div>
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-slate-900">Sathi Teacher Desk</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-tight">
              Need help setting up your 75&quot; smartboard? Chat with our team!
            </p>
          </div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5 -mr-1 -mt-1 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:from-[#22c35e] hover:to-[#1aa852] text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(37,211,102,0.55)] active:scale-95 flex items-center gap-2.5 cursor-pointer border border-emerald-300/40"
        aria-label="Chat with TeacherSathi Support on WhatsApp"
      >
        {/* WhatsApp Official SVG Glyph */}
        <div className="relative">
          <svg 
            className="w-5 h-5 fill-current transition-transform group-hover:scale-110" 
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-emerald-600" />
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">Need Help?</span>
          <span className="text-xs font-black tracking-wide">
            WhatsApp Support
          </span>
        </div>
      </a>
    </div>
  );
}
