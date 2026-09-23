'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pen,
  Highlighter,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Grid,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  width: number;
  points: Point[];
}

export interface ClassroomWhiteboardProps {
  initialTheme?: 'dark' | 'light';
  onClose?: () => void;
}

const PALETTE_COLORS = [
  { name: 'White', darkVal: '#FFFFFF', lightVal: '#0F172A' },
  { name: 'Emerald', darkVal: '#10B981', lightVal: '#059669' },
  { name: 'Cyan', darkVal: '#38BDF8', lightVal: '#0284C7' },
  { name: 'Yellow', darkVal: '#FACC15', lightVal: '#D97706' },
  { name: 'Coral', darkVal: '#F87171', lightVal: '#DC2626' },
  { name: 'Purple', darkVal: '#C084FC', lightVal: '#7C3AED' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', value: 3, ring: 'w-2 h-2' },
  { label: 'Medium', value: 7, ring: 'w-3.5 h-3.5' },
  { label: 'Thick', value: 14, ring: 'w-5 h-5' },
];

export function ClassroomWhiteboard({ initialTheme = 'dark' }: ClassroomWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [boardTheme, setBoardTheme] = useState<'dark' | 'light'>(initialTheme);
  const [activeColor, setActiveColor] = useState<string>(
    initialTheme === 'dark' ? '#10B981' : '#059669'
  );
  const [strokeWidth, setStrokeWidth] = useState<number>(7);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  // Stroke undo/redo stack
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  const isDark = boardTheme === 'dark';

  // Redraw entire canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = isDark ? '#0B131E' : '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Optional Grid pattern
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Render all saved strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'eraser') {
        ctx.strokeStyle = isDark ? '#0B131E' : '#FFFFFF';
        ctx.lineWidth = stroke.width * 3;
      } else if (stroke.tool === 'highlighter') {
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.width * 2.5;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Render current active stroke
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      const stroke = currentStrokeRef.current;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'eraser') {
        ctx.strokeStyle = isDark ? '#0B131E' : '#FFFFFF';
        ctx.lineWidth = stroke.width * 3;
      } else if (stroke.tool === 'highlighter') {
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.width * 2.5;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [strokes, showGrid, isDark]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      redrawCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer Events for Touch / Stylus / Mouse
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = getCoordinates(e);

    currentStrokeRef.current = {
      tool: activeTool,
      color: activeColor,
      width: strokeWidth,
      points: [pt],
    };
    redrawCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();
    const pt = getCoordinates(e);
    currentStrokeRef.current.points.push(pt);
    redrawCanvas();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Handled silently
    }
    isDrawingRef.current = false;

    if (currentStrokeRef.current.points.length > 0) {
      setStrokes((prev) => [...prev, currentStrokeRef.current!]);
      setRedoStack([]);
    }
    currentStrokeRef.current = null;
    redrawCanvas();
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setStrokes((prev) => [...prev, next]);
  };

  const handleClear = () => {
    if (strokes.length === 0) return;
    setRedoStack(strokes); // Preserve in redo stack so accidental clearing can be undone immediately
    setStrokes([]);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col relative select-none overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#0B131E] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* Top 75" Tactile Drawing Toolbar (>= 64px Touch Targets) */}
      <div
        className={`w-full px-6 py-3.5 border-b flex items-center justify-between gap-4 z-20 flex-wrap flex-shrink-0 ${
          isDark
            ? 'bg-[#080D14]/95 border-slate-800'
            : 'bg-white/95 border-slate-200 shadow-sm'
        }`}
      >
        {/* Tool Selector (Pen, Highlighter, Eraser) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTool('pen')}
            aria-label="Draw with Pen Tool"
            className={`min-h-[58px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-black text-base flex items-center gap-2.5 border transition-all active:scale-95 cursor-pointer ${
              activeTool === 'pen'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                : isDark
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Pen className="w-5 h-5 text-emerald-300" />
            <span>Pen</span>
          </button>

          <button
            onClick={() => setActiveTool('highlighter')}
            aria-label="Highlight with Marker Tool"
            className={`min-h-[58px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-black text-base flex items-center gap-2.5 border transition-all active:scale-95 cursor-pointer ${
              activeTool === 'highlighter'
                ? 'bg-amber-500 text-white border-amber-300 shadow-lg'
                : isDark
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Highlighter className="w-5 h-5 text-amber-300" />
            <span>Marker</span>
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            aria-label="Erase with Whiteboard Eraser"
            className={`min-h-[58px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl font-black text-base flex items-center gap-2.5 border transition-all active:scale-95 cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg'
                : isDark
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Eraser className="w-5 h-5 text-rose-300" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color Palette Discs (>= 48px tactile targets) */}
        {activeTool !== 'eraser' && (
          <div className="flex items-center gap-2.5 px-3 py-1 bg-black/20 rounded-2xl border border-white/10">
            {PALETTE_COLORS.map((col) => {
              const val = isDark ? col.darkVal : col.lightVal;
              const isSelected = activeColor === val;
              return (
                <button
                  key={col.name}
                  onClick={() => setActiveColor(val)}
                  title={col.name}
                  aria-label={`Select color ${col.name}`}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform active:scale-90 flex items-center justify-center border-2 cursor-pointer ${
                    isSelected
                      ? 'scale-115 border-white ring-4 ring-emerald-500/40 shadow-lg'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: val }}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Thickness Selector */}
        {activeTool !== 'eraser' && (
          <div className="hidden lg:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-2xl border border-white/10">
            {STROKE_WIDTHS.map((sw) => (
              <button
                key={sw.label}
                onClick={() => setStrokeWidth(sw.value)}
                aria-label={`Select ${sw.label} stroke thickness`}
                className={`min-h-[48px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                  strokeWidth === sw.value
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <span className={`rounded-full bg-current ${sw.ring}`} />
                <span>{sw.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Canvas Actions (Undo, Redo, Clear, Theme, Grid) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            title="Undo"
            aria-label="Undo last whiteboard stroke"
            className="min-h-[58px] sm:min-h-[64px] min-w-[58px] sm:min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo"
            aria-label="Redo whiteboard stroke"
            className="min-h-[58px] sm:min-h-[64px] min-w-[58px] sm:min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid Lines"
            aria-label="Toggle grid lines"
            className={`min-h-[58px] sm:min-h-[64px] min-w-[58px] sm:min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              showGrid
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setBoardTheme(isDark ? 'light' : 'dark')}
            title="Toggle Blackboard / Whiteboard"
            aria-label={isDark ? "Switch to white background" : "Switch to dark background"}
            className="min-h-[58px] sm:min-h-[64px] min-w-[58px] sm:min-w-[64px] rounded-2xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            title="Clear Whiteboard"
            aria-label="Clear whiteboard canvas"
            className="min-h-[58px] sm:min-h-[64px] px-4 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-rose-600/20 text-rose-300 border-rose-500/40 hover:bg-rose-600/40"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Interactive Drawing Canvas Surface */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full touch-none block"
        />

        {strokes.length === 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
            <div className="text-center space-y-3">
              <Sparkles className="w-16 h-16 mx-auto text-emerald-400" />
              <p className="text-2xl font-serif font-black tracking-wider">
                Interactive Smartboard Canvas
              </p>
              <p className="text-sm font-sans font-medium">
                Draw with stylus or finger touch • Use toolbar above
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ClassroomWhiteboard;
