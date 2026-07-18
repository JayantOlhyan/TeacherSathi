"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
