"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerUserInSchema } from "@/lib/validators/schemas";
import { authApi } from "@/lib/api";
import type { RegisterUserInSchema } from "@/types/api";

export default function RegisterPage() {
  const form = useForm<RegisterUserInSchema>({
    resolver: zodResolver(registerUserInSchema),
    defaultValues: { first_name: "", last_name: "", email: "", mobile: "", password: "" }
  });
  const register = useMutation({ mutationFn: authApi.registerUser, onSuccess: () => (window.location.href = "/verify-email-otp") });
  return (
    <form className="space-y-3" onSubmit={form.handleSubmit((v) => register.mutate(v))}>
      <h1 className="text-2xl font-semibold">Register</h1>
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="First name" {...form.register("first_name")} />
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Last name" {...form.register("last_name")} />
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Email" {...form.register("email")} />
      <input className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Mobile" {...form.register("mobile")} />
      <input type="password" className="w-full rounded bg-[#1a0026] px-3 py-2" placeholder="Password" {...form.register("password")} />
      <button className="w-full rounded bg-primary py-2">Create account</button>
    </form>
  );
}
