"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Mail, 
  Send, 
  Trash2, 
  CheckCircle2, 
  Copy
} from "lucide-react";
import { InstitutionalInvitationRecord, InstitutionalScope, InstitutionUserRole } from "@/lib/validations/institution";

export default function InstitutionalInvitationsPage() {
  const [invitations, setInvitations] = useState<InstitutionalInvitationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InstitutionUserRole>("SCHOOL_ADMIN");
  const [targetType, setTargetType] = useState<InstitutionalScope>("SCHOOL");
  const [targetId, setTargetId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/institutional/invitations");
      if (res.ok) {
        const json = await res.json();
        setInvitations(json.data || []);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !targetId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/institutional/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          target_type: targetType,
          target_id: targetId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setLastGeneratedUrl(json.data.inviteUrl);
        setEmail("");
        await fetchInvitations();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to create invitation");
      }
    } catch {
      alert("Network error creating invitation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this invitation?")) return;
    try {
      const res = await fetch(`/api/admin/institutional/invitations?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchInvitations();
      }
    } catch {
      alert("Failed to revoke invitation");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Security & Onboarding
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-bold text-gray-500">Cryptographic Single-Use Invitations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
          Institutional Administrator Invitations
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
          Invite State Administrators, District Education Officers, School Network Leads, and Principals with time-limited single-use cryptographic authorization tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Invitation Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-5">
          <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" /> Issue New Invitation
          </h3>

          <form onSubmit={handleCreateInvite} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Recipient Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@education.gov.in"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Scope *</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as InstitutionalScope)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold focus:bg-white focus:outline-none"
                >
                  <option value="STATE">State</option>
                  <option value="DISTRICT">District</option>
                  <option value="ORGANIZATION">Organization</option>
                  <option value="SCHOOL">School</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as InstitutionUserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold focus:bg-white focus:outline-none"
                >
                  <option value="STATE_ADMIN">State Admin</option>
                  <option value="DISTRICT_ADMIN">District Admin</option>
                  <option value="ORG_ADMIN">Org Admin</option>
                  <option value="SCHOOL_ADMIN">School Admin</option>
                  <option value="TEACHER">Teacher</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Target Entity UUID *</label>
              <input
                type="text"
                required
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                ID of the target State, District, Organization, or School.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-2xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> {submitting ? "Generating Token..." : "Issue Invitation Token"}
            </button>
          </form>

          {lastGeneratedUrl && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Invitation Generated
              </div>
              <p className="text-[11px] text-emerald-700 break-all font-mono">
                {lastGeneratedUrl}
              </p>
              <button
                onClick={() => copyToClipboard(lastGeneratedUrl, "last")}
                className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-100/50"
              >
                <Copy className="w-3 h-3" /> {copiedId === "last" ? "Copied!" : "Copy Invite Link"}
              </button>
            </div>
          )}
        </div>

        {/* Invitations List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-serif font-bold text-lg text-gray-900">
            Pending & Issued Invitations
          </h3>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-2xs overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-bold">Loading invitations...</span>
              </div>
            ) : invitations.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-400">
                No active invitations issued.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-6">Recipient</th>
                      <th className="py-3.5 px-4">Role & Scope</th>
                      <th className="py-3.5 px-4">Expires</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-6 font-bold text-gray-900">
                          {inv.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-800">{inv.role}</span>
                          <span className="text-[10px] text-gray-400 block font-mono">
                            {inv.target_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                          {new Date(inv.expires_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              inv.status === "ACCEPTED"
                                ? "bg-emerald-100 text-emerald-800"
                                : inv.status === "CREATED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          {inv.status === "CREATED" && (
                            <button
                              onClick={() => handleRevoke(inv.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Revoke invitation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
