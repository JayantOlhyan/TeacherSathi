"use client";

import { useState } from "react";
import { 
  Save, 
  ShieldCheck, 
  Globe, 
  CheckCircle2,
  Lock
} from "lucide-react";
import { InstitutionalScope } from "@/lib/validations/institution";

export default function InstitutionalSettingsPage() {
  const [scopeType, setScopeType] = useState<InstitutionalScope>("STATE");
  const [scopeId, setScopeId] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [aiAvailability, setAiAvailability] = useState("UNRESTRICTED");
  const [passingPercentage, setPassingPercentage] = useState(40);
  const [masteryThreshold, setMasteryThreshold] = useState(75);
  const [minimumCohortSize, setMinimumCohortSize] = useState(10);
  const [crossSchoolResources, setCrossSchoolResources] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scopeId) {
      alert("Please enter the target Scope UUID");
      return;
    }

    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/admin/institutional/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope_type: scopeType,
          scope_id: scopeId,
          settings: {
            default_language: defaultLanguage,
            ai_availability: aiAvailability,
            minimum_passing_percentage: Number(passingPercentage),
            mastery_threshold_percentage: Number(masteryThreshold),
            minimum_cohort_size: Number(minimumCohortSize),
            allow_cross_school_resources: crossSchoolResources,
          },
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save settings");
      }
    } catch {
      alert("Network error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Policy & Configuration
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-bold text-gray-500">Cascading Inheritance Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
          Institutional Governance & Policies
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
          Configure educational thresholds, student privacy bounds, language defaults, and feature entitlements. Policies cascade from State → District → Organization → School.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Scope Identification */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> Target Governance Scope
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Scope Tier</label>
              <select
                value={scopeType}
                onChange={(e) => setScopeType(e.target.value as InstitutionalScope)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold focus:bg-white focus:outline-none"
              >
                <option value="STATE">State Level (Highest Tier)</option>
                <option value="DISTRICT">District Level</option>
                <option value="ORGANIZATION">School Network / Organization</option>
                <option value="SCHOOL">Individual School (Local Override)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Scope Target UUID *</label>
              <input
                type="text"
                required
                value={scopeId}
                onChange={(e) => setScopeId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Academic & Privacy Rules */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Academic Standards & Privacy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Min Passing Grade (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Default: 40%</span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mastery Benchmark (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={masteryThreshold}
                onChange={(e) => setMasteryThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Default: 75%</span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Min Privacy Cohort (N)</label>
              <input
                type="number"
                min="5"
                max="50"
                value={minimumCohortSize}
                onChange={(e) => setMinimumCohortSize(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Masks data if cohort &lt; N</span>
            </div>
          </div>
        </div>

        {/* Feature Entitlements & Language */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" /> Platform & Localization Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Default Platform Language</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:bg-white focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="bilingual">Bilingual (English + Hindi)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">AI Co-Pilot Availability</label>
              <select
                value={aiAvailability}
                onChange={(e) => setAiAvailability(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:bg-white focus:outline-none"
              >
                <option value="UNRESTRICTED">Unrestricted (Within SaaS Quota)</option>
                <option value="QUOTA_LIMITED">Quota Limited (Conservative)</option>
                <option value="DISABLED">Disabled Across Jurisdiction</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block">Cross-School Resource Sharing</span>
              <span className="text-[11px] text-gray-400">
                Allow teachers within this network/district to discover and clone published slide decks.
              </span>
            </div>
            <input
              type="checkbox"
              checked={crossSchoolResources}
              onChange={(e) => setCrossSchoolResources(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> Policies Saved Successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-2xs cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving Policies..." : "Commit Governance Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
