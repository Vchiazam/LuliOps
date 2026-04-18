"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authApi } from "@/lib/api";
export default function PasswordResetValidatePage() {
  const { register, handleSubmit } = useForm<{ token: string; uid: string }>({ defaultValues: { token: "", uid: "" } });
  const mutation = useMutation({ mutationFn: authApi.passwordResetValidate, onSuccess: () => (window.location.href = "/password-reset/done") });
  return (
    <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <h1 className="text-2xl font-semibold">Validate reset token</h1>
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="UID" {...register("uid")} />
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Token" {...register("token")} />
      <button className="w-full rounded bg-primary py-2">Validate token</button>
    </form>
  );
}
