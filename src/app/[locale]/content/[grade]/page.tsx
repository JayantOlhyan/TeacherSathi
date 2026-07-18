"use client";

import { useState, useMemo } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { 
  Search, 
  ChevronRight, 
  ArrowLeft,
  Compass, 
  Atom,
  Binary,
  Globe,
  Languages,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";

interface Chapter {
  id: number;
  titleEn: string;
  titleHi: string;
  isLocked: boolean;
  descriptionEn?: string;
  descriptionHi?: string;
  resources: {
    video?: boolean;
    quiz?: boolean;
    mindmap?: boolean;
    lessonPlan?: boolean;
  };
}

interface SubjectData {
  name: string;
  hiName: string;
  color: string;
  textColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  chapters: Chapter[];
}

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

const SUBJECT_DETAILS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; border: string; text: string }> = {
  "Science": { icon: Atom, color: "from-emerald-500 to-teal-600", border: "border-emerald-100", text: "text-emerald-700" },
  "Mathematics": { icon: Binary, color: "from-rose-500 to-red-650", border: "border-rose-100", text: "text-rose-700" },
  "Social Science": { icon: Globe, color: "from-amber-500 to-amber-600", border: "border-amber-100", text: "text-amber-700" },
  "English": { icon: Languages, color: "from-blue-500 to-indigo-600", border: "border-blue-100", text: "text-blue-700" },
  "Hindi": { icon: BookMarked, color: "from-orange-500 to-red-500", border: "border-orange-100", text: "text-orange-700" },
};

export default function ClassContentPage({ params }: { params: { grade: string } }) {
  const router = useRouter();
  
  // Format class from URL e.g. "class-8" -> "Class 8"
  const rawGrade = params?.grade || "class-8";
  const formattedGrade = rawGrade.replace("class-", "Class ");
  const activeClass = CLASSES.includes(formattedGrade) ? formattedGrade : "Class 8";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState<string | null>(null);

  // Generate database based on syllabus config
  const contentDatabase: SubjectData[] = useMemo(() => {
    const classSyllabus = NCERT_SYLLABUS[activeClass] || {};
    
    return Object.keys(SUBJECT_DETAILS).map(subjName => {
      const details = SUBJECT_DETAILS[subjName];
      
      // Find corresponding syllabus key
      const syllabusKey = Object.keys(classSyllabus).find(
        key => key.toLowerCase().replace(/[-\s]/g, "") === subjName.toLowerCase().replace(/[-\s]/g, "")
      );
      const chaptersList = syllabusKey ? classSyllabus[syllabusKey] : [];

      const chapters: Chapter[] = chaptersList.map((ch: { id: number; en?: string; hi?: string; descEn?: string; descHi?: string }) => ({
        id: ch.id,
        titleEn: ch.en || `Chapter ${ch.id}`,
        titleHi: ch.hi || `अध्याय ${ch.id}`,
        isLocked: false,
        descriptionEn: ch.descEn || "Standard NCERT curriculum chapter mapping with AI assistant guides.",
        descriptionHi: ch.descHi || "AI सहायक गाइड के साथ मानक एनसीईआरटी पाठ्यक्रम अध्याय मानचित्रण।",
        resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
      }));

      return {
        name: subjName,
        hiName: subjName === "Science" ? "विज्ञान" : subjName === "Mathematics" ? "गणित" : subjName === "Social Science" ? "सामाजिक विज्ञान" : subjName === "English" ? "अंग्रेज़ी" : "हिंदी",
        color: details.color,
        textColor: details.text,
        borderColor: details.border,
        icon: details.icon,
        chapters
      };
    });
  }, [activeClass]);

  const handleClassChange = (cls: string) => {
    setSelectedSubjectName(null);
    setSearchQuery("");
    const gradeSlug = cls.toLowerCase().replace(" ", "-");
    router.push(`/content/${gradeSlug}`);
  };

  const activeSubject = useMemo(() => {
    return contentDatabase.find(s => s.name === selectedSubjectName) || null;
  }, [selectedSubjectName, contentDatabase]);

  const filteredChapters = useMemo(() => {
    if (!activeSubject) return [];
    return activeSubject.chapters.filter(ch => 
      ch.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.titleHi.includes(searchQuery) ||
      ch.id.toString() === searchQuery
    );
  }, [activeSubject, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 relative">
      
      {/* NCERT Header banner */}
      <div className="bg-gradient-to-br from-[#1E291E] to-[#14532D] text-white p-8 rounded-2xl shadow-lg space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
          <Compass className="w-3.5 h-3.5" />
          NCERT Curriculum Directory
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">NCERT Library</h1>
        <p className="text-white/80 max-w-xl text-xs font-medium">
          Select class, choose standard subject books, and explore chapters to prepare interactive lessons, assign smart clicker tests, or download worksheets.
        </p>

        {/* Class Selection Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 z-10 relative">
          {CLASSES.map((cls) => {
            const isSelected = activeClass === cls;
            return (
              <button
                key={cls}
                onClick={() => handleClassChange(cls)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                  isSelected 
                    ? "bg-white text-[#14532D] shadow-sm scale-105" 
                    : "bg-white/10 text-white/90 hover:bg-white/20"
                }`}
              >
                {cls}
              </button>
            );
          })}
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.06),transparent_80%)] pointer-events-none" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 2: Subject Cards Grid */}
        {!selectedSubjectName ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Select a Subject</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentDatabase.map((subject) => {
                const IconComponent = subject.icon;
                return (
                  <button
                    key={subject.name}
                    onClick={() => setSelectedSubjectName(subject.name)}
                    className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-start gap-4 text-left cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} text-white flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <h4 className="font-extrabold text-gray-800 text-sm leading-snug flex items-center gap-1.5">
                        {subject.name}
                        <span className="text-xs text-gray-400 font-normal">({subject.hiName})</span>
                      </h4>
                      <p className="text-gray-400 text-xs font-semibold">{subject.chapters.length} Chapters mapped</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 mt-2 group-hover:translate-x-1 transition-transform">
                        Explore Chapters <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          
          // Step 3: Chapter Selection
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Subject Header & Back button */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedSubjectName(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="font-extrabold text-gray-800 text-base leading-tight">
                    {activeClass} &gt; {selectedSubjectName} Chapters
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold mt-0.5">Choose a chapter to enter its workspace</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search chapters..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Chapters Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredChapters.length > 0 ? (
                filteredChapters.map((ch) => (
                  <div 
                    key={ch.id} 
                    className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400">Chapter {ch.id}</span>
                      </div>
                      <h4 className="font-extrabold text-gray-800 text-sm leading-snug">
                        {ch.titleEn}
                        <span className="block text-xs font-bold text-gray-400 mt-0.5">{ch.titleHi}</span>
                      </h4>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{ch.descriptionEn}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase">NCERT Core Syllabus</span>
                      <Link 
                        href={`/content/${rawGrade}/${selectedSubjectName?.toLowerCase().replace(/\s+/g, "-")}/chapter-${ch.id}`}
                        className="bg-[#14532D] hover:bg-green-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                      >
                        Open Chapter
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <p className="text-xl">🔍</p>
                  <h3 className="font-bold text-gray-700">No chapters matched search</h3>
                  <p className="text-xs text-gray-400">Try cleaning your query filter.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
