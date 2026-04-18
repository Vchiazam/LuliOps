"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { verifyEmailOTPInSchema } from "@/lib/validators/schemas";
import { authApi } from "@/lib/api";
import type { VerifyEmailOTPInSchema } from "@/types/api";

export default function VerifyEmailOtpPage() {
  const form = useForm<VerifyEmailOTPInSchema>({
    resolver: zodResolver(verifyEmailOTPInSchema),
    defaultValues: { email: "", otp: "" }
  });
  const verify = useMutation({ mutationFn: authApi.verifyEmailOtp, onSuccess: () => (window.location.href = "/login") });
  return (
    <form className="space-y-3" onSubmit={form.handleSubmit((v) => verify.mutate(v))}>
      <h1 className="text-2xl font-semibold">Verify OTP</h1>
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Email" {...form.register("email")} />
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="OTP" {...form.register("otp")} />
      <button className="w-full rounded bg-primary py-2">Verify</button>
    </form>
  );
}
