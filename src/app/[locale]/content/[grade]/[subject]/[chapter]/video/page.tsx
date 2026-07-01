"use client";

import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Play, Pause, Volume2, Maximize, MonitorSmartphone, ChevronDown, Share2, Clock } from "lucide-react";
import { NCERT_SYLLABUS } from "@/lib/data/ncertSyllabus";

export default function VideoPlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const params = useParams();
  const grade = params.grade as string;
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  let videoId = "6YI7YqW8-rA"; // fallback
  try {
    const gradeData = NCERT_SYLLABUS[grade as keyof typeof NCERT_SYLLABUS];
    const cleanSub = subject.charAt(0).toUpperCase() + subject.slice(1);
    const subjectData = gradeData ? gradeData[cleanSub as keyof typeof gradeData] : null;
    const chapNum = parseInt(chapter.replace("chapter-", ""), 10);
    const chapterData = subjectData ? subjectData.find((c: { id: number }) => c.id === chapNum) : null;
    if (chapterData && chapterData.videoId) {
      videoId = chapterData.videoId;
    }
  } catch (e) {
    console.error("Could not load video ID", e);
  }

  useEffect(() => {
    if (typeof window !== "undefined" && grade && subject && chapter) {
      const cleanSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
      const cleanChapter = chapter.replace("chapter-", "");
      localStorage.setItem("last_sathi_view", window.location.pathname);
      localStorage.setItem("last_sathi_view_title", `AI Video - ${cleanSubject} (Ch. ${cleanChapter})`);
    }
  }, [grade, subject, chapter]);

  return (
    <div className="min-h-screen bg-dark-bg text-[#F4F8F1] font-sans flex flex-col h-screen overflow-hidden">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#14532D] border-b border-white/10 shrink-0">
        <div className="text-sm text-[#B9C7B6] flex gap-2 items-center">
          <Link href="/content/class-10" className="hover:text-white transition-colors">Class 10</Link>
          <span>&gt;</span>
          <Link href="/content/class-10" className="hover:text-white transition-colors">Science</Link>
          <span>&gt;</span>
          <Link href="/content/class-10/science/chapter-10" className="hover:text-white transition-colors">Chapter 10</Link>
          <span>&gt;</span>
          <span className="text-white font-medium">Video</span>
        </div>
        <div className="flex bg-white/10 rounded-full px-1 py-0.5 text-xs">
          <button className="px-3 py-1 rounded-full bg-white/20 text-white font-medium">EN</button>
          <button className="px-3 py-1 rounded-full text-gray-400 hover:text-white">हिं</button>
        </div>
      </header>

      {/* SEO Title Banner */}
      <div className="px-6 py-3 bg-[#14532D]/50 border-b border-white/5 shrink-0">
        <h1 className="text-base sm:text-lg font-bold text-white">
          TeacherSathi NCERT Smart Classroom Video Lesson
        </h1>
        <p className="text-xs text-[#B9C7B6] mt-0.5">
          High-definition CBSE curriculum video lecture tailored for Indian government school educators and interactive display screens.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
        
        {/* Left: Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex flex-col group shadow-2xl">
            {/* Top Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                   <div className="w-full h-full bg-[#E1A140] rounded-full flex items-center justify-center text-white">🎓</div>
                 </div>
                 <h2 className="text-lg font-medium text-white shadow-sm">Light Reflection | Physics Classroom</h2>
               </div>
               <div className="flex gap-4">
                 <button className="flex flex-col items-center gap-1 text-xs text-white/80 hover:text-white">
                   <Clock className="w-5 h-5" /> Watch later
                 </button>
                 <button className="flex flex-col items-center gap-1 text-xs text-white/80 hover:text-white">
                   <Share2 className="w-5 h-5" /> Share
                 </button>
               </div>
            </div>

            {/* YouTube Video Area */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
               <iframe 
                 className="w-full h-full"
                 src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&controls=0`}
                 title="YouTube video player"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 allowFullScreen
               ></iframe>
               {!isPlaying && (
                 <div 
                   className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group"
                   onClick={() => setIsPlaying(true)}
                 >
                   <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                     <Play className="w-10 h-10 text-white fill-current" />
                   </div>
                 </div>
               )}
            </div>

            {/* Custom Controls Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* Progress */}
               <div className="flex items-center gap-3">
                 <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative">
                   <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-red-500 rounded-full"></div>
                   <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow"></div>
                 </div>
               </div>
               
               {/* Controls Row */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-gray-300">
                     {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                   </button>
                   <span className="text-sm text-gray-300 font-medium tracking-wide">0:00 / 3:34</span>
                   
                   <div className="hidden md:flex gap-4 text-xs text-gray-400 font-medium ml-4">
                     <span className="hover:text-white cursor-pointer">Introduction</span> · 
                     <span className="hover:text-white cursor-pointer text-white">Concept</span> · 
                     <span className="hover:text-white cursor-pointer">Examples</span> · 
                     <span className="hover:text-white cursor-pointer">Summary</span>
                   </div>
                 </div>

                 <div className="flex items-center gap-4">
                   <div className="hidden sm:flex bg-white/10 rounded-full text-xs font-medium">
                     <button className="px-3 py-1 rounded-full hover:bg-white/20">0.75x</button>
                     <button className="px-3 py-1 rounded-full bg-white text-black">1x</button>
                     <button className="px-3 py-1 rounded-full hover:bg-white/20">1.25x</button>
                     <button className="px-3 py-1 rounded-full hover:bg-white/20">1.5x</button>
                   </div>
                   
                   <button className="hover:text-gray-300"><Volume2 className="w-5 h-5" /></button>
                   <button className="hover:text-gray-300"><Maximize className="w-5 h-5" /></button>
                   
                   <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                     <MonitorSmartphone className="w-4 h-4" /> Classroom Mode
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-6 flex justify-center">
            <div className="bg-[#14532D] border border-white/5 rounded-full px-6 py-2 flex items-center gap-4 text-xs text-[#B9C7B6] font-mono">
              <span><strong className="text-white bg-white/10 px-2 py-0.5 rounded">SPACE</strong> = Play/Pause</span>
              <span><strong className="text-white bg-white/10 px-2 py-0.5 rounded">→</strong> = +10s</span>
              <span><strong className="text-white bg-white/10 px-2 py-0.5 rounded">←</strong> = -10s</span>
              <span><strong className="text-white bg-white/10 px-2 py-0.5 rounded">F</strong> = Fullscreen</span>
              <span><strong className="text-white bg-white/10 px-2 py-0.5 rounded">C</strong> = Classroom Mode</span>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Content */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-4">
          
          {/* Jump To */}
          <div className="bg-[#14532D] rounded-xl p-5 border border-white/5 shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-white">Jump To</h2>
            <div className="space-y-1">
              {[
                { time: "0:00:00", label: "Introduction to Light", active: true },
                { time: "0:07:03", label: "Reflection Laws", active: false },
                { time: "0:12:58", label: "Spherical Mirrors", active: false },
                { time: "0:18:34", label: "Image Formation", active: false },
                { time: "0:25:29", label: "Mirror Formula", active: false },
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer text-sm transition-colors ${item.active ? "bg-white/10 text-white font-medium" : "text-[#B9C7B6] hover:bg-white/5 hover:text-gray-200"}`}>
                  <span className="font-mono">{item.time}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Concepts */}
          <div className="bg-[#14532D] rounded-xl p-5 border border-white/5 shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-white">Key Concepts</h2>
            <div className="space-y-2">
              {[
                "Reflection | परावर्तन",
                "Refraction | अपवर्तन",
                "Spherical Mirrors | गोलीय दर्पण",
              ].map((concept, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm">
                  <span>{concept}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Next Up */}
          <div className="bg-[#14532D] rounded-xl p-5 border border-white/5 shadow-lg relative overflow-hidden group cursor-pointer">
            <h2 className="font-semibold text-sm mb-3 text-white">Next Up</h2>
            <div className="flex gap-3 items-center">
              <div className="w-24 h-14 bg-black rounded-md border border-white/10 shrink-0"></div>
              <div>
                <div className="text-xs text-[#B9C7B6] mb-0.5">Chapter 10</div>
                <div className="text-sm font-medium text-white line-clamp-2 leading-tight">Class 10 | Science | Light Reflection | P...</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
