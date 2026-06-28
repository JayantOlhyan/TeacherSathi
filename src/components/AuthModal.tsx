"use client";

import { useState } from "react";
import { Eye, EyeOff, X, GraduationCap, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock successful authentication flow
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-cream border border-line rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row relative min-h-[500px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 border border-white/20 rounded-full transition-colors cursor-pointer text-ink hover:text-[#166534] md:text-white md:hover:text-emerald-400"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand & Mascot Illustration (Using local file asset) */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-[#E1A140] to-[#D97706] flex-col justify-between p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2 font-black text-xl tracking-tight">
            <GraduationCap className="w-7 h-7 text-white" />
            <span>TeacherSathi</span>
          </div>

          {/* Local File Asset (Mascot) */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-6 gap-4">
            <Image 
              src="/assets/owl-mascot.png" 
              alt="TeacherSathi Official Brand Mascot Logo representing AI teaching assistance for Indian educators" 
              width={192}
              height={192}
              className="w-48 h-auto object-contain drop-shadow-[0_20px_24px_rgba(28,43,28,0.25)] animate-pulse-slow" 
            />
            <p className="text-white/90 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" /> Aapka Teaching Companion
            </p>
          </div>

          {/* Quote */}
          <div className="relative z-10 text-center">
            <p className="text-white font-medium text-lg leading-relaxed italic font-serif max-w-xs mx-auto">
              &ldquo;Built for my mother, a government school teacher&rdquo;
            </p>
          </div>
        </div>

        {/* Right Side: Form (Login/Signup switchable) */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 bg-white relative">
          
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

          <div className="space-y-6">
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-3xl font-extrabold text-ink leading-tight">
                {tab === "login" ? (
                  <>
                    
                    Welcome back
                  </>
                ) : (
                  <>
                    
                    Create an account
                  </>
                )}
              </h2>
            </div>

            {/* Form Type Tabs */}
            <div className="flex bg-cream rounded-full p-1 border border-line shadow-sm">
              <button 
                onClick={() => setTab("login")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-all cursor-pointer ${tab === "login" ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink"}`}
              >
                Login
              </button>
              <button 
                onClick={() => setTab("signup")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-all cursor-pointer ${tab === "signup" ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink"}`}
              >
                Sign Up
              </button>
            </div>

            {/* Role Switcher */}
            <div className="flex bg-cream/60 rounded-xl p-1 border border-line/50">
              <button 
                onClick={() => setRole("teacher")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${role === "teacher" ? "bg-white text-brand border border-line" : "text-ink-3 hover:text-ink-2"}`}
              >
                I&apos;m a Teacher 📚
              </button>
              <button 
                onClick={() => setRole("student")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${role === "student" ? "bg-white text-brand border border-line" : "text-ink-3 hover:text-ink-2"}`}
              >
                I&apos;m a Student 🎓
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-semibold text-sm"
                  />
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-semibold text-sm"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-semibold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-3 hover:text-brand"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {tab === "login" && (
                <div className="flex justify-end text-xs">
                  <a className="text-brand hover:underline font-semibold cursor-pointer">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#16A34A] hover:bg-cta-hover text-white py-5 rounded-xl text-base font-bold shadow-brand flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  tab === "login" ? "Login" : "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2.5 bg-white text-ink-3 font-semibold uppercase tracking-wider">or</span>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-white border border-line hover:bg-cream/40 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-3 shadow-xs cursor-pointer transition-colors"
            >
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Single Sign On Authentication Logo for Indian Government Teachers" width={18} height={18} />
              Continue with Google
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
