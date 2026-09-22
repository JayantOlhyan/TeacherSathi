"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { 
  X, 
  Tv, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Layers, 
  Clock, 
  Copy, 
  BookOpen
} from "lucide-react";
import type { StoredResourceItem } from "@/lib/services/recentResources";
import { isResourceSaved, toggleSaveResource, addRecentResource } from "@/lib/services/recentResources";

interface ResourcePreviewModalProps {
  resource: StoredResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResourcePreviewModal({ resource, isOpen, onClose }: ResourcePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "details" | "curriculum">("preview");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [saved, setSaved] = useState(() => (resource ? isResourceSaved(resource.id) : false));
  const [copied, setCopied] = useState(false);

  if (!isOpen || !resource) return null;

  // Track as recent resource on open
  addRecentResource(resource);

  const handleToggleSave = () => {
    const newState = toggleSaveResource(resource);
    setSaved(newState);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + (resource.previewUrl || `/dashboard/resources/${resource.id}`));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mock sample preview slides if none provided
  const sampleSlides = [
    {
      title: resource.title,
      subtitle: `${resource.gradeName || resource.grade} · ${resource.subjectName || resource.subject} · ${resource.chapterName || resource.chapter}`,
      bullets: [
        "Core Chapter Learning Goals and Standards",
        "Key scientific and mathematical principles with everyday examples",
        "Interactive Smartboard Inquiry Prompt for Class",
      ],
    },
    {
      title: "Foundations & Definition",
      subtitle: "Essential terminology and core mechanisms",
      bullets: [
        "Primary concept formulation from NCERT textbook",
        "Visual distinction between core elements and subsystems",
        "Indian agricultural and environmental context",
      ],
    },
    {
      title: "Classroom Discussion & Think-Pair-Share",
      subtitle: "Active learning checkpoint (5 minutes)",
      bullets: [
        "Pose inquiry: How does this principle apply to local scenarios?",
        "Turn to your bench partner and compare explanations",
        "One student from each row volunteers a summary point",
      ],
    },
    {
      title: "Summary & Homework Application",
      subtitle: "Key takeaways and next steps",
      bullets: [
        "Summary of core definitions and exam-important formulas",
        "NCERT textbook exercise practice assigned for homework",
        "Preview of upcoming laboratory activity and assessment",
      ],
    },
  ];

  const totalSlides = sampleSlides.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Resources
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-bold text-gray-500">Resource Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                saved
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5" />}
              {saved ? "Saved" : "Save"}
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Link Copied!" : "Share"}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gray-50/50">
          
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold uppercase tracking-wide">
                  {resource.typeLabel || resource.type}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Verified NCERT Aligned
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
              {resource.title}
            </h2>

            {resource.description && (
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                {resource.description}
              </p>
            )}

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-gray-600 border-t border-gray-100">
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{resource.gradeName || resource.grade}</span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{resource.subjectName || resource.subject}</span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{resource.chapterName || resource.chapter}</span>
              {resource.itemCount && (
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-gray-400" /> {resource.itemCount}
                </span>
              )}
              {resource.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> {resource.duration}
                </span>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("preview")}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === "preview"
                  ? "text-emerald-800 border-b-2 border-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Preview Content
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === "details"
                  ? "text-emerald-800 border-b-2 border-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Pedagogical Details
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === "curriculum"
                  ? "text-emerald-800 border-b-2 border-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Curriculum Alignment
            </button>
          </div>

          {/* Tab 1: Preview */}
          {activeTab === "preview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Thumbnail List */}
              <div className="space-y-3 order-2 md:order-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Slides Overview
                </span>
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {sampleSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        currentSlideIndex === idx
                          ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-black text-gray-400 mb-1">
                        <span>SLIDE {idx + 1}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{slide.title}</h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Slide Viewer */}
              <div className="md:col-span-3 order-1 md:order-2 space-y-4">
                <div className="aspect-video bg-gradient-to-br from-emerald-900 via-[#14532D] to-gray-900 rounded-2xl text-white p-8 sm:p-12 shadow-lg flex flex-col justify-between relative overflow-hidden border border-emerald-700/50">
                  <div className="relative z-10 space-y-3">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Slide {currentSlideIndex + 1} of {totalSlides}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
                      {sampleSlides[currentSlideIndex].title}
                    </h3>
                    {sampleSlides[currentSlideIndex].subtitle && (
                      <p className="text-emerald-100/90 text-sm font-medium">
                        {sampleSlides[currentSlideIndex].subtitle}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 space-y-2 bg-black/20 backdrop-blur-xs p-4 rounded-xl border border-white/10">
                    {sampleSlides[currentSlideIndex].bullets?.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/80 pt-4 border-t border-white/10">
                    <span>TeacherSathi Smart Classroom Engine</span>
                    <span>Class 8 Science · NCERT</span>
                  </div>
                </div>

                {/* Slide Navigation Controls */}
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs font-bold text-gray-600">
                    {currentSlideIndex + 1} / {totalSlides}
                  </span>
                  <button
                    disabled={currentSlideIndex === totalSlides - 1}
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Pedagogical Details */}
          {activeTab === "details" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  About this Resource
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  This presentation has been structured according to NCF guidelines to encourage inquiry-based learning in Indian classrooms. It integrates everyday Indian analogies, bilingual concept definitions, and active questioning pauses to guarantee high student attention.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-800">Recommended Classroom Scenarios:</span>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center gap-2">✓ Smartboard whole-class teaching</li>
                    <li className="flex items-center gap-2">✓ Initial concept introduction</li>
                    <li className="flex items-center gap-2">✓ Peer discussion checkpoints</li>
                    <li className="flex items-center gap-2">✓ End-of-chapter recap</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-800">Key Teaching Benefits:</span>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center gap-2">✓ High visual contrast readable from back bench</li>
                    <li className="flex items-center gap-2">✓ Reduces teacher board-writing time by 15 mins</li>
                    <li className="flex items-center gap-2">✓ Zero setup required on 75&quot; smartboard</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Curriculum Alignment */}
          {activeTab === "curriculum" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                NCERT Learning Outcomes Alignment
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-800 block mb-1">LO-SCI-08-01: Scientific Inquiry</span>
                  <p className="text-gray-600">Students identify and differentiate between living processes using structured visual models.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-800 block mb-1">LO-SCI-08-02: Real-World Applications</span>
                  <p className="text-gray-600">Students explain the significance of these mechanisms in agriculture, hygiene, and environmental balance.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar: Primary Action Hierarchy */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/dashboard/resources/${resource.id}`}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Full Details &amp; History
            </Link>
            <Link
              href={`/dashboard/create?type=${resource.type.toLowerCase()}&grade=${resource.grade}&subject=${resource.subject}&chapter=${resource.chapter}`}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate / Adapt
            </Link>
          </div>

          <div className="w-full sm:w-auto">
            {resource.teachUrl ? (
              <Link
                href={resource.teachUrl}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Tv className="w-4 h-4" /> Use in Class (Smartboard Mode)
              </Link>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Ready to Teach
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
