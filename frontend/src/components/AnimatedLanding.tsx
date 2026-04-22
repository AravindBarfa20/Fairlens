// frontend/src/components/AnimatedLanding.tsx
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  BarChart3,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle2,
  Upload,
  TrendingUp,
  Lock,
  Globe,
  Sparkles,
  ChevronDown,
  FileSearch,
  Eye,
  Activity,
  Database,
  GitBranch,
  Layers,
  Terminal,
  AlertTriangle,
} from "lucide-react";

// ═══════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ═══════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Beam() {
  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: "200%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
      className="absolute left-1/2 top-0 h-32 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"
    />
  );
}

function FloatingOrb({
  size,
  x,
  y,
  color,
  delay = 0,
}: {
  size: number;
  x: string;
  y: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(80px)",
      }}
    />
  );
}

/* Typewriter effect for the terminal */
function Typewriter({ lines, speed = 40 }: { lines: string[]; speed?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!inView || currentLine >= lines.length) return;
    const timer = setTimeout(() => {
      if (currentChar < lines[currentLine].length) {
        setDisplayed((prev) => {
          const next = [...prev];
          next[currentLine] = (next[currentLine] || "") + lines[currentLine][currentChar];
          return next;
        });
        setCurrentChar((c) => c + 1);
      } else {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
        setDisplayed((prev) => [...prev, ""]);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [inView, currentLine, currentChar, lines, speed]);

  return (
    <div ref={ref} className="font-mono text-xs sm:text-sm leading-relaxed">
      {displayed.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-neutral-600 select-none">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-neutral-300">
            {line}
            {i === currentLine && currentLine < lines.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-white/60 ml-0.5 align-middle"
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Progress bar with animation */
function ProgressBar({
  label,
  value,
  delay = 0,
  status,
}: {
  label: string;
  value: number;
  delay?: number;
  status?: "pass" | "warn" | "fail";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const statusColor =
    status === "pass"
      ? "from-emerald-500/40 to-emerald-400/60"
      : status === "warn"
      ? "from-amber-500/40 to-amber-400/60"
      : "from-red-500/40 to-red-400/60";
  const dotColor =
    status === "pass" ? "bg-emerald-400" : status === "warn" ? "bg-amber-400" : "bg-red-400";

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          <span className="text-neutral-400">{label}</span>
        </div>
        <span className="font-mono text-neutral-300">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${statusColor}`}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════

function Navbar({ userId }: { userId: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
              <Shield className="w-4 h-4 text-white/80" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">FairLens</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!userId ? (
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <Link href="/dashboard">
              <button className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════
// BENTO GRID CARDS
// ═══════════════════════════════════════════════════

function BentoCard({
  children,
  className = "",
  span = false,
}: {
  children: React.ReactNode;
  className?: string;
  span?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] transition-colors hover:border-white/[0.1] ${
        span ? "md:col-span-2" : ""
      } ${className}`}
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent transition-transform duration-[800ms] group-hover:translate-x-full" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN LANDING COMPONENT
// ═══════════════════════════════════════════════════

export function AnimatedLanding({ userId }: { userId: string | null }) {
  const mouse = useMousePosition();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.96]);

  return (
    <div className="relative w-full bg-[#050505]">
      <Navbar userId={userId} />

      {/* ═══ HERO ═══ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 grid-pattern radial-mask" />
        <FloatingOrb size={800} x="20%" y="-10%" color="rgba(168,130,255,0.08)" delay={0} />
        <FloatingOrb size={600} x="70%" y="60%" color="rgba(56,189,248,0.06)" delay={2} />
        <FloatingOrb size={500} x="-5%" y="70%" color="rgba(255,255,255,0.04)" delay={4} />
        <Beam />

        {/* Particles — deterministic positions to avoid hydration mismatch */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { l: 12, t: 8 }, { l: 45, t: 22 }, { l: 78, t: 15 }, { l: 23, t: 65 },
            { l: 67, t: 42 }, { l: 91, t: 73 }, { l: 34, t: 88 }, { l: 56, t: 31 },
            { l: 8, t: 47 }, { l: 82, t: 56 }, { l: 19, t: 33 }, { l: 63, t: 78 },
            { l: 41, t: 11 }, { l: 95, t: 29 }, { l: 27, t: 52 }, { l: 73, t: 91 },
            { l: 5, t: 72 }, { l: 88, t: 18 }, { l: 51, t: 61 }, { l: 37, t: 95 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px rounded-full bg-white/30"
              style={{ left: `${pos.l}%`, top: `${pos.t}%` }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
              transition={{
                duration: 4 + (i % 5),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13px] text-neutral-400 backdrop-blur-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Powered by AIF360 & GLM 5.1
            </motion.div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl md:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[1.05]"
              style={{ transform: `translate(${mouse.x * 3}px, ${mouse.y * 3}px)` }}
            >
              <span className="text-gradient">Your AI has blind spots.</span>
              <br />
              <span className="text-gradient" style={{ opacity: 0.4 }}>
                We find them.
              </span>
            </h1>

            {/* Sub */}
            <p className="mx-auto max-w-2xl text-lg text-neutral-400 leading-relaxed">
              Upload a dataset. Get 15+ fairness metrics in seconds. Stream
              AI-powered explanations of every bias pattern — no statistics
              degree required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!userId ? (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-12 px-7 rounded-xl bg-white font-semibold text-black text-sm flex items-center gap-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.04] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    <span className="relative">Start Free Audit</span>
                    <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </SignInButton>
              ) : (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-12 px-7 rounded-xl bg-white font-semibold text-black text-sm flex items-center gap-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.04] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    <span className="relative">Open Dashboard</span>
                    <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </Link>
              )}

              <a href="#demo">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 px-7 rounded-xl border border-white/[0.1] bg-white/[0.03] text-sm font-medium text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  See Live Demo
                </motion.button>
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-[11px] text-neutral-600">
              {["AIF360 Engine", "15+ Metrics", "SOC2 Architecture", "Zero Data Retention"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Scroll arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-20"
          >
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronDown className="w-5 h-5 text-neutral-700 mx-auto" />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Floating glass cards ── */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute left-[3%] top-[22%] hidden lg:block w-52 rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-4 backdrop-blur-xl"
          style={{ transform: `translate(${mouse.x * -8}px, ${mouse.y * -8}px)` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[11px] text-neutral-500 font-medium">BIAS SCAN</span>
          </div>
          <ProgressBar label="Gender" value={82} status="pass" delay={1} />
          <div className="mt-2" />
          <ProgressBar label="Race" value={47} status="fail" delay={1.3} />
          <div className="mt-2" />
          <ProgressBar label="Age" value={71} status="warn" delay={1.6} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          className="absolute right-[3%] bottom-[20%] hidden lg:block w-56 rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-4 backdrop-blur-xl"
          style={{ transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[11px] text-neutral-500 font-medium">AI OUTPUT</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-400 leading-relaxed space-y-1">
            <div className="text-neutral-300">&gt; Analyzing gender column...</div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span>Disparate impact: <span className="text-white font-medium">0.72</span></span>
            </div>
            <div className="text-neutral-500">→ Below 4/5ths threshold</div>
          </div>
        </motion.div>
      </motion.section>

      {/* ═══ BENTO FEATURES GRID ═══ */}
      <section id="features" className="relative py-32">
        <div className="section-divider mx-auto max-w-3xl mb-20" />

        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500 mb-5">
              <Layers className="w-3 h-3" /> Capabilities
            </div>
            <h2 className="text-gradient text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need to audit AI
            </h2>
            <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
              From statistical testing to natural-language explanations — one
              integrated platform.
            </p>
          </Reveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 — Large: Live metrics */}
            <Reveal delay={0.05}>
              <BentoCard span>
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                      <BarChart3 className="w-5 h-5 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Multi-Metric Dashboard</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      15+ fairness metrics computed in parallel. Disparate impact,
                      demographic parity, equalized odds, calibration — all visualized
                      in real-time glass panels.
                    </p>
                  </div>
                  <div className="flex-1 space-y-3 py-2">
                    <ProgressBar label="Disparate Impact" value={82} status="pass" delay={0.2} />
                    <ProgressBar label="Demographic Parity" value={64} status="warn" delay={0.4} />
                    <ProgressBar label="Equalized Odds" value={91} status="pass" delay={0.6} />
                    <ProgressBar label="Calibration" value={38} status="fail" delay={0.8} />
                    <ProgressBar label="Theil Index" value={76} status="pass" delay={1.0} />
                  </div>
                </div>
              </BentoCard>
            </Reveal>

            {/* Card 2: Shield */}
            <Reveal delay={0.1}>
              <BentoCard>
                <div className="p-8 space-y-4">
                  <div className="inline-flex p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                    <Shield className="w-5 h-5 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Adverse Impact Detection</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Automatically flag selection ratios that violate the 4/5ths rule
                    across every protected class in your data.
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">4/5</span>
                    <span className="text-xs text-neutral-500">rule threshold</span>
                  </div>
                </div>
              </BentoCard>
            </Reveal>

            {/* Card 3: AI brain */}
            <Reveal delay={0.15}>
              <BentoCard>
                <div className="p-8 space-y-4">
                  <div className="inline-flex p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                    <Brain className="w-5 h-5 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Explainability</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    GLM 5.1 streams plain-English explanations of every bias
                    violation with actionable remediation steps.
                  </p>
                  <div className="mt-4 p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] text-xs text-neutral-400 italic">
                    &ldquo;Gender shows 1.22× disparity in selection rates
                    (p&nbsp;&lt;&nbsp;0.01)...&rdquo;
                  </div>
                </div>
              </BentoCard>
            </Reveal>

            {/* Card 4: Upload */}
            <Reveal delay={0.2}>
              <BentoCard>
                <div className="p-8 space-y-4">
                  <div className="inline-flex p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                    <Upload className="w-5 h-5 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">CSV Drop & Go</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Drag-and-drop any CSV. Auto-detects protected attributes
                    (gender, race, age) — zero configuration.
                  </p>
                </div>
              </BentoCard>
            </Reveal>

            {/* Card 5 — Large: Terminal demo */}
            <Reveal delay={0.25}>
              <BentoCard span>
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                      <Zap className="w-5 h-5 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Real-Time Streaming</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Watch results stream as they compute. No batch processing,
                      no waiting. Your audit unfolds live.
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-white/[0.06] bg-[#080808] p-5 overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <span className="ml-2 text-[10px] text-neutral-600 font-mono">fairlens audit</span>
                    </div>
                    <Typewriter
                      lines={[
                        "$ fairlens audit hiring_data.csv",
                        "→ Detected columns: gender, race, age",
                        "→ Computing disparate_impact...",
                        "✓ DI ratio: 0.82 (PASS)",
                        "→ Computing demographic_parity...",
                        "⚠ DP difference: -0.18 (WARN)",
                        "→ Streaming AI explanation...",
                      ]}
                      speed={30}
                    />
                  </div>
                </div>
              </BentoCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-32">
        <div className="section-divider mx-auto max-w-3xl mb-20" />

        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500 mb-5">
              <GitBranch className="w-3 h-3" /> Workflow
            </div>
            <h2 className="text-gradient text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Zero configuration.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Upload",
                desc: "Drop your CSV. FairLens detects protected attributes automatically — gender, race, age, disability status.",
              },
              {
                icon: BarChart3,
                step: "02",
                title: "Analyze",
                desc: "AIF360 computes 15+ fairness metrics in parallel. Results stream live as each metric completes.",
              },
              {
                icon: Brain,
                step: "03",
                title: "Understand",
                desc: "GLM 5.1 explains every finding in plain English. Get actionable remediation steps, not just numbers.",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="relative p-8 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] group hover:border-white/[0.1] transition-colors">
                  {/* Step number watermark */}
                  <div className="absolute top-4 right-6 text-5xl font-extrabold text-white/[0.03] select-none">
                    {item.step}
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                      <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIVE DEMO PREVIEW ═══ */}
      <section id="demo" className="relative py-32">
        <div className="section-divider mx-auto max-w-3xl mb-20" />

        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500 mb-5">
              <Eye className="w-3 h-3" /> Preview
            </div>
            <h2 className="text-gradient text-3xl sm:text-4xl font-bold tracking-tight">
              See your audit take shape
            </h2>
            <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
              Here&apos;s what a real FairLens report looks like — live metrics,
              AI analysis, and remediation steps.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative rounded-3xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="ml-4 flex-1 h-6 rounded-lg bg-white/[0.03] flex items-center px-3">
                  <span className="text-[11px] text-neutral-600 font-mono">localhost:3000/dashboard</span>
                </div>
              </div>

              {/* App content mock */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Metrics */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Bias Report</div>
                      <div className="text-xs text-neutral-600">hiring_data_2024.csv</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ProgressBar label="Disparate Impact" value={82} status="pass" delay={0.3} />
                    <ProgressBar label="Demographic Parity" value={64} status="warn" delay={0.5} />
                    <ProgressBar label="Equalized Odds" value={91} status="pass" delay={0.7} />
                    <ProgressBar label="Statistical Parity" value={38} status="fail" delay={0.9} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Records", value: "12,847" },
                      { label: "Columns", value: "24" },
                      { label: "Protected", value: "3" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
                        <div className="text-lg font-semibold text-white">{s.value}</div>
                        <div className="text-[10px] text-neutral-600 uppercase tracking-wider mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: AI output */}
                <div className="rounded-2xl border border-white/[0.04] bg-[#080808] p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-medium">AI Analysis — GLM 5.1</span>
                    <span className="ml-auto text-emerald-500/80 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
                    <p>
                      The <span className="text-white font-medium">gender</span> attribute shows a
                      statistically significant disparity in selection rates{" "}
                      <span className="text-white font-medium">(p &lt; 0.01)</span>.
                    </p>
                    <p>
                      Male applicants are{" "}
                      <span className="text-white font-medium">1.22×</span> more
                      likely to be selected compared to female applicants. The
                      disparate impact ratio of{" "}
                      <span className="text-white font-medium">0.82</span> passes
                      the 4/5ths rule threshold but warrants monitoring.
                    </p>
                    <p className="text-neutral-500 text-xs pt-2 border-t border-white/[0.04]">
                      Recommended: Apply reweighing preprocessing to equalize
                      selection rates before model training.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background glow behind demo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[400px] rounded-full blur-[150px] opacity-30" style={{ background: "radial-gradient(circle, rgba(168,130,255,0.15), transparent 70%)" }} />
          </Reveal>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative py-32">
        <div className="section-divider mx-auto max-w-3xl mb-20" />

        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Fairness Metrics", value: 15, suffix: "+" },
              { label: "Datasets Audited", value: 2400, suffix: "+" },
              { label: "Violations Caught", value: 18000, suffix: "+" },
              { label: "Avg Response", value: 3, suffix: "s" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 text-center hover:border-white/[0.1] transition-colors">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-neutral-600 mt-2 uppercase tracking-wider">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-32">
        <div className="section-divider mx-auto max-w-3xl mb-20" />

        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="relative rounded-3xl border border-white/[0.06] bg-[#0a0a0a] px-8 py-16 md:px-16 text-center overflow-hidden">
              <FloatingOrb size={400} x="50%" y="-20%" color="rgba(168,130,255,0.06)" />

              <h2 className="text-gradient text-3xl md:text-4xl font-bold tracking-tight">
                Ready to ship fair AI?
              </h2>
              <p className="mt-4 text-neutral-400 max-w-md mx-auto">
                Free tier includes 50 audits per month. No credit card, no
                setup friction.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                {!userId ? (
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group h-12 px-7 rounded-xl bg-white font-semibold text-black text-sm flex items-center gap-2"
                    >
                      Get Started Free
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </motion.button>
                  </SignInButton>
                ) : (
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group h-12 px-7 rounded-xl bg-white font-semibold text-black text-sm flex items-center gap-2"
                    >
                      Open Dashboard
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-600" />
            <span className="text-sm text-neutral-500">FairLens</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-700">
            <span>© 2026</span>
            <span>Privacy</span>
            <span>Terms</span>
            <Link href="/sandbox" className="hover:text-neutral-400 transition-colors">Components</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
