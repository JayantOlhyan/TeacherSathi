"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  CheckSquare, 
  PlusCircle, 
  BarChart2, 
  Users, 
  Send, 
  Trash2, 
  CheckCircle2
} from "lucide-react";
import { type AssessmentRecord } from "@/lib/repositories/assessments";

export default function TeacherAssessmentsListPage() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT" | "CLOSED">("ALL");
  const [assignModalAssessmentId, setAssignModalAssessmentId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Array<{ id: string; name: string; section: string }>>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Load teacher assessments
  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/assessments");
      if (res.ok) {
        const json = await res.json();
        setAssessments(json.data || []);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  // Load classes
  useEffect(() => {
    fetchAssessments();
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const json = await res.json();
          setClasses(json.data || []);
          if (json.data?.length > 0) setSelectedClassId(json.data[0].id);
        }
      } catch {
        // fallback
      }
    };
    fetchClasses();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/assessments/${id}/publish`, { method: "POST" });
      if (res.ok) {
        fetchAssessments();
      }
    } catch {
      // fallback
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this draft assessment?")) return;
    try {
      const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAssessments();
      }
    } catch {
      // fallback
    }
  };

  const handleAssign = async () => {
    if (!assignModalAssessmentId || !selectedClassId) return;
    setIsAssigning(true);
    try {
      const res = await fetch(`/api/assessments/${assignModalAssessmentId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: selectedClassId,
          due_at: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });
      if (res.ok) {
        setAssignModalAssessmentId(null);
        alert("Assessment successfully assigned to class!");
      }
    } catch {
      // fallback
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredAssessments = assessments.filter((a) => {
    if (filter === "ALL") return true;
    return a.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#14532D]" />
            Assessments & Class Tests
          </h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Create, assign, and track student tests, MCQ quizzes, and CBSE chapter assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/assessments/create"
            className="bg-[#14532D] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-green-800 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create Assessment
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["ALL", "PUBLISHED", "DRAFT", "CLOSED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? "bg-[#14532D] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab === "ALL" ? "All Assessments" : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border text-center text-xs font-bold text-gray-400">
          Loading assessments...
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#14532D] flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">No assessments found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              You haven&apos;t created any assessments under this filter yet. Use the assessment builder to create your first test.
            </p>
          </div>
          <Link
            href="/dashboard/assessments/create"
            className="inline-flex items-center gap-2 bg-[#14532D] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-green-800 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Build New Assessment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssessments.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      a.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : a.status === "CLOSED"
                        ? "bg-gray-100 text-gray-600 border border-gray-200"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {a.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {a.assessment_type.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-800 text-sm leading-snug line-clamp-2">
                  {a.title}
                </h3>
                {a.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.description}</p>
                )}

                <div className="grid grid-cols-3 gap-2 mt-4 py-2 border-y border-gray-50 text-center">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Marks</div>
                    <div className="text-xs font-black text-[#14532D]">{a.total_marks}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Questions</div>
                    <div className="text-xs font-black text-gray-800">
                      {a.questions?.length || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Duration</div>
                    <div className="text-xs font-black text-gray-800">{a.duration_minutes}m</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                {a.status === "DRAFT" ? (
                  <>
                    <button
                      onClick={() => handlePublish(a.id)}
                      className="flex-1 bg-[#14532D] text-white py-2 rounded-xl text-xs font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Publish
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setAssignModalAssessmentId(a.id)}
                      className="flex-1 bg-emerald-50 text-emerald-800 border border-emerald-200 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Assign
                    </button>
                    <Link
                      href={`/dashboard/assessments/${a.id}/results`}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      Results
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign to Class Modal */}
      {assignModalAssessmentId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#14532D]" />
              Assign Assessment to Class Section
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Select Enrolled Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Section {c.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Due Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setAssignModalAssessmentId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={isAssigning}
                onClick={handleAssign}
                className="bg-[#14532D] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-green-800 transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isAssigning ? "Assigning..." : "Assign Assessment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
