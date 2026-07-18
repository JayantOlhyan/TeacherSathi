"use client";

import React from "react";
import dynamic from "next/dynamic";

// Excalidraw uses browser canvas & DOM APIs, must be rendered on the client side only.
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex-1 flex items-center justify-center bg-[#FDFBF7] font-bold text-xs text-emerald-800">
        <div className="animate-pulse flex items-center gap-2">
          <span>Loading Excalidraw Canvas Workspace...</span>
        </div>
      </div>
    ),
  }
);

export default function WhiteboardCanvas() {
  return (
    <div className="w-full h-full flex flex-col min-h-[600px] bg-white relative">
      <Excalidraw 
        theme="light"
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
            saveToActiveFile: false,
            loadScene: true,
            export: {
              saveFileToDisk: true,
            },
            clearCanvas: true,
          }
        }}
      />
    </div>
  );
}
