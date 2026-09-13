"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Search,
  Filter,
  Users
} from "lucide-react";
import { type QuestionSnapshot } from "@/lib/validations/assessment";

interface CanonicalQuestionItem {
  id: string;
  chapter_id: string;
  section_tier: "SECTION_A" | "SECTION_B" | "SECTION_C";
  question_type: string;
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  bloom_level: string;
  text_en: string;
  text_hi: string;
  explanation_en?: string;
  options?: Array<{
    option_key: "A" | "B" | "C" | "D";
    text_en: string;
    text_hi: string;
    is_correct: boolean;
  }>;
}

interface ClassItem {
  id: string;
  name: string;
  section: string;
  grade_id: string;
}

export default function AssessmentBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assessmentType, setAssessmentType] = useState<"MCQ_QUIZ" | "TEST_PAPER" | "WORKSHEET" | "ASSIGNMENT">("MCQ_QUIZ");
  const [gradeId, setGradeId] = useState("class-8");
  const [subjectId, setSubjectId] = useState("science");
  const [chapterId, setChapterId] = useState("");
  const [chapters, setChapters] = useState<Array<{ id: string; title_en: string; chapter_number: number }>>([]);
  const [language, setLanguage] = useState<"en" | "hi" | "bilingual">("en");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingMarks, setPassingMarks] = useState<number>(12);
  const [instructions, setInstructions] = useState<string>("Read each question carefully.\nChoose the most accurate answer.");

  // Step 2: Questions
  const [availableQuestions, setAvailableQuestions] = useState<CanonicalQuestionItem[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Array<{
    question_id?: string;
    question_order: number;
    section: string;
    marks_override?: number;
    question_snapshot: QuestionSnapshot;
  }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Step 3: Settings
  const [settings, setSettings] = useState({
    shuffle_questions: false,
    shuffle_options: false,
    show_result_after_submission: true,
    allow_retake: false,
    max_attempts: 1,
    negative_marking: false,
    negative_marks_per_question: 0.5,
  });

  // Step 4: Assignment
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignClassId, setAssignClassId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load chapters for grade/subject
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`/api/curriculum?type=chapters`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setChapters(json.data);
            setChapterId((curr) => curr || json.data[0].id);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchChapters();
  }, [gradeId, subjectId]);

  // Load classes for assignment
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setClasses(json.data);
            if (json.data.length > 0) setAssignClassId(json.data[0].id);
          }
        }
      } catch {
        // fallback
      }
    };
    fetchClasses();
  }, []);

  // Fetch questions from question bank when chapter changes
  useEffect(() => {
    if (!chapterId) return;
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const res = await fetch(`/api/questions?chapterId=${chapterId}`);
        if (res.ok) {
          const json = await res.json();
          setAvailableQuestions(json.data || []);
        }
      } catch {
        setAvailableQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [chapterId]);

  // Toggle question selection
  const handleToggleQuestion = (q: CanonicalQuestionItem) => {
    const exists = selectedQuestions.find((sq) => sq.question_id === q.id);
    if (exists) {
      setSelectedQuestions((prev) =>
        prev
          .filter((sq) => sq.question_id !== q.id)
          .map((item, idx) => ({ ...item, question_order: idx + 1 }))
      );
    } else {
      const snapshot: QuestionSnapshot = {
        text_en: q.text_en,
        text_hi: q.text_hi,
        question_type: q.question_type,
        marks: q.marks,
        difficulty: q.difficulty,
        bloom_level: q.bloom_level,
        options: (q.options || []).map((o) => ({
          option_key: o.option_key,
          text_en: o.text_en,
          text_hi: o.text_hi,
          is_correct: o.is_correct,
        })),
        explanation_en: q.explanation_en,
        source: "NCERT Question Bank",
        tags: [q.section_tier],
      };

      setSelectedQuestions((prev) => [
        ...prev,
        {
          question_id: q.id,
          question_order: prev.length + 1,
          section: q.section_tier,
          marks_override: q.marks,
          question_snapshot: snapshot,
        },
      ]);
    }
  };

  // Calculate live metrics
  const totalQuestions = selectedQuestions.length;
  const calculatedTotalMarks = selectedQuestions.reduce(
    (sum, q) => sum + (q.marks_override ?? q.question_snapshot.marks ?? 1),
    0
  );

  // Submit assessment creation
  const handleSaveAssessment = async (publishImmediately: boolean = false) => {
    if (totalQuestions === 0) {
      setErrorMessage("Please select at least 1 question for this assessment.");
      return;
    }
    if (!title.trim()) {
      setErrorMessage("Please enter an assessment title.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        title,
        description,
        assessment_type: assessmentType,
        grade_id: gradeId,
        subject_id: subjectId,
        chapter_id: chapterId || null,
        language,
        duration_minutes: durationMinutes,
        total_marks: calculatedTotalMarks,
        passing_marks: passingMarks,
        instructions: instructions.split("\n").filter((i) => i.trim() !== ""),
        settings,
        questions: selectedQuestions,
      };

      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to create assessment");
      }

      const created = await res.json();
      const assessmentId = created.data.id;

      if (publishImmediately) {
        await fetch(`/api/assessments/${assessmentId}/publish`, {
          method: "POST",
        });

        if (assignClassId) {
          await fetch(`/api/assessments/${assessmentId}/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              class_id: assignClassId,
              due_at: dueDate ? new Date(dueDate).toISOString() : null,
            }),
          });
        }
      }

      router.push("/dashboard/assessments");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQuestions = availableQuestions.filter((q) => {
    const matchesSearch =
      q.text_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.text_hi && q.text_hi.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = tierFilter === "ALL" || q.section_tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => router.push("/dashboard/assessments")}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#14532D]" />
            Teacher Assessment Builder
          </h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Build rigorous, NCERT-aligned assessments with questions from the canonical question bank.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl">
          <div className="text-center border-r border-gray-200 pr-3">
            <div className="text-xs font-semibold text-gray-500 uppercase">Questions</div>
            <div className="text-lg font-black text-gray-800">{totalQuestions}</div>
          </div>
          <div className="text-center border-r border-gray-200 pr-3">
            <div className="text-xs font-semibold text-gray-500 uppercase">Total Marks</div>
            <div className="text-lg font-black text-[#14532D]">{calculatedTotalMarks}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500 uppercase">Duration</div>
            <div className="text-lg font-black text-gray-800">{durationMinutes}m</div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Stepper Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-xl p-1.5 shadow-sm text-xs font-bold">
        {[
          { num: 1, label: "1. Details & Context" },
          { num: 2, label: "2. Select Questions" },
          { num: 3, label: "3. Settings & Rules" },
          { num: 4, label: "4. Review & Assign" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex-1 py-2.5 rounded-lg transition-all text-center ${
              step === s.num
                ? "bg-[#14532D] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step 1: Details & Context */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-800 border-b pb-3">Assessment Specification</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700">Assessment Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Class 8 Science Chapter 1 MCQ Test"
                className="w-full border border-gray-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief guidelines or syllabus scope for students..."
                rows={2}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Assessment Type</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as "MCQ_QUIZ" | "TEST_PAPER" | "WORKSHEET" | "ASSIGNMENT")}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                <option value="MCQ_QUIZ">MCQ Quiz (Objective Auto-Graded)</option>
                <option value="TEST_PAPER">Test Paper (CBSE Standard Sections)</option>
                <option value="WORKSHEET">Worksheet (Practice & Homework)</option>
                <option value="ASSIGNMENT">Classroom Assignment</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "bilingual")}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bilingual">Bilingual (English + Hindi)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Class / Grade</label>
              <select
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                <option value="class-6">Class 6</option>
                <option value="class-7">Class 7</option>
                <option value="class-8">Class 8</option>
                <option value="class-9">Class 9</option>
                <option value="class-10">Class 10</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                <option value="science">Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="social-science">Social Science</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700">NCERT Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch {ch.chapter_number}: {ch.title_en}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Passing Marks</label>
              <input
                type="number"
                min={0}
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700">General Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (!title) setTitle(`${gradeId.replace("class-", "Class ")} ${subjectId.toUpperCase()} Assessment`);
                setStep(2);
              }}
              className="bg-[#14532D] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-green-800 transition-all cursor-pointer"
            >
              Continue to Question Selection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Questions */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question text or concept..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Tier:
              </span>
              {["ALL", "SECTION_A", "SECTION_B", "SECTION_C"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tierFilter === tier
                      ? "bg-[#14532D] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tier === "ALL" ? "All" : tier.replace("SECTION_", "Section ")}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {loadingQuestions ? (
              <div className="bg-white p-12 rounded-2xl border text-center text-xs text-gray-400 font-bold">
                Loading canonical NCERT question bank...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border text-center text-xs text-gray-400 font-bold">
                No questions found for this chapter or filter.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = selectedQuestions.some((sq) => sq.question_id === q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? "border-[#14532D] ring-2 ring-[#14532D]/10 bg-green-50/20"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 border ${
                            isSelected
                              ? "bg-[#14532D] border-[#14532D] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {q.section_tier.replace("SECTION_", "Sec ")}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              {q.question_type} • {q.marks} Mark{q.marks > 1 ? "s" : ""}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                q.difficulty === "EASY"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : q.difficulty === "HARD"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-800 leading-snug">{q.text_en}</p>
                          {q.text_hi && <p className="text-xs text-gray-500 mt-1">{q.text_hi}</p>}

                          {/* Options if MCQ */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              {q.options.map((opt) => (
                                <div
                                  key={opt.option_key}
                                  className={`text-xs p-2 rounded-lg border font-medium flex items-center gap-2 ${
                                    opt.is_correct
                                      ? "border-green-300 bg-green-50 text-green-800 font-bold"
                                      : "border-gray-100 bg-gray-50 text-gray-600"
                                  }`}
                                >
                                  <span className="font-bold text-gray-400">{opt.option_key}.</span>
                                  <span>{opt.text_en}</span>
                                  {opt.is_correct && (
                                    <span className="ml-auto text-[10px] text-green-700 font-bold">(Key)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-[#14532D] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-green-800 transition-all cursor-pointer"
            >
              Configure Settings ({totalQuestions} selected) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Settings & Rules */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-800 border-b pb-3">Examination & Grading Policies</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <h3 className="text-xs font-bold text-gray-800">Show Results Immediately</h3>
                <p className="text-[11px] text-gray-400">Display instant score and answer key upon submission.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.show_result_after_submission}
                onChange={(e) => setSettings({ ...settings, show_result_after_submission: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <h3 className="text-xs font-bold text-gray-800">Allow Multiple Attempts</h3>
                <p className="text-[11px] text-gray-400">Permit students to retake the test up to max attempts.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_retake}
                onChange={(e) => setSettings({ ...settings, allow_retake: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded cursor-pointer"
              />
            </div>

            {settings.allow_retake && (
              <div className="p-4 border rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Maximum Attempts</h3>
                  <p className="text-[11px] text-gray-400">Limit retake count per student.</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={settings.max_attempts}
                  onChange={(e) => setSettings({ ...settings, max_attempts: Number(e.target.value) })}
                  className="w-20 border border-gray-200 p-2 rounded-lg text-xs font-bold text-center"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <h3 className="text-xs font-bold text-gray-800">Negative Marking</h3>
                <p className="text-[11px] text-gray-400">Deduct marks for incorrect answers (CBSE competitive prep).</p>
              </div>
              <input
                type="checkbox"
                checked={settings.negative_marking}
                onChange={(e) => setSettings({ ...settings, negative_marking: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded cursor-pointer"
              />
            </div>

            {settings.negative_marking && (
              <div className="p-4 border rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Deduction Per Incorrect Answer</h3>
                  <p className="text-[11px] text-gray-400">e.g. 0.25, 0.5, or 1 mark deducted.</p>
                </div>
                <input
                  type="number"
                  step="0.25"
                  min={0.25}
                  max={2}
                  value={settings.negative_marks_per_question}
                  onChange={(e) => setSettings({ ...settings, negative_marks_per_question: Number(e.target.value) })}
                  className="w-20 border border-gray-200 p-2 rounded-lg text-xs font-bold text-center"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <h3 className="text-xs font-bold text-gray-800">Shuffle Questions</h3>
                <p className="text-[11px] text-gray-400">Randomize question order for each student attempt.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.shuffle_questions}
                onChange={(e) => setSettings({ ...settings, shuffle_questions: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-[#14532D] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-green-800 transition-all cursor-pointer"
            >
              Preview & Assign <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Assign */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-800 border-b pb-3">Review & Publish Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-2xl border">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase">Assessment Title</span>
              <div className="text-sm font-black text-gray-800 mt-0.5">{title}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase">Total Marks</span>
              <div className="text-sm font-black text-[#14532D] mt-0.5">{calculatedTotalMarks} Marks</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase">Time Limit</span>
              <div className="text-sm font-black text-gray-800 mt-0.5">{durationMinutes} Minutes</div>
            </div>
          </div>

          {/* Class Assignment Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#14532D]" />
              Assign to Class Section
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Target Class</label>
                <select
                  value={assignClassId}
                  onChange={(e) => setAssignClassId(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-green-600"
                >
                  {classes.length > 0 ? (
                    classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Section {c.section})
                      </option>
                    ))
                  ) : (
                    <option value="">No class sections found</option>
                  )}
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
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(3)}
              className="w-full sm:w-auto bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
            >
              Back
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                disabled={isSubmitting}
                onClick={() => handleSaveAssessment(false)}
                className="flex-1 sm:flex-initial bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Save as Draft
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleSaveAssessment(true)}
                className="flex-1 sm:flex-initial bg-[#14532D] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-green-800 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? "Publishing..." : "Publish & Assign Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
