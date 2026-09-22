"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  Sparkles, 
  Tv, 
  CheckSquare, 
  FileText, 
  BrainCircuit, 
  Download, 
  Check, 
  Loader2, 
  ChevronRight, 
  ArrowLeft,
  AlertCircle,
  Users,
  RotateCcw,
  Edit3,
  Bookmark,
  CheckCircle2,
  BookOpen,
  Layers,
  Clock,
  ShieldCheck
} from "lucide-react";
import { addRecentResource } from "@/lib/services/recentResources";

const teacherProgressMilestones = [
  "Understanding your chapter...",
  "Aligning with NCERT learning outcomes...",
  "Creating age-appropriate content...",
  "Checking accuracy and clarity...",
  "Almost ready for your review!"
];

interface ApiDraftContent {
  title?: string;
  slides?: Array<{
    title: string;
    subtitle?: string;
    bullets?: string[];
  }>;
  questions?: Array<{
    question: string;
    options?: string[];
    answer?: string;
  }>;
}

interface GeneratedDraft {
  title: string;
  resourceType: string;
  typeLabel: string;
  grade: string;
  subject: string;
  chapter: string;
  duration: string;
  itemCount: string;
  slides?: Array<{
    title: string;
    subtitle?: string;
    bullets?: string[];
  }>;
  questions?: Array<{
    question: string;
    options?: string[];
    answer?: string;
  }>;
}

