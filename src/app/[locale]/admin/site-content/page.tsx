"use client";

import { useState, useEffect } from "react";
import { 
  HelpCircle, Save, Plus, Trash2, CheckCircle2, RotateCw, Globe, Phone, Mail
} from "lucide-react";
import { adminStore } from "@/lib/adminStore";

export default function AdminSiteContentPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const content = adminStore.getSiteContent();
    setHeroTitle(content.homepage_hero_title);
    setHeroSubtitle(content.homepage_hero_subtitle);
    setSupportEmail(content.support_email);
    setSupportPhone(content.support_phone);
    setFaqs(content.faq_list || []);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updated = {
      homepage_hero_title: heroTitle,
      homepage_hero_subtitle: heroSubtitle,
      support_email: supportEmail,
      support_phone: supportPhone,
      faq_list: faqs
    };

    adminStore.saveSiteContent(updated);
    setIsSaving(false);
    showFeedback("Homepage copy and support FAQs updated.");
    loadData();
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: "New Question?", a: "New Answer context..." }]);
  };

  const handleUpdateFaq = (index: number, field: "q" | "a", val: string) => {
    const updated = [...faqs];
    updated[index][field] = val;
    setFaqs(updated);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Global Site Copywriting</h2>
          <p className="text-xs text-slate-400 mt-1">
            Modify text strings across static homepages, FAQ questions, and contact cards instantly.
          </p>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {feedback}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Homepage Hero Panel */}
          <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-850 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Homepage Hero Copy
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Headline Header</label>
              <input 
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Subtitle Description Paragraph</label>
              <textarea 
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* FAQ List Panel */}
          <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Dynamic FAQ Register
              </h3>
              <button 
                type="button"
                onClick={handleAddFaq}
                className="text-[9px] font-bold text-emerald-405 hover:text-emerald-350 uppercase tracking-wider flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ Card
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-3 relative group">
                  <button 
                    type="button"
                    onClick={() => handleDeleteFaq(idx)}
                    className="absolute top-4 right-4 p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="pr-8">
                    <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Question Title</label>
                    <input 
                      type="text"
                      required
                      value={faq.q}
                      onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800/60 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Answer Description</label>
                    <textarea 
                      rows={2}
                      required
                      value={faq.a}
                      onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800/60 rounded-lg p-2 text-xs text-slate-350 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
              {faqs.length === 0 && (
                <p className="text-center py-4 text-slate-500 italic text-xs">No FAQs defined.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right configuration settings panel */}
        <div className="space-y-6">
          {/* Support Info Panel */}
          <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-850">
              Support Info
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Primary Email address
              </label>
              <input 
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Contact Number
              </label>
              <input 
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Submit action panel */}
          <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-3">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-650 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all bg-emerald-600 border border-emerald-500 shadow-md"
            >
              {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publish Copy Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
