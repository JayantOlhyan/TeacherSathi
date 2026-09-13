"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  Award,
  BookOpen,
  Sparkles,
  Target,
  CheckCircle2,
  ArrowRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConceptMasteryItem {
  id?: string;
  studentId: string;
  conceptId: string;
  conceptNameEn?: string;
  conceptNameHi?: string;
  chapterId: string;
  chapterTitleEn?: string;
  subjectId: string;
  gradeId: string;
  masteryScore: number;
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_EVIDENCE";
  evidenceCount: number;
  correctCount: number;
  incorrectCount: number;
  status: "CRITICAL" | "DEVELOPING" | "APPROACHING" | "PROFICIENT" | "STRONG" | "INSUFFICIENT_EVIDENCE";
  lastAssessedAt?: string | null;
  trend?: Array<{
    masteryScore: number;
    calculatedAt: string;
  }>;
}

interface LearningGapItem {
  id?: string;
  conceptId: string;
  conceptNameEn?: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "ON_TRACK";
  masteryScore: number;
  confidenceLevel: string;
  recommendedAction?: string | null;
}

interface StudentInterventionItem {
  id: string;
  conceptId: string;
  conceptNameEn?: string;
  title: string;
  status: "ASSIGNED" | "COMPLETED";
  reassessmentAssessmentId?: string | null;
  createdAt: string;
}

interface StudentMasteryProfile {
  studentId: string;
  fullName: string;
  overallMastery: number;
  evaluatedConceptsCount: number;
  conceptMasteries: ConceptMasteryItem[];
  activeGaps: LearningGapItem[];
  interventions?: StudentInterventionItem[];
  recentImprovements: Array<{
    conceptId: string;
    conceptNameEn: string;
    previousScore: number;
    currentScore: number;
    delta: number;
  }>;
}

