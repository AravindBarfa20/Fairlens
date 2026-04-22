"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shield, LogOut, Sun, Moon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email || "User");
    });

    const saved = localStorage.getItem("fairlens-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("fairlens-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen dark:bg-[#050505] bg-[#fafafa] flex flex-col transition-colors">
      <header className="border-b dark:border-white/5 border-neutral-200 dark:bg-[#050505]/80 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 dark:border-white/10 border-neutral-200 border flex items-center justify-center">
            <Shield className="w-4 h-4 dark:text-white/80 text-neutral-700" />
          </div>
          <span className="text-sm font-semibold tracking-tight dark:text-white text-neutral-900">FairLens</span>
          <span className="text-xs font-normal dark:text-neutral-500 text-neutral-400">Workspace</span>
        </Link>

        <div className="flex items-center gap-3">
          {email && (
            <span className="text-xs dark:text-neutral-500 text-neutral-500 hidden md:block">{email}</span>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg dark:bg-white/5 bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-200 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 dark:text-neutral-400 text-neutral-600" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg dark:bg-white/5 bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-200 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 dark:text-neutral-400 text-neutral-600" />
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
