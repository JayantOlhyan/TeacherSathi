import React from "react";
import DelayedSkeleton from "@/components/DelayedSkeleton";

export default function ContentLoading() {
  return (
    <DelayedSkeleton delay={200}>
      <div className="max-w-7xl mx-auto space-y-8 pb-16 relative w-full px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* NCERT Header banner Skeleton */}
        <div className="bg-[#E2E8DE]/50 p-8 rounded-2xl shadow-lg space-y-4 relative overflow-hidden border border-[#E2E8DE]">
          <div className="skeleton-block w-48 h-6 rounded-full"></div>
          <div className="skeleton-block w-1/3 h-10 rounded-lg"></div>
          <div className="skeleton-block w-2/3 max-w-[600px] h-8 rounded-md"></div>
          
          {/* Class Selection Navigation Skeleton */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="skeleton-block w-20 h-8 rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Subject Cards Grid Skeleton */}
        <div className="space-y-4">
          <div className="skeleton-block w-32 h-4 rounded-md"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="bg-white border border-[#E4EBE4] p-6 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="skeleton-block w-12 h-12 rounded-xl shrink-0"></div>
                <div className="space-y-2 w-full">
                  <div className="skeleton-block w-2/3 h-5 rounded-md"></div>
                  <div className="skeleton-block w-1/2 h-4 rounded-md"></div>
                  <div className="skeleton-block w-1/3 h-3 rounded-md mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DelayedSkeleton>
  );
}
