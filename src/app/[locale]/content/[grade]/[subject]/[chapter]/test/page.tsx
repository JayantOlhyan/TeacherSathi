"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Flag, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function ChapterTestPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>("B");
  const params = useParams();
  const grade = params.grade as string;
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  useEffect(() => {
    if (typeof window !== "undefined" && grade && subject && chapter) {
      const cleanSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
      const cleanChapter = chapter.replace("chapter-", "");
      localStorage.setItem("last_sathi_view", window.location.pathname);
      localStorage.setItem("last_sathi_view_title", `AI Test - ${cleanSubject} (Ch. ${cleanChapter})`);
    }
  }, [grade, subject, chapter]);

  // Grid items 1-25
  const grid = Array.from({ length: 25 }, (_, i) => {
    const num = i + 1;
    let state = "unanswered";
    if (num < 7) state = "answered";
    if (num === 7) state = "current";
    if (num === 8) state = "flagged";
    return { num, state };
  });

  return (
    <div className="min-h-screen bg-cream font-sans text-ink flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-line px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink">
            TeacherSathi NCERT Chapter Test — <br className="sm:hidden" /> Class 10 Science
          </h1>
          <p className="text-xs text-ink-2 mt-1 hidden sm:block">
            Rigorous CBSE competency assessment tailored for Indian government school educators and classroom evaluations.
          </p>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="text-4xl font-bold text-[#DC2626] font-mono tracking-wider">
            24:17
          </div>
        </div>

        <div className="flex-1 flex justify-end items-start gap-4">
          <div className="text-2xl font-bold mt-1">
            Q 7 / 25
          </div>
          <div className="hidden sm:grid grid-cols-6 gap-1 border p-1 rounded bg-white">
            {grid.map((item) => {
              let classes = "w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-sm border ";
              if (item.state === "answered") classes += "bg-brand text-white border-brand";
              else if (item.state === "current") classes += "bg-brand-tint text-brand border-brand";
              else if (item.state === "flagged") classes += "bg-white text-ink-3 border-line relative";
              else classes += "bg-white text-ink-3 border-line";

              return (
                <div key={item.num} className={classes}>
                  {item.num}
                  {item.state === "flagged" && <div className="absolute -top-1 -right-1 text-yellow-500 text-[10px]">★</div>}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl bg-white border border-line rounded-3xl shadow-card overflow-hidden flex flex-col">
          
          <div className="p-8 sm:p-10 flex-1">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink leading-relaxed">
                Which lens is used to correct myopia?
              </h2>
              <div className="w-3 h-3 rounded-full bg-danger shrink-0 mt-2"></div>
            </div>

            <div className="space-y-3">
              {[
                { id: "A", text: "Convex lens" },
                { id: "B", text: "Concave lens" },
                { id: "C", text: "Bifocal lens" },
                { id: "D", text: "Cylindrical lens" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors font-semibold ${selectedOption === opt.id ? "border-brand bg-brand-tint text-brand" : "border-line hover:bg-brand-tint/30 bg-white text-ink"}`}
                >
                  <span className="w-6 font-semibold text-gray-800">{opt.id}</span>
                  <span className="text-gray-700">{opt.text}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium">
                Flag for Review <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="grid grid-cols-2 border-t border-line divide-x divide-line">
            <button className="flex items-center justify-center gap-2 py-4 text-ink-2 hover:bg-brand-tint/20 font-bold transition-all">
              <ArrowLeft className="w-4 h-4" /> PREV
            </button>
            <button className="flex items-center justify-center gap-2 py-4 text-ink hover:bg-brand-tint/20 font-bold transition-all">
              NEXT <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#DC2626] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
          Submit Test <Lock className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
