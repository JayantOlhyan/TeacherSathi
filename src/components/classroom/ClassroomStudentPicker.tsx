"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  RotateCcw, 
  X, 
  Sparkles
} from "lucide-react";

export interface ClassroomStudentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
  studentRoster?: string[];
}

const DEFAULT_STUDENTS = [
  "Aarav Sharma",
  "Pooja Verma",
  "Rohan Kumar",
  "Ananya Singh",
  "Karan Patel",
  "Priya Yadav",
  "Aditya Gupta",
  "Sneha Meena",
  "Vivek Tiwari",
  "Ritu Chaudhary",
  "Manish Soni",
  "Kavita Rawat",
  "Deepak Joshi",
  "Neha Chauhan",
  "Rahul Saini",
  "Sunita Maurya",
  "Amit Bishnoi",
  "Kiran Rathore",
  "Pankaj Prajapati",
  "Suman Devi"
];

export function ClassroomStudentPicker({
  isOpen,
  onClose,
  theme = "dark",
  studentRoster = DEFAULT_STUDENTS,
}: ClassroomStudentPickerProps) {
  const [students, setStudents] = useState<string[]>(studentRoster);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [calledHistory, setCalledHistory] = useState<string[]>([]);

  const isDark = theme === "dark";

  useEffect(() => {
    if (studentRoster && studentRoster.length > 0) {
      setStudents(studentRoster);
    }
  }, [studentRoster]);

  const pickRandomStudent = () => {
    if (isSpinning || students.length === 0) return;

    setIsSpinning(true);
    let counter = 0;
    const maxCycles = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex]);
      counter++;

      if (counter >= maxCycles) {
        clearInterval(interval);
        const finalStudent = students[Math.floor(Math.random() * students.length)];
        setSelectedStudent(finalStudent);
        setIsSpinning(false);
        setCalledHistory((prev) => [finalStudent, ...prev.filter((s) => s !== finalStudent)].slice(0, 5));
      }
    }, 70);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Random Student Picker"
    >
      <div 
        className={`w-full max-w-lg rounded-3xl border-2 shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-scaleUp ${
          isDark 
            ? "bg-[#0B131E] border-slate-700 text-white" 
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">Student Caller</h3>
              <p className="text-xs text-slate-400 font-semibold">छात्र चयन • Active Participation for All</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Student Display Card */}
        <div className="py-6 sm:py-8 space-y-4">
          <div 
            className={`min-h-[140px] rounded-3xl border-2 flex flex-col items-center justify-center p-6 transition-all ${
              isSpinning 
                ? "border-amber-400 bg-amber-500/10 scale-102"
                : selectedStudent 
                ? "border-emerald-500 bg-emerald-500/10 scale-100 shadow-xl"
                : "border-slate-700 bg-slate-900/50"
            }`}
          >
            {selectedStudent ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Selected Student
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-emerald-300">
                  {selectedStudent}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                  Your turn to answer or explain your thinking!
                </p>
              </>
            ) : (
              <div className="text-slate-400 font-medium text-base sm:text-lg">
                Tap &ldquo;Pick Next Student&rdquo; to choose randomly
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons (>= 64px Touch Target) */}
        <div className="space-y-3">
          <button
            onClick={pickRandomStudent}
            disabled={isSpinning}
            className="w-full min-h-[64px] rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border-2 border-indigo-400/50 shadow-xl disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-6 h-6 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "Picking..." : "Pick Next Student"}</span>
          </button>
        </div>

        {/* Recent Called History */}
        {calledHistory.length > 0 && (
          <div className="pt-3 border-t border-slate-700/50 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Recently Called:
            </span>
            <div className="flex gap-2 flex-wrap">
              {calledHistory.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
