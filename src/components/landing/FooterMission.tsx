import React from "react";
import { ArrowRight, Leaf, Quote } from "lucide-react";

export default function FooterMission() {
  return (
    <footer className="w-full bg-[#0a1a12] text-white relative z-20 pt-32 pb-12 mt-32 overflow-hidden border-t border-[#123524]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-900/20 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mission Quote */}
        <div className="max-w-4xl mx-auto text-center mb-32 relative">
          <Quote className="absolute -top-12 -left-12 w-32 h-32 text-brand/10 -rotate-12 -z-10" />
          <Quote className="absolute -bottom-12 -right-12 w-32 h-32 text-brand/10 rotate-180 -z-10" />
          <Leaf className="w-8 h-8 text-brand mx-auto mb-8 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter mb-8 text-slate-100 relative z-10">
            &quot;Our mission is to empower every government school teacher with world-class teaching resources, so they can focus on what matters most—<span className="text-brand-400 bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-emerald-300">inspiring the next generation.</span>&quot;
          </h2>
        </div>

        {/* Premium CTA Box */}
        <div className="relative rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-32 shadow-[0_20px_60px_-15px_rgba(15,91,56,0.3)] overflow-hidden group">
          {/* Mesh Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A1D] via-[#1A2E20] to-[#0A1A12] z-0"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>
          {/* Glowing Orbs in background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full z-0"></div>

          <div className="text-center md:text-left relative z-10">
            <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">Start Your Free Trial Today</h3>
            <p className="text-[#A3B8AA] font-medium text-lg max-w-lg">
              Join 10,000+ educators transforming their classrooms with TeacherSathi&apos;s intelligent toolkit.
            </p>
          </div>
          <button className="relative z-10 px-8 py-5 rounded-2xl bg-white text-brand-950 font-black text-sm flex items-center gap-3 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
            Create Free Account <ArrowRight className="w-5 h-5 text-brand" />
          </button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-16 border-t border-[#1A2E20]/50 relative z-10">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-brand flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">TeacherSathi</span>
            </div>
            <p className="text-[#A3B8AA] text-sm font-medium leading-relaxed">
              Empowering educators with intelligent tools to create engaging, world-class classrooms.
            </p>
          </div>
          
          <div>
            <h4 className="font-black mb-6 text-white tracking-wide uppercase text-xs">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-[#A3B8AA]">
              {['Features', 'Pricing', 'Testimonials'].map((link) => (
                <li key={link}>
                  <a href="#" className="relative group inline-block">
                    <span className="relative z-10 transition-colors group-hover:text-white">{link}</span>
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-black mb-6 text-white tracking-wide uppercase text-xs">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-[#A3B8AA]">
              {['Blog', 'Help Center', 'Teaching Guidelines', 'NCERT Maps'].map((link) => (
                <li key={link}>
                  <a href="#" className="relative group inline-block">
                    <span className="relative z-10 transition-colors group-hover:text-white">{link}</span>
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-black mb-6 text-white tracking-wide uppercase text-xs">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-[#A3B8AA]">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href="#" className="relative group inline-block">
                    <span className="relative z-10 transition-colors group-hover:text-white">{link}</span>
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 text-center text-[#A3B8AA]/60 text-xs font-bold tracking-widest uppercase pb-4">
          © 2024 TeacherSathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
