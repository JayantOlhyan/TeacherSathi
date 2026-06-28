"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Mail, Heart, Settings, X, Eye, Type, Volume2, Moon, Sun, Layout, Phone } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const pathname = usePathname();
  const hideFooterExactOrEnd = ["/video", "/test", "/quiz"];
  const hideFooterStart = ["/admin", "/dashboard"];
  const shouldHide = 
    hideFooterExactOrEnd.some((route) => pathname === route || pathname?.endsWith(route)) ||
    hideFooterStart.some((route) => pathname?.startsWith(route));

  // Accessibility Panel States
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [isContrast, setIsContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReadableFont, setIsReadableFont] = useState(false);
  const [isHighlightLinks, setIsHighlightLinks] = useState(false);
  const [isHoverSpeak, setIsHoverSpeak] = useState(false);

  // Sync state with DOM on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getTheme = (cls: string) => document.documentElement.classList.contains(cls);
      setIsLight(getTheme("light-theme"));
      setIsContrast(getTheme("high-contrast-theme"));
      setIsLargeText(getTheme("large-text-theme"));
      setIsReadableFont(getTheme("readable-font-theme"));
      setIsHighlightLinks(getTheme("highlight-links-theme"));
      setIsHoverSpeak(localStorage.getItem("access-hover-speak") === "true");
    }
  }, []);

  // Handle TTS / Hover Speak
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleMouseOver = (e: MouseEvent) => {
      if (!isHoverSpeak) return;
      const target = e.target as HTMLElement;
      if (["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "A", "BUTTON"].includes(target.tagName)) {
        const text = target.innerText || target.textContent;
        if (text) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = locale === "hi" ? "hi-IN" : "en-US";
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    if (isHoverSpeak) {
      document.addEventListener("mouseover", handleMouseOver);
      localStorage.setItem("access-hover-speak", "true");
    } else {
      document.removeEventListener("mouseover", handleMouseOver);
      localStorage.setItem("access-hover-speak", "false");
      window.speechSynthesis.cancel();
    }

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isHoverSpeak, locale]);

  // Generic togglers
  const toggleClass = (stateVar: boolean, setVar: React.Dispatch<React.SetStateAction<boolean>>, className: string) => {
    const newState = !stateVar;
    setVar(newState);
    if (newState) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }
  };

  if (shouldHide) return null;

  return (
    <footer className="bg-[#0A2A17] text-white border-t border-white/10 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo-horizontal-on-dark.png" alt="TeacherSathi AI Lesson Plan & Classroom Quiz Generator Logo for Indian Government Schools" width={160} height={36} className="h-9 w-auto object-contain" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("tagline")}
            </p>
            <p className="text-white/40 text-xs">
              {t("made_in")} <Heart className="w-3 h-3 inline text-red-400 fill-red-400" />
            </p>
          </div>

          {/* Products & Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-white/80">Products & Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">Interactive Dashboard</Link></li>
              <li><Link href="/dashboard/create" className="text-white/60 hover:text-white transition-colors">AI Content Generation</Link></li>
              <li><Link href="/dashboard/classes" className="text-white/60 hover:text-white transition-colors">Smart Classes</Link></li>
              <li><Link href="/dashboard/whiteboard" className="text-white/60 hover:text-white transition-colors">Real-time Whiteboard</Link></li>
              <li><Link href="/dashboard/activity" className="text-white/60 hover:text-white transition-colors">Activity Logs</Link></li>
              <li><Link href="/dashboard/reports" className="text-white/60 hover:text-white transition-colors">Reports & Analytics</Link></li>
              <li><Link href="/pricing" className="text-white/60 hover:text-white transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-white/80">Learning Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources/ncert" className="text-white/60 hover:text-white transition-colors">NCERT Class 6-10</Link></li>
              <li><Link href="/resources/lesson-plans" className="text-white/60 hover:text-white transition-colors">AI Lesson Plans</Link></li>
              <li><Link href="/resources/mind-maps" className="text-white/60 hover:text-white transition-colors">Interactive Mind Maps</Link></li>
              <li><Link href="/resources/quiz-generator" className="text-white/60 hover:text-white transition-colors">Quiz Generator</Link></li>
              <li><Link href="/content/class-10/science" className="text-white/60 hover:text-white transition-colors">Science Hub (Class 10)</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-white/80">Account & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup" className="text-white/60 hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/login" className="text-white/60 hover:text-white transition-colors">Member Login</Link></li>
              <li><Link href="/support" className="text-white/60 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/support/contact" className="text-white/60 hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/support/sitemap" className="text-white/60 hover:text-white transition-colors">Site Map</Link></li>
            </ul>
          </div>

          {/* About & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-white/80">About & Contact</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/#how-it-works" className="text-white/60 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
            <ul className="space-y-2 text-sm mt-4 pt-4 border-t border-white/10">
              <li>
                <a href="mailto:jayantolhyan@khelclan.online" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> jayantolhyan@khelclan.online
                </a>
              </li>
              <li>
                <a href="tel:+919667344125" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +91 96673 44125
                </a>
              </li>
            </ul>
            <div className="flex gap-3 pt-2">
              <a href="https://twitter.com/teachersathi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white text-sm font-bold">X</a>
              <a href="https://youtube.com/@teachersathi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white text-sm font-bold">YT</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <p>&copy; {new Date().getFullYear()} {t("copyright")}</p>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button 
              onClick={() => setIsAccessOpen(true)}
              className="text-white/70 hover:text-white font-bold tracking-widest transition-colors uppercase text-[10px] sm:text-xs flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1 rounded"
              aria-label="Open Accessibility Tools"
            >
              ACCESSIBILITY
            </button>
          </div>
          <p>{t("bottom_text")}</p>
        </div>
      </div>

      {/* Modern, Beautiful Accessibility Overlay Modal */}
      {isAccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div 
            className="w-full max-w-lg bg-[#14532D] border border-white/10 rounded-2xl shadow-2xl p-6 relative text-white"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <div>
                  <h2 className="text-lg font-bold tracking-wider uppercase">{t("access_title")}</h2>
                  <p className="text-[10px] text-white/50">{t("access_subtitle")}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAccessOpen(false)}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Toggles */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-white">
              
              {/* Theme Selector (Light/Dark) */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    {isLight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t("light_mode")}</h3>
                    <p className="text-[10px] text-white/50">{t("light_mode_desc")}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleClass(isLight, setIsLight, "light-theme")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isLight ? 'bg-emerald-600' : 'bg-emerald-900'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isLight ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>



              {/* High Contrast */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t("high_contrast")}</h3>
                    <p className="text-[10px] text-white/50">{t("high_contrast_desc")}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleClass(isContrast, setIsContrast, "high-contrast-theme")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isContrast ? 'bg-emerald-600' : 'bg-emerald-900'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isContrast ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Increase Font Size */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Type className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t("large_text")}</h3>
                    <p className="text-[10px] text-white/50">{t("large_text_desc")}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleClass(isLargeText, setIsLargeText, "large-text-theme")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isLargeText ? 'bg-emerald-600' : 'bg-emerald-900'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isLargeText ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Readable Font */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Layout className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t("readable_font")}</h3>
                    <p className="text-[10px] text-white/50">{t("readable_font_desc")}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleClass(isReadableFont, setIsReadableFont, "readable-font-theme")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isReadableFont ? 'bg-emerald-600' : 'bg-emerald-900'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isReadableFont ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Highlight Links */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t("highlight_links")}</h3>
                    <p className="text-[10px] text-white/50">{t("highlight_links_desc")}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleClass(isHighlightLinks, setIsHighlightLinks, "highlight-links-theme")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isHighlightLinks ? 'bg-emerald-600' : 'bg-emerald-900'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isHighlightLinks ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Speech Mode (Hover TTS) */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t("text_to_speech")}</h3>
                    <p className="text-[10px] text-white/50">{t("text_to_speech_desc")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHoverSpeak(!isHoverSpeak)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isHoverSpeak ? 'bg-emerald-600' : 'bg-emerald-900'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isHoverSpeak ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

            </div>

            {/* Footer / Reset */}
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
              <button 
                onClick={() => {
                  document.documentElement.classList.remove("light-theme", "high-contrast-theme", "large-text-theme", "readable-font-theme", "highlight-links-theme");
                  setIsLight(false);
                  setIsContrast(false);
                  setIsLargeText(false);
                  setIsReadableFont(false);
                  setIsHighlightLinks(false);
                  setIsHoverSpeak(false);
                }}
                className="text-red-300 hover:text-red-200 font-semibold transition-colors"
              >
                {t("reset")}
              </button>
              <button 
                onClick={() => setIsAccessOpen(false)}
                className="bg-white/10 hover:bg-white/15 px-4 py-2 border border-white/10 rounded-xl transition-all font-semibold"
              >
                {t("done")}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
