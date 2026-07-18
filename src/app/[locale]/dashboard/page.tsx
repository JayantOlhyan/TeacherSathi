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
  Lightbulb
} from "lucide-react";

export default function DashboardPage() {
  // Overlays & Stateful Dialogs
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  const [isAttentionBellActive, setIsAttentionBellActive] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("Teacher");
  
  // Genie Chat Logic State
  const [chatMessage, setChatMessage] = useState("");
  const [isGenieThinking, setIsGenieThinking] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "नमस्ते! I am Saathi Genie 🧞‍♂️. Ask me anything about NCERT chapters, early literacy, lesson planning, or live student clickers!", sender: "genie" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      
      const playChime = (delay: number, pitch: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, audioCtx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 1.5);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + 1.5);
      };
      
      playChime(0, 523.25);
      playChime(0.22, 659.25);
      
      setIsAttentionBellActive(true);
    } catch {
      setIsAttentionBellActive(true);
    }
  };

  const handleGenieSubmit = (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const query = textOverride || chatMessage;
    if (!query.trim()) return;

    const userMsg = { id: messages.length + 1, text: query, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setChatMessage("");
    setIsGenieThinking(true);

    setTimeout(() => {
      setIsGenieThinking(false);
      let responseText = "Here is a quick activity recap idea: Ask students to form pairs and sketch a real-world reflection path on their notebooks!";
      
      if (query.includes("recap") || query.includes("Ch 10")) {
        responseText = "Here is a 5-minute recap activity for Ch. 10 Light:\n\n1. **Refraction Ray (2 min)**: Ask a student to draw a light ray crossing from air to glass on the whiteboard.\n2. **Quick MCQ (3 min)**: Fire up our live MCQ Quiz and run Question 1 to instantly grade conceptual clarity!";
      } else if (query.includes("physics") || query.includes("easy")) {
        responseText = "Here is an easy Physics MCQ question:\n\n*Question*: The focal length of a flat mirror is:\n*A)* Zero\n*B)* Infinity (Correct)\n*C)* 10 cm\n*D)* -10 cm";
      } else if (query.includes("clicker")) {
        responseText = "To pair clickers, click **Register Clickers** in the Action Bar on your Class page. Once the modal opens, ask your students to press any button on their clicker device. They will pair instantly!";
      }

      const genieMsg = { id: messages.length + 2, text: responseText, sender: "genie" };
      setMessages(prev => [...prev, genieMsg]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 relative">
      
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
          <Link 
            href="/dashboard/create" 
            className="inline-flex items-center gap-2 bg-white text-[#14532D] hover:bg-green-50 font-bold px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Create with AI
          </Link>
          <button 
            onClick={playAttentionBellSound}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            Silence Bell
          </button>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
      </div>

      {/* Got a Doubt Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Got a Quick Doubt or Need a Lesson Spark?
          </h2>
          <p className="text-gray-500 text-xs font-medium">
            Saathi Genie is ready to help you construct immediate 5-minute activities, recap questions, or explain clicker operations.
          </p>
        </div>
        <button 
          onClick={() => setIsGenieChatOpen(true)}
          className="bg-[#14532D] hover:bg-green-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 text-xs shadow-sm cursor-pointer flex items-center gap-2"
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
            { label: "Create Quiz", type: "quiz", bg: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/10" },
            { label: "Create PPT", type: "smart-classroom", bg: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/10" },
            { label: "Create Test", type: "test-paper", bg: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/10" },
            { label: "Create Lesson Plan", type: "lesson-plan", bg: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/10" },
            { label: "Create Mind Map", type: "mind-map", bg: "from-rose-500 to-pink-500", shadow: "shadow-rose-500/10" },
          ].map((action, idx) => (
            <Link 
              key={idx}
              href={`/dashboard/create?type=${action.type}`} 
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
          
          {/* Continue Teaching */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Continue Teaching</h3>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-all">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  Ch 10
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-sm">Light - Reflection & Refraction</h4>
                  <p className="text-gray-400 text-xs font-semibold mt-0.5">Class 10-A • Science • 3/5 slides completed</p>
                </div>
              </div>
              <Link 
                href="/content/class-10/science/chapter-10" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D] hover:underline whitespace-nowrap"
              >
                Resume Presentation
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* My Classes */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">My Classes</h3>
              <Link href="/dashboard/classes" className="text-xs font-bold text-[#14532D] hover:underline">
                Manage Classes
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { grade: "Class 10-A", subject: "Science", count: 42, active: "Reflection Quiz active", bg: "bg-blue-50/50 text-blue-700 border-blue-100" },
                { grade: "Class 9-B", subject: "Science", count: 38, active: "No active assessment", bg: "bg-purple-50/50 text-purple-700 border-purple-100" },
              ].map((c, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-gray-800 text-sm">{c.grade}</h4>
                      <p className="text-gray-400 text-xs font-semibold">{c.subject}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {c.count}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium truncate">{c.active}</span>
                    <Link href={`/dashboard/classes?class=${idx === 0 ? "10A" : "9B"}`} className="text-[#14532D] font-bold hover:underline shrink-0">
                      Open Workspace
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
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Average accuracy</span>
                <span className="text-lg font-black text-emerald-700">76%</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Mastery (Strong)</span>
                  <span className="text-gray-800">18 Students</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "60%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Needs Attention</span>
                  <span className="text-amber-700">6 Students</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "25%" }} />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50 text-center">
                <Link href="/dashboard/reports" className="inline-flex items-center gap-1 text-xs font-bold text-[#14532D] hover:underline">
                  View Analytics Report
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
                  <Link href="/resources" className="text-[10px] font-bold text-[#14532D] hover:underline shrink-0">
                    Open
                  </Link>
                </div>
              ))}
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

    </div>
  );
}
