"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Check, Lock, ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PricingPage() {
  const [audience, setAudience] = useState<"teachers" | "students">("teachers");

  const teacherPlans = {
    free: {
      title: "Teacher Basic",
      price: "0",
      features: ["5 AI Lesson Plans / month", "Basic Student Tracking", "NCERT Resource Access"],
      locked: ["Advanced Analytics", "Unlimited AI Quizzes", "Priority Support"]
    },
    pro: {
      title: "Teacher Pro",
      price: "4,999",
      monthlyPrice: "499",
      features: ["Unlimited AI Lesson Plans", "Full Class Analytics", "Unlimited AI Quizzes", "Custom Worksheet Generator", "Priority 24/7 Support"]
    }
  };

  const studentPlans = {
    free: {
      title: "Student Basic",
      price: "0",
      features: ["3 Practice Tests / month", "NCERT Chapter Summaries", "Basic Progress Tracking"],
      locked: ["Unlimited AI Tutoring", "Custom Mind Maps", "Performance Insights"]
    },
    pro: {
      title: "Student Pro",
      price: "1,999",
      monthlyPrice: "199",
      features: ["Unlimited Practice Tests", "AI Personal Tutor", "Dynamic Mind Maps", "Deep Performance Analytics", "Ad-free Experience"]
    }
  };

  const plans = audience === "teachers" ? teacherPlans : studentPlans;

  const faqs = [
    { q: "Can I cancel my Pro subscription anytime?", a: "Yes, you can cancel your subscription at any time from your account settings." },
    { q: "Does the Pro plan include all NCERT subjects?", a: "Yes, both Teacher and Student Pro plans cover all core NCERT subjects from Class 6 to 10." },
    { q: "How do I pay using UPI?", a: "We support all major UPI apps like GPay, PhonePe, and Paytm via our secure Razorpay integration." },
    { q: "Is there a discount for schools?", a: "Yes! For bulk licenses (10+ teachers), please contact our sales team for special pricing." }
  ];

  const handleGetStarted = () => {
    // Razorpay Integration Mock
    alert("Razorpay Checkout: This would open the payment gateway for " + plans.pro.title);
  };

  return (
    <div className="min-h-screen bg-cream bg-[radial-gradient(#C3CFBC_1px,transparent_1px)] [background-size:16px_16px] font-sans pb-20">
      <main className="max-w-4xl mx-auto pt-16 px-4">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111827]">
            Choose Your Plan / <span className="font-sans">अपनी योजना चुनें</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Explore affordable TeacherSathi pricing plans for Indian educators and students. Get unlimited AI lesson plans, NCERT mind maps, and practice test generators designed for CBSE schools.
          </p>
          
          <div className="inline-flex bg-white rounded-full p-1 border border-line shadow-sm" role="tablist">
            <button 
              onClick={() => setAudience("teachers")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${audience === "teachers" ? "bg-brand text-white shadow-md" : "text-ink-3 hover:text-ink"}`}
              role="tab"
              aria-selected={audience === "teachers"}
            >
              For Teachers
            </button>
            <button 
              onClick={() => setAudience("students")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${audience === "students" ? "bg-brand text-white shadow-md" : "text-ink-3 hover:text-ink"}`}
              role="tab"
              aria-selected={audience === "students"}
            >
              For Students
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16 relative">
          {/* Free Plan */}
          <div className="bg-[#FAF9F6] border-2 border-dashed border-line-strong rounded-2xl p-8 relative shadow-sm hover:border-brand/30 transition-colors">
            <div className="absolute top-4 right-4 border-2 border-[#16A34A] text-[#16A34A] font-extrabold px-3 py-1 rounded text-sm transform rotate-12 opacity-80">
              FREE
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{plans.free.title}</h2>
            <div className="text-5xl font-extrabold text-gray-900 mb-8">₹0 <span className="text-2xl font-bold">forever</span></div>
            
            <ul className="space-y-4 mb-8">
              {plans.free.features.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="bg-green-100 rounded-full p-1"><Check className="w-4 h-4 text-green-600" /></div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
              {plans.free.locked.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400">
                  <div className="bg-gray-100 rounded-full p-1"><Lock className="w-4 h-4 text-gray-400" /></div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block">
              <Button variant="outline" className="w-full py-6 rounded-xl border-gray-300 hover:bg-gray-50 font-bold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-brand rounded-2xl p-8 relative shadow-2xl text-white transform scale-105 z-10">
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-8 py-2 text-sm transform rotate-45 shadow-md">
              BEST VALUE
            </div>
            <h2 className="text-2xl font-bold mb-2">{plans.pro.title}</h2>
            <div className="text-white/80 text-sm mb-1">Monthly ₹{plans.pro.monthlyPrice} → <span className="line-through opacity-60">₹{parseInt(plans.pro.monthlyPrice.replace(',','')) * 12}/yr</span></div>
            <div className="text-5xl font-extrabold mb-8 flex items-baseline">
              ₹{plans.pro.price}<span className="text-2xl font-bold ml-1">/yr</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plans.pro.features.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <div className="bg-yellow-400 rounded-full p-1"><Check className="w-4 h-4 text-brand" /></div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleGetStarted}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
            >
              Go Pro Now
            </Button>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-ink">
            <HelpCircle className="text-brand" /> Frequently Asked Questions
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

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-500 font-medium">
            Razorpay Secured • UPI / Card / Net Banking • Cancel Anytime
          </div>
          <div className="flex justify-center gap-8 opacity-40">
             {/* Simple payment icons could go here */}
          </div>
        </div>
      </main>
    </div>
  );
}
