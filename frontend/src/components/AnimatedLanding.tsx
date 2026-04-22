"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function AnimatedLanding() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full bg-violet-600/30 blur-[140px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-sky-600/20 blur-[140px] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex w-full flex-col items-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            System Operational
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg md:text-7xl">
            Audit AI Bias. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Deploy with Confidence.
            </span>
          </h1>

          <p className="max-w-2xl text-lg font-light leading-relaxed text-slate-300 md:text-xl">
            Enterprise-grade fairness auditing. Upload your CSV, analyze disparate
            impact, and stream AI-powered remediation strategies instantly.
          </p>

          <div className="z-50 flex flex-col items-center gap-5 pt-8 sm:flex-row">
            {!session ? (
              <button
                onClick={handleLogin}
                className="rounded-xl border border-sky-400/50 bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 font-bold text-white shadow-[0_0_30px_-5px_rgba(14,165,233,0.5)] transition-all hover:scale-105 hover:from-sky-400 hover:to-blue-500 active:scale-95"
              >
                Sign In with Google
              </button>
            ) : (
              <Link href="/dashboard">
                <button className="rounded-xl border border-sky-400/50 bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 font-bold text-white shadow-[0_0_30px_-5px_rgba(14,165,233,0.5)] transition-all hover:scale-105 hover:from-sky-400 hover:to-blue-500 active:scale-95">
                  Enter Workspace
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
