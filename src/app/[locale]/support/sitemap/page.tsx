"use client";

import { Link } from "@/i18n/routing";
import SEOAuthorityLinks from "@/components/SEOAuthorityLinks";

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#1C2B1C] font-sans pb-24">
      {/* Sitemap Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 border-b border-[#DCE4D7]">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#166534] leading-tight">
          TeacherSathi Site Map – AI Educator Directory
        </h1>
        <p className="text-lg text-[#3C4B3A]/80 mt-4 max-w-2xl leading-relaxed">
          Use the TeacherSathi sitemap to navigate our complete directory of AI lesson plans, NCERT quiz tools, classroom features, and resources for Indian government schools.
        </p>
      </div>

      {/* Sitemap Directory Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8">
          
          {/* Column 1: Products & Features */}
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold text-[#1C2B1C] mb-4 uppercase tracking-wider border-b border-[#DCE4D7] pb-2">
                Products & Features
              </h2>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Interactive Dashboard</Link></li>
                <li><Link href="/dashboard/create" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">AI Content Generation</Link></li>
                <li><Link href="/dashboard/classes" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Smart Classes</Link></li>
                <li><Link href="/dashboard/whiteboard" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Real-time Whiteboard</Link></li>
                <li><Link href="/dashboard/activity" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Activity Logs</Link></li>
                <li><Link href="/dashboard/reports" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Reports & Analytics</Link></li>
              </ul>
            </section>
          </div>

          {/* Column 2: Learning Resources */}
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold text-[#1C2B1C] mb-4 uppercase tracking-wider border-b border-[#DCE4D7] pb-2">
                Learning Resources
              </h2>
              <ul className="space-y-3">
                <li><Link href="/resources/ncert" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">NCERT Solutions (Class 6-10)</Link></li>
                <li><Link href="/resources/lesson-plans" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">AI Lesson Plans</Link></li>
                <li><Link href="/resources/mind-maps" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Interactive Mind Maps</Link></li>
                <li><Link href="/resources/quiz-generator" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Quiz Generator</Link></li>
                <li><Link href="/content/class-10/science" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Science Hub (Class 10)</Link></li>
              </ul>
            </section>
          </div>

          {/* Column 3: Account & Support */}
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold text-[#1C2B1C] mb-4 uppercase tracking-wider border-b border-[#DCE4D7] pb-2">
                Account
              </h2>
              <ul className="space-y-3">
                <li><Link href="/signup" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Create Account</Link></li>
                <li><Link href="/login" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Member Login</Link></li>
                <li><Link href="/pricing" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Pricing & Plans</Link></li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-sm font-bold text-[#1C2B1C] mb-4 uppercase tracking-wider border-b border-[#DCE4D7] pb-2">
                Support
              </h2>
              <ul className="space-y-3">
                <li><Link href="/support" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Help Center</Link></li>
                <li><Link href="/support/contact" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Contact Support</Link></li>
                <li><Link href="/support/sitemap" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Site Map</Link></li>
              </ul>
            </section>
          </div>

          {/* Column 4: About & Legal */}
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold text-[#1C2B1C] mb-4 uppercase tracking-wider border-b border-[#DCE4D7] pb-2">
                About TeacherSathi
              </h2>
              <ul className="space-y-3">
                <li><Link href="/" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Home</Link></li>
                <li><Link href="/#how-it-works" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">How It Works</Link></li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-sm font-bold text-[#1C2B1C] mb-4 uppercase tracking-wider border-b border-[#DCE4D7] pb-2">
                Legal
              </h2>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Terms of Use</Link></li>
                <li><Link href="/privacy" className="text-[#5E6C5A] hover:text-[#166534] hover:underline text-sm font-medium transition-colors">Privacy Policy</Link></li>
              </ul>
            </section>
          </div>
          
        </div>

        <SEOAuthorityLinks />
      </div>
    </div>
  );
}
