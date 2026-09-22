"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Tv, 
  Download, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Clock, 
  Copy, 
  FileText,
  History,
  RotateCcw
} from "lucide-react";
import type { ResourceRecord, ResourceVersionRecord } from "@/lib/repositories/resources";
import { isResourceSaved, toggleSaveResource, addRecentResource } from "@/lib/services/recentResources";

interface SlideItem {
  title: string;
  subtitle?: string;
  bullets?: string[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResourceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [resource, setResource] = useState<ResourceRecord | null>(null);
  const [versions, setVersions] = useState<ResourceVersionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "details" | "curriculum" | "history">("preview");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRes, verRes] = await Promise.all([
        fetch(`/api/resources/${id}`),
        fetch(`/api/resources/${id}/versions`),
      ]);

      if (resRes.ok) {
        const json = await resRes.json();
        setResource(json.data);
      }
      if (verRes.ok) {
        const json = await verRes.json();
        setVersions(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load resource details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (resource) {
      setSaved(isResourceSaved(resource.id));
      addRecentResource({
        id: resource.id,
        title: resource.title,
        description: resource.description || undefined,
        intent: "TEACH",
        type: resource.resource_type,
        typeLabel: resource.resource_type.replace(/_/g, " "),
        grade: "Class 8",
        gradeName: "Class 8",
        subject: "Science",
        subjectName: "Science",
        chapter: "Chapter 3",
        chapterName: resource.title,
        previewUrl: `/dashboard/resources/${resource.id}`,
      });
    }
  }, [resource]);

