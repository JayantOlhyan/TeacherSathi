"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  PenTool, Eraser, Type, Sparkles, Trash2, 
  Lock, Unlock, Highlighter, MousePointer2 
} from "lucide-react";
import "@excalidraw/excalidraw/index.css";

// Dynamic client-side wrapper
const ExcalidrawLoader = dynamic(
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

// Typecast to bypass LoadableComponent prop-stripping type limits
const Excalidraw = ExcalidrawLoader as any;

type ActiveToolName = "select" | "pen" | "highlighter" | "strobe" | "eraser" | "text";

export default function WhiteboardCanvas() {
  const canvasRef = useRef<any>(null);
  const [activeTool, setActiveTool] = useState<ActiveToolName>("pen");
  const [isLocked, setIsLocked] = useState<boolean>(true); // Locked active by default for continuous drawing

  // Initialize tool state when component is mounted and ref is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      selectTool("pen");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Keep Excalidraw tool lock synced with our state
  useEffect(() => {
    const api = canvasRef.current;
    if (!api) return;
    const currentAppState = api.getAppState();
    api.updateAppState({
      activeTool: {
        ...currentAppState.activeTool,
        locked: isLocked
      }
    });
  }, [isLocked, activeTool]);

  const selectTool = (toolName: ActiveToolName) => {
    const api = canvasRef.current;
    if (!api) return;
    setActiveTool(toolName);

    switch (toolName) {
      case "select":
        api.setActiveTool({ type: "selection" });
        break;
      
      case "pen":
        api.setActiveTool({ type: "freedraw" });
        api.updateAppState({
          currentItemStrokeColor: "#1e293b", // Charcoal
          currentItemOpacity: 100,
          currentItemStrokeWidth: 3,
          currentItemStrokeStyle: "solid"
        });
        break;

      case "highlighter":
        api.setActiveTool({ type: "freedraw" });
        api.updateAppState({
          currentItemStrokeColor: "#facc15", // Translucent yellow
          currentItemOpacity: 45,
          currentItemStrokeWidth: 12,
          currentItemStrokeStyle: "solid"
        });
        break;

      case "strobe":
        // Excalidraw laser tool
        api.setActiveTool({ type: "laser" });
        break;

      case "eraser":
        api.setActiveTool({ type: "eraser" });
        break;

      case "text":
        api.setActiveTool({ type: "text" });
        break;
    }
  };

  const handleClear = () => {
    const api = canvasRef.current;
    if (!api) return;
    api.clearCanvas();
    // Re-select active tool after clear
    selectTool(activeTool);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-[600px] bg-white relative group">
      {/* Excalidraw Workspace */}
      <div className="flex-1 w-full h-full relative">
        <Excalidraw 
          theme="light"
          excalidrawRef={(api: any) => {
            canvasRef.current = api;
          }}
          UIOptions={{
            canvasActions: {
              toggleTheme: false,
              saveToActiveFile: false,
              loadScene: false,
              export: {
                saveFileToDisk: true,
              },
              clearCanvas: false, // Managed by our custom toolbar
            }
          }}
        />
      </div>

      {/* Custom Glassmorphic Toolbar Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg px-4 py-2.5 rounded-2xl flex items-center gap-3.5 z-40 transition-all duration-300">
        
        {/* Pointer / Select */}
        <button
          onClick={() => selectTool("select")}
          className={`p-2 rounded-xl transition-all ${
            activeTool === "select" 
              ? "bg-[#14532D] text-white shadow-xs" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          title="Selection Pointer (V)"
        >
          <MousePointer2 className="w-4 h-4" />
        </button>

        {/* Regular Pen */}
        <button
          onClick={() => selectTool("pen")}
          className={`p-2 rounded-xl transition-all ${
            activeTool === "pen" 
              ? "bg-[#14532D] text-white shadow-xs" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          title="Writing Pen (P)"
        >
          <PenTool className="w-4 h-4" />
        </button>

        {/* Highlighter */}
        <button
          onClick={() => selectTool("highlighter")}
          className={`p-2 rounded-xl transition-all ${
            activeTool === "highlighter" 
              ? "bg-[#14532D] text-white shadow-xs" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          title="Yellow Highlighter (H)"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {/* Laser / Strobe Pointer */}
        <button
          onClick={() => selectTool("strobe")}
          className={`p-2 rounded-xl transition-all ${
            activeTool === "strobe" 
              ? "bg-[#14532D] text-white shadow-xs" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          title="Strobe/Laser Pointer (L)"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Eraser */}
        <button
          onClick={() => selectTool("eraser")}
          className={`p-2 rounded-xl transition-all ${
            activeTool === "eraser" 
              ? "bg-[#14532D] text-white shadow-xs" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-4 h-4" />
        </button>

        {/* Text */}
        <button
          onClick={() => selectTool("text")}
          className={`p-2 rounded-xl transition-all ${
            activeTool === "text" 
              ? "bg-[#14532D] text-white shadow-xs" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          title="Insert Text (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-200" />

        {/* Tool Lock Selector (Prevents closing down) */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`p-2 rounded-xl transition-all flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
            isLocked 
              ? "bg-emerald-50 text-[#14532D] border border-emerald-250" 
              : "text-slate-450 hover:bg-slate-100 hover:text-slate-600 border border-transparent"
          }`}
          title={isLocked ? "Continuous Drawing Active (Locked)" : "Single Drawing mode"}
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" /> Keep Tool Open
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5" /> Auto-select
            </>
          )}
        </button>

        {/* Trash Clear */}
        <button
          onClick={handleClear}
          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all"
          title="Clear Board Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
