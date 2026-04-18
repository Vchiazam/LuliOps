"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, Shield, User } from "lucide-react";

import { backofficeApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function BackofficeUserDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", uuid],
    queryFn: () => backofficeApi.getUser(uuid),
  });

  const updateType = useMutation({
    mutationFn: (type: "admin" | "operator" | "viewer" | "ghost") =>
      backofficeApi.updateUserType(uuid, { type }),
    onSuccess: () => {
      toast.success("User role updated successfully");
    },
    onError: () => toast.error("Failed to update role"),
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-400">User not found</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button + Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <a href="/backoffice/users">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Users
          </a>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <Card className="flex-1 border border-[#3a0048] bg-[#1a0026]/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>
              <div>
                <div className="text-3xl font-semibold">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-zinc-400 mt-1">{user.email}</div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-zinc-500 mb-1">ROLE</div>
                <Badge
                  variant={user.type === "admin" ? "default" : "secondary"}
                  className="text-base px-4 py-1"
                >
                  {user?.type?.toUpperCase()}
                </Badge>
              </div>

              <div>
                <div className="text-xs text-zinc-500 mb-1">EMAIL STATUS</div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${user.email_verified ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  <span>
                    {user.email_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-zinc-500" />
                <div>
                  <div className="text-sm text-zinc-400">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>

              {user.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-zinc-500" />
                  <div>
                    <div className="text-sm text-zinc-400">Phone</div>
                    <div className="font-medium">{user.mobile}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-zinc-500" />
                <div>
                  <div className="text-sm text-zinc-400">Joined</div>
                  <div className="font-medium">
                    {format(
                      parseISO(user.date_created),
                      "dd MMMM yyyy 'at' HH:mm",
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Management Card */}
        <Card className="w-full md:w-96 border border-[#3a0048] bg-[#1a0026]/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Change Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["admin", "operator", "viewer", "ghost"] as const).map((role) => (
              <Button
                key={role}
                variant={user.type === role ? "default" : "outline"}
                className="w-full justify-start h-12"
                onClick={() => updateType.mutate(role)}
                disabled={user.type === role}
              >
                {role === "admin" && "👑 "}
                {role === "operator" && "⚙️ "}
                {role === "viewer" && "👁️ "}
                {role === "ghost" && "👻 "}
                {role.charAt(0).toUpperCase() + role.slice(1)}
                {user.type === role && " (Current)"}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
