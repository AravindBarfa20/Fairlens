// frontend/components/ui/GlassCard.tsx
"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0, ...props }: GlassCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 glass-card text-contrast-primary",
        className
      )}
      {...props}
    >
      {/* Inner highlight to give glass thickness */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
