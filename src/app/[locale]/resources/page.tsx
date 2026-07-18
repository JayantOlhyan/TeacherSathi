"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { 
  FileText, FolderOpen, Download, Search, Sparkles, BookOpen, 
  HelpCircle, Eye, FileSpreadsheet, LayoutGrid, ClipboardList
} from "lucide-react";
import { adminStore, Resource } from "@/lib/adminStore";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  useEffect(() => {
    setResources(adminStore.getResources());
  }, []);

  const resourceTypes = [
    { name: "All Resources", value: "ALL", icon: FolderOpen, color: "text-[#14532D]" },
    { name: "Worksheets", value: "Worksheet", icon: FileText, color: "text-blue-600" },
    { name: "Lesson Plans", value: "Lesson Plan", icon: ClipboardList, color: "text-amber-600" },
    { name: "Presentations", value: "Presentation", icon: LayoutGrid, color: "text-purple-600" },
    { name: "Mind Maps", value: "Mind Map", icon: Sparkles, color: "text-pink-600" },
    { name: "Revision Notes", value: "Notes", icon: FileSpreadsheet, color: "text-cyan-600" }
  ];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "ALL" || res.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#14532D] tracking-wide">Educator Support Resources</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and download worksheets, reference presentations, lesson plans, and revision sheets.
          </p>
        </div>
      </div>

      {/* Categories Horizontal Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {resourceTypes.map((t, idx) => {
          const isActive = selectedType === t.value;
          return (
            <button 
              key={idx}
              onClick={() => setSelectedType(t.value)}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs group ${
                isActive 
                  ? 'bg-white border-[#14532D] text-[#14532D] font-bold scale-[1.02]' 
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-650'
              }`}
            >
              <t.icon className={`w-5 h-5 ${t.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[10px] uppercase tracking-wider font-semibold">{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex items-center gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search resources by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Resources Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const matchedType = resourceTypes.find(t => t.value === res.type) || { icon: FolderOpen, color: "text-slate-600" };
          const Icon = matchedType.icon;

          return (
            <div key={res.id} className="bg-white border border-slate-200/85 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all hover:shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <Icon className={`w-5 h-5 ${matchedType.color}`} />
                  </div>
                  <span className="bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                    {res.type}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{res.title}</h4>
                  <p className="text-[10px] text-slate-450 mt-1">Mapped to chapters and classrooms.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <a 
                  href={res.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#14532D] hover:text-emerald-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Resource
                </a>

                <a 
                  href={res.file_url}
                  download
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors inline-flex"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
        {filteredResources.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200/80 rounded-xl p-10 text-center text-slate-450 font-bold uppercase tracking-wider text-xs">
            No resources available matching query.
          </div>
        )}
      </div>
    </div>
  );
}
