"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordInSchema } from "@/lib/validators/schemas";
import { authApi, userApi } from "@/lib/api";
import type { ChangePasswordInSchema } from "@/types/api";

export default function ProfilePage() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: userApi.me });
  const form = useForm<ChangePasswordInSchema>({
    resolver: zodResolver(changePasswordInSchema),
    defaultValues: { old_password: "", new_password: "" }
  });
  const changePassword = useMutation({ mutationFn: authApi.changePassword });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded-lg border border-border/50 bg-card/40 p-4">
        <div>{user?.email}</div>
        <div className="text-zinc-300">{user?.type}</div>
      </div>
      <form className="space-y-3 rounded-lg border border-border/50 bg-card/40 p-4" onSubmit={form.handleSubmit((v) => changePassword.mutate(v))}>
        <h2 className="font-medium">Change password</h2>
        <input type="password" className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Old password" {...form.register("old_password")} />
        <input type="password" className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="New password" {...form.register("new_password")} />
        <button className="rounded bg-primary px-3 py-2">Update Password</button>
      </form>
    </div>
  );
}