export default function StudentProgressPage() {
  const [profile, setProfile] = useState<StudentMasteryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string>("science");

  useEffect(() => {
    async function loadStudentProfile() {
      try {
        // Fetch current authenticated user's ID
        const userRes = await fetch("/api/profile");
        if (!userRes.ok) {
          setLoading(false);
          return;
        }
        const userJson = await userRes.json();
        const studentId = userJson.data?.id;

        if (studentId) {
          const res = await fetch(`/api/analytics/student/${studentId}?subjectId=${activeSubject}`);
          if (res.ok) {
            const json = await res.json();
            setProfile(json.data || null);
          }
        }
      } catch (err) {
        console.error("Failed to load student progress profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentProfile();
  }, [activeSubject]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "STRONG":
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">Mastered</span>;
      case "PROFICIENT":
        return <span className="bg-green-100 text-green-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">Proficient</span>;
      case "APPROACHING":
        return <span className="bg-yellow-100 text-yellow-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">On Track</span>;
      case "DEVELOPING":
        return <span className="bg-orange-100 text-orange-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">Needs Practice</span>;
      case "CRITICAL":
        return <span className="bg-red-100 text-red-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">Needs Support</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[11px] font-black px-2.5 py-0.5 rounded-full">Starting</span>;
    }
  };

  const assignedInterventions = profile?.interventions?.filter((i) => i.status === "ASSIGNED") || [];
  const completedInterventions = profile?.interventions?.filter((i) => i.status === "COMPLETED") || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-4">
          <Link
            href="/student/assignments"
            className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            My Assignments
          </Link>
          <span className="text-sm font-black text-[#14532D] border-b-2 border-[#14532D] pb-3 -mb-3.5">
            My Learning Progress
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-emerald-200/60">
            Personal Learning Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            What You Understand & Where to Practice Next
          </h1>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Calculated from your verified quiz and test responses. Watch your concept mastery grow as you complete practice activities!
          </p>
        </div>

        {/* Subject Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveSubject("science")}
            className={`px-4 py-2 rounded-xl transition-all ${activeSubject === "science" ? "bg-[#14532D] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
          >
            Science
          </button>
          <button
            onClick={() => setActiveSubject("mathematics")}
            className={`px-4 py-2 rounded-xl transition-all ${activeSubject === "mathematics" ? "bg-[#14532D] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
          >
            Mathematics
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3" />
          <p className="text-sm font-bold text-gray-600">Loading your academic profile...</p>
        </div>
      ) : !profile || profile.evaluatedConceptsCount === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Assessment Data Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Complete your first NCERT quiz or classroom test to start tracking your concept mastery and learning progress.
          </p>
          <div className="pt-2">
            <Link href="/student/assignments">
              <Button className="bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm">
                View Assigned Assessments
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overall Subject Mastery</p>
                <h3 className="text-3xl font-black text-gray-900 mt-0.5">
                  {profile.overallMastery}%
                </h3>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  Across {profile.evaluatedConceptsCount} concepts evaluated
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Improvements</p>
                <h3 className="text-3xl font-black text-blue-900 mt-0.5">
                  +{profile.recentImprovements.length}
                </h3>
                <p className="text-xs text-blue-700 font-medium mt-1">
                  {profile.recentImprovements.length > 0 ? "Concepts showing strong growth" : "Complete more tests to see trends"}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Practice Areas</p>
                <h3 className="text-3xl font-black text-amber-900 mt-0.5">
                  {profile.activeGaps.length}
                </h3>
                <p className="text-xs text-amber-700 font-medium mt-1">
                  Concepts needing a quick review
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Practice & Reassessments (Section 27) */}
          {assignedInterventions.length > 0 && (
            <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" /> Assigned Reassessments & Practice Checks
                  </h3>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Targeted practice assigned by your teacher to boost your mastery!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedInterventions.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-blue-200/60 shadow-xs flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {item.conceptNameEn || "Concept Review"}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1.5">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        5 quick questions designed to demonstrate concept recovery.
                      </p>
                    </div>

                    {item.reassessmentAssessmentId ? (
                      <Link href={`/student/assessments/${item.reassessmentAssessmentId}/attempt`}>
                        <Button className="w-full bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5">
                          Launch Practice Check <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/student/assignments">
                        <Button variant="outline" className="w-full text-xs font-bold py-2 rounded-xl">
                          View in Assignments
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Focus Recommendations */}
          {profile.activeGaps.length > 0 && (
            <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80 space-y-3">
              <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-700" /> Focus Areas for This Week
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                {profile.activeGaps.map((gap) => (
                  <div key={gap.conceptId} className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-xs">
                    <h4 className="text-sm font-bold text-gray-900">{gap.conceptNameEn}</h4>
                    <p className="text-xs text-amber-700 font-bold mt-1">Current Mastery: {gap.masteryScore}%</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      A little more practice needed here to hit proficiency!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Interventions */}
          {completedInterventions.length > 0 && (
            <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200/60 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <strong className="font-bold">Great work!</strong> You have completed {completedInterventions.length} practice reassessment(s), improving your concept mastery trajectory.
              </div>
            </div>
          )}

          {/* Concept Mastery List with Historical Trajectories */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-900">Concept Mastery Details & Progress Trajectory</h2>
            <div className="divide-y divide-gray-100">
              {profile.conceptMasteries.map((cm) => (
                <div key={cm.conceptId} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900">{cm.conceptNameEn}</h4>
                      {getStatusBadge(cm.status)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {cm.chapterTitleEn} • Based on {cm.evidenceCount} questions ({cm.correctCount} correct)
                    </p>
                  </div>

                  {/* Progress Bar & Trend */}
                  <div className="flex items-center gap-6">
                    {/* Historical Trend Stepper */}
                    {cm.trend && cm.trend.length > 1 && (
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <span>Trend:</span>
                        {cm.trend.map((step, idx) => (
                          <span key={idx} className="inline-flex items-center">
                            <span className={idx === cm.trend!.length - 1 ? "text-emerald-700 font-black" : "text-gray-400"}>
                              {step.masteryScore}%
                            </span>
                            {idx < cm.trend!.length - 1 && <span className="text-gray-300 mx-1">→</span>}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="w-36 text-right space-y-1">
                      <span className="text-lg font-black text-gray-900">{cm.masteryScore}%</span>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cm.masteryScore >= 75 ? "bg-emerald-600" : cm.masteryScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${cm.masteryScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
