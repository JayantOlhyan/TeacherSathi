"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  Ruler,
  Image as ImageIcon,
  Trash2,
  Download,
  Infinity as InfinityIcon,
  RefreshCw
} from "lucide-react";

// --- Types & Data Models ---
type Point = { x: number; y: number };

interface BaseElement {
  id: string;
  type: "pen" | "rectangle" | "circle" | "line" | "text" | "image";
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
}

interface PenElement extends BaseElement {
  type: "pen";
  points: Point[];
}

interface RectElement extends BaseElement {
  type: "rectangle";
  width: number;
  height: number;
}

interface CircleElement extends BaseElement {
  type: "circle";
  radius: number;
}

interface LineElement extends BaseElement {
  type: "line";
  endX: number;
  endY: number;
}

interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontSize: number;
}

interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  width: number;
  height: number;
}

type WhiteboardElement =
  | PenElement
  | RectElement
  | CircleElement
  | LineElement
  | TextElement
  | ImageElement;

type ToolType =
  | "select"
  | "pen"
  | "eraser"
  | "rectangle"
  | "circle"
  | "line"
  | "text"
  | "image";

// --- Distance Math Helpers for Hit Testing ---
function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function getDistanceToSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function isPointNearPen(x: number, y: number, points: Point[], threshold: number): boolean {
  if (points.length === 0) return false;
  // Bounding box quick check
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  if (
    x < minX - threshold ||
    x > maxX + threshold ||
    y < minY - threshold ||
    y > maxY + threshold
  ) {
    return false;
  }
  // Detailed check
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (getDistanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= threshold) {
      return true;
    }
  }
  return false;
}

