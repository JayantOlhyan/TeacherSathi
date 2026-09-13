"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Check
} from "lucide-react";
import { 
  type AssessmentAttemptRecord, 
  type AssessmentRecord,
  type AssessmentQuestionRecord
} from "@/lib/repositories/assessments";

export default function StudentAssessmentPlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const assessmentId = params.id as string;
  const assignmentId = searchParams.get("assignmentId");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<AssessmentAttemptRecord | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestionRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student answer state: questionId -> { selected_option, text_answer }
  const [answers, setAnswers] = useState<Record<string, { selected_option: string | null; text_answer: string | null }>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SAVED" | "ERROR">("IDLE");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Remaining time in seconds
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or resume attempt
  useEffect(() => {
    const initAttempt = async () => {
      try {
        setLoading(true);
        // Start or resume attempt via API
        const res = await fetch(`/api/assessments/${assessmentId}/attempts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignment_id: assignmentId }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to start assessment attempt");
        }

        const json = await res.json();
        const att: AssessmentAttemptRecord = json.data;

        // If already submitted, redirect to result
        if (att.status === "SUBMITTED" || att.status === "GRADED") {
          router.push(`/student/assessments/${att.id}/result`);
          return;
        }

        setAttempt(att);
        if (att.assessment) {
          setAssessment(att.assessment);
          const qs = att.assessment.questions || [];
          qs.sort((a, b) => a.question_order - b.question_order);
          setQuestions(qs);
        }

        // Restore saved answers
        const ansMap: Record<string, { selected_option: string | null; text_answer: string | null }> = {};
        (att.answers || []).forEach((a) => {
          ansMap[a.assessment_question_id] = {
            selected_option: a.selected_option,
            text_answer: a.text_answer,
          };
        });
        setAnswers(ansMap);

        // Compute authoritative remaining time
        const durationMins = att.assessment?.duration_minutes || 30;
        const startedAtMs = new Date(att.started_at).getTime();
        const nowMs = Date.now();
        const elapsedSecs = Math.floor((nowMs - startedAtMs) / 1000);
        const totalDurationSecs = durationMins * 60;
        const remaining = Math.max(0, totalDurationSecs - elapsedSecs);
        setRemainingSeconds(remaining);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Error starting assessment");
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      initAttempt();
    }
  }, [assessmentId, assignmentId, router]);

  // Submit attempt handler (declared early to be callable in countdown)
  const handleSubmitFinal = useCallback(async () => {
    if (!attempt) return;
    setIsSubmitting(true);
    try {
      const durationMins = assessment?.duration_minutes || 30;
      const totalSecs = durationMins * 60;
      const timeTaken = remainingSeconds !== null ? Math.max(0, totalSecs - remainingSeconds) : 0;

      const res = await fetch(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time_taken_seconds: timeTaken }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Submission failed");
      }

      router.push(`/student/assessments/${attempt.id}/result`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error finalizing submission");
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  }, [attempt, assessment, remainingSeconds, router]);

  // Countdown timer tick
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Auto submit when timer runs out
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, handleSubmitFinal]);

  // Debounced autosave
  const triggerAutosave = useCallback(
    (questionId: string, selectedOption: string | null, textAnswer: string | null) => {
      if (!attempt) return;
      setSaveStatus("SAVING");

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/attempts/${attempt.id}/answers`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assessment_question_id: questionId,
              selected_option: selectedOption,
              text_answer: textAnswer,
            }),
          });

          if (res.ok) {
            setSaveStatus("SAVED");
          } else {
            setSaveStatus("ERROR");
          }
        } catch {
          setSaveStatus("ERROR");
        }
      }, 500); // 500ms debounce
    },
    [attempt]
  );

  const handleSelectOption = (optionKey: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const updated = {
      selected_option: optionKey,
      text_answer: answers[currentQ.id]?.text_answer || null,
    };

    setAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
    triggerAutosave(currentQ.id, optionKey, updated.text_answer);
  };

  const handleTextAnswerChange = (val: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const updated = {
      selected_option: answers[currentQ.id]?.selected_option || null,
      text_answer: val,
    };

    setAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
    triggerAutosave(currentQ.id, updated.selected_option, val);
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const updated = {
      selected_option: null,
      text_answer: null,
    };

    setAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
    triggerAutosave(currentQ.id, null, null);
  };

  const toggleFlagCurrent = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#14532D] mx-auto" />
          <p className="text-xs font-bold text-gray-500">Loading assessment environment...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !attempt || questions.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-line max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-extrabold text-gray-800">Cannot Open Assessment</h2>
          <p className="text-xs text-gray-500">{errorMessage || "Assessment questions not found."}</p>
          <button
            onClick={() => router.push("/student/assignments")}
            className="w-full bg-[#14532D] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-800"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentSnapshot = currentQ.question_snapshot;
  const currentAnswer = answers[currentQ.id];
  const isAnswered = Boolean(currentAnswer?.selected_option || currentAnswer?.text_answer?.trim());
  const isFlagged = flaggedQuestions.has(currentQ.id);

  // Statistics for submission modal
  const answeredCount = questions.filter(
    (q) => answers[q.id]?.selected_option || answers[q.id]?.text_answer?.trim()
  ).length;
  const unansweredCount = questions.length - answeredCount;

  // Format countdown mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-ink flex flex-col">
      {/* Top Header with Authoritative Timer */}
      <header className="bg-white border-b border-line px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex-1">
          <h1 className="text-base sm:text-lg font-extrabold text-ink line-clamp-1">
            {assessment?.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              {saveStatus === "SAVING" ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                  Saving response...
                </>
              ) : saveStatus === "SAVED" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  Saved
                </>
              ) : saveStatus === "ERROR" ? (
                <span className="text-rose-600 font-bold">Network error saving answer</span>
              ) : (
                "All responses saved"
              )}
            </span>
          </div>
        </div>

        {/* Center Countdown Clock */}
        <div className="flex-1 flex justify-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-xl sm:text-2xl font-black border tracking-wider ${
              remainingSeconds !== null && remainingSeconds < 300
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                : "bg-gray-50 border-gray-200 text-gray-800"
            }`}
          >
            <Clock className="w-5 h-5 text-gray-400" />
            {remainingSeconds !== null ? formatTimer(remainingSeconds) : "00:00"}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-[#14532D] hover:bg-green-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Assessment Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Question Area (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-line rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Question Meta */}
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white bg-gray-800 px-2.5 py-1 rounded-lg">
                  Q {currentIndex + 1}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {currentQ.section} • {currentQ.marks_override ?? currentSnapshot.marks ?? 1} Mark{((currentQ.marks_override ?? currentSnapshot.marks ?? 1) > 1) ? "s" : ""}
                </span>
              </div>

              <button
                onClick={toggleFlagCurrent}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isFlagged
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {isFlagged ? "Flagged for Review" : "Flag Question"}
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold text-ink leading-relaxed">
                {currentSnapshot.text_en}
              </p>
              {currentSnapshot.text_hi && (
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  {currentSnapshot.text_hi}
                </p>
              )}
            </div>

            {/* Options Area (MCQ) or Descriptive Textarea */}
            {currentSnapshot.question_type === "MCQ" && currentSnapshot.options && currentSnapshot.options.length > 0 ? (
              <div className="space-y-3 pt-2">
                {currentSnapshot.options.map((opt) => {
                  const isSelected = currentAnswer?.selected_option === opt.option_key;
                  return (
                    <button
                      key={opt.option_key}
                      onClick={() => handleSelectOption(opt.option_key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all font-semibold ${
                        isSelected
                          ? "border-[#14532D] bg-green-50/50 text-[#14532D] ring-2 ring-[#14532D]/20"
                          : "border-line hover:bg-gray-50 bg-white text-ink"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 border ${
                          isSelected
                            ? "bg-[#14532D] text-white border-[#14532D]"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {opt.option_key}
                      </div>
                      <div className="flex-1 text-sm font-bold">
                        <div>{opt.text_en}</div>
                        {opt.text_hi && <div className="text-xs font-normal text-gray-500 mt-0.5">{opt.text_hi}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-gray-500">Your Written Answer:</label>
                <textarea
                  rows={6}
                  value={currentAnswer?.text_answer || ""}
                  onChange={(e) => handleTextAnswerChange(e.target.value)}
                  placeholder="Type your explanation or multi-step derivation here..."
                  className="w-full border border-line p-4 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#14532D]"
                />
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-line">
              <button
                onClick={handleClearResponse}
                disabled={!isAnswered}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 disabled:opacity-40 cursor-pointer"
              >
                Clear Answer
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-line text-xs font-bold hover:bg-gray-50 disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Navigator Grid Palette */}
        <div className="space-y-4">
          <div className="bg-white border border-line rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Question Navigator
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 border-b pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#14532D]"></span>
                Answered ({answeredCount})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-gray-100 border"></span>
                Unanswered ({unansweredCount})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400"></span>
                Flagged ({flaggedQuestions.size})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border-2 border-gray-900"></span>
                Current
              </div>
            </div>

            {/* Grid Palette */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const hasAnswer = Boolean(ans?.selected_option || ans?.text_answer?.trim());
                const isQFlagged = flaggedQuestions.has(q.id);
                const isCurrent = idx === currentIndex;

                let classes = "h-9 rounded-xl font-bold text-xs flex items-center justify-center relative transition-all ";
                if (isCurrent) {
                  classes += "ring-2 ring-gray-900 ";
                }

                if (hasAnswer) {
                  classes += "bg-[#14532D] text-white ";
                } else {
                  classes += "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 ";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={classes}
                  >
                    {idx + 1}
                    {isQFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#14532D] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-800">Finalize Assessment Submission</h3>
              <p className="text-xs text-gray-500">
                Review your response summary before final evaluation. Once submitted, answers cannot be edited.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border text-center">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Answered</div>
                <div className="text-xl font-black text-[#14532D]">{answeredCount}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Unanswered</div>
                <div className="text-xl font-black text-rose-600">{unansweredCount}</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}.
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-line text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Continue Test
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSubmitFinal}
                className="flex-1 bg-[#14532D] hover:bg-green-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
