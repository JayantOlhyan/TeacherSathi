"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function DashboardAuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      // 1. Check client-side authentication cookies & localStorage
      const hasLocalMock = typeof window !== "undefined" && localStorage.getItem("mock_authenticated") === "true";
      const hasCookieAuth = typeof document !== "undefined" && (
        document.cookie.includes("ts_auth=true") || 
        document.cookie.includes("mock_authenticated=true")
      );

      if (hasLocalMock || hasCookieAuth) {
        if (isMounted) setIsAuthenticated(true);
        // Ensure cookies stay synced
        document.cookie = "ts_auth=true; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = "mock_authenticated=true; path=/; max-age=2592000; SameSite=Lax";
        return;
      }

      // 2. Check Supabase active session
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            if (isMounted) setIsAuthenticated(true);
            document.cookie = "ts_auth=true; path=/; max-age=2592000; SameSite=Lax";
            document.cookie = "mock_authenticated=true; path=/; max-age=2592000; SameSite=Lax";
            return;
          }
        } catch {
          // Supabase session check failed
        }
      }

      // 3. User is unauthenticated
      if (isMounted) {
        setIsAuthenticated(false);
        const redirectUrl = `/login?redirectTo=${encodeURIComponent(pathname || "/dashboard")}`;
        router.replace(redirectUrl);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Loading state while verifying authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAF8] text-slate-800 p-6">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0F5B38] text-white flex items-center justify-center shadow-lg mb-6 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-2">Verifying Educator Session</h2>
          <p className="text-xs text-slate-500 mb-6">Authenticating your TeacherSathi credentials and classroom workspace...</p>
          <Loader2 className="w-6 h-6 text-emerald-700 animate-spin" />
        </div>
      </div>
    );
  }

  // Access blocked state if not authenticated
  if (isAuthenticated === false) {
    const redirectUrl = `/login?redirectTo=${encodeURIComponent(pathname || "/dashboard")}`;
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#041F14] text-white p-6 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.15)_0%,rgba(4,31,20,0.98)_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-[#083220]/90 border border-emerald-500/25 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <div className="mb-4">
            <Image
              src="/logo-horizontal-on-dark.png"
              alt="TeacherSathi AI"
              width={160}
              height={40}
              className="h-8 w-auto object-contain mx-auto mb-3"
            />
            <h1 className="text-xl font-black text-white tracking-tight">Educator Login Required</h1>
            <p className="text-xs text-emerald-200/90 mt-2 leading-relaxed">
              You must be logged in to view student records, generate smartboard lessons, and interact with the TeacherSathi dashboard.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              href={redirectUrl}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-emerald-300 hover:text-white text-xs font-semibold block transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Render dashboard children safely
  return <>{children}</>;
}
