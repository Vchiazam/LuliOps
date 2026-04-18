"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { loginInSchema } from "@/lib/validators/schemas";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginInSchema } from "@/types/api";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<LoginInSchema>({
    resolver: zodResolver(loginInSchema),
    defaultValues: { email: "", password: "" },
  });

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAuth(res.token, res.profile);
      window.location.href = "/dashboard";
    },
  });

  return (
    <div className={cn("flex  items-center justify-center  p-4")}>
      <div className="w-full max-w-md">
        <Card className="border-0 bg-[#1a0026] shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit((v) => login.mutate(v))}
              className="space-y-6"
            >
              <FieldGroup>
                {/* Email Field */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-white">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...form.register("email")}
                    className="bg-[#2a0038] border-[#3a0048] text-white placeholder:text-gray-500 focus:border-primary"
                  />
                </Field>

                {/* Password Field */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password" className="text-white">
                      Password
                    </FieldLabel>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="bg-[#2a0038] border-[#3a0048] text-white placeholder:text-gray-500 focus:border-primary"
                  />
                </Field>

                {/* Submit Buttons */}
                <Field className="pt-2">
                  <Button
                    type="submit"
                    // onClick={(e) => e.preventDefault()}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 text-base"
                    disabled={login.isPending}
                  >
                    {login.isPending ? "Signing in..." : "Sign In"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full mt-3 border-[#3a0048] text-white hover:bg-[#2a0038]"
                  >
                    Login with Google
                  </Button>
                </Field>
              </FieldGroup>

              {/* Sign up link */}
              <FieldDescription className="text-center text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </FieldDescription>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
