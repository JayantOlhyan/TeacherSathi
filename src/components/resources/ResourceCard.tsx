"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { 
  Tv, 
  FileText, 
  CheckSquare, 
  Users, 
  Video, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Layers, 
  ArrowRight,
  Eye
} from "lucide-react";
import type { StoredResourceItem } from "@/lib/services/recentResources";
import { isResourceSaved, toggleSaveResource } from "@/lib/services/recentResources";

interface ResourceCardProps {
  resource: StoredResourceItem;
  onPreview: (resource: StoredResourceItem) => void;
  className?: string;
}

export function ResourceCard({ resource, onPreview, className = "" }: ResourceCardProps) {
  const [saved, setSaved] = useState(() => isResourceSaved(resource.id));

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSaveResource(resource);
    setSaved(newState);
  };

  // Type styling and icon mapper
  const getTypeConfig = () => {
    switch (resource.type.toUpperCase()) {
      case "LESSON_SLIDES":
      case "PRESENTATION":
        return {
          icon: <Tv className="w-4 h-4 text-emerald-700" />,
          label: "LESSON SLIDES",
          badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          actionLabel: "Teach",
          actionIcon: <Tv className="w-3.5 h-3.5" />,
          bgGradient: "from-emerald-50/50 to-teal-50/30",
        };
      case "WORKSHEET":
        return {
          icon: <FileText className="w-4 h-4 text-blue-700" />,
          label: "WORKSHEET",
          badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
          actionLabel: "Assign",
          actionIcon: <FileText className="w-3.5 h-3.5" />,
          bgGradient: "from-blue-50/50 to-indigo-50/30",
        };
      case "QUIZ":
      case "TEST":
        return {
          icon: <CheckSquare className="w-4 h-4 text-purple-700" />,
          label: "QUIZ",
          badgeBg: "bg-purple-50 text-purple-800 border-purple-200",
          actionLabel: "Use",
          actionIcon: <CheckSquare className="w-3.5 h-3.5" />,
          bgGradient: "from-purple-50/50 to-pink-50/30",
        };
      case "ACTIVITY":
      case "TEACHING_ACTIVITY":
        return {
          icon: <Users className="w-4 h-4 text-amber-700" />,
          label: "ACTIVITY",
          badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
          actionLabel: "Use",
          actionIcon: <Users className="w-3.5 h-3.5" />,
          bgGradient: "from-amber-50/50 to-yellow-50/30",
        };
      case "VIDEO":
        return {
          icon: <Video className="w-4 h-4 text-rose-700" />,
          label: "VIDEO",
          badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
          actionLabel: "Play",
          actionIcon: <Video className="w-3.5 h-3.5" />,
          bgGradient: "from-rose-50/50 to-orange-50/30",
        };
      default:
        return {
          icon: <BookOpen className="w-4 h-4 text-gray-700" />,
          label: resource.typeLabel || "RESOURCE",
          badgeBg: "bg-gray-100 text-gray-800 border-gray-200",
          actionLabel: "Open",
          actionIcon: <ArrowRight className="w-3.5 h-3.5" />,
          bgGradient: "from-gray-50 to-white",
        };
    }
  };

  const typeConfig = getTypeConfig();
  const chShort = resource.chapter.replace("chapter-", "Ch ");

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative ${className}`}
    >
      <div className="space-y-3.5">
        {/* Card Header: Type Badge & Bookmark */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider border ${typeConfig.badgeBg}`}
          >
            {typeConfig.icon}
            {typeConfig.label}
          </span>

          <button
            onClick={handleToggleSave}
            title={saved ? "Remove from saved resources" : "Save resource"}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Thumbnail Illustration Area */}
        <div
          onClick={() => onPreview(resource)}
          className={`h-28 rounded-xl bg-gradient-to-br ${typeConfig.bgGradient} border border-gray-100 flex flex-col items-center justify-center p-3 cursor-pointer group-hover:border-emerald-200 transition-colors relative overflow-hidden`}
        >
          <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl shadow-2xs group-hover:scale-105 transition-transform">
            {typeConfig.icon}
          </div>
          <span className="text-[11px] font-bold text-gray-500 mt-2 text-center line-clamp-1">
            {resource.chapterName || resource.title}
          </span>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="px-3 py-1 rounded-full bg-white/90 text-gray-900 text-xs font-bold shadow-xs flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Preview
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3
            onClick={() => onPreview(resource)}
            className="font-bold text-gray-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer"
          >
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {resource.description}
            </p>
          )}
        </div>

        {/* Metadata: Count & Duration */}
        {(resource.itemCount || resource.duration) && (
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1">
            {resource.itemCount && (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                {resource.itemCount}
              </span>
            )}
            {resource.itemCount && resource.duration && <span>•</span>}
            {resource.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {resource.duration}
              </span>
            )}
          </div>
        )}

        {/* Curriculum Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
            {resource.gradeName || resource.grade}
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
            {resource.subjectName || resource.subject}
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
            {chShort}
          </span>
        </div>
      </div>

      {/* Action Footer: Preview vs Teach */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={() => onPreview(resource)}
          className="flex-1 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          Preview
        </button>

        {resource.teachUrl ? (
          <Link
            href={resource.teachUrl}
            className="flex-1 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
          >
            {typeConfig.actionIcon}
            {typeConfig.actionLabel}
          </Link>
        ) : (
          <button
            onClick={() => onPreview(resource)}
            className="flex-1 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            {typeConfig.actionIcon}
            {typeConfig.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
