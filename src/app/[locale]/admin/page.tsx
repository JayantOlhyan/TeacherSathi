"use client";

import { useState } from "react";
import { 
  Terminal, Database, Users, Plus, Edit, Lock, Unlock, 
  Play, RotateCw, Check, X, LayoutDashboard, 
  AlertTriangle, Cpu, DollarSign, BookOpen, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  id: number;
  titleEn: string;
  titleHi?: string;
  descriptionEn: string;
  descriptionHi?: string;
  isLocked: boolean;
}



interface ClassData {
  [className: string]: {
    [subjectName: string]: Chapter[];
  };
}

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "cms" | "pipeline" | "users">("overview");

  // CMS state
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  
  // Database state (Preloaded with Class 8 NCERT data we defined earlier)
  const [db, setDb] = useState<ClassData>({
    "Class 8": {
      "Science": [
        { id: 1, titleEn: "Crop Production and Management", descriptionEn: "Learn about agricultural practices, traditional methods, and modern irrigation tools.", isLocked: false },
        { id: 2, titleEn: "Microorganisms: Friend and Foe", descriptionEn: "Explore the microscopic world, helpful microbes, and viral diseases.", isLocked: false },
        { id: 3, titleEn: "Coal and Petroleum", descriptionEn: "Study fossil fuels, refining processes, and conservation of exhaustible resources.", isLocked: true },
        { id: 4, titleEn: "Combustion and Flame", descriptionEn: "Understand chemical process of burning, structure of candle flames, and fuel efficiency.", isLocked: true }
      ],
      "Mathematics": [
        { id: 1, titleEn: "Rational Numbers", descriptionEn: "Understand properties, representation on number line, and finding rational numbers between any two rational numbers.", isLocked: false },
        { id: 2, titleEn: "Linear Equations in One Variable", descriptionEn: "Learn to solve algebraic equations with single variables and apply them to word problems.", isLocked: false },
        { id: 3, titleEn: "Understanding Quadrilaterals", descriptionEn: "Explore polygons, curves, angle sum properties, and types of quadrilaterals like parallelograms.", isLocked: true }
      ],
      "Social Science": [
        { id: 1, titleEn: "How, When and Where", descriptionEn: "Study the importance of dates, colonial archives, and historical survey techniques.", isLocked: false },
        { id: 2, titleEn: "From Trade to Territory", descriptionEn: "Understand how the East India Company established political power and trade monopolies in India.", isLocked: false }
      ],
      "English": [
        { id: 1, titleEn: "A Letter to God", descriptionEn: "A story about a farmer's absolute faith in God.", isLocked: false },
        { id: 2, titleEn: "Long Walk to Freedom", descriptionEn: "Nelson Mandela's journey against apartheid in South Africa.", isLocked: true }
      ],
      "Hindi": [
        { id: 1, titleEn: "Surdas ke Pad", descriptionEn: "Poetic verses expressing devotion to Lord Krishna.", isLocked: false },
        { id: 2, titleEn: "Lakh ki Chudiyan", descriptionEn: "A story on traditional craftsmen in a changing economic landscape.", isLocked: true }
      ]
    },
    "Class 10": {
      "Science": [
        { id: 10, titleEn: "Light — Reflection & Refraction", descriptionEn: "Study plane/spherical mirrors, lens formula, and magnification calculations.", isLocked: false },
        { id: 11, titleEn: "Human Eye & Colorful World", descriptionEn: "Explore lens defects, glass prism dispersion, atmospheric refraction, and scattering.", isLocked: true }
      ]
    }
  });

  // Edit / Add Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterDesc, setNewChapterDesc] = useState("");
  const [newChapterId, setNewChapterId] = useState<number>(5);

  // Pipeline Job Queue state
  const [jobs, setJobs] = useState([
    { id: "30002001", chapter: "Light - Reflection & Refraction", class: "Class 10", status: "PROCESSING", cost: "14", duration: "10 min" },
    { id: "30001092", chapter: "Crop Production and Management", class: "Class 8", status: "DONE", cost: "8", duration: "8 min" },
    { id: "30001033", chapter: "Rational Numbers", class: "Class 8", status: "DONE", cost: "12", duration: "9 min" },
    { id: "30002899", chapter: "Coal and Petroleum", class: "Class 8", status: "FAILED", cost: "2", duration: "1 min" }
  ]);

  const [triggerClass, setTriggerClass] = useState("Class 8");
  const [triggerSubject, setTriggerSubject] = useState("Science");
  const [triggerChapter, setTriggerChapter] = useState("");

  // Handler: Lock/Unlock toggle
  const toggleChapterLock = (chapterId: number) => {
    const currentClassDb = db[selectedClass] || {};
    const currentSubjectChapters = currentClassDb[selectedSubject] || [];
    
    const updatedChapters = currentSubjectChapters.map((ch) => 
      ch.id === chapterId ? { ...ch, isLocked: !ch.isLocked } : ch
    );

    setDb({
      ...db,
      [selectedClass]: {
        ...currentClassDb,
        [selectedSubject]: updatedChapters
      }
    });
  };

  // Handler: Open edit modal
  const openEditModal = (ch: Chapter) => {
    setEditingChapter(ch);
    setEditedTitle(ch.titleEn);
    setEditedDesc(ch.descriptionEn);
    setIsEditModalOpen(true);
  };

  // Handler: Save edits
  const saveChapterEdits = () => {
    if (!editingChapter) return;
    const currentClassDb = db[selectedClass] || {};
    const currentSubjectChapters = currentClassDb[selectedSubject] || [];

    const updatedChapters = currentSubjectChapters.map((ch) => 
      ch.id === editingChapter.id 
        ? { ...ch, titleEn: editedTitle, descriptionEn: editedDesc } 
        : ch
    );

    setDb({
      ...db,
      [selectedClass]: {
        ...currentClassDb,
        [selectedSubject]: updatedChapters
      }
    });
    setIsEditModalOpen(false);
    setEditingChapter(null);
  };

  // Handler: Add chapter
  const addChapter = () => {
    if (!newChapterTitle) return;
    const currentClassDb = db[selectedClass] || {};
    const currentSubjectChapters = currentClassDb[selectedSubject] || [];

    const newCh: Chapter = {
      id: newChapterId,
      titleEn: newChapterTitle,
      descriptionEn: newChapterDesc,
      isLocked: true
    };

    setDb({
      ...db,
      [selectedClass]: {
        ...currentClassDb,
        [selectedSubject]: [...currentSubjectChapters, newCh]
      }
    });

    setNewChapterTitle("");
    setNewChapterDesc("");
    setNewChapterId((prev) => prev + 1);
    setIsAddModalOpen(false);
  };

  // Handler: Add Job to Pipeline
  const triggerPipeline = () => {
    if (!triggerChapter) return;
    const newJob = {
      id: Math.floor(10000000 + Math.random() * 90000000).toString(),
      chapter: triggerChapter,
      class: triggerClass,
      status: "QUEUED",
      cost: "2",
      duration: "Calculated..."
    };
    setJobs([newJob, ...jobs]);
    setTriggerChapter("");
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-200">
      
      {/* Side navigation bar + Top Bar integrated */}
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#0F1424] border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg">
                TS
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-white tracking-wide uppercase">TeacherSathi</h1>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Admin Workspace</p>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-1.5">
              {[
                { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
                { id: "cms", label: "Content Manager (CMS)", icon: Database },
                { id: "pipeline", label: "AI Pipeline Control", icon: Terminal },
                { id: "users", label: "Registered Teachers", icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "overview" | "cms" | "pipeline" | "users")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all relative ${
                      isActive 
                        ? "text-emerald-400 bg-emerald-500/10 border-l-4 border-emerald-400" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User info footer */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Admin Panel</p>
              <p className="text-[10px] text-slate-500 font-bold">System Root</p>
            </div>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-1 p-8 overflow-y-auto max-w-6xl">
          
          {/* Header block */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/40">
            <div>
              <h2 className="text-2xl font-black text-white font-serif tracking-tight capitalize">
                {activeTab === "overview" && "System Dashboard"}
                {activeTab === "cms" && "Content Management System (CMS)"}
                {activeTab === "pipeline" && "AI Generation Pipelines"}
                {activeTab === "users" && "Platform Enrolment Audit"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure database collections, unlock chapters, trigger processing slots, and manage API quotas.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#0F1424] border border-slate-800/80 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 uppercase tracking-wider">Server Status: Live</span>
            </div>
          </div>

          {/* Tab Render Switch */}
          <AnimatePresence mode="wait">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Stats cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Total Chapters", value: "24", sub: "NCERT Active", icon: BookOpen, color: "text-blue-400" },
                    { title: "Video Hours", value: "8.4h", sub: "Interactive Lessons", icon: Clock, color: "text-emerald-400" },
                    { title: "API Cost (MTD)", value: "₹2,400", sub: "Budget: ₹5,000", icon: DollarSign, color: "text-amber-400" },
                    { title: "Active Teachers", value: "148", sub: "Government Schools", icon: Users, color: "text-pink-400" }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-[#0F1424] border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">{stat.title}</span>
                          <span className="text-2xl font-black text-white block">{stat.value}</span>
                          <span className="text-[10px] text-slate-400 font-bold block">{stat.sub}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Main panel - Budgets and System Load */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Budget card */}
                  <div className="lg:col-span-2 bg-[#0F1424] border border-slate-800/80 p-6 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-200 tracking-wide uppercase">Claude API Quota Allocation</h3>
                    
                    <div className="space-y-6 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Monthly Budget (Claude-3.5-Sonnet)</span>
                          <span className="text-emerald-400">48% Consumed</span>
                        </div>
                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "48%" }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>₹0</span>
                          <span>Limit: ₹5,000 / month</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Database Storage Space</span>
                          <span className="text-blue-400">12% Consumed</span>
                        </div>
                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "12%" }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>0 MB</span>
                          <span>Limit: 512 MB (Supabase Free Tier)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System warnings/logs */}
                  <div className="bg-[#0F1424] border border-slate-800/80 p-6 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-200 tracking-wide uppercase">Active Platform Alerts</h3>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs font-medium text-amber-200">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <p className="font-bold">Missing Video IDs</p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5">3 Class 8 Mathematics chapters generated without matching YouTube embed links.</p>
                        </div>
                      </div>

                      <div className="flex gap-3 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs font-medium text-blue-200">
                        <Cpu className="w-5 h-5 text-blue-400 shrink-0" />
                        <div>
                          <p className="font-bold">Pipeline Idle</p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5">All queued generation loops completed. Ready for trigger slots.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. CMS CONTENT MANAGEMENT TAB */}
            {activeTab === "cms" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                
                {/* CMS explorer controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Select Class */}
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Syllabus Grade</label>
                    <div className="flex gap-2">
                      {["Class 8", "Class 10"].map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setSelectedClass(cls);
                            // Auto reset subject if not in the class
                            const subjects = Object.keys(db[cls] || {});
                            if (subjects.length > 0 && !subjects.includes(selectedSubject)) {
                              setSelectedSubject(subjects[0]);
                            }
                          }}
                          className={`flex-1 py-3 px-4 rounded-xl border text-xs font-extrabold transition-all ${
                            selectedClass === cls
                              ? "bg-emerald-500 text-[#080B11] border-emerald-400"
                              : "bg-[#0F1424] border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Subject */}
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Subject Database</label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(db[selectedClass] || {}).map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubject(sub)}
                          className={`py-3 px-4 rounded-xl border text-xs font-extrabold transition-all ${
                            selectedSubject === sub
                              ? "bg-emerald-500 text-[#080B11] border-emerald-400"
                              : "bg-[#0F1424] border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chapters list under active subject */}
                <div className="bg-[#0F1424] border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex justify-between items-center p-6 border-b border-slate-800/80">
                    <div>
                      <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                        {selectedClass} • {selectedSubject} Syllabus
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">Manage titles, summaries, and subscription locks.</p>
                    </div>
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10"
                    >
                      <Plus className="w-4 h-4" /> Add Chapter
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-950/45 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-4 w-12 text-center">ID</th>
                          <th className="p-4">Chapter Title</th>
                          <th className="p-4">Bilingual Summary Description</th>
                          <th className="p-4 text-center">Visibility</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {(db[selectedClass]?.[selectedSubject] || []).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                              No Chapters Registered
                            </td>
                          </tr>
                        ) : (
                          (db[selectedClass]?.[selectedSubject] || []).map((ch) => (
                            <tr key={ch.id} className="hover:bg-slate-900/30 transition-colors">
                              <td className="p-4 text-center font-mono font-bold text-slate-500">
                                {ch.id.toString().padStart(2, "0")}
                              </td>
                              <td className="p-4 font-bold text-slate-200 max-w-[200px] truncate">
                                {ch.titleEn}
                              </td>
                              <td className="p-4 max-w-sm truncate text-slate-400 font-medium">
                                {ch.descriptionEn}
                              </td>
                              <td className="p-4 text-center">
                                <button 
                                  onClick={() => toggleChapterLock(ch.id)}
                                  className={`px-3 py-1 rounded-lg font-black uppercase text-[10px] border flex items-center gap-1.5 mx-auto ${
                                    ch.isLocked 
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" 
                                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                  }`}
                                >
                                  {ch.isLocked ? (
                                    <>
                                      <Lock className="w-3 h-3" /> Locked (Pro)
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="w-3 h-3" /> Public (Free)
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => openEditModal(ch)}
                                  className="text-slate-400 hover:text-emerald-400 font-bold border border-slate-800 hover:border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1 ml-auto transition-all"
                                >
                                  <Edit className="w-3 h-3" /> Edit Details
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. PIPELINE CONTROL TAB */}
            {activeTab === "pipeline" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Job Trigger Slot */}
                  <div className="bg-[#0F1424] border border-slate-800/80 p-6 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-200 tracking-wide uppercase">Trigger Generation Cycle</h3>
                    
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1.5">Class Selection</label>
                        <select 
                          value={triggerClass}
                          onChange={(e) => setTriggerClass(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option>Class 8</option>
                          <option>Class 10</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1.5">Subject Collection</label>
                        <select 
                          value={triggerSubject}
                          onChange={(e) => setTriggerSubject(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option>Science</option>
                          <option>Mathematics</option>
                          <option>Social Science</option>
                          <option>English</option>
                          <option>Hindi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1.5">Chapter Target Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Chemical Effects of Electric Current"
                          value={triggerChapter}
                          onChange={(e) => setTriggerChapter(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button 
                        onClick={triggerPipeline}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/20 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10"
                      >
                        <Play className="w-4 h-4 fill-current" /> Trigger Pipeline
                      </button>
                    </div>
                  </div>

                  {/* Jobs log monitor */}
                  <div className="lg:col-span-2 bg-[#0F1424] border border-slate-800/80 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800/80">
                      <h3 className="font-extrabold text-sm text-slate-200 tracking-wide uppercase">Active Pipeline Queues</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Logs of automated slides and interactive lessons generator slots.</p>
                    </div>

                    <div className="overflow-x-auto font-mono">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-950/45 border-b border-slate-800 text-slate-400">
                          <tr>
                            <th className="p-4 font-normal">JOB ID</th>
                            <th className="p-4 font-normal">CHAPTER</th>
                            <th className="p-4 font-normal">CLASS</th>
                            <th className="p-4 font-normal">STATUS</th>
                            <th className="p-4 font-normal text-right">COST ₹</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-900/30">
                              <td className="p-4">{job.id}</td>
                              <td className="p-4 max-w-[150px] truncate">{job.chapter}</td>
                              <td className="p-4 font-bold">{job.class}</td>
                              <td className="p-4">
                                {job.status === "QUEUED" && <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">QUEUED</span>}
                                {job.status === "PROCESSING" && <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">PROCESSING <RotateCw className="w-3 h-3 animate-spin" /></span>}
                                {job.status === "DONE" && <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">DONE <Check className="w-3 h-3" /></span>}
                                {job.status === "FAILED" && <span className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">FAILED <X className="w-3 h-3" /></span>}
                              </td>
                              <td className="p-4 text-right font-bold text-slate-200">₹{job.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 4. USERS TAB */}
            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#0F1424] border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-6 border-b border-slate-800/80">
                  <h3 className="font-extrabold text-sm text-slate-200 tracking-wide uppercase">Registered Educator Accounts</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Verify teacher registration logs and plan tiers.</p>
                </div>
                
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-950/45 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Educator Name</th>
                        <th className="p-4">School Details</th>
                        <th className="p-4 text-center">Taught Chapters</th>
                        <th className="p-4">Plan Status</th>
                        <th className="p-4 text-right">Registered On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                      {[
                        { name: "Ramesh Sharma", school: "GSSS Bilaspur, Haryana", count: 4, plan: "Pro Tier", date: "2026-06-12" },
                        { name: "Sunita Verma", school: "GGSSS Rohini, New Delhi", count: 6, plan: "Pro Tier", date: "2026-06-14" },
                        { name: "Amit Patel", school: "Government High School, Anand, Gujarat", count: 1, plan: "Free Plan", date: "2026-06-20" },
                        { name: "Priya Nair", school: "GHS Kayamkulam, Kerala", count: 3, plan: "Free Plan", date: "2026-06-25" }
                      ].map((usr, uIdx) => (
                        <tr key={uIdx} className="hover:bg-slate-900/30">
                          <td className="p-4 font-bold text-slate-200">{usr.name}</td>
                          <td className="p-4 text-slate-400 font-medium">{usr.school}</td>
                          <td className="p-4 text-center font-mono font-bold text-slate-300">{usr.count}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              usr.plan === "Pro Tier" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {usr.plan}
                            </span>
                          </td>
                          <td className="p-4 text-right text-slate-400 font-medium">{usr.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>

      {/* ✏️ MODAL: EDIT CHAPTER DETAILS */}
      <AnimatePresence>
        {isEditModalOpen && editingChapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0F1424] border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Modify Chapter Metadata</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Editing Chapter ID {editingChapter.id}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Chapter Title (English)</label>
                    <input 
                      type="text" 
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Syllabus Summary Description</label>
                    <textarea 
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="border border-slate-800 hover:bg-slate-900 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveChapterEdits}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-500/15"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ➕ MODAL: ADD CHAPTER DETAILS */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0F1424] border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Add New Syllabus Chapter</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Registering new module in {selectedClass} • {selectedSubject}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Chapter Number ID</label>
                      <input 
                        type="number" 
                        value={newChapterId}
                        onChange={(e) => setNewChapterId(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Default Plan Status</label>
                      <input 
                        type="text" 
                        value="Locked (Pro)" 
                        disabled 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Chapter Title (English)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Combustion and Flame"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Syllabus Summary Description</label>
                    <textarea 
                      placeholder="Enter a brief summary overview of the chapter learning objectives..."
                      value={newChapterDesc}
                      onChange={(e) => setNewChapterDesc(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="border border-slate-800 hover:bg-slate-900 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addChapter}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-500/15"
                  >
                    Add Chapter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
