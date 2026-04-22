"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function AnimatedLanding({ userId }: { userId: string | null }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050505] selection:bg-white/20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute left-[-10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-white mix-blend-overlay blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] h-[40rem] w-[40rem] rounded-full bg-neutral-400 mix-blend-overlay blur-[120px]"
      />

      <main className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-300 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]">
            <span className="mr-3 flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
            ATLAS 4.1 AI Engine Online
          </div>

          <h1 className="bg-gradient-to-b from-white via-neutral-200 to-neutral-800 bg-clip-text pb-2 text-6xl font-extrabold tracking-tighter text-transparent md:text-8xl">
            Stop AI Bias. <br />
            <span className="text-neutral-500">Before Deployment.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-400 md:text-xl">
            Enterprise-grade bias detection and explainability powered by GLM
            5.1 and AIF360. Audit your datasets instantly without a PhD in data
            science.
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-6 pt-8 sm:flex-row">
            {!userId ? (
              <SignInButton mode="modal">
                <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white p-4 px-8 font-medium text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105">
                  <span className="absolute inset-0 bg-gradient-to-r from-white via-neutral-200 to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-2 text-lg">
                    Get Started Securely
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </SignInButton>
            ) : (
              <Link href="/dashboard">
                <Button
                  variant="primary"
                  className="h-14 rounded-2xl px-8 text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] transition-transform hover:scale-105"
                >
                  Enter Workspace
                </Button>
              </Link>
            )}

            <Link href="/sandbox">
              <button className="h-14 rounded-2xl border border-white/10 bg-white/5 px-8 text-lg text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]">
                View Components
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0], rotateZ: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute left-4 top-32 hidden h-32 w-64 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-3xl lg:block"
        >
          <div className="mb-4 h-2 w-1/3 rounded bg-neutral-600/50" />
          <div className="mb-2 h-8 w-1/2 rounded bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          <div className="h-2 w-2/3 rounded bg-neutral-700/50" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotateZ: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 right-4 hidden h-40 w-72 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-3xl lg:block"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-2 w-1/4 rounded bg-neutral-600/50" />
            <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>
          <div className="mb-3 h-12 w-full rounded-xl border border-white/5 bg-white/5" />
          <div className="h-2 w-full rounded bg-neutral-700/50" />
        </motion.div>
      </main>
    </div>
  );
}
