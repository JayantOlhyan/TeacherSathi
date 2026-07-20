import React from "react";
import { ArrowRight, Leaf } from "lucide-react";

export default function FooterMission() {
  return (
    <footer className="w-full bg-[#1A2E20] text-white relative z-20 pt-24 pb-12 mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mission Quote */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Leaf className="w-8 h-8 text-brand-DEFAULT mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-8">
            "Our mission is to empower every government school teacher with world-class teaching resources, so they can focus on what matters most—<span className="text-brand-400">inspiring the next generation.</span>"
          </h2>
        </div>

        {/* CTA Box */}
        <div className="bg-[#243F2C] border border-[#2C4A35] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-24 shadow-2xl">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black mb-4">Start Your Free Trial Today</h3>
            <p className="text-[#A3B8AA] font-semibold text-lg max-w-lg">
              Join thousands of teachers transforming their classrooms with TeacherSathi.
            </p>
          </div>
          <button className="px-8 py-4 rounded-xl bg-brand-DEFAULT text-white font-black text-sm flex items-center gap-2 hover:bg-brand-500 transition-colors shrink-0 shadow-[0_0_30px_-5px_rgba(15,91,56,0.6)] hover:shadow-[0_0_40px_-5px_rgba(15,91,56,0.8)]">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-12 border-t border-[#2C4A35]">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-brand-DEFAULT flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight">TeacherSathi</span>
            </div>
            <p className="text-[#A3B8AA] text-sm font-medium">
              Empowering educators with intelligent tools to create engaging classrooms.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-[#A3B8AA]">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-[#A3B8AA]">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-[#A3B8AA]">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center text-[#A3B8AA] text-sm font-medium">
          © 2024 TeacherSathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
