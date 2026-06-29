"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, RefreshCw, User, LogOut, Settings, HelpCircle, Check, X, ChevronDown, ChevronUp, Mail, Terminal } from "lucide-react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";

export function Header() {
  const [displayName, setDisplayName] = useState("Teacher");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Form & Modal States
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [profileName, setProfileName] = useState("Teacher");
  const [schoolName, setSchoolName] = useState("Government Senior Secondary School");
  const [schoolCode, setSchoolCode] = useState("UDISE-060201");
  const [profilePost, setProfilePost] = useState("tgt");
  const [profileSubject, setProfileSubject] = useState("science");
  const [profileLang, setProfileLang] = useState("en");

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState("");

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Class 10-A Science has 24 active students logged in.", read: false },
    { id: 2, text: "MCQ Quiz 7 on Laws of Reflection completed successfully.", read: false },
    { id: 3, text: "AI Lesson Plan for Reflection and Refraction updated.", read: true },
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Retrieve custom session entries from localStorage
    const storedName = localStorage.getItem("last_sathi_teacher_name");
    const storedSchool = localStorage.getItem("last_sathi_school_name");
    const storedSchoolCode = localStorage.getItem("last_sathi_school_code");
    const storedPost = localStorage.getItem("last_sathi_post_type");
    const storedSubject = localStorage.getItem("last_sathi_subject");
    const storedLang = localStorage.getItem("last_sathi_language");
    
    if (storedName && storedName.trim() !== "" && storedName !== "null" && storedName !== "undefined") {
      setDisplayName(storedName);
      setProfileName(storedName);
    } else {
      setDisplayName("Teacher");
      setProfileName("Teacher");
    }
    if (storedSchool && storedSchool.trim() !== "" && storedSchool !== "null" && storedSchool !== "undefined") {
      setSchoolName(storedSchool);
    }
    if (storedSchoolCode && storedSchoolCode.trim() !== "" && storedSchoolCode !== "null" && storedSchoolCode !== "undefined") {
      setSchoolCode(storedSchoolCode);
    }
    if (storedPost && storedPost.trim() !== "" && storedPost !== "null" && storedPost !== "undefined") {
      setProfilePost(storedPost);
    }
    if (storedSubject && storedSubject.trim() !== "" && storedSubject !== "null" && storedSubject !== "undefined") {
      setProfileSubject(storedSubject);
    }
    if (storedLang && storedLang.trim() !== "" && storedLang !== "null" && storedLang !== "undefined") {
      setProfileLang(storedLang);
    }

    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name && !storedName) {
        setDisplayName(user.user_metadata.full_name);
        setProfileName(user.user_metadata.full_name);
      } else if (user?.email && !storedName) {
        const fallbackName = user.email.split("@")[0];
        setDisplayName(fallbackName);
        setProfileName(fallbackName);
      }
    });
    const isMockAdmin = localStorage.getItem("is_admin_user") === "true" || 
                        (storedName && (
                          storedName.toLowerCase().includes("admin") || 
                          storedName.toLowerCase().includes("founder")
                        )) ||
                        (typeof window !== "undefined" && window.location.hostname === "localhost");
    setIsAdmin(!!isMockAdmin);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Self-closing toast trigger
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const firstName = (displayName && displayName.trim() !== "" && displayName !== "null" && displayName !== "undefined") 
    ? displayName.trim().split(" ")[0] 
    : "Teacher";

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setToastMessage("Classroom data synced successfully!");
    }, 1500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    localStorage.setItem("last_sathi_teacher_name", profileName);
    localStorage.setItem("last_sathi_school_name", schoolName);
    localStorage.setItem("last_sathi_school_code", schoolCode);
    localStorage.setItem("last_sathi_post_type", profilePost);
    localStorage.setItem("last_sathi_subject", profileSubject);
    localStorage.setItem("last_sathi_language", profileLang);
    
    setDisplayName(profileName);
    setIsAccountOpen(false);
    setToastMessage("Settings updated successfully!");
    
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setSupportMessage("");
    setIsHelpOpen(false);
    setToastMessage("Message sent! We'll reply within 24h.");
  };

  const handleSignOut = async () => {
    localStorage.removeItem("mock_authenticated");
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = "/";
  };

  const faqs = [
    { q: "How do I pair student clickers?", a: "Go to My Class in the sidebar, click the indigo 'Register Clickers' button, and ask your students to press any button on their clicker device. They pair dynamically in seconds!" },
    { q: "How do I present quizzes on a Smart Screen?", a: "Open the chapter from the content library, select Quick MCQ Quiz, and toggle 'Smart Screen Mode'. The quiz will adjust perfectly for a 75-inch smart display screen." },
    { q: "Can I download NCERT solutions offline?", a: "Yes! Each chapter page has a green 'Download Full Pack' button which compiles the entire chapter notes, mind maps, and quiz logs into a print-ready PDF." }
  ];

  return (
    <header className="flex items-center justify-between pl-16 pr-4 sm:pr-8 md:px-8 py-3.5 sm:py-5 bg-white/50 backdrop-blur-md border-b border-white/20 sticky top-0 z-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#14532D] text-white border border-[#AEDCBA]/20 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slideIn">
          <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col">
        <p className="text-lg sm:text-2xl font-bold text-gray-800">{firstName}&apos;s Classroom</p>
        <div className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">Home / Dashboard</div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer transition-all border ${
            isSyncing 
              ? "bg-green-50 border-green-200 text-green-600" 
              : "bg-green-100 hover:bg-green-200/80 border-green-200 text-green-800 shadow-sm active:scale-95"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Synced"}</span>
          <span className="sm:hidden">{isSyncing ? "..." : "✓"}</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-all rounded-full hover:bg-gray-100 ${
              showNotifications ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {hasUnread && (
              <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-150 rounded-2xl shadow-xl p-4 z-50 animate-fadeIn text-sm text-gray-700">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <h4 className="font-bold text-gray-800 text-base">Notifications</h4>
                {hasUnread && (
                  <button 
                    onClick={() => {
                      setHasUnread(false);
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setToastMessage("All notifications marked as read.");
                    }} 
                    className="text-xs text-green-700 hover:text-green-900 font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                      setTimeout(() => {
                        setHasUnread(notifications.some(item => !item.read && item.id !== n.id));
                      }, 50);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border text-xs leading-relaxed ${
                      n.read 
                        ? "bg-white border-transparent text-gray-500 hover:bg-gray-50" 
                        : "bg-green-50/40 border-green-100 text-gray-800 font-bold hover:bg-green-50/60"
                    }`}
                  >
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1 sm:gap-3 bg-white p-1 sm:pl-2 sm:pr-4 sm:py-1.5 rounded-full shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all select-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm font-extrabold text-gray-700 hidden sm:inline">{firstName}</span>
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-150 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-sm text-gray-700">
              <div className="px-4 py-2 border-b border-gray-100 mb-1.5 bg-gray-50/50">
                <p className="font-extrabold text-gray-800 truncate">{displayName || "Teacher"}</p>
                <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">Teacher Session</p>
              </div>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  setIsAccountOpen(true);
                }} 
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer text-gray-650"
              >
                <Settings className="w-4 h-4 text-gray-400" /> Account Settings
              </button>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  setIsHelpOpen(true);
                }} 
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer text-gray-650"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support
              </button>
              {isAdmin && (
                <Link 
                  href="/admin"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-emerald-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-emerald-600" /> Admin Portal
                </Link>
              )}
              <div className="border-t border-gray-100 my-1.5"></div>
              <button 
                onClick={handleSignOut} 
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Account Settings Modal */}
      {mounted && isAccountOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-ink">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6 relative animate-fadeIn text-sm text-ink-2">
            <button 
              onClick={() => setIsAccountOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 leading-tight">Account Settings</h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Display Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Teacher Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">School Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">School Code</label>
                  <input 
                    type="text" 
                    required
                    placeholder="School Code"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Subject Taught</label>
                  <select 
                    value={profileSubject}
                    onChange={(e) => setProfileSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="science">Science 🔬</option>
                    <option value="mathematics">Mathematics 📐</option>
                    <option value="english">English 📚</option>
                    <option value="social_science">Social Science 🌍</option>
                    <option value="hindi">Hindi ✍️</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Teacher Post</label>
                  <select 
                    value={profilePost}
                    onChange={(e) => setProfilePost(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="tgt">TGT (Trained Graduate) 📚</option>
                    <option value="pgt">PGT (Post Graduate) 🎓</option>
                    <option value="prt">PRT (Primary Teacher) ✏️</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Language</label>
                  <select 
                    value={profileLang}
                    onChange={(e) => setProfileLang(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-cta hover:bg-cta-hover text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Help & Support Modal */}
      {mounted && isHelpOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-ink">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-6 relative animate-fadeIn text-sm text-ink-2">
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 leading-tight">Help & Support</h3>
            </div>

            {/* Accordion FAQ */}
            <div className="space-y-3 mb-6">
              <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-100 pb-1.5">FAQ</h4>
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-3.5 bg-cream/40 hover:bg-cream/80 text-left font-bold text-ink-2 transition-colors cursor-pointer"
                    >
                      <span className="text-xs">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-brand" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 border-t border-gray-100 text-xs leading-relaxed text-ink-3 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSendSupport} className="space-y-3">
              <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-gray-400" /> Send a Message to Support
              </h4>
              <textarea 
                required
                rows={3}
                placeholder="Type your support request or question here..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-xs font-semibold"
              />
              <button 
                type="submit"
                className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

    </header>
  );
}
