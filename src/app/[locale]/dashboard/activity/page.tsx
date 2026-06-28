"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Play, CheckSquare, FileText, Sparkles, Clock, Download, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ActivityPage() {
  const [filter, setFilter] = useState<"all" | "plans" | "quizzes" | "videos" | "tests">("all");
  const [search, setSearch] = useState("");
  const [lastView, setLastView] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewUrl = localStorage.getItem("last_sathi_view");
      const viewTitle = localStorage.getItem("last_sathi_view_title");
      if (viewUrl) {
        setLastView({
          url: viewUrl,
          title: viewTitle || "Last Activity"
        });
      }
    }
  }, []);

  const activities = [
    {
      id: 1,
      type: "plans",
      title: "Generated Lesson Plan for Science Ch. 10",
      description: "AI-generated bilingual lesson plan covering Laws of Reflection.",
      time: "2 hours ago",
      icon: Sparkles,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      actionLabel: "View Lesson Plan",
      href: "/content/class-10/science/chapter-10",
    },
    {
      id: 2,
      type: "quizzes",
      title: "Class MCQ Quiz Conducted",
      description: "24 students completed 'Reflection MCQ Quiz' live on Smart Screen.",
      time: "4 hours ago",
      icon: CheckSquare,
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
      actionLabel: "View Results",
      href: "/content/class-10/science/chapter-10/quiz",
    },
    {
      id: 3,
      type: "videos",
      title: "Played Chapter 10 AI Video",
      description: "Finished 18-minute immersive video in Class 10-A Science.",
      time: "Yesterday",
      icon: Play,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
      actionLabel: "Watch Again",
      href: "/content/class-10/science/chapter-10/video",
    },
    {
      id: 4,
      type: "tests",
      title: "Customised Chapter Test Released",
      description: "Assigned Hard level practice test to Class 10-B (25 questions).",
      time: "2 days ago",
      icon: FileText,
      iconColor: "text-red-600 bg-red-50 border-red-100",
      actionLabel: "Check Status",
      href: "/content/class-10/science/chapter-10/test",
    },
    {
      id: 5,
      type: "plans",
      title: "Downloaded Phonemic Worksheet",
      description: "Early early literacy word builder resource downloaded in PDF.",
      time: "3 days ago",
      icon: Download,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      actionLabel: "Download Again",
      href: "/content/class-10",
    }
  ];

  const filteredActivities = activities.filter(act => {
    const matchesFilter = filter === "all" || act.type === filter;
    const matchesSearch = act.title.toLowerCase().includes(search.toLowerCase()) || 
                          act.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Student Activity Log & Teaching Analytics</h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Monitor real-time student activity logs, track NCERT quiz completions, review classroom learning engagement, and analyze AI lesson plan interactions across Indian schools.
          </p>
        </div>

        {lastView && (
          <Button asChild className="bg-[#16A34A] hover:bg-cta-hover text-white px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all duration-150">
            <Link href={lastView.url}>
              Resume: {lastView.title}
            </Link>
          </Button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Lesson Plans Ready", value: "12 Plans", desc: "4 generated this week", icon: Sparkles, color: "text-amber-600 bg-amber-50" },
          { label: "Quizzes Conducted", value: "28 Quizzes", desc: "1,200+ responses tracked", icon: CheckSquare, color: "text-purple-600 bg-purple-50" },
          { label: "Hours in Classroom", value: "14.5 Hours", desc: "Smart screen active sessions", icon: Play, color: "text-blue-600 bg-blue-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <div className="text-2xl font-bold text-gray-800 mt-0.5">{stat.value}</div>
              <p className="text-xs text-gray-400 mt-1 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Feed Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
          <div className="flex flex-wrap bg-cream rounded-full p-1 border border-line shadow-sm">
            {[
              { id: "all", label: "All Activities" },
              { id: "plans", label: "Lesson Plans" },
              { id: "quizzes", label: "Quizzes" },
              { id: "videos", label: "Videos" },
              { id: "tests", label: "Tests" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as "all" | "plans" | "quizzes" | "videos" | "tests")}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${filter === tab.id ? "bg-[#14532D] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-cream border border-line rounded-full text-sm focus:outline-none focus:border-[#14532D] transition-colors"
            />
          </div>
        </div>

        {/* List of Activities */}
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((act) => (
              <div key={act.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 hover:bg-[#FDFBF7] transition-all gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${act.iconColor}`}>
                    <act.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-800 group-hover:text-[#14532D] transition-colors leading-tight mb-1">{act.title}</h2>
                    <p className="text-gray-600 text-sm">{act.description}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-2 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {act.time}
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="border-gray-200 hover:bg-[#14532D] hover:text-white text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 self-end sm:self-center transition-all">
                  <Link href={act.href}>
                    {act.actionLabel} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-gray-50 border rounded-2xl flex items-center justify-center mx-auto text-gray-400 text-xl font-bold">📭</div>
              <h2 className="text-lg font-bold text-gray-600">No activity logs found</h2>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">Try switching filters or check back later after running some AI features.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
