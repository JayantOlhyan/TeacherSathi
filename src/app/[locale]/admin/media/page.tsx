"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Link as LinkIcon, FileText, 
  Image as ImageIcon, Film, FileArchive, CheckCircle2
} from "lucide-react";
import { adminStore, MediaAsset, Class, Subject } from "@/lib/adminStore";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedClass, setSelectedClass] = useState("ALL");

  // Modals / forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [storagePath, setStoragePath] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [mimeType, setMimeType] = useState("application/pdf");
  const [fileSize, setFileSize] = useState(1542000);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tagsInput, setTagsInput] = useState("pdf, guide");
  const [altText, setAltText] = useState("");
  const [description, setDescription] = useState("");

  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAssets(adminStore.getMediaAssets());
    setClasses(adminStore.getClasses().filter(c => !c.is_archived));
    setSubjects(adminStore.getSubjects().filter(s => !s.is_archived));
  };

  const handleOpenAdd = () => {
    setFilename("lesson_slides.pptx");
    setDisplayName("Class 8 Science Slides");
    setStoragePath("documents/presentations/lesson_slides.pptx");
    setVisibility("PUBLIC");
    setMimeType("application/vnd.ms-powerpoint");
    setFileSize(4250000);
    setClassId(classes[0]?.id || "");
    setSubjectId(subjects[0]?.id || "");
    setTagsInput("science, slides, force");
    setAltText("Class 8 science lesson slides outline");
    setDescription("Interactive lesson slide deck outlining force and pressure concepts.");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename.trim() || !storagePath.trim()) return;

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      filename,
      display_name: displayName || filename,
      storage_path: storagePath,
      visibility,
      mime_type: mimeType,
      file_size: fileSize,
      uploaded_by: localStorage.getItem("last_sathi_teacher_email") || "founder@teachersathi.org",
      upload_date: new Date().toISOString(),
      class_id: classId || undefined,
      subject_id: subjectId || undefined,
      tags: tagsInput.split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
      alt_text: altText,
      description
    };

    adminStore.saveMediaAsset(newAsset);
    loadData();
    setIsModalOpen(false);
    showFeedback("New asset registered in S3 reference map successfully.");
  };

  const handleDelete = (id: string) => {
    adminStore.deleteMediaAsset(id);
    loadData();
    showFeedback("Asset record removed from database.");
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    showFeedback("Asset reference S3 path copied to clipboard.");
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Helper to format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper to render type icons
  const getFileIcon = (mime: string) => {
    if (mime.includes("image")) return ImageIcon;
    if (mime.includes("pdf")) return FileText;
    if (mime.includes("video")) return Film;
    return FileArchive;
  };

  // Filters
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.display_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.tags.some(t => t.includes(searchQuery.toLowerCase()));

    const matchesClass = selectedClass === "ALL" || a.class_id === selectedClass;
    
    let matchesType = true;
    if (selectedType === "IMAGE") matchesType = a.mime_type.includes("image");
    else if (selectedType === "PDF") matchesType = a.mime_type.includes("pdf");
    else if (selectedType === "VIDEO") matchesType = a.mime_type.includes("video");
    else if (selectedType === "DOC") matchesType = !a.mime_type.includes("image") && !a.mime_type.includes("pdf") && !a.mime_type.includes("video");

    return matchesSearch && matchesClass && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Central Media Library</h2>
          <p className="text-xs text-slate-400 mt-1">
            Store metadata mapping pointers for AWS S3 and streaming host CDNs.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors border border-emerald-500 shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" /> Upload S3 Reference
        </button>
      </div>

      {/* Control bar */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search assets by name or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
            >
              <option value="ALL">All Mime Types</option>
              <option value="IMAGE">Images</option>
              <option value="PDF">PDFs</option>
              <option value="VIDEO">Videos</option>
              <option value="DOC">Documents</option>
            </select>
          </div>

          <div>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
            >
              <option value="ALL">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {feedback}
        </div>
      )}

      {/* Media Catalog list */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {filteredAssets.map((asset) => {
          const Icon = getFileIcon(asset.mime_type);
          return (
            <div key={asset.id} className="bg-[#0F1424] border border-slate-800/80 rounded-xl p-4 shadow-lg shadow-slate-950/20 flex flex-col justify-between space-y-4 hover:border-slate-700/60 transition-all">
              <div className="space-y-3">
                <div className="h-32 bg-slate-950/80 border border-slate-900 rounded-lg flex items-center justify-center relative group overflow-hidden">
                  <Icon className="w-10 h-10 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span className="absolute bottom-2 left-2 text-[8px] bg-slate-900 border border-slate-800 text-slate-500 font-mono px-1.5 py-0.5 rounded font-bold">
                    {formatBytes(asset.file_size)}
                  </span>
                  <span className="absolute top-2 right-2 text-[8px] bg-slate-900 border border-slate-800 text-emerald-400 font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                    {asset.visibility}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-200 truncate">{asset.display_name}</h4>
                  <p className="text-[9px] text-slate-550 truncate font-mono mt-0.5" title={asset.storage_path}>
                    {asset.storage_path}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {asset.tags.map(t => (
                    <span key={t} className="bg-slate-900/40 border border-slate-850 px-1.5 py-0.5 rounded text-[8px] text-slate-500 font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/40 pt-3">
                <button 
                  onClick={() => copyPath(asset.storage_path)}
                  className="text-[9px] font-bold uppercase tracking-wider text-slate-450 hover:text-emerald-400 transition-colors flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-850"
                >
                  <LinkIcon className="w-3 h-3" /> Copy Path
                </button>

                <button 
                  onClick={() => handleDelete(asset.id)}
                  className="p-1 text-rose-450 hover:text-rose-300 hover:bg-rose-950/20 rounded border border-rose-950/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredAssets.length === 0 && (
          <div className="col-span-full bg-[#0F1424] border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
            No assets registered matching query conditions.
          </div>
        )}
      </div>

      {/* Link Reference modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Link S3 Media Asset
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Display Name</label>
                <input 
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Original Filename</label>
                <input 
                  type="text"
                  required
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">S3 Bucket Storage Path</label>
                <input 
                  type="text"
                  required
                  value={storagePath}
                  onChange={(e) => setStoragePath(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mime Type</label>
                  <select 
                    value={mimeType}
                    onChange={(e) => setMimeType(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="application/pdf">PDF Document</option>
                    <option value="image/jpeg">JPEG Image</option>
                    <option value="image/png">PNG Image</option>
                    <option value="video/mp4">MP4 Video</option>
                    <option value="application/vnd.ms-powerpoint">PPT Slides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">File Visibility</label>
                  <select 
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Class Associated</label>
                  <select 
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="">No Class Mapping</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tags (Comma-separated)</label>
                  <input 
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Accessibility Alt Text</label>
                <input 
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Asset Description</label>
                <textarea 
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg border border-emerald-500"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
