"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen
} from "lucide-react";
import { ConceptAcademicSummary, LearningGapAggregateItem } from "@/lib/services/reportingService";

export default function InstitutionalAcademicPage() {
  const [concepts, setConcepts] = useState<ConceptAcademicSummary[]>([]);
  const [gaps, setGaps] = useState<LearningGapAggregateItem[]>([]);
  const [overallMastery, setOverallMastery] = useState<number | null>(null);
  const [insufficientData, setInsufficientData] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAcademicData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/institutional/academic");
      if (res.ok) {
        const json = await res.json();
        setConcepts(json.data.concepts || []);
        setGaps(json.data.learningGaps || []);
        setOverallMastery(json.data.overallMastery);
        setInsufficientData(json.data.insufficientData);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicData();
  }, [fetchAcademicData]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            NCERT Curriculum Analytics
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-bold text-gray-500">Traceable Empirical Mastery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
          Aggregated Academic Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
          Aggregated concept performance, mastery trajectories, and learning gap detection across affiliated institutions.
        </p>

        {/* Privacy Guard Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-600 space-y-0.5">
            <p className="font-bold text-slate-800">Student Privacy Guard Enforced (Minimum Cohort Threshold: N ≥ 10)</p>
            <p>
              To protect learner confidentiality and prevent individual deanonymization, concepts evaluated by fewer than 10 students are masked as &quot;Insufficient data&quot;.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-2">
          <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-bold">Aggregating academic data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Concept Mastery Distribution (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" /> Canonical Concept Mastery
              </h3>
              {overallMastery !== null && !insufficientData && (
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  Cohort Average: {overallMastery}%
                </span>
              )}
            </div>

            {concepts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center text-xs text-gray-400">
                No evaluated concepts found in this administrative jurisdiction yet.
              </div>
            ) : (
              <div className="space-y-3">
                {concepts.map((c) => (
                  <div key={c.conceptId} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {c.subjectName} • {c.chapterTitleEn}
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">{c.conceptNameEn}</h4>
                      </div>

                      <div>
                        {c.insufficientData ? (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Insufficient data (N &lt; 10)
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                              c.masteryStatus === "MASTERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : c.masteryStatus === "NEEDS_SUPPORT"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {c.averageMastery}% Mastery
                          </span>
                        )}
                      </div>
                    </div>

                    {!c.insufficientData && c.averageMastery !== null && (
                      <div className="space-y-1">
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.averageMastery >= 75
                                ? "bg-emerald-600"
                                : c.averageMastery < 60
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${c.averageMastery}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-400">
                          <span>Evaluated: {c.studentsEvaluatedCount} students</span>
                          <span>Needs support: {c.studentsNeedingSupportCount} students</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Gaps Breakdown (1 col) */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> High-Priority Learning Gaps
            </h3>

            {gaps.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center text-xs text-gray-400">
                No active learning gaps recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {gaps.map((g) => (
                  <div key={g.conceptId} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                        {g.severity}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500">
                        {g.resolutionRate}% Resolved
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-xs">{g.conceptNameEn}</h4>
                    <p className="text-[11px] text-gray-400">{g.subjectName} • {g.chapterTitleEn}</p>

                    <div className="pt-2 border-t border-gray-100 flex justify-between text-[11px] text-gray-500">
                      <span>{g.affectedSchoolsCount} Schools Affected</span>
                      <span>{g.affectedStudentsCount} Learners</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
