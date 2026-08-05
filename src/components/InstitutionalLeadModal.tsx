"use client";

import React, { useState } from "react";
import { Building2, CheckCircle2, Send, X } from "lucide-react";

interface InstitutionalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstitutionalLeadModal({
  isOpen,
  onClose,
}: InstitutionalLeadModalProps) {
  const [institutionName, setInstitutionName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [institutionType, setInstitutionType] = useState("Kendriya Vidyalaya (KVS)");
  const [smartboardCount, setSmartboardCount] = useState("10-25 Displays");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200 shadow-2xl space-y-6 text-gray-900 relative">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            Institutional B2B & KVS Licensing
          </div>
          <h2 className="text-2xl font-black text-gray-900 font-serif">
            School & District License Inquiry
          </h2>
          <p className="text-xs text-gray-600 font-medium">
            Deploy Teacher Sathi across all 75&quot; smartboards in your school, KVS cluster, or coaching institute with centralized admin management.
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-black text-emerald-950">Inquiry Received!</h3>
            <p className="text-xs text-emerald-800 font-medium">
              Our Institutional Lead Specialist will contact you within 4 hours to arrange a live pilot demonstration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Institution Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kendriya Vidyalaya No. 1, Delhi Cantt"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Contact Person / Principal
                </label>
                <input
                  type="text"
                  placeholder="Principal Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Mobile Number (India)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Institution Type
                </label>
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-bold bg-white cursor-pointer"
                >
                  <option value="Kendriya Vidyalaya (KVS)">Kendriya Vidyalaya (KVS)</option>
                  <option value="Jawahar Navodaya (JNV)">Jawahar Navodaya (JNV)</option>
                  <option value="State Govt School">State Govt School</option>
                  <option value="Private CBSE School">Private CBSE School</option>
                  <option value="Coaching Institute">Coaching Institute</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Estimated Smartboards
                </label>
                <select
                  value={smartboardCount}
                  onChange={(e) => setSmartboardCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-bold bg-white cursor-pointer"
                >
                  <option value="1-5 Displays">1-5 Displays</option>
                  <option value="5-15 Displays">5-15 Displays</option>
                  <option value="15-30 Displays">15-30 Displays</option>
                  <option value="30+ Displays (District Bundle)">30+ Displays (District Bundle)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-300" /> Request Institutional Demo & Quote
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
