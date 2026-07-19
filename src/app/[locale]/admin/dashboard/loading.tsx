import React from "react";
import DelayedSkeleton from "@/components/DelayedSkeleton";

export default function AdminDashboardLoading() {
  return (
    <DelayedSkeleton delay={200}>
      <div className="space-y-8 animate-fadeIn w-full">
        
        {/* Welcome Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-xl border border-slate-800/80">
          <div className="space-y-2 w-full md:w-1/2">
            <div className="skeleton-block w-2/3 h-6 rounded-md !bg-slate-800"></div>
            <div className="skeleton-block w-full h-4 rounded-md !bg-slate-800"></div>
          </div>
          <div className="skeleton-block w-48 h-8 rounded-lg !bg-slate-800"></div>
        </div>

        {/* Grid Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 block shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton-block w-16 h-3 rounded-sm !bg-slate-800"></div>
                <div className="skeleton-block w-6 h-6 rounded-lg !bg-slate-800"></div>
              </div>
              <div className="skeleton-block w-12 h-8 rounded-md !bg-slate-800"></div>
            </div>
          ))}
        </div>

        {/* Main Panel Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Panel Skeleton */}
          <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-6 space-y-4">
            <div className="skeleton-block w-48 h-5 rounded-md !bg-slate-800 mb-2"></div>
            <div className="grid grid-cols-1 gap-2.5">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-slate-900/35 border border-slate-800/60 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="space-y-2 w-2/3">
                    <div className="skeleton-block w-3/4 h-4 rounded-md !bg-slate-800"></div>
                    <div className="skeleton-block w-full h-3 rounded-md !bg-slate-800"></div>
                  </div>
                  <div className="skeleton-block w-4 h-4 rounded-md !bg-slate-800"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Operations Ledger Skeleton */}
          <div className="lg:col-span-2 bg-[#0F1424] border border-slate-800/80 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
              <div className="skeleton-block w-48 h-5 rounded-md !bg-slate-800"></div>
              <div className="skeleton-block w-24 h-4 rounded-md !bg-slate-800"></div>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="pb-3.5"><div className="skeleton-block w-20 h-4 rounded-md !bg-slate-800"></div></th>
                    <th className="pb-3.5"><div className="skeleton-block w-16 h-4 rounded-md !bg-slate-800"></div></th>
                    <th className="pb-3.5"><div className="skeleton-block w-24 h-4 rounded-md !bg-slate-800"></div></th>
                    <th className="pb-3.5"><div className="skeleton-block w-24 h-4 rounded-md !bg-slate-800"></div></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {[...Array(5)].map((_, idx) => (
                    <tr key={idx}>
                      <td className="py-4"><div className="skeleton-block w-32 h-4 rounded-md !bg-slate-800"></div></td>
                      <td className="py-4"><div className="skeleton-block w-20 h-5 rounded-full !bg-slate-800"></div></td>
                      <td className="py-4"><div className="skeleton-block w-40 h-4 rounded-md !bg-slate-800"></div></td>
                      <td className="py-4"><div className="skeleton-block w-24 h-4 rounded-md !bg-slate-800"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </DelayedSkeleton>
  );
}
