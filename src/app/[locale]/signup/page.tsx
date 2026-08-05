"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import EducatorFAQAccordion from "@/components/EducatorFAQAccordion";

import { MessageSquare, QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const t = useTranslations("Signup");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [authMethod, setAuthMethod] = useState<"email" | "otp" | "qr">("otp");
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

          {/* 3-Way Auth Selector (Phone OTP, Google 1-Tap, 75" Smartboard QR) */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
              Choose Sign-In Method
            </p>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMethod("otp"); setOtpError(null); }}
                className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  authMethod === "otp"
                    ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Phone OTP</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="py-2.5 px-2 bg-white hover:bg-gray-50 text-gray-800 rounded-xl transition-all shadow-sm border border-gray-200 flex flex-col items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod("qr"); setOtpError(null); }}
                className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  authMethod === "qr"
                    ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>75&quot; QR Code</span>
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setAuthMethod(authMethod === "email" ? "otp" : "email"); setOtpError(null); }}
                className="text-xs text-brand hover:underline font-semibold"
              >
                {authMethod === "email" ? "← Switch to Phone / QR Signup" : "Or Create Account with Email & Password"}
              </button>
            </div>
          </div>

          {otpError && (
            <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium">
              {otpError}
            </div>
          )}

          {/* Option 1: WhatsApp / Mobile OTP Form */}
          {authMethod === "otp" && (
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

          {/* Option 2: Smartboard 75" QR Code Scan */}
          {authMethod === "qr" && (
            <div className="bg-emerald-50/60 border-2 border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold bg-amber-400 text-gray-950 px-2.5 py-0.5 rounded-full uppercase">
                  Classroom 75&quot; Smartboard QR
                </span>
                <h3 className="text-base font-extrabold text-gray-900">
                  Scan QR to Authenticate Board
                </h3>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 inline-block shadow-md">
                <QrCode className="w-40 h-40 text-gray-900 mx-auto" />
                <p className="text-[11px] font-mono text-emerald-800 font-bold mt-2">
                  Session Token: ts_qr_89412
                </p>
              </div>

              <p className="text-xs text-gray-600 font-medium">
                QR Code expires in 2 minutes. Open your phone camera to log in instantly.
              </p>

              <Link
                href="/classroom"
                className="inline-block bg-[#16A34A] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
              >
                Launch Fullscreen Smartboard Kiosk 📺
              </Link>
            </div>
          )}

          {/* Option 3: Email / Password Form */}
          {authMethod === "email" && (
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
          )}
          <p className="text-center text-sm text-ink-3 pt-2">
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
