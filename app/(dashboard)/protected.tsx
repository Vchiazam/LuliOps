"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";

export function Protected({ children }: { children: React.ReactNode }) {
  useAuthGuard();
  return <>{children}</>;
}
