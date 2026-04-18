"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BellRing,
  History,
  UserCircle2,
  Shield,
  Send,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monitors", label: "Monitors", icon: BellRing },
  // { href: "/history", label: "History", icon: History },
  { href: "/telegram", label: "Telegram", icon: Send },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const profile = useAuthStore((s) => s.profile);
  const links =
    profile?.type === "admin"
      ? [...nav, { href: "/backoffice", label: "Backoffice", icon: Shield }]
      : nav;

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-border/50 bg-card/40 p-4">
          <h1 className="mb-6 text-xl font-semibold text-white">LuliOps</h1>
          <nav className="space-y-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-primary/20",
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
