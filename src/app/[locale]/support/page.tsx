"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SEOAuthorityLinks from "@/components/SEOAuthorityLinks";
import { 
  Search, Mail, Phone, User, FileText, BookOpen, Layout, 
  Users, BarChart, Monitor, Play, CheckSquare, Sparkles, 
  ChevronDown, ChevronUp, Check, X 
} from "lucide-react";

export default function SupportPage() {
  const t = useTranslations("Support");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sitemapCategories = [
    {
      id: "platform",
      title: t("categories.platform"),
      items: [
        { name: "Home Landing Page", path: "/", icon: BookOpen, desc: "Product overview, main features, and mission statement." },
        { name: "Features Section", path: "/#features", icon: Sparkles, desc: "Detailed breakdown of TeacherSathi AI features." },
        { name: "Pricing Plans", path: "/pricing", icon: Sparkles, desc: "Premium plans for teachers and educational institutions." },
        { name: "Teacher Sign In / Login", path: "/login", icon: User, desc: "Access your personalized workspace and saved classes." },
        { name: "Sign Up / Create Account", path: "/signup", icon: User, desc: "Join TeacherSathi and set up your profile." }
      ]
    },
    {
      id: "resources",
      title: t("categories.resources"),
      items: [
        { name: "AI Lesson Plans", path: "/resources/lesson-plans", icon: FileText, desc: "Generate NCERT-aligned lesson plans in seconds." },
        { name: "Worksheet & Quiz Generator", path: "/resources/quiz-generator", icon: FileText, desc: "Build diagnostic worksheets and live quizzes." },
        { name: "NCERT Solutions Pack", path: "/resources/ncert", icon: BookOpen, desc: "Access textbook answers and revision summaries." },
        { name: "Interactive Mind Maps", path: "/resources/mind-maps", icon: Sparkles, desc: "Visual flowcharts optimized for smart classroom screens." }
      ]
    },
    {
      id: "dashboard",
      title: t("categories.dashboard"),
      items: [
        { name: "Dashboard Workspace", path: "/dashboard", icon: Layout, desc: "Central hub for launching live classroom activities." },
        { name: "My Classes & Clickers", path: "/dashboard/classes", icon: Users, desc: "Register student clickers and manage student registries." },
        { name: "Performance Reports", path: "/dashboard/reports", icon: BarChart, desc: "Track classroom metrics, participation, and quiz scores." },
        { name: "Interactive Whiteboard", path: "/dashboard/whiteboard", icon: Monitor, desc: "Digital canvas for geometries, formulas, and diagrams." }
      ]
    },
    {
      id: "library",
      title: t("categories.library"),
      items: [
        { name: "Grade 10 Science Bookshelf", path: "/content/class-10", icon: BookOpen, desc: "Explore NCERT chapters and materials for Class 10 Science." },
        { name: "Immersive Video Player", path: "/content/class-10/science/reflection-refraction/video", icon: Play, desc: "Smart screen video player with timestamps and classroom mode." },
        { name: "Live MCQ Quiz Mode", path: "/content/class-10/science/reflection-refraction/quiz", icon: CheckSquare, desc: "Run instant assessments with paired clicker responses." }
      ]
    }
  ];

  const faqs = [
    { 
      q: "How do I pair student clickers?", 
      a: "Navigate to 'My Class' in the dashboard, click the 'Register Clickers' button, and have your students press any button on their clicker. They will pair instantly with the smart screen." 
    },
    { 
      q: "How do I present quizzes on a Smart Screen?", 
      a: "Select a chapter in the content library, open 'Quick MCQ Quiz', and click the 'Smart Screen Mode' toggle. The layout will adapt for large 75-inch smart displays." 
    },
    { 
      q: "Can I download NCERT solutions offline?", 
      a: "Yes! Every chapter hub page includes a green 'Download Full Pack' button which compiles the summary, solutions, and maps into a print-ready PDF." 
    },
    { 
      q: "How does the Saathi Genie Chat work?", 
      a: "Saathi Genie is your AI-powered teaching assistant. Click the 'Ask Saathi Genie' button in the dashboard to open a sidebar helper for planning tips or quick doubt resolution." 
    }
  ];

  // Filtering based on search query
  const filteredCategories = sitemapCategories.map(category => {
    const matchedItems = category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, items: matchedItems };
  }).filter(category => category.items.length > 0);

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans transition-colors duration-200 py-16 px-6 sm:px-12">
      <div className="max-w-[1250px] mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand tracking-tight leading-tight">{t("title")}</h1>
          <p className="text-ink-2 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">{t("subtitle")}</p>
          
          {/* Search Bar */}
          <div className="relative mt-8 max-w-lg mx-auto">
            <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-ink-3" />
            </span>
            <input 
              type="text" 
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-white border border-line rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand shadow-sm text-base font-medium transition-all placeholder:text-ink-4"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-ink-3 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Sitemap & Help Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Columns - Sitemap Directory */}
          <div className="lg:col-span-2 space-y-12">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <div key={category.id} className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand border-b border-line/60 pb-3">{category.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {category.items.map((item, idx) => (
                      <Link 
                        key={idx} 
                        href={item.path}
                        className="bg-white border border-line p-6 sm:p-7 rounded-2xl hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex gap-5 text-left group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-brand-tint border border-brand-tint-2 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-base sm:text-lg text-ink group-hover:text-brand transition-colors leading-snug">{item.name}</h3>
                          <p className="text-sm text-ink-3 leading-relaxed">{item.desc}</p>
                          <span className="inline-block text-xs font-semibold text-brand/80 tracking-wide mt-2 group-hover:underline">{item.path}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white border border-line rounded-2xl p-8 text-ink-3 shadow-sm">
                <p className="text-base font-semibold">{t("no_results")}</p>
              </div>
            )}
          </div>

          {/* Right Column - FAQs & Form */}
          <div className="space-y-10">
            
            {/* FAQs Accordion */}
            <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink border-b border-line/60 pb-3">FAQs</h2>
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className="border border-line rounded-xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => setActiveFaq(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-4 bg-brand-tint/20 hover:bg-brand-tint/40 text-left font-bold text-ink text-sm sm:text-base transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-brand" /> : <ChevronDown className="w-5 h-5 text-ink-3" />}
                        </button>
                        {isOpen && (
                          <div className="p-4 border-t border-line text-sm leading-relaxed text-ink-2 bg-white">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-ink-3 text-center py-6">{t("no_results")}</p>
              )}
            </div>

            {/* Support Form */}
            <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              
              {/* Success Overlay */}
              {isSubmitted && (
                <div className="absolute inset-0 bg-[#0A2A17] text-white flex flex-col items-center justify-center p-8 text-center z-10 animate-fadeIn">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-sm text-white/70">Thank you. We will get back to you within 24 hours.</p>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink">{t("contact_title")}</h2>
                <p className="text-sm text-ink-3 leading-relaxed">{t("contact_desc")}</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{t("contact_name")}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{t("contact_email")}</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">{t("contact_message")}</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe your issue or request..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand text-sm font-semibold transition-all"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#16A34A] hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold transition-all shadow-sm active:scale-98 cursor-pointer text-sm"
                >
                  {t("contact_submit")}
                </button>
              </form>
            </div>

            {/* Direct Contact Info */}
            <div className="bg-brand text-white border border-brand/10 rounded-2xl p-6 sm:p-8 shadow-sm text-sm space-y-4 leading-relaxed">
              <p className="font-bold uppercase tracking-wider text-xs text-white/50">Direct Contacts</p>
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:khelclan@gmail.com" className="font-medium">khelclan@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-emerald-400" />
                <a href="tel:+919667344125" className="font-medium">+91 96673 44125</a>
              </div>
            </div>

          </div>
        </div>

        <SEOAuthorityLinks />
      </div>
    </div>
  );
}
