"use client";

import { useState, useEffect } from "react";
import { Download, QrCode, Plus, Search, Radio, X, Loader2, Check, Camera, User } from "lucide-react";
import Image from "next/image";

export default function MyClassPage() {
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

    // Dynamic pairing simulation
    setTimeout(() => {
      setPairingStatus("pairing");
      setPairedCount(12);
      
      setTimeout(() => {
        setPairedCount(28);
        
        setTimeout(() => {
          setPairedCount(42);
          setPairingStatus("complete");
          setToastMessage("42 student clickers paired successfully!");
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            Classroom Roster & Student Management
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">Active</span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Manage your registered Indian government school students, monitor attendance rosters, organize CBSE and NCERT subject groups, and pair interactive classroom clickers effortlessly. ({students.length} Students Active • Physics, Chemistry, Biology)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-blue-900 font-medium text-sm">Class Code:</span>
            <span className="text-blue-700 font-bold tracking-widest text-lg">X7K-9P2</span>
          </div>
          
          <button 
            onClick={() => setToastMessage("Student QR login sheet loaded.")}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> QR Login
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students by name or roll number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={startClickerPairing}
            className="flex-1 sm:flex-none bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Radio className="w-4 h-4" /> Register Clickers
          </button>
          
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          
          <button 
            onClick={() => setIsAddStudentOpen(true)}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm"
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
                <div className="relative w-16 h-16 mb-3">
                  <Image 
                    src={student.avatar} 
                    alt={student.name} 
                    fill 
                    unoptimized
                    className="rounded-full object-cover border-2 border-gray-100"
                  />
                </div>
                <h2 className="font-extrabold text-gray-800 text-sm leading-tight mb-1">{student.name}</h2>
                <p className="text-xs text-gray-500 font-bold">Roll: {student.rollNo}</p>
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

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-2xl shadow-xl p-6 relative animate-fadeIn text-gray-700">
            <button 
              onClick={() => {
                setIsAddStudentOpen(false);
                setNewStudentAvatar(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-gray-800 mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              
              {/* Photo Upload Area */}
              <div className="flex flex-col items-center justify-center pb-2">
                <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center shadow-inner">
                  {newStudentAvatar ? (
                    <Image 
                      src={newStudentAvatar} 
                      alt="Preview" 
                      fill 
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                  <label 
                    htmlFor="student-photo" 
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold uppercase tracking-wider text-center p-1"
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
                  className="text-xs font-bold text-green-700 hover:text-green-800 mt-2 flex items-center gap-1 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {newStudentAvatar ? "Change Photo" : "Upload Photo"}
                </button>
                {newStudentAvatar && (
                  <button 
                    type="button"
                    onClick={() => setNewStudentAvatar(null)}
                    className="text-[10px] font-semibold text-red-500 hover:underline mt-1"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Student Name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-semibold"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-semibold"
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
            
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5 text-indigo-600 shadow-xs relative">
              {pairingStatus === "complete" ? (
                <Check className="w-8 h-8 text-indigo-700 stroke-[3] animate-bounce" />
              ) : (
                <Radio className="w-8 h-8 text-indigo-700 animate-pulse" />
              )}
            </div>

            <h2 className="text-xl font-extrabold text-gray-800 mb-2">Register Student Clickers</h2>
            
            <div className="space-y-4 py-4">
              {pairingStatus === "scanning" && (
                <div className="space-y-3">
                  <p className="text-gray-500 text-sm font-semibold flex items-center justify-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Scanning for clicks...
                  </p>
                  <p className="text-xs text-gray-400">Please ask students to click any button on their hardware device.</p>
                </div>
              )}

              {pairingStatus === "pairing" && (
                <div className="space-y-3">
                  <p className="text-gray-500 text-sm font-semibold flex items-center justify-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Pairing devices...
                  </p>
                  <div className="text-3xl font-black text-indigo-700 tracking-wider">
                    {pairedCount} / 42 Paired
                  </div>
                </div>
              )}

              {pairingStatus === "complete" && (
                <div className="space-y-3">
                  <p className="text-green-600 text-sm font-extrabold">
                    🎉 Pairing Complete!
                  </p>
                  <div className="text-3xl font-black text-green-700 tracking-wider">
                    42 Clickers Active
                  </div>
                  <p className="text-xs text-gray-400">All registered clickers successfully assigned to student roll seats.</p>
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
