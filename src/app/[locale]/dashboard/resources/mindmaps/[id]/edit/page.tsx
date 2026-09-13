"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Save, 
  GitBranch, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Sparkles
} from "lucide-react";
import type { MindMapContent, MindMapNode, MindMapEdge } from "@/lib/validations/resources";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MindMapEditorPage({ params }: PageProps) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [edges, setEdges] = useState<MindMapEdge[]>([]);
  const [centralNodeId, setCentralNodeId] = useState("node-root");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadMindMap = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mindmaps/${id}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        setTitle(data.title || "NCERT Concept Mind Map");
        const content = data.content as MindMapContent;
        if (content && content.nodes && content.nodes.length > 0) {
          setNodes(content.nodes);
          setEdges(content.edges || []);
          setCentralNodeId(content.central_node_id || content.nodes[0].id);
          setSelectedNodeId(content.central_node_id || content.nodes[0].id);
        } else {
          const root: MindMapNode = {
            id: "node-root",
            label: data.title || "Central Concept",
            type: "CONCEPT",
            color: "#059669",
          };
          setNodes([root]);
          setEdges([]);
          setCentralNodeId("node-root");
          setSelectedNodeId("node-root");
        }
      }
    } catch (err) {
      console.error("Failed to load mind map:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMindMap();
  }, [loadMindMap]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/mindmaps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: {
            title,
            central_node_id: centralNodeId,
            nodes,
            edges,
          },
          change_summary: `Updated mind map (${nodes.length} nodes, ${edges.length} edges)`,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save mind map.");
      }
    } catch {
      alert("Error saving mind map.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddChildNode = () => {
    if (!selectedNodeId) return;
    const newId = `node-${Date.now()}`;
    const newNode: MindMapNode = {
      id: newId,
      label: "New Sub-concept",
      type: "SUB_CONCEPT",
      parent_id: selectedNodeId,
      color: "#2563eb",
    };
    const newEdge: MindMapEdge = {
      id: `edge-${selectedNodeId}-${newId}`,
      source: selectedNodeId,
      target: newId,
      label: "relates to",
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === centralNodeId) {
      alert("Cannot delete the central root concept node.");
      return;
    }
    setNodes(nodes.filter((n) => n.id !== nodeId));
    setEdges(edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(centralNodeId);
  };

  const updateSelectedNode = (field: keyof MindMapNode, value: unknown) => {
    if (!selectedNodeId) return;
    setNodes(
      nodes.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n))
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Graph Validation: Disconnected / Orphan Nodes check
  const connectedNodeIds = new Set<string>();
  connectedNodeIds.add(centralNodeId);
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });
  const orphanNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));

  // Visual Layout calculations
  const width = 800;
  const height = 550;
  const cx = width / 2;
  const cy = height / 2;
  const nodePositions = new Map<string, { x: number; y: number }>();

  nodePositions.set(centralNodeId, { x: cx, y: cy });
  const otherNodes = nodes.filter((n) => n.id !== centralNodeId);
  const radius = 180;
  otherNodes.forEach((node, idx) => {
    const angle = (idx / Math.max(1, otherNodes.length)) * 2 * Math.PI;
    nodePositions.set(node.id, {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Mind Map Studio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/resources/${id}`}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-serif font-black text-lg text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-600 focus:outline-none px-1"
            />
            <span className="text-[11px] font-mono text-gray-400 block px-1">
              NCERT Concept Topology Studio • {nodes.length} Nodes • {edges.length} Connections
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/resources/${id}/export?format=svg`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-indigo-600" /> Export Vector SVG
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            {isSaving ? "Saving..." : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Mind Map
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Side: Interactive SVG Graph Canvas */}
        <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden p-6">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-w-4xl max-h-[600px] select-none"
          >
            {/* Edges */}
            {edges.map((edge) => {
              const p1 = nodePositions.get(edge.source);
              const p2 = nodePositions.get(edge.target);
              if (!p1 || !p2) return null;

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#475569"
                    strokeWidth="2.5"
                    strokeDasharray={edge.style === "DASHED" ? "6,6" : "0"}
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY - 6}
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions.get(node.id) || { x: cx, y: cy };
              const isCentral = node.id === centralNodeId;
              const isSelected = node.id === selectedNodeId;
              const r = isCentral ? 50 : 38;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle
                    r={r + 8}
                    fill={node.color || "#059669"}
                    opacity={isSelected ? 0.35 : 0.15}
                  />
                  <circle
                    r={r}
                    fill="#1e293b"
                    stroke={isSelected ? "#10b981" : node.color || "#059669"}
                    strokeWidth={isSelected ? 4 : 2}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize={isCentral ? 12 : 10}
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node.label.length > 16 ? node.label.slice(0, 14) + "..." : node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Overlay Controls */}
          <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 flex items-center gap-2 text-white text-xs font-mono">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>Click node to edit or branch</span>
          </div>
        </div>

        {/* Right Sidebar: Selected Node Inspector */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col justify-between overflow-y-auto flex-shrink-0 space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Node Inspector
              </span>
              {selectedNodeId !== centralNodeId && (
                <button
                  onClick={() => selectedNodeId && handleDeleteNode(selectedNodeId)}
                  className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete this node"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Node Label *
                  </label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => updateSelectedNode("label", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Concept Archetype
                  </label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) => updateSelectedNode("type", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="CONCEPT">Central Concept</option>
                    <option value="SUB_CONCEPT">Sub-Concept</option>
                    <option value="EXAMPLE">Practical Example</option>
                    <option value="QUESTION">Formative Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {["#059669", "#2563eb", "#d97706", "#dc2626", "#7c3aed"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateSelectedNode("color", color)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          selectedNode.color === color ? "scale-125 border-gray-900" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {orphanNodes.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                    <span>{orphanNodes.length} disconnected node(s) detected in graph.</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Select a concept node to view and edit properties.</p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleAddChildNode}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Add Branch Sub-concept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
