"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Building2, 
  School, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Activity,
  Layers
} from "lucide-react";
import { ScopeOverviewSummary } from "@/lib/services/reportingService";

export default function InstitutionalOverviewPage() {
  const [data, setData] = useState<ScopeOverviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/institutional/overview");
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch {
      // Ignore network errors in demo
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleExport = async () => {
    if (!data) return;
    setExporting(true);
    try {
      const res = await fetch("/api/admin/institutional/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope_type: data.scopeType,
          scope_id: data.scopeId,
          format: "CSV",
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `institutional-report-${data.scopeType.toLowerCase()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch {
      alert("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {data?.scopeType || "INSTITUTIONAL"} JURISDICTION
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-bold text-gray-500">Live Aggregate Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
            {data?.scopeName || "Institutional Overview"}
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            Real-time operational, academic, and platform adoption intelligence across all affiliated schools and classrooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting || loading || !data}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {exporting ? "Generating CSV..." : "Export Official Report"}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Aggregating institutional metrics...
          </p>
        </div>
      )}

      {/* Low-data / Empty State */}
      {!loading && data && data.totalSchools === 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-gray-900">No Schools Onboarded Yet</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            There are currently no active schools mapped to this administrative scope. Use the School Directory to onboard schools or invite school administrators.
          </p>
        </div>
      )}

      {/* Dashboard KPI Grid */}
      {!loading && data && data.totalSchools > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Schools */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Schools</span>
                <School className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{data.totalSchools}</span>
                <span className="text-xs text-emerald-700 font-bold">
                  {data.activeSchools} active ({data.adoptionRate}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${data.adoptionRate}%` }} />
              </div>
            </div>

            {/* Total Educators */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Active Teachers</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{data.totalTeachers}</span>
                <span className="text-xs text-gray-500 font-medium">across {data.totalClasses} classes</span>
              </div>
              <p className="text-[11px] text-gray-400">Teaching NCERT curriculum standard</p>
            </div>

            {/* Students Enrolled */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Enrolled Students</span>
                <GraduationCap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{data.totalStudents}</span>
                <span className="text-xs text-gray-500 font-medium">learners</span>
              </div>
              <p className="text-[11px] text-gray-400">Individual mastery profiles tracked</p>
            </div>

            {/* Average Mastery (With Privacy Guard) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Average Mastery</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                {data.insufficientData ? (
                  <span className="text-sm font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Insufficient data
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-gray-900">
                      {data.averageMasteryScore ?? "N/A"}%
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">65/35 Model</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                {data.insufficientData ? "Privacy guard: Requires ≥ 10 students" : "Empirical student response evidence"}
              </p>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learning Gap Resolution */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-gray-900">Learning Gap Resolution</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {data.gapResolutionRate}% Resolved
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-600">
                  <span>Open Gaps: {data.totalOpenGaps}</span>
                  <span>Resolved: {data.resolvedGapsCount}</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: `${data.gapResolutionRate}%` }} />
                  <div className="bg-amber-400 h-full" style={{ width: `${100 - data.gapResolutionRate}%` }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Empirical gaps identified from assessments undergoing teacher-led micro-lesson remediation.
              </p>
            </div>

            {/* Assessment Participation */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-gray-900">Assessments Created</h3>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-gray-900">
                {data.totalAssessments}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Objective and subjective exams authored, evaluated, and synchronized with NCERT chapter concepts.
              </p>
            </div>

            {/* Resource Engagement */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-gray-900">Classroom Content Events</h3>
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-gray-900">
                {data.resourceUsageCount}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                75&quot; smartboard presentation launches, vector mind map explorations, and printable lesson exports.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
