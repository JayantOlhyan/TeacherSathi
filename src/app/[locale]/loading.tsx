import React from "react";
import DelayedSkeleton from "@/components/DelayedSkeleton";

export default function Loading() {
  return (
    <DelayedSkeleton delay={200}>
      <div className="min-h-screen flex flex-col font-sans bg-[#F8FAF6] overflow-hidden relative">
        <main className="flex-1 flex flex-col items-center w-full relative z-10">
          
          {/* Hero Section */}
          <section className="w-full py-[clamp(3rem,8vw,5rem)] px-[clamp(1rem,4vw,3rem)] max-w-[1200px] mx-auto text-center">
            <div className="w-full max-w-4xl mx-auto space-y-8 flex flex-col items-center">
              {/* Title Skeleton */}
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="skeleton-block w-3/4 max-w-[500px] h-12 md:h-16 rounded-xl"></div>
                <div className="skeleton-block w-2/3 max-w-[400px] h-10 md:h-12 rounded-xl"></div>
                <div className="skeleton-block w-1/2 max-w-[300px] h-8 md:h-10 rounded-xl mt-2"></div>
              </div>
              
              {/* Subtitle Skeleton */}
              <div className="skeleton-block w-full max-w-[600px] h-6 rounded-md"></div>
              <div className="skeleton-block w-4/5 max-w-[500px] h-6 rounded-md"></div>

              {/* CTA Buttons Skeleton */}
              <div className="flex flex-wrap gap-4 pt-2 justify-center w-full">
                <div className="skeleton-block h-14 w-48 rounded-2xl"></div>
                <div className="skeleton-block h-14 w-48 rounded-2xl"></div>
              </div>
            </div>
          </section>

          {/* Yellow Banner Strip Skeleton */}
          <div className="w-full h-14 bg-[#FBBF24]/30 overflow-hidden border-y border-black/5 shadow-sm"></div>

          {/* Feature Grid Section Skeleton */}
          <section className="w-full py-[clamp(3rem,6vw,4rem)] px-[clamp(1rem,4vw,2rem)] max-w-[1200px] mx-auto">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(1rem,3vw,1.5rem)]">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="bg-white border border-[#E4EBE4] rounded-2xl p-6 flex items-start gap-4 h-[120px]">
                  <div className="skeleton-block w-10 h-10 rounded-xl shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="skeleton-block w-1/2 h-5 rounded-md"></div>
                    <div className="skeleton-block w-full h-3 rounded-sm"></div>
                    <div className="skeleton-block w-4/5 h-3 rounded-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </DelayedSkeleton>
  );
}
