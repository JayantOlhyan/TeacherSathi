"use client";

import { useState, useEffect } from "react";
import { 
  Users, Search, ShieldCheck, UserCheck, ShieldAlert, Edit, Save, 
  RotateCw, CheckCircle2, UserX, ToggleLeft, ToggleRight
} from "lucide-react";
import { adminStore, User } from "@/lib/adminStore";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Edit role states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeAdminRole, setActiveAdminRole] = useState("SUPER_ADMIN");

  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const adminRole = localStorage.getItem("ts_admin_active_role") || "SUPER_ADMIN";
    setActiveAdminRole(adminRole);
  }, []);

  const loadData = () => {
    setUsers(adminStore.getUsers());
  };

  const handleToggleStatus = (id: string) => {
    adminStore.toggleUserStatus(id);
    loadData();
    showFeedback("User profile account status toggled.");
  };

  const handleOpenEditRoles = (u: User) => {
    setEditingUserId(u.id);
    setSelectedRoles(u.roles);
    setIsModalOpen(true);
  };

  const handleRoleCheckboxChange = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSaveRoles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    // Enforce security rule: Non-SUPER_ADMIN cannot grant SUPER_ADMIN privileges
    if (selectedRoles.includes("SUPER_ADMIN") && activeAdminRole !== "SUPER_ADMIN") {
      alert("Security Violation: Only SUPER_ADMIN can delegate SUPER_ADMIN privileges.");
      return;
    }

    adminStore.updateUserRole(editingUserId, selectedRoles);
    loadData();
    setIsModalOpen(false);
    showFeedback("User roles permissions updated successfully.");
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.display_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === "ALL" || u.roles.includes(selectedRoleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">User Account Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage teacher profiles, modify functional RBAC permission scopes, and suspend/reactivate credentials.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select 
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
            <option value="REVIEWER">REVIEWER</option>
          </select>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {feedback}
        </div>
      )}

      {/* Users table */}
      <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto font-medium">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-900/40 border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Display Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Active Roles</th>
                <th className="p-4">Status</th>
                <th className="p-4">School Organization</th>
                <th className="p-4 text-right pr-6">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-905">
                  <td className="p-4 pl-6 text-slate-200 font-bold">{u.display_name}</td>
                  <td className="p-4 font-mono text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {u.roles.map(r => (
                        <span key={r} className="bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded text-[10px] text-emerald-400 font-mono font-semibold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${u.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-450'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{u.school_name || "N/A"}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(u.id)}
                      className={`p-1 bg-slate-900 border rounded transition-all ${
                        u.status === 'ACTIVE' ? 'border-emerald-805 text-emerald-450 hover:bg-emerald-950/20' : 'border-rose-950 text-rose-450 hover:bg-rose-950/20'
                      }`}
                      title={u.status === 'ACTIVE' ? "Suspend Account" : "Activate Account"}
                    >
                      {u.status === 'ACTIVE' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleOpenEditRoles(u)}
                      className="p-1 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-slate-350 hover:text-white transition-colors"
                      title="Edit Roles"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role editing modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-sm w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Modify Permissions Roles
            </h3>

            <form onSubmit={handleSaveRoles} className="space-y-4">
              <div className="space-y-2 bg-slate-950/80 p-4 rounded-lg border border-slate-900">
                {["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "REVIEWER", "SUPPORT"].map(role => {
                  const isChecked = selectedRoles.includes(role);
                  return (
                    <div key={role} className="flex items-center gap-2.5">
                      <input 
                        type="checkbox"
                        id={`role-${role}`}
                        checked={isChecked}
                        onChange={() => handleRoleCheckboxChange(role)}
                        className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0"
                      />
                      <label htmlFor={`role-${role}`} className="text-xs text-slate-300 font-semibold cursor-pointer">
                        {role}
                      </label>
                    </div>
                  );
                })}
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
                  Apply Roles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
