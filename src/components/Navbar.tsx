"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, User, LogOut, Settings, HelpCircle, ChevronUp, ChevronDown, Check, Mail } from "lucide-react";
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
  const hideNavbarStart = ["/admin", "/dashboard"];
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

    // Listen to custom open-auth-modal event
    const handleOpenAuth = () => {
      setIsAuthOpen(true);
    };
    window.addEventListener("open-auth-modal", handleOpenAuth);

    if (!supabase) {
      if (!isMockAuth) setIsAuthenticated(false);
      return () => {
        window.removeEventListener("open-auth-modal", handleOpenAuth);
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
      <nav className="sticky top-0 z-50 w-full bg-cream/90 text-ink border-b border-line shadow-sm backdrop-blur-md transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:scale-[1.02] transition-all duration-200">
                <Image src="/logo-horizontal.png" alt="TeacherSathi AI Official Brand Header Logo for Indian Government School Teachers" width={140} height={32} className="h-8 w-auto object-contain" priority />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 text-sm">
              {isAuthenticated ? (
                // Authenticated Links
                <>
                  <Link href="/dashboard" className={`text-ink/80 hover:text-brand transition-colors font-medium ${pathname === "/dashboard" ? "text-brand font-bold border-b-2 border-brand pb-1" : ""}`}>{t("dashboard")}</Link>
                  <Link href="/content/class-10" className={`text-ink/80 hover:text-brand transition-colors font-medium ${pathname?.includes("/content") ? "text-brand font-bold border-b-2 border-brand pb-1" : ""}`}>{t("content_library")}</Link>
                  <Link href="/dashboard/classes" className="text-ink/80 hover:text-brand transition-colors font-medium">{t("my_classes")}</Link>
                  <Link href="/dashboard/reports" className="text-ink/80 hover:text-brand transition-colors font-medium">{t("reports")}</Link>
                </>
              ) : (
                // Public Links
                <>
                  <Link href="/#features" className="text-ink/80 hover:text-brand transition-colors font-medium">{t("features")}</Link>
                  <Link href="/pricing" className={`text-ink/80 hover:text-brand transition-colors font-medium ${pathname === "/pricing" ? "text-brand font-bold border-b-2 border-brand pb-1" : ""}`}>{t("pricing")}</Link>
                  <Link href="/#mission" className="text-ink/80 hover:text-brand transition-colors font-medium">{t("mission")}</Link>
                </>
              )}
            </div>

            {/* Right Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-brand/5 hover:bg-brand/10 border border-brand/10 text-brand p-1.5 pr-3 rounded-full transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 bg-brand text-white rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{firstName}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1.5 border border-line text-ink z-50">
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsAccountOpen(true);
                        }} 
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-brand-tint text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-ink-3" /> {t("account_settings")}
                      </button>
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsHelpOpen(true);
                        }} 
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-brand-tint text-sm font-medium transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-ink-3" /> {t("help_support")}
                      </button>
                      <div className="border-t border-line my-1.5"></div>
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-danger-bg text-danger text-sm font-bold transition-colors cursor-pointer">
                        <LogOut className="w-4 h-4" /> {t("sign_out")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-[#16A34A] text-white hover:bg-[#128A3E] px-5 py-2.5 rounded-xl font-bold text-sm shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
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
                  <Link href="/content/class-10" className="block px-3 py-3 rounded-lg text-ink-2 hover:bg-brand/5 hover:text-brand font-medium transition-colors">{t("content_library")}</Link>
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
    </>
  );
}
