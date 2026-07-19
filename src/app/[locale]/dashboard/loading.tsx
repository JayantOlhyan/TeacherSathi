import React from "react";
import DelayedSkeleton from "@/components/DelayedSkeleton";

export default function DashboardLoading() {
  return (
    <DelayedSkeleton delay={200}>
      <div className="max-w-7xl mx-auto space-y-8 pb-16 relative w-full px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Top Banner Skeleton */}
        <div className="bg-[#E2E8DE]/50 p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#E2E8DE]">
          <div className="relative z-10 w-full md:w-1/2 space-y-4">
            <div className="skeleton-block w-40 h-6 rounded-full"></div>
            <div className="skeleton-block w-3/4 h-10 rounded-lg"></div>
            <div className="skeleton-block w-full h-12 rounded-lg"></div>
          </div>
          <div className="relative z-10 flex gap-3 w-full md:w-auto">
            <div className="skeleton-block w-32 h-12 rounded-xl"></div>
            <div className="skeleton-block w-32 h-12 rounded-xl"></div>
          </div>
        </div>

        {/* Got a Doubt Banner Skeleton */}
        <div className="bg-white border border-[#E4EBE4] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-full sm:w-2/3">
            <div className="skeleton-block w-1/2 h-6 rounded-md"></div>
            <div className="skeleton-block w-3/4 h-4 rounded-md"></div>
          </div>
          <div className="skeleton-block w-36 h-10 rounded-xl shrink-0"></div>
        </div>

        {/* Quick Actions Toolbar Skeleton */}
        <section className="space-y-3">
          <div className="skeleton-block w-48 h-4 rounded-md"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="bg-white border border-[#E4EBE4] p-4 rounded-xl shadow-sm min-h-[100px] flex flex-col justify-between">
                <div className="skeleton-block w-2/3 h-4 rounded-md"></div>
                <div className="skeleton-block w-8 h-8 rounded-lg self-end"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Grid: Left and Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Teaching */}
            <section className="space-y-3">
              <div className="skeleton-block w-40 h-4 rounded-md"></div>
              <div className="bg-white border border-[#E4EBE4] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4 items-center w-full">
                  <div className="skeleton-block w-12 h-12 rounded-xl shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="skeleton-block w-1/2 h-5 rounded-md"></div>
                    <div className="skeleton-block w-1/3 h-4 rounded-md"></div>
                  </div>
                </div>
                <div className="skeleton-block w-32 h-4 rounded-md shrink-0"></div>
              </div>
            </section>

            {/* My Classes */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="skeleton-block w-32 h-4 rounded-md"></div>
                <div className="skeleton-block w-24 h-4 rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="bg-white border border-[#E4EBE4] p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 w-2/3">
                        <div className="skeleton-block w-full h-5 rounded-md"></div>
                        <div className="skeleton-block w-1/2 h-4 rounded-md"></div>
                      </div>
                      <div className="skeleton-block w-12 h-6 rounded-full shrink-0"></div>
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="skeleton-block w-1/2 h-4 rounded-md"></div>
                      <div className="skeleton-block w-20 h-4 rounded-md shrink-0"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Class Performance */}
            <section className="space-y-3">
              <div className="skeleton-block w-40 h-4 rounded-md"></div>
              <div className="bg-white border border-[#E4EBE4] p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="skeleton-block w-1/3 h-4 rounded-md"></div>
                  <div className="skeleton-block w-16 h-8 rounded-md"></div>
                </div>
                <div className="space-y-3">
                  <div className="skeleton-block w-full h-4 rounded-md"></div>
                  <div className="skeleton-block w-full h-2 rounded-full"></div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="skeleton-block w-full h-4 rounded-md"></div>
                  <div className="skeleton-block w-full h-2 rounded-full"></div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-50 flex justify-center">
                  <div className="skeleton-block w-40 h-4 rounded-md"></div>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </DelayedSkeleton>
  );
}
