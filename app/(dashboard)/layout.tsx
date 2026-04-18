import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "./protected";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <AppShell>{children}</AppShell>
    </Protected>
  );
}
