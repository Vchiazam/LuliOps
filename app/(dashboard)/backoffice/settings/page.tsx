//@ts-nocheck
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Save, Bell, Mail, MessageCircle, Plus, X, Clock } from "lucide-react";
import { toast } from "sonner";

import { backofficeApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function BackofficeSettingsPage() {
  const qc = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [newTelegramId, setNewTelegramId] = useState("");
  const [combineWindow, setCombineWindow] = useState(60);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: backofficeApi.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: any) =>
      backofficeApi.updateSettings(settings?.uuid ?? "", updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfully");
      setNewEmail("");
      setNewTelegramId("");
    },
    onError: () => toast.error("Failed to update settings"),
  });

  // Add Email
  const addEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    const currentEmails = settings?.alert_emails || [];
    if (currentEmails.includes(newEmail)) {
      toast.error("This email is already added");
      return;
    }
    updateMutation.mutate({
      alert_emails: [...currentEmails, newEmail],
    });
  };

  // Remove Email
  const removeEmail = (emailToRemove: string) => {
    const currentEmails = settings?.alert_emails || [];
    updateMutation.mutate({
      alert_emails: currentEmails.filter(
        (email: string) => email !== emailToRemove,
      ),
    });
  };

  // Add Telegram Chat ID
  const addTelegramId = () => {
    if (!newTelegramId || isNaN(Number(newTelegramId))) {
      toast.error("Please enter a valid numeric Chat ID");
      return;
    }
    const currentIds = settings?.telegram_chat_ids || [];
    const numId = Number(newTelegramId);
    if (currentIds.includes(numId)) {
      toast.error("This Chat ID is already added");
      return;
    }
    updateMutation.mutate({
      telegram_chat_ids: [...currentIds, numId],
    });
  };

  // Remove Telegram Chat ID
  const removeTelegramId = (idToRemove: number) => {
    const currentIds = settings?.telegram_chat_ids || [];
    updateMutation.mutate({
      telegram_chat_ids: currentIds.filter((id: number) => id !== idToRemove),
    });
  };

  const toggleCombineAlerts = () => {
    updateMutation.mutate({
      combine_alerts: !(settings?.combine_alerts ?? true),
    });
  };

  const saveCombineWindow = () => {
    if (combineWindow < 10 || combineWindow > 300) {
      toast.error("Combine window must be between 10 and 300 seconds");
      return;
    }
    updateMutation.mutate({
      combine_window_seconds: combineWindow,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
          <Bell className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">System Settings</h1>
          <p className="text-zinc-400">
            Manage global alert preferences and notification channels
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Combine Alerts Card */}
        <Card className="border border-[#3a0048] bg-[#1a0026]/80">
          <CardHeader>
            <CardTitle>Alert Behavior</CardTitle>
            <CardDescription>
              Control how alerts are grouped and sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Combine Similar Alerts</div>
                <p className="text-sm text-zinc-400">
                  Group multiple alerts from the same monitor within the time
                  window
                </p>
              </div>
              <Switch
                checked={settings?.combine_alerts ?? true}
                onCheckedChange={toggleCombineAlerts}
              />
            </div>

            <div className="space-y-4">
              <Label>Combine Window (seconds)</Label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={combineWindow}
                  onChange={(e) => setCombineWindow(Number(e.target.value))}
                  className="bg-[#2a0038] border-[#3a0048] w-32"
                />
                <Button onClick={saveCombineWindow}>Save</Button>
              </div>
              <p className="text-xs text-zinc-500">
                Current: {settings?.combine_window_seconds ?? 60} seconds
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alert Emails Management */}
        <Card className="border border-[#3a0048] bg-[#1a0026]/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Alert Emails
            </CardTitle>
            <CardDescription>
              Recipients who will receive email notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add new email */}
            <div className="flex gap-3">
              <Input
                placeholder="alert@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-[#2a0038] border-[#3a0048]"
              />
              <Button onClick={addEmail} disabled={!newEmail}>
                <Plus className="mr-2 h-4 w-4" />
                Add Email
              </Button>
            </div>

            {/* Current emails */}
            <div className="flex flex-wrap gap-2">
              {settings?.alert_emails?.length > 0 ? (
                settings.alert_emails.map((email: string) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5 flex items-center gap-2 bg-[#2a0038] hover:bg-[#2a0038]"
                  >
                    {email}
                    <button
                      onClick={() => removeEmail(email)}
                      className="ml-1 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">
                  No alert emails configured yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Telegram Chat IDs Management */}
        <Card className="border border-[#3a0048] bg-[#1a0026]/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Telegram Chat IDs
            </CardTitle>
            <CardDescription>
              Chat IDs that will receive Telegram notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add new Chat ID */}
            <div className="flex gap-3">
              <Input
                placeholder="Enter Telegram Chat ID (numeric)"
                value={newTelegramId}
                onChange={(e) => setNewTelegramId(e.target.value)}
                className="bg-[#2a0038] border-[#3a0048]"
              />
              <Button onClick={addTelegramId} disabled={!newTelegramId}>
                <Plus className="mr-2 h-4 w-4" />
                Add Chat ID
              </Button>
            </div>

            {/* Current Chat IDs */}
            <div className="flex flex-wrap gap-2">
              {settings?.telegram_chat_ids?.length > 0 ? (
                settings.telegram_chat_ids.map((id: number) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5 flex items-center gap-2 bg-[#2a0038]"
                  >
                    {id}
                    <button
                      onClick={() => removeTelegramId(id)}
                      className="ml-1 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">
                  No Telegram Chat IDs added yet.
                </p>
              )}
            </div>
            <p className="text-xs text-zinc-500">
              Tip: Use @userinfobot or @RawDataBot on Telegram to get your Chat
              ID.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
