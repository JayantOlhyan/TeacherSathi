"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  QrCode, 
  Plus, 
  Search, 
  Radio, 
  X, 
  Loader2, 
  Check, 
  Camera, 
  User,
  Users,
  GraduationCap,
  LayoutGrid,
  LineChart,
  Calendar,
  Sparkles,
  FileText
} from "lucide-react";
import Image from "next/image";

export default function MyClassPage() {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState(() => 
    Array.from({ length: 24 }).map((_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      rollNo: 100 + i,
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals & Toast State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRoll, setNewStudentRoll] = useState("");
  const [newStudentAvatar, setNewStudentAvatar] = useState<string | null>(null);
  
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<"idle" | "scanning" | "pairing" | "complete">("idle");
  const [pairedCount, setPairedCount] = useState(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read tab parameter from URL query if exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "quizzes") {
        setActiveTab("assignments");
      } else if (tabParam === "homework") {
        setActiveTab("homework");
      }
    }
  }, []);

  // Self-closing toast trigger
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudentAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentRoll) return;

    const newStudent = {
      id: students.length + 1,
      name: newStudentName,
      avatar: newStudentAvatar || `https://i.pravatar.cc/150?img=${(students.length % 70) + 1}`,
      rollNo: parseInt(newStudentRoll) || 100 + students.length,
    };

    setStudents(prev => [...prev, newStudent]);
    setIsAddStudentOpen(false);
    setNewStudentName("");
    setNewStudentRoll("");
    setNewStudentAvatar(null);
    setToastMessage(`Student "${newStudent.name}" added successfully!`);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Roll Number,Student Name\n"
      + students.map(s => `${s.rollNo},${s.name}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TeacherSathi_Class_10A_Students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToastMessage("CSV list downloaded successfully!");
  };

  const startClickerPairing = () => {
    setIsPairingOpen(true);
    setPairingStatus("scanning");
    setPairedCount(0);

    setTimeout(() => {
      setPairingStatus("pairing");
      setPairedCount(12);
      
      setTimeout(() => {
        setPairedCount(28);
        
        setTimeout(() => {
          setPairedCount(24);
          setPairingStatus("complete");
          setToastMessage("24 student clickers paired successfully!");
        }, 1000);
      }, 1000);
    }, 1200);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toString().includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#14532D] text-white border border-[#AEDCBA]/20 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slideIn">
          <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mt-2 flex items-center gap-3">
            Class 10-A Workspace
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Science</span>
          </h1>
          <p className="text-gray-500 mt-1 text-xs font-semibold leading-relaxed">
            UDISE Code: UDISE-060201 • Active Subject: General Science (Physics/Chemistry)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-blue-900 font-semibold text-xs">Access Code:</span>
            <span className="text-blue-700 font-bold tracking-widest text-base">X7K-9P2</span>
          </div>
          
          <button 
            onClick={() => setToastMessage("Student QR login sheet loaded.")}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> QR Sheet
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-gray-200 gap-6">
        {[
          { id: "students", label: "Students", icon: Users },
          { id: "assignments", label: "Assigned Work & Quizzes", icon: GraduationCap },
          { id: "homework", label: "Homework", icon: LayoutGrid },
          { id: "performance", label: "Performance", icon: LineChart },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? "border-[#14532D] text-[#14532D]" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon className="w-4.5 h-4.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Students Tab View */}
      {activeTab === "students" && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search students by name or roll number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-xs font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={startClickerPairing}
                className="flex-1 sm:flex-none bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Radio className="w-4 h-4" /> Pair Clickers
              </button>
              
              <button 
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              
              <button 
                onClick={() => setIsAddStudentOpen(true)}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </div>
          </div>

          {/* Student Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative cursor-pointer hover:-translate-y-0.5">
                  <button 
                    onClick={() => {
                      setStudents(prev => prev.filter(s => s.id !== student.id));
                      setToastMessage(`Student "${student.name}" removed.`);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-14 h-14 mb-3">
                      <Image 
                        src={student.avatar} 
                        alt={student.name} 
                        fill 
                        unoptimized
                        className="rounded-full object-cover border-2 border-gray-100"
                      />
                    </div>
                    <h2 className="font-extrabold text-gray-800 text-xs leading-tight mb-1 truncate max-w-full">{student.name}</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Roll: {student.rollNo}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <p className="text-xl">🔍</p>
                <h2 className="font-bold text-gray-700">No students matched search</h2>
                <p className="text-sm text-gray-400">Try checking spelling or type another roll number.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignments Tab View */}
      {activeTab === "assignments" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-gray-800">Assigned Quizzes & Live Sessions</h2>
            <button className="bg-[#14532D] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-green-800 transition-all cursor-pointer">
              <Plus className="w-4 h-4" /> New Quiz
            </button>
          </div>
          <div className="space-y-4">
            {[
              { title: "Ch 10 - Light Concept MCQ Test", questions: 10, assignedDate: "July 12, 2026", status: "Completed", accuracy: "78%" },
              { title: "Weekly Revision: Ray Diagrams", questions: 5, assignedDate: "July 16, 2026", status: "Active", accuracy: "--" },
            ].map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-50 flex items-center justify-between hover:bg-gray-50/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{q.title}</h3>
                    <p className="text-gray-400 text-xs font-semibold mt-0.5">{q.questions} Questions • Assigned on {q.assignedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    q.status === "Active" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-gray-50 text-gray-500 border-gray-150"
                  }`}>
                    {q.status}
                  </span>
                  {q.status === "Completed" && (
                    <span className="text-xs font-bold text-green-700">Accuracy: {q.accuracy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homework Tab View */}
      {activeTab === "homework" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-gray-800">Homework Library</h2>
            <button className="bg-[#14532D] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-green-800 transition-all cursor-pointer">
              <Plus className="w-4 h-4" /> New Homework
            </button>
          </div>
          <div className="space-y-4">
            {[
              { title: "Read Chapter 10 Light Refraction & take summary notes", due: "Due Tomorrow, 4 PM", status: "Active", submissions: "18/24" },
              { title: "Draw mirrors ray diagrams worksheet", due: "Completed last week", status: "Graded", submissions: "24/24" },
            ].map((hw, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-50 flex items-center justify-between hover:bg-gray-50/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{hw.title}</h3>
                    <p className="text-gray-400 text-xs font-semibold mt-0.5">{hw.due} • {hw.submissions} Submissions</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  hw.status === "Active" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-800 border-emerald-100"
                }`}>
                  {hw.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab View */}
      {activeTab === "performance" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Concept Mastery Status</h3>
            <div className="space-y-3">
              {[
                { concept: "Spherical Mirrors", state: "Strong", score: 84, color: "bg-emerald-600" },
                { concept: "Refraction Index", state: "Developing", score: 58, color: "bg-amber-500" },
                { concept: "Ray Diagrams", state: "Needs Attention", score: 32, color: "bg-red-500" },
              ].map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{c.concept}</span>
                    <span className="text-gray-500">{c.state} ({c.score}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${c.color} h-full rounded-full`} style={{ width: `${c.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 md:col-span-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-semibold">Actionable Recommendations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-amber-900">
                  <span className="font-extrabold">Generate homework for Ray Diagrams:</span> Over 40% of standard students had challenges during mirrors assessments. Running a recap visual worksheet is recommended.
                </div>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3">
                <Check className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-emerald-950">
                  <span className="font-extrabold">Good Progress on Spherical Mirrors:</span> Excellent accuracy. Ready to teach refraction index logic in tomorrow&apos;s smart class presentation!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-2xl shadow-xl p-6 relative animate-fadeIn text-gray-700">
            <button 
              onClick={() => {
                setIsAddStudentOpen(false);
                setNewStudentAvatar(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-extrabold text-gray-800 mb-4 font-sans">Add New Student</h2>
            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div className="flex flex-col items-center justify-center pb-2">
                <div className="relative group w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shadow-inner">
                  {newStudentAvatar ? (
                    <Image 
                      src={newStudentAvatar} 
                      alt="Preview" 
                      fill 
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-450" />
                  )}
                  <label 
                    htmlFor="student-photo" 
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px] font-bold uppercase tracking-wider text-center p-1"
                  >
                    Change
                  </label>
                </div>
                <input 
                  type="file" 
                  id="student-photo" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("student-photo")?.click()}
                  className="text-[10px] font-bold text-green-700 hover:text-green-800 mt-2 flex items-center gap-1 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100"
                >
                  <Camera className="w-3 h-3" /> Upload Photo
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Student Name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Roll Number</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 124"
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-xs font-semibold"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-cta-hover text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pairing Clickers Modal */}
      {isPairingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-2xl shadow-xl p-8 relative text-center text-gray-700">
            <button 
              onClick={() => setIsPairingOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5 text-indigo-600 shadow-xs relative">
              {pairingStatus === "complete" ? (
                <Check className="w-6 h-6 text-indigo-700 stroke-[3] animate-bounce" />
              ) : (
                <Radio className="w-6 h-6 text-indigo-700 animate-pulse" />
              )}
            </div>

            <h2 className="text-lg font-extrabold text-gray-800 mb-2">Register Student Clickers</h2>
            
            <div className="space-y-4 py-4">
              {pairingStatus === "scanning" && (
                <div className="space-y-3">
                  <p className="text-gray-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> Scanning for clicks...
                  </p>
                  <p className="text-[10px] text-gray-400">Please ask students to click any button on their hardware device.</p>
                </div>
              )}

              {pairingStatus === "pairing" && (
                <div className="space-y-3">
                  <p className="text-gray-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> Pairing devices...
                  </p>
                  <div className="text-2xl font-black text-indigo-700 tracking-wider">
                    {pairedCount} / 24 Paired
                  </div>
                </div>
              )}

              {pairingStatus === "complete" && (
                <div className="space-y-3">
                  <p className="text-green-600 text-xs font-extrabold">
                    🎉 Pairing Complete!
                  </p>
                  <div className="text-2xl font-black text-green-700 tracking-wider">
                    24 Clickers Active
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsPairingOpen(false)}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2 ${
                pairingStatus === "complete" 
                  ? "bg-[#16A34A] hover:bg-cta-hover text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {pairingStatus === "complete" ? "Finish" : "Cancel"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
