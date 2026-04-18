"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authApi } from "@/lib/api";
export default function PasswordResetDonePage() {
  const { register, handleSubmit } = useForm<{ token: string; uid: string; new_password: string }>({ defaultValues: { token: "", uid: "", new_password: "" } });
  const mutation = useMutation({ mutationFn: authApi.passwordResetDone, onSuccess: () => (window.location.href = "/login") });
  return (
    <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <h1 className="text-2xl font-semibold">Set new password</h1>
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="UID" {...register("uid")} />
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Token" {...register("token")} />
      <input type="password" className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="New password" {...register("new_password")} />
      <button className="w-full rounded bg-primary py-2">Reset password</button>
    </form>
  );
}
