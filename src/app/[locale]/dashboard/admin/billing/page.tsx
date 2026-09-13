"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  CreditCard, ShieldCheck, AlertTriangle, ArrowUpRight, 
  Calendar, Users, BookOpen, Tv, Sparkles, RefreshCw, X, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SubscriptionInfo {
  id: string;
  school_id: string;
  provider?: string;
  status: string;
  billing_interval: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  plan?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
  };
}

interface EntitlementsInfo {
  planSlug: string;
  planName: string;
  subscriptionStatus: string;
  inGracePeriod: boolean;
  entitlements: Record<string, number>;
  featureFlags: Record<string, boolean>;
}

interface UsageInfo {
  teachers: number;
  students: number;
  classes: number;
  smartboards: number;
  aiGenerations: number;
  storageMb: number;
}

interface PaymentItem {
  id: string;
  provider_payment_id: string | null;
  provider_order_id: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export default function SchoolAdminBillingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subData, setSubData] = useState<{
    subscription: SubscriptionInfo;
    entitlements: EntitlementsInfo;
    usage: UsageInfo;
  } | null>(null);

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadBillingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subRes, payRes] = await Promise.all([
        fetch("/api/billing/subscription"),
        fetch("/api/billing/payments"),
      ]);

      if (!subRes.ok) {
        if (subRes.status === 403) {
          throw new Error("Access restricted: Only School Administrators can view billing management.");
        }
        throw new Error("Failed to load subscription data");
      }

      const subJson = await subRes.json();
      setSubData(subJson.data);

      if (payRes.ok) {
        const payJson = await payRes.json();
        setPayments(payJson.data || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading billing";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  const handleUpgrade = async (targetPlanSlug: string) => {
    if (!subData) return;
    setActionLoading(true);
    setNotification(null);

    try {
      const res = await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: subData.subscription.school_id,
          targetPlanSlug,
          immediate: true,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Plan change failed");

      setNotification(json.data.message || "Plan updated successfully!");
      setIsUpgradeModalOpen(false);
      await loadBillingData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Plan change failed";
      setNotification(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subData) return;
    setActionLoading(true);
    setNotification(null);

    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: subData.subscription.school_id,
          reason: "School admin cancellation request",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Cancellation request failed");

      setNotification(json.data.message || "Subscription cancellation scheduled.");
      setIsCancelModalOpen(false);
      await loadBillingData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cancellation failed";
      setNotification(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading School Billing &amp; Subscription...</p>
      </div>
    );
  }

  if (error || !subData) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-900 space-y-2">
          <div className="flex items-center gap-2 font-black text-base">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Billing Error
          </div>
          <p className="text-sm">{error || "Unable to retrieve school subscription."}</p>
        </div>
        <Button onClick={loadBillingData} className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  const { subscription, entitlements, usage } = subData;
  const isPastDue = subscription.status === "PAST_DUE";
  const planPriceFormatted = subscription.plan?.price 
    ? `₹${(subscription.plan.price / 100).toLocaleString("en-IN")}` 
    : "₹0 Free";

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            Institutional SaaS Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            School Subscription &amp; Billing Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your school&apos;s active plan, seat allocations, AI generation quotas, and GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="rounded-xl bg-[#14532D] hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Change Plan
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Past Due Grace Period Alert */}
      {isPastDue && (
        <div className="p-5 bg-amber-500/10 border-2 border-amber-500 rounded-3xl flex items-start gap-4 text-amber-950">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm">Payment Past Due (7-Day Grace Period Active)</h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              Your previous invoice payment failed. Your teachers and students retain reading access, but new AI generations and class creations are paused until renewed.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl py-2 px-4 shadow-sm"
              >
                Renew Subscription Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Subscription Card */}
      <div className="bg-[#123524] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black">{entitlements.planName}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                subscription.status === "ACTIVE" 
                  ? "bg-emerald-400 text-slate-950" 
                  : subscription.status === "PAST_DUE"
                  ? "bg-amber-400 text-slate-950"
                  : "bg-red-400 text-slate-950"
              }`}>
                {subscription.status}
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Provider: {subscription.provider} &bull; {subscription.billing_interval} billing
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-3xl font-black">{planPriceFormatted}</div>
            <span className="text-xs text-emerald-300">
              {subscription.cancel_at_period_end ? "Expires on: " : "Renews on: "}
              {new Date(subscription.current_period_end).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {subscription.cancel_at_period_end && (
          <div className="p-3 bg-amber-400/20 border border-amber-400/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            Cancellation requested: Full plan access continues until {new Date(subscription.current_period_end).toLocaleDateString()}.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-6 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Current Period: {new Date(subscription.current_period_start).toLocaleDateString()} &ndash; {new Date(subscription.current_period_end).toLocaleDateString()}</span>
            </div>
          </div>

          {!subscription.cancel_at_period_end && subscription.plan?.slug !== "free" && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-xs text-red-300 hover:text-red-100 underline cursor-pointer"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Quota & Usage Progress Bars */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          Live Quota &amp; Resource Allocation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Teachers Quota */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-4 h-4 text-emerald-600" /> Teachers
              </span>
              <span>{usage.teachers} / {entitlements.entitlements.TEACHER_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((usage.teachers / entitlements.entitlements.TEACHER_LIMIT) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {Math.max(0, entitlements.entitlements.TEACHER_LIMIT - usage.teachers)} teacher seats remaining
            </p>
          </div>

          {/* Students Quota */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-4 h-4 text-blue-600" /> Students
              </span>
              <span>{usage.students} / {entitlements.entitlements.STUDENT_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((usage.students / entitlements.entitlements.STUDENT_LIMIT) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {Math.max(0, entitlements.entitlements.STUDENT_LIMIT - usage.students)} student seats remaining
            </p>
          </div>

          {/* Classes Quota */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-slate-800">
                <BookOpen className="w-4 h-4 text-purple-600" /> Classes
              </span>
              <span>{usage.classes} / {entitlements.entitlements.CLASS_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((usage.classes / entitlements.entitlements.CLASS_LIMIT) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {Math.max(0, entitlements.entitlements.CLASS_LIMIT - usage.classes)} class rosters remaining
            </p>
          </div>

          {/* Smartboards Quota */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Tv className="w-4 h-4 text-amber-600" /> 75&quot; Smartboards
              </span>
              <span>{usage.smartboards} / {entitlements.entitlements.SMARTBOARD_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((usage.smartboards / entitlements.entitlements.SMARTBOARD_LIMIT) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {Math.max(0, entitlements.entitlements.SMARTBOARD_LIMIT - usage.smartboards)} displays available
            </p>
          </div>

          {/* AI Generations Monthly Quota */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-600" /> AI Generations
              </span>
              <span>{usage.aiGenerations} / {entitlements.entitlements.AI_GENERATION_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((usage.aiGenerations / entitlements.entitlements.AI_GENERATION_LIMIT) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Resets on the 1st of next month
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Invoice History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-700" />
          Payment History &amp; Invoices
        </h3>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 font-medium">
              No historical payment invoices found. Free tier usage does not generate payment records.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Receipt / Order ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {p.provider_payment_id || p.provider_order_id || p.id.slice(0, 8)}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        ₹{(p.amount / 100).toLocaleString("en-IN")} {p.currency}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(p.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-900"
                            : p.status === "PENDING"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-red-100 text-red-900"
                        }`}>
                          {p.status}
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

      {/* Plan Upgrade Dialog Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-gray-200 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black text-slate-900 font-serif">Select Institutional Plan</h2>
              <p className="text-xs text-gray-500 mt-1">
                Choose the capacity profile that best fits your school&apos;s educator headcount.
              </p>
            </div>

            <div className="space-y-3">
              {/* School Standard */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">School Standard</h4>
                  <p className="text-xs text-gray-500">15 Teachers &bull; 350 Students &bull; 5 Smartboards</p>
                  <span className="text-xs font-bold text-emerald-700">₹4,999 / year</span>
                </div>
                <Button
                  onClick={() => handleUpgrade("school")}
                  disabled={actionLoading}
                  className="rounded-xl py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-xs font-bold text-white"
                >
                  Select
                </Button>
              </div>

              {/* School Pro */}
              <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900">School Pro</h4>
                    <span className="text-[9px] font-black bg-amber-400 px-2 py-0.5 rounded-full text-slate-950">RECOMMENDED</span>
                  </div>
                  <p className="text-xs text-gray-500">50 Teachers &bull; 1,200 Students &bull; 15 Smartboards</p>
                  <span className="text-xs font-bold text-emerald-800">₹9,999 / year</span>
                </div>
                <Button
                  onClick={() => handleUpgrade("school-pro")}
                  disabled={actionLoading}
                  className="rounded-xl py-2 px-4 bg-amber-400 hover:bg-amber-500 text-xs font-black text-slate-950 shadow-sm"
                >
                  Select
                </Button>
              </div>

              {/* Free Plan Downgrade */}
              <div className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-700">Starter Free Tier</h4>
                  <p className="text-xs text-gray-400">3 Teachers &bull; 60 Students &bull; 1 Smartboard</p>
                  <span className="text-xs font-bold text-gray-500">₹0 Free</span>
                </div>
                <Button
                  onClick={() => handleUpgrade("free")}
                  disabled={actionLoading}
                  variant="secondary"
                  className="rounded-xl py-2 px-4 text-xs font-bold"
                >
                  Downgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Cancel School Subscription?</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your school will retain full plan capabilities until the end of the current billing cycle on{" "}
                <span className="font-bold">{new Date(subscription.current_period_end).toLocaleDateString()}</span>.
                After this date, the school will transition to the Free Starter tier. Academic data is never deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsCancelModalOpen(false)}
                variant="secondary"
                className="flex-1 rounded-xl py-2.5 text-xs font-bold"
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="flex-1 rounded-xl py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
