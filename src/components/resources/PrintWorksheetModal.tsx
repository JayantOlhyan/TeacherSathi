"use client";

import React, { useState } from "react";
import { 
  X, 
  Printer, 
  Scissors
} from "lucide-react";

export interface PrintQuestionItem {
  question: string;
  options?: string[];
  answer?: string;
  marks?: number;
}

export interface PrintWorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  grade?: string;
  subject?: string;
  chapter?: string;
  questions?: PrintQuestionItem[];
}

export function PrintWorksheetModal({
  isOpen,
  onClose,
  title,
  grade = "Class 8",
  subject = "Science",
  chapter = "Chapter 1",
  questions,
}: PrintWorksheetModalProps) {
  const [schoolName, setSchoolName] = useState("KENDRIYA VIDYALAYA / GOVERNMENT SENIOR SECONDARY SCHOOL");
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [timeAllowed, setTimeAllowed] = useState("45 Minutes");
  const [maxMarks, setMaxMarks] = useState("25 Marks");
  const [density, setDensity] = useState<"standard" | "compact">("standard");
  const [examInstructions, setExamInstructions] = useState(
    "1. Read each question carefully. 2. Write neat answers with black/blue pen. 3. All questions are compulsory."
  );
  const [isBilingual, setIsBilingual] = useState(false);

  if (!isOpen) return null;

  // Fallback NCERT high-yield curriculum questions if none provided
  const displayQuestions: PrintQuestionItem[] = questions && questions.length > 0 ? questions : [
    {
      question: "Which of the following methods of irrigation is most suitable for uneven land with water scarcity?",
      options: ["Moat (Pulley system)", "Chain pump", "Drip irrigation system", "Rahat (Lever system)"],
      answer: "Drip irrigation system (Delivers water directly to root zone with zero evaporation loss)",
      marks: 1
    },
    {
      question: "Rhizobium bacteria present in the root nodules of leguminous plants help in:",
      options: ["Nitrogen fixation", "Carbon fixation", "Decomposition", "Photosynthesis"],
      answer: "Nitrogen fixation (Converts atmospheric nitrogen into soluble nitrates for plant uptake)",
      marks: 1
    },
    {
      question: "Why should seeds be sown at appropriate depth and spacing?",
      options: ["To prevent overcrowding and ensure adequate sunlight, water, and nutrients", "To reduce water requirement", "To prevent birds from seeing the plant", "To facilitate weed growth"],
      answer: "To prevent overcrowding and ensure adequate sunlight, water, and nutrients",
      marks: 1
    },
    {
      question: "Differentiate between Manure and Fertiliser on the basis of composition and effect on soil humus.",
      answer: "Manure is an organic substance obtained by decomposition of plant/animal waste, enriching humus. Fertilisers are inorganic factory salts that do not add humus to soil.",
      marks: 2
    },
    {
      question: "Explain why tilling (ploughing) of soil is essential before sowing seeds.",
      answer: "Tilling loosens the soil, allowing plant roots to penetrate deep and breathe easily. It also turns nutrients from deeper layers up to the surface.",
      marks: 2
    },
    {
      question: "What are weeds? Describe two methods commonly used to remove weeds from crop fields.",
      answer: "Weeds are undesirable plants that grow along with crops. Methods: (1) Manual tilling/weeding using Khurpi before flowering, (2) Application of chemical weedicides like 2,4-D.",
      marks: 3
    },
    {
      question: "Compare Kharif crops and Rabi crops with at least two examples each and their typical sowing seasons in India.",
      answer: "Kharif: Sown in rainy season (June–Sept) e.g., Paddy, Maize. Rabi: Grown in winter (Oct–March) e.g., Wheat, Gram, Mustard.",
      marks: 3
    },
    {
      question: "Draw and briefly describe the Nitrogen Cycle, showing how biological nitrogen fixation maintains soil fertility in agricultural ecosystems.",
      answer: "Diagram illustrating Atmospheric N2 -> Fixation by Rhizobium / Blue-green algae -> Soil nitrates -> Plant intake -> Animals -> Decomposers -> Denitrifying bacteria releasing N2 back to atmosphere.",
      marks: 5
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        
        {/* Controls Toolbar (Hidden on print) */}
        <div className="px-6 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">
                Print-Ready Xerox Worksheet
              </h3>
              <p className="text-xs text-gray-500">
                A4 Black &amp; White high-contrast layout • Ink-saver optimized for school photocopiers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Print Density: Standard vs Paper-Saver */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setDensity("standard")}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  density === "standard"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  density === "compact"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-700 hover:text-emerald-800"
                }`}
                title="Paper-Saver: Compact layout guaranteed to fit 1 A4 photostat sheet"
              >
                📄 Paper-Saver
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isBilingual}
                onChange={(e) => setIsBilingual(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-0"
              />
              <span>Bilingual</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded focus:ring-0"
              />
              <span>Include Answer Key</span>
            </label>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Settings Sub-bar (Hidden on print) */}
        <div className="px-6 py-2 bg-amber-50/70 border-b border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900 font-medium shrink-0 print:hidden">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            <span className="shrink-0 text-gray-600 font-bold">Instructions:</span>
            <input
              type="text"
              value={examInstructions}
              onChange={(e) => setExamInstructions(e.target.value)}
              className="px-2 py-0.5 text-xs bg-white border border-amber-300 rounded font-medium text-gray-800 flex-1 focus:outline-hidden"
              title="Click to edit student examination instructions"
            />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">School:</span>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="px-2 py-0.5 text-xs bg-white border border-amber-300 rounded font-bold text-gray-800 w-36 sm:w-44 focus:outline-hidden"
                title="Click to change school name header"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Time:</span>
              <input
                type="text"
                value={timeAllowed}
                onChange={(e) => setTimeAllowed(e.target.value)}
                className="px-2 py-0.5 text-xs bg-white border border-amber-300 rounded font-bold text-gray-800 w-20 focus:outline-hidden"
                title="Exam time allowed"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Marks:</span>
              <input
                type="text"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="px-2 py-0.5 text-xs bg-white border border-amber-300 rounded font-bold text-gray-800 w-16 focus:outline-hidden"
                title="Maximum marks"
              />
            </div>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
          
          {/* Printable A4 Sheet Simulation */}
          <div 
            id="print-sheet-content" 
            className={`bg-white w-full max-w-[210mm] min-h-[297mm] shadow-md border border-gray-300 text-black font-serif print:m-0 print:p-0 print:border-none print:shadow-none print:w-full transition-all ${
              density === "compact" ? "p-5 sm:p-7 text-[13px]" : "p-8 sm:p-12 text-sm"
            }`}
            style={{ color: "#000000" }}
          >
            {/* Sheet Header */}
            <div className={`text-center border-b-2 border-black space-y-1 ${density === "compact" ? "pb-2.5" : "pb-4"}`}>
              <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide">
                {schoolName}
              </h1>
              <h2 className="text-base font-semibold uppercase">
                {isBilingual ? "फॉर्मेटिव मूल्यांकन एवं अभ्यास कार्यपत्रक • Formative Assessment" : "Formative Assessment & Practice Worksheet"}
              </h2>
              <div className="flex justify-between items-center text-xs font-bold pt-1">
                <span>{isBilingual ? `कक्षा / Class: ${grade} • विषय / Subject: ${subject}` : `Class: ${grade} • Subject: ${subject}`}</span>
                <span>{isBilingual ? `प्रकरण / Topic: ${title}` : `Topic: ${title}`}</span>
                <span>{isBilingual ? `अध्याय / Chapter: ${chapter}` : `Chapter: ${chapter}`}</span>
              </div>
            </div>

            {/* Exam Meta & Student Info Line */}
            <div className={`border-b border-black text-xs flex justify-between items-center font-sans font-semibold ${
              density === "compact" ? "py-1.5" : "py-2.5"
            }`}>
              <div className="flex gap-4">
                <span>{isBilingual ? "समय / Time:" : "Time Allowed:"} <strong>{timeAllowed}</strong></span>
                <span>{isBilingual ? "पूर्णांक / Max Marks:" : "Max Marks:"} <strong>{maxMarks}</strong></span>
              </div>
              <div>
                <span>{isBilingual ? "दिनांक / Date: _______________" : "Date: _______________"}</span>
              </div>
            </div>

            {/* Student Name & Roll No Fields */}
            <div className={`border-b border-black text-xs font-sans flex justify-between items-center ${
              density === "compact" ? "py-1.5" : "py-2.5"
            }`}>
              <span>{isBilingual ? "विद्यार्थी का नाम / Student Name: ________________________________" : "Student Name: _____________________________________________"}</span>
              <span>{isBilingual ? "अनुक्रमांक / Roll No: ________" : "Roll No: ________"}</span>
              <span>Sec: ______</span>
            </div>

            {/* General Instructions */}
            <div className={`border-b border-black font-sans text-gray-800 italic ${
              density === "compact" ? "py-1 text-[10px]" : "py-2 text-[11px]"
            }`}>
              <strong>{isBilingual ? "निर्देश / Instructions:" : "Instructions:"}</strong> {examInstructions}
            </div>

            {/* Question List */}
            <div className={`${density === "compact" ? "py-2 space-y-3.5" : "py-4 space-y-6"}`}>
              
              {/* Section A: Objective Questions */}
              <div>
                <div className="font-bold uppercase text-xs tracking-wider border-b border-black pb-1 mb-2">
                  {isBilingual ? "खंड अ: बहुविकल्पीय एवं वस्तुनिष्ठ प्रश्न (1 अंक प्रत्येक)" : "Section A: Multiple Choice & Objective Questions (1 Mark Each)"}
                </div>
                <div className={`${density === "compact" ? "space-y-2.5" : "space-y-4"}`}>
                  {displayQuestions.filter(q => (q.marks || 1) === 1).map((q, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold">Q{idx + 1}. {q.question}</span>
                        <span className="text-xs font-sans font-bold">[1]</span>
                      </div>
                      {q.options && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-5 text-xs font-sans">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1.5">
                              <span>({String.fromCharCode(65 + optIdx)})</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Short Concept Questions */}
              <div className={`${density === "compact" ? "pt-1" : "pt-2"}`}>
                <div className="font-bold uppercase text-xs tracking-wider border-b border-black pb-1 mb-2">
                  {isBilingual ? "खंड ब: लघु उत्तरीय अवधारणात्मक प्रश्न (2–3 अंक प्रत्येक)" : "Section B: Short Conceptual Questions (2–3 Marks Each)"}
                </div>
                <div className={`${density === "compact" ? "space-y-2.5" : "space-y-5"}`}>
                  {displayQuestions.filter(q => (q.marks || 1) > 1 && (q.marks || 1) <= 3).map((q, idx) => (
                    <div key={idx} className={`${density === "compact" ? "space-y-1" : "space-y-2"}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-bold">Q{idx + 4}. {q.question}</span>
                        <span className="text-xs font-sans font-bold">[{q.marks || 2}]</span>
                      </div>
                      {/* Blank answer writing lines for student */}
                      <div className="pl-4 space-y-1.5 text-gray-400 font-sans text-[11px]">
                        <div className="border-b border-dotted border-gray-400 h-3.5" />
                        {density !== "compact" && (
                          <div className="border-b border-dotted border-gray-400 h-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C: Long Answer / Application Questions */}
              <div className={`${density === "compact" ? "pt-1" : "pt-2"}`}>
                <div className="font-bold uppercase text-xs tracking-wider border-b border-black pb-1 mb-2">
                  {isBilingual ? "खंड स: अनुप्रयोग एवं चित्र प्रश्न (5 अंक)" : "Section C: Application & Diagram Questions (5 Marks)"}
                </div>
                <div className={`${density === "compact" ? "space-y-2.5" : "space-y-5"}`}>
                  {displayQuestions.filter(q => (q.marks || 1) > 3).map((q, idx) => (
                    <div key={idx} className={`${density === "compact" ? "space-y-1" : "space-y-2"}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-bold">Q{idx + 7}. {q.question}</span>
                        <span className="text-xs font-sans font-bold">[{q.marks || 5}]</span>
                      </div>
                      {/* Diagram or long response box */}
                      <div className={`border border-dashed border-gray-400 rounded p-2 flex items-center justify-center text-xs text-gray-400 font-sans italic ${
                        density === "compact" ? "h-14" : "h-28"
                      }`}>
                        [Draw diagram or write detailed answer here]
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Detachable Teacher Answer Key at Bottom (Optional) */}
            {includeAnswerKey && (
              <div className={`border-t-2 border-dashed border-black break-before-avoid ${
                density === "compact" ? "mt-4 pt-2" : "mt-8 pt-4"
              }`}>
                <div className="flex items-center justify-between text-xs font-sans font-bold text-gray-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>TEACHER ANSWER KEY &amp; MARKING SCHEME (DETACHABLE)</span>
                  </span>
                  <span>For Teacher Reference / Self-Evaluation</span>
                </div>

                <div className={`bg-gray-50 border border-gray-400 text-xs font-sans space-y-1.5 ${
                  density === "compact" ? "p-2 text-[11px]" : "p-3 text-xs"
                }`}>
                  {displayQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold shrink-0">Q{idx + 1}:</span>
                      <span className="text-gray-900">{q.answer || "Refer to NCERT Chapter Text"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sheet Footer */}
            <div className={`border-t border-black text-center text-[10px] font-sans text-gray-600 flex justify-between ${
              density === "compact" ? "mt-3 pt-1.5" : "mt-6 pt-2"
            }`}>
              <span>NCERT Curriculum Alignment • TeacherSathi Print Engine</span>
              <span>Page 1 of 1</span>
            </div>

          </div>

        </div>

      </div>

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-sheet-content, #print-sheet-content * {
            visibility: visible;
          }
          #print-sheet-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );
}
