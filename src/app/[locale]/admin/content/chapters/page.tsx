"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  Plus, Edit3, Lock, Unlock, Search, ExternalLink, Eye, 
  CheckCircle2, RefreshCw, XCircle, FileSpreadsheet
} from "lucide-react";
import { adminStore, Chapter, Book, Class, Subject } from "@/lib/adminStore";

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookFilter, setSelectedBookFilter] = useState("ALL");

  // Modals / forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [bookId, setBookId] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [keywords, setKeywords] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [status, setStatus] = useState<Chapter["publication_status"]>("DRAFT");
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChapters(adminStore.getChapters().sort((a, b) => a.chapter_number - b.chapter_number));
    setBooks(adminStore.getBooks().filter(b => !b.is_archived));
    setClasses(adminStore.getClasses().filter(c => !c.is_archived));
    setSubjects(adminStore.getSubjects().filter(s => !s.is_archived));
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setBookId(books[0]?.id || "");
    setChapterNumber(chapters.length + 1);
    setTitleEn("");
    setTitleHi("");
    setDescriptionEn("");
    setDescriptionHi("");
    setLearningObjectives("");
    setKeywords("");
    setThumbnailUrl("");
    setPdfUrl("");
    setStatus("DRAFT");
    setIsLocked(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ch: Chapter) => {
    setEditId(ch.id);
    setBookId(ch.book_id);
    setChapterNumber(ch.chapter_number);
    setTitleEn(ch.title_en);
    setTitleHi(ch.title_hi);
    setDescriptionEn(ch.description_en);
    setDescriptionHi(ch.description_hi);
    setLearningObjectives(ch.learning_objectives);
    setKeywords(ch.keywords);
    setThumbnailUrl(ch.thumbnail_url);
    setPdfUrl(ch.pdf_url);
    setStatus(ch.publication_status);
    setIsLocked(ch.is_locked);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !bookId) return;

    const id = editId || `ch-${Date.now()}`;
    const display_order = editId 
      ? (chapters.find(c => c.id === editId)?.display_order || 1)
      : chapters.length + 1;

    const updatedChapter: Chapter = {
      id,
      book_id: bookId,
      chapter_number: Number(chapterNumber),
      title_en: titleEn,
      title_hi: titleHi,
      description_en: descriptionEn,
      description_hi: descriptionHi,
      learning_objectives: learningObjectives,
      keywords,
      thumbnail_url: thumbnailUrl,
      pdf_url: pdfUrl,
      publication_status: status,
      is_locked: isLocked,
      display_order
    };

    adminStore.saveChapter(updatedChapter);
    loadData();
    setIsModalOpen(false);
  };

  const handleToggleLock = (ch: Chapter) => {
    const updated = { ...ch, is_locked: !ch.is_locked };
    adminStore.saveChapter(updated);
    loadData();
  };

  const handleUpdateStatus = (ch: Chapter, nextStatus: Chapter["publication_status"]) => {
    const updated = { ...ch, publication_status: nextStatus };
    adminStore.saveChapter(updated);
    loadData();
  };

  const filteredChapters = chapters.filter(c => {
    const matchesSearch = c.title_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.title_hi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBook = selectedBookFilter === "ALL" || c.book_id === selectedBookFilter;
    return matchesSearch && matchesBook;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#14532D] tracking-wide">Chapter Content Mapping</h2>
          <p className="text-xs text-slate-500 mt-1">
            Build chapter configurations, adjust status flows, or launch the Workspace tool.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#14532D] hover:bg-[#114022] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors border border-emerald-800 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search chapters by EN/HI titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0">Filter Book</span>
          <select 
            value={selectedBookFilter}
            onChange={(e) => setSelectedBookFilter(e.target.value)}
            className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-slate-350 transition-colors"
          >
            <option value="ALL">All Textbooks</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">No.</th>
                <th className="p-4">Chapter Title (EN / HI)</th>
                <th className="p-4">Textbook Node</th>
                <th className="p-4">Publication Status</th>
                <th className="p-4">Access Lock</th>
                <th className="p-4 text-center">Admin Workspace</th>
                <th className="p-4 pr-6 text-right">Modify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredChapters.map((ch) => {
                const bk = books.find(b => b.id === ch.book_id);
                return (
                  <tr key={ch.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 text-slate-400 font-mono font-bold">
                      Ch-{ch.chapter_number}
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-800 font-bold text-xs block">{ch.title_en}</span>
                        {ch.title_hi && <span className="text-slate-450 font-semibold block">{ch.title_hi}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 max-w-[150px] truncate">{bk?.title || ch.book_id}</td>
                    <td className="p-4">
                      <select 
                        value={ch.publication_status}
                        onChange={(e) => handleUpdateStatus(ch, e.target.value as any)}
                        className={`bg-white border text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md focus:outline-none cursor-pointer ${
                          ch.publication_status === 'PUBLISHED' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                          ch.publication_status === 'IN_REVIEW' ? 'text-amber-700 border-amber-250 bg-amber-50' :
                          ch.publication_status === 'APPROVED' ? 'text-blue-700 border-blue-200 bg-blue-50' :
                          ch.publication_status === 'ARCHIVED' ? 'text-rose-700 border-rose-200 bg-rose-50' :
                          'text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="IN_REVIEW">IN_REVIEW</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleLock(ch)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors text-[10px] font-bold uppercase ${ch.is_locked ? 'bg-amber-55/80 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                      >
                        {ch.is_locked ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-600" /> Locked
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        href={`/admin/content/chapters/${ch.id}`}
                        className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-colors shadow-xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-650" /> Enter Workspace <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => handleOpenEdit(ch)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors inline-flex"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredChapters.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                    No curriculum chapters match active filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-slate-800">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              {editId ? "Modify Chapter Node" : "Register Chapter Node"}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Textbook Reference</label>
                  <select 
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                  >
                    {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chapter Index/No.</label>
                  <input 
                    type="number"
                    required
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(Number(e.target.value))}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chapter Title (English)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Crop Production"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chapter Title (Hindi)</label>
                  <input 
                    type="text"
                    placeholder="e.g. फसल उत्पादन"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description (English)</label>
                  <textarea 
                    rows={2}
                    placeholder="Brief outline..."
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-350 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description (Hindi)</label>
                  <textarea 
                    rows={2}
                    placeholder="हिन्दी विवरण..."
                    value={descriptionHi}
                    onChange={(e) => setDescriptionHi(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-350 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Learning Objectives</label>
                  <input 
                    type="text"
                    placeholder="Students will learn how to..."
                    value={learningObjectives}
                    onChange={(e) => setLearningObjectives(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keywords (Comma separated)</label>
                  <input 
                    type="text"
                    placeholder="e.g. soil, seed, harvest"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thumbnail Asset URL</label>
                  <input 
                    type="text"
                    placeholder="images/chapters/thumb.jpg"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chapter PDF Document URL</label>
                  <input 
                    type="text"
                    placeholder="documents/pdfs/ch1.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Publication Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 pt-6">
                  <input 
                    type="checkbox"
                    id="modalIsLocked"
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-emerald-700 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="modalIsLocked" className="text-xs text-slate-605 font-semibold cursor-pointer">
                    Lock chapter access (Require premium token)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#14532D] hover:bg-[#114022] text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
