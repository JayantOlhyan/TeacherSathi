"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  BookOpen,
  ChevronDown,
  BrainCircuit,
  Eye,
  Send,
  X,
  CheckCircle2,
  ShieldAlert,
  Check,
  ArrowRight,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ClassOption {
  id: string;
  name: string;
  section: string;
  grade_id: string;
}

interface ChapterOption {
  id: string;
  title_en: string;
  title_hi: string;
}

interface AffectedStudent {
  studentId: string;
  studentName: string;
  masteryScore: number;
}

interface ConceptMasterySummary {
  conceptId: string;
  conceptNameEn: string;
  conceptNameHi: string;
  chapterId: string;
  chapterTitleEn: string;
  averageMasteryScore: number;
  status: "CRITICAL" | "DEVELOPING" | "APPROACHING" | "PROFICIENT" | "STRONG" | "INSUFFICIENT_EVIDENCE";
  confidence: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_EVIDENCE";
  totalEvidenceCount: number;
  studentsAttemptedCount: number;
  studentsNeedingSupportCount: number;
  observedDifficulty: "EASY" | "MODERATE" | "DIFFICULT" | "VERY_DIFFICULT";
  affectedStudents?: AffectedStudent[];
}

interface StudentGroupItem {
  studentId: string;
  fullName: string;
  averageMasteryScore: number;
  evaluatedConceptsCount: number;
  weakConceptsCount: number;
}

interface DiagnosticReport {
  classId: string;
  className: string;
  section: string;
  gradeId: string;
  studentCount: number;
  overallClassMastery: number;
  conceptMasteries: ConceptMasterySummary[];
  studentGroupings: {
    needsSupport: StudentGroupItem[];
    developing: StudentGroupItem[];
    onTrack: StudentGroupItem[];
  };
  topGaps: Array<{
    conceptId: string;
    conceptNameEn: string;
    averageMasteryScore: number;
    affectedStudentsCount: number;
    recommendedAction: string;
  }>;
}

interface RemediationArtifact {
  title: string;
  concept_name: string;
  grade: string;
  subject: string;
  chapter: string;
  duration_mins: number;
  misconceptions_addressed: string[];
  remediation_steps: Array<{
    step_number: number;
    title: string;
    duration_mins: number;
    teacher_actions: string;
    student_actions: string;
  }>;
  visual_anchor: string;
  practice_questions: Array<{
    question_number: number;
    question_text: string;
    options: Array<{ id: string; text: string; is_correct: boolean }>;
    correct_answer: string;
    explanation: string;
  }>;
  success_criteria: string;
}

interface InterventionRecordItem {
  id: string;
  conceptId: string;
  conceptNameEn?: string;
  title: string;
  type: string;
  status: "DRAFT" | "APPROVED" | "ASSIGNED" | "COMPLETED" | "ARCHIVED";
  assignmentId?: string | null;
  reassessmentAssessmentId?: string | null;
  createdAt: string;
}

