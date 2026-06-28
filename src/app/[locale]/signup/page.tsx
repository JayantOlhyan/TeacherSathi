"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const t = useTranslations("Signup");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex font-sans bg-[#F9F9F4]">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 relative bg-[#E1A140] flex-col justify-end p-12 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop"
            alt="Classroom"
            fill
            className="object-cover mix-blend-multiply opacity-80"
          />
        </div>
        <div className="absolute top-8 left-8 flex items-center gap-2 text-white z-10 font-bold text-xl">
          <GraduationCap className="w-8 h-8" />
          TeacherSathi
        </div>
        <div className="relative z-10 max-w-md mx-auto text-center mt-auto">
          <p className="text-white font-medium text-2xl leading-relaxed tracking-wide italic font-serif">
            &apos;Built for my mother, <br /> a government school teacher&apos;
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-[#4A3B2C] font-bold">
              {t('heading')} – Create Educator Account
            </h1>
            <p className="text-xs text-ink-3 mt-1 leading-relaxed">
              Create your free TeacherSathi account today to unlock instant AI lesson plans, interactive NCERT quizzes, and teaching videos for Indian government schools.
            </p>
          </div>

          <div className="flex bg-white rounded-full p-1 border border-line shadow-sm">
            <button
              onClick={() => setRole("teacher")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${role === "teacher" ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink"}`}
              role="tab"
              aria-selected={role === "teacher"}
            >
              {t('role_teacher')}
            </button>
            <button
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${role === "student" ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink"}`}
              role="tab"
              aria-selected={role === "student"}
            >
              {t('role_student')}
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder={t('name_placeholder')}
                required
                minLength={2}
                className="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder={t('email_placeholder')}
                required
                className="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
              />
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('password_placeholder')}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-ink-3 mt-1.5 ml-1">{t('password_hint')}</p>
            </div>
            <Button className="w-full bg-[#16A34A] hover:bg-cta-hover text-white py-6 rounded-lg text-lg font-bold shadow-brand">
              {t('create_account')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F9F9F4] text-gray-500">{t('or')}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-white border-gray-200 hover:bg-gray-50 py-6 rounded-lg text-lg flex items-center justify-center gap-3"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={24}
              height={24}
            />
            {t('google_signup')}
          </Button>

          <p className="text-center text-sm text-ink-3">
            {t('has_account')}{" "}
            <Link href="/login" className="text-brand font-semibold hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
