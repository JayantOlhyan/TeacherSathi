"use client";

import { useState, useEffect } from "react";
import { User, School, Save, CheckCircle2, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [name, setName] = useState("Teacher");
  const [email, setEmail] = useState("teacher@school.edu.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [schoolName, setSchoolName] = useState("Government Senior Secondary School");
  const [udiseCode, setUdiseCode] = useState("UDISE-060201");
  const [postType, setPostType] = useState("tgt");
  const [subject, setSubject] = useState("science");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("last_sathi_teacher_name");
    const storedSchool = localStorage.getItem("last_sathi_school_name");
    const storedUdise = localStorage.getItem("last_sathi_school_code");
    const storedPost = localStorage.getItem("last_sathi_post_type");
    const storedSubject = localStorage.getItem("last_sathi_subject");

    if (storedName) setName(storedName);
    if (storedSchool) setSchoolName(storedSchool);
    if (storedUdise) setUdiseCode(storedUdise);
    if (storedPost) setPostType(storedPost);
    if (storedSubject) setSubject(storedSubject);

    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      if (user?.phone) setPhone(user.phone);
      if (user?.user_metadata?.full_name) setName(user.user_metadata.full_name);
    });
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("last_sathi_teacher_name", name);
    localStorage.setItem("last_sathi_school_name", schoolName);
    localStorage.setItem("last_sathi_school_code", udiseCode);
    localStorage.setItem("last_sathi_post_type", postType);
    localStorage.setItem("last_sathi_subject", subject);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#14532D] to-[#15803D] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            Verified Indian Educator Profile
          </div>
          <h1 className="text-3xl font-black font-serif">{name}</h1>
          <p className="text-white/80 text-sm font-medium">
            {schoolName} • {udiseCode}
          </p>
        </div>
        <div className="w-20 h-20 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center text-3xl font-bold font-serif shadow-inner">
          {name.charAt(0)}
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-bold">Profile & School binding saved successfully!</span>
        </div>
      )}

      {/* Profile Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700" /> Educator Personal Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Mobile Number (WhatsApp)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Teacher Cadre / Post
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-gray-800 bg-white"
            >
              <option value="tgt">TGT (Trained Graduate Teacher) 📚</option>
              <option value="pgt">PGT (Post Graduate Teacher) 🎓</option>
              <option value="prt">PRT (Primary Teacher) ✏️</option>
            </select>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 pt-4 flex items-center gap-2">
          <School className="w-5 h-5 text-emerald-700" /> Government School Binding & UDISE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              UDISE Code (11 Digits)
            </label>
            <input
              type="text"
              value={udiseCode}
              onChange={(e) => setUdiseCode(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Primary Subject Taught
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-gray-800 bg-white"
            >
              <option value="science">Science 🔬</option>
              <option value="mathematics">Mathematics 📐</option>
              <option value="english">English 📚</option>
              <option value="social_science">Social Science 🌍</option>
              <option value="hindi">Hindi ✍️</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#14532D] hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>

      </form>
    </div>
  );
}
