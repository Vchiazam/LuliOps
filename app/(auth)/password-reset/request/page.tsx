"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authApi } from "@/lib/api";
export default function PasswordResetRequestPage() {
  const { register, handleSubmit } = useForm<{ email: string }>({ defaultValues: { email: "" } });
  const mutation = useMutation({ mutationFn: authApi.passwordResetRequest, onSuccess: () => (window.location.href = "/password-reset/validate") });
  return (
    <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <h1 className="text-2xl font-semibold">Password Reset</h1>
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Email" {...register("email")} />
      <button className="w-full rounded bg-primary py-2">Send reset email</button>
    </form>
  );
}
