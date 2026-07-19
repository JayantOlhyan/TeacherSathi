"use client";

import { useState, useEffect } from "react";
import { Plus, Search, 
  AlertTriangle, BookMarked, Globe 
} from "lucide-react";
import { adminStore, Book, Class, Subject } from "@/lib/adminStore";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals / forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [edition, setEdition] = useState("2026 Edition");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Deletion dependency warnings
  const [dependencyWarning, setDependencyWarning] = useState<string | null>(null);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBooks(adminStore.getBooks().filter(b => !b.is_archived));
    setClasses(adminStore.getClasses().filter(c => !c.is_active || !c.is_archived));
    setSubjects(adminStore.getSubjects().filter(s => !s.is_archived));
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setTitle("");
    setCoverUrl("");
    setClassId(classes[0]?.id || "");
    setSubjectId(subjects[0]?.id || "");
    setEdition("2026 Edition");
    setAcademicYear("2026-27");
    setPdfUrl("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bk: Book) => {
    setEditId(bk.id);
    setTitle(bk.title);
    setCoverUrl(bk.cover_image_url);
    setClassId(bk.class_id);
    setSubjectId(bk.subject_id);
    setEdition(bk.edition);
    setAcademicYear(bk.academic_year);
    setPdfUrl(bk.pdf_url);
    setIsActive(bk.is_active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !classId || !subjectId) return;

    const id = editId || `book-${Date.now()}`;
    const updatedBook: Book = {
      id,
      title,
      cover_image_url: coverUrl,
      class_id: classId,
      subject_id: subjectId,
      edition,
      academic_year: academicYear,
      pdf_url: pdfUrl,
      is_active: isActive,
      is_archived: false
    };

    adminStore.saveBook(updatedBook);
    loadData();
    setIsModalOpen(false);
  };

  const handleToggleStatus = (bk: Book) => {
    const updated = { ...bk, is_active: !bk.is_active };
    adminStore.saveBook(updated);
    loadData();
  };

  const handleRequestDelete = (id: string) => {
    const relatedChapters = adminStore.getChapters().filter(c => c.book_id === id);
    if (relatedChapters.length > 0) {
      setDependencyWarning(
        `This book is associated with ${relatedChapters.length} chapters. Archiving this book node will make all chapters (e.g. "${relatedChapters[0].title_en}") inaccessible.`
      );
      setTargetDeleteId(id);
    } else {
      adminStore.archiveBook(id);
      loadData();
    }
  };

  const handleConfirmDelete = () => {
    if (targetDeleteId) {
      adminStore.archiveBook(targetDeleteId);
      loadData();
      setDependencyWarning(null);
      setTargetDeleteId(null);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Textbook Node Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish textbook nodes, upload PDF reference documents, and structure class/subject linkages.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors border border-emerald-500 shadow-md shadow-emerald-950/20 w-max"
        >
          <Plus className="w-4 h-4" /> Add Textbook
        </button>
      </div>

      {/* Control bar */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search textbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>
      </div>

      {/* Dependency Warning dialog */}
      {dependencyWarning && (
        <div className="bg-amber-950/30 border border-amber-900/60 p-4 rounded-xl flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-400">Book Dependency Warning</h4>
            <p className="text-[11px] text-amber-300 mt-1 leading-relaxed">{dependencyWarning}</p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={handleConfirmDelete}
                className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors"
              >
                Archive Textbook
              </button>
              <button 
                onClick={() => setDependencyWarning(null)}
                className="text-slate-400 hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBooks.map((bk) => {
          const matchedClass = classes.find(c => c.id === bk.class_id);
          const matchedSubject = subjects.find(s => s.id === bk.subject_id);

          return (
            <div key={bk.id} className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg shadow-slate-950/20 flex flex-col justify-between space-y-4 hover:border-slate-700/60 transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                      {matchedClass?.name || bk.class_id}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleToggleStatus(bk)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-colors ${bk.is_active ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-slate-950 text-slate-500 border-slate-850'}`}
                  >
                    {bk.is_active ? "Active" : "Disabled"}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{bk.title}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1" style={{ color: matchedSubject?.color }}>
                    {matchedSubject?.name || bk.subject_id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                  <div>
                    <span className="text-slate-500 block">Academic Year</span>
                    <span className="text-slate-300 font-semibold">{bk.academic_year}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Edition</span>
                    <span className="text-slate-300 font-semibold">{bk.edition}</span>
                  </div>
                </div>

                {bk.pdf_url && (
                  <a 
                    href={bk.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20"
                  >
                    <Globe className="w-3.5 h-3.5" /> View Textbook PDF
                  </a>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/40">
                <button 
                  onClick={() => handleOpenEdit(bk)}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded border border-slate-800 text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleRequestDelete(bk.id)}
                  className="px-2.5 py-1.5 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 hover:text-rose-300 rounded border border-rose-900/30 text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Archive
                </button>
              </div>
            </div>
          );
        })}
        {filteredBooks.length === 0 && (
          <div className="col-span-full bg-[#0F1424] border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
            No textbooks currently published.
          </div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              {editId ? "Modify Textbook" : "Register Textbook Node"}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Book Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Science Textbook for Class 8"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Class Association</label>
                  <select 
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Association</label>
                  <select 
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Edition Title</label>
                  <input 
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Year</label>
                  <input 
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Complete Book PDF URL</label>
                <input 
                  type="text"
                  placeholder="e.g. https://s3.ap-south-1.amazonaws.com/books/c8science.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="modalIsActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="modalIsActive" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Mark active on initial load
                </label>
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
                  Save Textbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
