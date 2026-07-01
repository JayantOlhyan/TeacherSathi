"use client";

import { useState, useMemo } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Lock, BookOpen, Search, LayoutGrid, CheckCircle2, ChevronRight, Info, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
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

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SUBJECTS_CONFIG = [
  { name: "Science", hiName: "विज्ञान", color: "from-teal-600 to-emerald-700", textColor: "text-teal-600", borderColor: "border-teal-700/30", shadowColor: "shadow-teal-900/30" },
  { name: "Mathematics", hiName: "गणित", color: "from-rose-600 to-amber-700", textColor: "text-rose-600", borderColor: "border-rose-700/30", shadowColor: "shadow-rose-900/30" },
  { name: "Social Science", hiName: "सामाजिक विज्ञान", color: "from-amber-600 to-yellow-800", textColor: "text-amber-600", borderColor: "border-amber-700/30", shadowColor: "shadow-amber-900/30" },
  { name: "English", hiName: "अंग्रेज़ी", color: "from-blue-600 to-indigo-800", textColor: "text-blue-600", borderColor: "border-blue-700/30", shadowColor: "shadow-blue-900/30" },
  { name: "Hindi", hiName: "हिंदी", color: "from-orange-600 to-amber-700", textColor: "text-orange-600", borderColor: "border-orange-700/30", shadowColor: "shadow-orange-900/30" }
];

const MOCK_CHAPTERS_INFO: Record<string, Array<{ en: string; hi: string; descEn: string; descHi: string }>> = {
  "Science": [
    { en: "Food: Where does it come from?", hi: "भोजन: यह कहाँ से आता है?", descEn: "Understand sources of food, plant parts, and animal products.", descHi: "भोजन के स्रोतों, पौधों के भागों और पशु उत्पादों को समझें।" },
    { en: "Components of Food", hi: "भोजन के घटक", descEn: "Learn about nutrients, balanced diet, and deficiency diseases.", descHi: "पोषक तत्वों, संतुलित आहार और कमी से होने वाले रोगों के बारे में जानें।" },
    { en: "Fibre to Fabric", hi: "तंतु से वस्त्र तक", descEn: "Understand natural and synthetic fibres, spinning, and weaving.", descHi: "प्राकृतिक और सिंथेटिक फाइबर, कताई और बुनाई को समझें।" },
    { en: "Sorting Materials into Groups", hi: "वस्तुओं के समूह बनाना", descEn: "Classify materials based on properties like appearance, hardness.", descHi: "दिखावट, कठोरता जैसी विशेषताओं के आधार पर सामग्रियों का वर्गीकरण।" },
    { en: "Separation of Substances", hi: "पदार्थों का पृथक्करण", descEn: "Study filtration, sedimentation, decantation, and evaporation.", descHi: "निस्पंदन, अवसादन, निस्तारण और वाष्पीकरण का अध्ययन करें।" },
    { en: "Changes Around Us", hi: "हमारे चारों ओर के परिवर्तन", descEn: "Understand reversible and irreversible changes in daily life.", descHi: "दैनिक जीवन में प्रतिवर्ती और अप्रतिवर्ती परिवर्तनों को समझें।" }
  ],
  "Mathematics": [
    { en: "Knowing Our Numbers", hi: "अपनी संख्याओं की जानकारी", descEn: "Learn comparing numbers, place value, and large numbers.", descHi: "संख्याओं की तुलना, स्थानीय मान और बड़ी संख्याओं को सीखें।" },
    { en: "Whole Numbers", hi: "पूर्ण संख्याएँ", descEn: "Study natural numbers, whole numbers, and number line operations.", descHi: "प्राकृतिक संख्याएं, पूर्ण संख्याएं और संख्या रेखा संक्रियाएं।" },
    { en: "Playing with Numbers", hi: "संख्याओं के साथ खेलना", descEn: "Learn factors, multiples, prime numbers, HCF, and LCM.", descHi: "गुणनखंड, गुणज, अभाज्य संख्याएँ, महत्तम समापवर्तक और लघुत्तम समापवर्त्य सीखें।" }
  ],
  "Social Science": [
    { en: "An Introduction: How, When and Where", hi: "इतिहास: कब, कहाँ और कैसे", descEn: "Study the importance of dates and historical sources.", descHi: "तिथियों और ऐतिहासिक स्रोतों के महत्व का अध्ययन करें।" },
    { en: "On the Trail of the Earliest People", hi: "आखेट-खाद्य संग्रह से भोजन उत्पादन तक", descEn: "Explore paleolithic hunters, gatherers, and early agriculture.", descHi: "पुरापाषाणकालीन शिकारियों, संग्रहकर्ताओं और प्रारंभिक कृषि का अन्वेषण।" }
  ]
};

