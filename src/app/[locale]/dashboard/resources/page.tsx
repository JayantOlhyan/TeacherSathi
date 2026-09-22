"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { 
  BookOpen, 
  Search, 
  Sparkles,
  Compass,
  Bookmark,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";
import type { ResourceRecord } from "@/lib/repositories/resources";
import { ConfirmDialog, AlertDialog } from "@/components/ui/Dialog";
import { useTeachingContext } from "@/lib/context/teachingContext";
import { getChapterResources } from "@/lib/data/chapterResources";
import { getRecentResources, getSavedResources, RESOURCE_STATE_EVENT, type StoredResourceItem } from "@/lib/services/recentResources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourcePreviewModal } from "@/components/resources/ResourcePreviewModal";

export default function ResourcesLibraryPage() {
  const { context: teachingContext } = useTeachingContext();
  
  // Active Tab: "chapter" | "recent" | "saved" | "all"
  const [activeTab, setActiveTab] = useState<"chapter" | "recent" | "saved" | "all">("chapter");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL"); // ALL, LESSON, WORKSHEET, QUIZ, ACTIVITY, VIDEO
  
  // Dynamic Resources from Backend
  const [apiResources, setApiResources] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Recent & Saved Local State
  const [recentResources, setRecentResources] = useState<StoredResourceItem[]>([]);
  const [savedResources, setSavedResources] = useState<StoredResourceItem[]>([]);
  
  // Preview Modal State
  const [previewResource, setPreviewResource] = useState<StoredResourceItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Dialog States
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    variant?: "danger" | "primary" | "warning";
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: "success" | "danger" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
  });

  // Load Recent & Saved resources
  const loadLocalResources = useCallback(() => {
    setRecentResources(getRecentResources());
    setSavedResources(getSavedResources());
  }, []);

  useEffect(() => {
    loadLocalResources();
    window.addEventListener(RESOURCE_STATE_EVENT, loadLocalResources);
    return () => window.removeEventListener(RESOURCE_STATE_EVENT, loadLocalResources);
  }, [loadLocalResources]);

  // Fetch Backend Resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/resources?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setApiResources(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Derive Canonical Chapter Resources based on teaching context
  const activeGrade = teachingContext?.grade || "class-8";
  const activeSubject = teachingContext?.subject || "science";
  const activeChapter = teachingContext?.chapter || "chapter-3";
  const activeChapterTitle = teachingContext?.chapterTitle || "Reproduction in Animals";

  const chapterResourcesList = useMemo(() => {
    return getChapterResources(activeGrade, activeSubject, activeChapter);
  }, [activeGrade, activeSubject, activeChapter]);

  // Convert backend apiResources into StoredResourceItem format
  const convertedApiResources: StoredResourceItem[] = useMemo(() => {
    return apiResources.map((res) => {
      let intent: "PREPARE" | "TEACH" | "PRACTICE" | "ASSESS" = "TEACH";
      if (res.resource_type === "LESSON_PLAN") intent = "PREPARE";
      else if (res.resource_type === "WORKSHEET") intent = "PRACTICE";
      else if (res.resource_type === "QUIZ" || res.resource_type === "TEST") intent = "ASSESS";

      return {
        id: res.id,
        title: res.title,
        description: res.description || undefined,
        intent,
        type: res.resource_type,
        typeLabel: res.resource_type.replace(/_/g, " "),
        grade: "Class 8",
        gradeName: "Class 8",
        subject: "Science",
        subjectName: "Science",
        chapter: "Chapter 3",
        chapterName: activeChapterTitle,
        duration: "~30 min",
        itemCount: "Custom resource",
        previewUrl: `/dashboard/resources/${res.id}`,
        teachUrl: `/classroom?grade=${activeGrade}&subject=${activeSubject}&chapter=${activeChapter}&title=${encodeURIComponent(
          res.title
        )}`,
      };
    });
  }, [apiResources, activeGrade, activeSubject, activeChapter, activeChapterTitle]);

  // Determine current active list based on tab
  const rawTabItems: StoredResourceItem[] = useMemo(() => {
    if (activeTab === "chapter") {
      return chapterResourcesList;
    }
    if (activeTab === "recent") {
      return recentResources.length > 0 ? recentResources : chapterResourcesList.slice(0, 3);
    }
    if (activeTab === "saved") {
      return savedResources;
    }
    // "all": combine chapter resources with backend resources
    return [...chapterResourcesList, ...convertedApiResources];
  }, [activeTab, chapterResourcesList, recentResources, savedResources, convertedApiResources]);

  // Filter items by category pill and search text
  const displayedItems = useMemo(() => {
    return rawTabItems.filter((item) => {
      // Category filter
      if (categoryFilter !== "ALL") {
        if (categoryFilter === "LESSON" && !item.type.includes("SLIDE") && !item.type.includes("PRESENTATION")) return false;
        if (categoryFilter === "WORKSHEET" && !item.type.includes("WORKSHEET")) return false;
        if (categoryFilter === "QUIZ" && !item.type.includes("QUIZ") && !item.type.includes("TEST")) return false;
        if (categoryFilter === "ACTIVITY" && !item.type.includes("ACTIVITY")) return false;
        if (categoryFilter === "VIDEO" && !item.type.includes("VIDEO")) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchType = item.typeLabel.toLowerCase().includes(q);
        const matchSubject = item.subjectName.toLowerCase().includes(q);
        const matchGrade = item.gradeName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchType && !matchSubject && !matchGrade) return false;
      }

      return true;
    });
  }, [rawTabItems, categoryFilter, searchQuery]);

  // Count items by category for filter pills
  const counts = useMemo(() => {
    const base = rawTabItems;
    return {
      all: base.length,
      lesson: base.filter((i) => i.type.includes("SLIDE") || i.type.includes("PRESENTATION")).length,
      worksheet: base.filter((i) => i.type.includes("WORKSHEET")).length,
      quiz: base.filter((i) => i.type.includes("QUIZ") || i.type.includes("TEST")).length,
      activity: base.filter((i) => i.type.includes("ACTIVITY")).length,
      video: base.filter((i) => i.type.includes("VIDEO")).length,
    };
  }, [rawTabItems]);

  const handleOpenPreview = (item: StoredResourceItem) => {
    setPreviewResource(item);
    setIsPreviewOpen(true);
  };

  const createAiUrl = `/dashboard/create?grade=${activeGrade}&subject=${activeSubject}&chapter=${activeChapter}&returnUrl=/dashboard/resources`;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5" /> Teaching Resources Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-serif">
            Curriculum Resources &amp; Materials
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Discover, preview, adapt, and launch classroom-ready resources organized around your teaching intent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={createAiUrl}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Create with Saathi AI
          </Link>
          <Link
            href={`/content/${activeGrade}/${activeSubject}/${activeChapter}`}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-emerald-600" /> Chapter Workspace
          </Link>
        </div>
      </div>

      {/* Active Teaching Context Hero Banner (Mockup Screen 2) */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Teaching Context (Inherited)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-serif">
            Resources for {activeChapterTitle}
          </h2>
          <p className="text-xs text-gray-600">
            {teachingContext?.gradeName || "Class 8"} · {teachingContext?.subjectName || "Science"} · {teachingContext?.chapter?.replace("chapter-", "Chapter ") || "Chapter 3"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/content/${activeGrade}/${activeSubject}/${activeChapter}`}
            className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer"
          >
            Change Chapter
          </Link>
          <Link
            href={`/classroom?grade=${activeGrade}&subject=${activeSubject}&chapter=${activeChapter}&title=${encodeURIComponent(activeChapterTitle)}`}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            Teach This Chapter <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Navigation Scope Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveTab("chapter"); setCategoryFilter("ALL"); }}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer ${
            activeTab === "chapter"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          For Current Chapter ({counts.all})
        </button>
        <button
          onClick={() => { setActiveTab("recent"); setCategoryFilter("ALL"); }}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "recent"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Recent Resources ({recentResources.length})
        </button>
        <button
          onClick={() => { setActiveTab("saved"); setCategoryFilter("ALL"); }}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "saved"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> Saved ({savedResources.length})
        </button>
        <button
          onClick={() => { setActiveTab("all"); setCategoryFilter("ALL"); }}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "all"
              ? "text-emerald-800 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> All Resources ({chapterResourcesList.length + apiResources.length})
        </button>
      </div>

      {/* Search & Category Filter Pills Row (Mockup Screen 2) */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder='Search resources (e.g., "worksheet", "activity", "photosynthesis", "quiz")...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "ALL"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setCategoryFilter("LESSON")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "LESSON"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Lesson Slides ({counts.lesson})
          </button>
          <button
            onClick={() => setCategoryFilter("WORKSHEET")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "WORKSHEET"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Worksheet ({counts.worksheet})
          </button>
          <button
            onClick={() => setCategoryFilter("QUIZ")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "QUIZ"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Quiz ({counts.quiz})
          </button>
          <button
            onClick={() => setCategoryFilter("ACTIVITY")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "ACTIVITY"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Activity ({counts.activity})
          </button>
          <button
            onClick={() => setCategoryFilter("VIDEO")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "VIDEO"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Video ({counts.video})
          </button>
        </div>
      </div>

      {/* Resources Card Grid */}
      {loading && activeTab === "all" ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading resources library...</p>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {activeTab === "saved"
              ? "No saved resources yet"
              : activeTab === "recent"
              ? "No recent resources"
              : "No matching resources found"}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            {activeTab === "saved"
              ? "Click the bookmark icon on any teaching resource card to save it for quick access later."
              : `Create a new classroom-ready resource for ${activeChapterTitle} using Saathi AI.`}
          </p>
          <div className="pt-2">
            <Link
              href={createAiUrl}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Create Resource for {activeChapterTitle}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              onPreview={handleOpenPreview}
            />
          ))}
        </div>
      )}

      {/* Interactive Resource Preview Modal */}
      <ResourcePreviewModal
        resource={previewResource}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Alerts & Confirms */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
        onClose={() => setAlertDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
