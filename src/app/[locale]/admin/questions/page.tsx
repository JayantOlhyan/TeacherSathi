"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Plus, Edit3, Trash2, Copy, Search, Filter, FileCode, Check
} from "lucide-react";
import { adminStore, Question, Chapter, Book, Class, Subject } from "@/lib/adminStore";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedType] = useState("ALL");

  // Edit / Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState("");
  const [qType, setQType] = useState("MCQ");
  const [qMarks, setQMarks] = useState(1);
  const [qDifficulty, setQDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [qText, setQText] = useState("");
  const [qTextHi, setQTextHi] = useState("");
  const [qExplanation, setQExplanation] = useState("");
  const [qOptions, setQOptions] = useState<{ text: string, correct: boolean }[]>([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuestions(adminStore.getQuestions().filter(q => !q.is_archived));
    const allChapters = adminStore.getChapters();
    setChapters(allChapters);
    setChapterId(allChapters[0]?.id || "");
    setBooks(adminStore.getBooks().filter(b => !b.is_archived));
    setClasses(adminStore.getClasses().filter(c => !c.is_archived));
    setSubjects(adminStore.getSubjects().filter(s => !s.is_archived));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setQText("");
    setQTextHi("");
    setQExplanation("");
    setQMarks(1);
    setQDifficulty("EASY");
    setQOptions([
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingId(q.id);
    setChapterId(q.chapter_id);
    setQType(q.question_type);
    setQMarks(q.marks);
    setQDifficulty(q.difficulty);
    setQText(q.text_en);
    setQTextHi(q.text_hi || "");
    setQExplanation(q.explanation);
    if (q.options) {
      setQOptions(q.options.map(o => ({ text: o.option_text, correct: o.is_correct })));
    } else {
      setQOptions([
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false }
      ]);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !chapterId) return;

    const id = editingId || `q-${Date.now()}`;
    const opts = qType === "MCQ" ? qOptions.map((o, idx) => ({ id: `opt-${idx}-${Date.now()}`, option_text: o.text, is_correct: o.correct })) : undefined;

    const updatedQ: Question = {
      id,
      chapter_id: chapterId,
      question_type: qType,
      marks: Number(qMarks),
      difficulty: qDifficulty,
      competency_type: "Evaluation",
      text_en: qText,
      text_hi: qTextHi || undefined,
      options: opts,
      explanation: qExplanation,
      source: "Question Bank Input",
      tags: ["question_bank"],
      status: "PUBLISHED",
      is_archived: false
    };

    adminStore.saveQuestion(updatedQ);
    loadData();
    setIsModalOpen(false);
  };

  const handleDuplicate = (id: string) => {
    adminStore.duplicateQuestion(id);
    loadData();
  };

  const handleArchive = (id: string) => {
    adminStore.deleteQuestion(id);
    loadData();
  };

  const handleUpdateStatus = (q: Question, nextStatus: Question["status"]) => {
    const updated = { ...q, status: nextStatus };
    adminStore.saveQuestion(updated);
    loadData();
  };

  // Advanced Filtering
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (q.text_hi && q.text_hi.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Find chapter and book references
    const ch = chapters.find(c => c.id === q.chapter_id);
    const bk = ch ? books.find(b => b.id === ch.book_id) : null;

    const matchesClass = selectedClass === "ALL" || (bk && bk.class_id === selectedClass);
    const matchesSubject = selectedSubject === "ALL" || (bk && bk.subject_id === selectedSubject);
    const matchesDifficulty = selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty;
    const matchesType = selectedType === "ALL" || q.question_type === selectedType;

    return matchesSearch && matchesClass && matchesSubject && matchesDifficulty && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Question Bank Matrix</h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish questions, duplicate nodes, manage option values, and filter by subjects.
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/admin/questions/import"
            className="bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 border border-slate-800 transition-colors shadow-md"
          >
            <FileCode className="w-4 h-4 text-emerald-400" /> Bulk Import
          </Link>
          <button 
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors border border-emerald-500 shadow-md shadow-emerald-950/20"
          >
            <Plus className="w-4 h-4" /> Create Question
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Search & Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text"
                placeholder="Search question text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Difficulty</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question Catalog List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuestions.map((q) => {
          const ch = chapters.find(c => c.id === q.chapter_id);
          const bk = ch ? books.find(b => b.id === ch.book_id) : null;
          
          return (
            <div key={q.id} className="bg-[#0F1424] border border-slate-800/80 p-5 rounded-xl flex flex-col md:flex-row gap-5 items-start justify-between hover:border-slate-700/60 transition-all">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {q.question_type}
                  </span>
                  <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    Marks: {q.marks}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] border font-bold uppercase ${
                    q.difficulty === 'EASY' ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' :
                    q.difficulty === 'MEDIUM' ? 'bg-amber-950/40 border-amber-900/50 text-amber-400' :
                    'bg-rose-950/40 border-rose-900/50 text-rose-450'
                  }`}>
                    {q.difficulty}
                  </span>
                  {bk && (
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      · {bk.title} ({ch?.title_en})
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">{q.text_en}</p>
                  {q.text_hi && <p className="text-xs text-slate-550 font-semibold leading-relaxed">{q.text_hi}</p>}
                </div>

                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-900 max-w-xl">
                    {q.options.map(o => (
                      <div key={o.id} className="flex items-center gap-2 text-slate-450">
                        {o.is_correct ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-3.5" />}
                        <span className={o.is_correct ? "text-emerald-400 font-semibold" : ""}>{o.option_text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto items-center justify-end border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0">
                <select 
                  value={q.status}
                  onChange={(e) => handleUpdateStatus(q, e.target.value as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)}
                  className={`bg-slate-950 border text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded focus:outline-none cursor-pointer w-full md:w-28 text-center ${
                    q.status === 'PUBLISHED' ? 'text-emerald-400 border-emerald-950 bg-emerald-950/10' : 'text-slate-400 border-slate-800'
                  }`}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>

                <div className="flex gap-1.5 w-full md:w-auto justify-end">
                  <button 
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDuplicate(q.id)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-slate-350 hover:text-white transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleArchive(q.id)}
                    className="p-1.5 bg-rose-950/20 hover:bg-rose-900/30 rounded border border-rose-900/30 text-rose-400 hover:text-rose-350 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredQuestions.length === 0 && (
          <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-10 text-center text-slate-500 font-bold uppercase tracking-wider">
            No questions match active query filters.
          </div>
        )}
      </div>

      {/* Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              {editingId ? "Modify Question Details" : "Construct Question Node"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Chapter Node</label>
                  <select 
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    {chapters.map(c => <option key={c.id} value={c.id}>{c.title_en}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question Type</label>
                  <select 
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Long Answer">Long Answer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Marks Weight</label>
                  <input 
                    type="number"
                    value={qMarks}
                    onChange={(e) => setQMarks(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Difficulty Level</label>
                  <select 
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question Text (English)</label>
                <textarea 
                  rows={2}
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question Text (Hindi)</label>
                <textarea 
                  rows={2}
                  value={qTextHi}
                  onChange={(e) => setQTextHi(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              {qType === "MCQ" && (
                <div className="space-y-2 border-t border-slate-850 pt-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Multiple Choice Options</label>
                  {qOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <input 
                        type="checkbox"
                        checked={opt.correct}
                        onChange={(e) => {
                          const updated = [...qOptions];
                          updated[idx].correct = e.target.checked;
                          setQOptions(updated);
                        }}
                        className="rounded border-slate-805 bg-slate-950 text-emerald-600 focus:ring-0"
                      />
                      <input 
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...qOptions];
                          updated[idx].text = e.target.value;
                          setQOptions(updated);
                        }}
                        className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grading Explanation</label>
                <textarea 
                  rows={2}
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg border border-emerald-500"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
