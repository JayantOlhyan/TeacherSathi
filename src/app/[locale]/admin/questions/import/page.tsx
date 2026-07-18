"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  FileCode, ArrowLeft, Upload, FileSpreadsheet, CheckCircle2, 
  AlertTriangle, Play, RefreshCw, Layers, Check, X, ShieldAlert 
} from "lucide-react";
import { adminStore, Question, Chapter } from "@/lib/adminStore";

interface ParsedRow {
  rowNum: number;
  textEn: string;
  textHi: string;
  type: string;
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  options: string[];
  correctIndex: number;
  isValid: boolean;
  errors: string[];
}

export default function BulkQuestionImportPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [targetChapterId, setTargetChapterId] = useState("");
  
  const [inputText, setInputText] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isImported, setIsImported] = useState(false);
  const [report, setReport] = useState({ success: 0, skipped: 0 });

  useEffect(() => {
    const list = adminStore.getChapters();
    setChapters(list);
    if (list.length > 0) setTargetChapterId(list[0].id);
  }, []);

  // Pre-load a sample JSON template for testing
  const loadSampleTemplate = () => {
    const sample = [
      {
        "textEn": "What is the process of converting plant matter into coal?",
        "textHi": "पौधे के मलबे को कोयले में बदलने की प्रक्रिया क्या कहलाती है?",
        "type": "MCQ",
        "marks": 1,
        "difficulty": "EASY",
        "explanation": "Carbonisation is the slow process of conversion of dead vegetation into coal.",
        "options": ["Carbonisation", "Combustion", "Irrigation", "Harvesting"],
        "correctIndex": 0
      },
      {
        "textEn": "Explain why coal and petroleum are exhaustible natural resources.",
        "textHi": "",
        "type": "Short Answer",
        "marks": 3,
        "difficulty": "MEDIUM",
        "explanation": "They take millions of years to form and are consumed faster than they can replenish.",
        "options": [],
        "correctIndex": -1
      },
      {
        "textEn": "Which of these is not a natural resource?",
        "type": "MCQ",
        "marks": 1,
        "difficulty": "EASY",
        "explanation": "Plastic is a synthetic polymer, not natural.",
        "options": ["Water", "Soil", "Plastic", "Air"],
        "correctIndex": 2
      }
    ];
    setInputText(JSON.stringify(sample, null, 2));
    setParsedRows([]);
    setHasValidated(false);
    setIsImported(false);
  };

  const handleValidate = () => {
    if (!inputText.trim()) return;
    try {
      const data = JSON.parse(inputText);
      if (!Array.isArray(data)) {
        alert("Input must be a valid JSON Array of question objects.");
        return;
      }

      const rows: ParsedRow[] = data.map((item, idx) => {
        const errors: string[] = [];
        
        // Validations
        if (!item.textEn || !item.textEn.trim()) {
          errors.push("Missing English question text.");
        }
        if (item.type === "MCQ") {
          if (!Array.isArray(item.options) || item.options.length < 2) {
            errors.push("MCQ must have at least 2 options.");
          }
          if (item.correctIndex === undefined || item.correctIndex < 0 || item.correctIndex >= (item.options?.length || 0)) {
            errors.push("MCQ must specify correctIndex matching options size.");
          }
        }
        if (item.marks === undefined || Number(item.marks) <= 0) {
          errors.push("Marks must be positive number.");
        }
        const diffs = ["EASY", "MEDIUM", "HARD"];
        if (item.difficulty && !diffs.includes(item.difficulty.toUpperCase())) {
          errors.push("Difficulty must be EASY, MEDIUM, or HARD.");
        }

        // Duplicate checks
        const matchesExisting = adminStore.getQuestions().some(
          q => q.text_en.toLowerCase().trim() === (item.textEn || "").toLowerCase().trim()
        );
        if (matchesExisting) {
          errors.push("Potential duplicate: Question text already exists in Database.");
        }

        return {
          rowNum: idx + 1,
          textEn: item.textEn || "",
          textHi: item.textHi || "",
          type: item.type || "MCQ",
          marks: Number(item.marks || 1),
          difficulty: (item.difficulty?.toUpperCase() || "EASY") as any,
          explanation: item.explanation || "",
          options: item.options || [],
          correctIndex: item.correctIndex !== undefined ? Number(item.correctIndex) : -1,
          isValid: errors.length === 0,
          errors
        };
      });

      setParsedRows(rows);
      setHasValidated(true);
      setIsImported(false);
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  const handleImport = () => {
    if (!targetChapterId) {
      alert("Please select a target curriculum chapter first.");
      return;
    }

    const validRows = parsedRows.filter(r => r.isValid);
    const skippedCount = parsedRows.length - validRows.length;

    const questionsToInsert: Question[] = validRows.map(r => {
      const opts = r.type === "MCQ" ? r.options.map((opt, oIdx) => ({
        id: `opt-${oIdx}-${Date.now()}`,
        option_text: opt,
        is_correct: oIdx === r.correctIndex
      })) : undefined;

      return {
        id: `q-bulk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        chapter_id: targetChapterId,
        question_type: r.type,
        marks: r.marks,
        difficulty: r.difficulty,
        competency_type: "Evaluation",
        text_en: r.textEn,
        text_hi: r.textHi || undefined,
        options: opts,
        explanation: r.explanation,
        source: "Bulk Sheet Import",
        tags: ["bulk_imported"],
        status: "PUBLISHED",
        is_archived: false
      };
    });

    if (questionsToInsert.length > 0) {
      adminStore.importQuestions(questionsToInsert);
    }

    setReport({
      success: questionsToInsert.length,
      skipped: skippedCount
    });
    setIsImported(true);
    setParsedRows([]);
    setHasValidated(false);
    setInputText("");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header breadcrumbs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <Link href="/admin/questions" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 border border-slate-850 rounded">
              Syllabus Operations
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Bulk Question Sheet Import</h2>
        </div>
      </div>

      {/* Select Chapter and Text area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input box panel */}
        <div className="lg:col-span-2 bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Paste JSON Spreadsheet Array</h3>
            <button 
              onClick={loadSampleTemplate}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Sample Template
            </button>
          </div>

          <textarea 
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='[\n  {\n    "textEn": "Question context?",\n    "type": "MCQ",\n    "marks": 1,\n    "difficulty": "EASY",\n    "options": ["A", "B", "C"],\n    "correctIndex": 0\n  }\n]'
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-slate-700 leading-relaxed"
          />

          <div className="flex items-center gap-3">
            <button 
              onClick={handleValidate}
              className="bg-emerald-650 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg flex items-center gap-2 transition-colors bg-emerald-600 border border-emerald-500 shadow-md"
            >
              <Play className="w-4 h-4 fill-current" /> Parse & Validate
            </button>
          </div>
        </div>

        {/* Configurations panel */}
        <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-4 self-start">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Node Configuration</h3>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Curriculum Chapter</label>
            <select 
              value={targetChapterId}
              onChange={(e) => setTargetChapterId(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
            >
              {chapters.map(c => <option key={c.id} value={c.id}>{c.title_en}</option>)}
            </select>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 text-[11px] text-slate-500 space-y-2">
            <span className="font-bold text-slate-400 block uppercase">Instructions</span>
            <p>1. Target chapter node must be selected prior to clicking import.</p>
            <p>2. Validation filters check for empty text fields, matching choices, and matching correct indices.</p>
            <p>3. Potential duplicates are highlighted automatically.</p>
          </div>
        </div>

      </div>

      {/* Import Report banner */}
      {isImported && (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Bulk Content Import Complete
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs max-w-sm">
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg">
              <span className="text-slate-500 block">Inserted Records</span>
              <span className="text-emerald-400 font-extrabold text-lg">{report.success} questions</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-lg">
              <span className="text-slate-500 block">Skipped Invalid/Duplicate</span>
              <span className="text-slate-400 font-extrabold text-lg">{report.skipped} questions</span>
            </div>
          </div>
        </div>
      )}

      {/* Parsed Rows Preview Panel */}
      {hasValidated && parsedRows.length > 0 && (
        <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sheet Verification Report</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Review parsed items below. {parsedRows.filter(r => r.isValid).length} rows are ready to import.
              </p>
            </div>
            <button 
              onClick={handleImport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg flex items-center gap-1.5 border border-emerald-500"
            >
              <Check className="w-4 h-4" /> Import Valid Records
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Row</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Marks</th>
                  <th className="p-4">Question Text (Parsed)</th>
                  <th className="p-4">Validation Status</th>
                  <th className="p-4 pr-6">Issues Highlighted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-medium">
                {parsedRows.map((row) => (
                  <tr key={row.rowNum} className={row.isValid ? "hover:bg-slate-905" : "bg-rose-950/10 hover:bg-rose-950/20"}>
                    <td className="p-4 pl-6 text-slate-500 font-mono">#{row.rowNum}</td>
                    <td className="p-4 text-slate-400">{row.type}</td>
                    <td className="p-4 text-slate-400">{row.marks} M</td>
                    <td className="p-4">
                      <div className="max-w-[300px] truncate text-slate-200 font-bold" title={row.textEn}>
                        {row.textEn}
                      </div>
                    </td>
                    <td className="p-4">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-rose-400">
                          <X className="w-3.5 h-3.5" /> Invalid
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 max-w-[250px] truncate">
                      {row.isValid ? (
                        <span className="text-slate-500">Ready to save</span>
                      ) : (
                        <div className="flex flex-col gap-0.5 text-rose-350">
                          {row.errors.map((e, idx) => (
                            <span key={idx} className="block text-[10px]">{e}</span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