export default function DedicatedSubjectPage({ params }: { params: { grade: string; subject: string } }) {
  const router = useRouter();

  const rawGrade = params?.grade || "class-8";
  const formattedGrade = rawGrade.replace("class-", "Class ");
  const activeClass = CLASSES.includes(formattedGrade) ? formattedGrade : "Class 8";
  const gradeSlug = activeClass.toLowerCase().replace(" ", "-");

  const rawSubject = params?.subject || "social-science";
  const cleanSubjectName = rawSubject.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const activeSubjectConfig = SUBJECTS_CONFIG.find(
    s => s.name.toLowerCase().replace(/\s+/g, "") === cleanSubjectName.toLowerCase().replace(/\s+/g, "")
  ) || SUBJECTS_CONFIG[2]; // fallback to Social Science

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"shelf" | "grid">("shelf");
  const [shakingBook, setShakingBook] = useState<string | null>(null);

  const chapters: Chapter[] = useMemo(() => {
    const ncertClass = NCERT_SYLLABUS[activeClass];
    if (ncertClass) {
      const matchedKey = Object.keys(ncertClass).find(
        k => k.toLowerCase().replace(/[-\s]/g, "") === activeSubjectConfig.name.toLowerCase().replace(/[-\s]/g, "")
      );
      if (matchedKey && ncertClass[matchedKey].length > 0) {
        return ncertClass[matchedKey].map(ch => ({
          id: ch.id,
          titleEn: ch.en,
          titleHi: ch.hi,
          isLocked: false,
          descriptionEn: ch.descEn,
          descriptionHi: ch.descHi,
          resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
        }));
      }
    }

    const defaultInfo = MOCK_CHAPTERS_INFO[activeSubjectConfig.name] || [];
    return Array.from({ length: 12 }, (_, idx) => {
      const info = defaultInfo[idx % defaultInfo.length];
      const chNum = idx + 1;
      return {
        id: chNum,
        titleEn: info ? `${info.en}` : `Chapter ${chNum}`,
        titleHi: info ? `${info.hi}` : `अध्याय ${chNum}`,
        isLocked: false,
        descriptionEn: info ? info.descEn : `NCERT standard syllabus chapter resources for class curriculum.`,
        descriptionHi: info ? info.descHi : `कक्षा पाठ्यक्रम के लिए NCERT मानक पाठ्यक्रम अध्याय संसाधन।`,
        resources: { video: true, quiz: true, mindmap: true, lessonPlan: true }
      };
    });
  }, [activeClass, activeSubjectConfig.name]);

  const filteredChapters = useMemo(() => {
    return chapters.filter(ch =>
      ch.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.titleHi.includes(searchQuery) ||
      ch.id.toString() === searchQuery
    );
  }, [chapters, searchQuery]);

  const handleLockedClick = (bookKey: string) => {
    setShakingBook(bookKey);
    setTimeout(() => setShakingBook(null), 600);
  };

  const getBookStyle = (id: number, index: number, isLocked: boolean) => {
    const heights = ["h-28", "h-[7.25rem]", "h-32", "h-[8.25rem]"];
    const leanings = ["rotate-0", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];
    const bookHeight = isLocked ? "h-[7rem]" : heights[(id + index) % heights.length];
    const leanAngle = isLocked ? "rotate-0" : leanings[(id * index) % leanings.length];
    return { bookHeight, leanAngle };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F6F3EB] font-sans pb-28 text-slate-800 relative">
      {/* Header */}
      <div className="relative overflow-hidden py-14 bg-[#14532D] text-white border-b border-emerald-800/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f3d21_1px,transparent_1px),linear-gradient(to_bottom,#0f3d21_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href={`/content/${gradeSlug}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-bold transition-all border border-emerald-700/40"
            >
              <ArrowLeft className="w-4 h-4" /> Back to {activeClass} Library
            </Link>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <span>{activeClass}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>{activeSubjectConfig.name} ({activeSubjectConfig.hiName})</span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
              <span className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${activeSubjectConfig.color}`} />
              {activeSubjectConfig.name} <span className="text-emerald-300 font-sans text-2xl sm:text-4xl">({activeSubjectConfig.hiName})</span>
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base font-medium mt-2 max-w-2xl">
              Dedicated chapter repository for {activeClass} {activeSubjectConfig.name}. Select any chapter below to access lesson plans, quizzes, AI videos, and printable notes.
            </p>
          </div>

          {/* Class Selectors */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-emerald-800/60">
            <span className="text-xs font-bold text-emerald-300 mr-2">Class:</span>
            {CLASSES.map((cls) => {
              const isSelected = activeClass === cls;
              const slug = cls.toLowerCase().replace(" ", "-");
              return (
                <button
                  key={cls}
                  onClick={() => router.push(`/content/${slug}/${rawSubject}`)}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    isSelected
                      ? "bg-emerald-400 text-emerald-950 shadow-md scale-105"
                      : "bg-emerald-900/40 text-emerald-200 border border-emerald-800/40 hover:bg-emerald-800/60 hover:text-white"
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="bg-white/90 border border-slate-200/70 rounded-2xl p-5 shadow-sm backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Subject Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 mr-1">Subject:</span>
            {SUBJECTS_CONFIG.map((subj) => {
              const isSelected = activeSubjectConfig.name === subj.name;
              const subjSlug = subj.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <button
                  key={subj.name}
                  onClick={() => router.push(`/content/${gradeSlug}/${subjSlug}`)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-300" : "bg-slate-400"}`} />
                  {subj.name}
                </button>
              );
            })}
          </div>

          {/* Search bar & View Toggle */}
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search in ${activeSubjectConfig.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/20">
              <button
                onClick={() => setViewMode("shelf")}
                className={`p-2 rounded-lg transition-all ${viewMode === "shelf" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                title="Shelf View"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty States */}
        {filteredChapters.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Info className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-700">No Chapters Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">We couldn&apos;t find any chapters matching your query.</p>
            <button onClick={() => setSearchQuery("")} className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold">Clear Search</button>
          </div>
        )}

        {/* Shelf View */}
        {viewMode === "shelf" && filteredChapters.length > 0 && (
          <div className="mt-12 space-y-8">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2">
              <h2 className="text-2xl font-bold font-serif tracking-tight text-slate-800">{activeSubjectConfig.name} Chapters ({filteredChapters.length})</h2>
            </div>

            <div className="relative pt-8 pb-3 w-full bg-slate-900/5 rounded-2xl p-6 overflow-x-auto select-none border border-slate-200/30">
              <div className="flex gap-2 items-end px-4 pb-3 min-w-max">
                {filteredChapters.map((book, bIdx) => {
                  const bookKey = `${activeSubjectConfig.name}-${book.id}`;
                  const isShaking = shakingBook === bookKey;
                  const { bookHeight, leanAngle } = getBookStyle(book.id, bIdx, book.isLocked);

                  return (
                    <div key={book.id} className="relative z-10">
                      {book.isLocked ? (
                        <div
                          onClick={() => handleLockedClick(bookKey)}
                          className={`w-[4rem] ${bookHeight} rounded-sm relative flex flex-col justify-between py-3 px-1.5 border border-black/10 shadow-sm cursor-pointer select-none origin-bottom bg-slate-300 text-slate-600 opacity-70 hover:opacity-90 transition-all`}
                          style={{ transform: isShaking ? "rotate(10deg)" : "rotate(0deg)" }}
                        >
                          <span className="text-[10px] font-bold text-center block">{book.id.toString().padStart(2, '0')}</span>
                          <div className="flex-1 flex items-center justify-center"><Lock className="w-4 h-4 opacity-60" /></div>
                        </div>
                      ) : (
                        <Link href={`/content/${gradeSlug}/${rawSubject}/chapter-${book.id}`}>
                          <motion.div
                            whileHover={{ y: -14, scale: 1.06, rotate: 0, boxShadow: "0 12px 20px -4px rgba(0,0,0,0.18)" }}
                            className={`w-[4.2rem] ${bookHeight} ${leanAngle} rounded-l-md rounded-r relative flex flex-col justify-between py-3 px-1.5 shadow-md border-y border-r border-black/15 cursor-pointer origin-bottom select-none bg-gradient-to-r ${activeSubjectConfig.color} hover:brightness-105`}
                          >
                            <div className="absolute inset-y-0 left-0 w-[5px] bg-white/20 blur-[0.5px] rounded-l-md" />
                            <div className="text-[10px] font-black text-center text-white/90 bg-black/15 py-0.5 rounded mx-1 shadow-inner uppercase">
                              {book.id.toString().padStart(2, '0')}
                            </div>
                            <div className="flex-1 flex items-center justify-center py-2 px-0.5">
                              <span className="text-[11px] font-extrabold text-white tracking-wider leading-tight text-center line-clamp-3 drop-shadow-sm">
                                {book.titleEn.split(" ")[0]}
                              </span>
                            </div>
                            <div className="text-[8px] font-bold text-center text-white/80 border-t border-white/10 pt-1 truncate px-1">
                              {activeSubjectConfig.name.split(" ")[0]}
                            </div>
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="h-4 bg-gradient-to-b from-[#8B5A2B] to-[#5C3A21] rounded-b-xl shadow-lg border-t-2 border-[#A87139] relative">
                <div className="absolute inset-0 bg-black/10 rounded-b-xl" />
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && filteredChapters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {filteredChapters.map((book) => {
              const bookKey = `${activeSubjectConfig.name}-${book.id}`;
              return (
                <motion.div
                  key={bookKey}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/content/${gradeSlug}/${rawSubject}/chapter-${book.id}`}>
                    <div className="bg-white border border-slate-200 hover:border-emerald-700/40 rounded-2xl p-5 relative overflow-hidden transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between h-full min-h-[180px]">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${activeSubjectConfig.color} text-white font-black text-sm shadow-sm`}>
                            {book.id.toString().padStart(2, '0')}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100/50">
                            <CheckCircle2 className="w-3 h-3" /> Ready to Teach
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base group-hover:text-emerald-800 transition-colors leading-snug">{book.titleEn}</h4>
                          <p className="text-xs font-medium text-slate-500 mt-1">{book.titleHi}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Chapter {book.id}</span>
                        <span className="text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Open Hub <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
