"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  History, 
  RotateCcw, 
  Download, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  Share2,
  Lock,
  Layers,
  Calendar,
  UserCheck
} from "lucide-react";
import type { ResourceRecord, ResourceVersionRecord } from "@/lib/repositories/resources";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResourceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [resource, setResource] = useState<ResourceRecord | null>(null);
  const [versions, setVersions] = useState<ResourceVersionRecord[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handlePublish = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resources/${id}/publish`, { method: "POST" });
      if (res.ok) {
        await loadData();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to publish resource.");
      }
    } catch {
      alert("Error publishing resource");
    } finally {
      setActionLoading(false);
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

  const getEditUrl = (res: ResourceRecord) => {
    switch (res.resource_type) {
      case "PRESENTATION":
        return `/dashboard/resources/presentations/${res.id}/edit`;
      case "MIND_MAP":
        return `/dashboard/resources/mindmaps/${res.id}/edit`;
      case "TEACHING_ACTIVITY":
        return `/dashboard/resources/activities/${res.id}/edit`;
      default:
        return `/dashboard/resources/${res.id}`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading resource details...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Resource not found</h2>
        <Link
          href="/dashboard/resources"
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Library
        </Link>
      </div>
    );
  }

  const isPublished = resource.status === "PUBLISHED";
  const validationScore = resource.validation_score ?? 100;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          href="/dashboard/resources"
          className="text-xs font-bold text-gray-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resource Library
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={`/api/resources/${id}/export?format=html`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Export / Print
          </a>
          <Link
            href={getEditUrl(resource)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            Edit Content
          </Link>
          {!isPublished && (
            <button
              onClick={handlePublish}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
            >
              Publish Resource
            </button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
              {resource.resource_type.replace("_", " ")}
            </span>
            <span className="text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded">
              Language: {resource.language}
            </span>
          </div>

          <span
            className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
              isPublished
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
            }`}
          >
            Status: {resource.status}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-serif text-gray-900 leading-tight">
          {resource.title}
        </h1>

        {resource.description && (
          <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
            {resource.description}
          </p>
        )}
      </div>

      {/* Two Column Layout: Scorecard & Content Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold font-serif text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Active Content Snapshot
            </h2>

            {/* Quick content overview */}
            {resource.resource_type === "PRESENTATION" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-bold uppercase">
                  Slides Included: {((resource.content as { slides?: unknown[] })?.slides || []).length}
                </p>
                <div className="space-y-2">
                  {((resource.content as { slides?: Array<{ title: string; type: string }> })?.slides || []).map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-400">#{idx + 1}</span>
                        <span className="font-bold text-gray-800">{s.title}</span>
                      </div>
                      <span className="font-mono font-bold uppercase text-[10px] bg-white text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                        {s.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resource.resource_type === "MIND_MAP" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-bold uppercase">
                  Concept Nodes: {((resource.content as { nodes?: unknown[] })?.nodes || []).length} • Edges: {((resource.content as { edges?: unknown[] })?.edges || []).length}
                </p>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 font-mono text-xs text-gray-700 max-h-60 overflow-y-auto">
                  <pre>{JSON.stringify(resource.content, null, 2)}</pre>
                </div>
              </div>
            )}

            {resource.resource_type === "TEACHING_ACTIVITY" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                  <strong>Archetype:</strong> {(resource.content as { archetype?: string })?.archetype || "Activity"}
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 font-mono text-xs text-gray-700 max-h-60 overflow-y-auto">
                  <pre>{JSON.stringify(resource.content, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Deterministic Validation Scorecard */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">
              Readability & Pedagogical Quality
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900 font-serif">
                {validationScore}
              </span>
              <span className="text-sm font-bold text-gray-400">/ 100</span>
            </div>

            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  validationScore >= 80 ? "bg-emerald-500" : validationScore >= 50 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${validationScore}%` }}
              />
            </div>

            {/* Errors / Warnings List */}
            {resource.validation_errors && resource.validation_errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl space-y-1.5">
                <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Validation Errors:
                </span>
                <ul className="text-xs text-red-700 space-y-1 pl-4 list-disc">
                  {resource.validation_errors.map((err, i) => (
                    <li key={i}>{String(err.message || JSON.stringify(err))}</li>
                  ))}
                </ul>
              </div>
            )}

            {resource.validation_warnings && resource.validation_warnings.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Smartboard Warnings:
                </span>
                <ul className="text-xs text-amber-700 space-y-1 pl-4 list-disc">
                  {resource.validation_warnings.map((warn, i) => (
                    <li key={i}>{String(warn.message || JSON.stringify(warn))}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Version History & Rollback Table */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" /> Immutable Version History
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Every content change or publication creates an immutable snapshot with instant 1-click rollback.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-gray-400">
            {versions.length} versions recorded
          </span>
        </div>

        {versions.length === 0 ? (
          <p className="text-xs text-gray-400 py-4">No version records found.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono font-bold text-xs">
                      v{ver.version_number}
                    </span>
                    <span className="text-xs font-bold text-gray-800">{ver.title}</span>
                  </div>
                  {ver.change_summary && (
                    <p className="text-xs text-gray-500">{ver.change_summary}</p>
                  )}
                  <span className="text-[11px] text-gray-400 font-mono">
                    Saved on {new Date(ver.created_at).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleRestoreVersion(ver.version_number)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-900 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-center cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-600" /> Rollback to v{ver.version_number}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
