"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import SEOAuthorityLinks from "@/components/SEOAuthorityLinks";
import { 
  ArrowLeft, 
  Wand2, 
  Settings, 
  Loader2,
  Info,
  Network,
  Activity,
  Zap,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MindMapNode {
  id: string;
  name: string;
  
  cx: number;
  cy: number;
  color: string;
  glowColor: string;
  subtopics: string[];
  
  description: string;
  
}

interface MindMapData {
  topic: string;
  
  nodes: MindMapNode[];
}

const lifeProcessesMap: MindMapData = {
  topic: "Life Processes",
  
  nodes: [
    {
      id: "nutrition",
      name: "Nutrition",
      cx: 80,
      cy: 100,
      color: "#258088", // Teal
      glowColor: "rgba(37, 128, 136, 0.2)",
      subtopics: [
        "Autotrophic (Chloroplasts, Stomata)",
        "Heterotrophic (Amoeba feeding)",
        "Human Digestive System & Enzymes",
        "Limiting factors of Photosynthesis"
      ],
      
      description: "How organisms obtain and utilize nutrients to generate glucose and structural raw materials.",
      
    },
    {
      id: "respiration",
      name: "Respiration",
      cx: 320,
      cy: 100,
      color: "#D95B2A", // Orange
      glowColor: "rgba(217, 91, 42, 0.2)",
      subtopics: [
        "Aerobic (with O₂ in Mitochondria)",
        "Anaerobic (without O₂ in yeast/muscles)",
        "Human Alveoli exchange process",
        "Cellular energy currency (ATP)"
      ],
      
      description: "The biochemical oxidation of glucose to release vital cellular energy in the form of ATP.",
      
    },
    {
      id: "transportation",
      name: "Transportation",
      cx: 80,
      cy: 300,
      color: "#6A8146", // Olive
      glowColor: "rgba(106, 129, 70, 0.2)",
      subtopics: [
        "Human Heart: 4 chambers",
        "Double circulation (Pulmonary/Systemic)",
        "Blood vessels (Arteries vs Veins)",
        "Xylem water & Phloem food transport"
      ],
      
      description: "The systemic circulation of blood, oxygen, and nutrients in humans and vascular sap in plants.",
      
    },
    {
      id: "excretion",
      name: "Excretion",
      cx: 320,
      cy: 300,
      color: "#D97706", // Amber
      glowColor: "rgba(217, 119, 6, 0.2)",
      subtopics: [
        "Human Urinary system components",
        "Nephron: Bowman's capsule & tubules",
        "Selective reabsorption of water/salts",
        "Plant excretory waste release methods"
      ],
      
      description: "Filtration and removal of toxic nitrogenous waste products from the living organism's blood system.",
      
    }
  ]
};

const chemicalReactionsMap: MindMapData = {
  topic: "Chemical Reactions",
  
  nodes: [
    {
      id: "types",
      name: "Types of Reactions",
      cx: 80,
      cy: 100,
      color: "#258088", // Teal
      glowColor: "rgba(37, 128, 136, 0.2)",
      subtopics: [
        "Combination (A + B -> AB)",
        "Decomposition (Thermal, Electrolytic)",
        "Displacement (Activity series rules)",
        "Double Displacement (Precipitation)"
      ],
      
      description: "The primary categories of chemical changes classified by atomic rearrangements.",
      
    },
    {
      id: "redox",
      name: "Redox Reactions",
      cx: 320,
      cy: 100,
      color: "#D95B2A", // Orange
      glowColor: "rgba(217, 91, 42, 0.2)",
      subtopics: [
        "Oxidation (Gain of O₂ / Loss of H₂)",
        "Reduction (Loss of O₂ / Gain of H₂)",
        "Reducing Agents & Oxidizing Agents",
        "Simultaneous oxidation/reduction"
      ],
      
      description: "Reactions that involve a transfer of oxygen atoms or electrons between chemical species.",
      
    },
    {
      id: "equations",
      name: "Equations",
      cx: 80,
      cy: 300,
      color: "#6A8146", // Olive
      glowColor: "rgba(106, 129, 70, 0.2)",
      subtopics: [
        "Reactants vs Products notation",
        "Skeletal chemical equations",
        "Balancing (Hit-and-trial method)",
        "Law of Conservation of Mass"
      ],
      
      description: "Symbolic representations of chemical reactions indicating chemical formulas and conservation of atoms.",
      
    },
    {
      id: "effects",
      name: "Daily Life Effects",
      cx: 320,
      cy: 300,
      color: "#D97706", // Amber
      glowColor: "rgba(217, 119, 6, 0.2)",
      subtopics: [
        "Corrosion of metals (Rusting of iron)",
        "Rancidification of fatty foods",
        "Prevention: Galvanization & Painting",
        "Antioxidants & Nitrogen purging"
      ],
      
      description: "How slow oxidation processes impact metal infrastructures and degradation of food items.",
      
    }
  ]
};

export default function MindMapsPage() {
  const locale = useLocale();
  const isHi = locale === "hi";

  // Sidebar parameters
  const [subject, setSubject] = useState("science");
  const [chapter, setChapter] = useState("life-processes");
  const [loading, setLoading] = useState(false);

  // Active mind map data
  const [activeMap, setActiveMap] = useState<MindMapData>(lifeProcessesMap);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("nutrition");

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (chapter === "chemical-reactions") {
        setActiveMap(chemicalReactionsMap);
        setSelectedNodeId("types");
      } else {
        setActiveMap(lifeProcessesMap);
        setSelectedNodeId("nutrition");
      }
    }, 1200);
  };

  const selectedNode = activeMap.nodes.find(n => n.id === selectedNodeId) || activeMap.nodes[0];

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#1C2B1C] font-sans pb-20">
      
      {/* Top Banner */}
      <div className="max-w-[1200px] mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#166534] hover:underline font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> 
          {"Back to Home"}
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-[900px] mx-auto px-4 py-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#166534]/5 border border-[#166534]/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#166534] uppercase tracking-wider">
          <Network className="w-4 h-4 text-emerald-600 animate-pulse-slow" /> NCERT Concept Cartography
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#166534] leading-tight">
          {isHi ? "TeacherSathi NCERT विज़ुअल माइंड मैप्स" : "TeacherSathi NCERT Visual Mind Maps"}
        </h1>
        <p className="text-lg text-[#3C4B3A]/80 max-w-2xl mx-auto leading-relaxed">
          {isHi 
            ? "जटिल विज्ञान और गणितीय सूत्रों को सुंदर दृश्य रूपरेखा में तोड़ें। भारतीय सरकारी स्कूलों के शिक्षकों के लिए स्मार्ट स्क्रीन पर अध्यापन और त्वरित दोहराव हेतु सर्वोत्तम।"
            : "Synthesize complex CBSE and NCERT Science and Math concepts into visual mind maps. Built for Indian government school teachers for quick class revision and interactive smart boards."}
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-4 bg-white border border-[#DCE4D7] rounded-3xl p-6 shadow-sm h-fit space-y-6">
          <h2 className="text-base font-bold text-[#1C2B1C] border-b border-[#DCE4D7] pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#166534]" />
            {"Map Cartography Settings"}
          </h2>

          {/* Subject Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5E6C5A] block">
              {"Subject"}
            </label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#EEF2EA]/60 border border-[#DCE4D7] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#166534] text-ink"
            >
              <option value="science">Science / विज्ञान</option>
              <option value="maths">Mathematics / गणित</option>
              <option value="social">Social Science / सामाजिक विज्ञान</option>
            </select>
          </div>

          {/* Chapter Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5E6C5A] block">
              {"Chapter"}
            </label>
            <select 
              value={chapter} 
              onChange={(e) => setChapter(e.target.value)}
              className="w-full bg-[#EEF2EA]/60 border border-[#DCE4D7] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#166534] text-ink"
            >
              {subject === "science" ? (
                <>
                  <option value="life-processes">Life Processes / जैव प्रक्रम</option>
                  <option value="chemical-reactions">Chemical Reactions / रासायनिक अभिक्रियाएं</option>
                </>
              ) : (
                <>
                  <option value="real-numbers">Real Numbers / वास्तविक संख्याएँ</option>
                </>
              )}
            </select>
          </div>

          <Button 
            className="w-full bg-[#16A34A] hover:bg-[#128A3E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {"Saathi AI plotting..."}
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                {"Render Concept Map"}
              </>
            )}
          </Button>
        </div>

        {/* Interactive SVG Display & Detail Card Panel */}
        <div className="lg:col-span-8 bg-white border border-[#DCE4D7] rounded-3xl p-8 shadow-card flex flex-col justify-between min-h-[500px] relative overflow-hidden">
          
          {loading && (
            <div className="absolute inset-0 bg-[#F7F9F4]/75 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
              <p className="text-sm font-bold text-brand animate-pulse">
                {"Assembling nodes & schematic vector paths..."}
              </p>
            </div>
          )}

          {/* Core Explorer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
            
            {/* Left Portion: Interactive SVG Canvas */}
            <div className="md:col-span-7 flex flex-col items-center justify-center relative bg-[#EEF2EA]/40 rounded-2xl border border-[#DCE4D7] p-4">
              
              <svg 
                viewBox="0 0 400 400" 
                className="w-full max-w-[340px] aspect-square overflow-visible"
              >
                {/* SVG Connecting Paths with curves (Bezier) */}
                {activeMap.nodes.map((n) => {
                  const isSelected = selectedNodeId === n.id;
                  return (
                    <path
                      key={`path-${n.id}`}
                      d={`M 200,200 Q ${n.cx > 200 ? 200 : 200},${n.cy > 200 ? n.cy : n.cy} ${n.cx},${n.cy}`}
                      fill="none"
                      stroke={isSelected ? n.color : "#cbd5e1"}
                      strokeWidth={isSelected ? 4 : 2}
                      strokeDasharray={isSelected ? "none" : "4 4"}
                      className="transition-all duration-300 ease-out"
                    />
                  );
                })}

                {/* Central Parent Node */}
                <circle 
                  cx={200} 
                  cy={200} 
                  r={32} 
                  fill="#166534" 
                  stroke="#ffffff" 
                  strokeWidth={3} 
                  className="shadow-md"
                />
                <text
                  x={200}
                  y={203}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isHi ? 9 : 10}
                  fontWeight="black"
                  className="pointer-events-none select-none font-sans"
                >
                  {activeMap.topic}
                </text>

                {/* Surrounding Child Nodes */}
                {activeMap.nodes.map((n) => {
                  const isSelected = selectedNodeId === n.id;
                  return (
                    <g 
                      key={n.id} 
                      onClick={() => setSelectedNodeId(n.id)}
                      className="cursor-pointer group"
                    >
                      {/* Outer Glow Ring if selected */}
                      {isSelected && (
                        <circle
                          cx={n.cx}
                          cy={n.cy}
                          r={38}
                          fill="none"
                          stroke={n.color}
                          strokeWidth={2}
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={24}
                        fill={isSelected ? n.color : "#ffffff"}
                        stroke={n.color}
                        strokeWidth={3}
                        className="transition-all duration-300 ease-out group-hover:scale-110"
                      />

                      {/* Tag Label Box */}
                      <rect
                        x={n.cx - 50}
                        y={n.cy + 30}
                        width={100}
                        height={18}
                        rx={6}
                        fill={isSelected ? "#1C2B1C" : "#ffffff"}
                        stroke={n.color}
                        strokeWidth={1.5}
                        className="transition-all duration-300"
                      />

                      {/* Label Text */}
                      <text
                        x={n.cx}
                        y={n.cy + 42}
                        textAnchor="middle"
                        fill={isSelected ? "#ffffff" : "#1C2B1C"}
                        fontSize={8}
                        fontWeight="bold"
                        className="pointer-events-none select-none font-sans"
                      >
                        {n.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <span className="text-[10px] font-bold text-[#5E6C5A] uppercase tracking-wider mt-4 animate-pulse">
                {"📚 Click a branch node to drill down details"}
              </span>

            </div>

            {/* Right Portion: Detailed Dynamic branch content */}
            <div className="md:col-span-5 space-y-5 animate-fadeIn">
              
              {/* Branch Header */}
              <div className="flex items-center gap-3 border-b border-[#DCE4D7] pb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-brand">
                    {selectedNode.name}
                  </h4>
                  <span className="text-[10px] text-[#5E6C5A] uppercase tracking-widest font-bold">
                    Class 10 Core Node
                  </span>
                </div>
              </div>

              {/* Branch Description */}
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Summary Focus
                </h5>
                <p className="text-sm text-ink-2 font-semibold leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Subtopic Checklist */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Syllabus Anchors
                </h5>
                <div className="space-y-2">
                  {selectedNode.subtopics.map((sub, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs bg-[#EEF2EA]/40 border border-[#DCE4D7] p-2.5 rounded-xl shadow-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-ink-2">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Actions banner */}
          <div className="mt-8 pt-6 border-t border-[#DCE4D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-[#5E6C5A] font-semibold">
              * Fully compatible with standard drawing tablets & stylus tools.
            </span>
            <Link 
              href="/signup" 
              className="bg-[#16A34A] hover:bg-[#128A3E] text-white text-sm font-bold text-center px-6 py-2.5 rounded-xl shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {"Export High-Res Vector"}
            </Link>
          </div>

        </div>

      </section>

      {/* Feature Grid Details */}
      <section className="max-w-[900px] mx-auto px-4 mt-20 space-y-8">
        <h2 className="text-2xl font-black text-center text-[#166534]">
          {"Optimized for High-Impact Classrooms"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-[#DCE4D7] rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-base text-[#1C2B1C]">
              {"Stylus & Smart Board Compatible"}
            </h3>
            <p className="text-sm text-[#5E6C5A] leading-relaxed">
              {isHi 
                ? "हमारे माइंड मैप्स बड़े डिस्प्ले पर ड्रा करने, ज़ूम करने और स्टायलस पेन से नोट्स लिखने के लिए पूरी तरह से प्रतिक्रियाशील हैं।"
                : "Optimized for interactive screen overlays. Write directly onto the node paths using board pen systems or project to screens cleanly."}
            </p>
          </div>
          <div className="bg-white border border-[#DCE4D7] rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-base text-[#1C2B1C]">
              {"Bilingual Nodes Switching"}
            </h3>
            <p className="text-sm text-[#5E6C5A] leading-relaxed">
              {isHi 
                ? "बिना किसी विकृति के सभी वैज्ञानिक शब्दावली को तुरंत हिंदी और अंग्रेज़ी अनुवाद में टॉगल करें।"
                : "Toggle advanced scientific terminology between Hindi (with Devnagari annotations) and English instantly for multilingual classrooms."}
            </p>
          </div>
        </div>
      </section>

      <SEOAuthorityLinks />
    </div>
  );
}
