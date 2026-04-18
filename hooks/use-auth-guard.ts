"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const publicRoutes = [
  "/login",
  "/register",
  "/verify-email-otp",
  "/password-reset/request",
  "/password-reset/validate",
  "/password-reset/done",
  "/google-callback",
];

export function useAuthGuard() {
  const token = useAuthStore((s) => s.token);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isPublic = publicRoutes.some((p) => pathname.startsWith(p));
    // if (!token && !isPublic) router.replace("/login");
  }, [pathname, router, token]);
}
