"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUserInSchema } from "@/lib/validators/schemas";
import { authApi } from "@/lib/api";
import type { RegisterUserInSchema } from "@/types/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterUserInSchema>({
    resolver: zodResolver(registerUserInSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (data) => {
      toast.success("Account created! Please verify your email.");
      // Pass email to verify page via query param or state
      router.push(
        //@ts-expect-error ignore
        `/verify-email-otp?email=${encodeURIComponent(data?.email || form.getValues("email"))}`,
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });

  return (
    <div className=" flex items-center justify-center p- 6">
      <Card className="w-full max-w-3xl  border border-[#3a0048] bg-[#1a0026]/90">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your details to get started with LuliOps
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit((v) => registerMutation.mutate(v))}
            className="space-y-6"
          >
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                  <Input
                    id="first_name"
                    placeholder="John"
                    {...form.register("first_name")}
                    className="bg-[#2a0038] border-[#3a0048]"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                  <Input
                    id="last_name"
                    placeholder="Doe"
                    {...form.register("last_name")}
                    className="bg-[#2a0038] border-[#3a0048]"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                  className="bg-[#2a0038] border-[#3a0048]"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
                <Input
                  id="mobile"
                  placeholder="+234 812 345 6789"
                  {...form.register("mobile")}
                  className="bg-[#2a0038] border-[#3a0048]"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="bg-[#2a0038] border-[#3a0048]"
                />
                <FieldDescription>
                  Must be at least 8 characters.
                </FieldDescription>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-primary hover:bg-primary/90"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>

            <div className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
