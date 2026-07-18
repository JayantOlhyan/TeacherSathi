"use client";

import { useState, useEffect } from "react";
import { 
  Terminal, Search, Database, Clock, ShieldAlert, ArrowDownWideNarrow, Trash
} from "lucide-react";
import { adminStore, AuditLog } from "@/lib/adminStore";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState("ALL");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLogs(adminStore.getAuditLogs());
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.admin_email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.metadata.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEntity = selectedEntityFilter === "ALL" || log.entity_type === selectedEntityFilter;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-medium">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">System Operations Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">
            Read-only audit record detailing content changes, user updates, and bulk imports.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search logs by action, user email or context..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select 
            value={selectedEntityFilter}
            onChange={(e) => setSelectedEntityFilter(e.target.value)}
            className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Entity Actions</option>
            <option value="CLASS">CLASS Actions</option>
            <option value="SUBJECT">SUBJECT Actions</option>
            <option value="BOOK">BOOK Actions</option>
            <option value="CHAPTER">CHAPTER Actions</option>
            <option value="QUESTION">QUESTION Actions</option>
            <option value="MEDIA">MEDIA Actions</option>
            <option value="USER">USER Actions</option>
          </select>
        </div>
      </div>

      {/* Read only Warning */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0" />
        <p className="text-[11px] text-slate-400 leading-normal">
          This system activity audit trail is protected under strict security guidelines. Logs cannot be modified, deleted, or purged.
        </p>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-900/40 border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Operator Email</th>
                <th className="p-4">Action Hook</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Entity ID</th>
                <th className="p-4 pr-6">Change Context Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-905">
                  <td className="p-4 pl-6 text-slate-500 flex items-center gap-1.5 font-sans font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-sans font-bold text-slate-200">{log.admin_email}</td>
                  <td className="p-4">
                    <span className="bg-slate-950 border border-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-400 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-450 font-semibold">{log.entity_type}</td>
                  <td className="p-4 text-slate-450">{log.entity_id}</td>
                  <td className="p-4 pr-6 text-slate-400 font-sans font-semibold max-w-sm truncate" title={log.metadata}>
                    {log.metadata || "No metadata recorded."}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-bold font-sans uppercase tracking-wider">
                    No matching ledger items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
