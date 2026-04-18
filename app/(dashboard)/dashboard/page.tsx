"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { monitorsApi } from "@/lib/api";
import { queryKeys } from "@/constants/query-keys";
import { StatusBadge } from "@/components/common/status-badge";
import {
  TrendingUp,
  TrendingDown,
  Monitor,
  Heart,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: queryKeys.monitors({ page_size: 100 }),
    queryFn: () => monitorsApi.list({ page_index: 1, page_size: 100 }),
    refetchInterval: 30_000,
  });

  const rows = data?.data ?? [];

  const healthy = rows.filter((m) => m.current_state === "healthy").length;
  const degraded = rows.filter((m) => m.current_state === "degraded").length;
  const down = rows.filter((m) => m.current_state === "down").length;

  const total = rows.length;
  const healthyPercentage = total > 0 ? Math.round((healthy / total) * 100) : 0;

  // Find the most recent downtime (if any)
  const latestDowntime = rows
    .filter((m) => m.last_downtime_at)
    .sort(
      (a, b) =>
        new Date(b.last_downtime_at!).getTime() -
        new Date(a.last_downtime_at!).getTime(),
    )[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/monitors"
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Add Monitor
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Monitors"
          value={total}
          icon={<Monitor className="h-5 w-5" />}
          description={`${rows.length} active monitors`}
        />

        <StatCard
          label="Healthy"
          value={healthy}
          icon={<Heart className="h-5 w-5 text-emerald-500" />}
          description={`${healthyPercentage}% uptime`}
          trend="+2.4%" // Replace with real calculation later
          trendUp
          className="border-emerald-500/30 bg-emerald-950/20"
        />

        <StatCard
          label="Degraded"
          value={degraded}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          description="Performance issues"
          className="border-amber-500/30 bg-amber-950/20"
        />

        <StatCard
          label="Down"
          value={down}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          description={
            latestDowntime
              ? `Last downtime: ${new Date(latestDowntime.last_downtime_at!).toLocaleDateString()}`
              : "No recent downtime"
          }
          className="border-red-500/30 bg-red-950/20"
        />
      </div>

      {/* Monitors List */}
      <div className="rounded-lg border border-border/50 bg-card/40 p-6">
        <h2 className="mb-4 text-lg font-medium">All Monitors</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => (
            <Link
              key={m.uuid}
              href={`/monitors/${m.uuid}`}
              className="group rounded-xl border border-border/50 bg-card/60 p-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-base">{m.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                    {m.target}
                  </div>
                </div>
                <StatusBadge state={m.current_state || "degraded"} />
              </div>

              <div className="mt-4 text-xs text-zinc-500 flex items-center gap-2">
                {m.type.toUpperCase()} • Last Downtime{" "}
                {m.last_downtime_at
                  ? new Date(m.last_downtime_at).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ": Never gone down"}
              </div>
            </Link>
          ))}

          {rows.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-500">
              No monitors yet. Create your first monitor to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  description,
  trend,
  trendUp,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 transition-all hover:shadow-md ${className || "border-border/50 bg-card/40"}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">{label}</div>
        <div className="text-zinc-500">{icon}</div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tabular-nums">{value}</div>
        {trend && (
          <div
            className={`flex items-center text-xs font-medium ${
              trendUp ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {trendUp ? (
              <TrendingUp className="h-3 w-3 mr-0.5" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-0.5" />
            )}
            {trend}
          </div>
        )}
      </div>

      {description && (
        <div className="mt-1 text-sm text-zinc-400">{description}</div>
      )}
    </div>
  );
}
