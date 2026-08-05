"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

import { Mail, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const t = useTranslations("Signup");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [authMethod, setAuthMethod] = useState<"email" | "otp">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (!supabase) {
      alert("Supabase client is not initialized.");
      return;
    }
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      console.error("Google signup error:", error.message);
      alert(error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!supabase) {
      alert("Supabase client is not initialized.");
      return;
    }
    setIsOtpLoading(true);
    setOtpError(null);
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        channel: "whatsapp",
      },
    });
    setIsOtpLoading(false);
    if (error) {
      setOtpError(error.message);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setOtpError("Please enter the 6-digit OTP code.");
      return;
    }
    if (!supabase) return;
    setIsOtpLoading(true);
    setOtpError(null);
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otpCode,
      type: "sms",
    });
    setIsOtpLoading(false);
    if (error) {
      setOtpError(error.message);
    } else if (data.session) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9F9F4]">
      <div className="flex-1 flex">
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-16">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-[#4A3B2C] font-bold">
              {t('heading')} – Create Educator Account
            </h1>
            <p className="text-xs text-ink-3 mt-1 leading-relaxed">
              Create your free TeacherSathi account today to unlock instant AI lesson plans, interactive NCERT quizzes, and teaching videos for Indian government schools.
            </p>
          </div>

          {/* Role selector */}
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

          {/* Auth Method Selector (Email vs WhatsApp/Mobile OTP) */}
          <div className="flex justify-center border-b border-gray-200 pb-2 gap-4 text-xs font-bold">
            <button
              onClick={() => { setAuthMethod("email"); setOtpError(null); }}
              className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
                authMethod === "email"
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email & Password
            </button>
            <button
              onClick={() => { setAuthMethod("otp"); setOtpError(null); }}
              className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
                authMethod === "otp"
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp / Mobile OTP
            </button>
          </div>

          {otpError && (
            <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium">
              {otpError}
            </div>
          )}

          {/* Email Form */}
          {authMethod === "email" ? (
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t('name_placeholder')}
                  required
                  minLength={2}
                  className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder={t('email_placeholder')}
                  required
                  className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
                />
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('password_placeholder')}
                    required
                    minLength={8}
                    className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-ink-3 mt-1.5 ml-1">{t('password_hint')}</p>
              </div>
              <Button className="w-full min-h-[44px] bg-[#16A34A] hover:bg-cta-hover text-white py-4 rounded-lg text-lg font-bold shadow-brand">
                {t('create_account')}
              </Button>
            </form>
          ) : (
            /* WhatsApp / Mobile OTP Form */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number (India)
                    </label>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-3 rounded-lg border border-line bg-gray-100 text-gray-700 text-sm font-bold">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        required
                        maxLength={10}
                        className="flex-1 min-h-[44px] px-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isOtpLoading}
                    className="w-full min-h-[44px] bg-[#16A34A] hover:bg-cta-hover text-white py-4 rounded-lg text-base font-bold shadow-brand flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {isOtpLoading ? "Sending OTP..." : "Get OTP on WhatsApp / SMS"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-xs text-gray-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    OTP sent to <span className="font-bold text-emerald-800">+91 {phone}</span> via WhatsApp/SMS.
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                      className="w-full min-h-[44px] px-4 py-3 text-center text-xl tracking-widest font-mono rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-bold"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isOtpLoading}
                    className="w-full min-h-[44px] bg-[#16A34A] hover:bg-cta-hover text-white py-4 rounded-lg text-base font-bold shadow-brand"
                  >
                    {isOtpLoading ? "Verifying..." : "Verify & Create Account"}
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-brand hover:underline font-semibold"
                    >
                      Change Number / Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

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
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full bg-white border-gray-200 hover:bg-gray-50 py-6 rounded-lg text-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={24}
              height={24}
            />
            {isGoogleLoading ? "Connecting to Google..." : t('google_signup')}
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

      <EducatorFAQAccordion />
    </div>
  );
}
