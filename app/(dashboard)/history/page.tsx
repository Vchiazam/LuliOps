"use client";

import { useQuery } from "@tanstack/react-query";
import { monitorsApi } from "@/lib/api";
import { queryKeys } from "@/constants/query-keys";

export default function HistoryPage() {
  const { data } = useQuery({
    queryKey: queryKeys.history(),
    queryFn: () => monitorsApi.history({ page_index: 1, page_size: 20 }),
    refetchInterval: 30_000
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">History</h1>
      <div className="rounded-lg border border-border/50 bg-card/40 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-300">
              <th>Monitor</th>
              <th>Transition</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((item) => (
              <tr key={item.uuid} className="border-t border-border/30">
                <td className="py-2">{item.monitor.name}</td>
                <td>{item.previous_state} -&gt; {item.new_state}</td>
                <td>{new Date(item.date_created).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
