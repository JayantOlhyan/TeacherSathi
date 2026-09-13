"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { 
  BookOpen, 
  PlusCircle, 
  Search, 
  Filter, 
  Play, 
  GitBranch, 
  Users, 
  Video, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Download, 
  ExternalLink,
  Sparkles,
  UploadCloud,
  ChevronRight,
  MoreVertical,
  Globe
} from "lucide-react";
import type { ResourceRecord } from "@/lib/repositories/resources";
import type { ResourceType, ResourceStatus } from "@/lib/validations/resources";

export default function ResourcesLibraryPage() {
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [languageFilter, setLanguageFilter] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New Resource Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ResourceType>("PRESENTATION");
  const [newDescription, setNewDescription] = useState("");
  const [newLanguage, setNewLanguage] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (typeFilter !== "ALL") params.set("resource_type", typeFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (languageFilter !== "ALL") params.set("language", languageFilter);

      const res = await fetch(`/api/resources?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setResources(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter, languageFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handlePublish = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resources/${id}/publish`, { method: "POST" });
      if (res.ok) {
        await fetchResources();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to publish resource. Check validation errors.");
      }
    } catch {
      alert("Network error during publishing");
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this resource?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resources/${id}/archive`, { method: "POST" });
      if (res.ok) {
        await fetchResources();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this resource?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchResources();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      let initialContent: Record<string, unknown> = {};
      if (newType === "PRESENTATION") {
        initialContent = {
          title: newTitle,
          theme: "LIGHT",
          slides: [
            {
              type: "TITLE",
              title: newTitle,
              subtitle: "NCERT Curriculum Module",
              body: newDescription || "Interactive presentation created with TeacherSathi",
            },
            {
              type: "CONTENT",
              title: "Core Concepts",
              subtitle: "Key takeaways and curriculum alignment",
              bullets: ["Introduction to concept", "Practical applications", "Summary & Questions"],
            },
          ],
        };
      } else if (newType === "MIND_MAP") {
        initialContent = {
          title: newTitle,
          central_node_id: "node-1",
          nodes: [
            { id: "node-1", label: newTitle, type: "CONCEPT", color: "#059669" },
            { id: "node-2", label: "Sub-concept 1", type: "SUB_CONCEPT", parent_id: "node-1" },
            { id: "node-3", label: "Sub-concept 2", type: "SUB_CONCEPT", parent_id: "node-1" },
          ],
          edges: [
            { id: "e1-2", source: "node-1", target: "node-2", label: "branches to" },
            { id: "e1-3", source: "node-1", target: "node-3", label: "branches to" },
          ],
        };
      } else if (newType === "TEACHING_ACTIVITY") {
        initialContent = {
          archetype: "THINK_PAIR_SHARE",
          grade_level: "Grade 8",
          subject: "Science",
          duration_minutes: 20,
          learning_objectives: ["Understand foundational NCERT concept"],
          materials_needed: ["Notebook", "Worksheet"],
          procedure: [
            {
              phase: "THINK",
              duration_minutes: 3,
              teacher_instruction: "Pose the discussion prompt to students individually.",
              student_action: "Reflect and note thoughts silently in notebooks.",
            },
            {
              phase: "PAIR",
              duration_minutes: 7,
              teacher_instruction: "Instruct students to turn to bench partners and share ideas.",
              student_action: "Exchange reasoning and compare approaches.",
            },
            {
              phase: "SHARE",
              duration_minutes: 10,
              teacher_instruction: "Facilitate whole-class plenary synthesis.",
              student_action: "Volunteer insights to the class.",
            },
          ],
        };
      }

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          resource_type: newType,
          language: newLanguage,
          content: initialContent,
        }),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewTitle("");
        setNewDescription("");
        await fetchResources();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to create resource");
      }
    } catch {
      alert("Error creating resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "PRESENTATION":
        return <Play className="w-5 h-5 text-emerald-600" />;
      case "MIND_MAP":
        return <GitBranch className="w-5 h-5 text-indigo-600" />;
      case "TEACHING_ACTIVITY":
        return <Users className="w-5 h-5 text-amber-600" />;
      case "VIDEO":
        return <Video className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getEditUrl = (resource: ResourceRecord) => {
    switch (resource.resource_type) {
      case "PRESENTATION":
        return `/dashboard/resources/presentations/${resource.id}/edit`;
      case "MIND_MAP":
        return `/dashboard/resources/mindmaps/${resource.id}/edit`;
      case "TEACHING_ACTIVITY":
        return `/dashboard/resources/activities/${resource.id}/edit`;
      default:
        return `/dashboard/resources/${resource.id}`;
    }
  };

  const totalCount = resources.length;
  const publishedCount = resources.filter((r) => r.status === "PUBLISHED").length;
  const draftCount = resources.filter((r) => r.status === "DRAFT").length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5" /> NCERT Curriculum Production Pipeline
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif">
            Curriculum Resources & Media Library
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Author, validate, and broadcast AI presentations, concept mind maps, and interactive teaching activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/create"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> AI Generator
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Resource
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Resources</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Published</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{publishedCount}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Drafts</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{draftCount}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Validation Quality</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">100% Deterministic</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search resources by title or concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Resource Types</option>
              <option value="PRESENTATION">Smartboard Presentations</option>
              <option value="MIND_MAP">Concept Mind Maps</option>
              <option value="TEACHING_ACTIVITY">Teaching Activities</option>
              <option value="VIDEO">Media / Videos</option>
              <option value="QUIZ">Quizzes</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Languages</option>
              <option value="en">English (en)</option>
              <option value="hi">Hindi (hi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-wider">Loading curriculum resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl p-12 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            No resources match your current filter criteria. Create a new presentation, mind map, or teaching activity to begin.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create First Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => {
            const isPublished = res.status === "PUBLISHED";
            const isFailed = res.validation_status === "FAILED";
            const isWarning = res.validation_warnings?.length > 0;

            return (
              <div
                key={res.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Header: Type Badge & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                        {getTypeIcon(res.resource_type)}
                      </div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-600">
                        {res.resource_type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.language && (
                        <span className="text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {res.language}
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isPublished
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                    {res.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>

                  {/* Validation Score Indicator */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-500 font-medium">Readability & Quality:</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {isFailed ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Issues Detected
                        </span>
                      ) : isWarning ? (
                        <span className="text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {res.validation_score || 90}/100
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {res.validation_score || 100}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Link
                      href={getEditUrl(res)}
                      className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-200 flex items-center gap-1 transition-all"
                    >
                      Edit Content
                    </Link>
                    <Link
                      href={`/dashboard/resources/${res.id}`}
                      className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      History & Details
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isPublished && (
                      <button
                        onClick={() => handlePublish(res.id)}
                        disabled={actionLoading === res.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-2xs"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(res.id)}
                      disabled={actionLoading === res.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                      title="Delete resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create New Resource Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold font-serif text-gray-900">
                Author New Educational Resource
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crop Production and Management"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Resource Archetype *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "PRESENTATION", label: "Smartboard Slides", icon: Play },
                    { type: "MIND_MAP", label: "Mind Map", icon: GitBranch },
                    { type: "TEACHING_ACTIVITY", label: "Class Activity", icon: Users },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = newType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setNewType(item.type as ResourceType)}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-2xs"
                            : "border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Language
                </label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description / NCERT Focus
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional context or chapter alignment notes..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  {isSubmitting ? "Creating Draft..." : "Create Draft Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
