"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  TrendingUp,
  BookOpen,
  BrainCircuit,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AssessmentItem {
  id: string;
  title: string;
  assessment_type: string;
  grade_id: string;
  subject_id: string;
  total_marks: number;
  duration_minutes: number;
  status: string;
  created_at: string;
}

export default function ReportsPage() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const res = await fetch("/api/assessments");
        if (res.ok) {
          const json = await res.json();
          setAssessments(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load assessments for reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-emerald-200/60">
            Assessment & Diagnostic Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Learning & Performance Reports</h1>
          <p className="text-gray-600 mt-1 text-sm max-w-2xl">
            Review completed classroom examinations, question-level item difficulty diagnostics, and official school grade ledgers.
          </p>
        </div>

        <Link href="/dashboard/analytics">
          <Button className="bg-[#14532D] hover:bg-[#0f4022] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm flex items-center gap-2 transition-all text-xs">
            <BrainCircuit className="w-4 h-4 text-amber-300" /> Open Concept Mastery Hub
          </Button>
        </Link>
      </div>

      {/* Concept Mastery Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 p-6 rounded-3xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-300" /> New: Pedagogical Concept Mastery Analytics
          </h3>
          <p className="text-xs text-emerald-100 max-w-xl">
            Go beyond simple percentage scores. View fine-grained concept diagnostics, student cohorts needing support, and launch 1-click AI remedial interventions.
          </p>
        </div>
        <Link href="/dashboard/analytics">
          <Button className="bg-white text-[#14532D] hover:bg-emerald-50 font-black text-xs px-5 py-2.5 rounded-xl shrink-0">
            Explore Concept Analytics →
          </Button>
        </Link>
      </div>

      {/* Assessments Summary Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Completed & Published Assessments</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Click &quot;View Item Diagnostics&quot; to inspect question error rates and student score distributions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <Calendar className="w-4 h-4" /> Academic Year 2026-27
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-gray-500">
            Loading assessment records...
          </div>
        ) : assessments.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-600">No assessments created or completed yet.</p>
            <Link href="/dashboard/assessments/create">
              <Button className="bg-[#14532D] text-white text-xs font-bold px-4 py-2 rounded-xl mt-2">
                Create First Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Assessment Title</th>
                  <th className="py-3 px-4">Curriculum</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Marks & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-[#FDFBF7] transition-all">
                    <td className="py-4 px-4 font-bold text-gray-800">
                      {a.title}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-gray-600">
                      {a.grade_id} • {a.subject_id}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-gray-500">
                      {a.assessment_type.replace(/_/g, " ")}
                    </td>
                    <td className="py-4 px-4 text-xs font-bold text-gray-700">
                      {a.total_marks} Marks • {a.duration_minutes}m
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        a.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/dashboard/assessments/${a.id}/results`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs font-bold border-gray-200 hover:bg-gray-50 rounded-xl"
                        >
                          Item Diagnostics
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
