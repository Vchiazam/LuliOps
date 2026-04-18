//@ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { monitorsApi } from "@/lib/api";
import { queryKeys } from "@/constants/query-keys";
import { StatusBadge } from "@/components/common/status-badge";
import { toast } from "sonner";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Heart,
  Trash2,
  Activity,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function MonitorDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const qc = useQueryClient();

  const { data: monitor } = useQuery({
    queryKey: queryKeys.monitor(uuid),
    queryFn: () => monitorsApi.detail(uuid),
  });

  const { data: historyData } = useQuery({
    queryKey: queryKeys.history({ monitor_id: uuid, page_size: 100 }),
    queryFn: () =>
      monitorsApi.history({ monitor_id: uuid, page_index: 1, page_size: 100 }),
  });

  const history = historyData?.data ?? [];

  // Prepare chart data (oldest → newest for natural time flow)
  const chartData = [...history]
    .sort(
      (a, b) =>
        new Date(a.date_created).getTime() - new Date(b.date_created).getTime(),
    )
    .map((h) => ({
      timestamp: format(parseISO(h.date_created), "HH:mm"),
      fullTime: h.date_created,
      latency: h.latency_ms ?? 0,
      jitter: h.jitter_ms ?? 0,
      packetLoss: h.packet_loss ?? 0,
      success: h.success ? 100 : 0,
      state: h.new_state,
    }));

  // Calculate key metrics
  const avgLatency = chartData.length
    ? (
        chartData.reduce((sum, d) => sum + (d.latency || 0), 0) /
        chartData.length
      ).toFixed(0)
    : 0;

  const successRate = chartData.length
    ? (
        (chartData.filter((d) => d.success === 100).length / chartData.length) *
        100
      ).toFixed(1)
    : 0;

  const deleteMutation = useMutation({
    mutationFn: () => monitorsApi.remove(uuid),
    onSuccess: () => {
      toast.success("Monitor deleted successfully");
      qc.invalidateQueries({ queryKey: queryKeys.monitors() });
      window.history.back();
    },
  });

  if (!monitor)
    return <div className="p-8 text-center">Loading monitor...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-[#1a0026] to-[#0f0017] p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{monitor.name}</h1>
              <StatusBadge state={monitor.current_state || "degraded"} />
            </div>
            <p className="text-2xl text-zinc-400 font-mono mt-1">
              {monitor.target}
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              {monitor.type.toUpperCase()} • Created{" "}
              {format(parseISO(monitor.date_created), "PPP")}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Heart className="h-5 w-5" /> {monitor.consecutive_healthy}{" "}
              consecutive healthy checks
            </div>
            {monitor.last_downtime_at && (
              <div className="text-sm text-rose-400">
                Last downtime:{" "}
                {format(parseISO(monitor.last_downtime_at), "PPp")}
              </div>
            )}
            <button
              onClick={() => deleteMutation.mutate()}
              className="flex items-center gap-2 rounded-lg bg-rose-600/80 px-5 py-2.5 text-sm font-medium hover:bg-rose-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete Monitor
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
          <div className="text-sm text-zinc-400">Avg Latency</div>
          <div className="text-4xl font-semibold mt-2 tabular-nums">
            {avgLatency} <span className="text-xl">ms</span>
          </div>
          <div className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Good response
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
          <div className="text-sm text-zinc-400">Success Rate</div>
          <div className="text-4xl font-semibold mt-2 tabular-nums">
            {successRate}%
          </div>
          <div className="text-emerald-400 text-sm mt-1">Last 200 checks</div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
          <div className="text-sm text-zinc-400">Current State</div>
          <div className="mt-3">
            <StatusBadge state={monitor.current_state || "degraded"} />
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
          <div className="text-sm text-zinc-400">Last Check</div>
          <div className="text-2xl font-medium mt-2">
            {chartData.length
              ? format(
                  parseISO(chartData[chartData.length - 1].fullTime),
                  "HH:mm:ss",
                )
              : "—"}
          </div>
        </div>
      </div>

      {/* PHENOMENAL PHYSICS GRAPH - SINGLE COMBINED VIEW */}
      {/* MODERN NETWORK PERFORMANCE GRAPH */}
      <div className="rounded-3xl border border-border/50 bg-card/40 p-8 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-7 w-7 text-cyan-400" />
              Network Performance
            </h2>
            <p className="text-zinc-400 text-lg mt-1">
              Latency • Jitter • Packet Loss
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 ring-1 ring-cyan-400/30"></div>
              <span className="text-zinc-400">Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-400 ring-1 ring-orange-400/30"></div>
              <span className="text-zinc-400">Jitter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-1 ring-rose-500/30"></div>
              <span className="text-zinc-400">Packet Loss</span>
            </div>
            <div className="text-zinc-500 text-xs font-mono tracking-widest">
              LAST {chartData.length} CHECKS
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 30, right: 40, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="latencyGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="jitterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="2 2"
                stroke="#27272a"
                opacity={0.6}
              />

              <XAxis
                dataKey="timestamp"
                stroke="#52525b"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#52525b"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit=" ms"
                domain={[0, "dataMax"]}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#52525b"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />

              {/* Tooltip with Full Date & Time */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                  padding: "12px 16px",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#e4e4e7", fontWeight: 600 }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const fullTime = payload[0].payload.fullTime;
                    return format(
                      parseISO(fullTime),
                      "MMM dd, yyyy • HH:mm:ss",
                    );
                  }
                  return label;
                }}
                formatter={(value: number, name: string) => [
                  name.includes("Loss") ? `${value}%` : `${value} ms`,
                  name.replace(" (ms)", "").replace(" (%)", ""),
                ]}
              />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="rect"
                wrapperStyle={{
                  fontSize: "12.5px",
                  color: "#d1d5db",
                  paddingBottom: 16,
                  paddingRight: 20,
                }}
              />

              {/* Latency */}
              <Area
                yAxisId="left"
                type="natural"
                dataKey="latency"
                stroke="#22d3ee"
                strokeWidth={3.5}
                fill="url(#latencyGradient)"
                name="Latency (ms)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#22d3ee",
                  stroke: "#09090b",
                  strokeWidth: 2,
                }}
              />

              {/* Jitter */}
              <Area
                yAxisId="left"
                type="natural"
                dataKey="jitter"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#jitterGradient)"
                name="Jitter (ms)"
                dot={false}
                activeDot={{ r: 5, fill: "#f97316" }}
              />

              {/* Packet Loss - semi-transparent bars, full on hover */}
              <Bar
                yAxisId="right"
                dataKey="packetLoss"
                fill="#e11d48"
                radius={[2, 2, 0, 0]}
                barSize={6}
                name="Packet Loss (%)"
                opacity={0.65}
                activeBar={{ opacity: 1 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-center gap-x-8 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">━━</span> Latency (lower = better)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-400">━━</span> Jitter (variance)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-rose-500">▮</span> Packet Loss
          </div>
        </div>
      </div>

      {/* State History Timeline (kept as-is - perfect complement) */}
      <div className="rounded-3xl border border-border/50 bg-card/40 p-8">
        <h2 className="text-xl font-semibold mb-6">State Changes Timeline</h2>
        <div className="space-y-4 max-h-96 overflow-auto pr-4">
          {history.slice(0, 30).map((h, i) => (
            <div
              key={h.uuid}
              className="flex gap-4 items-start border-l-2 border-primary/30 pl-6 relative"
            >
              <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">
                    {format(parseISO(h.date_created), "MMM dd, HH:mm:ss")}
                  </span>

                  <StatusBadge state={h.new_state || "degraded"} />
                  {h.previous_state && (
                    <span className="text-xs text-zinc-500">
                      ← {h.previous_state}
                    </span>
                  )}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {h.success
                    ? "✅ Check passed"
                    : "❌ " + (h.error_message || "Failed")}
                </div>
                {h.latency_ms && (
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Latency: {h.latency_ms}ms • Jitter: {h.jitter_ms}ms • Loss:{" "}
                    {h.packet_loss}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Recent Checks Table */}
      {history.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card/40 p-6">
          <h2 className="font-medium mb-4">Recent Raw Checks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left text-zinc-400">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">From → To</th>
                  <th className="pb-3">Latency</th>
                  <th className="pb-3">Jitter</th>
                  <th className="pb-3">Loss %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {history.slice(0, 15).map((h) => (
                  <tr key={h.uuid} className="hover:bg-zinc-900/50">
                    <td className="py-3 text-zinc-400">
                      {format(parseISO(h.date_created), "HH:mm:ss")}
                    </td>
                    <td className="py-3">
                      <span className="text-rose-400">{h.previous_state}</span>{" "}
                      →
                      <span className="text-emerald-400 ml-1">
                        {h.new_state}
                      </span>
                    </td>
                    <td className="py-3 font-mono">{h.latency_ms} ms</td>
                    <td className="py-3 font-mono text-amber-400">
                      {h.jitter_ms} ms
                    </td>
                    <td className="py-3 font-mono text-red-400">
                      {h.packet_loss}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
