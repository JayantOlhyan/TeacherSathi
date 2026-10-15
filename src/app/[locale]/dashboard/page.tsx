"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { 
  Bell, 
  BookOpen, 
  PlusCircle, 
  MessageSquare, 
  Users, 
  X, 
  Send, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  FileText,
  Calendar,
  Lightbulb,
  QrCode,
  Compass,
  Tv,
  Search,
  PenTool,
  CheckSquare
} from "lucide-react";
import ClassroomSessionHeader from "@/components/dashboard/ClassroomSessionHeader";
import SmartboardQRAuthModal from "@/components/auth/SmartboardQRAuthModal";
import ClassroomControlPanel from "@/components/classroom/ClassroomControlPanel";
import { useTeachingContext } from "@/lib/context/teachingContext";

export default function DashboardPage() {
  // Overlays & Stateful Dialogs
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  const [isAttentionBellActive, setIsAttentionBellActive] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<{ sessionId?: string; durationMins: number; className: string } | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  
  // Genie Chat Logic State
  const [chatMessage, setChatMessage] = useState("");
  const [isGenieThinking, setIsGenieThinking] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "नमस्ते! I am Saathi Genie 🧞‍♂️. Ask me anything about NCERT chapters, early literacy, lesson planning, or live student clickers!", sender: "genie" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { context: teachingCtx } = useTeachingContext();

  const [classesList, setClassesList] = useState([
    { id: "cls-8a", name: "Class 8-A", grade_id: "class-8", section: "A", subject: "Science", count: 42, activeTopic: "Crop Production & Management" },
    { id: "cls-9b", name: "Class 9-B", grade_id: "class-9", section: "B", subject: "Science", count: 38, activeTopic: "Matter in Our Surroundings" },
    { id: "cls-10a", name: "Class 10-A", grade_id: "class-10", section: "A", subject: "Science", count: 40, activeTopic: "Light - Reflection & Refraction" },
    { id: "cls-7a", name: "Class 7-A", grade_id: "class-7", section: "A", subject: "Science", count: 35, activeTopic: "Nutrition in Plants" },
  ]);

  const [selectedClassId, setSelectedClassId] = useState<string>("cls-8a");

  const classChapterMeta: Record<string, {
    gradeSlug: string;
    gradeName: string;
    subjectSlug: string;
    subjectName: string;
    chapterSlug: string;
    chapterNum: number;
    title: string;
    titleHi: string;
    totalTopics: number;
    completedTopics: number;
  }> = {
    "cls-8a": {
      gradeSlug: "class-8",
      gradeName: "Class 8",
      subjectSlug: "science",
      subjectName: "Science",
      chapterSlug: "chapter-1",
      chapterNum: 1,
      title: "Crop Production and Management",
      titleHi: "फसल उत्पादन एवं प्रबंध",
      totalTopics: 7,
      completedTopics: 4,
    },
    "cls-9b": {
      gradeSlug: "class-9",
      gradeName: "Class 9",
      subjectSlug: "science",
      subjectName: "Science",
      chapterSlug: "chapter-1",
      chapterNum: 1,
      title: "Matter in Our Surroundings",
      titleHi: "हमारे आस-पास के पदार्थ",
      totalTopics: 6,
      completedTopics: 3,
    },
    "cls-10a": {
      gradeSlug: "class-10",
      gradeName: "Class 10",
      subjectSlug: "science",
      subjectName: "Science",
      chapterSlug: "chapter-10",
      chapterNum: 10,
      title: "Light - Reflection & Refraction",
      titleHi: "प्रकाश - परावर्तन तथा अपवर्तन",
      totalTopics: 8,
      completedTopics: 5,
    },
    "cls-7a": {
      gradeSlug: "class-7",
      gradeName: "Class 7",
      subjectSlug: "science",
      subjectName: "Science",
      chapterSlug: "chapter-1",
      chapterNum: 1,
      title: "Nutrition in Plants",
      titleHi: "पादपों में पोषण",
      totalTopics: 5,
      completedTopics: 2,
    },
  };

  const [classAnalytics, setClassAnalytics] = useState<{
    overallClassMastery: number;
    needsSupportCount: number;
    onTrackCount: number;
    className: string;
  } | null>(null);

  useEffect(() => {
    async function fetchDashboardAnalytics() {
      try {
        const cRes = await fetch("/api/classes");
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (Array.isArray(cJson.data) && cJson.data.length > 0) {
            const mapped = cJson.data.map((c: { id?: string; name?: string; grade_id?: string; section?: string; count?: number; subject?: string; activeTopic?: string }, idx: number) => ({
              id: c.id || `cls-${idx}`,
              name: c.name || `Class ${idx + 6}`,
              grade_id: c.grade_id || `class-${idx + 6}`,
              section: c.section || "A",
              count: c.count || 36 + (idx * 2),
              subject: c.subject || "Science",
              activeTopic: c.activeTopic || (idx === 0 ? "Crop Production & Management" : "NCERT Curriculum Pack"),
            }));
            setClassesList(mapped);

            const firstClass = cJson.data[0];
            const aRes = await fetch(`/api/analytics/class/${firstClass.id}`);
            if (aRes.ok) {
              const aJson = await aRes.json();
              if (aJson.data && aJson.data.studentCount > 0) {
                setClassAnalytics({
                  overallClassMastery: aJson.data.overallClassMastery,
                  needsSupportCount: aJson.data.studentGroupings.needsSupport.length,
                  onTrackCount: aJson.data.studentGroupings.onTrack.length,
                  className: `${firstClass.name} (${firstClass.section})`,
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard analytics:", err);
      }
    }
    fetchDashboardAnalytics();
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("last_sathi_teacher_name");
    if (storedName && storedName.trim() !== "" && storedName !== "null" && storedName !== "undefined") {
      setTeacherName(storedName.trim().split(" ")[0]);
    }
  }, []);

  // Scroll chat to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenieThinking]);

  // Self-closing timer for Attention Bell overlay
  useEffect(() => {
    if (isAttentionBellActive) {
      const timer = setTimeout(() => {
        setIsAttentionBellActive(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAttentionBellActive]);

  const playAttentionBellSound = () => {
    setIsAttentionBellActive(true);
    if (typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 1.2);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 1.2);
      });
    } catch {
      // AudioContext fallback
    }
  };

  const handleGenieSubmit = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const query = textOverride || chatMessage;
    if (!query.trim()) return;

    const userMsg = { id: messages.length + 1, text: query, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setChatMessage("");
    setIsGenieThinking(true);

    try {
      const res = await fetch("/api/ai/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          grade: "Class 8",
          subject: "Science",
          chapter: "Force and Pressure"
        }),
      });

      if (!res.ok) {
        throw new Error(`Genie error (${res.status})`);
      }

      const data = await res.json();
      let responseText = data.answer || "Here is a pedagogical recommendation for your class.";
      if (data.actionable_steps && data.actionable_steps.length > 0) {
        responseText += "\n\n**Actionable Steps:**\n" + data.actionable_steps.map((s: string) => `• ${s}`).join("\n");
      }
      if (data.quick_followups && data.quick_followups.length > 0) {
        responseText += "\n\n*Suggested Follow-up:* " + data.quick_followups[0];
      }

      const genieMsg = { id: messages.length + 2, text: responseText, sender: "genie" };
      setMessages(prev => [...prev, genieMsg]);
    } catch {
      const fallbackMsg = {
        id: messages.length + 2,
        text: "I could not reach the Saathi Genie AI engine right now. Please verify your connection or AI provider configuration.",
        sender: "genie"
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenieThinking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 relative">
      
      {/* Smart Classroom Session Header Bar */}
      {activeSession && (
        <ClassroomSessionHeader
          sessionId={activeSession.sessionId}
          initialMinutes={activeSession.durationMins}
          classNameTitle={activeSession.className}
          onEndSession={() => setActiveSession(null)}
        />
      )}

      {/* Live Classroom Remote Control Panel */}
      {activeSession?.sessionId && (
        <ClassroomControlPanel
          sessionId={activeSession.sessionId}
          onSessionEnded={() => setActiveSession(null)}
        />
      )}

      {/* Top Banner: Greeting, Guidance, and Primary Action */}
      <div className="bg-gradient-to-br from-[#14532D] to-[#15803D] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Classroom Assistant Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Good day, {teacherName}! 👋</h1>
          <p className="text-white/80 max-w-xl text-sm font-medium">
            Continue preparing for your next session. Use your smart classroom features, launch student clickers, or create resources with AI.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 flex-wrap">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black px-4 py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            Smartboard 75&quot; QR Auth
          </button>
          <Link 
            href="/dashboard/create" 
            className="inline-flex items-center gap-2 bg-white text-[#14532D] hover:bg-green-50 font-bold px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Create with AI
          </Link>
          <button 
            onClick={playAttentionBellSound}
            title="Sound gentle classroom attention chime"
            className="inline-flex items-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer border border-emerald-500/40"
          >
            <Bell className="w-4 h-4" />
            Attention Chime
          </button>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
      </div>

      {/* Sahaj Global Search Trigger (1-Tap Jump to any of 345 NCERT Chapters & Tools) */}
      <div 
        onClick={() => window.dispatchEvent(new Event("open-search"))}
        className="bg-white hover:bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 p-3 sm:p-4 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            window.dispatchEvent(new Event("open-search"));
          }
        }}
        aria-label="Search all 345 NCERT chapters and tools"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-gray-800 text-sm group-hover:text-emerald-950 truncate">
              Search any NCERT chapter, topic, or quiz... (e.g. &ldquo;Class 8 Force&rdquo;, &ldquo;फसल&rdquo;, &ldquo;Light&rdquo;)
            </p>
            <p className="text-gray-400 text-xs font-semibold truncate hidden sm:block">
              Jump immediately to 75&quot; slides, quizzes, worksheets, or whiteboard without navigating
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-emerald-800 hidden md:inline">Quick Jump</span>
          <kbd className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Got a Doubt Banner - Standardized Saathi Assistant Callout */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
            Got a Lesson Question or Need an Activity Idea?
          </h2>
          <p className="text-gray-500 text-xs font-medium">
            Saathi Genie is ready to help you construct immediate 5-minute activities, recap questions, or classroom discussion sparks.
          </p>
        </div>
        <button 
          onClick={() => setIsGenieChatOpen(true)}
          className="bg-[#0F5B38] hover:bg-[#0C4B2E] text-white font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 text-xs shadow-sm cursor-pointer flex items-center gap-2 shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          Ask Saathi Genie
        </button>
      </div>

      {/* Quick Actions Toolbar */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Creation Shortcuts</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Create Assessment", href: "/dashboard/assessments/create", bg: "from-[#14532D] to-emerald-800", shadow: "shadow-emerald-900/10" },
            { label: "Create Quiz", href: "/dashboard/create?type=quiz", bg: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/10" },
            { label: "Create PPT", href: "/dashboard/create?type=smart-classroom", bg: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/10" },
            { label: "Create Test", href: "/dashboard/create?type=test-paper", bg: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/10" },
            { label: "Create Lesson Plan", href: "/dashboard/create?type=lesson-plan", bg: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/10" },
          ].map((action, idx) => (
            <Link 
              key={idx}
              href={action.href} 
              className={`bg-gradient-to-br ${action.bg} p-4 rounded-xl text-white shadow-lg ${action.shadow} hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[100px] cursor-pointer`}
            >
              <span className="font-extrabold text-sm leading-snug">{action.label}</span>
              <div className="self-end bg-white/20 p-1.5 rounded-lg">
                <PlusCircle className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid: Left (Continue, Classes, Work), Right (Performance, Resources) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Teaching Cockpit (UX-002, UX-018 - Project Sahaj) */}
          {(() => {
            const activeClass = classesList.find((c) => c.id === selectedClassId) || classesList[0];
            const activeMeta = classChapterMeta[selectedClassId] || {
              gradeSlug: teachingCtx.grade || "class-8",
              gradeName: teachingCtx.gradeName || "Class 8",
              subjectSlug: teachingCtx.subject || "science",
              subjectName: teachingCtx.subjectName || "Science",
              chapterSlug: teachingCtx.chapter || "chapter-1",
              chapterNum: teachingCtx.chapterNumber || 1,
              title: teachingCtx.chapterTitle || "Crop Production and Management",
              titleHi: teachingCtx.chapterTitleHi || "फसल उत्पादन एवं प्रबंध",
              totalTopics: teachingCtx.totalTopics || 7,
              completedTopics: teachingCtx.completedTopics || 4,
            };

            const classroomUrl = `/classroom?grade=${activeMeta.gradeSlug}&subject=${activeMeta.subjectSlug}&chapter=${activeMeta.chapterSlug}&title=${encodeURIComponent(
              activeMeta.title
            )}&returnUrl=${encodeURIComponent(`/content/${activeMeta.gradeSlug}/${activeMeta.subjectSlug}/${activeMeta.chapterSlug}`)}`;

            const workspaceUrl = `/content/${activeMeta.gradeSlug}/${activeMeta.subjectSlug}/${activeMeta.chapterSlug}`;
            const quizUrl = `${workspaceUrl}/quiz`;
            const whiteboardUrl = `/dashboard/whiteboard`;
            const worksheetUrl = `/dashboard/create?type=test-paper&grade=${activeMeta.gradeSlug}&subject=${activeMeta.subjectSlug}&chapter=${activeMeta.chapterSlug}`;

            return (
              <section className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Today&apos;s Teaching Cockpit
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">Select your current period to launch class materials in 1 tap</p>
                  </div>

                  {/* Class Switcher Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {classesList.map((cls) => {
                      const isSelected = cls.id === selectedClassId;
                      return (
                        <button
                          key={cls.id}
                          onClick={() => setSelectedClassId(cls.id)}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer ${
                            isSelected 
                              ? "bg-emerald-800 text-white shadow-xs" 
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          {cls.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border-2 border-emerald-100 hover:border-emerald-200 p-6 rounded-2xl shadow-xs transition-all space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-emerald-50 text-[#14532D] rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border border-emerald-200 shadow-2xs">
                        <span className="text-[10px] uppercase font-bold text-emerald-600">Ch</span>
                        <span className="text-xl leading-none">{activeMeta.chapterNum}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {activeClass.name} &bull; {activeMeta.subjectName}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {activeMeta.completedTopics}/{activeMeta.totalTopics} topics &bull; {activeClass.count} students
                          </span>
                        </div>
                        <h4 className="font-black text-gray-900 text-lg sm:text-xl mt-1 leading-snug">
                          {activeMeta.title}
                        </h4>
                        {activeMeta.titleHi && (
                          <p className="text-sm font-serif text-amber-800 font-medium mt-0.5">
                            {activeMeta.titleHi}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      <Link 
                        href={classroomUrl}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#14532D] hover:bg-emerald-900 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        <Tv className="w-5 h-5 text-amber-300" />
                        Launch 75&quot; Smartboard Class
                      </Link>
                    </div>
                  </div>

                  {/* Fast Action Row */}
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <Link
                      href={workspaceUrl}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 font-bold transition-colors border border-gray-200"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Workspace
                    </Link>
                    <Link
                      href={quizUrl}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-800 font-bold transition-colors border border-blue-200"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Quick Quiz
                    </Link>
                    <Link
                      href={whiteboardUrl}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-purple-50/70 hover:bg-purple-100 text-purple-800 font-bold transition-colors border border-purple-200"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Whiteboard
                    </Link>
                    <Link
                      href={worksheetUrl}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100 text-amber-800 font-bold transition-colors border border-amber-200"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Worksheet
                    </Link>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* NCERT Curriculum Quick Explorer (UX-002) */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#14532D]" />
                Browse Curriculum
              </h3>
              <Link href="/content" className="text-xs font-bold text-[#14532D] hover:underline">
                View All NCERT Syllabi &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { grade: "Class 6", id: "class-6" },
                { grade: "Class 7", id: "class-7" },
                { grade: "Class 8", id: "class-8" },
                { grade: "Class 9", id: "class-9" },
                { grade: "Class 10", id: "class-10" },
              ].map((c) => (
                <Link
                  key={c.id}
                  href={`/content/${c.id}`}
                  className="p-3 bg-white border border-gray-150 hover:border-emerald-300 hover:shadow-xs rounded-xl transition-all group block text-center"
                >
                  <div className="text-xs font-black text-gray-800 group-hover:text-[#14532D] transition-colors">{c.grade}</div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Syllabus &rarr;</div>
                </Link>
              ))}
            </div>
          </section>

          {/* My Classes (UX-018) */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">My Classes</h3>
              <Link href="/dashboard/classes" className="text-xs font-bold text-[#14532D] hover:underline">
                Manage All Classes
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classesList.map((c) => (
                <div key={c.id} className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-gray-800 text-sm">{c.name}</h4>
                      <p className="text-gray-400 text-xs font-semibold">{c.subject} &bull; Section {c.section}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {c.count}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                    <Link 
                      href={`/content/${c.grade_id}`} 
                      className="text-[#14532D] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      Teach / Curriculum &rarr;
                    </Link>
                    <Link 
                      href={`/dashboard/classes?classId=${c.id}`} 
                      className="text-gray-500 hover:text-gray-800 font-semibold"
                    >
                      Roster &bull; Code
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Work */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Upcoming Work & Schedules</h3>
            <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
              {[
                { title: "Weekly Homework: Ray Diagrams", date: "Due Tomorrow, 4 PM", type: "Homework", tagColor: "bg-amber-50 text-amber-700 border-amber-100" },
                { title: "Chapter Test: Light Concept Check", date: "Monday, 10 AM", type: "Quiz", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
              ].map((w, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs leading-snug">{w.title}</h4>
                      <p className="text-gray-400 text-[10px] font-semibold mt-0.5">{w.date}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${w.tagColor} shrink-0`}>
                    {w.type}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-8">
          
          {/* Class Performance (Analytics) */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Class Performance</h3>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4">
              {classAnalytics ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Class Mastery ({classAnalytics.className})</span>
                    <span className="text-lg font-black text-emerald-700">{classAnalytics.overallClassMastery}%</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">On Track / Strong</span>
                      <span className="text-gray-800">{classAnalytics.onTrackCount} Students</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (classAnalytics.onTrackCount / Math.max(1, classAnalytics.onTrackCount + classAnalytics.needsSupportCount)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">Needs Support</span>
                      <span className="text-amber-700">{classAnalytics.needsSupportCount} Students</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (classAnalytics.needsSupportCount / Math.max(1, classAnalytics.onTrackCount + classAnalytics.needsSupportCount)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500 font-medium">No assessment evidence recorded yet.</p>
                  <p className="text-[11px] text-gray-400 mt-1">Assign assessments to view diagnostics.</p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-50 text-center">
                <Link href="/dashboard/analytics" className="inline-flex items-center gap-1 text-xs font-bold text-[#14532D] hover:underline">
                  Open Diagnostic Analytics Hub
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Resources */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recently Created Resources</h3>
            <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
              {[
                { name: "Reflection_Quiz_v2.json", type: "Quiz", size: "12 KB" },
                { name: "Ch10_Refraction_LessonPlan.pdf", type: "Lesson Plan", size: "142 KB" },
                { name: "Light_Summary_MindMap.jpg", type: "Mind Map", size: "2.1 MB" },
              ].map((res, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#14532D] shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-gray-800 text-xs truncate">{res.name}</h4>
                      <p className="text-gray-400 text-[10px] font-semibold mt-0.5">{res.type} • {res.size}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/resources" className="text-[10px] font-bold text-[#0F5B38] hover:underline shrink-0">
                    Open
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Saved Custom Kits Empty State */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">My Custom Kits &amp; Drafts</h3>
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">No Saved Drafts Yet</h4>
                <p className="text-slate-500 text-xs font-semibold mt-1">Generate your first NCERT Class 6–10 teaching pack to see saved kits here.</p>
              </div>
              <Link 
                href="/content/class-8" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#14532D] text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-emerald-900 transition-colors"
              >
                <span>Browse NCERT Syllabus Library 📚</span>
              </Link>
            </div>
          </section>
        </div>

      </div>

      {/* Flashing overlay for Attention Bell */}
      {isAttentionBellActive && (
        <div className="fixed inset-0 z-[100] bg-red-600/95 flex flex-col items-center justify-center text-white p-6 animate-pulse select-none">
          <div className="text-8xl animate-bounce mb-6">🔔</div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-wider text-center leading-tight drop-shadow-md">
            SILENCE, PLEASE!<br />
          </h2>
          <p className="text-white/80 mt-8 text-sm font-semibold tracking-wider uppercase">Attention Alarm Active • Closing in 2s</p>
        </div>
      )}

      {/* Ask Saathi Genie Slide-in Drawer */}
      {isGenieChatOpen && (
        <>
          <div 
            onClick={() => setIsGenieChatOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          />
          <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 border-l border-gray-150 p-6 flex flex-col justify-between animate-slideLeft text-sm text-gray-700">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center text-xl">🧞‍♂️</div>
                  <div>
                    <h3 className="font-extrabold text-gray-800 leading-tight">Saathi Genie</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Aapka Teaching AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGenieChatOpen(false)}
                  className="p-1 text-gray-450 hover:text-gray-650 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 mb-4 flex flex-col">
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "genie"
                        ? "bg-green-50/50 text-gray-850 border border-green-100 self-start"
                        : "bg-[#14532D] text-white self-end font-semibold shadow-xs"
                    }`}
                  >
                    {msg.text.split("\n").map((line, k) => (
                      <p key={k} className={k > 0 ? "mt-1.5" : ""}>{line}</p>
                    ))}
                  </div>
                ))}

                {isGenieThinking && (
                  <div className="bg-green-50/50 text-gray-600 border border-green-100 max-w-[80%] p-3 rounded-2xl text-xs self-start flex items-center gap-1.5 font-bold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-green-700" />
                    Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Recap activity Ch 10", q: "Give me a 5-min recap activity for Ch 10" },
                  { label: "Easy Physics MCQ", q: "Create an easy physics question for Class 10" },
                  { label: "How to pair clickers?", q: "How do I use student clickers?" },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGenieSubmit(undefined, chip.q)}
                    className="text-[10px] font-bold bg-gray-50 border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-800 hover:border-green-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => handleGenieSubmit(e)} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask Genie a question..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                />
                <button 
                  type="submit"
                  className="bg-[#14532D] hover:bg-green-800 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition-colors active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* User Guide Modal Dialog */}
      {isUserGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-gray-150 rounded-2xl shadow-xl p-8 relative text-gray-700 animate-fadeIn">
            <button 
              onClick={() => setIsUserGuideOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 leading-tight">TeacherSathi User Manual</h3>
            </div>

            <div className="space-y-4 py-2 text-xs leading-relaxed overflow-y-auto max-h-96 pr-2">
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800 text-sm">Step 1: Select Classroom Subject</h4>
                <p className="text-gray-500">Pick standard NCERT chapters (e.g. Science, Class 10) from the main Content Hub categories inside the Nav bar.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800 text-sm">Step 2: Generate AI Worksheets & Lesson Plans</h4>
                <p className="text-gray-500">Click the **Create** action to generate comprehensive bilingual worksheets and lesson planning blocks instantly using early teacher frameworks.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800 text-sm">Step 3: Present in Smart Screen Mode</h4>
                <p className="text-gray-500">Load high-quality AI instructional videos or live MCQ quizzes on your 75-inch smart display screen by choosing the **Play** shortcuts.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800 text-sm">Step 4: Register & Assess Clickers</h4>
                <p className="text-gray-500">Go to **Roll Call**, click **Register Clickers**, and pair your student clicker hardware devices in seconds. Run tests to receive immediate, automatic diagnostic results.</p>
              </div>
            </div>

            <button 
              onClick={() => setIsUserGuideOpen(false)}
              className="w-full bg-[#14532D] hover:bg-green-800 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-6"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Smartboard 75" QR Auth Modal */}
      <SmartboardQRAuthModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onSuccess={(sessionData) => {
          setActiveSession(sessionData);
        }}
      />

    </div>
  );
}
