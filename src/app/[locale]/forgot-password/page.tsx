"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!supabase) {
      setErrorMessage("Supabase client is not initialized.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSent(true);
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
            
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif text-[#4A3B2C] font-bold">
                Reset Educator Password
              </h1>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">
                Enter your registered school email address and we will send you a password reset link instantly.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium">
                {errorMessage}
              </div>
            )}

            {isSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Reset Link Sent!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  We have dispatched a password reset link to <span className="font-bold">{email}</span>. Please check your inbox.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-block bg-[#16A34A] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@school.edu.in"
                      required
                      className="w-full min-h-[44px] pl-11 pr-4 py-3 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand bg-transparent text-ink font-medium"
                    />
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[44px] bg-[#16A34A] hover:bg-cta-hover text-white py-4 rounded-lg text-base font-bold shadow-brand"
                >
                  {isLoading ? "Sending Reset Link..." : "Send Password Reset Link"}
                </Button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
