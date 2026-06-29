"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CheckSquare, FileText, Download, BarChart, BookOpen, GraduationCap, Sparkles, Wand2, Rocket, Heart, Monitor, Wifi, Clock } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations/FadeIn";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const t = useTranslations("Hero");
  const tNav = useTranslations("Nav");
  const tHiw = useTranslations("HowItWorks");
  const tMission = useTranslations("Mission");
  const tCta = useTranslations("CTA");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [lastView, setLastView] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const isMockAuth = localStorage.getItem("mock_authenticated") === "true";

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(isMockAuth);
        }
      });
    } else {
      setIsAuthenticated(isMockAuth);
    }

    const viewUrl = localStorage.getItem("last_sathi_view");
    const viewTitle = localStorage.getItem("last_sathi_view_title");
    if (viewUrl) {
      setLastView({
        url: viewUrl,
        title: viewTitle || "Last Activity"
      });
    }
  }, []);

  const features = [
    { title: "Lesson Planning", icon: FileText, desc: "Prepare comprehensive lessons in minutes." },
    { title: "Student Analytics", icon: BarChart, desc: "Detailed growth and performance tracking." },
    { title: "Interactive Quizzes", icon: CheckSquare, desc: "Engage students with AI-generated quizzes." },
    { title: "Smart Assessment", icon: BookOpen, desc: "Automated grading and personalized feedback." },
    { title: "Homework Management", icon: GraduationCap, desc: "Assign and track homework seamlessly." },
    { title: "Phonemic Awareness", icon: Sparkles, desc: "Specialized tools for early literacy." },
    { title: "NCERT Solutions", icon: BookOpen, desc: "Verified solutions for all chapters." },
    { title: "Resource Library", icon: Download, desc: "Access curated teaching materials." },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-cream text-ink overflow-hidden transition-colors duration-200 relative">

      {/* Modern Premium Background Glow Orb */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-400/10 to-teal-400/5 rounded-full blur-3xl pointer-events-none z-0" />

      <main className="flex-1 flex flex-col items-center w-full relative z-10">
        {/* Hero Section */}
        <section className="w-full py-20 px-4 sm:px-12 max-w-[1200px] mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8 flex flex-col items-center">
            <FadeIn delay={0}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-balance leading-tight text-slate-900 font-serif">
                Teachers ka Superpower.
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 font-sans font-extrabold pb-2">
                  NCERT-Aligned AI Content
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-500/80 block mt-2 font-sans">— Instantly.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-medium">
                {t('subtitle')}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4 pt-2 justify-center min-h-[60px]">
                {isAuthenticated === null ? (
                  // Simple loading skeleton to avoid content jumps
                  <div className="h-12 w-48 bg-brand/10 animate-pulse rounded-xl" />
                ) : isAuthenticated ? (
                  <>
                    <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-8 py-6 rounded-2xl text-lg font-extrabold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-150 flex items-center gap-2 group border-0 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        {t('cta_dashboard')} <Rocket className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/90 border-2 border-emerald-500/10 hover:border-emerald-500/30 text-emerald-800 px-8 py-6 rounded-2xl text-lg font-bold shadow-sm active:scale-95 transition-all duration-150 max-w-xs truncate flex items-center gap-2 cursor-pointer">
                      <Link href={lastView ? lastView.url : "/content/class-10"} className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
                        <span className="truncate">{lastView ? `${t('cta_resume_activity')}: ${lastView.title}` : tNav('content_library')}</span>
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
                      className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-8 py-6 rounded-2xl text-lg font-extrabold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-150 flex items-center gap-2 group cursor-pointer border-0"
                    >
                      {t('cta_primary')} <Sparkles className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                    </Button>
                    <Button asChild variant="outline" className="bg-white/90 border-2 border-emerald-500/10 hover:border-emerald-500/30 text-emerald-800 px-8 py-6 rounded-2xl text-lg font-bold shadow-sm active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer">
                      <Link href="/#how-it-works" className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-emerald-700 animate-pulse" />
                        {t('cta_secondary')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </FadeIn>
 
            {/* Trust Badges */}
            <FadeIn delay={0.45}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm text-ink-3/70">
                <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-brand" /> 75-inch Smart Screen Ready</span>
                <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4 text-emerald-600" /> No Hardware Required</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-cyan-600" /> NCERT Class 6-10</span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Yellow Banner Strip */}
        <div className="w-full bg-[#FBBF24] py-3 overflow-hidden flex whitespace-nowrap border-y border-brand/5 shadow-sm">
          <div className="animate-marquee flex gap-8 items-center text-black font-extrabold text-2xl tracking-wide">
            <span>✦ Class 6 Science</span>
            <span>✦ Class 7 Maths</span>
            <span>✦ Class 8 Social Science</span>
            <span>✦ Class 9 English</span>
            <span>✦ Class 10 Hindi</span>
            <span>✦ Class 6 Science</span>
            <span>✦ Class 7 Maths</span>
            <span>✦ Class 8 Social Science</span>
            <span>✦ Class 9 English</span>
            <span>✦ Class 10 Hindi</span>
          </div>
        </div>

        {/* Feature Grid Section */}
        <section id="features" className="w-full py-16 px-4 sm:px-8 max-w-[1200px] mx-auto">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
            {features.map((feature, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white border border-line rounded-2xl p-6 flex items-start gap-4 hover:shadow-card hover:-translate-y-1 transition-all duration-200 h-full">
                  <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base mb-1 text-ink">{feature.title}</h2>
                    <p className="text-xs text-ink-3 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 px-4 sm:px-8 max-w-[1200px] mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-ink">
              {tHiw('title')}
            </h2>
            <p className="text-ink-3 max-w-xl mx-auto">{tHiw('subtitle')}</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: BookOpen,
                color: "bg-[#258088]",
                titleKey: "step1_title" as const,
                descKey: "step1_desc" as const,
              },
              {
                step: "02",
                icon: Wand2,
                color: "bg-[#D95B2A]",
                titleKey: "step2_title" as const,
                descKey: "step2_desc" as const,
              },
              {
                step: "03",
                icon: Rocket,
                color: "bg-[#16A34A]",
                titleKey: "step3_title" as const,
                descKey: "step3_desc" as const,
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-white border border-line rounded-2xl p-8 text-center group hover:shadow-card hover:-translate-y-1 transition-all duration-200">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="bg-brand-tint border border-brand-tint-2 text-brand text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                    STEP {item.step}
                  </div>
                </div>
                <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mt-4 mb-5 shadow-sm`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-ink">{tHiw(item.titleKey)}</h3>
                <p className="text-ink-3 text-sm leading-relaxed">{tHiw(item.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="w-full py-20 px-4 sm:px-8">
          <FadeIn className="max-w-[1000px] mx-auto">
            <div className="relative bg-gradient-to-br from-[#E1A140] to-[#D97706] rounded-3xl p-10 sm:p-14 overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-6 h-6 text-white fill-white" />
                  <span className="text-white/90 font-semibold uppercase tracking-wider text-sm">{tMission('label')}</span>
                </div>
                <blockquote className="text-white text-2xl sm:text-3xl font-bold leading-relaxed mb-6 italic">
                  &ldquo;{tMission('quote')}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-extrabold text-lg">J</div>
                  <div>
                    <p className="text-white font-bold">{tMission('founder_name')}</p>
                    <p className="text-white/70 text-sm">{tMission('founder_role')}</p>
                  </div>
                </div>
                <p className="text-white/80 mt-6 leading-relaxed max-w-2xl text-sm sm:text-base">
                  {tMission('description')}
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Join Now CTA */}
        <section className="w-full max-w-[1200px] mx-auto px-4 mb-16">
          <div className="bg-brand rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brand">
            <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl text-center md:text-left text-white leading-snug">
              {tCta('heading')}
            </h2>
            {isAuthenticated ? (
              <Button asChild className="bg-[#FBBF24] text-black hover:bg-[#F59E0B] rounded-xl px-10 py-6 text-xl font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Link href="/dashboard">
                  {t('cta_dashboard')}
                </Link>
              </Button>
            ) : (
              <Button 
                onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
                className="bg-[#FBBF24] text-black hover:bg-[#F59E0B] rounded-xl px-10 py-6 text-xl font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {tCta('button')}
              </Button>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