export default function TeacherAnalyticsPage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [activeGroupTab, setActiveGroupTab] = useState<"NEEDS_SUPPORT" | "DEVELOPING" | "ON_TRACK">("NEEDS_SUPPORT");
  const [entitlementBlocked, setEntitlementBlocked] = useState(false);

  // Remediation Modal State
  const [activeRemediationConcept, setActiveRemediationConcept] = useState<ConceptMasterySummary | null>(null);
  const [remediationArtifact, setRemediationArtifact] = useState<RemediationArtifact | null>(null);
  const [generatingRemediation, setGeneratingRemediation] = useState(false);
  const [currentInterventionId, setCurrentInterventionId] = useState<string | null>(null);
  const [currentInterventionStatus, setCurrentInterventionStatus] = useState<string>("DRAFT");
  const [assigningIntervention, setAssigningIntervention] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Affected Students Inspector Modal
  const [inspectingConcept, setInspectingConcept] = useState<ConceptMasterySummary | null>(null);

  // Active Interventions List
  const [classInterventions, setClassInterventions] = useState<InterventionRecordItem[]>([]);

  // 1. Load Classes on Mount
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setClasses(json.data);
            setSelectedClassId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    }
    loadClasses();
  }, []);

  // 2. Load Chapters on Mount
  useEffect(() => {
    async function loadChapters() {
      try {
        const res = await fetch("/api/curriculum?type=chapters");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setChapters(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load chapters:", err);
      }
    }
    loadChapters();
  }, []);

  // 3. Fetch Class Diagnostic Report & Active Interventions
  const fetchReport = async () => {
    if (!selectedClassId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setEntitlementBlocked(false);
    try {
      let url = `/api/analytics/class/${selectedClassId}`;
      if (selectedChapterId) {
        url += `?chapterId=${selectedChapterId}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setReport(json.data || null);
      } else if (res.status === 403) {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.code === "ENTITLEMENT_REQUIRED") {
          setEntitlementBlocked(true);
        }
        setReport(null);
      } else {
        setReport(null);
      }

      // Fetch interventions for class
      const intRes = await fetch(`/api/interventions?classId=${selectedClassId}`);
      if (intRes.ok) {
        const intJson = await intRes.json();
        setClassInterventions(intJson.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch analytics report:", err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, selectedChapterId]);

  // Recompute Class Analytics
  const handleRecompute = async () => {
    if (!selectedClassId) return;
    setRecomputing(true);
    try {
      const res = await fetch("/api/analytics/recompute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClassId }),
      });
      if (res.ok) {
        await fetchReport();
      }
    } catch (err) {
      console.error("Recomputation error:", err);
    } finally {
      setRecomputing(false);
    }
  };

  // Generate Remediation Action
  const handleOpenRemediation = async (concept: ConceptMasterySummary) => {
    setActiveRemediationConcept(concept);
    setRemediationArtifact(null);
    setCurrentInterventionId(null);
    setCurrentInterventionStatus("DRAFT");
    setGeneratingRemediation(true);
    setActionSuccessMessage(null);

    try {
      const res = await fetch("/api/analytics/interventions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptId: concept.conceptId,
          chapterId: concept.chapterId,
          gradeId: report?.gradeId || "class-10",
          subjectId: "science",
          observedWeakness: `${concept.studentsNeedingSupportCount} students scored below 60% (average mastery: ${concept.averageMasteryScore}%)`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setRemediationArtifact(json.data);
        if (json.intervention) {
          setCurrentInterventionId(json.intervention.id);
          setCurrentInterventionStatus(json.intervention.status || "DRAFT");
        }
      }
    } catch (err) {
      console.error("Failed to generate remediation:", err);
    } finally {
      setGeneratingRemediation(false);
    }
  };

  // Approve Intervention Draft
  const handleApproveIntervention = async () => {
    if (!currentInterventionId) return;
    try {
      const res = await fetch(`/api/interventions/${currentInterventionId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setCurrentInterventionStatus("APPROVED");
        setActionSuccessMessage("Intervention approved! Ready to assign to students.");
      }
    } catch (err) {
      console.error("Failed to approve intervention:", err);
    }
  };

  // Assign Intervention & Create Reassessment
  const handleAssignIntervention = async () => {
    if (!currentInterventionId || !selectedClassId) return;
    setAssigningIntervention(true);
    try {
      const res = await fetch(`/api/interventions/${currentInterventionId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClassId,
          timeLimitMinutes: 15,
        }),
      });

      if (res.ok) {
        setCurrentInterventionStatus("ASSIGNED");
        setActionSuccessMessage("Reassessment assessment and assignment created! The learning gap is now in remediation.");
        await fetchReport();
      }
    } catch (err) {
      console.error("Failed to assign intervention:", err);
    } finally {
      setAssigningIntervention(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "STRONG":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "PROFICIENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "APPROACHING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DEVELOPING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">High Confidence</span>;
      case "MEDIUM":
        return <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Medium Confidence</span>;
      case "LOW":
        return <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Low Confidence</span>;
      default:
        return <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Insufficient Data</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-emerald-200/60">
              Academic Intelligence
            </span>
            <span className="text-xs font-bold text-emerald-700">Phase 6 Production Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Class Diagnostic, Concept Mastery & Intervention Hub
          </h1>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Evidence-based pedagogical intelligence. Pinpoint which concepts are causing difficulty across the classroom and assign teacher-approved interventions.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Selector */}
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="appearance-none bg-[#FDFBF7] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 cursor-pointer shadow-sm"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Sec {c.section})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Chapter Selector */}
          <div className="relative">
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="appearance-none bg-[#FDFBF7] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 cursor-pointer shadow-sm"
            >
              <option value="">All Syllabus Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title_en}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Recompute Sync Button */}
          <Button
            onClick={handleRecompute}
            disabled={recomputing || loading}
            variant="outline"
            className="text-xs font-bold border-gray-200 hover:bg-gray-50 flex items-center gap-2 rounded-xl py-2.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recomputing ? "animate-spin text-emerald-600" : "text-gray-600"}`} />
            {recomputing ? "Syncing..." : "Sync Analytics"}
          </Button>
        </div>
      </div>

      {/* Plan Entitlement Gate Banner */}
      {entitlementBlocked && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">Diagnostic Intelligence Gated</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Class cohort matrices and AI-powered remediation require an active School Starter or Pro subscription.
              </p>
            </div>
          </div>
          <Link href="/pricing">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-5 py-2 rounded-xl">
              Upgrade School Plan
            </Button>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3" />
          <p className="text-sm font-bold text-gray-600">Calculating deterministic concept masteries...</p>
        </div>
      ) : !report || report.studentCount === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Diagnostic Data Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Assign your first NCERT assessment to this class to begin tracking concept-level student performance and learning gaps.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/assessments/create">
              <Button className="bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm">
                Create & Assign Assessment
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Executive Diagnostic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Class Mastery Score</p>
                <h3 className="text-3xl font-black text-gray-900 mt-0.5">
                  {report.overallClassMastery}%
                </h3>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  Across {report.conceptMasteries.length} evaluated concepts
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Students Needing Support</p>
                <h3 className="text-3xl font-black text-red-600 mt-0.5">
                  {report.studentGroupings.needsSupport.length} <span className="text-sm text-gray-400 font-normal">/ {report.studentCount}</span>
                </h3>
                <p className="text-xs text-red-700 font-medium mt-1">
                  Scored &lt;60% across current chapter concepts
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Interventions</p>
                <h3 className="text-3xl font-black text-blue-900 mt-0.5">
                  {classInterventions.length}
                </h3>
                <p className="text-xs text-blue-700 font-medium mt-1">
                  {classInterventions.filter((i) => i.status === "ASSIGNED").length} currently in reassessment
                </p>
              </div>
            </div>
          </div>

          {/* Top Class Learning Gaps */}
          {report.topGaps.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Highest-Priority Concept Learning Gaps
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Concepts where student cohort accuracy is lowest and immediate re-teaching is recommended.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {report.topGaps.map((gap, idx) => (
                  <div
                    key={gap.conceptId}
                    className="p-5 rounded-2xl border border-red-100 bg-red-50/40 flex flex-col justify-between gap-3 hover:border-red-200 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-800">
                          Priority #{idx + 1}
                        </span>
                        <span className="text-xs font-black text-red-600">
                          {gap.averageMasteryScore}% Mastery
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-2">
                        {gap.conceptNameEn}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {gap.affectedStudentsCount} student(s) below proficiency threshold
                      </p>
                    </div>

                    <div className="pt-2 border-t border-red-100/60 flex items-center justify-between gap-2">
                      <Button
                        onClick={() => {
                          const concept = report.conceptMasteries.find((c) => c.conceptId === gap.conceptId);
                          if (concept) setInspectingConcept(concept);
                        }}
                        size="sm"
                        variant="outline"
                        className="text-[11px] font-bold border-red-200 text-red-800 hover:bg-red-100/50 rounded-xl px-2.5 py-1"
                      >
                        <Users className="w-3 h-3 mr-1" /> Students
                      </Button>

                      <Button
                        onClick={() => {
                          const concept = report.conceptMasteries.find((c) => c.conceptId === gap.conceptId);
                          if (concept) handleOpenRemediation(concept);
                        }}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-amber-200" />
                        Remediate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Class Interventions Ledger */}
          {classInterventions.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Active Class Interventions & Reassessment Status
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Targeted activities assigned to address diagnosed learning gaps.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400 bg-[#FDFBF7]">
                      <th className="py-3 px-4">Intervention Title</th>
                      <th className="py-3 px-4">Concept</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {classInterventions.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {item.conceptNameEn || "Curriculum Concept"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              item.status === "ASSIGNED"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "APPROVED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {item.assignmentId ? (
                            <Link href="/dashboard/reports">
                              <Button size="sm" variant="outline" className="text-[11px] font-bold rounded-xl py-1 px-3">
                                View Submissions <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Draft</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Student Cohort Segmentations */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Student Mastery Cohort Groupings
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Educational segmentation designed for targeted instructional intervention (no public rankings).
                </p>
              </div>

              {/* Grouping Tabs */}
              <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 text-xs font-bold">
                <button
                  onClick={() => setActiveGroupTab("NEEDS_SUPPORT")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${activeGroupTab === "NEEDS_SUPPORT" ? "bg-red-600 text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Needs Support ({report.studentGroupings.needsSupport.length})
                </button>
                <button
                  onClick={() => setActiveGroupTab("DEVELOPING")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${activeGroupTab === "DEVELOPING" ? "bg-amber-600 text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Developing ({report.studentGroupings.developing.length})
                </button>
                <button
                  onClick={() => setActiveGroupTab("ON_TRACK")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${activeGroupTab === "ON_TRACK" ? "bg-[#14532D] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                >
                  On Track ({report.studentGroupings.onTrack.length})
                </button>
              </div>
            </div>

            {/* Render Active Student Cohort List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {(activeGroupTab === "NEEDS_SUPPORT"
                ? report.studentGroupings.needsSupport
                : activeGroupTab === "DEVELOPING"
                ? report.studentGroupings.developing
                : report.studentGroupings.onTrack
              ).map((student) => (
                <div
                  key={student.studentId}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#FDFBF7] flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">{student.fullName}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {student.evaluatedConceptsCount} concepts • {student.weakConceptsCount} weak
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-gray-800">
                      {student.averageMasteryScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Granular Concept Mastery Matrix */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Atomic Concept Mastery Matrix
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calculated using 65/35 recency-decay formula. All scores reflect ground-truth student responses.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400 bg-[#FDFBF7]">
                    <th className="py-3.5 px-4">Concept Name</th>
                    <th className="py-3.5 px-4">Chapter</th>
                    <th className="py-3.5 px-4">Mastery Score</th>
                    <th className="py-3.5 px-4">Confidence</th>
                    <th className="py-3.5 px-4">Students Needing Support</th>
                    <th className="py-3.5 px-4">Observed Difficulty</th>
                    <th className="py-3.5 px-4 text-right">Pedagogical Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {report.conceptMasteries.map((c) => (
                    <tr key={c.conceptId} className="hover:bg-[#FDFBF7] transition-all">
                      <td className="py-4 px-4 font-bold text-gray-800">
                        <div>{c.conceptNameEn}</div>
                        {c.conceptNameHi && <div className="text-xs text-gray-400 font-normal">{c.conceptNameHi}</div>}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-600">
                        {c.chapterTitleEn}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${getStatusColor(c.status)}`}>
                            {c.averageMasteryScore}%
                          </span>
                          <span className="text-xs text-gray-400">({c.status})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getConfidenceBadge(c.confidence)}
                      </td>
                      <td className="py-4 px-4 text-xs font-bold">
                        {c.studentsNeedingSupportCount > 0 ? (
                          <button
                            onClick={() => setInspectingConcept(c)}
                            className="text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Users className="w-3 h-3" />
                            {c.studentsNeedingSupportCount} / {c.studentsAttemptedCount || report.studentCount} students
                          </button>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            0 students struggling
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-gray-700">
                        <span className="capitalize">{c.observedDifficulty.toLowerCase()}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          onClick={() => handleOpenRemediation(c)}
                          size="sm"
                          className="bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          Remediate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Affected Students Inspector Modal */}
      {inspectingConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-cream">
              <div>
                <span className="text-[11px] font-black uppercase text-red-700 tracking-wider">
                  Students Needing Support
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-0.5">
                  {inspectingConcept.conceptNameEn}
                </h3>
                <p className="text-xs text-gray-500">
                  Average concept score: {inspectingConcept.averageMasteryScore}%
                </p>
              </div>
              <button
                onClick={() => setInspectingConcept(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {inspectingConcept.affectedStudents && inspectingConcept.affectedStudents.length > 0 ? (
                inspectingConcept.affectedStudents.map((st) => (
                  <div
                    key={st.studentId}
                    className="p-3.5 rounded-2xl border border-red-100 bg-red-50/40 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{st.studentName}</p>
                      <p className="text-[11px] text-red-600">Requires targeted intervention</p>
                    </div>
                    <span className="text-xs font-black text-red-700 bg-white border border-red-200 px-2 py-0.5 rounded-lg">
                      {st.masteryScore}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-gray-500">
                  All students are performing on track for this concept.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <Button
                onClick={() => setInspectingConcept(null)}
                variant="outline"
                className="text-xs font-bold rounded-xl"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const c = inspectingConcept;
                  setInspectingConcept(null);
                  handleOpenRemediation(c);
                }}
                className="bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Generate Remediation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Remediation & Intervention Generator / Review Modal */}
      {activeRemediationConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-cream">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                    Targeted Learning Intervention
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      currentInterventionStatus === "ASSIGNED"
                        ? "bg-blue-100 text-blue-800"
                        : currentInterventionStatus === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {currentInterventionStatus === "DRAFT" ? "Draft (Teacher Review)" : currentInterventionStatus}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                  {activeRemediationConcept.conceptNameEn}
                </h3>
                <p className="text-xs text-gray-500">
                  Concept Mastery: {activeRemediationConcept.averageMasteryScore}% • {activeRemediationConcept.studentsNeedingSupportCount} students need intervention
                </p>
              </div>
              <button
                onClick={() => setActiveRemediationConcept(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {actionSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {generatingRemediation ? (
                <div className="py-16 text-center space-y-3">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
                  <p className="font-bold text-gray-800">Generating targeted 15-minute remediation activity...</p>
                  <p className="text-xs text-gray-400">Synthesizing visual anchor and 5-question reassessment check.</p>
                </div>
              ) : remediationArtifact ? (
                <div className="space-y-6">
                  {/* Misconceptions Clarified */}
                  <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100/80">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" /> Diagnosed Misconceptions
                    </h4>
                    <ul className="mt-2 space-y-1 text-xs text-red-800 list-disc list-inside">
                      {remediationArtifact.misconceptions_addressed.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Anchor sketch prompt */}
                  <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100/80">
                    <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-600" /> Smartboard Visual Anchor
                    </h4>
                    <p className="mt-1 text-xs text-amber-900 font-medium">
                      {remediationArtifact.visual_anchor}
                    </p>
                  </div>

                  {/* 15-Minute Teaching Steps */}
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">
                      15-Minute Remedial Instruction Plan
                    </h4>
                    <div className="space-y-3">
                      {remediationArtifact.remediation_steps.map((s) => (
                        <div key={s.step_number} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                            <span>Step {s.step_number}: {s.title}</span>
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{s.duration_mins} mins</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong className="text-gray-700">Teacher Action:</strong> {s.teacher_actions}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            <strong className="text-gray-700">Student Action:</strong> {s.student_actions}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5-Question Practice Check */}
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">
                      5-Question Reassessment Practice Check
                    </h4>
                    <div className="space-y-3">
                      {remediationArtifact.practice_questions.map((q) => (
                        <div key={q.question_number} className="bg-[#FDFBF7] p-4 rounded-2xl border border-gray-100 text-xs">
                          <p className="font-bold text-gray-800">
                            Q{q.question_number}. {q.question_text}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt) => (
                              <div
                                key={opt.id}
                                className={`p-2 rounded-xl border ${opt.is_correct ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900" : "bg-white border-gray-200 text-gray-700"}`}
                              >
                                {opt.id}. {opt.text}
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-2">
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer with Teacher Approval & Assignment Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <Button
                onClick={() => setActiveRemediationConcept(null)}
                variant="outline"
                className="text-xs font-bold rounded-xl"
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {currentInterventionStatus === "DRAFT" && (
                  <Button
                    onClick={handleApproveIntervention}
                    variant="outline"
                    className="text-xs font-bold border-emerald-600 text-emerald-800 hover:bg-emerald-50 rounded-xl flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Plan
                  </Button>
                )}

                <Button
                  onClick={handleAssignIntervention}
                  disabled={assigningIntervention || currentInterventionStatus === "ASSIGNED"}
                  className="bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {assigningIntervention
                    ? "Assigning..."
                    : currentInterventionStatus === "ASSIGNED"
                    ? "Assigned to Class"
                    : "Approve & Assign Reassessment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
