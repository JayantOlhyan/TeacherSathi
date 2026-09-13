"use client";

import { useState, useEffect } from "react";
import { 
  Building2, CreditCard, DollarSign, TrendingUp, AlertTriangle, 
  ShieldCheck, RefreshCw, Loader2, ArrowLeft 
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

interface OverviewData {
  totalSchools: number;
  subscribedSchools: number;
  freeSchools: number;
  mrr: number;
  arr: number;
  planDistribution: Record<string, number>;
  pastDueSubscriptions: Array<{
    id: string;
    school_id: string;
    school_name: string;
    status: string;
    current_period_end: string;
    amount: number;
  }>;
}

export default function SuperAdminBillingPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/admin/overview");
      if (!res.ok) {
        if (res.status === 403) throw new Error("Forbidden: Super Administrator credentials required.");
        throw new Error("Failed to fetch billing overview");
      }
      const json = await res.json();
      setData(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-sm text-slate-400 font-semibold">Loading Global SaaS Billing Intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-4 text-white">
        <div className="p-6 bg-red-950/40 border border-red-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Access Restricted
          </div>
          <p className="text-xs text-red-200">{error || "Unable to load overview."}</p>
        </div>
        <Button onClick={fetchOverview} className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const mrrInRupees = (data.mrr / 100).toLocaleString("en-IN");
  const arrInRupees = (data.arr / 100).toLocaleString("en-IN");

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 p-2 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
            </Link>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            SaaS Billing &amp; Institutional Revenue Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global institutional metrics, MRR/ARR realization, and past-due account monitoring.
          </p>
        </div>

        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Superuser Verified
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F1424] p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" /> Total Schools
          </span>
          <p className="text-3xl font-black text-white">{data.totalSchools}</p>
          <p className="text-[11px] text-slate-400">
            {data.subscribedSchools} Paid &bull; {data.freeSchools} Free Tier
          </p>
        </div>

        <div className="bg-[#0F1424] p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Monthly Recurring (MRR)
          </span>
          <p className="text-3xl font-black text-emerald-400">₹{mrrInRupees}</p>
          <p className="text-[11px] text-slate-400">Normalized monthly run-rate</p>
        </div>

        <div className="bg-[#0F1424] p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-purple-400" /> Annual Recurring (ARR)
          </span>
          <p className="text-3xl font-black text-purple-400">₹{arrInRupees}</p>
          <p className="text-[11px] text-slate-400">Annual contracted volume</p>
        </div>

        <div className="bg-[#0F1424] p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Past-Due Accounts
          </span>
          <p className="text-3xl font-black text-amber-400">{data.pastDueSubscriptions.length}</p>
          <p className="text-[11px] text-slate-400">In 7-day grace period</p>
        </div>
      </div>

      {/* Plan Distribution Breakdown */}
      <div className="bg-[#0F1424] p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Plan Distribution Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Free Starter</span>
            <p className="text-2xl font-black text-slate-200 mt-1">{data.planDistribution.free || 0}</p>
          </div>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-blue-400 font-semibold">School Standard</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{data.planDistribution.school || 0}</p>
          </div>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-amber-400 font-semibold">School Pro</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{data.planDistribution["school-pro"] || 0}</p>
          </div>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-emerald-400 font-semibold">Enterprise (KVS)</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{data.planDistribution.enterprise || 0}</p>
          </div>
        </div>
      </div>

      {/* Past-Due Accounts Ledger */}
      <div className="bg-[#0F1424] rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          At-Risk &amp; Past-Due Subscriptions
        </h3>

        {data.pastDueSubscriptions.length === 0 ? (
          <p className="text-xs text-slate-500 font-medium">
            Zero past-due subscriptions. All institutional accounts are current.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">School Name</th>
                  <th className="p-3">Subscription ID</th>
                  <th className="p-3">Period End</th>
                  <th className="p-3">Plan Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {data.pastDueSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-white">{sub.school_name}</td>
                    <td className="p-3 font-mono text-slate-400">{sub.id.slice(0, 8)}...</td>
                    <td className="p-3">{new Date(sub.current_period_end).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-white">₹{(sub.amount / 100).toLocaleString("en-IN")}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
