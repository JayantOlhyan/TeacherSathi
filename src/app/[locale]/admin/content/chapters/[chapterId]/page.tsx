"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { 
  FileText, ArrowLeft, Layers, Bookmark, FileSpreadsheet, Eye, HelpCircle, 
  Video, FolderOpen, History, Settings2, ShieldCheck, Plus, CheckCircle2, 
  ChevronRight, Trash2, Edit3, Save, RotateCw, Globe, Check, AlertTriangle, Key,
  ExternalLink
} from "lucide-react";
import { adminStore, Chapter, Book, Question, Video as VideoItem, Resource, ContentVersion } from "@/lib/adminStore";

type Tab = "overview" | "questions" | "pdfs" | "videos" | "resources" | "seo" | "history";

export default function ChapterWorkspacePage({ params }: { params: { chapterId: string } }) {
  const router = useRouter();
  const chapterId = params.chapterId;

  // Active state objects
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  // Tab-related dynamic lists
  const [questions, setQuestions] = useState<Question[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [versions, setVersions] = useState<ContentVersion[]>([]);

  // Editing structures
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states inside workspace tabs
  const [chTitleEn, setChTitleEn] = useState("");
  const [chTitleHi, setChTitleHi] = useState("");
  const [chDescEn, setChDescEn] = useState("");
  const [chDescHi, setChDescHi] = useState("");
  const [chObjectives, setChObjectives] = useState("");
  const [chKeywords, setChKeywords] = useState("");
  const [chStatus, setChStatus] = useState<Chapter["publication_status"]>("DRAFT");
  const [chLocked, setChLocked] = useState(false);

  // Question Form modal
  const [isQModalOpen, setIsQModalOpen] = useState(false);
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [qType, setQType] = useState("MCQ");
  const [qText, setQText] = useState("");
  const [qTextHi, setQTextHi] = useState("");
  const [qExplanation, setQExplanation] = useState("");
  const [qMarks, setQMarks] = useState(1);
  const [qDifficulty, setQDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [qOptions, setQOptions] = useState<{ text: string, correct: boolean }[]>([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false }
  ]);

  // Video linking form
  const [isVModalOpen, setIsVModalOpen] = useState(false);
  const [vTitle, setVTitle] = useState("");
  const [vDuration, setVDuration] = useState("5m 00s");
  const [vLang, setVLang] = useState("ENGLISH");
  const [vRef, setVRef] = useState("");

  // Resource upload form
  const [isRModalOpen, setIsRModalOpen] = useState(false);
  const [rTitle, setRTitle] = useState("");
  const [rType, setRType] = useState("Worksheet");
  const [rUrl, setRUrl] = useState("");

  useEffect(() => {
    loadWorkspace();
  }, [chapterId]);

  const loadWorkspace = () => {
    const ch = adminStore.getChapters().find(c => c.id === chapterId);
    if (!ch) return;
    setChapter(ch);
    setBook(adminStore.getBooks().find(b => b.id === ch.book_id) || null);
    
    // Set editable forms
    setChTitleEn(ch.title_en);
    setChTitleHi(ch.title_hi);
    setChDescEn(ch.description_en);
    setChDescHi(ch.description_hi);
    setChObjectives(ch.learning_objectives || "");
    setChKeywords(ch.keywords || "");
    setChStatus(ch.publication_status);
    setChLocked(ch.is_locked);

    // Fetch tab datasets
    setQuestions(adminStore.getQuestions().filter(q => q.chapter_id === chapterId && !q.is_archived));
    setVideos(adminStore.getVideos().filter(v => v.chapter_id === chapterId));
    setResources(adminStore.getResources().filter(r => r.chapter_id === chapterId));
    setVersions(adminStore.getContentVersions(chapterId));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter) return;
    setIsSaving(true);
    
    const updated: Chapter = {
      ...chapter,
      title_en: chTitleEn,
      title_hi: chTitleHi,
      description_en: chDescEn,
      description_hi: chDescHi,
      learning_objectives: chObjectives,
      keywords: chKeywords,
      publication_status: chStatus,
      is_locked: chLocked
    };

    adminStore.saveChapter(updated);
    setIsSaving(false);
    setFeedback("Chapter properties successfully updated and logged.");
    loadWorkspace();
    setTimeout(() => setFeedback(null), 3000);
  };

  // Question handlers
  const handleOpenAddQ = () => {
    setEditingQId(null);
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
    setIsQModalOpen(true);
  };

  const handleOpenEditQ = (q: Question) => {
    setEditingQId(q.id);
    setQType(q.question_type);
    setQText(q.text_en);
    setQTextHi(q.text_hi || "");
    setQExplanation(q.explanation);
    setQMarks(q.marks);
    setQDifficulty(q.difficulty);
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
    setIsQModalOpen(true);
  };

  const handleSaveQ = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingQId || `q-${Date.now()}`;
    const opts = qType === "MCQ" ? qOptions.map((o, idx) => ({ id: `opt-${idx}-${Date.now()}`, option_text: o.text, is_correct: o.correct })) : undefined;

    const updatedQ: Question = {
      id,
      chapter_id: chapterId,
      question_type: qType,
      marks: Number(qMarks),
      difficulty: qDifficulty,
      competency_type: "Application",
      text_en: qText,
      text_hi: qTextHi || undefined,
      options: opts,
      explanation: qExplanation,
      source: "Manual Admin Input",
      tags: ["curriculum", qType.toLowerCase()],
      status: "PUBLISHED",
      is_archived: false
    };

    adminStore.saveQuestion(updatedQ);
    setIsQModalOpen(false);
    loadWorkspace();
  };

  const handleDeleteQ = (id: string) => {
    adminStore.deleteQuestion(id);
    loadWorkspace();
  };

  // Video handlers
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle.trim() || !vRef.trim()) return;

    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      title: vTitle,
      description: "Admin linked video resource.",
      thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300",
      chapter_id: chapterId,
      duration: vDuration,
      language: vLang,
      tags: ["Linked"],
      source_type: "YOUTUBE",
      storage_reference: vRef,
      publication_status: "PUBLISHED"
    };

    adminStore.saveVideo(newVid);
    setIsVModalOpen(false);
    loadWorkspace();
  };

  const handleDeleteVideo = (id: string) => {
    adminStore.deleteVideo(id);
    loadWorkspace();
  };

  // Resource handlers
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rTitle.trim() || !rUrl.trim()) return;

    const newRes: Resource = {
      id: `res-${Date.now()}`,
      title: rTitle,
      type: rType,
      file_url: rUrl,
      chapter_id: chapterId,
      class_ids: [book?.class_id || ""],
      subject_ids: [book?.subject_id || ""]
    };

    adminStore.saveResource(newRes);
    setIsRModalOpen(false);
    loadWorkspace();
  };

  const handleDeleteResource = (id: string) => {
    adminStore.deleteResource(id);
    loadWorkspace();
  };

  if (!chapter) {
    return (
      <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-wider">
        Loading chapter workspace...
      </div>
    );
  }

  const tabsList = [
    { id: "overview", name: "Overview Details", icon: Settings2 },
    { id: "questions", name: "Question Bank", icon: HelpCircle },
    { id: "videos", name: "Video Materials", icon: Video },
    { id: "resources", name: "Support Resources", icon: FolderOpen },
    { id: "seo", name: "SEO & Metadata", icon: Globe },
    { id: "history", name: "Version Logs", icon: History }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Workspace Header breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/content/chapters" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 border border-slate-850 rounded">
                Chapter Node #{chapter.chapter_number}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-500 font-semibold">{book?.title}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{chapter.title_en}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
            chapter.publication_status === 'PUBLISHED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-slate-950 text-slate-500 border-slate-850'
          }`}>
            Status: {chapter.publication_status}
          </span>
          <a 
            href={`/content/${book?.class_id}/${book?.subject_id}/chapter-${chapter.chapter_number}`}
            target="_blank"
            rel="noreferrer"
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" /> Public View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 bg-[#0F1424] px-4 rounded-xl overflow-x-auto whitespace-nowrap">
        {tabsList.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`flex items-center gap-2 py-3.5 px-4 font-bold text-xs tracking-wider uppercase border-b-2 transition-all focus:outline-none ${
                isActive ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {feedback}
        </div>
      )}

      {/* Active Tab Screen */}
      <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-6 shadow-lg shadow-slate-950/20">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800/60">
              Basic Curriculum Properties
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title Name (English)</label>
                <input 
                  type="text"
                  required
                  value={chTitleEn}
                  onChange={(e) => setChTitleEn(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title Name (Hindi)</label>
                <input 
                  type="text"
                  value={chTitleHi}
                  onChange={(e) => setChTitleHi(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description (English)</label>
                <textarea 
                  rows={3}
                  value={chDescEn}
                  onChange={(e) => setChDescEn(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description (Hindi)</label>
                <textarea 
                  rows={3}
                  value={chDescHi}
                  onChange={(e) => setChDescHi(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-850">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Publication Status Pipeline</label>
                <select 
                  value={chStatus}
                  onChange={(e) => setChStatus(e.target.value as any)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
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
                  id="tabIsLocked"
                  checked={chLocked}
                  onChange={(e) => setChLocked(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="tabIsLocked" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Enforce lock state (Lock contents for normal teachers)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg border border-emerald-500 flex items-center gap-2 transition-colors disabled:opacity-40"
              >
                {isSaving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Chapter Details
              </button>
            </div>
          </form>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Assigned Questions ({questions.length})
              </h3>
              <button 
                onClick={handleOpenAddQ}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {questions.map((q) => (
                <div key={q.id} className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                        {q.question_type}
                      </span>
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                        Marks: {q.marks}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        q.difficulty === 'EASY' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' :
                        q.difficulty === 'MEDIUM' ? 'bg-amber-950/30 border-amber-900/50 text-amber-400' :
                        'bg-rose-950/30 border-rose-900/50 text-rose-400'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button 
                        onClick={() => handleOpenEditQ(q)}
                        className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQ(q.id)}
                        className="p-1 text-rose-450 hover:text-rose-450 bg-slate-900 border border-slate-800 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-200 font-semibold leading-relaxed">{q.text_en}</p>
                    {q.text_hi && <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">{q.text_hi}</p>}
                  </div>

                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-900">
                      {q.options.map((o) => (
                        <div key={o.id} className="flex items-center gap-2 text-slate-400">
                          {o.is_correct ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-3.5" />}
                          <span className={o.is_correct ? "text-emerald-400 font-semibold" : ""}>{o.option_text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="text-[10px] text-slate-500">
                      <span className="font-bold text-slate-400 uppercase block mb-0.5">Explanation</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  No questions linked to this chapter yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Assigned Video Content ({videos.length})
              </h3>
              <button 
                onClick={() => setIsVModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Link YouTube Video
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid) => (
                <div key={vid.id} className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex gap-3.5 justify-between">
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{vid.title}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5" style={{ color: book?.subject_id === 'science' ? '#10B981' : '#3B82F6' }}>
                        YouTube Ref: {vid.storage_reference}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                      <span>Duration: {vid.duration}</span>
                      <span>·</span>
                      <span>Lang: {vid.language}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="p-1.5 text-rose-450 hover:text-rose-300 hover:bg-rose-950/10 border border-rose-950/40 rounded transition-colors self-start shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {videos.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  No video modules linked to this chapter yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUPPORT RESOURCES TAB */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Chapter Downloadables ({resources.length})
              </h3>
              <button 
                onClick={() => setIsRModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Link Resource
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div key={res.id} className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">{res.title}</h4>
                    <span className="inline-block bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[9px] text-slate-400 font-bold uppercase">
                      {res.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={res.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors inline-flex"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-1 text-rose-450 hover:text-rose-300 bg-slate-900 border border-slate-800 rounded transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {resources.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  No support resources (worksheets, slides) linked to this chapter yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800/60">
              SEO Parameters & Discovery Metadata
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Learning Objectives (Brief summary)</label>
                <input 
                  type="text"
                  value={chObjectives}
                  onChange={(e) => setChObjectives(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Discovery Keywords (Comma separated tags)</label>
                <input 
                  type="text"
                  value={chKeywords}
                  onChange={(e) => setChKeywords(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg border border-emerald-500"
              >
                Update SEO Params
              </button>
            </div>
          </form>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800/60">
              Change Log & Version History Snapshot
            </h3>

            <div className="relative border-l border-slate-800 pl-4 ml-2 space-y-5">
              {versions.map((ver) => (
                <div key={ver.id} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F1424]"></span>
                  <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>Changed by {ver.changed_by}</span>
                      <span>{new Date(ver.changed_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold">{ver.change_summary}</p>
                    <span className="inline-block px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-[8px] text-slate-500 font-mono">
                      Ver {ver.version_number}
                    </span>
                  </div>
                </div>
              ))}

              {versions.length === 0 && (
                <div className="text-center py-6 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  No prior version history recorded for this node.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Question creation/edit modal */}
      {isQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              {editingQId ? "Modify Question Details" : "Construct Question Node"}
            </h3>

            <form onSubmit={handleSaveQ} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question Type</label>
                  <select 
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Long Answer">Long Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Marks Weight</label>
                  <input 
                    type="number"
                    value={qMarks}
                    onChange={(e) => setQMarks(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Difficulty Level</label>
                  <select 
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
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
                          // for MCQ, toggle correct check
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
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grading Answer Explanation</label>
                <textarea 
                  rows={2}
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsQModalOpen(false)}
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

      {/* Video link modal */}
      {isVModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Link YouTube Video Resource
            </h3>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Video Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Ray diagrams Concave Mirrors"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                  <input 
                    type="text"
                    value={vDuration}
                    onChange={(e) => setVDuration(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Language</label>
                  <select 
                    value={vLang}
                    onChange={(e) => setVLang(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="ENGLISH">ENGLISH</option>
                    <option value="HINDI">HINDI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">YouTube Video ID (11 chars)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. cB3H0KB3"
                  value={vRef}
                  onChange={(e) => setVRef(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsVModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg border border-emerald-500"
                >
                  Link Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource link modal */}
      {isRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Link Support Resource File
            </h3>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Resource Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Force and Pressure Worksheets"
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Resource Category</label>
                <select 
                  value={rType}
                  onChange={(e) => setRType(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Worksheet">Worksheet</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Lesson Plan">Lesson Plan</option>
                  <option value="Mind Map">Mind Map</option>
                  <option value="Notes">Notes</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Storage S3 URL / File Path</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. /resources/worksheets/ch1_force.pdf"
                  value={rUrl}
                  onChange={(e) => setRUrl(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsRModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg border border-emerald-500"
                >
                  Link Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
