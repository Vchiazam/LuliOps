"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { verifyEmailOTPInSchema } from "@/lib/validators/schemas";
import { authApi } from "@/lib/api";
import type { VerifyEmailOTPInSchema } from "@/types/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

export default function VerifyEmailOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";

  const [countdown, setCountdown] = useState(0);

  const form = useForm<VerifyEmailOTPInSchema>({
    resolver: zodResolver(verifyEmailOTPInSchema),
    defaultValues: { email: prefilledEmail, otp: "" },
  });

  // Request OTP Mutation
  const requestOtpMutation = useMutation({
    mutationFn: authApi.requestEmailOtp,
    onSuccess: () => {
      toast.success("OTP sent to your email");
      setCountdown(60); // 60 seconds cooldown
    },
    onError: () => toast.error("Failed to send OTP"),
  });

  // Verify OTP Mutation
  const verifyMutation = useMutation({
    mutationFn: authApi.verifyEmailOtp,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      router.push("/login");
    },
    onError: () => toast.error("Invalid OTP. Please try again."),
  });

  // Auto-request OTP when page loads with email
  useEffect(() => {
    if (prefilledEmail && !form.getValues("otp")) {
      requestOtpMutation.mutate({ email: prefilledEmail });
    }
  }, [prefilledEmail]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = (data: VerifyEmailOTPInSchema) => {
    verifyMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] to-[#1a0026] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border border-[#3a0048] bg-[#1a0026]/90">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We sent a 6-digit code to{" "}
            <span className="font-medium text-white">{prefilledEmail}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="bg-[#2a0038] border-[#3a0048]"
                readOnly
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                {...form.register("otp")}
                className="bg-[#2a0038] border-[#3a0048] text-center text-2xl tracking-widest"
              />
            </Field>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-primary"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                requestOtpMutation.mutate({ email: form.getValues("email") })
              }
              disabled={countdown > 0 || requestOtpMutation.isPending}
              className="text-primary hover:text-primary/80"
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
