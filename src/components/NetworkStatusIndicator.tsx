"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [wasOffline, setWasOffline] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setShowNotification(true);
      
      // Auto-hide the success notification after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Do not render if the user has been online continuously since loading
  if (isOnline === null || (isOnline && !wasOffline && !showNotification)) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-24 right-4 z-50 transition-all duration-300 transform ${
        showNotification ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {!isOnline ? (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-600 text-white rounded-2xl shadow-2xl border border-amber-500/30 max-w-sm">
          <WifiOff className="w-5 h-5 animate-pulse text-amber-200 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-white">Device is Offline</p>
            <p className="text-[10px] text-amber-200 mt-0.5">Some features may be temporarily unavailable.</p>
          </div>
        </div>
      ) : wasOffline ? (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-[#14532D] text-white rounded-2xl shadow-2xl border border-emerald-500/30 max-w-sm">
          <Wifi className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-white">Connection Restored</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">You are back online.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
