"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email || "User");
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          FairLens <span className="text-sky-500 text-sm font-normal">Workspace</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{email}</span>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
