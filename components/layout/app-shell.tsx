"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BellRing,
  Send,
  UserCircle2,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monitors", label: "Monitors", icon: BellRing },
  { href: "/telegram", label: "Telegram", icon: Send },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profile = useAuthStore((s) => s.profile);

  const links =
    profile?.type === "admin"
      ? [...nav, { href: "/backoffice", label: "Backoffice", icon: Shield }]
      : nav;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0a0014]">
      {/* Top Navigation Bar (Mobile + Desktop) */}
      <header className="sticky top-0 z-50 border-b border-[#3a0048] bg-[#1a0026]/95 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              LuliOps
            </h1>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-primary text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-[#2a0038]",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#3a0048] bg-[#1a0026]">
            <nav className="flex flex-col p-4 space-y-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-zinc-400 hover:bg-[#2a0038] hover:text-white",
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="p-6 md:p-8 lg:p-10 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
