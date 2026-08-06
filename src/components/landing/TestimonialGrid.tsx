"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, CheckCircle2, Play, X } from "lucide-react";

export default function TestimonialGrid() {
  const [selectedVideo, setSelectedVideo] = useState<{ name: string; title: string; school: string } | null>(null);

  const testimonials = [
    {
      quote: "\"TeacherSathi saves me 3 hours every week. The 75-inch smartboard lesson plans and bilingual quizzes are accurate and perfect for my Class 8 Science lab.\"",
      name: "Sunita Verma",
      role: "Senior Science Teacher",
      school: "Government Senior Secondary School, Bhopal (MP)",
      image: "/avatar_sunita_1784506464230.jpg",
      hasVideo: true,
      videoTitle: "Classroom Demo: 75-inch Smartboard Science Lesson"
    },
    {
      quote: "\"My students understand concepts twice as fast with the interactive mind maps. It makes teaching Class 10 Social Science effective and joyful.\"",
      name: "Ramesh Kumar",
      role: "Social Science HOD",
      school: "Kendriya Vidyalaya No. 1, Jaipur (Rajasthan)",
      image: "/avatar_ramesh_1784506477448.jpg",
      hasVideo: true,
      videoTitle: "KVS Educator Review: Creating CBSE Worksheets in 30s"
    },
    {
      quote: "\"Finally, a platform built specifically for government school teachers. Instant worksheet generator with answer key is a complete game changer.\"",
      name: "Anjali Kumari",
      role: "Hindi & Sanskrit Teacher",
      school: "Jawahar Navodaya Vidyalaya, Patna (Bihar)",
      image: "/avatar_anjali_1784506491622.jpg",
      hasVideo: true,
      videoTitle: "Navodaya Teacher Feedback: Bilingual Hindi Output"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified KVS &amp; Government School Educator Stories
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1A2E20] tracking-tight font-serif">
          Tested &amp; Loved in 10,000+ Classrooms
        </h2>
        <p className="text-[#4A5D52] font-semibold text-sm">
          Watch real video feedback from verified KVS, NVS, and State Board teachers using 75&quot; smart screens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mb-8">
        {testimonials.map((test, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden hover:-translate-y-1.5 transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Educator
                </span>
              </div>

              <p className="text-[#1A2E20] text-xs font-semibold leading-relaxed italic">
                {test.quote}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedVideo({ name: test.name, title: test.videoTitle, school: test.school })}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-800 text-emerald-800" />
                  <span>Watch Video Story (1:30)</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 border-2 border-emerald-500 shadow-sm">
                  <Image 
                    src={test.image} 
                    alt={test.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">{test.name}</h4>
                  <p className="text-emerald-700 text-[11px] font-bold">{test.role}</p>
                  <p className="text-gray-500 text-[10px] font-medium leading-tight">{test.school}</p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-xl w-full space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Verified Video Testimonial</span>
              <h3 className="text-lg font-black text-white">{selectedVideo.name} — {selectedVideo.school}</h3>
            </div>

            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              <div className="text-center space-y-3 p-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg animate-pulse cursor-pointer">
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                </div>
                <p className="text-xs font-bold text-emerald-300">{selectedVideo.title}</p>
                <p className="text-[10px] text-slate-400">Playing HD Video Stream (1080p)...</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      <a href="/signup" className="text-brand font-bold text-sm flex items-center gap-1.5 hover:text-brand-700 transition-colors">
        Join 10,000+ Teachers Today <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
