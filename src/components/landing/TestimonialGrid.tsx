import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function TestimonialGrid() {
  const testimonials = [
    {
      quote: "\"TeacherSathi saves me hours every week. The resources are accurate, simple to use, and perfect for my classroom.\"",
      name: "Sunita Verma",
      role: "Science Teacher, MP",
      image: "/avatar_sunita_1784506464230.jpg"
    },
    {
      quote: "\"My students understand concepts better with the videos and quizzes. It makes teaching effective and enjoyable.\"",
      name: "Ramesh Kumar",
      role: "Social Science Teacher, Rajasthan",
      image: "/avatar_ramesh_1784506477448.jpg"
    },
    {
      quote: "\"Finally, a platform that understands government school teachers' real needs. Very helpful and reliable.\"",
      name: "Anjali Kumari",
      role: "Hindi Teacher, Bihar",
      image: "/avatar_anjali_1784506491622.jpg"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#1A2E20] mb-2 tracking-tight">Tested in Real Classrooms</h2>
        <p className="text-[#4A5D52] font-semibold text-sm">Built with teachers. Loved by teachers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mb-8">
        {testimonials.map((test, idx) => (
          <div key={idx} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-white flex overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="w-1/3 relative bg-slate-100 shrink-0">
              <Image 
                src={test.image} 
                alt={test.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="w-2/3 p-6 flex flex-col justify-between bg-white">
              <p className="text-[#1A2E20] text-[11px] font-bold leading-relaxed mb-4">{test.quote}</p>
              <div>
                <h4 className="font-black text-[#1A2E20] text-xs">{test.name}</h4>
                <p className="text-[#4A5D52] text-[10px] font-medium">{test.role}</p>
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