  const handleToggleSave = () => {
    if (!resource) return;
    const newState = toggleSaveResource({
      id: resource.id,
      title: resource.title,
      description: resource.description || undefined,
      intent: "TEACH",
      type: resource.resource_type,
      typeLabel: resource.resource_type.replace(/_/g, " "),
      grade: "Class 8",
      gradeName: "Class 8",
      subject: "Science",
      subjectName: "Science",
      chapter: "Chapter 3",
      chapterName: resource.title,
      previewUrl: `/dashboard/resources/${resource.id}`,
    });
    setSaved(newState);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRestoreVersion = async (versionNumber: number) => {
    if (!confirm(`Rollback resource to Version ${versionNumber}? Current changes will be snapshotted.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resources/${id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionNumber }),
      });
      if (res.ok) {
        await loadData();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to restore version.");
      }
    } catch {
      alert("Error restoring version");
    } finally {
      setActionLoading(false);
    }
  };

  // Synthetic or fallback details if raw database record
  const title = resource?.title || "Educational Resource Preview";
  const desc = resource?.description || "Structured NCERT classroom resource prepared with TeacherSathi.";
  const returnUrl = `/dashboard/resources`;
  const classroomUrl = `/classroom?grade=class-8&subject=science&chapter=chapter-3&title=${encodeURIComponent(title)}&returnUrl=${encodeURIComponent(returnUrl)}`;

  // Sample Slides for preview
  const contentObj = resource?.content as { slides?: SlideItem[] } | undefined;
  const slides: SlideItem[] = contentObj?.slides || [
    {
      title: title,
      subtitle: "Class 8 · Science · Chapter 3",
      bullets: [
        "Core Chapter Learning Objectives and Competencies",
        "Key pedagogical concepts aligned to NCERT syllabus",
        "Interactive Smartboard Inquiry Checkpoint",
      ],
    },
    {
      title: "Foundations & Core Mechanism",
      subtitle: "Key definition and structural components",
      bullets: [
        "Primary scientific principles and terminology",
        "Comparative diagrams and observable examples",
        "Common student misconceptions and clarifications",
      ],
    },
    {
      title: "Classroom Activity Checkpoint",
      subtitle: "Think-Pair-Share 5-minute activity",
      bullets: [
        "Inquiry question: How is this process observed in daily Indian life?",
        "Collaborate with your bench partner to draft an explanation",
        "Selected pairs present summary points on the smartboard",
      ],
    },
    {
      title: "Summary & Learning Review",
      subtitle: "Consolidation of today's lesson",
      bullets: [
        "Review of core terminology and exam-relevant concepts",
        "Homework practice assigned from NCERT exercises",
        "Preview of upcoming formative quiz",
      ],
    },
  ];

  const totalSlides = slides.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading resource preview...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          href="/dashboard/resources"
          className="text-xs font-bold text-gray-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </Link>

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

          <a
            href={`/api/resources/${id}/export?format=html`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Print / Export
          </a>
        </div>
      </div>

      {/* Main Resource Header Card (Mockup Screen 3) */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold uppercase tracking-wide">
              {resource?.resource_type ? resource.resource_type.replace(/_/g, " ") : "Lesson Presentation"}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Verified NCERT Aligned
            </span>
          </div>

          <span className="text-xs font-mono font-bold uppercase bg-gray-100 text-gray-600 px-2.5 py-1 rounded">
            Language: {resource?.language || "en"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-serif text-gray-900 leading-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
          {desc}
        </p>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-semibold text-gray-600 border-t border-gray-100">
          <span className="px-3 py-1 bg-gray-100 rounded-lg">Class 8</span>
          <span className="px-3 py-1 bg-gray-100 rounded-lg">Science</span>
          <span className="px-3 py-1 bg-gray-100 rounded-lg">Chapter 3</span>
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-gray-400" /> {totalSlides} slides
          </span>
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> ~30 minutes
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
            activeTab === "preview"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Preview Content
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
            activeTab === "details"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Pedagogical Details
        </button>
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
            activeTab === "curriculum"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Curriculum Alignment
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "history"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <History className="w-3.5 h-3.5" /> Version History ({versions.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "preview" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Thumbnails */}
          <div className="space-y-3 order-2 md:order-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Slides Outline
            </span>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {slides.map((s: SlideItem, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    currentSlideIndex === idx
                      ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-[10px] font-black text-gray-400 mb-1">SLIDE {idx + 1}</div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{s.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Active Viewer */}
          <div className="md:col-span-3 order-1 md:order-2 space-y-4">
            <div className="aspect-video bg-gradient-to-br from-emerald-950 via-[#14532D] to-gray-900 rounded-3xl text-white p-8 sm:p-14 shadow-xl flex flex-col justify-between relative overflow-hidden border border-emerald-700/50">
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                  Slide {currentSlideIndex + 1} of {totalSlides}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
                  {slides[currentSlideIndex].title}
                </h2>
                {slides[currentSlideIndex].subtitle && (
                  <p className="text-emerald-100 text-base font-medium">
                    {slides[currentSlideIndex].subtitle}
                  </p>
                )}
              </div>

              <div className="relative z-10 space-y-2 bg-black/25 backdrop-blur-xs p-6 rounded-2xl border border-white/10">
                {slides[currentSlideIndex].bullets?.map((b: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm sm:text-base text-white/95">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/80 pt-4 border-t border-white/10">
                <span>TeacherSathi Classroom Mode Deck</span>
                <span>Class 8 Science · NCERT Curriculum</span>
              </div>
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
              <button
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Slide
              </button>
              <span className="text-xs font-bold text-gray-700">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              <button
                disabled={currentSlideIndex === totalSlides - 1}
                onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                Next Slide <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Details */}
      {activeTab === "details" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-2">
              About this Resource
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              This presentation deck is optimized for 75&quot; smartboards in government and private classrooms. It organizes the core topic into structured phases: initial inquiry hook, foundational definitions, interactive think-pair-share discussion, and summary mastery checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Recommended For:</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">✓ Classroom 75&quot; smartboard teaching</li>
                <li className="flex items-center gap-2">✓ Concept introduction with visual models</li>
                <li className="flex items-center gap-2">✓ Active discussion checkpoints and peer questioning</li>
                <li className="flex items-center gap-2">✓ Rapid end-of-period recap</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Pedagogical Features:</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">✓ High-contrast color typography for back-row visibility</li>
                <li className="flex items-center gap-2">✓ Bilingual Hindi/English terminology support</li>
                <li className="flex items-center gap-2">✓ Seamless clicker integration for student response polling</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Curriculum Alignment */}
      {activeTab === "curriculum" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-4">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
            NCERT National Curriculum Framework Alignment
          </h3>
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
              <span className="font-bold text-gray-900 block">LO-08-SCI-01: Scientific Inquiry &amp; Observation</span>
              <p className="text-gray-600">Students analyze natural processes through diagrammatic representation and contextual evidence.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
              <span className="font-bold text-gray-900 block">LO-08-SCI-02: Real-World Applications</span>
              <p className="text-gray-600">Students identify the role of biological and physical mechanisms in daily life, agriculture, and hygiene.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Version History (Preserving Phase 7 Capabilities) */}
      {activeTab === "history" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
            Resource Versions &amp; Audit Trail
          </h3>
          {versions.length === 0 ? (
            <p className="text-xs text-gray-500">No previous version history recorded for this resource.</p>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
              {versions.map((ver) => (
                <div key={ver.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <span className="text-xs font-bold text-gray-800">Version {ver.version_number}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{ver.change_summary || "Automated snapshot"}</p>
                    <span className="text-[10px] text-gray-400">{new Date(ver.created_at).toLocaleString()}</span>
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleRestoreVersion(ver.version_number)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sticky Bottom Action Bar (Mockup Screen 3) */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/dashboard/create?type=presentation&grade=class-8&subject=science&chapter=chapter-3`}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate &amp; Adapt
          </Link>
          <Link
            href={`/dashboard/resources/presentations/${id}/edit`}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Edit Content
          </Link>
        </div>

        <div className="w-full sm:w-auto">
          <Link
            href={classroomUrl}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Tv className="w-4 h-4" /> Use in Class (75&quot; Smartboard)
          </Link>
        </div>
      </div>

    </div>
  );
}
