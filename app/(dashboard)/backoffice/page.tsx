"use client";

import Link from "next/link";
import { Users, Settings, Shield, BarChart3, Activity } from "lucide-react";

export default function BackofficePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#1a0026] to-[#0f0017] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Backoffice
              </h1>
              <p className="text-zinc-400 mt-1">
                Administrative control center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Card */}
          <Link
            href="/backoffice/users"
            className="group rounded-3xl border border-[#3a0048] bg-[#1a0026]/70 p-8 hover:border-primary/50 hover:bg-[#2a0038]/60 transition-all duration-300 flex flex-col"
          >
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <p className="text-zinc-400 flex-1">
              Manage user accounts, roles, and permissions
            </p>
            <div className="mt-6 text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Manage Users →
            </div>
          </Link>

          {/* Settings Card */}
          <Link
            href="/backoffice/settings"
            className="group rounded-3xl border border-[#3a0048] bg-[#1a0026]/70 p-8 hover:border-primary/50 hover:bg-[#2a0038]/60 transition-all duration-300 flex flex-col"
          >
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-zinc-400 flex-1">
              System configuration and global preferences
            </p>
            <div className="mt-6 text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Open Settings →
            </div>
          </Link>

          {/* Analytics Card (Bonus - looks premium) */}
          <Link
            href="/backoffice/analytics"
            className="group rounded-3xl border border-[#3a0048] bg-[#1a0026]/70 p-8 hover:border-primary/50 hover:bg-[#2a0038]/60 transition-all duration-300 flex flex-col"
          >
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Analytics</h2>
            <p className="text-zinc-400 flex-1">
              Platform performance and usage insights
            </p>
            <div className="mt-6 text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              View Reports →
            </div>
          </Link>
        </div>

        {/* Subtle Footer Note */}
        <div className="mt-16 text-center text-xs text-zinc-500">
          Backoffice • Restricted access • Audit logs enabled
        </div>
      </div>
    </div>
  );
}
