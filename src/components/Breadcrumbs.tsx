/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ChevronRight, Home } from "lucide-react";

const segmentLabels: Record<string, string> = {
  resources: "Resources Hub",
  "lesson-plans": "AI Lesson Plans",
  "mind-maps": "Interactive Mind Maps",
  ncert: "NCERT Solutions",
  "quiz-generator": "Quiz Generator",
  dashboard: "Dashboard",
  classes: "Smart Classes",
  create: "AI Content Generator",
  whiteboard: "Interactive Whiteboard",
  activity: "Activity Logs",
  reports: "Reports & Analytics",
  content: "Content Library",
  "class-10": "Class 10",
  science: "Science",
  "chapter-10": "Chapter 10: Light Reflection",
  support: "Support Hub",
  contact: "Contact Us",
  sitemap: "Site Map",
  pricing: "Pricing & Plans",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  video: "Video Lecture",
  quiz: "Chapter Quiz",
  test: "Mock Test",
};

export default function Breadcrumbs() {
  const pathname = usePathname() || "/en";

  // Hide breadcrumbs on homepage, login, and signup routes
  const cleanPath = pathname.replace(/^\/(en|hi)(?=\/|$)/, "") || "/";
  if (cleanPath === "/" || cleanPath.startsWith("/login") || cleanPath.startsWith("/signup")) {
    return null;
  }

  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const baseUrl = "https://teacher-sathi.online";
  const locale = pathname.startsWith("/hi") ? "hi" : "en";

  // Build breadcrumb items for UI and JSON-LD
  const breadcrumbItems = [
    { label: locale === "hi" ? "होम" : "Home", href: "/", url: `${baseUrl}/${locale}` },
  ];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const formattedLabel =
      segmentLabels[segment] ||
      segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    breadcrumbItems.push({
      label: formattedLabel,
      href: currentPath,
      url: `${baseUrl}/${locale}${currentPath}`,
    });
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white/80 dark:bg-[#0A2A17]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 py-2.5 px-4 sm:px-8 relative z-20 transition-colors">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto flex items-center text-xs text-gray-500 dark:text-gray-300 overflow-x-auto whitespace-nowrap scrollbar-none">
          <ol className="flex items-center gap-1.5 font-medium">
            {breadcrumbItems.map((item, idx) => {
              const isLast = idx === breadcrumbItems.length - 1;
              return (
                <li key={idx} className="flex items-center gap-1.5">
                  {idx === 0 ? (
                    <Link
                      href={item.href as any}
                      className="flex items-center gap-1 hover:text-[#166534] dark:hover:text-emerald-400 transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  ) : isLast ? (
                    <span className="font-bold text-[#166534] dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/50">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href as any}
                      className="hover:text-[#166534] dark:hover:text-emerald-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}
