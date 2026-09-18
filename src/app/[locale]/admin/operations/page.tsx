"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Flame,
  RefreshCw,
  RotateCcw,
  Server,
  Trash2,
} from "lucide-react";

interface HealthData {
  status: "LIVE" | "READY" | "DEGRADED";
  uptimeSeconds: number;
  dependencies: {
    database: { status: string; latencyMs?: number };
    aiProvider: { status: string };
    storage: { status: string };
    queue: { status: string };
  };
  metrics: {
    totalRequests: number;
    error5xxCount: number;
    activeDeadLetters: number;
  };
}

interface DeadLetterJob {
  id: string;
  originalJobId: string;
  jobType: string;
  queueName: string;
  failureReason: string;
  retryCount: number;
  status: "DEAD" | "REQUEUED" | "PURGED";
  lastAttemptedAt: string;
}

interface FeatureFlag {
  id: string;
  flagKey: string;
  description?: string;
  isEnabled: boolean;
  scope: string;
  rolloutPercentage: number;
  targetIds: string[];
}

export default function AdminOperationsPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [jobs, setJobs] = useState<DeadLetterJob[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [operatorReason, setOperatorReason] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "dlq" | "flags">("overview");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch health
      const healthRes = await fetch("/api/health");
      if (healthRes.ok) {
        const healthJson = await healthRes.json();
        setHealth(healthJson);
      }

      // 2. Fetch dead letters
      const jobsRes = await fetch("/api/admin/operations/jobs?status=DEAD");
      if (jobsRes.ok) {
        const jobsJson = await jobsRes.json();
        setJobs(jobsJson.jobs || []);
      }

      // 3. Fetch feature flags
      const flagsRes = await fetch("/api/admin/operations/feature-flags");
      if (flagsRes.ok) {
        const flagsJson = await flagsRes.json();
        setFlags(flagsJson.flags || []);
      }
    } catch {
      // Fallback in simulated environment
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 15000); // 15s refresh
    return () => clearInterval(timer);
  }, [fetchData]);

  const handleRequeue = async (deadLetterId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/operations/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadLetterId,
          operatorNotes: operatorReason || "Operator manual retry from console",
        }),
      });
      if (res.ok) {
        setOperatorReason("");
        await fetchData();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurge = async (deadLetterId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/operations/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadLetterId,
          operatorNotes: operatorReason || "Operator manual purge from console",
        }),
      });
      if (res.ok) {
        setOperatorReason("");
        await fetchData();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFlag = async (flag: FeatureFlag) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/operations/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flagKey: flag.flagKey,
          isEnabled: !flag.isEnabled,
          scope: flag.scope,
          rolloutPercentage: flag.rolloutPercentage,
          reason: `Operator toggled ${flag.flagKey} to ${!flag.isEnabled ? "ENABLED" : "DISABLED"}`,
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Platform Operations Console
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              RESTRICTED
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Production system telemetry, dead-letter recovery, circuit-breakers, and feature rollouts.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          System Health
        </button>
        <button
          onClick={() => setActiveTab("dlq")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === "dlq"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Dead-Letter Queue
          {jobs.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-full">
              {jobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("flags")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
            activeTab === "flags"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Feature Flags
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Platform Status</span>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {health?.status || "READY"}
                </span>
                <span className="text-xs text-emerald-600 font-medium">SLO Healthy</span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Uptime</span>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {health ? formatUptime(health.uptimeSeconds) : "0d 0h 0m"}
                </span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Invocations</span>
                <Server className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {health?.metrics.totalRequests.toLocaleString() || "0"}
                </span>
                <span className="text-xs text-gray-500">API Calls</span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dead Letters</span>
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${jobs.length > 0 ? "text-amber-600" : "text-gray-900 dark:text-white"}`}>
                  {jobs.length}
                </span>
                <span className="text-xs text-gray-500">Action Required</span>
              </div>
            </div>
          </div>

          {/* Core Dependencies */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Subsystem Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">PostgreSQL DB</div>
                    <div className="text-xs text-gray-500">
                      {health?.dependencies.database.latencyMs ? `${health.dependencies.database.latencyMs}ms` : "Operational"}
                    </div>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">AI Engine</div>
                    <div className="text-xs text-gray-500">{health?.dependencies.aiProvider.status || "HEALTHY"}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Asset Storage</div>
                    <div className="text-xs text-gray-500">{health?.dependencies.storage.status || "HEALTHY"}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Job Queues</div>
                    <div className="text-xs text-gray-500">{health?.dependencies.queue.status || "HEALTHY"}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dead-Letter Queue Tab */}
      {activeTab === "dlq" && (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dead-Letter Queue (DLQ)</h2>
              <p className="text-sm text-gray-500">Jobs that exceeded max retry thresholds quarantined for inspection.</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">DLQ is clean</h3>
              <p className="text-sm text-gray-500 mt-1">No permanently failed jobs are waiting for manual intervention.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase font-semibold text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Job ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Failure Reason</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Last Attempt</th>
                    <th className="px-4 py-3 text-right">Operator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-white">{job.originalJobId}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{job.jobType}</td>
                      <td className="px-4 py-3 text-red-600 dark:text-red-400 max-w-xs truncate">{job.failureReason}</td>
                      <td className="px-4 py-3">{job.retryCount}</td>
                      <td className="px-4 py-3 text-xs">{new Date(job.lastAttemptedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleRequeue(job.id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 rounded text-xs font-medium"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Requeue
                        </button>
                        <button
                          onClick={() => handlePurge(job.id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 rounded text-xs font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Purge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Feature Flags Tab */}
      {activeTab === "flags" && (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Feature Flag Management</h2>
            <p className="text-sm text-gray-500">Control progressive rollouts and instant platform kill-switches.</p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {flags.map((flag) => (
              <div key={flag.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{flag.flagKey}</span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded font-mono">
                      {flag.scope}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded">
                      {flag.rolloutPercentage}% Rollout
                    </span>
                  </div>
                  {flag.description && <p className="text-xs text-gray-500 mt-1">{flag.description}</p>}
                </div>

                <button
                  onClick={() => handleToggleFlag(flag)}
                  disabled={actionLoading}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    flag.isEnabled
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-400"
                  }`}
                >
                  {flag.isEnabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
