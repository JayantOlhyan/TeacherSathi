"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function ContentRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/content/class-8");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans text-slate-700">
      <div className="animate-pulse flex items-center gap-2 font-bold text-sm text-emerald-800">
        <span>Loading Content Library...</span>
      </div>
    </div>
  );
}
