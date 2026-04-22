// frontend/src/components/AnimatedLanding.tsx
"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  BarChart3,
  Zap,
  FileSearch,
  Brain,
  ArrowRight,
  CheckCircle2,
  Upload,
  TrendingUp,
  Eye,
  Lock,
  Globe,
  Sparkles,
  ChevronDown,
} from "lucide-react";

/* ─── Scroll-animated Section wrapper ───────────────────── */
function ScrollSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Animated counter ──────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Particle Field (pure CSS, no canvas) ──────────────── */
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
            y: [0, -100 - Math.random() * 200],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Orbiting ring decorator ───────────────────────────── */
function OrbitRing({ size, duration, opacity }: { size: number; duration: number; opacity: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
      style={{ width: size, height: size, opacity }}
    >
      <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/20" />
    </motion.div>
  );
}

/* ─── Feature card ──────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      {/* Shimmer on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

      <div className="relative z-10">
        <div className="mb-5 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
          <Icon className="h-6 w-6 text-neutral-300" strokeWidth={1.5} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-neutral-400">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─── Step card for "How it works" ──────────────────────── */
function StepCard({
  number,
  icon: Icon,
  title,
  description,
  index,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex gap-6"
    >
      {/* Number connector */}
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-sm font-bold text-white backdrop-blur-sm transition-colors group-hover:border-white/20 group-hover:bg-white/[0.08]">
          {number}
        </div>
        {index < 2 && (
          <div className="mt-3 h-full w-px bg-gradient-to-b from-white/10 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="pb-12">
        <div className="mb-2 inline-flex items-center gap-2">
          <Icon className="h-4 w-4 text-neutral-400" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-neutral-400">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─── Animated metric bar ───────────────────────────────── */
function MetricBar({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">{label}</span>
        <span className="font-mono text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function AnimatedLanding({ userId }: { userId: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Disparate Impact Analysis",
      description:
        "Automatically detect adverse impact ratios across protected classes. Powered by AIF360 fairness metrics.",
    },
    {
      icon: BarChart3,
      title: "Multi-Metric Dashboard",
      description:
        "Demographic parity, equalized odds, and 12+ fairness metrics visualized in real-time glass panels.",
    },
    {
      icon: Brain,
      title: "GLM 5.1 Explainability",
      description:
        "Stream natural-language explanations of bias findings. No PhD required — understand what went wrong instantly.",
    },
    {
      icon: FileSearch,
      title: "Dataset Forensics",
      description:
        "Deep-dive into column distributions, correlation heatmaps, and feature importance across demographic groups.",
    },
    {
      icon: Zap,
      title: "Real-Time Streaming",
      description:
        "Results stream as they compute — no waiting for batch processing. Watch your audit unfold live.",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "SOC2-ready architecture. Data never leaves your instance. Clerk-powered auth with granular role controls.",
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ═══ HERO SECTION ═══ */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 grid-pattern radial-mask" />
        <div className="absolute inset-0 gradient-mesh" />
        <ParticleField />

        {/* Orbit rings */}
        <div className="absolute inset-0 overflow-hidden">
          <OrbitRing size={600} duration={30} opacity={0.4} />
          <OrbitRing size={900} duration={45} opacity={0.3} />
          <OrbitRing size={1200} duration={60} opacity={0.2} />
        </div>

        {/* Central aurora glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-white/10 via-white/5 to-transparent blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
        />

        {/* Hero content */}
        <main className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center space-y-8"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex cursor-default items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm text-neutral-300 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              FairLens Engine v2.0 — Now with GLM 5.1
              <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient max-w-4xl text-6xl font-extrabold leading-[1.05] tracking-tighter md:text-8xl lg:text-[6.5rem]"
              style={{
                transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
              }}
            >
              Detect Bias.
              <br />
              <span className="text-gradient" style={{ opacity: 0.5 }}>
                Deploy Fair.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl"
            >
              Enterprise-grade fairness auditing for datasets and ML models.
              Upload a CSV, run AIF360 metrics, and stream AI-powered
              explainability reports — all in one interface.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col items-center gap-4 pt-4 sm:flex-row"
            >
              {!userId ? (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 60px rgba(255,255,255,0.15)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-8 font-semibold text-black transition-all"
                  >
                    {/* Button shimmer */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2 text-base">
                      Start Auditing
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </SignInButton>
              ) : (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 60px rgba(255,255,255,0.15)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-8 font-semibold text-black"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2 text-base">
                      Open Dashboard
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </Link>
              )}

              <Link href="/sandbox">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-8 text-base font-medium text-neutral-300 backdrop-blur-xl transition-all hover:text-white"
                >
                  View Components
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs text-neutral-500"
            >
              {["AIF360 Powered", "SOC2 Ready", "GDPR Compliant", "Zero Data Retention"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    {item}
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        </main>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-neutral-600" />
          </motion.div>
        </motion.div>

        {/* Floating glass cards — decorative */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute left-[5%] top-[20%] hidden h-36 w-56 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-2xl lg:block"
          style={{
            transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
          }}
        >
          <div className="mb-3 h-2.5 w-12 rounded-full bg-white/20" />
          <div className="mb-2 h-8 w-32 rounded-lg bg-white/10" />
          <div className="h-2 w-20 rounded-full bg-white/10" />
          <div className="mt-4 flex gap-2">
            {[0.3, 0.6, 0.45, 0.8, 0.5].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h * 30}px` }}
                transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                className="w-3 rounded-sm bg-white/15"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[15%] right-[5%] hidden h-44 w-64 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-2xl lg:block"
          style={{
            transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-2.5 w-16 rounded-full bg-white/20" />
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/80">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
          <MetricBar label="" value={82} color="rgba(255,255,255,0.4)" delay={1.5} />
          <div className="mt-3" />
          <MetricBar label="" value={65} color="rgba(255,255,255,0.2)" delay={1.8} />
          <div className="mt-4 flex gap-1.5 text-[10px] text-neutral-500">
            <span>Analyzing...</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ FEATURES SECTION ═══ */}
      <div className="relative">
        <div className="section-divider mx-auto max-w-4xl" />

        <div className="mx-auto max-w-7xl px-6 py-32">
          <ScrollSection className="mb-16 text-center">
            <motion.div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
              <Eye className="h-3 w-3" />
              Capabilities
            </motion.div>
            <h2 className="mt-6 text-gradient text-4xl font-bold tracking-tight md:text-5xl">
              Full-Spectrum Fairness
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
              Everything you need to audit, understand, and fix bias in your ML
              pipeline — in a single interface.
            </p>
          </ScrollSection>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS SECTION ═══ */}
      <div className="relative">
        <div className="section-divider mx-auto max-w-4xl" />

        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Left — Steps */}
            <div>
              <ScrollSection className="mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
                  <Zap className="h-3 w-3" />
                  Workflow
                </div>
                <h2 className="mt-6 text-gradient text-4xl font-bold tracking-tight">
                  Three Steps to Fair AI
                </h2>
              </ScrollSection>

              <div className="flex flex-col">
                <StepCard
                  number="01"
                  icon={Upload}
                  title="Upload Your Dataset"
                  description="Drop a CSV with demographic columns. FairLens auto-detects protected attributes like gender, race, and age."
                  index={0}
                />
                <StepCard
                  number="02"
                  icon={BarChart3}
                  title="Run AIF360 Analysis"
                  description="Our engine computes 15+ fairness metrics including disparate impact, demographic parity, and equalized odds in real-time."
                  index={1}
                />
                <StepCard
                  number="03"
                  icon={Brain}
                  title="Stream AI Insights"
                  description="GLM 5.1 generates plain-English explanations of every fairness violation, with actionable remediation steps."
                  index={2}
                />
              </div>
            </div>

            {/* Right — Interactive demo preview */}
            <ScrollSection delay={0.3} className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Main card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl"
                >
                  {/* Card header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                        <TrendingUp className="h-5 w-5 text-neutral-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Bias Report</div>
                        <div className="text-xs text-neutral-500">hiring_data.csv</div>
                      </div>
                    </div>
                    <div className="animate-pulse-ring flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-5">
                    <MetricBar
                      label="Disparate Impact Ratio"
                      value={82}
                      color="linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.5))"
                      delay={0.2}
                    />
                    <MetricBar
                      label="Demographic Parity"
                      value={64}
                      color="linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))"
                      delay={0.4}
                    />
                    <MetricBar
                      label="Equalized Odds"
                      value={91}
                      color="linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.5))"
                      delay={0.6}
                    />
                  </div>

                  {/* Separator */}
                  <div className="my-6 section-divider" />

                  {/* AI insight preview */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
                      <Sparkles className="h-3 w-3" />
                      GLM 5.1 Analysis
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-sm leading-relaxed text-neutral-300"
                    >
                      &ldquo;The gender column shows a{" "}
                      <span className="text-white font-medium">
                        statistically significant disparity
                      </span>{" "}
                      in selection rates (p &lt; 0.01). Male applicants are{" "}
                      <span className="text-white font-medium">1.22×</span> more
                      likely to be selected...&rdquo;
                    </motion.div>
                  </div>
                </motion.div>

                {/* Background glow */}
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-white/[0.02] to-transparent blur-2xl" />
              </div>
            </ScrollSection>
          </div>
        </div>
      </div>

      {/* ═══ STATS SECTION ═══ */}
      <div className="relative">
        <div className="section-divider mx-auto max-w-4xl" />

        <div className="mx-auto max-w-7xl px-6 py-32">
          <ScrollSection>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: "Fairness Metrics", value: 15, suffix: "+" },
                { label: "Datasets Audited", value: 2400, suffix: "+" },
                { label: "Bias Violations Caught", value: 18000, suffix: "+" },
                { label: "Avg Analysis Time", value: 3, suffix: "s" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-white md:text-4xl">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollSection>
        </div>
      </div>

      {/* ═══ CTA SECTION ═══ */}
      <div className="relative">
        <div className="section-divider mx-auto max-w-4xl" />

        <div className="mx-auto max-w-7xl px-6 py-32">
          <ScrollSection className="text-center">
            <div className="relative mx-auto max-w-3xl rounded-3xl border border-white/[0.06] bg-white/[0.02] px-8 py-20 backdrop-blur-xl md:px-16">
              {/* Background orb */}
              <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                <div
                  className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }}
                />
              </div>

              <h2 className="text-gradient text-3xl font-bold tracking-tight md:text-5xl">
                Ready to audit your AI?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-neutral-400">
                Join thousands of ML teams using FairLens to ship fair,
                explainable AI. Free tier includes 50 audits/month.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {!userId ? (
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 font-semibold text-black transition-all"
                    >
                      Get Started Free
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </SignInButton>
                ) : (
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 font-semibold text-black transition-all"
                    >
                      Open Dashboard
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>
          </ScrollSection>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Globe className="h-4 w-4 text-neutral-500" />
            </div>
            <span className="text-sm font-medium text-neutral-400">FairLens</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-600">
            <span>© 2026 FairLens</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
