"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  BarChart3,
  Zap,
  Upload,
  Search,
  FileText,
  Globe,
  ArrowRight,
  AlertTriangle,
  Terminal,
  Activity,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ─────────── sub-components ─────────── */

function FloatingOrb({ size, x, y, color, delay }: { size: number; x: string; y: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: "blur(80px)" }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

function Beam() {
  return (
    <motion.div
      className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-[600px]"
      style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)" }}
      animate={{ opacity: [0, 0.6, 0], y: [-200, 400] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function BentoCard({ children, className = "", span = false }: { children: React.ReactNode; className?: string; span?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-6 backdrop-blur-xl ${span ? "md:col-span-2" : ""} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent group-hover:translate-x-full transition-transform duration-[1200ms]" />
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
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
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─────────── main ─────────── */

export function AnimatedLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.96]);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [session, setSession] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 20);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Typewriter
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const fullLines = [
    "$ fairlens audit hiring_data.csv",
    "→ Detected columns: gender, race, age",
    "→ Computing disparate_impact...",
    "✓ DI ratio: 0.82 (PASS)",
    "→ Computing demographic_parity...",
    "⚠ DP difference: -0.18 (WARN)",
    "→ Streaming AI explanation...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalLines((prev) => {
        if (prev.length >= fullLines.length) {
          clearInterval(timer);
          return prev;
        }
        return [...prev, fullLines[prev.length]];
      });
    }, 600);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#050505]">
      {/* ══════════ NAVBAR ══════════ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-[#050505]/60 backdrop-blur-xl"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white/80" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">FairLens</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[{ label: "Features", id: "features" }, { label: "How It Works", id: "how-it-works" }, { label: "Live Demo", id: "demo" }].map((item) => (
            <a key={item.id} href={`#${item.id}`} className="text-sm text-neutral-400 hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
        </div>
        {!session ? (
          <button
            onClick={handleLogin}
            className="px-5 py-2 text-sm font-medium rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Sign In
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="px-5 py-2 text-sm font-medium rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Dashboard →
          </Link>
        )}
      </motion.nav>

      {/* ══════════ HERO ══════════ */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Grid background */}
        <div className="absolute inset-0 grid-pattern radial-mask" />

        {/* Orbs */}
        <FloatingOrb size={800} x="20%" y="-10%" color="rgba(168,130,255,0.08)" delay={0} />
        <FloatingOrb size={600} x="70%" y="60%" color="rgba(56,189,248,0.06)" delay={2} />
        <FloatingOrb size={500} x="-5%" y="70%" color="rgba(255,255,255,0.04)" delay={4} />
        <Beam />

        {/* Particles — deterministic positions */}
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
              transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto" style={{ transform: `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)` }}>
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-8 text-sm text-neutral-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Powered by AIF360 Math Engine
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.03em] leading-[1.05] text-gradient pb-4"
          >
            Your AI has blind spots.
            <br />
            We find them.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-400 leading-relaxed"
          >
            Upload a dataset. Get 15+ fairness metrics in seconds. Stream plain-English explanations of every bias pattern — no statistics degree required.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-4 mt-10">
            {!session ? (
              <button
                onClick={handleLogin}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all"
              >
                Start Free Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link href="/dashboard" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all">
                Open Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <a href="#demo" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-medium text-base hover:bg-white/[0.06] transition-all backdrop-blur-xl">
              See Live Demo
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs text-neutral-500">
            {["AIF360 Engine", "15+ Metrics", "SOC2 Architecture", "Zero Data Retention"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating glass cards */}
        <motion.div
          className="hidden xl:block absolute left-4 2xl:left-12 top-[8%] w-64 z-0"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ transform: `translate(${mouseX * -0.5}px, ${mouseY * -0.5}px)` }}
        >
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Activity className="w-3.5 h-3.5" /> Live Bias Scan
            </div>
            {[
              { label: "Disparate Impact", value: 82, color: "bg-green-500" },
              { label: "Demographic Parity", value: 64, color: "bg-yellow-500" },
              { label: "Equalized Odds", value: 91, color: "bg-green-500" },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${m.color}`} />{m.label}
                  </span>
                  <span className="text-neutral-300">{m.value}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${m.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hidden xl:block absolute right-4 2xl:right-12 bottom-[12%] w-60 z-0"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
          style={{ transform: `translate(${mouseX * 0.4}px, ${mouseY * 0.4}px)` }}
        >
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> Warning
              </span>
              <span className="text-yellow-400 text-[10px]">HIGH</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Gender attribute shows <span className="text-white font-medium">1.22×</span> selection disparity.
            </p>
          </div>
        </motion.div>
      </motion.section>

      <div className="section-divider" />

      {/* ══════════ FEATURES BENTO ══════════ */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-6 text-sm text-neutral-400">
              <Shield className="w-3.5 h-3.5" /> CAPABILITIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">Everything you need to audit AI</h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              From statistical testing to natural-language explanations — one integrated platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Multi-Metric Dashboard — wide */}
            <BentoCard span>
              <div className="flex items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white/60" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Multi-Metric Dashboard</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">15+ fairness metrics computed simultaneously. Disparate Impact, Demographic Parity, Equalized Odds — all visualized in real-time glass panels.</p>
                </div>
                <div className="hidden md:block w-48 space-y-2 pt-2">
                  {[
                    { l: "Disparate Impact", v: 82, c: "bg-green-500" },
                    { l: "Demographic Parity", v: 64, c: "bg-yellow-500" },
                    { l: "Equalized Odds", v: 91, c: "bg-green-500" },
                    { l: "Statistical Parity", v: 38, c: "bg-red-500" },
                    { l: "Treatment Equality", v: 76, c: "bg-yellow-500" },
                  ].map((m) => (
                    <div key={m.l} className="space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-neutral-600 flex items-center gap-1">
                          <span className={`w-1 h-1 rounded-full ${m.c}`} />{m.l}
                        </span>
                        <span className="text-neutral-400">{m.v}%</span>
                      </div>
                      <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className={`h-full ${m.c} rounded-full`} initial={{ width: 0 }} whileInView={{ width: `${m.v}%` }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Adverse Impact */}
            <BentoCard>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Adverse Impact Detection</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Automatically flag selection rates that violate the 4/5ths rule across every protected attribute (gender, race, age) — zero configuration.</p>
            </BentoCard>

            {/* AI Explainability */}
            <BentoCard>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Explainability</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-3">The analysis engine streams plain-English explanations of every bias pattern detected.</p>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-neutral-400 italic">
                &quot;The gender attribute shows a statistically significant disparity in selection rates (p &lt; 0.01).&quot;
              </div>
            </BentoCard>

            {/* CSV Drop */}
            <BentoCard>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Upload className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">CSV Drop & Go</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Drag-and-drop any CSV. Auto-detects protected attributes (gender, race, age) — zero configuration.</p>
            </BentoCard>

            {/* Real-Time Streaming — wide */}
            <BentoCard span>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-white/60" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-Time Streaming</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">Watch results stream as they compute. No batch processing, no waiting. Your audit unfolds live.</p>
                </div>
                <div className="hidden md:block w-56 rounded-lg border border-white/5 bg-[#0a0a0a] p-3 font-mono text-[11px]">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/10" />
                      <span className="w-2 h-2 rounded-full bg-white/10" />
                      <span className="w-2 h-2 rounded-full bg-white/10" />
                    </div>
                    <span className="text-neutral-600 text-[9px]">fairlens audit</span>
                  </div>
                  {terminalLines.filter(Boolean).map((line, i) => (
                    <div key={i} className="flex gap-2 leading-relaxed">
                      <span className="text-neutral-600 select-none w-4 text-right">{String(i + 1).padStart(2, "0")}</span>
                      <span className={line?.includes("✓") ? "text-green-400" : line?.includes("⚠") ? "text-yellow-400" : "text-neutral-400"}>
                        {line}
                      </span>
                    </div>
                  ))}
                  <motion.span className="inline-block w-1.5 h-3 bg-white/40 ml-6" animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">Three steps to fair AI</h2>
            <p className="mt-4 text-lg text-neutral-400">No configuration. No PhD required.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "Upload", desc: "Drag-and-drop your CSV. We auto-detect every column, protected attribute, and label.", step: "01" },
              { icon: Search, title: "Analyze", desc: "AIF360 runs 15+ fairness metrics in parallel. Results stream as they compute.", step: "02" },
              { icon: FileText, title: "Understand", desc: "GLM 5.1 produces a plain-English executive summary of every finding.", step: "03" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/60 p-8 backdrop-blur-xl"
              >
                <span className="absolute top-4 right-4 text-6xl font-bold text-white/[0.03] select-none">{s.step}</span>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <s.icon className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════ LIVE DEMO ══════════ */}
      <section id="demo" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">See it in action</h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">Here&apos;s what a real FairLens report looks like — live metrics, AI analysis, and remediation steps.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-neutral-500 font-mono">
                  localhost:3000/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8 grid md:grid-cols-5 gap-6">
              {/* Left: Metrics */}
              <div className="md:col-span-3 space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Bias Report</div>
                    <div className="text-xs text-neutral-500">hiring_data_2024.csv</div>
                  </div>
                </div>

                {[
                  { label: "Disparate Impact", value: 82, color: "bg-green-500" },
                  { label: "Demographic Parity", value: 64, color: "bg-yellow-500" },
                  { label: "Equalized Odds", value: 91, color: "bg-green-500" },
                  { label: "Statistical Parity", value: 38, color: "bg-red-500" },
                ].map((m) => (
                  <div key={m.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${m.color}`} />{m.label}
                      </span>
                      <span className="text-neutral-200 font-medium">{m.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div className={`h-full ${m.color} rounded-full`} initial={{ width: 0 }} whileInView={{ width: `${m.value}%` }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-3 pt-3">
                  {[
                    { label: "RECORDS", value: "12,847" },
                    { label: "COLUMNS", value: "24" },
                    { label: "PROTECTED", value: "3" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[10px] tracking-wider text-neutral-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: AI Analysis */}
              <div className="md:col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Sparkles className="w-4 h-4" /> AI Analysis — GLM 5.1
                  </div>
                  <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
                  </span>
                </div>
                <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
                  <p>The <strong className="text-white">gender</strong> attribute shows a statistically significant disparity in selection rates (<strong className="text-white">p &lt; 0.01</strong>).</p>
                  <p>Male applicants are <strong className="text-white">1.22×</strong> more likely to be selected compared to female applicants. The disparate impact ratio of <strong className="text-white">0.82</strong> passes the 4/5ths rule threshold but warrants monitoring.</p>
                  <p className="text-neutral-500 text-xs">Recommended: Apply reweighing preprocessing to equalize selection rates before model training.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════ STATS ══════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 15, suffix: "+", label: "Fairness Metrics" },
            { value: 2400, suffix: "+", label: "Datasets Audited" },
            { value: 18000, suffix: "+", label: "Violations Caught" },
            { value: 3, suffix: "s", label: "Avg. Audit Time" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm text-neutral-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════ CTA ══════════ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-white/[0.06] bg-[#0a0a0a]/80 p-12 md:p-16 text-center overflow-hidden"
          >
            <FloatingOrb size={400} x="50%" y="50%" color="rgba(168,130,255,0.06)" delay={0} />
            <h2 className="relative text-3xl md:text-5xl font-bold tracking-tight text-gradient mb-4">Ready to ship fair AI?</h2>
            <p className="relative text-neutral-400 mb-8">Free tier includes 50 audits per month. No credit card, no setup friction.</p>
            <div className="relative flex flex-wrap justify-center gap-4">
              {!session ? (
                <button
                  onClick={handleLogin}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all"
                >
                  Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <Link href="/dashboard" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all">
                  Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Globe className="w-4 h-4" /> FairLens
          </div>
          <div className="text-xs text-neutral-600">
            © {new Date().getFullYear()} FairLens. Built for responsible AI.
          </div>
          <div className="flex gap-6 text-xs text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://github.com/AravindBarfa20/Fairlens" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
