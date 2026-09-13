"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Award
} from "lucide-react";

interface StudentAssignmentItem {
  id: string;
  assessment_id: string;
  assigned_at: string;
  due_at: string | null;
  status: string;
  attempt_status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED";
  attempt_id?: string;
  score?: number | null;
  percentage?: number | null;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    assessment_type: string;
    duration_minutes: number;
    total_marks: number;
    grade_id: string;
    subject_id: string;
  };
  class?: {
    id: string;
    name: string;
    section: string;
  };
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<StudentAssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ALL" | "UPCOMING" | "IN_PROGRESS" | "COMPLETED">("ALL");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/assignments");
        if (res.ok) {
          const json = await res.json();
          setAssignments(json.data || []);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const filtered = assignments.filter((a) => {
    if (tab === "ALL") return true;
    if (tab === "UPCOMING") return a.attempt_status === "NOT_STARTED";
    if (tab === "IN_PROGRESS") return a.attempt_status === "IN_PROGRESS";
    if (tab === "COMPLETED") return a.attempt_status === "SUBMITTED" || a.attempt_status === "GRADED";
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 p-4">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-[#14532D] border-b-2 border-[#14532D] pb-3 -mb-3.5">
            My Assignments
          </span>
          <Link
            href="/student/progress"
            className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            My Learning Progress
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#14532D]" />
            My Class Assignments & Tests
          </h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Official chapter tests, quizzes, and homework assigned by your school educators.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {(["ALL", "UPCOMING", "IN_PROGRESS", "COMPLETED"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t
                ? "bg-[#14532D] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t === "ALL" ? "All Tasks" : t.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border text-center text-xs font-bold text-gray-400">
          Loading assigned tests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#14532D] flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">No assignments found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You are all caught up! New tests and quizzes assigned by your subject teachers will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isCompleted = item.attempt_status === "SUBMITTED" || item.attempt_status === "GRADED";
            const isInProgress = item.attempt_status === "IN_PROGRESS";

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {item.class ? `${item.class.name}-${item.class.section}` : "Class"} • {item.assessment.subject_id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : isInProgress
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {item.attempt_status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-800 text-sm leading-snug">
                    {item.assessment.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {item.assessment.duration_minutes} Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      {item.assessment.total_marks} Marks
                    </span>
                    {item.due_at && (
                      <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(item.due_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium">Your Score: </span>
                        <span className="font-black text-[#14532D]">
                          {item.score ?? "—"} / {item.assessment.total_marks} ({item.percentage ?? 0}%)
                        </span>
                      </div>
                      {item.attempt_id && (
                        <Link
                          href={`/student/assessments/${item.attempt_id}/result`}
                          className="text-xs font-bold text-[#14532D] hover:underline flex items-center gap-1"
                        >
                          View Result <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/student/assessments/${item.assessment_id}/attempt?assignmentId=${item.id}${
                        item.attempt_id ? `&attemptId=${item.attempt_id}` : ""
                      }`}
                      className="w-full bg-[#14532D] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isInProgress ? "Resume Test" : "Start Test"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