export default function WhiteboardCanvas() {
  // --- React State (For UI configuration) ---
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState<string>("#1e293b"); // Charcoal default
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(24);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isInfinityMode, setIsInfinityMode] = useState<boolean>(true);

  // --- Inline Text Editor State ---
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    text: string;
    clientX: number;
    clientY: number;
    elementId?: string; // If editing an existing text element
  } | null>(null);

  // --- Refs (For High-Performance Drawing Loops) ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Track drawing/dragging details in refs to prevent React state lag
  const isDrawingRef = useRef<boolean>(false);
  const activeElementRef = useRef<WhiteboardElement | null>(null);
  const currentPointsRef = useRef<Point[]>([]);
  const startCoordsRef = useRef<{ x: number; y: number; clientX: number; clientY: number }>({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0
  });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeHandleRef = useRef<string | null>(null); // 'tl' | 'tr' | 'bl' | 'br' | 'start' | 'end'
  const resizeStartElementRef = useRef<WhiteboardElement | null>(null);
  const dragStartElementsRef = useRef<WhiteboardElement | null>(null);
  
  // History Undo/Redo Stacks
  const historyRef = useRef<WhiteboardElement[][]>([]);
  const historyIndexRef = useRef<number>(-1);

  // Keyboard Spacebar track for pan mode
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  // --- Initialize Canvas and Resize Event ---
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      requestRepaint();
    };

    const container = containerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
      
      // Initial call
      handleResize();

      return () => {
        resizeObserver.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      if (e.code === "Space") {
        setIsSpacePressed(true);
        e.preventDefault();
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }

      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }

      // Delete selected element
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          deleteSelectedElement();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, selectedElementId]);

  // Trigger repaint on state changes
  useEffect(() => {
    requestRepaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, selectedElementId, zoom, panX, panY, isInfinityMode, tool, color]);

  // --- History State Management ---
  const saveHistory = (newElements: WhiteboardElement[]) => {
    // Truncate history stack if we were inside an undo chain
    const truncatedHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    truncatedHistory.push(JSON.parse(JSON.stringify(newElements)));
    historyRef.current = truncatedHistory;
    historyIndexRef.current = truncatedHistory.length - 1;
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevElements = historyRef.current[historyIndexRef.current];
      setElements(JSON.parse(JSON.stringify(prevElements)));
      setSelectedElementId(null);
    } else if (historyIndexRef.current === 0) {
      historyIndexRef.current = -1;
      setElements([]);
      setSelectedElementId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextElements = historyRef.current[historyIndexRef.current];
      setElements(JSON.parse(JSON.stringify(nextElements)));
      setSelectedElementId(null);
    }
  };

  // --- Coordinates Transformation Helper ---
  const getCanvasCoords = (
    e:
      | PointerEvent
      | React.PointerEvent<HTMLCanvasElement>
      | MouseEvent
      | React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, clientX: 0, clientY: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = (clientX - panX) / zoom;
    const y = (clientY - panY) / zoom;
    return { x, y, clientX, clientY };
  };

  // --- Image Cache Handler ---
  const getCachedImage = (src: string, onLoad: () => void): HTMLImageElement | null => {
    let img = imageCacheRef.current.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      img.onload = () => {
        onLoad();
      };
      imageCacheRef.current.set(src, img);
    }
    return img.complete ? img : null;
  };

  // --- Render Loop (requestAnimationFrame) ---
  const requestRepaint = () => {
    if (animationFrameIdRef.current) return;
    animationFrameIdRef.current = requestAnimationFrame(() => {
      animationFrameIdRef.current = null;
      render();
    });
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Clear Canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw grid background
    drawGrid(ctx, width, height);

    // Apply viewport scale and translate
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Render elements
    for (const el of elements) {
      drawElement(ctx, el);
    }

    // Render current preview element
    if (activeElementRef.current) {
      drawElement(ctx, activeElementRef.current);
    }

    // Render selection box
    if (selectedElementId && tool === "select") {
      const el = elements.find((e) => e.id === selectedElementId);
      if (el) {
        drawSelectionBox(ctx, el);
      }
    }

    ctx.restore();
  };

  // --- Draw Grid helper ---
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, width, height);

    if (!isInfinityMode) return;

    ctx.save();
    const gridSize = 30 * zoom;
    const startX = panX % gridSize;
    const startY = panY % gridSize;

    ctx.fillStyle = "#e5e7eb";
    const dotRadius = Math.max(0.7, 1 * zoom);

    for (let x = startX; x < width; x += gridSize) {
      for (let y = startY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  // --- Draw Element helper ---
  const drawElement = (ctx: CanvasRenderingContext2D, el: WhiteboardElement) => {
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color;
    ctx.lineWidth = el.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (el.type) {
      case "pen":
        if (el.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
        break;

      case "rectangle":
        ctx.strokeRect(el.x, el.y, el.width, el.height);
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.endX, el.endY);
        ctx.stroke();
        break;

      case "text":
        ctx.font = `${el.fontSize}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(el.text, el.x, el.y);
        break;

      case "image":
        const img = getCachedImage(el.src, requestRepaint);
        if (img) {
          ctx.drawImage(img, el.x, el.y, el.width, el.height);
        } else {
          // Placeholder outline if image is loading
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 1;
          ctx.strokeRect(el.x, el.y, el.width, el.height);
          ctx.font = "12px sans-serif";
          ctx.fillText("Loading Image...", el.x + 8, el.y + 16);
        }
        break;
    }
  };

  // --- Element Bounding Box Calculation ---
  const getElementBounds = (el: WhiteboardElement) => {
    switch (el.type) {
      case "pen":
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of el.points) {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };

      case "rectangle":
        const rx = Math.min(el.x, el.x + el.width);
        const ry = Math.min(el.y, el.y + el.height);
        const rw = Math.abs(el.width);
        const rh = Math.abs(el.height);
        return { x: rx, y: ry, width: rw, height: rh };

      case "circle":
        return {
          x: el.x - el.radius,
          y: el.y - el.radius,
          width: el.radius * 2,
          height: el.radius * 2
        };

      case "line":
        const lx = Math.min(el.x, el.endX);
        const ly = Math.min(el.y, el.endY);
        const lw = Math.abs(el.endX - el.x);
        const lh = Math.abs(el.endY - el.y);
        return { x: lx, y: ly, width: lw, height: lh };

      case "text":
        // Approximate sizing based on text length
        const canvas = canvasRef.current;
        let textWidth = el.text.length * (el.fontSize * 0.6);
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.save();
            ctx.font = `${el.fontSize}px sans-serif`;
            textWidth = ctx.measureText(el.text).width;
            ctx.restore();
          }
        }
        return { x: el.x, y: el.y, width: textWidth, height: el.fontSize * 1.2 };

      case "image":
        const ix = Math.min(el.x, el.x + el.width);
        const iy = Math.min(el.y, el.y + el.height);
        const iw = Math.abs(el.width);
        const ih = Math.abs(el.height);
        return { x: ix, y: iy, width: iw, height: ih };
    }
  };

  // --- Draw Selection Box & Handles ---
  const drawSelectionBox = (ctx: CanvasRenderingContext2D, el: WhiteboardElement) => {
    const bounds = getElementBounds(el);
    if (!bounds) return;

    const offset = 4;
    ctx.strokeStyle = "#6366f1"; // Indigo border
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(
      bounds.x - offset,
      bounds.y - offset,
      bounds.width + offset * 2,
      bounds.height + offset * 2
    );
    ctx.setLineDash([]); // Reset

    // Draw corner handles
    const handleSize = 6 / zoom;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 1.5 / zoom;

    const drawHandle = (x: number, y: number) => {
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    };

    if (el.type === "line") {
      drawHandle(el.x, el.y);
      drawHandle(el.endX, el.endY);
    } else {
      // Top-Left, Top-Right, Bottom-Left, Bottom-Right
      drawHandle(bounds.x - offset, bounds.y - offset);
      drawHandle(bounds.x + bounds.width + offset, bounds.y - offset);
      drawHandle(bounds.x - offset, bounds.y + bounds.height + offset);
      drawHandle(bounds.x + bounds.width + offset, bounds.y + bounds.height + offset);
    }
  };

  // --- Hit Testing: Which Element is Clicked ---
  const getElementAtCoords = (x: number, y: number): WhiteboardElement | null => {
    const threshold = 6 / zoom;

    // Check in reverse order so newer elements (drawn on top) are selected first
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      const bounds = getElementBounds(el);

      switch (el.type) {
        case "rectangle":
        case "image":
        case "text":
          if (
            x >= bounds.x &&
            x <= bounds.x + bounds.width &&
            y >= bounds.y &&
            y <= bounds.y + bounds.height
          ) {
            return el;
          }
          break;

        case "circle":
          const distToCenter = getDistance({ x, y }, { x: el.x, y: el.y });
          if (Math.abs(distToCenter - el.radius) <= threshold || distToCenter <= el.radius) {
            return el;
          }
          break;

        case "line":
          if (getDistanceToSegment(x, y, el.x, el.y, el.endX, el.endY) <= threshold) {
            return el;
          }
          break;

        case "pen":
          if (isPointNearPen(x, y, el.points, threshold)) {
            return el;
          }
          break;
      }
    }
    return null;
  };

  // --- Get Resize Handle under mouse coords ---
  const getResizeHandleAtCoords = (x: number, y: number, el: WhiteboardElement): string | null => {
    const threshold = 8 / zoom;
    const bounds = getElementBounds(el);
    const offset = 4;

    if (el.type === "line") {
      if (getDistance({ x, y }, { x: el.x, y: el.y }) <= threshold) return "start";
      if (getDistance({ x, y }, { x: el.endX, y: el.endY }) <= threshold) return "end";
      return null;
    }

    // Corner coordinates
    const tl = { x: bounds.x - offset, y: bounds.y - offset };
    const tr = { x: bounds.x + bounds.width + offset, y: bounds.y - offset };
    const bl = { x: bounds.x - offset, y: bounds.y + bounds.height + offset };
    const br = { x: bounds.x + bounds.width + offset, y: bounds.y + bounds.height + offset };

    if (getDistance({ x, y }, tl) <= threshold) return "tl";
    if (getDistance({ x, y }, tr) <= threshold) return "tr";
    if (getDistance({ x, y }, bl) <= threshold) return "bl";
    if (getDistance({ x, y }, br) <= threshold) return "br";

    return null;
  };

  // --- Pointer Actions Handlers ---
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // If text input is open, click outside commits text and closes input
    if (textInput) {
      commitText();
      return;
    }

    const { x, y, clientX, clientY } = getCanvasCoords(e);
    isDrawingRef.current = true;
    startCoordsRef.current = { x, y, clientX, clientY };

    // 1. Zoom/Pan Mode (Space pressed or middle mouse button)
    if (isSpacePressed || e.button === 1 || (tool === "select" && !isInfinityMode && e.button !== 0)) {
      panStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
      return;
    }

    const elementId = `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 2. Select / Transform Tool
    if (tool === "select") {
      if (selectedElementId) {
        const selectedEl = elements.find((el) => el.id === selectedElementId);
        if (selectedEl) {
          const handle = getResizeHandleAtCoords(x, y, selectedEl);
          if (handle) {
            resizeHandleRef.current = handle;
            resizeStartElementRef.current = JSON.parse(JSON.stringify(selectedEl));
            return;
          }
        }
      }

      const clickedEl = getElementAtCoords(x, y);
      if (clickedEl) {
        setSelectedElementId(clickedEl.id);
        dragStartElementsRef.current = JSON.parse(JSON.stringify(clickedEl));
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    // 3. Eraser Tool
    if (tool === "eraser") {
      eraseElementAt(x, y);
      return;
    }

    // 4. Text Tool
    if (tool === "text") {
      setTextInput({
        x,
        y,
        text: "",
        clientX: e.clientX,
        clientY: e.clientY
      });
      isDrawingRef.current = false;
      return;
    }

    // 5. Drawing Shapes / Pen
    const commonProps = {
      id: elementId,
      color,
      strokeWidth
    };

    let newElement: WhiteboardElement | null = null;

    if (tool === "pen") {
      currentPointsRef.current = [{ x, y }];
      newElement = {
        ...commonProps,
        type: "pen",
        x,
        y,
        points: [{ x, y }]
      };
    } else if (tool === "rectangle") {
      newElement = {
        ...commonProps,
        type: "rectangle",
        x,
        y,
        width: 0,
        height: 0
      };
    } else if (tool === "circle") {
      newElement = {
        ...commonProps,
        type: "circle",
        x,
        y,
        radius: 0
      };
    } else if (tool === "line") {
      newElement = {
        ...commonProps,
        type: "line",
        x,
        y,
        endX: x,
        endY: y
      };
    }

    if (newElement) {
      activeElementRef.current = newElement;
      requestRepaint();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) {
      // Cursor style updates on selection mode hover
      if (tool === "select" && selectedElementId) {
        const { x, y } = getCanvasCoords(e);
        const selectedEl = elements.find((el) => el.id === selectedElementId);
        if (selectedEl) {
          const handle = getResizeHandleAtCoords(x, y, selectedEl);
          const canvas = canvasRef.current;
          if (canvas) {
            if (handle === "tl" || handle === "br") canvas.style.cursor = "nwse-resize";
            else if (handle === "tr" || handle === "bl") canvas.style.cursor = "nesw-resize";
            else if (handle === "start" || handle === "end") canvas.style.cursor = "crosshair";
            else if (getElementAtCoords(x, y)) canvas.style.cursor = "move";
            else canvas.style.cursor = "default";
          }
        }
      }
      return;
    }

    const { x, y } = getCanvasCoords(e);

    // Pan Mode
    if (isSpacePressed || e.buttons === 4) {
      setPanX(e.clientX - panStartRef.current.x);
      setPanY(e.clientY - panStartRef.current.y);
      return;
    }

    // Eraser drag delete
    if (tool === "eraser") {
      eraseElementAt(x, y);
      return;
    }

    // Resize Mode
    if (tool === "select" && resizeHandleRef.current && resizeStartElementRef.current) {
      const startEl = resizeStartElementRef.current;
      const startC = startCoordsRef.current;
      const dx = x - startC.x;
      const dy = y - startC.y;

      const updatedElements = elements.map((el) => {
        if (el.id !== selectedElementId) return el;

        if (el.type === "line" && startEl.type === "line") {
          if (resizeHandleRef.current === "start") {
            return { ...el, x, y };
          } else {
            return { ...el, endX: x, endY: y };
          }
        }

        if (el.type === "rectangle" && startEl.type === "rectangle") {
          let rx = startEl.x;
          let ry = startEl.y;
          let rw = startEl.width;
          let rh = startEl.height;

          if (resizeHandleRef.current === "br") {
            rw = startEl.width + dx;
            rh = startEl.height + dy;
          } else if (resizeHandleRef.current === "tl") {
            rx = startEl.x + dx;
            ry = startEl.y + dy;
            rw = startEl.width - dx;
            rh = startEl.height - dy;
          } else if (resizeHandleRef.current === "tr") {
            ry = startEl.y + dy;
            rw = startEl.width + dx;
            rh = startEl.height - dy;
          } else if (resizeHandleRef.current === "bl") {
            rx = startEl.x + dx;
            rw = startEl.width - dx;
            rh = startEl.height + dy;
          }
          return { ...el, x: rx, y: ry, width: rw, height: rh };
        }

        if (el.type === "image" && startEl.type === "image") {
          let ix = startEl.x;
          let iy = startEl.y;
          let iw = startEl.width;
          let ih = startEl.height;

          if (resizeHandleRef.current === "br") {
            iw = startEl.width + dx;
            ih = startEl.height + dy;
          } else if (resizeHandleRef.current === "tl") {
            ix = startEl.x + dx;
            iy = startEl.y + dy;
            iw = startEl.width - dx;
            ih = startEl.height - dy;
          } else if (resizeHandleRef.current === "tr") {
            iy = startEl.y + dy;
            iw = startEl.width + dx;
            ih = startEl.height - dy;
          } else if (resizeHandleRef.current === "bl") {
            ix = startEl.x + dx;
            iw = startEl.width - dx;
            ih = startEl.height + dy;
          }
          return { ...el, x: ix, y: iy, width: iw, height: ih };
        }

        if (el.type === "circle" && startEl.type === "circle") {
          // Circular scale from center: radius is distance to mouse
          const r = getDistance({ x: startEl.x, y: startEl.y }, { x, y });
          return { ...el, radius: r };
        }

        if (el.type === "pen" && startEl.type === "pen") {
          // Bounding-box based scale of multiple points
          const origBounds = getElementBounds(startEl);
          if (origBounds.width === 0 || origBounds.height === 0) return el;

          let newW = origBounds.width;
          let newH = origBounds.height;
          let newX = origBounds.x;
          let newY = origBounds.y;

          if (resizeHandleRef.current === "br") {
            newW = origBounds.width + dx;
            newH = origBounds.height + dy;
          } else if (resizeHandleRef.current === "tl") {
            newX = origBounds.x + dx;
            newY = origBounds.y + dy;
            newW = origBounds.width - dx;
            newH = origBounds.height - dy;
          } else if (resizeHandleRef.current === "tr") {
            newY = origBounds.y + dy;
            newW = origBounds.width + dx;
            newH = origBounds.height - dy;
          } else if (resizeHandleRef.current === "bl") {
            newX = origBounds.x + dx;
            newW = origBounds.width - dx;
            newH = origBounds.height + dy;
          }

          if (newW <= 0) newW = 1;
          if (newH <= 0) newH = 1;

          const scaleX = newW / origBounds.width;
          const scaleY = newH / origBounds.height;

          const newPoints = startEl.points.map((p) => ({
            x: newX + (p.x - origBounds.x) * scaleX,
            y: newY + (p.y - origBounds.y) * scaleY
          }));

          return { ...el, points: newPoints };
        }

        return el;
      });

      setElements(updatedElements);
      requestRepaint();
      return;
    }

    // Drag / Move Mode
    if (tool === "select" && dragStartElementsRef.current && selectedElementId) {
      const startEl = dragStartElementsRef.current;
      const startC = startCoordsRef.current;
      const dx = x - startC.x;
      const dy = y - startC.y;

      const updatedElements = elements.map((el) => {
        if (el.id !== selectedElementId) return el;

        if (el.type === "pen" && startEl.type === "pen") {
          const points = startEl.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
          return { ...el, points };
        } else if (el.type === "line" && startEl.type === "line") {
          return { ...el, x: startEl.x + dx, y: startEl.y + dy, endX: startEl.endX + dx, endY: startEl.endY + dy };
        } else {
          return { ...el, x: startEl.x + dx, y: startEl.y + dy };
        }
      });

      setElements(updatedElements);
      requestRepaint();
      return;
    }

    // Drawing Active element
    if (activeElementRef.current) {
      const el = activeElementRef.current;
      const startC = startCoordsRef.current;

      if (el.type === "pen") {
        currentPointsRef.current.push({ x, y });
        activeElementRef.current = {
          ...el,
          points: [...currentPointsRef.current]
        };
      } else if (el.type === "rectangle") {
        activeElementRef.current = {
          ...el,
          width: x - startC.x,
          height: y - startC.y
        };
      } else if (el.type === "circle") {
        const radius = getDistance({ x: el.x, y: el.y }, { x, y });
        activeElementRef.current = { ...el, radius };
      } else if (el.type === "line") {
        activeElementRef.current = { ...el, endX: x, endY: y };
      }

      requestRepaint();
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;

    // Reset cursor style
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = "default";

    // End resize operations
    if (resizeHandleRef.current) {
      resizeHandleRef.current = null;
      resizeStartElementRef.current = null;
      saveHistory(elements);
      return;
    }

    // End drag operations
    if (dragStartElementsRef.current) {
      dragStartElementsRef.current = null;
      saveHistory(elements);
      return;
    }

    // Save newly drawn element
    if (activeElementRef.current) {
      let finalElement = activeElementRef.current;

      // Clean up drawing rectangle negative values
      if (finalElement.type === "rectangle") {
        const bounds = getElementBounds(finalElement);
        finalElement = {
          ...finalElement,
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height
        };
      }

      const nextElements = [...elements, finalElement];
      setElements(nextElements);
      saveHistory(nextElements);
      activeElementRef.current = null;
      requestRepaint();
    }
  };

  // --- Zoom logic (Pinch/Scroll) ---
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!isInfinityMode) return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Canvas points relative to current zoom/pan
    const canvasX = (mouseX - panX) / zoom;
    const canvasY = (mouseY - panY) / zoom;

    const zoomFactor = 1.1;
    let newZoom = zoom;

    if (e.deltaY < 0) {
      newZoom = Math.min(zoom * zoomFactor, 10);
    } else {
      newZoom = Math.max(zoom / zoomFactor, 0.1);
    }

    // Adjust pan offsets to keep zoom centered on mouse
    const newPanX = mouseX - canvasX * newZoom;
    const newPanY = mouseY - canvasY * newZoom;

    setZoom(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  // --- Double-Click handler (Edit existing text or create) ---
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "select") return;
    const { x, y } = getCanvasCoords(e);
    const clickedEl = getElementAtCoords(x, y);

    if (clickedEl && clickedEl.type === "text") {
      setTextInput({
        x: clickedEl.x,
        y: clickedEl.y,
        text: clickedEl.text,
        clientX: e.clientX - canvasRef.current!.getBoundingClientRect().left,
        clientY: e.clientY - canvasRef.current!.getBoundingClientRect().top,
        elementId: clickedEl.id
      });
    }
  };

  // --- Inline Text Editor Commit ---
  const commitText = () => {
    if (!textInput) return;

    if (textInput.text.trim() === "") {
      // Remove text element if empty
      if (textInput.elementId) {
        const nextElements = elements.filter((el) => el.id !== textInput.elementId);
        setElements(nextElements);
        saveHistory(nextElements);
      }
    } else {
      if (textInput.elementId) {
        // Edit existing
        const nextElements = elements.map((el) => {
          if (el.id === textInput.elementId && el.type === "text") {
            return { ...el, text: textInput.text };
          }
          return el;
        });
        setElements(nextElements);
        saveHistory(nextElements);
      } else {
        // Create new
        const newText: TextElement = {
          id: `el_${Date.now()}`,
          type: "text",
          x: textInput.x,
          y: textInput.y,
          text: textInput.text,
          color,
          strokeWidth: 1,
          fontSize
        };
        const nextElements = [...elements, newText];
        setElements(nextElements);
        saveHistory(nextElements);
      }
    }
    setTextInput(null);
    setSelectedElementId(null);
  };

  // --- Delete selected Element ---
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    const nextElements = elements.filter((el) => el.id !== selectedElementId);
    setElements(nextElements);
    saveHistory(nextElements);
    setSelectedElementId(null);
  };

  // --- Erase logic ---
  const eraseElementAt = (x: number, y: number) => {
    const el = getElementAtCoords(x, y);
    if (el) {
      const nextElements = elements.filter((e) => e.id !== el.id);
      setElements(nextElements);
      saveHistory(nextElements);
      if (selectedElementId === el.id) {
        setSelectedElementId(null);
      }
    }
  };

  // --- Clear Board ---
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the entire whiteboard?")) {
      setElements([]);
      saveHistory([]);
      setSelectedElementId(null);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
  };

  // --- Image File Upload ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = canvasRef.current;
        let x = 100;
        let y = 100;
        if (canvas) {
          // Put image at the center of viewport
          const width = canvas.width / (window.devicePixelRatio || 1);
          const height = canvas.height / (window.devicePixelRatio || 1);
          x = (width / 2 - panX) / zoom - img.width / 4;
          y = (height / 2 - panY) / zoom - img.height / 4;
        }

        const newImageEl: ImageElement = {
          id: `el_${Date.now()}`,
          type: "image",
          x,
          y,
          width: img.width / 2 || 200,
          height: img.height / 2 || 200,
          src,
          color: "",
          strokeWidth: 0
        };

        const nextElements = [...elements, newImageEl];
        setElements(nextElements);
        saveHistory(nextElements);
        setSelectedElementId(newImageEl.id);
        setTool("select");
      };
    };
    reader.readAsDataURL(file);
  };

  // --- Export/Download Board as Image ---
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create virtual canvas at high resolution (double size of current canvas)
    const exportCanvas = document.createElement("canvas");
    const bounds = elements.length > 0 
      ? elements.reduce((acc, el) => {
          const b = getElementBounds(el);
          return {
            minX: Math.min(acc.minX, b.x),
            minY: Math.min(acc.minY, b.y),
            maxX: Math.max(acc.maxX, b.x + b.width),
            maxY: Math.max(acc.maxY, b.y + b.height)
          };
        }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })
      : { minX: -100, minY: -100, maxX: 100, maxY: 100 };

    // Pad drawing bounds
    const padding = 40;
    const drawWidth = bounds.maxX - bounds.minX + padding * 2;
    const drawHeight = bounds.maxY - bounds.minY + padding * 2;

    exportCanvas.width = drawWidth * 2; // High-res multiplier
    exportCanvas.height = drawHeight * 2;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.scale(2, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, drawWidth, drawHeight);

    // Apply translations relative to bounds
    ctx.translate(-bounds.minX + padding, -bounds.minY + padding);

    // Draw elements
    for (const el of elements) {
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (el.type) {
        case "pen":
          if (el.points.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i].x, el.points[i].y);
          }
          ctx.stroke();
          break;

        case "rectangle":
          ctx.strokeRect(el.x, el.y, el.width, el.height);
          break;

        case "circle":
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case "line":
          ctx.beginPath();
          ctx.moveTo(el.x, el.y);
          ctx.lineTo(el.endX, el.endY);
          ctx.stroke();
          break;

        case "text":
          ctx.font = `${el.fontSize}px sans-serif`;
          ctx.textBaseline = "top";
          ctx.fillText(el.text, el.x, el.y);
          break;

        case "image":
          const img = imageCacheRef.current.get(el.src);
          if (img && img.complete) {
            ctx.drawImage(img, el.x, el.y, el.width, el.height);
          }
          break;
      }
    }

    // Trigger Download
    const dataURL = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Trigger file input dialog
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // --- Zoom In/Out Buttons ---
  const zoomIn = () => setZoom((z) => Math.min(z * 1.2, 8));
  const zoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.15));
  const resetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="flex-1 relative bg-gray-50 flex flex-col overflow-hidden select-none">
      
      {/* --- Sub-Toolbar (Top Actions Bar) --- */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-4 flex justify-between items-center z-10 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* History Controls */}
          <button
            onClick={handleUndo}
            disabled={historyIndexRef.current < 0}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndexRef.current >= historyRef.current.length - 1}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1"></div>

          {/* Quick Clear */}
          <button
            onClick={handleClear}
            disabled={elements.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-all"
            title="Clear Board"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Board</span>
          </button>
        </div>

        {/* Board Title & Modes */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700">
            Interactive Board Mode
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Buttons */}
          <button
            onClick={zoomOut}
            disabled={!isInfinityMode}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all disabled:opacity-30"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-gray-500 w-12 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={!isInfinityMode}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all disabled:opacity-30"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            disabled={!isInfinityMode && zoom === 1 && panX === 0 && panY === 0}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all disabled:opacity-30"
            title="Reset Zoom"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1"></div>

          {/* Infinity Mode Toggle */}
          <button
            onClick={() => {
              setIsInfinityMode(!isInfinityMode);
              if (isInfinityMode) resetZoom();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm border transition-all ${
              isInfinityMode
                ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
            title="Toggle Pan & Zoom Background Grid"
          >
            <InfinityIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Infinity Mode</span>
          </button>
        </div>
      </div>

      {/* --- Main Interactive Area --- */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden outline-none touch-none"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          className="absolute inset-0 block touch-none"
        />

        {/* --- Floating Tools Toolbar (Left) --- */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1.5 z-20 transition-all duration-300">
          {[
            { id: "select", icon: MousePointer2, label: "Select (V)" },
            { id: "pen", icon: PenTool, label: "Draw (P)" },
            { id: "eraser", icon: Eraser, label: "Erase (E)" },
            { id: "rectangle", icon: Square, label: "Rectangle" },
            { id: "circle", icon: Circle, label: "Circle" },
            { id: "line", icon: Ruler, label: "Line / Ruler" },
            { id: "text", icon: Type, label: "Text (T)" }
          ].map((toolItem) => {
            const Icon = toolItem.icon;
            const isActive = tool === toolItem.id;
            return (
              <button
                key={toolItem.id}
                onClick={() => {
                  setTool(toolItem.id as ToolType);
                  setSelectedElementId(null);
                }}
                className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center relative group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={toolItem.label}
              >
                <Icon className="w-5 h-5" />
                {/* Tooltip */}
                <div className="absolute left-14 hidden group-hover:block bg-gray-900 text-white text-xs font-semibold px-2 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-md">
                  {toolItem.label}
                </div>
              </button>
            );
          })}

          <div className="w-full h-px bg-gray-100 my-1"></div>

          {/* Add Image Button */}
          <button
            onClick={triggerImageUpload}
            className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center relative group"
            title="Upload Image"
          >
            <ImageIcon className="w-5 h-5" />
            <div className="absolute left-14 hidden group-hover:block bg-gray-900 text-white text-xs font-semibold px-2 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-md">
              Upload Image
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* --- Inline Textarea Overlay (Visible when typing) --- */}
        {textInput && (
          <textarea
            autoFocus
            value={textInput.text}
            onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
            onBlur={commitText}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                commitText();
              }
              if (e.key === "Escape") {
                commitText();
              }
            }}
            style={{
              position: "absolute",
              left: `${textInput.clientX}px`,
              top: `${textInput.clientY}px`,
              font: `${fontSize}px sans-serif`,
              color: color,
              background: "transparent",
              border: "1px dashed #6366f1",
              outline: "none",
              resize: "both",
              margin: 0,
              padding: 0,
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              minWidth: "150px",
              zIndex: 30
            }}
          />
        )}

        {/* --- Spacebar / Drag instruction bar --- */}
        {isSpacePressed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full pointer-events-none transition-all shadow-md z-30">
            Panning mode enabled. Click & drag to pan around.
          </div>
        )}
      </div>

      {/* --- Footer Customizer & Export Bar --- */}
      <div className="bg-white border-t border-gray-200 py-3 px-6 flex flex-wrap gap-4 items-center justify-between z-10 shadow-sm">
        {/* Colors Selection */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Palette:
          </span>
          <div className="flex items-center gap-2">
            {[
              { hex: "#1e293b", name: "Charcoal" }, // Charcoal
              { hex: "#ef4444", name: "Crimson" }, // Red
              { hex: "#3b82f6", name: "Sky Blue" }, // Blue
              { hex: "#10b981", name: "Emerald" }, // Green
              { hex: "#8b5cf6", name: "Purple" }, // Violet
              { hex: "#f97316", name: "Orange" } // Orange
            ].map((colorItem) => (
              <button
                key={colorItem.hex}
                onClick={() => setColor(colorItem.hex)}
                className={`w-7 h-7 rounded-full shadow-inner border transition-all duration-200 relative ${
                  color === colorItem.hex
                    ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                    : "hover:scale-105 border-gray-200"
                }`}
                style={{ backgroundColor: colorItem.hex }}
                title={colorItem.name}
              />
            ))}
          </div>
        </div>

        {/* Stroke / Text Size Controls */}
        <div className="flex items-center gap-6">
          {/* Stroke Selector (Visible for drawing/shapes) */}
          {tool !== "text" && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Stroke:
              </span>
              <div className="flex items-center bg-gray-100 p-1 rounded-lg gap-1">
                {[
                  { value: 2, label: "Thin" },
                  { value: 5, label: "Medium" },
                  { value: 10, label: "Thick" }
                ].map((strokeOpt) => (
                  <button
                    key={strokeOpt.value}
                    onClick={() => setStrokeWidth(strokeOpt.value)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      strokeWidth === strokeOpt.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {strokeOpt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text Font Size Selector */}
          {tool === "text" && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Font Size:
              </span>
              <div className="flex items-center bg-gray-100 p-1 rounded-lg gap-1">
                {[
                  { value: 16, label: "S" },
                  { value: 24, label: "M" },
                  { value: 36, label: "L" },
                  { value: 48, label: "XL" }
                ].map((sizeOpt) => (
                  <button
                    key={sizeOpt.value}
                    onClick={() => setFontSize(sizeOpt.value)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      fontSize === sizeOpt.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {sizeOpt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download/Export Element */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all"
          title="Save drawing as PNG image"
        >
          <Download className="w-4 h-4" />
          Export Drawing
        </button>
      </div>

    </div>
  );
}
