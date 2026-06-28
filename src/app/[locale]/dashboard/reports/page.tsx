"use client";

import { useState } from "react";
import { TrendingUp, Users, Award, BookOpen, Download, Calendar, Filter, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState("Class 10-A");

  const reports = [
    { name: "First Term Science MCQ Quiz", date: "May 28, 2026", avgScore: "84%", completed: "24/24 students", type: "Quiz", status: "Completed" },
    { name: "Unit 3 Reflection Practice Test", date: "May 25, 2026", avgScore: "76%", completed: "22/24 students", type: "Test", status: "Completed" },
    { name: "Monthly Physics Progress Board", date: "May 15, 2026", avgScore: "81%", completed: "24/24 students", type: "Milestone", status: "Synced" },
    { name: "Phonemic Early Literacy Diagnostic", date: "May 08, 2026", avgScore: "92%", completed: "18/20 students", type: "Diagnostic", status: "Completed" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Learning & Performance Reports</h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Analyze real-time student grades, review NCERT quiz analytics, evaluate classroom learning progress, and export diagnostic progress reports tailored for Indian government school educators.
          </p>
        </div>

        <Button className="bg-[#16A34A] hover:bg-cta-hover text-white px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all">
          <Download className="w-4 h-4" /> Export School Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Class Average", value: "83.2%", desc: "+2.4% vs last month", icon: TrendingUp, color: "text-[#16A34A] bg-[#EDF7EF]" },
          { label: "Total Students Active", value: "42 Active", desc: "100% participation", icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Excellence Badges", value: "18 Issued", desc: "Awarded for top performance", icon: Award, color: "text-amber-600 bg-amber-50" },
          { label: "Tests Analyzed", value: "8 Completed", desc: "Instant AI diagnostics done", icon: BookOpen, color: "text-purple-600 bg-purple-50" },
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">{card.label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{card.value}</p>
              <p className="text-[10px] text-gray-400 mt-1 font-medium">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Reports Table Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">Filters:</span>
            
            <div className="relative">
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none bg-cream border border-line rounded-xl px-4 py-2 pr-8 text-xs font-bold text-[#14532D] focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer"
              >
                <option>Class 10-A</option>
                <option>Class 10-B</option>
                <option>Class 9 Science</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <Calendar className="w-4 h-4" />
            Academic Year: 2026-27
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs font-extrabold uppercase tracking-wider">
                <th className="py-4 px-4">Report Name</th>
                <th className="py-4 px-4">Date Conducted</th>
                <th className="py-4 px-4">Class Score Avg</th>
                <th className="py-4 px-4">Submissions</th>
                <th className="py-4 px-4">Assessment Type</th>
                <th className="py-4 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((rep, idx) => (
                <tr key={idx} className="hover:bg-[#FDFBF7] transition-all text-sm group">
                  <td className="py-4 px-4 font-bold text-gray-800 group-hover:text-[#14532D] transition-colors">{rep.name}</td>
                  <td className="py-4 px-4 text-gray-500 font-semibold">{rep.date}</td>
                  <td className="py-4 px-4">
                    <span className="bg-[#EDF7EF] border border-[#AEDCBA] text-[#16A34A] text-xs font-bold px-2.5 py-1 rounded-full">
                      {rep.avgScore}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">{rep.completed}</td>
                  <td className="py-4 px-4 text-gray-400 font-semibold">{rep.type}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                      <Check className="w-3 h-3 stroke-[3]" /> {rep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
