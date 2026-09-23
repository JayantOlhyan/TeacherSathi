'use client';

import React, { useEffect } from 'react';
import { RotateCcw, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard loading error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Teaching Data Protected
      </div>

      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
        <LayoutDashboard className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900">
          We couldn&apos;t load your dashboard.
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Your saved lesson plans, assessments, and recent classroom activities are secure. Please try reloading or head straight to your curriculum lessons.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/content"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
        >
          <span>Go to Curriculum Lessons</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
