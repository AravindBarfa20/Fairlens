"use client";

import { motion } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function AnimatedLanding({ userId }: { userId: string | null }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#020202] selection:bg-white/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-80 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 90, 0],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="absolute left-[-10%] top-[-20%] h-[50rem] w-[50rem] rounded-full bg-gradient-to-r from-neutral-300 to-white mix-blend-overlay blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] h-[40rem] w-[40rem] rounded-full bg-neutral-500 mix-blend-overlay blur-[150px]"
      />

      <main className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center space-y-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-default inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
          >
            <span className="mr-3 flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] animate-pulse" />
            ATLAS 4.1 Core Online
          </motion.div>

          <h1 className="bg-gradient-to-b from-white via-neutral-100 to-neutral-600 bg-clip-text pb-4 text-6xl font-extrabold leading-[1.1] tracking-tighter text-transparent drop-shadow-2xl md:text-[7rem]">
            Audit AI. <br />
            <span className="text-white/40">Defy Bias.</span>
          </h1>

          <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed tracking-wide text-neutral-400 md:text-2xl">
            Enterprise-grade bias detection engine. Upload CSVs, run AIF360
            physics, and stream GLM 5.1 explainability in real-time.
          </p>

          <div className="z-50 flex w-full flex-col items-center justify-center gap-6 pt-8 sm:flex-row">
            {!userId ? (
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 40px rgba(255,255,255,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 px-8 font-semibold text-black transition-all duration-300"
                >
                  <span className="relative flex items-center gap-3 text-lg">
                    Deploy Safely
                    <svg
                      className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2"
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
                </motion.button>
              </SignInButton>
            ) : (
              <Link href="/dashboard">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 40px rgba(255,255,255,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 rounded-2xl bg-white px-10 text-lg font-semibold text-black transition-transform"
                >
                  Initialize Workspace
                </motion.button>
              </Link>
            )}

            <Link href="/sandbox">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="h-16 rounded-2xl border border-white/20 bg-white/5 px-10 text-lg font-medium text-white shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300"
              >
                View Sandbox
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          whileHover={{ scale: 1.1, rotateY: 15, rotateX: -10, zIndex: 50 }}
          className="group absolute left-0 top-20 hidden h-40 w-72 cursor-pointer overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/10 to-white/0 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-[40px] lg:block"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-[1500ms] group-hover:translate-x-full" />
          <div className="mb-5 h-3 w-1/3 rounded-full bg-white/30" />
          <div className="mb-3 h-10 w-3/4 rounded-xl bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
          <div className="h-2 w-1/2 rounded-full bg-white/20" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
          whileHover={{ scale: 1.1, rotateY: -15, rotateX: 10, zIndex: 50 }}
          className="group absolute bottom-20 right-0 hidden h-48 w-80 cursor-pointer overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-tl from-white/10 to-white/0 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-[40px] lg:block"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-[1500ms] group-hover:translate-x-full" />
          <div className="mb-5 flex items-center justify-between">
            <div className="h-3 w-1/4 rounded-full bg-white/30" />
            <div className="h-4 w-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse" />
          </div>
          <div className="mb-4 flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/10 px-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "82%" }}
                transition={{ duration: 2, delay: 1 }}
                className="h-full bg-white"
              />
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10" />
        </motion.div>
      </main>
    </div>
  );
}
