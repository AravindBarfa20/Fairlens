"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sun, Moon, Shield } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

function DashboardHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-white/5 dark:bg-[#050505]/80 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors">
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 dark:border-white/10 border-neutral-200 border flex items-center justify-center">
          <Shield className="w-4 h-4 dark:text-white/80 text-neutral-700" />
        </div>
        <span className="text-sm font-semibold tracking-tight dark:text-white text-neutral-900">
          FairLens
        </span>
        <span className="text-xs font-normal dark:text-neutral-500 text-neutral-400">
          Workspace
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="p-2 rounded-lg dark:bg-white/5 bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-200 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 dark:text-neutral-400 text-neutral-600" />
          ) : (
            <Moon className="w-4 h-4 dark:text-neutral-400 text-neutral-600" />
          )}
        </button>
        <UserButton />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen dark:bg-[#050505] bg-white flex flex-col transition-colors">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
