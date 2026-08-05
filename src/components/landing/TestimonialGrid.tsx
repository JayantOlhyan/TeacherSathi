import React from "react";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TestimonialGrid() {
  const testimonials = [
    {
      quote: "\"TeacherSathi saves me 3 hours every week. The 75-inch smartboard lesson plans and bilingual quizzes are accurate and perfect for my Class 8 Science lab.\"",
      name: "Sunita Verma",
      role: "Senior Science Teacher",
      school: "Government Senior Secondary School, Bhopal (MP)",
      image: "/avatar_sunita_1784506464230.jpg"
    },
    {
      quote: "\"My students understand concepts twice as fast with the interactive mind maps. It makes teaching Class 10 Social Science effective and joyful.\"",
      name: "Ramesh Kumar",
      role: "Social Science HOD",
      school: "Kendriya Vidyalaya No. 1, Jaipur (Rajasthan)",
      image: "/avatar_ramesh_1784506477448.jpg"
    },
    {
      quote: "\"Finally, a platform built specifically for government school teachers. Instant worksheet generator with answer key is a complete game changer.\"",
      name: "Anjali Kumari",
      role: "Hindi & Sanskrit Teacher",
      school: "Jawahar Navodaya Vidyalaya, Patna (Bihar)",
      image: "/avatar_anjali_1784506491622.jpg"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Educator Feedback
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1A2E20] tracking-tight font-serif">
          Tested &amp; Loved in 10,000+ Classrooms
        </h2>
        <p className="text-[#4A5D52] font-semibold text-sm">
          Built alongside government school teachers using 75&quot; interactive smart displays.
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
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Teacher
                </span>
              </div>

              <p className="text-[#1A2E20] text-xs font-semibold leading-relaxed italic">
                {test.quote}
              </p>

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

      <button className="text-brand font-bold text-sm flex items-center gap-1.5 hover:text-brand-700 transition-colors">
        See more teacher stories <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
