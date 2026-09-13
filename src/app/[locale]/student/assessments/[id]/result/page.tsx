"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { 
  Award, 
  ArrowLeft, 
  AlertCircle,
  HelpCircle,
  Check,
  X
} from "lucide-react";
import { type AssessmentResultRecord } from "@/lib/repositories/assessments";

export default function StudentAssessmentResultPage() {
  const params = useParams();
  const attemptId = params.id as string;
  const router = useRouter();

  const [result, setResult] = useState<AssessmentResultRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/results/${attemptId}`);
        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || "Result not found");
        }
        const json = await res.json();
        setResult(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading result");
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchResult();
    }
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center text-xs font-bold text-gray-400">
          Calculating official examination scores...
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-line max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-extrabold text-gray-800">Result Awaiting Evaluation</h2>
          <p className="text-xs text-gray-500">
            {error || "Your attempt has been safely recorded and is awaiting educator review."}
          </p>
          <button
            onClick={() => router.push("/student/assignments")}
            className="w-full bg-[#14532D] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-800 cursor-pointer"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const mins = Math.floor(result.time_taken_seconds / 60);
  const secs = result.time_taken_seconds % 60;

  return (
    <div className="min-h-screen bg-cream font-sans text-ink py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div>
          <button
            onClick={() => router.push("/student/assignments")}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Assignments
          </button>
        </div>

        {/* Scorecard Hero Banner */}
        <div className="bg-white border border-line rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm ${
              result.is_passed
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span
              className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                result.is_passed
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {result.is_passed ? "Assessment Passed" : "Needs Revision"}
            </span>
            <h1 className="text-3xl font-black text-gray-900 mt-2">
              {result.marks_obtained} / {result.total_marks} Marks
            </h1>
            <p className="text-base font-extrabold text-[#14532D]">{result.percentage}% Accuracy</p>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border text-center">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Correct</div>
              <div className="text-lg font-black text-emerald-600 flex items-center justify-center gap-1">
                <Check className="w-4 h-4 stroke-[3]" /> {result.correct_answers}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Incorrect</div>
              <div className="text-lg font-black text-rose-600 flex items-center justify-center gap-1">
                <X className="w-4 h-4 stroke-[3]" /> {result.incorrect_answers}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Unanswered</div>
              <div className="text-lg font-black text-gray-600">{result.unanswered}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Time Taken</div>
              <div className="text-lg font-black text-gray-800 font-mono">
                {mins}m {secs}s
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white border border-line rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-base font-extrabold text-gray-800">Review Questions & Explanations</h2>
            <span className="text-xs font-bold text-gray-400">
              {result.question_breakdown.length} Questions
            </span>
          </div>

          <div className="space-y-4">
            {result.question_breakdown.map((q) => {
              return (
                <div
                  key={q.question_order}
                  className={`p-5 rounded-2xl border transition-all ${
                    q.is_correct
                      ? "border-emerald-200 bg-emerald-50/20"
                      : q.selected_option
                      ? "border-rose-200 bg-rose-50/20"
                      : "border-gray-200 bg-gray-50/30"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-gray-700">Q {q.question_order}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{q.section}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          q.is_correct
                            ? "bg-emerald-100 text-emerald-800"
                            : q.selected_option
                            ? "bg-rose-100 text-rose-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {q.marks_awarded} / {q.max_marks} Marks
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-gray-800 leading-snug">{q.text_en}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">
                        Your Answer:
                      </span>
                      <span
                        className={`font-black ${
                          q.is_correct ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {q.selected_option ? `Option ${q.selected_option}` : "Unanswered"}
                      </span>
                    </div>

                    {q.correct_option && (
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">
                          Correct Key:
                        </span>
                        <span className="font-black text-emerald-700">
                          Option {q.correct_option}
                        </span>
                      </div>
                    )}
                  </div>

                  {q.explanation_en && (
                    <div className="mt-3 p-3 bg-white/80 rounded-xl border border-line/60 text-xs text-gray-600 space-y-1">
                      <div className="font-bold text-[#14532D] flex items-center gap-1 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5" /> Pedagogical Explanation:
                      </div>
                      <p>{q.explanation_en}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
