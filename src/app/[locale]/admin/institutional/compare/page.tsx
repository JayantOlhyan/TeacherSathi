"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle2, 
  Plus
} from "lucide-react";
import { SchoolComparisonRow } from "@/lib/services/reportingService";
import { EnrichedSchoolRecord } from "@/lib/repositories/institution";

export default function SchoolComparisonPage() {
  const [availableSchools, setAvailableSchools] = useState<EnrichedSchoolRecord[]>([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<SchoolComparisonRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSchools() {
      try {
        const res = await fetch("/api/admin/institutional/schools?limit=50");
        if (res.ok) {
          const json = await res.json();
          setAvailableSchools(json.data || []);
          if (json.data?.length >= 2) {
            setSelectedSchoolIds([json.data[0].id, json.data[1].id]);
          }
        }
      } catch {
        // Ignored
      }
    }
    loadSchools();
  }, []);

  const runComparison = useCallback(async () => {
    if (selectedSchoolIds.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/institutional/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school_ids: selectedSchoolIds }),
      });
      if (res.ok) {
        const json = await res.json();
        setComparisonData(json.data || []);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, [selectedSchoolIds]);

  useEffect(() => {
    if (selectedSchoolIds.length >= 2) {
      runComparison();
    }
  }, [selectedSchoolIds, runComparison]);

  const toggleSchool = (id: string) => {
    if (selectedSchoolIds.includes(id)) {
      if (selectedSchoolIds.length > 2) {
        setSelectedSchoolIds(selectedSchoolIds.filter((s) => s !== id));
      } else {
        alert("Please select at least 2 schools to compare.");
      }
    } else {
      if (selectedSchoolIds.length >= 10) {
        alert("Maximum 10 schools can be compared at once.");
        return;
      }
      setSelectedSchoolIds([...selectedSchoolIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Network & District Analytics
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-bold text-gray-500">Side-by-Side Operational Benchmarking</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
          Multi-School Comparative Matrix
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
          Statistically sound institutional comparisons across active educators, learner enrollment, curriculum coverage, and student mastery trajectory.
        </p>
      </div>

      {/* School Selection Ribbon */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-700">Select Schools to Compare (2 to 10):</span>
          <span className="text-gray-400 font-mono font-bold">{selectedSchoolIds.length} Selected</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableSchools.map((s) => {
            const isSelected = selectedSchoolIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSchool(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-gray-400" />}
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-2">
          <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-bold">Benchmarking schools...</span>
        </div>
      ) : comparisonData.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-xs text-gray-400">
          Select at least 2 schools to generate the comparative matrix.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Dimension / Metric</th>
                  {comparisonData.map((col) => (
                    <th key={col.schoolId} className="py-4 px-4 min-w-[160px]">
                      <div className="font-bold text-gray-900 text-xs normal-case">{col.schoolName}</div>
                      <div className="text-[10px] font-mono text-gray-400 font-normal">{col.city} • {col.board}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Active Teachers</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold text-gray-800">
                      {c.teachersCount}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Enrolled Students</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold text-gray-800">
                      {c.studentsCount}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Classrooms</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold text-gray-800">
                      {c.classesCount}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Assessments Created</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold text-gray-800">
                      {c.assessmentsCount}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Average Concept Mastery</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold">
                      {c.insufficientData ? (
                        <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Insufficient data
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-extrabold text-sm">
                          {c.averageMastery}%
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Open Learning Gaps</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold text-amber-800">
                      {c.openGapsCount}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900 bg-gray-50/30">Smartboard & Content Events</td>
                  {comparisonData.map((c) => (
                    <td key={c.schoolId} className="py-3.5 px-4 font-bold text-gray-800">
                      {c.resourceUsageCount}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
