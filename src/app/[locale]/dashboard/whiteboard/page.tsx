"use client";

import React, { useState } from "react";
import WhiteboardCanvas from "@/components/whiteboard/WhiteboardCanvas";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  Layers,
  Ruler,
  Compass
} from "lucide-react";

export default function InteractiveWhiteboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cheatsheet" | "lessons" | "formulas">("cheatsheet");

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)]">
      {/* Title Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            Interactive Classroom Whiteboard
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Sketch diagrams, teach math and science, and conduct visual lessons in Indian government schools.
          </p>
        </div>
        
        {/* Toggle Toolkit Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
            isSidebarOpen
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isSidebarOpen ? "Close Toolkit" : "Teacher's Toolkit"}</span>
          {isSidebarOpen ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Main Board Workspace Area */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0 relative">
        {/* The Digital Canvas (Main Column) */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col relative">
          <WhiteboardCanvas />
        </div>

        {/* Collapsible Teacher's Toolkit Panel (Right Column) */}
        <div
          className={`absolute lg:relative right-0 top-0 bottom-0 z-30 lg:z-auto bg-white border border-gray-200 shadow-xl lg:shadow-none rounded-2xl w-80 flex flex-col overflow-hidden transition-all duration-300 transform ${
            isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full lg:hidden opacity-0"
          }`}
        >
          {/* Toolkit Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Compass className="w-4.5 h-4.5 text-indigo-600" />
              {"Teacher's Toolkit"}
            </h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-150 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 text-xs font-semibold bg-gray-50/50">
            <button
              onClick={() => setActiveTab("cheatsheet")}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === "cheatsheet"
                  ? "border-indigo-600 text-indigo-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Shortcuts
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === "lessons"
                  ? "border-indigo-600 text-indigo-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Lesson Ideas
            </button>
            <button
              onClick={() => setActiveTab("formulas")}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === "formulas"
                  ? "border-indigo-600 text-indigo-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Formulas
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "cheatsheet" && (
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  Canvas Navigation Shortcuts
                </h4>
                <ul className="space-y-2.5 text-xs text-gray-600">
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Draw / Sketch</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Pointer / Touch</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Zoom In/Out</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Scroll / Pinch</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Pan Canvas</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Hold Space + Drag</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Edit Text box</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Double Click text</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Delete Selected</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Backspace / Del</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Undo</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Ctrl/Cmd + Z</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span>Redo</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border font-bold">Ctrl/Cmd + Y</span>
                  </li>
                </ul>

                <div className="bg-indigo-50/75 border border-indigo-100 p-3 rounded-xl flex gap-2 mt-4">
                  <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-indigo-800">
                    <strong>Touchscreen tip:</strong> Teachers using tablets can pinch to zoom and drag with two fingers to navigate elements easily!
                  </p>
                </div>
              </div>
            )}

            {activeTab === "lessons" && (
              <div className="space-y-4 text-xs">
                {/* Visual Geometry */}
                <div className="bg-gray-50 border p-3 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    Geometry Construction
                  </h4>
                  <p className="text-gray-500 mb-2 leading-relaxed text-[11px]">
                    Build circles, tangents, and polygons to visually demonstrate theorems.
                  </p>
                  <div className="bg-white p-2 rounded border border-gray-100 text-[11px] text-gray-600">
                    <span className="font-semibold text-gray-800">Visual Hint:</span> Use <strong>Crimson Red</strong> for highlight lines/arcs, and <strong>Charcoal</strong> for original shapes.
                  </div>
                </div>

                {/* Graphing Math */}
                <div className="bg-gray-50 border p-3 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-blue-600" />
                    Coordinate Graphs
                  </h4>
                  <p className="text-gray-500 mb-2 leading-relaxed text-[11px]">
                    Draw straight x and y axes with the Ruler tool, then use the Pen to sketch parabolas or linear equations.
                  </p>
                  <div className="bg-white p-2 rounded border border-gray-100 text-[11px] text-gray-600">
                    Toggle <strong>Infinity Mode</strong> grid for perfectly spaced coordinate points!
                  </div>
                </div>

                {/* Biology Labels */}
                <div className="bg-gray-50 border p-3 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    Labeled Diagrams
                  </h4>
                  <p className="text-gray-500 mb-2 leading-relaxed text-[11px]">
                    Upload a base diagram image (like a plant cell), then use the Text tool to type label overlays dynamically in class.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "formulas" && (
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  Quick Mathematical Formulas
                </h4>
                
                <div className="space-y-3">
                  <div className="border-b pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Circle</span>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mt-0.5">
                      <span>Area: \(A = \pi r^2\)</span>
                      <span>Circumference: \(C = 2\pi r\)</span>
                    </div>
                  </div>

                  <div className="border-b pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Rectangle</span>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mt-0.5">
                      <span>Area: \(A = l \times w\)</span>
                      <span>Perimeter: \(P = 2(l + w)\)</span>
                    </div>
                  </div>

                  <div className="border-b pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Triangle</span>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mt-0.5">
                      <span>Area: \(A = \frac{1}{2} b h\)</span>
                      <span>Pythagoras: \(a^2 + b^2 = c^2\)</span>
                    </div>
                  </div>

                  <div className="border-b pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Sphere</span>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mt-0.5">
                      <span>Volume: \(V = \frac{4}{3} \pi r^3\)</span>
                      <span>Surf. Area: \(S = 4\pi r^2\)</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center italic mt-4">
                  Formulas render dynamically for reference during construction lessons.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
