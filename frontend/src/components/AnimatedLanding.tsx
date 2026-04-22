// frontend/src/components/AnimatedLanding.tsx
"use client";

import { motion } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function AnimatedLanding({ userId }: { userId: string | null }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-slate-50">

      {/* VIBRANT AMBIENT GLOWS */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/30 blur-[140px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-sky-600/20 blur-[140px] mix-blend-screen pointer-events-none" />

      {/* Subtle Professional Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 flex flex-col items-center w-full"
        >
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-sm font-semibold backdrop-blur-md shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            System Operational
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl drop-shadow-lg">
            Audit AI Bias. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500">
              Deploy with Confidence.
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed font-light">
            Enterprise-grade fairness auditing. Upload your CSV, analyze disparate impact, and stream AI-powered remediation strategies instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-8 z-50">
            {!userId ? (
              <SignInButton mode="modal">
                <button className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_30px_-5px_rgba(14,165,233,0.5)] transition-all hover:scale-105 active:scale-95 border border-sky-400/50">
                  Get Started Securely
                </button>
              </SignInButton>
            ) : (
              <Link href="/dashboard">
                <button className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_30px_-5px_rgba(14,165,233,0.5)] transition-all hover:scale-105 active:scale-95 border border-sky-400/50">
                  Enter Workspace
                </button>
              </Link>
            )}

            <Link href="/sandbox">
              <button className="px-8 py-4 rounded-xl font-semibold text-slate-200 border border-slate-700 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-500 backdrop-blur-md transition-all hover:scale-105">
                View Components
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24 text-left"
        >
          {[
            { title: "Disparate Impact", desc: "Instantly calculate adverse impact ratios across protected classes.", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30" },
            { title: "Real-Time Explanations", desc: "Watch AI generate plain-text explainability reports as the math computes.", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
            { title: "Enterprise Secure", desc: "Data stays secure. Processed in ephemeral memory, never retained.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border ${feature.border} bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/80 hover:-translate-y-1 transition-all duration-300 shadow-xl`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 font-bold text-2xl border ${feature.border}`}
              >
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-300 leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
