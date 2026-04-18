"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import { monitorInSchema } from "@/lib/validators/schemas";
import { monitorsApi } from "@/lib/api";
import { queryKeys } from "@/constants/query-keys";
import type { MonitorInSchema } from "@/types/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Search,
  Pause,
  Play,
  Monitor,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function MonitorsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingMonitor, setEditingMonitor] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.monitors(),
    queryFn: () => monitorsApi.list({ page_index: 1, page_size: 100 }),
  });

  const monitors = data?.data ?? [];

  // Simple client-side search + filter
  const filteredMonitors = useMemo(() => {
    return monitors.filter(
      (m: any) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.target.toLowerCase().includes(search.toLowerCase()),
    );
  }, [monitors, search]);

  const toggleActiveMutation = useMutation({
    mutationFn: ({ uuid, is_active }: { uuid: string; is_active: boolean }) =>
      monitorsApi.update(uuid, { is_active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.monitors() });
      toast.success("Monitor status updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => monitorsApi.remove(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.monitors() });
      setSelectedRows([]);
      toast.success("Monitor deleted");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (uuids: string[]) => {
      await Promise.all(uuids.map((uuid) => monitorsApi.remove(uuid)));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.monitors() });
      setSelectedRows([]);
      toast.success(`${selectedRows.length} monitors deleted`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: Partial<MonitorInSchema>;
    }) => monitorsApi.update(uuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.monitors() });
      setEditingMonitor(null);
      toast.success("Monitor updated");
    },
  });

  const form = useForm<MonitorInSchema>({
    resolver: zodResolver(monitorInSchema),
    defaultValues: { name: "", target: "", type: "ping", is_active: true },
  });

  const editForm = useForm<MonitorInSchema>({
    resolver: zodResolver(monitorInSchema),
  });

  // For demo: calculate fake uptime (replace with real logic from history)
  const getUptime = (monitor: any) => {
    // In real app, compute from history checks
    return Math.floor(Math.random() * 15) + 85; // 85-99%
  };
  const createMutation = useMutation({
    mutationFn: monitorsApi.create,
    onSuccess: () => {
      toast.success("Monitor created successfully");
      qc.invalidateQueries({ queryKey: queryKeys.monitors() });
      form.reset();
    },
    onError: () => {
      toast.error("Failed to create monitor");
    },
  });

  const getLastChecked = (monitor: any) => {
    // In real app, use latest history entry
    return monitor.date_created
      ? format(parseISO(monitor.date_created), "MMM dd, HH:mm")
      : "—";
  };

  return (
    <div className="space-y-8">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitors</h1>
          <p className="text-zinc-400">Manage your uptime checks</p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search monitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#2a0038] border-[#3a0048]"
            />
          </div>
          <Button
            onClick={() =>
              document
                .getElementById("create-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Monitor
          </Button>
        </div>
      </div>
      <Card
        id="create-monitor"
        className="border border-border/50 bg-[#1a0026]/70"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Create New Monitor
          </CardTitle>
          <CardDescription>
            Add a new service, website, or server to monitor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((v) => createMutation.mutate(v))}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div className="md:col-span-2">
              <label className="text-sm text-zinc-400 mb-1 block">
                Monitor Name
              </label>
              <Input
                placeholder="My API Server"
                {...form.register("name")}
                className="bg-[#2a0038] border-[#3a0048] focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-zinc-400 mb-1 block">Target</label>
              <Input
                placeholder="https://api.example.com or 8.8.8.8"
                {...form.register("target")}
                className="bg-[#2a0038] border-[#3a0048] focus:border-primary font-mono"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Type</label>
              <Select
                onValueChange={(value) => form.setValue("type", value as any)}
                defaultValue={form.getValues("type")}
              >
                <SelectTrigger className="bg-[#2a0038] border-[#3a0048]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ping">Ping (ICMP)</SelectItem>
                  <SelectItem value="http">HTTP / HTTPS</SelectItem>
                  <SelectItem value="tcp">TCP Port</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full h-10 bg-primary hover:bg-primary/90"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Monitor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 bg-[#2a0038] border border-border/50 rounded-xl px-5 py-3">
          <span className="text-sm text-zinc-400">
            {selectedRows.length} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => bulkDeleteMutation.mutate(selectedRows)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRows([])}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="border border-border/50 bg-card/40 overflow-hidden">
        <CardHeader>
          <CardTitle>All Monitors ({filteredMonitors.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-[#1a0026] border-b border-border/50">
                <tr className="text-left text-sm text-zinc-400">
                  <th className="px-6 py-4 w-12">
                    <Checkbox
                      checked={
                        selectedRows.length === filteredMonitors.length &&
                        filteredMonitors.length > 0
                      }
                      onCheckedChange={(checked) =>
                        setSelectedRows(
                          checked
                            ? filteredMonitors.map((m: any) => m.uuid)
                            : [],
                        )
                      }
                    />
                  </th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Uptime</th>
                  <th className="px-6 py-4">Last Checked</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4 w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredMonitors.map((m: any) => (
                  <tr
                    key={m.uuid}
                    className="hover:bg-[#2a0038]/60 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <Checkbox
                        checked={selectedRows.includes(m.uuid)}
                        onCheckedChange={(checked) =>
                          setSelectedRows((prev) =>
                            checked
                              ? [...prev, m.uuid]
                              : prev.filter((id) => id !== m.uuid),
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={`/monitors/${m.uuid}`}
                        className="font-medium hover:text-primary"
                      >
                        {m.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5 uppercase text-xs font-mono tracking-widest text-zinc-500">
                      {m.type}
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-zinc-300 break-all">
                      {m.target}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge state={m.current_state} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-mono text-emerald-400">
                        {getUptime(m)}%
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-400">
                      {getLastChecked(m)}
                    </td>
                    <td className="px-6 py-5">
                      <Checkbox
                        checked={m.is_active}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({
                            uuid: m.uuid,
                            //@ts-expect-error type error
                            is_active: checked,
                          })
                        }
                      />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingMonitor(m);
                              editForm.reset(m);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-500"
                            onClick={() => deleteMutation.mutate(m.uuid)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMonitors.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              No monitors found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Monitor */}
      <Card
        id="create-form"
        className="border border-border/50 bg-[#1a0026]/70"
      >
        <CardHeader>
          <CardTitle>Create New Monitor</CardTitle>
          <CardDescription>
            Add a new service or endpoint to monitor
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMonitor}
        onOpenChange={() => setEditingMonitor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Monitor</DialogTitle>
          </DialogHeader>
          {/* Add form fields inside here using editForm */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMonitor(null)}>
              Cancel
            </Button>
            <Button
              onClick={editForm.handleSubmit((v) => {
                if (editingMonitor)
                  updateMutation.mutate({ uuid: editingMonitor.uuid, data: v });
              })}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
