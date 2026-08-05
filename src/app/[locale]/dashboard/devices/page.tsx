"use client";

import { useState } from "react";
import { Tv, Plus, CheckCircle, ShieldCheck, AlertCircle } from "lucide-react";

interface SmartboardDevice {
  deviceId: string;
  deviceName: string;
  schoolId: string;
  roomNumber: string;
  status: "online" | "offline" | "in_use";
  lastActive: string;
}

export default function SmartboardDevicesPage() {
  const [devices, setDevices] = useState<SmartboardDevice[]>([
    {
      deviceId: "Board-001",
      deviceName: "Class 8A Smartboard 75\"",
      schoolId: "UDISE-060201",
      roomNumber: "Room 102",
      status: "in_use",
      lastActive: "Just now",
    },
    {
      deviceId: "Board-002",
      deviceName: "Class 9B Science Lab Display 75\"",
      schoolId: "UDISE-060201",
      roomNumber: "Science Lab 2",
      status: "online",
      lastActive: "5 mins ago",
    },
    {
      deviceId: "Board-003",
      deviceName: "Class 10A Interactive Panel 75\"",
      schoolId: "UDISE-060201",
      roomNumber: "Room 204",
      status: "offline",
      lastActive: "Yesterday",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newSchoolId, setNewSchoolId] = useState("UDISE-060201");

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newRoomNumber) return;

    const nextNumber = devices.length + 1;
    const formattedId = `Board-00${nextNumber}`;

    const newDevice: SmartboardDevice = {
      deviceId: formattedId,
      deviceName: newDeviceName,
      schoolId: newSchoolId,
      roomNumber: newRoomNumber,
      status: "online",
      lastActive: "Just now",
    };

    setDevices([newDevice, ...devices]);
    setNewDeviceName("");
    setNewRoomNumber("");
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#14532D] to-[#15803D] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Tv className="w-3.5 h-3.5 text-amber-300" />
            Classroom Hardware Registry (Step 1.2)
          </div>
          <h1 className="text-3xl font-black font-serif">Smartboard 75&quot; Device Registry</h1>
          <p className="text-white/80 text-sm font-medium max-w-xl">
            Register and manage classroom smartboards, unique Device IDs, school UDISE bindings, and active room pairings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Register New Smartboard
        </button>
      </div>

      {/* Phase 11 & 12 Board Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase">Total Displays</span>
          <div className="text-2xl font-black text-gray-900">25 Boards</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase">Active In-Use</span>
          <div className="text-2xl font-black text-emerald-700">20 Active 🟢</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase">Idle Displays</span>
          <div className="text-2xl font-black text-amber-700">3 Idle 🟡</div>
        </div>

        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-red-800 uppercase">Offline Displays</span>
          <div className="text-2xl font-black text-red-700">2 Offline 🔴</div>
        </div>
      </div>

      {/* Device List Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Registered Classroom Displays ({devices.length})
          </h2>
          <span className="text-xs text-gray-500 font-bold">UDISE School: UDISE-060201</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50/80 text-xs uppercase font-extrabold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Device ID</th>
                <th className="px-6 py-4">Device Name</th>
                <th className="px-6 py-4">School ID</th>
                <th className="px-6 py-4">Room Number</th>
                <th className="px-6 py-4">Status & Telemetry</th>
                <th className="px-6 py-4 text-right">Phase 11 Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {devices.map((device) => (
                <tr key={device.deviceId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-emerald-800">
                    {device.deviceId}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {device.deviceName}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-semibold text-gray-600">
                    {device.schoolId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                    {device.roomNumber}
                  </td>
                  <td className="px-6 py-4">
                    {device.status === "in_use" && (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Active • CPU 14% • RAM 2.1GB
                      </span>
                    )}
                    {device.status === "online" && (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Ready • CPU 4% • Last sync 10s
                      </span>
                    )}
                    {device.status === "offline" && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-gray-400" /> Offline
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <select
                      onChange={(e) => {
                        const action = e.target.value;
                        if (action) {
                          alert(`Phase 11 Command: [${action.toUpperCase()}] sent to ${device.deviceId}`);
                          e.target.value = "";
                        }
                      }}
                      className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none cursor-pointer"
                    >
                      <option value="">Admin Actions ▼</option>
                      <option value="restart">🔄 Restart Board</option>
                      <option value="logout">🚪 Force Logout</option>
                      <option value="lock">🔒 Lock Board</option>
                      <option value="update">⚡ Update Software</option>
                      <option value="logs">📜 View Logs</option>
                      <option value="disable">🚫 Disable Device</option>
                    </select>

                    <a
                      href={`/classroom?board_id=${device.deviceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                    >
                      Kiosk ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Phase 13 — Security Architecture Grid */}
      <div className="bg-[#14532D] text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-black font-serif">Phase 13 — Security & Encryption Architecture</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-400 text-gray-950 px-3 py-1 rounded-full">
            Zero-Trust Protected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-emerald-300">Auth Engine</span>
            <p className="text-white text-[11px] font-normal">JWT + Automatic Token Rotation</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-emerald-300">Session Handshake</span>
            <p className="text-white text-[11px] font-normal">Redis Session Store + WSS Encryption</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-emerald-300">Hardware Security</span>
            <p className="text-white text-[11px] font-normal">Device Fingerprinting & Audit Logs</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-emerald-300">QR Protection</span>
            <p className="text-white text-[11px] font-normal">1-Time 2-min Expiring Tokens</p>
          </div>
        </div>
      </div>

      {/* Register Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Register New Smartboard</h3>
            
            <form onSubmit={handleRegisterDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class 7C Smartboard 75&quot;"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Room Number / Lab
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 105"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  School UDISE ID
                </label>
                <input
                  type="text"
                  value={newSchoolId}
                  onChange={(e) => setNewSchoolId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-md"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
