"use client";

import React, { useState, useEffect } from "react";

interface DelayedSkeletonProps {
  children: React.ReactNode;
  delay?: number;
}

export default function DelayedSkeleton({ children, delay = 200 }: DelayedSkeletonProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // Wait for the specified delay before showing the skeleton
    // This prevents flashing a skeleton for very fast loads
    const timer = setTimeout(() => setShowSkeleton(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSkeleton) return null;

  return (
    <div aria-busy="true" className="w-full">
      <span className="sr-only" aria-live="polite">Loading content...</span>
      {children}
    </div>
  );
}
