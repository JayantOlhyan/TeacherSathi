"use client";

import { MessageSquare } from "lucide-react";

export default function WhatsAppChatWidget() {
  const whatsappUrl = "https://wa.me/919667344125?text=Hello%20Teacher%20Sathi%20Team%2C%20I%20need%20assistance%20with%20creating%20NCERT%20lesson%20kits.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-40 bg-[#25D366] hover:bg-[#20bd59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline text-xs font-black tracking-wide">
        WhatsApp Support
      </span>
    </a>
  );
}