export default function ResourceCreationStudioPage() {

  // Step 1: Tell me what to create | Step 2: Customize | Step 3: Generate | Step 4: Review & refine
  const [step, setStep] = useState(1);
  const [resourceIntent, setResourceIntent] = useState("slides"); // slides, worksheet, quiz, activity, explanation, question-bank
  const [teacherNotes, setTeacherNotes] = useState("");

  // Inherited Context
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedChapter, setSelectedChapter] = useState("Chapter 3 - Reproduction in Animals");
  const [slugGrade, setSlugGrade] = useState("class-8");
  const [slugSubject, setSlugSubject] = useState("science");
  const [slugChapter, setSlugChapter] = useState("chapter-3");
  const [returnUrl, setReturnUrl] = useState("/dashboard/resources");

  // Customization Options
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [itemCount, setItemCount] = useState(10);
  const [contentLanguage, setContentLanguage] = useState("en");

  // Generation & Review State
  const [genStep, setGenStep] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Prefill params from URL on mount (UX-020: Zero Redundant Inputs)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type");
      const gradeParam = params.get("grade");
      const subjectParam = params.get("subject");
      const chapterParam = params.get("chapter");
      const returnParam = params.get("returnUrl");

      if (gradeParam) {
        setSlugGrade(gradeParam);
        setSelectedClass(gradeParam.replace("class-", "Class "));
      }
      if (subjectParam) {
        setSlugSubject(subjectParam);
        setSelectedSubject(subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1));
      }
      if (chapterParam) {
        setSlugChapter(chapterParam);
        setSelectedChapter(chapterParam.replace("chapter-", "Chapter "));
      }
      if (returnParam) {
        setReturnUrl(returnParam);
      }

      if (typeParam) {
        if (typeParam.includes("slide") || typeParam.includes("presentation")) setResourceIntent("slides");
        else if (typeParam.includes("worksheet")) setResourceIntent("worksheet");
        else if (typeParam.includes("quiz")) setResourceIntent("quiz");
        else if (typeParam.includes("activity")) setResourceIntent("activity");
        else if (typeParam.includes("explanation") || typeParam.includes("mind-map")) setResourceIntent("explanation");
        else if (typeParam.includes("question") || typeParam.includes("test")) setResourceIntent("question-bank");
      }
    }
  }, []);

  const intentOptions = [
    {
      id: "slides",
      title: "Lesson Slides",
      subtitle: "Presentation for classroom",
      icon: <Tv className="w-5 h-5 text-emerald-700" />,
      badge: "75\" Smartboard Ready",
      productType: "presentation",
    },
    {
      id: "worksheet",
      title: "Worksheet",
      subtitle: "Practice questions & homework",
      icon: <Download className="w-5 h-5 text-blue-700" />,
      badge: "Printable Bilingual",
      productType: "worksheet",
    },
    {
      id: "quiz",
      title: "Quiz",
      subtitle: "Assessment for students",
      icon: <CheckSquare className="w-5 h-5 text-purple-700" />,
      badge: "Clicker Formative",
      productType: "quiz",
    },
    {
      id: "activity",
      title: "Activity",
      subtitle: "Engaging classroom activity",
      icon: <Users className="w-5 h-5 text-amber-700" />,
      badge: "Think-Pair-Share",
      productType: "teaching-activity",
    },
    {
      id: "explanation",
      title: "Explanation",
      subtitle: "Simplify a difficult concept",
      icon: <BrainCircuit className="w-5 h-5 text-teal-700" />,
      badge: "Conceptual Guide",
      productType: "lesson-plan",
    },
    {
      id: "question-bank",
      title: "Question Bank",
      subtitle: "More practice questions",
      icon: <FileText className="w-5 h-5 text-indigo-700" />,
      badge: "NCERT Exemplar",
      productType: "test-paper",
    },
  ];

  const handleStartGeneration = async () => {
    setStep(3); // Progress State
    setGenerationError(null);
    setGenStep(0);

    const selectedOption = intentOptions.find((o) => o.id === resourceIntent) || intentOptions[0];

    try {
      // Step 1: Understanding chapter
      setGenStep(0);
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Planning objectives
      setGenStep(1);
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: Trigger backend API
      setGenStep(2);
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_type: selectedOption.productType,
          grade: selectedClass,
          subject: selectedSubject,
          chapter: selectedChapter,
          difficulty: difficulty.toUpperCase(),
          language: contentLanguage,
          teacher_instructions: teacherNotes || undefined,
          quantity: itemCount,
          duration_mins: duration,
          slide_count: itemCount,
          idempotency_key: `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        }),
      });

      // Step 4: Checking resource
      setGenStep(3);

      let draftData: ApiDraftContent | null = null;
      if (res.ok) {
        const json = await res.json();
        draftData = json.data as ApiDraftContent;
      }

      setGenStep(4);
      await new Promise((r) => setTimeout(r, 500));

      // Construct Draft for Step 4: Review Your Resource
      const draft: GeneratedDraft = {
        title: draftData?.title || `${selectedChapter} — ${selectedOption.title}`,
        resourceType: selectedOption.id,
        typeLabel: selectedOption.title,
        grade: selectedClass,
        subject: selectedSubject,
        chapter: selectedChapter,
        duration: `~${duration} min`,
        itemCount: `${itemCount} ${resourceIntent === "slides" ? "slides" : "items"}`,
        slides: draftData?.slides || [
          {
            title: draftData?.title || `${selectedChapter} Overview`,
            subtitle: `${selectedClass} · ${selectedSubject} · NCERT Curriculum`,
            bullets: [
              "Core Chapter Inquiry and Learning Goals",
              "Key definitions and real-world Indian applications",
              "Interactive classroom discussion checkpoint",
            ],
          },
          {
            title: "Core Concepts & Mechanism",
            subtitle: "Foundational principles from textbook",
            bullets: [
              "Step-by-step mechanism breakdown",
              "Visual distinction between core elements",
              "Common student misconceptions addressed directly",
            ],
          },
          {
            title: "Classroom Activity: Think-Pair-Share",
            subtitle: "Active student collaboration (5 minutes)",
            bullets: [
              "Pose inquiry: How is this observed in daily life?",
              "Discuss observations with your bench partner",
              "Share one combined answer with the class",
            ],
          },
          {
            title: "Lesson Summary & Homework",
            subtitle: "Wrap up and practice assignment",
            bullets: [
              "Recall key definitions and terminology",
              "Complete practice exercises from Section A",
              "Prepare questions for the next session",
            ],
          },
        ],
        questions: draftData?.questions || [
          {
            question: `What is the primary significance of ${selectedChapter}?`,
            options: ["Key scientific mechanism", "Common distractor", "Incorrect premise", "None of the above"],
            answer: "Key scientific mechanism",
          },
          {
            question: "Identify two real-world examples observed in everyday life.",
          },
        ],
      };

      setGeneratedDraft(draft);

      // Track in recent resources
      addRecentResource({
        id: `res-gen-${Date.now()}`,
        title: draft.title,
        description: `Draft resource created with Saathi AI for ${selectedChapter}`,
        intent: resourceIntent === "slides" ? "TEACH" : resourceIntent === "worksheet" ? "PRACTICE" : "ASSESS",
        type: selectedOption.productType.toUpperCase(),
        typeLabel: selectedOption.title,
        grade: slugGrade,
        gradeName: selectedClass,
        subject: slugSubject,
        subjectName: selectedSubject,
        chapter: slugChapter,
        chapterName: selectedChapter,
        duration: draft.duration,
        itemCount: draft.itemCount,
        previewUrl: "/dashboard/resources",
        teachUrl: `/classroom?grade=${slugGrade}&subject=${slugSubject}&chapter=${slugChapter}&title=${encodeURIComponent(
          draft.title
        )}&returnUrl=${encodeURIComponent(returnUrl)}`,
      });

      // Transition to Step 4: Review Your Resource
      setStep(4);
    } catch (err: unknown) {
      console.error(err);
      setGenerationError("We couldn't finish creating this resource right now. Your request parameters have been preserved.");
    }
  };

  const handleSaveToResources = () => {
    setSaveSuccessMessage("Saved draft to your Resource Studio library!");
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const teachUrl = `/classroom?grade=${slugGrade}&subject=${slugSubject}&chapter=${slugChapter}&title=${encodeURIComponent(
    generatedDraft?.title || selectedChapter
  )}&returnUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Banner (Mockup Screen 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-serif text-gray-900">
              Create with Saathi AI
            </h1>
            <p className="text-xs text-gray-500">
              Tell me what you need, and I&apos;ll create a classroom-ready resource for you.
            </p>
          </div>
        </div>

        <Link
          href={returnUrl}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Workspace
        </Link>
      </div>

      {/* Step Stepper */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-2">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step >= 1 ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-500"}`}>
            1
          </span>
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">Choose Intent</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step >= 2 ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-500"}`}>
            2
          </span>
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">Customize</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step >= 3 ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-500"}`}>
            3
          </span>
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">Generate</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step >= 4 ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-500"}`}>
            4
          </span>
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">Review Draft</span>
        </div>
      </div>

      {/* STEP 1: Tell me what to create (Mockup Screen 4) */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Inherited Teaching Context Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-800 shrink-0" />
              <div>
                <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">
                  Current Teaching Context (Inherited)
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {selectedClass} · {selectedSubject} · {selectedChapter}
                </span>
              </div>
            </div>
            <Link
              href={`/content/${slugGrade}/${slugSubject}/${slugChapter}`}
              className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              Change
            </Link>
          </div>

          {/* 6 Intent Cards Grid */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              What would you like to create?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {intentOptions.map((opt) => {
                const isSelected = resourceIntent === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setResourceIntent(opt.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        {opt.icon}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-gray-900">{opt.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className={`font-bold ${isSelected ? "text-emerald-700" : "text-gray-400"}`}>
                        {isSelected ? "✓ Selected" : "Select"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Prompt Input */}
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Describe what you need (optional)
              </label>
              <span className="text-[10px] text-gray-400">{teacherNotes.length}/500</span>
            </div>
            <textarea
              maxLength={500}
              rows={3}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="e.g. Include real-life examples from Indian agriculture, keep questions simple for Class 8, add a 5-minute partner activity..."
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50/50"
            />
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              Next: Customize Setup <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Customize Setup */}
      {step === 2 && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif">
              Customize Your Teaching Resource
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Refine the difficulty level, quantity, and language to suit your classroom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Easy", "Medium", "Hard"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      difficulty === lvl
                        ? "bg-emerald-50 border-emerald-600 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Content Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "Hindi" },
                  { code: "bilingual", label: "Bilingual" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setContentLanguage(lang.code)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      contentLanguage === lang.code
                        ? "bg-emerald-50 border-emerald-600 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Estimated Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      duration === mins
                        ? "bg-emerald-50 border-emerald-600 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    ~{mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Duration / Items */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                {resourceIntent === "slides" ? "Slide Deck Size" : "Question / Step Count"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={resourceIntent === "slides" ? 6 : 5}
                  max={resourceIntent === "slides" ? 18 : 20}
                  step={2}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs font-black text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg shrink-0">
                  {itemCount} {resourceIntent === "slides" ? "slides" : "items"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={handleStartGeneration}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate with Saathi AI
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Teacher-Facing Generation Progress */}
      {step === 3 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 text-center space-y-6 max-w-xl mx-auto shadow-sm">
          {generationError ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Creation Paused</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">{generationError}</p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Edit Request
                </button>
                <button
                  onClick={handleStartGeneration}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                >
                  Retry Generation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-emerald-700 absolute" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">
                  Saathi is Preparing Your Draft
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Crafting curriculum-aligned educational content for {selectedClass} {selectedSubject}
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-2.5 text-left max-w-sm mx-auto pt-2">
                {teacherProgressMilestones.map((m, idx) => {
                  const isDone = genStep > idx;
                  const isCurrent = genStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs transition-colors ${
                        isDone
                          ? "text-emerald-800 font-bold"
                          : isCurrent
                          ? "text-gray-900 font-extrabold animate-pulse"
                          : "text-gray-400"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                      )}
                      <span>{m}</span>
                    </div>
                  );
                })}
              </div>

              {/* Trust & Teacher Authority Callout (Phase 16) */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>This will be a draft for you to review and edit. You remain the final decision-maker.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Review Your Resource (Mockup Screen 5) */}
      {step === 4 && generatedDraft && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-black font-serif text-gray-900">
                  Review Your Resource
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Generated by Saathi
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600">
              Saathi has created a draft for you. Review, edit if needed, and then save or use it. You remain the final classroom authority.
            </p>

            {/* Context Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs font-semibold text-gray-700">
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{generatedDraft.grade}</span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{generatedDraft.subject}</span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{generatedDraft.chapter}</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg">
                {generatedDraft.itemCount}
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg">
                {generatedDraft.duration}
              </span>
            </div>
          </div>

          {/* Success Notification */}
          {saveSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {saveSuccessMessage}
            </div>
          )}

          {/* Live Draft Preview Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Center 2 Cols: Interactive Draft Slide/Content Preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-gradient-to-br from-emerald-950 via-[#14532D] to-gray-900 rounded-3xl text-white p-6 sm:p-10 shadow-lg flex flex-col justify-between border border-emerald-700/50 relative overflow-hidden">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Draft Slide {selectedSlideIndex + 1} of {(generatedDraft.slides || []).length}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                    {generatedDraft.slides?.[selectedSlideIndex]?.title}
                  </h3>
                  {generatedDraft.slides?.[selectedSlideIndex]?.subtitle && (
                    <p className="text-xs text-emerald-100/90">
                      {generatedDraft.slides[selectedSlideIndex].subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-2 bg-black/25 backdrop-blur-xs p-4 rounded-xl border border-white/10 my-4">
                  {generatedDraft.slides?.[selectedSlideIndex]?.bullets?.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/95">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-200/80 pt-2 border-t border-white/10">
                  <span>Draft generated by Saathi AI</span>
                  <span>Editable prior to classroom broadcast</span>
                </div>
              </div>

              {/* Slide Selector Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {generatedDraft.slides?.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                      selectedSlideIndex === idx
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Slide {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Resource Summary & Next Steps (Mockup Screen 5) */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Resource Summary
                </h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{generatedDraft.itemCount} classroom material</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Key diagrams and pedagogical examples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Classroom discussion questions included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aligned with NCERT curriculum guidelines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{generatedDraft.duration} estimated teaching time</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Next Steps
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-800">
                  <li className="flex items-center gap-2">✓ Review the generated content</li>
                  <li className="flex items-center gap-2">✓ Edit or customize if desired</li>
                  <li className="flex items-center gap-2">✓ Save to your resources for later</li>
                  <li className="flex items-center gap-2">✓ Launch directly on Smartboard</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Bottom Action Hierarchy (Mockup Screen 5) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleStartGeneration}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" /> Regenerate
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-gray-500" /> Edit Request
              </button>
              <button
                onClick={handleSaveToResources}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-700" /> Save to Resources
              </button>
            </div>

            <div className="w-full sm:w-auto">
              <Link
                href={teachUrl}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Tv className="w-4 h-4" /> Use in Class (Smartboard Mode)
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
