"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, User, LogOut, Settings, HelpCircle, ChevronUp, ChevronDown, Check, Mail, Terminal, Bell, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("Teacher");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Class 10-A Science has 24 active students logged in.", read: false },
    { id: 2, text: "MCQ Quiz 7 on Laws of Reflection completed successfully.", read: false },
    { id: 3, text: "AI Lesson Plan for Reflection and Refraction updated.", read: true },
  ]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setToastMessage("Classroom data synced successfully!");
    }, 1500);
  };

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

  // Hidden on focused routes
  const hideNavbarExactOrEnd = ["/video", "/test", "/quiz"];
  const hideNavbarStart = ["/admin", "/dashboard", "/content", "/resources"];
  const shouldHide = 
    hideNavbarExactOrEnd.some((route) => pathname === route || pathname?.endsWith(route)) ||
    hideNavbarStart.some((route) => pathname?.startsWith(route));

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
    if (storedSchool) setSchoolName(storedSchool);
    if (storedSchoolCode) setSchoolCode(storedSchoolCode);
    if (storedPost) setProfilePost(storedPost);
    if (storedSubject) setProfileSubject(storedSubject);
    if (storedLang) setProfileLang(storedLang);

    const isMockAuth = localStorage.getItem("mock_authenticated") === "true";
    if (isMockAuth) {
      setIsAuthenticated(true);
    }

    const isMockAdmin = localStorage.getItem("is_admin_user") === "true" || 
                        (storedName && (
                          storedName.toLowerCase().includes("admin") || 
                          storedName.toLowerCase().includes("founder")
                        )) ||
                        (typeof window !== "undefined" && window.location.hostname === "localhost");
    setIsAdmin(!!isMockAdmin);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);

    // Listen to custom open-auth-modal event
    const handleOpenAuth = () => {
      setIsAuthOpen(true);
    };
    window.addEventListener("open-auth-modal", handleOpenAuth);

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    if (!supabase) {
      if (!isMockAuth) setIsAuthenticated(false);
      return () => {
        window.removeEventListener("open-auth-modal", handleOpenAuth);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        const user = session.user;
        if (user?.user_metadata?.full_name && !storedName) {
          setDisplayName(user.user_metadata.full_name);
          setProfileName(user.user_metadata.full_name);
        } else if (user?.email && !storedName) {
          const fallbackName = user.email.split("@")[0];
          setDisplayName(fallbackName);
          setProfileName(fallbackName);
        }
      } else if (!isMockAuth) {
        setIsAuthenticated(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        const user = session.user;
        if (user?.user_metadata?.full_name && !storedName) {
          setDisplayName(user.user_metadata.full_name);
          setProfileName(user.user_metadata.full_name);
        }
      } else {
        const stillMock = localStorage.getItem("mock_authenticated") === "true";
        setIsAuthenticated(stillMock);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-auth-modal", handleOpenAuth);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Self-closing toast trigger
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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

  const faqs = [
    { q: "How do I pair student clickers?", a: "Go to My Class in the sidebar, click the indigo 'Register Clickers' button, and ask your students to press any button on their clicker device. They pair dynamically in seconds!" },
    { q: "How do I present quizzes on a Smart Screen?", a: "Open the chapter from the content library, select Quick MCQ Quiz, and toggle 'Smart Screen Mode'. The quiz will adjust perfectly for a 75-inch smart display screen." },
    { q: "Can I download NCERT solutions offline?", a: "Yes! Each chapter page has a green 'Download Full Pack' button which compiles the entire chapter notes, mind maps, and quiz logs into a print-ready PDF." }
  ];

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const firstName = (displayName && displayName.trim() !== "" && displayName !== "null" && displayName !== "undefined") 
    ? displayName.trim().split(" ")[0] 
    : "Teacher";

  if (shouldHide) return null;

  const handleSignOut = async () => {
    localStorage.removeItem("mock_authenticated");
    setIsAuthenticated(false);
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.reload();
  };

  const handleSuccessLogin = () => {
    localStorage.setItem("mock_authenticated", "true");
    setIsAuthenticated(true);
    window.location.reload();
  };

  return (
    <>
      <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "px-4 pt-3 pb-0" 
          : "px-0 pt-0 pb-0"
      }`}>
        <nav className={`w-full transition-all duration-300 ${
          isScrolled 
            ? "max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-900/5 px-[clamp(1rem,3vw,1.5rem)] py-1.5" 
            : "bg-[#F7F9F4]/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm px-0 py-0"
        }`}>
          <div className="max-w-7xl mx-auto px-[clamp(1rem,3vw,2rem)]">
            <div className={`w-full flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "h-14" : "h-16"
            }`}>
              
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:scale-[1.02] transition-all duration-200 shrink-0">
                  <Image src="/logo-horizontal.png" alt="TeacherSathi AI Official Brand Header Logo for Indian Government School Teachers" width={140} height={32} className="h-[clamp(1.5rem,4vw,2rem)] w-auto object-contain" priority />
                </Link>
              </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-[clamp(1rem,2vw,2rem)] text-[clamp(0.7rem,1vw,0.75rem)] font-bold uppercase tracking-wider">
              {isAuthenticated ? (
                // Authenticated Links
                <>
                  <Link href="/dashboard" className={`relative py-1.5 transition-colors ${pathname === "/dashboard" ? "text-emerald-800 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-100" : "text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"}`}>{t("dashboard")}</Link>
                  <Link href="/content/class-8" className={`relative py-1.5 transition-colors ${pathname?.includes("/content") ? "text-emerald-800 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-100" : "text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"}`}>{t("content_library")}</Link>
                  <Link href="/dashboard/classes" className={`relative py-1.5 transition-colors ${pathname === "/dashboard/classes" ? "text-emerald-800 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-100" : "text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"}`}>{t("my_classes")}</Link>
                  <Link href="/dashboard/reports" className={`relative py-1.5 transition-colors ${pathname === "/dashboard/reports" ? "text-emerald-800 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-100" : "text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"}`}>{t("reports")}</Link>
                </>
              ) : (
                // Public Links
                <>
                  <Link href="/#features" className="relative py-1.5 text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 transition-all">{t("features")}</Link>
                  <Link href="/pricing" className={`relative py-1.5 transition-colors ${pathname === "/pricing" ? "text-emerald-800 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-100" : "text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"}`}>{t("pricing")}</Link>
                  <Link href="/#mission" className="relative py-1.5 text-slate-600 hover:text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 transition-all">{t("mission")}</Link>
                </>
              )}
            </div>

            {/* Right Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-[clamp(0.5rem,1vw,1rem)] shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {/* Sync Button */}
                  <button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all border ${
                      isSyncing 
                        ? "bg-green-50 border-green-200 text-green-600" 
                        : "bg-[#EDF7EF] hover:bg-[#D8EEDD] border-green-200 text-emerald-700 shadow-sm active:scale-95"
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Synced"}</span>
                  </button>

                  {/* Notifications Bell */}
                  <div className="relative" ref={notificationsRef}>
                    <button 
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setIsProfileOpen(false);
                      }}
                      className={`relative p-2 text-gray-650 hover:text-gray-900 transition-all rounded-full hover:bg-slate-100 ${
                        showNotifications ? "bg-slate-100 text-gray-900" : ""
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                      {hasUnread && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-[clamp(280px,90vw,320px)] bg-white border border-gray-150 rounded-2xl shadow-xl p-4 z-50 animate-fadeIn text-sm text-gray-700">
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

                  {/* Profile Dropdown Container */}
                  <div className="relative" ref={profileRef}>
                    <div 
                      onClick={() => {
                        setIsProfileOpen(!isProfileOpen);
                        setShowNotifications(false);
                      }}
                      className="flex items-center gap-2 bg-white p-1 pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all select-none"
                    >
                      <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-extrabold text-gray-700">{firstName}</span>
                    </div>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-[clamp(200px,60vw,250px)] bg-white border border-gray-150 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-sm text-gray-750">
                        <div className="px-4 py-2 border-b border-gray-100 mb-1.5 bg-gray-50/50">
                          <p className="font-extrabold text-gray-800 truncate">{displayName || "Teacher"}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">Teacher Session</p>
                        </div>
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAccountOpen(true);
                          }} 
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer text-gray-650"
                        >
                          <Settings className="w-4 h-4 text-gray-400" /> Account Settings
                        </button>
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsHelpOpen(true);
                          }} 
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer text-gray-650"
                        >
                          <HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support
                        </button>
                        {isAdmin && (
                          <Link 
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
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
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/10 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  {t("login_signup")}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-brand/5 text-ink-2 hover:text-brand transition-all cursor-pointer"
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-cream border-t border-line overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("dashboard")}</Link>
                  <Link href="/content/class-8" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("content_library")}</Link>
                  <Link href="/dashboard/classes" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("my_classes")}</Link>
                  <Link href="/dashboard/reports" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("reports")}</Link>
                  <div className="border-t border-line my-2 pt-2">
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        setIsAccountOpen(true);
                      }} 
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors cursor-pointer"
                    >
                      <User className="w-5 h-5 opacity-70" /> {t("profile")}
                    </button>
                    {isAdmin && (
                      <Link 
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-emerald-700 hover:bg-emerald-50 font-bold transition-colors cursor-pointer"
                      >
                        <Terminal className="w-5 h-5 opacity-70" /> Admin Portal
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-danger hover:bg-danger-bg font-bold text-left transition-colors cursor-pointer">
                      <LogOut className="w-5 h-5 opacity-70" /> {t("sign_out")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/#features" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("features")}</Link>
                  <Link href="/pricing" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("pricing")}</Link>
                  <Link href="/#mission" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("mission")}</Link>
                  <div className="pt-4 mt-2 border-t border-line space-y-3">
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="block w-full text-center bg-[#16A34A] text-white hover:bg-[#128A3E] px-4 py-3 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      {t("login_signup")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        </nav>
      </div>

      {/* Global Auth Modal Popup */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleSuccessLogin} 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-[60] bg-[#14532D] text-white border border-[#AEDCBA]/20 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slideIn">
          <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Account Settings Modal */}
      {mounted && isAccountOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-[clamp(0.5rem,2vw,1rem)] text-ink">
          <div className="w-[min(100%-1rem,28rem)] max-w-none max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-[clamp(1rem,4vw,1.5rem)] relative animate-fadeIn text-sm text-ink-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-[clamp(0.5rem,2vw,1rem)] text-ink">
          <div className="w-[min(100%-1rem,32rem)] max-w-none max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-[clamp(1rem,4vw,1.5rem)] relative animate-fadeIn text-sm text-ink-2">
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
    </>
  );
}
