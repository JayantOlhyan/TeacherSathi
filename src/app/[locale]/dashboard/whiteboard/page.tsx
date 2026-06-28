"use client";

import { Pen, Eraser, Square, Circle, Type, MousePointer2, Image as ImageIcon, Ruler, LayoutGrid, Maximize2, Undo, Redo } from "lucide-react";

export default function WhiteboardPlaceholder() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Interactive Classroom Whiteboard</h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Use the online digital whiteboard to sketch diagrams, teach visual math and science concepts, and conduct engaging live classroom sessions for Indian government schools.
        </p>
      </div>
      <div className="h-[calc(100vh-14rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
      
      {/* Toolbar - Top */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"><Undo className="w-4 h-4" /></button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"><Redo className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <span className="text-sm font-medium text-gray-500">Geometry Lesson - Board 1</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <LayoutGrid className="w-4 h-4" /> Infinity Mode
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"><Maximize2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-[#F8F9FA] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        
        {/* Floating Toolbar - Left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-2">
          {[
            { icon: MousePointer2, active: true },
            { icon: Pen, active: false },
            { icon: Eraser, active: false },
            { icon: Square, active: false },
            { icon: Circle, active: false },
            { icon: Type, active: false },
            { icon: Ruler, active: false },
            { icon: ImageIcon, active: false },
          ].map((tool, i) => (
            <button key={i} className={`p-2.5 rounded-lg transition-colors ${tool.active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
          <div className="w-full h-px bg-gray-200 my-1"></div>
          {/* Color Picker dots */}
          <div className="grid grid-cols-2 gap-2 p-1">
            <button className="w-4 h-4 rounded-full bg-black ring-2 ring-offset-1 ring-gray-300"></button>
            <button className="w-4 h-4 rounded-full bg-red-500"></button>
            <button className="w-4 h-4 rounded-full bg-blue-500"></button>
            <button className="w-4 h-4 rounded-full bg-green-500"></button>
          </div>
        </div>

        {/* Placeholder Content inside Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-sm">
            <Ruler className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Digital Canvas Ready</h2>
            <p className="text-gray-500 max-w-sm">This is a placeholder for the complex whiteboard integration (e.g. TLDraw or Excalidraw). The canvas is ready for drawing!</p>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
