"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Flag, ArrowRight, ArrowLeft, CheckCircle2, Clock, Award } from "lucide-react";
import { getChapterDetails } from "@/lib/data/chapters";

interface QuestionItem {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation: string;
  marks: number;
}

export default function ChapterTestPage() {
  const params = useParams();
  const router = useRouter();
  const grade = params.grade as string;
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [remainingSeconds, setRemainingSeconds] = useState(1800); // 30 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const cleanSubject = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "Science";
  const cleanChapterNum = chapter ? chapter.replace("chapter-", "") : "1";
  const chapterDetails = getChapterDetails(grade, subject, chapter);

  useEffect(() => {
    // Attempt loading real chapter questions from public or API
    const loadQuestions = async () => {
      try {
        const filename = `${grade}-${subject}-${chapter}.json`.toLowerCase();
        const res = await fetch(`/quizzes/${filename}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            const mapped = data.questions.map((q: { id?: string; question: string; options?: Array<{ id: string; text: string }>; correctAnswerId?: string; explanation?: string }, idx: number) => ({
              id: q.id || `q-${idx}`,
              question: q.question,
              options: q.options || [],
              correctOptionId: q.correctAnswerId || "A",
              explanation: q.explanation || "Refer to NCERT textbook.",
              marks: 2,
            }));
            setQuestions(mapped);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback
      }

      // Fallback default canonical chapter test questions for this chapter
      const fallbackQuestions: QuestionItem[] = [
        {
          id: "q-1",
          question: `What is the foundational principle studied in ${chapterDetails.title}?`,
          options: [
            { id: "A", text: "Fundamental biological & physical laws governed by NCERT" },
            { id: "B", text: "Unrelated observational phenomena" },
            { id: "C", text: "Secondary experimental assumptions" },
            { id: "D", text: "None of the above" },
          ],
          correctOptionId: "A",
          explanation: `Fundamental conceptual foundations of ${chapterDetails.title}.`,
          marks: 2,
        },
        {
          id: "q-2",
          question: "Which observation provides direct evidence supporting this chapter's core law?",
          options: [
            { id: "A", text: "Repeatable standard laboratory experiments" },
            { id: "B", text: "Theoretical speculation without empirical testing" },
            { id: "C", text: "Random environmental fluctuations" },
            { id: "D", text: "Hypothetical models only" },
          ],
          correctOptionId: "A",
          explanation: "Scientific inquiry relies on reproducible laboratory verification.",
          marks: 2,
        },
        {
          id: "q-3",
          question: "How does the NCERT exemplar classify the primary application of this topic?",
          options: [
            { id: "A", text: "Direct real-world technological and biological applications" },
            { id: "B", text: "Theoretical interest only" },
            { id: "C", text: "Obsolete historical concepts" },
            { id: "D", text: "Non-standard hypotheses" },
          ],
          correctOptionId: "A",
          explanation: "NEP 2020 emphasizes competency-based practical learning.",
          marks: 2,
        },
      ];
      setQuestions(fallbackQuestions);
      setLoading(false);
    };

    loadQuestions();
  }, [grade, subject, chapter, chapterDetails.title]);

  const handleSubmitTest = useCallback(() => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        calculatedScore += q.marks;
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
  }, [questions, selectedAnswers]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, remainingSeconds, handleSubmitTest]);

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    const q = questions[currentIndex];
    if (q) {
      setSelectedAnswers((prev) => ({ ...prev, [q.id]: optId }));
    }
  };

  const toggleFlag = (idx: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const currentQ = questions[currentIndex];
  const selectedOpt = currentQ ? selectedAnswers[currentQ.id] : null;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-xs font-bold text-gray-500">Loading Chapter Assessment...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-ink flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-line px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex-1">
          <h1 className="text-base sm:text-xl font-extrabold text-ink">
            TeacherSathi NCERT Chapter Test — {cleanSubject} (Ch. {cleanChapterNum})
          </h1>
          <p className="text-xs text-ink-2 mt-1 hidden sm:block">
            {chapterDetails.title} • CBSE Competency Evaluation
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="text-2xl sm:text-3xl font-black text-[#DC2626] font-mono tracking-wider flex items-center gap-2">
            <Clock className="w-6 h-6 text-gray-400" />
            {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="text-sm font-bold text-gray-600">
            Q {currentIndex + 1} / {questions.length}
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(selectedAnswers[q.id]);
              const isCurr = idx === currentIndex;
              const isFlag = flagged.has(idx);

              let classes = "w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-lg border transition-all ";
              if (isCurr) classes += "ring-2 ring-gray-900 ";
              if (isAnswered) classes += "bg-[#14532D] text-white border-[#14532D]";
              else classes += "bg-white text-gray-600 border-gray-200";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={classes}
                >
                  {idx + 1}
                  {isFlag && <span className="text-amber-500 ml-0.5">★</span>}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        {isSubmitted ? (
          <div className="w-full max-w-xl bg-white border border-line rounded-3xl p-8 shadow-card text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-green-100 text-green-800">
                Test Evaluation Complete
              </span>
              <h2 className="text-3xl font-black text-gray-900 mt-2">
                {score} / {totalMarks} Marks
              </h2>
              <p className="text-sm font-bold text-[#14532D]">
                Accuracy: {totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0}%
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => router.push(`/content/${grade}/${subject}/${chapter}`)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Back to Chapter Hub
              </button>
              <button
                onClick={() => router.push("/student/assignments")}
                className="flex-1 bg-[#14532D] text-white py-3 rounded-xl text-xs font-bold hover:bg-green-800"
              >
                View Assignments
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white border border-line rounded-3xl shadow-card overflow-hidden flex flex-col">
            <div className="p-8 sm:p-10 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Question {currentIndex + 1} • {currentQ.marks} Marks
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-ink leading-relaxed mt-1">
                    {currentQ.question}
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOpt === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors font-semibold ${
                        isSelected
                          ? "border-[#14532D] bg-green-50 text-[#14532D] ring-2 ring-green-600/20"
                          : "border-line hover:bg-gray-50 bg-white text-ink"
                      }`}
                    >
                      <span className="w-6 font-bold text-gray-600">{opt.id}</span>
                      <span className="text-gray-800 text-sm font-semibold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  <Flag className="w-4 h-4 text-amber-500" />
                  {flagged.has(currentIndex) ? "Remove Flag" : "Flag for Review"}
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="grid grid-cols-2 border-t border-line divide-x divide-line">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center justify-center gap-2 py-4 text-ink-2 hover:bg-gray-50 font-bold transition-all text-xs disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> PREV
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center justify-center gap-2 py-4 text-ink hover:bg-gray-50 font-bold transition-all text-xs disabled:opacity-30"
              >
                NEXT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Submit Button */}
      {!isSubmitted && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleSubmitTest}
            className="bg-[#DC2626] hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer text-xs"
          >
            Submit Test <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
