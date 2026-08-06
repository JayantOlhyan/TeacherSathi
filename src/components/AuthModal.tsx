"use client";

import { useState } from "react";
import { Eye, EyeOff, X, GraduationCap, Sparkles, Loader2, CheckCircle, Smartphone, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "whatsapp">("email");
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("science");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPhoneValid = phone.length >= 10;
  const isNameValid = name.trim().length >= 2;

  const handleSendOtp = () => {
    if (!isPhoneValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      localStorage.setItem("mock_authenticated", "true");
      
      const isCredentialAdmin = email.toLowerCase().includes("admin") || 
                                email.toLowerCase().includes("founder") || 
                                name.toLowerCase().includes("admin") || 
                                name.toLowerCase().includes("founder");
      
      if (isCredentialAdmin) {
        localStorage.setItem("is_admin_user", "true");
        localStorage.setItem("last_sathi_teacher_name", name || "Founder Admin");
      } else {
        localStorage.setItem("last_sathi_teacher_name", name || (phone ? `Teacher (${phone.slice(-4)})` : "Educator"));
      }

      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-[clamp(0.5rem,2vw,1rem)] animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-cream border border-line rounded-3xl shadow-lg flex flex-col md:flex-row relative min-h-[min(520px,90vh)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 border border-white/20 rounded-full transition-colors cursor-pointer text-ink hover:text-[#166534] md:text-white md:hover:text-emerald-400"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Mascot */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-[#14532D] to-[#0F3D21] flex-col justify-between p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10 flex items-center gap-2 font-black text-xl tracking-tight">
            <GraduationCap className="w-7 h-7 text-emerald-400" />
            <span>TeacherSathi AI</span>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-6 gap-4">
            <Image 
              src="/assets/owl-mascot.png" 
              alt="TeacherSathi Official Brand Mascot Logo" 
              width={192}
              height={192}
              className="w-44 h-auto object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.3)] animate-pulse-slow" 
            />
            <div className="text-center space-y-1">
              <span className="text-emerald-300 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 100% Free for Individual Teachers
              </span>
              <p className="text-xs text-white/80 font-medium">No credit card required &bull; Works on any 75&quot; smartboard</p>
            </div>
          </div>

          <div className="relative z-10 text-center border-t border-white/10 pt-4">
            <p className="text-emerald-100 font-medium text-xs leading-relaxed italic font-serif">
              &ldquo;Join 10,000+ Indian educators saving 10+ hours weekly in NCERT lesson planning.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 flex flex-col justify-center p-[clamp(1.5rem,4vw,2.5rem)] bg-white relative">
          
          {success && (
            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-[#EDF7EF] border border-[#AEDCBA] text-[#16A34A] rounded-2xl flex items-center justify-center text-2xl animate-bounce">
                🎉
              </div>
              <h3 className="text-xl font-extrabold text-[#166534]">
                {tab === "login" ? "Welcome Back!" : "Account Created!"}
              </h3>
              <p className="text-sm text-ink-3">Syncing session with TeacherSathi...</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                {tab === "login" ? "Welcome Back Teacher" : "Create Free Account"}
              </h2>
              <p className="text-xs text-emerald-800 font-bold">100% Free Forever for Individual Educators</p>
            </div>

            {/* Login / Signup Tabs */}
            <div className="flex bg-cream rounded-full p-1 border border-line shadow-sm">
              <button 
                onClick={() => setTab("login")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-bold transition-all cursor-pointer ${tab === "login" ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink"}`}
              >
                Login
              </button>
              <button 
                onClick={() => setTab("signup")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-bold transition-all cursor-pointer ${tab === "signup" ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink"}`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Method Selector (Email vs WhatsApp OTP) */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === "email"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700" /> Email Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("whatsapp")}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === "whatsapp"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp OTP ⚡
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === "signup" && (
                <div className="relative">
                  <input
                    type="text"
                    aria-label="Full Name"
                    placeholder="Full Name (e.g. Sunita Sharma)"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-semibold text-xs pr-10"
                  />
                  {isNameValid && (
                    <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              )}

              {authMethod === "email" ? (
                <>
                  <div className="relative">
                    <input
                      type="email"
                      aria-label="Teacher Email Address"
                      placeholder="Teacher Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-semibold text-xs pr-10"
                    />
                    {isEmailValid && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      aria-label="Password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-semibold text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-brand"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              ) : (
                /* WhatsApp OTP Mode */
                <div className="space-y-3">
                  <div className="relative">
                    <div className="flex rounded-xl border border-line overflow-hidden focus-within:ring-2 focus-within:ring-brand">
                      <span className="bg-slate-100 text-slate-700 px-3 py-2.5 text-xs font-bold flex items-center border-r border-line">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        placeholder="WhatsApp Mobile Number"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full px-3 py-2.5 bg-transparent text-ink font-semibold text-xs outline-none"
                      />
                    </div>
                    {isPhoneValid && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!isPhoneValid || loading}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send WhatsApp OTP 📲"}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter 4-Digit OTP"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-emerald-500 bg-emerald-50/50 text-center font-bold tracking-widest text-sm"
                      />
                      <p className="text-[10px] text-emerald-700 font-bold text-center">OTP sent to your WhatsApp number +91 {phone}</p>
                    </div>
                  )}
                </div>
              )}

              {tab === "signup" && (
                <div>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-white text-ink font-semibold text-xs cursor-pointer"
                  >
                    <option value="science">Primary Subject: Science 🔬</option>
                    <option value="mathematics">Primary Subject: Mathematics 📐</option>
                    <option value="social-science">Primary Subject: Social Science 🌍</option>
                    <option value="hindi">Primary Subject: Hindi ✍️</option>
                    <option value="english">Primary Subject: English 📚</option>
                  </select>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#16A34A] hover:bg-cta-hover text-white py-4 rounded-xl text-sm font-bold shadow-brand flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  tab === "login" ? "Login to TeacherSathi" : "Get Free Access Now 🚀"
                )}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2.5 bg-white text-ink-3 font-bold uppercase tracking-wider">or sign in with</span>
              </div>
            </div>

            {/* One-Tap Google OAuth Button */}
            <button 
              type="button"
              onClick={handleSubmit}
              className="w-full bg-white border border-line hover:bg-slate-50 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs cursor-pointer transition-colors"
            >
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Single Sign On Logo" width={16} height={16} />
              Continue with Google One-Tap
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-800 font-bold pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP Act 2023 Compliant &bull; Zero Spam Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
