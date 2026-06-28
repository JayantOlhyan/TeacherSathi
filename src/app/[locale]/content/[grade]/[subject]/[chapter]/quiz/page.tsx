"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function QuickQuizPage() {
  const params = useParams();
  const router = useRouter();
  const grade = params.grade as string;
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  useEffect(() => {
    if (typeof window !== "undefined" && grade && subject && chapter) {
      const cleanSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
      const cleanChapter = chapter.replace("chapter-", "");
      localStorage.setItem("last_sathi_view", window.location.pathname);
      localStorage.setItem("last_sathi_view_title", `AI Quiz - ${cleanSubject} (Ch. ${cleanChapter})`);
    }
  }, [grade, subject, chapter]);

  const handleQuit = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to quit this quiz? Your current score will not be saved.")) {
      router.push(`/content/${grade}/${subject}/${chapter}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-[#F4F8F1] font-sans flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-black text-white">
          TeacherSathi NCERT Classroom Interactive Quiz
        </h1>
        <p className="text-xs text-[#B9C7B6] mt-1">
          Live CBSE competency-based assessment formatted for Indian government school smart classrooms.
        </p>
      </div>
      
      {/* Top Header Bar with Quit Button */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button 
          onClick={handleQuit}
          className="flex items-center justify-center gap-2 text-[#B9C7B6] hover:text-white hover:bg-white/10 transition-all font-bold text-sm bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl cursor-pointer w-fit active:scale-95"
        >
          <X className="w-4 h-4" /> Quit Quiz
        </button>
        <div className="flex items-center justify-between sm:justify-end gap-6 text-sm font-semibold flex-1">
          <span className="text-[#B9C7B6]">Progress 23%</span>
          <span className="text-[#B9C7B6]">Q 7 of 30</span>
          <div className="bg-[#14532D] border border-white/10 px-3 py-1 rounded-xl flex items-center gap-2">
            <span className="text-[#B9C7B6]">Live score</span>
            <span className="flex items-center text-success"><span className="font-bold mr-0.5">7</span><Check className="w-3 h-3 stroke-[3]" /></span>
            <span className="flex items-center text-danger"><span className="font-bold mr-0.5">2</span><X className="w-3 h-3 stroke-[3]" /></span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl h-2 bg-[#14532D] rounded-full overflow-hidden mb-12">
        <div className="h-full bg-[#16A34A] rounded-full w-[23%]"></div>
      </div>

      {/* Quiz Card */}
      <div className="w-full max-w-3xl relative">
        {/* Floating Q Badge */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand text-white text-xl font-bold px-6 py-2 rounded-full border-4 border-dark-bg z-10 shadow-lg">
          Q07
        </div>

        <div className="bg-[#14532D] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          
          {/* Difficulty Badge */}
          <div className="absolute top-6 right-8 bg-[#D97706]/20 text-[#D97706] text-xs font-bold px-3 py-1 rounded-full">
            Medium
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center mt-6 mb-10 text-balance">
            Which of the following correctly describes the law of reflection?
          </h2>

          <div className="space-y-4 mb-8">
            {/* Option A - Incorrect */}
            <div>
              <div className="flex items-center gap-4 bg-danger/10 border border-danger p-4 rounded-2xl cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-danger/20 text-danger flex items-center justify-center font-bold shrink-0">A</div>
                <div className="text-danger font-medium text-lg">The angle of incidence is always greater than the angle of reflection.</div>
              </div>
              <div className="text-danger font-medium text-sm flex items-center gap-1 mt-2 ml-2">
                <X className="w-4 h-4 stroke-[3]" /> Incorrect
              </div>
            </div>

            {/* Option B - Correct */}
            <div>
              <div className="flex items-center gap-4 bg-success/10 border border-success p-4 rounded-2xl cursor-pointer relative overflow-hidden">
                {/* Simulated Confetti behind text */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-[url('https://cdn-icons-png.flaticon.com/512/3253/3253018.png')] bg-contain bg-no-repeat bg-right opacity-20 pointer-events-none"></div>
                <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold shrink-0 relative z-10 shadow-sm">B</div>
                <div className="text-white font-medium text-lg relative z-10">The angle of incidence always equals the angle of reflection.</div>
              </div>
              <div className="text-success font-medium text-sm flex items-center gap-1 mt-2 ml-2">
                <Check className="w-4 h-4 stroke-[3]" /> Correct! Well done 🎉
              </div>
            </div>

            {/* Option C - Default */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/10 text-gray-300 flex items-center justify-center font-bold shrink-0">C</div>
              <div className="text-gray-300 font-medium text-lg">The incident ray and reflected ray are always perpendicular to each other.</div>
            </div>

            {/* Option D - Default */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/10 text-gray-300 flex items-center justify-center font-bold shrink-0">D</div>
              <div className="text-gray-300 font-medium text-lg">Reflection only occurs on perfectly smooth, mirror-like surfaces.</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 pt-6 border-t border-white/10">
            <p className="text-[#B9C7B6] text-sm flex-1 leading-relaxed">
              The angle of incidence always equals the angle of reflection, measured from the normal.
            </p>
            <Button className="bg-[#16A34A] hover:bg-[#128A3E] text-white px-6 py-6 rounded-xl text-lg font-bold shrink-0 flex items-center gap-2 shadow-brand">
              Next Question <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
