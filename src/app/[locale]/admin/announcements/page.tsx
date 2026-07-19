"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Edit3, Trash2, CheckCircle2, Search, Calendar
} from "lucide-react";
import { adminStore, Announcement } from "@/lib/adminStore";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [cta, setCta] = useState("");
  const [target, setTarget] = useState<Announcement["target"]>("EVERYONE");
  const [startDate, setStartDate] = useState("2026-07-18");
  const [endDate, setEndDate] = useState("2026-08-18");
  const [priority, setPriority] = useState<Announcement["priority"]>("MEDIUM");
  const [status, setStatus] = useState<Announcement["status"]>("DRAFT");

  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAnnouncements(adminStore.getAnnouncements().filter(a => a.status !== "ARCHIVED"));
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setTitle("");
    setMessage("");
    setCta("");
    setTarget("EVERYONE");
    setStartDate("2026-07-18");
    setEndDate("2026-08-18");
    setPriority("MEDIUM");
    setStatus("DRAFT");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditId(ann.id);
    setTitle(ann.title);
    setMessage(ann.message);
    setCta(ann.cta);
    setTarget(ann.target);
    setStartDate(ann.start_date);
    setEndDate(ann.end_date);
    setPriority(ann.priority);
    setStatus(ann.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const id = editId || `ann-${Date.now()}`;
    const updatedAnn: Announcement = {
      id,
      title,
      message,
      cta,
      target,
      start_date: startDate,
      end_date: endDate,
      priority,
      status
    };

    adminStore.saveAnnouncement(updatedAnn);
    loadData();
    setIsModalOpen(false);
    showFeedback("Announcement published reference saved.");
  };

  const handleDelete = (id: string) => {
    adminStore.deleteAnnouncement(id);
    loadData();
    showFeedback("Announcement deleted.");
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredAnn = announcements.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Platform Announcements</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch announcements targeting teachers or specific classrooms.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors border border-emerald-500 shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>

      {/* Control bar */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {feedback}
        </div>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAnn.map((ann) => (
          <div key={ann.id} className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700/60 transition-all">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                    ann.priority === 'HIGH' ? 'bg-rose-950/30 border-rose-900/50 text-rose-455' :
                    ann.priority === 'MEDIUM' ? 'bg-amber-950/30 border-amber-900/50 text-amber-400' :
                    'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-900 rounded">
                    Target: {ann.target}
                  </span>
                </div>

                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  ann.status === 'PUBLISHED' ? 'bg-emerald-950/40 text-emerald-450 border-emerald-900/60' : 'bg-slate-950 text-slate-500 border-slate-850'
                }`}>
                  {ann.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-200">{ann.title}</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">{ann.message}</p>
              </div>

              {ann.cta && (
                <div className="text-[10px] font-bold text-slate-500 font-mono">
                  CTA Redirect URL: <span className="text-slate-300 select-all">{ann.cta}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold bg-slate-950/65 p-2 rounded border border-slate-900">
                <Calendar className="w-3.5 h-3.5" />
                <span>Range: {ann.start_date} to {ann.end_date}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/40">
              <button 
                onClick={() => handleOpenEdit(ann)}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded border border-slate-800 text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(ann.id)}
                className="px-2 py-1 bg-rose-955/20 hover:bg-rose-900/30 text-rose-400 hover:text-rose-350 rounded border border-rose-900/30 text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {filteredAnn.length === 0 && (
          <div className="col-span-full bg-[#0F1424] border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
            No active announcements.
          </div>
        )}
      </div>

      {/* Add / Edit Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              {editId ? "Modify Announcement" : "Create Announcement"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Announcement Title</label>
                <input 
                  type="text"
                  required
                  placeholder="Welcome message banner..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Body Text Message</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Enter details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CTA Redirect URL / Path</label>
                <input 
                  type="text"
                  placeholder="e.g. /admin/dashboard or https://..."
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Audience</label>
                  <select 
                    value={target}
                    onChange={(e) => setTarget(e.target.value as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="EVERYONE">EVERYONE</option>
                    <option value="TEACHERS">TEACHERS ONLY</option>
                    <option value="STUDENTS">STUDENTS ONLY</option>
                    <option value="CLASS_8">CLASS 8 ONWARDS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiration Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Publication Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
