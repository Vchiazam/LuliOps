import { MonitorState } from "@/types/api";
import { cn } from "@/lib/utils";

const stateClassMap: Record<MonitorState, string> = {
  healthy: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  degraded: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  down: "bg-rose-500/20 text-rose-300 border-rose-400/30"
};

export function StatusBadge({ state }: { state: MonitorState }) {
  return <span className={cn("rounded border px-2 py-1 text-xs capitalize", stateClassMap[state])}>{state}</span>;
}
