"use client";

import { Play, RotateCw, Terminal, Check, X, ChevronUp } from "lucide-react";

export default function AdminPipelinePage() {
  const jobs = [
    { id: "30002001", chapter: "Englic Chapter1 8 ...", class: "AR I", status: "QUEUED", cost: "0", duration: "10 min", ytId: "" },
    { id: "30002092", chapter: "Englic Chapter2 Un...", class: "ER I", status: "PROCESSING", cost: "8", duration: "10 min", ytId: "" },
    { id: "30002033", chapter: "Englic Chapter1 1 ...", class: "EN 3", status: "DONE", cost: "496", duration: "12 min", ytId: "cB3H0KB3" },
    { id: "30002034", chapter: "Englic Chapter1 2 ...", class: "EN 3", status: "DONE", cost: "496", duration: "12 min", ytId: "ed2WRLTH" },
    { id: "30002057", chapter: "Englic Chapter1 3...", class: "EN 3", status: "DONE", cost: "496", duration: "12 min", ytId: "adYDCW81" },
    { id: "30002899", chapter: "Englic Chapter1 6...", class: "HI A", status: "FAILED", cost: "20", duration: "12 min", ytId: "eof6KVH5" },
    { id: "30002483", chapter: "Englic Chapter1 8...", class: "HI A", status: "FAILED", cost: "20", duration: "12 min", ytId: "BvERZV32" },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#E0E0E0] font-mono p-6">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#333] pb-4 mb-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-[#4ADE80]">
            <Terminal className="w-6 h-6" />
            TeacherSathi AI Pipeline Control <span className="text-[#666]">· Admin Dashboard</span>
          </h1>
          <p className="text-xs text-[#888] mt-1">
            Automated content generation pipeline managing NCERT and CBSE classroom resources for Indian government school educators.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
            <span className="text-[#4ADE80]">LIVE</span>
          </div>
          <span className="text-[#888]">IST 14:32:07</span>
          <span className="bg-[#333] px-3 py-1 rounded text-white">Admin: Founder</span>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        
        {/* Trigger Panel */}
        <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-5">
          <div className="flex justify-between items-center border-b border-[#333] pb-3 mb-4">
            <h2 className="font-bold">Trigger</h2>
            <ChevronUp className="w-4 h-4 text-[#666]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-xs text-[#888] mb-1">Class</label>
              <select className="w-full bg-[#0F0F0F] border border-[#333] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4ADE80]">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Subject</label>
              <select className="w-full bg-[#0F0F0F] border border-[#333] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4ADE80]">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Chapter name</label>
              <input type="text" className="w-full bg-[#0F0F0F] border border-[#333] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4ADE80]" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Language</label>
              <div className="bg-[#0F0F0F] border border-[#333] rounded flex text-sm overflow-hidden h-[38px]">
                <button className="flex-1 hover:bg-[#333] border-r border-[#333]">EN</button>
                <button className="flex-1 hover:bg-[#333] border-r border-[#333]">HI</button>
                <button className="flex-1 bg-[#333] text-white">Both</button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Priority</label>
              <div className="bg-[#0F0F0F] border border-[#333] rounded flex text-sm overflow-hidden h-[38px]">
                <button className="flex-1 bg-[#333] text-white border-r border-[#333]">Normal</button>
                <button className="flex-1 hover:bg-[#333]">High</button>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#166534] hover:bg-[#15803d] border border-[#22C55E] text-[#4ADE80] font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors">
            <Play className="w-4 h-4 fill-current" /> TRIGGER PIPELINE
          </button>
          <div className="text-right text-[#888] text-xs mt-2">
            ~8 min per video · ~₹2 Claude API cost
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="w-full xl:w-80 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 shrink-0">
          <h2 className="font-bold border-b border-[#333] pb-3 mb-4">Pipeline Stats</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#888]">Total Generated:</span>
              <span className="text-[#4ADE80]">248</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Success Rate:</span>
              <span className="text-[#4ADE80]">94.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Total Cost:</span>
              <span className="text-white">₹496</span>
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-[#888]">API Budget</span>
                <span className="text-white">48%</span>
              </div>
              <div className="w-full h-3 bg-[#0F0F0F] rounded overflow-hidden border border-[#333]">
                <div className="h-full bg-[#4ADE80] w-[48%]"></div>
              </div>
              <div className="text-right text-xs text-[#4ADE80] mt-1">₹2,400 / ₹5,000</div>
            </div>
          </div>
        </div>

      </div>

      {/* Jobs Table */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#0F0F0F] border-b border-[#333] text-[#888]">
            <tr>
              <th className="p-3 font-normal">JOB ID</th>
              <th className="p-3 font-normal">CHAPTER</th>
              <th className="p-3 font-normal">CLASS</th>
              <th className="p-3 font-normal">STATUS</th>
              <th className="p-3 font-normal text-right">COST ₹</th>
              <th className="p-3 font-normal">DURATION</th>
              <th className="p-3 font-normal">YOUTUBE ID</th>
              <th className="p-3 font-normal">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {jobs.map((job, idx) => (
              <tr key={idx} className="hover:bg-[#222]">
                <td className="p-3 font-mono">{job.id}</td>
                <td className="p-3 truncate max-w-[200px]">{job.chapter}</td>
                <td className="p-3">{job.class}</td>
                <td className="p-3">
                  {job.status === "QUEUED" && <span className="bg-[#333] text-[#CCC] px-2 py-0.5 rounded text-xs font-bold border border-[#555]">QUEUED</span>}
                  {job.status === "PROCESSING" && <span className="bg-[#B45309] text-[#FEF3C7] px-2 py-0.5 rounded text-xs font-bold border border-[#F59E0B] flex items-center gap-1 w-max">PROCESSING <RotateCw className="w-3 h-3 animate-spin" /></span>}
                  {job.status === "DONE" && <span className="bg-[#14532D] text-[#BBF7D0] px-2 py-0.5 rounded text-xs font-bold border border-[#22C55E] flex items-center gap-1 w-max">DONE <Check className="w-3 h-3" /></span>}
                  {job.status === "FAILED" && <span className="bg-[#7F1D1D] text-[#FECACA] px-2 py-0.5 rounded text-xs font-bold border border-[#EF4444] flex items-center gap-1 w-max">FAILED <X className="w-3 h-3" /></span>}
                </td>
                <td className="p-3 text-right">{job.status === "FAILED" ? <span className="text-[#EF4444]">{job.cost}</span> : job.cost}</td>
                <td className="p-3">{job.duration}</td>
                <td className="p-3 font-mono text-[#3B82F6]">{job.ytId}</td>
                <td className="p-3 text-[#888]">
                  <button className="hover:text-white transition-colors">Retry</button> <span className="text-[#444]">/</span> <button className="hover:text-white transition-colors">Log</button> <span className="text-[#444]">/</span> <button className="hover:text-[#EF4444] transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

