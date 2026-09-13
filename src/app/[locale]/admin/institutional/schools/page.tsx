"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  School, 
  Search, 
  PlusCircle, 
  Users, 
  GraduationCap, 
  Layers, 
  CheckCircle2, 
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { EnrichedSchoolRecord } from "@/lib/repositories/institution";
import { SchoolBoard } from "@/lib/validations/institution";

export default function SchoolDirectoryPage() {
  const [schools, setSchools] = useState<EnrichedSchoolRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Onboard Modal State
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [board, setBoard] = useState<SchoolBoard>("CBSE");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/institutional/schools?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setSchools(json.data || []);
        setTotal(json.total || 0);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !contactEmail || !stateName || !city) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/institutional/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code: code.toUpperCase(),
          board,
          state: stateName,
          city,
          contact_email: contactEmail,
          admin_email: adminEmail || undefined,
        }),
      });

      if (res.ok) {
        setIsOnboardOpen(false);
        setName("");
        setCode("");
        setStateName("");
        setCity("");
        setContactEmail("");
        setAdminEmail("");
        await fetchSchools();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to onboard school");
      }
    } catch {
      alert("Network error while onboarding school");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-black text-gray-900">
            Institutional School Directory
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Search, manage, and onboard affiliated schools within your administrative jurisdiction.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Onboard New School
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school name, code, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-2">
            <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400 font-bold">Loading directory...</span>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <School className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No schools found</p>
            <p className="text-xs text-gray-400">Try adjusting your search criteria or onboard a new school.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">School Details</th>
                  <th className="py-3.5 px-4">Board & Location</th>
                  <th className="py-3.5 px-4 text-center">Educators</th>
                  <th className="py-3.5 px-4 text-center">Students</th>
                  <th className="py-3.5 px-4 text-center">Classes</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {schools.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        Code: {s.code || "N/A"} • {s.contact_email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-800">{s.board}</div>
                      <div className="text-[11px] text-gray-500">
                        {s.city}, {s.state_name || s.state}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                        <Users className="w-3.5 h-3.5 text-gray-400" /> {s.teachers_count || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> {s.students_count || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                        <Layers className="w-3.5 h-3.5 text-gray-400" /> {s.classes_count || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          s.is_active
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {s.is_active ? <CheckCircle2 className="w-3 h-3" /> : null}
                        {s.is_active ? "Active" : "Archived"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} schools
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-gray-700">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Onboard School Modal */}
      {isOnboardOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Onboard New School</h3>
              </div>
              <button
                onClick={() => setIsOnboardOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">School Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kendriya Vidyalaya No. 1"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">School Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. KV-DEL-01"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 uppercase focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Education Board *</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value as SchoolBoard)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="KVS">KVS</option>
                    <option value="JNV">JNV</option>
                    <option value="STATE_BOARD">State Board</option>
                    <option value="ICSE">ICSE</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State / Region *</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@school.edu.in"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-1">
                  Invite Initial School Admin (Optional)
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="principal@school.edu.in"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Generates a secure cryptographic single-use invitation token.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold shadow-2xs cursor-pointer"
                >
                  {submitting ? "Onboarding..." : "Onboard School"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
