"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Check, ShieldCheck, ChevronDown, HelpCircle, Building2, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import InstitutionalLeadModal from "@/components/InstitutionalLeadModal";

export default function PricingPage() {
  const [audience, setAudience] = useState<"teachers" | "schools">("teachers");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const teacherPlans = {
    free: {
      title: "Individual Educator",
      price: "0",
      badge: "100% FREE FOREVER",
      features: [
        "Full NCERT Class 6–10 Syllabus Access",
        "Unlimited 75\" Smartboard Presentations",
        "Bilingual Hindi & English Devanagari Notes",
        "Basic MCQ Quiz & Worksheet Generators",
        "Works on Low-Bandwidth 2G/3G Connectivity"
      ]
    },
    pro: {
      title: "Teacher Pro",
      price: "499",
      yearlyPrice: "4,999",
      badge: "MOST POPULAR",
      features: [
        "Everything in Free Individual Plan",
        "Unlimited High-Res Vector Mind Maps",
        "Summative CBSE Question Paper Generator",
        "Export Formatted PDFs & PPTX Decks",
        "Priority WhatsApp & Email Support",
        "Custom School Branding on Worksheets"
      ]
    }
  };

  const schoolPlans = {
    institutional: {
      title: "School Management / Institution",
      price: "9,999",
      period: "per year per school",
      badge: "UP TO 50 TEACHERS",
      features: [
        "Unlimited Teacher Accounts (Up to 50 Teachers)",
        "Unified School Principal Dashboard",
        "75-inch Smart Classroom Mirroring System",
        "Custom CBSE & State Board Syllabus Mapping",
        "Dedicated Account Manager & Teacher Training",
        "DPDP Act 2023 Data Privacy Audit Compliance"
      ]
    }
  };

  const faqs = [
    { q: "Is TeacherSathi really 100% free for individual teachers?", a: "Yes! TeacherSathi is 100% free forever for individual Indian school teachers with zero credit card requirements." },
    { q: "What is covered under the 30-Day Satisfaction Guarantee?", a: "For Pro and Institutional plans, if TeacherSathi does not save your teachers 10+ hours weekly within 30 days, we issue a 100% instant refund with no questions asked." },
    { q: "Can school management purchase bulk licenses via invoice?", a: "Yes! We issue official tax invoices (GST compliant) and accept school cheque, NEFT/RTGS, and Razorpay UPI payments." },
    { q: "Does TeacherSathi work on 75-inch smartboards without internet?", a: "Yes, all slide decks and mind maps can be exported to PDF/PPTX formats for offline smartboard projection." }
  ];

  return (
    <div className="min-h-screen bg-cream bg-[radial-gradient(#C3CFBC_1px,transparent_1px)] [background-size:16px_16px] font-sans pb-20">
      <main className="w-full max-w-5xl mx-auto pt-[clamp(2rem,6vw,4rem)] px-[clamp(1rem,4vw,2rem)]">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Transparent Pricing &bull; 100% Satisfaction Guarantee
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Simple, Honest Pricing for Educators &amp; Schools
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            100% Free forever for individual teachers. Transparent B2B annual plans for school management &amp; principal buyers.
          </p>

          <div className="inline-flex bg-white rounded-full p-1 border border-line shadow-sm" role="tablist">
            <button 
              onClick={() => setAudience("teachers")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${audience === "teachers" ? "bg-[#14532D] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
            >
              Individual Teachers 📚
            </button>
            <button 
              onClick={() => setAudience("schools")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${audience === "schools" ? "bg-[#14532D] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
            >
              School Management / B2B 🏫
            </button>
          </div>
        </div>

        {/* 30-Day Money Back Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-10 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
              🛡️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">30-Day 100% Money-Back Satisfaction Guarantee</h3>
              <p className="text-xs text-slate-600">If TeacherSathi doesn&apos;t save your educators 10+ hours weekly, receive an instant 100% refund.</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full shrink-0 border border-amber-300">
            Zero Risk Guarantee
          </span>
        </div>

        {/* Pricing Cards Grid */}
        {audience === "teachers" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Free Plan */}
            <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-8 relative shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {teacherPlans.free.badge}
                </span>
                <h2 className="text-2xl font-black text-slate-900">{teacherPlans.free.title}</h2>
                <div className="text-4xl font-black text-slate-900">₹0 <span className="text-base font-bold text-slate-500">/ forever</span></div>
                
                <ul className="space-y-3 pt-2">
                  {teacherPlans.free.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 text-xs font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/signup" className="block pt-4">
                <Button className="w-full py-4 rounded-2xl bg-[#14532D] hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md">
                  Get Started 100% Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#123524] text-white rounded-3xl p-8 relative shadow-2xl flex flex-col justify-between space-y-6 border border-emerald-700">
              <div className="space-y-4">
                <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {teacherPlans.pro.badge}
                </span>
                <h2 className="text-2xl font-black text-white">{teacherPlans.pro.title}</h2>
                <div className="text-4xl font-black text-white">
                  ₹{teacherPlans.pro.price} <span className="text-base font-normal text-emerald-200">/ month</span>
                </div>

                <ul className="space-y-3 pt-2">
                  {teacherPlans.pro.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-emerald-100 text-xs font-medium">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => alert("Razorpay Checkout: Opening Pro Educator Plan (₹499/mo)")}
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg"
                >
                  Upgrade to Pro (₹499/mo)
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* B2B School Management Card */
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white border-2 border-emerald-700 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {schoolPlans.institutional.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{schoolPlans.institutional.title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900">₹{schoolPlans.institutional.price}</div>
                  <span className="text-xs font-bold text-slate-500">{schoolPlans.institutional.period}</span>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schoolPlans.institutional.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 text-xs font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="flex-1 py-4 bg-[#14532D] hover:bg-emerald-900 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-emerald-300" />
                  <span>Request Institutional Proposal &amp; Quote</span>
                </button>
                <a
                  href="tel:+919667344125"
                  className="py-4 px-6 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-700" /> Speak with B2B Sales
                </a>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-slate-900">
            <HelpCircle className="text-emerald-700" /> Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <summary className="list-none p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-800">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Institutional Lead Modal Popup */}
      <InstitutionalLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </div>
  );
}
