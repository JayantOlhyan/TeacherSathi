"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Check, ShieldCheck, ChevronDown, HelpCircle, Building2, Phone, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import InstitutionalLeadModal from "@/components/InstitutionalLeadModal";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [audience, setAudience] = useState<"teachers" | "schools">("teachers");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const plans = {
    free: {
      title: "Individual Educator / Starter",
      slug: "free",
      badge: "100% FREE FOREVER",
      priceMonthly: "₹0",
      priceYearly: "₹0",
      periodText: "forever",
      features: [
        "Full NCERT Class 6–10 Syllabus Access",
        "Up to 3 Teacher Accounts",
        "Up to 60 Enrolled Students & 2 Classes",
        "100 AI Generations / month",
        "1 Smartboard Kiosk Connection",
        "Bilingual Hindi & English Devanagari Notes",
        "Works on Low-Bandwidth 2G/3G Connectivity",
      ],
    },
    school: {
      title: "School Standard",
      slug: "school",
      badge: "SINGLE-SHIFT SCHOOLS",
      priceMonthly: "₹499",
      priceYearly: "₹4,999",
      periodText: billingCycle === "yearly" ? "/ year" : "/ month",
      features: [
        "Up to 15 Teacher Accounts",
        "Up to 350 Students & 10 Classes",
        "500 AI Generations / month",
        "5 Registered Smartboard Displays",
        "Chapter Test & Exam Paper Authoring",
        "Full Concept Mastery Analytics Matrix",
        "Print-ready PDF & PPTX Exports",
        "Bilingual Class Reports",
      ],
    },
    schoolPro: {
      title: "School Pro",
      slug: "school-pro",
      badge: "MOST POPULAR",
      popular: true,
      priceMonthly: "₹999",
      priceYearly: "₹9,999",
      periodText: billingCycle === "yearly" ? "/ year" : "/ month",
      features: [
        "Up to 50 Teacher Accounts",
        "Up to 1,200 Students & 35 Classes",
        "2,000 AI Generations / month",
        "15 Smartboard Displays with Remote Control",
        "Advanced CBSE Blueprints & Diagnostic Reports",
        "1-Click AI 15-Minute Remediation Plans",
        "Priority WhatsApp & Phone Support",
        "Custom School Header on Worksheets",
      ],
    },
    enterprise: {
      title: "Institutional Enterprise",
      slug: "enterprise",
      badge: "KVS / DISTRICT SCALE",
      priceMonthly: "Custom",
      priceYearly: "₹29,999",
      periodText: "/ year (cluster)",
      features: [
        "Up to 250 Teachers & 10,000 Students",
        "200 Classes & 100 Smartboard Displays",
        "10,000 AI Generations / month",
        "Multi-School District Admin Console",
        "Dedicated Account Specialist & On-site Training",
        "Custom State Board Syllabus Ingestion",
        "DPDP Act 2023 Compliance Audits",
      ],
    },
  };

  const faqs = [
    {
      q: "Is TeacherSathi really 100% free for individual teachers?",
      a: "Yes! TeacherSathi is 100% free forever for individual Indian educators and starter school deployments with zero credit card required.",
    },
    {
      q: "What is covered under the 30-Day Satisfaction Guarantee?",
      a: "For all paid school plans, if TeacherSathi does not save your educators 10+ hours weekly within 30 days, we issue an immediate 100% refund with no questions asked.",
    },
    {
      q: "Can school management purchase bulk licenses via invoice?",
      a: "Yes! We issue official tax invoices (GST compliant) and accept school cheque, NEFT/RTGS, and Razorpay UPI / Card payments.",
    },
    {
      q: "Does TeacherSathi work on 75-inch smartboards without high-speed internet?",
      a: "Yes! All slide decks, mind maps, and worksheets can be exported to PDF and PPTX formats for offline smartboard projection, and the system is tested on 2G/3G connections.",
    },
  ];

  const handleSelectPlan = async (planSlug: string) => {
    if (planSlug === "free") {
      router.push("/signup");
      return;
    }

    if (planSlug === "enterprise") {
      setIsLeadModalOpen(true);
      return;
    }

    setLoadingPlan(planSlug);
    setCheckoutMessage(null);

    try {
      // Check active subscription status from API
      const subRes = await fetch("/api/billing/subscription");
      if (subRes.status === 401) {
        // Not logged in -> route to signup with plan intent
        router.push(`/signup?plan=${planSlug}`);
        return;
      }

      const subData = await subRes.json();
      const schoolId = subData.data?.subscription?.school_id;

      if (!schoolId) {
        router.push(`/dashboard/admin/billing?plan=${planSlug}`);
        return;
      }

      // Initiate checkout session
      const checkoutRes = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          billingInterval: billingCycle === "yearly" ? "YEARLY" : "MONTHLY",
          schoolId,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || "Failed to initiate checkout");
      }

      const { orderId, amount, keyId } = checkoutData.data;

      // Check if Razorpay script is loaded on window
      const win = window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } };

      if (win.Razorpay && keyId && !keyId.includes("test_public_key")) {
        const rzp = new win.Razorpay({
          key: keyId,
          amount,
          currency: "INR",
          name: "TeacherSathi",
          description: `Subscription: ${planSlug}`,
          order_id: orderId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            const verifyRes = await fetch("/api/billing/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                schoolId,
                planSlug,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              setCheckoutMessage("Payment verified successfully! Redirecting to billing hub...");
              setTimeout(() => router.push("/dashboard/admin/billing"), 1500);
            } else {
              setCheckoutMessage("Payment verification failed. Please contact support.");
            }
          },
        });
        rzp.open();
      } else {
        // Test / Development mode: instant verification simulation
        const verifyRes = await fetch("/api/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schoolId,
            planSlug,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_order_id: orderId,
            razorpay_signature: "mock_verified_signature",
          }),
        });

        if (verifyRes.ok) {
          setCheckoutMessage("Subscription activated! Redirecting to billing hub...");
          setTimeout(() => router.push("/dashboard/admin/billing"), 1200);
        } else {
          setCheckoutMessage("Failed to activate test subscription.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error initializing checkout";
      setCheckoutMessage(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream bg-[radial-gradient(#C3CFBC_1px,transparent_1px)] [background-size:16px_16px] font-sans pb-20">
      <main className="w-full max-w-6xl mx-auto pt-[clamp(2rem,6vw,4rem)] px-[clamp(1rem,4vw,2rem)]">
        {/* Header Title */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Transparent Pricing &bull; 100% Satisfaction Guarantee
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Simple, Honest Plans for Schools &amp; Educators
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            100% Free forever for individual teachers. Transparent, GST-compliant annual subscriptions for schools, principal buyers, and KVS clusters.
          </p>

          {/* Billing Cycle & Audience Toggles */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="inline-flex bg-white rounded-full p-1 border border-line shadow-sm" role="tablist">
              <button
                onClick={() => setAudience("teachers")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  audience === "teachers" ? "bg-[#14532D] text-white shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Individual Teachers 📚
              </button>
              <button
                onClick={() => setAudience("schools")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  audience === "schools" ? "bg-[#14532D] text-white shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                School Management / B2B 🏫
              </button>
            </div>

            <div className="inline-flex bg-slate-100 rounded-full p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  billingCycle === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Annual (Save 20%) 🌟
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {checkoutMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-center font-bold text-sm animate-fadeIn">
            {checkoutMessage}
          </div>
        )}

        {/* 30-Day Money Back Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-10 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
              🛡️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">30-Day 100% Money-Back Satisfaction Guarantee</h3>
              <p className="text-xs text-slate-600">
                If TeacherSathi doesn&apos;t save your educators 10+ hours weekly, receive an instant 100% refund.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full shrink-0 border border-amber-300">
            Zero Risk Guarantee
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* 1. Free Plan */}
          <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-7 relative shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {plans.free.badge}
              </span>
              <h2 className="text-2xl font-black text-slate-900">{plans.free.title}</h2>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                ₹0 <span className="text-xs font-bold text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-2.5 pt-2">
                {plans.free.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-xs font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/signup" className="block pt-4">
              <Button className="w-full py-3.5 rounded-2xl bg-[#14532D] hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md">
                Get Started 100% Free
              </Button>
            </Link>
          </div>

          {/* 2. School Standard */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-7 relative shadow-md flex flex-col justify-between space-y-6 hover:border-emerald-500 transition-all">
            <div className="space-y-4">
              <span className="inline-block bg-blue-100 text-blue-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {plans.school.badge}
              </span>
              <h2 className="text-2xl font-black text-slate-900">{plans.school.title}</h2>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                {billingCycle === "yearly" ? plans.school.priceYearly : plans.school.priceMonthly}{" "}
                <span className="text-xs font-bold text-slate-500">{plans.school.periodText}</span>
              </div>
              <ul className="space-y-2.5 pt-2">
                {plans.school.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-xs font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => handleSelectPlan("school")}
                disabled={loadingPlan === "school"}
                className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                {loadingPlan === "school" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Subscribe Standard</span>
              </Button>
            </div>
          </div>

          {/* 3. School Pro (Popular) */}
          <div className="bg-[#123524] text-white rounded-3xl p-7 relative shadow-2xl flex flex-col justify-between space-y-6 border-2 border-amber-400">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {plans.schoolPro.badge}
            </div>

            <div className="space-y-4 pt-2">
              <h2 className="text-2xl font-black text-white">{plans.schoolPro.title}</h2>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {billingCycle === "yearly" ? plans.schoolPro.priceYearly : plans.schoolPro.priceMonthly}{" "}
                <span className="text-xs font-normal text-emerald-200">{plans.schoolPro.periodText}</span>
              </div>
              <ul className="space-y-2.5 pt-2">
                {plans.schoolPro.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-emerald-100 text-xs font-medium">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => handleSelectPlan("school-pro")}
                disabled={loadingPlan === "school-pro"}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2"
              >
                {loadingPlan === "school-pro" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Upgrade to School Pro</span>
              </Button>
            </div>
          </div>
        </div>

        {/* B2B Institutional Enterprise Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white border-2 border-emerald-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {plans.enterprise.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{plans.enterprise.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black text-slate-900">{plans.enterprise.priceYearly}</div>
                <span className="text-xs font-bold text-slate-500">{plans.enterprise.periodText}</span>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plans.enterprise.features.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-slate-700 text-xs font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
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
                <span>Request KVS &amp; District Proposal</span>
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

        {/* FAQs */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-slate-900 font-serif">
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
      <InstitutionalLeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </div>
  );
}
