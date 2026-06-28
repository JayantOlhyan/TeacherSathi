"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { Bell, UserCheck, BookOpen, Presentation, Play, PlusCircle, Search, MessageSquare, Users, X, Send, Loader2 } from "lucide-react";

export default function DashboardPage() {
  // Overlays & Stateful Dialogs
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  const [isAttentionBellActive, setIsAttentionBellActive] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  
  // Genie Chat Logic State
  const [chatMessage, setChatMessage] = useState("");
  const [isGenieThinking, setIsGenieThinking] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "नमस्ते! I am Saathi Genie 🧞‍♂️. Ask me anything about NCERT chapters, early literacy, lesson planning, or live student clickers!", sender: "genie" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Audio synthesis: Chime bell sound (Web Audio API)
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
      
      // Standard dual bell sequence (C5 -> E5)
      playChime(0, 523.25);
      playChime(0.22, 659.25);
      
      setIsAttentionBellActive(true);
    } catch {
      // Fallback
      setIsAttentionBellActive(true);
    }
  };

  const handleGenieSubmit = (_e?: React.FormEvent, textOverride?: string) => {
    _e?.preventDefault();
    const query = textOverride || chatMessage;
    if (!query.trim()) return;

    // Add user query
    const userMsg = { id: messages.length + 1, text: query, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setChatMessage("");
    setIsGenieThinking(true);

    // Mock AI Bilingual Teacher Assist Response
    setTimeout(() => {
      setIsGenieThinking(false);
      let responseText = "Here is a quick activity recap idea: Ask students to form pairs and sketch a real-world reflection path on their notebooks!";
      
      if (query.includes("recap") || query.includes("Ch 10")) {
        responseText = "Here is a 5-minute recap activity for Ch. 10 Light:\n\n1. **Refraction Ray (2 min)**: Ask a student to draw a light ray crossing from air to glass on the whiteboard.\n2. **Quick MCQ (3 min)**: Fire up our live MCQ Quiz and run Question 1 to instantly grade conceptual clarity!";
      } else if (query.includes("physics") || query.includes("easy")) {
        responseText = "Here is an easy Physics MCQ question:\n\n*Question*: The focal length of a flat mirror is:\n*A)* Zero\n*B)* Infinity (Correct)\n*C)* 10 cm\n*D)* -10 cm";
      } else if (query.includes("clicker")) {
        responseText = "To pair clickers, click **Register Clickers** in the Action Bar on your Class page. Once the modal opens, ask your students to press any button on their clicker device. They will pair instantly!";
      } else {
        responseText = `नमस्ते! That is a great question. You can use our Smart Screen Video to introduce that topic, then assign the medium chapter test under the classroom tab to track results.`;
      }

      const genieMsg = { id: messages.length + 2, text: responseText, sender: "genie" };
      setMessages(prev => [...prev, genieMsg]);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      
      {/* Page Title & SEO Introductory Paragraph */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Educator Dashboard & Classroom Management</h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Welcome to your central TeacherSathi dashboard. Easily manage Indian government school classrooms, generate NCERT aligned AI lesson plans, launch interactive classroom clickers, and track daily student progress in real-time.
        </p>
      </div>

      {/* Attention Bell Flashing Overlay */}
      {isAttentionBellActive && (
        <div className="fixed inset-0 z-[100] bg-red-600/95 flex flex-col items-center justify-center text-white p-6 animate-pulse select-none">
          <div className="text-8xl animate-bounce mb-6">🔔</div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-wider text-center leading-tight drop-shadow-md">
            SILENCE, PLEASE!<br />
            
          </h2>
          <p className="text-white/80 mt-8 text-sm font-semibold tracking-wider uppercase">Attention Alarm Active • Closing in 2s</p>
        </div>
      )}

      {/* "Got a Doubt?" Section */}
      <section className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Got a Doubt? 🤔</h2>
          <p className="text-gray-600 text-sm">Ask Saathi Genie anything about your lessons or syllabus.</p>
        </div>
        <button 
          onClick={() => setIsGenieChatOpen(true)}
          className="bg-[#16A34A] hover:bg-cta-hover text-white font-semibold py-3 px-6 rounded-xl shadow-brand flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer text-sm"
        >
          <MessageSquare className="w-5 h-5" />
          Ask Saathi Genie
        </button>
      </section>

      {/* Quick-Access Toolbar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Attention Bell Card */}
        <button 
          onClick={playAttentionBellSound}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-98 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 transition-transform group-hover:scale-110">
            <Bell className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-700 text-sm">Attention Bell</span>
        </button>

        {/* Roll Call Card */}
        <Link 
          href="/dashboard/classes"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-98 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 transition-transform group-hover:scale-110">
            <UserCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-700 text-sm">Roll Call</span>
        </Link>

        {/* User Guide Card */}
        <button 
          onClick={() => setIsUserGuideOpen(true)}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-98 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 transition-transform group-hover:scale-110">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-700 text-sm">User Guide</span>
        </button>

        {/* White Board Card */}
        <Link 
          href="/dashboard/whiteboard"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-98 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 transition-transform group-hover:scale-110">
            <Presentation className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-700 text-sm">White Board</span>
        </Link>

      </section>

      {/* Action Cards */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link href="/content/class-10/science/chapter-10" className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]">
            <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-xs">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold mb-1">Play</h3>
              <p className="text-blue-100 text-xs leading-relaxed">Start an interactive session or quiz.</p>
            </div>
          </Link>

          <Link href="/dashboard/create" className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg shadow-purple-500/20 hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]">
            <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold mb-1">Create</h3>
              <p className="text-purple-100 text-xs leading-relaxed">Build new assessments and content.</p>
            </div>
          </Link>

          <Link href="/content/class-10" className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-amber-500/20 hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]">
            <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold mb-1">Discover</h3>
              <p className="text-amber-100 text-xs leading-relaxed">Explore NCERT-aligned resources.</p>
            </div>
          </Link>

          <Link href="/dashboard/classes" className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-2xl text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]">
            <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold mb-1">Engage</h3>
              <p className="text-emerald-100 text-xs leading-relaxed">Monitor student participation.</p>
            </div>
          </Link>

        </div>
      </section>

      {/* Ask Saathi Genie Slide-in Drawer */}
      {isGenieChatOpen && (
        <>
          {/* Overlay mask */}
          <div 
            onClick={() => setIsGenieChatOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          />
          
          {/* Drawer container */}
          <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 border-l border-gray-150 p-6 flex flex-col justify-between animate-slideLeft text-sm text-gray-700">
            <div>
              {/* Header */}
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

              {/* Scrollable messages log */}
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

            {/* Bottom Suggestions & Input */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              
              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Recap activity Ch 10", q: "Give me a 5-min recap activity for Ch 10" },
                  { label: "Easy Physics MCQ", q: "Create an easy physics question for Class 10" },
                  { label: "How to pair clickers?", q: "How do I use student clickers?" },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGenieSubmit(undefined, chip.q)}
                    className="text-[10px] font-bold bg-gray-50 border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-800 hover:border-green-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleGenieSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask Genie a question..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                />
                <button 
                  type="submit"
                  className="bg-[#14532D] hover:bg-green-850 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition-colors active:scale-95"
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
              className="w-full bg-[#14532D] hover:bg-green-850 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-6"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
