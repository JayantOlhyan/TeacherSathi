import React from "react";
import DelayedSkeleton from "@/components/DelayedSkeleton";

export default function AuthLoading() {
  return (
    <DelayedSkeleton delay={200}>
      <div className="min-h-[calc(100vh-64px)] flex flex-col font-sans bg-[#F9F9F4] overflow-hidden w-full">
        <div className="flex-1 flex w-full">
          {/* Left side - Illustration Skeleton */}
          <div className="hidden lg:flex flex-1 relative bg-[#E2E8DE]/60 flex-col justify-end p-12 overflow-hidden border-r border-[#E4EBE4]">
            <div className="absolute top-8 left-8 flex items-center gap-2">
              <div className="skeleton-block w-8 h-8 rounded-full"></div>
              <div className="skeleton-block w-32 h-6 rounded-md"></div>
            </div>
            <div className="relative z-10 max-w-md mx-auto text-center mt-auto w-full space-y-3">
              <div className="skeleton-block w-full h-8 rounded-md"></div>
              <div className="skeleton-block w-3/4 mx-auto h-8 rounded-md"></div>
            </div>
          </div>

          {/* Right side - Form Skeleton */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16">
            <div className="w-full max-w-[400px] space-y-8">
              <div className="text-center space-y-4 flex flex-col items-center">
                <div className="skeleton-block w-2/3 h-10 rounded-lg"></div>
                <div className="skeleton-block w-full h-4 rounded-md mt-2"></div>
                <div className="skeleton-block w-4/5 h-4 rounded-md"></div>
                <div className="skeleton-block w-3/4 h-4 rounded-md"></div>
              </div>

              {/* Tabs Skeleton */}
              <div className="flex bg-white rounded-full p-1 border border-[#E4EBE4] shadow-sm">
                <div className="skeleton-block flex-1 h-10 rounded-full mr-1"></div>
                <div className="skeleton-block flex-1 h-10 rounded-full ml-1 !bg-transparent"></div>
              </div>

              {/* Form Inputs Skeleton */}
              <div className="space-y-4">
                <div className="skeleton-block w-full h-12 rounded-lg"></div>
                <div className="skeleton-block w-full h-12 rounded-lg"></div>
                
                <div className="flex justify-end">
                  <div className="skeleton-block w-32 h-4 rounded-md"></div>
                </div>
                
                <div className="skeleton-block w-full h-14 rounded-lg"></div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#F9F9F4] text-gray-500">or</span>
                </div>
              </div>

              {/* Google Btn Skeleton */}
              <div className="skeleton-block w-full h-14 rounded-lg bg-white border border-[#E4EBE4]"></div>

              {/* Footer text Skeleton */}
              <div className="flex justify-center">
                <div className="skeleton-block w-48 h-4 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DelayedSkeleton>
  );
}
