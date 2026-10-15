"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  Search, 
  X, 
  Tv, 
  BookOpen, 
  PenTool, 
  Clock, 
  ArrowRight, 
  CheckSquare, 
  FileText,
  Compass,
  CornerDownLeft,
  GraduationCap
} from "lucide-react";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";

interface SearchItem {
  id: string;
  type: "chapter" | "tool" | "class";
  title: string;
  titleHi?: string;
  subtitle: string;
  gradeSlug?: string;
  subjectSlug?: string;
  chapterSlug?: string;
  chapterNumber?: number;
  gradeName?: string;
  subjectName?: string;
  href: string;
  classroomHref?: string;
  quizHref?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const STATIC_TOOLS: SearchItem[] = [
  {
    id: "tool-whiteboard",
    type: "tool",
    title: "Classroom Whiteboard Canvas",
    titleHi: "व्हाइटबोर्ड कैनवास",
    subtitle: "High-contrast touch blackboard & drawing canvas",
    href: "/dashboard/whiteboard",
    icon: PenTool,
  },
  {
    id: "tool-create-quiz",
    type: "tool",
    title: "Create NCERT Quiz",
    titleHi: "क्विज़ बनाएं",
    subtitle: "Generate formative assessment with teacher answer key",
    href: "/dashboard/create?type=quiz",
    icon: CheckSquare,
  },
  {
    id: "tool-create-worksheet",
    type: "tool",
    title: "Create Printable Worksheet",
    titleHi: "प्रिंट वर्कशीट बनाएं",
    subtitle: "Formatted test paper ready for Xerox A4 printing",
    href: "/dashboard/create?type=test-paper",
    icon: FileText,
  },
  {
    id: "tool-create-ppt",
    type: "tool",
    title: "Create Smart Classroom Slides",
    titleHi: "स्मार्ट क्लासरूम स्लाइड्स",
    subtitle: "75-inch high-contrast slide deck with teacher notes",
    href: "/dashboard/create?type=smart-classroom",
    icon: Tv,
  },
  {
    id: "tool-curriculum",
    type: "tool",
    title: "Browse Complete NCERT Curriculum",
    titleHi: "संपूर्ण एनसीईआरटी पाठ्यक्रम",
    subtitle: "Classes 6 to 10 syllabi, textbook notes & chapter packs",
    href: "/content",
    icon: Compass,
  },
  {
    id: "tool-my-classes",
    type: "tool",
    title: "My Classes & Rosters",
    titleHi: "मेरी कक्षाएं",
    subtitle: "Student rosters, attendance & active class profiles",
    href: "/dashboard/classes",
    icon: GraduationCap,
  },
];

interface GlobalCommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalCommandSearch({ isOpen, onClose }: GlobalCommandSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "Science" | "Mathematics" | "Social Science" | "Hindi" | "English" | "Tools">("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Compile search index from NCERT_SYLLABUS
  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [...STATIC_TOOLS];

    Object.entries(NCERT_SYLLABUS).forEach(([className, subjects]) => {
      const gradeSlug = className.toLowerCase().replace(/\s+/g, "-");

      Object.entries(subjects).forEach(([subjectName, chapters]) => {
        const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, "-");

        chapters.forEach((ch) => {
          const chapterSlug = `chapter-${ch.id}`;
          const chapterUrl = `/content/${gradeSlug}/${subjectSlug}/${chapterSlug}`;
          const classroomUrl = `/classroom?grade=${gradeSlug}&subject=${subjectSlug}&chapter=${chapterSlug}&title=${encodeURIComponent(
            ch.en
          )}&returnUrl=${encodeURIComponent(chapterUrl)}`;
          const quizUrl = `${chapterUrl}/quiz`;

          items.push({
            id: `${gradeSlug}-${subjectSlug}-${chapterSlug}`,
            type: "chapter",
            title: ch.en,
            titleHi: ch.hi,
            subtitle: `${className} • ${subjectName} • Chapter ${ch.id}`,
            gradeSlug,
            subjectSlug,
            chapterSlug,
            chapterNumber: ch.id,
            gradeName: className,
            subjectName: subjectName,
            href: chapterUrl,
            classroomHref: classroomUrl,
            quizHref: quizUrl,
            icon: BookOpen,
          });
        });
      });
    });

    return items;
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("sathi_recent_searches");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setRecentSearches(parsed.slice(0, 5));
          }
        }
      } catch {
        // Ignore localStorage error
      }
    }
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Filter items based on query & filter pill
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    let baseList = searchIndex;
    if (selectedFilter === "Tools") {
      baseList = baseList.filter((item) => item.type === "tool");
    } else if (selectedFilter !== "ALL") {
      baseList = baseList.filter((item) => item.subjectName === selectedFilter);
    }

    if (!q) {
      return baseList.slice(0, 12);
    }

    return baseList
      .filter((item) => {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchHi = item.titleHi?.toLowerCase().includes(q);
        const matchSub = item.subtitle.toLowerCase().includes(q);
        const matchGrade = item.gradeName?.toLowerCase().includes(q);
        const matchSubject = item.subjectName?.toLowerCase().includes(q);
        const matchNum = item.chapterNumber ? `chapter ${item.chapterNumber}`.includes(q) || `ch ${item.chapterNumber}`.includes(q) || `${item.chapterNumber}` === q : false;

        return matchTitle || matchHi || matchSub || matchGrade || matchSubject || matchNum;
      })
      .slice(0, 20);
  }, [query, selectedFilter, searchIndex]);

  const saveRecentSearch = useCallback((item: SearchItem) => {
    try {
      const updated = [item, ...recentSearches.filter((r) => r.id !== item.id)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("sathi_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }, [recentSearches]);

  const handleSelect = useCallback((item: SearchItem, customHref?: string) => {
    saveRecentSearch(item);
    onClose();
    router.push(customHref || item.href);
  }, [saveRecentSearch, onClose, router]);

  // Keyboard navigation inside search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, handleSelect, onClose]);

  // Keep highlighted item in view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search and Quick Navigation"
    >
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-150 bg-gray-50/50">
          <Search className="w-5 h-5 text-emerald-700 shrink-0 stroke-[2.5]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search NCERT chapters, topics, quizzes, or tools... (e.g. 'Class 8 Force', 'फसल', 'Quiz')"
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base outline-none"
            aria-label="Search query"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-500 bg-gray-200/70 border border-gray-300 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-gray-100 bg-white overflow-x-auto text-xs no-scrollbar">
          {(["ALL", "Science", "Mathematics", "Social Science", "Hindi", "English", "Tools"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSelectedFilter(filter);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === filter
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {filter === "ALL" ? "All Syllabi" : filter}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 max-h-[50vh]">
          {/* Recent Searches (when query is empty) */}
          {!query && recentSearches.length > 0 && selectedFilter === "ALL" && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-emerald-600" />
                Recently Visited
              </div>
              <div className="space-y-1 mt-1">
                {recentSearches.map((item) => (
                  <div
                    key={`recent-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 text-gray-800 hover:text-emerald-950 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-emerald-800 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm flex items-center gap-2">
                          {item.title}
                          {item.titleHi && <span className="text-xs font-normal text-gray-500 font-serif">({item.titleHi})</span>}
                        </div>
                        <div className="text-[11px] text-gray-400 font-semibold">{item.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-700 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <p className="font-bold text-base">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try searching by Class number (e.g., &ldquo;Class 8&rdquo;), subject, or chapter title in English or Hindi.
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon || BookOpen;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-emerald-50 border border-emerald-200/80 shadow-xs" 
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "bg-emerald-800 text-white" : "bg-gray-100 text-gray-700 group-hover:bg-emerald-100 group-hover:text-emerald-800"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-gray-900 group-hover:text-emerald-950 truncate">
                          {item.title}
                        </span>
                        {item.titleHi && (
                          <span className="text-xs text-emerald-800/80 font-serif font-medium truncate">
                            {item.titleHi}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons for Chapters */}
                  {item.type === "chapter" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      {item.classroomHref && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(item, item.classroomHref);
                          }}
                          title="Start lesson on 75-inch smartboard display"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition-transform active:scale-95 shadow-xs cursor-pointer"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Start Class</span>
                        </button>
                      )}
                      {item.quizHref && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(item, item.quizHref);
                          }}
                          title="Open chapter quiz"
                          className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors cursor-pointer border border-blue-200"
                        >
                          <CheckSquare className="w-3 h-3" />
                          Quiz
                        </button>
                      )}
                      <div className="p-1 rounded-md text-gray-400 group-hover:text-emerald-800">
                        <CornerDownLeft className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 shrink-0">
                      <span>Open Tool</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 sm:px-6 py-2.5 bg-gray-50 border-t border-gray-150 flex items-center justify-between text-[11px] text-gray-500 font-semibold">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700 font-mono text-[10px]">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700 font-mono text-[10px]">↵</kbd>
              to select
            </span>
          </div>
          <div>
            <span className="font-extrabold text-emerald-800">345</span> NCERT Chapters Indexed
          </div>
        </div>
      </div>
    </div>
  );
}
