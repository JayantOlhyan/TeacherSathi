"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  Sparkles, 
  Tv, 
  CheckSquare, 
  FileText, 
  ClipboardList, 
  BrainCircuit, 
  Download, 
  Check, 
  Loader2, 
  ChevronRight, 
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const generationMilestones = [
  "Understanding chapter scope...",
  "Structuring NCERT content nodes...",
  "Generating bilingual questions & options...",
  "Applying cognitive difficulty balance...",
  "Finalizing resource draft..."
];

export default function AssessmentEditorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [resourceType, setResourceType] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedChapter, setSelectedChapter] = useState("Chapter 10: Light - Reflection & Refraction");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState(30);

  // Generation status tracking
  const [genStep, setGenStep] = useState(0);

  // Prefill params from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type");
      const gradeParam = params.get("grade");
      const subjectParam = params.get("subject");
      const chapterParam = params.get("chapter");

      if (typeParam) {
        setResourceType(typeParam);
        setStep(2);
      }
      if (gradeParam) {
        setSelectedClass(gradeParam.replace("class-", "Class "));
      }
      if (subjectParam) {
        setSelectedSubject(subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1));
      }
      if (chapterParam) {
        setSelectedChapter(chapterParam.replace("chapter-", "Chapter "));
      }
    }
  }, []);

  // Simulate generation steps in Step 4
  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setGenStep((prev) => {
          if (prev < generationMilestones.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // After completion, redirect to classes or resources after a short delay
            setTimeout(() => {
              router.push("/resources");
            }, 1200);
            return prev;
          }
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [step, router]);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 relative">
      
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-700" />
            AI Teaching Resource Creator
          </h1>
          <p className="text-gray-400 text-xs font-semibold mt-1">
            Build custom NCERT-aligned study materials, slide decks, or tests using advanced models.
          </p>
        </div>
        {step > 1 && step < 4 && (
          <button 
            onClick={handleBack}
            className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-between px-6 bg-white p-4 rounded-xl border border-gray-50">
        {[
          { num: 1, label: "Choose Resource" },
          { num: 2, label: "Select Content" },
          { num: 3, label: "Customize Setup" },
          { num: 4, label: "Generate Pack" }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= s.num ? "bg-[#14532D] text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {step > s.num ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step >= s.num ? "text-gray-800" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Steps Content Area */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Choose Resource */}
          {step === 1 && (
            <motion.div 
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Step 1 — Choose Resource Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "quiz", label: "Interactive Quiz", desc: "For live clicker testing", icon: CheckSquare },
                  { id: "smart-classroom", label: "Presentation", desc: "Interactive teaching slides", icon: Tv },
                  { id: "test-paper", label: "Test Paper", desc: "Summative paper creator", icon: FileText },
                  { id: "lesson-plan", label: "Lesson Plan", desc: "Structured teaching map", icon: ClipboardList },
                  { id: "mind-map", label: "Mind Map", desc: "Concept relational tree", icon: BrainCircuit },
                  { id: "worksheet", label: "Worksheet", desc: "Print-ready homework files", icon: Download }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = resourceType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setResourceType(item.id);
                        handleNext();
                      }}
                      className={`p-5 rounded-2xl text-left border flex flex-col justify-between min-h-[140px] transition-all cursor-pointer ${
                        isSelected 
                          ? "border-[#14532D] bg-[#EDF7EF]/30" 
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/30"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-[#14532D] text-white" : "bg-green-50 text-[#14532D]"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5 mt-4">
                        <h4 className="font-extrabold text-gray-800 text-xs">{item.label}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Select Content */}
          {step === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Step 2 — Select Class & Content Scope</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Class Level</label>
                    <select 
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold bg-white cursor-pointer"
                    >
                      {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Subject Book</label>
                    <select 
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold bg-white cursor-pointer"
                    >
                      {["Science", "Mathematics", "Social Science", "English", "Hindi"].map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Chapter</label>
                  <select 
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="Chapter 10: Light - Reflection & Refraction">Chapter 10: Light - Reflection & Refraction</option>
                    <option value="Chapter 11: Human Eye & Colorful World">Chapter 11: Human Eye & Colorful World</option>
                    <option value="Chapter 12: Electricity">Chapter 12: Electricity</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-[#14532D] hover:bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Configure Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Customize details */}
          {step === 3 && (
            <motion.div 
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Step 3 — Customize Specifications</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Difficulty Target</label>
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold bg-white cursor-pointer"
                    >
                      <option value="Easy">Easy (Conceptual Recall)</option>
                      <option value="Medium">Medium (Balanced Applications)</option>
                      <option value="Hard">Hard (HOTS Competency)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Question/Slide Count</label>
                    <input 
                      type="number" 
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Instructional Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold bg-white cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Bilingual">Bilingual (English + Hindi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Allotted Duration (Minutes)</label>
                    <input 
                      type="number" 
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-[#14532D] hover:bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Generate Now <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Generate Progress */}
          {step === 4 && (
            <motion.div 
              key="step-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 py-8 text-center"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-150 relative">
                <Loader2 className="w-6 h-6 animate-spin text-[#14532D]" />
              </div>
              <h3 className="font-extrabold text-gray-800 text-sm">Generating AI Teaching Resource</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Please keep this window open</p>

              {/* Progress Milestones Tracker */}
              <div className="max-w-md mx-auto space-y-3 pt-6 text-left">
                {generationMilestones.map((milestone, idx) => {
                  const isDone = genStep > idx;
                  const isActive = genStep === idx;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                        isDone 
                          ? "bg-green-600 border-green-650 text-white" 
                          : isActive 
                            ? "bg-amber-100 border-amber-200 text-amber-800 animate-pulse" 
                            : "bg-gray-50 border-gray-100 text-gray-300"
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-semibold ${
                        isDone ? "text-gray-800" : isActive ? "text-gray-700 font-bold" : "text-gray-350"
                      }`}>
                        {milestone}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
