"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Users, Search, Shield, Mail, Phone } from "lucide-react";

import { backofficeApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BackofficeUsersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => backofficeApi.listUsers({ page_index: 1, page_size: 50 }),
  });

  const users = data?.data ?? [];

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user: any) =>
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Users</h1>
            <p className="text-zinc-400">Manage all platform users</p>
          </div>
        </div>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#2a0038] border-[#3a0048] focus:border-primary"
          />
        </div>
      </div>

      <Card className="border border-[#3a0048] bg-[#1a0026]/70">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f0017] border-b border-[#3a0048]">
                <tr className="text-left text-sm text-zinc-400">
                  <th className="px-8 py-5 font-medium">User</th>
                  <th className="px-8 py-5 font-medium">Contact</th>
                  <th className="px-8 py-5 font-medium">Role</th>
                  <th className="px-8 py-5 font-medium">Joined</th>
                  <th className="px-8 py-5 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a0048]/50">
                {filteredUsers.map((user: any) => (
                  <tr
                    key={user.uuid}
                    className="hover:bg-[#2a0038]/60 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-zinc-400">
                              {user.first_name?.[0]}
                              {user.last_name?.[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-zinc-400">
                      {user.mobile && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" /> {user.mobile}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        variant={
                          user.type === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-sm text-zinc-400">
                      {format(parseISO(user.date_created), "dd MMM yyyy")}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <Link href={`/backoffice/users/${user.uuid}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-zinc-500">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
