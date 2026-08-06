"use client";

import AuthCard from "@/components/auth/AuthCard";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-cream bg-[radial-gradient(#C3CFBC_1px,transparent_1px)] [background-size:16px_16px] py-10 px-4">
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2 max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Free Educator Signup
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Create Your Educator Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Unlock instant NCERT AI lesson plans, 75-inch smartboard presentations, bilingual mind maps, and printable CBSE worksheets.
          </p>
        </div>

        <AuthCard initialTab="signup" />

        <div className="w-full max-w-3xl pt-6">
          <EducatorFAQAccordion />
        </div>
      </main>
    </div>
  );
}
