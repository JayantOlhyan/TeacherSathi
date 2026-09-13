"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { 
  BarChart2, 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Award
} from "lucide-react";
import { type AssessmentAnalytics } from "@/lib/repositories/assessments";

export default function AssessmentResultsAnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AssessmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/assessments/${id}/results`);
        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || "Failed to load assessment results");
        }
        const json = await res.json();
        setAnalytics(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading results");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-xs font-bold text-gray-400">
        Loading assessment analytics...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center space-y-4">
        <div className="text-red-600 font-bold text-sm">{error || "Analytics not available"}</div>
        <button
          onClick={() => router.push("/dashboard/assessments")}
          className="text-xs font-bold text-[#14532D] hover:underline"
        >
          Return to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => router.push("/dashboard/assessments")}
          className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-[#14532D]" />
              {analytics.title} — Class Performance
            </h1>
            <p className="text-gray-400 text-xs font-medium mt-1">
              Authoritative student submissions, grading analytics, and question-level difficulty diagnostics.
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Scoreboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-1">
            <span>Submissions</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-gray-800">{analytics.total_submitted}</div>
          <div className="text-[11px] text-gray-400 mt-1">Students completed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-1">
            <span>Class Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#14532D]">{analytics.average_percentage}%</div>
          <div className="text-[11px] text-gray-400 mt-1">Avg Score: {analytics.average_score}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-1">
            <span>Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-black text-gray-800">{analytics.pass_rate_percentage}%</div>
          <div className="text-[11px] text-gray-400 mt-1">Above passing marks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-1">
            <span>Highest Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{analytics.highest_score}</div>
          <div className="text-[11px] text-gray-400 mt-1">Top student marks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-1">
            <span>Lowest Score</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-gray-800">{analytics.lowest_score}</div>
          <div className="text-[11px] text-gray-400 mt-1">Lowest recorded marks</div>
        </div>
      </div>

      {/* Student Roster Submissions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#14532D]" />
          Student Results Ledger
        </h2>

        {analytics.students_breakdown.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-gray-400">
            No students have submitted attempts for this assessment yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] border-y">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Percentage</th>
                  <th className="p-3">Time Taken</th>
                  <th className="p-3">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {analytics.students_breakdown.map((s) => (
                  <tr key={s.student_id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-800">{s.student_name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 font-black text-[#14532D]">{s.score ?? "—"}</td>
                    <td className="p-3 font-bold">{s.percentage != null ? `${s.percentage}%` : "—"}</td>
                    <td className="p-3 text-gray-500 font-mono">
                      {Math.floor(s.time_taken_seconds / 60)}m {s.time_taken_seconds % 60}s
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          s.submission_type === "ON_TIME"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {s.submission_type.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Question-Level Diagnostic Analytics */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#14532D]" />
            Question-Level Difficulty Diagnostics
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Identify challenging concepts where students struggled to target your revision lessons.
          </p>
        </div>

        <div className="space-y-3">
          {analytics.questions_analytics.map((qa) => (
            <div
              key={qa.question_order}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-800">Q {qa.question_order}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700 uppercase">
                    {qa.section}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      qa.difficulty_signal === "HIGH"
                        ? "bg-rose-100 text-rose-800"
                        : qa.difficulty_signal === "MEDIUM"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {qa.difficulty_signal} Difficulty For Class
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-700">{qa.question_text}</p>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-center">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Attempted</div>
                  <div className="text-xs font-black text-gray-800">{qa.attempted_count}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Correct</div>
                  <div className="text-xs font-black text-emerald-700">{qa.correct_count}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Accuracy</div>
                  <div className="text-sm font-black text-[#14532D]">{qa.accuracy_percentage}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
