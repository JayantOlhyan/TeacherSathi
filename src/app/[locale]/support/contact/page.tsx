"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Phone, Check, ArrowLeft, MessageSquare } from "lucide-react";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

export default function ContactSupportPage() {
  const locale = useLocale();
  const isHi = locale.startsWith("hi");

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = {
    en: {
      title: "Contact Support",
      subtitle: "Got a question about TeacherSathi AI lesson plans, NCERT quizzes, or need help with your school educator account? Send our support team a message.",
      backToHelp: "Back to Help Center",
      labelName: "Full Name",
      labelEmail: "Email Address",
      labelCategory: "How can we help you?",
      labelMessage: "Describe your issue or request",
      placeholderName: "Enter full name",
      placeholderEmail: "Enter email address",
      placeholderMessage: "Type your query details here...",
      submitBtn: "Send Message",
      successTitle: "Message Sent Successfully!",
      successDesc: "Thank you for contacting TeacherSathi. We have received your query and will respond shortly.",
      categories: [
        { value: "general", label: "General Inquiry" },
        { value: "technical", label: "Technical Bug / Issue" },
        { value: "billing", label: "Billing & Subscriptions" },
        { value: "feature", label: "Feature Request" }
      ],
      directContacts: "Direct Contacts",
      emailUs: "Email support directly",
      callUs: "Call support hotline"
    },
    hi: {
      title: "सहायता से संपर्क करें",
      subtitle: "कोई प्रश्न है या तकनीकी समस्या आ रही है? हमें एक संदेश भेजें और हमारी सहायता टीम 24 घंटे के भीतर आपसे संपर्क करेगी।",
      backToHelp: "सहायता केंद्र पर वापस जाएं",
      labelName: "पूरा नाम",
      labelEmail: "ईमेल पता",
      labelCategory: "हम आपकी क्या सहायता कर सकते हैं?",
      labelMessage: "अपनी समस्या या अनुरोध का वर्णन करें",
      placeholderName: "पूरा नाम दर्ज करें",
      placeholderEmail: "ईमेल पता दर्ज करें",
      placeholderMessage: "अपने प्रश्न का विवरण यहाँ लिखें...",
      submitBtn: "संदेश भेजें",
      successTitle: "संदेश सफलतापूर्वक भेजा गया!",
      successDesc: "TeacherSathi से संपर्क करने के लिए धन्यवाद। हमें आपका प्रश्न प्राप्त हो गया है और हम जल्द ही उत्तर देंगे।",
      categories: [
        { value: "general", label: "सामान्य पूछताछ" },
        { value: "technical", label: "तकनीकी समस्या / बग" },
        { value: "billing", label: "बिलिंग और सदस्यता" },
        { value: "feature", label: "सुविधा का अनुरोध (Feature Request)" }
      ],
      directContacts: "सीधे संपर्क करें",
      emailUs: "सीधे ईमेल सहायता",
      callUs: "सहायता हॉटलाइन कॉल करें"
    }
  };

  const currentT = isHi ? t.hi : t.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setCategory("general");
      setMessage("");
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans py-16 px-6 sm:px-12 transition-colors duration-200">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/support" 
          className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-light transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {currentT.backToHelp}
        </Link>

        {/* Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-3 bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            
            {/* Success Overlay */}
            {isSubmitted && (
              <div className="absolute inset-0 bg-[#0A2A17] text-white flex flex-col items-center justify-center p-8 text-center z-10 animate-fadeIn">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-extrabold mb-2">{currentT.successTitle}</h3>
                <p className="text-sm text-white/70 max-w-sm leading-relaxed">{currentT.successDesc}</p>
              </div>
            )}

            <h1 className="text-3xl font-extrabold text-brand tracking-tight mb-2">{currentT.title}</h1>
            <p className="text-sm text-ink-3 leading-relaxed mb-6">{currentT.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{currentT.labelName}</label>
                <input 
                  type="text" 
                  required
                  placeholder={currentT.placeholderName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{currentT.labelEmail}</label>
                <input 
                  type="email" 
                  required
                  placeholder={currentT.placeholderEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{currentT.labelCategory}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold bg-white transition-all cursor-pointer"
                >
                  {currentT.categories.map((cat, idx) => (
                    <option key={idx} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{currentT.labelMessage}</label>
                <textarea 
                  required
                  rows={5}
                  placeholder={currentT.placeholderMessage}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-cta-hover text-white py-4 rounded-xl font-bold transition-all shadow-sm active:scale-98 cursor-pointer text-sm"
              >
                {currentT.submitBtn}
              </button>
            </form>
          </div>

          {/* Contact Details Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Direct Cards */}
            <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-ink border-b border-line/60 pb-3">{currentT.directContacts}</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-ink-3 uppercase tracking-wider">{currentT.emailUs}</p>
                    <a href="mailto:khelclan@gmail.com" className="text-sm font-semibold text-brand hover:underline block">
                      khelclan@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-ink-3 uppercase tracking-wider">{currentT.callUs}</p>
                    <a href="tel:+919667344125" className="text-sm font-semibold text-brand hover:underline block">
                      +91 96673 44125
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Helper Box */}
            <div className="bg-brand text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Saathi Genie</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Did you know? You can ask Saathi Genie inside your dashboard workspace for immediate planning tips, curriculum assistance, and clicking pair solutions without waiting for email support.
              </p>
              <Link
                href="/dashboard"
                className="inline-block text-xs font-bold text-emerald-300 hover:text-emerald-200 hover:underline pt-1"
              >
                Go to Dashboard workspace &rarr;
              </Link>
            </div>

          </div>

        </div>

        <EducatorFAQAccordion />
      </div>
    </div>
  );
}
