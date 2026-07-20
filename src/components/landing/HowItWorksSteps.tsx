import React from "react";
import { BookOpen, Sparkles, Edit3, MonitorPlay, ArrowRight } from "lucide-react";

export default function HowItWorksSteps() {
  const steps = [
    {
      num: "01",
      title: "Choose",
      desc: "Select your class, subject and NCERT chapter.",
      icon: BookOpen
    },
    {
      num: "02",
      title: "Generate",
      desc: "Instantly create all types of teaching resources.",
      icon: Sparkles
    },
    {
      num: "03",
      title: "Review & Edit",
      desc: "Customize content to match your teaching style.",
      icon: Edit3
    },
    {
      num: "04",
      title: "Teach",
      desc: "Open on smart screen, engage, assess, and track results.",
      icon: MonitorPlay
    }
  ];

  return (
    <div className="w-full flex flex-col items-center relative z-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#1A2E20] mb-2 tracking-tight">How TeacherSathi Works</h2>
        <p className="text-[#4A5D52] font-semibold text-sm">Simple steps. Powerful teaching.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-6xl">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            {/* Step Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center w-full md:w-64 h-48 justify-center hover:-translate-y-1 transition-transform">
              <div className="flex justify-center items-center gap-4 mb-4">
                <span className="text-brand-DEFAULT font-black text-sm">{step.num}</span>
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-brand-DEFAULT" />
                </div>
              </div>
              <h3 className="font-black text-[#1A2E20] text-sm mb-2">{step.title}</h3>
              <p className="text-[#4A5D52] text-[10px] font-medium leading-relaxed px-2">{step.desc}</p>
            </div>

            {/* Arrow connecting steps */}
            {idx < steps.length - 1 && (
              <div className="hidden md:flex text-[#4A5D52]/40 px-2 shrink-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
